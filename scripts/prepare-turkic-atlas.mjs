#!/usr/bin/env node
/** Deterministic local reconstruction; the supplied report is evidence, never code. */
import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { prepareResearchProject } from '../src/data/research.ts';
import { compileDataset } from '../src/data/loader.ts';
import { readEstimateInput } from '../src/data/estimate-input.ts';
import { compileAtlasPopulation } from '../src/data/atlas-model.ts';
import { attachLedger, ledgerEvents, ledgerBalance, transferEvents } from '../src/data/population-ledger.ts';
import { landCorridor } from './land-corridor.mjs';
import { sampleLandArrivalPoints } from './route-arrivals.mjs';
import { loadLandMask, distanceKm, interpolateGreatCircle, isLand } from './route-landmask.mjs';
import { prepareTurkicLandscapes } from './turkic-landscapes.mjs';

const dir='public/data/research',stem='turkic-migrations';
await mkdir(dir,{recursive:true});
const sourceFile=`${dir}/${stem}.source.txt`,supplied=process.argv[2];
if(supplied&&resolve(supplied)!==resolve(sourceFile))await copyFile(supplied,sourceFile);
const bytes=await readFile(sourceFile), suppliedText=bytes.toString('utf8');
const sha256=createHash('sha256').update(bytes).digest('hex');
const extracted=JSON.parse(await readFile(`${dir}/${stem}.extracted.json`,'utf8'));
if(extracted.sourceSha256!==sha256)throw new Error('Source differs from the retained extraction. Update the derived extraction before rebuilding.');
for(const row of [...extracted.sourceRows,...extracted.contextRecords])if(!suppliedText.includes(row.rawText))throw new Error(`Source excerpt no longer matches: ${row.id}`);
const save=(name,value)=>writeFile(`${dir}/${stem}.${name}.json`,JSON.stringify(value,null,['journeys','ledger'].includes(name)?0:2)+'\n');
const window=[-2200,1520],title='Turkic migrations across Eurasia · 2200 BCE–1520 CE';
const note='Path and dates are reconstructed.';
const scale='Default display unit: 1 dot = 1,000 people. The report’s original 2,500-person dot unit and dot counts remain in evidence. Low/central/high values are supplied visualization scenarios, not censuses or statistical confidence intervals.';
const sourceRefs=[{id:'REPORT',title:'User-supplied Demographic and Spatial Reconstruction of Turkic Migrations Across Eurasia',note:'Original prose retained byte-for-byte with SHA-256; citation assertions and quantitative reconstructions have not been independently verified in full.'},...(extracted.references??[]).map(r=>({id:r.id,title:r.citation,note:'Citation as supplied; bibliographic identity and quantitative interpretation not independently verified.'}))];
const sample=(coord,radius,id,count=512)=>sampleLandArrivalPoints({center:coord,radiusKm:radius,count,seed:id}).points;
const colors={east:'#dcae64',central:'#73bfa7',steppe:'#d5a3c3',iran:'#e39668',anatolia:'#d6c56e',balkans:'#7faed3',siberia:'#9ebfe3',china:'#cb96b6',south:'#8cb6a0',neutral:'#c3bca9'};
const journeys=[],estimates=[],pools=new Map(),geography=[];
const tiers=['low','central','high'];
const find=id=>extracted.cohorts.find(r=>r.id===id);
function ensurePool(id,name,coord,start,color=colors.neutral,radius=100){
  if(!pools.has(id))pools.set(id,{id,name,coord,start,points:sample(coord,radius,id),initial:0,capacity:10000000,regionId:name,color,requiredByTier:{low:0,central:0,high:0},basis:'Separate standing-population visualization prior; source baseline remains unknown.'});
  else pools.get(id).start=Math.min(pools.get(id).start,start);
  return pools.get(id);
}
function stage(id,name,coord,start,end,color,kind,radius=100){return {id,name,coord,start,end,kind,sourceRole:kind==='origin'?'immediate':'destination',dateLabel:`${start}–${end} (reconstruction)`,chronologyKind:'reconstructed-period',uncertain:true,regionId:name,regionName:name,color,precisionKm:radius,basis:'Regional reference and reconstructed footprint; no measured settlement boundary. '+note,sourceRecordIds:[],sampledArrivalPoints:sample(coord,radius,id),geographicReview:'inherited-unreviewed'};}
function waterLeg(a,b){const count=Math.max(1,Math.ceil(distanceKm(a,b)/20));return Array.from({length:count+1},(_,i)=>i===count?b:interpolateGreatCircle(a,b,i/count));}
function add(id,from,coords,{to=id,name,values,recordIds,region,color=colors.central,start,end,radius=100,maritime=[],basis='',group,category}={}){
  const row=find(id), sourceId=row?.sourceRowId??id;
  name??=row?.name??id; start??=row?.start;end??=row?.end;
  values??=row&&tiers.map(k=>row[k]);
  if(!values?.every(v=>typeof v==='number'&&v>=0)||!values[1])throw new Error('Missing explicit estimate '+id);
  recordIds??=[id,...(sourceId!==id?[sourceId]:[])];
  const fromName=pools.get(from)?.name??from;
  // Source coordinates remain intact. Rounded coastal controls move only to
  // nearby present land, with every displacement recorded separately.
  if(!maritime.length)coords=coords.map((p,index)=>{
    if(isLand(p,1))return p;
    const candidates=sample(p,45,`${id}-coast-${index}`,256).sort((a,b)=>distanceKm(a,p)-distanceKm(b,p));
    if(!candidates.length)throw new Error(`No nearby land for ${id} control ${p}`);
    const nearest=candidates[0];
    geography.push({id:`${id}-control-${index}`,kind:'rounded-coordinate-to-present-land',sourceCoordinate:p,displayCoordinate:nearest,displacementKm:distanceKm(p,nearest)});
    return nearest;
  });
  ensurePool(from,fromName,coords[0],start,color,120);
  const destination=coords.at(-1);region??=row?.destinations?.at(-1)?.name??name;
  ensurePool(to,region,destination,start,color,radius);
  const origin=stage(id+'-origin',fromName,coords[0],start,start,color,'origin',90);
  const dest=stage(id+'-destination',region,destination,end,end,color,'destination',radius);
  const path=[];
  for(let i=1;i<coords.length;i++){
    const leg=maritime.includes(i)?waterLeg(coords[i-1],coords[i]):landCorridor(coords[i-1],coords[i]);
    path.push(...(path.length?leg.slice(1):leg));
  }
  if(path.length<2)throw new Error('Movement needs geometry '+id);
  const method=row?'Supplied calibrated cohort scenario; geographic allocation stated separately':'Explicit allocation within an inclusive supplied cohort';
  const estimateBasis=`${scale} ${basis} ${row?.rawText??''}`;
  const originalCategories=row?.categoriesCentral??null;
  const allocatedCategories=category??(originalCategories?Object.fromEntries(Object.entries(originalCategories).map(([k,v])=>[k,v*values[1]/row.central])):null);
  estimates.push({recordId:id,low:values[0],central:values[1],high:values[2],method,basis:estimateBasis,sourceIds:['REPORT'],sourceRowId:sourceId,sourceParentIds:row?.parentIds??[],countingUnit:'persons',categoriesCentral:allocatedCategories,sourceCategoriesCentral:originalCategories,categoryAllocation:'Central functional categories are proportionally allocated when a source row is divided geographically; exact source categories remain separate. No low/high functional breakdown asserted.'});
  journeys.push({id,name,groupId:group??id,groupName:group?find(group)?.name??group:name,groupColor:color,recordIds,linkedRecordIds:row?.parentIds??[],cohortKey:id,populationKnown:false,population:null,uncertain:true,temporalType:row?.epistemicStatus?.includes('LING-GEN')?'linguistic-genetic-reconstruction':row?.epistemicStatus?.includes('REC-COR')?'reconstructed_movement':'reported_movement',evidence:row?.epistemicStatus??'MODEL',inherited:true,excluded:false,dateRange:[start,end],dateLabel:row?.dateLabel??`${start}–${end} (reconstructed allocation)`,origin,stages:[dest],corridors:[{id:id+'-corridor',fromStageId:origin.id,toStageId:dest.id,coordinates:path,start,end,dateLabel:row?.dateLabel??`${start}–${end}`,basis:'Named steppe, river, oasis or foothill corridor controls with present-land checking. '+note+' '+basis,certainty:'conjectural',transport:maritime.length?'mixed':'land-corridor',timing:'source-window',sourceRecordIds:recordIds}],animationAdmission:'estimated-movement',fromSettlementRecordId:from,source:{collection:'records',ancestralOrigin:row?.origin?.name??fromName,immediateOrigin:fromName,destination:region,dateLabel:row?.dateLabel??`${start}–${end}`,sourceIds:['REPORT'],notes:[note,basis,scale],recordStatus:'reconstructed-unreviewed',raw:row??{id,name,modelOnly:true,basis}},tags:['turkic-model','reconstructed',`reservoir-target:${to}`,...(row?.epistemicStatus?.includes('LING-GEN')?['linguistic-genetic-reconstruction']:[])]});
  geography.push({id,transport:maritime.length?'mixed':'land-corridor',...loadLandMask().pathWaterStats(path,2,1)});
}

