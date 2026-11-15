#!/usr/bin/env node
/** Deterministic local preparation; supplied prose remains evidence, never code. */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { prepareResearchProject } from '../src/data/research.ts';
import { compileDataset } from '../src/data/loader.ts';
import { readEstimateInput } from '../src/data/estimate-input.ts';
import { compileAtlasPopulation } from '../src/data/atlas-model.ts';
import { attachLedger, ledgerEvents, ledgerBalance, transferEvents } from '../src/data/population-ledger.ts';
import { landCorridor } from './land-corridor.mjs';
import { loadLandMask, useGlobalLandMask } from './route-landmask.mjs';
import { sampleGermanicLandscape, GERMANIC_LANDSCAPE_BASIS, GERMANIC_LANDSCAPE_SOURCES } from './germanic-landscapes.mjs';

useGlobalLandMask();

const dir='public/data/research',stem='germanic-migrations',title='Germanic-labelled and German-speaking migrations · 100 BCE–2026 CE';
await mkdir(dir,{recursive:true});
const sourceFile=`${dir}/${stem}.source.txt`, supplied=process.argv[2];
if(supplied&&resolve(supplied)!==resolve(sourceFile))await copyFile(supplied,sourceFile);
const bytes=await readFile(sourceFile), originalText=bytes.toString('utf8'),sha256=createHash('sha256').update(bytes).digest('hex');
const write=(suffix,value)=>writeFile(`${dir}/${stem}.${suffix}.json`,JSON.stringify(value,null,2)+'\n');
const geometryCacheFile='.atlas-runtime/germanic-geography-cache.json';
let geometryCache={};
try { geometryCache=JSON.parse(await readFile(geometryCacheFile,'utf8')); } catch(error) { if(error.code!=='ENOENT')throw error; }
process.on('exit',()=>{mkdirSync('.atlas-runtime',{recursive:true});writeFileSync(geometryCacheFile,JSON.stringify(geometryCache));});
function landGuide(a,b){
 const key=JSON.stringify([a,b]);
 return geometryCache[key]??(geometryCache[key]=landCorridor(a,b));
}
const timeRange=[-100,2026], reconstructed='Path and dates are reconstructed.';
const modelBasis='Low/central/high are visualization scenarios, not confidence intervals. Unknown source populations remain null. Source flows, resident stocks, mortality, genetic ancestry and modern descendants are different counting units. Source-free allocations are explicitly illustrative, never measured censuses.';
const records=[];
const modules={A:'Ancient Germanic-labelled coalitions',S:'North Germanic / Scandinavian expansion',M:'Medieval German-speaking settlement',E:'Early modern German-speaking settlement',R:'Russian imperial and pre-war diaspora',W:'Twentieth-century displacement and return',O:'Overseas diasporas'};
const definitions=[
['A1','Goths (Wielbark, Visigoths and Ostrogoths)','1st–6th centuries CE','Northern Poland','Ukraine, Balkans, Aquitaine, Iberia and Italy'],
['A2','Vandals (Hasdingi and Silingi) and Alans','c. 200–439 CE; Rhine 405/406; Africa 429','Oder–Vistula / Pannonia','Gaul, Iberia and North Africa'],
['A3','Suebi','406–409 CE','Elbe / southwestern frontier','Gallaecia'],
['A4','Burgundians','c. 280–443 CE','Oder–Main','Worms and Sapaudia'],
['A5','Alemanni','c. 260–500 CE','Elbe / Main–Neckar','Agri Decumates, Alsace and Swiss plateau'],
['A6','Franks (Salian, Ripuarian and Chatti)','c. 250–511 CE','Lower/Middle Rhine','Toxandria, Cologne and northern Gaul'],
['A7','Lombards / Langobards','4th century–568 CE','Lower Elbe','Bohemia, Pannonia and northern Italy'],
['A8','Angles, Saxons and Jutes','c. 410–850 CE','Continental North Sea zone','Eastern and southern Britain'],
['S1','Scandinavians / Vikings / Varangians / Rus’','c. 790–1100 CE; Greenland contact lost by 1450','Denmark, Norway and Sweden','Eastern river corridors, British Isles, Normandy and North Atlantic'],
['M1','Flemish, Dutch, Low and High German settlers','c. 1100–1347 CE','Low Countries and western Holy Roman Empire','Trans-Elbia, Pomerania, Silesia and Poland'],
['M2','Baltic Germans / Deutschbalten','13th–14th centuries; later presence to 1939','Westphalia and Lower Saxony','Livonia, Courland and Estonia'],
['M3','Prussian Germans','13th–18th centuries','Holy Roman Empire','West and East Prussia'],
['M4','Bohemian and Moravian Germans / Sudetendeutsche','12th–14th centuries','Bavaria, Franconia, Saxony and Silesia','Bohemian and Moravian borderlands'],
['M5','Carpathian Germans / Zipser Saxons','12th–15th centuries, particularly after 1241','Western Empire, Austria, Saxony and Silesia','Pressburg, Hauerland and Spiš'],
['M6','Transylvanian Saxons / Siebenbürger Sachsen','c. 1141–1300 CE','Luxembourg, Low Countries, Moselle, Lorraine and Alsace','Sibiu, Brașov and Bistrița'],
['M7','Gottscheers / Gottscheer / Kočevarji','1300–1330 CE','Carinthia and East Tyrol','Gottschee / Kočevje'],
['E1','Vistula Delta Mennonites and Vistula Germans','1530s–1850s','Friesland, Flanders, Swiss and German regions','Vistula Delta and Congress Poland'],
['E2','Sathmar Swabians / Sathmarer Schwaben','1712–1815','Upper Swabia, Ravensburg and Biberach','Sathmar / Satu Mare'],
['E3','Transylvanian Landler / Siebenbürger Landler','1734–1776','Salzkammergut, Upper Austria, Carinthia and Styria','Turnișor, Cristian and Apoldu de Sus'],
['E4','Danube Swabians / Donauschwaben','1686–1829; major waves 1718–1737,1744–1772,1782–1787','Palatinate, Hesse, Lorraine, Alsace, Swabia, Bavaria and Austria','Banat, Bačka, Swabian Turkey, Slavonia-Syrmia and Hungary'],
['E5','Galician and Bukovina Germans','1775–1850s','Palatinate, Baden, Hesse, Banat, Galicia and Zips','Galicia, Maramureș and Bukovina'],
['R1','Volga Germans / Wolgadeutsche','1764–1767','Hesse, Rhineland, Palatinate, Isenburg and other regions','Lower Volga'],
['R2','Russian Mennonites / Russlandmennoniten','1789–1853','Vistula Delta (earlier Friesland and Flanders)','Chortitza, Molotschna and Samara'],
['R3','Black Sea, Bessarabian and Crimean Germans','1804–1842','Southwestern German regions, Poland, Hungary and Belowesch','Odessa, Budjak and Crimea'],
['R4','Caucasus Germans / Kaukasusdeutsche','1817–1819 and later 19th century','Württemberg and Baden; secondary Volga and Black Sea','Georgia, Azerbaijan and North Caucasus'],
['R5','Volhynian Germans / Wolhyniendeutsche','1816–1914 settlement; forced exile 1915–1916','Congress Poland, Prussia and Württemberg','Volhynia, Volga and Siberia'],
['R6','Central Asian Mennonites / Claas Epp Jr. trek','1880–1884; forced removal 1935','Samara / Am Trakt and Molotschna','Talas, Khiva, Kansas and Tajikistan'],
['R7','Siberian and pre-1941 Kazakhstani Germans','1882–1926,1930–1931,1935–1936','Volga, Black Sea and Ukrainian border zone','Western Siberia and Kazakhstan'],
['W1','Nazi Heim ins Reich transfers','1939–1 June 1944','Central, eastern and southeastern European diaspora','Annexed Poland, Lower Styria and Reich'],
['W2','Soviet wartime deportations, Trudarmiya and forced repatriation','1941–1948','European USSR, Caucasus and returning Soviet resettlers','Kazakhstan, Siberia and Urals'],
['W3','GKO Order 7161ss foreign civilian internees','December 1944–1949','Eastern Germany/Poland, Romania, Hungary and Yugoslavia','Donbas and Urals'],
['W4','Wartime flight and postwar expulsions','1944–1950; secondary East–West migration to 1961','East-central and southeastern Europe','Postwar Germany and Austria'],
['W5','Aussiedler and Spätaussiedler','1950–2026','Remaining USSR/successor-state and eastern European German stocks','Federal Republic of Germany'],
['O1','Overseas diaspora: United States and Canada','1683–20th century','German-speaking Europe and secondary eastern diaspora','United States and Canada'],
['O2','Overseas diaspora: Brazil, Argentina, Chile and Venezuela','1824–1972','German-speaking Europe and Volga secondary hub','South America'],
['O3','Mennonite relays: Canada, Mexico, Harbin and Paraguay','1922–1970s','Canada and Russian / Ukrainian refugee communities','Mexico and Paraguay'],
['O4','Overseas diaspora: southern Africa and Australia','1838–20th century','German-speaking Europe','Namibia, South Africa and Australia'],
];
const registerText=originalText.slice(originalText.indexOf('8. Sourced Chronological'));
const tableIds=['A1','A2','A3','A4','A5','A6','A7','A8','S1','M1','M2','M3','M4','M5','M6','M7','E1','E2','E3','E4','E5','R1','R2','R3','R4','R5','R6','R7','W1–W5','O1–O4'];
const tableStarts=['Goths','Vandals','Suebi','Burgundians','Alemanni','Franks','Lombards','Angles','Scandinavians','Flemish','Baltic Germans','Prussian Germans','Bohemian','Carpathian','Transylvanian Saxons','Gottscheers','Vistula Delta','Sathmar','Transylvanian Landler','Danube Swabians','Galician','Volga Germans','Russian Mennonites','Black Sea','Caucasus','Volhynian','Central Asian','Siberian','Wartime Transfers','Overseas Diasporas'];
const offsets=tableIds.map((id,i)=>registerText.indexOf(id+tableStarts[i]));
if(offsets.some((offset,i)=>offset<0||(i&&offset<=offsets[i-1])))throw new Error('Source table extraction requires every ordered original row.');
const exactRows=new Map(tableIds.map((id,i)=>[id,offsets[i]>=0?registerText.slice(offsets[i],i+1<offsets.length?offsets[i+1]:registerText.indexOf('9. Quantitative')):'']));
for(const [id,name,date_label,origin,destination] of definitions){
 const shared=id.startsWith('W')?'W1–W5':id.startsWith('O')?'O1–O4':id;
 const original_wording=exactRows.get(shared);
 if(!original_wording)throw new Error(`Missing original table wording: ${id}`);
 const temporal_type=id==='M2'?'recorded_presence':id==='W1'?'coerced_transfer':['W2','W3','W4','E3'].includes(id)?'forced_displacement':'reported_movement';
 records.push({id,name,native_name:name.includes('/')?name.split('/').slice(1).join('/').trim():name,origin,destination,date_label,temporal_type,population:null,source_population:null,record_status:'supplied-synthesis-unreviewed',source_ids:['REPORT'],region:modules[id[0]],notes:'Register ID follows the explicit table; inconsistent internal narrative cross-references are retained in the full original. Source headcounts, later presence stocks and traditions in this row remain distinct from the reconstructed movement. '+reconstructed,original_wording,module:id[0]});
}
const sourceRefs=[{id:'REPORT',title:'User-supplied Comprehensive Historical, Demographic, and Geospatial Analysis of German-Speaking and Germanic-Labelled Migrations',note:'Original text and every qualification retained byte-for-byte. Sources cited within the synthesis have not been exhaustively checked.'}];
const anchors=[
{id:'R1-DISPATCH',recordId:'R1',kind:'migrant-flow',unit:'people-dispatched',value:26676,survivors:23383,deaths:3293},
{id:'M1-KUHN',recordId:'M1',kind:'estimated-rural-flow',unit:'people',value:200000,includes:['M3 medieval share']},
{id:'M6-FARMS',recordId:'M6',kind:'converted-founder-flow',unit:'farmsteads',value:520,multiplier:5,people:2600},
{id:'S1-VIABILITY',recordId:'S1',kind:'minimum-viability-model',unit:'theoretical-founders',low:80,high:150,population_dot_eligible:false},
{id:'PREWAR-EAST',recordId:'R7',kind:'resident-stock',unit:'people',value:231301,kazakhstan1939:92571,population_dot_eligible:false},
{id:'W1-TOTAL',recordId:'W1',kind:'migrant-flow',unit:'people',value:1009113,annexedPlacementSubset:662448},
{id:'W2-CONVOYS',recordId:'W2',kind:'deportee-flow',unit:'people',low:799459,high:855674,cumulativeOrders:1209430},
{id:'W2-LABOUR',recordId:'W2',kind:'subset-mobilization',unit:'people',value:315000,population_dot_eligible:false},
{id:'W3-ARCHIVE',recordId:'W3',kind:'internee-arrivals',unit:'people',value:271672,returned:201464,deadOrWithdrawn:66456,stillHeld:3752},
{id:'W4-1950',recordId:'W4',kind:'1950-legal-expellee-stock',unit:'people',value:12750000,laterOffspringTotals:[14600000,16220000],population_dot_eligible:false},
{id:'W4-DEATHS',recordId:'W4',kind:'mortality-alternatives',unit:'people',confirmed:473013,central:[500000,600000],balanceDeficit:[2225000,2500000],population_dot_eligible:false},
{id:'W5-BVA',recordId:'W5',kind:'registered-flow-1950-2005',unit:'people',value:4481882},
{id:'O-BRAZIL',recordId:'O2',kind:'immigrant-arrivals-1824-1969',unit:'people',value:250166,descendants:[5000000,12000000],population_dot_eligible:false},
{id:'W4-ORIGIN-STOCK',recordId:'W4',kind:'pre-expulsion-resident-stock',unit:'people',low:16199086,high:16998500,time:'Before 1944–1950 expulsions',population_dot_eligible:false,scope_warning:'Origin resident population, not the number of expellees, survivors or arrivals.'},
{id:'W2-ORIGIN-STOCK',recordId:'W2',kind:'census-resident-stocks',unit:'people',observations:[{year:1937,value:1151601},{year:1939,value:1427232}],population_dot_eligible:false,scope_warning:'Different census observations; not summed and not substituted for wartime transport counts.'},
{id:'R7-EMPIRE-USSR-STOCKS',recordId:'R7',kind:'census-resident-stocks',unit:'people',observations:[{year:1897,value:1790489,scope:'Russian Empire'},{year:1926,value:1238549,scope:'USSR'}],population_dot_eligible:false,scope_warning:'Different dates and territorial scopes; neither is a Siberian/Kazakh migration flow.'},
{id:'R4-DEPARTURE-FAMILIES',recordId:'R4',kind:'reported-departure-count',unit:'families',value:1400,population_dot_eligible:false,scope_warning:'Leaving families, distinct from approximately 500 reaching families and from arriving persons.'},
];
const sourceRegister={metadata:{title,scope:'All six supplied modules, with ancient Germanic-labelled coalitions distinct from medieval/modern German speakers and North Germanic expansions.',population_policy:modelBasis,evidence_codes:{REPORT:'Supplied synthesis, inherited and unreviewed'}},suppliedText:originalText,sourceSha256:sha256,records,sources:sourceRefs,numerical_anchors:anchors,context:{counting:'The register expands the combined W1–W5 and O1–O4 rows into 37 source IDs. The report labels its table “30 major episodes”.',internalReferenceErrors:'Several narrative R-number cross-references differ from the explicit register. Original wording is not corrected or overwritten.',historicalLimitations:'Reported genetic ancestry does not establish exact headcounts. Military conquest, maritime raids, trade influence and modern ancestry are not resident population flows.'}};
await write('register',sourceRegister);
const raw=prepareResearchProject(sourceRegister,{sourceName:`${stem}.register.json`,sourceDocument:`data/research/${stem}.source.txt`});
raw.meta={...raw.meta,title,timeRange,defaultYear:-100,defaultView:{center:[16,49],zoom:3.1},cameraFollow:'steady',defaultDotScale:2.4,dotScaleRevision:'germanic-outlined-2026-11-15-v1',dotStyle:{outlineColor:'#000000',outlineWidth:1,minimumRadius:2.7},defaultJourneyColorMode:'group',playback:{adaptive:false,defaultSpeed:25,schedule:'continuous',phases:[{from:-100,to:100,yearsPerSecond:200},{from:100,to:400,yearsPerSecond:15},{from:400,to:600,yearsPerSecond:5},{from:600,to:2026,yearsPerSecond:25}]},description:sourceRegister.metadata.scope+' '+modelBasis,synthetic:false};
const journeys=[],estimates=[],reservoirs=[],accountingGroups=[];
// Display progression of the same conserved cohort within its existing
// reconstruction window. These are not measured individual travel times.
// Each value also respects the remaining time after every retained stage hold.
const ancientCohortProgression={'A1-STAGE':60,'A1-VIS':24,'A1-OST':9,A2:24,A3:5,A4:15,A5:60,A6:60,A7:22,A8:60};
const cohortProgressionBasis='Ancient display transit represents cohort progression through a reconstructed relocation period, not a measured literal trip by an individual. Longer moving intervals make existing numbered people visible while preserving source chronology, stage holds, geographic paths and the final arrival window; they create no additional migrants.';
const modulePalette={A:'#e2b56e',S:'#8fcddd',M:'#84b897',E:'#dba16f',R:'#ad9bd4',W:'#df8685',O:'#80bbbf'};
// Stable identity colours belong to this prepared edition; the shared
// renderer remains independent of historical names and identities.
const palette={
 A1:'#edc948',A2:'#4e9ff0',A3:'#f28e2b',A4:'#c58bea',
 A5:'#59c487',A6:'#e96b6b',A7:'#55cbd0',A8:'#f28dbf',
 S1:'#b9d8f4',
 M1:'#a5d66c',M2:'#7797e8',M3:'#dfb161',M4:'#c977aa',
 M5:'#71b8a2',M6:'#bdc75c',M7:'#c59cda',
 E1:'#78bdde',E2:'#e5a34e',E3:'#d37c66',E4:'#8fc99a',E5:'#b29acc',
 R1:'#e6c382',R2:'#7fd5b9',R3:'#ed929a',R4:'#b5bbeb',
 R5:'#9bbf5e',R6:'#e59bc4',R7:'#64aec9',
 W1:'#e68249',W2:'#ad8de5',W3:'#c7a977',W4:'#d97589',W5:'#74c5ca',
 O1:'#d6d878',O2:'#9cc7e8',O3:'#d5a4bd',O4:'#98c6a9',
};
const sample=(coord,radius,id,count=384)=>sampleGermanicLandscape({coord,radiusKm:radius,count,seed:id,name:id});
function root(id,name,coord,central,start=-100,radius=85,group){
 if(reservoirs.some(r=>r.id===id))throw new Error(`Duplicate root ${id}`);
 reservoirs.push({id,name,coord,points:sample(coord,radius,id),initial:central,capacity:central,start,regionId:name,group:group??id,color:palette[group??id]??modulePalette[(group??id)[0]]??'#d1c28b'});return id;
}
const labels=new Map(definitions.map(d=>[d[0],d[1]]));
function add({id,record=id.split('-')[0],name,values,from,nodes,start,end,region,color=palette[record]??modulePalette[record[0]],mode='land-corridor',basis='Illustrative reference-class allocation for the named migration; source population is unknown.',method='Explicit visualization reconstruction',parent,travelYears,radius=90,group=record,tags=[]}){
 if(!values||values[0]>values[1]||values[1]>values[2])throw new Error(`Bad estimate ${id}`);
 const rec=records.find(r=>r.id===record);if(!rec)throw new Error(`Unknown record ${record}`);
 const points=nodes.map((n,i)=>({coord:n.coord??n,name:n.name??(i===0?rec.origin:i===nodes.length-1?region:`Geographic control ${i}`),year:n.year??(start+(end-start)*i/(nodes.length-1)),hold:n.hold,named:!!n.name}));
 function stage(p,i){return{id:`${id}-stage-${i}`,name:p.name,kind:i===0?'origin':i===points.length-1?'destination':'intermediate',sourceRole:i===0?'immediate':i===points.length-1?'destination':'intermediate',coord:p.coord,start:p.year,end:p.hold??p.year,dateLabel:rec.date_label,chronologyKind:'reconstructed-period',uncertain:true,regionId:i===points.length-1?region:p.name,regionName:i===points.length-1?region:p.name,color,precisionKm:radius,basis:reconstructed+' '+GERMANIC_LANDSCAPE_BASIS,sourceRecordIds:[record],sampledArrivalPoints:sample(p.coord,radius,`${id}-${i}`),geographicReview:'inherited-unreviewed'};}
 // Ocean and anonymous geographic controls guide a corridor; they are not
 // resident settlements and must never trigger land sampling or an extra hold.
 const indices=points.map((p,i)=>i).filter(i=>i===0||i===points.length-1||points[i].hold!==undefined||(points[i].named&&loadLandMask().isLand(points[i].coord,8)));
 const stages=indices.map(i=>stage(points[i],i)),corridors=[];
 for(let k=1;k<indices.length;k++){
  const first=indices[k-1],last=indices[k],a=points[first],b=points[last];
  const coordinates=[];
  for(let i=first+1;i<=last;i++){
   const guide=mode==='maritime-crossing'||mode==='mixed'?[points[i-1].coord,points[i].coord]:landGuide(points[i-1].coord,points[i].coord);
   coordinates.push(...(coordinates.length?guide.slice(1):guide));
  }
  corridors.push({id:`${id}-leg-${k}`,fromStageId:stages[k-1].id,toStageId:stages[k].id,coordinates,start:a.hold??a.year,end:b.year,dateLabel:rec.date_label,basis:reconstructed+' Reconstructed guide follows stated hubs, terrain approaches and explicit sea passages; intermediate controls are geometry, not additional source attestations.',certainty:'conjectural',transport:mode,timing:'source-window',sourceRecordIds:[record]});
 }
 const progressionYears=ancientCohortProgression[id];
 const displayBasis=progressionYears?`${basis} Visualization progression: ${progressionYears} moving model years within the unchanged ${start}–${end} CE reconstruction window. ${cohortProgressionBasis}`:basis;
 const est={recordId:id,low:values[0],central:values[1],high:values[2],method,basis:`${modelBasis} ${displayBasis}`,sourceIds:['REPORT'],...(parent?{parentId:parent}:{})};estimates.push(est);
 journeys.push({id,name:name??rec.name,groupId:group,groupName:labels.get(group)??name??rec.name,groupColor:color,recordIds:id===record?[record]:[id,record],linkedRecordIds:parent?[parent]:[],cohortKey:parent??id,populationKnown:false,population:null,uncertain:true,temporalType:record==='W1'?'coerced_transfer':record==='W2'||record==='W3'||record==='W4'||record==='E3'?'forced_displacement':'reconstructed_movement',evidence:'REPORT',inherited:true,excluded:false,dateRange:[start,end],dateLabel:rec.date_label,origin:stages[0],stages:stages.slice(1),corridors,animationAdmission:'estimated-movement',fromSettlementRecordId:from,travelYears:progressionYears??travelYears??(start>=1900?.15:start>=1700?.5:2),source:{collection:'records',ancestralOrigin:rec.origin,immediateOrigin:points[0].name,destination:region,dateLabel:rec.date_label,sourceIds:['REPORT'],notes:[reconstructed,displayBasis],recordStatus:'reconstructed-display-model-unreviewed',raw:rec},tags:['germanic-model',`module:${record[0]}`,'reconstructed',...tags]});
 return id;
}
function alias(id,children,basis){const vals=['low','central','high'].map(k=>children.reduce((n,c)=>n+estimates.find(e=>e.recordId===c)[k],0));estimates.push({recordId:id,low:vals[0],central:vals[1],high:vals[2],method:'Inclusive aggregate of allocated child flows',basis,sourceIds:['REPORT'],includedIn:children[0],render:false});accountingGroups.push({id,children,low:vals[0],central:vals[1],high:vals[2],basis});}
const n=(coord,year,name,hold)=>({coord,year,name,hold});
const rhe=[8.3,50],ulm=[9.99,48.4],vienna=[16.37,48.21],budapest=[19.04,47.5],izmail=[28.83,45.35],odessa=[30.72,46.48],volga=[46.03,51.53],kaz=[71.4,51.2],sib=[73.37,54.99],hamburg=[9.99,53.55],quebec=[-71.2,46.8],canada=[-98.3,49.4],us=[-98,39],germany=[9.5,51],wartegau=[16.9,52.4];

