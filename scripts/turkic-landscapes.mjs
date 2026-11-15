/** Geographic presentation only: quantities, chronology and source text are untouched. */
import { readFileSync } from 'node:fs';
import { sampleLandscape } from '../src/data/homeland-landscape.ts';
import { insidePolygon } from '../src/data/geography-policy.ts';
import { isLand, distanceKm } from './route-landmask.mjs';

const sources=[
 {title:'Natural Earth 1:10m land polygons, retained local geometry',url:'https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/',note:'Present land/water clipping only; historical shores and resource abundance are not inferred.'},
 {title:'Natural Earth 1:10m rivers and lake centerlines, retained local geometry',url:'https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/',note:'River directions and valley anchors; centerlines are not surveyed medieval channels or settlement locations.'},
];
const riverData=JSON.parse(readFileSync(new URL('../data/geography/natural-earth-rivers.source.geojson',import.meta.url),'utf8'));
const close=ring=>[...ring,ring[0]];
const excluded=(name,reason,ring)=>({name,reason,ring:close(ring)});
const wetland=(name,ring)=>excluded(name,'Coarse major wetland/channel-core avoidance; nearby terraces and levee margins remain eligible.',ring);
const ridge=(name,ring)=>excluded(name,'Coarse rugged summit/ridge-core avoidance, not a numerical elevation or slope model.',ring);
const desert=(name,ring)=>excluded(name,'Coarse dry dune/salt/desert-core avoidance; connected water and grazing margins remain eligible.',ring);

// Named, bent resource corridors have varying cross-sections. Their envelope
// is a piecewise polygon, never a circle, ellipse or political-boundary fill.
function ribbon(id,label,path,widths,share=1,kind='pasture-valley',rivers=[]){
 if(typeof widths==='number')widths=path.map((_,i)=>widths*[.62,1,.78,1.12,.72][i%5]);
 const left=[],right=[];
 for(let i=0;i<path.length;i++){
  const p=path[i],a=path[Math.max(0,i-1)],b=path[Math.min(path.length-1,i+1)];
  const cs=Math.cos(p[1]*Math.PI/180),dx=(b[0]-a[0])*cs,dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;
  const w=widths[i]/111.195;
  left.push([p[0]-dy/len*w/cs,p[1]+dx/len*w]);
  right.push([p[0]+dy/len*w/cs,p[1]-dx/len*w]);
 }
 const footprint=close([...left,...right.toReversed()]);
 const widthKm=widths.reduce((n,v)=>n+v,0)/widths.length;
 return {id,label,share,kind,rivers,profile:{id:'turkic-landscape-v2:'+id,footprint,corridors:[{path,widthKm:Math.max(2,widthKm*.62),weight:1}],resources:[],background:.006}};
}
const P={};
function profile(id,label,components,exclusions=[],basis=''){
 const total=components.reduce((n,c)=>n+c.share,0);
 P[id]={id,label,components:components.map(c=>({...c,share:c.share/total,profile:{...c.profile,exclusions:exclusions.map(e=>e.ring)}})),exclusions,basis};
}
const c=ribbon;

