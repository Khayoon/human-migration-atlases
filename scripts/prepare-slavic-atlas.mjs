#!/usr/bin/env node
/** Local, deterministic preparation. Source prose is evidence, never executable input. */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { prepareResearchProject } from '../src/data/research.ts';
import { compileDataset } from '../src/data/loader.ts';
import { readEstimateInput } from '../src/data/estimate-input.ts';
import { compileAtlasPopulation } from '../src/data/atlas-model.ts';
import { attachLedger, ledgerEvents, ledgerBalance, transferEvents } from '../src/data/population-ledger.ts';
import { landCorridor } from './land-corridor.mjs';
import { slavicLandscape } from './slavic-landscapes.mjs';
import { loadLandMask } from './route-landmask.mjs';

const dir = 'public/data/research';
const stem = 'slavic-dispersals';
await mkdir(dir, { recursive: true });
const supplied = process.argv[2];
const sourceFile = `${dir}/${stem}.source.txt`;
if (supplied && resolve(supplied) !== resolve(sourceFile)) await copyFile(supplied, sourceFile);
const bytes = await readFile(sourceFile);
const originalText = bytes.toString('utf8');
const sha256 = createHash('sha256').update(bytes).digest('hex');
const write = (name, value) => writeFile(`${dir}/${stem}.${name}.json`, JSON.stringify(value, null, 2) + '\n');
const window = [-200, 1000];
const peoplePerNFU = 1000;
const title = 'Slavic dispersals · 200 BCE–1000 CE';
const reconstruction = 'Path and dates are reconstructed.';
const scaleBasis = 'Independent illustrative display assumption: 1 normalized flow unit (NFU) = 1,000 people. NFU allocations are supplied scenario weights, not observed headcounts. Ancestry percentages are not converted into people. Bounds are visualization scenarios, not statistical confidence intervals.';
const sourceRefs = [
  { id: 'REPORT', title: 'User-supplied Slavic dispersals report', note: 'Full original wording retained byte-for-byte in slavic-dispersals.source.txt and in research.original.suppliedText.' },
  { id: 'GRETZINGER2025', title: 'Gretzinger et al. (2025), Ancient DNA connects large-scale migration with the spread of Slavs', url: 'https://doi.org/10.1038/s41586-025-09437-6' },
  { id: 'SCHULZ2025', title: 'Schulz et al. (2025), Moravian genetic transect', url: 'https://doi.org/10.1186/s13059-025-03700-9' },
  { id: 'OLALDE2023', title: 'Olalde et al. (2023), A genetic history of the Balkans from Roman frontier to Slavic migrations', url: 'https://doi.org/10.1016/j.cell.2023.10.018' },
  { id: 'STULAR2022', title: 'Štular et al. (2022), Migration of Alpine Slavs and machine learning', url: 'https://doi.org/10.1371/journal.pone.0274687' },
  { id: 'FRONTIERS2025', title: 'Frontiers in Genetics (2025), three-phase Balkan model', url: 'https://doi.org/10.3389/fgene.2025.1610942' },
  { id: 'STOLAREK2023', title: 'Stolarek et al. (2023), Genetic history of East-Central Europe in the first millennium CE', url: 'https://doi.org/10.1186/s13059-023-03013-9' },
  { id: 'UPPERDONFIELDREPORT', title: 'Institute of Archaeology RAS, Upper Don and Voronezh archaeological field report', url: 'https://archaeolog.ru/press/articles/n154', note: 'Used only for late archaeological extent; it supplies no headcount or exact migration itinerary.' },
];
const colours = { core: '#e6c57b', west: '#e4aa61', east: '#7fb8d3', south: '#c58ec9', alps: '#92c999' };
const sourceRecords = [
  ['P1','Zarubintsy cultural horizon','Middle/Upper Dnieper and Pripet','Dnieper forest zone','2nd c. BCE–2nd c. CE','context_only','Archaeological precursor; association with a language is debated.'],
  ['P2','Wielbark cultural horizon','Northern Europe / Scandinavia','Poland and Volhynia','2nd c. BCE–4th c. CE (as supplied)','context_only','Gothic-associated context, not a Slavic migrant cohort. Supplied broad cultural chronology is not a dated Scandinavian departure.'],
  ['P3','Kyiv, Zaozer’e and Cherepyn–Teremtsy horizons','Southern Belarus / northern and central Ukraine','Middle and upper Dnieper staging region','2nd–5th c. CE','context_only','Broad ancestral proxy; exact homeland boundaries and direct genetic links remain unresolved.'],
  ['E1','Penkovka / Antes','Late Kyiv and Chernyakhov contact zone','Middle Dniester–Dnieper forest-steppe','c. 425–700 CE','reconstructed_arrival','Sixth-century external ethnonyms and archaeological horizons are not identical populations.'],
  ['E2','Kolochin northern forest communities','Upper Dnieper / Zaozer’e','Upper Dnieper and Desna','5th–7th c. CE','reconstructed_presence','Retained portion of the shared E2/E4 branch; no separate second founding pool.'],
  ['W1','Korchak and Mogilla communities','Western-central Ukraine','Southern and central Poland','6th–7th c. CE','reconstructed_arrival','Gródek/Podhorce and Mogilla evidence; source ancestry proportions are not a census.'],
  ['W2','Sukow–Dziedzice / Venethi(?)','Vistula–Oder corridor','Southwestern Baltic lowlands','5th/6th–8th c. CE','reconstructed_arrival','West-of-Oder display is delayed to the seventh/eighth centuries; Venethi identification is uncertain.'],
  ['W3','Moravian and Bohemian Prague-Korchak settlers','North Carpathian / Korchak zone','Moravia, Bohemia and western Slovakia','540–680 CE; presence continues to 950+','reconstructed_arrival','AD 846 Sclavos Marganses is an attestation, not an arrival date; Moravian turnover magnitude is difficult to quantify.'],
  ['W4','Elbe–Saale settlers / Sorabi','Oder–Bohemian approaches','Elbe, Mulde and Saale valleys','6th–8th c. CE; Sorabi recorded AD 806','reconstructed_arrival','Late eighth/ninth-century pottery adoption is retained as technology transfer, not additional migrants.'],
  ['S1','Lower Danubian Sclaveni','Dniester–Prut borderland','Wallachia and northwestern Romania','Mid-6th–7th c. CE','recorded_presence','Recorded frontier presence and reconstructed settlement paths remain distinct.'],
  ['S2','Alpine Slavs: two pulses','Middle Danube / Carpathian basin','Mura, Drava and upper Sava valleys','c. 500–700 CE','reconstructed_arrival','First pulse after c. 500 by Mura/Drava; second after c. 675 along the Sava.'],
  ['S3','Early Balkan wave / Iron Gates','Middle and Lower Danube','Northern Balkan interior','6th c. CE','recorded_presence','Ancestry proxy and frontier sources do not establish this route or headcount exactly.'],
  ['S4','Avar-associated Balkan wave','Carpathian basin','Podravina and Dalmatian hinterland','568–700 CE; Velim presence 7th–9th c.','reconstructed_arrival','Includes the onward S5 allocation; local admixture is evidence, not an extra migrant population.'],
  ['S5','Southern Balkan and Greek dispersal','Northern Balkan interior','Mainland Greece and Peloponnese','6th–8th c. CE','reconstructed_arrival','Drawn from S4 as an illustrative secondary allocation; modern ancestry is not an arrival census.'],
  ['S6','Late Dalmatian wave','Central European / Pannonian corridor','Dalmatian hinterland','8th–9th c. CE; Branimir inscriptions 880s','reconstructed_arrival','Late-wave chronology differs between the cited paper’s text and figure; origin traditions are retrospective.'],
  ['E3','Sakhnivka–Luka-Raikovetska / Volyntsevo','Right-bank Korchak zone','Middle Dnieper and left-bank forest-steppe','Late 7th–8th/9th c. CE','reconstructed_arrival','Separate west-to-east movement; cultural replacement does not fix an ethnic boundary.'],
  ['E4','Northeastern forest expansion','Kolochin / upper Dnieper','Volga–Oka interfluve and northwestern Russia','6th–10th c. CE','reconstructed_arrival','Shared E2/E4 allocation over Baltic and Finnic substrates; destination split is a visualization choice.'],
  ['L1','Later eastward expansion','European Russia','Urals and Siberia','11th–19th c. CE','excluded_after_cutoff','Post-1000 extension module; no quantitative statistics supplied.'],
  ['L2','Balkan and Habsburg frontier movements','Balkan interior','Pannonian and Habsburg borderlands','15th–18th c. CE','excluded_after_cutoff','Separate later redistribution module retained in full source.'],
  ['L3','Imperial resettlement and overseas diaspora','Central, eastern and southeastern Europe','Siberia, Far East and the Americas','19th–early 20th c. CE','excluded_after_cutoff','Separate later module; no invented archival totals.'],
  ['L4','Forced transfers and deportations','East-central Europe','Siberia, Central Asia and post-war Europe','1914–1950s','excluded_after_cutoff','Separate later module retained; no counts inferred from medieval genetics.'],
].map(([id,name,origin,destination,date_label,temporal_type,notes]) => ({ id,name,origin,destination,date_label,temporal_type,notes,population:null,evidence:'REPORT',record_status:'supplied-prose-extraction-unreviewed',source_ids:['REPORT'],region: id.startsWith('W')?'Western':id.startsWith('S')?'Southern':id.startsWith('E')?'Eastern':'Context' }));

