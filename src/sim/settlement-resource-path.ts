import type {LonLat,SettlementDispersion} from '../data/types';
import {haversineKm} from '../util/geo';

interface ResourceGraph {points:LonLat[];edges:[number,number][];adj:Map<number,number>[];ids:Map<string,number>;routes:Map<string,LonLat[]>;bins:Map<string,number[]>}
const graphs=new WeakMap<SettlementDispersion,ResourceGraph>();
const key=(point:LonLat)=>point.map(value=>value.toFixed(6)).join(',');
const longitudeDelta=(a:number,b:number)=>((b-a+540)%360)-180;
const binSize=.5,binColumns=360/binSize;
const binKey=(x:number,y:number)=>`${((x%binColumns)+binColumns)%binColumns}:${y}`;
function graphFor(dispersion:SettlementDispersion):ResourceGraph {
  const cached=graphs.get(dispersion);if(cached)return cached;
  const graph:ResourceGraph={points:[],edges:[],adj:[],ids:new Map(),routes:new Map(),bins:new Map()};
  const node=(point:LonLat)=>{const id=graph.ids.get(key(point));if(id!==undefined)return id;const next=graph.points.length;graph.ids.set(key(point),next);graph.points.push(point);graph.adj.push(new Map());return next;};
  for(const path of dispersion.paths)for(let index=1;index<path.length;index++){
    const a=node(path[index-1]),b=node(path[index]);if(a===b||graph.adj[a].has(b))continue;
    const distance=haversineKm(graph.points[a],graph.points[b]);if(!Number.isFinite(distance))continue;
    graph.adj[a].set(b,distance);graph.adj[b].set(a,distance);const edge=graph.edges.length;graph.edges.push([a,b]);
    const from=graph.points[a],to=graph.points[b],other=from[0]+longitudeDelta(from[0],to[0]);
    for(let x=Math.floor((Math.min(from[0],other)+180)/binSize);x<=Math.floor((Math.max(from[0],other)+180)/binSize);x++)
      for(let y=Math.floor((Math.min(from[1],to[1])+90)/binSize);y<=Math.floor((Math.max(from[1],to[1])+90)/binSize);y++){
        const id=binKey(x,y),entries=graph.bins.get(id)??[];entries.push(edge);graph.bins.set(id,entries);
      }
  }
  graphs.set(dispersion,graph);return graph;
}
function projection(point:LonLat,a:LonLat,b:LonLat):LonLat {
  const cos=Math.cos(point[1]*Math.PI/180),dx=longitudeDelta(a[0],b[0]),dy=b[1]-a[1],x=longitudeDelta(a[0],point[0]),y=point[1]-a[1];
  const fraction=Math.max(0,Math.min(1,(x*dx*cos*cos+y*dy)/(dx*dx*cos*cos+dy*dy||1)));
  let longitude=a[0]+dx*fraction;if(longitude>180)longitude-=360;if(longitude< -180)longitude+=360;
  return[longitude,a[1]+dy*fraction];
}
/** Connect an exact current local position to a prepared mature resource point.
 * Edges are supplied geography, traversable both ways; no gap is bridged with
 * an invented straight chord. A null path keeps people local for the audit. */
export function settlementResourcePath(dispersion:SettlementDispersion,from:LonLat,to:LonLat):LonLat[]|null {
  const graph=graphFor(dispersion),target=graph.ids.get(key(to));if(target===undefined)return null;
  const source=graph.ids.get(key(from)),cacheKey=source===undefined?`p:${from.map(value=>value.toFixed(9)).join(',')}:${target}`:`${source}:${target}`;
  if(graph.routes.has(cacheKey))return[from,...graph.routes.get(cacheKey)!.slice(1)];
  let projected=from,initial:[number,number][]=[];
  if(source!==undefined)initial=[[source,0]];
  else{
    let best=Infinity,edge:[number,number]|undefined;
    const x=Math.floor((from[0]+180)/binSize),y=Math.floor((from[1]+90)/binSize),nearby=new Set<number>();
    for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(const id of graph.bins.get(binKey(x+dx,y+dy))??[])nearby.add(id);
    // Any acceptable50m projection lies inside these cells. Include long
    // segments in every crossed cell; never truncate or alter the actual edge.
    for(const id of [...nearby].sort((a,b)=>a-b)){const pair=graph.edges[id],point=projection(from,graph.points[pair[0]],graph.points[pair[1]]),distance=haversineKm(from,point);if(distance<best){best=distance;edge=pair;projected=point;}}
    // Current positions computed on these paths project within floating-point
    // tolerance. Larger mismatches indicate missing prepared geography.
    if(!edge||best>.05)return null;
    initial=edge.map(id=>[id,haversineKm(projected,graph.points[id])]);
  }
  const distance=new Float64Array(graph.points.length).fill(Infinity),previous=new Int32Array(graph.points.length).fill(-1),heap:[number,number][]=[];
  const push=(id:number,value:number)=>{let index=heap.length;heap.push([id,value]);while(index){const parent=(index-1)>>1;if(heap[parent][1]<=value)break;heap[index]=heap[parent];index=parent;}heap[index]=[id,value];};
  const pop=()=>{const first=heap[0],last=heap.pop()!;if(heap.length){let index=0;while(index*2+1<heap.length){let child=index*2+1;if(child+1<heap.length&&heap[child+1][1]<heap[child][1])child++;if(heap[child][1]>=last[1])break;heap[index]=heap[child];index=child;}heap[index]=last;}return first;};
  for(const [id,value]of initial){distance[id]=value;push(id,value);}
  while(heap.length){const [id,value]=pop();if(value!==distance[id])continue;if(id===target)break;
    for(const [next,cost]of graph.adj[id]){const candidate=value+cost;if(candidate>=distance[next])continue;distance[next]=candidate;previous[next]=id;push(next,candidate);}
  }
  if(!Number.isFinite(distance[target]))return null;
  const nodes:number[]=[];for(let id=target;id>=0;id=previous[id])nodes.push(id);nodes.reverse();
  const result:LonLat[]=[from];
  for(const point of [projected,...nodes.map(id=>graph.points[id]),to])if(haversineKm(result.at(-1)!,point)>.000001)result.push(point);
  if(result.length===1)result.push(to);
  if(graph.routes.size>=10000)graph.routes.delete(graph.routes.keys().next().value!);
  graph.routes.set(cacheKey,result);
  return result;
}
