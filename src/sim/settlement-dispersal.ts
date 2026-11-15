import type { LonLat, Settlement } from '../data/types';
export type { SettlementDispersion } from '../data/types';
import type { StandingSlotOrigin } from './standing-slots';
import { haversineKm } from '../util/geo';


interface PathDistances { cumulative:number[]; total:number }
const pathDistances=new WeakMap<LonLat[],PathDistances>();
function distances(path:LonLat[]):PathDistances {
  const previous=pathDistances.get(path);if(previous)return previous;
  if(path.some(point=>point.length!==2||!point.every(Number.isFinite))){const invalid={cumulative:[0],total:0};pathDistances.set(path,invalid);return invalid;}
  const cumulative=[0];
  for(let index=1;index<path.length;index++)cumulative.push(cumulative[index-1]+haversineKm(path[index-1],path[index]));
  const result={cumulative,total:cumulative.at(-1)??0};pathDistances.set(path,result);return result;
}

/** Position changes only: weights, stock identity and credit dates stay intact.
 * Established locals stay regional; births within a young arriving cohort
 * share its current dispersal front rather than appearing remotely mature. */
export function settlementSlotPosition(stock:Settlement,slot:number,year:number,origin?:StandingSlotOrigin):LonLat {
  const points=stock.displayPoints;
  if(!points?.length)throw new Error(`${stock.id}: settlement slot has no prepared regional position`);
  const index=Math.max(0,Math.trunc(slot))%points.length,mature=points[index];
  const dispersion=stock.dispersion;
  const epoch=origin?.kind==='arrival'?origin.year:origin?.kind==='growth'?origin.dispersionFrom:undefined;
  if(!dispersion||epoch===undefined||!Number.isFinite(year)||!Number.isFinite(epoch)
    ||!Number.isFinite(dispersion.years)||dispersion.years<=0)return mature;
  const age=Math.max(0,year-epoch),fraction=Math.min(1,age/dispersion.years);
  if(fraction>=1)return mature;
  const path=dispersion.paths[index];
  // A missing/invalid reconstruction must never invent a straight shortcut
  // over water or unsuitable terrain between distant habitat components.
  if(!path?.length)return mature;
  const route=distances(path);if(!(route.total>0))return mature;
  if(fraction<=0)return path[0];
  const progress=fraction*fraction*(3-2*fraction),wanted=progress*route.total;
  let low=1,high=route.cumulative.length-1;
  while(low<high){const middle=(low+high)>>>1;if(route.cumulative[middle]<wanted)low=middle+1;else high=middle;}
  const end=low,start=end-1,span=route.cumulative[end]-route.cumulative[start];
  const part=span>0?(wanted-route.cumulative[start])/span:0,a=path[start],b=path[end];
  const longitudeDelta=((b[0]-a[0]+540)%360)-180;
  let longitude=a[0]+longitudeDelta*part;
  if(longitude>180)longitude-=360;if(longitude< -180)longitude+=360;
  return [longitude,a[1]+(b[1]-a[1])*part];
}