// Coordinates are [longitude, latitude]. Controls represent ecological corridors,
// not proof of a precise itinerary. Every shared pool is debited on departure.
ensurePool('INNER-MONGOLIA','Eastern Inner Mongolia ancestral display pool',[120,43.5],-2200,colors.east,150);
add('COH-00A','INNER-MONGOLIA',[[120,43.5],[115,43],[110,44.5],[105,46],[100,47],[96,48]],{color:colors.east,region:'Sayan–Altai / Mongolian plateau',basis:'Supplied prehistoric LING-GEN scenario; competing homeland hypotheses remain distinct in the evidence.'});
add('COH-00B','COH-00A',[[102.5,47.5],[98,47.5],[94,47],[90,47],[86,47.5],[84,47.8],[81,46],[78,45]],{color:colors.east,region:'Zaysan–Irtysh and Semirechye',basis:'Composite Dingling/Xiongnu movement is not an exclusively Turkic empire or a population replacement.'});
add('COH-00C','COH-00B',[[85,47],[75,48],[65,49],[56,49],[48,48],[44,48],[39,48],[35,47],[30,48],[25,48],[20.5,47]],{color:colors.steppe,region:'Carpathian Basin',basis:'Disputed multiethnic Hun immigrant core only; no local European or empire-wide population inferred.'});
add('COH-00D','COH-00B',[[87,46.5],[81,44],[75,43],[69,42],[66.9,39.7],[66.9,36.8],[68.9,35.7],[69.2,34.8],[71.5,34]],{color:colors.south,region:'Bactria–Gandhara',basis:'Disputed affiliation retained; Bactrian administrative language does not establish a Turkic resident majority.'});
add('COH-01','COH-00B',[[70,54],[64,52],[59,50.5],[53,49.5],[48,48],[44,46.5],[41,45.5],[38.5,46.5]],{color:colors.steppe,region:'Kuban–Azov and North Caucasus'});
add('COH-04A','TIELE-CORE',[[102,48],[97,47],[92,46],[88.5,45]],{color:colors.east,region:'Dzungarian Basin'});
add('COH-01A','ROURAN-CORE',[[103,47],[95,46.5],[87,46],[79,45.5],[69,47],[59,48],[49,47],[44,46.5],[38,48.2],[30,48],[24,48],[19.8,46.8]],{color:colors.steppe,region:'Danube–Tisza interfluve',basis:'Rouran-derived/Para-Mongolic or disputed multilingual Avar core; not classified as a securely Turkic population.'});
add('COH-05','COH-04A',[[88,47.5],[85,46],[82,44.5],[81.3,43.9],[77,43],[75.3,42.8],[71.4,42.9],[69.3,41.3]],{color:colors.central,region:'Semirechye–Chu–Chach'});
// COH-02 is an in-place inclusive parent, never a second 145,000-person wave.
// The Pannonian component is staged earlier, because its 631 episode predates
// Kubrat's later 660s breakup. This is a visualization genealogy, not new evidence.
add('MODEL-PANNONIAN-BULGARS','COH-01',[[38.5,46.5],[33,47],[28,48],[23,48],[20,46.8]],{to:'PANNONIAN-BULGARS',name:'Pannonian Bulgar component',values:[12000,25000,35000],recordIds:['MODEL-PANNONIAN-BULGARS','COH-02','COH-02D','COH-02E'],color:colors.balkans,start:515,end:600,region:'Pannonian Bulgar component',basis:'Earlier branch allocation of the supplied combined COH-02D/E bounds; not an extra population. It avoids treating the 631 event as a departure in the 660s.'});
add('COH-02A','COH-01',[[38.8,46.2],[39.4,47.1]],{color:colors.steppe,recordIds:['COH-02A','COH-02'],region:'Azov–Don retained Bulgars',basis:'Retained regional branch; short regional redistribution, not an asserted long-distance migration.'});
add('COH-02B','COH-01',[[39.5,46.8],[42.2,48.5],[44.5,49.7],[47.5,52],[49,54.9]],{color:colors.steppe,recordIds:['COH-02B','COH-02'],region:'Middle Volga / Bolgar',basis:'Later post-1236 flight to Chuvashia remains in evidence; the supplied aggregate is not counted again.'});
add('COH-02C','COH-01',[[38.8,46.2],[35,47],[31,46.8],[29,45.2],[28,44.7],[27.1,43.4]],{color:colors.balkans,recordIds:['COH-02C','COH-02'],region:'Moesia / Pliska'});
add('COH-02D','PANNONIAN-BULGARS',[[20,46.8],[20.5,44.8],[21.4,43],[21.3,41]],{values:[9600,20000,28000],color:colors.balkans,recordIds:['COH-02D','COH-02'],region:'Macedonia / Thessaloniki',start:670,end:680,basis:'Source central split 20,000 of combined 25,000; low/high allocated proportionally at 80%. Combined bounds remain 12,000/25,000/35,000.'});
add('COH-02E','PANNONIAN-BULGARS',[[20,46.8],[16.4,47.1],[13.5,48.2],[12.5,46.7],[12.2,45.5],[12.2,44.4],[13.3,43],[14.4,41.5]],{values:[2400,5000,7000],color:colors.balkans,recordIds:['COH-02E','COH-02'],region:'Matese / southern Italy',start:631,end:680,basis:'Source central split 5,000 of combined 25,000; low/high allocated proportionally at 20%. Bavaria–Ravenna–Matese controls are a reconstruction.'});
add('COH-03','COH-01',[[47.1,43.2],[46.7,44.5],[48,46.3],[44.8,47.2],[42.2,47.7]],{color:colors.steppe,region:'Lower Volga–Don Khazar core'});
add('COH-06','ALTAI-CORE',[[86.5,47.5],[83,46],[81,44.5],[77,43],[75.3,42.8],[71.4,42.9]],{color:colors.central,region:'Semirechye–Taraz'});
add('COH-13','MONGOLIAN-TURKIC-CORE',[[103.5,48.5],[98,47],[93,46],[87,46],[81,45.5],[77,44.5],[72,44],[67,44.5],[64.1,44.6],[61.9,45.6]],{color:colors.central,region:'Lower Syr Darya / Yangi-Kent'});
add('COH-08A','ORKHON-UYGHURS',[[102.7,47.4],[106,44.5],[109,42],[113.3,40.1]],{color:colors.china,region:'Shanxi frontier'});
add('COH-08B','ORKHON-UYGHURS',[[102.7,47.4],[101,44.5],[100.5,42],[100.4,38.9]],{color:colors.china,region:'Gansu / Ganzhou'});
add('COH-08C','ORKHON-UYGHURS',[[102.7,47.4],[96,46],[91,44.5],[89.2,42.9]],{color:colors.china,region:'Qocho / Turfan'});
ensurePool('YENISEI-KYRGYZ','Yenisei Kyrgyz standing core',[91.4,53.7],-209,colors.siberia,140).retainedCentral=100000;
add('COH-10A','YENISEI-KYRGYZ',[[91.4,53.7],[90,51.7],[86,49.5]],{color:colors.siberia,region:'Altai–Irtysh Kyrgyz',basis:'Altai regional component anchors the continuing parent pool. Source eastern-Tian-Shan presence remains broad multi-region evidence, not an obligatory intermediate itinerary.'});
add('COH-11','ALTAI-CORE',[[85,48],[81,50],[76.9,52.3],[70,52],[64,52],[58,51.5]],{color:colors.central,region:'Middle Irtysh–southern Urals'});
add('COH-EP1','COH-06',[[71.4,42.9],[69.3,41.3],[66.9,39.7],[64.4,39.8],[62.2,37.7],[58.8,36.2],[51.4,35.6],[47,34.8],[43.9,34.2]],{color:colors.iran,region:'Samarra',basis:'One cumulative aggregate split 50% Samarra, 25% Bukhara, 25% Ghazna for display, not three copies.',values:[17500,32500,55000]});
add('MODEL-EP1-BUKHARA','COH-06',[[71.4,42.9],[69.3,41.3],[66.9,39.7],[64.4,39.8]],{to:'EP1-BUKHARA',name:'Ghilmān flow to Bukhara',values:[8750,16250,27500],recordIds:['MODEL-EP1-BUKHARA','COH-EP1'],color:colors.central,start:833,end:1030,region:'Bukhara',basis:'25% allocation of the one COH-EP1 aggregate.'});
add('MODEL-EP1-GHAZNA','COH-06',[[71.4,42.9],[69.3,41.3],[67.7,37.2],[68.9,35.7],[69.2,34.8],[68.4,33.5]],{to:'EP1-GHAZNA',name:'Ghilmān flow to Ghazna',values:[8750,16250,27500],recordIds:['MODEL-EP1-GHAZNA','COH-EP1'],color:colors.south,start:962,end:1030,region:'Ghazna',basis:'25% allocation of the one COH-EP1 aggregate.'});
add('COH-17','ARAL-KANGAR',[[55,48.5],[51,49],[47,49],[42,48],[36,47.3],[30.5,46.5]],{color:colors.steppe,region:'Pontic–Danubian Pechenegs'});
add('COH-07A','COH-06',[[75.3,42.7],[71.4,42.9],[69.3,41.3],[66.9,39.7],[64.4,39.8]],{color:colors.central,region:'Transoxiana / Bukhara'});
add('COH-07B','COH-06',[[75.3,42.7],[76,39.5],[76.3,38.4],[77.3,37.9],[79.9,37.1]],{color:colors.central,region:'Khotan'});
add('COH-14A','COH-13',[[61.9,45.6],[64.1,44.6],[65.6,40.4],[63,38.8],[61.2,36.5],[58,37.5],[56.3,38.9],[54.5,39.7],[54,37.5],[51.4,35.6]],{color:colors.iran,region:'Rayy / western Iran',basis:'The 4,000-household anchor and competing critique-factor conversions stay intact; the row’s supplied 14k/22.5k/32k bounds are retained.'});
add('COH-14B','COH-13',[[61.9,45.6],[59.1,42.3],[60.5,39.8],[62.2,37.7],[61.2,36.5],[58.8,36.2]],{color:colors.iran,region:'Khorasan / Nishapur'});
add('COH-12A','COH-11',[[64,51.5],[65,48.5],[66.9,44.2]],{color:colors.central,region:'Syr Darya / Sighnaq'});
add('COH-12B','COH-11',[[64,51.5],[58,51],[51,49.5],[47,49],[43,48.5],[39,48],[36,47.5]],{color:colors.steppe,region:'Pontic–Caspian Cumania'});
add('COH-17A','COH-17',[[30.5,46.5],[29,45.2],[28,44],[26,42.8],[24.5,42],[22,41]],{color:colors.balkans,region:'Thrace–Macedonia'});
add('COH-13A','COH-13',[[61.9,45.6],[55,48],[48,48],[42,48],[36,47.5],[30.5,46.5],[29,45.2],[28,44],[25,42.5],[22,41]],{color:colors.balkans,region:'Balkan Uzes',start:1064,end:1091,basis:'Western Oghuz/Uzes allocation is debited from the shared Oghuz pool; Danube crossing is preserved as reported, exact itinerary reconstructed.'});
add('COH-15','COH-14B',[[58.8,36.2],[54.5,36.5],[51.4,35.6],[50,36.3],[48.8,37.2],[46.3,38.1]],{color:colors.iran,region:'Azerbaijan / Tabriz'});
add('COH-16A','COH-15',[[46.3,38.1],[44.2,39.5],[42,39.5],[40.2,37.9],[38.3,38.4],[37,39.7],[34.5,38.7],[32.5,37.9]],{color:colors.anatolia,region:'Central Anatolian Plateau'});
add('COH-12D','COH-12A',[[66.9,44.2],[64.1,44.6],[61.5,43.3],[59.1,42.3]],{color:colors.central,region:'Khwarazm / Gurganj'});
add('COH-12B-GEO','COH-12B',[[41,45],[43,44.2],[44.5,43.3],[44.6,42.7],[44.8,41.7]],{color:colors.iran,region:'Georgia / Tbilisi'});
add('COH-MNG1','MONGOLIAN-MIXED-CORE',[[106,47.5],[98,47],[91,46],[85,45.5],[80.5,44.2],[75,43],[69.3,41.3],[65.8,38.9]],{color:colors.central,region:'Chagatai Central Asia',values:[80000,150000,250000],basis:'Two-thirds of the one mixed Turco-Mongol redistribution aggregate allocated to Central Asia; one-third goes to the Jochid steppe. Not an exclusively Turkic conquest army.'});
add('MODEL-MNG1-JOCHI','MONGOLIAN-MIXED-CORE',[[106,47.5],[98,47],[90,47],[81,49],[71,50],[61,50],[51,49],[44.5,48.7]],{to:'JOCHID-STEPPE',name:'Jochid Turco-Mongol redistribution',values:[40000,75000,125000],recordIds:['MODEL-MNG1-JOCHI','COH-MNG1'],color:colors.steppe,start:1219,end:1270,region:'Jochid / Golden Horde steppe',basis:'One-third geographic allocation within COH-MNG1; no additional aggregate population.'});
add('COH-16B','COH-16A',[[32.5,37.9],[34,38.5],[34.4,39.7],[33.8,41.4],[31,40.3],[29.9,39.4],[29.1,37.8]],{color:colors.anatolia,region:'Western Anatolian uç',values:[70000,129500,217000],basis:'70% of the one second-wave185k central allocation goes to western/northern uç;30% goes to Taurus/Karaman. Existing Central-Anatolian cohort supplies onward movement; explicit support prior covers cumulative later inflows.'});
add('MODEL-16B-TAURUS','COH-16A',[[32.5,37.9],[33.2,37.2]],{to:'TAURUS-TURKMENS',name:'Taurus / Karaman Turkmen redistribution',values:[30000,55500,93000],recordIds:['MODEL-16B-TAURUS','COH-16B'],color:colors.anatolia,start:1243,end:1280,region:'Taurus / Karaman',basis:'30% of COH-16B aggregate; geographical allocation is a visualization choice.'});
add('COH-12B-HUN','COH-12B',[[36,47.5],[31,47],[27,48.2],[24,48],[22,47.5],[20.6,47.3]],{color:colors.balkans,region:'Hungary / Kunság'});
add('COH-12B-BLK','COH-12B',[[36,47.5],[31,47],[29,45.2],[28,43.8]],{color:colors.balkans,region:'Dobruja / Balkans'});
add('COH-MNG2','MONGOLIAN-MIXED-CORE',[[106,47.5],[97,46.5],[88,45.5],[80,44],[72,42],[66,40],[62.2,37.7],[58.8,36.2],[51.4,35.6],[48.8,36.4],[46.3,38.1]],{color:colors.iran,region:'Ilkhanid Azerbaijan / western Iran'});
add('COH-EP2-EGY','COH-12B',[[36,47.5],[36,45.3],[35,45],[32,42],[29.2,41.3],[28.9,40.8],[26,40.2],[25,37],[27,34],[30,31.3],[31.2,30]],{color:colors.south,region:'Egypt / Cairo',maritime:[3,4,5,6,7,8,9],basis:'Explicitly mixed Black Sea–Straits–Mediterranean transport reconstruction; no land route is asserted across open sea.'});
add('COH-EP2-YUAN','COH-08C',[[89.2,42.9],[94,43],[101,42],[108,40.5],[112,40],[116.4,39.9]],{color:colors.china,region:'Yuan China / Beijing',basis:'Supplied mixed Kipchak/Uyghur/refugee aggregate; Chinese artisans are retained as context and not relabelled Turkic migrants.'});
ensurePool('BAIKAL-KURYKANS','Kurykan standing display pool',[106,53.5],700,colors.siberia,130);
add('COH-09A','BAIKAL-KURYKANS',[[106,53.5],[108,54.8],[109,56],[112,57],[115,58.3],[119,59],[123,60],[127,61],[129.7,62]],{color:colors.siberia,region:'Central Lena–Aldan–Amga',basis:'Lena river-basin guide and broad source interval; founder-effect evidence is not a census calibration.'});
add('COH-10C','COH-10A',[[85,47.5],[83,45],[80,43],[77.2,42.4],[76,41.4]],{color:colors.siberia,region:'Tian Shan / Kyrgyzstan',basis:'Altai/Irtysh origin retained; exact parent components and multi-century consolidation remain unresolved.'});
add('COH-16C','COH-16B',[[29.1,37.8],[30.2,39.9],[29.3,40.9],[29.05,41.05],[28.95,41.1],[27,41.6],[24.7,42.1],[26.5,43.5],[24,42],[22.1,41.5]],{color:colors.balkans,region:'Ottoman Thrace–Bulgaria–Macedonia',maritime:[4],basis:'Bosphorus crossing is explicit; household settlement is not the same as Ottoman political control.'});
add('COH-15A','COH-15',[[43.4,39],[44.7,38.6],[46.3,38.1]],{color:colors.iran,region:'Qara Qoyunlu Azerbaijan / Tabriz',basis:'Eastern Anatolian origin retained. Primary display destination is Tabriz; Mosul seasonal pastures and Iraq/Fars extent remain source evidence, not a mandatory sequential itinerary.'});
add('COH-15B','COH-15',[[40.2,40.3],[40.2,37.9],[43.4,39],[46.3,38.1],[48.8,36.4],[51,33.5],[52.5,29.6]],{color:colors.iran,region:'Aq Qoyunlu Azerbaijan–Fars',basis:'Eastern Anatolian origin retained; the wider COH-15 Turkmen pool is the primary debit parent. Other supplied parent links remain in raw evidence.'});
add('COH-15C','COH-15A',[[46.3,38.1],[48.8,37],[50,36.3]],{color:colors.iran,region:'Safavid Iran',basis:'Azerbaijan origin retained. In-place absorption and mobilisation are not an entirely fresh Inner-Asian influx. Source calls newly mobilized/integrated, not all newly arrived; Qara/Aq/Qizilbash mixture remains unresolved.'});
add('COH-12E','COH-12A',[[65.5,45.5],[67,46.5],[68,48]],{color:colors.central,region:'Kazakh steppe',values:[130000,250000,395000],basis:'Kazakh/Syr-Darya origin retained. Central source split250k Kazakh retained/redistributed,225k Uzbek; low/high partitioned proportionally and rounded to retain source250k/475k/750k total.'});
add('MODEL-12E-UZBEK','COH-12A',[[66.9,44.2],[65.5,43],[64.4,39.8],[66.9,39.7],[64.4,39.8],[60.4,41.4]],{to:'UZBEK-TRANSOXIANA',name:'Shaybanid / Qongrat Uzbek redistribution',values:[120000,225000,355000],recordIds:['MODEL-12E-UZBEK','COH-12E'],color:colors.central,start:1465,end:1510,region:'Transoxiana / Khwarazm',basis:'The remaining inclusive COH-12E allocation. Low/high split is visualization-only; central225k comes from source.'});
// The prose names this medieval eastward group without a table headcount.
// Give it a separate, explicitly analogical display estimate rather than hide it.
add('MODEL-SALAR','COH-13',[[66.9,39.7],[69.3,41.3],[75,43],[80,43],[87,43],[93,42],[94.6,40.1],[100.4,38.9],[102.5,36.8],[102.5,35.8]],{to:'SALAR-QINGHAI',name:'Salar eastward migration to Qinghai',values:[5000,12500,25000],recordIds:['MODEL-SALAR','CTX-SALAR'],color:colors.china,start:1200,end:1500,region:'Qinghai / upper Yellow River',basis:'Source prose reports Central Asia to Qinghai but gives no exact date or population. Broad1200–1500 medieval display interval and5,000/12,500/25,000-person reference-class scenarios are independent model choices by analogy with a small long-distance pastoral migration (the supplied Sakha scenario), not a source anchor or proof of the Salar headcount. Oghuz-derived group draws from the shared Oghuz pool; Gansu/Hexi approach is reconstructed.'});
const salarJourney=journeys.at(-1),salarSource=extracted.contextRecords.find(r=>r.id==='CTX-SALAR');
salarJourney.evidence='REPORT';salarJourney.temporalType='reconstructed_movement';
salarJourney.dateLabel='1200–1500 CE (broad reconstructed interval; exact source date unknown)';
salarJourney.source.raw=salarSource;salarJourney.source.notes.push(salarSource.rawText);
estimates.push({recordId:'CTX-SALAR',low:5000,central:12500,high:25000,method:'Reference-class display scenario for prose-only Salar movement',basis:salarJourney.source.notes.join(' '),sourceIds:['REPORT'],includedIn:'MODEL-SALAR',render:false,sourcePopulation:null});

