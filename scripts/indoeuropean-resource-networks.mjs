/** Local geographic display preparation, separate from research and population. */
import { readFileSync } from 'node:fs';
import { isLand, distanceKm, segmentWaterStats } from './route-landmask.mjs';
import { landCorridor } from './land-corridor.mjs';

const riverFile = 'data/geography/natural-earth-rivers.source.geojson';
const rivers = JSON.parse(readFileSync(new URL(`../${riverFile}`, import.meta.url), 'utf8')).features;
const normalize = text => String(text ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
// Bounds select connected regional river/terrace networks. Widths and maturation
// periods are explicit visualization choices, not historical settlement surveys.
const SETTINGS = {
 'clv': [[40.8,45.5,48.3,51.5],['Volga','Don'],32,240],
 'dnipro': [[28.1,45.9,36.9,52.0],['Dnieper','Dnipro','Dniester','Southern Bug'],30,240],
 'vistula': [[13.0,48.8,25.4,55.0],['Vistula','Oder','Elbe','Bug','Warta'],32,280],
 'altai': [[86.8,50.8,94.6,56.5],['Yenisey','Bol’shoy Yenisey','Verkhniy Yenisey','Abakan'],25,240],
 'dzungaria': [[80.8,43.5,90.5,49.4],['Irtysh','Ili','Emin'],24,240],
 'tarim-east': [[84.5,39.0,90.2,42.9],['Tarim','Konqi'],17,200],
 'tarim-north': [[77.8,39.9,86.0,42.8],['Tarim','Aksu'],18,260],
 'middle-volga': [[41.8,53.8,51.4,58.2],['Volga','Kama','Vyatka','Oka'],28,260],
 'volga-ural': [[47.7,49.7,57.1,55.1],['Volga','Ural','Samara','Belaya'],30,240],
 'sintashta': [[56.9,50.6,63.7,55.2],['Ural','Tobol','Uy'],20,180],
 'central-steppe': [[59.5,45.5,75.5,53.6],['Ishim','Turgay','Turgai','Sarysu','Tobol'],35,300],
 'tian-shan': [[76.7,42.1,85.3,45.9],['Ili','Chu','Talas'],20,240],
 'tuva': [[89.7,49.9,97.5,53.3],['Yenisey','Malyy Yenisey','Bol’shoy Yenisey'],20,220],
 'bmac': [[57.7,35.7,64.4,39.4],['Murgab','Murghab','Tejen'],17,180],
 'oasis-interface': [[61.3,37.2,69.1,41.6],['Zarafshon','Zeravshan','Amu Darya','Kashka Darya'],20,240],
 'punjab': [[69.4,28.0,77.0,34.6],['Indus','Jhelum','Chenab','Ravi','Sutlej'],28,300],
 'ganges': [[76.7,24.4,86.1,29.9],['Ganges','Yamuna','Gomati','Ghaghara'],30,320],
 'nuristan': [[69.2,33.7,72.2,36.9],['Kabul','Kunar'],11,200],
 'khorasan': [[53.8,34.8,61.6,38.8],['Atrek','Kashaf Rud','Tejen'],18,260],
 'zagros': [[45.7,30.8,51.3,36.1],['Karun','Karkheh','Diyala','Little Zab'],17,260],
 'mitanni': [[37.5,35.0,43.1,38.2],['Khabur','Habur','Balikh','Euphrates'],25,200],
 'west-steppe': [[36.5,46.4,47.1,53.0],['Don','Donets','Volga'],32,300],
 'caucasus-north': [[36.6,42.8,46.4,46.7],['Kuban','Terek','Kuma'],22,240],
 'armenia': [[42.2,38.6,46.9,41.7],['Aras','Arax','Kura'],17,200],
 'anatolia': [[28.8,36.8,37.4,41.7],['Sakarya','Kizilirmak','Yesilirmak'],24,260],
 'danube': [[18.3,41.8,28.8,47.1],['Danube','Donau','Morava','Sava','Tisza'],28,280],
 'west-balkans': [[18.2,39.6,22.7,44.2],['Drin','Vardar','Morava','Shkumbin'],17,240],
 'dalmatia': [[14.0,42.3,19.2,46.3],['Sava','Neretva','Krka','Bosna'],19,260],
 'greece': [[20.2,36.3,24.4,41.5],['Pineios','Pinios','Aliakmon','Acheloos','Sperchios'],17,260],
 'bohemia': [[11.8,47.6,18.8,51.7],['Elbe','Vltava','Morava','Danube'],27,260],
 'rhine': [[4.8,47.3,12.0,52.1],['Rhine','Main','Neckar','Moselle','Meuse'],27,280],
 'france': [[-.9,44.4,7.0,50.3],['Seine','Loire','Rhône','Rhone','Saône','Saone'],30,300],
 'britain': [[-5.5,49.9,2.0,55.0],['Thames','Severn','Trent','Ouse'],24,280],
 'iberia': [[-8.5,38.8,.8,43.5],['Douro','Duero','Ebro','Tagus','Tajo'],25,300],
 'north-italy': [[6.4,43.8,13.2,46.7],['Po','Ticino','Adige','Adda'],23,260],
 'central-italy': [[10.5,39.9,14.8,44.2],['Tiber','Tevere','Arno','Volturno'],18,240],
 'baltic': [[21.5,52.8,29.4,58.4],['Neman','Nemunas','Daugava','Zapadnaya Dvina','Gauja'],27,280],
 'sweden': [[11.2,55.6,19.1,61.1],['Göta','Gota','Motala','Norrström','Dalälven'],23,280],
 'scania': [[8.0,54.3,15.6,58.0],['Gudenå','Gudena','Lagan','Helge'],19,240],
 'germany': [[6.2,50.2,18.0,55.1],['Elbe','Oder','Weser','Ems','Rhine'],29,300],
 'norway': [[6.3,58.7,12.6,62.8],['Glomma','Gudbrandsdalslågen','Lagen'],15,260],
 'slavic-core': [[23.4,49.0,34.1,54.7],['Dnieper','Dnipro','Pripyat','Desna','Bug'],27,300],
 'slavic-borderlands': [[22.3,49.1,28.8,52.3],['Bug','Pripyat','Dniester'],22,260],
 'volga-oka': [[33.6,53.8,43.5,58.1],['Volga','Oka','Moskva','Klyazma'],26,300],
};
const ADDITIONAL_CORRIDORS = {
 'scania': [
  ['Eastern Jutland sheltered lowland chain',[[9.35,54.95],[9.4,55.3],[9.55,55.7],[9.7,56.05],[9.85,56.4],[10,56.75]]],
  ['Funen interior valley and cultivated lowlands',[[10.15,55.1],[10.25,55.3],[10.3,55.45]]],
  ['Zealand sheltered interior and coast approaches',[[11.65,55.25],[11.8,55.5],[12.05,55.7],[12.2,55.95]]],
  ['Scanian valley and lower foothill chain',[[13.2,55.55],[13.4,55.8],[13.7,56.05],[14,56.2]]],
 ],
 'greece': [['Thessaly–Boeotia eastern valley approaches',[[22.3,40.0],[22.4,39.6],[22.5,39.1],[22.55,38.7],[22.8,38.3]]]],
 'nuristan': [['Kunar lower-valley reference branch',[[71.2,36.0],[71.1,35.7],[71.05,35.4],[70.9,35.1],[70.8,34.8]]]],
};

function contains([x,y], polygon) {
 let inside=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const [ax,ay]=polygon[i],[bx,by]=polygon[j];
  if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
 }
 return inside;
}
const insideBounds=(p,b)=>p[0]>=b[0]&&p[0]<=b[2]&&p[1]>=b[1]&&p[1]<=b[3];
function offset(point, a, b, kilometres) {
 const cos=Math.max(.2,Math.cos(point[1]*Math.PI/180));
 const dx=(b[0]-a[0])*cos,dy=b[1]-a[1],length=Math.hypot(dx,dy)||1;
 return [+(point[0]-dy/length*kilometres/(111.195*cos)).toFixed(6),+(point[1]+dx/length*kilometres/111.195).toFixed(6)];
}
function nearestIndex(points,coord){let found=0,best=Infinity;for(let i=0;i<points.length;i++){const d=distanceKm(points[i],coord);if(d<best){found=i;best=d;}}return found;}
function length(path){return path.slice(1).reduce((sum,p,i)=>sum+distanceKm(path[i],p),0);}
function interpolate(a,b,t){return[+(a[0]+(b[0]-a[0])*t).toFixed(6),+(a[1]+(b[1]-a[1])*t).toFixed(6)];}
function segmentDistance(point,a,b){const c=Math.max(.2,Math.cos(point[1]*Math.PI/180)),ax=(a[0]-point[0])*111.195*c,ay=(a[1]-point[1])*111.195,bx=(b[0]-point[0])*111.195*c,by=(b[1]-point[1])*111.195,dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,-(ax*dx+ay*dy)/(dx*dx+dy*dy||1)));return Math.hypot(ax+t*dx,ay+t*dy);}
function simplified(points,spacing=25){const out=[points[0]];let travelled=0;for(let i=1;i<points.length-1;i++){travelled+=distanceKm(points[i-1],points[i]);if(travelled>=spacing){out.push(points[i]);travelled=0;}}out.push(points.at(-1));return out.filter((p,i,a)=>!i||distanceKm(p,a[i-1])>.01);}
function ribbon(points,width){const left=[],right=[];for(let i=0;i<points.length;i++){const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],w=width*(.77+.23*Math.sin(i*1.47+.7));left.push(offset(points[i],a,b,w));right.push(offset(points[i],a,b,-w));}return[...left,...right.reverse()];}
function clippedRuns(points,bounds){const runs=[];let run=[];for(const p of points){if(insideBounds(p,bounds))run.push(p);else{if(run.length>1)runs.push(run);run=[];}}if(run.length>1)runs.push(run);return runs;}
function legal(p,exclusions){return isLand(p)&&!exclusions.some(ring=>contains(p,ring));}
const clearanceCache=new WeakMap();
function clear(a,b,exclusions){
 let cache=clearanceCache.get(exclusions);if(!cache){cache=new Map();clearanceCache.set(exclusions,cache);}
 const key=JSON.stringify([a,b]);if(cache.has(key))return cache.get(key);
 let valid=legal(a,exclusions)&&legal(b,exclusions)&&segmentWaterStats(a,b,2,0).waterKm===0;
 const n=Math.max(1,Math.ceil(distanceKm(a,b)/2));
 for(let i=1;valid&&i<n;i++)if(!legal(interpolate(a,b,i/n),exclusions))valid=false;
 cache.set(key,valid);return valid;
}
const connectionCache=new Map();
function connection(a,b,exclusions,bounds){
 const key=JSON.stringify([a,b,bounds]);if(connectionCache.has(key))return connectionCache.get(key);
 let result;
 if(clear(a,b,exclusions))result=[a,b];
 else try{const routed=landCorridor(a,b,{maxSegmentKm:3,coastToleranceKm:0,endpointAllowanceKm:8});if(routed.every(p=>insideBounds(p,[bounds[0]-.3,bounds[1]-.3,bounds[2]+.3,bounds[3]+.3]))&&routed.slice(1).every((p,i)=>clear(routed[i],p,exclusions)))result=routed;}catch{}
 if(result&&length(result)>Math.max(100,distanceKm(a,b)*2.8+30))result=undefined;
 connectionCache.set(key,result);return result;
}
function compact(path,exclusions){const out=[path[0]];let i=0;while(i<path.length-1){let j=Math.min(path.length-1,i+5);const followsGuide=end=>{const steps=Math.max(1,Math.ceil(distanceKm(path[i],path[end])/8));for(let n=1;n<steps;n++){const p=interpolate(path[i],path[end],n/steps);if(Math.min(...path.slice(i+1,end+1).map((b,k)=>segmentDistance(p,path[i+k],b)))>15)return false;}return true;};while(j>i+1&&(!clear(path[i],path[j],exclusions)||!followsGuide(j)))j--;out.push(path[j]);i=j;}return out;}
function randomFor(seed){let state=2166136261;for(const c of seed)state=Math.imul(state^c.codePointAt(0),16777619)>>>0;return()=>{state=(state+0x6d2b79f5)>>>0;let value=Math.imul(state^(state>>>15),1|state);value^=value+Math.imul(value^(value>>>7),61|value);return((value^(value>>>14))>>>0)/4294967296;};}
const preparedCache=new Map(),sampleCache=new Map();

