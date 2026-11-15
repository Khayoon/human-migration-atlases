# Indo-European migration atlas: sources and methodology

This atlas animates a reconstruction of population movements associated with Indo-European language dispersals from **4500 BCE to 1000 CE**. It keeps archaeological cultures, genetic ancestry and language affiliation separate. A genetic similarity is evidence about ancestry; it does not identify the language an individual spoke. A reconstructed route is a way to connect the evidence geographically, not an excavated itinerary.

The default view uses the eastern Anatolian entry, eastern Knovíz–Urnfield Celtic dispersal and Ukraine/southern Belarus Slavic-origin scenarios. Seven alternative combinations can be selected. The displayed people are explicit population scenarios, not recovered prehistoric censuses.

This document describes the **15 November 2026 visible-travel and regional-spread edition**. Its matching export is `Indo-European-Atlas-4500BCE-1000CE-visible-travel-regional-spread-2026-11-15T18-07-33Z.mp4`: **118.041667 seconds, 1920 × 1080, 24 fps**. Older 150/40-year-per-second exports and static destination clouds do not describe this edition.

## 1. What the evidence actually contains

The immediate input is an unattributed, user-supplied synthesis titled *Animated Migration Atlas of the Indo-European Language Family: Dispersal Vectors, Archaeogenetic Horizons, and Demographic Specifications* (**REPORT**). Its author, publication venue, date and external identifier were not supplied. The retained original is 88,295 bytes; SHA-256: `a4f6482b5244421096b23297946ffa9b3e9aa244acea29b88398c457ce1eb64d`. The original text and full private history are designated for the private archive. The current local working app also serves the raw research; this document does not itself implement the public/private packaging boundary. This public explanation gives citations, model assumptions and traceable record IDs without reproducing that entire research file.

The normalized register has **28 records**. Every record currently points to `REPORT`, retains source wording where applicable and leaves historical population unknown (`null`). `ITA-1.originalWording` is an editorial description of a model-only gap, not a verbatim source excerpt. Most have the status `supplied-prose-extraction-unreviewed`; the Okunev conflict is retained as context and the added Italic vector is explicitly model-only. The structured source catalogue contains `REPORT` and six linked papers. References to other works occur in the prose without a complete bibliography. The expanded catalogue below supplies documentation-only reference IDs for those leads; it does **not** pretend that the existing JSON already has paper-by-paper claim attribution.

The evidence has different counting and temporal meanings:

| Evidence type | How this atlas treats it | Example |
| --- | --- | --- |
| Reported movement inferred by a study | Retain the study's geographic and chronological scope; reconstruct the animation within a broad window | CLV/North Pontic formation; early medieval Slavic-associated ancestry changes |
| Dated presence or sample | Keep it as an observation at that date, not the arrival date of a whole people | Medvyn 700–600 BCE; sampled Xiaohe individuals |
| Written linguistic attestation | Evidence that words, names or a language are attested; no automatic migrant headcount or complete route | Mitanni Indo-Aryan names and horse-training vocabulary; Anatolian language attestations described in the synthesis |
| Archaeological horizon | A material-cultural association, not a language census | Corded Ware, Sintashta–Petrovka, Andronovo, Knovíz–Urnfield |
| Linguistic reconstruction | A hypothesis about relationships, contacts or relative sequence | Proto-Indo-Iranian; competing Anatolian and Celtic dispersals |
| Tradition, ethnonym or political context | Retain as context unless separately supported as movement | Proposed Kassite, Wusun/Yuezhi and fragmentary-language connections |
| Atlas reconstruction | Explicit display interval, path, population allocation or footprint | Italic route; Nuristani headcount; river-bank settlement positions |

The raw `temporal_type` field is coarser than this table: many mixed records are labelled `reconstructed_movement`. That label does not make every statement within their original wording a documented migration. Strong source wording such as “validated”, “resolved” or “refutes” is retained in the private evidence; it is not an independent endorsement by the atlas.

### Record-to-claim guide

The following is a documentation guide to the current register, not a replacement source register. The reference associations are editorial cross-references to the bibliography, rather than newly asserted independent verification of every sentence.

| Record | Subject | Retained date label | Treatment / reference leads |
| --- | --- | --- | --- |
| PIA-0A | CLV and North Pontic formation | 4400–3350 BCE; expansion 3300 BCE | Broad reconstructed movement/presence context. CLV2025 |
| PIA-0B | Southern Arc / Hybrid alternative | 5000–3000 BCE or 6120–5000 BCE | Alternative, nonadditive. Southern Arc / hybrid-root leads below |
| ANA-1A | Anatolian eastern entry | 4400–3000 BCE | Broad reconstructed movement/presence context. CLV2025 |
| ANA-1B | Anatolian western alternative | 4500–3200 BCE | Alternative, nonadditive. CLV2025; Parpola / Nikitin leads |
| TOC-1A | Afanasievo eastward dispersal | 3300–2500 BCE | Broad reconstructed movement/presence context. TARIM2021; additional Siberian/Xinjiang leads |
| TOC-1B | Dzungaria, Chemurchek and Tarim edge | 3000–1500 BCE | Broad reconstructed movement/presence context. TARIM2021; Kumar lead; TOC-1B conflict |
| CWC-1 | Corded Ware horizon | 3000–2350 BCE | Broad reconstructed movement/presence context. Papac / Saag leads |
| II-1A | Fatyanovo–Balanovo / Abashevo | 2900–1900 BCE | Broad reconstructed movement/presence context. Saag / Engovatova / Mednikova leads |
| II-1B | Sintashta–Petrovka | 2100–1800 BCE | Broad reconstructed movement/presence context. Sintashta and Indo-Iranian leads |
| II-2 | Andronovo radiation | 2000–1000 BCE | Broad reconstructed movement/presence context. Andronovo / Indo-Iranian leads |
| II-3A | Mitanni elite and Inner Asian proposals | 1800–1300 BCE | Broad reconstructed movement/presence context. Narasimhan / Parpola / primary-text leads |
| II-3B | Indo-Aryan South Asian dispersal | 1900–500 BCE | Broad reconstructed movement/presence context. Narasimhan / Parpola / Witzel leads |
| II-3C | Nuristani | 2nd millennium BCE | Broad reconstructed movement/presence context. Unresolved Nuristani relationship; REPORT |
| II-4A | Iranian plateau dispersal | 1500–800 BCE | Broad reconstructed movement/presence context. Indo-Iranian and written-presence leads |
| II-4B | Eastern Saka and western Scythian / Sarmatian | 9th/7th c. BCE–2nd c. CE | Broad reconstructed movement/presence context. Kumar / Andreeva leads |
| GRE-1 | Greek and Phrygian | 3000–1000 BCE | Broad reconstructed movement/presence context. Southern Arc lead |
| ARM-1 | Armenian | c. 2579–1000 BCE | Broad reconstructed movement/presence context. Southern Arc and Hovhannisyan leads |
| ALB-1 | Paleo-Balkan and Albanian continuity | 3000–2000 BCE; founder c. 500 CE | Broad reconstructed movement/presence context. BALKANS2023; Davranoglou lead |
| CEL-1A | Knovíz–Urnfield Celtic expansion | 3200–2500 BP | Broad reconstructed movement/presence context. CELTIC2026 |
| CEL-1B | Celtic centre / Beaker alternative | 2900–600 BCE | Alternative, nonadditive. CELTIC2026; earlier alternatives in REPORT |
| GER-1A | Baltic-linked Scandinavian vector | 4000–3500 BP | Broad reconstructed movement/presence context. GERMANIC2026 |
| GER-1B | Germanic southward expansion | By 1650 BP; Migration Period 375–575 CE | Broad reconstructed movement/presence context. GERMANIC2026 |
| GER-1C | Germanic return and Old Norse | 1575–1375 BP | Broad reconstructed movement/presence context. GERMANIC2026 |
| BSL-1 | Baltic forest-zone continuity | 2000–1500 BCE; presence past 1000 CE | Broad reconstructed movement/presence context. SLAVIC2025; Finnic/Baltic leads |
| SLA-1A | Slavic expansion | Presence 700–600 BCE; migration 6th–8th c. CE | Broad reconstructed movement/presence context. SLAVIC2025; BALKANS2023 |
| SLA-1B | Western Slavic origin alternative | 700 BCE–800 CE | Alternative, nonadditive. SLAVIC2025; unspecified commentary |
| CTX-OKUNEV | Okunev replacement in Minusinsk — source ID conflict | Middle Bronze Age | Context only. Unresolved code collision; context only |
| ITA-1 | Italic peninsular dispersal | 2nd–1st millennium BCE (reconstructed broad interval) | Model-only reconstruction. Model-only route/estimate; Italic prose context |

## 2. Chronology and route reconstruction

Dates use the app's numerical BCE/CE timeline: negative numbers label BCE and positive numbers label CE. Original textual dates remain available separately. There is no new radiocarbon calibration, sample re-dating or linguistic clock estimation in this preparation. Approximate dates, broad archaeological horizons, publication interpretations and exact-looking source dates remain different kinds of evidence. In particular, the supplied Armenian `2579 BCE` date must not be read as a witnessed departure or a surveyed crossing date.

Calibrated BP is conventionally measured before **1950 CE**. The supplied synthesis sometimes pairs BP with BCE values rounded using 2000, making a roughly fifty-year difference. The model retains the supplied broad BCE/CE equivalents and preserves the original labels; it does not silently claim exact BP-to-calendar conversion. The 2026 Germanic and Celtic studies' BP scales must be interpreted in their own methods.

Regional centroids in the report anchor reconstructed origins, broad stages and destinations. The prepared model supplies additional controls across land, river basins, mountain approaches and explicit sea crossings. Intermediate geometric nodes are not asserted historical settlements. Greek/Phrygian movement uses a Balkan approach; Armenian movement has a separate Caucasus approach. Baltic, North Sea, Channel and straits crossings are intentional mixed land/sea cases, not routing failures to be erased.

Departures are spread through retained movement windows. Display transit lengths are chosen to make cohort progression visible, then capped at **80% of the relevant movement window** so arrivals remain inside it. The first CLV and Dnipro components take 100 model years, and Anatolian entry takes 120. The current compiled default's travel lengths are about **80–167.309 model years**; the generator's nominal 100–220-year rule is subject to the window cap, so 220 is not an attained transit in this snapshot. These long transits represent **population-cohort progression across generations**, not measured individual journey times or lifetimes.

To fund downstream movement after lengthening incoming travel, release for `II-3A`, `II-3B` and `II-3C` starts at **1600 BCE**, within their retained broad windows. This is a visualization scheduling choice; source chronology and wording have not been rewritten to claim an exact departure then. The model therefore does not animate every proposed earlier “Proto-Dasa” or maryannu date as a separate observed migration.

Earlier Southern Arc/hybrid-root proposals remain in the evidence, including dates before 4500 BCE, but do not create another additive founder population inside the animation. Later Tocharian/Wusun attestations and post-1000 CE Baltic–Slavic assimilation remain context beyond the displayed range.

## 3. Geographic and environmental method

The sampler uses **modern Natural Earth land and river geometry plus manually declared regional resource networks**. It does not read elevation/slope rasters, landcover classifications, palaeoclimate, palaeovegetation, archaeological settlement-density grids or time-varying ancient shorelines. The hillshade and modern landcover visible on the basemap are visual context. “Resource/terrain-informed” here means declared river terraces, foothills, valleys, coast, pasture and oasis approaches; it is not a computed palaeoenvironmental or least-cost terrain model.

The retained land and river inputs are nominal **1:10 million cartographic scale**. Natural Earth's `10m` filename means that scale, **not ten-metre ground resolution**. Both use CRS84 longitude/latitude. Their original download URLs point to a mutable `master` branch; exact upstream release versions were not recorded. Their byte hashes are therefore the reproducible identities:

| Retained input | SHA-256 | Use |
| --- | --- | --- |
| `data/geography/natural-earth-land.source.geojson` | `1ac90796408bc6ad6911d69448485d3c4dbf2190370080368a09976e1c9f7416` | Modern land polygons |
| `data/geography/land-mask.json` | `1c7d1305a86fa96e26d97a9c6639a4d432884c64bcea336ef0279502fe9e75d6` | Derived regional mask: 1,049 polygons, 1,050 rings, 143,751 vertices |
| `data/geography/natural-earth-rivers.source.geojson` | `bb854a900ecbd3b408df46d5e16e3e0f974ba55993f9d8b5c26e855273c0905a` | 1,455 river/lake-centerline features; the IE resource builder selects river features |

**Coverage limitation:** this edition currently loads the retained regional land mask, not the optional global mask. Its preparation selects complete polygons intersecting `[-22, -16, 126, 52]`; it does not clip those polygons to that box. Mainland Eurasia therefore continues northward, but separate islands wholly north of 52° can be absent, including some Danish/Baltic islands. Preserved coast detail and dense numerical sampling do not remove that selection limitation. The 0.25° latitude bins in the mask code are a lookup index, not a raster resolution.

There are **44 named regional resource profiles**, 45 retained reference water/valley lines and six additional explicit branches for Jutland/Funen/Zealand/Scania, Greek and Kunar approaches. The builder selects modern river features by name/English alias inside declared regional bounds, omits lines shorter than 25 km and reduces them to approximately 20 km-spaced controls. Variable-width bank ribbons, with nominal regional half-widths of 11–35 km and additional resource branches, determine candidate locations. Branch-length weighting is a deterministic display heuristic, not measured archaeological population density. Candidate-array length is not a population estimate.

Mature terminal positions must be on retained land, inside an allowed resource ribbon and outside declared exclusions. There are manual exclusions for an Anatolian salt-basin area and a Pripyat wetland core reused in two Slavic profiles, plus generated channel-core ribbons with nominal 1.3 km half-width. This is a limited exclusion set, not a complete map of unsuitable mountains, deserts or ancient wetlands. Bank routing starts roughly 5 km from reference centerlines. A local movement path may cross a narrow channel reference as a reconstructed ford, even though settled endpoints avoid the channel core.

Aligned entry points, per-slot paths and mature points support continued settlement dispersal. Local-path checks require land endpoints, sample great-circle segments at 2 km spacing with zero coastal tolerance, and check linear intermediates against land and manual exclusions. These bounded tests do not prove every metre is dry, or that the route was usable at an ancient date. The polygon envelopes covering all entry/path/terminal positions are indexing/culling geometry; dots follow the resource networks rather than filling those envelopes.

Macro migration routes have a **different** check: the land-corridor helper normally uses 20 km controls, 1 km coastal tolerance, an 8 km endpoint allowance and a 0.04° A* grid. The IE macro-route report samples at 2 km with 1 km tolerance and rejects land routes with sampled water fragments over 6 km. Explicit maritime links are labelled `mixed`. They must not be described as having the stricter zero-water local-dispersal guarantee.

The renderer uses OpenFreeMap/OpenMapTiles/OpenStreetMap for modern map context and Mapzen/AWS Terrarium elevation tiles for hillshade. Neither live tile source is pinned to a historical snapshot. Six shared manual modern-reservoir masking boxes alter background lake drawing; they do not alter the population land mask or reconstruct ancient shorelines. Geographic input licences and provider attribution are catalogued below. UNESCO, GeoNames and populated-place datasets used by another atlas are not IE preparation inputs and are not inherited into this bibliography.

## 4. Population estimates and accounting

### Units and what is unknown

The default unit is **1,000 people per full dot**: 50,000 people means 50 full dots. A partly occupied slot can represent a smaller exact weight, including a last remainder or the growth of a new slot. Changing people per dot changes numerical resolution. The **2.4 dot magnification** changes visible radius only; it does not turn a 1,000-person dot into 2,400 people. Dark outlines (`#302d29`, width 0.8; minimum radius 2.1) help the dots remain visible at overview scale.

Every historical source population remains unknown in the register. The separate low/central/high values are **visualization scenarios**, not censuses, confidence intervals, aDNA sample counts, numbers of graves, language-speaker counts or totals of modern descendants. They mix founder, cumulative-flow and contemporaneous-settlement scopes; consequently, neither all table rows nor all route-leg totals can be summed into one historical population.

The supplied report proposes three numerical reference classes. Their use here needs qualifications:

1. **Sintashta settlement benchmark:** 23 towns × 200–700 inhabitants gives 4,600–16,100 simultaneous fortified-town residents, midpoint 10,350. The arithmetic is explicit; the underlying 23-town and occupancy estimates have not been independently established in this documentation pass. The separate 8,000/20,000/40,000 active-community scenario adds unfortified occupation and generational scope without a uniquely determined multiplier. It is not the same measurement.
2. **Founder and effective population:** the report discusses a small founder pool and suggests census/effective-population multipliers of 3–8. This edition does not estimate effective population from genomes or apply a measured, universal `Nc/Ne` ratio. The resulting 5,000/15,000/40,000 founder scenario is a chosen reference class, not an inference warranted by a Y-chromosome lineage count alone.
3. **Ancestry balancing:** the report gives `p = M / (M + L)`. This identity only translates an ancestry share to a headcount under strong assumptions about local population, equal contributions, survival and time. The app does not solve a validated demographic inverse problem from ancestry fractions. Its local receptor populations and allocations are declared display assumptions. Published ancestry proportions must not be read as the same percentage of language speakers, migrants or biological replacement everywhere.

No household/warrior-to-person conversion is used by the current IE ledger. The 80/20 founder split, 75/25 Corded Ware split, 10/90 Anatolian split and other branch shares below are specified model allocations. Some take inspiration from ancestry summaries, but they remain population-display assumptions.

### Complete visualization estimate register

Values below are people and come from the current `indoeuropean-dispersals.population.json`. Sequential transfers and their parent pools are shown together for traceability; they are not additional independent populations. Four default non-rendered alternative estimates (`PIA-0B`, `ANA-1B`, `CEL-1B`, `SLA-1B`) are retained for traceability; selectable replacements remain nonadditive. Rounding to whole people in this document removes only floating-point display artefacts.

| Estimate / transfer ID | Low | Central | High | Allocation / counting scope |
| --- | --- | --- | --- | --- |
| PIA-0A-CLV | 4,000 | 12,000 | 32,000 | 80% share of one 5k/15k/40k founder scenario. |
| PIA-0A-UNHG | 1,000 | 3,000 | 8,000 | 20% local share of the same founder scenario. |
| ANA-1A | 800 | 2,500 | 6,000 | 10% incoming share of 8k/25k/60k total; 90% local baseline 7200/22500/54000. ANA-1B replaces this entry. |
| TOC-1A | 3,000 | 10,000 | 25,000 | Afanasievo linguistic attribution is a hypothesis. |
| TOC-1B | 3,000 | 10,000 | 25,000 | Transfer of the same lineage; not another root. |
| TOC-1B-EDGE | 1,500 | 5,000 | 12,500 | Later MBA/LBA oasis interface, not Xiaohe EMBA origin. |
| TOC-1B-LOCAL | 1,500 | 5,000 | 12,500 | Local ANE-origin component enters only in later MBA/LBA contact. |
| CWC-1 | 30,000 | 90,000 | 225,000 | 75% allocation of shared CWC 40k/120k/300k; broad ancestry bookkeeping, not literal paternal descent. |
| CWC-1-EEF | 10,000 | 30,000 | 75,000 | 25% EEF incorporation into the same CWC total. |
| II-1A | 10,000 | 30,000 | 75,000 | Overlapping Fatyanovo and Abashevo phases share one pool. |
| II-1B | 6,000 | 15,000 | 30,000 | 75% Abashevo allocation, model choice, not measured ancestry. |
| II-1B-LOCAL | 2,000 | 5,000 | 10,000 | 25% local allocation; towns benchmark 23×200–700 remains separate. |
| II-2 | 8,000 | 20,000 | 40,000 | 100% of Sintashta scenario passes to Andronovo at horizon end. |
| II-2-EAST | 5,000 | 15,000 | 40,000 | Descendant split, not another steppe founder pool. |
| II-2-SOUTH | 20,000 | 65,000 | 160,000 | Shared contact stock grows and partitions across later Indo-Iranian branches. |
| II-2-BMAC | 6,000 | 20,000 | 50,000 | Only later post-1700 local BMAC incorporation. Gonur I1784 remains non-steppe. |
| II-3A | 2,000 | 6,000 | 15,000 | Mitanni elite only; disputed Kassite/Wusun links remain context, not BMAC mass migration. |
| II-3B | 30,000 | 100,000 | 250,000 | Multiple pulses; earlier Proto-Dasa attribution remains uncertain source context. Majority post-Harappan locals remain stationary. |
| II-3B-GANGES | 12,000 | 40,000 | 100,000 | 40% onward transfer of the same migrant cohort. |
| II-3C | 1,000 | 3,000 | 8,000 | No supplied headcount: highland branch reference class 1k/3k/8k is an explicit model-only allocation. |
| II-4A | 18,000 | 54,000 | 135,000 | 45% of one combined Iranian 40k/120k/300k scenario. |
| II-4B-EAST | 10,000 | 30,000 | 75,000 | 25% Iranian allocation. Reported 55/18/27 ancestry stays ancestry, not extra people. |
| WEST-STEPPE-SEED | 12,000 | 36,000 | 90,000 | Retained western Bronze Age ancestry pool, separate from eastern Saka. |
| II-4B-WEST | 12,000 | 36,000 | 90,000 | Remaining 30% Iranian allocation; not solely derived from eastern Sakas. |
| GRE-1 | 8,000 | 24,000 | 58,000 | Greek/Phrygian share of shared Greek-Armenian 15k/45k/110k. |
| GRE-1-GREECE | 6,000 | 18,000 | 44,000 | Greek share of same Balkan allocation. |
| GRE-1-PHRYGIAN | 2,000 | 6,000 | 14,000 | Straits crossing; Armenian is not a Phrygian daughter. |
| ARM-1 | 7,000 | 21,000 | 52,000 | Remaining Greek-Armenian share; direct Caucasus crossing, never a Balkan parent. |
| ALB-1 | 5,000 | 15,000 | 40,000 | Local West Balkan retention proxy. 5k/15k/40k is the later founder reference class, not measured EBA influx. |
| BEAKER-SUBSTRATE | 10,000 | 30,000 | 80,000 | Older substrate, not another later Urnfield migration. |
| ITA-1 | 3,000 | 10,000 | 30,000 | No supplied headcount or itinerary: explicit model-only small regional branch reference class3k/10k/30k; draws from the earlier western substrate rather than a new steppe founder. Italic language attribution remains reconstructed. |
| URNFIELD-SEED | 15,000 | 45,000 | 120,000 | Locally growing older Beaker-derived central European pool before later Urnfield dispersal; no new direct Corded Ware influx. |
| CEL-1A-FRANCE | 20,000 | 60,000 | 160,000 | Partition of one Celtic 50k/150k/400k aggregate; Beaker substrate not counted again. |
| CEL-1A-BRITAIN | 10,000 | 30,000 | 80,000 | Partition of one Celtic 50k/150k/400k aggregate; Beaker substrate not counted again. |
| CEL-1A-IBERIA | 10,000 | 30,000 | 80,000 | Partition of one Celtic 50k/150k/400k aggregate; Beaker substrate not counted again. |
| CEL-1A-ITALY | 5,000 | 15,000 | 40,000 | Partition of one Celtic 50k/150k/400k aggregate; Beaker substrate not counted again. |
| CEL-1A-BALKANS | 5,000 | 15,000 | 40,000 | Partition of one Celtic 50k/150k/400k aggregate; Beaker substrate not counted again. |
| BSL-1 | 12,000 | 36,000 | 90,000 | No supplied Baltic count: 30% CWC daughter allocation within shared lineage. |
| GER-1A | 30,000 | 80,000 | 200,000 | Intentional Baltic crossing; distinct from earlier Battle Axe ancestry. |
| GER-1B | 150,000 | 400,000 | 900,000 | Growing descendants of the early 80k pool; not another independent 400k root. |
| GER-1B-BRITAIN | 45,000 | 120,000 | 270,000 | 30% of continental descendants; intentional North Sea crossing. |
| GER-1B-ITALY | 60,000 | 160,000 | 360,000 | 40% of same continental descendants; eastern German/Polish departures precede Slavic arrivals. |
| GER-1C | 45,000 | 120,000 | 270,000 | Remaining30% returns to Denmark / southern Sweden; no migrant route into Norway. |
| SLAVIC-SEED | 15,000 | 45,000 | 120,000 | Broad ancestral continuity proxy, not a Medvyn arrival date. |
| SLA-1A-WEST | 60,000 | 180,000 | 480,000 | 40% shared Slavic aggregate follows earlier Germanic outflow. |
| SLA-1A-SOUTH | 67,500 | 202,500 | 540,000 | 45% of same aggregate; local Balkans remain distinct. |
| SLA-1A-EAST | 22,500 | 67,500 | 180,000 | Remaining15% of same aggregate. |
| PIA-0B | 5,000 | 15,000 | 40,000 | Earlier hybrid6120 BCE root retained in source, outside animation. |
| ANA-1B | 800 | 2,500 | 6,000 | Alternative to ANA-1A, not another Anatolian pool. |
| CEL-1B | 50,000 | 150,000 | 400,000 | Alternative Celtic centre/Beaker language route, nonadditive. |
| SLA-1B | 150,000 | 450,000 | 1,200,000 | Alternative SE Poland / Volhynia pinpoint for same Slavic pool. |

