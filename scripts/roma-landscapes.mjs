/** Roma-only regional area placement. No dates, people or source claims change. */
import { isLand } from './route-landmask.mjs';

export const ROMA_AREA_BASIS='Broad two-dimensional regional display reconstruction: irregular physical lowland, interfluve, basin and foothill areas have a nonzero interior suitability field, softly weighted toward water access and varied by a deterministic multiscale mosaic. Samples are not restricted to route lines, circular clouds or political boundary fills. Present water and declared wetland, lake and high-mountain cores are excluded. Polygons, water-access weights, suitability texture and terrain exclusions are reconstruction assumptions, not an elevation/climate raster, a census, proof of occupation at every point or a claim that all Roma were nomadic. People, chronology and cohort accounting are unchanged.';
const km=111.195,rad=Math.PI/180;
const ring=p=>p[0][0]===p.at(-1)[0]&&p[0][1]===p.at(-1)[1]?p:[...p,p[0]];
const bounds=p=>p.reduce((b,q)=>[Math.min(b[0],q[0]),Math.min(b[1],q[1]),Math.max(b[2],q[0]),Math.max(b[3],q[1])],[Infinity,Infinity,-Infinity,-Infinity]);
export function inRomaArea(p,polygon){let hit=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i],b=polygon[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
export function romaLineDistanceKm(p,lines){let best=Infinity;const cos=Math.cos(p[1]*rad);for(const line of lines)for(let i=1;i<line.length;i++){const a=line[i-1],b=line[i],dx=(b[0]-a[0])*cos,dy=b[1]-a[1],length=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((p[0]-a[0])*cos*dx+(p[1]-a[1])*dy)/(length||1)));best=Math.min(best,Math.hypot((p[0]-a[0])*cos-t*dx,p[1]-a[1]-t*dy)*km);}return best;}
function randomFor(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.codePointAt(0),16777619)>>>0;return()=>{h=(h+0x6d2b79f5)>>>0;let v=Math.imul(h^(h>>>15),1|h);v^=v+Math.imul(v^(v>>>7),61|v);return((v^(v>>>14))>>>0)/4294967296;};}
function cellHash(x,y,salt){let h=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^salt;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}
function noise(p,scale,salt){const x=p[0]/scale,y=p[1]/scale,ix=Math.floor(x),iy=Math.floor(y),s=t=>t*t*(3-2*t),u=s(x-ix),v=s(y-iy);return(1-v)*((1-u)*cellHash(ix,iy,salt)+u*cellHash(ix+1,iy,salt))+v*((1-u)*cellHash(ix,iy+1,salt)+u*cellHash(ix+1,iy+1,salt));}
const area=(id,polygon,guides=[],waterScaleKm=70)=>({id,polygon:ring(polygon),guides,waterScaleKm});
// These envelopes follow broad physical regions, not national outlines.
const frNorth=area('france-paris-northern-basins',[[-1.1,48.0],[-.3,47.5],[1.7,47.6],[3.7,48.0],[4.7,49.0],[3.9,50.15],[2.4,50.55],[.7,50.05],[-.8,49.45]],[[[.8,49.4],[2.3,48.9],[3.6,48.5]]]);
const frCentre=area('france-loire-central-lowlands',[[-1.7,46.6],[-.8,45.9],[.9,45.7],[2.0,46.0],[3.7,46.2],[4.0,47.3],[3.0,48.2],[1.4,48.4],[-.3,47.9],[-1.7,47.4]],[[[-1.3,47.25],[.7,47.35],[2.1,47.8]],[[.8,46.4],[2.3,46.8],[3.4,47.1]]]);
const frSouthwest=area('france-aquitaine-southwestern-basins',[[-1.6,43.45],[-.5,43.2],[1.4,43.35],[2.3,44.0],[2.0,45.15],[1.2,46.1],[-.3,46.2],[-1.4,45.7]],[[[-.65,44.85],[.6,44.2],[1.45,43.6]],[[.2,45.55],[1.3,45.7]]]);
const frRhone=area('france-rhone-saone-foothill-mosaic',[[3.4,43.45],[4.7,43.3],[5.8,43.9],[5.7,45.0],[5.9,46.1],[5.7,47.6],[4.7,48.0],[3.6,47.35],[3.7,46.0],[3.3,44.7]],[[[5.0,47.3],[4.85,45.8],[4.75,44.5],[4.8,43.9]]]);
const deNorth=area('germany-northern-lowland-mosaic',[[6.0,52.0],[7.8,51.7],[9.5,51.8],[11.3,52.0],[13.4,51.8],[14.5,52.5],[14.2,53.6],[12.8,54.5],[10.3,54.8],[8.1,54.0],[6.5,53.5]],[[[8.8,53.6],[9.3,52.8],[9.6,52.0]],[[12.1,53.2],[12.3,52.4],[13.3,52.3]]],85);
const deRhine=area('germany-rhine-ruhr-hesse-lowlands',[[5.6,50.45],[6.9,49.5],[8.2,49.1],[9.4,49.7],[9.6,50.8],[8.9,51.8],[7.3,52.15],[6.0,51.7]],[[[7.6,49.2],[7.4,50.1],[6.9,51.3],[6.5,51.8]],[[8.3,49.9],[8.8,50.7]]]);
const deCentral=area('germany-central-eastern-basins',[[9.2,49.9],[10.5,49.65],[12.0,50.0],[13.7,50.3],[14.2,51.25],[13.7,52.1],[12.0,52.3],[10.4,51.9],[9.4,51.0]],[[[11.2,50.7],[11.8,51.35],[12.5,51.8]],[[12.6,50.8],[13.75,51.05]]]);
const deSouth=area('germany-southern-danube-foothills',[[7.7,48.0],[9.0,47.65],[10.5,47.75],[12.1,47.7],[13.7,48.1],[13.6,49.1],[12.8,50.1],[11.0,50.2],[9.6,49.7],[8.3,49.1]],[[[8.9,48.55],[10.0,48.45],[11.2,48.7],[12.2,49.0]],[[10.8,48.2],[11.7,48.1],[12.5,48.3]]]);
const lowCountries=area('low-countries-landward-lowlands',[[3.0,50.4],[4.3,50.15],[5.8,50.5],[6.7,51.2],[6.7,52.5],[5.5,53.1],[4.5,52.65],[3.6,51.9]],[[[4.3,51.3],[5.1,51.9],[5.5,52.6]]],65);
const upperDanube=area('upper-danube-central-europe-basins',[[11.8,47.8],[13.6,47.6],[15.2,47.8],[17.2,47.7],[17.7,48.5],[16.4,49.1],[14.8,49.2],[13.3,48.9]],[[[12.2,48.6],[14.2,48.3],[16.3,48.2]]]);
const thrace=area('thrace-marmara-western-lowlands',[[26.0,40.6],[26.15,41.6],[26.8,42.05],[27.8,41.9],[28.8,41.55],[29.25,41.2],[29.2,40.85],[28.2,40.7],[27.2,40.4]],[[[26.6,41.7],[27.5,41.35],[28.9,41.02]]],60);
const marmaraAsia=area('marmara-southern-basins-foothills',[[26.5,39.2],[27.7,39.15],[29.2,39.4],[30.6,39.7],[31.0,40.5],[30.6,41.1],[29.5,41.25],[28.4,40.9],[27.0,40.7]],[[[27.5,40.1],[29.05,40.2],[30.2,40.7]]],65);
const aegean=area('western-anatolian-aegean-basins',[[26.1,37.5],[27.2,37.0],[28.5,37.2],[29.6,38.0],[29.6,39.3],[28.5,40.0],[27.0,39.9],[26.1,39.1]],[[[27.15,38.42],[27.7,38.6],[28.7,38.5]],[[27.4,37.75],[28.3,37.9],[29.0,37.9]]],60);
const westernInterior=area('western-anatolian-interior-lowland-mosaic',[[28.2,38.2],[29.7,38.0],[30.8,38.55],[31.2,39.5],[30.3,40.25],[28.9,40.0],[28.3,39.1]],[[[29.3,38.7],[30.0,39.4],[30.7,39.7]]],70);
const centralPlateau=area('central-anatolian-habitable-basins',[[30.5,38.25],[31.8,38.0],[33.3,38.3],[34.8,38.8],[35.4,39.7],[34.2,40.75],[32.5,40.8],[31.3,40.2],[30.4,39.25]],[[[31.0,39.6],[32.85,39.93],[34.3,39.8]],[[31.8,38.4],[33.0,38.7],[34.4,39.2]]],80);
const ankaraBasin=area('ankara-basin-interfluves',[[32.0,39.5],[33.1,39.35],[33.75,39.8],[33.55,40.25],[32.7,40.4],[32.0,40.05]],[[[32.3,39.75],[32.85,39.93],[33.4,40.05]]],55);
const ankaraOuter=area('ankara-surrounding-plateau-basins',[[31.15,39.15],[32.0,38.75],[33.0,38.85],[34.0,39.2],[34.6,39.8],[34.1,40.5],[33.0,40.75],[31.8,40.4],[31.15,39.8]],[[[31.6,39.5],[32.3,40.2],[33.7,40.25]]],75);
const cukurova=area('cukurova-lowlands-and-foothills',[[33.7,36.0],[35.0,36.15],[36.2,36.4],[36.7,37.15],[36.3,37.8],[35.3,37.6],[34.2,37.3],[33.65,36.7]],[[[34.5,36.8],[35.3,37.0],[35.8,37.1]],[[35.15,37.45],[35.4,37.0],[35.6,36.6]]],55);
const westernBlackSea=area('western-black-sea-landward-foothills',[[30.4,40.45],[31.6,40.3],[33.0,40.6],[33.35,41.3],[32.6,41.8],[31.6,41.65],[30.6,41.2]],[[[31.1,40.9],[31.8,41.4],[32.4,41.6]]],50);
const samsunBasins=area('samsun-and-interior-black-sea-basins',[[34.6,40.55],[35.4,40.25],[36.5,40.5],[37.2,41.0],[36.7,41.55],[35.7,41.7],[34.8,41.2]],[[[35.4,40.7],[36.0,41.05],[36.3,41.29],[36.8,41.1]]],55);
const southeast=area('southeastern-anatolian-valley-basin-mosaic',[[36.5,36.7],[37.9,36.5],[39.3,36.8],[40.8,37.0],[41.0,37.7],[40.3,38.6],[38.8,38.5],[37.1,38.1]],[[[37.2,37.05],[38.8,37.2]],[[39.7,37.9],[40.2,37.9],[40.7,37.5]]],70);
const karin=area('karin-aras-armenian-habitable-basins',[[40.3,39.5],[41.2,39.3],[42.2,39.6],[43.6,39.65],[44.8,40.0],[44.6,40.8],[43.2,41.2],[42.2,40.8],[41.0,40.6]],[[[41.3,39.9],[42.6,40.0],[44.0,40.15]]],65);
const easternBlackSea=area('eastern-black-sea-foothill-basins',[[39.8,40.5],[40.8,40.3],[41.8,40.6],[42.0,41.3],[41.2,41.6],[40.2,41.2]],[[[40.4,40.9],[41.1,41.05],[41.8,41.2]]],45);
const cankiri=area('cankiri-north-central-valley-basins',[[32.6,40.2],[34.2,40.0],[35.3,40.5],[35.0,41.0],[33.4,41.2],[32.7,40.9]],[[[33.4,40.5],[34.1,40.7],[34.9,40.7]]],60);
const western=[[frNorth,.13],[frCentre,.14],[frSouthwest,.12],[frRhone,.08],[deNorth,.14],[deRhine,.11],[deCentral,.10],[deSouth,.13],[lowCountries,.05]];
const profiles={
 'MODERN-WEST':western,
 'SINTI-CORE':[[deNorth,.24],[deRhine,.20],[deCentral,.16],[deSouth,.16],[frNorth,.08],[frCentre,.06],[frSouthwest,.04],[frRhone,.04],[lowCountries,.02]],
 'DIASPORA-EU':[...western.map(([a,w])=>[a,w*.85]),[upperDanube,.15]],
 BYZANTIUM:[[thrace,.2],[marmaraAsia,.2],[aegean,.2],[westernInterior,.12],[centralPlateau,.18],[cukurova,.10]],
 'ROMANLAR-MARMARA':[[thrace,.45],[marmaraAsia,.55]],
 'ROMANLAR-AEGEAN':[[aegean,.75],[westernInterior,.25]],
 'ROMANLAR-MEDITERRANEAN':[[cukurova,1]],
 'ROMANLAR-ANKARA':[[ankaraBasin,.35],[ankaraOuter,.65]],
 'ROMANLAR-BLACKSEA':[[westernBlackSea,.4],[samsunBasins,.6]],
 'DOM-SE-ANATOLIA':[[southeast,1]],
 'LOM-ARMENIA':[[karin,.5],[easternBlackSea,.35],[cankiri,.15]],
};
const exclusions=[
 {id:'alpine-high-core',polygon:ring([[6.7,45.4],[7.8,45.3],[9.2,46.0],[11.8,46.3],[13.4,46.7],[13.0,47.35],[10.6,47.25],[8.5,46.9],[7.0,46.15]])},
 {id:'pyrenean-high-core',polygon:ring([[-1.2,42.7],[1.5,42.5],[2.4,42.9],[1.5,43.15],[-.1,43.25],[-1.2,43.0]])},
 {id:'massif-central-high-core',polygon:ring([[2.55,44.9],[3.55,44.9],[3.6,45.55],[2.7,45.55]])},
 {id:'harz-high-core',polygon:ring([[10.35,51.67],[10.8,51.63],[10.98,51.85],[10.65,51.98],[10.4,51.84]])},
 {id:'tuz-lake-core',polygon:ring([[33.15,38.62],[33.55,38.55],[33.8,38.8],[33.65,39.02],[33.3,39.05]])},
 {id:'beysehir-lake-core',polygon:ring([[31.3,37.55],[31.65,37.55],[31.75,37.85],[31.5,38.0],[31.3,37.85]])},
 {id:'western-taurus-high-core',polygon:ring([[30.0,36.7],[31.4,37.3],[33.0,37.25],[33.2,36.8],[31.6,36.3]])},
 {id:'bozdag-high-core',polygon:ring([[27.75,38.05],[28.25,38.05],[28.25,38.3],[27.8,38.35]])},
 {id:'biesbosch-wetland-core',polygon:ring([[4.7,51.68],[4.87,51.68],[4.91,51.82],[4.77,51.83]])},
];

