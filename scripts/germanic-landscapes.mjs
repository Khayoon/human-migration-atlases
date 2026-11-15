/**
 * Local cartographic placement only. Population, dates and research evidence
 * are deliberately absent from this module's output contract.
 */
import { readFileSync } from 'node:fs';
import { distanceKm, useGlobalLandMask } from './route-landmask.mjs';

export const GERMANIC_LANDSCAPE_BASIS = 'Irregular geographic display reconstruction follows retained Natural Earth river-valley and coastal approaches, supplemented by explicitly reconstructed lowland/foothill/settled-water-access guide belts. Variable widths and connected branches replace radial clouds. Samples stay on present land, outside selected coarse wetland/delta cores and off the central river channel. This is a habitable-area proxy, not a DEM, climate/wetland inventory, surveyed historic settlement boundary, resident census or claim that a named group occupied every point. Widths, guide belts and exclusions are display assumptions; people totals and chronology are unchanged.';
export const GERMANIC_LANDSCAPE_SOURCES = [
  { title:'Retained Natural Earth 1:10m land polygons',url:'https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/',note:'Present land and shoreline guide; not reconstructed historical coastlines.' },
  { title:'Retained Natural Earth 1:10m rivers and lake centerlines',url:'https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/',note:'River-valley geometry only. Local guide widths and habitable-area assumptions are reconstructed.' },
];
const DEG=Math.PI/180, KM=111.195;
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
let worldwidePolygons;
function globalPolygons(){
 if(!worldwidePolygons)worldwidePolygons=read('../data/geography/natural-earth-land.source.geojson').features.flatMap(f=>f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates]);
 return worldwidePolygons;
}
/** The older Arab-preparation mask has a regional selection envelope. The
 * Germanic diaspora needs the retained full worldwide geometry, including
 * Atlantic islands, the Americas and Greenland. No network fetch is needed. */
export function isGermanicLand(coord){return useGlobalLandMask().isLand(coord);}
const within=(p,b)=>p[0]>=b[0]&&p[0]<=b[2]&&p[1]>=b[1]&&p[1]<=b[3];
const bounds=points=>points.reduce((b,p)=>[Math.min(b[0],p[0]),Math.min(b[1],p[1]),Math.max(b[2],p[0]),Math.max(b[3],p[1])],[Infinity,Infinity,-Infinity,-Infinity]);
function randomFor(seed){let h=2166136261;for(const c of String(seed))h=Math.imul(h^c.codePointAt(0),16777619)>>>0;return()=>{h=(h+0x6d2b79f5)>>>0;let v=Math.imul(h^(h>>>15),1|h);v^=v+Math.imul(v^(v>>>7),61|v);return((v^(v>>>14))>>>0)/4294967296;};}
function contains(p,ring){let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}

// Conservative cores only, not whole valleys or blanket exclusions of a
// people. They prevent a resource ribbon being mistaken for wetland habitat.
// These coarse reconstruction masks are intentionally separate from sources.
const wetlandCores=[
  {name:'Lower Danube delta core',ring:[[28.9,45.1],[29.25,45.5],[29.7,45.48],[29.85,45.2],[29.55,44.95],[29.1,44.95],[28.9,45.1]]},
  {name:'Central Pripyat marsh core',ring:[[25.3,51.65],[26.2,52.05],[28,52.15],[28.5,51.8],[27.5,51.45],[26,51.4],[25.3,51.65]]},
  {name:'Vasyugan swamp core',ring:[[75,56.9],[77.3,58],[81.8,58.7],[83.8,57.8],[82,56.7],[78,56.5],[75,56.9]]},
  {name:'Lower Ob marsh core',ring:[[67,61.5],[69,63.8],[73.4,65.5],[74,63.8],[71,61.4],[67,61.5]]},
  {name:'Volga delta core',ring:[[47.6,45.95],[48.1,46.25],[49,46.35],[49.1,45.5],[48.2,45.3],[47.6,45.95]]},
  {name:'Northern Pantanal core',ring:[[-57.7,-16],[-56,-16],[-55.5,-17.8],[-56.6,-18.8],[-58,-18],[-57.7,-16]]},
  {name:'Iberá marsh core',ring:[[-58,-27.8],[-57,-27.7],[-56.7,-28.6],[-57.3,-29.1],[-58,-28.7],[-58,-27.8]]},
  {name:'Eastern Chaco seasonal wetland core',ring:[[-59,-22.7],[-58.1,-23],[-57.7,-24.4],[-58.5,-24.6],[-59.2,-23.7],[-59,-22.7]]},
];
export function isGermanicWetlandCore(coord){return wetlandCores.some(w=>contains(coord,w.ring));}