### Initial standing priors and capacities

The opening contains **25,000 standing people**: 20,000 in the CLV source pool and 5,000 in the Dnipro pool. This differs from the **15,000 central founder transfer**, which subsequently draws 12,000 and 3,000 from those pools. Treating both quantities as separate founder migrations would double-count them.

Eleven stocks have positive initial standing priors. Nine are activated later at the model's contact dates, already in mature regional positions. They are existing residents, not arrivals; the compact caption says **“Already living here”** for 160 model years after introduction. These later activations are accounting boundaries for a selective atlas, not claims that the regions were empty beforehand. The user chose to retain this later introduction instead of widening the opening map to every future local region.

| Stock | Activation | Low | Central | High | Growth treatment |
| --- | --- | --- | --- | --- | --- |
| CLV | 4500 BCE | 6,000 | 20,000 | 56,000 | Logistic |
| UNHG | 4500 BCE | 1,500 | 5,000 | 14,000 | Logistic |
| ANATOLIA | 4400 BCE | 7,200 | 22,500 | 54,000 | Closed |
| EEF | 3200 BCE | 9,000 | 30,000 | 84,000 | Logistic |
| TARIM-LOCAL | 2100 BCE | 3,000 | 10,000 | 28,000 | Closed |
| POLTAVKA | 2400 BCE | 1,500 | 5,000 | 14,000 | Logistic |
| BMAC | 2400 BCE | 15,000 | 50,000 | 140,000 | Closed |
| SOUTH-ASIA-LOCAL | 1800 BCE | 120,000 | 400,000 | 1,120,000 | Closed |
| BALKAN-LOCAL | 3000 BCE | 27,000 | 90,000 | 252,000 | Closed |
| ARMENIA-LOCAL | 2600 BCE | 9,000 | 30,000 | 84,000 | Closed |
| NORWAY-LOCAL | 300 CE | 12,000 | 40,000 | 112,000 | Closed |

Ordinary reservoir priors and capacities use low/high sensitivity factors **0.3 and 2.8** relative to their central values; Anatolia has explicit low/high values of 7,200/54,000. Capacities below are central natural-growth asymptotes, not hard ceilings, estimates of total regional carrying capacity or all inhabitants. Credits above K remain present; the code does not delete them. Zero-initial lineage stocks acquire people through their dated parent credits, not at their placeholder start year.

| Declared reservoir | Central initial | Central capacity K | Natural growth |
| --- | --- | --- | --- |
| CLV | 20,000 | 80,000 | Logistic |
| UNHG | 5,000 | 30,000 | Logistic |
| YAMNAYA | 0 | 600,000 | Logistic |
| ANATOLIA | 22,500 | 60,000 | Closed |
| EEF | 30,000 | 200,000 | Logistic |
| CWC | 0 | 1,000,000 | Logistic |
| AFANASIEVO | 0 | 50,000 | Logistic |
| DZUNGARIA | 0 | 60,000 | Logistic |
| TARIM-LOCAL | 10,000 | 30,000 | Closed |
| FATYANOVO | 0 | 160,000 | Logistic |
| POLTAVKA | 5,000 | 30,000 | Logistic |
| SINTASHTA | 0 | 40,000 | Closed |
| ANDRONOVO | 0 | 500,000 | Logistic |
| BMAC | 50,000 | 150,000 | Closed |
| BMAC-INTERFACE | 0 | 500,000 | Logistic |
| SOUTH-ASIA-LOCAL | 400,000 | 1,500,000 | Closed |
| SOUTH-ASIA | 0 | 350,000 | Logistic |
| WEST-STEPPE | 0 | 250,000 | Logistic |
| BALKAN | 0 | 220,000 | Logistic |
| BALKAN-LOCAL | 90,000 | 230,000 | Closed |
| ARMENIA-LOCAL | 30,000 | 80,000 | Closed |
| BELL-BEAKER | 0 | 300,000 | Logistic |
| URNFIELD | 0 | 450,000 | Logistic |
| BALTIC | 0 | 550,000 | Logistic |
| SCANDINAVIA | 0 | 650,000 | Logistic |
| GERMAN-CONTINENT | 0 | 650,000 | Closed |
| NORWAY-LOCAL | 40,000 | 90,000 | Closed |
| SLAVIC-CORE | 0 | 1,800,000 | Logistic |

### Growth, losses and conservation

The current common intrinsic logistic rate is **0.018349 per model year** (1.8349%). Between ledger events, open stocks with `0 < P < K` follow `dP/dt = r P (1 − P/K)`, with their declared capacity `K`. The implementation leaves `P ≥ K` unchanged rather than applying negative logistic growth above capacity. Transfers debit a source at departure and credit a destination at arrival; the travellers carry the same mass between those dates. The rate was selected to fund the dated low/central/high transfers across all eight route variants at 1,000 and 5,000 people per dot, then given a 0.00005 outer funding margin. The inner fitter also adds 0.0002 and rounds upward to six decimal places; the annual audit requires `expm1(r) ≤ 0.021` as well as nonnegative balances. It is a **fitted display calibration**, not observed fertility, mortality or a defensible five-millennia census projection. Low, central and high use this same fitted intrinsic rate; their allocations and standing priors differ.

The current IE preparation specifies **no separate loss or addition schedules**. It does not model war deaths, plague, forced displacement, attrition or historical birth/death rates individually. Positive priors introduced later and inferred logistic growth mean total atlas population is not constant. “Conservation” refers to funded movement and correct accounting between these explicitly modelled changes, not to a fixed total across 5,500 years.

Nine declared reservoirs are closed to inferred natural growth: Anatolia, Tarim locals, Sintashta, BMAC, South Asian locals, Balkan locals, Armenian locals, continental Germanic and Norway locals. The compiled model also closes terminal Mitanni and Albanian stocks, for **11 closed stocks**. A closed stock can still be credited or debited by a declared transfer.

The default compiles to **47 active transfer legs and 53 standing stocks**, across 24 groups. “47” does not mean 47 independent historical migrations or 47 per-dot events. At 1,000 people per dot the central model has 2,374 per-dot transfer schedules. The prepared geography contains 51 journeys because contextual/alternative material and active transfer legs are different counts.

### Where double-counting is prevented

- **Formation and steppe descendants:** CLV and Dnipro contributions credit one shared Yamnaya-related pool. Corded Ware, Fatyanovo–Abashevo, Sintashta and Andronovo are funded descendants, not freshly spawned copies of all earlier migrants. Sister/precursor ancestry bookkeeping does not assert literal paternal descent from Yamnaya R1b-Z2103 to every later R1a or Beaker R1b-P312 lineage.
- **Anatolia:** the 8,000/25,000/60,000 combined scenario comprises 800/2,500/6,000 incoming people and 7,200/22,500/54,000 existing locals. The eastern and western routes are alternatives. Existing locals change language colour without a second migrant population.
- **Tarim:** Xiaohe/Tarim_EMBA1 stays local. Afanasievo/Dzungarian movement and later Tarim-edge contact are separate; later local incorporation is not an Afanasievo origin claim or proof of Tocharian speech.
- **Sintashta and BMAC:** 75% Abashevo-derived plus 25% local Poltavka allocation forms one Sintashta pool. Its complete handover credits Andronovo. Urban BMAC locals remain separate; only declared later incorporation enters the steppe–oasis interface. The Mitanni elite scenario is not the whole BMAC urban population.
- **Iranian branches:** one 40,000/120,000/300,000 aggregate is partitioned 45% plateau, 25% eastern Saka and 30% western steppe/Scythian. Western Scythian continuity has its own western source; it is not created exclusively from eastern Saka migrants. A seed and later transfer can describe the same people at different dates.
- **Greek, Phrygian and Armenian:** the 15,000/45,000/110,000 aggregate is partitioned into Balkan Greek/Phrygian and separate Caucasus Armenian movement. Greek and Phrygian branches split the Balkan pool. Albanian continuity and local-majority Balkans are not another copy of that aggregate. `ALB-1` uses the later 5,000/15,000/40,000 founder reference class as a reconstructed 2000–1800 BCE local-retention proxy; it is not a literal migration observed at 500 CE.
- **Western Europe:** the older Beaker substrate, later Urnfield seed and five Celtic destinations are sequential layers. France/Britain/Iberia/Italy/Balkans receive 40/20/20/10/10% of one Celtic aggregate. The added Italic route draws from the older western substrate and is explicitly model-only.
- **Germanic cycle:** Baltic-to-Scandinavia descendants fund the continental movement. Continental descendants split 30% Britain, 40% southern Europe and 30% return to Denmark/southern Sweden. Norway changes language while its local dots remain stationary. These are repeated stages of a lineage, not three additive founder populations.
- **Slavic movement:** west/south/east receive 40/45/15% of one aggregate. Earlier Germanic outflow and later Slavic inflow draw and credit the relevant stocks. A Medvyn presence or an ancestral seed is not a mass migration beginning in 700 BCE. The Volhynia scenario substitutes a source geography; it does not add another 450,000 central migrants.

## 5. Language, colours and scenario choices

Destination colouring is the default, with group colouring available. Colours identify model categories and transfer destinations, not genetic purity, ethnic borders or a measured ancestry percentage at every point. Existing local populations have a neutral grey key. The model can recolour existing stationary dots through a spatial ordering; no extra people are generated by language adoption.

| Stationary language scenario | Display interval | What changes |
| --- | --- | --- |
| Local Anatolian → Anatolian languages | 3200–1300 BCE | Existing local dots change colour |
| Post-Harappan local → Indo-Aryan adoption | 1500–500 BCE | Local majority remains present; migrant route is separate |
| Local Balkan → Roman linguistic integration | 1–500 CE | No invented mass migration from Italy |
| Local Norwegian → West Norse adoption | 375–575 CE | No continental-Germanic migrant route into Norway |

These are explicit transmission scenarios, not surveyed language boundaries or securely dated community-wide conversions. Group filtering includes the relevant local language-adoption population where configured. A language-family name is not a biological population label.