profile('eastern-mongolia','Xiliao–Xar Moron forest-steppe terraces',[
 c('xiliao','Xiliao cultivated/seasonal-pasture terraces',[[118.3,42.5],[119.4,43],[120.5,43.5],[121.6,43.9]],[20,48,38,20],.6,'river-terrace',['Xiliao','Liao']),
 c('xar-moron','Xar Moron upland water and pasture margins',[[117.6,43.5],[118.7,43.7],[119.8,43.9],[120.7,44.2]],[18,35,38,18],.4,'forest-steppe'),
],[desert('Horqin dune interior',[[121.2,42.8],[122,43],[122.1,43.6],[121.4,43.7]])]);
profile('sayan-mongolia','Sayan–Altai basin chains and northern Mongolian pasture',[
 c('dzavhan','Dzavhan–Uvs basin water/pasture approaches',[[93.7,48.3],[95,48.7],[96.2,48.4],[97.1,48.9]],[24,42,35,18],.55),
 c('khangai-north','Northern Khangai intermontane pasture',[[97.8,48],[99,48.4],[100,48.7],[101.1,49]],[20,35,40,22],.45),
],[desert('Great Lakes dry basin core',[[93.8,46.8],[96.5,46.7],[97.2,47.3],[94.7,47.6]]),ridge('Khangai summit core',[[98.5,46.8],[100.1,47],[100.6,47.6],[99,47.5]])]);
profile('orkhon-selenga','Orkhon–Selenga–Tuul river/pasture mosaic',[
 c('orkhon','Orkhon valley terraces',[[102.4,46.8],[102.7,47.4],[103.1,48],[103.6,48.8]],[15,35,35,19],.45,'river-terrace'),
 c('selenga','Selenga tributary and steppe margins',[[101.6,49],[103,49.3],[104.2,49.5],[105.5,50]],[18,38,34,18],.35,'river-terrace',['Selenga']),
 c('tuul','Tuul–Kharaa pasture/valley approach',[[104.5,47.5],[105.7,47.7],[106.8,47.9],[106.5,48.5]],[18,35,25,15],.2,'river-valley'),
],[ridge('Khentii summit interior',[[107.4,48.3],[109,48.2],[109.5,49.3],[108,49.5]]),desert('Gobi dry interior',[[100,44],[108,44],[108,45.8],[100,45.6]])]);
profile('zaysan-semirechye','Zaysan/Irtysh, Ili and Chu resource lobes',[
 c('zaysan-irytsh','Black Irtysh and Zaysan terraces',[[83.2,47.8],[84.4,47.7],[85.5,47.5],[86.2,47.8]],[16,30,24,14],.45,'river-terrace',['Irtysh']),
 c('ili-fans','Ili alluvial fans and piedmont pasture',[[77.3,43.4],[78.6,43.7],[80.1,43.9],[81.3,43.9]],[17,32,35,20],.35,'river-fan'),
 c('chu-eastern','Eastern Chu foothill/pasture strip',[[74.3,42.9],[75.3,42.8],[76.5,42.9]],[18,32,18],.2,'foothill-valley'),
],[desert('Saryesik-Atyrau dune core',[[75,45],[78,44.7],[79,45.3],[77.2,46.3],[75.1,45.8]])]);
profile('dzungaria','Dzungarian basin water margins and foothill pastures',[
 c('emil','Emil–Tarbagatai foothill strip',[[82.7,46.4],[84.2,46.5],[85.4,46.3],[86.3,46.7]],[18,32,28,16],.4),
 c('north-tianshan','Northern Tian Shan oasis/fan strip',[[85.3,44.4],[86.5,44.2],[87.7,44.1],[89,44.1]],[15,30,24,13],.45,'oasis-fan'),
 c('qobuq','Qobuq/Ulun-gur piedmont water chain',[[86,46.5],[87.4,46.7],[88.5,46.9]],[14,28,17],.15,'pasture-water'),
],[desert('Gurbantunggut dune core',[[86.3,44.9],[89,44.9],[89.6,45.8],[87.3,46.1],[86.2,45.6]]),ridge('Bogda high core',[[87.7,43.4],[89.5,43.4],[90,43.8],[88.2,43.7]])]);
profile('altai-irytsh','Altai intermontane and Black Irtysh pasture',[
 c('black-irytsh','Black Irtysh terraces',[[84,47.6],[85.3,47.5],[86.6,47.8],[87.2,48.1]],[14,28,32,16],.6,'river-terrace',['Irtysh']),
 c('altai-west','Western Altai intermontane grazing',[[83.4,49.2],[84.7,49.3],[85.9,49.6],[86.8,49.4]],[14,27,30,14],.4),
],[ridge('Southern Altai summit belt',[[86.6,48.3],[88.5,48.4],[89,49.4],[87.5,49.2]])]);
profile('chu-talas-chach','Ili–Chu–Talas–Chach lowland/foothill mosaic',[
 c('ili-main','Ili valley and fan pasture',[[77.5,43.5],[78.9,43.8],[80.3,43.9],[81.4,44]],[17,29,31,16],.25,'river-fan'),
 c('chu-main','Chu valley piedmont',[[73.9,43],[75,42.8],[76.2,42.8]],[17,31,19],.3,'river-valley'),
 c('talas-main','Talas–Taraz foothill strip',[[70.3,43.1],[71.4,42.9],[72.3,42.7]],[16,29,15],.25,'river-valley'),
 c('chach','Chirchiq/Chach oasis strip',[[68.7,41.2],[69.3,41.3],[69.9,41.6]],[12,25,12],.2,'oasis-fan'),
],[ridge('Trans-Ili Alatau summit core',[[76.3,42.5],[78,42.3],[79.3,42.5],[78.7,42.8],[76.8,42.8]]),desert('Muyunkum dry core',[[72,44],[74.4,44],[74.9,44.8],[72.5,45.2]])]);
profile('chu-talas','Chu and Talas inhabited valley/pasture margins',[
 c('chu-karluk','Chu river valley and terraces',[[73.8,43],[75,42.8],[76.3,42.8]],[18,34,19],.55,'river-valley'),
 c('talas-karluk','Taraz–Talas piedmont strip',[[70.3,43.1],[71.4,42.9],[72.4,42.7]],[16,31,15],.45,'river-valley'),
],[ridge('Kyrgyz Alatau crest',[[72.7,42.1],[75.4,42.1],[75.6,42.4],[73,42.45]])]);
profile('yenisei','Minusinsk–Abakan and Tuva basin terraces',[
 c('minusinsk','Minusinsk/Abakan pasture and river terraces',[[90.4,53.4],[91.3,53.7],[91.7,54.3],[92.1,54.8]],[17,35,28,17],.7,'river-terrace',['Yenisey']),
 c('tuva','Tuva intermontane/Yenisei valley',[[92.2,51.7],[93.3,51.7],[94.4,51.7],[95,51.9]],[13,27,27,15],.3,'river-valley',['Malyy Yenisey']),
],[ridge('Western Sayan summit interior',[[90,51.9],[91.6,52.2],[92,52.8],[90.4,52.6]])]);
profile('baikal','Western Baikal/Angara and upper-Lena pasture pockets',[
 c('angara','Angara–Irkut valley/forest-steppe',[[103.2,52.3],[104,52.4],[104.8,52.7],[105.1,53.1]],[10,24,22,12],.4,'river-terrace'),
 c('baikal-west','Western Baikal inland pasture terraces',[[105.3,53],[105.9,53.5],[106.2,54],[106.7,54.3]],[8,19,18,10],.35,'lake-margin-pasture'),
 c('upper-lena','Upper Lena valley pockets',[[105.6,54.9],[106.5,55.2],[107.5,55.4],[108.2,55.8]],[10,22,22,12],.25,'river-terrace',['Lena']),
],[ridge('Baikal high ridge interior',[[107,53.5],[108.3,53.4],[108.5,54.5],[107.4,54.6]])]);
profile('lena-alases','Central Lena–Aldan–Amga terraces and alas meadow mosaic',[
 c('lena-terraces','Lena east-bank terraces and alas approaches',[[129.85,61.2],[130.2,61.7],[130.4,62.2],[130.3,62.65]],[8,19,22,12],.45,'alas-meadow-terrace',['Lena']),
 c('amga-alases','Amga interfluve meadow/terrace chain',[[132,60.7],[131.8,61.1],[131.55,61.5],[131.3,61.9]],[9,20,22,12],.35,'alas-meadow-terrace'),
 c('aldan-terraces','Aldan southern terraces',[[133.9,62.2],[133,62.55],[132,62.8],[131.4,63.1]],[8,18,20,10],.2,'river-terrace',['Aldan']),
],[wetland('Lena confluence flood/channel core',[[129.1,62.65],[130.1,62.8],[130.3,63.15],[129.35,63.2]]),wetland('Amga low marsh core',[[131.6,61.95],[132.2,62],[132.3,62.35],[131.6,62.3]])],
 'Alas meadow/terrace components are a broad reconstructed suitability prior. No thermokarst, permafrost, hay-yield or settlement-survey grid is available; wetland interiors are coarsely avoided, not historically mapped.');