// Exact NFU rows and their counting scopes remain independent of display people.
const nfuRows = [
  ['W1/W2',[110,180,280],'Net retained in Poland and southwestern Baltic'],
  ['W3',[55,90,145],'Net retained in Bohemia, Moravia and western Slovakia'],
  ['W4',[40,70,110],'Onward from B1, not a second copy of W1/W2'],
  ['E3',[60,100,160],'Onward from B1 to the Dnieper forest-steppe'],
  ['E1',[40,70,110],'Net retained in Penkovka after southern departures'],
  ['S1/S3–S6',[190,320,520],'Balkan waves 1, 2 and 3 combined; S5 included in wave 2'],
  ['S2',[25,40,65],'Two Alpine pulses together'],
  ['E2/E4',[80,130,210],'Northern forest retention and onward expansion together'],
].map(([id,values,scope])=>({id,low:values[0],central:values[1],high:values[2],unit:'NFU',scope}));
const sourceRegister = {
  metadata:{title,scope:'First-millennium Slavic dispersals with archaeological context from 200 BCE. Post-1000 L1–L4 remain separate extension modules in the evidence register.',evidence_codes:{REPORT:'User-supplied synthesis; not independently verified in full'},population_policy:'Unknown source headcounts stay null. NFU is a normalized index. People estimates live only in the separate visualization model.'},
  suppliedText:originalText,sourceSha256:sha256, sources:sourceRefs, records:sourceRecords,
  numerical_anchors:nfuRows.map(r=>({id:`NFU-${r.id}`,label:r.scope,time:'First millennium CE',kind:'normalized-scenario',unit:'NFU',population_dot_eligible:false,source_ids:['REPORT'],scope_warning:'Not an empirical person count.',...r,id:`NFU-${r.id}`})),
  suppliedNFUModel:{rootOutflow:[600,1000,1600],standingCorePool:[800,2000],terminalRows:nfuRows,balkanWaves:[[65,110,180],[85,140,225],[40,70,115]],unknownLocalBands:{'W1/W2':[25,65],W3:[12,35],W4:[7,20],E3:[30,80],E1:[20,50],'S1/S3–S6':[230,640],S2:[15,45],'E2/E4':[30,90]},note:'Local bands are already surviving baselines at contact, not measured censuses. Retention factors are not applied a second time.'},
};
await write('register',sourceRegister);
const raw = prepareResearchProject(sourceRegister,{sourceName:`${stem}.register.json`,sourceDocument:`data/research/${stem}.source.txt`});
raw.meta={...raw.meta,timeRange:window,defaultYear:-200,defaultDotScale:2.6,dotStyle:{outlineColor:'#000000',outlineWidth:1.1,minimumRadius:3.2},presentation:'map-overlays',overviewTitle:'Slavic dispersals',cameraRegions:[{from:-200,to:425,bounds:[24,47.5,35,55]},{from:425,to:1000,bounds:[10.5,36.2,40.5,59.8],transitionYears:80,transitionFromPrevious:true}],defaultView:{center:[25,49],zoom:3.3},playback:{adaptive:false,defaultSpeed:10,schedule:'continuous',phases:[{from:-200,to:425,yearsPerSecond:500},{from:425,to:1000,yearsPerSecond:10}]},description:`${sourceRegister.metadata.scope} ${scaleBasis}`,synthetic:false};