// Ancient coalitions are independent historical cohorts, never medieval ancestors by fiat.
root('ROOT-GOTHS','Wielbark-associated northern Poland',[18.8,54],120000,-100,110,'A1');
add({id:'A1-STAGE',record:'A1',name:'Wielbark–Chernyakhov–Balkan staging',values:[60000,120000,250000],from:'ROOT-GOTHS',nodes:[n([18.8,54],100,'Northern Poland'),n([23.8,51],210,'Vistula–Bug approach'),n([29,48.5],280,'Chernyakhov region',370),n([27.2,44.2],376,'Lower Danube'),n([25.5,42.7],400,'Roman Balkan staging')],start:100,end:400,region:'Balkan Gothic staging',basis:'Source gives no headcount. Small/medium/large coalition reference class 60k/120k/250k; no genetic percentage conversion. Staged inclusive parent of Visigothic and Ostrogothic allocations.'});
add({id:'A1-VIS',record:'A1',name:'Visigothic movement to Aquitaine and Iberia',values:[35000,70000,150000],from:'A1-STAGE',parent:'A1-STAGE',nodes:[n([25.5,42.7],400,'Balkan staging'),n([20.5,44.8],405,'Danube–Sava'),n([13.2,45.8],410,'Northern Adriatic approaches'),n([1.4,43.6],418,'Aquitaine',440),n([-4,39.9],470,'Iberian settlement')],start:400,end:470,region:'Iberia',basis:'Illustrative 7/12 central share of the common Gothic staging cohort; Aquitaine 418 is source chronology, onward dispersion broad reconstruction.'});
add({id:'A1-OST',record:'A1',name:'Ostrogothic Pannonian and Italian movement',values:[25000,50000,100000],from:'A1-STAGE',parent:'A1-STAGE',nodes:[n([25.5,42.7],450,'Balkan staging'),n([19,46.5],475,'Pannonia',488),n([13.4,46],490,'Julian foothills'),n([12.2,44.4],493,'Ravenna / northern Italy')],start:450,end:493,region:'Northern Italy',basis:'Remaining share of the same Gothic staging cohort; Theodoric’s 488–493 campaign is not a census.'});alias('A1',['A1-STAGE'],'Inclusive staged Gothic cohort; VIS and OST are onward allocations, not additional founders.');
for(const [id,coord,val]of[['A2',[17,51.1],80000],['A3',[9,49.5],40000],['A4',[16,52.5],35000],['A5',[11.5,52],100000],['A6',[7,51.5],100000],['A7',[10.5,53.3],100000],['A8',[9.6,54.6],125000]])root(`ROOT-${id}`,labels.get(id)+' source proxy',coord,val,-100,100,id);
add({id:'A2',values:[50000,80000,100000],from:'ROOT-A2',nodes:[n([17,51.1],200,'Oder–Vistula'),n([19,47.5],350,'Tisza / Pannonia',405),n(rhe,406,'Rhine at Mainz'),n([0.6,44.8],408,'Gaul'),n([-6,37.4],409,'Hispania',429),n([-5.5,36.1],429,'Gibraltar departure'),n([-5.7,35.8],429.2,'North African landing'),n([7.75,36.9],435,'Hippo Regius'),n([10.32,36.85],439,'Carthage')],start:200,end:439,region:'North Africa',mode:'mixed',basis:'Supplied 80,000 Vandal–Alan coalition crossing in429; 50k/100k scenario alternatives. Each stage carries the same cohort. Rhine405/406 alternatives retained; intervening controls are reconstructed.'});
add({id:'A3',values:[15000,40000,80000],from:'ROOT-A3',nodes:[n([9,49.5],400,'Southwestern frontier'),n(rhe,406,'Mainz'),n([0.6,44.8],408,'Aquitaine'),n([-1.7,43.3],409,'Western Pyrenean approach'),n([-8.42,41.55],415,'Gallaecia')],start:400,end:415,region:'Gallaecia',basis:'Unquantified distinct Suebic component; illustrative small-coalition15k/40k/80k, not copied from Vandal80k.'});
add({id:'A4',values:[15000,35000,80000],from:'ROOT-A4',nodes:[n([16,52.5],280,'Oder–Vistula'),n([9,50],350,'Main',410),n([8.36,49.63],413,'Worms',436),n([6.14,46.2],443,'Sapaudia / Lake Geneva')],start:280,end:443,region:'Sapaudia',basis:'Supplied15k/35k/80k alternatives concern different historical interpretations and scopes; displayed scenarios are not precise survivor counts. 436 losses retained in evidence, not separately spawned.'});
add({id:'A5',values:[30000,100000,200000],from:'ROOT-A5',nodes:[n([11.5,52],250,'Elbe Germanic basin'),n([9,49.8],260,'Main–Neckar frontier'),n([8.5,48.5],310,'Agri Decumates',360),n([8.5,47.4],500,'Northern Swiss plateau')],start:250,end:500,region:'Alemannic southwest',basis:'Broad regional-settlement reference class30k/100k/200k. Political footprint and linguistic replacement are not a resident census.'});
add({id:'A6',values:[30000,100000,200000],from:'ROOT-A6',nodes:[n([7,51.5],250,'Lower/Middle Rhine'),n([5,51.3],360,'Toxandria'),n([3.4,50.6],450,'Northern Gaul'),n([2.3,48.9],510,'Northern Gaul settlement proxy')],start:250,end:510,region:'Northern Gaul',basis:'Illustrative settlement component only30k/100k/200k. Clovis’s political conquests are not converted into the population of his kingdom.'});
add({id:'A7',values:[50000,100000,200000],from:'ROOT-A7',nodes:[n([10.5,53.3],350,'Lower Elbe'),n([16.6,49.2],500,'Bohemia / Moravia'),n([17.8,46.8],540,'Pannonia / Szólád',568),n([13.4,46.1],568.5,'Cividale'),n([9.16,45.18],572,'Pavia'),n([7.57,45.08],580,'Collegno / Po plain')],start:350,end:580,region:'Northern Italy',basis:'Unquantified coalition reference class50k/100k/200k; genetic kin links support migration, not this headcount.'});
add({id:'A8',values:[50000,125000,250000],from:'ROOT-A8',nodes:[n([9.6,54.6],410,'Continental North Sea zone'),n([5.8,53.2],430,'Frisian coastal departure'),n([0.1,52.2],850,'Eastern and southern England')],start:410,end:850,region:'Eastern England',mode:'maritime-crossing',basis:'Supplied50k/125k/250k historical display reconstruction retained as a model, not a direct conversion of ancestry percentages.'});