profile('north-kazakh','Middle Irtysh, Ishim/Tobol and southern-Ural pasture belts',[
 c('middle-irytsh','Middle Irtysh river terraces',[[75.7,51.5],[76.9,52.3],[77.6,53]],[20,42,21],.38,'river-terrace',['Irtysh']),
 c('ishim-tobol','Ishim–Tobol forest-steppe pasture',[[63.6,52.2],[65.2,52.1],[67.2,51.8],[69.2,52.2]],[23,48,43,24],.37),
 c('south-ural','Southern Ural foothill/river approaches',[[56.4,51.2],[58,51.5],[59.5,52]],[22,47,24],.25),
],[wetland('Tengiz salt/wetland basin core',[[68.5,50.1],[70,50],[70.6,50.8],[69.1,51]]),desert('Betpak-Dala interior',[[65,45],[70,45],[72,47],[67.8,48.1]])]);
profile('aral-kangar','Emba/Ural and north-Aral pasture approaches',[
 c('emba','Emba seasonal water and terrace approaches',[[52.5,48],[54,48.5],[55.5,49],[57,49.3]],[20,38,38,22],.55),
 c('ural-south','Southern Ural river/pasture belt',[[52.1,50.2],[53.3,50.7],[54.6,50.8]],[20,36,21],.25,'river-pasture'),
 c('north-aral','Northern Aral lowland pasture margins',[[58.5,47.5],[60,47.4],[61.5,47.2]],[17,30,18],.2),
],[desert('Ustyurt dry escarpment core',[[54.2,44.2],[57.6,44.2],[58,46.1],[54.5,46.3]])]);
profile('lower-syr','Lower Syr Darya levee/terrace and Aral-margin pasture',[
 c('syr-lower','Lower Syr Darya terrace corridor',[[61.65,45.8],[62.7,45.4],[63.8,44.9],[65,44.5]],[11,25,28,17],.7,'river-terrace',['Syr  Darya']),
 c('syr-north-margin','Northern Syr dry pasture and water approaches',[[62,46.25],[63.3,46],[64.5,45.8]],[15,28,17],.3,'pasture-water'),
],[wetland('Syr delta reed/channel core',[[60.8,45.8],[61.4,45.7],[61.8,46],[61.2,46.3]]),desert('Kyzylkum dune core',[[62.5,42.7],[65.4,42.9],[65.8,43.7],[63,43.8]])]);
profile('middle-syr','Sighnaq and middle Syr Darya river/pasture terraces',[
 c('sighnaq','Sighnaq–Turkestan terrace/piedmont chain',[[65.5,44.7],[66.9,44.2],[68.1,43.7],[68.5,43.3]],[14,29,25,14],.7,'river-terrace',['Syr  Darya']),
 c('karatau-margin','Karatau lower foothill grazing',[[67.2,44.7],[68,44.3],[68.9,43.9]],[15,27,17],.3,'foothill-pasture'),
],[ridge('Karatau crest core',[[68.3,44.9],[69.7,44.6],[70,43.9],[69.5,43.8]]),desert('Central Kyzylkum dune core',[[63,42],[66.5,42],[67,43],[64,43.5]])]);
profile('transoxiana','Zarafshan, Kashka Darya and Khwarazm oasis components',[
 c('zarafshan','Bukhara–Samarkand irrigated valley/fan strip',[[63.9,39.7],[64.8,39.8],[66,39.8],[66.9,39.7]],[11,23,28,17],.6,'oasis-river-fan',['Zarafshon']),
 c('kashka','Qarshi/Kashka Darya oasis and piedmont',[[65.1,38.8],[65.8,38.9],[66.6,39],[67.1,39.2]],[12,25,24,12],.4,'oasis-fan'),
],[desert('Kyzylkum dry interior',[[63.7,40.6],[67,40.6],[67.5,41.8],[64.1,42]])]);
profile('khwarazm','Lower Amu Darya oasis branches and irrigable terraces',[
 c('amu-lower','Amu Darya lower-oasis terrace strip',[[60.5,41.1],[60.2,41.6],[59.7,42.1],[59.1,42.4]],[10,22,25,14],.7,'oasis-river-terrace',['Amu  Darya']),
 c('gurganj','Gurganj side-oasis and pasture margins',[[58.8,42.25],[59.3,42.5],[59.8,42.75]],[10,21,10],.3,'oasis-margin'),
],[wetland('Lower Amu flood/reed core',[[59.6,43.1],[60.4,43.2],[60.7,43.7],[59.7,43.8]]),desert('Karakum dry core',[[57.4,40.4],[59.6,40.2],[59.7,41],[58.1,41.5]])]);
profile('bukhara-local','Bukhara local oasis/garrison strip',[
 c('bukhara-local','Bukhara oasis western/eastern inhabited margins',[[64.1,39.7],[64.4,39.8],[64.75,39.85]],[6,15,7],1,'oasis-garrison',['Zarafshon']),
],[desert('Bukhara northern dry core',[[64.1,40.15],[65,40.15],[65,40.6],[64.1,40.6]])]);
profile('bactria-gandhara','Balkh/Tokharistan and Gandhara lowland components',[
 c('balkh','Balkh–Amu foothill/alluvial plain',[[65.3,36.7],[66.3,36.8],[67.3,36.8],[68.2,37]],[17,33,32,17],.55,'oasis-river-fan',['Amu  Darya']),
 c('gandhara','Kabul/Peshawar river and piedmont plain',[[70.6,34.15],[71.25,34.05],[71.75,34],[72.1,33.9]],[12,25,24,12],.45,'river-fan'),
],[ridge('Hindu Kush high core',[[67.2,35],[70.5,35],[71,36.2],[68,36.1]])]);
profile('ghazna','Ghazni basin and local valley/garrison margins',[
 c('ghazni','Ghazni seasonal water and basin margins',[[68.1,33.3],[68.4,33.5],[68.7,33.7]],[7,17,8],.7,'intermontane-basin'),
 c('wardak','Southern Wardak valley approach',[[68.6,33.9],[68.9,34.15],[69.05,34.35]],[6,13,6],.3,'river-valley'),
],[ridge('Ghazni western upland core',[[67.3,33.2],[67.9,33.2],[68,34],[67.4,34.1]])]);
profile('tian-shan','Chu/Issyk-Kul and Naryn inhabited valley/pasture lobes',[
 c('chu-kyrgyz','Chu valley summer/pasture approaches',[[74,42.9],[75,42.8],[76,42.8]],[15,29,17],.35,'river-valley'),
 c('issyk-kul-south','Issyk-Kul southern piedmont strip',[[76.2,42.2],[77.2,42.1],[78.4,42.15]],[10,22,11],.35,'lake-foothill-pasture'),
 c('naryn','Naryn valley/intermontane pasture',[[74.9,41.4],[76,41.4],[76.8,41.5]],[10,23,12],.3,'intermontane-valley'),
],[ridge('Central Tian Shan glacier/summit core',[[78.9,41],[80.2,41],[80.8,42.2],[79.2,42.2]])]);
profile('kazakh-core','Saryarka river/pasture mosaics and Syr-Darya margins',[
 c('saryarka','Saryarka seasonal stream and low-hill grazing belt',[[65.5,48.2],[67,48],[68.5,48.3],[70.3,48.7]],[24,44,46,24],.65,'steppe-water-pasture'),
 c('syr-kazakh','Syr-Darya northern pasture margins',[[65.3,45.1],[66.6,44.7],[67.8,44.3]],[19,34,19],.35,'river-pasture',['Syr  Darya']),
],[wetland('Tengiz salt/wetland core',[[68.5,50.1],[70,50],[70.6,50.8],[69.1,51]]),desert('Betpak-Dala dry core',[[65,45.3],[69.7,45.3],[71.5,46.7],[68,47.7]])]);
profile('uzbek-oases','Transoxiana and Khwarazm separate oasis components',[
 c('uzbek-zarafshan','Zarafshan oasis corridor',[[64.1,39.7],[65,39.8],[66,39.8],[66.9,39.7]],[11,25,27,16],.65,'oasis-river-fan',['Zarafshon']),
 c('uzbek-khwarazm','Khiva/lower Amu oasis margins',[[60.2,41.25],[60.4,41.55],[60.2,41.9],[59.7,42.15]],[10,22,21,12],.35,'oasis-river-terrace',['Amu  Darya']),
],[desert('Kyzylkum intervening dune core',[[61.5,40],[63,40.2],[64.1,42],[62,42.8]])]);
profile('shanxi','Sanggan–Datong frontier valley and pasture strips',[
 c('sanggan','Datong–Sanggan river plain',[[112.6,40.4],[113.3,40.1],[114.1,40.1],[114.8,40]],[14,28,25,14],.7,'river-valley'),
 c('yinshan-fringe','Yinshan southern foothill grazing',[[110.4,40.8],[111.6,40.9],[112.5,40.7]],[13,25,13],.3,'foothill-pasture'),
],[ridge('Yanshan rugged core',[[114,40.8],[116,40.8],[116,41.6],[114.5,41.5]])]);
profile('gansu','Hexi oasis fans and Qilian foothill water margins',[
 c('zhangye','Ganzhou/Zhangye Heihe fan and margins',[[99.8,38.8],[100.4,38.95],[100.9,39.1]],[9,23,10],.65,'oasis-fan'),
 c('hexi','Hexi oasis-chain pasture pockets',[[98.1,39.6],[98.8,39.4],[99.4,39.1]],[10,22,12],.35,'oasis-fan'),
],[ridge('Qilian high core',[[98.5,37.6],[101,37.5],[101.6,38.15],[99,38.2]]),desert('Badain Jaran dry interior',[[99,40],[102,40],[102,41.7],[99.3,41.7]])]);
profile('turfan','Turfan–Qocho oasis and northern-basin fan strip',[
 c('turfan-oases','Turfan/Qocho irrigable fan belt',[[88.4,42.95],[89.15,42.95],[89.9,42.9],[90.45,42.8]],[8,20,19,9],.75,'oasis-fan'),
 c('beshbaliq','Beshbaliq northern Tian Shan fan',[[88.6,44.05],[89.25,44.05],[89.9,43.95]],[10,20,10],.25,'oasis-fan'),
],[desert('Aydingkol saline/depression core',[[88.9,42.45],[89.8,42.45],[90.1,42.65],[89.1,42.7]]),ridge('Bogda summit interior',[[87.7,43.4],[89.5,43.4],[90,43.8],[88.2,43.7]])]);
profile('khotan','Khotan/Yarkand southern Tarim oasis fans',[
 c('khotan-fans','Khotan/Yurungkash–Karakash oasis fan',[[79.2,37],[79.9,37.1],[80.6,37.2]],[9,23,11],.75,'oasis-fan'),
 c('yarkand','Yarkand/Yecheng oasis margin',[[76.9,37.9],[77.4,38.1],[77.8,38.3]],[9,21,11],.25,'oasis-fan'),
],[desert('Taklamakan dune core',[[78.5,38.6],[84,38.5],[86,40.7],[80,40.6]]),ridge('Kunlun high core',[[77.4,35.8],[81.6,35.8],[82,36.5],[78,36.6]])]);
profile('beijing','Beijing/Hai basin foothill–alluvial settlement strips',[
 c('hai-fans','Hai/Yongding alluvial fan margins',[[115.9,39.6],[116.4,39.85],[116.9,39.8],[117.3,39.55]],[10,22,24,11],.7,'river-fan',['Hai']),
 c('yan-piedmont','Yan foothill inhabited margin',[[115.7,40.1],[116.2,40.15],[116.8,40.2]],[9,19,10],.3,'foothill-valley'),
],[ridge('Yan/Western Hills high interior',[[115,40.3],[116.8,40.5],[117,41.1],[115.3,41.1]]),wetland('Bohai coastal wetland core',[[117.3,38.8],[118.1,38.8],[118.2,39.4],[117.5,39.3]])]);
profile('qinghai','Upper Yellow River/Xunhua terrace and valley-pasture mosaic',[
 c('xunhua','Xunhua/Yellow River terrace approaches',[[101.9,35.9],[102.5,35.85],[103,35.8]],[7,17,9],.7,'river-terrace',['Huang']),
 c('huangshui','Huangshui lower valley pasture/settlement strip',[[101.5,36.6],[102.1,36.5],[102.6,36.35]],[8,17,9],.3,'river-valley'),
],[ridge('Laji/Qilian high ridge core',[[101.2,36],[102.2,36],[102.2,36.2],[101.3,36.25]])]);

