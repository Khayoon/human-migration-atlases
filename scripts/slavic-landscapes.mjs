/** Resource/terrain-informed Slavic display positions. No demographic inference. */
import { readFileSync } from 'node:fs';
import { isLand, distanceKm } from './route-landmask.mjs';

const SOURCES = [
  {title:'Natural Earth 1:10m rivers and lake centerlines',url:'https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/',note:'Retained river geometry guides nearby lowland/terrace placement; modern channels do not establish medieval settlements.'},
  {title:'Natural Earth 1:10m land polygons',url:'https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/',note:'Retained physical land clipping; coarse inland lake avoidance is separately declared.'},
  {title:'Dobrzańska (2024): Early medieval settlements at Zofipole and the Vistula loess terrace',url:'https://journals.ur.edu.pl/anarres/article/view/9702',note:'Supports fifth-seventh-century settlement at terrace/floodplain boundaries with cultivation, stockbreeding, water and clay access. It is a regional analogue, not proof for every plotted settlement.'},
  {title:'Ramsar: Prypiat River Floodplains information sheet',url:'https://rsis.ramsar.org/RISapp/files/RISrep/UA776RIS_2111_en.pdf',note:'Modern physical reference for channels, floodplain, bog, peat, sandy islands/dunes and seasonally flooded forest/meadow mosaics; no medieval carrying capacity is inferred.'},
  {title:'Ramsar: Mid-Pripyat wetland mosaic',url:'https://www.ramsar.org/news/belarus-names-two-new-ramsar-sites',note:'Supports flood-limited access and the alluvial oak, meadow and lowland-mire mosaic; wetland margins are not assumed empty of people.'},
];
const EASTERN_SOURCES = {
  upperOka:{title:'Institute of Archaeology RAS: Seym-Sudzha expedition (2019)',url:'https://archaeolog.ru/expeditions/expeditions-2019/seyminskosudzhinskaya-ekspeditsiya-2019',note:'Field report records Late Zarubintsy and Kyiv-Kolochin traditions in the Upper Oka/Orel region, including V-VII-century material. Archaeological traditions are not a census or proof of every resident identity.'},
  upperDon:{title:'Oblomsky: Early medieval sites in the forest-steppe Don region (2011)',url:'https://archaeolog.ru/press/articles/n154',note:'Primary field report distinguishes mixed VII-century Upper Voronezh material from Borshevo evidence of Slavic settlement in the late VIII or IX century. The separately timed E3-D display branch uses the later interval, not an early whole-steppe population.'},
  seym:{title:'Archaeological Discoveries 2021: excavations in Kursk and Pristensky district',url:'https://archaeolog.ru/media/ao/AO_2021.pdf',note:'Institute of Archaeology field volume records Romny pottery of IX-X centuries on the Tuskar/Seym terrace at Kursk. Supports a forest-steppe river network, not the number of migrants or an exact arrival date.'},
  smolensk:{title:'Institute of Archaeology RAS: Cathedral Hill of Smolensk (2020)',url:'https://archaeolog.ru/press/articles/arkheologicheskoe-izuchenie-sobornoy-gory-smolenska',note:'Excavation report identifies an extensive late-first-millennium settlement using VIII-X-century pottery and radiocarbon evidence. Supports the connecting Upper Dnieper belt without implying a continuous ethnic boundary.'},
  ilmen:{title:'Institute of Archaeology RAS: tenth-century casting mould from Rurik hillfort',url:'https://archaeolog.ru/online-museum/onlayn-vystavka-svideteli-proshlogo-iskusstvo-i-remeslo-v-arkheologicheskikh-nakhodkakh/kamennaya-liteynaya-forma',note:'Mid-X-century manufacture of ornaments of Slavic tradition confirms that the Ilmen/Volkhov region should remain represented; the report explicitly describes a multiethnic settlement.'},
  upperVolga:{title:'Komarov (2018): Slavic settlement in the Upper Volga, pp. 92-98',url:'https://archaeolog.ru/media/books_2018/Zemli_rodnoj.pdf',note:'Institutional archaeological synthesis discusses sparse early occupation and uneven later colonisation across a Finnic substrate. It does not supply a population allocation for this model.'},
};
const BASIS = 'Irregular geographic display reconstruction using retained river geometry, adjoining lowland and terrace belts, foothill approaches and landward coastal access. Narrower highland-valley envelopes and coarse wetland/open-lake constraints favour plausible accessible ground rather than uniform radial settlement. Corridor widths, relative component shares and suitability texture are illustrative habitat priors, not measured medieval resources, surveyed villages, ancient carrying capacity, ethnicity or additional population. The same numbered residents are redistributed; headcounts, dates and source evidence are unchanged.';
const close = points => points.length && (points[0][0]!==points.at(-1)[0]||points[0][1]!==points.at(-1)[1]) ? [...points,points[0]] : points;
const corridor = (path,widthKm=12,weight=1,kind='terrace-guide')=>({path,widthKm,weight,kind});
function component(id,share,footprint,riverNames,guides=[],options={}) {
  return {id,share,footprint:close(footprint),riverNames,corridors:guides,riverWidthKm:options.riverWidthKm??12,
    exclusions:(options.exclusions??[]).map(close),wetlands:(options.wetlands??[]).map(close),wetlandFactor:options.wetlandFactor??.08,
    resourceKinds:options.resourceKinds??['river-access','alluvial-terrace','cultivable-lowland'],basis:options.basis??'River-adjacent dry terraces and nearby lowlands, represented as a broad reconstructed habitat belt.'};
}
const bogCore = close([[26.15,51.75],[26.95,51.55],[28.4,51.62],[29.15,51.9],[28.85,52.25],[27.4,52.32],[26.35,52.1]]);
const lakeIlmen = close([[30.98,57.96],[31.15,58.31],[31.43,58.48],[31.74,58.32],[31.73,58.02],[31.41,57.82],[31.12,57.83]]);
const regions = {};
const define = (id,regionId,components)=>regions[id]={id,regionId,components,basis:BASIS};