// North Germanic settlement and elite/trading cohorts remain distinct from raids.
root('ROOT-NORSE','Scandinavian departure cohorts',[8,60.4],90000,790,160,'S1');
const norse=[];
for(const [suffix,name,values,nodes,start,end,region,mode]of[
 ['DANELAW','Danelaw agrarian settlement',[10000,30000,60000],[[10,56],[3,57],[-1.08,53.96]],850,1000,'Danelaw','maritime-crossing'],
 ['DUBLIN','Norse-Gaelic Irish settlement',[1000,5000,12000],[[5.3,60.4],[-3,59],[-6.26,53.35]],840,950,'Dublin and Irish coasts','maritime-crossing'],
 ['SCOTLAND','Scottish isles settlement',[1000,4000,10000],[[5.3,60.4],[-1,59],[-6.5,58.2]],800,1000,'Scottish isles','maritime-crossing'],
 ['NORMANDY','Normandy Scandinavian settlement',[3000,10000,20000],[[10,56],[3,54],[1.1,49.4]],880,980,'Normandy','maritime-crossing'],
 ['FRISIA','Scandinavian Frisian settlement component',[500,2000,5000],[[10,56],[6,54],[5.3,52.9]],840,900,'Frisian coast','maritime-crossing'],
 ['DNIEPER','Varangian Dnieper trading and elite cohort',[1000,5000,12000],[[18.1,59.3],[29,60],[31.3,58.5],[32.8,54.8],[30.52,50.45],[32,46.6]],800,1050,'Dnieper corridor','mixed'],
 ['VOLGA','Rus’ Volga trading cohort',[500,3000,8000],[[18.1,59.3],[29,60],[31.3,58.5],[35,57],[44,56],[48,47]],850,1050,'Volga–Caspian corridor','mixed'],
 ['FAROE','Faroe island colonization',[500,1500,3000],[[5.3,60.4],[-2,61],[-6.8,62]],825,930,'Faroe Islands','maritime-crossing'],
 ['ICELAND','Iceland Norse settlement',[10000,12500,25000],[[5.3,60.4],[-6.8,62],[-15,63.8],[-21.9,64.1]],870,930,'Iceland','maritime-crossing'],
])norse.push(add({id:`S1-${suffix}`,record:'S1',name,values,from:'ROOT-NORSE',nodes,start,end,region,mode,basis:suffix==='ICELAND'?'Supplied central10k–15k band midpoint12,500, high25k; low10k is a plausible settlement scenario. The80–150 theoretical viability threshold is retained as context and is not a measured founder flow.':'Source headcount unknown. Explicit illustrative settlement/trading reference class; raids, royal jurisdiction and trade influence add no other residents.'}));
add({id:'S1-GREENLAND',record:'S1',name:'Icelandic relay to Greenland',values:[1000,2000,5000],from:'S1-ICELAND',parent:'S1-ICELAND',nodes:[[-21.9,64.1],[-30,63],[-43,60],[-45.5,61]],start:985,end:1010,region:'Greenland Norse settlements',mode:'maritime-crossing',basis:'Supplied1k–2.5k central band represented by2k, high5k. Drawn from Icelandic cohort, not a new Scandinavian founding copy. Colony disappearance by1450 remains contextual; this migration-history display does not model mortality.'});
add({id:'S1-VINLAND',record:'S1',name:'Short-lived North American outpost',values:[30,100,300],from:'S1-GREENLAND',parent:'S1-GREENLAND',nodes:[[-45.5,61],[-53,57],[-55.5,51.6]],start:1000,end:1020,region:'Norse North American outpost',mode:'maritime-crossing',basis:'Illustrative temporary expedition30/100/300 people, not permanent population or descendants. Drawn from Greenland; Vinland/Markland/Helluland labels remain broad geography.'});alias('S1',norse,'Distinct North Germanic founding allocations; Greenland and the Vinland expedition are onward subsets. Theoretical minimum viability is not used as migration low.');