// Western regions use separate rivers/terraces and foothill resource lobes.
profile('pannonia','Tisza, Danube interfluve and Mures fan pasture',[
 c('tisza','Tisza terraces and adjacent grazing',[[21.4,48.1],[20.5,47.6],[20.2,47],[20.2,46.3],[20.1,45.9]],[12,30,35,26,12],.5,'river-terrace',['Tisa']),
 c('pannonian-interfluve','Danube–Tisza interfluve pasture',[[19.3,47.4],[19.5,46.9],[19.8,46.5],[20,46.1]],[20,42,35,20],.3),
 c('mures','Mures alluvial fan margins',[[21.5,46.2],[20.7,46.2],[20.2,46.2]],[10,22,12],.2,'river-fan',['Mures']),
],[wetland('Tisza confluence reed/channel core',[[20.02,45.55],[20.32,45.55],[20.38,45.85],[20.07,45.9]]),ridge('Carpathian summit arc',[[22.7,47.7],[24,47.8],[24,49],[22.8,48.8]])]);
profile('kuban-caucasus','Kuban–Azov, Manych and Terek/Sulak pasture margins',[
 c('kuban','Kuban piedmont/alluvial pasture',[[37.8,45.2],[39,45],[40.2,45.1],[41.4,44.7]],[18,42,38,18],.4,'river-piedmont',['Kuban']),
 c('azov-manych','Azov/Manych lowland grazing',[[38.4,46.4],[39.5,47],[40.8,46.7],[42.5,46.1]],[25,45,45,24],.4),
 c('terek-sulak','Terek–Sulak piedmont terraces',[[43.5,43.8],[44.8,43.7],[46,43.6],[47,43.2]],[10,25,25,10],.2,'river-piedmont'),
],[wetland('Kuban delta reed interior',[[37.35,45.2],[38.2,45.2],[38.4,45.7],[37.6,45.9]]),ridge('Greater Caucasus high crest',[[40,42.6],[46.3,42.2],[46.5,42.8],[40.6,43.5]])]);
profile('azov-don','Lower Don terraces and Manych pasture',[
 c('lower-don','Lower Don terrace margins',[[38.7,47.3],[39.7,47.25],[40.7,47.5],[41.3,47.8]],[15,32,33,15],.65,'river-terrace',['Don']),
 c('manych','Manych seasonal pasture margins',[[40.3,46.8],[41.5,46.5],[42.9,46.2]],[18,34,18],.35),
],[wetland('Don mouth marsh/channel core',[[39.1,47.02],[39.6,47.02],[39.7,47.18],[39.2,47.21]])]);
profile('volga-bolgar','Middle Volga/Kama terrace and Chuvash upland mosaic',[
 c('bolgar','Middle Volga terrace sequence',[[48.5,53.9],[49.1,54.8],[49.1,55.2]],[12,29,15],.5,'river-terrace',['Volga']),
 c('kama','Kama bank/terrace branch',[[49.1,55.2],[50.1,55.4],[51,55.4]],[10,23,12],.25,'river-terrace',['Kama']),
 c('chuvash','Chuvash right-bank water/pasture approaches',[[48.8,55.2],[47.8,55.7],[47.2,56.1]],[10,25,12],.25,'river-upland'),
],[wetland('Volga/Kama flood-basin core',[[49.3,55],[49.7,55.05],[49.75,55.3],[49.4,55.3]])]);
profile('lower-volga-don','Don bends, Volga/Akhtuba terraces and interfluve pasture',[
 c('don-bends','Don bend terraces',[[41.2,47.8],[42.6,48.4],[43.4,49.1]],[20,42,22],.4,'river-terrace',['Don']),
 c('akhtuba','Volga–Akhtuba terrace margins',[[44.5,48.7],[45.3,47.9],[46.2,47],[47.5,46.3]],[8,22,23,10],.35,'river-terrace',['Volga']),
 c('volga-don-pasture','Don–Volga lowland grazing',[[43.5,48.8],[44.3,48.4],[44.8,47.8]],[20,43,22],.25),
],[wetland('Lower Volga delta reed core',[[47.5,45.7],[48.6,45.7],[48.8,46.25],[47.8,46.4]]),desert('Baskunchak salt/depression core',[[46.4,47.7],[47.1,47.7],[47.2,48.35],[46.6,48.4]])]);
profile('pontic','Dniester–Bug, Dnieper and Azov steppe water/pasture belts',[
 c('dniester-bug','Dniester–Bug pasture/water approaches',[[28.8,46.65],[30,47],[31,47.3],[32,47.2]],[20,42,43,22],.4),
 c('dnieper','Lower Dnieper terraces and pasture',[[32.1,47.2],[33.4,47.4],[34.4,47.7],[35.4,48]],[18,43,42,20],.35,'river-terrace'),
 c('azov-steppe','Azov inland steppe pasture',[[35.2,47.1],[36.5,47.4],[38,47.6]],[20,39,21],.25),
],[wetland('Dnieper estuary wetland core',[[32.2,46.4],[33.1,46.4],[33.15,46.75],[32.4,46.8]]),wetland('Dniester liman margins',[[29.9,46.1],[30.6,46.1],[30.6,46.45],[30,46.5]])]);
profile('moesia','Lower Danube terraces and Pliska inland plateau',[
 c('moesia-danube','Danube southern terraces',[[25.5,43.7],[26.5,43.7],[27.5,43.85],[28.05,44]],[10,24,23,12],.4,'river-terrace',['Danube']),
 c('pliska','Moesian interior water/pasture plateau',[[26.1,43.3],[27.1,43.4],[27.8,43.45]],[18,33,18],.6),
],[wetland('Danube delta reed interior',[[28.55,44.7],[29.7,44.7],[29.7,45.4],[28.7,45.4]]),ridge('Eastern Balkan ridge core',[[25,42.6],[27.5,42.6],[27.5,42.95],[25.2,42.95]])]);
profile('dobruja','Dobruja plateau and Danube bank mosaic',[
 c('dobruja-interior','Dobruja interior pasture/water belt',[[27.45,43.4],[28.05,43.8],[28.25,44.2],[28.35,44.55]],[12,27,25,12],.75),
 c('dobruja-danube','Danube terrace/levee margins',[[27.5,44.1],[27.9,44.45],[28.1,44.7]],[6,15,8],.25,'river-terrace',['Danube']),
],[wetland('Razelm/Delta marsh and lagoon core',[[28.55,44.65],[29.55,44.65],[29.65,45.3],[28.7,45.3]])]);
profile('thrace-macedonia','Maritsa, Vardar and Struma inhabited valley mosaics',[
 c('maritsa','Maritsa/Evros lowland terraces',[[24.7,42.1],[25.7,42],[26.1,41.7],[26.4,41.2]],[12,29,25,12],.45,'river-terrace',['Maritsa','Evros']),
 c('vardar','Vardar valley and coastal plain approaches',[[21.7,41.7],[22,41.3],[22.5,40.9],[22.8,40.7]],[8,20,18,9],.35,'river-valley'),
 c('struma','Struma basin terrace margins',[[23.2,41.5],[23.3,41.1],[23.3,40.9]],[8,16,9],.2,'river-valley'),
],[ridge('Rhodope summit interior',[[23.9,41.4],[25.1,41.4],[25.3,41.8],[24.2,41.85]]),ridge('Pirin/Rila high core',[[23.1,41.7],[23.8,41.7],[23.9,42.15],[23.3,42.2]])]);
profile('macedonia','Pelagonia and lower Vardar inhabited basins',[
 c('pelagonia','Pelagonia basin pasture/settlement strip',[[21.35,41.35],[21.4,41.05],[21.5,40.8]],[8,18,9],.6,'intermontane-basin'),
 c('lower-vardar','Lower Vardar plain and terraces',[[22.1,41.1],[22.45,40.85],[22.8,40.7]],[8,19,10],.4,'river-valley'),
],[ridge('Shar/Pindus summit interior',[[20.3,40.8],[20.8,40.8],[20.9,41.5],[20.4,41.6]]),ridge('Olympus summit core',[[22.2,40],[22.7,40],[22.65,40.25],[22.25,40.3]])]);
profile('matese','Matese basin margins and Volturno foothill chain',[
 c('matese-basins','Matese basin and foothill settlements',[[14.15,41.57],[14.25,41.6],[14.48,41.49],[14.62,41.41]],[3,7,8,3],.65,'foothill-basin'),
 c('volturno','Volturno foothill/river strip',[[14.05,41.4],[14.2,41.32],[14.37,41.3]],[3,7,4],.35,'river-foothill'),
],[ridge('High Matese interior',[[14.25,41.38],[14.52,41.37],[14.55,41.46],[14.3,41.49]])]);
profile('samarra','Tigris terrace/garrison banks around Samarra',[
 c('samarra-banks','Samarra Tigris inhabited bank/terrace sequence',[[43.76,34.45],[43.88,34.2],[44.02,33.95]],[2,5,2],1,'garrison-river-terrace',['Tigris']),
],[desert('Samarra western dry plateau core',[[43.3,33.95],[43.65,33.95],[43.7,34.45],[43.4,34.5]])]);
profile('cairo','Cairo/Fustat Nile bank and local irrigable terrace strip',[
 c('cairo-east-bank','Nile eastern inhabited banks and terrace margins',[[31.25,29.65],[31.27,29.9],[31.25,30.08],[31.18,30.22]],[2,6,7,3],1,'urban-river-terrace',['Nile']),
],[desert('Eastern Desert core',[[31.55,29.55],[32.2,29.55],[32.2,30.3],[31.6,30.35]]),desert('Western Desert core',[[30.3,29.6],[30.8,29.6],[30.8,30.2],[30.3,30.3]])]);
profile('azerbaijan','Tabriz/Ahar, Mughan–Aras and Ardabil seasonal foothill mosaics',[
 c('tabriz-ahar','Tabriz–Ahar basin and lower foothills',[[45.55,38.4],[46.3,38.1],[46.7,38.25],[47.05,38.45]],[12,28,25,13],.55,'basin-foothill'),
 c('mughan-aras','Mughan–Aras terrace and pasture strip',[[47.2,39.15],[47.8,39.4],[48.35,39.6]],[12,29,15],.3,'river-pasture',['Aras']),
 c('ardabil','Ardabil seasonal foothill pasture',[[47.9,38.1],[48.25,38.25],[48.05,38.6]],[8,20,10],.15,'foothill-pasture'),
],[wetland('Lake Urmia water/saline core',[[45.1,37],[46,37.3],[45.9,38.2],[45.2,38.2]]),ridge('Sahand summit core',[[46,37.5],[46.6,37.5],[46.7,37.85],[46.1,37.9]]),ridge('Sabalan summit core',[[47.5,38.15],[47.9,38.15],[47.95,38.45],[47.6,38.5]])]);
profile('georgia','Kura and Alazani inhabited valley/terrace margins',[
 c('kura','Kura/Tbilisi river and terrace corridor',[[43.9,42],[44.4,41.85],[44.8,41.7],[45.15,41.55]],[6,18,17,8],.65,'river-terrace',['Kura']),
 c('alazani','Alazani/Kakheti lowland margins',[[45.1,42.05],[45.65,41.85],[46.15,41.6]],[8,20,10],.35,'river-valley'),
],[ridge('Greater Caucasus high crest',[[43.4,42.5],[46.3,42.2],[46.6,42.8],[44,43.1]])]);
profile('rayy','Qazvin–Rayy southern Alborz piedmont water strip',[
 c('rayy-piedmont','Southern Alborz foothill and oasis approaches',[[49.9,36.3],[50.6,36.05],[51.15,35.8],[51.6,35.65],[52.25,35.55]],[8,22,21,17,9],1,'piedmont-oasis'),
],[ridge('Alborz high crest',[[50,36.6],[52.4,36.3],[52.5,36.7],[50.2,37]]),desert('Dasht-e Kavir salt/desert core',[[51.2,34.5],[54,34.5],[54,35.4],[52,35.3]])]);
profile('khorasan','Nishapur, Kopet-Dag piedmont, Merv and Herat oasis components',[
 c('nishapur','Nishapur basin water/agricultural margins',[[58.35,36.15],[58.8,36.2],[59.2,36.3],[59.6,36.35]],[10,24,23,11],.4,'oasis-basin'),
 c('kopetdag','Kopet-Dag lower foothill pasture',[[57.4,37.25],[58.1,37.15],[58.7,37.05],[59.3,36.8]],[8,20,19,9],.25,'foothill-water'),
 c('merv','Merv alluvial oasis margins',[[61.7,37.4],[62.2,37.7],[62.5,38]],[8,20,9],.25,'oasis-fan'),
 c('herat','Herat/Harirud local oasis strip',[[61.6,34.35],[62.2,34.35],[62.7,34.35]],[5,14,6],.1,'oasis-river'),
],[desert('Karakum dune interior',[[58.5,38.2],[61,38.2],[61.7,39.5],[59,40]]),ridge('Binalud summit core',[[58.6,36.55],[59.5,36.5],[59.7,36.8],[58.9,36.95]])]);
profile('central-anatolia','Konya, Ankara, Sivas and plateau river/pasture mosaics',[
 c('konya','Konya basin seasonal water/pasture margins',[[31.6,37.7],[32.4,37.9],[33,38.1]],[16,34,18],.35,'basin-pasture'),
 c('ankara','Ankara–Sakarya lower plateau water belt',[[31.8,39.6],[32.7,39.9],[33.5,39.9]],[17,33,18],.25,'river-plateau',['Sakarya']),
 c('kizilirmak','Kızılırmak terrace/pasture bend',[[34.1,38.8],[34.7,39.2],[35.2,39.9],[36.2,40.2]],[14,31,29,15],.25,'river-plateau'),
 c('sivas','Sivas basin and foothill pasture',[[36.4,39.5],[37,39.7],[37.6,39.7]],[13,29,16],.15,'basin-pasture'),
],[wetland('Tuz Gölü saline/lake core',[[32.8,38.4],[33.6,38.3],[33.7,39.1],[33,39.1]]),ridge('Taurus high crest',[[32.3,36.8],[35.3,37],[35.6,37.4],[32.5,37.3]])]);
profile('west-anatolia','Menderes, Gediz, Bithynia and Kastamonu valley components',[
 c('menderes','Denizli–Büyük Menderes water/pasture valley',[[27.8,37.75],[28.5,37.8],[29.15,37.8],[29.6,38.1]],[11,24,23,12],.35,'river-valley'),
 c('gediz','Kütahya/Gediz basin and lower foothills',[[28.4,38.6],[29.2,38.85],[30,39.2]],[13,27,15],.25,'river-valley'),
 c('bithynia','Sakarya/Bithynian pasture and valley margins',[[29.4,40.1],[30.2,40.3],[30.5,40.75]],[12,25,13],.25,'river-foothill',['Sakarya']),
 c('kastamonu','Kastamonu/Gökırmak valley pockets',[[33,41.25],[33.8,41.4],[34.5,41.45]],[9,22,11],.15,'river-valley'),
],[ridge('Western Taurus high interior',[[29.3,36.7],[31,36.8],[31.2,37.3],[29.7,37.25]]),ridge('Pontic summit core',[[32.8,40.6],[34.4,40.6],[34.5,41],[33,41.05]])]);
profile('taurus-karaman','Karaman basin and inhabited Taurus valley/foothill pasture',[
 c('karaman','Karaman lower basin water margins',[[32.5,37.1],[33.15,37.2],[33.7,37.25]],[11,25,13],.65,'basin-pasture'),
 c('goksu','Göksu valley and lower foothill pasture',[[32.9,36.5],[33.3,36.65],[33.8,36.85]],[7,17,9],.35,'river-foothill'),
],[ridge('Central Taurus summit interior',[[33.6,37.5],[34.7,37.45],[35,37.8],[33.9,37.9]])]);
profile('fars','Shiraz/Marvdasht basins and seasonal Zagros foothill mosaics',[
 c('shiraz','Shiraz basin water/settlement margins',[[52.2,29.5],[52.55,29.6],[52.85,29.75]],[8,18,9],.5,'basin-oasis'),
 c('marvdasht','Persepolis/Marvdasht alluvial basin',[[52.65,29.85],[52.9,30],[53.05,30.2]],[8,16,9],.3,'alluvial-basin'),
 c('zagros-seasonal','Seasonal Zagros lower foothill pasture',[[51.5,30],[51.8,30.35],[52.3,30.65]],[10,22,12],.2,'foothill-pasture'),
],[wetland('Maharlu salt-lake core',[[52.7,29.25],[53.1,29.25],[53.15,29.55],[52.8,29.6]]),wetland('Bakhtegan salt-lake core',[[53.25,29.5],[54.1,29.5],[54.1,29.95],[53.35,30]]),ridge('High Zagros crest',[[50.5,30.3],[51.3,30.3],[51.8,31],[50.9,31.2]])]);
profile('safavid','Azerbaijan and Qazvin–Rayy inhabited piedmont components',[
 c('safavid-azar','Tabriz–Ahar lower basin and foothills',[[45.6,38.3],[46.3,38.1],[47,38.4]],[12,28,15],.5,'basin-foothill'),
 c('safavid-rayy','Qazvin–Rayy piedmont water chain',[[49.6,36.3],[50.1,36.25],[50.8,36],[51.4,35.7]],[10,22,20,11],.5,'piedmont-oasis'),
],[wetland('Lake Urmia core',[[45.1,37],[46,37.3],[45.9,38.2],[45.2,38.2]]),ridge('Alborz high crest',[[50,36.6],[52.4,36.3],[52.5,36.7],[50.2,37]])]);

