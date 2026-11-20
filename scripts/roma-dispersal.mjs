/** Geographic display paths, separate from population and historical evidence. */
import {createHash} from 'node:crypto';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {landCorridor} from './land-corridor.mjs';
import {distanceKm,isLand,interpolateGreatCircle,segmentWaterStats,useGlobalLandMask} from './route-landmask.mjs';

const VERSION=5,GRID=.05;
const same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
const key=p=>p.join(',');
const length=path=>path.slice(1).reduce((sum,p,i)=>sum+distanceKm(path[i],p),0);
const unique=path=>path.filter((p,i)=>!i||!same(p,path[i-1]));
function contains([x,y],ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
class Heap{items=[];push(v){let i=this.items.push(v)-1;while(i){const p=(i-1)>>1;if(this.items[p].score<=v.score)break;this.items[i]=this.items[p];i=p;}this.items[i]=v;}pop(){const first=this.items[0],last=this.items.pop();if(this.items.length){let i=0;while(i*2+1<this.items.length){let c=i*2+1;if(c+1<this.items.length&&this.items[c+1].score<this.items[c].score)c++;if(this.items[c].score>=last.score)break;this.items[i]=this.items[c];i=c;}this.items[i]=last;}return first;}}

/** These named overseas components already belong to the supplied atlas.
 * Crossings are explicit display shipping links, never passed off as land. */
const SEA_LINKS={
 NORDIC:[[[18.07,59.33],[20.0,60.1],[22.0,60.1],[24.9,60.2]]],
 'COLONIAL-AFRICA':[[[13.3,-8.8],[10,-4],[6.62,.22]],[[6.62,.22],[-8,5],[-23.6,15.1]]],
 BYZANTIUM:[[[28.98,41.02],[29.06,41.02]],[[26.4,40.2],[26.4,40.05]]],
 'ROMANLAR-MARMARA':[[[28.98,41.02],[29.06,41.02]],[[26.4,40.2],[26.4,40.05]]],
};

export function prepareRomaDispersal(profile,{entry,entries,years=120,growthYears=100,cache=true}={}){
 useGlobalLandMask();
 const points=profile.points;
 if(!Array.isArray(points)||!points.length)throw new Error(`${profile.id}: dispersal needs target positions`);
 const rings=[...(profile.exclusions??[]),...(profile.wetlandCores??[])].map(item=>item.polygon??item.ring??item).filter(ring=>Array.isArray(ring)&&Array.isArray(ring[0]));
 const allowed=p=>isLand(p)&&!rings.some(ring=>contains(p,ring));
 const guides=[...(profile.lines??[]),...(profile.components??[]).flatMap(component=>component.guides??[])].filter(line=>line?.length);
 const requested=entries?.length?entries:[entry??guides[0]?.[0]??points[0]];
 const signature=createHash('sha256').update(JSON.stringify({VERSION,id:profile.id,points,guides,rings,requested})).digest('hex');
 const directory=join(process.cwd(),'.atlas-runtime','roma-dispersal-cache'),file=join(directory,signature+'.json');
 if(cache&&existsSync(file)){const value=JSON.parse(readFileSync(file,'utf8'));return{...value,years,growthYears};}
 const nearestAllowed=p=>{if(allowed(p))return p;let best=null,distance=Infinity;for(const candidate of points){const d=distanceKm(p,candidate);if(d<distance&&allowed(candidate)){best=candidate;distance=d;}}if(distance<3)return best;for(const radius of [.5,1,2,4,8,12,20,35,50,80,120]){for(let i=0;i<32;i++){const angle=i*Math.PI/16,q=[p[0]+Math.cos(angle)*radius/(111.195*Math.max(.15,Math.cos(p[1]*Math.PI/180))),p[1]+Math.sin(angle)*radius/111.195];if(allowed(q))return q;}if(distance<radius)return best;}throw new Error(`${profile.id}: no local legal connector near ${p}`);};
 const root=nearestAllowed(requested[0]);
 const clearCache=new Map(),routeCache=new Map(),maritimeConnections=[];
 function clear(a,b){const cacheKey=JSON.stringify([a,b]);if(clearCache.has(cacheKey))return clearCache.get(cacheKey);let valid=true;const n=Math.max(1,Math.ceil(distanceKm(a,b)/2));for(let i=0;i<=n;i++){const p=interpolateGreatCircle(a,b,i/n);if(!isLand(p,1)||rings.some(ring=>contains(p,ring))){valid=false;break;}}clearCache.set(cacheKey,valid);return valid;}
 function legalRoute(path){return path.slice(1).every((p,i)=>clear(path[i],p));}
 function excludedDetour(a,b){
  const cell=distanceKm(a,b)<250?.01:GRID;
  const legalGrid=new Map(),coord=(x,y)=>[+(x*cell).toFixed(6),+(y*cell).toFixed(6)];
  const legal=(x,y)=>{const k=x+','+y;if(!legalGrid.has(k))legalGrid.set(k,allowed(coord(x,y)));return legalGrid.get(k);};
  const snap=p=>{const x=Math.round(p[0]/cell),y=Math.round(p[1]/cell);for(let r=0;r<12;r++){let best=null,dist=Infinity;for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++)if(Math.max(Math.abs(dx),Math.abs(dy))===r&&legal(x+dx,y+dy)){const q=coord(x+dx,y+dy),d=distanceKm(p,q);if(d<dist&&clear(p,q)){best=[x+dx,y+dy];dist=d;}}if(best)return best;}throw new Error(`${profile.id}: no legal dispersal grid entry near ${p}`);};
  const s=snap(a),t=snap(b),start=key(s),target=key(t),margin=40;
  const bounds=[Math.min(s[0],t[0])-margin,Math.min(s[1],t[1])-margin,Math.max(s[0],t[0])+margin,Math.max(s[1],t[1])+margin];
  const heuristic=(x,y)=>Math.hypot((x-t[0])*Math.cos((s[1]+t[1])*cell*Math.PI/360),y-t[1]);
  const open=new Heap(),cost=new Map([[start,0]]),parent=new Map(),closed=new Set();open.push({x:s[0],y:s[1],score:heuristic(...s)});
  while(open.items.length&&closed.size<180000){const current=open.pop(),id=current.x+','+current.y;if(closed.has(id))continue;closed.add(id);if(id===target)break;
   for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){if(!dx&&!dy)continue;const x=current.x+dx,y=current.y+dy,k=x+','+y;if(x<bounds[0]||x>bounds[2]||y<bounds[1]||y>bounds[3]||closed.has(k)||!legal(x,y)||dx&&dy&&(!legal(current.x+dx,current.y)||!legal(current.x,current.y+dy)))continue;const next=cost.get(id)+Math.hypot(dx*Math.cos(y*cell*Math.PI/180),dy);if(next>=(cost.get(k)??Infinity))continue;cost.set(k,next);parent.set(k,[x-dx,y-dy]);open.push({x,y,score:next+heuristic(x,y)});}
  }
  if(!closed.has(target))throw new Error(`${profile.id}: no land/exclusion-safe local path ${a} → ${b}`);
  const route=[coord(...t)];let current=t;while(key(current)!==start){current=parent.get(key(current));route.push(coord(...current));}route.reverse();
  const raw=unique([a,...route,b]),result=[raw[0]];let i=0;while(i<raw.length-1){let j=Math.min(raw.length-1,i+16);while(j>i+1&&!clear(raw[i],raw[j]))j--;result.push(raw[j]);i=j;}
  if(!legalRoute(result))throw new Error(`${profile.id}: illegal local detour after simplification`);return result;
 }
 function connect(a,b){const cacheKey=JSON.stringify([a,b]);if(routeCache.has(cacheKey))return routeCache.get(cacheKey);let result;
  if(clear(a,b))result=[a,b];else{try{const land=landCorridor(a,b,{maxSegmentKm:12,coastToleranceKm:1,endpointAllowanceKm:8});if(legalRoute(land))result=land;}catch{}}
  if(!result&&['NORDIC','BYZANTIUM','ROMANLAR-MARMARA'].includes(profile.id)&&distanceKm(a,b)<=250&&segmentWaterStats(a,b,3,1).waterKm>3){result=[a,b];maritimeConnections.push({basis:'Explicit reconstructed local coastal ferry/archipelago link; not an attested personal itinerary',coordinates:result});}
  if(!result)result=excludedDetour(a,b);
  result=unique(result);routeCache.set(cacheKey,result);routeCache.set(JSON.stringify([b,a]),result.toReversed());return result;
 }
 const nodes=[],index=new Map(),adj=[];
 function add(p){const k=key(p);if(index.has(k))return index.get(k);const i=nodes.length;nodes.push(p);adj.push([]);index.set(k,i);return i;}
 function edge(path){for(let i=1;i<path.length;i++){const a=add(path[i-1]),b=add(path[i]);if(a===b)continue;const weight=distanceKm(path[i-1],path[i]);if(!adj[a].some(e=>e.to===b)){adj[a].push({to:b,weight});adj[b].push({to:a,weight});}}}
 const rootIndex=add(root),pending=guides.map(line=>unique(line.map(nearestAllowed))).filter(line=>line.length);
 // Include only declared maritime links; every shore endpoint is snapped onto
 // a permitted shore position before the over-water controls are retained.
 for(const declared of SEA_LINKS[profile.id]??[]){const path=[nearestAllowed(declared[0]),...declared.slice(1,-1),nearestAllowed(declared.at(-1))];maritimeConnections.push({basis:'Explicit reconstructed regional shipping/ferry display link',coordinates:path});edge(path);}
 // Attach maritime shore networks to the same entry root on land.
 if(maritimeConnections.length){const endpoints=maritimeConnections.flatMap(link=>[link.coordinates[0],link.coordinates.at(-1)]);let nearest=endpoints[0];for(const p of endpoints)if(distanceKm(root,p)<distanceKm(root,nearest))nearest=p;edge(connect(root,nearest));}
 while(pending.length){const pairs=[];for(let g=0;g<pending.length;g++)for(let i=0;i<pending[g].length;i++)for(let j=0;j<nodes.length;j++)if(allowed(nodes[j]))pairs.push({g,i,j,d:distanceKm(pending[g][i],nodes[j])});pairs.sort((a,b)=>a.d-b.d);let selected,link;
  for(const pair of pairs.slice(0,80)){try{link=connect(nodes[pair.j],pending[pair.g][pair.i]);selected=pair;break;}catch{}}
  if(!selected)throw new Error(`${profile.id}: guide has no connected resource/shore path`);
  const line=pending.splice(selected.g,1)[0];edge(link);for(let i=1;i<line.length;i++)edge(connect(line[i-1],line[i]));
 }
 // Several explicit ferry links may start as independent components. Join
 // their shore networks over land; no unsourced sea shortcut is introduced.
 for(let pass=0;pass<maritimeConnections.length+1;pass++){
  const reached=new Set([rootIndex]),queue=[rootIndex];for(let i=0;i<queue.length;i++)for(const e of adj[queue[i]])if(!reached.has(e.to)){reached.add(e.to);queue.push(e.to);}
  if(reached.size===nodes.length)break;
  const pairs=[];for(let a=0;a<nodes.length;a++)if(reached.has(a)&&allowed(nodes[a]))for(let b=0;b<nodes.length;b++)if(!reached.has(b)&&allowed(nodes[b]))pairs.push({a,b,d:distanceKm(nodes[a],nodes[b])});pairs.sort((a,b)=>a.d-b.d);let joined=false;
  for(const pair of pairs.slice(0,30)){try{edge(connect(nodes[pair.a],nodes[pair.b]));joined=true;break;}catch{}}
  if(!joined)throw new Error(`${profile.id}: explicit maritime shore network is detached`);
 }
 const distance=nodes.map(()=>Infinity),parent=nodes.map(()=>-1),open=new Heap();distance[rootIndex]=0;open.push({id:rootIndex,score:0});
 while(open.items.length){const current=open.pop();if(current.score!==distance[current.id])continue;for(const e of adj[current.id]){const next=current.score+e.weight;if(next<distance[e.to]){distance[e.to]=next;parent[e.to]=current.id;open.push({id:e.to,score:next});}}}
 const rootPaths=new Map();function pathTo(id){if(rootPaths.has(id))return rootPaths.get(id);if(!Number.isFinite(distance[id]))throw new Error(`${profile.id}: detached resource component`);const result=[];let i=id;while(i>=0){result.push(nodes[i]);i=parent[i];}result.reverse();rootPaths.set(id,result);return result;}
 const paths=[];for(let i=0;i<points.length;i++){const target=points[i],candidates=nodes.map((p,j)=>({j,d:distanceKm(p,target)})).sort((a,b)=>a.d-b.d);let tail,chosen;
  for(const candidate of candidates.slice(0,12)){try{tail=connect(nodes[candidate.j],target);chosen=candidate.j;break;}catch{}}
  if(!tail)throw new Error(`${profile.id}: target${i} has no land/resource connection`);
  const path=unique([...pathTo(chosen),...tail.slice(1)]);if(!same(path[0],root)||!same(path.at(-1),target))throw new Error(`${profile.id}: path index${i} lost its entry or target`);paths.push(path);
 }
 const value={years,growthMode:'local-lineage',growthYears,entryPoints:points.map(()=>root),paths,basis:'Explicit local display dispersal follows connected reconstructed resource guides, present-land/coastal connectors and coarse declared terrain/wetland exclusions. Growth starts at an actual surviving local ancestor, then follows the shared network. Arrival and growth intervals are display choices, not observed individual lifetimes, migration dates or surveyed settlement routes. No missing path is replaced by a distant mature position.',...(maritimeConnections.length?{maritimeConnections}:{})};
 if(cache){mkdirSync(directory,{recursive:true});writeFileSync(file,JSON.stringify(value));}return value;
}