const journeys=[], estimates=[];
const landscapes={};
function landscape(id,coord){return landscapes[id]??=(slavicLandscape(id,coord));}
function stage(id,name,coord,start,end,regionId,color,kind='destination',radius=100) {
  return {id,name,kind,sourceRole:kind==='origin'?'immediate':'destination',coord,start,end,dateLabel:`${start}–${end} CE (reconstruction)`,chronologyKind:'reconstructed-period',uncertain:true,regionId,regionName:regionId,color,precisionKm:radius,basis:'Resource/terrain-informed regional display reconstruction. '+reconstruction,sourceRecordIds:[],sampledArrivalPoints:[],geographicReview:'inherited-unreviewed'};
}
const core=[31,51.2], korchak=[27.5,50.2], penkovka=[29,48.7], kolochin=[32.5,53], westernBasin=[17.5,47.5];
function add({id,name,nfu,from,coords,start,end,region,color,refs=[],recordIds=[id],group=id,radius=110,allocation,sourceIds=['REPORT'],parent,displayDateLabel,estimateMethod}) {
  const origin=stage(`${id}-origin`,from,coords[0],start,start,from,color,'origin',90);
  const dest=stage(`${id}-destination`,region,coords.at(-1),end,end,region,color,'destination',radius);
  origin.sourceRecordIds=[...new Set([...recordIds,...refs])];
  dest.sourceRecordIds=[...origin.sourceRecordIds];
  const originLandscape=landscape(from,coords[0]),destinationLandscape=landscape(id,coords.at(-1));
  origin.sampledArrivalPoints=originLandscape.points;origin.basis=originLandscape.basis;
  dest.sampledArrivalPoints=destinationLandscape.points;dest.basis=destinationLandscape.basis;
  let coordinates=[];
  for(let i=1;i<coords.length;i++){const leg=landCorridor(coords[i-1],coords[i]);coordinates.push(...(coordinates.length?leg.slice(1):leg));}
  const entry=sourceRecords.find(r=>recordIds.includes(r.id));
  const dateLabel=displayDateLabel??entry?.date_label??`${start}–${end} CE (reconstruction)`;
  const basis=`${scaleBasis} Supplied/allotted NFU: ${nfu.join(' / ')}. ${allocation??'Allocation of the shared source model.'}`;
  const e={recordId:id,...Object.fromEntries(['low','central','high'].map((k,i)=>[k,nfu[i]*peoplePerNFU])),method:estimateMethod??'Supplied NFU scenario allocation × explicit display scale',basis,sourceIds, ...(parent?{parentId:parent}:{})};
  estimates.push(e);
  journeys.push({id,name,groupId:group,groupName:group===id?name:sourceRecords.find(r=>r.id===group)?.name??group,groupColor:color,recordIds,linkedRecordIds:refs,cohortKey:id,populationKnown:false,population:null,uncertain:true,temporalType:entry?.temporal_type??'estimated_movement',evidence:'REPORT',inherited:true,excluded:false,dateRange:[start,end],dateLabel,origin,stages:[dest],corridors:[{id:`${id}-corridor`,fromStageId:origin.id,toStageId:dest.id,coordinates,start,end,dateLabel,basis:'Reconstructed guide through the named river basins, lowlands and passes; present-land checks use retained Natural Earth geometry. '+reconstruction,certainty:'conjectural',transport:'land-corridor',timing:'source-window',sourceRecordIds:recordIds}],animationAdmission:'estimated-movement',fromSettlementRecordId:from,...(parent?{releaseWhileParentArrives:true}:{}),source:{collection:'records',ancestralOrigin:'Broad ancestral proxy in southern Belarus and northern/central Ukraine; immediate routes may pass through Carpathian, Moravian and Danubian staging. This is not a direct national origin or a measured ethnic ancestry split.',immediateOrigin:from,destination:region,dateLabel:entry?.date_label??`${start}–${end}`,sourceIds,notes:[reconstruction,basis],recordStatus:'reconstructed-display-model-unreviewed',raw:entry??{id,name,modelOnly:true}},tags:['slavic-model','reconstructed',...(parent?['inclusive-branch']:[])]});
}
function alias(recordId,nfu,includedIn,basis){estimates.push({recordId,low:nfu[0]*peoplePerNFU,central:nfu[1]*peoplePerNFU,high:nfu[2]*peoplePerNFU,method:'Net retention within an inclusive staged cohort',basis:`${scaleBasis} ${basis}`,sourceIds:['REPORT'],includedIn,render:false});}