// Shared accounting pools span attested components without turning the empty
// terrain between them into a populated source-to-destination ribbon.
profile('azerbaijan-frontier','Eastern Anatolian and Azerbaijan Turkmen resource components',[
 ...P.azerbaijan.components.map(x=>({...x,share:x.share*.7})),
 c('east-anatolian-basins','Bayburt–Erciş eastern Anatolian basin/pasture chain',[[40.2,40.3],[41.4,39.9],[42.5,39.4],[43.4,39]],[12,25,25,13],.2,'intermontane-pasture'),
 c('upper-tigris','Âmid upper Tigris basin/foothill pasture',[[39.7,37.9],[40.2,37.9],[40.8,38.1]],[10,24,12],.1,'river-foothill',['Tigris']),
],P.azerbaijan.exclusions);
profile('qoyunlu-mosaic','Azerbaijan, Tigris and Fars separate seasonal resource components',[
 ...P.fars.components.map(x=>({...x,share:x.share*.6})),
 ...P.azerbaijan.components.map(x=>({...x,share:x.share*.25})),
 c('baghdad-tigris','Baghdad Tigris inhabited bank/terrace strip',[[44.2,33.1],[44.4,33.3],[44.6,33.7]],[3,9,4],.15,'river-terrace',['Tigris']),
],[...P.fars.exclusions,...P.azerbaijan.exclusions]);