function network(declared,coord){
 const config=SETTINGS[declared.id];if(!config)throw new Error(`No regional resource configuration for ${declared.id}`);
 const [bounds,aliases,width,years]=config,aliasSet=new Set(aliases.map(normalize));
 const key=JSON.stringify([declared.id,coord]);if(preparedCache.has(key))return preparedCache.get(key);
 const lines=[];
 for(const [featureIndex,feature]of rivers.entries()){
  if(feature.properties.featurecla!=='River'||![feature.properties.name,feature.properties.name_en].some(name=>aliasSet.has(normalize(name))))continue;
  const sourceLines=feature.geometry.type==='LineString'?[feature.geometry.coordinates]:feature.geometry.coordinates;
  for(const points of sourceLines)for(const run of clippedRuns(points,bounds))if(length(run)>25){const coordinates=simplified(run,20);lines.push({name:feature.properties.name_en??feature.properties.name,coordinates,source:riverFile,featureIndex,kind:'river-terrace'});}
 }
 // Retained coarse references carry smaller tributaries, foothill/oasis paths
 // and coastal lowlands missing from this global-scale river catalogue.
 for(const line of declared.waterCorridors)lines.push({name:line.name,coordinates:line.coordinates,source:'retained project reference reconstruction',kind:'valley-oasis-coastal-reference'});
 for(const [name,coordinates]of ADDITIONAL_CORRIDORS[declared.id]??[])lines.push({name,coordinates,source:'explicit reconstructed regional valley/coastal reference',kind:'land-resource-link'});
 if(!lines.length)throw new Error(`No resource corridors in ${declared.id}`);
 const habitats=lines.map(line=>({name:`${line.name} bank terraces / adjoining lowlands`,polygon:ribbon(line.coordinates,width),weight:1,resource:'Variable-width watered terrace / lower-valley ribbon, not a filled basin disk'}));
 const waterCorridors=lines.map(line=>({name:line.name,coordinates:line.coordinates,reachKm:width,source:line.source,...(line.featureIndex===undefined?{}:{featureIndex:line.featureIndex})}));
 const coreExclusions=lines.filter(line=>line.kind!=='land-resource-link').map(line=>ribbon(line.coordinates,1.3));
 const exclusions=declared.exclusions;
 const habitable=p=>legal(p,exclusions)&&!coreExclusions.some(ring=>contains(p,ring))&&habitats.some(h=>contains(p,h.polygon));
 const branches=[];
 for(const [lineIndex,line]of lines.entries())for(const side of [-1,1]){
  let run=[];
  const finish=()=>{if(run.length>1&&length(run)>8)branches.push({name:line.name,lineIndex,side,points:run});run=[];};
  for(let i=0;i<line.coordinates.length;i++){
   const p=offset(line.coordinates[i],line.coordinates[Math.max(0,i-1)],line.coordinates[Math.min(line.coordinates.length-1,i+1)],side*5);
   if(!habitable(p)){finish();continue;}
   if(run.length&&!clear(run.at(-1),p,exclusions))finish();run.push(p);
  }
  finish();
 }
 if(!branches.length)throw new Error(`No land-side resource branches in ${declared.id}`);
 const entries=branches.flatMap(branch=>branch.points),globalEntry=entries[nearestIndex(entries,coord)];
 const connectorHabitats=[];
 for(const branch of branches){
  branch.entryIndex=nearestIndex(branch.points,globalEntry);
  const localEntry=branch.points[branch.entryIndex],joined=connection(globalEntry,localEntry,exclusions,bounds);
  branch.connector=joined?compact(joined,exclusions):undefined;
  branch.separateLanding=!joined;
  if(joined&&joined.length>1)connectorHabitats.push({name:`${declared.label} local valley / foothill approach`,polygon:ribbon(joined,Math.min(14,width*.6)),weight:.5,resource:'Reconstructed land-checked approach between the river-side branches'});
  branch.length=length(branch.points);branch.cumulative=[0];for(let i=1;i<branch.points.length;i++)branch.cumulative.push(branch.cumulative.at(-1)+distanceKm(branch.points[i-1],branch.points[i]));
 }
 const result={declared,bounds,width,years,lines,habitats:[...habitats,...connectorHabitats],waterCorridors,coreExclusions,exclusions,branches,globalEntry};
 preparedCache.set(key,result);return result;
}