define('SLAVIC-CORE','Pripyat margins and Dnieper-Desna ancestral proxy',[
  component('southern-polesia-terraces',.42,[[25.0,50.35],[26.1,50.05],[27.4,50.25],[28.8,50.05],[30.3,50.2],[30.8,50.8],[30.35,51.45],[29.2,51.5],[28.0,51.25],[26.7,51.5],[25.3,51.2]],['Pripyat','Dnipro'],[
    corridor([[25.5,50.75],[26.6,51.05],[27.7,50.85],[28.9,50.65],[30.15,50.65]],18,1.5),
    corridor([[26.2,50.45],[27.2,50.55],[28.3,50.4],[29.45,50.35]],15,.7),
  ],{wetlands:[bogCore],riverWidthKm:14,basis:'Southern Polesia raised margins and tributary terraces; wet ground has lower relative suitability, not a categorical prohibition on inhabitants.'}),
  component('northern-polesia-raised-margins',.18,[[25.25,52.18],[26.2,52.12],[27.25,52.28],[28.4,52.15],[29.55,52.3],[30.65,52.48],[31.25,52.85],[30.3,53.05],[29.2,52.8],[27.9,52.83],[26.5,52.7],[25.25,52.65]],['Pripyat','Dnipro'],[
    corridor([[25.6,52.4],[26.8,52.45],[28.0,52.5],[29.4,52.55],[30.5,52.7]],13,1.4),
  ],{wetlands:[bogCore],riverWidthKm:9,basis:'Northern raised margins of the Polesia wetland mosaic; guide widths and dry-ground weighting are reconstructed.'}),
  component('dnieper-desna-terraces',.35,[[30.0,49.9],[31.0,49.7],[31.65,50.3],[32.45,50.7],[33.5,51.45],[33.7,52.2],[32.6,53.1],[31.4,52.9],[30.55,52.3],[30.25,51.3]],['Dnipro','Dnepre','Desna'],[
    corridor([[30.6,50.35],[31.15,51.05],[31.8,51.5],[32.6,52.15]],15,.5),
  ],{riverWidthKm:13,basis:'Dnieper and Desna river-adjacent low terraces within the broad ancestral proxy region.'}),
  component('sparse-pripyat-levee-mosaic',.05,[[25.7,51.55],[26.8,51.45],[27.9,51.6],[29.1,51.55],[30.2,51.8],[30.35,52.2],[29.25,52.4],[27.9,52.3],[26.5,52.35],[25.5,52.0]],['Pripyat'],[
    corridor([[25.8,51.87],[26.8,51.95],[27.8,52.1],[28.7,52.03],[29.6,52.06]],3.8,.6,'levee-guide'),
  ],{riverWidthKm:4,resourceKinds:['river-access','raised-levee-mosaic'],basis:'Small display share for raised river-margin/island ground within the wetland mosaic. Not a claim that the entire marsh was empty or uniformly suitable.'}),
]);
define('B1','Right-bank Korchak terrace mosaic',[
  component('volhynia-teteriv-terraces',.67,[[25.1,50.2],[25.5,49.7],[26.7,49.8],[27.6,49.6],[28.8,49.9],[30.25,50.3],[30.45,50.95],[29.3,51.25],[28.0,51.05],[26.9,51.35],[25.6,50.95]],['Pripyat','Dnipro'],[
    corridor([[25.6,50.55],[26.7,50.7],[27.7,50.35],[28.7,50.35],[29.7,50.75]],16,1.4),
  ],{wetlands:[bogCore],riverWidthKm:10}),
  component('upper-bug-podolian-margin',.33,[[25.2,49.0],[26.1,48.8],[27.3,49.0],[28.65,48.8],[29.4,49.25],[29.1,49.85],[27.8,49.7],[26.6,49.95],[25.5,49.6]],['Southern Bug','Dniester'],[
    corridor([[25.7,49.45],[26.8,49.4],[27.9,49.5],[29,49.25]],14,.9),
  ],{riverWidthKm:13,resourceKinds:['river-access','podolian-foothill','cultivable-terrace']}),
]);
define('B2','Forest-steppe river terraces',[
  component('southern-bug-dniester-forest-steppe',.6,[[26.3,48.0],[27.4,47.6],[28.5,47.75],[29.7,48.2],[30.1,49.05],[29.4,49.85],[28.1,49.7],[26.9,49.95],[26.2,49.1]],['Southern Bug','Dniester'],[
    corridor([[26.8,48.8],[27.7,48.6],[28.5,48.9],[29.3,48.5]],14,.5),
  ],{riverWidthKm:15}),
  component('middle-dnieper-forest-steppe',.4,[[29.6,48.4],[30.5,48.2],[31.4,48.55],[32.2,49.0],[32.25,49.75],[31.4,50.25],[30.6,50.0],[29.9,49.4]],['Dnipro'],[
    corridor([[30.4,49.7],[31.0,49.5],[31.7,49.0]],13,.4),
  ],{riverWidthKm:18}),
]);
define('B3','Upper Dnieper-Desna forest river margins',[
  component('upper-desna-forest-terraces',.7,[[31.0,52.0],[31.9,51.85],[32.75,52.15],[33.9,52.45],[34.05,53.2],[33.3,54.2],[32.35,54.35],[31.5,53.75],[31.1,52.9]],['Desna','Dnepre','Dnipro'],[
    corridor([[31.8,52.3],[32.5,52.7],[33,53.3],[33.3,53.9]],11,.8),
  ],{riverWidthKm:12,resourceKinds:['river-access','forest-clearing','dry-terrace']}),
  component('upper-dnieper-sozh-approaches',.3,[[30.1,52.3],[30.8,52.0],[31.45,52.5],[32.0,53.3],[31.6,54.2],[30.7,54.45],[30.15,53.6]],['Dnepre','Dnipro'],[
    corridor([[30.5,52.65],[30.9,53.15],[31.2,53.7]],10,1.3),
  ],{riverWidthKm:11,resourceKinds:['river-access','forest-clearing','dry-terrace']}),
]);
define('B4','Moravian and western Pannonian river terraces',[
  component('morava-danube-dry-terraces',.6,[[16.2,48.0],[16.6,47.75],[17.3,47.8],[18.1,48.0],[18.2,48.6],[17.8,49.05],[17.0,49.05],[16.45,48.7]],['Morava','Danube'],[
    corridor([[17.15,48.9],[17.05,48.5],[17.15,48.15],[17.7,48.05]],9,1.1,'moravian-danube-terrace-guide'),
  ],{riverWidthKm:10,resourceKinds:['river-access','dry-terrace','cultivable-lowland'],basis:'Reconstructed Morava and upper-middle Danube terraces for a separately funded western transit pool; not an archaeological census or an exclusive ethnic homeland.'}),
  component('western-pannonian-raba-lowlands',.4,[[16.05,46.85],[16.5,46.65],[17.3,46.9],[17.85,47.3],[17.95,47.85],[17.2,48.05],[16.4,47.8],[16.05,47.4]],['Danube','Raba'],[
    corridor([[17.65,47.75],[17.15,47.5],[16.75,47.25],[16.45,46.95]],9,1,'western-pannonian-lowland-guide'),
  ],{riverWidthKm:10,resourceKinds:['river-access','cultivable-lowland','lower-foothill'],basis:'Reconstructed western Pannonian river-adjacent lowlands. Placement shares distribute the same funded residents and do not create ancestry fractions.'}),
]);
define('W1-A','Upper Vistula and loess terrace belt',[
  component('upper-vistula-loess-terraces',.72,[[18.8,49.85],[19.7,49.65],[20.5,49.85],[21.5,49.9],[22.45,50.25],[22.4,50.75],[21.3,50.85],[20.4,50.55],[19.3,50.65],[18.8,50.2]],['Vistula'],[
    corridor([[19.2,50.1],[20.0,50.13],[20.9,50.2],[21.8,50.45]],10,.45),
  ],{riverWidthKm:11}),
  component('san-bug-southern-approaches',.28,[[21.7,50.05],[22.55,49.9],[23.3,50.2],[24.05,50.6],[23.95,51.05],[23.1,51.05],[22.4,50.7]],['Bug','Vistula'],[
    corridor([[22.1,50.3],[22.75,50.55],[23.35,50.8]],12,1),
  ],{riverWidthKm:10}),
]);
define('W1-B','Middle Vistula and central Polish lowlands',[
  component('middle-vistula-terrace-chain',.7,[[18.4,51.6],[19.4,51.4],[20.3,51.3],[21.4,51.0],[22,51.45],[21.6,52.3],[20.5,52.75],[19.2,53.0],[18.25,52.7]],['Vistula','Warta'],[
    corridor([[18.8,52.4],[19.7,52.25],[20.55,52.05],[21.35,51.5]],14,.5),
  ],{riverWidthKm:14}),
  component('central-lowland-tributary-belt',.3,[[17.8,51.2],[18.8,50.95],[19.65,51.25],[20.5,51.55],[20.1,52.1],[19.1,52.2],[18.0,51.85]],['Warta'],[
    corridor([[18.2,51.55],[19.0,51.6],[19.7,51.7]],14,.8),
  ],{riverWidthKm:13}),
]);
define('W2','Oder-Vistula southwestern Baltic lowland belts',[
  component('lower-oder-coastal-lowland',.55,[[11.6,53.15],[12.5,52.9],[13.5,53.1],[14.4,52.85],[15.25,53.15],[15.6,53.85],[14.8,54.25],[13.65,54.4],[12.5,54.1],[11.7,53.75]],['Oder'],[
    corridor([[11.9,53.55],[12.9,53.75],[13.8,53.6],[14.5,53.45],[15.1,53.6]],11,1.2,'coastal-lowland-guide'),
  ],{riverWidthKm:13,resourceKinds:['river-access','coastal-lowland','cultivable-terrace']}),
  component('pomeranian-lower-vistula-approaches',.45,[[15.2,53.0],[16.25,52.8],[17.3,53.1],[18.8,53.0],[19.15,53.6],[18.7,54.35],[17.55,54.5],[16.45,54.2],[15.35,54.2]],['Vistula','Warta'],[
    corridor([[15.5,53.55],[16.45,53.7],[17.4,53.85],[18.25,53.75]],13,1.1,'coastal-lowland-guide'),
  ],{riverWidthKm:13,resourceKinds:['river-access','coastal-lowland','cultivable-terrace']}),
]);
define('W3-M','Morava and Dyje valley margins',[
  component('morava-dyje-lowlands',1,[[16.25,48.55],[16.6,48.3],[17.25,48.45],[17.7,48.85],[17.8,49.6],[17.35,49.95],[16.8,49.55],[16.65,49.05],[16.3,48.95]],['Morava'],[
    corridor([[16.35,48.8],[16.85,48.8],[17.1,48.95],[17.25,49.45]],8,.85),
  ],{riverWidthKm:10,resourceKinds:['river-access','lowland-valley','dry-terrace']}),
]);
define('W3-B','Vltava-Elbe Bohemian basins',[
  component('vltava-elbe-basin',.75,[[13.3,49.8],[13.9,49.55],[14.65,49.55],[15.2,49.9],[15.65,50.25],[15.35,50.65],[14.45,50.85],[13.55,50.65]],['Vltava','Elbe'],[
    corridor([[13.75,50.15],[14.35,50.1],[14.9,50.25],[15.4,50.2]],8,.4),
  ],{riverWidthKm:10}),
  component('bohemian-eastern-foothill-basins',.25,[[14.9,49.75],[15.5,49.65],[16.0,49.85],[16.2,50.15],[15.8,50.6],[15.2,50.35]],['Elbe'],[
    corridor([[15.25,49.95],[15.7,50.05],[15.95,50.25]],8,.9),
  ],{riverWidthKm:8,resourceKinds:['river-access','foothill-basin','dry-terrace']}),
]);
define('W3-S','Western Slovak river valleys and Danubian lowlands',[
  component('morava-danube-lowland',.6,[[16.8,48.0],[17.25,47.7],[18.1,47.75],[18.65,48.0],[18.25,48.5],[17.6,48.55],[17.2,48.9],[16.85,48.5]],['Morava','Danube','Donau'],[
    corridor([[17.1,48.2],[17.6,48.15],[18.1,48.25]],9,.5),
  ],{riverWidthKm:11}),
  component('vah-nitra-valley-approaches',.4,[[17.3,48.35],[17.75,48.15],[18.3,48.4],[18.55,48.95],[18.25,49.3],[17.85,48.9],[17.5,48.8]],[],[
    corridor([[17.65,48.4],[17.85,48.7],[18.2,49.1]],7,1),
    corridor([[18.1,48.35],[18.15,48.65],[18.3,48.95]],7,.6),
  ],{resourceKinds:['tributary-access','foothill-valley','cultivable-terrace']}),
]);
define('W4','Elbe-Mulde-Saale settlement valleys',[
  component('saale-mulde-valley-mosaic',.55,[[10.8,50.8],[11.2,50.5],[11.9,50.6],[12.55,50.75],[12.8,51.25],[12.45,51.8],[11.8,51.95],[11.25,51.6]],[],[
    corridor([[11.2,50.8],[11.5,51.1],[11.8,51.4],[11.9,51.8]],9,1.2),
    corridor([[12.6,50.85],[12.55,51.25],[12.3,51.7]],9,1),
  ],{resourceKinds:['river-access','loess-lowland','dry-terrace']}),
  component('elbe-lowland-connection',.45,[[11.8,51.5],[12.4,51.25],[13.15,51.4],[13.2,51.9],[12.6,52.4],[11.75,52.3],[11.5,51.9]],['Elbe'],[
    corridor([[12.0,51.65],[12.35,51.9],[12.15,52.15]],10,.4),
  ],{riverWidthKm:12}),
]);
define('E3','Dnieper-Desna-Seym forest-steppe terraces',[
  component('dnieper-right-left-bank-terraces',.55,[[29.8,49.8],[30.5,49.45],[31.4,49.65],[32.25,50.15],[32.5,50.8],[31.6,51.4],[30.8,51.45],[30.2,50.8]],['Dnipro','Desna'],[
    corridor([[30.4,50.35],[31.3,50.55],[32.0,50.65]],13,.4),
  ],{riverWidthKm:15}),
  component('desna-seym-left-bank',.45,[[32.0,50.2],[32.9,49.95],[34.2,50.25],[35.5,50.45],[36.4,50.9],[36.8,51.6],[35.8,52.1],[34.5,52.4],[33.3,51.9],[32.2,51.55]],['Desna','Seym'],[
    corridor([[32.5,50.7],[33.4,50.95],[34.2,51.0],[34.8,51.3]],13,.5),
    corridor([[34.3,51.35],[35.0,51.5],[35.8,51.65],[36.2,51.7]],11,.65,'seym-tributary-terrace-guide'),
  ],{riverWidthKm:13,basis:'Middle Dnieper and Desna-Seym cultivated river terraces, extending toward the Kursk forest-steppe rather than stopping at the modern border. Upper Don candidates belong only to the separate later E3-D branch.'}),
]);
regions.E3.basis=BASIS+' Eastern geographic review extends the Seym approach while preserving the original E3 allocation and earliest chronology. The later Upper Don footprint is separate.';
regions.E3.sources=[EASTERN_SOURCES.seym];
define('E3-D','Late Upper Don and Upper Voronezh forest-steppe river terraces',[
  component('upper-don-riparian-terraces',.6,[[38.1,50.9],[38.7,50.65],[39.45,50.85],[39.6,51.8],[39.2,52.55],[38.6,53.0],[37.9,52.8],[37.6,52.05],[37.7,51.4]],['Don'],[
    corridor([[38.95,52.85],[38.9,52.4],[39.05,52.1],[39.0,51.7],[39.1,51.5],[39.5,51.0]],9,.35,'don-bank-terrace-guide'),
  ],{riverWidthKm:10,resourceKinds:['river-access','forest-steppe-terrace','cultivable-river-margin'],basis:'Narrow Upper Don banks and adjoining cultivable forest-steppe terraces. This footprint is used only by the separately funded late-VIII-X-century E3-D transfer, not by the earliest E3 arrivals.'}),
  component('upper-voronezh-tributary-terraces',.4,[[39.0,51.4],[39.7,51.45],[40.2,51.9],[40.45,52.55],[40.45,53.0],[39.75,53.1],[39.25,52.7],[39.15,52.1]],[],[
    corridor([[40.35,52.9],[40.1,52.65],[39.6,52.6],[39.45,52.35],[39.5,52.0],[39.2,51.7],[39.1,51.5]],10,1,'reconstructed-voronezh-river-terrace-guide'),
  ],{riverWidthKm:10,resourceKinds:['river-access','forest-steppe-terrace','cultivable-river-margin'],basis:'Reconstructed guide beside the Voronezh tributary and dry terraces. This river is absent from the retained Natural Earth named-river layer; the guide is explicitly reconstructed, not a surveyed settlement map.'}),
]);
regions['E3-D'].basis=BASIS+' Primary field evidence places Borshevo settlement on the northern Upper Don in the late eighth or ninth century. The model displays a separately funded onward share during 775-950 CE; exact dates and its 60/40 within-footprint split are reconstruction choices. Open-steppe interiors are not filled.';
regions['E3-D'].sources=[EASTERN_SOURCES.upperDon];
define('S1-D','Lower Danube-Wallachian terrace plains',[
  component('olt-danube-terraces',.5,[[23.4,43.75],[24.4,43.6],[25.45,43.75],[26.0,44.1],[25.55,44.7],[24.8,45.2],[24.1,45.1],[23.6,44.55]],['Danube','Donau','Olt'],[],{riverWidthKm:13}),
  component('ialomita-lower-danube-plain',.5,[[25.1,44.1],[26.0,43.8],[27.1,44.1],[28.0,44.25],[28.2,44.85],[27.4,45.3],[26.6,45.1],[25.65,44.8]],['Danube','Ialomita','Borcea'],[
    corridor([[25.5,44.65],[26.25,44.7],[27.1,44.65]],11,.5),
  ],{riverWidthKm:13}),
]);
define('S1-N','Northwestern Romanian basin and tributary lowlands',[
  component('somes-crasna-lowlands',1,[[22.35,47.4],[22.8,47.05],[23.5,47.05],[24.1,47.3],[24.5,47.8],[24.1,48.1],[23.35,48.15],[22.7,47.95]],[],[
    corridor([[22.65,47.7],[23.15,47.8],[23.55,47.55],[24.1,47.55]],8,1.2),
    corridor([[22.75,47.35],[22.95,47.6],[23.1,47.85]],7,.8),
  ],{resourceKinds:['tributary-access','basin-lowland','cultivable-terrace']}),
]);
define('S3','Danube-Morava northern Balkan valleys',[
  component('danube-northern-balkan-fringe',.45,[[19.2,44.1],[19.7,43.9],[20.5,44.15],[21.3,44.1],[22.3,44.35],[22.5,44.85],[21.8,45.0],[20.8,44.85],[19.8,45.0]],['Danube','Donau','Sava','Morava'],[],{riverWidthKm:12}),
  component('morava-interior-valley',.55,[[20.3,43.0],[20.75,42.85],[21.4,43.2],[21.65,43.85],[21.4,44.6],[20.85,44.65],[20.35,44.05]],['Morava'],[
    corridor([[20.9,43.2],[21.05,43.65],[21.15,44.1],[21.0,44.45]],8,1),
  ],{riverWidthKm:9,resourceKinds:['river-access','interior-valley','dry-terrace']}),
]);
define('S4','Podravina-Sava and Dalmatian resource belts',[
  component('dravina-sava-lowlands',.45,[[14.75,45.6],[15.45,45.4],[16.4,45.45],[17.5,45.55],[18.0,46.0],[17.4,46.5],[16.5,46.55],[15.5,46.25]],['Drau','Sava','Mur'],[
    corridor([[15.5,46.1],[16.3,46.2],[17.2,46.0]],9,.6),
  ],{riverWidthKm:11}),
  component('north-dalmatian-hinterland',.4,[[15.05,43.8],[15.5,43.55],[16.2,43.65],[16.65,44.0],[16.3,44.5],[15.8,44.75],[15.2,44.4]],[],[
    corridor([[15.25,44.15],[15.65,44.05],[16.15,43.85]],7,1.1,'karst-field-water-guide'),
    corridor([[15.45,44.5],[15.75,44.25],[16.2,44.15]],6,.7,'foothill-water-guide'),
  ],{resourceKinds:['coastal-lowland','karst-field','tributary-access']}),
  component('southern-dalmatian-landward-access',.15,[[17.3,42.6],[17.7,42.4],[18.25,42.45],[18.8,42.75],[18.6,43.15],[18.1,43.25],[17.5,42.95]],[],[
    corridor([[17.5,42.82],[18.0,42.72],[18.45,42.9]],5.5,1,'landward-coastal-guide'),
  ],{resourceKinds:['landward-coastal-access','karst-basin','tributary-access']}),
]);
define('S5','Greek interior valley and cultivable plain mosaic',[
  component('macedonian-lowland-valleys',.25,[[21.7,40.45],[22.25,40.25],[22.95,40.4],[23.5,40.85],[23.35,41.4],[22.6,41.5],[22.1,41.15]],['Strymnas','Haliacmon'],[
    corridor([[22.5,41.25],[22.65,40.95],[22.85,40.65]],8,1,'valley-guide'),
  ],{riverWidthKm:9,resourceKinds:['river-access','cultivable-plain','foothill-margin']}),
  component('thessalian-plains',.3,[[21.25,39.35],[21.7,39.05],[22.3,39.1],[22.8,39.55],[22.75,40.0],[22.05,40.0],[21.5,39.8]],[],[
    corridor([[21.6,39.65],[21.95,39.5],[22.4,39.65]],11,1.2,'plain-river-guide'),
    corridor([[21.75,39.25],[22.1,39.5],[22.5,39.75]],8,.7,'foothill-water-guide'),
  ],{resourceKinds:['river-access','cultivable-plain','foothill-margin']}),
  component('boeotian-lowlands',.15,[[22.65,38.25],[23.05,38.05],[23.65,38.15],[23.85,38.55],[23.4,38.8],[22.9,38.75]],[],[
    corridor([[22.9,38.55],[23.25,38.45],[23.55,38.35]],7,1,'basin-water-guide'),
  ],{resourceKinds:['basin-water-access','cultivable-lowland']}),
  component('peloponnesian-valley-plains',.3,[[21.9,37.1],[22.2,36.75],[22.8,36.85],[23.1,37.3],[23.05,37.9],[22.55,38.1],[22.1,37.75]],[],[
    corridor([[22.4,37.45],[22.45,37.15],[22.6,36.95]],7,1.1,'valley-water-guide'),
    corridor([[22.6,37.75],[22.8,37.6],[22.8,37.35]],6,1,'cultivable-plain-guide'),
  ],{resourceKinds:['valley-water-access','cultivable-plain','foothill-margin']}),
]);
define('S6','Dalmatian hinterland water and karst-field margins',[
  component('zrmanja-krka-hinterland',.7,[[15.05,43.8],[15.55,43.6],[16.25,43.75],[16.45,44.2],[16.1,44.65],[15.5,44.7],[15.15,44.35]],[],[
    corridor([[15.3,44.2],[15.65,44.05],[16.15,43.9]],6.5,1.2,'karst-field-water-guide'),
    corridor([[15.55,44.5],[15.9,44.3],[16.15,44.15]],6,.8,'tributary-guide'),
  ],{resourceKinds:['karst-field','tributary-access','coastal-lowland']}),
  component('southern-hinterland-linked-basins',.3,[[16.15,43.35],[16.65,43.2],[17.15,43.4],[17.25,43.85],[16.7,44.05],[16.25,43.8]],[],[
    corridor([[16.35,43.65],[16.7,43.55],[17.0,43.7]],6,1,'basin-water-guide'),
  ],{resourceKinds:['karst-field','basin-water-access']}),
]);
define('S2-A','Eastern Alpine Mura-Drava valley floors and lower slopes',[
  component('mura-lower-slope-belt',.45,[[14.1,46.75],[14.6,46.65],[15.2,46.65],[15.85,46.75],[16.4,46.5],[16.65,46.8],[16.1,47.15],[15.45,47.25],[14.75,47.05]],['Mur'],[],{riverWidthKm:5,resourceKinds:['river-access','alpine-valley-floor','lower-slope']}),
  component('drava-valley-floor',.55,[[13.3,46.55],[13.85,46.35],[14.55,46.45],[15.25,46.4],[16.0,46.35],[16.5,46.55],[15.85,46.8],[15.15,46.7],[14.45,46.75],[13.8,46.8]],['Drau'],[
    corridor([[13.6,46.6],[14.2,46.65],[14.85,46.6],[15.5,46.6]],5,.5,'lower-slope-guide'),
  ],{riverWidthKm:5.5,resourceKinds:['river-access','alpine-valley-floor','lower-slope']}),
]);
define('S2-B','Upper Sava valley and adjoining cultivable basins',[
  component('upper-sava-valley',.65,[[13.65,46.05],[14.05,45.85],[14.6,45.9],[15.0,46.05],[15.25,46.35],[14.85,46.55],[14.3,46.5],[13.9,46.35]],['Sava'],[
    corridor([[13.9,46.3],[14.35,46.25],[14.8,46.15]],5,.7,'lower-slope-guide'),
  ],{riverWidthKm:5.5,resourceKinds:['river-access','alpine-valley-floor','cultivable-basin']}),
  component('sava-lower-basin-approach',.35,[[14.65,45.75],[15.1,45.5],[15.75,45.65],[16.1,45.9],[15.7,46.3],[15.2,46.35],[14.85,46.15]],['Sava'],[],{riverWidthKm:7,resourceKinds:['river-access','basin-lowland','lower-slope']}),
]);
define('E4-O','Upper Oka and Volga-Oka river terrace networks',[
  component('upper-volga-river-network',.15,[[34.4,56.1],[35.2,55.8],[36.1,56.0],[37.2,56.35],[38.0,56.7],[37.8,57.4],[36.7,57.65],[35.8,57.25],[34.7,56.9]],['Volga','Tvertsa'],[],{riverWidthKm:11,resourceKinds:['river-access','forest-clearing','dry-terrace']}),
  component('upper-oka-forest-terraces',.55,[[34.3,53.1],[35.0,52.4],[36.6,52.5],[37.4,53.2],[37.9,54.5],[37.2,55.1],[35.9,55.05],[34.7,54.3]],['Oka'],[
    corridor([[36.12,52.6],[36.1,53.0],[36.55,53.28],[36.13,53.8],[36.1,54.2],[36.27,54.5],[37.0,54.9],[37.4,54.9]],11,.65,'upper-oka-tributary-terrace-guide'),
  ],{riverWidthKm:12,resourceKinds:['river-access','forest-clearing','dry-terrace'],basis:'Upper Oka and tributary clearings near the Orel-Kaluga-Tula forest/forest-steppe transition. Primary field evidence supports early and late-first-millennium occupation here; the displayed share is not a measured census.'}),
  component('oka-moskva-tributary-lowlands',.30,[[35.2,54.4],[36.3,54.2],[37.4,54.4],[38.5,54.65],[39.2,55.1],[38.9,55.9],[37.8,56.2],[36.7,55.8],[35.5,55.5]],['Oka'],[
    corridor([[36.0,55.25],[36.8,55.5],[37.6,55.7],[38.3,55.4]],10,.9,'tributary-terrace-guide'),
  ],{riverWidthKm:12,resourceKinds:['river-access','forest-clearing','dry-terrace']}),
]);
regions['E4-O'].basis=BASIS+' Eastern review restores the southern Upper Oka connection instead of concentrating half of this small display cohort on the Upper Volga. The 15/55/30 habitat shares redistribute the same residents and do not estimate historical regional population shares. Baltic and Finnic substrates remain distinct from this migrant-origin cohort.';
regions['E4-O'].sources=[EASTERN_SOURCES.upperOka,EASTERN_SOURCES.upperVolga];
define('E4-N','Northwestern rivers linked through Smolensk and the Western Dvina',[
  component('volkhov-msta-ilmen-land-margins',.45,[[29.8,57.6],[30.25,57.2],[31.1,57.45],[32.2,57.55],[33.15,57.9],[33.45,58.55],[32.85,59.05],[31.8,59.15],[30.85,58.7],[30.1,58.35]],['Volkhov','Msta'],[
    corridor([[30.35,57.8],[30.6,58.15],[30.9,58.55],[31.3,58.75]],8,.7,'lake-margin-guide'),
  ],{riverWidthKm:9,exclusions:[lakeIlmen],resourceKinds:['river-access','landward-lake-margin','forest-clearing']}),
  component('western-dvina-forest-approach',.25,[[28.5,56.45],[29.25,56.2],[30.2,56.35],[31.2,56.7],[31.4,57.35],[30.75,57.7],[29.8,57.45],[29.1,57.1]],['Daugava','Velikaya'],[
    corridor([[29.0,56.7],[29.7,56.9],[30.45,57.1]],10,.9,'forest-tributary-guide'),
  ],{riverWidthKm:10,resourceKinds:['river-access','forest-clearing','dry-terrace']}),
  component('smolensk-polotsk-connecting-terraces',.30,[[28.4,54.5],[29.25,54.25],[30.2,54.2],[31.2,54.3],[32.45,54.7],[32.4,55.3],[31.6,55.7],[30.5,56.0],[29.3,55.95],[28.3,55.4]],['Dnipro','Dnepre','Daugava'],[
    corridor([[32.2,54.75],[31.3,54.65],[30.7,54.5]],8,.8,'upper-dnieper-terrace-guide'),
    corridor([[30.3,55.15],[29.7,55.45],[28.8,55.5]],9,.8,'western-dvina-terrace-guide'),
  ],{riverWidthKm:10,resourceKinds:['river-access','forest-clearing','dry-terrace'],basis:'Upper Dnieper and Western Dvina dry-terrace connections toward Smolensk/Polotsk. Smolensk VIII-X-century settlement is supported by excavated pottery and radiocarbon dates; locations between evidence anchors remain a display reconstruction.'}),
]);
regions['E4-N'].basis=BASIS+' Eastern review retains the archaeologically supported Ilmen/Volkhov northern presence and adds connecting Upper Dnieper/Western Dvina terraces. The 45/25/30 shares are placement assumptions within the unchanged cohort, not a census or a uniform Slavic ethnic zone.';
regions['E4-N'].sources=[EASTERN_SOURCES.smolensk,EASTERN_SOURCES.ilmen];

