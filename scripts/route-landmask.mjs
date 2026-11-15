/** Coast-aware validation against the retained Natural Earth land geometry. */
import { readFileSync } from 'node:fs';

const DEG = Math.PI/180;
const EARTH_KM = 6371;
const BIN = 0.25;
const ringBounds = ring => ring.reduce((b,p)=>[Math.min(b[0],p[0]),Math.min(b[1],p[1]),Math.max(b[2],p[0]),Math.max(b[3],p[1])],[Infinity,Infinity,-Infinity,-Infinity]);
const within = (p,b)=> p[0]>=b[0] && p[0]<=b[2] && p[1]>=b[1] && p[1]<=b[3];

function indexRing(ring) {
  const bins = new Map();
  for(let i=0,j=ring.length-1;i<ring.length;j=i++) {
    const a=ring[j], b=ring[i];
    if (a[0]===b[0] && a[1]===b[1]) continue;
    const edge=[a,b];
    for(let row=Math.floor(Math.min(a[1],b[1])/BIN);row<=Math.floor(Math.max(a[1],b[1])/BIN);row++) {
      if(!bins.has(row)) bins.set(row,[]);
      bins.get(row).push(edge);
    }
  }
  return {bbox:ringBounds(ring),bins};
}

function contains(point,ring) {
  if(!within(point,ring.bbox)) return false;
  const [x,y]=point;
  let hit=false;
  for(const [[ax,ay],[bx,by]] of ring.bins.get(Math.floor(y/BIN))??[]) {
    const cross=(x-ax)*(by-ay)-(y-ay)*(bx-ax);
    if(Math.abs(cross)<1e-10 && x>=Math.min(ax,bx)-1e-10 && x<=Math.max(ax,bx)+1e-10 && y>=Math.min(ay,by)-1e-10 && y<=Math.max(ay,by)+1e-10) return true;
    if((ay>y)!==(by>y) && x<(bx-ax)*(y-ay)/(by-ay)+ax) hit=!hit;
  }
  return hit;
}

export function distanceKm(a,b) {
  const dLat=(b[1]-a[1])*DEG,dLon=(b[0]-a[0])*DEG;
  const h=Math.sin(dLat/2)**2+Math.cos(a[1]*DEG)*Math.cos(b[1]*DEG)*Math.sin(dLon/2)**2;
  return 2*EARTH_KM*Math.asin(Math.min(1,Math.sqrt(h)));
}

/** Great-circle interpolation agrees with the atlas route geometry. */
export function interpolateGreatCircle(a,b,t) {
  const v=([lon,lat])=>[Math.cos(lat*DEG)*Math.cos(lon*DEG),Math.cos(lat*DEG)*Math.sin(lon*DEG),Math.sin(lat*DEG)];
  const av=v(a),bv=v(b),angle=Math.acos(Math.max(-1,Math.min(1,av.reduce((s,x,i)=>s+x*bv[i],0))));
  if(angle<1e-9)return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  const den=Math.sin(angle),u=Math.sin((1-t)*angle)/den,w=Math.sin(t*angle)/den;
  const p=av.map((x,i)=>x*u+bv[i]*w);
  return [Math.atan2(p[1],p[0])/DEG,Math.atan2(p[2],Math.hypot(p[0],p[1]))/DEG];
}

export class LandMask {
  constructor(polygons) {
    this.polygons=polygons.map(rings=>({bbox:ringBounds(rings[0]),rings:rings.map(indexRing)}));
  }
  isLand(coord, coastToleranceKm=0) {
    const raw=point=>this.polygons.some(p=>within(point,p.bbox)&&contains(point,p.rings[0])&&!p.rings.slice(1).some(r=>contains(point,r)));
    if(raw(coord))return true;
    if(coastToleranceKm<=0)return false;
    // Tolerance is explicit finding-scale slack, not a positive land assertion.
    const dLat=coastToleranceKm/111.195,dLon=dLat/Math.max(0.1,Math.cos(coord[1]*DEG));
    for(let i=0;i<12;i++){const a=i*Math.PI/6;if(raw([coord[0]+Math.cos(a)*dLon,coord[1]+Math.sin(a)*dLat]))return true;}
    return false;
  }
  segmentWaterStats(a,b,sampleKm=10,coastToleranceKm=0) {
    const lengthKm=distanceKm(a,b),count=Math.max(1,Math.ceil(lengthKm/sampleKm));
    const waterSamples=[];
    let longestWaterKm=0,run=0,waterKm=0;
    // Midpoints avoid classifying a segment from one rounded coastal endpoint.
    for(let i=0;i<count;i++){
      const point=interpolateGreatCircle(a,b,(i+0.5)/count),km=lengthKm/count;
      if(!this.isLand(point,coastToleranceKm)){waterSamples.push(point);waterKm+=km;run+=km;longestWaterKm=Math.max(longestWaterKm,run);}else run=0;
    }
    return {lengthKm,sampleCount:count,waterSampleCount:waterSamples.length,waterFraction:waterSamples.length/count,waterKm,longestWaterKm,waterSamples};
  }
  pathWaterStats(path,sampleKm=10,coastToleranceKm=0) {
    const segments=path.slice(1).map((point,i)=>this.segmentWaterStats(path[i],point,sampleKm,coastToleranceKm));
    return {lengthKm:segments.reduce((s,x)=>s+x.lengthKm,0),waterKm:segments.reduce((s,x)=>s+x.waterKm,0),longestSegmentWaterKm:Math.max(0,...segments.map(x=>x.longestWaterKm)),segments};
  }
}

let retained;
let worldwide;
/** Opt-in process-local coverage for atlases with overseas routes. Regional
 * preparation and its retained source file remain unchanged by default. */
export function useGlobalLandMask() {
  if(!worldwide){
    const source=JSON.parse(readFileSync(new URL('../data/geography/natural-earth-land.source.geojson',import.meta.url),'utf8'));
    const polygons=source.features.filter(feature=>feature.properties.featurecla==='Land')
      .flatMap(feature=>feature.geometry.type==='MultiPolygon'?feature.geometry.coordinates:[feature.geometry.coordinates]);
    worldwide=new LandMask(polygons);
  }
  retained=worldwide;
  return worldwide;
}
export function loadLandMask() {
  if(!retained) retained=new LandMask(JSON.parse(readFileSync(new URL('../data/geography/land-mask.json',import.meta.url),'utf8')).polygons);
  return retained;
}
export const isLand=(coord,coastToleranceKm=0)=>loadLandMask().isLand(coord,coastToleranceKm);
export const segmentWaterStats=(a,b,sampleKm=10,coastToleranceKm=0)=>loadLandMask().segmentWaterStats(a,b,sampleKm,coastToleranceKm);