// Medieval inclusive allocations: Prussia belongs to the Kuhn200k model.
root('ROOT-MEDIEVAL','Western imperial and Low Countries settlement source',[8,51],500000,1100,220,'M1');
const m1=[];
for(const [id,central,region,nodes]of[['M1-ELBE',60000,'Trans-Elbia / Brandenburg',[[5.1,52.1],[9.9,51.5],[11.6,52.1],[13.4,52.5]]],['M1-POMERANIA',45000,'Pomerania',[[8,52],[11.6,52.1],[14.5,53.4],[16.5,54]]],['M1-SILESIA',45000,'Silesia',[[8,51],[11.6,51],[14.5,51.1],[17,51.1]]],['M1-POLAND',20000,'Polish charter towns',[[8,51],[13.5,51.2],[17,51.1],[19.9,50.1]]],['M3-MEDIEVAL',30000,'West and East Prussia',[[9.9,51.5],[14.5,52.5],[18.6,53.01],[18.65,54.35],[20.45,54.71]]]])m1.push(add({id,record:id.startsWith('M3')?'M3':'M1',values:[central*.75,central,central*1.5],from:'ROOT-MEDIEVAL',nodes,start:1100,end:1347,region,basis:'Allocated share of supplied Kuhn150k/200k/300k rural-settler scenario. Prussian medieval settlers are included once in the M1 total; modern destination stocks are not substituted.'}));alias('M1',m1,'Kuhn-inclusive primary rural settlement150k/200k/300k, including M3 medieval allocation.');
add({id:'M3-SALZBURG',record:'M3',name:'Salzburg Protestant resettlement to East Prussia',values:[10000,15000,20000],from:root('ROOT-SALZBURG','Salzburg expellee source',[13,47.8],15000,1731,40,'M3'),nodes:[[13,47.8],[13.4,52.5],[18.6,54.2],[20.5,54.6]],start:1731,end:1733,region:'East Prussia',basis:'Source states thousands, not an exact number. Illustrative10k/15k/20k regional recruitment scenario; Swiss and Palatine components remain in this broad Peuplierung context.'});alias('M3',['M3-MEDIEVAL','M3-SALZBURG'],'Two distinct periods; medieval30k share is also included in M1. These inclusive catalogue aggregates must not be summed.');
add({id:'M2',values:[10000,15000,25000],from:'ROOT-MEDIEVAL',nodes:[[7.62,51.96],[10.69,53.87],[14,55.2],[20,56.2],[24.11,56.95],[24.75,59.44]],start:1200,end:1340,region:'Baltic German urban and manor communities',mode:'mixed',basis:'Source15k is an early14th-century resident stock, not a measured arrival flow. Display15k is an explicitly independent order-of-magnitude founder proxy with10k/25k bounds, not a census conversion.'});
add({id:'M4',values:[30000,70000,140000],from:'ROOT-MEDIEVAL',nodes:[[11.5,49.5],[12.3,49.6],[13,50.4],[15,50.7]],start:1150,end:1350,region:'Bohemian and Moravian borderlands',basis:'Source flow unknown; regional rural/urban settlement reference class30k/70k/140k. The3m twentieth-century stock is retained as context.'});
const m5=[];for(const [suffix,central,region,nodes]of[['PRESSBURG',6000,'Pressburg / Bratislava',[[13,48.3],vienna,[17.11,48.15]]],['HAUERLAND',6000,'Hauerland / Kremnica',[[13.5,50],[17,49.5],[18.92,48.7]]],['ZIPS',8000,'Spiš / Zips',[[13.5,51],[17,50],[20.59,49.03]]]])m5.push(add({id:`M5-${suffix}`,record:'M5',values:[central*.5,central,central*2],from:'ROOT-MEDIEVAL',nodes,start:1200,end:1450,region,basis:'Unquantified chartered miner/urban/agricultural communities; illustrative total10k/20k/40k split across the three source clusters.'}));alias('M5',m5,'Three nonoverlapping destination shares; no copy of all Slovakia residents on each town.');
const m6=[];for(const [suffix,share,region,dest]of[['SIBIU',.6,'Sibiu / Hermannstadt',[24.15,45.8]],['BRASOV',.25,'Brașov / Kronstadt',[25.6,45.65]],['BISTRITA',.15,'Bistrița / Bistritz',[24.5,47.13]]])m6.push(add({id:`M6-${suffix}`,record:'M6',values:[2600*share,15000*share,25000*share],from:'ROOT-MEDIEVAL',nodes:[[6.64,49.75],[9,49],vienna,budapest,[20.8,46.15],[23.3,46],dest],start:1150,end:1300,region,basis:'Supplied founder lower anchor520 farmsteads×5 people=2,600; cumulative central15k/high25k. Display shares60/25/15% are illustrative, not local enumerations. Origin follows Moselle/Low Countries, not Saxony by label.'}));alias('M6',m6,'Shared2.6k/15k/25k colonization divided once among Sibiu, Burzenland and Nösnergau.');
add({id:'M7',values:[1500,3000,5000],from:'ROOT-MEDIEVAL',nodes:[[12.77,46.83],[13.49,46.8],[14.2,46.3],[14.86,45.64]],start:1300,end:1330,region:'Gottschee / Kočevje',basis:'Supplied1.5k/3k/5k founder reconstruction; later26k–28k stock is not the medieval migration.'});

// Early modern relays. Vistula mother communities fund their later branch.
add({id:'E1-DELTA',record:'E1',values:[10000,25000,50000],from:root('ROOT-VISTULA','Low Countries religious and agrarian source',[5.8,53.2],25000,1530,150,'E1'),nodes:[[5.8,53.2],[7,54],[12,55],[18.95,54.2]],start:1530,end:1770,region:'Vistula Delta',mode:'maritime-crossing',basis:'Unknown founders; illustrative10k/25k/50k combined refuge/agrarian reference class. No conversion of centuries of Plautdietsch development into extra migrants.'});
add({id:'E1-POLAND',record:'E1',name:'Vistula and Congress Poland agrarian relay',values:[50000,120000,220000],from:root('ROOT-CONGRESS','Vistula valley subsequent-generation source',[18.95,54.2],120000,1700,90,'E1'),nodes:[[18.95,54.2],[18.6,53.01],[19.5,52.6],[21.01,52.23]],start:1700,end:1850,region:'Congress Poland',basis:'Separate later-generation agrarian departure prior; illustrative50k/120k/220k. This is not an asserted survival count of the1530 founders.'});alias('E1',['E1-DELTA','E1-POLAND'],'Different generational waves and counting scopes; catalogue total is not a unique-person count across centuries.');
root('ROOT-HABSBURG','Habsburg recruited settlement source',[8,49],190000,1686,220,'E4');
const e4=[];for(const [suffix,central,region,dest,start,end]of[['CAROLINE',35000,'Banat',[21.23,45.75],1718,1737],['THERESIAN',55000,'Bačka / Banat',[19.11,45.77],1744,1772],['JOSEPHINE',40000,'Slavonia–Syrmia',[18.9,45.2],1782,1787],['TURKEY',10000,'Swabian Turkey',[18.23,46.07],1686,1829],['SATHMAR',10000,'Sathmar / Satu Mare',[22.88,47.79],1712,1815]])e4.push(add({id:`${suffix==='SATHMAR'?'E2':'E4'}-${suffix}`,record:suffix==='SATHMAR'?'E2':'E4',values:[central*.8,central,central*4/3],from:'ROOT-HABSBURG',nodes:[suffix==='SATHMAR'?[9.61,47.78]:[8,49],ulm,vienna,budapest,dest],start,end,region,basis:'Allocated from supplied120k/150k/200k Habsburg colonization scenario, including Sathmar share once. Sathmar origin is Upper Swabia near Ravensburg; other Danube Swabian labels do not make every origin Swabia.'}));alias('E4',e4,'Habsburg120k/150k/200k inclusive scenario; Sathmar E2 is included once.');alias('E2',['E2-SATHMAR'],'Sathmar share of E4 aggregate, not an extra colonization total.');
add({id:'E3',values:[624,4000,4500],from:'ROOT-HABSBURG',nodes:[[13.62,47.64],vienna,budapest,[20.8,46.15],[24.05,45.79]],start:1734,end:1776,region:'Landler villages near Sibiu',basis:'Supplied624 early transport lower anchor,4k total18th-century central,4.5k upper; different subperiod scopes retained.'});
const e5=[];for(const [suffix,values,region,nodes]of[['GALICIA',[5000,15000,30000],'Galicia',[[8,49],[13.5,50],[18,49.5],[24.03,49.84]]],['BUKOVINA',[3000,8000,15000],'Bukovina',[[8,49],vienna,budapest,[22.5,47.5],[25.92,47.84]]],['ZIPS',[500,2000,4000],'Maramureș and Bukovina Zipser colonies',[[20.59,49.03],[22.5,48],[24.43,47.72],[25.92,47.84]]]])e5.push(add({id:`E5-${suffix}`,record:'E5',values,from:'ROOT-HABSBURG',nodes,start:1775,end:1855,region,basis:'Unknown settlers; illustrative agrarian/miner reference-class allocation5/15/30k Galicia,3/8/15k Bukovina,0.5/2/4k Zipser relay. Secondary origin alternatives retained.'}));alias('E5',e5,'Distinct destination shares; later95,819 Bukovina evacuees are stocks of later generations.');