const rivers=JSON.parse(readFileSync(new URL('../data/geography/natural-earth-rivers.source.geojson',import.meta.url),'utf8')).features;
const riverLines=new Map();
for(const feature of rivers){if(feature.properties.featurecla==='Lake Centerline')continue;const name=feature.properties.name;if(!name)continue;const lines=feature.geometry.type==='MultiLineString'?feature.geometry.coordinates:[feature.geometry.coordinates];riverLines.set(name,[...(riverLines.get(name)??[]),...lines]);}
const bounds=points=>points.reduce((b,p)=>[Math.min(b[0],p[0]),Math.min(b[1],p[1]),Math.max(b[2],p[0]),Math.max(b[3],p[1])],[Infinity,Infinity,-Infinity,-Infinity]);
const within=(p,b)=>p[0]>=b[0]&&p[0]<=b[2]&&p[1]>=b[1]&&p[1]<=b[3];
function inside(point,ring){let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[j],b=ring[i];if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
function clipped(a,b,box){let lo=0,hi=1;for(const[p,q]of[[a[0]-b[0],a[0]-box[0]],[b[0]-a[0],box[2]-a[0]],[a[1]-b[1],a[1]-box[1]],[b[1]-a[1],box[3]-a[1]]]){if(Math.abs(p)<1e-12){if(q<0)return null;continue;}const t=q/p;if(p<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>hi)return null;}return [[a[0]+(b[0]-a[0])*lo,a[1]+(b[1]-a[1])*lo],[a[0]+(b[0]-a[0])*hi,a[1]+(b[1]-a[1])*hi]];}
const segmentCache=new WeakMap();
function segmentsFor(c){let result=segmentCache.get(c);if(result)return result;const box=bounds(c.footprint);result=[];for(const name of c.riverNames)for(const line of riverLines.get(name)??[])for(let i=1;i<line.length;i++){const pair=clipped(line[i-1],line[i],box);if(pair&&distanceKm(...pair)>.05)result.push({a:pair[0],b:pair[1],widthKm:c.riverWidthKm,weight:distanceKm(...pair)*1.5,kind:'retained-river',name});}for(const guide of c.corridors)for(let i=1;i<guide.path.length;i++){const pair=clipped(guide.path[i-1],guide.path[i],box);if(pair&&distanceKm(...pair)>.05)result.push({a:pair[0],b:pair[1],widthKm:guide.widthKm,weight:distanceKm(...pair)*guide.weight,kind:guide.kind,name:c.id});}if(!result.length)throw new Error(`No river/terrace guide geometry for ${c.id}`);segmentCache.set(c,result);return result;}
function randomFor(seed){let h=2166136261;for(const ch of seed)h=Math.imul(h^ch.codePointAt(0),16777619)>>>0;return()=>{h=(h+0x6d2b79f5)>>>0;let v=Math.imul(h^(h>>>15),1|h);v^=v+Math.imul(v^(v>>>7),61|v);return((v^(v>>>14))>>>0)/4294967296;};}
function segmentDistance(p,a,b){const scale=111.195*Math.cos(p[1]*Math.PI/180),ax=(a[0]-p[0])*scale,ay=(a[1]-p[1])*111.195,dx=(b[0]-a[0])*scale,dy=(b[1]-a[1])*111.195,den=dx*dx+dy*dy,t=den?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/den)):0;return Math.hypot(ax+t*dx,ay+t*dy);}
function edgeDistance(point,ring){let best=Infinity;for(let i=1;i<ring.length;i++)best=Math.min(best,segmentDistance(point,ring[i-1],ring[i]));return best;}
function permitted(point,c){return inside(point,c.footprint)&&!c.exclusions.some(r=>inside(point,r))&&isLand(point);}
function sampleComponent(c,count){const random=randomFor(`slavic-resource-v2:${c.id}`),segments=segmentsFor(c),total=segments.reduce((s,v)=>s+v.weight,0),result=[];for(let tries=0;result.length<count;tries++){if(tries>Math.max(30000,count*2000))throw new Error(`Insufficient resource-shaped land for ${c.id}`);let choice=random()*total,seg=segments.at(-1);for(const option of segments){choice-=option.weight;if(choice<=0){seg=option;break;}}const t=random(),lat=seg.a[1]+(seg.b[1]-seg.a[1])*t,cos=Math.cos(lat*Math.PI/180),dx=(seg.b[0]-seg.a[0])*cos,dy=seg.b[1]-seg.a[1],length=Math.hypot(dx,dy)||1;
    // Spatially varying bank/terrace widths produce a field of land use rather
    // than a constant-width line or a set of radial kernels at modern towns.
    const width=seg.widthKm*(.6+.4*Math.sin((seg.a[0]+seg.a[1])*2+t*Math.PI)**2),cross=(random()+random()+random()+random()-2)*width,along=(random()-.5)*width*.5;
    const p=[seg.a[0]+(seg.b[0]-seg.a[0])*t+(-dy/length*cross+dx/length*along)/(111.195*cos),lat+(dx/length*cross+dy/length*along)/111.195];
    if(!permitted(p,c))continue;const edge=Math.min(1,edgeDistance(p,c.footprint)/Math.max(2,width)),texture=.72+.18*Math.sin(p[0]*11+Math.sin(p[1]*7))+.1*Math.cos(p[1]*13+p[0]*3),wet=c.wetlands.some(r=>inside(p,r))?c.wetlandFactor:1;
    if(random()>Math.max(0,Math.min(1,edge*texture*wet)))continue;result.push(p);
  }return result;}