add({id:'B1',name:'Korchak western staging',nfu:[315,525,835],from:'SLAVIC-CORE',coords:[core,[29.5,50.9],korchak],start:425,end:510,region:'Right-bank Korchak staging',color:colours.west,refs:['P1','P3'],allocation:'Inclusive parent: W1/W2 + W3 + W4 + E3 + western Carpathian/Moravian B4 staging. B4 carries the existing first Alpine and late Dalmatian allocations; these transfers create no additional terminal migrants.'});
add({id:'B2',group:'E1',name:'Forest-steppe and Danubian staging',recordIds:['B2','E1'],nfu:[205,345,555],from:'SLAVIC-CORE',coords:[core,[30.5,50],penkovka],start:425,end:525,region:'Penkovka / forest-steppe staging',color:colours.south,refs:['P3'],allocation:'Inclusive parent: E1 net retention + S1/S3 + S4 (including S5) + second Alpine pulse. First Alpine and late Dalmatian allocations instead use the separate western B4 corridor. This eastern approach is a reconstruction, not exclusive Penkovka ancestry for Balkan populations.'});
alias('E1',[40,70,110],'B2','Net retained after S1/S3, S4 (including S5) and the second S2 pulse leave B2; the first Alpine and late Dalmatian cohorts are separately funded through B1/B4.');
add({id:'B3',group:'E2',name:'Kolochin northern staging',recordIds:['B3','E2'],nfu:[80,130,210],from:'SLAVIC-CORE',coords:[core,[31.5,52],kolochin],start:450,end:575,region:'Upper Dnieper and Desna',color:colours.east,refs:['P3'],allocation:'Shared E2/E4 pool. E2 retention is 30/50/80 NFU; E4 onward transfer is 50/80/130 NFU.'});
alias('E2',[30,50,80],'B3','Net retained after the E4 transfer; not a second population.');
add({id:'B4',name:'Northern Carpathian and Moravian–Pannonian staging',recordIds:['B4','S2','S6'],nfu:[50,85,140],from:'B1',coords:[korchak,[24,50],[21,49.9],[18.5,49.6],[17.3,48.7],westernBasin],start:480,end:560,region:'Moravian and western Pannonian river corridors',color:colours.west,parent:'B1',displayDateLabel:'480–560 CE (reconstructed western staging)',sourceIds:['REPORT','STULAR2022'],allocation:'Display-only staging of existing S2-A 10/15/25 plus S6 40/70/115 NFU. The supplied model allows B1/B2 sources for southern movements; this separate northern Carpathian/Moravian route restores the western approach without removing residents from W3 or adding people. Exact dates and corridor assignment are reconstructed; this is not a measured West/East Slavic ancestry percentage.'});
add({id:'W1-A',group:'W1',recordIds:['W1-A','W1'],name:'Bug valley to Mogilla / southern Poland',nfu:[40,65,100],from:'B1',coords:[korchak,[25,50.4],[23.9,50.8],[22,50.5],[20,50.1]],start:510,end:665,region:'Southern Poland',color:colours.west,radius:105,allocation:'W1 receives 70/110/175 of shared W1/W2 110/180/280 NFU; this southern W1 share is 40/65/100 NFU. All internal splits are illustrative.'});
add({id:'W1-B',group:'W1',recordIds:['W1-B','W1'],name:'Bug and Vistula to central Poland',nfu:[30,45,75],from:'B1',coords:[korchak,[25,50.4],[23.9,50.8],[22,51.2],[21,52],[19.5,52]],start:540,end:680,region:'Central Poland',color:colours.west,radius:130,allocation:'Remaining W1 allocation 30/45/75 NFU; distinct route avoids a jump from the southern arrival pool.'});
alias('W1',[70,110,175],'W1-A','Combined W1 allocation across southern and central Poland. Both journeys remain selectable through the W1 group.');
add({id:'W2',name:'Vistula–Oder and southwestern Baltic',nfu:[40,70,105],from:'B1',coords:[korchak,[23.9,50.8],[21.5,52],[18.5,52.5],[15.1,53],[13.6,53.5],[12.6,53.7]],start:640,end:780,region:'Southwestern Baltic lowlands',color:'#d7c366',radius:140,allocation:'W2 receives the remaining 40/70/105 NFU of W1/W2. Composite west-of-Oder passage is displayed in the later seventh/eighth centuries.'});
add({id:'W3-M',group:'W3',recordIds:['W3-M','W3'],name:'Carpathian foothills to Moravia',nfu:[25,40,65],from:'B1',coords:[korchak,[24,50],[21,49.9],[18.5,49.6],[17.5,49],[16.9,48.7]],start:540,end:670,region:'Moravia',color:'#e29b74',radius:65,allocation:'W3 55/90/145 NFU partitioned into Moravia 25/40/65, Bohemia 20/30/50 and western Slovakia 10/20/30; shares are illustrative.',sourceIds:['REPORT','SCHULZ2025']});
add({id:'W3-B',group:'W3',recordIds:['W3-B','W3'],name:'Moravian gate and Elbe approaches to Bohemia',nfu:[20,30,50],from:'B1',coords:[korchak,[24,50],[21,49.9],[18.5,49.6],[17,49.8],[15.9,50.1],[14.6,50]],start:550,end:675,region:'Bohemia',color:'#e29b74',radius:90,allocation:'Bohemian share of the same W3 cohort, not a duplicate of its total.'});
add({id:'W3-S',group:'W3',recordIds:['W3-S','W3'],name:'Carpathian approaches to western Slovakia',nfu:[10,20,30],from:'B1',coords:[korchak,[24,50],[21,49.9],[18.5,49.6],[18.2,48.9],[17.7,48.5]],start:550,end:675,region:'Western Slovakia',color:'#e29b74',radius:55,allocation:'Western Slovak share of the same W3 cohort.'});
alias('W3',[55,90,145],'W3-M','Inclusive W3 alias across three geographic destinations; no extra population.');
add({id:'W4',name:'Oder–Lusatia to Elbe–Saale',nfu:[40,70,110],from:'B1',coords:[korchak,[23.9,50.8],[20,51.2],[17,51.4],[14.8,51.5],[13.5,51.3],[12.4,51.3],[11.7,51.2]],start:650,end:790,region:'Elbe–Mulde–Saale',color:'#d87968',radius:105,sourceIds:['REPORT','GRETZINGER2025']});
add({id:'E3',name:'Korchak eastward Dnieper movement',nfu:[60,100,160],from:'B1',coords:[korchak,[29.5,50.1],[30.5,50.4],[32,50.7],[34,51]],start:680,end:835,region:'Middle Dnieper and left-bank forest-steppe',color:'#81c0ba',radius:130,allocation:'Inclusive E3 allocation; E3-D takes an illustrative 8/15/25 NFU onward to the Upper Don, leaving 52/85/135 NFU in this pool.'});
add({id:'E3-D',group:'E3',recordIds:['E3-D','E3'],name:'Seym–Oskol interfluves to the Upper Don',nfu:[8,15,25],from:'E3',coords:[[34,51],[35.1,51.4],[36.2,51.7],[37.1,51.6],[38.0,51.9],[39.0,52.3]],start:775,end:950,region:'Upper Don and Voronezh tributaries',color:'#81c0ba',radius:95,parent:'E3',displayDateLabel:'775–950 CE (reconstructed Upper Don continuation)',estimateMethod:'Illustrative onward partition of supplied inclusive E3 NFU × explicit display scale',sourceIds:['REPORT','UPPERDONFIELDREPORT'],allocation:'Display-only 8/15/25 NFU continuation from the inclusive E3 60/100/160 NFU pool. Later eighth–tenth-century archaeological horizons support broad placement; they do not document this route, departure year or headcount. This transfer adds no people.'});
add({id:'S1-D',group:'S1',recordIds:['S1-D','S1'],name:'Prut approaches to Wallachia / Lower Danube',nfu:[15,25,40],from:'B2',coords:[penkovka,[27.5,48],[27.4,46.7],[26.5,45.7],[26.1,44.3]],start:550,end:650,region:'Wallachia / Lower Danube',color:'#b79bd8',radius:115,allocation:'S1 20/35/55 NFU splits into Lower Danube 15/25/40 and northwestern Romania 5/10/15. S1 + S3 preserve first Balkan wave 65/110/180.'});
add({id:'S1-N',group:'S1',recordIds:['S1-N','S1'],name:'Carpathian approaches to Lazuri–Pișcolt region',nfu:[5,10,15],from:'B2',coords:[penkovka,[27,48.3],[25.5,48.1],[24.5,47.8],[23.1,47.6]],start:550,end:655,region:'Northwestern Romania',color:'#b79bd8',radius:65,allocation:'Northwestern share of S1; a distinct Carpathian route avoids jumping over the mountains from Wallachia.'});
alias('S1',[20,35,55],'S1-D','Inclusive S1 source alias across its two destination corridors.');
add({id:'S3',name:'Iron Gates to northern Balkans',nfu:[45,75,125],from:'B2',coords:[penkovka,[27.5,48],[25.8,46.4],[23.6,45.3],[22.53,44.67],[21.22,44.73],[20.5,44]],start:540,end:595,region:'Northern Balkan interior',color:'#ca99c8',radius:115,allocation:'Remainder of first Balkan wave after S1: 45/75/125 NFU.',sourceIds:['REPORT','OLALDE2023']});
add({id:'S4',name:'Avar-associated wave through Pannonia to Dalmatia',nfu:[85,140,225],from:'B2',coords:[penkovka,[26,48.5],[23,47.8],[21.5,47],[19.5,46.5],[16.9,46.2],[16.2,45.7],[15.6,44.7],[15.6,44]],start:568,end:690,region:'Podravina and Dalmatian hinterland',color:'#c58ec9',allocation:'Inclusive wave 2 total; S5 draws 25/45/75 NFU onward, leaving 60/95/150 NFU here. The displayed eastern approach passes through the broader Avar-era Pannonian basin; it does not assert exclusive Penkovka ethnicity or exclude other unquantified Central European contributors.',sourceIds:['REPORT','FRONTIERS2025']});
add({id:'S5',name:'Balkan interior to Greece and Peloponnese',nfu:[25,45,75],from:'S4',coords:[[15.6,44],[16.5,44.3],[18.3,43.8],[20.2,43.1],[21.5,42],[21.6,40.6],[22.4,39.5],[23.3,38.3],[23.35,37.98],[23.04,37.96],[22.86,37.83],[22.3,37.5]],start:650,end:780,region:'Mainland Greece and Peloponnese',color:'#db9cb5',radius:100,parent:'S4',allocation:'Secondary transfer within Balkan wave 2, not added to its 85/140/225 NFU aggregate.'});
add({id:'S6',name:'Central European and western Pannonian–Dalmatian pulse',nfu:[40,70,115],from:'B4',coords:[westernBasin,[17.8,47.1],[17.3,46.5],[16.5,46],[15.5,45.2],[15.6,44]],start:750,end:885,region:'Late Dalmatian hinterland',color:'#b675bd',radius:65,parent:'B4',allocation:'Third Balkan wave: unchanged 40/70/115 NFU, now funded from the western Carpathian/Moravian-Pannonian B4 stock. The supplied Central European origin and western Pannonian approach are a reconstructed regional route, not a measured ethnic ancestry fraction. Supplied eighth/ninth-century interval retained; chronology alternative recorded in limitations.'});
add({id:'S2-A',group:'S2',recordIds:['S2-A','S2'],name:'Alpine pulse 1 · northern Moravian approach to Mura and Drava',nfu:[10,15,25],from:'B4',coords:[westernBasin,[16.8,47.2],[16.1,46.8],[15.4,46.7],[14.3,46.6]],start:525,end:590,region:'Mura and Drava / Eastern Alps',color:colours.alps,radius:60,parent:'B4',allocation:'First Alpine pulse retains 10/15/25 NFU, funded from western Carpathian/Moravian B4 staging. Its northern approach differs from the second, southeastern Sava pulse. Both together preserve supplied S2 25/40/65 NFU; the routing is reconstructed, not a measured ancestry split.',sourceIds:['REPORT','STULAR2022']});
add({id:'S2-B',group:'S2',recordIds:['S2-B','S2'],name:'Alpine pulse 2 · upstream Sava',nfu:[15,25,40],from:'B2',coords:[penkovka,[26,48.5],[23,47.8],[20,46.3],[17,45.5],[15.9,45.8],[14.5,46.1],[14,46.3]],start:675,end:698,region:'Upper Sava / Eastern Alps',color:'#79bba6',radius:55,allocation:'Second Alpine pulse after c. 675; same shared S2 pool.',sourceIds:['REPORT','STULAR2022']});
alias('S2',[25,40,65],'S2-A','Inclusive source alias for both Alpine pulses; group selection includes both journeys.');
add({id:'E4-O',group:'E4',recordIds:['E4-O','E4'],name:'Northern forest rivers to Volga–Oka',nfu:[30,45,75],from:'B3',coords:[kolochin,[32.8,54.7],[34.5,54.9],[36.2,54.5]],start:600,end:970,region:'Volga–Oka forest region',color:colours.east,radius:150,allocation:'E4 50/80/130 NFU split into Volga–Oka 30/45/75 and northwest 20/35/55. Internal shares are illustrative.'});
add({id:'E4-N',group:'E4',recordIds:['E4-N','E4'],name:'Upper Dnieper to northwestern forest rivers',nfu:[20,35,55],from:'B3',coords:[kolochin,[31.7,54.5],[30.8,55.8],[30.5,57],[30.6,58.3],[31.3,58.55]],start:600,end:970,region:'Northwestern forest region',color:'#94c4dc',radius:110,allocation:'Northwestern share of the same E4 pool, with its own river-basin approach.'});
alias('E4',[50,80,130],'E4-O','Combined E4 onward allocation; E2 retention remains in the parent B3 stock.');