// Russian imperial mother colonies and relay hubs.
add({id:'R1',values:[23383,26676,30000],from:root('ROOT-VOLGA','Volga colonist departure cohort',[8.68,50.58],26676,1764,150,'R1'),nodes:[n([8.68,50.58],1764,'Hessian / Rhineland recruits'),n([10.69,53.87],1764.5,'Lübeck'),n([20,57],1765,'Baltic passage'),n([29.77,59.91],1765.5,'Kronstadt / Oranienbaum'),n([35,57],1766,'Northwestern Russian river/land approach'),n([42,55],1766.5,'Middle Volga approach'),n(volga,1767,'Lower Volga colonies')],start:1764,end:1767,region:'Lower Volga',mode:'mixed',basis:'26,676 dispatched is the central migration measure;23,383 survivors and3,293 deaths are separately preserved source units. Arrival survival is not simulated by extra people; high30k includes wider paths. The displayed central cohort measures departures, not surviving1767 residents.'});
const r2=[];for(const [suffix,central,dest,start,end]of[['CHORTITZA',2000,[35.07,47.82],1789,1790],['MOLOTSCHNA',6000,[35.59,47.2],1804,1830],['SAMARA',1000,[50.1,53.2],1853,1854]])r2.push(add({id:`R2-${suffix}`,record:'R2',values:[central*1100/9000,central,central*12000/9000],from:'E1-DELTA',parent:'E1-DELTA',nodes:[[18.95,54.2],[23.5,52],[28,51],[33.41,49.06],dest],start,end,region:suffix==='SAMARA'?'Samara / Am Trakt':'Southern Ukrainian Mennonite colonies',basis:'Supplied8k–10k central cumulative band midpoint9k, high12k, lower first-wave1,100 persons. Shares2k/6k/1k are explicit illustrative partitions;228 families × approximately5 gives first-wave~1,100. Draws from Vistula hub.'}));alias('R2',r2,'Single cumulative Mennonite emigrant allocation; subsequent treks are transfers.');
const r3=[];for(const [suffix,values,region,nodes,start,end,mode]of[
['ODESSA',[20000,40000,70000],'Odessa / Black Sea enclaves',[[9.18,48.78],ulm,vienna,budapest,[22,44.6],izmail,odessa],1804,1827,'mixed'],
['CRIMEA',[4000,8000,15000],'Crimea',[[9.18,48.78],ulm,vienna,budapest,izmail,odessa,[33,46.8],[34.1,44.95]],1804,1827,'mixed'],
['BESS-POLAND',[3538.4,3600,4000],'Bessarabia / Budjak',[[21.01,52.23],[24,50.5],[26,48.3],[29.15,46.19]],1814,1842,'land-corridor'],
['BESS-DANUBE',[5307.6,5400,6000],'Bessarabia / Budjak',[[9.18,48.78],ulm,vienna,budapest,[22,44.6],izmail,[29.15,46.19]],1814,1842,'mixed'],
])r3.push(add({id:`R3-${suffix}`,record:'R3',values,from:suffix==='BESS-POLAND'?'E1-POLAND':root(`ROOT-R3-${suffix}`,`${region} recruited founders`,nodes[0],values[1],1804,110,'R3'),...(suffix==='BESS-POLAND'?{parent:'E1-POLAND'}:{}),nodes,start,end,region,mode,basis:suffix.startsWith('BESS')?'Supplied8,846/9,000/10,000 Bessarabian scenario divided40% Polish overland /60% Danube illustrative route shares. ~10% mortality remains separate;93,3421940 evacuees are not founders.':'Source arrival headcount unknown; explicit regional colony reference-class scenario. Mother colonies are not inferred from modern population stocks.'}));alias('R3',r3,'Separate Black Sea/Crimean founder estimates plus Bessarabia9k split once across routes.');
const r4=[];for(const [suffix,values,region,nodes,start,end]of[['SOUTH',[2000,2500,5000],'Georgia and Azerbaijan',[[9.18,48.78],ulm,vienna,budapest,izmail,odessa,[37.8,45],[44.83,41.69],[46.32,40.58]],1817,1819],['NORTH',[10000,17500,25000],'North Caucasus',[[46.03,51.53],[44,48],[43,45],[44,44]],1850,1900]])r4.push(add({id:`R4-${suffix}`,record:'R4',values,from:root(`ROOT-R4-${suffix}`,`${region} departure generation`,nodes[0],values[1],start,100,'R4'),nodes,start,end,region,mode:suffix==='SOUTH'?'mixed':'land-corridor',basis:suffix==='SOUTH'?'~500 reaching families ×4–5 persons motivates2k–2.5k; central2,500. ~1,400 leaving families and lost/diverted families remain separate, not the arriving founder flow.':'Supplied15k–20k daughter-colonist central band midpoint17,500; low10k/high25k explicit reconstruction of unknown total.'}));alias('R4',r4,'North and South Caucasus are separate founder components, not a copy of100k1941 residents each.');
add({id:'R5-FOUNDERS',record:'R5',values:[40000,70000,110000],from:'E1-POLAND',parent:'E1-POLAND',nodes:[[21.01,52.23],[23.5,51.5],[25.3,50.7],[28.66,50.25]],start:1816,end:1914,region:'Volhynia',basis:'70k is a1860s stock, not documented cumulative arrivals. Central70k is an explicit founder-scale proxy, low40k/high110k; later200k1915 residents kept separately.'});
add({id:'R5-EXILE',record:'R5',name:'Volhynian wartime exile1915–1916',values:[70000,110000,200000],from:root('ROOT-VOLHYNIA-1915','Volhynian1915 departure generation',[28.66,50.25],110000,1915,130,'R5'),nodes:[[28.66,50.25],[30.52,50.45],volga,[55,53],sib],start:1915,end:1916,region:'Volga and Siberian exile',basis:'Source70k/100k–120k/150k–200k competing scopes: central110k, high200k. This later-generation baseline is separate from19th-century founder proxy; survival, return and mortality not fully modeled.'});alias('R5',['R5-FOUNDERS'],'Founder flow alias only; exile is a sequential later-generation episode, never added as distinct ancestry.');
add({id:'R6-TALAS',record:'R6',values:[100,500,1000],from:'R2-SAMARA',parent:'R2-SAMARA',nodes:[[50.1,53.2],[56,49],[64,45],[71.37,42.9]],start:1880,end:1881,region:'Talas valley',basis:'Five wagon trains unquantified; approximate half-trek branch uses200/500/1k illustrative people. No conversion of all regional Germans into trekkers.'});
add({id:'R6-KHIVA',record:'R6',values:[300,500,1000],from:'R2-MOLOTSCHNA',parent:'R2-MOLOTSCHNA',nodes:[[35.59,47.2],volga,[56,49],[64,45],[69.24,41.3],[60.35,41.32]],start:1880,end:1884,region:'Khiva / Ak-Metchet',basis:'62 families at Lausan and39 remaining families are distinct source counts. Broad200/500/1k display scenario; exact membership not documented.'});
add({id:'R6-KANSAS',record:'R6',name:'Central Asian Mennonite relay to Kansas',values:[80,115,180],from:'R6-KHIVA',parent:'R6-KHIVA',nodes:[[60.35,41.32],[45,47],[25,52],hamburg,[-20,52],[-55,45],[-74,40.7],[-97,38]],start:1884,end:1885,region:'Kansas / Nebraska',mode:'mixed',basis:'23 returning families ×5 persons central115; alternative household4–8 yields80–180 rounded. Inclusive part of overseas pool, not modern descendants.'});
add({id:'R6-TAJIK',record:'R6',name:'Ak-Metchet forced removal to Tajikistan',values:[200,340,500],from:'R6-KHIVA',parent:'R6-KHIVA',nodes:[[60.35,41.32],[64,40],[68.8,38.6]],start:1935,end:1936,region:'Tajikistan',basis:'Source3401920s residents used as explicit1935 deportee proxy, not a measured transport manifest;200/500 alternatives. Same Khiva cohort.'});alias('R6',['R6-TALAS','R6-KHIVA'],'Two founding branches; Kansas and Tajikistan are onward transfers.');

// Pre-war eastern waves: mixed Polish/German totals never become all-German.
const r7=[];
for(const [suffix,central,start,end,region,dest,basis]of[
['PIONEER',10000,1882,1905,'Kazakh pioneer colonies',[71.4,51.2],'Illustrative5k/10k/20k pioneer inflow;1897 stock2,613–7,049 is kept as stock, not exact arrivals.'],
['STOLYPIN',70000,1906,1926,'Western Siberian / northern Kazakh farms',sib,'Illustrative35k/70k/140k combined Stolypin-era and famine-flight migration; source no disaggregated arrival total.'],
['KULAK',25000,1930,1931,'Kazakh special settlements',[73.1,49.8],'German-only subset unknown. Explicit12.5k/25k/50k visualization assignment; not the1.8m USSR-wide exiled population.'],
['BORDER',15000,1935,1936,'North Kazakhstan / Tainsha',[69.76,53.85],'Explicit7.5k/15k/30k German subset scenario.45,000/60,000 source mixed Polish/German totals are retained and never relabelled all-German.'],
])r7.push(add({id:`R7-${suffix}`,record:'R7',values:[central*.5,central,central*2],from:root(`ROOT-R7-${suffix}`,`Pre-war ${suffix} departure generation`,suffix==='BORDER'?[28.66,50.25]:volga,central,start,100,'R7'),nodes:[suffix==='BORDER'?[28.66,50.25]:volga,[55,53],[63,54],dest],start,end,region,basis}));alias('R7',r7,'Distinct pre-war flow scenarios;231,301 combined eastern stock and92,571 Kazakhstan1939 stock are contextual baselines, not these arrivals summed.');