The three selectable dimensions produce **2 × 2 × 2 = eight** combinations:

| Dimension | Default | Alternative | Scope |
| --- | --- | --- | --- |
| Anatolian entry | Eastern CLV/Caucasus approach | Balkan/Usatove western approach | Replaces the incoming route, keeping its CLV parent stock/source placement and demographic allocation |
| Celtic dispersal | Knovíz–Urnfield eastern emphasis | Western/centre emphasis | Replaces source geography and routes, retaining the common five-destination budget; it is not an exhaustive implementation of every Atlantic/Beaker theory |
| Slavic origin | Ukraine/southern Belarus | SE Poland/Volhynia | A source-region alternative, not a separate extra population |

The default manifest ID is `eastern-eastern-ukraine`. Alternatives preserve low/central/high cohort allocations and the comparison display chronology. They are geographic alternatives rather than complete chronologically distinct implementations of every published hypothesis. The Southern Arc/hybrid deep-root record is retained context, not a fourth selectable dimension or an additive founder animation. Proposed Nuristani branching, Afanasievo–Tocharian association, fragmentary Balkan/Italic identities and the Kassite/Wusun proposals are not made certain by a scenario selector.

## 6. Animation, settlement persistence and camera

Dots are population slots, not one marker per migration or decorative route trails. Arrivals join the credited stock continuously. They then spread from regional entry points along prepared river/terrace/valley/resource branches over **180–320 model years**: 3.6–8 seconds at the two current speeds. Mature initial locals already occupy regional positions. New growth slots in a young incoming lineage share that lineage's current dispersal-front epoch; their biological ledger birth dates remain separate. This avoids newborn dots appearing instantly at a distant mature endpoint or restarting as immigrants. Later departures start at the stock's actual dispersed position. Scrubbing backwards reconstructs positions from dates and slot history.

Visible paths are hidden by default; they guide actual population dots. Small question marks in the corner caption point to uncertainty. Estimated populations are not faded because they are uncertain. The detailed note is **“Path and dates are reconstructed.”**

Automatic framing opens on the **currently occupied footprint** under the active filters. A separate planning engine retains the chronological envelope already occupied and eases outward edge changes over 1.5 default-playback seconds. It does not repeatedly contract when one traveller leaves an extreme. The current video has no inward zoom. Later local-prior activation can require a wider frame; framing can make room shortly beforehand without displaying those residents before their activation date. Manual pan/zoom suspends automatic framing, and Home resumes it. Reverse scrubbing, restart, filters and layout changes recompute the appropriate view deterministically.

### Current two-phase clock

| Historical interval | Rate | Timeline duration |
| --- | ---: | ---: |
| 4500–3300 BCE | 40 years/second | 30 seconds |
| 3300 BCE–1000 CE | 50 years/second | 86 seconds |
| Total historical playback | Shared continuous phase clock; adaptive timing off | 116 seconds |

At the default playback multiplier, the interactive atlas and export use the same `advanceNarrativePlayback` schedule. Manual speed changes scale the phase schedule during the current session; speed itself is not persisted. Stored display preferences and edition drafts remain independent. `defaultSpeed: 20` is the base speed control reference; it does not mean that both configured phases run at 20 years/second.

The video adds a 0.5-second opening hold, 1.5-second closing hold and one endpoint frame. It contains **2,785 unique animation frames plus 48 hold frames = 2,833 frames** at 24 fps: **118.041667 seconds**, strictly below 120 seconds. The first actual departure is at 4400 BCE, 2.5 historical-playback seconds plus the opening hold: **3 seconds into the video**. The first 100-year transit is visible for **2.5 seconds/60 frames**. Static holds do not supply its travel time.

## 7. Limitations and unresolved conflicts

1. **No prehistoric census calibration.** Low/central/high scenarios, standing priors, capacities and fitted growth are display choices. Ancestry fractions, male-line bottlenecks and sampled graves do not independently determine total migrants or language-speaker numbers.
2. **No exact ancient itineraries.** Land checks and modern rivers constrain drawing, but do not establish ancient coastlines, wetlands, pass access, palaeoclimate or surveyed settlement locations. The geographic limitations in section 3 apply to every rendered path.
3. **Evidence is not independent just because it appears in several summaries.** The supplied report draws repeatedly on overlapping aDNA studies and secondary interpretation. Its 28 rows are not 28 independent proofs. No new genomic, radiocarbon or linguistic analysis was performed for this atlas.
4. **TOC-1B conflict.** The report uses this code both for Okunev replacement in Minusinsk and for Dzungaria/Chemurchek/Tarim-edge integration. The default route follows the latter table row. The separate `CTX-OKUNEV` record retains the other claim without assigning Okunev people to Tocharian speech.
5. **Chronological scope and precision.** Presence is not arrival; broad source windows do not fix exact departures. Earlier root proposals and later attestations are not silently forced into the 4500 BCE–1000 CE view. BP/BCE rounding differences remain explicit.
6. **Language assignments remain hypotheses.** Anatolian entry, Celtic origins and Slavic source regions have alternatives. Nuristani relationships, Afanasievo–Tocharian continuity, “Proto-Dasa” identifications, Kassite/Wusun/Yuezhi links, Paleo-Balkan identities and later language boundaries require stronger evidence than animated proximity.
7. **Incomplete citations remain incomplete.** Some prose references cannot yet be matched unambiguously to a publication, edition or passage. They are listed below as leads, not converted into authoritative footnotes. Publication metadata checks do not mean that every full text or supplement was read.
8. **Selective standing populations.** The map does not attempt to show everyone living in Eurasia. Later residents are introduced at contact-model boundaries. Local totals and empty spaces are not claims about total ancient population or absence of people.
9. **Software checks have a different scope.** A funded ledger, water-free sampled segment or passing browser test does not validate a historical migration, language label, demographic total or palaeoenvironmental reconstruction.

## 8. Model files, reproducibility and verification scope

The main implementation paths in the combined repository are:

| Artifact | Purpose |
| --- | --- |
| `public/projects/indoeuropeans.json` | Edition manifest, model dimensions and eight combinations |
| `indoeuropean-dispersals.register.json` | Private retained normalized register and full supplied synthesis |
| `indoeuropean-dispersals.population.json` | Separate estimates, benchmarks, standing priors and limitations |
| `indoeuropean-dispersals.journeys.json` and `model-*.journeys.json` | Reconstructed dates, geographic controls, stages and scenario alternatives |
| `indoeuropean-dispersals.ledger.json` and `model-*.ledger.json` | Funded stock/transfer preparation, capacities and resource paths |
| `indoeuropean-dispersals.atlas.json` | Prepared atlas metadata and retained evidence layer; public packaging must keep the original full synthesis private |
| [prepare-indoeuropean-atlas.mjs](../../../scripts/prepare-indoeuropean-atlas.mjs) | Source extraction, explicit allocations and model preparation |
| [indoeuropean-variants.mjs](../../../scripts/indoeuropean-variants.mjs) | Scenario replacement rules |
| [indoeuropean-landscapes.mjs](../../../scripts/indoeuropean-landscapes.mjs) / [resource networks](../../../scripts/indoeuropean-resource-networks.mjs) | Resource-region declarations, hydrography-guided positions and local paths |
| [population-ledger.ts](../../../src/data/population-ledger.ts) | Stock compilation, funding, growth and transfer accounting |
| [standing-slots.ts](../../../src/sim/standing-slots.ts) / [settlement-dispersal.ts](../../../src/sim/settlement-dispersal.ts) | Slot occupation, growth dates and local dispersal lineage |
| [population-camera.ts](../../../src/map/population-camera.ts) | Occupied-population steady framing |
| [export script](../../../scripts/export-indoeuropean-animation.mjs) / [video verifier](../../../scripts/verify-indoeuropean-video.mjs) | Shared-clock capture and independent encoded-file checks |

The `indoeuropean-dispersals.*` names identify the prepared model. In the working/private project these files are under `public/data/research/`. This public release package provides sanitized display copies under `site/atlas/data/research/`: private original/raw-source payloads, copied source prose, source-document links and private provenance have been removed while the remaining model values are retained. Oversized JSON copies are split losslessly with viewer-loader support. The full original synthesis, embedded original text and complete build/history remain in the private archive. The fingerprints below identify the private prepared snapshots, not the bytes of the sanitized public derivatives. This paragraph describes the prepared release package; deployment status is verified separately.

Snapshot identity (SHA-256; read without regenerating data):

| Working/private model path | SHA-256 |
| --- | --- |
| public/projects/indoeuropeans.json | `97198f38ba66f74722b74f4760093922126788a35c303fc4fec1e08f1f7ccd4b` |
| public/data/research/indoeuropean-dispersals.population.json | `d6b8a0bbe50dd9b8e6938ad548062a51889f8692e5b5dcc9b32c15ba24aabf53` |
| public/data/research/indoeuropean-dispersals.journeys.json | `67ab8171aec5a4bee06a09a8ccf8a81162d1398a282033fd64cb5b01be023b7c` |
| public/data/research/indoeuropean-dispersals.ledger.json | `a3d5229db243694e5a289e95ed8f9f5bcdd3723ad8103cba696fb6f979b04d49` |
| scripts/prepare-indoeuropean-atlas.mjs | `2d8d6bc0e3a2431cf941eb7bc77d03d6be4fcb053330d6dcddc0055927cb8947` |
| scripts/indoeuropean-resource-networks.mjs | `4a57b59b5aa2078f5044b758b87d8f71964e4759b543516bc45c5b57823c77f7` |

The completed software snapshot passed **399/399 repository tests**, TypeScript checking, production build and Pages subpath checks. Real-project browser evidence covers the eight variants, filters, source details, local source-byte integrity, camera controls, forward/reverse/restart, live phase speeds, independent drafts/storage and desktop/390px layouts. An external-tile-idle screenshot timeout is preserved in the original QA report; a bounded continuation passed the remaining UI checks without app/data changes. Minor attribution/caption overlap remains documented.

The finished video passed **89 independent verification checks**: H.264/yuv420p, 1080p/24 fps, measured 118.041667-second duration, 2,833 decoded frames, clean full decode, actual browser playback/seeking/end and 28 extracted proof frames. All 2,785 recorded camera frames contained occupied populations, with no inward zoom or visible one-frame out/back returns. Actual opening pixels matched all 25 initial source dots; a real credited 1,000-person slot travelled for 60 frames and then moved about **328.43 km** through its reconstructed settlement network over six more video seconds. That distance verifies movement in the model, not a measured historical dispersal. Separate real-data painted checks confirmed that young growth follows its lineage's current front. None of these is a claim of exhaustive source validation, independent ancient-route review or human acceptance of every visual choice.

These are results for the named finished snapshot, not a newly rerun test suite for this documentation-only change. Relevant evidence lives alongside the local export and under `.atlas-runtime/indoeuropean-visible-travel/`; private machine-local reports are not required public links. Documentation validation checks relative paths, reference IDs, table coverage and the bibliographic links described below. Preparing this document does not regenerate population or map data.

## 9. Bibliography and source catalogue

Verification labels distinguish **metadata checked** (identity/title/date/DOI verified), **content checked in part** (specified accessible passages inspected), **matched lead** (a likely publication was identified from an incomplete report reference), and **unresolved lead**. A DOI resolving to a publisher or an abstract being accessible does not mean a paywalled work or its supplements were fully read. Page ranges below are publication pagination unless a particular relevant page/section is expressly given.

### Immediate supplied source

<a id="ref-report"></a>

**REPORT.** *Animated Migration Atlas of the Indo-European Language Family: Dispersal Vectors, Archaeogenetic Horizons, and Demographic Specifications*. User-supplied synthesis; author, publication date, publisher and public URL not supplied. Retained source hash above. **Source type:** secondary synthesis and proposed visualization specification, not a primary ancient text or a population census. Its master migration table, demographic framework and de-duplication rules supplied the starting model. All 28 normalized source records currently cite this one report. Original/native place forms are retained where given, including Çinamak, Knovíz, Gródek, Mykhailivka and Kaman-Kalehöyük.

