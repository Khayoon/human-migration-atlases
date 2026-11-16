#!/usr/bin/env node
/** Local Roma preparation. Supplied prose is preserved evidence, never executable input. */
import {readFile,writeFile,copyFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {prepareResearchProject} from '../src/data/research.ts';
import {compileDataset} from '../src/data/loader.ts';
import {readEstimateInput} from '../src/data/estimate-input.ts';
import {compileAtlasPopulation} from '../src/data/atlas-model.ts';
import {attachLedger,ledgerEvents,ledgerBalance,transferEvents} from '../src/data/population-ledger.ts';
import {landCorridor} from './land-corridor.mjs';
import {sampleLandArrivalPoints} from './route-arrivals.mjs';
import {loadLandMask,distanceKm,interpolateGreatCircle,isLand,useGlobalLandMask} from './route-landmask.mjs';
import {sampleResourceRibbons} from './prepare-landscape-layouts.mjs';
import {phasePlaybackDuration} from '../src/time/phase-pacing.ts';
import {sampleRomaRegionalArea} from './roma-landscapes.mjs';
useGlobalLandMask();

const dir='public/data/research',stem='roma-migrations';
await mkdir(dir,{recursive:true});
const sourceFile=`${dir}/${stem}.source.txt`, supplied=process.argv[2];
if(supplied&&resolve(supplied)!==resolve(sourceFile))await copyFile(supplied,sourceFile);
const bytes=await readFile(sourceFile),suppliedText=bytes.toString('utf8'),sha256=createHash('sha256').update(bytes).digest('hex');
const save=(name,value)=>writeFile(`${dir}/${stem}.${name}.json`,JSON.stringify(value,null,2)+'\n');
const title='Roma migrations · South Asia to the global diaspora',window=[200,2025],tiers=['low','central','high'];
const note='Path and dates are reconstructed.';
const scale='Default 1 dot = 1,000 people. Source low/central/high values are visualization scenarios, not censuses or statistical confidence intervals. Unknown archival headcounts stay null. Genetic effective size and ancestry percentages are not converted into added people. Dated descendant-support priors are disclosed bookkeeping assumptions, not observed births or local admixture.';
const c={origin:'#e9bd69',roma:'#e5ba62',balkan:'#73b9a4',vlax:'#bd95d5',central:'#e69472',northern:'#80b5d5',iberian:'#dc997d',dom:'#c8a476',lom:'#c2b6d5',modern:'#8bbd9a',turkish:'#e8aa70',iraq:'#99c38a',neutral:'#d5bf87'};
const refs=[
{id:'REPORT',title:'User-supplied Cartographic and Historical Synthesis: Romani Migrations from South Asia to the Global Diaspora',note:'Original retained byte-for-byte. All wave rows preserve their complete supplied wording and citation assertions.'},
{id:'MATRAS2015',title:'Yaron Matras (2015), Romani language history',url:'https://migrom.humanities.manchester.ac.uk/wp-content/uploads/2016/01/Matras_2015e1.pdf'},
{id:'MENDIZABAL2012',title:'Mendizabal et al. (2012), Reconstructing the population history of European Romani',url:'https://pubmed.ncbi.nlm.nih.gov/23219723/'},
{id:'MOORJANI2013',title:'Moorjani et al. (2013), Reconstructing Roma history from genome-wide data',url:'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0058633'},
{id:'COE-ABOLITION',title:'Council of Europe, Wallachia and Moldavia: abolition completed 1855/1856',url:'https://rm.coe.int/wallachia-and-moldavia-factsheets-on-romani-history/16808b19be'},
{id:'ACHIM-TRANSNISTRIA',title:'Viorel Achim, RomArchive: Romania',url:'https://www.romarchive.eu/en/voices-of-the-victims/romania/'},
{id:'COE-DEPORTATIONS',title:'Council of Europe, Deportations from Romania',url:'https://rm.coe.int/deportations-from-romania-factsheets-on-romani-history/16808b1c27'},
{id:'USHMM',title:'USHMM, Genocide of European Roma (1939–1945)',url:'https://encyclopedia.ushmm.org/content/en/article/genocide-of-european-roma-gypsies-1939-1945'},
{id:'LOC-REDADA',title:'Library of Congress, Royal Order of October 1749 and the Great Roma Round-up',url:'https://blogs.loc.gov/law/2021/09/the-royal-order-of-october-1749-and-the-historic-consequences-of-the-great-roma-round-up/'},
{id:'TISMANA-LOCATION',title:'Romanian National Archaeological Register, Tismana monastery in Gorj',url:'https://ran.cimec.ro/sel.asp?descript=tismana-oras-tismana-gorj-ansamblul-monastic-de-la-tismana-cod-sit-ran-82449.04'}
];
// Exact wave excerpts include all source units, alternative counts, endonyms and URLs.
const table=suppliedText.slice(suppliedText.indexOf('W-01 (Root Node)'));
const matches=[...table.matchAll(/W-\d{2} \(/g)];
const excerpts=new Map(matches.map((m,i)=>[m[0].slice(0,4),table.slice(m.index,matches[i+1]?.index??table.indexOf('Technical Implementation Guidelines'))]));
if(excerpts.size!==28)throw new Error(`Expected 28 original wave rows, got ${excerpts.size}`);
const definitions=[
['W-01','Central to Northwestern Indian ancestral contact zone',[],[5000,15000,40000],'200–400 CE (display reconstruction before 500)','linguistic-reconstruction','Origin'],
['W-02','Dom comparative: Sasanian Indian workers and musicians',['W-01'],[3000,10000,25000],'224–241 and 420–438 CE traditions','tradition','Dom comparative'],
['W-03','Dom comparative: Zutt and Sayābija forced transfer',['W-02'],[15000,27000,35000],'Late 7th century CE','reported-forced-transfer','Dom comparative'],
['W-04','Proto-Romani founding exodus via Persia and Armenia',['W-01'],[1500,4000,10000],'5th–10th centuries; exodus ~500 CE','linguistic-genetic-reconstruction','Early Romani'],
['W-05','Lom / Posha comparative: Armenian–Anatolian retention',['W-04'],[1000,3000,7500],'9th–11th centuries (hypothesized divergence)','comparative-reconstruction','Lom comparative'],
['W-06','Early Romani: Byzantine Anatolia and Constantinople',['W-04'],[5000,12000,25000],'9th–10th centuries; presence attested 1054','dated-presence','Early Romani'],
['W-07','Romiti / Romitoi: Aegean and Ionian communities',['W-06'],[3000,7500,15000],'Presence 1323–1485; reconstructed earlier settlement windows','dated-presence','Balkan'],
['W-08','Balkan and Ottoman Rumelian core',['W-06'],[45000,75000,120000],'9th–16th-century contact/presence; estimate c.1520','dated-presence','Balkan'],
['W-09','Danubian enslaved Roma · Vlax and Boyash',['W-08'],[3000,6000,12000],'Presence 1385; slavery to 1855/1856 (corrected)','dated-presence-and-enslavement','Vlax'],
['W-10','Central Romani · Romungro, Slovak and Bohemian',['W-08'],[5000,10000,20000],'14th–15th centuries; 1399–1489 attestations','dated-presence','Central'],
['W-11','Sinti and Manuš · connected Western reconnaissance',['W-08','W-10'],[2500,5000,9000],'1407–1423 attestations; 1430 stock scenario','dated-presence','Northern / Northwestern'],
['W-12','Iberian Kale / Calon · Gitanos and Ciganos',['W-11'],[4000,7500,12000],'1425–1516 attestations; 1530 stock scenario','dated-presence','Northern / Northwestern'],
['W-13','Romanichal, Welsh Kale and Nordic Kaale',['W-11'],[1500,3500,6500],'1505–1580 attestations','dated-presence','Northern / Northwestern'],
['W-14','Polska Roma and North Russian Xaladitka',['W-11'],[3000,6000,12000],'Post-1498; 1500–1586 attestations','reported-expulsion-and-presence','Northern / Northwestern'],
['W-15','Calon colonial deportations · Brazil and Africa',['W-12'],[1500,3500,7000],'1538–1750 cumulative; 1574 banishment is not confirmed arrival','reported-forced-transfer','Northern / Northwestern'],
['W-16','Gran Redada · Spanish detention and forced labour',['W-12'],[10000,12000,15000],'30 July 1749 detention; subsequent imprisonment','internment-and-mortality','Northern / Northwestern'],
['W-17','Southern Vlax · Gurbet and Balkan dispersal',['W-09'],[25000,45000,70000],'18th–19th centuries; later Greek resettlement distinct','reported-movement','Vlax'],
['W-18','Post-emancipation Vlax, Boyash and Romungro dispersal',['W-09','W-10'],[30000,60000,100000],'1856–1914; peak later 19th century (abolition corrected)','reported-movement','Vlax'],
['W-19','Transatlantic Romani migrations · Americas',['W-18','W-09'],[15000,35000,65000],'1865–1914','reported-movement','Vlax'],
['W-20','Christian Vlax resettlement from Turkey to Greece',['W-08','W-17'],[8000,18000,30000],'1920s','reported-movement','Vlax'],
['W-21','European Roma and Sinti genocide · inclusive deaths',['W-10','W-11','W-14'],[220000,350000,500000],'1939–1945','inclusive-mortality','Mortality'],
['W-22','Ustaša and occupied Serbia genocide · included in W-21',['W-08','W-17'],[25000,40000,60000],'1941–1945; Jasenovac deportations May 1942','included-mortality','Mortality'],
['W-23','Romanian Roma deported to Transnistria',['W-09'],[24686,25000,26000],'June–September 1942; deaths 1942–1944','reported-forced-transfer','Vlax'],
['W-24','Transnistria survivor return to Romania',['W-23'],[6000,10000,14000],'1942–1946; main returns spring 1944','reported-return','Vlax'],
['W-25','Eastern Slovak Roma · Czech borderlands resettlement',['W-10'],[25000,45000,70000],'1945–1965','reported-movement','Central'],
['W-26','Yugoslav Gastarbeiter and movement to Italy',['W-08','W-17'],[40000,80000,130000],'1968–1989','reported-movement','Balkan'],
['W-27','Post-1989 asylum and Yugoslav war refugees',['W-08','W-09','W-10','W-17'],[120000,200000,300000],'1989–2000','reported-movement','Modern'],
['W-28','Post-visa and EU labor mobility',['W-08','W-09','W-10'],[250000,450000,750000],'2001–2025 display window; source says present','reported-movement','Modern']
];
const sourceRecords=definitions.map(([id,name,parents,values,date_label,temporal_type,region])=>({id,name,origin:'See exact supplied wave excerpt',destination:region,date_label,temporal_type,region,population:null,evidence:'REPORT',record_status:'supplied-prose-extraction-unreviewed',source_ids:['REPORT'],notes:excerpts.get(id),parents,sourceEstimate:Object.fromEntries(tiers.map((k,i)=>[k,values[i]])),rawText:excerpts.get(id)}));
const record=id=>sourceRecords.find(r=>r.id===id)??extensionRecords.find(r=>r.id===id);
const corrections=[
{id:'ABOLITION-1856',recordIds:['W-09','W-18'],original:'Final abolition in 1861',display:'Abolition completed in Moldavia in December1855 and Wallachia in February1856. The source wording remains intact; post-emancipation display starts1856.',sourceIds:['COE-ABOLITION']},
{id:'TISMANA',recordIds:['W-09'],original:[22.95,43.07],display:[22.93,45.08],basis:'Report coordinate falls south of Danube. Derived Tismana/Gorj reference replaces it only in map geometry.',sourceIds:['TISMANA-LOCATION']},
{id:'GENOCIDE-SCOPE',recordIds:['W-21','W-22','W-23'],basis:'W-21 is an inclusive European death estimate. Yugoslav W-22 and Transnistria deaths are included, never added as new victims. USHMM alternative250,000–500,000 retained alongside supplied220,000–500,000.',sourceIds:['USHMM']},
{id:'REDADA-SCOPE',recordIds:['W-16'],basis:'9,000–12,000 detained is distinct from the report’s10,000/12,000/15,000 total Spanish stock scenario. Use detainees as internal forced transfers, never the whole stock.',sourceIds:['LOC-REDADA']},
{id:'TRANSNISTRIA-SCENARIOS',recordIds:['W-23','W-24'],basis:'Reported deportee, death and survivor extrema are not jointly correlated. The animation uses one coherent paired25,000 deported−15,000 deaths−10,000 return scenario at every estimate setting; original alternatives stay separate.',sourceIds:['ACHIM-TRANSNISTRIA','COE-DEPORTATIONS']}
];
const register={metadata:{title,scope:'Seven-phase supplied reconstruction, with 28 wave rows retained, Roma/Sinti primary and Dom/Lom comparative. Modern net-mobile weights are not a census of present-day Roma.',evidence_codes:{REPORT:'User-supplied synthesis, unreviewed except specifically linked preparation corrections'},population_policy:scale},suppliedText,sourceSha256:sha256,records:sourceRecords,sources:refs,corrections,conversionAssumptions:{salasPersons:[5,6.5,8],hanePersons:[4.5,5,6],NeToNc:[3,5,10],basis:'Supplied assumptions retained only. No archival household row or Ne anchor is invented, and genetic percentages create no dots.'},alternatives:[{id:'GHAZNAVID',name:'Contested Ghaznavid military-koiné model,1001–1040',recordIds:['W-04'],coordinates:[[75,29.5],[61.7,37.4],[43.5,39.5]],render:false,basis:'Alternative chronology retained for comparison in research; not an additional Roma founding migration.'},{id:'DE-GOEJE',name:'Proposed Syria→Anatolia Zutt connection',recordIds:['W-03','W-04'],coordinates:[[36.2,36.2],[41.3,39.9]],render:false,basis:'Proposed connection, not evidence that Dom communities became the European Roma.'}],excludedComparativeGroups:['Irish Travellers','Yenish']};
await save('register',register);
// Additional researched presence is a separate visualization extension. The
// supplied source, original register and all28 original rows stay unchanged.
const extensionRefs=[
 {id:'ERRC-SYRIA-2015',title:'ERRC / Kırkayak Kültür (2015), Nowhere to Turn: Situation of Dom Refugees from Syria in Turkey',url:'https://www.errc.org/uploads/upload_en/file/nowhere-to-turn-september-2015.pdf',note:'Fieldwork2014–2015; Damascus and Aleppo major Dom agglomerations, with other Syrian cities. Quoted45,700/>60,000 estimates are weak reported national figures, not city counts or a2025 census.'},
 {id:'IILHR-IRAQ-2013',title:'IILHR (2013), Iraq’s Minorities and Other Vulnerable Groups',url:'https://iilhr.org/wp-content/uploads/2022/08/4_Iraqs-Minorities-and-Other-Vulnerable-Groups-Legal-Framework-Documentation-and-Human-Rights_May2013_EN.pdf',note:'Field/legal report locates southern communities around Diwaniya, Amara/Maysan, Nasiriyah/ThiQar and Basra. Ethnonyms and relations to European Roma require qualification.'},
 {id:'MERI-IRAQ-2024',title:'MERI (2024), field research on Iraqi Roma and related communities',url:'https://www.meri-k.org/wp-content/uploads/2024/01/MERI-Policy-Paper-vol.6-no.2-1.pdf',note:'Original field research reports unknown national population with50,000–200,000 estimates including northern/Kurdistan groups. This is not a verified Dom-only or European-Roma census.'},
 {id:'ERRC-TURKEY-2013',title:'ERRC Turkey country profile (2011–2012; information current to April2013)',url:'https://odihr.osce.org/sites/default/files/f/documents/9/3/105349.pdf',note:'Roma concentrated in western Anatolia, Thrace, Marmara and Aegean; Dom southeast and Lom northeast/east BlackSea. Combined500,000–5,000,000 range includes Roma,Dom,Lom,Abdal and is not a Romanlar-only count.'},
 {id:'ERRC-TURKEY-2008',title:'ERRC / Helsinki Citizens’ Assembly / Edirne Roman association (2008), We Are Here!',url:'https://www.errc.org/uploads/upload_en/file/we-are-here!-discriminatory-exclusion-and-struggle-for-rights-of-roma-in-turkey.pdf',note:'2006–2007 fieldwork and organizations across western/coastal/central Turkey. Izmir neighborhood attested1657–1658; fieldwork places are presence evidence, not arrival dates.'}
];
const allRefs=[...refs,...extensionRefs];
const iraqShares=[['BASRA',.25],['THIQAR',.20],['DIWANIYA',.15],['MAYSAN',.15],['BAGHDAD',.15],['NORTH',.10]];
const turkeyShares=[['MARMARA',.40],['AEGEAN',.35],['MEDITERRANEAN',.15],['ANKARA',.05],['BLACKSEA',.05]];
const iraqNames={BASRA:'Basra',THIQAR:'Nasiriyah / ThiQar',DIWANIYA:'Diwaniya',MAYSAN:'Amara / Maysan',BAGHDAD:'Baghdad',NORTH:'northern Iraq / Kurdistan'};
const turkeyNames={MARMARA:'Thrace and Marmara',AEGEAN:'Izmir and the Aegean',MEDITERRANEAN:'Mersin and Adana',ANKARA:'Ankara',BLACKSEA:'Samsun and the BlackSea'};
const extensionRows=[
 ['EXT-DOM-DAMASCUS','Dom of Damascus / Barada–Ghouta margins','Dom comparative',['W-03'],[4500,8100,10500],['ERRC-SYRIA-2015'],'Presence documented2014–2015; display redistribution920–1600','30% allocation of the one W03 standing comparative pool; source does not date arrival or count Damascus residents.'],
 ['EXT-DOM-ORONTES','Dom of Homs–Hama / Orontes','Dom comparative',['W-03'],[2250,4050,5250],['ERRC-SYRIA-2015'],'Presence documented2014–2015; display redistribution920–1600','15% allocation of the one W03 standing comparative pool; no independent duplicate population.'],
 ['EXT-DOM-ANATOLIA','Dom of southeastern Anatolia','Dom comparative',['W-03'],[2250,4050,5250],['ERRC-TURKEY-2013','ERRC-SYRIA-2015'],'Presence documented2006–2015; display redistribution1000–1900','15% allocation of the one W03 comparative pool to southeastern contact networks; excluded from the separate Turkish Romanlar total.'],
 ...iraqShares.map(([region,share])=>[`EXT-IRAQ-${region}`,`Iraqi Kawliya / Dom and related communities · ${iraqNames[region]}`,'Iraq comparative',['W-02'],[5000,10000,20000].map(v=>v*share),['IILHR-IRAQ-2013','MERI-IRAQ-2024'],'Presence documented2013/2024; earlier regional distribution is reconstructed',`${share*100}% of a separate5/10/20k retained-Iraq reference cohort. It is additional to the reported27k forced transfer, which did not establish that all Iraqi inhabitants departed. Connection to European Roma and uniform Dom identity are not asserted.`]),
 ...turkeyShares.map(([region])=>[`EXT-ROMANLAR-${region}`,`Turkish Romanlar · ${turkeyNames[region]}`,'Turkish Romanlar',['W-06'],({MARMARA:[2000,5000,10000],AEGEAN:[2000,4000,8000],MEDITERRANEAN:[1000,2000,4000],ANKARA:[500,1000,2000],BLACKSEA:[500,1000,2000]})[region],['ERRC-TURKEY-2013','ERRC-TURKEY-2008'],'Regional presence documented2006–2013; Izmir also1657–1658; display redistribution1300–1900','Small historical regional reference cohort, not an observed population or a modern mass-arrival count. Modern Romanlar calibration is one shared separate500k/1m/2m scenario split among regions.']),
 ['EXT-LOM-BLACKSEA','Lom / Posha in northeastern Anatolia and eastern BlackSea','Lom comparative',['W-05'],[1000,3000,7500],['ERRC-TURKEY-2013'],'Modern presence documented2011–2013; chronology of W05 remains reconstructed','Geographic refinement of the existing W05 comparative cohort; no extra people or European Roma founding link.']
];
const extensionRecords=extensionRows.map(([id,name,region,parents,values,source_ids,date_label,notes])=>({id,name,region,parents,origin:region==='Iraq comparative'?'Lower Tigris Iraqi communities; exact external ancestry unresolved':'Regional NearEastern/Anatolian contact network',ancestral_origin:region==='Iraq comparative'?'Local Iraqi presence; connection to European Roma uncertain':region==='Turkish Romanlar'?'Anatolian/Balkan Romani continuity; no extra Indian founding migration':'Separate Dom/Lom comparative branch; no asserted European Roma descent',destination:name,date_label,temporal_type:'dated_presence_with_separate_display_reconstruction',population:null,sourcePopulation:null,source_ids,record_status:'visualization-extension-unreviewed',evidence:'FIELD-PRESENCE',notes,visualizationEstimate:Object.fromEntries(tiers.map((k,i)=>[k,values[i]])),estimateOrigin:'Explicit preparation scenario; not a reported locality headcount'}));
const nationalScenarios={
 iraq:{recordId:'EXT-IRAQ-MODERN-COHORT',sourcePopulation:null,low:50000,central:100000,high:200000,evidenceYear:2024,supportPeriod:[1900,2024],method:'Explicit national scenario using a broad reported50k–200k envelope and chosen100k central reference, partitioned once across six regions',basis:'The broad source category includes Kawliya/Dom and northern/Kurdistan related groups. Subregional shares are display choices; this is not a uniform ethnicity or European Roma census.',sourceIds:['MERI-IRAQ-2024','IILHR-IRAQ-2013']},
 turkey:{recordId:'EXT-ROMANLAR-MODERN-COHORT',sourcePopulation:null,low:500000,central:1000000,high:2000000,evidenceYear:2013,supportPeriod:[1900,2013],method:'Chosen Romanlar-only visualization scenarios500k/1m/2m, partitioned once across five regions',basis:'The source500k–5m combined range includes Roma,Dom,Lom,Abdal and cannot be treated as a Romanlar census or copied to each region. These separately chosen scenarios exclude the Dom/Lom comparative stocks.',reportedCombinedEnvelope:{low:500000,high:5000000,groups:['Roma','Dom','Lom','Abdal']},sourceIds:['ERRC-TURKEY-2013','ERRC-TURKEY-2008']}
};
const extensionPacket={schemaVersion:1,title:'NearEastern and Anatolian presence: separate visualization extension',originalSourceSha256:sha256,originalRowsUnchanged:true,records:extensionRecords,sources:extensionRefs,nationalScenarios,limitations:['Presence observations do not date arrival. All numerical locality allocations and earlier routes are reconstructed display choices.','The one27k source transfer is not cloned. Separate retained-Iraq assumptions do not assert that every Iraqi group shares Dom or European Roma ancestry.','Modern source observations2013/2024 are not2025 censuses. Conflict displacement, return and local undercount are unresolved.']};
await save('extensions',extensionPacket);
const raw=prepareResearchProject(register,{sourceName:`${stem}.register.json`,sourceDocument:`data/research/${stem}.source.txt`});
const extensionCatalogue=prepareResearchProject({metadata:{title:extensionPacket.title,scope:'Field-presence evidence and separate model choices; original supplied register retained independently.'},sources:allRefs,records:extensionRecords}).research;
raw.research.records.push(...extensionCatalogue.records);raw.research.sources=extensionCatalogue.sources;
raw.research.report={...raw.research.report,totalRecords:raw.research.records.length,researchedRecords:raw.research.records.length,unlocatedRecords:raw.research.records.length,unknownPopulationRecords:raw.research.records.length,sourceCount:raw.research.sources.length,issues:[...raw.research.report.issues,...extensionCatalogue.report.issues]};
raw.research.visualizationExtensions={file:`data/research/${stem}.extensions.json`,recordIds:extensionRecords.map(r=>r.id),basis:'Prepared field-presence extension, separate from research.original and the28 supplied source rows.'};
raw.meta={...raw.meta,timeRange:window,defaultYear:200,defaultDotScale:2.4,dotScaleRevision:'roma-outlined-2026-11-15',dotStyle:{outlineColor:'#000000',outlineWidth:1.2,minimumRadius:4},cameraPath:[{year:200,opening:true},{year:500,bounds:[32,22,85,48]},{year:800,bounds:[28,24,80,55]},{year:1100,bounds:[-13,27,58,62]}],cameraRegions:[{from:900,to:2025,bounds:[-13,27,58,62],transitionYears:200}],continuationCues:[{id:'roma-americas',from:1538,to:2025,text:'↙ Some went to Brazil and the Americas',groupIds:['Northern / Northwestern','Vlax'],regionIds:['Bahia landward coastal strip','Northeastern US coastal and Hudson/Delaware approaches','Southeastern Brazil Tietê and Paraíba valley approaches']}],defaultView:{center:[48,34],zoom:2.7},playback:{adaptive:false,defaultSpeed:20,schedule:'continuous',phases:[{from:200,to:500,yearsPerSecond:25},{from:500,to:2025,yearsPerSecond:20}]},description:register.metadata.scope+' '+scale,synthetic:false};
raw.events=[];raw.regions=[];
const journeys=[],estimates=[],pools=new Map(),geography=[];
const sample=(coord,radius,id,count=512)=>sampleLandArrivalPoints({center:coord,radiusKm:radius,count,seed:id}).points;
// Separate environmental display geography. These are irregular weighted
// resource ribbons, not radial clouds clipped to land or political polygons.
const profileRows=[
['INDIC-CORE','Ganga–Yamuna interfluve approaches',[[[81,25.5],[79.5,26.4],[78.3,27.2],[77.7,28]]],.22],
['NW-INDIA','Punjab river plains and northern Rajasthan foothill approaches',[[[76,30.8],[75,31.2],[74.3,31.1],[72.7,30.5],[71.5,29.7]],[[75,30.3],[75.6,29.5],[76.2,28.8]]],.24],
['DOM-INDIA','Separate comparative Sindh/Indus bank corridor',[[[68.3,26.7],[68.7,27.5],[69.2,28.3],[69.8,29.2]]],.15],
['IRAN','Iranian plateau river-valley and foothill staging',[[[55.5,35.9],[54.2,35.8],[52.9,35.6],[51.4,35.7]],[[51.1,35.9],[50.3,36.2],[49.1,36.3]]],.13],
['ANATOLIA-EAST','Eastern and central Anatolian valley staging',[[[42.4,39.8],[41.3,39.9],[39.6,39.7],[38.4,39.2]],[[38.4,39.2],[37.2,39.1],[35.7,39.3],[34.1,39.5]]],.14],
['DOM-IRAN','Separate Dom comparative Iranian foothill staging',[[[54.2,33.9],[53.1,34.3],[51.8,34.7],[50.5,35]],[[50.5,35],[49.4,35.4],[48.1,36.1]]],.13],
['DOM-ANATOLIA','Separate Dom comparative eastern Anatolian valley staging',[[[42.2,39.5],[40.9,39.3],[39.5,38.9]],[[39.5,38.9],[38.4,38.6],[37.8,38.4]]],.12],
['LOM-INDIA','Separate Lom comparative northwestern Indian river plains',[[[74.1,30.9],[74.8,31.1],[75.5,30.8]],[[74.9,30.4],[75.4,29.9],[75.9,29.3]]],.12],
['LOM-IRAN','Separate Lom comparative northern Iranian valley staging',[[[54.3,36.1],[53.1,36],[51.7,36.1],[50.2,36.4]]],.12],
['DOM-TIGRIS','Tigris–Karun levee and foothill approaches, avoiding marsh cores',[[[47.4,31.6],[46.9,32.2],[46,32.8],[45.3,33.4]],[[48.2,31.6],[48.4,32.2],[48.5,32.8]]],.16],
['DOM-SYRIA','Orontes and northern Syrian river terraces',[[[36.1,35.9],[36.3,36.3],[36.6,36.7],[37.2,36.8]],[[37.9,35.9],[38.5,36.4],[39.3,36.2]]],.12],
['ARMENIA','Aras and Armenian plateau valley approaches',[[[42.7,39.7],[43.5,39.8],[44.2,40],[44.7,40.2]],[[41.3,39.9],[42,40.1],[42.7,40.4]]],.15],
['LOM-COMPARATIVE','Independent comparative Armenian/Karin valley source',[[[41.2,39.9],[42,40.1],[43,40.2],[44,40.1]]],.12],
['LOM-ARMENIA','Lom comparative northern Anatolian and Armenian valleys',[[[41.2,39.9],[42,40.1],[43.2,40.2],[44.5,40.3]],[[33.4,40.5],[34.1,40.7],[34.9,40.7]],[[40.7,40.95],[41,41.05],[41.45,41.15],[41.8,41.2]]],.12],
['BYZANTIUM','Byzantine Anatolian valleys, Thrace and Marmara coast',[[[28.9,41.05],[28.2,41.2],[27.2,41.4],[26.6,41.6]],[[28.3,40.9],[27.5,40.8],[26.8,40.7]],[[27.4,38.6],[28.4,38.5],[29.5,38.7]],[[29,40.2],[30,40.3],[31,40.4]],[[30.6,38.8],[32.5,39.4],[34.4,38.9]],[[34.5,36.9],[35.4,37],[36.2,37.1]]],.10],
['BALKAN-CORE','Maritsa, Morava–Vardar and Thracian valley network',[[[26.5,41.7],[25.6,42.1],[24.7,42.2],[23.3,42.7]],[[21.7,43.3],[21.2,42.6],[21.4,42],[22,41.2]],[[21.1,43.8],[20.4,44.3],[19.5,44.6]]],.16],
['DANUBIAN-CORE','Wallachian/Danubian plains and Siret/Carpathian foothills',[[[22.9,45.05],[24.1,44.6],[25.1,44.5],[26.1,44.4],[27.3,44.6]],[[26.9,45.3],[27.1,46.1],[26.7,46.8],[26.1,47.5]]],.17],
['CENTRAL-CORE','Middle Danube, Morava and eastern Slovak valley network',[[[17,48.2],[18.2,47.7],[19,47.5],[20.1,48.1],[21.2,48.9]],[[17,48.5],[17.3,49],[16.6,49.3],[15.3,49.8],[14.4,50.1]]],.14],
['SINTI-CORE','Elbe, Rhine and adjacent lowland approaches',[[[9.9,52.1],[11.5,51.8],[12.8,51.4],[13.4,50.9]],[[6.9,51.4],[7.2,50.5],[7.8,49.5],[7.6,48.6],[8.1,47.7]],[[7.5,48.1],[6,48.5],[4.8,48.4]]],.14],
['IBERIAN-CORE','Ebro, Tagus and Guadalquivir terraces',[[[1.1,41.6],[-.9,41.65],[-2.2,41.3]],[[ -3.5,40],[-5,39.8],[-6.6,39.5],[-8.1,39],[-9,38.7]],[[ -3.7,37.7],[-4.8,37.8],[-5.7,37.4],[-6.2,37]]],.13],
['BRITAIN','Thames, Midlands, Welsh and Scottish lowland corridors',[[[.1,51.5],[-1.3,51.8],[-1.8,52.4],[-1.2,53.1]],[[ -2.8,51.8],[-3.4,52.2],[-3.8,52.5]],[[ -3.5,55.9],[-2.7,55.7],[-2.1,55.9]]],.10],
['NORDIC','Baltic landward coastal lowlands near Sweden and Finland',[[[17.6,59.5],[18.1,59.3],[18.4,59.1]],[[22.2,60.45],[23.1,60.3],[24,60.3],[24.9,60.2],[25.5,60.3]]],.06],
['NE-CORE','Vistula, Baltic river terraces and upper Volga–Oka approaches',[[[18.6,53.1],[20.1,52.5],[21,52.2]],[[24.4,54.6],[25.3,54.7],[26,55.4]],[[25,57.7],[26.3,58.1],[27.6,58.4]],[[34,56.6],[35.8,56.4],[37.6,55.8]]],.14],
['COLONIAL-BRAZIL','Bahia landward coastal strip',[[[ -38.4,-12.7],[-38.2,-12.1],[-37.8,-11.6]],[[ -39,-13.6],[-38.9,-14.3],[-39.1,-14.8]]],.08],
['COLONIAL-AFRICA','Separate Luanda inland coast and São Tomé/Cape Verde landings',[[[13.3,-8.8],[13.5,-9.1],[13.8,-9.5]],[[6.62,.22],[6.65,.3]],[[ -23.6,15.1],[-23.58,15.2]]],.035],
['REDADA-CUSTODY','Illustrative Seville–Cádiz landward forced-labour geography',[[[ -5.95,37.35],[-6.02,36.96],[-6.12,36.73],[-6.15,36.55]]],.045],
['SOUTH-VLAX','Balkan/Southern Vlax lowland and valley network',[[[20.5,44.8],[21.2,43.4],[21.2,42.6],[21.4,41.9]],[[22.8,40.7],[24.2,41],[25.4,41.2],[26.7,41.3],[28.3,41.15]],[[18.3,43.8],[19.2,44.1],[20.1,44.3]]],.12],
['DIASPORA-EU','Rhine, Danube and Paris-basin diaspora approaches',[[[16.4,48.2],[14.3,48.5],[12.2,49],[9.4,49.4],[7.5,49.2]],[[7.3,48.6],[5.2,48.8],[3.5,49],[2.4,48.85]]],.13],
['AMERICAS-US','Northeastern US coastal and Hudson/Delaware approaches',[[[ -74,40.8],[-74.1,41.2],[-73.9,41.8]],[[ -75.2,40],[-75.4,40.4],[-76,40.6]]],.10],
['AMERICAS-LATIN','Southeastern Brazil Tietê and Paraíba valley approaches',[[[ -46.8,-23.5],[-46.1,-23.2],[-45.5,-23],[-44.6,-22.8]],[[ -47.3,-23.2],[-47.8,-22.8],[-48.4,-22.6]]],.09],
['GREECE','Macedonian plain and northern Greek river terraces',[[[22.4,40.7],[22.9,40.8],[23.4,41],[24.2,41.1]]],.09],
['TRANSNISTRIA','Southern Bug landward terraces; reconstructed colony region',[[[31,47.1],[31.25,47.4],[31.3,47.7],[31.1,48.1]]],.09],
['CZECH-BORDERLANDS','Northern Bohemian, Moravian and Silesian river corridors',[[[13.2,50.4],[13.8,50.5],[14.4,50.7],[15,50.6]],[[17.2,50],[18.25,49.85],[18.7,49.8]]],.09],
['MODERN-WEST','Rhine–Ruhr, Low Countries and Paris-basin networks',[[[7.9,48.1],[8.4,49],[7.6,50.3],[6.9,51.4],[6.1,51.8]],[[6,51.9],[5,52.1],[4.4,51.9]],[[7.6,49.4],[5.9,49.2],[4,49],[2.4,48.9]]],.12],
['MODERN-ITALY','Po lowlands and Tiber valley approaches',[[[8,45],[9.2,45.2],[10.5,45.1],[11.8,44.9]],[[12,43.5],[12.3,42.8],[12.5,42.2],[12.5,41.9]]],.10],
['CRETE','Crete north-coast landward lowlands',[[[24.1,35.4],[24.6,35.35],[25.1,35.3],[25.6,35.2]]],.045],
['CORFU','Corfu eastern landward coastal strip',[[[19.86,39.76],[19.86,39.67],[19.88,39.6],[19.92,39.5]]],.018],
['MODON','Western Peloponnese coastal and valley approaches',[[[21.7,36.85],[21.7,37.05],[21.65,37.2],[21.5,37.45]]],.045],
['CYPRUS','Mesaoria lowlands and landward coastal approaches',[[[32.9,35.1],[33.3,35.15],[33.6,35.17],[33.85,35.13]]],.045],
['SICILY','Sicilian southeastern lowlands and coastal plain',[[[14.9,37.5],[15.05,37.25],[15.05,37],[15,36.8]]],.05]
 ,['DOM-DAMASCUS','Damascus · Barada and dry Ghouta margins',[[[36.18,33.43],[36.3,33.49],[36.45,33.55],[36.56,33.56]]],.055]
 ,['DOM-ORONTES','Homs–Hama · Orontes dry river terraces',[[[36.64,34.65],[36.69,34.9],[36.74,35.15]]],.06]
 ,['DOM-SE-ANATOLIA','Dom · southeastern Anatolian valleys and foothills',[[[37.2,37.05],[38.2,37.15],[38.8,37.2]],[[39.7,37.9],[40.2,37.9],[40.7,37.5]]],.09]
 ,['IRAQ-BASRA','Basra · Shatt al-Arab dry levees',[[[47.82,30.4],[47.78,30.52],[47.75,30.65],[47.7,30.77]]],.045]
 ,['IRAQ-THIQAR','Nasiriyah and Al-Shatra · Euphrates dry margins',[[[46.2,31.03],[46.33,31.2],[46.25,31.4],[46.15,31.55]]],.055]
 ,['IRAQ-DIWANIYA','Diwaniya · irrigated Euphrates terrace approaches',[[[44.77,31.8],[44.91,31.98],[45.1,32.1]]],.055]
 ,['IRAQ-MAYSAN','Amara / Maysan · Tigris dry levees',[[[47.18,31.68],[47.05,31.85],[46.95,32.05]]],.055]
 ,['IRAQ-BAGHDAD','Baghdad–Diyala · Tigris and canal terrace approaches',[[[44.2,33.2],[44.4,33.35],[44.6,33.6],[44.8,33.9]]],.07]
 ,['IRAQ-NORTH','Northern Iraqi related communities · Mosul and Kurdistan',[[[43,36.3],[43.2,36.5]],[[44,36.1],[44.2,36.3]],[[42.9,36.8],[43.2,36.9]]],.07]
 ,['ROMANLAR-MARMARA','Turkish Romanlar · Thrace and Marmara lowlands',[[[26.6,41.7],[27.2,41.6],[27.7,41.25],[28.6,41.05],[28.94,41.05]],[[27.5,40.2],[28.2,40.2],[29.05,40.2],[29.8,40.4],[30.2,40.7]]],.09]
 ,['ROMANLAR-AEGEAN','Turkish Romanlar · Izmir, Gediz and Menderes valleys',[[[27.1,38.4],[27.4,38.6],[27.9,38.6],[28.3,38.5]],[[27.4,37.8],[27.9,37.8],[28.5,37.9]],[[26.9,39.3],[27.2,39.6],[27.8,39.65]]],.075]
 ,['ROMANLAR-MEDITERRANEAN','Turkish Romanlar · Mersin–Adana lowlands',[[[34.5,36.8],[35,36.95],[35.4,37],[35.8,36.95]]],.07]
 ,['ROMANLAR-ANKARA','Turkish Romanlar · Ankara valley approaches',[[[32.5,39.8],[32.9,39.95],[33.3,40]]],.07]
 ,['ROMANLAR-BLACKSEA','Turkish Romanlar · Samsun and western BlackSea terraces',[[[35.7,41.3],[36,41.25],[36.3,41.25],[36.7,41.15]],[[31.8,41.4],[32.2,41.5],[32.4,41.6]]],.06]
];
const inside=(p,ring)=>{let v=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])v=!v;}return v;};
const wetlandCores=[{id:'hammar-marsh-interior',polygon:[[46.7,30.68],[47.35,30.68],[47.35,30.95],[46.7,30.95]]},{id:'hawizeh-marsh-interior',polygon:[[47.4,31.15],[47.78,31.15],[47.82,31.65],[47.4,31.55]]},{id:'central-marsh-interior',polygon:[[46.85,31.02],[47.25,31.02],[47.25,31.25],[46.85,31.25]]},{id:'polissia-marsh-core',polygon:[[24.3,51.35],[28.9,51.35],[29.8,52.4],[25,52.5]]},{id:'danube-delta-core',polygon:[[28.9,44.8],[29.9,44.8],[29.9,45.6],[28.9,45.6]]}];
const resourceBasis='Separate reconstructed environmental placement: variable-width river/valley/lowland, foothill and landward-coast ribbons. Local widths/weights and broad wetland-core exclusions are display assumptions, not an elevation/climate raster, surveyed settlement boundary, ethnic census or documented itinerary. Dots avoid present water and the declared wetland cores; population totals are unchanged.';
const landscapeProfiles=new Map(profileRows.map(([id,name,lines,margin])=>{const broad=sampleRomaRegionalArea({id,count:1024,wetlandCores});if(broad)return[id,{id,name,lines,...broad,wetlandCoreIds:wetlandCores.map(w=>w.id)}];const all=lines.flat(),xs=all.map(p=>p[0]),ys=all.map(p=>p[1]),box=[Math.min(...xs)-margin,Math.min(...ys)-margin,Math.max(...xs)+margin,Math.max(...ys)+margin];const segments=lines.flatMap(line=>line.slice(1).map((b,i)=>({a:line[i],b,kind:'river'})));const points=sampleResourceRibbons({id:'roma-'+id,box,segments,fallback:[],year:200,exclusions:[],count:1536}).filter(p=>!wetlandCores.some(w=>inside(p,w.polygon))).slice(0,1024);if(points.length<128)throw new Error('Insufficient resource points for '+id);return[id,{id,name,lines,box,points,kind:'resource-ribbon-footprint',basis:resourceBasis,resourceKinds:['reconstructed-river-valley','lowland-and-foothill','landward-coast'],wetlandCoreIds:wetlandCores.map(w=>w.id)}];}));
await save('geography',{schemaVersion:1,basis:resourceBasis+' Western European and Anatolian profiles use broad two-dimensional suitability areas; their separate component envelopes and weights are retained per profile.',wetlandCores,profiles:[...landscapeProfiles.values()]});
function onLand(coord,id){if(isLand(coord,1))return coord;const p=sample(coord,55,id,256).sort((a,b)=>distanceKm(a,coord)-distanceKm(b,coord))[0];if(!p)throw new Error(`No land near${coord}`);geography.push({id,kind:'rounded-control-to-present-land',sourceCoordinate:coord,displayCoordinate:p});return p;}
function pool(id,name,coord,start,color=c.neutral,radius=95,group=id){if(!pools.has(id)){coord=onLand(coord,id);const profile=landscapeProfiles.get(id);if(!profile)throw new Error('Missing environmental footprint '+id);pools.set(id,{id,name:profile.name,coord,start,color,group,points:profile.points,initial:0,capacity:10000000,regionId:profile.name,placementBasis:profile.basis,requiredByTier:{low:0,central:0,high:0}});}else pools.get(id).start=Math.min(pools.get(id).start,start);return pools.get(id);}
function stage(id,name,coord,start,end,color,kind,radius=90){return{id,name,coord,start,end,color,kind,sourceRole:kind==='origin'?'immediate':'destination',dateLabel:`${start}–${end} CE (reconstruction)`,chronologyKind:'reconstructed-period',uncertain:true,regionId:name,regionName:name,precisionKm:radius,basis:'Regional display footprint, not a surveyed settlement boundary. '+note,sourceRecordIds:[],sampledArrivalPoints:[],geographicReview:'inherited-unreviewed'};}
function water(a,b){const n=Math.max(1,Math.ceil(distanceKm(a,b)/25));return Array.from({length:n+1},(_,i)=>i===n?b:interpolateGreatCircle(a,b,i/n));}
function add(id,sourceId,from,to,coords,start,end,{name,values,region,group,color=c.roma,maritime=[],basis='',travelYears=60,radius=95,extraRecords=[],extraSourceIds=[]}={}){
const r=record(sourceId);name??=r.name;values??=tiers.map(k=>(r.sourceEstimate??r.visualizationEstimate)[k]);group??=r.region;
const sourceIds=[...new Set([...(r.source_ids??['REPORT']),...extraSourceIds])],extension=!!r.visualizationEstimate;
coords=coords.map((p,i)=>i===0||i===coords.length-1||!maritime.includes(i)||!maritime.includes(i+1)?onLand(p,id+'-'+i):p);
const fromPool=pool(from,from,coords[0],start,color,radius,group),toPool=pool(to,region??name,coords.at(-1),start,color,radius,group);
const origin=stage(id+'-origin',fromPool.name,coords[0],start,start,color,'origin',radius),dest=stage(id+'-destination',toPool.name,coords.at(-1),end,end,color,'destination',radius);
origin.sampledArrivalPoints=fromPool.points;dest.sampledArrivalPoints=toPool.points;origin.basis=fromPool.placementBasis+' '+note;dest.basis=toPool.placementBasis+' '+note;
const ids=[...new Set([id,sourceId,...extraRecords])];origin.sourceRecordIds=ids;dest.sourceRecordIds=ids;
const path=[];for(let i=1;i<coords.length;i++){const leg=maritime.includes(i)?water(coords[i-1],coords[i]):landCorridor(coords[i-1],coords[i]);path.push(...(path.length?leg.slice(1):leg));}
estimates.push({recordId:id,low:values[0],central:values[1],high:values[2],method:extension?'Explicit visualization-extension reference scenario and conserved regional allocation':'Explicit source scenario allocation with conserved standing-cohort transfers',basis:`${scale} ${basis} ${extension?r.notes:''} Source record: ${sourceId}.`,sourceIds,sourceRowId:sourceId});
journeys.push({id,name,groupId:group,groupName:group,groupColor:color,recordIds:ids,linkedRecordIds:r.parents,cohortKey:id,populationKnown:false,population:null,uncertain:true,temporalType:r.temporal_type,evidence:r.evidence??'REPORT',inherited:true,excluded:false,dateRange:[start,end],dateLabel:r.date_label,origin,stages:[dest],travelYears,corridors:[{id:id+'-corridor',fromStageId:origin.id,toStageId:dest.id,coordinates:path,start,end,dateLabel:r.date_label,basis:'Reconstructed corridor through named regions; present-land constraints apply to land legs, ocean legs are explicitly maritime. '+note+' '+basis,certainty:'conjectural',transport:maritime.length?'mixed':'land-corridor',timing:'source-window',sourceRecordIds:ids}],fromSettlementRecordId:from,animationAdmission:'estimated-movement',source:{collection:'records',ancestralOrigin:r.ancestral_origin??'Central/Northwestern South Asia; separate comparative group relationships remain uncertain',immediateOrigin:fromPool.name,destination:toPool.name,dateLabel:r.date_label,sourceIds,notes:[note,basis,scale,...(extension?[r.notes]:[])],recordStatus:extension?'separate-visualization-extension-unreviewed':'reconstructed-display-model-unreviewed',raw:r},tags:['roma-model','reconstructed',`reservoir-target:${to}`,...(extension?['visualization-extension']:[]),...(r.region.includes('comparative')?['comparative-layer']:[])]});
geography.push({id,transport:maritime.length?'mixed':'land-corridor',...loadLandMask().pathWaterStats(path,2,1)});
}
const sub=(id,src,from,to,coords,start,end,share,opt={})=>add(id,src,from,to,coords,start,end,{...opt,values:tiers.map(k=>record(src).sourceEstimate[k]*share),basis:`Illustrative ${share*100}% geographic allocation within ${src}; not an extra cohort. ${opt.basis??''}`});
const continuityBasis='User-directed continuity reconstruction: separately identified South Asian comparative origins visibly pass through Iran and Anatolia before the southward Syrian/Iraqi distribution. This display sequence is not established by the Sasanian traditions or the reported seventh-century lower-Tigris-to-Syria transfer. Those original directions, textual dates and hypotheses remain unchanged in the source register. The staged display intervals and long cohort transits are explicit visualization choices, not observed personal travel times.';
pool('INDIC-CORE','Central Indo-Aryan contact-zone display pool',[79.5,26.5],200,c.origin,145,'Origin').initial=15000;
Object.assign(pool('DOM-INDIA','Separate comparative South Asian Dom source',[68.5,27.5],200,c.dom,95,'Dom comparative'),{initial:10000,low:3000,high:25000});
Object.assign(pool('LOM-INDIA','Separate comparative South Asian Lom source',[74.8,30.5],200,c.lom,95,'Lom comparative'),{initial:3000,low:1000,high:7500});
add('W-01','W-01','INDIC-CORE','NW-INDIA',[[79.5,26.5],[77,28],[76.5,28.5],[74,31]],200,400,{group:'Origin',color:c.origin,travelYears:150,basis:'Display interval200–400 is a broad reconstruction before500; no precise source departure year. A150-year staged cohort transit keeps the actual opening movement visible, rather than sending each dot across the route in one year.'});
add('W-02','W-02','DOM-INDIA','DOM-IRAN',[[68.5,27.5],[66.5,29.2],[63.2,31.2],[60.2,33],[56.5,34.1],[52.5,34.5]],200,450,{name:'Dom comparative · reconstructed South Asia to Iran',group:'Dom comparative',color:c.dom,travelYears:150,basis:continuityBasis+' This independent3/10/25k comparative ancestry prior is visible in South Asia at the opening, not first created in420 or in Iraq. Ardashir224–241 and Bahram420–438 remain literary source traditions, not these numerical departure dates.'});
add('DOM-IRAN-ANATOLIA','W-02','DOM-IRAN','DOM-ANATOLIA',[[52.5,34.5],[50.2,35.2],[48.3,36.1],[46,37.4],[43.5,38.5],[41.4,39.1]],400,650,{name:'Dom comparative · reconstructed Iran to Anatolia',group:'Dom comparative',color:c.dom,travelYears:150,basis:continuityBasis+' The same W02 comparative cohort is handed over; this is not a second3/10/25k founding population.'});
add('DOM-ANATOLIA-SYRIA','W-03','DOM-ANATOLIA','DOM-SYRIA',[[41.4,39.1],[40.1,38.6],[38.6,38],[37.4,37.2],[36.8,36.7],[36.2,36.2]],650,900,{name:'Dom comparative · reconstructed Anatolia to Syria',values:[20000,37000,55000],group:'Dom comparative',color:c.dom,travelYears:120,extraRecords:['W-02'],basis:continuityBasis+' This combined20/37/55k descendant reference carries both the Syrian15/27/35k allocation and the retained Iraqi5/10/20k branch once. The original W03 report instead describes a late-seventh-century lower-Tigris-to-Syria transfer; its27k claim remains evidence, not proof of this changed direction.'});
add('DOM-SYRIA-IRAQ','EXT-IRAQ-BASRA','DOM-SYRIA','DOM-TIGRIS',[[36.2,36.2],[38,36],[40,35.7],[42.5,35.1],[44.4,33.8],[46,32.6],[47.3,31.8]],850,1150,{name:'Iraqi comparative · reconstructed Syria to lower Tigris',values:[5000,10000,20000],group:'Iraq comparative',color:c.iraq,travelYears:120,extraRecords:iraqShares.map(([region])=>`EXT-IRAQ-${region}`),basis:continuityBasis+' One retained-Iraq5/10/20k reference branch leaves the shared Syrian staging stock, leaving the original15/27/35k Syrian comparative allocation. This user-directed ancestral display is not evidence that all Iraqi Kawliya, Dom-related or northern communities have one origin or a demonstrated European-Roma ancestry.'});
add('W-04','W-04','NW-INDIA','IRAN',[[74,31],[70,31],[66,32],[62,33],[57,35],[53,35.7]],500,700,{name:'Proto-Romani founding cohort · Northwestern India to Iran',group:'Early Romani',color:c.roma,travelYears:120,basis:'One founding cohort first settles in an explicit Iranian staging pool.500–700 is an allocation inside the broad500–850 reconstruction, not a documented departure. Contact regions are not a proven highway.'});
add('ROMANI-IRAN-ARMENIA','W-04','IRAN','ARMENIA',[[53,35.7],[51.4,35.7],[49,36.3],[47,37],[45.2,38.4],[43.5,39.5]],650,850,{name:'Proto-Romani founding cohort · Iran to Armenia',group:'Early Romani',color:c.roma,travelYears:120,basis:'The same1.5/4/10k W04 founding cohort passes through Iran before Armenia. Successive stage totals describe the same people and must never be added. Dates and120-year cohort transit are reconstructed display choices.'});
add('LOM-INDIA-IRAN','W-05','LOM-INDIA','LOM-IRAN',[[74.8,30.5],[70,31.3],[66,32.4],[62,33.4],[58,35.4],[53.5,36.1]],350,600,{name:'Lom comparative · reconstructed South Asia to Iran',group:'Lom comparative',color:c.lom,travelYears:150,basis:continuityBasis+' Separate1/3/7.5k comparative South Asian origin, visible from200. It is not debited from or asserted as a documented split of the European Roma founder.'});
add('LOM-IRAN-ARMENIA','W-05','LOM-IRAN','LOM-COMPARATIVE',[[53.5,36.1],[50.6,36.4],[48.4,37.3],[46.2,38.5],[43.5,39.5]],600,850,{name:'Lom comparative · reconstructed Iran to Armenian/Anatolian valleys',group:'Lom comparative',color:c.lom,travelYears:150,basis:'The same independent Lom comparative cohort visibly precedes its Armenian/Anatolian presence. This hypothetical approach is not a documented exact itinerary or an independent new founder.'});
add('W-05','W-05','LOM-COMPARATIVE','LOM-ARMENIA',[[43.5,39.5],[44.5,40.2],[42.7,40.5],[41.3,39.9]],850,1050,{group:'Lom comparative',color:c.lom,travelYears:100,extraRecords:['EXT-LOM-BLACKSEA'],extraSourceIds:['ERRC-TURKEY-2013'],basis:'Independent comparative Lom source pool receives its actual predecessor from India through Iran before regional redistribution. The source W04 parent link is preserved as a hypothesis, not a debit from the European Roma founder or an established single Roma–Lom founding split. Eastern BlackSea presence is a modern field-source refinement, not extra people.'});
add('W-06','W-06','ARMENIA','ANATOLIA-EAST',[[43.5,39.5],[41.3,39.9],[39.8,39.6],[37.5,39.3],[35.5,39.4]],850,1000,{name:'Early Romani · Armenia to central/eastern Anatolia',group:'Early Romani',travelYears:80,basis:'1054 is an attestation, not a numeric arrival date. Descendants of the arrived W04 cohort move into a separate central/eastern Anatolian stage before reaching Marmara. The earlier850–1020 broad display span is partitioned into actual stage handovers, not treated as an attested itinerary. Founder-to-descendant support is progressive and requires living predecessors.'});
add('ROMANI-ANATOLIA-MARMARA','W-06','ANATOLIA-EAST','BYZANTIUM',[[35.5,39.4],[34,39.5],[32,39.7],[30.5,40],[29.2,40.8],[28.98,41.01]],950,1100,{name:'Early Romani · Anatolian continuity toward Marmara and Thrace',group:'Early Romani',travelYears:100,basis:'The same5/12/25k W06 descendant cohort traverses Anatolia before the broad Marmara/Thracian pool.950–1100 is a disclosed geographic-stage reconstruction, not an exact source date or another new population.'});
const aegean=[
['CRETE',.25,[[28.98,41.01],[25,39],[25.13,35.34]],1250,1323,[1,2]],
['CORFU',.15,[[28.98,41.01],[24,40.7],[20.5,40],[19.92,39.62]],1300,1373,[3]],
['MODON',.35,[[28.98,41.01],[24,40.7],[22.5,38.5],[21.7,36.82]],1300,1384,[]],
['CYPRUS',.15,[[28.98,41.01],[30,36],[33.4,35.1]],1420,1468,[1,2]],
['SICILY',.10,[[28.98,41.01],[24,40.7],[21.7,36.82],[17,36.5],[14,37.6]],1440,1485,[3,4]]];
for(const [to,share,coords,start,end,maritime]of aegean)sub('W-07-'+to,'W-07','BYZANTIUM',to,coords,start,end,share,{group:'Balkan',color:c.balkan,maritime,radius:to==='CORFU'?18:55,basis:'Island attestations are not separate entire7,500-person cohorts. Reconstructed departure precedes first presence.'});
add('W-08','W-08','BYZANTIUM','BALKAN-CORE',[[28.98,41.01],[26.2,41.4],[25.5,41.2],[23.34,42.13],[21.2,42.6]],1100,1300,{group:'Balkan',color:c.balkan,basis:'The supplied75,000 central value is a c.1520 stock scenario applied as an inclusive regional display cohort, not an archival count of arrivals1100–1300. Subsequent branches debit this same pool.'});
add('W-09','W-09','BALKAN-CORE','DANUBIAN-CORE',[[21.2,42.6],[22.7,43.5],[23.2,44],[22.93,45.08],[25.6,47.87]],1300,1385,{group:'Vlax',color:c.vlax,basis:'Early3/6/12k model; 150–250k abolition-era stock is retained separately, not copied onto this movement. Corrected Tismana map reference45.08N,22.93E and1855/1856 abolition.'});
add('W-10','W-10','BALKAN-CORE','CENTRAL-CORE',[[21.2,42.6],[20.5,45],[19,47.4],[20.77,49],[17,49],[14.44,50.08]],1300,1490,{group:'Central',color:c.central,basis:'One Central branch across regional nodes, not a new population at each attestation. The reconstructed approach begins1300 to allow actual staged60-year cohort travel before the later municipal-presence network; this is not a newly documented1300 arrival. Later1780 scenario35/50/70k remains a distinct stock estimate.'});
add('W-11','W-11','CENTRAL-CORE','SINTI-CORE',[[19,47.4],[16,48.3],[14.44,50.08],[12,51],[9.95,52.15]],1390,1415,{group:'Northern / Northwestern',color:c.northern,basis:'Shared Sinti/Manuš precursor; Western1417–1423 sightings are one small connected circuit below, not seven permanent waves.'});
add('W-11-CIRCUIT','W-11','SINTI-CORE','SINTI-CORE',[[9.95,52.15],[9.68,47.55],[7.36,48.08],[7.4,46.9],[4.4,51.2],[6.15,52.25],[8.5,47],[9,46.1],[11.34,44.49],[12.5,41.9],[9,46.1],[9.95,52.15]],1417,1423,{values:[150,300,600],group:'Northern / Northwestern',color:c.northern,travelYears:6,basis:'One illustrative150/300/600-person reconnaissance band returning to its shared parent stock. City sequence is a reconstructed connected circuit, not a claim all attestations were the identical band.'});
add('W-12','W-12','SINTI-CORE','IBERIAN-CORE',[[9.95,52.15],[6,48],[3.8,43.6],[2.4,42.5],[-.89,41.65],[-4,40],[-9.1,38.7]],1420,1530,{group:'Northern / Northwestern',color:c.iberian,basis:'Iberian stock scenario allocated once; source1530 estimate includes descendants and is not measured border crossings.'});
sub('W-13-BRITAIN','W-13','SINTI-CORE','BRITAIN',[[9.95,52.15],[4.4,51.2],[-.1,51.5],[-3.19,55.95],[-3.8,52.3]],1500,1579,.55,{group:'Northern / Northwestern',color:c.northern,maritime:[2],basis:'55% illustrative share to Britain; no Traveller ancestry inferred.'});
sub('W-13-NORDIC','W-13','SINTI-CORE','NORDIC',[[9.95,52.15],[10,54.3],[12.57,55.68],[18.07,59.33],[24.9,60.2]],1500,1580,.45,{group:'Northern / Northwestern',color:c.northern,maritime:[2,3,4],radius:65,basis:'45% illustrative share via Denmark and Sweden to Finnish Kaale; first records are not exact arrivals.'});
add('W-14','W-14','SINTI-CORE','NE-CORE',[[9.95,52.15],[16,52.2],[21,52.3],[25.28,54.69],[28,56],[30.3,59.9],[37.6,55.7]],1498,1600,{group:'Northern / Northwestern',color:c.northern,basis:'Inclusive northeastern branch; Polish, Lithuanian, Baltic and Russian sites are contacts within a broad pool, not additive cohorts.'});
sub('W-15-BRAZIL','W-15','IBERIAN-CORE','COLONIAL-BRAZIL',[[-9.1,38.7],[-10,36],[-23.6,15.1],[-38.5,-12.97]],1538,1750,.7,{group:'Northern / Northwestern',color:c.iberian,maritime:[1,2,3],radius:100,basis:'70% illustrative allocation; João Torres1574 banishment is not treated as confirmed arrival.'});
sub('W-15-AFRICA','W-15','IBERIAN-CORE','COLONIAL-AFRICA',[[-9.1,38.7],[-10,36],[-23.6,15.1],[6.6,.2],[13.23,-8.84]],1538,1750,.3,{group:'Northern / Northwestern',color:c.iberian,maritime:[1,2,3,4],radius:40,basis:'30% illustrative allocation among named Atlantic African destinations; no source share is known.'});
add('W-16-DETAINED','W-16','IBERIAN-CORE','REDADA-CUSTODY',[[-4,40],[-5.9,37.4],[-6.2,36.6]],1749.57,1749.58,{values:[9000,10500,12000],group:'Northern / Northwestern',color:c.iberian,travelYears:.01,radius:50,basis:'9–12k detained; central10.5k is midpoint. Geographic prison/forced-labour reference is illustrative, not all victims sent to Cádiz. This is internal coercive movement, not emigration.'});
add('W-16-RELEASE','W-16','REDADA-CUSTODY','IBERIAN-CORE',[[-6.2,36.6],[-5.9,37.4],[-4,40]],1763,1765,{values:[8500,10000,11500],group:'Northern / Northwestern',color:c.iberian,travelYears:.2,basis:'Paired modeled release after a conservative500-death minimum; exact release timing and residual mortality are not established for each detainee.'});
add('W-17','W-17','DANUBIAN-CORE','SOUTH-VLAX',[[25.6,47.87],[26,44.4],[22.7,43.5],[20.5,44.8],[21.2,42.6]],1750,1900,{group:'Vlax',color:c.vlax,basis:'Southern Vlax scenario from the shared Danubian descendants; not another Indian founder.'});
sub('W-18-VLAX','W-18','DANUBIAN-CORE','DIASPORA-EU',[[25.6,47.87],[26.1,44.4],[23,46],[19,47.5],[16.4,48.2],[12,49],[7,49],[2.3,48.8]],1856,1914,.8,{group:'Vlax',color:c.vlax,travelYears:20,basis:'80% illustrative Vlax/Boyash allocation. Corrected1856 emancipation lower display bound; source1861 wording retained.'});
sub('W-18-ROMUNGRO','W-18','CENTRAL-CORE','DIASPORA-EU',[[20.77,49],[17.3,47.8],[16.4,48.2],[12,49],[7,49],[2.3,48.8]],1861,1914,.2,{group:'Central',color:c.central,travelYears:20,basis:'20% illustrative separate Hungarian Romungro allocation; no need to route them through Romanian slavery.'});
sub('W-19-USA','W-19','DIASPORA-EU','AMERICAS-US',[[2.3,48.8],[.2,49.5],[-5,49],[-30,45],[-60,42],[-74,40.7]],1890,1914,.6,{group:'Vlax',color:c.vlax,maritime:[2,3,4,5],radius:95,travelYears:10,basis:'60% illustrative Americas allocation. This draws from W18 once; W19 is included within its60k central emigrant pool. The display departure begins1890 after actual W18 predecessors arrive, within the supplied later-nineteenth-century reconstruction; no support independently founds the diaspora pool.'});
sub('W-19-LATIN','W-19','DIASPORA-EU','AMERICAS-LATIN',[[2.3,48.8],[.2,49.5],[-5,49],[-20,25],[-35,-10],[-46.6,-23.5]],1890,1914,.4,{group:'Vlax',color:c.vlax,maritime:[2,3,4,5],radius:120,travelYears:10,basis:'40% illustrative allocation represented by southeastern Brazil; not a census of all Latin America or Caribbean. The display begins1890 after actual W18 predecessors arrive; original source chronology is retained.'});
add('W-20','W-20','SOUTH-VLAX','GREECE',[[28.5,41],[26.5,41.2],[24.5,41],[22.9,40.6]],1920,1929,{group:'Vlax',color:c.vlax,basis:'Christian Vlax-speaking resettlement scenario; ancestry and faith are not inferred for other Turkish Roma.'});
add('W-23','W-23','DANUBIAN-CORE','TRANSNISTRIA',[[26.1,44.4],[27,45.4],[29.5,46.7],[30.3,47],[31.1,47],[31,47.5]],1942.42,1942.78,{values:[25000,25000,25000],group:'Vlax',color:c.vlax,travelYears:.02,radius:55,basis:'Explicit coherent central paired scenario at every UI tier:25,000 deported. Source24,686–26,000 and40,090 selected persons remain distinct in evidence;15k die and10k return, never25k live at Bug in2025.'});
add('W-24','W-24','TRANSNISTRIA','DANUBIAN-CORE',[[31,47.5],[31.1,47],[29.5,46.7],[27,45.4],[26.1,44.4]],1944.2,1946,{values:[10000,10000,10000],group:'Vlax',color:c.vlax,travelYears:.05,basis:'Paired10,000 return in the coherent25k−15k model. Independent source6/10/14k survivor alternatives and2k early escapes remain preserved.'});
add('W-25','W-25','CENTRAL-CORE','CZECH-BORDERLANDS',[[21.2,48.9],[18.26,49.82],[16.8,50],[14.44,50.08],[13.8,50.5]],1945,1965,{group:'Central',color:c.central,basis:'Cumulative transfer25/45/70k;16,752 registered1947 in Czech lands is a dated presence stock, not an extra arrival. German expulsion totals are not Romani dots.'});
sub('W-26-GERMANY','W-26','SOUTH-VLAX','MODERN-WEST',[[21.2,42.6],[20.5,44.8],[16,46],[13.5,47],[10,48],[8.7,50.1]],1968,1989,.75,{group:'Balkan',color:c.balkan,basis:'75% of cumulative80k central guest-worker scenario; circular travel is represented by one net permanent allocation.'});
sub('W-26-ITALY','W-26','SOUTH-VLAX','MODERN-ITALY',[[21.2,42.6],[20.5,44.8],[16,46],[13.5,45.8],[12,44],[12.5,41.9]],1968,1989,.25,{group:'Balkan',color:c.balkan,basis:'25% illustrative Italy allocation including named Lovari/Rudari/Khajniari context, not an additional80k.'});
for(const [label,from,coords,share]of [
['BALKAN','BALKAN-CORE',[[21.2,42.6],[20.5,44.8],[16,46],[13.5,47],[10,51]],.35],
['VLAX','SOUTH-VLAX',[[21.2,42.6],[20.5,44.8],[16,46],[13.5,47],[10,51]],.25],
['ROMANIA','DANUBIAN-CORE',[[26.1,44.4],[23,46],[19,47.5],[16,48.2],[12,50],[10,51]],.25],
['CENTRAL','CENTRAL-CORE',[[20.77,49],[16,49],[12,50],[10,51]],.15]])sub('W-27-'+label,'W-27',from,'MODERN-WEST',coords,1989,2000,share,{group:'Modern',color:c.modern,basis:'Geographic proportions are bookkeeping choices. Asylum and war-displacement are not measured by ethnic passport totals.'});
for(const [label,from,coords,share]of [
['ROMANIA','DANUBIAN-CORE',[[26.1,44.4],[23,46],[19,47.5],[16,48.2],[12,50],[10,51]],.5],
['BALKAN','BALKAN-CORE',[[21.2,42.6],[20.5,44.8],[16,46],[13.5,47],[10,51]],.35],
['CENTRAL','CENTRAL-CORE',[[20.77,49],[16,49],[12,50],[10,51]],.15]])sub('W-28-'+label,'W-28',from,'MODERN-WEST',coords,2001,2025,share,{group:'Modern',color:c.modern,basis:'Net mobile-pool allocation, not all present-day Roma or cumulative journeys. W27 and W28 are modeled disjoint era allocations; individual overlap is unknown in source.'});
// Regional presence extensions transfer shared cohorts; no locality receives
// a cloned national estimate or an asserted exact modern arrival date.
add('EXT-DOM-DAMASCUS','EXT-DOM-DAMASCUS','DOM-SYRIA','DOM-DAMASCUS',[[36.2,36.2],[36.74,35.15],[36.7,34.75],[36.3,33.49]],920,1600,{color:c.dom,travelYears:60,basis:'One30% regional allocation within W03, moving through the Orontes/Barada contact corridor after the preceding Syrian staging transfer finishes900. The short settled interval prevents large display units from departing before the common parent arrives. Modern Damascus presence does not establish this itinerary or these earlier dates.'});
add('EXT-DOM-ORONTES','EXT-DOM-ORONTES','DOM-SYRIA','DOM-ORONTES',[[36.2,36.2],[36.5,35.7],[36.74,35.15],[36.69,34.75]],920,1600,{color:c.dom,travelYears:60,basis:'One15% regional allocation within W03, after the preceding Syrian staging transfer finishes900. The original northern stock retains40% after all three extension transfers.'});
add('EXT-DOM-ANATOLIA','EXT-DOM-ANATOLIA','DOM-SYRIA','DOM-SE-ANATOLIA',[[36.2,36.2],[36.8,36.8],[37.4,37.1],[38.8,37.2],[40.2,37.9]],1000,1900,{color:c.dom,travelYears:60,basis:'One15% comparative allocation within W03. Southeastern Dom are not included in the Turkish Romanlar model and are not given an extra European Roma founder.'});
const iraqRoutes={
 BASRA:[[47.3,31.8],[47.3,31.5],[47.6,31],[47.78,30.52]],
 THIQAR:[[47.3,31.8],[46.8,31.7],[46.3,31.4],[46.25,31.05]],
 DIWANIYA:[[47.3,31.8],[46.5,32],[45.7,32.1],[44.92,31.98]],
 MAYSAN:[[47.3,31.8],[47.1,31.85],[46.95,32.05]],
 BAGHDAD:[[47.3,31.8],[46.5,32.3],[45.4,32.9],[44.4,33.35]],
 NORTH:[[47.3,31.8],[46.5,32.3],[45.4,32.9],[44.4,33.35],[43.6,34.5],[43.1,36.3]]
};
for(const [region,share]of iraqShares)add(`EXT-IRAQ-${region}`,`EXT-IRAQ-${region}`,'DOM-TIGRIS',`IRAQ-${region}`,iraqRoutes[region],1200,1700,{color:c.iraq,travelYears:60,basis:`${share*100}% of one retained-Iraq5/10/20k reference cohort, after its visible India–Iran–Anatolia–Syria predecessor finishes arriving1150 and a settled handover interval. ${continuityBasis} This local reconstruction does not establish a uniform ethnolinguistic identity.`});
const turkeyRoutes={
 MARMARA:{coords:[[28.98,41.01],[29.3,40.8],[29.05,40.2]],start:1300,end:1500},
 AEGEAN:{coords:[[28.98,41.01],[29.3,40.8],[29.05,40.2],[27.6,38.6],[27.15,38.4]],start:1400,end:1657},
 MEDITERRANEAN:{coords:[[28.98,41.01],[29.3,40.8],[30.4,39.7],[32.5,37.9],[34.7,36.9]],start:1500,end:1900},
 ANKARA:{coords:[[28.98,41.01],[29.3,40.8],[30.4,39.7],[32.9,39.95]],start:1500,end:1900},
 BLACKSEA:{coords:[[28.98,41.01],[29.3,41.1],[30.8,41],[32.4,41.6],[34.2,41.4],[36.3,41.25]],start:1500,end:1900}
};
for(const [region]of turkeyShares){const r=turkeyRoutes[region];add(`EXT-ROMANLAR-${region}`,`EXT-ROMANLAR-${region}`,'BYZANTIUM',`ROMANLAR-${region}`,r.coords,r.start,r.end,{color:c.turkish,maritime:[1],travelYears:60,basis:'Regional redistribution from one broad Byzantine/Anatolian standing pool. Marmara coastal crossing and all controls are reconstructed. The field-presence date is not relabeled as arrival; later modern support calibrates residents, not a2013 mass migration.'});}
for(const r of sourceRecords)if(!estimates.some(e=>e.recordId===r.id))estimates.push({recordId:r.id,...r.sourceEstimate,method:'Inclusive supplied wave estimate retained separately from split routes or mortality',basis:`${scale} Exact scope and alternatives remain in source row. ${r.temporal_type.includes('mortality')?'Deaths are losses, not migrants or new residents.':''}`,sourceIds:['REPORT'],render:false,includedIn:journeys.find(j=>j.recordIds.includes(r.id))?.id,countingCategory:r.temporal_type});
estimates.push({recordId:'EXT-LOM-BLACKSEA',...record('EXT-LOM-BLACKSEA').visualizationEstimate,method:'Geographic refinement of the existing W05 comparative cohort',basis:record('EXT-LOM-BLACKSEA').notes,sourceIds:['ERRC-TURKEY-2013'],includedIn:'W-05',render:false});
for(const scenario of Object.values(nationalScenarios))estimates.push({recordId:scenario.recordId,low:scenario.low,central:scenario.central,high:scenario.high,method:scenario.method,basis:scenario.basis,sourceIds:scenario.sourceIds,render:false});
const losses=[
{id:'REDADA-DEATHS',settlementId:'REDADA-CUSTODY',start:1750,end:1752,low:500,central:500,high:500,basis:'Conservative floor of500 deaths, within reported over500; unknown excess not silently invented. Internal custody has no surviving residents after release in this paired model.',sourceIds:['REPORT','LOC-REDADA']},
{id:'TRANSNISTRIA-DEATHS',settlementId:'TRANSNISTRIA',start:1943,end:1943.95,low:15000,central:15000,high:15000,basis:'One fixed coherent central accounting scenario25k deported−15k killed−10k returned; independent source11–20k death and6–14k survivor alternatives retained, not jointly combined.',sourceIds:['REPORT','ACHIM-TRANSNISTRIA']},
{id:'YUGOSLAV-GENOCIDE',settlementId:'SOUTH-VLAX',start:1941,end:1945,low:25000,central:40000,high:60000,basis:'W22 is included in W21 European total; map debit pool is an illustrative Balkan cohort allocation, not a census or location of every victim.',sourceIds:['REPORT','USHMM']},
...[
['SINTI-CORE',.4],['CENTRAL-CORE',.15],['NE-CORE',.45]
].map(([settlementId,share],i)=>({id:'EUROPEAN-GENOCIDE-REMAINDER-'+i,settlementId,start:1939,end:1945,...Object.fromEntries(tiers.map((k,n)=>[k,([220000,350000,500000][n]-[25000,40000,60000][n]-15000)*share])),basis:`${share*100}% illustrative geographic allocation of W21 inclusive European deaths AFTER subtracting W22 and Transnistria. No count is asserted for this specific region or killing site. Deaths are removed from standing cohorts, never animated as living arrivals at camps.`,sourceIds:['REPORT','USHMM']}))
];
const ledger={schemaVersion:1,journeys:[],estimates:[],reservoirs:[...pools.values()],losses,additions:[],exclusions:[],destinationColourFrom:200,neutralColour:c.neutral,maxUnmatchedAnnualShare:0,fixedAnnualRate:0,arrivalsWithinWindow:true,maximumTravelShare:.8,scenarioReservoirScales:{low:1/3,high:8/3},basis:scale+' One primary Roma founding cohort and separately identified Dom/Lom comparative South Asian roots are transferred through visible stages. Every descendant-support addition is progressive and requires an already living incoming lineage. No foreign destination is independently founded by support. No ancestry percentage or census undercount multiplier creates residents. Modern Iraq/Romanlar support is staged1900–2024/2013 to reconcile later regional stocks, not an observed arrival or historical fertility series. '+continuityBasis,sources:allRefs.filter(r=>r.url)};
// Existing project-specific placement overrides are applied after the generic
// stable-slot shuffle, retaining the deliberate broad-area prefix balance.
ledger.landscapes=Object.fromEntries([...landscapeProfiles.values()].filter(p=>p.kind==='resource-area-footprint').map(p=>[p.id,{points:p.points,basis:p.basis,sources:[{title:'Retained Natural Earth land geometry; regional physical envelopes are reconstructed',url:'https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/'}]}]));
const limitations=[scale,
'All exact display years, corridor controls, arrival footprints, internal destination proportions and descendant support additions are reconstruction choices; independent route review has not been completed.',
'The28 source rows mix mobile people, stock observations, literary traditions and inclusive deaths. They are not28 independent populations. The map applies their scenarios through explicit cohort transfers and non-additive mortality accounting.',
'Dom and Lom are separate comparative layers. Their supplied genealogical links remain hypotheses and are not proof of one unified diaspora. Irish Travellers and Yenish are excluded from South Asian-origin flows.',
'W08 c.1520 standing scenario and W12/W13 later stock estimates are used as reconstructed regional display allocations. They are not observed migrant flows at each first attestation. Source unknowns and original wording remain intact.',
'W21 includes W22 and Transnistria deaths; source death totals must never be summed. Mortality is a stock loss and has no invented journey to a camp. Allocation among source regions is illustrative.',
'Transnistria uses a coherent fixed25k deported,15k dead,10k returned model at every estimate setting. Published alternatives are retained separately and cannot be mixed as correlated low/high extrema.',
'Gran Redada uses9/10.5/12k detainees, a conservative500-death floor and modeled releases. Over500 actual deaths and the exact release schedule remain unresolved.',
'W27/W28 source populations may overlap individuals. The display treats era allocations as disjoint net-mobile cohort scenarios, not an inferred census or count of unique historical persons.',
'The separate NearEast extension preserves all28 original rows. Damascus, southernIraq and Turkish Romanlar presence is sourced separately. Presence years are not arrivals; regional routes, shares and historical reference cohorts remain reconstructed.',
'Turkish Romanlar500k/1m/2m are chosen scenarios, not a reported Romanlar census. The source500k–5m combined range also includes Dom,Lom,Abdal. Iraqi50k/100k/200k covers taxonomically uncertain related communities, including northern/Kurdistan groups; regional fractions are not surveyed.',
'Later-generation NearEast support is staged over1900–2013/2024 as visualization calibration. It does not assert actual births, arrivals or an unchanging2025 population after war and displacement. Dom/Lom remain comparative and are excluded from the one Romanlar scenario.',
'Present land geometry does not reconstruct historical coastlines, climate, exact passes or river channels. Maritime controls are approximate shipping corridors. Geographic labels do not assert medieval political borders.',
'The report’s1861 abolition and Tismana coordinate were corrected only in the derived model with named sources; full original source remains unchanged. Modern source window is frozen at2025, not a claim of live2026 population data.'
];
const atlas={schemaVersion:1,title,sourceFile:`${stem}.source.txt`,sourceSha256:sha256,sourceWindow:window,earliestMovementYear:200,journeys,settlementZones:[],networks:[],limitations,report:{records:journeys.length,inherited:journeys.length,excluded:0,locatedOrigins:journeys.length,locatedDestinations:journeys.length,sourceDated:journeys.length,corridors:journeys.length,zones:0}};
const population={schemaVersion:1,title,peoplePerDot:1000,method:scale,estimates,sourceScenarios:sourceRecords.map(r=>({recordId:r.id,...r.sourceEstimate,countingCategory:r.temporal_type})),visualizationExtensionScenarios:nationalScenarios,extensionRecordIds:extensionRecords.map(r=>r.id),pairedTransnistria:{deported:25000,deaths:15000,returned:10000},mortalityAccounting:{EuropeanInclusive:[220000,350000,500000],YugoslaviaIncluded:[25000,40000,60000],TransnistriaIncluded:[15000,15000,15000]},limitations};
raw.groups=[...new Map(journeys.map(j=>[j.groupId,{id:j.groupId,name:j.groupName,color:j.groupColor,tags:['roma-diaspora'],sources:[]}])).values()];
raw.agentPreparation={schemaVersion:1,method:'Source-preserving prose extraction, reconstructed corridors, separate population scenarios and conserved ledger',verification:'Preparation and software checks; limited named corrections only. No full historical or itinerary verification.',inputs:[{role:'supplied-prose',fileName:`${stem}.source.txt`,bytes:bytes.length,sha256}]};
const normalized=compileDataset(raw);if(normalized.issues.some(i=>i.level==='error'))throw new Error(JSON.stringify(normalized.issues));
const input=readEstimateInput(population);if(input.issues.length)throw new Error(input.issues.join('\n'));
function compile(){const joined=attachLedger(atlas,input.estimates,ledger);return compileAtlasPopulation(normalized.dataset,joined.atlas,joined.estimates);}
// Temporary funding extracts exact release/arrival dates; never delivered.
const openingPriors=new Map(ledger.reservoirs.map(p=>[p.id,{initial:p.initial,low:p.low,high:p.high}]));
const initialByTier=tiers.map((mode,index)=>ledger.reservoirs.reduce((n,p)=>n+(index===0?(p.low??p.initial/3):index===2?(p.high??p.initial*8/3):p.initial),0));
for(const p of ledger.reservoirs)Object.assign(p,{initial:10000000,low:10000000,high:10000000});
const provisional=compile();
for(const p of ledger.reservoirs)Object.assign(p,openingPriors.get(p.id));
const fundingUnits=[333,1000,5000];
const eventTiersByUnit=fundingUnits.map(unit=>tiers.map(mode=>{
 const variant={...provisional.dataset,migrations:provisional.dataset.migrations.map(m=>({...m,population:{...m.population,value:mode==='low'?m.population.min:mode==='high'?m.population.max:m.population.value}}))};
 return ledgerEvents(variant,unit,mode==='central'?'mid':mode);
}));
const eventTiers=eventTiersByUnit[fundingUnits.indexOf(1000)];
// These named standing snapshots are report estimates, never added migrants.
const targets=[
 {settlementId:'BALKAN-CORE',year:1520,values:[45000,75000,120000],sourceId:'W-08'},
 {settlementId:'CENTRAL-CORE',year:1780,values:[35000,50000,70000],sourceId:'W-10'},
 {settlementId:'DANUBIAN-CORE',year:1855,values:[150000,200000,250000],sourceId:'W-09'},
 {settlementId:'IBERIAN-CORE',year:1749.5,values:[10000,12000,15000],sourceId:'W-16'}
];
const epochs=[200,500,800,1100,1300,1450,1700,1850,1938,1945,1960,1988,2000,2026];
function supportPlan(p,reserveBefore=-Infinity){
 const balances=fundingUnits.map(()=>[p.low??p.initial/3,p.initial,p.high??p.initial*8/3]),blocks=[];
 for(let epoch=0;epoch<epochs.length-1;epoch++){
  const start=Math.max(p.start,epochs[epoch]),end=epochs[epoch+1];if(start>=end)continue;
  const firstNeeds=[];
  const required=tiers.map((mode,index)=>Math.max(...eventTiersByUnit.map((unitEvents,unitIndex)=>{
   const events=[...(unitEvents[index].get(p.id)??[]).filter(e=>e.year>=epochs[epoch]&&e.year<end),...targets.filter(t=>t.settlementId===p.id&&t.year>=epochs[epoch]&&t.year<end).map(t=>({year:t.year,delta:0,target:t.values[index]}))].sort((a,b)=>a.year-b.year||b.delta-a.delta);
   let balance=balances[unitIndex][index],need=0;
   for(const e of events){balance+=e.delta;const floor=e.delta<0&&e.year<reserveBefore?1:0,shortfall=Math.max(e.target??0,floor)-balance;if(shortfall>need){need=shortfall;firstNeeds[index]=Math.min(firstNeeds[index]??Infinity,e.year);}}
   balances[unitIndex][index]=balance;return Math.max(0,need);
  })));
  // A shared monotonic envelope is conservative when independent scenarios
  // have different prior arrivals. No extra flow is created by these priors.
  const amounts=required.map(v=>Math.ceil((v-.000001)/500)*500);amounts[1]=Math.max(amounts[0],amounts[1]);amounts[2]=Math.max(amounts[1],amounts[2]);
  if(amounts[2]>0){
   blocks.push({epoch:epochs[epoch],start,epochEnd:end,amounts,firstNeed:Math.min(...firstNeeds.filter(Number.isFinite))});
   balances.forEach(row=>row.forEach((v,i)=>row[i]=v+amounts[i]));
  }
 }
 return blocks;
}
for(const p of ledger.reservoirs){
 const firstPass=supportPlan(p),lastEpoch=firstPass.at(-1)?.epoch??-Infinity;
 // Preserve a small actual resident lineage between calibration periods.
 // Rounding that reserve forward is offset by less later support; it never
 // seeds an empty destination or copies a new founding cohort there.
 const blocks=supportPlan(p,lastEpoch);
 const firstPresence=p.initial>0?window[0]:Math.max(...eventTiersByUnit.flatMap(unitEvents=>unitEvents.map(events=>Math.min(...(events.get(p.id)??[]).filter(e=>e.delta>0).map(e=>e.year)))));
 let previousEnd=firstPresence;
 for(const block of blocks){
  if(!Number.isFinite(firstPresence))throw new Error(`No incoming lineage can support ${p.id}`);
  const firstDeparture=Math.min(...eventTiers.flatMap(events=>(events.get(p.id)??[]).filter(e=>e.delta<0).map(e=>e.year)));
  const latest=Math.min(block.firstNeed-.05,previousEnd===firstPresence&&block.start<=firstDeparture?firstDeparture-.05:Infinity);
  const end=Math.min(latest,Math.max(block.start,firstPresence+100));
  const start=Math.max(firstPresence+.01,previousEnd,end-100);
  if(!(start<end&&end<=latest+.0001))throw new Error(`Insufficient established-lineage interval for ${p.id} support${block.epoch}: ${JSON.stringify({firstPresence,start,end,latest})}`);
  ledger.additions.push({id:`SUPPORT-${p.id}-${block.epoch}`,settlementId:p.id,start,end,descendantSupport:true,...Object.fromEntries(tiers.map((k,i)=>[k,block.amounts[i]])),basis:`Progressive established-lineage descendant support for ${p.name}, bookkeeping epoch${block.epoch}–${block.epochEnd-1}. Rounded maximum cumulative debit deficit across${fundingUnits.join('/')} people per dot and any named standing-stock target, with a surviving resident lineage retained between support periods. The actual incoming predecessor arrives before support begins. This reconciles later-generation scenarios, not observed births, census, independent destination founders or ancestry-to-person conversion.`,sourceIds:['REPORT']});
  previousEnd=end;
 }
 p.capacity=Math.max(5000,...ledger.additions.filter(a=>a.settlementId===p.id).map(a=>a.high),p.initial*8/3)*2;
}
const modernTargets=[
 ...iraqShares.map(([region,share])=>({settlementId:`IRAQ-${region}`,scenario:'iraq',share,values:tiers.map(k=>nationalScenarios.iraq[k]*share),from:1900,to:2024,evidenceYear:2024,sourceIds:nationalScenarios.iraq.sourceIds})),
 ...turkeyShares.map(([region,share])=>({settlementId:`ROMANLAR-${region}`,scenario:'turkey',share,values:tiers.map(k=>nationalScenarios.turkey[k]*share),from:1900,to:2013,evidenceYear:2013,sourceIds:nationalScenarios.turkey.sourceIds}))
];
// All these regional stocks have no later outgoing journeys. Calibrate the
// later-generation resident stock progressively; no2013/2024 arrival is drawn.
for(const target of modernTargets){
 const p=pools.get(target.settlementId);
 const amounts=tiers.map((mode,index)=>{
  const initial=p.initial*(mode==='low'?1/3:mode==='high'?8/3:1);
  const historical=(eventTiers[index].get(p.id)??[]).filter(e=>e.year<=target.to).reduce((n,e)=>n+e.delta,0);
  const earlierPriors=ledger.additions.filter(a=>a.settlementId===p.id&&a.end<=target.to).reduce((n,a)=>n+a[mode],0);
  return Math.max(0,target.values[index]-initial-historical-earlierPriors);
 });
 if(amounts[0]>amounts[1]||amounts[1]>amounts[2])throw new Error('Non-monotonic modern regional support '+p.id);
 ledger.additions.push({id:`MODERN-SUPPORT-${p.id}`,settlementId:p.id,start:target.from,end:target.to,descendantSupport:true,...Object.fromEntries(tiers.map((k,i)=>[k,amounts[i]])),basis:`${target.share*100}% regional partition of one ${target.scenario} later-generation scenario. Progressive${target.from}–${target.to} support requires the earlier living incoming lineage and reconciles it with an explicitly chosen modern scenario. Field-presence observation${target.evidenceYear} is not an arrival, actual birth series or locality census. ${nationalScenarios[target.scenario].basis}`,sourceIds:target.sourceIds});
}
for(const p of ledger.reservoirs)p.capacity=Math.max(5000,p.initial*8/3,...ledger.additions.filter(a=>a.settlementId===p.id).map(a=>a.high))*2;
population.standingTargets=targets;population.modernNearEastTargets=modernTargets;population.supportPriors=ledger.additions;
const compiled=compile();
const playbackSeconds=phasePlaybackDuration(compiled.dataset,window,raw.meta.playback.defaultSpeed);
if(!Number.isFinite(playbackSeconds)||playbackSeconds<=0||playbackSeconds+2>=120)throw new Error(`Roma playback must be valid and below the120-second video budget: ${playbackSeconds}+2-second end hold.`);
const represented=new Set([...compiled.bindings.values()].flatMap(b=>b.recordIds));
for(const r of sourceRecords.filter(r=>!['W-21','W-22'].includes(r.id)))if(!represented.has(r.id))throw new Error('Unrepresented source wave '+r.id);
for(const r of extensionRecords)if(!represented.has(r.id))throw new Error('Unrepresented visualization-extension record '+r.id);
if(compiled.report.missingEstimateIds.length||compiled.report.unlocatedIds.length)throw new Error(JSON.stringify(compiled.report));
if(geography.some(g=>g.transport==='land-corridor'&&g.longestSegmentWaterKm>8))throw new Error('Unexpected open-water land corridor '+JSON.stringify(geography.filter(g=>g.transport==='land-corridor'&&g.longestSegmentWaterKm>8)));
const events=ledgerEvents(compiled.dataset,1000),years=[200,400,600,900,1100,1300,1420,1500,1600,1751,1856,1914,1943.95,1946,1965,1989,2000,2025];
const accounting=years.map(year=>{
 const standing=compiled.dataset.settlements.reduce((n,s)=>n+ledgerBalance(s,events.get(s.id)??[],year),0);
 const travelling=compiled.dataset.migrations.reduce((n,m)=>n+transferEvents(m,1000).filter(e=>e.departure<=year&&e.arrival>year).reduce((v,e)=>v+e.people,0),0);
 const funded=initialByTier[1]+[...events.values()].flat().filter(e=>e.kind==='addition'&&e.year<=year).reduce((n,e)=>n+e.delta,0);
 const dead=[...events.values()].flat().filter(e=>e.kind==='loss'&&e.year<=year).reduce((n,e)=>n-e.delta,0);
 if(Math.abs(standing+travelling+dead-funded)>.1)throw new Error('Conservation failed '+JSON.stringify({year,standing,travelling,dead,funded}));
 return {year,standing,travelling,dead,funded};
});
const continuity={basis:continuityBasis,openingRoots:[...openingPriors].filter(([,p])=>p.initial>0).map(([id,p])=>({id,...p})),initialByTier:Object.fromEntries(tiers.map((k,i)=>[k,initialByTier[i]])),mainRomani:['INDIC-CORE','NW-INDIA','IRAN','ARMENIA','ANATOLIA-EAST','BYZANTIUM'],domComparative:['DOM-INDIA','DOM-IRAN','DOM-ANATOLIA','DOM-SYRIA','DOM-TIGRIS'],lomComparative:['LOM-INDIA','LOM-IRAN','LOM-COMPARATIVE','LOM-ARMENIA'],sourceW03Direction:'Lower Tigris to northern Syria; late-seventh-century reported forced transfer, retained as original evidence rather than asserted as proof of the changed user-directed display route.',support:'Every addition is progressive, descendantSupport:true, and requires an existing surviving incoming lineage. Initial origins are visible in South Asia at200; no foreign pool is seeded independently.'};
raw.research.continuityReconstruction=continuity;population.continuityReconstruction=continuity;atlas.continuityReconstruction=continuity;
const review={schemaVersion:1,title,sourceSha256:sha256,preparation:{sourceRows:28,visualizationExtensionRecords:extensionRecords.length,journeys:journeys.length,representedIds:[...represented],mortalityOnlyIds:['W-21','W-22'],preservedNullPopulationFields:28},software:{...compiled.report,migrations:compiled.dataset.migrations.length,stocks:compiled.dataset.settlements.length},continuityReconstruction:continuity,nearEastExtension:{file:`${stem}.extensions.json`,sources:extensionRefs,modernScenarios:nationalScenarios,modernRegionalTargets:modernTargets,domSyrianPool:{northernRetainedShare:.4,damascus:.3,orontes:.15,southeasternAnatolia:.15,countingBasis:'One retained15/27/35k Syrian allocation after the5/10/20k Iraqi branch, never27k on each destination'},retainedIraqHistoricalScenario:[5000,10000,20000]},playback:{...raw.meta.playback,timelineSeconds:playbackSeconds,endHoldSeconds:2,videoSeconds:playbackSeconds+2,budgetSeconds:120,basis:'Two fixed chronological phases requested by the user: 200–500 CE at25 years per second, then500–2025 CE at20 years per second. The opening now contains visible long cohort transits and allows the measured smooth camera to contain moving predecessors. The500 CE transition remains a broad reconstructed epoch. Adaptive changes are disabled. Original evidence/chronology remains unchanged; explicitly reconstructed display stages/transits and connected descendant-support timing have changed.'},geography,accounting,corrections,losses,additions:ledger.additions,verification:{preparation:'Complete28-row source extraction, separate sourced NearEastern presence extension and reconstructed connected map model.',software:'Compilation and ledger checks run by this preparation script.',browser:'Performed separately.',historical:'Named corrections and regional-presence sources spot-checked; estimates, exact paths and reconstructed chronology remain unreviewed.'},limitations};
await save('atlas',raw);await save('journeys',atlas);await save('population',population);await save('ledger',ledger);await save('review',review);
console.log(JSON.stringify({prepared:title,sourceSha256:sha256,sourceRows:28,journeys:journeys.length,pools:pools.size,playback:review.playback,missingEstimates:compiled.report.missingEstimateIds,unlocated:compiled.report.unlocatedIds},null,2));