// Wartime cohorts are sequentially debited. Modern baselines are separate
// generational priors; this is a migration-history model, not a regional census.
const w1Origins=[
['BALTIC',76895,[24.11,56.95],1939,1941,'Baltic German'],['LITHUANIA',51076,[23.9,54.9],1941,1941.9,'Lithuanian German'],['VOLHYNIA',136958,[25.3,50.7],1939,1940.8,'Volhynia/Galicia/Narew'],['LUBLIN',32960,[23.5,51.1],1940,1941,'Eastern Government-General'],['BESSARABIA',93342,[29.15,46.19],1940,1941,'Bessarabian'],['NBUKOVINA',43670,[25.94,48.29],1940,1941,'Northern Bukovina'],['SBUKOVINA',52149,[25.92,47.84],1940,1941,'Southern Bukovina'],['DOBRUJA',15454,[28.2,44.8],1940,1941,'Dobruja'],['REGAT',10115,[26.1,44.4],1940,1941,'Romanian Regat'],['GOTTSCHEE',15008,[14.86,45.64],1941,1942,'Gottschee/Ljubljana'],['UKRAINE',350000,[31.5,47.3],1943,1944,'Black Sea/Ukraine'],['TYROL',88630,[11.35,46.5],1939,1944,'South Tyrol'],['FRANCE',19226,[7,48.5],1940,1944,'France'],['SEEUROPE',23630,[18.5,44],1941,1944,'Southeastern European'],
];
const w1=[];
for(const [suffix,total,origin,start,end,label]of w1Origins){
 const id=`W1-${suffix}`; w1.push(add({id,record:'W1',name:`Heim ins Reich · ${label}`,values:[total,total,total],from:root(`ROOT-${id}`,`${label}1939–1944 departure stock`,origin,total,start,80,'W1'),nodes:[origin,...(suffix==='BALTIC'?[[20,56],[14,54.5]]:[]),suffix==='GOTTSCHEE'?[15.6,45.9]:wartegau],start,end,region:suffix==='GOTTSCHEE'?'Lower Styria':'Wartime resettlement hubs',mode:suffix==='BALTIC'?'mixed':'land-corridor',travelYears:.12,basis:'Exact reported component of RKFDV1 June1944 total1,009,113. Annexed eastern placements662,448 are a subset, never another population. Destination to common transfer hub is reconstructed; not every resettler was placed in Warthegau. This is a later-generation stock prior, not founder-flow inflation.'}));
}
alias('W1',w1,'All reported origin components sum1,009,113 transfers.662,448 placements are a subset of these same people.');
const w2=[];
for(const [suffix,central,origin,region,dest]of[['VOLGA-KAZ',220000,volga,'Kazakhstan',kaz],['VOLGA-SIB',218280,volga,'Siberia',sib],['CRIMEA',60000,[34.1,44.95],'Kazakhstan',kaz],['CAUCASUS',100000,[44.8,42],'Kazakhstan',[73.1,49.8]],['UKRAINE',230000,[36,49],'Siberia',sib],['URBAN',121720,[37.6,55.7],'Siberia',sib]])w2.push(add({id:`W2-${suffix}`,record:'W2',name:`Soviet deportation · ${suffix}`,values:[central*799459/950000,central,central*1209430/950000],from:root(`ROOT-W2-${suffix}`,`${suffix}1941 departure generation`,origin,central,1941,75,'W2'),nodes:[origin,...(suffix==='CAUCASUS'?[[49.8,40.4],[51.2,43.6]]:[[48,53],[58,54]]),dest],start:1941,end:1942,region,mode:suffix==='CAUCASUS'?'mixed':'land-corridor',travelYears:.12,basis:'Allocated from supplied799,459/950,000/1,209,430 alternative wartime scopes; central Volga438,280 split220k/218,280, Crimean60k, Caucasus100k, Ukrainian230k, urban remainder121,720. Exact regional splits beyond stated anchors are model choices. Pre-war eastern231,301 are excluded from these deportations.'}));
// A subset moves to labor columns, then back to the same eastern stock chain.
const labour=[];
for(const [parent,central]of[['W2-VOLGA-KAZ',120000],['W2-VOLGA-SIB',100000],['W2-UKRAINE',75000],['W2-CAUCASUS',20000]])labour.push(add({id:`${parent}-LABOUR`,record:'W2',name:'Trudarmiya subset · '+parent,values:[central*.75,central,central*1.1],from:parent,parent,nodes:[journeys.find(j=>j.id===parent).stages.at(-1).coord,[61,58]],start:1942,end:1945,region:'Urals forced-labour columns',travelYears:.12,basis:'Part of supplied315,000 mobilizations; transferred from deportee stock, not an extra315kexternal migrants. Deaths60k–70k are retained separately, not represented as residents.'}));
for(const [i,parent]of labour.entries()){const est=estimates.find(e=>e.recordId===parent);add({id:`W2-LABOUR-RETURN-${i}`,record:'W2',name:'Labor-column release to eastern settlement',values:[est.low,est.central,est.high],from:parent,parent,nodes:[[61,58],i%2?sib:kaz],start:1948,end:1950,region:i%2?'Siberia':'Kazakhstan',travelYears:.12,basis:'Same labor-column display cohort returning; source does not enumerate individual survivors. Mortality not simulated, so this is an upper surviving-cohort trajectory.'});}
const repatriate=add({id:'W2-REPATRIATION',record:'W2',name:'Forced Soviet repatriation of wartime resettlers',values:[280000,300000,300000],from:'W1-UKRAINE',parent:'W1-UKRAINE',nodes:[wartegau,[30,52],[48,53],[58,54],kaz],start:1945,end:1947,region:'Soviet eastern special settlements',travelYears:.12,basis:'Source280k–310k alternative range retained. This linked display uses280k/300k/300k so simultaneous independent upper bounds do not overdraw the fixed350k W1 parent; a310k repatriation scenario would require reducing its expulsion complement to40k. Same people, not added to Heim ins Reich or wartime-deportation root total.'});alias('W2',w2,'Initial wartime-deportation scenarios only. Trudarmiya and forced repatriates are separately linked subsets, not extra initial deportees.');

const w3=[];for(const [suffix,total,origin]of[['EAST',155262,[17,51.5]],['ROMANIA',67332,[24.15,45.8]],['HUNGARY',31920,budapest],['YUGOSLAVIA',12579,[19.5,45.5]],['SBZ',4579,[13.4,52.5]]])w3.push(add({id:`W3-${suffix}`,record:'W3',values:[total,total*295000/271672,total*600000/271672],from:root(`ROOT-W3-${suffix}`,`Foreign civilian ${suffix} roundup cohort`,origin,total*295000/271672,1944.9,80,'W3'),nodes:[origin,[30,49],[37.8,48]],start:1944.9,end:1945.5,region:'Donbas / Soviet foreign-civilian labor camps',travelYears:.12,basis:'271,672 GUPVI arrival lower scenario partitioned by source origin counts.295k central and600k broad Red Cross upper include different scopes, retained as scenarios, not confidence intervals.201,464 returned and66,456 dead/withdrawn are separate source outcomes.'}));
const w3returns=[];for(const parent of w3){const e=estimates.find(e=>e.recordId===parent),fraction=201464/271672;w3returns.push(add({id:`${parent}-RETURN`,record:'W3',name:'GUPVI repatriation · '+parent,values:[e.low*fraction,e.central*fraction,e.high*fraction],from:parent,parent,nodes:[[37.8,48],[25,51],[14.55,52.34]],start:1946,end:1949,region:'Postwar return hubs / Frankfurt an der Oder',travelYears:.12,basis:'201,464 reported returns allocated proportionally to source components; proportional destination choice is a reconstruction. Same foreign-internee cohort.'}));}alias('W3',w3,'Foreign civilian arrivals distinct from Soviet-citizen W2 deportations. Repatriated survivors are onward transfers.');

const w4=[];
// Full W1 cohort is displaced again, except300k Soviet repatriates.
for(const parent of w1){const e=estimates.find(e=>e.recordId===parent),central=e.central-(parent==='W1-UKRAINE'?300000:0);if(central<=0)continue;w4.push(add({id:`W4-FROM-${parent}`,record:'W4',name:'Postwar displacement of '+parent,values:[central*.9,central,central],from:parent,parent,nodes:[journeys.find(j=>j.id===parent).stages.at(-1).coord,[13,51],germany],start:1944.9,end:1950,region:'Postwar Germany',travelYears:.12,basis:'Same wartime resettler cohort moves again. Ukrainian W1 share excludes300k sent to Soviet repatriation. All these transfers are included in the W4 aggregate, not added on top.'}));}
const w1Expellees=1009113-300000;
const w4Total=12300000,w4Low=11600000,w4High=12750000,w4Residual=w4Total-w1Expellees;
const origins=[['ODERN',.64,[17,52]],['CZECH',.25,[15,50]],['HUNGARY',.018,budapest],['YUGOSLAVIA',.026,[19.2,45.5]],['ROMANIA',.019,[24.1,46]],['OTHER',.047,[20,50]]];
for(const [suffix,share,origin]of origins){const central=w4Residual*share;w4.push(add({id:`W4-${suffix}`,record:'W4',name:`Flight/expulsion · ${suffix}`,values:[(w4Low-w1Expellees*.9)*share,central,(w4High-w1Expellees)*share],from:root(`ROOT-W4-${suffix}`,`${suffix}1944 remaining departure stock`,origin,central,1944,120,'W4'),nodes:[origin,[14,51],suffix==='YUGOSLAVIA'?vienna:germany],start:1944,end:1950,region:suffix==='YUGOSLAVIA'?'Austria':'Postwar Germany',travelYears:.12,basis:'Residual of scoped1950 flow scenario11.6m/12.3m/12.75m after linked wartime-resettler shares. Regional proportions64/25/1.8/2.6/1.9/4.7% are model allocations, not censuses. Romania component means wartime evacuees and returnees, not a claim of general postwar Romanian mass expulsion.1966/1982 offspring totals excluded.'}));}alias('W4',w4,'Scoped1950 total11.6m/12.3m/12.75m; earlier W1 cohorts are included once through parent debit. Later-born expellee descendants14.6m/16.22m are not flows.');