const sourceRows=extracted.sourceRows;
const sourceRecords=extracted.cohorts.map(r=>({id:r.id,name:r.name,origin:r.origin?.name??'',destination:r.destinations?.map(d=>d.name).join(' / ')??'',date_label:r.dateLabel,temporal_type:r.epistemicStatus?.includes('LING-GEN')?'linguistic-genetic-reconstruction':'reported_movement',evidence:r.epistemicStatus,record_status:'supplied-prose-extraction-unreviewed',region:r.destinations?.at(-1)?.name??'Eurasia',population:null,source_ids:['REPORT'],notes:r.rawText,sourceEstimate:{low:r.low,central:r.central,high:r.high,unit:'persons'},sourceParentIds:r.parentIds,sourceUnknownCodes:['UNK-SRC','UNK-SUB'],categoriesCentral:r.categoriesCentral,raw:r}));
for(const row of sourceRows)if(!sourceRecords.some(r=>r.id===row.id))sourceRecords.push({id:row.id,name:row.name??row.id,origin:'See supplied row',destination:'See supplied row',date_label:row.dateLabel??'See supplied chronology',temporal_type:'inclusive-source-row',evidence:'REPORT',record_status:'supplied-unreviewed',region:'Eurasia',population:null,source_ids:['REPORT'],notes:row.rawText,raw:row});
for(const r of extracted.contextRecords??[])sourceRecords.push({id:r.id,name:r.name,origin:r.origin??'See source',destination:r.destination??'See source',date_label:r.dateLabel??'Contextual chronology',temporal_type:'context_only',evidence:'REPORT',record_status:'unreviewed-context',region:'Context',population:null,source_ids:['REPORT'],notes:r.rawText??r.notes??'',raw:r});
const sourceRegister={metadata:{title,scope:'Supplied Turkic and associated/disputed migration cohorts across Eurasia; prehistoric reconstructions and later context retained separately.',evidence_codes:{DOC:'Reported documented movement in supplied synthesis; source assertions unreviewed', 'REC-COR':'Reconstructed intermediate corridor / broad dates', 'LING-GEN':'Linguistic, genetic or disputed reconstruction'},population_policy:'Unknown source and indigenous populations remain null. Calibrated supplied scenarios and support priors live in the separate population model.'},suppliedText,sourceSha256:sha256,sourceRows,records:sourceRecords,sources:sourceRefs,sourceDotUnit:2500,extraction:extracted};
await save('register',sourceRegister);
const raw=prepareResearchProject(sourceRegister,{sourceName:`${stem}.register.json`,sourceDocument:`data/research/${stem}.source.txt`});
raw.meta={...raw.meta,timeRange:window,defaultYear:-2200,defaultDotScale:2.2,dotStyle:{outlineColor:'#000000',outlineWidth:1.25,minimumRadius:3.5},cameraRetirements:[{from:-1200,settlementIds:['INNER-MONGOLIA']},{from:160,settlementIds:['COH-00A']}],defaultView:{center:[120,43.5],zoom:4.5},playback:{adaptive:false,defaultSpeed:20,schedule:'continuous',phases:[{from:-2200,to:350,yearsPerSecond:500},{from:350,to:1520,yearsPerSecond:20}]},description:sourceRegister.metadata.scope+' '+scale,synthetic:false};
raw.groups=[...new Map(journeys.map(j=>[j.groupId,{id:j.groupId,name:j.groupName,color:j.groupColor,sources:[],tags:['turkic-cohort']}])).values()];
raw.events=[];raw.regions=[];
// Inclusive aliases expose combined source estimates without another set of dots.
for(const r of extracted.cohorts){
 if(estimates.some(e=>e.recordId===r.id))continue;
 if(!tiers.every(k=>typeof r[k]==='number'))continue;
 const journey=journeys.find(j=>j.recordIds.includes(r.id));
 if(journey)estimates.push({recordId:r.id,low:r.low,central:r.central,high:r.high,method:'Inclusive supplied source aggregate',basis:scale+' '+r.rawText,sourceIds:['REPORT'],includedIn:journey.id,render:false});
}
for(const r of sourceRows){
 if(estimates.some(e=>e.recordId===r.id)||!tiers.every(k=>typeof r[k]==='number'))continue;
 const journey=journeys.find(j=>j.recordIds.includes(r.id));
 if(journey)estimates.push({recordId:r.id,low:r.low,central:r.central,high:r.high,method:'Inclusive supplied source row, counted through its component journeys',basis:scale+' '+r.rawText,sourceIds:['REPORT'],sourceRowId:r.id,includedIn:journey.id,render:false});
}
// Preserve aggregate bounds independently of geographical partition estimates.
const population={schemaVersion:1,title,peoplePerDot:1000,sourcePeoplePerDot:2500,method:scale,estimates,sourceScenarios:extracted.cohorts.map(r=>({id:r.id,low:r.low,central:r.central,high:r.high,categoriesCentral:r.categoriesCentral,parentIds:r.parentIds})),limitations:[]};
const limitations=[scale,
 'Supplied source/parent populations and calibrated cumulative movements describe different periods and scopes. Several descendant totals exceed parents. A separate dated support-prior ledger funds these differences; it does not claim historical births, censuses, or unknown substrate sizes.',
 'All reconstructed controls, exact numeric display dates, footprints, within-row geographic allocations and support priors are preparation choices. No independent historical itinerary or population verification has been completed.',
 'The map tracks modeled migrant and descendant cohorts. Unquantified indigenous Iranian, Tocharian, Greek, Armenian, Slavic, Evenki and other substrates remain unknown in evidence. Their absence from the quantitative model is not absence of inhabitants, and language shift is not drawn as migration.',
 'Huns, Iranian Huns, Rouran-derived Avars and Turco-Mongol cohorts remain disputed or mixed, not automatically Turkic. Genetic ancestry and elite profiles are never converted into headcounts.',
 'The supplied framework uses household multipliers3.5/5/6.5 and critique factors; row values are retained when they do not exactly reproduce those formulas. Original warrior, household, tent and literary counts remain in raw rows.',
 'Functional categories are retained at central tier in source details. Geographical suballocations are not additional people. No independent category filter, local bilingual color-shift model or mortality model is asserted;08A massacre evidence remains intact.',
 'Present-land checking does not reconstruct historical coasts, terrain costs or exact river channels. Maritime segments are explicitly marked. Group genealogies are source links; the visualization names a primary debit pool for reproducible accounting.',
 'The main quantitative table ends1520. Salar prose-only movement has a separate explicitly analogical5k/12.5k/25k display estimate and broad1200–1500 interval, while its source population/date remain unknown. Later or undated Fuyu Kyrgyz and Khoton references remain context outside the quantitative scope; no source headcounts are fabricated.',
 ];