profile('west-siberian-oghur','Ishim–Irtysh western Siberian forest-steppe source terraces',[
 c('ishim-oghur','Ishim forest-steppe terrace and pasture chain',[[66.5,53.5],[68,54],[69.5,54.3],[71,54.5]],[18,34,30,18],.65,'river-forest-steppe'),
 c('irytsh-oghur','Irtysh western Siberian terrace margins',[[72,53],[73,53.7],[74,54.3]],[16,29,17],.35,'river-terrace',['Irtysh']),
],[wetland('Western Siberian peat/mire core north of source terraces',[[67,55.5],[72,55.3],[73,57],[67,57]])],
 'Separate actual-origin reserve for a relocated display prior. Its pre-departure presence and quantities are visualization bookkeeping, not an additional historical headcount.');
profile('ercis-mosul','Erciş north-Van foothills and Mosul/Tigris seasonal source components',[
 c('ercis-source','Erciş northern Van basin foothill/pasture strip',[[42.8,39.1],[43.35,39],[44,38.9]],[10,22,12],.65,'basin-foothill'),
 c('mosul-source','Mosul upper Tigris terrace and pasture margins',[[42.8,36.4],[43.1,36.3],[43.5,36.1]],[10,20,11],.35,'river-terrace',['Tigris']),
],[wetland('Lake Van open-water core',[[42.3,38.3],[43.4,38.3],[43.5,38.75],[42.5,38.85]]),ridge('Van eastern high ridge core',[[44.5,38.5],[45.2,38.5],[45.2,39.3],[44.6,39.3]])]);