// Branch-origin stocks are funded before onward dots leave. The source priors
// are a separate standing-cohort model; no natural growth or locals are invented.
const ledger={schemaVersion:1,journeys:[],estimates:[],landscapes,reservoirs:[{id:'SLAVIC-CORE',name:'Dnieper–Pripet ancestral proxy pool',coord:core,points:landscape('SLAVIC-CORE',core).points,initial:1400000,capacity:2000000,regionId:'Dnieper–Pripet core'}],exclusions:[],destinationColourFrom:-200,neutralColour:colours.core,maxUnmatchedAnnualShare:0,fixedAnnualRate:0,scenarioReservoirScales:{low:4/7,high:10/7},basis:`${scaleBasis} Standing core prior: low 800, central 1,400 (chosen midpoint), high 2,000 NFU; the source supplies only the 800–2,000 band. Outflow is 600/1,000/1,600 NFU. Staging and onward movements are transfers, not additional people. Zero natural growth keeps the illustrative migration cohort conserved; this is not a model of all regional inhabitants, fertility, mortality or local assimilation. P1/P3 contextual horizons refer to the same ancestral proxy, not extra populations.`,sources:sourceRefs.filter(s=>s.url).map(s=>({...s,basis:'Primary reference supporting broad interpretation; no census calibration.'}))};
const limitations=[
  "Settlement positions follow irregular river, terrace, lowland and foothill profiles, with coarse wetland/highland avoidance. Resource weights and envelopes are geographic reconstructions, not a measured medieval resource inventory or surveyed village distribution.",
  scaleBasis,
  'Exact routes, intermediate stops, dates, arrival footprints, internal splits and the 1,400-NFU standing-core midpoint are reconstruction choices; no route has received independent historical review.',
  'Southern movements are not exclusively sourced through Penkovka. Separate B1/B4 northern Carpathian and Moravian-western Pannonian staging funds the existing first Alpine and late Dalmatian cohorts, while S1/S3, S4/S5 and the second Alpine pulse retain eastern/southeastern approaches. These route assignments do not measure West/East ancestry proportions or project later West/East/South Slavic identities backward.',
  'The supplied report’s resolved-debate and precise homeland wording exceeds the primary studies. The core is a broad southern-Belarus/central-Ukraine proxy; contemporaneous homeland reference genomes are scarce.',
  'Genetic ancestry, ceramic culture, external ethnonyms, language, ruling elites and resident populations are distinct. Modern Balkan ancestry percentages cannot establish medieval headcounts.',
  'E3-D is a reconstructed late eighth–tenth-century Upper Don continuation within the supplied inclusive E3 allocation. Its 8/15/25 NFU split, exact 775–950 release period, interfluve itinerary and terrace footprints are display choices, not measured counts or documented arrivals. No extra early Slavic population is created in the southern eastern belts.',
  'Local baseline bands remain in the source model. The animation follows the migrant-origin cohort only; it does not synthesize a census of pre-existing local populations or project ancestry into ethnic identities.',
  'Three-phase Balkan chronology is one cited reconstruction; the late-wave date differs between the Frontiers paper’s figure and text. Retrospective Croat/Serb traditions remain traditions.',
  'P1–P3 are precursor/context horizons, including non-Slavic P2; no independent extra Slavic population is attached to their archaeological polygons. L1–L4 are explicitly later extension modules outside this prepared first-millennium scope.',
  'Present-land geometry guides routes and display locations; it does not reconstruct historic coastlines, local terrain, exact river channels or an actual itinerary. Destination regional labels do not assert modern medieval borders.',
];
const atlas={schemaVersion:1,title,sourceFile:`${stem}.source.txt`,sourceSha256:sha256,sourceWindow:window,earliestMovementYear:425,journeys,settlementZones:[],networks:[],limitations,report:{records:journeys.length,inherited:journeys.length,excluded:0,locatedOrigins:journeys.length,locatedDestinations:journeys.length,sourceDated:14,corridors:journeys.length,zones:0}};
const population={schemaVersion:1,title,peoplePerDot:1000,peoplePerNFU,method:scaleBasis,estimates,suppliedTerminalNFU:nfuRows,corePrior:{low:800000,central:1400000,high:2000000,basis:'Source 800–2000 NFU band; independent scale and midpoint choice.'},terminalAccounting:{low:600000,central:1000000,high:1600000},limitations};
raw.agentPreparation={schemaVersion:1,method:'Prose register extraction plus separate reconstructed geography and NFU visualization model',verification:'Software preparation and limited primary-reference cross-check; not full historical verification.',inputs:[{role:'supplied-prose',fileName:`${stem}.source.txt`,bytes:bytes.length,sha256}]};
raw.groups=[...new Map(journeys.map(j=>[j.groupId,{id:j.groupId,name:j.groupName,color:j.groupColor,tags:['slavic-dispersal'],sources:[]}])).values()];
// Narrative/context belongs in the source workspace, not extra event markers.
raw.events=[];raw.regions=[];
const annotations={schemaVersion:1,presentation:{eventDurationMs:8000,eventFontSize:17,eventDateFontSize:14,eventMaxWidth:270,placeFontSize:18,placeDurationMs:6000},places:[{
  id:'pripyat-marshes',label:'Pripyat Marshes',coord:[27.5,52.0],
  body:'The Pripyat wetlands of Polesia form part of the broad reconstructed ancestral region. Settlement dots favour raised margins, sandy terraces and neighbouring river valleys rather than uniformly filling the bog. This label does not assert one exact homeland or a known medieval resource map.',
  sourceRecordIds:['P1','P3'],
}],events:[...journeys.map(j=>({id:'movement-'+j.id,label:j.name,journeyId:j.id,groupId:j.groupId,regionId:j.stages.at(-1).regionId,recordIds:[...new Set([...j.recordIds,...j.linkedRecordIds])],
  start:j.dateRange[0],end:j.dateRange[1],coord:j.stages.at(-1).coord,dateLabel:j.dateLabel,reconstructed:true,
  body:j.dateLabel+'. '+reconstruction+' This event follows the existing population transfer; it does not add people.'})),
  {id:'context-zarubintsy',label:'Zarubintsy cultural horizon',recordIds:['P1'],start:-200,end:200,coord:[28.8,51.8],dateLabel:'2nd c. BCE to 2nd c. CE',reconstructed:true,body:'Archaeological precursor context. A cultural horizon is not a bounded linguistic or genetic population; no extra migrant cohort is created.'},
  {id:'context-wielbark',label:'Wielbark cultural horizon',recordIds:['P2'],start:-200,end:400,coord:[19.5,52.5],dateLabel:'Broad cultural interval as supplied',reconstructed:true,body:'Gothic-associated regional context retained from the report. This is not a Slavic migrant cohort or an exact dated Scandinavian departure.'},
  {id:'context-kyiv',label:'Kyiv culture and ancestral staging',recordIds:['P3'],start:100,end:500,coord:[31,51.2],dateLabel:'2nd to 5th centuries CE',reconstructed:true,body:'Broad ancestral proxy in the Dnieper region. Exact homeland boundaries and contemporaneous reference genomes remain unresolved.'},
  {id:'sorabi-806',label:'Sorabi recorded on the Elbe',recordIds:['W4'],groupId:'W4',start:806,end:806,coord:[11.8,51.2],dateLabel:'806 CE',reconstructed:false,body:'Frankish annals record the Sorabi on the Elbe in 806 CE. This is a textual attestation, not the date their settlement began.'},
  {id:'moravia-846',label:'Moravian Slavs in Frankish annals',recordIds:['W3'],groupId:'W3',start:846,end:846,coord:[16.9,48.7],dateLabel:'846 CE',reconstructed:false,body:'The supplied report cites Sclavos Marganses under 846 CE. This recorded presence is distinct from the earlier reconstructed settlement interval.'},
  {id:'branimir-inscriptions',label:'Branimir and Dalmatian inscriptions',recordIds:['S6'],groupId:'S6',start:879,end:892,coord:[15.6,44.1],dateLabel:'Late 9th century; Branimir ruled 879-892 CE',reconstructed:false,body:'The report discusses church inscriptions naming Branimir and varying Slavic/Croat titles. These concern regional identity and rulership, not an additional census or a single arrival.'},
  {id:'slow-wheel-pottery',label:'Pottery technology spreads in settled communities',recordIds:['W2','W4'],start:750,end:900,coord:[14,52.2],dateLabel:'Late 8th to 9th centuries CE',reconstructed:true,body:'Feldberg, Tornow and Leipzig wares represent technology transfer and political consolidation in this reconstruction. No new migration population is attached to this event.'},
]};
raw.mapAnnotations=annotations;
await write('annotations',annotations);
await write('atlas',raw);await write('journeys',atlas);await write('population',population);await write('ledger',ledger);
const normalized=compileDataset(raw);if(normalized.issues.some(i=>i.level==='error'))throw new Error(JSON.stringify(normalized.issues));
const input=readEstimateInput(population);if(input.issues.length)throw new Error(input.issues.join('\n'));
const joined=attachLedger(atlas,input.estimates,ledger);
const compiled=compileAtlasPopulation(normalized.dataset,joined.atlas,joined.estimates);
if(compiled.report.missingEstimateIds.length||compiled.report.unlocatedIds.length)throw new Error(JSON.stringify(compiled.report));
const represented=new Set([...compiled.bindings.values()].flatMap(b=>b.recordIds));
const regional=sourceRecords.filter(r=>/^[WES]\d$/.test(r.id));
for(const r of regional)if(!represented.has(r.id))throw new Error(`Unrepresented in-scope source record ${r.id}`);
const water=journeys.map(j=>({id:j.id,...loadLandMask().pathWaterStats(j.corridors[0].coordinates,2,1)})).map(({id,lengthKm,waterKm,longestSegmentWaterKm})=>({id,lengthKm,waterKm,longestSegmentWaterKm}));
if(water.some(r=>r.longestSegmentWaterKm>6))throw new Error('Unexpected open-water reconstructed route: '+JSON.stringify(water));
const annual=ledgerEvents(compiled.dataset,1000);
const audits=[-200,425,500,600,700,800,900,1000].map(year=>({year,standing:compiled.dataset.settlements.reduce((n,s)=>n+(year<s.start?0:ledgerBalance(s,annual.get(s.id)??[],year)),0),travelling:compiled.dataset.migrations.reduce((n,m)=>n+transferEvents(m,1000).filter(e=>e.departure<=year&&e.arrival>year).reduce((v,e)=>v+e.people,0),0)}));
for(const r of audits)if(Math.abs(r.standing+r.travelling-1400000)>.1)throw new Error('Cohort conservation failed: '+JSON.stringify(r));
const report={schemaVersion:1,title,sourceSha256:sha256,scope:sourceRegister.metadata.scope,preparation:{sourceRecords:sourceRecords.length,regionalRecords:regional.length,journeys:journeys.length,sourceHeadcountsKnown:0,representedRegionalIds:regional.map(r=>r.id),contextIds:sourceRecords.filter(r=>r.temporal_type==='context_only').map(r=>r.id),laterModuleIds:sourceRecords.filter(r=>r.id.startsWith('L')).map(r=>r.id)},software:{...compiled.report,annualRate:compiled.dataset.meta.ledger.annualRate,migrations:compiled.dataset.migrations.length,stocks:compiled.dataset.settlements.length,resourceShapedStocks:compiled.dataset.settlements.filter(s=>s.tags.includes('resource-shaped-placement')).length,eventLabels:annotations.events.length},accounting:audits,geography:water,verification:{historical:'Limited primary-reference cross-check only. No census calibration, exhaustive source validation or independent itinerary review.',browser:'Run separately after preparing/building.'},limitations};
await write('review',report);
await mkdir('public/projects',{recursive:true});
await writeFile('public/projects/slavs.json',JSON.stringify({schemaVersion:1,title,dataset:`data/research/${stem}.atlas.json`,sourceDocument:`data/research/${stem}.source.txt`,populationModel:`data/research/${stem}.population.json`,journeys:`data/research/${stem}.journeys.json`,standingLedger:`data/research/${stem}.ledger.json`,annotations:`data/research/${stem}.annotations.json`,viewBounds:[10,36,42,61]},null,2)+'\n');
console.log(JSON.stringify({prepared:title,sourceRecords:sourceRecords.length,journeys:journeys.length,representedRegionalIds:regional.map(r=>r.id),centralCohortPeople:1400000,centralCumulativeMigrants:1000000,sourceSha256:sha256,arabManifestUnchanged:true},null,2));