population.limitations=limitations;
const atlas={schemaVersion:1,title,sourceFile:`${stem}.source.txt`,sourceSha256:sha256,sourceWindow:window,earliestMovementYear:-2200,journeys,settlementZones:[],networks:[],limitations,report:{records:journeys.length,inherited:journeys.length,excluded:0,locatedOrigins:journeys.length,locatedDestinations:journeys.length,sourceDated:journeys.length,corridors:journeys.length,zones:0}};
const ledger={schemaVersion:1,journeys:[],estimates:[],reservoirs:[...pools.values()],exclusions:[],destinationColourFrom:-2200,neutralColour:colors.neutral,maxUnmatchedAnnualShare:0,fixedAnnualRate:0,arrivalsWithinWindow:true,scenarioReservoirScales:{low:.4,high:2.2},basis:'Separate dated support priors preserve conserved cohort debits despite underdetermined source generations. Each shared pool receives its preceding modeled movement once. Initial support is the smallest rounded central envelope funding all three supplied scenarios at zero growth (low support40%, high220% of central), plus separately stated retained-core allowance. These are visualization bookkeeping priors, not source population claims. Unknown source baselines remain unknown. '+scale,sources:[]};
const normalized=compileDataset(raw);if(normalized.issues.some(i=>i.level==='error'))throw new Error(JSON.stringify(normalized.issues));
let input=readEstimateInput(population);if(input.issues.length)throw new Error(input.issues.join('\n'));
function compile(){const joined=attachLedger(atlas,input.estimates,ledger);return compileAtlasPopulation(normalized.dataset,joined.atlas,joined.estimates);}
// First compile with generous temporary funding solely to extract per-dot debit
// dates. Those temporary numbers are never written to the delivered data.
for(const pool of ledger.reservoirs)pool.initial=10000000;
const provisional=compile();
for(const mode of ['central','low','high']){
 const variant={...provisional.dataset,migrations:provisional.dataset.migrations.map(m=>({...m,population:{...m.population,value:mode==='low'?m.population.min:mode==='high'?m.population.max:m.population.value}}))};
 const events=ledgerEvents(variant,1000);
 for(const pool of ledger.reservoirs){let balance=0,min=0;for(const event of events.get(pool.id)??[]){balance+=event.delta;min=Math.min(min,balance);}pool.requiredByTier[mode]=Math.max(0,-min);}
}
for(const pool of ledger.reservoirs){
 const required=pool.requiredByTier;
 const extra=pool.retainedCentral??(!journeys.some(j=>j.tags.includes(`reservoir-target:${pool.id}`))?Math.ceil(required.central*.2/1000)*1000:0);
 pool.initial=Math.ceil(Math.max(required.central,required.low/.4,required.high/2.2)/1000)*1000+extra;
 pool.capacity=Math.max(5000,pool.initial+journeys.filter(j=>j.tags.includes(`reservoir-target:${pool.id}`)).reduce((n,j)=>n+input.estimates.get(j.recordIds[0]).high,0));
 pool.displayPrior={low:pool.initial*.4,central:pool.initial,high:pool.initial*2.2,requiredByTier:required,retainedCentral:extra,sourceBaseline:null,method:'Maximum cumulative debit deficit across scenarios; rounded up to1,000 central people with declared retained-core allowance',basis:ledger.basis};
 pool.basis=pool.displayPrior.basis;
}
// The original calculation above determines the same conservative support
// envelope. Destination priors must then travel: they cannot materialize in
// the Caucasus (or any later destination) before the first route arrival.
const originalJourneyIds=new Set(journeys.map(j=>j.id));
const originalEstimateIds=new Set(estimates.map(e=>e.recordId));
const originalPriorTotal=ledger.reservoirs.reduce((n,r)=>n+r.initial,0);
const supportOrigins={
 'COH-00A':{start:-2200,profile:'INNER-MONGOLIA'},
 'COH-00B':{start:-1200,profile:'MONGOLIAN-TURKIC-CORE'},
 'COH-01':{start:350,profile:'WEST-SIBERIAN-OGHUR'},
 'COH-04A':{start:350,profile:'TIELE-CORE'},
 'COH-06':{start:552,profile:'ALTAI-CORE'},
 'COH-10A':{start:-209,profile:'YENISEI-KYRGYZ'},
 'COH-11':{start:656,profile:'ALTAI-CORE'},
 'COH-14B':{start:985,profile:'COH-13'},
 'COH-12A':{start:1000,profile:'COH-11'},
 'COH-12B':{start:1000,profile:'COH-11'},
 'COH-15':{start:1030,profile:'COH-14B'},
 'COH-16A':{start:1042,profile:'COH-15'},
 'COH-16B':{start:1200,profile:'COH-16A'},
 'COH-15A':{start:1350,profile:'EAST-ANATOLIAN-TURKMEN'},
};
const priorRelocations=[];
for(const target of [...ledger.reservoirs]){
 const incoming=journeys.find(j=>j.tags?.includes(`reservoir-target:${target.id}`));
 if(target.initial<=0||!incoming)continue;
 const config=supportOrigins[target.id];if(!config)throw new Error('Missing actual source for relocated support '+target.id);
 const prior=structuredClone(target.displayPrior),reserveId=`SUPPORT-ORIGIN-${target.id}`,id=`MODEL-SUPPORT-${target.id}`;
 const start=incoming.dateRange[0],firstOnward=Math.min(...journeys.filter(j=>j.fromSettlementRecordId===target.id).map(j=>j.dateRange[0]));
 const end=Math.min(incoming.dateRange[1],firstOnward);
 if(end<=start||config.start>start)throw new Error('Invalid support transfer timing '+id);
 const basis=`Reallocated visualization support only: ${prior.low} / ${prior.central} / ${prior.high} people were formerly an initial destination prior in ${target.id}. The same quantity now stands at the reconstructed actual source from ${config.start}, is debited once and travels over ${start}–${end} before onward branches. This is neither a new reported migrant cohort nor a measured source population. Source estimates and their original chronology remain unchanged. Path and dates are reconstructed.`;
 const reserve={id:reserveId,name:`Standing source reserve for ${incoming.name}`,coord:[...incoming.origin.coord],points:[...incoming.origin.sampledArrivalPoints],start:config.start,initial:prior.central,low:prior.low,high:prior.high,capacity:Math.max(5000,prior.central),regionId:`Origin reserve · ${incoming.origin.name}`,group:incoming.groupId,color:incoming.groupColor,closedCohort:true,landscapeSourceId:config.profile,requiredByTier:{low:prior.low,central:prior.central,high:prior.high},basis,displayPrior:{...prior,method:'Same prior relocated to a standing source reserve, then transferred once',basis,relocatedFrom:target.id,originalDestinationStart:target.start,sourceBaseline:null}};
 ledger.reservoirs.push(reserve);
 target.initial=0;target.low=0;target.high=0;
 target.displayPrior={...prior,low:0,central:0,high:0,method:'Zero initial destination population; receives conserved arrivals',basis,relocatedTo:reserveId,relocatedQuantity:{low:prior.low,central:prior.central,high:prior.high},sourceBaseline:null};
 target.basis=basis;
 const model=structuredClone(incoming);
 Object.assign(model,{id,name:`Reconstructed support inflow · ${incoming.name}`,recordIds:[id],linkedRecordIds:[...incoming.recordIds],cohortKey:id,populationKnown:false,population:null,temporalType:'reconstructed-support-transfer',evidence:'MODEL',inherited:false,fromSettlementRecordId:reserveId,dateRange:[start,end],dateLabel:`${start}–${end} (separate conserved support reconstruction)`,tags:['turkic-model','reconstructed','model-support-transfer',`reservoir-target:${target.id}`]});
 const originId=id+'-origin',destId=id+'-destination';
 model.origin={...model.origin,id:originId,name:reserve.name,start,end:start,dateLabel:`Standing source from ${config.start}; departure ${start} (reconstruction)`,basis};
 model.stages=model.stages.map(s=>({...s,id:destId,start:end,end,dateLabel:`Arrivals by ${end} (reconstruction)`,basis}));
 model.corridors=model.corridors.map(c=>({...c,id:id+'-corridor',fromStageId:originId,toStageId:destId,start,end,dateLabel:model.dateLabel,basis}));
 model.source={...model.source,immediateOrigin:reserve.name,dateLabel:model.dateLabel,notes:[note,basis,scale],recordStatus:'separate-conserved-support-visualization',raw:{modelOnly:true,linkedJourneyId:incoming.id,relocatedPrior:prior,sourceBaseline:null,basis}};
 journeys.push(model);
 estimates.push({recordId:id,low:prior.low,central:prior.central,high:prior.high,method:'Transport of an existing visualization support prior, counted once',basis,sourceIds:['REPORT'],sourcePopulation:null,modelOnly:true,relocatedPriorOf:target.id});
 priorRelocations.push({targetId:target.id,reserveId,journeyId:id,linkedJourneyId:incoming.id,sourceCoord:reserve.coord,sourceFrom:config.start,departure:start,arrival:end,prior:{low:prior.low,central:prior.central,high:prior.high},basis});
}
if(Math.abs(ledger.reservoirs.reduce((n,r)=>n+r.initial,0)-originalPriorTotal)>.01)throw new Error('Support relocation created or removed people.');
ledger.basis+=' Positive destination support priors are relocated, never copied, to separately named standing reserves at actual sources. Explicit MODEL-SUPPORT transfers debit those reserves and credit destinations; targets begin at zero and grow only from arrivals. Their source-reserve activation dates and transport windows are separate visualization choices, not a reported census or source migration.';
ledger.supportRelocations=priorRelocations;
limitations.push('Former positive destination support priors have been relocated to actual-origin standing reserves and reach destinations through separate conserved MODEL-SUPPORT transfers. Their activation dates/transport windows are visualization choices, not additional reported migration totals. Supplied cohort estimates and original journey windows are unchanged.');
Object.assign(atlas.report,{records:journeys.length,inherited:journeys.filter(j=>j.inherited).length,locatedOrigins:journeys.length,locatedDestinations:journeys.length,corridors:journeys.length});
raw.groups=[...new Map(journeys.map(j=>[j.groupId,{id:j.groupId,name:j.groupName,color:j.groupColor,sources:[],tags:['turkic-cohort']}])).values()];
const placement=prepareTurkicLandscapes(ledger.reservoirs,journeys,{count:4096});
ledger.landscapes=placement.landscapes;
input=readEstimateInput(population);if(input.issues.length)throw new Error(input.issues.join('\n'));
const compiled=compile();
if(compiled.report.missingEstimateIds.length||compiled.report.unlocatedIds.length)throw new Error(JSON.stringify(compiled.report));
for(const stock of compiled.dataset.settlements)if(!stock.tags.includes('resource-shaped-placement')||stock.extent[0].geometry.kind!=='polygon')throw new Error('Missing irregular landscape placement '+stock.id);
if(geography.some(r=>r.transport==='land-corridor'&&r.longestSegmentWaterKm>=8))throw new Error('Unexpected open-water leg in a land-only corridor.');
const annual=ledgerEvents(compiled.dataset,1000);
const years=[-2200,-1200,-209,160,350,448,462.99,463,470,480,481.2,500,515,552,665,840,1000,1071,1243,1400,1520];
const accounting=years.map(year=>{
 const standing=compiled.dataset.settlements.reduce((n,s)=>n+(year<s.start?0:ledgerBalance(s,annual.get(s.id)??[],year)),0);
 const travelling=compiled.dataset.migrations.reduce((n,m)=>n+transferEvents(m,1000).filter(e=>e.departure<=year&&e.arrival>year).reduce((v,e)=>v+e.people,0),0);
 const activatedPriors=ledger.reservoirs.filter(r=>r.start<=year).reduce((n,r)=>n+r.initial,0);
 if(Math.abs(standing+travelling-activatedPriors)>.1)throw new Error('Conservation failed '+JSON.stringify({year,standing,travelling,activatedPriors}));
 return {year,standing,travelling,activatedPriors};
});
const arrivalOnlyAudit=ledger.reservoirs.filter(r=>journeys.some(j=>j.tags.includes(`reservoir-target:${r.id}`))).map(pool=>{
 if(pool.initial!==0)throw new Error('Destination still has an unfunded initial population '+pool.id);
 const stock=compiled.dataset.settlements.find(s=>s.id===pool.id),events=annual.get(pool.id)??[];
 const series=years.filter(year=>year>=stock.start).map(year=>{
  const arrivals=events.filter(e=>e.year<=year&&e.delta>0).reduce((n,e)=>n+e.delta,0),departures=-events.filter(e=>e.year<=year&&e.delta<0).reduce((n,e)=>n+e.delta,0),standing=ledgerBalance(stock,events,year);
  if(Math.abs(standing-arrivals+departures)>.01)throw new Error('Destination does not equal funded arrivals minus departures '+pool.id);
  return {year,standing,arrivals,departures};
 });
 return {id:pool.id,initial:pool.initial,series};
});
const represented=new Set([...compiled.bindings.values()].flatMap(b=>b.recordIds));
const requiredIds=extracted.cohorts.filter(r=>r.id!=='COH-02').map(r=>r.id);
for(const id of requiredIds)if(!represented.has(id))throw new Error('Unrepresented source cohort '+id);
const report={schemaVersion:1,title,sourceSha256:sha256,preparation:{sourceRows:sourceRows.length,cohortRecords:extracted.cohorts.length,contextRecords:(extracted.contextRecords??[]).length,journeys:journeys.length,representedIds:[...represented],unknownSourcePopulations:sourceRecords.length},software:{...compiled.report,annualRate:compiled.dataset.meta.ledger.annualRate,stocks:compiled.dataset.settlements.length,migrations:compiled.dataset.migrations.length},accounting,geography:geography.filter(r=>r.transport).map(({id,transport,lengthKm,waterKm,longestSegmentWaterKm})=>({id,transport,lengthKm,waterKm,longestSegmentWaterKm})),coordinateAdjustments:geography.filter(r=>r.kind),supportPriors:ledger.reservoirs.map(r=>({id:r.id,start:r.start,...r.displayPrior})),sourceInconsistencies:extracted.inconsistencies??[],verification:{preparation:'Supplied synthesis preserved and reconstructed into separate demographic/geographic models.',software:'Compiler and accounting checks executed during deterministic preparation.',browser:'Performed separately.',historical:'Not independently verified; no actual itinerary or census review.'},limitations};
report.landscapePlacement=placement.report;
report.supportRelocations=priorRelocations;report.arrivalOnlyDestinations=arrivalOnlyAudit;report.centralSupportTotal=originalPriorTotal;
const demographicFingerprint=value=>createHash('sha256').update(JSON.stringify({estimates:value.population.estimates.filter(e=>originalEstimateIds.has(e.recordId)).map(e=>({recordId:e.recordId,low:e.low,central:e.central,high:e.high})),journeys:value.atlas.journeys.filter(j=>originalJourneyIds.has(j.id)).map(j=>({id:j.id,dateRange:j.dateRange,from:j.fromSettlementRecordId,target:j.tags.filter(t=>t.startsWith('reservoir-target:')),corridors:j.corridors.map(c=>({id:c.id,start:c.start,end:c.end}))}))})).digest('hex');
try{
 const previous={population:JSON.parse(await readFile(`${dir}/${stem}.population.json`,'utf8')),ledger:JSON.parse(await readFile(`${dir}/${stem}.ledger.json`,'utf8')),atlas:JSON.parse(await readFile(`${dir}/${stem}.journeys.json`,'utf8'))};
 const before=demographicFingerprint(previous),after=demographicFingerprint({population,ledger,atlas});
 if(before!==after)throw new Error('Support relocation changed an existing cohort estimate, parent or chronology.');
 report.sourceCohortFingerprint={before,after,unchanged:true,originalJourneys:originalJourneyIds.size,originalEstimateRecords:originalEstimateIds.size};
}catch(error){if(error.code!=='ENOENT')throw error;}
raw.agentPreparation={schemaVersion:1,method:'Source-preserving prose extraction, reconstructed geographic corridors and dated conserved population pools',verification:'Preparation only; historical assertions and individual paths remain unreviewed.',inputs:[{role:'supplied-prose',fileName:`${stem}.source.txt`,bytes:bytes.length,sha256}]};
await save('atlas',raw);await save('journeys',atlas);await save('population',population);await save('ledger',ledger);await save('review',report);
await mkdir('public/projects',{recursive:true});
await writeFile('public/projects/turks.json',JSON.stringify({schemaVersion:1,title,dataset:`data/research/${stem}.atlas.json`,sourceDocument:`data/research/${stem}.source.txt`,populationModel:`data/research/${stem}.population.json`,journeys:`data/research/${stem}.journeys.json`,standingLedger:`data/research/${stem}.ledger.json`,viewBounds:[13,27,135,66]},null,2)+'\n');
console.log(JSON.stringify({prepared:title,sourceSha256:sha256,sourceRows:sourceRows.length,cohorts:extracted.cohorts.length,journeys:journeys.length,pools:ledger.reservoirs.length,missingEstimates:compiled.report.missingEstimateIds,unlocated:compiled.report.unlocatedIds},null,2));