### Six papers linked in the structured catalogue

<a id="ref-clv2025"></a>

**CLV2025 — original catalogue ID.** Lazaridis, Iosif; Patterson, Nick; Anthony, David; Vyazov, Leonid; et al. (2025). “The genetic origin of the Indo-Europeans.” *Nature* **639**, 132–142. [DOI: 10.1038/s41586-024-08531-5](https://doi.org/10.1038/s41586-024-08531-5); [NLM metadata](https://pubmed.ncbi.nlm.nih.gov/39910300/). **Type:** primary archaeogenetic research with historical/linguistic interpretation. **Role:** CLV-related formation, North Pontic mixture and Anatolian ancestry hypotheses. Relevant locations include Extended Data Figure 1 and Supplementary Information sections 1–2. Metadata and selected accessible material were checked; no complete sample-level reanalysis was performed. The paper does not supply this atlas's migrant headcounts or prove individual languages from genomes.

<a id="ref-tarim2021"></a>

**TARIM2021 — original catalogue ID.** Zhang, Fan; Ning, Chao; Scott, Ashley; Fu, Qiaomei; et al. (2021). “The genomic origins of the Bronze Age Tarim Basin mummies.” *Nature* **599**(7884), 256–261; online 27 October 2021. [DOI: 10.1038/s41586-021-04052-7](https://doi.org/10.1038/s41586-021-04052-7); [open manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC8580821/). **Type:** primary archaeogenetic research. **Role:** separates sampled Dzungarian Afanasievo-associated individuals from the Xiaohe/Tarim local ancestry cluster. See Extended Data Table 1 and Supplementary Data 1A for sample information. Metadata and selected accessible material checked. This is not a census, nor evidence that the sampled Xiaohe people spoke Tocharian.

<a id="ref-celtic2026"></a>

**CELTIC2026 — original catalogue ID.** McColl, Hugh; Kroonen, Guus; Pinotti, Thomaz; Barrie, William; et al. (2026). “Tracing the spread of Celtic languages using ancient genomics.” *Nature*, online 4 November 2026. [DOI: 10.1038/s41586-026-11198-9](https://doi.org/10.1038/s41586-026-11198-9); [NLM record](https://pubmed.ncbi.nlm.nih.gov/42983081/). **Type:** primary genomic/linguistic study. **Role:** the eastern Knovíz–Urnfield emphasis and comparison with competing Celtic dispersals. Title, leading authors, DOI and online date checked against DOI metadata; volume/pages were not supplied by the checked current record and are not invented here. The register's abbreviated “Celtic-associated dispersal” is a catalogue shorthand. Exact claim-specific page/supplement references are not established in this documentation pass.

<a id="ref-germanic2026"></a>

**GERMANIC2026 — original catalogue ID.** McColl, Hugh; Kroonen, Guus; Moreno-Mayar, J. Víctor; Seersholm, Frederik Valeur; et al. (2026). “Tracing the spread of Germanic languages using ancient genomics.” *Nature*, online 28 October 2026. [DOI: 10.1038/s41586-025-09064-1](https://doi.org/10.1038/s41586-025-09064-1); [NLM record](https://pubmed.ncbi.nlm.nih.gov/42983076/). **Type:** primary genomic/linguistic study. **Role:** Baltic-linked Scandinavian ancestry, southward movement and later northern return; linguistic transmission remains distinct from demic movement. Metadata checked; volume/pages and exact claim-specific locators are not established here. The `025` in the DOI is not the publication year: the checked online publication is 2026. Neither this study nor the register supplies a census for the three-stage atlas cycle.

<a id="ref-slavic2025"></a>

**SLAVIC2025 — original catalogue ID.** Gretzinger, Joscha; Biermann, Felix; Mager, Hellen; King, Benedict; et al. (2025). “Ancient DNA connects large-scale migration with the spread of Slavs.” *Nature* **646**(8084), 384–393; online 3 September 2025. [DOI: 10.1038/s41586-025-09437-6](https://doi.org/10.1038/s41586-025-09437-6). **Type:** primary archaeogenetic research. **Role:** early medieval ancestry changes, likely source-region proxies and regional variation; Figure 4, associated methods/tables and Box 1 discuss the interpretation. Metadata and selected accessible article material checked. The source report's generalized >80–85% statements must not be extended to every Slavic-speaking area: study estimates are region/model dependent, and its authors distinguish linguistic, archaeological and genetic categories. The atlas's 150,000/450,000/1,200,000 scenario is not a headcount reported by this paper.

<a id="ref-balkans2023"></a>

**BALKANS2023 — original catalogue ID.** Olalde, Iñigo; Carrión, Pablo; Mikić, Ilija; Rohland, Nadin; et al. (2023). “A genetic history of the Balkans from Roman frontier to Slavic migrations.” *Cell* **186**(25), 5472–5485.e9; 7 December 2023. [DOI: 10.1016/j.cell.2023.10.018](https://doi.org/10.1016/j.cell.2023.10.018); [open manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC10752003/). **Type:** primary archaeogenetic research. **Role:** Roman-period mobility, Anatolian-related ancestry and later regional Slavic-associated contributions. Metadata and selected accessible material checked; publication pagination is not a pinpoint citation for every atlas claim. Regional ancestry estimates and the paper's discussion of limited Italic contribution do not measure Latin-speaker totals or justify representing all Romanization as one route from Italy.

### Additional references and primary-text leads embedded in the report

The following **documentation-only** `DOC-*` handles expand the prose references. **M** means metadata located at a publisher, author institution or official index; **C** means the match to the incomplete supplied reference is inferred; **U** means unresolved; **P** marks a preprint. A short supplied wording is a citation lead from the synthesis, not a quotation attributed to the underlying publication. These statuses do not imply complete full-text or supplement review.


### Additional named modern works embedded in the report

| Documentation ID; status | Supplied lead, retained verbatim | Recovered metadata and verification URL | Claim role and limit |
|---|---|---|---|
| <a id="ref-doc-nikitin2025"></a> `DOC-NIKITIN2025`; M | “Nikitin et al. 2025” | Alexey G. Nikitin et al. (2025), *A genomic history of the North Pontic Region from the Neolithic to the Bronze Age*. Nature. DOI **10.1038/s41586-024-08372-2**, published online 5 February 2025. [Author-hosted published PDF](https://reich.hms.harvard.edu/sites/reich.hms.harvard.edu/files/inline-files/2025_NikitinLazaridis_NorthPontic_Nature_0.pdf). | `PIA-0A`, `ANA-1B`: North Pontic waves, Usatove, Serednii Stih and Mykhailivka. Direct Nature fetch encountered a cookie redirect; the author-hosted paper confirms identity. Ancestry does not establish an exact language or itinerary. |
| <a id="ref-doc-southernarc2022"></a> `DOC-SOUTHERNARC2022`; M | “Lazaridis, Alpaslan-Roodenberg et al. (2022)” | Iosif Lazaridis, Songül Alpaslan-Roodenberg et al. (2022), *The genetic history of the Southern Arc: A bridge between West Asia and Europe*. Science 377, eabm4247. DOI **10.1126/science.abm4247**. [Official index](https://pubmed.ncbi.nlm.nih.gov/36007055/). | `PIA-0B`, `ANA-1A`, `GRE-1`, `ARM-1`, `ALB-1`: competing homeland and Anatolia/Balkans/Caucasus ancestry context. Identifying the study does not audit every supplied admixture/date claim. |
| <a id="ref-doc-heggarty2023"></a> `DOC-HEGGARTY2023`; M | “Heggarty et al. 2023” | Paul Heggarty et al. (2023), *Language trees with sampled ancestors support a hybrid model for the origin of Indo-European languages*. Science 381(6656), eabg0818, 28 July 2023. DOI **10.1126/science.abg0818**. [Official index](https://pubmed.ncbi.nlm.nih.gov/37499002/). | `PIA-0B`: sampled-ancestor vocabulary phylogeny, hybrid homeland and approximately 8120 BP root. Does not settle the supplied critique or give exact migrant counts. Verify the paper's BP convention before repeating the supplied 6120 BCE conversion. |
| <a id="ref-doc-anthony2007"></a> `DOC-ANTHONY2007`; M/C | “Anthony 2007” | David W. Anthony (2007), *The Horse, the Wheel, and Language: How Bronze-Age Riders from the Eurasian Steppes Shaped the Modern World*. Princeton University Press. [Publisher](https://press.princeton.edu/books/ebook/9780691295367/the-horse-the-wheel-and-language), [scholarly book platform](https://www.fulcrum.org/concern/monographs/fq977v30w). | Classic steppe, wheeled-vehicle and branch synthesis: `PIA-0A`, `CWC-1`, `II-1A/1B`, `BSL-1`. Author/year-to-book identification is inferred. Current publisher page is a 2026 edition retaining 2007 copyright; do not substitute its ISBN as the original 2007 ISBN. No pages supplied. |
| <a id="ref-doc-haak2015"></a> `DOC-HAAK2015`; M | “Haak et al. 2015” | Wolfgang Haak et al. (2015), *Massive migration from the steppe was a source for Indo-European languages in Europe*. Nature. DOI **10.1038/nature14317**. [Author institution](https://www.broadinstitute.org/publications/broad6600), [published PDF](https://reich.hms.harvard.edu/sites/reich.hms.harvard.edu/files/inline-files/nature14317_0.pdf). | Classic steppe model / European ancestry turnover, `PIA-0A`, `CWC-1`. Not a census or a source for an exact animated route. |
| <a id="ref-doc-parpola2015"></a> `DOC-PARPOLA2015`; M/C | “Parpola 2015” | Asko Parpola (2015), *The Roots of Hinduism: The Early Aryans and The Indus Civilization*. Oxford University Press; online 20 August 2015. DOI **10.1093/acprof:oso/9780190226909.001.0001**. [Publisher](https://academic.oup.com/book/27664). | `ANA-1B`, `II-3A/3B/4A`: Kulturkugel, western Anatolian alternative and proposed Proto-Dasa / Proto-Rigvedic pulses. Intended book inferred from author/year/topic. Preserve these as attributed reconstructions, not proof of the exact two-wave itinerary. |
| <a id="ref-doc-narasimhan2019"></a> `DOC-NARASIMHAN2019`; M | “Narasimhan et al. (2019)” | Vagheesh M. Narasimhan et al. (2019), *The formation of human populations in South and Central Asia*. Science 365(6457), eaat7487, 6 September 2019. DOI **10.1126/science.aat7487**. [Official index](https://pubmed.ncbi.nlm.nih.gov/31488661/). | `II-2`, `II-3A/3B`, `II-4A`: steppe/Central-South-Asian ancestry and BMAC/local receptor distinction. Unnamed secondary qpAdm analyses of I1784 remain a separate unresolved lead. |
| <a id="ref-doc-papac2021"></a> `DOC-PAPAC2021`; M | “Papac et al. (2021)” | Luka Papac et al. (2021), *Dynamic changes in genomic and social structures in third millennium BCE central Europe*. Science Advances 7(35), eabi6941, 25 August 2021. DOI **10.1126/sciadv.abi6941**. [Author institution](https://researchportal.helsinki.fi/en/publications/dynamic-changes-in-genomic-and-social-structures-in-third-millenn-2/), [published PDF](https://reich.hms.harvard.edu/sites/reich.hms.harvard.edu/files/inline-files/sciadv.abi6941.pdf). | `CWC-1`, `CEL-1B`, `ITA-1`: CWC/Beaker/Únětice social/genomic change and Bohemian turnover context. Does not document the atlas's detailed Italian peninsular itinerary. |
| <a id="ref-doc-wlo2019"></a> `DOC-WLO2019`; U | “Piotr Włodarczak's 2019 chronology” | Exact work not identified from the supplied author/year. No unique work or supporting URL assigned. | `CWC-1`: three supplied eastern CWC phases. Multiple works exist; no title/DOI/publication/pages provided. An author-name match would not establish these phase dates. |
| <a id="ref-doc-saag2021"></a> `DOC-SAAG2021`; M | “Lehti Saag et al. (2021)” | Lehti Saag et al. (2021), *Genetic ancestry changes in Stone to Bronze Age transition in the East European plain*. Science Advances 7(4), eabd6535, 20 January 2021. DOI **10.1126/sciadv.abd6535**. [Official index](https://pubmed.ncbi.nlm.nih.gov/33523926/), [full paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC7817100/). | `II-1A`: Fatyanovo dates, ancestry and paternal-line discussion. Supplied lactase/phenotype details need their own table-level review. |
| <a id="ref-doc-engovatova2023"></a> `DOC-ENGOVATOVA2023`; M/C | “In 2023 and 2024” | A. V. Engovatova, I. E. Alborova, Kh. Kh. Mustafin et al. (2023), *Ancient DNA of the Bearers of the Fatyanovo and Abashevo Cultures (Concerning Migrations of the Bronze Age people in the Forest Belt on the Russian Plain)*. Stratum plus, No. 2. DOI **10.55086/sp232207228**. [Author laboratory bibliography](https://compbio.ru/publications/). | `II-1A/1B`: Fatyanovo–Abashevo connection. The report combines 2023/2024 work. This is a distinct recovered 2023 publication; do not transfer the later paper's 7+3 sample description to every 2023 analysis. Direct DOI fetch failed. |
| <a id="ref-doc-engovatova2024"></a> `DOC-ENGOVATOVA2024`; M | “7 Fatyanovo and 3 Middle Volga Abashevo males” | A. V. Engovatova, Kh. Kh. Mustafin, I. E. Alborova, A. A. Kanapin, A. A. Samsonova and M. B. Mednikova (2024), *“Lost Child” or Vanguard? Linking Fatyanovo Population with Middle Volga Abashevo Culture using Ancient DNA Sequencing Data*. Stratum plus, No. 2, 227–249. DOI **10.55086/sp242227249**. [Publisher](https://www.e-anthropology.com/English/Catalog/Anthropology/STM_DWL_dVKH_EokxWO80dFp5.aspx). | `II-1A/1B`: metadata and 7 Fatyanovo + 3 Abashevo men confirmed on the publisher page. These are sample counts, not a historical census. |
| <a id="ref-doc-mednikova2024"></a> `DOC-MEDNIKOVA2024`; M | “Mednikova, Kanapin, Samsonova, and Morgunova” | M. B. Mednikova, A. A. Kanapin, A. A. Samsonova and N. L. Morgunova (2024), *Between Volga and Ural River basins: concerning family ties of the Abashevo and Sintashta population of the Bronze Age in the context of genetic data*. Vestnik arheologii, antropologii i etnografii 67(4), 184–198. DOI **10.20874/2071-0437-2024-67-4-14**. [Journal issue PDF](https://ipdn.ru/2024_4%2867%29.pdf). | `II-1A/1B`: Pepkino/Sintashta biological relationship. Journal's own PDF confirms identity. Source says December 2024; exact release day not asserted. |
| <a id="ref-doc-chechushkov2018"></a> `DOC-CHECHUSHKOV2018`; M | “Chechuskov & Epimakhov (2018)” | Igor V. Chechushkov and Andrey V. Epimakhov (2018), *Eurasian Steppe Chariots and Social Complexity During the Bronze Age*. Journal of World Prehistory 31, 435–483. DOI **10.1007/s10963-018-9124-0**. [Publisher](https://link.springer.com/article/10.1007/s10963-018-9124-0). | `II-1B`: chariot chronology/context. Publisher spelling **Chechushkov** differs from supplied **Chechuskov**. Retain the original spelling in the source record. |
| <a id="ref-doc-blocher2023"></a> `DOC-BLOCHER2023`; M | “Blöcher et al. (2023)” | Jens Blöcher et al. (2023), *Descent, marriage, and residence practices of a 3,800-year-old pastoral community in Central Eurasia*. PNAS 120(36), e2303574120; online 21 August 2023. DOI **10.1073/pnas.2303574120**. [Author institution](https://openscience.ub.uni-mainz.de/items/9f2deebe-9c75-4b3d-b726-3dc7e9da0498). | `II-1B`: endpoint/kinship/social context. Identifying this paper does not verify 23 settlements × 200–700 residents. |
| <a id="ref-doc-lubotsky2023"></a> `DOC-LUBOTSKY2023`; M | “Lubotsky (2023)” | Alexander Lubotsky (2023), *Indo-European and Indo-Iranian Wagon Terminology and the Date of the Indo-Iranian Split*. In *The Indo-European Puzzle Revisited*, Cambridge University Press; online 29 April 2023. DOI **10.1017/9781009261753.021**. [Publisher](https://www.cambridge.org/core/books/abs/indoeuropean-puzzle-revisited/indoeuropean-and-indoiranian-wagon-terminology-and-the-date-of-the-indoiranian-split/ADBF07BCD6447A00E1B5E3EE4E128FA7). | `PIA-0B` critique, `II-1B`, `II-2`, `II-3B/4A`: wagon/chariot words and split argument. Not an observed exact migration date or population. Do not conflate with the same volume's separate *Fire and Water* chapter. |
| <a id="ref-doc-dai2022"></a> `DOC-DAI2022`; M/C | “Zhang et al. (2022)” | Matching claim: Shan-Shan Dai et al. (2022), *The Genetic Echo of the Tarim Mummies in Modern Central Asians*. Molecular Biology and Evolution 39(9), msac179, 25 August 2022. DOI **10.1093/molbev/msac179**. [Official index](https://pubmed.ncbi.nlm.nih.gov/36006373/), [publisher via DOI](https://doi.org/10.1093/molbev/msac179). | `II-2`, `II-4A`: Tajik/BMAC/Andronovo ancestry. **Likely author-attribution mismatch:** Dai is first author; Ya-Ping Zhang is last author. Preserve supplied “Zhang” while labelling this matching-work identification as inferred. |
| <a id="ref-doc-witzel2001"></a> `DOC-WITZEL2001`; M/C | “Witzel 2001” | Michael Witzel (2001), *Autochthonous Aryans? The Evidence from Old Indian and Iranian Texts*. Electronic Journal of Vedic Studies 7(3). DOI **10.11588/ejvs.2001.3.830**. [University-hosted PDF](https://hasp.ub.uni-heidelberg.de/journals/ejvs/article/download/830/808/0). | `II-3B`: textual/substrate and language-shift discussion. Intended work inferred from author/year/topic; university PDF metadata found, landing page bot protection blocked access. No exact verse/pages supplied. |
| <a id="ref-doc-kumar2022"></a> `DOC-KUMAR2022`; M | “Kumar et al. 2022” | Vikas Kumar et al. (2022), *Bronze and Iron Age population movements underlie Xinjiang population history*. Science 376(6588), 62–69, 1 April 2022. DOI **10.1126/science.abk1534**. [Official index](https://pubmed.ncbi.nlm.nih.gov/35357918/). | `TOC-1A/1B`, `II-4B`: Xinjiang ancestry, 201 genomes/39 sites. The supplied 55/18/27 mixture remains a model-specific statement needing table-level checking. |
| <a id="ref-doc-mustafin2024"></a> `DOC-MUSTAFIN2024`; U/C | “Mustafin et al. 2024” | Exact intended work unresolved. A related 2024 Tuva paper is first-authored by Kilunovskaya, with Mustafin a coauthor; another related Chinge-Tey I study was published in 2025. [2024 publisher candidate](https://uavestnik.ru/en/arxiv-nomerov/2024/volume-24%2C-no.-2/scythian-world-of-eurasia-north-south-west-east/reconstructing-ethnocultural-processes-in-the-sausken-valley-tuva-during-the-later-half-of-the-millennium-bc.html), [2025 publisher candidate](https://link.springer.com/article/10.1186/s12864-025-11361-y). | `II-4B`: Tuva/Arzhan heterogeneity. The 2024 candidate concerns the later half of the first millennium BCE and differs in first author; the other differs in year. Neither is silently substituted as the supplied citation. |
| <a id="ref-doc-andreeva2025"></a> `DOC-ANDREEVA2025`; M | “Andreeva et al. 2025” | Tatiana V. Andreeva et al. (2025), *Genetic history of Scythia*. Science Advances 11(30), eads8179; online 23 July 2025. DOI **10.1126/sciadv.ads8179**. [Official index](https://pubmed.ncbi.nlm.nih.gov/40700493/). | `II-4B`: western Scythian/Sarmatian data. A [2026 erratum](https://pubmed.ncbi.nlm.nih.gov/41894518/) exists, DOI **10.1126/sciadv.aeg8165**; its substantive effect has not been audited here. |
| <a id="ref-doc-ning2026"></a> `DOC-NING2026`; M | “Ning et al. 2026” | Chao Ning et al. (2026), *Ancient DNA unveils distinctive ancestries in the Bronze and Iron Ages of East Tianshan*. Science 393(6817), eadv1295, 17 September 2026. DOI **10.1126/science.adv1295**. [Official index](https://pubmed.ncbi.nlm.nih.gov/42752142/). | `TOC-1B`: East Tianshan, 135 individuals/11 sites. Metadata/sample identity confirmed; not direct evidence of every sampled person's language. |
| <a id="ref-doc-anthony2024"></a> `DOC-ANTHONY2024`; U/C | “Anthony 2024” | Exact intended work not specified. A possible title is *Ten Constraints that Limit the Late PIE Homeland to the Steppes*. [Author-upload lead](https://www.academia.edu/108547976/Ten_Constraints_that_Limit_the_Late_PIE_Homeland_to_the_Steppes). | `ARM-1`: Balkan-route rejection/Caucasus framing. This candidate has not been securely matched to the report's specific Armenian claim; do not invent a page or promote it to verified support. |
| <a id="ref-doc-hovhannisyan2025"></a> `DOC-HOVHANNISYAN2025`; M | “Hovhannisyan et al. 2025” | Anahit Hovhannisyan et al. (2025), *Demographic history and genetic variation of the Armenian population*. American Journal of Human Genetics 112(1), 11–27. DOI **10.1016/j.ajhg.2024.10.022**; online 25 November 2024, issue 2 January 2025. [Official index](https://pubmed.ncbi.nlm.nih.gov/39591962/), [institutional PDF](https://pure.mpg.de/pubman/item/item_3632089_3/component/file_3632096/gea0392.pdf). | `ARM-1`: modern Armenian demographic structure/continuity and Balkan hypothesis. Modern genomes/historical modelling do not identify an exact individual Bronze Age route. |
| <a id="ref-doc-davranoglou2023"></a> `DOC-DAVRANOGLOU2023`; P/M | “Davranoglou et al. (2023)” | Leonidas-Romanos Davranoglou, Aris Aristodemou, David Wesolowski and Alexandros Heraclides (2023), *Ancient DNA reveals the origins of the Albanians*. bioRxiv, DOI **10.1101/2023.06.05.543790**. [Author institution](https://oumnh.ox.ac.uk/publication/1557107/dimensions). | `ALB-1`: West Balkan continuity/IBD/founder discussion. A later version of record is Davranoglou, Lauka, Aristodemou et al. (2026), *Ancient DNA evidence for the history of the Albanians*, Nature Human Behaviour 10, 1371–1391, DOI **10.1038/s41562-026-02462-z**, online 4 May 2026; [official index](https://pubmed.ncbi.nlm.nih.gov/42082727/), [publisher](https://www.nature.com/articles/s41562-026-02462-z). Preserve the 2023 preprint/version attribution; do not assume every supplied “100%” or IBD statement was revalidated. |

### Ancient texts, inscriptions and primary-evidence leads

These are named corpora or evidence classes, not complete edition-level citations. Their composition or attestation dates must not become observed migration dates.

| Documentation ID; status | Exact supplied wording | Claim role and missing information |
|---|---|---|
| <a id="ref-doc-text-rigveda"></a> `DOC-TEXT-RIGVEDA`; U | “Rigveda” | `II-3B`, `II-4A`: Iranian names, hydronym chronology, Dravidian/substrate loanwords and patron-client account. No hymn/verse, edition, translation or textual stratification supplied. The report's 1500–1200 BCE range is reconstructed chronology. |
| <a id="ref-doc-text-avestan"></a> `DOC-TEXT-AVESTAN`; U | “Avestan” | Indo-Iranian/Vedic comparison, chariot vocabulary, aša/Haoma and shared innovations. The source names Avestan language/forms; it does not supply an Avesta passage or edition. Do not manufacture an ancient-text citation. |
| <a id="ref-doc-text-herodotus"></a> `DOC-TEXT-HERODOTUS`; U | “Herodotus's "Great Scythia"” | `II-4B`: ancient geographical nomenclature framing the western Scythian sample region. No work/book/passage, edition or translation supplied. Do not invent an exact *Histories* reference. |
| <a id="ref-doc-text-anatolian"></a> `DOC-TEXT-ANATOLIAN`; U | “earliest Indo-European languages attested in written records” | `ANA-1A/1B`: Hittite/Luwian/Palaic attestation and early Anatolian branching. No tablet, catalogue ID, corpus or translation cited. Linguistic attestation is separate from the ancestry of people buried near a Hittite-period site. |
| <a id="ref-doc-text-tocharian"></a> `DOC-TEXT-TOCHARIAN`; U | “Attested in Buddhist kingdom manuscripts” | `TOC-1A/1B`: much later attested Tocharian versus proposed earlier Afanasievo-related dispersal. No manuscript signature, edition or text cited. Later presence does not document the exact Bronze Age route. |
| <a id="ref-doc-text-lepontic"></a> `DOC-TEXT-LEPONTIC`; U | “Lepontic Celtic inscriptions are documented” | `CEL-1A/1B`: Golasecca/Lepontic chronology. No inscription ID, transcription, edition or epigraphic corpus supplied. |

The report does not name Linear B, a Kikkuli text, a Mitanni treaty number, an Oscan/Umbrian corpus or an exact Herodotus passage. Such identifiers have deliberately not been added as if supplied. The Mitanni/maryannu discussion is catalogued below as an unnamed secondary lead.

### Unnamed secondary/contextual leads and report-authored models

Each identifying snippet below is retained verbatim. Where no secure source identity was recovered, no supporting URL or exact scholarly page is invented. A related named paper is not automatically proof of an unnamed secondary analysis.

| Documentation ID | Exact supplied identifying snippet | Claim role and verification limit |
|---|---|---|
| <a id="ref-doc-ctx-tarim-mtdna"></a> `DOC-CTX-TARIM-MTDNA` | “mitogenome studies” | `TOC-1B`: C4 in six of seven Xiaohe individuals. No authors/year/paper; do not conflate this mitochondrial sample with the 13 genome-wide Tarim individuals. |
| <a id="ref-doc-ctx-gonur-models"></a> `DOC-CTX-GONUR-MODELS` | “archaeogenetic analyses of the Narasimhan et al. dataset” | `II-3A`: I1784/Tomb 2380 inventory and exact alternate 61.4/25.2/13.4 and 80.6/13.8/5.6 models. No named secondary analyst, qpAdm table or settings; Narasimhan's bibliographic identity does not verify those exact percentages. |
| <a id="ref-doc-ctx-yamnaya-ydna"></a> `DOC-CTX-YAMNAYA-YDNA` | “secondary summaries of Lazaridis et al. 2025” | `PIA-0A`: 49/51 R1b-Z2103 and founder discussion. Secondary summaries unnamed; sample fraction is not a census or language-membership measure. |
| <a id="ref-doc-ctx-bayes-critique"></a> `DOC-CTX-BAYES-CRITIQUE` | “Methodological assessments of Bayesian core-vocabulary phylogenetics (2023–2025)” | `PIA-0B`: taxon-to-character ratio / topology critique. No author/title/DOI. Cannot identify a unique assessment or infer a scholarly consensus from this wording. |
| <a id="ref-doc-ctx-uralic"></a> `DOC-CTX-URALIC` | “early Indo-Iranian loanwords in reconstructed stages of the Uralic language family” | `II-1A/1B`, `BSL-1`: contact-zone argument. No dedicated loanword catalogue or item-level references; related Heggarty/Lubotsky discussions are not itemized support for every loanword claim. |
| <a id="ref-doc-ctx-cwc-social"></a> `DOC-CTX-CWC-SOCIAL` | “women originated from a broader mating network” | `CWC-1`: exogamy/female mobility and nearby forest-burning/pasture claim. No dedicated paper or archaeobotanical citation supplied for those statements. |
| <a id="ref-doc-ctx-abashevo-warfare"></a> `DOC-CTX-ABASHEVO-WARFARE` | “weapons were deposited in roughly 50% of graves compared to 10% in EBA Yamnaya graves” | `II-1A`: climate/copper competition and warfare synthesis. Secondary syntheses are unnamed; percentage denominators/sites unspecified. |
| <a id="ref-doc-ctx-andronovo"></a> `DOC-CTX-ANDRONOVO` | “Rather than a single homogeneous tribe” | `II-2`: Alakul/Fedorovo/Alekseyevka and frontier chronology. No dedicated archaeological synthesis identified. A cultural horizon is not thereby one speech or ethnic community. |
| <a id="ref-doc-ctx-bmac-substrate"></a> `DOC-CTX-BMAC-SUBSTRATE` | “lexical substrate borrowing” | `II-3A/3B/4A`: agriculture/religion/sociopolitical substrate account. No separate lexical study or source passages; related Parpola/Witzel/Lubotsky leads do not settle the etymologies. |
| <a id="ref-doc-ctx-early-iranian"></a> `DOC-CTX-EARLY-IRANIAN` | “early Iranian names already occur inside the Rigveda” | `II-4A`: early split, DA382 at 850 BCE, Zagros/Yaz links. No names/verses, sample-publication pointer or direct philological critique supplied. |
| <a id="ref-doc-ctx-mitanni-innerasia"></a> `DOC-CTX-MITANNI-INNERASIA` | “secondary analyses also noting Indo-Aryan maryannu” | `II-3A`: Mesopotamia 1760 BCE, maryannu, Kassite and Wusun/Yuezhi proposals. Unnamed analyses and no tablets/editions. Preserve proposed/uncertain links; do not manufacture a documented mass movement. |
| <a id="ref-doc-ctx-anatolian-tmrca"></a> `DOC-CTX-ANATOLIAN-TMRCA` | “Community discussions of the linguistic phylogeny” | `ANA-1A/1B`: internal Anatolian TMRCA around 3200 BCE. No speaker/venue/link; weak contextual lead, not a dated arrival. |
| <a id="ref-doc-ctx-l699-route"></a> `DOC-CTX-L699-ROUTE` | “I2a-L699 and R1b-V1636 sub-routes” | `ANA-1B`: western/eastern route debate. Unnamed community discussion; a paternal lineage alone does not identify a route or spoken language. |
| <a id="ref-doc-ctx-catacomb-tocharian"></a> `DOC-CTX-CATACOMB-TOCHARIAN` | “closest ritual parallel is found in the Catacomb culture” | `TOC-1A/1B`: ritual-parallel route inference. No dedicated archaeological citation; ritual analogy is not direct migration evidence. |
| <a id="ref-doc-ctx-italic-gap"></a> `DOC-CTX-ITALIC-GAP` | “detailed Bronze Age Italian intra-peninsular routes for Italic are not broken down” | `ITA-1`: explicit supplied gap. The atlas's illustrative Italian route cannot be attributed to a detailed source-provided itinerary. |
| <a id="ref-doc-ctx-norse"></a> `DOC-CTX-NORSE` | “community discussions of the study link to the East Norse” | `GER-1C`: Denmark/Sweden versus Norway and East/West Norse interpretation. Unnamed commentary; separate genetic turnover from a demonstrated cause/date of dialect divergence. |
| <a id="ref-doc-ctx-baltoslavic"></a> `DOC-CTX-BALTOSLAVIC` | “David Anthony's model and mainstream historical-linguistic synthesis” | `BSL-1`, `SLA-1A`: divergence dates 2800 or 2100–2000 BCE, then Baltic/Slavic split 2000–1500 BCE. No exact work/section provided here; retain alternatives. |
| <a id="ref-doc-ctx-slavic-qpadm"></a> `DOC-CTX-SLAVIC-QPADM` | “discussions of the paper's qpAdm models” | `SLA-1A`: approximately 70% Baltic_BA + 30% EEF and Medvyn 700–600 BCE. Commentary/table identity unspecified; the named paper does not automatically verify each supplied simplification. |
| <a id="ref-doc-ctx-slavic-western"></a> `DOC-CTX-SLAVIC-WESTERN` | “scholarly and community commentary preserves a rival interpretation” | `SLA-1B`: SE Poland/Volhynia, Przeworsk paternal lines and para-Slavic Kiev interpretation. No author/publication/URL; retain as weaker alternative commentary, not equally verified evidence. |
| <a id="ref-doc-ctx-sintashta-count"></a> `DOC-CTX-SINTASHTA-COUNT` | “23 fortified settlements” | `II-1B`: 23 × 200–700 residents = 4,600–16,100, midpoint 10,350. No direct survey/density citation for the input quantities. Arithmetic is reproducible; archaeological inputs, cumulative movers and speech-population scaling are not thereby verified. |
| <a id="ref-doc-model-ne-nc"></a> `DOC-MODEL-NE-NC` | “Nc, scaling at 3× to 8×” | `PIA-0A`, `ALB-1`: founder/effective-to-census conversion. Explicit report-authored modeling multiplier, with no dedicated supporting source. Genetic effective size and census size are not interchangeable. |
| <a id="ref-doc-model-replacement"></a> `DOC-MODEL-REPLACEMENT` | “p = M / (M + L)” | `ANA-1`, `CWC-1`, `SLA-1`: incoming/local balancing. Illustrative model in the report, not a generally exact conversion from genetic ancestry percentages to migrant headcounts. |
| <a id="ref-doc-model-dedupe"></a> `DOC-MODEL-DEDUPE` | “Operational Rules for Preventing Double-Counting” | All branches: serial fission, Germanic loops, coupled emigration/replacement and stationary language-shift instructions. Visualization/accounting directions in the supplied synthesis, not an independent publication verifying exact atlas budgets, capacities or growth rates. |

### Claim mapping coverage across all register records

Actual structured bindings remain `REPORT` for every row. The links below are documentation inferences from the report's named sources and explicitly weaker leads.

| Register record(s) | Relevant catalogue / documentation handles |
|---|---|
| `PIA-0A` | `CLV2025`; [`DOC-NIKITIN2025`](#ref-doc-nikitin2025); [`DOC-ANTHONY2007`](#ref-doc-anthony2007); [`DOC-HAAK2015`](#ref-doc-haak2015); [`DOC-CTX-YAMNAYA-YDNA`](#ref-doc-ctx-yamnaya-ydna); [`DOC-MODEL-NE-NC`](#ref-doc-model-ne-nc). |
| `PIA-0B` | [`DOC-SOUTHERNARC2022`](#ref-doc-southernarc2022); [`DOC-HEGGARTY2023`](#ref-doc-heggarty2023); [`DOC-CTX-BAYES-CRITIQUE`](#ref-doc-ctx-bayes-critique). |
| `ANA-1A`, `ANA-1B` | `CLV2025`; [`DOC-SOUTHERNARC2022`](#ref-doc-southernarc2022); [`DOC-NIKITIN2025`](#ref-doc-nikitin2025); [`DOC-PARPOLA2015`](#ref-doc-parpola2015); [`DOC-TEXT-ANATOLIAN`](#ref-doc-text-anatolian); [`DOC-CTX-ANATOLIAN-TMRCA`](#ref-doc-ctx-anatolian-tmrca); [`DOC-CTX-L699-ROUTE`](#ref-doc-ctx-l699-route). |
| `TOC-1A`, `TOC-1B` | `TARIM2021`; [`DOC-KUMAR2022`](#ref-doc-kumar2022); [`DOC-NING2026`](#ref-doc-ning2026); [`DOC-TEXT-TOCHARIAN`](#ref-doc-text-tocharian); [`DOC-CTX-TARIM-MTDNA`](#ref-doc-ctx-tarim-mtdna); [`DOC-CTX-CATACOMB-TOCHARIAN`](#ref-doc-ctx-catacomb-tocharian). |
| `CTX-OKUNEV` | No dedicated named paper in its register binding. Related Tocharian/Altai context above does not resolve the source-ID conflict retained in this record. |
| `CWC-1` | `CLV2025`; [`DOC-HAAK2015`](#ref-doc-haak2015); [`DOC-PAPAC2021`](#ref-doc-papac2021); [`DOC-WLO2019`](#ref-doc-wlo2019); [`DOC-CTX-CWC-SOCIAL`](#ref-doc-ctx-cwc-social). |
| `II-1A`, `II-1B` | [`DOC-SAAG2021`](#ref-doc-saag2021); [`DOC-ENGOVATOVA2023`](#ref-doc-engovatova2023); [`DOC-ENGOVATOVA2024`](#ref-doc-engovatova2024); [`DOC-MEDNIKOVA2024`](#ref-doc-mednikova2024); [`DOC-CHECHUSHKOV2018`](#ref-doc-chechushkov2018); [`DOC-BLOCHER2023`](#ref-doc-blocher2023); [`DOC-LUBOTSKY2023`](#ref-doc-lubotsky2023); [`DOC-CTX-URALIC`](#ref-doc-ctx-uralic); [`DOC-CTX-ABASHEVO-WARFARE`](#ref-doc-ctx-abashevo-warfare); [`DOC-CTX-SINTASHTA-COUNT`](#ref-doc-ctx-sintashta-count). |
| `II-2` | [`DOC-NARASIMHAN2019`](#ref-doc-narasimhan2019); [`DOC-LUBOTSKY2023`](#ref-doc-lubotsky2023); [`DOC-DAI2022`](#ref-doc-dai2022); [`DOC-CTX-ANDRONOVO`](#ref-doc-ctx-andronovo); [`DOC-CTX-BMAC-SUBSTRATE`](#ref-doc-ctx-bmac-substrate). |
| `II-3A` | [`DOC-PARPOLA2015`](#ref-doc-parpola2015); [`DOC-NARASIMHAN2019`](#ref-doc-narasimhan2019); [`DOC-CTX-GONUR-MODELS`](#ref-doc-ctx-gonur-models); [`DOC-CTX-MITANNI-INNERASIA`](#ref-doc-ctx-mitanni-innerasia). |
| `II-3B` | [`DOC-NARASIMHAN2019`](#ref-doc-narasimhan2019); [`DOC-PARPOLA2015`](#ref-doc-parpola2015); [`DOC-WITZEL2001`](#ref-doc-witzel2001); [`DOC-LUBOTSKY2023`](#ref-doc-lubotsky2023); [`DOC-TEXT-RIGVEDA`](#ref-doc-text-rigveda); [`DOC-TEXT-AVESTAN`](#ref-doc-text-avestan). |
| `II-3C` | No dedicated named Nuristani publication supplied; branch-status discussion sits adjacent to the Indo-Iranian linguistic arguments. |
| `II-4A` | [`DOC-LUBOTSKY2023`](#ref-doc-lubotsky2023); [`DOC-DAI2022`](#ref-doc-dai2022); [`DOC-TEXT-RIGVEDA`](#ref-doc-text-rigveda); [`DOC-TEXT-AVESTAN`](#ref-doc-text-avestan); [`DOC-CTX-EARLY-IRANIAN`](#ref-doc-ctx-early-iranian). |
| `II-4B` | [`DOC-KUMAR2022`](#ref-doc-kumar2022); [`DOC-MUSTAFIN2024`](#ref-doc-mustafin2024); [`DOC-ANDREEVA2025`](#ref-doc-andreeva2025); [`DOC-TEXT-HERODOTUS`](#ref-doc-text-herodotus). |
| `GRE-1` | [`DOC-SOUTHERNARC2022`](#ref-doc-southernarc2022); `BALKANS2023`. No dedicated Phrygian text citation supplied. |
| `ARM-1` | [`DOC-SOUTHERNARC2022`](#ref-doc-southernarc2022); [`DOC-HOVHANNISYAN2025`](#ref-doc-hovhannisyan2025); [`DOC-ANTHONY2024`](#ref-doc-anthony2024). |
| `ALB-1` | `BALKANS2023`; [`DOC-SOUTHERNARC2022`](#ref-doc-southernarc2022); [`DOC-DAVRANOGLOU2023`](#ref-doc-davranoglou2023); [`DOC-MODEL-NE-NC`](#ref-doc-model-ne-nc). |
| `CEL-1A`, `CEL-1B` | `CELTIC2026`; [`DOC-PAPAC2021`](#ref-doc-papac2021); [`DOC-TEXT-LEPONTIC`](#ref-doc-text-lepontic). |
| `ITA-1` | [`DOC-PAPAC2021`](#ref-doc-papac2021); [`DOC-CTX-ITALIC-GAP`](#ref-doc-ctx-italic-gap). No detailed Italian itinerary claimed by supplied report. |
| `GER-1A`, `GER-1B`, `GER-1C` | `GERMANIC2026`; [`DOC-CTX-NORSE`](#ref-doc-ctx-norse); unnamed Finnic/Celtic loanword chronology in the Germanic prose. |
| `BSL-1` | [`DOC-ANTHONY2007`](#ref-doc-anthony2007) (candidate); [`DOC-CTX-BALTOSLAVIC`](#ref-doc-ctx-baltoslavic); `SLAVIC2025` as contextual extension. |
| `SLA-1A`, `SLA-1B` | `SLAVIC2025`; `BALKANS2023`; [`DOC-CTX-SLAVIC-QPADM`](#ref-doc-ctx-slavic-qpadm); [`DOC-CTX-SLAVIC-WESTERN`](#ref-doc-ctx-slavic-western). |

### Corrections and verification boundaries

1. **Author attribution:** the matching 2022 Tajik paper is first-authored by Dai, with Ya-Ping Zhang as last author. Keep “Zhang et al. (2022)” as supplied and mark the recovered identification as an inference.
2. **Versions/dates:** Hovhannisyan has 2024 online / 2025 issue dates. Davranoglou's 2023 preprint now has a 2026 version of record with revised title and expanded author list. Preserve both versions rather than silently replacing the supplied reference.
3. **Correction notice:** Andreeva 2025 has a 2026 erratum. Its substantive effect is outside this bounded metadata check.
4. **Incomplete modern references:** exact Włodarczak 2019, Anthony 2024 and Mustafin 2024 identities remain unresolved. The Engovatova 2023 and 2024 articles are distinct.
5. **No paper-to-path/census leap:** metadata confirmation establishes bibliography. Precise qpAdm fractions, IBD thresholds, phenotype figures, reservoir corrections, settlement-density inputs, founder-to-census multipliers and exact animation populations/paths need separate claim-level review.
6. **Ancient citation gap:** no ancient edition/translation or tablet/manuscript/inscription identifier is supplied. No exact verse or ancient passage has been invented.
7. **Date-convention gap:** the report repeatedly converts 4000 BP to 2000 BCE and 8120 BP to 6120 BCE. Preserve those explicit supplied values, but verify each publication's BP convention before repeating the conversions as research facts; radiocarbon BP convention normally uses 1950.
8. **Scope:** this catalogue covers the retained report's named author-year leads and identifiable weaker evidence classes. It is not a systematic literature review, a claim that other scholarship is absent, or an endorsement of all source wording. The six structured references above provide their exact checked title/date metadata.

### Geographic and visual data references

<a id="ref-geo-land"></a>

**GEO-LAND.** Natural Earth contributors. *Land*, nominal 1:10 million physical vectors. [Layer documentation](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/); [terms of use](https://www.naturalearthdata.com/about/terms-of-use/). Public domain. Exact retained hashes and the regional selection limitation are given in section 3. The official page currently identifies release 5.1.1, but the working snapshot does not record its release/immutable upstream commit, so that version is not assigned retrospectively. Modern land geometry is a routing/drawing constraint, not ancient coastline evidence.

<a id="ref-geo-rivers"></a>

**GEO-RIVERS.** Natural Earth contributors. *Rivers + lake centerlines*, nominal 1:10 million physical vectors. [Layer documentation](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/); [terms](https://www.naturalearthdata.com/about/terms-of-use/). Public domain. Current documentation lists 5.0.0; the retained file's exact release is unrecorded. Only selected `River` features are consumed by the IE resource builder. Modern river names, control spacing and inferred bank ribbons do not establish ancient channels or local hydrology at a model date.

<a id="ref-geo-basemap"></a>

**GEO-BASEMAP.** OpenFreeMap, using OpenMapTiles schema/cartography and OpenStreetMap contributors' data. [OpenFreeMap](https://openfreemap.org/); [OpenStreetMap copyright and ODbL attribution](https://www.openstreetmap.org/copyright); [OpenMapTiles attribution requirements](https://openmaptiles.org/docs/terminology/attribution/). The client requests live `tiles.openfreemap.org/planet` tiles and provider fonts. Software licensing is distinct from data licensing: OpenFreeMap software is MIT, OSM data are ODbL, and OpenMapTiles schema/cartographic attribution is CC BY 4.0. These are modern visual layers, not independent evidence for ancient migrations, population totals or ecological suitability. No tile snapshot is pinned.

<a id="ref-geo-terrain"></a>

**GEO-TERRAIN.** Mapzen/Terrain Tiles contributors; Amazon Web Services Open Data distribution. *Terrain Tiles*, Terrarium format. [Dataset record](https://registry.opendata.aws/terrain-tiles/); [Terrarium format](https://github.com/tilezen/joerd/blob/master/docs/formats.md); [constituent-provider attribution and licences](https://github.com/tilezen/joerd/blob/master/docs/attribution.md). The renderer requests 256-pixel raster DEM tiles from the AWS `elevation-tiles-prod/terrarium` endpoint, with client maximum zoom 12, for hillshade. The composite has multiple contributing datasets and licence requirements, not one blanket MIT or public-domain data licence. No elevation/slope analysis is used to place IE population dots, and no immutable live tile version is recorded.

## 10. A short public explanation

This is a population animation of reconstructed Indo-European dispersals, with eight combinations of Anatolian, Celtic and Slavic route hypotheses. Each full dot represents 1,000 modelled people. The low/central/high values are explicit visualization scenarios; the historical headcounts remain unknown.

People leave funded source pools, travel and join destination populations. They continue dispersing along reconstructed river, valley, foothill, coastal and oasis networks. Existing residents remain separate and can change language colour without an invented migration. Modern geography guides the drawing; it is not a palaeoclimate model or an exact ancient itinerary.

The camera expands with the occupied population footprint. Playback runs at 40 years/second from 4500 to 3300 BCE, then 50 years/second through 1000 CE. The complete verified video is 118.04 seconds. The detailed bibliography and methodology above explain the evidence, model allocations, alternatives and unresolved points; passing software checks does not settle those historical debates.