// Broad approach belts cover small valleys, terrace systems and water access
// absent from the coarse global hydrography. They are inferred display guides,
// never additional historical settlements or terrain-survey evidence.
const guides=[
 ['Carpathian foothill valleys',[[17,49.1],[18.1,49.3],[19.2,49.1],[20.6,49.05],[21.1,48.8]]],
 ['Transylvanian interior basins',[[22.8,46.1],[23.5,46],[24.1,45.85],[24.7,45.85],[25.6,45.65]]],
 ['Transylvanian northern foothills',[[23.5,47],[24.5,47.1],[25.2,46.9]]],
 ['Carinthian valley approaches',[[12.5,46.75],[13.1,46.85],[13.8,46.65],[14.4,46.45],[14.9,45.75]]],
 ['Sathmar plain margins',[[21.8,47.5],[22.4,47.7],[22.9,47.8],[23.4,47.7]]],
 ['North Caucasus foothill plains',[[39.5,45],[41,44.9],[42.8,44.7],[44.2,44.4],[45.5,43.7]]],
 ['Georgian lower foothill approaches',[[43.6,41.7],[44.2,41.5],[44.9,41.7],[45.5,41.5],[46.3,40.7]]],
 ['Talas cultivated valley',[[70.5,42.6],[71.3,42.85],[71.9,42.8],[72.5,42.6]]],
 ['Khiva oasis margins',[[60.1,41.3],[60.4,41.45],[60.8,41.5],[61.2,41.7]]],
 ['Tajik foothill valley',[[68.1,38.3],[68.8,38.55],[69.4,38.65],[69.8,38.4]]],
 ['Kazakh northern farm belt',[[68.3,53.2],[69.5,53.7],[70.2,53.8],[71.1,53.4]]],
 ['Ishim–Akmola lowland approaches',[[69.6,51],[70.4,51.2],[71.4,51.2],[72.2,51.5]]],
 ['Altai western lowland approaches',[[76.8,53.3],[77.7,53.2],[78.7,53],[79.5,53.4]]],
 ['Dry Chaco settled terrace approach',[[ -61.1,-22.8],[-60.65,-22.65],[-60,-22.3],[-59.7,-22.15]]],
 ['Chihuahua piedmont farm belt',[[-106.9,28.8],[-106.5,28.7],[-106,28.6],[-105.7,28.3]]],
 ['Southern Brazilian foothill lowlands',[[-52.4,-29.6],[-51.8,-29.7],[-51.1,-29.8],[-50.5,-29.4]]],
 ['Entre Ríos interfluve settlements',[[-60.8,-31.9],[-60.45,-31.7],[-60,-31.9],[-59.6,-32.2]]],
 ['Chilean southern valley',[[-73.2,-38.8],[-72.9,-39.5],[-73.1,-40.2],[-72.9,-40.8]]],
 ['Tovar coastal foothill belt',[[-67.8,10.35],[-67.3,10.4],[-66.9,10.3]]],
 ['Namibian central highland water approaches',[[16.5,-22],[16.9,-22.35],[17.1,-22.6],[17.3,-23],[17.2,-23.5]]],
 ['Eastern Cape foothill valleys',[[26.3,-32.1],[26.8,-32.5],[27.4,-32.7],[27.9,-32.9]]],
 ['Adelaide–Barossa foothill belt',[[138.7,-35.1],[138.85,-34.85],[138.95,-34.55],[139.05,-34.3],[139.2,-34.05]]],
 ['Sydney coastal foothill approaches',[[150.7,-34.1],[151,-33.8],[151.1,-33.45],[151.2,-33.1]]],
 ['Greenland southern fjord margins',[[-46.3,60.7],[-45.8,60.9],[-45.5,61],[-45.2,61.15]]],
 ['Iceland southwestern coastal lowlands',[[-22.5,64],[-21.9,64.1],[-21.5,64.15],[-21.1,63.95]]],
 ['Manitoba prairie terrace belt',[[-99,49.5],[-98.5,49.65],[-98,49.75],[-97.4,49.5]]],
];