export function sampleResourceDispersal(declared,coord,id,count){
 const sampleKey=JSON.stringify([declared.id,coord,id,count]);if(sampleCache.has(sampleKey))return structuredClone(sampleCache.get(sampleKey));
 const region=network(declared,coord),rng=randomFor(sampleKey);
 const totalLength=region.branches.reduce((sum,b)=>sum+b.length,0),cumulative=[];let sum=0;for(const b of region.branches){sum+=b.length;cumulative.push(sum);}
 const points=[],entryPoints=[],paths=[],identities=new Set();
 let attempts=0,separateLandings=0;
 while(points.length<count&&attempts<count*90){
  const attempt=attempts++,distance=((attempt*.6180339887498949+.137)%1)*totalLength;
  const branchIndex=cumulative.findIndex(value=>value>distance),branch=region.branches[Math.max(0,branchIndex)];
  const before=branchIndex>0?cumulative[branchIndex-1]:0,along=Math.min(branch.length,Math.max(0,distance-before));
  let segment=branch.cumulative.findIndex(value=>value>=along)-1;segment=Math.max(0,Math.min(branch.points.length-2,segment));
  const a=branch.points[segment],b=branch.points[segment+1],fraction=(along-branch.cumulative[segment])/Math.max(.001,branch.cumulative[segment+1]-branch.cumulative[segment]);
  const onBank=interpolate(a,b,Math.max(0,Math.min(1,fraction)));
  const sideWidth=region.width*(.25+.65*rng());
  const terminal=offset(onBank,a,b,branch.side*sideWidth);
  if(!legal(terminal,region.exclusions)||region.coreExclusions.some(ring=>contains(terminal,ring))||!region.habitats.some(h=>contains(terminal,h.polygon)))continue;
  const identity=terminal.join(',');if(identities.has(identity))continue;
  let branchPath;
  if(along>=branch.cumulative[branch.entryIndex])branchPath=[...branch.points.slice(branch.entryIndex,segment+1),onBank];
  else branchPath=[...branch.points.slice(segment+1,branch.entryIndex+1).reverse(),onBank];
  branchPath=branchPath.filter((p,i,array)=>!i||distanceKm(p,array[i-1])>.001);
  const base=branch.connector?[...branch.connector,...branchPath.slice(1),terminal]:[...branchPath,terminal];
  if(base.length<2||!base.slice(1).every((p,i)=>clear(base[i],p,region.exclusions)))continue;
  let path=compact(base,region.exclusions);
  // Landings occupy a short entry-valley segment, never a circular scatter.
  // Individual slots subsequently follow this same resource path outward.
  const firstLength=distanceKm(path[0],path[1]),entryFraction=Math.min(.16,22/Math.max(1,firstLength))*(.1+.9*rng());
  const entry=interpolate(path[0],path[1],entryFraction);
  if(legal(entry,region.exclusions)&&!region.coreExclusions.some(ring=>contains(entry,ring))&&region.habitats.some(h=>contains(entry,h.polygon))&&clear(entry,path[1],region.exclusions))path=[entry,...path.slice(1)];
  path=path.map(p=>p.map(v=>+v.toFixed(6)));
  if(!path.slice(1).every((p,i)=>clear(path[i],p,region.exclusions)))continue;
  identities.add(identity);points.push(terminal);entryPoints.push(path[0]);paths.push(path.map(p=>p.map(v=>+v.toFixed(6))));
  if(branch.separateLanding)separateLandings++;
 }
 if(points.length!==count)throw new Error(`Resource network ${declared.id} supplied ${points.length}/${count} land-checked settlement paths after ${attempts} attempts`);
 const basis=`Irregular regional resource-network display reconstruction: ${declared.label}. Settlement slots follow connected river terraces, valley branches, foothill approaches, pasture and oasis/coastal margins. Natural Earth river geometries are retained under ${riverFile}; smaller reference corridors remain explicitly reconstructed. Variable-width ribbons replace filled compact basin patches, and active channel cores / declared unsuitable patches / open water are excluded from terminal placement. Post-arrival dispersal takes ${region.years} modeled calendar years along the supplied land-checked path; these are display assumptions, not source arrival dates or observed settlements. Path and dates are reconstructed.`;
 const dispersion={years:region.years,entryPoints,paths,basis:`Age since the individual slot is credited drives entry-to-regional settlement dispersion along these prepared resource paths. Initial standing priors are already mature. No people, estimates, counting units or source chronology are changed. ${basis}`};
 const allDisplay=[...points,...entryPoints,...paths.flat()],displayBounds=allDisplay.reduce((box,p)=>[Math.min(box[0],p[0]),Math.min(box[1],p[1]),Math.max(box[2],p[0]),Math.max(box[3],p[1])],[Infinity,Infinity,-Infinity,-Infinity]);
 const footprint={kind:'resource-terrain-profile',profileId:declared.id,label:declared.label,reference:coord,regionalBounds:region.bounds,displayBounds,
  habitats:region.habitats,waterCorridors:region.waterCorridors,exclusions:[...region.exclusions,...region.coreExclusions],originalHabitatEnvelopes:declared.habitats,
  method:'Arc-length-stratified land-side river/valley ribbons, with per-slot entry-to-terminal resource paths; no radial cloud or basin-fill fallback',
  landSource:'data/geography/land-mask.json',riverSource:riverFile,requestedCount:count,actualCount:points.length,seed:sampleKey,
  dispersionYears:region.years,pathLandSamplingKm:2,coastToleranceKm:0,separateCoastalOrValleyLandingSlots:separateLandings,
  limitation:'Modern coarse hydrography and reconstructed resource bands guide display. They do not establish ancient river channels, local terrain suitability, historical itineraries, carrying capacities or surveyed settlements.'};
 const result={points,basis,footprint,dispersion};sampleCache.set(sampleKey,result);return structuredClone(result);
}
