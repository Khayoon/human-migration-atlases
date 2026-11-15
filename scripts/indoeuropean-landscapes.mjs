/**
 * Irregular habitat envelopes for the Indo-European visualization.
 * These declared river terraces, loess plains, foothills and oasis margins are
 * geographic model choices, not excavated settlement maps or palaeoclimate data.
 * Candidates are weighted within the envelopes, then checked against retained
 * land polygons. No circle, radial scatter, or water-tolerant fallback is used.
 */
import { sampleResourceDispersal } from './indoeuropean-resource-networks.mjs';

const habitat = (name, polygon, weight = 1, resource = 'river terraces and adjoining cultivable/pastoral lowlands') => ({ name, polygon, weight, resource });
const water = (name, coordinates, reachKm = 55) => ({ name, coordinates, reachKm });
const profile = (id, label, habitats, waterCorridors = [], exclusions = []) => ({ id, label, habitats, waterCorridors, exclusions });

export const INDOEUROPEAN_LANDSCAPES = {
  clv: profile('clv', 'Lower Volga and northern Caucasus steppe approaches', [
    habitat('Lower Volga west-bank terraces', [[43.8,49.3],[45.2,49.5],[46.7,48.7],[47.0,47.5],[46.2,46.6],[44.9,46.9],[44.2,47.9]], 1.2),
    habitat('Don–Volga interfluve pasture', [[41.7,47.9],[42.9,48.5],[44.6,48.0],[44.8,46.7],[43.8,46.1],[42.4,46.7]], .75, 'steppe pasture with access to tributary valleys'),
  ], [water('Lower Volga', [[44.4,49.0],[45.2,48.1],[46.0,47.1],[47.0,46.2]], 70)]),
  dnipro: profile('dnipro', 'Middle and lower Dnipro terrace network', [
    habitat('Dnipro loess terraces', [[31.0,49.7],[32.4,50.0],[34.1,49.2],[35.8,48.5],[35.2,47.1],[33.7,46.8],[32.2,47.8]], 1.1),
    habitat('Southern Bug–Dnipro interfluve', [[29.9,48.3],[31.5,48.8],[33.0,48.1],[33.4,47.2],[31.6,46.8],[30.5,47.4]], .7),
  ], [water('Dnipro', [[31.4,49.6],[33.0,49.2],[35.0,48.5],[35.2,47.8],[33.8,47.0]], 55)]),
  vistula: profile('vistula', 'Vistula–Oder lowlands and loess belt', [
    habitat('Vistula and Bug terraces', [[18.3,53.4],[20.2,53.8],[22.5,53.1],[24.0,51.6],[22.1,50.1],[20.0,50.2],[18.4,51.3]], 1.15),
    habitat('Central European loess and open woodland', [[15.9,51.0],[17.0,52.5],[19.6,52.8],[20.2,51.4],[18.9,50.2],[17.1,50.1]], .8),
  ], [water('Vistula', [[19.0,50.1],[21.0,51.0],[21.0,52.3],[18.6,53.5]], 70), water('Oder', [[17.6,50.7],[16.8,51.7],[14.8,52.9]], 60)]),
  altai: profile('altai', 'Minusinsk and upper Yenisei foothill basins', [
    habitat('Minusinsk basin terraces', [[89.7,55.3],[91.0,55.7],[92.5,54.8],[92.7,53.6],[91.7,52.4],[90.4,52.8],[89.8,54.0]], 1.1),
    habitat('Western Sayan lower foothills', [[89.2,53.3],[90.5,53.7],[91.4,53.0],[91.2,52.2],[89.9,51.8],[89.0,52.4]], .65, 'lower foothill pasture and watered valleys; mountain crests excluded'),
  ], [water('Upper Yenisei', [[91.2,52.3],[91.7,53.3],[91.5,54.5],[91.3,55.2]], 45)]),
  dzungaria: profile('dzungaria', 'Dzungarian basin watered northern and western margins', [
    habitat('Black Irtysh and northern basin margin', [[83.8,47.9],[86.7,48.2],[89.0,47.4],[88.4,46.3],[86.1,46.0],[84.7,46.7]], 1.0),
    habitat('Bortala and western piedmont', [[81.3,45.8],[83.2,46.5],[85.3,46.1],[85.6,44.9],[83.4,44.5],[81.8,44.9]], .8, 'piedmont streams and seasonal pasture; central desert omitted'),
  ], [water('Black Irtysh', [[89.2,47.2],[86.5,47.7],[84.8,47.5]], 55)]),
  tarimEast: profile('tarim-east', 'Eastern Tarim and Bosten–Konqi oasis margins', [
    habitat('Bosten–Konqi watered margin', [[85.3,42.2],[87.0,42.4],[88.4,41.7],[88.0,40.6],[86.5,40.4],[85.6,41.1]], 1.1, 'oasis and river-edge corridors; central Taklamakan excluded'),
    habitat('Lower Tarim historical corridor envelope', [[86.8,40.9],[88.3,41.1],[89.0,40.3],[88.6,39.8],[87.2,40.0],[86.4,40.5]], .6, 'reconstructed palaeoriver contact envelope, not modern irrigated land'),
  ], [water('Konqi / lower Tarim reference', [[86.9,41.8],[86.9,41.2],[87.5,40.6],[88.2,40.2]], 30)]),
  tarimNorth: profile('tarim-north', 'Northern Tarim oasis chain and Tian Shan piedmont', [
    habitat('Kuqa–Aksu piedmont oasis chain', [[79.6,41.9],[81.5,42.2],[84.2,42.2],[85.6,41.8],[85.1,41.1],[82.9,41.0],[80.6,41.2]], 1.1, 'alluvial fan and oasis margins below the Tian Shan; desert interior excluded'),
  ], [water('Northern Tarim tributary fans', [[80.4,41.5],[82.0,41.5],[83.5,41.7],[85.0,41.6]], 30)]),
  middleVolga: profile('middle-volga', 'Middle Volga–Kama forest terraces', [
    habitat('Volga bend and tributary terraces', [[43.0,56.5],[45.2,57.0],[48.0,56.9],[49.1,55.7],[47.5,54.9],[45.3,55.2],[43.6,55.5]], 1.15),
    habitat('Kama and forest-steppe contact', [[47.2,57.0],[49.0,57.3],[50.2,56.5],[49.1,55.7],[47.4,55.8],[46.6,56.4]], .75),
  ], [water('Middle Volga', [[43.2,56.3],[46.0,56.3],[48.4,55.8],[49.0,55.2]], 65)]),
  volgaUral: profile('volga-ural', 'Samara–Volga and western Ural forest-steppe', [
    habitat('Samara and upper Ural pastoral lowlands', [[48.3,53.5],[50.2,54.3],[53.6,53.8],[55.0,52.7],[53.3,51.0],[50.7,50.5],[49.0,51.7]], 1.0),
  ], [water('Samara tributaries', [[49.8,53.2],[52.0,53.0],[54.2,52.5]], 65)]),
  sintashta: profile('sintashta', 'Southern Trans-Ural tributary and foothill network', [
    habitat('Ural–Tobol tributary valleys', [[58.3,53.8],[59.7,54.2],[61.5,53.9],[62.2,52.6],[61.0,51.6],[59.5,51.7],[58.8,52.5]], 1.15, 'watered steppe terraces and low foothills around the fortified-settlement horizon'),
    habitat('Southern river-pasture contact', [[59.0,52.0],[60.4,52.5],[61.6,52.0],[61.2,51.2],[59.8,51.0],[58.9,51.5]], .65),
  ], [water('Sintashta / Karagaily tributary reference', [[59.4,53.5],[60.0,52.8],[60.6,52.0],[61.0,51.5]], 40)]),
  centralSteppe: profile('central-steppe', 'Turgai–Saryarka watered steppe corridors', [
    habitat('Turgai and central steppe drainage', [[63.1,50.6],[65.7,51.3],[68.6,50.6],[69.7,49.0],[68.8,47.5],[66.8,47.1],[64.3,48.0]], 1.0, 'seasonal river valleys and pasture patches, with dry interfluves downweighted'),
    habitat('Sarysu northern tributary pasture', [[65.0,48.7],[67.3,49.2],[69.5,48.5],[69.2,46.7],[67.0,46.1],[65.5,47.1]], .7),
  ], [water('Turgai / Sarysu reference', [[65.0,50.4],[65.6,49.5],[67.2,48.4],[68.0,47.2]], 85)]),
  tianShan: profile('tian-shan', 'Ili and eastern Tian Shan piedmont valleys', [
    habitat('Ili–Tekes and piedmont terraces', [[78.2,44.5],[80.2,45.1],[82.8,44.8],[84.4,43.7],[83.0,42.7],[80.5,42.8],[79.2,43.3]], 1.0, 'river-fed valley floors and lower piedmont; high Tian Shan crests omitted'),
  ], [water('Ili', [[78.5,44.0],[80.5,43.9],[82.8,43.7]], 45)]),
  tuva: profile('tuva', 'Tuva and upper Yenisei intermontane basins', [
    habitat('Tuva basin and tributary pasture', [[91.1,52.4],[93.0,52.6],[95.4,52.1],[96.4,51.3],[95.0,50.4],[92.8,50.2],[91.3,51.0]], 1.0, 'watered basin floors and lower foothill pasture, not surrounding alpine terrain'),
  ], [water('Upper Yenisei / Tuva', [[91.8,51.4],[93.3,51.7],[94.8,51.6],[95.8,51.0]], 45)]),
  bmac: profile('bmac', 'Murghab oasis and Kopet Dag piedmont contact', [
    habitat('Murghab alluvial fan', [[61.0,38.4],[62.0,38.7],[63.0,38.0],[62.9,37.1],[61.8,36.8],[61.0,37.5]], 1.2, 'Murghab irrigation/oasis envelope; Karakum interior excluded'),
    habitat('Kopet Dag northern piedmont', [[58.6,38.6],[60.0,38.7],[61.3,38.1],[60.8,37.4],[59.1,37.3],[58.2,37.9]], .55, 'piedmont water access and oasis chain'),
  ], [water('Murghab', [[62.5,36.9],[62.2,37.6],[62.1,38.3]], 35)]),
  oasisInterface: profile('oasis-interface', 'Zarafshan–Qashqadarya oasis and steppe margins', [
    habitat('Zarafshan oasis terraces', [[63.0,40.1],[64.8,40.4],[66.8,39.9],[67.3,39.2],[65.7,38.7],[63.7,38.9]], 1.15, 'river-fed oasis and adjacent steppe margin; Kyzylkum interior excluded'),
    habitat('Qashqadarya lower piedmont', [[64.6,39.2],[66.4,39.4],[67.2,38.6],[66.0,37.9],[64.6,38.1],[63.8,38.7]], .75),
  ], [water('Zarafshan', [[63.5,39.7],[65.0,39.8],[66.8,39.5]], 40)]),
  punjab: profile('punjab', 'Punjab river terraces and upper Indus receptor', [
    habitat('Chenab–Ravi–Sutlej interfluves', [[71.2,33.1],[73.1,33.5],[75.6,32.3],[76.2,30.5],[74.9,29.6],[72.6,30.0],[71.4,31.2]], 1.1, 'alluvial terraces and cultivable interfluves; Thar interior omitted'),
    habitat('Upper Indus tributary approaches', [[70.9,33.4],[72.1,34.0],[73.8,33.5],[74.6,32.4],[73.1,32.0],[71.5,32.5]], .65),
  ], [water('Punjab rivers', [[72.3,32.9],[73.2,32.2],[74.2,31.3],[75.0,30.4]], 65)]),
  ganges: profile('ganges', 'Upper and middle Ganges alluvial terraces', [
    habitat('Ganges–Yamuna and Awadh plain', [[77.0,28.6],[79.0,29.0],[81.6,28.0],[83.5,26.7],[82.4,25.3],[80.1,25.5],[78.2,26.7]], 1.1, 'alluvial terraces above active flood channels; Himalayan mountains excluded'),
  ], [water('Ganges plain reference', [[77.8,28.0],[79.5,27.1],[81.1,26.3],[82.8,25.9]], 75)]),
  nuristan: profile('nuristan', 'Kunar and Hindu Kush southern valleys', [
    habitat('Kunar and adjoining lower valleys', [[69.7,36.3],[70.7,36.5],[71.7,35.8],[71.6,34.7],[70.7,34.2],[69.8,35.0]], 1.0, 'narrow inhabited valley corridors; surrounding high mountain mass excluded'),
  ], [water('Kunar reference', [[71.2,36.0],[71.0,35.5],[70.8,34.8]], 25)]),
  khorasan: profile('khorasan', 'Khorasan northern foothill and oasis chain', [
    habitat('Atrek–Kashaf Rud foothills', [[55.0,37.5],[57.4,37.8],[60.1,37.0],[60.7,36.0],[59.0,35.3],[56.8,35.8],[55.0,36.5]], 1.0, 'foothill streams and connected oases, excluding central Iranian deserts'),
  ], [water('Kashaf Rud / Atrek reference', [[56.0,37.0],[58.0,36.7],[59.5,36.2]], 50)]),
  zagros: profile('zagros', 'Zagros intermontane and foothill valleys', [
    habitat('Central Zagros watered valleys', [[46.7,35.2],[48.3,35.5],[49.9,34.4],[50.5,32.7],[49.4,31.6],[48.1,32.4],[47.4,33.7]], 1.0, 'watered foothill valleys and intermontane cultivation; high ridges downweighted'),
  ], [water('Central Zagros valley reference', [[47.8,34.8],[48.4,34.0],[49.0,33.2],[49.6,32.4]], 35)]),
  mitanni: profile('mitanni', 'Upper Habur and northern Mesopotamian plains', [
    habitat('Habur–Balikh cultivated plains', [[38.8,37.4],[40.4,37.7],[42.0,37.0],[42.2,36.0],[40.7,35.6],[39.3,36.2]], 1.0),
  ], [water('Upper Habur', [[40.1,37.0],[40.5,36.4],[40.8,35.9]], 45)]),
  westSteppe: profile('west-steppe', 'Don–Volga western steppe tributary plains', [
    habitat('Don–Volga forest-steppe and pasture', [[39.8,50.7],[42.0,51.0],[45.0,50.3],[46.5,49.1],[45.5,47.8],[43.0,47.6],[41.0,48.4]], 1.0),
  ], [water('Don tributary network', [[40.8,50.4],[42.0,49.5],[43.2,48.3],[44.5,48.5]], 80)]),
  caucasusNorth: profile('caucasus-north', 'North Caucasus lower foothill corridor', [
    habitat('Kuban–Terek lower foothills', [[37.3,45.9],[39.8,46.0],[43.0,45.4],[45.5,44.3],[45.0,43.2],[42.1,43.4],[39.0,44.3]], 1.0, 'lower foothill terraces and river corridors; main Caucasus crest omitted'),
  ], [water('North Caucasus foothill reference', [[38.5,45.0],[40.5,44.6],[42.5,44.4],[44.5,43.8]], 40)]),
  armenia: profile('armenia', 'Arax–Ararat and Armenian basin terraces', [
    habitat('Ararat and Arax basin', [[42.9,40.8],[44.0,41.1],[45.6,40.6],[45.8,39.7],[44.6,39.2],[43.3,39.6]], 1.1, 'intermontane river terraces and lower volcanic plateau basins'),
  ], [water('Arax basin reference', [[43.3,40.1],[44.3,40.0],[45.3,39.8]], 35)]),
  anatolia: profile('anatolia', 'Central Anatolian river and basin margins', [
    habitat('Kızılırmak and central plateau basins', [[30.8,40.2],[32.8,40.8],[35.2,40.1],[36.1,38.8],[34.8,37.9],[32.7,38.1],[31.0,39.0]], 1.0, 'river terraces and cultivable basin margins; salt-lake and arid basin centres omitted'),
  ], [water('Kızılırmak reference', [[32.9,40.1],[34.0,39.8],[34.9,39.3],[34.3,38.7]], 60)], [
    [[32.7,38.7],[33.4,38.7],[33.8,39.2],[33.3,39.5],[32.7,39.2]],
  ]),
  danube: profile('danube', 'Lower Danube and Morava lowland approaches', [
    habitat('Danube–Morava lowlands', [[20.5,45.1],[22.4,45.6],[25.5,45.2],[26.3,44.2],[24.6,43.2],[22.8,42.9],[21.1,43.8]], 1.0),
  ], [water('Lower Danube', [[20.5,44.8],[22.3,44.6],[24.1,43.8],[26.0,44.2]], 55)]),
  westBalkans: profile('west-balkans', 'Western Balkan valleys and coastal hinterland', [
    habitat('Drin–Shkumbin and upland basins', [[18.7,43.0],[19.9,43.4],[21.0,42.3],[20.8,41.0],[19.8,40.4],[19.1,41.6]], 1.0, 'river valleys and sheltered foothill basins; Dinaric crests excluded'),
  ], [water('Drin and adjoining valleys', [[20.3,42.5],[20.1,41.8],[19.7,41.2]], 28)]),
  dalmatia: profile('dalmatia', 'Dalmatian river valleys and Dinaric foothill basins', [
    habitat('Sava-facing and Adriatic-facing valley patches', [[14.8,45.6],[16.6,45.8],[18.1,44.6],[18.0,43.2],[16.7,42.7],[15.7,43.5],[15.1,44.6]], 1.0, 'valley basins and coastal hinterland rather than a filled mountain disk'),
  ], [water('Krka–Neretva and basin reference', [[15.5,44.5],[16.3,43.9],[17.3,43.4]], 35)]),
  greece: profile('greece', 'Thessaly, Boeotia and southern Greek basins', [
    habitat('Thessalian and Boeotian plains', [[21.0,40.0],[22.4,40.5],[23.7,39.4],[24.0,38.2],[22.8,37.7],[21.5,38.4]], 1.0, 'separate lowland basins and valley approaches; main Pindus uplands downweighted'),
  ], [water('Greek basin reference', [[22.0,39.6],[22.5,38.9],[23.0,38.3]], 40)]),
  bohemia: profile('bohemia', 'Bohemian–Moravian basins and Danubian approaches', [
    habitat('Bohemian basin and Moravian gate', [[12.4,50.3],[14.4,51.0],[16.6,50.7],[17.8,49.4],[16.7,48.4],[14.7,48.2],[13.0,49.0]], 1.0, 'Elbe/Morava and adjoining loess basins, below surrounding mountain rims'),
  ], [water('Elbe–Morava basin reference', [[13.9,50.3],[15.1,49.7],[16.6,49.1]], 60)]),
  rhine: profile('rhine', 'Rhine–Main–Neckar lowland mosaic', [
    habitat('Rhine and tributary terraces', [[5.5,50.0],[7.4,50.9],[10.2,50.3],[10.7,48.8],[9.0,47.8],[7.2,47.9],[6.1,48.8]], 1.0),
  ], [water('Rhine–Main', [[7.6,48.1],[8.1,49.0],[8.4,50.0],[9.7,50.0]], 60)]),
  france: profile('france', 'Saône, Burgundy and Seine basin margins', [
    habitat('Saône–Seine basin mosaic', [[1.0,48.3],[3.2,49.0],[5.5,48.5],[6.4,47.1],[5.2,45.8],[3.0,45.8],[1.6,46.9]], 1.0),
  ], [water('Saône / upper Seine reference', [[2.5,48.2],[4.2,47.6],[4.8,46.6]], 70)]),
  britain: profile('britain', 'Southern and eastern British lowlands', [
    habitat('Thames–Severn and Wessex lowlands', [[-3.2,52.3],[-1.6,52.8],[.5,52.2],[1.3,51.3],[-.2,50.6],[-2.3,50.7],[-3.0,51.3]], 1.0),
    habitat('East Anglian lowland', [[-.7,53.1],[.7,53.2],[1.6,52.7],[1.4,51.8],[.3,51.6],[-.6,52.1]], .8),
  ], [water('Thames and Severn reference', [[-2.4,51.6],[-1.1,51.7],[.2,51.5]], 50)]),
  iberia: profile('iberia', 'Douro and upper Ebro plateau valleys', [
    habitat('Douro–Meseta river terraces', [[-6.2,42.1],[-4.4,42.7],[-2.4,42.2],[-1.4,41.1],[-2.9,40.0],[-5.0,40.2],[-6.0,41.0]], 1.0, 'river terraces and cultivable plateau basins, not the entire interior plateau'),
  ], [water('Douro reference', [[-5.8,41.5],[-4.3,41.6],[-2.8,41.4]], 60)]),
  northItaly: profile('north-italy', 'Po–Ticino and southern Alpine piedmont', [
    habitat('Po–Ticino plain and lower piedmont', [[7.0,45.6],[8.4,46.1],[10.7,45.8],[11.5,45.0],[10.0,44.5],[8.0,44.7],[7.2,45.0]], 1.0, 'alluvial lowlands and lower piedmont; high Alpine crest omitted'),
  ], [water('Po–Ticino reference', [[7.7,45.3],[8.8,45.2],[10.5,45.0]], 45)]),
  centralItaly: profile('central-italy', 'Central Italian river basins and coastal plains', [
    habitat('Tiber and Tyrrhenian lowlands', [[11.3,43.0],[12.6,43.4],[13.7,42.3],[14.0,41.1],[12.7,40.8],[11.7,41.8]], 1.0, 'Tiber tributaries, lower valleys and coastal plain patches'),
  ], [water('Tiber', [[12.3,43.0],[12.4,42.3],[12.5,41.9]], 35)]),
  baltic: profile('baltic', 'Neman–Daugava forest terraces and Baltic lowlands', [
    habitat('Neman and southern Baltic forest terraces', [[22.7,55.3],[24.5,56.0],[27.2,55.7],[28.1,54.5],[26.5,53.4],[24.3,53.5],[23.2,54.3]], 1.0),
    habitat('Daugava lower terraces', [[23.0,57.3],[25.1,57.8],[27.7,57.0],[27.0,55.8],[25.0,55.9],[23.6,56.3]], .75),
  ], [water('Neman–Daugava reference', [[24.0,54.6],[25.6,54.8],[26.8,55.4],[25.8,56.8]], 60)]),
  sweden: profile('sweden', 'Southern Swedish lake, coast and river lowlands', [
    habitat('Götaland and Swedish lake lowlands', [[12.5,58.5],[14.0,59.8],[16.6,60.1],[18.0,59.0],[17.0,57.3],[15.2,56.5],[13.2,57.1]], 1.0, 'lake margins, river valleys and cultivable lowlands; interior uplands downweighted'),
  ], [water('Götaland lake-basin reference', [[13.1,58.4],[14.9,58.2],[16.4,58.8]], 55)]),
  scania: profile('scania', 'Jutland, Danish islands and Scanian lowlands', [
    habitat('Jutland eastern lowlands', [[8.6,56.9],[9.8,57.4],[10.9,56.4],[10.4,55.2],[9.3,54.7],[8.6,55.7]], .8, 'sheltered coast, river and arable lowlands'),
    habitat('Danish islands and Scania', [[10.1,56.1],[12.0,56.4],[14.4,57.1],[15.0,56.0],[13.4,55.3],[11.7,55.1],[10.4,55.4]], 1.0),
  ], [water('Danish–Scanian lowland reference', [[10.0,55.8],[12.1,55.7],[13.7,55.9]], 50)]),
  germany: profile('germany', 'North German and Oder–Elbe lowland river basins', [
    habitat('Elbe–Oder and northern lowlands', [[8.3,53.8],[10.8,54.4],[13.6,54.2],[16.3,53.4],[16.2,51.8],[14.2,51.1],[11.5,51.2],[9.0,52.0]], 1.0),
  ], [water('Elbe–Oder reference', [[10.0,53.2],[11.8,52.8],[13.8,52.4],[15.0,52.3]], 75)]),
  norway: profile('norway', 'Østlandet and Gudbrandsdal valley/shore patches', [
    habitat('Oslo–Mjøsa lowlands', [[9.1,61.4],[10.6,61.6],[11.9,60.8],[11.6,59.7],[10.5,59.2],[9.1,60.0]], 1.0, 'lake margins and valleys below the southern Norwegian uplands'),
    habitat('Upper valley pasture approaches', [[7.3,61.8],[8.6,62.0],[9.8,61.2],[9.7,60.3],[8.4,59.8],[7.6,60.7]], .55, 'connected valley and lower foothill patches; upland mass not filled'),
  ], [water('Gudbrandsdal–Mjøsa reference', [[8.5,61.5],[9.8,61.0],[10.5,60.5],[10.7,59.9]], 30)]),
  slavicCore: profile('slavic-core', 'Dnieper–Pripyat terraces and forest-steppe margins', [
    habitat('Dnieper and Desna terraces', [[28.6,53.2],[30.6,53.8],[32.7,52.7],[33.2,51.0],[31.0,49.9],[28.8,50.4],[28.2,51.7]], 1.1),
    habitat('Volhynian and Pripyat southern terrace belt', [[24.0,51.3],[25.9,52.0],[28.2,51.5],[29.2,50.4],[27.6,49.5],[25.4,50.0]], .8),
  ], [water('Dnieper–Pripyat reference', [[25.5,51.4],[27.4,51.6],[29.5,51.4],[30.6,51.2],[31.5,52.4]], 55)], [
    [[25.7,52.0],[27.1,52.5],[28.8,52.3],[28.6,51.8],[27.0,51.7]],
  ]),
  volgaOka: profile('volga-oka', 'Volga–Oka forest river terraces', [
    habitat('Oka and upper Volga network', [[35.4,56.6],[37.5,57.3],[40.7,56.9],[42.3,55.7],[41.0,54.6],[38.8,54.4],[36.1,55.2]], 1.0),
  ], [water('Oka–Volga reference', [[36.4,55.3],[38.6,55.5],[40.6,55.6],[41.2,56.3]], 65)]),
  slavicBorderlands: profile('slavic-borderlands', 'Volhynian–Bug and southern Pripyat terrace belt', [
    habitat('Western forest-steppe and southern Pripyat terraces', [[22.3,50.6],[24,51.4],[26.3,51.8],[28,51.3],[27,50.2],[25,49.4],[23,49.6]], 1),
  ], [water('Bug–Pripyat southern terrace belt', [[23.6,50.4],[24.1,51],[25.6,51.4],[27.6,51.3]], 40)], [
    [[25.7,52.0],[27.1,52.5],[28.8,52.3],[28.6,51.8],[27.0,51.7]],
  ]),
};