const poolProfiles={
 'INNER-MONGOLIA':'eastern-mongolia','COH-00A':'sayan-mongolia','COH-00B':'zaysan-semirechye','COH-00C':'pannonia','COH-00D':'bactria-gandhara','COH-01':'kuban-caucasus',
 'TIELE-CORE':'orkhon-selenga','COH-04A':'dzungaria','ROURAN-CORE':'orkhon-selenga','COH-01A':'pannonia','COH-05':'chu-talas-chach','PANNONIAN-BULGARS':'pannonia',
 'COH-02A':'azov-don','COH-02B':'volga-bolgar','COH-02C':'moesia','COH-02D':'macedonia','COH-02E':'matese','COH-03':'lower-volga-don',
 'ALTAI-CORE':'altai-irytsh','COH-06':'chu-talas','MONGOLIAN-TURKIC-CORE':'orkhon-selenga','COH-13':'lower-syr','ORKHON-UYGHURS':'orkhon-selenga',
 'COH-08A':'shanxi','COH-08B':'gansu','COH-08C':'turfan','YENISEI-KYRGYZ':'yenisei','COH-10A':'altai-irytsh','COH-11':'north-kazakh',
 'COH-EP1':'samarra','EP1-BUKHARA':'bukhara-local','EP1-GHAZNA':'ghazna','ARAL-KANGAR':'aral-kangar','COH-17':'pontic','COH-07A':'transoxiana','COH-07B':'khotan',
 'COH-14A':'rayy','COH-14B':'khorasan','COH-12A':'middle-syr','COH-12B':'pontic','COH-17A':'thrace-macedonia','COH-13A':'thrace-macedonia',
 'COH-15':'azerbaijan-frontier','COH-16A':'central-anatolia','COH-12D':'khwarazm','COH-12B-GEO':'georgia','MONGOLIAN-MIXED-CORE':'orkhon-selenga','COH-MNG1':'transoxiana',
 'JOCHID-STEPPE':'lower-volga-don','COH-16B':'west-anatolia','TAURUS-TURKMENS':'taurus-karaman','COH-12B-HUN':'pannonia','COH-12B-BLK':'dobruja','COH-MNG2':'azerbaijan',
 'COH-EP2-EGY':'cairo','COH-EP2-YUAN':'beijing','BAIKAL-KURYKANS':'baikal','COH-09A':'lena-alases','COH-10C':'tian-shan','COH-16C':'thrace-macedonia',
 'COH-15A':'azerbaijan','COH-15B':'qoyunlu-mosaic','COH-15C':'safavid','COH-12E':'kazakh-core','UZBEK-TRANSOXIANA':'uzbek-oases','SALAR-QINGHAI':'qinghai',
 'WEST-SIBERIAN-OGHUR':'west-siberian-oghur','EAST-ANATOLIAN-TURKMEN':'ercis-mosul',
 'SUPPORT-ORIGIN-COH-00A':'eastern-mongolia','SUPPORT-ORIGIN-COH-00B':'orkhon-selenga',
 'SUPPORT-ORIGIN-COH-01':'west-siberian-oghur','SUPPORT-ORIGIN-COH-04A':'orkhon-selenga',
 'SUPPORT-ORIGIN-COH-06':'altai-irytsh','SUPPORT-ORIGIN-COH-10A':'yenisei',
 'SUPPORT-ORIGIN-COH-11':'altai-irytsh','SUPPORT-ORIGIN-COH-14B':'lower-syr',
 'SUPPORT-ORIGIN-COH-12A':'north-kazakh','SUPPORT-ORIGIN-COH-12B':'north-kazakh',
 'SUPPORT-ORIGIN-COH-15':'khorasan','SUPPORT-ORIGIN-COH-16A':'azerbaijan-frontier',
 'SUPPORT-ORIGIN-COH-16B':'central-anatolia','SUPPORT-ORIGIN-COH-15A':'ercis-mosul',
};

