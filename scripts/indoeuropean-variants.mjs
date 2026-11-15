/** Nonadditive geographic alternatives; every variant retains identical people. */
import {landCorridor} from './land-corridor.mjs';
import {sampleIndoeuropeanLandscape} from './indoeuropean-landscapes.mjs';

function place(stage,coord,key){
 const sampled=sampleIndoeuropeanLandscape(coord,key,1024);
 Object.assign(stage,{coord,sampledArrivalPoints:sampled.points,placementBasis:sampled.basis,footprint:sampled.footprint,dispersion:sampled.dispersion,basis:`Path and dates are reconstructed. ${sampled.basis}`});
}
function route(atlas,id,coordinates,alternative,sea=false){
 const j=atlas.journeys.find(j=>j.id===id);if(!j)throw new Error(`Missing alternative target ${id}`);
 place(j.origin,coordinates[0],`${id}-origin`);place(j.stages[0],coordinates.at(-1),`${id}-destination`);
 let line=[];for(let i=1;i<coordinates.length;i++){const leg=sea?coordinates.slice(i-1,i+1):landCorridor(coordinates[i-1],coordinates[i]);line.push(...(line.length?leg.slice(1):leg));}
 Object.assign(j.corridors[0],{coordinates:line,transport:sea?'mixed':'land-corridor',basis:`Path and dates are reconstructed. Nonadditive ${alternative} geography; same shared population estimate as the primary scenario.`});
 j.linkedRecordIds=[...new Set([...j.linkedRecordIds,alternative])];
 j.source.notes.push(`Comparative alternative ${alternative}: this route replaces the primary route with the same cohort and estimates; it never adds migrants.`);
 j.tags.push(`comparison:${alternative}`);
}
function relocate(prep,id,coord){const r=prep.reservoirs.find(r=>r.id===id),sampled=sampleIndoeuropeanLandscape(coord,id,4096);Object.assign(r,{coord,points:sampled.points,placementBasis:sampled.basis,footprint:sampled.footprint,dispersion:sampled.dispersion});}
export function landscapePlacements(atlas,ledger){
 const placements={};
 const geometry=(points,dispersion,metadata)=>{
  const all=[...points,...(dispersion?.entryPoints??[]),...(dispersion?.paths??[]).flat()];
  const box=all.reduce((b,p)=>[Math.min(b[0],p[0]),Math.min(b[1],p[1]),Math.max(b[2],p[0]),Math.max(b[3],p[1])],[Infinity,Infinity,-Infinity,-Infinity]);
  if(metadata?.displayBounds?.length===4)for(let i=0;i<4;i++)box[i]=i<2?Math.min(box[i],metadata.displayBounds[i]):Math.max(box[i],metadata.displayBounds[i]);
  const[w,s,e,n]=box;
  // This polygon is an indexing envelope only. Resident shapes follow actual
  // resource candidates; the raw named habitat metadata remains on the stage.
  return{kind:'polygon',rings:[[[w,s],[e,s],[e,n],[w,n],[w,s]]]};
 };
 for(const r of ledger.reservoirs)placements[r.id]={points:r.points,basis:r.placementBasis,sources:[],footprint:geometry(r.points,r.dispersion,r.footprint),...(r.dispersion?{dispersion:r.dispersion}:{})};
 for(const j of atlas.journeys){const s=j.stages[0];placements[j.id]={points:s.sampledArrivalPoints,basis:s.placementBasis,sources:[],footprint:geometry(s.sampledArrivalPoints,s.dispersion,s.footprint),...(s.dispersion?{dispersion:s.dispersion}:{})};}
 return placements;
}
export function indoeuropeanVariants(atlas,ledger){
 const dimensions=[
  {id:'anatolian',label:'Anatolian route',options:[{id:'eastern',label:'Eastern CLV entry'},{id:'western',label:'Balkan / Usatove alternative'}]},
  {id:'celtic',label:'Celtic dispersal',options:[{id:'eastern',label:'Knovíz–Urnfield east'},{id:'centre',label:'Western / centre alternative'}]},
  {id:'slavic',label:'Slavic origin',options:[{id:'ukraine',label:'Ukraine / southern Belarus'},{id:'volhynia',label:'SE Poland / Volhynia alternative'}]},
 ];
 const variants=[];
 for(const anatolian of ['eastern','western'])for(const celtic of ['eastern','centre'])for(const slavic of ['ukraine','volhynia']){
  const a=structuredClone(atlas),l=structuredClone(ledger),id=`${anatolian}-${celtic}-${slavic}`;
  if(anatolian==='western')route(a,'ANA-1A',[[44.5,47.5],[40.5,47.2],[33.9,47.3],[30.5,46.5],[26.5,44],[26.3,40.3],[26.5,40],[29,39.5],[33.8,39.3]],'ANA-1B',true);
  if(celtic==='centre'){
   relocate(l,'URNFIELD',[4,46]);
   route(a,'URNFIELD-SEED',[[8,49],[6,47.5],[4,46]],'CEL-1B');
   route(a,'CEL-1A-FRANCE',[[4,46],[4,47]],'CEL-1B');
   route(a,'CEL-1A-BRITAIN',[[4,46],[2,49],[2,50.7],[.8,51],[-1.5,51.5]],'CEL-1B',true);
   route(a,'CEL-1A-IBERIA',[[4,46],[1,44],[0,43],[-3,41]],'CEL-1B');
   route(a,'CEL-1A-ITALY',[[4,46],[6.5,46],[8.6,45.7]],'CEL-1B');
   route(a,'CEL-1A-BALKANS',[[4,46],[8.6,45.7],[13,46],[18,47.5],[20,46],[23,44]],'CEL-1B');
  }
  if(slavic==='volhynia'){
   relocate(l,'SLAVIC-CORE',[23.5,50.5]);
   route(a,'SLAVIC-SEED',[[25.5,54.5],[25,52.5],[23.5,50.5]],'SLA-1B');
   route(a,'SLA-1A-WEST',[[23.5,50.5],[19,52],[13.5,52.5]],'SLA-1B');
   route(a,'SLA-1A-SOUTH',[[23.5,50.5],[23,48],[20,45],[17,44],[16.3,43.7]],'SLA-1B');
   route(a,'SLA-1A-EAST',[[23.5,50.5],[30,53],[36,55.5],[40,55.5]],'SLA-1B');
  }
  l.landscapes=landscapePlacements(a,l);
  variants.push({id,label:`${anatolian} Anatolian · ${celtic} Celtic · ${slavic} Slavic`,choices:{anatolian,celtic,slavic},atlas:a,ledger:l});
 }
 return{dimensions,default:'eastern-eastern-ukraine',variants};
}