function choose([lon, lat], id) {
  // Endpoint selection follows the supplied geographic reference, while labels
  // and every envelope stay reproducible in the generated footprint metadata.
  if (lon >= 22 && lon < 26 && lat >= 49 && lat < 53.2
    && (id === 'SLAVIC-CORE' || /^SLA-.*-origin$/.test(id) || /^SLAVIC-SEED-destination$/.test(id))) return 'slavicBorderlands';
  if (lon < 2 && lat > 48) return 'britain';
  if (lon < 0 && lat < 45) return 'iberia';
  if (lon < 7 && lat > 43 && lat < 50) return 'france';
  if (lon < 12 && lat >= 47 && lat < 51.2) return 'rhine';
  if (lon < 12 && lat >= 43 && lat < 47) return 'northItaly';
  if (lon < 15 && lat < 44 && lon > 9) return 'centralItaly';
  if (lon < 13 && lat >= 59) return 'norway';
  if (lon >= 8 && lon < 16 && lat >= 54.6 && lat < 57.4) return 'scania';
  if (lon < 20 && lat >= 56.3) return 'sweden';
  if (lon < 18 && lat >= 51) return 'germany';
  if (lon < 19 && lat >= 47 && lat < 51) return 'bohemia';
  if (lon < 19 && lat >= 42.5 && lat < 47) return 'dalmatia';
  if (lon < 22 && lat >= 40 && lat < 44) return 'westBalkans';
  if (lon < 25 && lat < 41) return 'greece';
  if (lon < 28 && lat >= 42 && lat < 47) return 'danube';
  if (lon < 29 && lat >= 53.3) return 'baltic';
  if (lon < 25 && lat >= 47) return 'vistula';
  if (lon >= 24 && lon < 33.5 && lat >= 49.5) return 'slavicCore';
  if (lon >= 29 && lon < 37 && lat >= 45 && lat < 50) return 'dnipro';
  if (lon >= 30 && lon < 38 && lat < 42) return 'anatolia';
  if (lon >= 37 && lon < 43 && lat >= 34.5 && lat < 39) return 'mitanni';
  if (lon >= 42 && lon < 47 && lat < 42) return 'armenia';
  if (lon >= 36 && lon < 47 && lat >= 42 && lat < 46.2) return 'caucasusNorth';
  if (lon >= 37 && lon < 48 && lat >= 48.9 && lat < 53) return 'westSteppe';
  if ((id === 'CLV' || lon >= 43) && lon < 49 && lat >= 46.2 && lat < 49.5) return 'clv';
  if (lon >= 37 && lon < 48 && lat >= 46 && lat < 53) return 'westSteppe';
  if (lon >= 33 && lon < 43 && lat >= 53) return 'volgaOka';
  if (lon >= 42 && lon < 51 && lat >= 54.5) return 'middleVolga';
  if (lon >= 48 && lon < 57 && lat >= 49 && lat < 55) return 'volgaUral';
  if (lon >= 57 && lon < 64 && lat >= 50) return 'sintashta';
  if (lon >= 62 && lon < 73 && lat >= 44) return 'centralSteppe';
  if (lon >= 47 && lon < 55 && lat < 37) return 'zagros';
  if (lon >= 54 && lon < 61 && lat >= 33 && lat < 39) return 'khorasan';
  if (lon >= 58 && lon < 64 && lat >= 35 && lat < 38.5) return 'bmac';
  if (lon >= 61 && lon < 69 && lat >= 37.8 && lat < 43) return 'oasisInterface';
  if (lon >= 68 && lon < 73 && lat >= 34 && lat < 38) return 'nuristan';
  if (lon >= 69 && lon < 77 && lat >= 28 && lat < 34) return 'punjab';
  if (lon >= 76 && lon < 87 && lat >= 23 && lat < 31) return 'ganges';
  if (lon >= 78 && lon < 86 && lat >= 42.3 && lat < 46) return 'tianShan';
  if (lon >= 80 && lon < 91 && lat >= 44 && lat < 50) return 'dzungaria';
  if (lon >= 79 && lon < 85.5 && lat >= 39 && lat < 42.4) return 'tarimNorth';
  if (lon >= 85 && lon < 91 && lat >= 38 && lat < 44) return 'tarimEast';
  if (lon >= 89 && lon < 97 && lat >= 52.5) return 'altai';
  if (lon >= 89 && lon < 99 && lat >= 48.5) return 'tuva';
  throw new RangeError(`No declared Indo-European habitat profile for ${id} at ${lon},${lat}`);
}

export function sampleIndoeuropeanLandscape(coord, id, count = 256) {
  if (!Array.isArray(coord) || coord.length !== 2 || !coord.every(Number.isFinite) || Math.abs(coord[0]) > 180 || Math.abs(coord[1]) > 85) throw new TypeError('Finite longitude/latitude reference required');
  if (!Number.isInteger(count) || count < 1 || count > 10000) throw new RangeError('count must be an integer from 1 to 10000');
  const key = choose(coord, id);
  return sampleResourceDispersal(INDOEUROPEAN_LANDSCAPES[key], coord, id, count);
}