export function sampleRomaRegionalArea({id,count=1024,wetlandCores=[]}){
 const entries=profiles[id];if(!entries)return null;
 const sum=entries.reduce((n,[,weight])=>n+weight,0),components=entries.map(([a,weight])=>({...a,share:weight/sum,box:bounds(a.polygon)}));
 const random=randomFor(`${id}:broad-regional-area-v1`),points=[],used=components.map(()=>0);
 const forbidden=[...exclusions,...wetlandCores];
 for(let index=0;index<count;index++){
  let selected=0,score=-Infinity;
  for(let i=0;i<components.length;i++){const deficit=(index+1)*components[i].share-used[i]+random()*.0001;if(deficit>score){score=deficit;selected=i;}}
  const component=components[selected],b=component.box;let accepted;
  for(let attempt=0;attempt<100000;attempt++){
   const p=[b[0]+random()*(b[2]-b[0]),b[1]+random()*(b[3]-b[1])];
   if(!inRomaArea(p,component.polygon)||!isLand(p)||forbidden.some(e=>inRomaArea(p,e.polygon)))continue;
   const edge=romaLineDistanceKm(p,[component.polygon]),water=romaLineDistanceKm(p,component.guides);
   const moisture=Math.exp(-Math.pow(water/component.waterScaleKm,2));
   // Broad nonzero interior background is intentional: interfluves and settled
   // basins remain available hundreds of kilometers off the old route guides.
   const mosaic=.28+.45*noise(p,.65,17431)+.27*noise(p,.23,37261);
   const suitability=(.65+.35*moisture)*mosaic*Math.min(1,edge/24);
   if(random()<suitability){accepted=p;break;}
  }
  if(!accepted)throw new Error(`Unable to sample broad Roma area ${id}/${component.id}`);
  points.push(accepted);used[selected]++;
 }
 return {kind:'resource-area-footprint',points,basis:ROMA_AREA_BASIS,box:bounds(components.flatMap(c=>c.polygon)),components:components.map(({id,polygon,guides,share,waterScaleKm})=>({id,polygon,guides,share,waterScaleKm})),exclusions,resourceKinds:['broad-two-dimensional-lowland-mosaic','interfluves-and-habitable-basins','water-access-suitability','lower-foothill-mosaic']};
}