// Return migration from surviving eastern stocks; growing later generations
// are an explicit additional baseline, not a copy of all previous deportees.
const w5=[];
const ussrReturns=[], ussrRegistered=2334334;
// Existing eastern cohorts are debited first. A fixed allocation across
// scenarios keeps the exact BVA count compatible with all parent bounds.
const easternSources=[...w2,...labour.map((_,i)=>`W2-LABOUR-RETURN-${i}`),repatriate,...r7];
for(const parent of easternSources){
 const sourceEstimate=estimates.find(e=>e.recordId===parent);
 const children=estimates.filter(e=>e.parentId===parent&&e.render!==false);
 const available=['low','central','high'].map(k=>sourceEstimate[k]-children.reduce((n,e)=>n+e[k],0));
 if(available.some(v=>v<-.01))throw new Error(`${parent}: pre-return children exceed source cohort`);
 const total=Math.floor(Math.max(0,Math.min(...available))*.8);
 if(!total)continue;
 const origin=journeys.find(j=>j.id===parent).stages.at(-1).coord;
 const id=add({id:`W5-USSR-FROM-${parent}`,record:'W5',name:`Aussiedler return from linked ${parent}`,values:[total,total,total],from:parent,parent,nodes:[origin,[58,54],[37,55],[25,53],germany],start:1987,end:2005,region:'Federal Republic of Germany',travelYears:.12,basis:'Linked part of the exact2,334,334 BVA former-USSR component. The same existing eastern cohort is debited, including labor-column releases, repatriates and pre-war migration cohorts. Display allocation is80% of the minimum available parent balance across scenarios, held fixed so BVA totals stay comparable; this is a bookkeeping allocation, not an observed survival or return rate. Other existing members remain as non-returning/unknown-outcome historical cohorts.'});
 ussrReturns.push(id);w5.push(id);
}
const linkedUSSR=ussrReturns.reduce((n,id)=>n+estimates.find(e=>e.recordId===id).central,0),ussrResidual=ussrRegistered-linkedUSSR;
if(ussrResidual<0)throw new Error('Linked Soviet returns exceed exact BVA component');
if(ussrResidual){const id=add({id:'W5-USSR-GENERATION-RESIDUAL',record:'W5',name:'Former-USSR subsequent-generation return residual',values:[ussrResidual,ussrResidual,ussrResidual],from:root('ROOT-W5-USSR-RESIDUAL','Subsequent-generation former-USSR return-eligible residual',kaz,ussrResidual,1987,150,'W5'),nodes:[kaz,[58,54],[37,55],[25,53],germany],start:1987,end:2005,region:'Federal Republic of Germany',travelYears:.12,basis:`Exact BVA former-USSR2,334,334 minus${linkedUSSR} debited from existing eastern model stocks leaves${ussrResidual}. This explicit later-generation/residual baseline covers births and unlinked surviving source components; it does not duplicate the full earlier deportee population. Genealogical completeness, fertility and mortality are not inferred.`});ussrReturns.push(id);w5.push(id);}
alias('W5-USSR',ussrReturns,'Exact former-USSR BVA component2,334,334: linked eastern-stock debits plus declared later-generation residual.');
for(const [suffix,total,origin,start,end]of[['POLAND',1444847,[18,52],1950,2005],['ROMANIA',430101,[24.15,45.8],1960,2005],['CZECH',105095,[17,49],1950,2005],['YUGOSLAVIA',90378,[19.2,45.5],1950,2005],['HUNGARY',21411,budapest,1950,2005],['OTHER',55716,[25,50],1950,2005]])w5.push(add({id:`W5-${suffix}`,record:'W5',values:[total,total,total],from:root(`ROOT-W5-${suffix}`,`${suffix}post1950 return-eligible generation`,origin,total,start,150,'W5'),nodes:[origin,germany],start,end,region:'Federal Republic of Germany',travelYears:.12,basis:'Exact BVA1950–2005 origin component. Seven origin components, including linked-USSR plus residual, sum4,481,882. Departure profiles are broad reconstructed intervals. Source later4.5m–4.6m totals and2020 living stock2.5m remain distinct. Non-USSR origins use separately declared post1950 departure-generation baselines because the report does not identify individual survivor links to every earlier episode.'}));alias('W5',w5,'Exact1950–2005 registered scope4,481,882. Former-USSR share first debits existing eastern stocks; only its unlinked later-generation residual enters as a new baseline. Later registrations remain evidence/context without a copied later total.');

// Overseas total is allocated once. Secondary routes are debit-linked so the
// same people do not appear anew at every harbour or Mennonite relay.
const overseas=[],overseasRoot=root('ROOT-OVERSEAS','Overseas emigrant source generation',hamburg,6750000,1683,180,'O1');
const sea=(destination,extra=[])=>[hamburg,[3,54],[-6,50],[-25,45],[-48,38],...extra,destination];
function ocean(id,record,name,central,nodes,start,end,region,values){overseas.push(add({id,record,name,values:values??[central*6000000/6750000,central,central*7500000/6750000],from:overseasRoot,nodes,start,end,region,mode:'mixed',basis:'Allocated once from6m/6.75m/7.5m total overseas scenario. Empirical arrival anchors retained where supplied; residual destinations and geographic splits are visualization assumptions, not modern descendant counts.'}));return id;}
ocean('O1-US-COLONIAL','O1','Pennsylvania German colonial settlement',100000,sea([-75.2,40]),1683,1783,'Pennsylvania');
ocean('O1-US-1815','O1','German US migration1815–1848',540000,sea([-74,40.7],[[-65,41]]),1815,1848,'United States');
ocean('O1-US-MASS','O1','Later German US immigration',4410000,sea([-90,42],[[-74,40.7],[-80,41]]),1848,1972,'United States / Midwest');
ocean('O1-US-RUSSIA','O1','Russian-German secondary migration to US',115000,[volga,[30,52],hamburg,[-25,50],[-55,45],[-74,40.7],us],1873,1914,'US Great Plains');
ocean('O1-CAN-RUSSIA','O1','Russian-German migration to Canadian prairies',150000,[volga,[30,52],hamburg,[-25,50],[-55,48],quebec,canada],1873,1914,'Canadian prairies');
ocean('O1-CAN-OTHER','O1','Other German-speaking migration to Canada',550000,sea(canada,[[-60,48],quebec,[-84,48]]),1750,1972,'Canada');
ocean('O1-MENNONITE-1920','O1','Russländer Mennonite migration1920s',21000,sea(canada,[[-60,48],quebec]),1920,1929,'Canadian Mennonite settlements');
ocean('O2-BRAZIL','O2','German arrivals in Brazil',250166,[hamburg,[-6,50],[-25,20],[-35,-5],[-45,-23],[-51.1,-29.8]],1824,1969,'Southern Brazil',[250166,250166,260000]);
ocean('O2-ARGENTINA','O2','German and Volga-German Argentina arrivals',220000,[hamburg,[-6,50],[-25,20],[-35,-5],[-45,-23],[-56,-35],[-60.5,-31.7]],1878,1972,'Argentina');
ocean('O2-CHILE','O2','Southern Chile state colonization',6000,[hamburg,[-6,50],[-25,20],[-35,-5],[-45,-23],[-60,-40],[-68,-55],[-75,-50],[-73.2,-39.8]],1850,1875,'Southern Chile',[5000,6000,8000]);
ocean('O2-TOVAR','O2','Colonia Tovar Baden founders',390,[hamburg,[-6,50],[-25,20],[-61,12],[-67.3,10.4]],1843,1844,'Colonia Tovar',[390,390,390]);
ocean('O3-FERNHEIM','O3','Soviet Mennonite refugees via Germany to Fernheim',1850,[[35,48],[37.6,55.7],hamburg,[-25,20],[-45,-23],[-58,-34],[-58,-25],[-60,-22.3]],1929,1931,'Fernheim / Paraguay',[1700,1850,2000]);
ocean('O3-POSTWAR','O3','Displaced Mennonites to Neuland and Volendam',3000,[[35,48],[16,52],hamburg,[-25,20],[-45,-23],[-58,-34],[-58,-25],[-60,-22.3]],1947,1949,'Neuland / Volendam',[2500,3000,3500]);
ocean('O4-AUSTRALIA','O4','Old Lutheran migration to South Australia',20000,[hamburg,[-6,50],[-20,10],[5,-35],[45,-40],[95,-40],[138.6,-34.9]],1838,1860,'South Australia',[15000,20000,25000]);
ocean('O4-NAMIBIA','O4','German colonial settlement in Namibia',14830,[hamburg,[-6,50],[-20,10],[10,-20],[14.5,-22.7],[17.1,-22.6]],1884,1913,'Namibia',[8000,14830,20000]);
ocean('O4-SOUTHAFRICA','O4','German-speaking settlement in South Africa',50000,[hamburg,[-6,50],[-20,10],[5,-35],[18.4,-33.9],[27,-32.5]],1840,1972,'South Africa');
const assigned=overseas.reduce((n,id)=>n+estimates.find(e=>e.recordId===id).central,0),remaining=6750000-assigned;
ocean('O4-AUSTRALIA-LATER','O4','Later German migration to Australia',remaining,[hamburg,[-6,50],[-20,10],[5,-35],[45,-40],[95,-40],[151,-33.8]],1860,1972,'Australia');
add({id:'O1-MANITOBA',record:'O1',name:'Manitoba Russian-Mennonite share',values:[6000,8000,10000],from:'O1-CAN-RUSSIA',parent:'O1-CAN-RUSSIA',nodes:[canada,[-97.5,49.4]],start:1874,end:1880,region:'Manitoba reserves',basis:'8k1874–1880 subset of150k Russian-German arrivals, not an additional8k.6k/10k scenario alternatives.'});
add({id:'O1-VOLHYNIA',record:'O1',name:'Volhynian Canadian share',values:[18000,22000,26000],from:'O1-CAN-RUSSIA',parent:'O1-CAN-RUSSIA',nodes:[canada,[-106,52]],start:1896,end:1914,region:'Canadian western prairies',basis:'22k Volhynian subset of150k, linked once. Modern Canadian ancestry3.3m–3.5m is not a migrant flow.'});
add({id:'O3-MEXICO',record:'O3',name:'Canadian Mennonite relay to Mexico',values:[6000,7000,8000],from:'O1-CAN-RUSSIA',parent:'O1-CAN-RUSSIA',nodes:[canada,[-102,44],[-105,36],[-106,28.6]],start:1922,end:1930,region:'Chihuahua Mennonite colonies',basis:'Supplied7,000 Canadians, explicitly drawn from Canadian diaspora pool; founders not copied from Russia again.'});
add({id:'O3-MENNO',record:'O3',name:'Canada–Paraguay Menno founding relay',values:[1700,1750,1800],from:'O1-MANITOBA',parent:'O1-MANITOBA',nodes:[[-97.5,49.4],[-74,40.7],[-45,0],[-48,-23],[-58,-34],[-58,-25],[-60,-22.3]],start:1926,end:1928,region:'Menno / Loma Plata',mode:'mixed',basis:'Supplied1,700–1,800 central midpoint1,750; same1874–1880 Manitoba diaspora. Over200deaths and~300returns are preserved separately; no modern60kMennonite descendants spawned.'});
add({id:'O3-MEXICO-PARAGUAY',record:'O3',name:'Mexico–Paraguay conservative Mennonite relay',values:[2000,2500,3000],from:'O3-MEXICO',parent:'O3-MEXICO',nodes:[[-106,28.6],[-96.1,19.2],[-84,21],[-70,15],[-48,0],[-43,-23],[-58,-34],[-58,-25],[-60,-22.3]],start:1960,end:1972,region:'Paraguay Mennonite colonies',mode:'mixed',basis:'Supplied~2,500, debited from Mexican7kcohort.2k/3kdisplay alternatives. Reconstructed embarkation–Caribbean–Atlantic–La Plata–Paraguay corridor; not a documented exact itinerary.'});
add({id:'O2-BRAZIL-ARGENTINA',record:'O2',name:'Volga-German Brazil–Argentina relay',values:[2000,5000,10000],from:'O2-BRAZIL',parent:'O2-BRAZIL',nodes:[[-51.1,-29.8],[-55,-30],[-60.5,-31.7]],start:1877,end:1885,region:'Entre Ríos / Argentina',basis:'Source describes re-emigration without flow total; explicit2k/5k/10k reference class drawn from Brazil arrival cohort. Modern Volga-German descendants are not used.'});
for(const id of ['O1','O2','O3','O4'])alias(id,overseas.filter(child=>journeys.find(j=>j.id===child).recordIds.includes(id)),`Primary overseas arrivals allocated once for${id}; relay subsets stay linked. The6.75mglobal scenario is not a modern ancestry count.`);
// Normalize overseas scenarios exactly after preserving empirical component anchors.
for(const key of ['low','high']){
 const target=key==='low'?6000000:7500000,total=overseas.reduce((n,id)=>n+estimates.find(e=>e.recordId===id)[key],0),res=estimates.find(e=>e.recordId==='O1-US-MASS');res[key]+=target-total;
}
for(const group of accountingGroups.filter(g=>g.id.startsWith('O'))){for(const k of ['low','central','high'])group[k]=group.children.reduce((n,id)=>n+estimates.find(e=>e.recordId===id)[k],0);const e=estimates.find(e=>e.recordId===group.id);for(const k of ['low','central','high'])e[k]=group[k];}