function clip(a,b,box){let lo=0,hi=1;for(const[p,q]of[[a[0]-b[0],a[0]-box[0]],[b[0]-a[0],box[2]-a[0]],[a[1]-b[1],a[1]-box[1]],[b[1]-a[1],box[3]-a[1]]]){if(Math.abs(p)<1e-12){if(q<0)return null;continue;}const t=q/p;if(p<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>hi)return null;}return[[a[0]+(b[0]-a[0])*lo,a[1]+(b[1]-a[1])*lo],[a[0]+(b[0]-a[0])*hi,a[1]+(b[1]-a[1])*hi]];}
let index;
function getIndex(){
 if(index)return index;
 const segments=[],bins=new Map();
 const addLine=(line,kind,label='')=>{for(let i=1;i<line.length;i++){
  const a=line[i-1].slice(0,2),b=line[i].slice(0,2);if(Math.abs(a[0]-b[0])>180||distanceKm(a,b)<.05)continue;
  const id=segments.length;segments.push({a,b,kind,label});const box=bounds([a,b]);
  for(let x=Math.floor(box[0]);x<=Math.floor(box[2]);x++)for(let y=Math.floor(box[1]);y<=Math.floor(box[3]);y++){const key=`${x}:${y}`;if(!bins.has(key))bins.set(key,[]);bins.get(key).push(id);}
 }};
 for(const polygon of globalPolygons())for(const ring of polygon)addLine(ring,'coast');
 for(const f of read('../data/geography/natural-earth-rivers.source.geojson').features){
  if(f.properties.featurecla==='Lake Centerline')continue;
  for(const line of f.geometry.type==='MultiLineString'?f.geometry.coordinates:[f.geometry.coordinates])addLine(line,'river',f.properties.name??'');
 }
 for(const[name,line]of guides)addLine(line,'approach',name);
 index=box=>{const ids=new Set();for(let x=Math.floor(box[0]);x<=Math.floor(box[2]);x++)for(let y=Math.floor(box[1]);y<=Math.floor(box[3]);y++)for(const id of bins.get(`${x}:${y}`)??[])ids.add(id);return[...ids].sort((a,b)=>a-b).flatMap(id=>{const s=segments[id],pair=clip(s.a,s.b,box);return pair?[{...s,a:pair[0],b:pair[1]}]:[];});};
 return index;
}
const cache=new Map();
/** Return an exact candidate count with a stable deterministic prefix.
 * radiusKm is an approximate search scale, never a circular clipping mask.
 */