function hull(points){
 const sorted=[...points].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 const chain=list=>{const out=[];for(const p of list){while(out.length>1&&cross(out.at(-2),out.at(-1),p)<=0)out.pop();out.push(p);}return out;};
 return close([...chain(sorted).slice(0,-1),...chain(sorted.toReversed()).slice(0,-1)]);
}
function retainedRivers(profile){
 const names=new Set(profile.components.flatMap(c=>c.rivers));
 const all=profile.components.flatMap(c=>c.profile.footprint),xs=all.map(p=>p[0]),ys=all.map(p=>p[1]);
 const box=[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];
 const lines=riverData.features.filter(f=>names.has(f.properties.name)||names.has(f.properties.name_en))
  .filter(f=>f.properties.featurecla!=='Lake Centerline').flatMap(f=>f.geometry.type==='MultiLineString'?f.geometry.coordinates:[f.geometry.coordinates])
  .map(line=>line.filter(p=>p[0]>=box[0]-.1&&p[0]<=box[2]+.1&&p[1]>=box[1]-.1&&p[1]<=box[3]+.1)).filter(line=>line.length>1);
 return {names:[...names],lines};
}
function pointToSegmentKm(p,a,b){
 const cs=Math.cos(p[1]*Math.PI/180),ax=(a[0]-p[0])*111.195*cs,ay=(a[1]-p[1])*111.195;
 const dx=(b[0]-a[0])*111.195*cs,dy=(b[1]-a[1])*111.195,len=dx*dx+dy*dy;
 const t=len?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/len)):0;return Math.hypot(ax+t*dx,ay+t*dy);
}
const cache=new Map();
function prepareProfile(id,count){
 const cacheKey=id+':'+count;if(cache.has(cacheKey))return cache.get(cacheKey);
 const profile=P[id];if(!profile)throw new Error('Unknown resource profile '+id);
 const geometry=retainedRivers(profile);
 const exclusions=profile.exclusions.map(e=>e.ring),components=profile.components.map(c=>c.profile.footprint);
 const assignments=[],needed=profile.components.map(()=>0);
 for(let i=0;i<count;i++){
  const fraction=(.1732050807568877+i*.6180339887498949)%1;let cumulative=0,pick=profile.components.length-1;
  for(let j=0;j<profile.components.length;j++){cumulative+=profile.components[j].share;if(fraction<cumulative){pick=j;break;}}
  assignments.push(pick);needed[pick]++;
 }
 const parts=profile.components.map((component,index)=>{
  let n=Math.max(needed[index]*2,256),valid=[];
  while(valid.length<needed[index]){
   const raw=sampleLandscape(n,component.profile);
   valid=raw.filter(p=>isLand(p)&&!exclusions.some(ring=>insidePolygon(p,ring)));
   // Broad major channels are unsuitable ground. This modest centerline
   // clearance is a geographic display assumption; terrace margins remain.
   if(component.kind.includes('terrace')||component.kind.includes('garrison'))valid=valid.filter(p=>!geometry.lines.some(line=>line.slice(1).some((b,i)=>pointToSegmentKm(p,line[i],b)<.45)));
   if(valid.length<needed[index])n*=2;
   if(n>count*128)throw new Error(`Too little constrained land in ${component.id}`);
  }
  return valid.slice(0,needed[index]);
 });
 const cursors=parts.map(()=>0),points=assignments.map(k=>parts[k][cursors[k]++]);
 const basis=`Irregular resource/terrain display reconstruction across ${profile.label}. Named bent river/terrace, water/pasture, foothill, basin or oasis components use variable polygon widths and interleaved allocation weights; open water, declared wetland/channel cores and named rugged/dry interiors are excluded. Widths, component shares and terrain masks are explicit geographic presentation assumptions, not a DEM, climate reconstruction, medieval carrying-capacity grid, observed settlements or independently verified historical resources. The enclosing polygon is only an indexing extent; populated ground follows the component polygons. ${profile.basis} No source text, people, demographic prior, parent debit or chronology is changed.`;
 const layout={points,footprint:{kind:'polygon',rings:[hull(components.flat())]},components,exclusions,basis,sources,
  kind:'piecewise-resource-terrain-mosaic',profileId:id,componentNames:profile.components.map(c=>c.label),resourceKinds:[...new Set(profile.components.map(c=>c.kind))],
  constraints:{landClip:'Retained Natural Earth land polygons, no offshore tolerance',channelClearanceKm:.45,terrainMethod:'Named coarse exclusion polygons and positive river/foothill/oasis envelopes; no elevation raster',exclusionReasons:profile.exclusions.map(e=>({name:e.name,reason:e.reason,ring:e.ring}))},
  profiles:profile.components.map(c=>({id:c.id,label:c.label,share:c.share,kind:c.kind,...c.profile})),geometryReferences:{retainedRiverNames:geometry.names,retainedRiverLines:geometry.lines.length,manualControls:'Named piecewise resource corridors are reconstruction controls, never claims of exact historical river channels or a verified itinerary.'}};
 cache.set(cacheKey,layout);return layout;
}

/** Reuses shared ledger placement support; all quantities remain elsewhere. */
export function prepareTurkicLandscapes(reservoirs,journeys,{count=4096}={}){
 const landscapes={};
 for(const pool of reservoirs){
  const profileId=poolProfiles[pool.id];if(!profileId)throw new Error('Missing named Turkic resource profile for '+pool.id);
  const layout=prepareProfile(profileId,count);landscapes[pool.id]=layout;pool.points=layout.points;
 }
 for(const journey of journeys){
  const target=journey.tags.find(t=>t.startsWith('reservoir-target:'))?.slice(17);
  const source=landscapes[journey.fromSettlementRecordId],destination=landscapes[target];
  if(!source||!destination)throw new Error('Missing funded stage footprint '+journey.id);
  journey.origin.sampledArrivalPoints=source.points;journey.origin.placementProfile=source.profileId;journey.origin.basis+=' Placement: '+source.basis;
  for(const stage of journey.stages){
   if(stage.kind!=='destination')throw new Error('Unhandled intermediate placement '+journey.id);
   stage.sampledArrivalPoints=destination.points;stage.placementProfile=destination.profileId;stage.basis+=' Placement: '+destination.basis;
  }
  landscapes[journey.id]=destination;
 }
 const unique=[...new Set(Object.values(landscapes).map(l=>l.profileId))];
 return {landscapes,report:{reservoirs:reservoirs.length,journeys:journeys.length,stages:journeys.reduce((n,j)=>n+1+j.stages.length,0),uniqueProfiles:unique.length,candidatesPerPool:count,kind:'piecewise-resource-terrain-mosaic',sources,profiles:unique.map(id=>({id,label:P[id].label,components:P[id].components.map(c=>({id:c.id,label:c.label,share:c.share,path:c.profile.corridors[0].path,widthKm:c.profile.corridors[0].widthKm,polygon:c.profile.footprint})),exclusions:P[id].exclusions}))}};
}

export const TURKIC_POOL_PROFILE_IDS=poolProfiles;