function hull(points){const ordered=[...points].sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);const chain=list=>{const out=[];for(const p of list){while(out.length>1&&cross(out.at(-2),out.at(-1),p)<=0)out.pop();out.push(p);}return out;};return close([...chain(ordered).slice(0,-1),...chain(ordered.reverse()).slice(0,-1)]);}

/** Exported profiles describe declared display constraints, not surveyed sites. */
export const slavicLandscapeProfiles=regions;
export function slavicLandscapeSuitability(id,point){const region=regions[id];if(!region)throw new Error(`Unknown Slavic landscape ${id}`);let suitability=0;for(const c of region.components){if(!permitted(point,c))continue;let corridorWeight=0;for(const s of segmentsFor(c)){const d=segmentDistance(point,s.a,s.b)/s.widthKm;corridorWeight=Math.max(corridorWeight,Math.exp(-.5*d*d));}const wet=c.wetlands.some(r=>inside(point,r))?c.wetlandFactor:1;suitability=Math.max(suitability,corridorWeight*wet*c.share);}return suitability;}
const cache=new Map();
/** Numbered points keep a stable prefix and alternate across resource regions. */
export function slavicLandscape(id,referenceCoord,count=4096){
  const profile=regions[id];if(!profile)throw new Error(`Missing resource/terrain profile for Slavic landscape ${id}`);
  if(!Number.isSafeInteger(count)||count<1||count>50000)throw new Error('Slavic landscape count must be an integer from 1 to 50,000.');
  const key=`${id}:${count}`;if(cache.has(key))return cache.get(key);
  const shares=profile.components.map(c=>c.share),sum=shares.reduce((a,b)=>a+b,0);if(Math.abs(sum-1)>1e-8)throw new Error(`Component shares do not sum to one for ${id}`);
  const needed=shares.map(()=>0),assignment=[];for(let i=0;i<count;i++){const fraction=(.1732050807568877+i*.6180339887498949)%1;let cumulative=0,index=shares.length-1;for(let j=0;j<shares.length;j++){cumulative+=shares[j];if(fraction<cumulative){index=j;break;}}assignment.push(index);needed[index]++;}
  const pools=profile.components.map((c,i)=>sampleComponent(c,needed[i])),cursor=shares.map(()=>0),points=assignment.map(i=>pools[i][cursor[i]++]),components=profile.components.map(c=>c.footprint);
  const result={points,footprint:{kind:'polygon',rings:[hull(components.flat())]},components,basis:`${profile.regionId}: ${profile.basis} Component shares distribute display locations only; they never create or split demographic estimates. The indexing hull is not a uniformly inhabited area.`,sources:[...SOURCES,...(profile.sources??[])],regionId:profile.regionId,kind:'resource-ribbon-footprint',resourceKinds:[...new Set(profile.components.flatMap(c=>c.resourceKinds))],sourceBounds:bounds(components.flat()),
    habitatComponents:profile.components.map(c=>({id:c.id,share:c.share,footprint:c.footprint,riverNames:c.riverNames,riverWidthKm:c.riverWidthKm,corridors:c.corridors,exclusions:c.exclusions,wetlands:c.wetlands,wetlandFactor:c.wetlandFactor,resourceKinds:c.resourceKinds,basis:c.basis})),exclusions:profile.components.flatMap(c=>c.exclusions)};
  cache.set(key,result);return result;
}