export function sampleGermanicLandscape({coord,radiusKm=90,count=384,seed='germanic-landscape',name='',group=''}){
 if(!Array.isArray(coord)||coord.length!==2||!coord.every(Number.isFinite)||coord[1]<-85||coord[1]>85)throw new TypeError('Finite [longitude,latitude] within85° is required.');
 if(!Number.isFinite(radiusKm)||radiusKm<=0||radiusKm>1500)throw new RangeError('Landscape scale must be between0and1500km.');
 if(!Number.isInteger(count)||count<0||count>10000)throw new RangeError('Landscape candidate count must be an integer0–10000.');
 if(count===0)return[];
 const key=JSON.stringify([coord,radiusKm,String(seed),name,group]);
 const stored=cache.get(key);if(stored?.length>=count)return stored.slice(0,count).map(p=>[...p]);
 const random=randomFor(`${key}:resource-areas-v1`),cos=Math.max(.12,Math.cos(coord[1]*DEG)),dx=radiusKm*1.25/(KM*cos),dy=radiusKm*.95/KM;
 const box=[coord[0]-dx,coord[1]-dy,coord[0]+dx,coord[1]+dy];
 const options=getIndex()(box).filter(s=>distanceKm(s.a,s.b)>.08).map(s=>{
  const midpoint=[(s.a[0]+s.b[0])/2,(s.a[1]+s.b[1])/2];
  const near=Math.exp(-distanceKm(midpoint,coord)/(radiusKm*1.2));
  return{...s,weight:distanceKm(s.a,s.b)*(s.kind==='river'?3:s.kind==='approach'?2:.8)*near};
 });
 if(!options.length){
  // Missing coarse hydrography is declared as an inferred local approach. Its
  // bent ribbon avoids inventing a round occupied region or a source river.
  const sx=dx*.75,sy=dy*.42;
  for(const[a,b]of[[[coord[0]-sx,coord[1]-sy],[coord[0]-.1*sx,coord[1]+.2*sy]],[[coord[0]-.1*sx,coord[1]+.2*sy],[coord[0]+sx,coord[1]+.7*sy]]])options.push({a,b,kind:'inferred-approach',label:'Unsurveyed local approach display proxy',weight:distanceKm(a,b)});
 }
 const total=options.reduce((n,s)=>n+s.weight,0),points=[],seen=new Set();
 const baseWidth=Math.max(1.2,Math.min(26,radiusKm*.2));
 for(let attempts=0;attempts<Math.max(15000,count*300)&&points.length<count;attempts++){
  let pick=random()*total,s=options.at(-1);for(const candidate of options){pick-=candidate.weight;if(pick<=0){s=candidate;break;}}
  const t=random(),lat=s.a[1]+(s.b[1]-s.a[1])*t,clat=Math.max(.12,Math.cos(lat*DEG));
  const vx=(s.b[0]-s.a[0])*clat,vy=s.b[1]-s.a[1],length=Math.hypot(vx,vy)||1;
  const variable=.45+.55*(.5+.5*Math.sin(t*13+s.a[0]*3+s.a[1]*2))*(.6+.4*Math.cos(t*7+s.b[1])**2);
  const width=baseWidth*variable*(s.kind==='coast'?.45:s.kind==='river'?.8:1.1);
  // Reserve the central channel and immediate wet edge. Offsets describe
  // adjacent terraces/lowland approaches, not settlement in open channels.
  const minimum=s.kind==='river'?1.1:s.kind==='coast'?.45:0;
  const cross=(random()<.5?-1:1)*(minimum+(random()+random())*.5*width);
  const p=[s.a[0]+(s.b[0]-s.a[0])*t-vy/length*cross/(KM*clat),lat+vx/length*cross/KM];
  if(!isGermanicLand(p)||isGermanicWetlandCore(p))continue;
  // Soft distance taper has no circular edge; source feature geometry defines
  // the shape. A point beyond a reference radius is permitted on its resource.
  if(random()>Math.exp(-Math.max(0,distanceKm(p,coord)-radiusKm*.5)/(radiusKm*1.2)))continue;
  const q=p.map(v=>+v.toFixed(7)),id=q.join(':');if(seen.has(id))continue;seen.add(id);points.push(q);
 }
 if(points.length<count)throw new Error(`Only${points.length}/${count} permitted irregular resource placements for${name||seed} at${coord}; refine the geographic guide instead of substituting a radial cloud.`);
 cache.set(key,points);return points.map(p=>[...p]);
}