// Partition shared source priors geographically without creating more people.
// A Russian secondary emigrant starts in Russia, and Danish/Swedish departures
// do not jump from a Norwegian pool when the first traveller is released.
const sourcePoolPartitions=[];
for(const original of [...reservoirs]){
 const outgoing=journeys.filter(j=>j.fromSettlementRecordId===original.id);
 if(!outgoing.length)continue;
 const groups=new Map();
 for(const journey of outgoing){const key=JSON.stringify([journey.origin.coord,journey.groupId]);const part=groups.get(key)??[];part.push(journey);groups.set(key,part);}
 if(groups.size===1&&JSON.stringify(outgoing[0].origin.coord)===JSON.stringify(original.coord)&&outgoing[0].groupId===original.group)continue;
 const allocated=outgoing.reduce((total,j)=>total+estimates.find(e=>e.recordId===j.id).central,0);
 if(allocated>original.initial+.01)throw new Error(`${original.id}: source partitions exceed the declared prior`);
 reservoirs.splice(reservoirs.indexOf(original),1);
 const ids=[];
 let index=0;
 for(const members of groups.values()){
  const first=members[0],initial=members.reduce((total,j)=>total+estimates.find(e=>e.recordId===j.id).central,0);
  const id=`${original.id}-origin-${++index}`;
  reservoirs.push({...original,id,name:`${first.origin.name} · allocated source cohort`,coord:first.origin.coord,points:first.origin.sampledArrivalPoints,group:first.groupId,color:first.groupColor,initial,capacity:initial});
  for(const journey of members)journey.fromSettlementRecordId=id;
  ids.push(id);
 }
 const residual=original.initial-allocated;
 if(residual>.01){reservoirs.push({...original,initial:residual,capacity:residual});ids.push(original.id);}
 sourcePoolPartitions.push({id:original.id,central:original.initial,allocated,residual,sourcePoolIds:ids,basis:'Geographic partition of one declared source prior; no additional migrants or births.'});
}
await mkdir('.atlas-runtime',{recursive:true});
await writeFile(geometryCacheFile,JSON.stringify(geometryCache));

const landscapes={};
for(const reservoir of reservoirs)landscapes[reservoir.id]={points:reservoir.points,basis:GERMANIC_LANDSCAPE_BASIS,sources:GERMANIC_LANDSCAPE_SOURCES};
for(const journey of journeys)landscapes[journey.id]={points:journey.stages.at(-1).sampledArrivalPoints,basis:GERMANIC_LANDSCAPE_BASIS,sources:GERMANIC_LANDSCAPE_SOURCES};
const limitations=[modelBasis,GERMANIC_LANDSCAPE_BASIS,cohortProgressionBasis,
 'Ancient Germanic-labelled coalitions, North Germanic Scandinavians and medieval/modern German speakers are separate modules. No biological-national continuity or territorial claim is inferred.',
 'All37 source IDs are represented. Narrative cross-references contain shifted R IDs; the explicit register governs extraction and full original wording remains intact.',
 'Routes, regional footprints, intermediate controls, departure profiles, unknown-headcount reference classes and component splits are reconstructed and have not received independent historical route review.',
 'The model follows migration-history cohorts, not the full living population of each region. Earlier founder cohorts and later-generation departure baselines are distinct modeling scopes; mortality, assimilation and centuries of births are not a complete demographic census. Do not sum all episode totals as unique people.',
 'Twentieth-century adjacent stages use explicit parent debits: Heim ins Reich to expulsion/repatriation, deportees to Trudarmiya and release, foreign civilian internment to return. Post1950 BVA departures use later-generation survivor/descendant baselines; exact genealogical linkage to every1941 person is unavailable.',
 'W4 high is restricted to1950:12.75m.1966/1982 totals including offspring, political footprints, casualties, genetic proportions and modern self-reported descendant stocks never become extra migrants.',
 'Volga central26,676 represents dispatched migrants.23,383 survivors and3,293 deaths remain separate source quantities; this display does not simulate individual deaths. Similar survival limits apply to return and expulsion cohorts.',
 'Viking eastern movements are small illustrative merchant/elite cohorts; raids, dynasty duration and conquest are contextual. North American outposts were temporary; Greenland abandonment is preserved as evidence, not an extant-community claim.',
 'Maritime and river passages use explicit geographic guide nodes; land-only journeys use land-mask corridors. Natural Earth present-land checks are cartographic guides, not reconstructed ancient coastlines, actual rail tracks or historic river-channel surveys.',
 'Overseas6m/6.75m/7.5m covers a broad scenario. Exact supplied component counts are retained; unanchored residual allocations are illustrative. Harbin refugee and Harbin-to-Paraguay component details remain in source and included within the Fernheim broad flow, not a separate additive colony.',
];
const atlas={schemaVersion:1,title,sourceFile:`${stem}.source.txt`,sourceSha256:sha256,sourceWindow:timeRange,earliestMovementYear:100,journeys,settlementZones:[],networks:[],limitations,report:{records:journeys.length,inherited:journeys.length,excluded:0,locatedOrigins:journeys.length,locatedDestinations:journeys.length,sourceDated:journeys.length,corridors:journeys.reduce((n,j)=>n+j.corridors.length,0),zones:0}};
const population={schemaVersion:1,title,peoplePerDot:1000,method:modelBasis,estimates,accountingGroups,sourcePoolPartitions,sourceAnchors:anchors,visualizationProgression:{basis:cohortProgressionBasis,journeyTravelYears:ancientCohortProgression,playbackPhases:raw.meta.playback.phases},overseasAccounting:{low:6000000,central:6750000,high:7500000,primaryJourneyIds:overseas},limitations};
const ledger={schemaVersion:1,journeys:[],estimates:[],reservoirs,landscapes,exclusions:[],destinationColourFrom:-100,neutralColour:'#d1c28b',maxUnmatchedAnnualShare:0,fixedAnnualRate:0,arrivalsWithinWindow:true,scenarioReservoirScales:{low:1,high:5},basis:'Separate dated source/cohort priors fund every transfer. Zero natural growth prevents unobserved births being silently inferred from an earlier migration flow. Later-generation source baselines are declared explicitly, not asserted to be census-complete or exact individual survival histories. Adjacent linked transfers debit their parent destination. Low-flow scenario retains the central source prior with lower outflow; high source priors are a separately declared funding sensitivity, not source censuses. '+modelBasis,sources:[]};
// Tight reservoir priors must cover each scenario without forcing synthetic growth.
for(const reservoir of reservoirs){const outgoing=journeys.filter(j=>j.fromSettlementRecordId===reservoir.id);const high=outgoing.reduce((n,j)=>n+estimates.find(e=>e.recordId===j.id).high,0);reservoir.capacity=Math.max(reservoir.initial,high);}
raw.groups=[...new Map(journeys.map(j=>[j.groupId,{id:j.groupId,name:j.groupName,color:j.groupColor,tags:[`module:${j.groupId[0]}`],sources:[]}])).values()];raw.events=[];raw.regions=[];
raw.agentPreparation={schemaVersion:1,method:'Source-preserving prose register plus separate reconstructed journeys and explicit population scenarios',verification:'Deterministic software preparation; supplied synthesis not independently historically verified.',inputs:[{role:'supplied-prose',fileName:`${stem}.source.txt`,bytes:bytes.length,sha256}]};
await write('atlas',raw);await write('journeys',atlas);await write('population',population);await write('ledger',ledger);
const normalized=compileDataset(raw);if(normalized.issues.some(i=>i.level==='error'))throw new Error(JSON.stringify(normalized.issues));
const input=readEstimateInput(population);if(input.issues.length)throw new Error(input.issues.join('\n'));
const attached=attachLedger(atlas,input.estimates,ledger);const compiled=compileAtlasPopulation(normalized.dataset,attached.atlas,attached.estimates);
if(compiled.report.missingEstimateIds.length||compiled.report.unlocatedIds.length)throw new Error(JSON.stringify(compiled.report));
const represented=new Set([...compiled.bindings.values()].flatMap(b=>b.recordIds));for(const r of records)if(!represented.has(r.id))throw new Error(`Unrepresented source record${r.id}`);
const water=journeys.filter(j=>j.corridors.every(c=>c.transport==='land-corridor')).map(j=>({id:j.id,...loadLandMask().pathWaterStats(j.corridors.flatMap(c=>c.coordinates),2,1)}));
const annual=ledgerEvents(compiled.dataset,1000),audits=[-100,100,450,600,1000,1300,1800,1914,1939,1942,1945,1950,1990,2026].map(year=>({year,standing:compiled.dataset.settlements.reduce((n,s)=>n+(year<s.start?0:ledgerBalance(s,annual.get(s.id)??[],year)),0),travelling:compiled.dataset.migrations.reduce((n,m)=>n+transferEvents(m,1000).filter(e=>e.departure<=year&&e.arrival>year).reduce((v,e)=>v+e.people,0),0)}));
const report={schemaVersion:1,title,sourceSha256:sha256,preparation:{sourceRecords:records.length,representedSourceIds:records.map(r=>r.id),journeys:journeys.length,modules:Object.keys(modules),originalBytes:bytes.length,allSourcePopulationsPreservedUnknown:records.every(r=>r.population===null)},software:{...compiled.report,migrations:compiled.dataset.migrations.length,stocks:compiled.dataset.settlements.length,annualRate:compiled.dataset.meta.ledger.annualRate},accounting:{groups:accountingGroups,overseas:population.overseasAccounting,snapshots:audits,adjacentStagesConserved:true,countsAreEpisodeScopesNotUniquePersons:true},geography:{landOnly:water.map(({id,lengthKm,waterKm,longestSegmentWaterKm})=>({id,lengthKm,waterKm,longestSegmentWaterKm})),independentRouteReview:false},verification:{preparation:'Complete source extraction and reconstructed geography; no source uploaded.',historical:'Supplied synthesis preserved, not exhaustive primary-source verification.',browser:'Performed separately by the project owner.'},limitations};
await write('review',report);await mkdir('public/projects',{recursive:true});
await writeFile('public/projects/germanics.json',JSON.stringify({schemaVersion:1,title,dataset:`data/research/${stem}.atlas.json`,sourceDocument:`data/research/${stem}.source.txt`,populationModel:`data/research/${stem}.population.json`,journeys:`data/research/${stem}.journeys.json`,standingLedger:`data/research/${stem}.ledger.json`,viewBounds:[-75,-40,80,70]},null,2)+'\n');
console.log(JSON.stringify({prepared:title,sourceRecords:records.length,journeys:journeys.length,centralOverseasScenario:6750000,sourceSha256:sha256,arabManifestUnchanged:true},null,2));
