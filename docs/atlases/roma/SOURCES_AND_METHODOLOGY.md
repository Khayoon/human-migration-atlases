# Roma migrations, 200–2025 CE: sources and methodology

> **Correction pending — 16 November 2026.** The current published Roma snapshot has two reported model errors: some growth dots appear far from established settlements around 1840, and Eastern European resident populations are depleted too far by 2025. Spatial lineage and resident-population accounting are being corrected. This document describes the previous published snapshot; the replacement model, video and documentation are pending verification.

This is an animated reconstruction of movements and selected resident populations associated with the European Romani diaspora, with separately identified Dom, Lom and Iraqi comparative communities. Research preparation, modelling and implementation were AI-assisted.

**The historical evidence, population scenarios and animation geography are different layers.** A dot represents people in the selected reconstruction. It is not a verified medieval headcount, a point census, a biological definition of ethnicity or proof of an exact itinerary. The modern part models selected mobility and regional populations; it does not enumerate every Roma person alive today.

This document describes the **16 November 2026 continuous-journeys revision**. It supersedes the 15 November dispersed-footprint/smooth-camera snapshot. The new version connects visible South Asian origins through Iranian and Anatolian stages, replaces sudden destination-support jumps with progressive descendant calibration, and lengthens individual cohort transits. The broader France/Germany and Anatolian footprints remain. The display ends in 2025 as an interpretation of the report's open-ended “present,” not a new 2025 census.

## 1. What was prepared

The retained input is an unpublished, undated supplied synthesis, *Cartographic and Historical Synthesis: Romani Migrations from South Asia to the Global Diaspora* (`REPORT`). Its author and original publication provenance were not established. It contains seven broad historical phases and 28 numbered wave rows, W-01–W-28. Its citations are research leads and attributed claims, not 28 independently verified datasets.

| Layer | Contents | Role |
| --- | --- | --- |
| Supplied evidence | 28 original wave excerpts, wording, dates, native names, cited URLs, alternative quantities and qualifications | Preserved privately, including the complete original synthesis |
| Normalized research | 28 original rows plus 15 separately sourced Near Eastern/Anatolian presence records | A traceable catalogue, not a count of distinct peoples |
| Geographic model | 62 journey definitions and 54 standing population reservoirs | Connected movement, staging and resident footprints |
| Demographic model | Three South Asian opening roots, shared allocations, 6 loss schedules and 35 progressive descendant-support schedules | Explicit low/central/high scenarios and accounting |
| Display model | Fixed population unit, enlarged outlined dots, filters, destination/group colours, a smooth camera path and regional continuation cue | Presentation choices |

The entry manifest is [public/projects/roma.json](../../../site/atlas/projects/roma.json). Working artifacts are `roma-migrations.atlas.json`, `.journeys.json`, `.population.json`, `.ledger.json`, `.geography.json`, `.extensions.json`, `.register.json` and `.review.json` under `public/data/research/`. The application joins journey, population and ledger files at load time; an empty migration array in the catalogue shell is not an empty map.

Complete original prose and verbatim excerpts belong in the private source/archive copy. A public release can retain the derived model and this explanation while removing private source reproductions. Sanitization changes file hashes even when model values are preserved. Snapshot identifiers below describe the complete prepared working artifacts, not a claim that sanitized public JSON has identical bytes.

## 2. Identities, terminology and evidence

The main European Romani reconstruction distinguishes Balkan, Vlax, Central and Northern/Northwestern groupings. Names retained in the evidence include **Rom / Roma, romani čhib, Sinti / Sinte, Manuš, Kaale, Romaničel, Kale / Calon, Romungro, Gurbet, Boyash, Polska Roma and Xaladitka**. These are analytical groupings and historical labels, not identical social or linguistic units in every century.

**Dom / Domari and Lom / Lomavren are separate comparative layers.** Shared names, South Asian language connections or occupational similarities do not establish one documented migration, a single population split or universal descent from the European Roma founder. The diverse Iraqi category labelled Kawliya/Dom and related communities is also qualified separately. Non-Indic European peripatetic populations such as Irish Travellers and Yenish are excluded from the South Asian founding flows.

Historical exonyms such as *Atsinganoi, Aiguptioi, Romiti, Țigani, Zutt / Ẓuṭṭ, Sayābija, Posha* and the older English terminology in source titles are retained where necessary to identify evidence. Their historical use does not guarantee that the author meant the same community as a modern ethnonym. In particular, the identification of early Byzantine labels with Roma needs source criticism.

The catalogue distinguishes these kinds of claim:

| Evidence kind | What it can establish | What the animation adds |
| --- | --- | --- |
| Reported movement, expulsion, deportation or return | A movement/policy reported by a named source, subject to its reliability and scope | A continuous display interval, route controls and allocation of people |
| Dated presence | A person or group was recorded at a place by that date | An earlier or broader settlement/movement window where needed; the record is not relabelled an exact first arrival |
| Linguistic or genetic reconstruction | Historical relationships, contact, divergence or demographic parameters under a study's assumptions | Geographic staging and display populations; neither loanwords nor ancestry percentages yield a route polyline or migrant census |
| Literary tradition or hypothesis | A narrative or scholarly proposal exists | A clearly identified comparative reconstruction, not a verified eyewitness transfer |
| Political context | A state policy, conquest, boundary or labour regime | Possible movement context; territorial control is not a count of resident Roma |
| Modern field presence | Communities were observed or interviewed in particular places and periods | Separate reconstructed footprints and population scenarios, not a dated medieval arrival or a 2025 local census |

Most historical narratives reach this project through modern scholarship or institutional summaries. The bibliography below distinguishes those intermediaries from the underlying primary texts. Listing a chronicle does not mean that its original language manuscript or every cited passage was directly examined.

## 3. Chronology and routes

The 200 CE opening is a broad display convention. Linguistic contact zones and genetic chronology do not document an exact departure in 200, 400 or 500 CE. Likewise, 1054, 1323, 1348, 1384, 1385 and later municipal dates are reported attestations whose identification and preservation need checking, not newly created populations arriving on those exact dates.

### Indian origins and visible geographic handovers

All three opening stocks are in South Asia. Foreign reservoirs start at zero and receive actual incoming transfers. The European Romani, Dom and Lom scenarios remain independently identified; sharing geography does not establish one documented exodus or a biological split.

| Opening stock | Location | Low / central / high | Start |
| --- | --- | --- | ---: |
| INDIC-CORE | Ganga–Yamuna interfluve approaches | 5,000 / 15,000 / 40,000 | 200 |
| DOM-INDIA | Separate comparative Sindh/Indus bank corridor | 3,000 / 10,000 / 25,000 | 200 |
| LOM-INDIA | Separate Lom comparative northwestern Indian river plains | 1,000 / 3,000 / 7,500 | 200 |

Their combined opening stock is **9,000 / 28,000 / 72,500 people**. These model priors do not claim a counted South Asian ethnic population in 200 CE. The Dom and Lom origin priors were moved to the opening so they can visibly precede the comparative foreign distributions; they are not extra debits from the European founder.

The active main sequence is `INDIC-CORE → NW-INDIA → IRAN → ARMENIA → ANATOLIA-EAST → BYZANTIUM`. The independent Dom comparison follows `DOM-INDIA → DOM-IRAN → DOM-ANATOLIA → DOM-SYRIA → DOM-TIGRIS`, then the Iraqi regional allocations. Lom follows `LOM-INDIA → LOM-IRAN → LOM-COMPARATIVE → LOM-ARMENIA`. An Iranian path control alone is no longer treated as a substitute for an occupied staging region.

| Journey / identity | Standing handover | Display interval | Requested cohort transit | Low / central / high |
| --- | --- | --- | --- | --- |
| W-01 · Origin | INDIC-CORE → NW-INDIA | 200–400 | 150 years | 5,000 / 15,000 / 40,000 |
| W-02 · Dom comparative | DOM-INDIA → DOM-IRAN | 200–450 | 150 years | 3,000 / 10,000 / 25,000 |
| DOM-IRAN-ANATOLIA · Dom comparative | DOM-IRAN → DOM-ANATOLIA | 400–650 | 150 years | 3,000 / 10,000 / 25,000 |
| DOM-ANATOLIA-SYRIA · Dom comparative | DOM-ANATOLIA → DOM-SYRIA | 650–900 | 120 years | 20,000 / 37,000 / 55,000 |
| DOM-SYRIA-IRAQ · Iraq comparative | DOM-SYRIA → DOM-TIGRIS | 850–1150 | 120 years | 5,000 / 10,000 / 20,000 |
| W-04 · Early Romani | NW-INDIA → IRAN | 500–700 | 120 years | 1,500 / 4,000 / 10,000 |
| ROMANI-IRAN-ARMENIA · Early Romani | IRAN → ARMENIA | 650–850 | 120 years | 1,500 / 4,000 / 10,000 |
| LOM-INDIA-IRAN · Lom comparative | LOM-INDIA → LOM-IRAN | 350–600 | 150 years | 1,000 / 3,000 / 7,500 |
| LOM-IRAN-ARMENIA · Lom comparative | LOM-IRAN → LOM-COMPARATIVE | 600–850 | 150 years | 1,000 / 3,000 / 7,500 |
| W-05 · Lom comparative | LOM-COMPARATIVE → LOM-ARMENIA | 850–1050 | 100 years | 1,000 / 3,000 / 7,500 |
| W-06 · Early Romani | ARMENIA → ANATOLIA-EAST | 850–1000 | 80 years | 5,000 / 12,000 / 25,000 |
| ROMANI-ANATOLIA-MARMARA · Early Romani | ANATOLIA-EAST → BYZANTIUM | 950–1100 | 100 years | 5,000 / 12,000 / 25,000 |

Successive stage totals often describe the same people and must not be summed as unique migrants. Each handover debits its occupied source and credits its destination. Exact stages and intervals above are geographic/display reconstructions, not newly verified travel records. Multi-generation cohort timing is an animation parameter: a 150-year transit is not a claim that one household travelled for 150 years.

### Original W-02/W-03 chronology and the comparative display

Original W-02 retains the Sasanian traditions dated **224–241 and 420–438 CE**, including workers/musicians, the Persian Gulf and lower Tigris. Original W-03 describes a **late-seventh-century lower-Tigris-to-northern-Syria** forced transfer and attributes 27,000 people to that account. Its identity, source chain and relationship to later Dom communities remain qualified. Those original directions and textual dates have not been rewritten or reversed.

The active **India → Iran → Anatolia → Syria → Iraq** comparison is a separately labelled, user-directed continuity reconstruction. Its interpolated approach and southward branches are not presented as W-03's documented itinerary. It retains the source scenario quantities as modelling references while making the changed direction and timing explicit. It does not prove a universal ancestry for Iraqi Kawliya, Dom-related or northern communities, and it does not create a second European Romani founder. Modern presence reports do not establish the early itinerary.

### Other route and chronology choices

There are 47 land-corridor journeys and 15 mixed land/maritime journeys. Land connectors use present-day coast-aware geography, with a roughly 0.04-degree A* grid; they are not a calibrated historical climate/slope least-cost model. Maritime legs are explicit for necessary island, coastal and overseas crossings. Named historical places remain distinct from geometric control nodes.

W-08's approximately-1520 stock scenario is back-projected into a reconstructed 1100–1300 regional distribution; W-12's 1530 stock spans 1420–1530. W-10's approach now begins in 1300 to accommodate visible staged transit before the later municipal network. These are not observed counts of earlier border crossings. W-20's Southern Vlax debit pool and Turkey-to-Greece path are accounting/geographic choices, not proof of a preceding Kosovo-to-Turkey itinerary. W-19's two Americas journeys now use a reconstructed 1890–1914 interval and 10-year requested cohort transits, after the European staging population is funded. The source's broader post-1861/1865–1914 context remains preserved; 1890 is not relabelled a documented first arrival.

The contested Ghaznavid military-koiné proposal and proposed Syria-to-Anatolia Zutt connection remain in the original register as alternatives with `render:false`. They create no additional founders; this edition does not implement a full alternate-route scenario switch. Its active comparative continuity route is separately disclosed above. Missing exact stops or manuscript-level itinerary proof does not prevent a reconstructed route from being displayed.

### Corrections and unresolved chronological conflicts

1. **Romanian abolition:** the supplied prose's 1861 endpoint is preserved in the private original. The derived display uses completion in Moldavia in December 1855 and Wallachia in February 1856, following Petre Petcuț's Council of Europe factsheet (C01). Post-emancipation W-18 therefore starts in 1856.
2. **Tismana:** the supplied point `[22.95, 43.07]` falls south of the Danube. The derived geographic reference is approximately `[22.93, 45.08]` in Gorj. The retained Romanian archaeological-register link is C06; a location correction does not verify the content of the 1385 charter.
3. **Portuguese colonial movement:** 1538 is the model's beginning of a broad colonial-deportation network and the continuation cue. It is not presented as a securely verified first arrival in Brazil. A sentence of banishment, including the commonly discussed 1574 case, does not by itself establish a completed voyage or a resident population.
4. **Traditional early transfers and ethnonyms:** Sasanian musician/worker traditions and the Zutt/Sayābija narratives are not automatically equivalent to the European Roma founding exodus. The exact identity, numbers, chronology and connections remain uncertain.
5. **First attestations:** the source dossiers need continuing manuscript/edition-level checking. The model preserves the distinction between reported presence and its reconstructed earlier stages.

## 4. People per dot and numerical assumptions

The default unit is **1 full dot = 1,000 people**. A 50,000-person model cohort therefore has 50 full units. A fractional final unit retains its exact population weight. Enlarging the dot on screen does not enlarge the population it represents.

The three numerical settings are **low, central and high scenarios**, not statistical confidence intervals. All 28 source records retain `population: null` as their principal archival headcount field. Partial reported numbers, literary counts, household/tax units and competing reconstructions remain in their evidence text; the report's proposed visualization amounts are held separately as scenarios. Many values in the next table originate in that supplied modelling brief, not in the published works cited alongside it.

### The 28 supplied scenarios

These figures have different scopes and centuries. **Do not add the rows.** Some are stocks, some cumulative/mobile pools, some mortality, and some subsets or returns of other rows. W-16, W-21–W-24 in particular are not interchangeable migrant totals.

| ID | Model subject | Low | Central | High | Scope and caution |
| --- | --- | ---: | ---: | ---: | --- |
| W-01 | Central to Northwestern Indian contact zone | 5,000 | 15,000 | 40,000 | Ancestral stock prior; linguistic reconstruction, not an ancient census |
| W-02 | Dom comparative: Sasanian workers/musicians | 3,000 | 10,000 | 25,000 | Literary/traditional comparative scenario, independent of the European founder |
| W-03 | Dom comparative: Zutt/Sayābija transfer | 15,000 | 27,000 | 35,000 | Reported forced-transfer scenario; its later Syrian allocations share one pool |
| W-04 | Proto-Romani exodus through Persia/Armenia | 1,500 | 4,000 | 10,000 | One founding movement; genetic/linguistic inference does not establish these census counts |
| W-05 | Lom/Posha Armenian–Anatolian retention | 1,000 | 3,000 | 7,500 | Independent comparative reconstruction |
| W-06 | Byzantine Anatolia/Constantinople | 5,000 | 12,000 | 25,000 | Later resident-stock scenario; presence is not an exact arrival |
| W-07 | Aegean/Ionian Romiti communities | 3,000 | 7,500 | 15,000 | Shared allocation across island/coastal destinations |
| W-08 | Balkan/Ottoman Rumelian core | 45,000 | 75,000 | 120,000 | Later stock scenario; Ottoman fiscal units and persons are distinct |
| W-09 | Danubian enslaved Roma, Vlax/Boyash | 3,000 | 6,000 | 12,000 | Early enslaved-stock scenario; not all later Romanian Roma |
| W-10 | Central Romani groupings | 5,000 | 10,000 | 20,000 | Regional stock reconstruction from dated presence |
| W-11 | Sinti/Manuš western network | 2,500 | 5,000 | 9,000 | Connected stock; municipal sightings are not independent mass arrivals |
| W-12 | Iberian Kale/Calon | 4,000 | 7,500 | 12,000 | Regional stock, distinct from later detainees/deportees |
| W-13 | British/Nordic groupings | 1,500 | 3,500 | 6,500 | Shared allocation between Britain and Nordic destinations |
| W-14 | Polska Roma/North Russian Xaladitka | 3,000 | 6,000 | 12,000 | Expulsion/presence reconstruction |
| W-15 | Portuguese colonial deportations | 1,500 | 3,500 | 7,000 | Cumulative scenario split 70% Brazil / 30% Atlantic Africa; remaining Iberian residents are a continuing source stock |
| W-16 | Spanish population in the Gran Redada context | 10,000 | 12,000 | 15,000 | Total-stock scenario; the separately modelled detainees are 9,000/10,500/12,000 |
| W-17 | Southern Vlax/Gurbet dispersal | 25,000 | 45,000 | 70,000 | Selected regional movement/stock scenario, not an added Indian founder |
| W-18 | Post-emancipation dispersal | 30,000 | 60,000 | 100,000 | Shared 1856–1914 pool; overseas W-19 is accounted within this allocation |
| W-19 | Transatlantic movements | 15,000 | 35,000 | 65,000 | Overseas scenario included in the post-emancipation accounting, not added again to W-18 |
| W-20 | Christian Vlax Turkey-to-Greece resettlement | 8,000 | 18,000 | 30,000 | Selected 1920 s movement scenario |
| W-21 | Inclusive European genocide deaths | 220,000 | 350,000 | 500,000 | Mortality, not migrants; includes W-22 and Transnistria deaths |
| W-22 | Yugoslav/occupied-Serbian genocide deaths | 25,000 | 40,000 | 60,000 | Included within W-21, not an additional European total |
| W-23 | Transnistria deportees: retained source alternatives | 24,686 | 25,000 | 26,000 | Active animation instead uses the coherent paired scenario explained below |
| W-24 | Transnistria returns: retained alternatives | 6,000 | 10,000 | 14,000 | Return of surviving deportees, not a new population |
| W-25 | Eastern Slovak to Czech-borderlands resettlement | 25,000 | 45,000 | 70,000 | Selected 1945–1965 movement scenario |
| W-26 | Yugoslav labour/Italy mobility | 40,000 | 80,000 | 130,000 | Shared 1968–1989 allocation |
| W-27 | Post-1989 asylum/war refugees | 120,000 | 200,000 | 300,000 | Selected mobile pool, not every emigrant or every unique person |
| W-28 | Post-visa/EU labour mobility | 250,000 | 450,000 | 750,000 | Selected 2001–2025 net-mobile pool, not a current Roma census |

The source-to-reference crosswalk below identifies the supplied citations behind each row. A citation alongside a row does **not** mean that its author published that row's low/central/high numbers.

### Units retained in the brief

| Proposed conversion | Low | Central | High | Actual use in this edition |
| --- | ---: | ---: | ---: | --- |
| Persons per *sălaș* / family-or-tent community | 5 | 6.5 | 8 | Retained assumption; no invented complete household roster is multiplied into a census |
| Persons per Ottoman *hāne* | 4.5 | 5 | 6 | Retained assumption; units, tax status, exemptions and chronology need source-specific interpretation |
| Census size / genetic effective size, (N_c/N_e) | 3 | 5 | 10 | Retained proposal, not applied to manufacture additional residents |

There is no default multiplication of ancestry percentages, a genetic bottleneck estimate or a military roster into “all Roma”. The edition uses explicit record/scenario estimates. The conversion ratios above are not established universal demographic constants.

## 5. Cohort accounting, descendant support and deaths

People occupy standing reservoirs before departure. A named source slot is debited, the weighted people travel, and a destination slot is credited. Arrivals persist; branches partition the source once. The returning western reconnaissance circuit does not create a full permanent population at each municipal stop.

    living at origins + travelling + living at destinations
      = opening stock + dated descendant support − cumulative deaths

Transfers cancel in the global sum. The exact residual weight of a partial dot is retained. Low/high scenarios and alternative dot units are checked separately. Cropping and filters do not delete people from the underlying full-world accounting.

### Zero automatic growth, explicit progressive descendant calibration

The ledger declares **`fixedAnnualRate:0`**. It adds no automatic logistic growth. Later stock/mobility scenarios are reconciled through **35 ranged schedules**, all marked **`descendantSupport:true`**, with **no instantaneous support entries**. They are local later-generation calibration, not observed births, verified assimilation, independent destination founders, new source headcounts or ancestry-percentage conversions. Reservoir capacities remain engineering bounds rather than measured ecological carrying capacities.

Every such addition requires a surviving resident lineage. It cannot make an empty foreign reservoir occupied. New standing slots are classified as growth and inherit the resident lineage's local dispersal state, so later generations join the existing settlement front rather than appearing immediately across a mature regional footprint. Stable slots preserve arrivals, later departures and reverse scrubbing. This display lineage does not trace real individuals or establish a verified genealogy.

Preparation extracts transfer/death demands using temporary generous balances, which are not delivered. For each bookkeeping epoch it measures the maximum cumulative debit/standing-target shortfall, rounds needed support up to 500 people and maintains low ≤ central ≤ high. It then places support progressively after actual incoming presence and before the relevant funding need, retaining a surviving lineage between support periods. Thus an epoch embedded in a support ID is not necessarily the schedule's start year. The complete actual start/end intervals and triples appear in Appendix A. The epoch boundaries remain 200, 500, 800, 1100, 1300, 1450, 1700, 1850, 1938, 1945, 1960, 1988, 2000 and 2026.

Only the three declared South Asian opening roots have initial people; all foreign pools start empty. Later-generation support changes the model through time without pretending that every much larger later stock left India together. The fitting process follows selected scenario targets rather than an independently observed fertility series. Passing conservation checks establishes internal numerical consistency by construction, not the historical magnitude of the assumptions.

Four later standing targets remain distinct from earlier movements:

| Pool | Target year | Low / central / high |
| --- | --- | --- |
| BALKAN-CORE | 1520 | 45,000 / 75,000 / 120,000 |
| CENTRAL-CORE | 1780 | 35,000 / 50,000 / 70,000 |
| DANUBIAN-CORE | 1855 | 150,000 / 200,000 / 250,000 |
| IBERIAN-CORE | 1749.5 | 10,000 / 12,000 / 15,000 |

The cumulative totals at the display's 2025 endpoint are:

| Scenario | Opening stock | Progressive support | Cumulative deaths | Living at 2025 |
| --- | --- | --- | --- | --- |
| low | 9,000 | 1,269,500 | 220,500 | 1,058,000 |
| central | 28,000 | 2,343,000 | 350,500 | 2,020,500 |
| high | 72,500 | 4,124,000 | 500,500 | 3,696,000 |

The actual full-world Engine was checked at 2025 in all three scenarios; the maximum absolute accounting residual was less than 0.001 people. These are accounting outputs of selected scenarios, not a census of all present-day Roma. The modern western stock includes 60,000 from W-26, 200,000 from W-27 and 450,000 from W-28 in the central model: 710,000 across those allocations.

### Shared geographic suballocations

| Shared record | Model allocation |
| --- | --- |
| W-07 | Crete 25%; Corfu 15%; Modon 35%; Cyprus 15%; Sicily 10% |
| W-13 | Britain 55%; Nordic 45% |
| W-15 | Brazil 70%; Atlantic Africa 30% |
| W-18 | Danubian Vlax/Boyash 80%; Hungarian Romungro 20% |
| W-19 | United States 60%; Latin America proxy 40%, drawn from W-18's diaspora pool |
| W-26 | Western Europe 75%; Italy 25% |
| W-27 | Balkan 35%; Southern Vlax 25%; Romania 25%; Central 15% |
| W-28 | Danubian 50%; Balkan 35%; Central 15% |

These are preparation fractions, not measured national or genealogical proportions. The returning W-11 circuit uses 150/300/600 people within its parent Sinti stock.

### Mortality and detention

- **Gran Redada:** the active detention transfer is 9,000/10,500/12,000, distinct from the 10,000/12,000/15,000 Spanish stock scenario. A 500-person death allocation is used in the paired custody/release model. Its precise timing, excess mortality and allocation remain modelling limitations; it is not a newly verified victim total. No residents remain indefinitely in the returned custody stock.
- **European genocide:** W-21 is inclusive. The model subtracts the Yugoslav W-22 allocation and the chosen Transnistria death allocation before allocating the European remainder. Regional shares of that remainder are illustrative accounting placements, not regional victim censuses or precise places of death. Deaths remove residents; the model does not leave living settlement dots at killing sites.
- **Source-range conflict:** the supplied W-21 scenario begins at 220,000. The current USHMM summary (C04) gives 250,000–500,000; 220,000 must not be attributed to that page as its lower bound.
- **Transnistria:** the animation uses one coherent **25,000 deported − 15,000 deaths = 10,000 returned** pairing at every estimate setting. It does not mix independent minimum deportee and maximum death/return values. This is a chosen internally conserved scenario, not a finding that overrides the historical alternatives. Achim's RomArchive account (C03) instead reports 24,686 in October 1942, approximately 11,000 deaths, about 2,000 early escapes/repatriations and 12,000 main spring-1944 returns, with later returns too. Those differences remain unresolved; arithmetic consistency alone does not verify a historical pairing.

The post-1989 and post-visa pools W-27/W-28 can overlap real individuals. For the active reconstruction they are treated as disjoint era allocations of net mobility. Summing all displayed journeys still cannot yield a verified count of unique historical persons.

## 6. The Near Eastern and Anatolian extension

Fifteen extension records supplement the original 28 without rewriting them. ERRC, IILHR and MERI sources E01–E05 document modern regional presence and social conditions. Neither their fieldwork dates nor their broad estimates establish the earlier comparative itinerary or a 2025 local census.

| Comparative/regional model | Low / central / high | Allocation and scope |
| --- | --- | --- |
| Shared Syrian staging transfer before its Iraqi branch | 20,000 / 37,000 / 55,000 | Includes the retained Syrian and Iraqi reference allocations once |
| Retained Syrian reference allocation | 15,000 / 27,000 / 35,000 | 30% Damascus/Barada–Ghouta; 15% Homs–Hama; 15% southeastern Anatolia; 40% northern Syria |
| Historical Iraqi reference branch | 5,000 / 10,000 / 20,000 | Leaves the shared Syrian staging population for the lower Tigris; no independent initial Iraqi stock |
| Modern Iraqi national scenario | 50,000 / 100,000 / 200,000 | 25% Basra; 20% Nasiriyah/Thi Qar; 15% Diwaniya; 15% Amara/Maysan; 15% Baghdad; 10% northern Iraq/Kurdistan |
| Historical Turkish Romanlar reference allocation | 6,000 / 13,000 / 26,000 | Shared regional reference cohort across a reconstructed 1300–1900 interval |
| Modern Turkish Romanlar scenario | 500,000 / 1,000,000 / 2,000,000 | 40% Thrace/Marmara; 35% Aegean; 15% Mersin–Adana; 5% Ankara; 5% Black Sea |

The shared 20/37/55k transfer includes explicit later-generation support in the arrived comparative Anatolian stock; it is not the original W-03 forced-transfer count. Those stage totals must not be added to their destination subsets. Local fractions are display assumptions. Modern support runs progressively over 1900–2013 for Romanlar and 1900–2024 for Iraq, after earlier resident lineages; it is not a mass arrival at a report's publication date or an observed birth series.

E04's 500,000–5,000,000 Turkish envelope combines Roma, Dom, Lom and Abdal. The model's separately chosen Romanlar-only 500k/1m/2m scenarios cannot be attributed to it as a census; Dom and Lom remain separate. The Iraqi category is also diverse and includes northern/Kurdistan groups, with uncertain connections to European Roma or particular Dom communities. ERRC's Syrian report supports modern Dom presence around Damascus and elsewhere, without counting Damascus residents or establishing medieval arrival. The new ancestral display is one explicit hypothesis, not a uniform ethnicity, language or origin for every community.

## 7. Geography and population footprints

The geographic inputs and their roles are catalogued as G01–G06 below. Present-day Natural Earth land geometry constrains land placement and connectors. Roma enables the full global mask so that overseas destinations remain in the model. Modern rivers, water, landcover and hillshade provide reference context. They do not independently establish an ancient ethnic distribution.

### Broad area fields, not a line of resident cities

The current placement has 54 resource-informed profiles. Eleven use broad, irregular two-dimensional area fields: the modern western, Sinti and wider diaspora profiles; Byzantine Anatolia; five Romanlar regional profiles; southeastern Anatolian Dom; and the Lom comparative profile. Other localities retain smaller river, coast, valley or dry-marsh-margin footprints where appropriate.

France is represented through northern/Paris basins, Loire/Centre, southwestern Aquitaine and Rhône/foothill components. German components cover northern lowlands, Rhine–Ruhr/Hesse, central/eastern basins and southern Danube/foothill areas, with Low Countries and wider central-European components as appropriate. Anatolia uses broader Marmara, Aegean/western interior, central plateau, Çukurova and Black Sea fields. These are reconstructed physical-region envelopes, not modern national boundary fills.

The Roma-only area sampler draws across polygon interiors, including interfluves. Suitability combines a nonzero broad background, a soft water-access preference, multiscale deterministic texture and feathered edges. It excludes current water and declared wetland, lake and selected high-mountain cores. The area components are interleaved so that small cohorts can already occupy several suitable regional areas; the ledger's existing placement override preserves that balanced ordering.

The outlines, component shares, suitability weights, terrain exclusions and density texture are all model choices. The broad-area field's 65% background term is an algorithm weight, **not a claim that 65% of Roma lived away from rivers**. A synthetic suitability texture is not measured historical habitat. Hand-authored resource guides are used in the Roma sampler; the existence of a retained Natural Earth river dataset does not mean that every Roma route or footprint is mechanically fitted to river centerlines.

This edition does not use a complete historical climate raster, DEM-derived habitat model, historical wetland reconstruction or surveyed settlement boundaries. Terrain tiles are background hillshade, not an elevation analysis that validates a route. An irregular spread does not prove occupation of every sample, exclusive ethnic territory or universal nomadism. Mobile, semi-mobile and settled populations should not be collapsed into one stereotype.

### Geographic limitations

Modern coasts and channels are proxies. Local A* connectors and water checks reduce obvious open-water shortcuts; they do not reconstruct past river crossings, roads, travel permissions, seasonality or every mountain pass. Land-only route checks apply to the reconstructed guide geometry, not proof that a particular person traversed it. Environmental bounds and wetland exclusions are display reconstructions separate from the original research.

## 8. What the viewer and video show

### Dot size, colours and uncertainty

The full dot's demographic unit is 1,000 people. The default **visual scale is 2.4**, with a black outline 1.2 CSS pixels wide and a minimum coloured-core radius of 4 CSS pixels. Radius can be larger at closer zoom. A fractional unit uses its exact weight and a correspondingly smaller coloured core; the visibility outline adds no people.

Default colours identify destinations; group-colour mode and group/destination filters are available. The comparative identities remain distinguishable. Low/central/high selection changes the numerical scenario; people-per-dot and magnification are separate display controls. Estimated populations are not faded to encode uncertainty. A compact question mark opens model details and reconstruction qualifications.

The current interface uses people moving between standing populations and persisting after arrival. Some elaborate glyph/ring protocols proposed in the original brief were suggestions rather than implemented features. The public explanation here describes the actual fixed-unit dot renderer. Coercion, detention, presence and uncertainty remain attributes of the underlying records and their details.

### Smooth opening and regional later view

The camera records the actual opening occupied footprint once, then interpolates projected centre/zoom through these poses using the prepared narrative clock:

| Model year | Geographic pose | Default playback position |
| --- | --- | --- |
| 200 | Actual opening occupied footprint | 0 seconds |
| 500 | `[32, 22, 85, 48]` [west, south, east, north] | 12 seconds |
| 800 | `[28, 24, 80, 55]` [west, south, east, north] | 27 seconds |
| 1100 | `[-13, 27, 58, 62]` [west, south, east, north] | 42 seconds |

Quintic interpolation has zero velocity and acceleration at each pose. New stocks and fluctuating dot bounds do not make the camera chase them. Reverse scrubbing, restart and the same year/viewport reproduce the same pose.

The default later all-group view stays on Europe and the Middle East. Its regional rule begins at 900 and reaches the final frame by 1100. Cropping is presentation, not demographic deletion. India, Africa and the Americas remain available through full-model views and explicit filters. Manual navigation and filtered results bypass the scripted default; Home resumes it. Independent saved display preferences remain preserved.

From 1538, a passive bottom-left caption, “↙ Some went to Brazil and the Americas,” records the continuation without forcing a transatlantic zoom-out. It is not an extra population marker or a claim of a securely established first arrival in Brazil in 1538.

### Two-phase clock and visible cohort travel

| Phase | Rate | Screen time |
| --- | --- | --- |
| 200–500 CE | 25 years/second | 12 seconds |
| 500–2025 CE | 20 years/second | 76.25 seconds |
| Final hold | No historical time advanced | 2 seconds |
| Complete schedule | Same prepared clock in app and export | 90.25 seconds |

Adaptive rate changes are disabled. The 500 CE boundary is a display convention, not an observed exact departure. The faster opening still includes visible occupied origins and movement. A release window and one cohort's traversal time are different parameters: staged early routes request 80–150 model years of travel, corresponding to several seconds in this schedule. Most later routes use 60-year requests, with shorter routes governed by their available historical/display windows. Actual encoded moving-dot evidence is reported with the video QA below. These transit values are animation choices, not historical caravan speeds or personal lifetimes.

## 9. Reproducibility and verification

Relevant implementation files are [the Roma builder](../../../scripts/prepare-roma-atlas.mjs), [broad-area sampler](../../../scripts/roma-landscapes.mjs), [population ledger](../../../src/data/population-ledger.ts), [standing slots](../../../src/sim/standing-slots.ts), [narrative camera](../../../src/map/narrative-camera.ts) and [video exporter](../../../scripts/export-roma-video.mjs). The local guide is ROMA_ATLAS.md (private preparation notes).

The completed local video is `outputs/Roma-Migrations-Continuous-Journeys-200-2025-20261116T134954Z.mp4`, with its sibling `Roma-Migrations-Continuous-Journeys-200-2025-20261116T134954Z.json` audit. It is **90.250000 seconds**, **2,166 frames**, 1920×1080 at 24 fps, H.264/yuv420p, 67,516,781 bytes. The timeline occupies 88.25 seconds and the closing hold 2 seconds. Full FFmpeg decoding and isolated-browser playback passed. Three seeks at 0.09025, 45.125, 90.15975 seconds decoded correctly; playback advanced 0.907705 seconds. Both monitored and actually loaded source-change lists are empty, and the audit records no errors. The file's SHA-256 is `31267ce3fcb30025dbd767fb742d0fe6b9d0e90819eb822d1d6eae22c3ec15c9`.

All 2,166 encoded camera poses were measured. Maximum pan is 7.063725 pixels/frame and maximum zoom change 0.01101/frame; maximum pan acceleration is 0.101814 pixels/frame² and zoom acceleration 0.000118/frame². There are 0 inward-zoom frames and 0 horizontal reversals.

The full timeline engine proof sampled 2,119 frames and found maximum population-accounting error 0.000041 people. Its 17,406 early moving-dot samples were in view without regional clipping; minimum edge clearance was 20.662732 pixels. All 54 pools connect to the Indian opening roots, and all 35 progressive support schedules require a living resident lineage. In the export's per-frame motion records, every recorded early-route dot position was visible. Fully observed early cohorts crossed progress 0.08→0.92 over at least 24 frames and passed the 98% visibility criterion; a partially recorded tail is not presented as a complete-journey check.

Individual transits in four dated coercive episodes remain shorter than one frame at the fixed clock: `W-16-DETAINED`, `W-16-RELEASE`, `W-23`, `W-24`. Their collective release windows can span several frames even when a particular dot's transit is shorter than one frame. Across those four episodes, 52 unit slots have no sampled moving frame. They retain their narrow detention/deportation/return timing and are disclosed exceptions; no ordinary journey has an unsampled transfer. Detention, deaths and returns still debit and credit the same funded populations.

Decoded frames at 5, 15 and 25 seconds and the ending were visually reviewed. They show the physical basemap, visible India→Iran→Anatolia progression, the southern Syrian branch, Iraqi stocks appearing after arrivals, and the retained dispersed European/Anatolian ending.

Validation passed **10 Roma regressions**, all nine estimate/unit combinations and every actual journey-arrival window; **40 focused continuity/lineage/camera tests**; the final **410-test full suite with zero failures**; TypeScript checking; the production build; and the Pages asset/path check. Twelve isolated-browser groups passed for sources, filters, scenarios, storage/preferences, camera controls, regional footprints and narrow layouts, with 1,984 late-view dots. That browser run preceded the final unit-fit/W-19 timing adjustment; the final frozen bundle is independently covered by the model/engine checks and completed export above. The rendered regional dot count is not a world census. Earlier video metrics describe a superseded snapshot.

These checks establish implementation behaviour, connected population accounting and playable output. They do not establish independent historical verification of every citation, exact route, date, population scenario, resource weight or proposed genealogy. Source metadata/link checks are narrower than reading an entire book. Remaining conflicts and inaccessible citations are retained in the catalogue.

### Snapshot identifiers

SHA-256 values for the complete prepared working snapshot, before any public sanitization:

| Artifact | SHA-256 |
| --- | --- |
| Original supplied text, held privately | `ad528f20b62f64de963ee4107a6e6b209f4a3daacda49d397bb53974f5283ebf` |
| Prepared atlas catalogue | `8650f771785af8ce06394ec85b54522b204d2c52c856d9d87a9946f39e9ccda9` |
| Population model | `83be06341dc44dbe7556838b0ee30764f5f72f0cd807b7fb4d8815c17f912716` |
| Ledger | `e3cf65e7b629669b79511bfa9514361f8bbf7ed03e9183cbfa583ac10ac1e962` |
| Geography | `9ac0f8228b641d6dad565358752336abf49446962e4cfd95ae1104fb48a34e33` |
| Journeys | `f657c1a956ab447a9a9c63a644ecbe56f5e51880e6583c2cf6a7290c703a8827` |
| Retained source register | `d10f1c25d2216d1b7e345837a92021be727accb362932c8d2b9fe0917e9ea800` |
| Separate presence extensions | `0f75dffcbf2bfabb356e0910d3f2020393e5787780639166e411f6a605c35709` |
| Preparation review | `8554b2382514804d497dea89624f5ad3b28b8f6118640674fb9278a994591832` |

## 10. Sources and access conventions

The catalogue groups historical scholarship, mediated primary texts, genetics, contemporary fieldwork, institutional summaries, environmental data and weaker leads. Repeated works and mirrors are not independent corroboration. A publisher page can verify a title, author and DOI without providing full-text access. Search snippets and inaccessible mirrors are not substitutes for examining the cited passage.

Bibliographic/source-link review date: **15 November 2026**. Exact pages are supplied only where retained or checked; a page number inherited from the brief is identified as such. Modern source titles retain their published terminology. This catalogue documents sources, including weaknesses, rather than endorsing every claim in them.

## 11. Bibliography: original supplied source catalogue

### R01 — Matras, Roma language and culture

Yaron Matras. 2015. “Roma Language and Roma Culture.” In *Romani Worlds: Academia, Policy, and Modern Media: A Selection of Articles, Reports, and Discussions Documenting the Achievements of the European Academic Network on Romani Studies*, edited by Eben Friedman and Victor A. Friedman, pp. 333–341 (including references). Cluj-Napoca: Editura Institutului pentru Studierea Problemelor Minorităţilor Naţionale. ISBN 978-606-8377-40-7.

**Identified, institutional PDF.** [Supplied chapter PDF](https://migrom.humanities.manchester.ac.uk/wp-content/uploads/2016/01/Matras_2015e1.pdf). The normalized register’s title “Romani language history” is a descriptive label, not the actual chapter title. Printed p. 336 is the report’s locator. The final printed page is341, not340. This is linguistic/cultural scholarship and policy discussion, not a contemporary migration register.

### R02 — Matras, Romani: A Linguistic Introduction

Yaron Matras. 2002. *Romani: A Linguistic Introduction*. Cambridge: Cambridge University Press. DOI [10.1017/CBO9780511486791](https://doi.org/10.1017/CBO9780511486791). ISBN 978-0-521-63165-5. 

**Identified; supplied link is a mirror.** [Supplied PDFCoffee link](https://pdfcoffee.com/yaron-matras-romani-a-linguistic-introduction-cambridge-university-press-2002-pdf-free.html); [University of Manchester publication record](https://research.manchester.ac.uk/en/publications/romani-a-linguistic-introduction/); [Cambridge frontmatter](https://assets.cambridge.org/97805216/31655/frontmatter/9780521631655_frontmatter.pdf). The source cites many printed pages, including1–3,7–10,18,22–23,26,30,42–46,55–59,140,214–237 and226–227. These locators are inherited from the report, not all independently passage-checked here. R10 is another index of the same book.

### R03 — Font-Porterias et al., 2020 genome study

Neftali Font-Porterias et al. 2020. “Recent Common Origin, Reduced Population Size, and Marked Admixture Have Shaped European Roma Genomes.” *Molecular Biology and Evolution* 37(11):3175–3187. DOI [10.1093/molbev/msaa156](https://doi.org/10.1093/molbev/msaa156).

**Identified; institutional repository item.** [Supplied UPF download](https://repositori.upf.edu/bitstreams/0fa19a36-5a84-4f2b-b4de-aef4b8844a05/download); [UPF repository API version of the same bitstream](https://repositori-api.upf.edu/api/core/bitstreams/0fa19a36-5a84-4f2b-b4de-aef4b8844a05/content). The report’s combined “Font-Porterias 2019/2020” should be disaggregated: this UUID identifies the 2020 article; the distinct 2019 article is S01 below. Genetics describes sampled ancestry, admixture and inferred demographic history; it does not supply an observed number of people for each animation cohort.

### R04 — Kenrick historical dictionary

Donald Kenrick. 2007. *Historical Dictionary of the Gypsies (Romanies)*. 2nd edition. Historical Dictionaries of Peoples and Cultures7. Lanham, Maryland; Toronto; Plymouth, UK: Scarecrow Press. ISBN 978-0-8108-5468-0.

**Identified from title/CIP pages of supplied scan.** [Supplied Fundación Secretariado Gitano PDF](https://www.gitanos.org/documentos/1.1-KEN-his_HistoricalDictionaryoftheGypsies.pdf). The report chiefly cites chronology pp. xix–xxi, including literary traditions, documented presence and later events. Chronology entries are summaries of heterogeneous evidence, not all contemporary primary accounts.

### R05 — Unidentified CUNY PDF

**Unresolved.** [Exact supplied URL](https://academicworks.cuny.edu/cgi/viewcontent.cgi?article=1201&context=qc_pubs). The report cites p. 117, and for W03 says it cites “Matras 2004 p. 53 & De Goeje.” The endpoint returned403 during audit. No exact title/author/year or corresponding repository item was securely identified. Do not silently assign `/qc_pubs/201/` to this download: that page’s current download parameter is article1207 and does not establish the identity of article1201. Retain this URL and the report’s claim as an unverified research lead.

### R06 — Matras, A Grammar of Domari

Yaron Matras. 2012. *A Grammar of Domari*. Mouton Grammar Library59. Berlin/Boston: De Gruyter Mouton. ISBN 978-3-11-028914-5; eISBN 978-3-11-029142-1.

**Identified; supplied link is a mirror.** [Supplied Scribd item](https://www.scribd.com/document/905350786/A-Grammar-of-Domari); [University of Manchester publication record](https://research.manchester.ac.uk/en/publications/a-grammar-of-domari/). The primary institutional record verifies author/title/year/publisher; the scan confirms series number and eISBN. The book principally describes Jerusalem Domari, with historical/dialectological comparison. Do not treat it as a headcount or an arrival census for all Dom communities.

### R07 — Mendizabal et al., 2012 genome study

Isabel Mendizabal et al. 2012. “Reconstructing the Population History of European Romani from Genome-Wide Data.” *Current Biology* 22(24):2342–2349. Online6 December 2012; issue18 December 2012. DOI [10.1016/j.cub.2012.10.039](https://doi.org/10.1016/j.cub.2012.10.039); PMID 23219723.

**Identified, bibliographic metadata.** [Supplied PubMed record](https://pubmed.ncbi.nlm.nih.gov/23219723/). A genetic date or inferred effective population size must remain distinct from an archival arrival date or a counted migration population.

### R08 — Moorjani et al., 2013 genome study

Priya Moorjani et al. 2013. “Reconstructing Roma History from Genome-Wide Data.” *PLoS ONE* 8(3):e58633. Published13 March 2013. DOI [10.1371/journal.pone.0058633](https://doi.org/10.1371/journal.pone.0058633).

**Identified, primary journal page.** [Supplied PLOS article](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0058633). Ancestry components and admixture clocks are not direct people counts. West Eurasian ancestry can include ancestry already present in South Asian source populations; it is not automatically post-departure European immigration.

### R09 — Marsh doctoral thesis

Adrian Richard Nathaneal Marsh. 2008. *“No Promised Land”: History, Historiography and the Origins of the Gypsies*. PhD thesis, University of Greenwich. British Library thesis identifier uk.bl.ethos.506100.

**Identified, institutional catalogue; PDF access limited.** [Supplied redacted thesis PDF](https://gala.gre.ac.uk/id/eprint/8151/4/Adrian%20Marsh%202008%20-%20redacted.pdf); [University of Greenwich item record](https://gala.gre.ac.uk/id/eprint/8151/). Catalogue and abstract accessible; PDF 403 in this audit. Report locator p. iv is inherited. This is historiographical scholarship explicitly examining contested narratives, not a newly discovered medieval eyewitness source. Do not confuse this thesis with Marsh’s chapters in R12.

### R10 — Duplicate Matras 2002 ResearchGate index

**Mirror/index of R02.** [Exact supplied ResearchGate item](https://www.researchgate.net/publication/344515862_Romani_A_Linguistic_Introduction). It lists Matras 2002 and the same DOI. Its visible “citing publications” snippets about Voskanian 2011 and Balabanian 2024 are not text from Matras 2002. Those snippets currently belong to a separately listed later article. They cannot independently establish the report’s W05 bibliography or turn those later references into passages from the 2002 book.

### R11 — World History Encyclopedia overview

Arienne King. 2023. “Romani.” *World History Encyclopedia*,3 April 2023.

**Identified, general reference/context.** [Supplied article](https://www.worldhistory.org/Romani/). Useful for broad orientation and terminology; not a primary historical record or a demographic source for a reconstructed cohort.

### R12 — We Are Here! Turkey report

*We Are Here! Discriminatory Exclusion and Struggle for Rights of Roma in Turkey*. 2008. European Roma Rights Centre/Helsinki Citizens’ Assembly/Edirne Roma Culture Research Development Assistance and Solidarity Association. The full editorial details are listed in E05 below; it is the same publication.

**Identified, primary publisher PDF of a modern field/human-rights report.** [Supplied ERRC PDF](https://www.errc.org/uploads/upload_en/file/we-are-here!-discriminatory-exclusion-and-struggle-for-rights-of-roma-in-turkey.pdf). The original report’s W06–08 references to “Marsh 2008 pp. 3,15” are inherited and should not be presented as newly verified page matches. The report contains historical synthesis and modern fieldwork, which have different evidentiary roles. This is the same URL as extension source ERRC-TURKEY-2008, not a second independent work.

### R13 — Ottoman performers chapter

Elena Marushiakova and Vesselin Popov. 2014. “Gypsy Musicians and Performances in the Ottoman Balkans.” In *Medieval and Early Modern Performance in the Eastern Mediterranean*, edited by Arzu Öztürkmen and Evelyn Birge Vitz, pp. 327–341. Late Medieval and Early Modern Studies20. Turnhout: Brepols. DOI [10.1484/M.LMEMS-EB.1.102276](https://doi.org/10.1484/M.LMEMS-EB.1.102276).

**Identified; supplied link is a ResearchGate index.** [Supplied link](https://www.researchgate.net/publication/299929311_Gypsy_Musicians_and_Performances_in_the_Ottoman_Balkans); [publisher volume](https://www.brepols.net/products/IS-9782503546919-1). Historical scholarship using Ottoman evidence; do not equate tax households or occupational observations with a complete resident population.

### R14 — Soulis medieval history article

George C. Soulis. 1961. “The Gypsies in the Byzantine Empire and the Balkans in the Late Middle Ages.” *Dumbarton Oaks Papers* 15:141,143–165 (JSTOR’s exact pagination; conventionally cited141–165). DOI [10.2307/1291178](https://doi.org/10.2307/1291178).

**Identified, original journal metadata; supplied link is an index.** [Supplied Semantic Scholar record](https://www.semanticscholar.org/paper/The-Gypsies-in-the-Byzantine-Empire-and-the-Balkans-Soulis/4debcc6d383ac3c4a1cda3135372a3eee0590a4a); [JSTOR journal record](https://www.jstor.org/stable/1291178). The report inherits locators141–165/142–165 and146–147. This article mediates many early chronicles; those chronicles were not independently checked in original languages for this atlas.

### R15 — Furtună, Tismana memory and slavery

Adrian-Nicolae Furtună. **2022**. “Les lieux de mémoire and the Legacies of Roma Slavery in the Collective Memory. Case Study in Tismana, Gorj County, Romania.” *Sociologie Românească*20(2):168–196. DOI [10.33788/sr.20.2.8](https://doi.org/10.33788/sr.20.2.8).

**Identified, primary journal PDF.** [Supplied article](https://www.revistasociologieromaneasca.ro/sr/article/download/1764/1687). Printed p. 169 is the report’s locator for Achim2004p.10. The source’s separate unspecified “Furtună2023” lead must not be assumed to be this 2022 article. This is secondary scholarship with a modern memory-study component.

### R16 — English Wikipedia, Romanian slavery

**Context/tertiary, mutable.** [Exact supplied page](https://en.wikipedia.org/wiki/Slavery_in_Romania). Preserve the link as part of the report’s citation trail. Use the Council of Europe abolition factsheet and identified historical scholarship for the derived correction to 1855/1856; the supplied report’s 1861 abolition claim remains unchanged in the original text.

### R17 — French Wikipedia, Romanian slavery

**Context/tertiary, mutable.** [Exact supplied page](https://fr.wikipedia.org/wiki/Esclavage_en_Roumanie). Another language edition is not automatically independent evidence for the same demographic or chronology claim.

### R18 — Smith, Gipsy Life

George Smith. 1880. *Gipsy Life: Being an Account of Our Gipsies and Their Children. With Suggestions for Their Improvement*. London: Haughton & Co. Project Gutenberg ebook28548, released9 April 2009, transcription of the 1880 book.

**Identified historical/antiquarian text, freely readable transcription.** [Supplied Gutenberg text](https://www.gutenberg.org/files/28548/28548-h/28548-h.htm). A primary source for an 1880 reformer’s attitudes and descriptions; a later retelling for Maria Theresa’s eighteenth-century measures, not the original1768 decree. Its assimilationist language requires historical context.

### R19 — Heng, World III

Geraldine Heng. 2018. “World III: ‘Gypsies’: A Global Race in Diaspora, A Slave Race for the Centuries.” Chapter7 in *The Invention of Race in the European Middle Ages*, pp. 417–456. Cambridge University Press. DOI [10.1017/9781108381710.008](https://doi.org/10.1017/9781108381710.008).

**Identified, primary publisher metadata/preview.** [Supplied Cambridge chapter](https://www.cambridge.org/core/books/invention-of-race-in-the-european-middle-ages/world-iii/47FE6A4E9B8624C973B7FA120253992C). Publisher online date26 February 2018. The report cites Fraser1992pp.62–63,72–73 via this chapter; keep the mediated relationship explicit.

### R20 — Matras interview

Yaron Matras, interviewed by Toby Ash. “The Best Books on Romani History and Culture.” *Five Books*,6 March 2014, updated6 April 2021.

**Identified, interview/context.** [Supplied interview](https://fivebooks.com/best-books/yaron-matras-on-romani-history-and-culture/). It discusses Richard Pym’s *The Gypsies of Early Modern Spain* among other works. The interview is not that book and is not a primary record of medieval acrobats or Iberian arrivals.

### R21 — Costa, Portuguese colonial exile

Elisa Maria Lopes da Costa. 1998. “O povo cigano e o degredo: contributo povoador para o Brasil colônia.” *Textos de História* 6(1–2):35–56.

**Identified from the article, with an institutional metadata conflict.** [Supplied Scribd copy](https://pt.scribd.com/document/219560530/cigano-elisacosta); [University of Brasília journal PDF](https://periodicos.unb.br/index.php/textos/article/download/27776/23878/); [journal catalogue](https://periodicos.unb.br/index.php/textos/article/view/27776). The PDF prints Costa/1998 and the title above. The catalogue currently misspells the author as “Cunha,” misspells words in the title, and shows a 2012 upload/publication timestamp while assigning the issue to 1998. Prefer the printed article for citation. The report’s “1998 p. 6” appears to be an internal PDF-page locator, not printed p. 6. Its Costa1997p.47 is a different work, S08 below.

### R22 — Fotta, Bahia social hierarchy

Martin Fotta. 2020. “The Figure of the Gypsy (Cigano) as a Signpost for Crises of the Social Hierarchy (Bahia,1590s–1900 s).” *International Review of Social History* 65(2):315–341. First published online 8 November 2019. DOI [10.1017/S0020859019000713](https://doi.org/10.1017/S0020859019000713).

**Identified, primary journal page.** [Supplied Cambridge article](https://www.cambridge.org/core/journals/international-review-of-social-history/article/figure-of-the-gypsy-cigano-as-a-signpost-for-crises-of-the-social-hierarchy-bahia-1590s1900s/2B1DFA8D624ED622E7B8A3DCE4B1B221). “Fotta 2019” in the report reflects the online date; the journal issue is 2020. Historical analysis, not a cumulative migrant census for1538–1750.

### R23 — Unresolved Pieroni PDF

**Unresolved access/title.** The report attributes this to “Pieroni,” with no complete bibliographic details. [Exact supplied HTTP URL](http://www.precog.com.br/bc-texto/obras/2019-pack-109.pdf). It redirected to HTTPS and timed out during audit. Do not infer the book title or publication year from the generic filename or assign 2019 as the work’s date. Preserve as a research lead.

### R24 — Wikipedia, Gran Redada

**Context/tertiary, mutable.** [Exact supplied page](https://en.wikipedia.org/wiki/Great_Gypsy_Round-up). Report names Gómez Alfaro 1993 and Martínez Martínez 2017 through this page; those are separate partial bibliographic leads below. Detentions, deaths in custody, subsequent releases and the total Spanish population are different quantities.

### R25 — CHACHIPEN Spain report

Pedro Casermeiro Cortés and Anabel Carballo-Mesa. 2022. *Antigypsyism in Spain: Democratic Memory and Accountability of Franco’s Regime*. CHACHIPEN National Research Report,14 November 2022,63PDF pages.

**Identified, institutional project report.** [Supplied report](https://antigypsyism.eu/wp-content/uploads/2023/07/CHACHIPEN_-D2_2_CHACHIPEN-National-Research-Report-on-Spain.pdf). The 2023 upload path is not its printed publication date. Historical background on the1749 roundup is secondary synthesis; twentieth-century sections include original oral-history research. The report’s W16 locator is p. 12.

### R26 — Hancock, We Are the Romani People

Ian Hancock. 2002. *We Are the Romani People* (*Ame sam e Rromane džene*). Interface Collection28. Hatfield: University of Hertfordshire Press; Centre de recherches tsiganes. ISBN 978-1-902806-19-8.

**Identified; supplied link is a mirror.** [Supplied Scribd copy](https://www.scribd.com/document/967616632/we-are-the-romani-people-ian-hancock); [University of Hertfordshire book listing](https://herts.estore.flywire.com/products/We-are-the-Romani-People-429777). Source locators p. 31 and p. xii are inherited. Distinguish its historical argument, including contested origin hypotheses, from a contemporary population register.

### R27 — Brazilian collected articles PDF

**Partly identified by supplied filename only; access unresolved.** *Coletânea de Artigos — Povos Ciganos — Direitos e Instrumentos Para a Sua Defesa* (descriptive filename title; editor/year not established here). [Exact supplied Porto Alegre municipal-hosted PDF](https://prefeitura.poa.br/sites/default/files/usu_doc/hotsites/sms/bvaps-biblioteca-virtual-de-atencao-primaria-saude/Colet%C3%A2nea%20de%20Artigos%20-%20Povos%20Ciganos%20-%20Direitos%20e%20Instrumentos%20Para%20a%20Sua%20Defesa.pdf). Fetch timed out. A municipal host does not by itself establish original publisher or validate every item in a compilation. Do not present it as a verified aggregate count of Roma arrivals in the Americas.

### R28 — Illuzzi, genocide chapter

Jennifer Illuzzi. 2023. “The Genocide of the Romani People in Europe.” Chapter14 in *The Cambridge World History of Genocide*, volume 3, *Genocide in the Contemporary Era,1914–2020*, edited by Ben Kiernan, Wendy Lower, Norman Naimark and Scott Straus, pp. 335–357. Cambridge University Press. DOI [10.1017/9781108767118.015](https://doi.org/10.1017/9781108767118.015).

**Identified, publisher metadata/preview.** [Supplied chapter](https://www.cambridge.org/core/books/cambridge-world-history-of-genocide/genocide-of-the-romani-people-in-europe/C07A518B80A216EC0BAFC5108E41E4E8); [publisher volume contents](https://assets.cambridge.org/97811084/87078/toc/9781108487078_toc.pdf); [author’s institutional record](https://faculty.providence.edu/en/publications/the-genocide-of-the-romani-people-in-europe/). The report’s W22 locator “Reinhartz, fn.54–55” is a mediated citation, not a separately reviewed source. The European genocide total already encompasses regional victim subsets; never add W22/W23 deaths on top of it as separate continental totals.

### R29 — Patrin reading list

*The Patrin Web Journal*. “Further Reading About Roma (Gypsies).” Archived/mirrored reading list; named author/date not established.

**Identified as a bibliography/context, not original records.** [Exact supplied OoCities mirror](https://www.oocities.org/~patrin/reading.htm). The report uses it to name Kenrick and Puxon 1995 and a 1993 Auschwitz memorial book. A reading list does not independently verify quotations, victim counts or the contents of every listed book. Named works remain separate catalogue leads.

### R30 — Achim, RomArchive Romania

Viorel Achim. “Romania.” In *RomArchive: Voices of the Victims*. Date not shown in the opened article; do not assign one without a record.

**Identified, signed scholarly institutional overview.** [Supplied article](https://www.romarchive.eu/en/voices-of-the-victims/romania/). Its stated approximately 25,000 deported, approximately 11,000 deaths, approximately 2,000 early escapes/repatriations and12,000 spring 1944 returns should remain distinct. The atlas’s central25,000−15,000−10,000 accounting is a model scenario, not Achim’s preferred death/survival estimate.

### R31 — Ionescu, Deportations from Romania

Vasile Ionescu. *Deportations from Romania*. Council of Europe, Education of Roma Children in Europe, *Factsheets on Romani History* 5.5,8PDF pages. Printed year not established in this audit.

**Identified, institutional educational synthesis.** [Supplied Council of Europe PDF](https://rm.coe.int/deportations-from-romania-factsheets-on-romani-history/16808b1c27). Author visible on first page. The document is historical synthesis with reproduced documents/illustrations; the original administrative documents are not automatically separate independently reviewed atlas sources.

### R32 — Matei, Transnistria local initiatives

Petre Matei. 2022. “Roma Deportations to Transnistria during World War Two: Between Centralised Decision-Making and Local Initiatives.” *S:I.M.O.N.—Shoah: Intervention. Methods. Documentation* 9(2):26–50. DOI [10.23777/sn.0222/art_pmat01](https://doi.org/10.23777/sn.0222/art_pmat01).

**Identified, primary journal PDF.** [Supplied VWI article](https://simon.vwi.ac.at/index.php/simon/article/download/219/157). Contemporary archival research analyzed in modern scholarship. Local police identification,1930 self-declared ethnicity,1942 selection lists and deportee counts use different units and scopes.

### R33 — Petráš, Czech minority legal status

René Petráš. 2015. “The Creation and Legal Status of the Slovak, Roma and Vietnamese Minorities in the Czech Republic.” *Acta Humana* 2015/4:39–46.

**Identified, primary journal PDF.** [Supplied article](https://folyoirat.ludovika.hu/index.php/actahumana/article/download/2692/1953). Report locators pp. 42–43. A legal/historical secondary study, not the original 1947 registration itself. Its survivor counts and migrant registration figures must not be merged into one statistic.

### R34 — Glassheim, Czechoslovak borderlands

Eagle Glassheim. 2016. *Cleansing the Czechoslovak Borderlands: Migration, Environment, and Health in the Former Sudetenland*. Pittsburgh: University of Pittsburgh Press. Russian and East European Studies. ISBN 978-0-8229-6426-1.

**Identified; supplied link is a ResearchGate index.** [Supplied link](https://www.researchgate.net/publication/313367206_Cleansing_the_Czechoslovak_borderlands_Migration_environment_and_health_in_the_former_Sudetenland); [publisher record](https://upittpress.org/books/9780822964261/). Publication metadata verified; no claim to have read the whole book or independently confirmed every report locator. The report’s accompanying Pavelčíková2004 citation is a different work.

### R35 — Marushiakova and Popov, Two Patterns

Elena Marushiakova and Vesselin Popov. 2013. “Two Patterns of Roma Migrations from Southeastern Europe.” In *Migration from and towards Bulgaria 1989–2011*, edited by Tanya Dimitrova and Thede Kahl, pp. 227–244. Forum: Bulgarien2. Berlin: Frank & Timme. ISBN 978-3-86596-520-2.

**Identified from author-upload citation and publisher volume contents; supplied link is an author-upload/index.** [Supplied ResearchGate item](https://www.researchgate.net/publication/262141807_Two_Patterns_of_Roma_Migrations_from_Southeastern_Europe); [publisher volume](https://www.frank-timme.de/en/programme/product/migration_from_and_towards_bulgaria_19892011). ResearchGate’s May 2014 date is upload date; printed citation is 2013. Its Reyniers 1999 and Uherek 2007 references are mediated, not new independent headcount evidence.

### R36 — Unresolved Matras Language Contact attachment

**Unresolved exact edition/work and inaccessible attachment.** [Exact supplied Google Groups URL](https://00438843233420474465.googlegroups.com/attach/9bc89e27e510/matras_Language_Contact.pdf). The tool could not access the URL. The filename alone does not establish that it is Matras’s monograph *Language Contact*, any particular edition or a Roma migration article. Keep the report’s “Matras” attribution as an inherited lead; do not fill author/year/pages from inference.

### R37 — Migration vs. Inclusion

Elena Marushiakova and Vesselin Popov. 2018. “Migration vs. Inclusion: Roma Mobilities from East to West.” *Baltic Worlds* 2–3:88–100. Website date6 September 2018.

**Identified, journal publication.** [Supplied journal article](https://balticworlds.com/migration-vs-inclusion-roma-mobilities-from-east-to-west/). Its references identify R35 and the Reyniers/Uherek works. Qualitative migration typology and inclusion analysis do not establish the atlas’s continental low/central/high mobile population totals.

### R38 — Oxford 2010 conference papers

*Romani Mobilities in Europe: Multidisciplinary Perspectives*. International Conference, University of Oxford,14–15 January 2010. Conference papers compilation,230PDF pages. In particular Elena Marushiakova and Vesselin Popov, “Gypsy/Roma European Migrations from 15th Century till Nowadays,” printed pp. 100–105.

**Identified, conference compilation; varying review/publication status.** [Exact supplied Euromanet PDF](https://www.euromanet.eu/upload/04/56/conference-papers_UK_2010.pdf). Its table of contents identifies the relevant contribution; it is not a single authored demographic study. Some other included contributions expressly describe themselves as work in progress. Do not imply uniform peer review, final publication or a verified 2025 census.

## 12. Additional named works and incomplete leads

These references appear in the report’s introduction or as nested citations. They must be represented even where insufficient information prevents a complete citation. The list does not expand every bibliography in every cited work; that would be a new literature search rather than documenting retained evidence.

| ID | Work / retained lead | Identification and limits |
| --- | --- | --- |
| S01 | Neftali Font-Porterias et al.2019. “European Roma Groups Show Complex West Eurasian Admixture Footprints and a Common South Asian Genetic Origin.” *PLoS Genetics* 15(9):e1008417. DOI[10.1371/journal.pgen.1008417](https://doi.org/10.1371/journal.pgen.1008417). | [Primary journal page](https://journals.plos.org/plosgenetics/article?id=10.1371/journal.pgen.1008417). Distinct from R03, not an alternative year for the same paper. |
| S02 | David Gresham et al.2001. “Origins and Divergence of the Roma (Gypsies).” *American Journal of Human Genetics* 69(6):1314–1331. DOI[10.1086/324681](https://doi.org/10.1086/324681). | [PubMed](https://pubmed.ncbi.nlm.nih.gov/11704928/), [author-lab PDF](https://greshamlab.bio.nyu.edu/wp-content/uploads/2014/08/Am-J-Hum-Genet-2001-Gresham.pdf). Introductory uniparental genetic context. |
| S03 | Niraj Rai et al.2012. “The Phylogeography of Y-Chromosome Haplogroup H1a1a-M82 Reveals the Likely Indian Origin of the European Romani Populations.” *PLoS ONE* 7(11):e48477. DOI[10.1371/journal.pone.0048477](https://doi.org/10.1371/journal.pone.0048477). | [PubMed](https://pubmed.ncbi.nlm.nih.gov/23209554/). Published28 November 2012. Introductory genetic context; a haplogroup percentage is not the census population of a migrating group. |
| S04 | Isabel Mendizabal et al.2011. “Reconstructing the Indian Origin and Dispersal of the European Roma: A Maternal Genetic Perspective.” *PLoS ONE* 6(1):e15988. DOI[10.1371/journal.pone.0015988](https://doi.org/10.1371/journal.pone.0015988). | [Primary journal](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0015988). Distinct from R07. |
| S05 | Ralph L. Turner.1926. “The Position of Romani in Indo-Aryan.” *Journal of the Gypsy Lore Society*, third series5(4):145–189; separate 1927 monograph reprint. | [Cambridge scan of Turner bibliography](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/120FFDD612ACED44409617749239BA04/S0041977X00061619a.pdf/bso_volume_20_issue_1_cover_and_front_matter.pdf) establishes metadata. Historical comparative linguistics; source gives no separate direct URL. |
| S06 | John Sampson 1927. | Report names year and argument but no exact work/title/pages. Possible debate around Turner, but identification not secure; preserve as partial lead, do not substitute Sampson’s 1926 *The Dialect of the Gypsies of Wales* automatically. |
| S07 | Franz Miklosich 1872–1880. *Über die Mundarten und die Wanderungen der Zigeuner Europa’s*, twelve parts. Vienna: Karl Gerold’s Sohn / imperial academy series. | Historical linguistic research. Report gives author/date only; [University of Graz archival annotation](https://gams.uni-graz.at/o%3Ahsa.letter.2810/sdef%3ATEI/get?locale=de) discusses the series with an 1872–1881 span. Preserve the report’s date and record catalogue variants; no single narrow route or exact departure date follows from the title. |
| S08 | Elisa Maria Lopes da Costa.1997. *O Povo Cigano entre Portugal e Terras de Além-Mar (Séculos XVI–XIX)*. Lisbon: Grupo de Trabalho do Ministério da Educação para a Comemoração dos Descobrimentos Portugueses. | Identified in R21’s bibliography, not independently page-checked. Report cites p. 47. Keep separate from Costa 1998/R21. |
| S09 | Angus Fraser. *The Gypsies*. Oxford: Blackwell,1992;2nded.1995. | [Publisher’s 1995 edition record](https://www.wiley.com/en-gb/the-gypsies-2nd-edition-p-9780631196051), ISBN 9780631196051. Report cites1992pp.45–59,46–47,62–63,72–73 and1995p.50; pagination is edition-sensitive and not all locators independently checked. |
| S10 | Elena Marushiakova and Vesselin Popov.2001. *Gypsies in the Ottoman Empire*. Hatfield: University of Hertfordshire Press. | Identified as a separate work in R37 references. Report cites p. 27; full book not read here. R13 is a separate 2014 chapter. |
| S11 | Viorel Achim.2004. *The Roma in Romanian History*. Budapest/New York: Central European University Press. | Named in R30 literature and R15. Report cites p. 10 via R15. Do not imply the original monastic charter was independently inspected. |
| S12 | Yaron Matras.2004. “The Role of Language in Mystifying and Demystifying Gypsy Identity.” In *The Role of the Romanies*, edited by Nicholas Saul and Susan Tebbutt, pp. 53–78. Liverpool University Press. DOI[10.5949/liverpool/9780853236795.003.0005](https://doi.org/10.5949/liverpool/9780853236795.003.0005). | [Publisher/platform metadata](https://academic.oup.com/liverpool-scholarship-online/book/23034/chapter-abstract/183839722); [author publication list](https://yaronmatras.org/publications/). Plausible match for report’s Matras2004p.53; not established as the match for its conflictingp.46. Matras also published a 2004 review “A Conflict of Paradigms,” *Romani Studies* 14(2):193–209. Preserve ambiguity instead of assigning every 2004 reference to one work. |
| S13 | Ian Hancock 2000, military-koïné hypothesis. | Partial report lead, no exact full citation. The titled chapter “The Emergence of Romani as a Koïné outside of India” is mentioned in later references with publication-year variants; not independently pinned to an edition here. R26 p. 31 is the report’s better identified companion source. Keep hypothesis status visible. |
| S14 | V. Voskanian2011p.811; Balabanian 2024. | Partial leads. A later journal bibliography identifies Voskanian’s “Lomavren jazyk” in *Jazyki mira. Novye Indoarijskie jazyki*, pp. 811–818, but the original chapter was not checked. Balabanian 2024 exact title/publication unestablished. R10’s citation snippets are not their primary publications. |
| S15 | M. J. de Goeje; Neagu Djuvara. | Named authorities in the retained narrative without a securely matched full work/year/page. No direct primary text supplied. Do not invent complete citations. |
| S16 | Judith Okely; Wim Willems. | Intro names only. R01 references identify Okely 1983 *The Traveller-Gypsies* (Cambridge University Press) and Willems 1997 *In Search of the True Gypsy: From Enlightenment to Final Solution* (Routledge), but the report does not explicitly establish which works its critique concerns. Context/history of scholarship, not source population counts. |
| S17 | Antonio Gómez Alfaro 1993; Manuel Martínez Martínez 2017. | Named via R24. Exact editions/titles not checked in this bounded audit. Preserve partial bibliographic status; do not treat the Wikipedia attribution as reading the books. |
| S18 | Donald Kenrick and Grattan Puxon.1995. *Gypsies under the Swastika*. Hatfield: University of Hertfordshire Press. | Identified in R04/R29 and [USHMM institutional bibliography](https://www.ushmm.org/m/pdfs/Publication_OP_2002-06.pdf). Report’s numerical use not independently page-checked. |
| S19 | *Memorial Book: The Gypsies at Auschwitz-Birkenau* 1993. | Report names title/year via R29; exact multilingual edition/editor/imprint not independently established here. Do not fabricate editorial responsibility or a camp-wide number from the reading-list mention. |
| S20 | Reinhartz (Illuzzi footnotes54–55); Radu Ioanid (unspecified RFE/RL item); Michelle Kelso; Furtună2023. | Partial victim/deportation-estimate leads. Retain the disagreements with attribution. Do not convert them into complete independently verified sources or silently replace Furtună2023 with R15/2022. |
| S21 | Nina Pavelčíková2004. | Partial report lead beside R34. No exact title/edition/page established in this audit; do not imply the Glassheim ResearchGate page is Pavelčíková’s work. |
| S22 | Alain Reyniers.1999. *Evaluation of Gypsy Populations and Their Movements in Central and Eastern Europe and in Some OECD Countries*, focusing on migration, asylum, demography and employment. OECD occasional paper, Paris. | Bibliographic wording identified in R37, not the original OECD document. Retained nested source, not independently read. |
| S23 | Zdeněk Uherek.2007. “Romské migrace ze Slovenska v kontextu evropských migračních trendů.” *Sociologický časopis / Czech Sociological Review* 43(4):747–774. | Identified in R37’s bibliography; report locator p. 750. Original article not independently read here. |

## 13. Wave-to-reference crosswalk

This table describes what the retained synthesis cites. It does not assert that each linked work proves every claim in the row, that the report’s locators are correct, or that the works are independent. Later correction and extension references are catalogued separately in sections 15–16.

| Report row | Original references and inherited locators |
| --- | --- |
| W01 | R01 p. 336; R02 pp. 18,30,42–46; R03/S01 as conflated “2019/2020,” pp. 2–3. |
| W02 | R04 p. xix; unidentified R05 p. 117. |
| W03 | Unidentified R05 p. 117, nested S12/Matras2004p.53 and S15/deGoeje; R06. |
| W04 | R07,R08; R02 pp. 23,26; R26 p. 31; R09 p. iv; S13 as contested alternative. |
| W05 | R02/ambiguous Matras2004p.46; R10 index; R11; S14/Voskanian2011p.811 and Balabanian 2024. |
| W06 | R12 pp. 3,15, nested S09/Fraser1992pp.46–47 and R14 pp. 142–165; R13; R08. |
| W07 | R04 pp. xix–xx; R14 pp. 141–165; R12 with S09/Fraser1992pp.45–59 and1995p.50. |
| W08 | R04 pp. xix–xxi; R02 pp. 7–8,56–58,226; S10 p. 27; R13; R03/S01 “2019/2020.” |
| W09 | S11/Achim2004p.10 mediated through R15 p. 169; R16,R17; R02 p. 22. |
| W10 | R04 pp. xix–xxi; R02 pp. 9,22; R18’s account of Maria Theresa1768. |
| W11 | R04 pp. xix–xxi; S09/Fraser1992pp.62–63,72–73 mediated through R19; R02 pp. 9–10,22,55–59. |
| W12 | R04 pp. xix–xxi; R20; Gregoras mediated through R14 pp. 146–147. |
| W13 | R04 pp. xx–xxi; R02 pp. 3,9–10,55–59. |
| W14 | R04 pp. xx–xxi; R02 pp. 22,55–59,140,218. |
| W15 | R04 p. xxi; S08/Costa1997p.47 and R21/Costa1998p.6; R22; unresolved R23/Pieroni. |
| W16 | R24 with S17/GómezAlfaro 1993 and MartínezMartínez 2017; R25 p. 12. |
| W17 | R02 pp. 7–8,22,226–227; R16. |
| W18 | R16; R02 pp. 7–9,22; R26 p. xii. |
| W19 | R16; unresolved R27. |
| W20 | R02 p. 7. |
| W21 | R28; S18/Kenrick&Puxon 1995 and S19/memorial 1993 through R29; R33 p. 43. |
| W22 | R28’s nested Reinhartz references, footnotes54–55. |
| W23 | R30,R31,R32; S20/Furtună2023 and unspecified RFE/RL/Ioanid; competing Kenrick&Puxon/Kelso estimates named in narrative. |
| W24 | R28,R30; competing survivor estimates linked in narrative to Kenrick&Puxon/Kelso. |
| W25 | R33 pp. 42–43; R02 p. 9; R34/Glassheim 2016 plus S21/Pavelčíková2004. |
| W26 | R35; unresolved R36. |
| W27 | R35 with S22/Reyniers 1999 and S23/Uherek2007p.750; R37. |
| W28 | R35; R38. |

## 14. Underlying primary texts and documentary records

The bibliography should distinguish a contemporary text from a modern study quoting or interpreting it. The supplied synthesis does not provide critical editions, original-language transcriptions or archive shelfmarks for most of the items below. Naming them documents the evidentiary chain; it does not establish that this project independently inspected them.

| Named text or record family | Role and qualification |
| --- | --- |
| Persian literary traditions about Ardashir and Bahram Gur | Later literary accounts, mediated through Kenrick/linguistic historiography; the supplied report does not identify a complete critical edition or primary text. Not contemporary Sasanian passenger lists and not evidence that the European Roma, Dom and Lom were one counted cohort. |
| *Life of St George the Athonite*, attributed in the report to George Hucesmonazoni | Hagiographic narrative of an event dated1054, composed after the saint’s death in1065. The report’s transliterated attribution and ethnic identification need a critical edition before being treated as philologically verified. A narrated event date is not the manuscript’s composition date or a first-arrival date. |
| Theodore Balsamon’s late-twelfth-century canonical commentaries | Observations and terminology mediated via modern historical scholarship. Identification of exonyms with later Romani-speaking communities is interpretive. |
| Nikephoros Gregoras’s acrobat descriptions | Early-fourteenth-century performers; no recorded Romani speech or self-ascription in the supplied material. Ethnic identification remains contested. |
| Simon Simeonis’s1323 pilgrimage narrative and the report’s other medieval travel observations | Dated observations mediated by Soulis/Kenrick and later writers. Presence is distinct from arrival and group size. No critical edition of the pilgrimage narrative is supplied. |
| Tismana1385 and Wallachian/Moldavian monastic charters/donations | Enslaved households/families recorded in particular acts; not all Romanian Roma and not automatically persons. Primary charters not independently inspected here. Source location error for Tismana corrected separately. |
| Ottoman tahrir/cizye rolls and Evliya Çelebi’s occupational/guild descriptions | Tax units, households, occupational associations and narrative observation. Converting hane or guild membership to residents requires explicit assumptions. |
| Sigismund/Friedrich safe-conducts and municipal notices; early Iberian, British and Nordic notices | Dated documentary visibility, potentially repeated notices of the same mobile group. Do not add every visit as a new population. |
| Andrew Boorde’s *Egipt speche* sentences, report dates1542/1547 | Early linguistic specimen, not a census. The competing bibliographic dates are retained; not resolved as a new critical-edition claim here. |
| Portuguese convict/degredo rolls; João Torres1574 banishment;1718 royal/Overseas Council orders | Sentence, departure, voyage and arrival are different events. A banishment order is not proof the person reached Brazil. Costa/R21 explicitly discusses these interpretive problems. |
| Spanish royal orders and administrative custody records surrounding1749 | Primary institutional evidence can be linked through Library of Congress separately. Number detained, total Spanish population, deaths and eventual releases differ. |
| Romanian 1930 census,1942 selection census and deportation lists; Transnistria administrative records | Self-identification, police classification and deportation totals are not interchangeable. Modern Achim/Matei/Ionescu analyses mediate these records. |
| Nazi and collaborating-regime camp, deportation and killing records; Auschwitz memorial lists | Records from distinct institutions with incomplete survival. European victim totals overlap regional subsets and do not equate to people arriving alive at one camp. |
| Czech/Slovak 1947 registrations and later resettlement policy documents | Registration/presence counts and transfers have distinct scopes; cited through Petráš and other modern studies. |

## 15. Contemporary Near Eastern and Anatolian sources

These five records support the separate presence extension. Modern fieldwork can identify communities and social conditions without establishing their medieval arrival dates or the atlas's regional headcounts.

### E01 — Syrian Dom refugees and Damascus presence

Yeşim Yaprak Yıldız. September 2015. *Nowhere to Turn: The Situation of Dom Refugees From Syria in Turkey*. ERRC-hosted report; research supported by the European Roma Rights Centre, with Kemal Vural Tarlan as research consultant. [Publisher PDF](https://www.errc.org/uploads/upload_en/file/nowhere-to-turn-september-2015.pdf).

**Modern field research plus historical background.** Relevant sections: §1.1, methodology, printed p. 11; §2.1, Syrian Dom, pp. 13–16; §4.1, pre-conflict life, p. 28. The research ran September 2014–January 2015. It supports modern Syrian regional presence, including Damascus, and refuge in Turkey. Its reported Syrian national estimates are weak secondary figures, not local counts. Its introductory ancient/medieval-origin narrative is not adopted as independent proof of the atlas's reconstructed early paths. Retained model source ID: `ERRC-SYRIA-2015`.

### E02 — Iraqi minorities legal and documentation report

Institute for International Law and Human Rights. May 2013. *Iraq’s Minorities and Other Vulnerable Groups: Legal Framework, Documentation and Human Rights*. [Retained institutional PDF](https://iilhr.org/wp-content/uploads/2022/08/4_Iraqs-Minorities-and-Other-Vulnerable-Groups-Legal-Framework-Documentation-and-Human-Rights_May2013_EN.pdf); [institute's publication-history confirmation](https://iilhr.org/what-we-do/other-initiatives/).

**Institutional report; current access qualification.** The original PDF returned HTTP 403 during this documentation review; the institute confirms the title and 2013 publication in its own catalogue. The retained preparation uses it for Iraqi community/region context. Exact relevant pagination and all original passages were not reverified here. This is not a verified Dom-only or European-Roma national census. Retained source ID: `IILHR-IRAQ-2013`.

### E03 — Iraqi and Kurdistan field research

Sarah Edgcumbe. 26 January 2024. *Education and Employment: Critical for Securing Peace for Gypsies in Iraq*. *MERI Policy Paper* 6(2). Middle East Research Institute. [Publisher page](https://www.meri-k.org/publication/education-employment-and-development-critical-for-securing-peace-for-gypsies-in-iraq-and-the-kri/); [PDF](https://www.meri-k.org/wp-content/uploads/2024/01/MERI-Policy-Paper-vol.6-no.2-1.pdf).

**Original qualitative fieldwork with cited historical context.** Relevant: §1, p. 4, the unknown national population and 50,000–200,000 estimate including the Kurdistan Region; §2, p. 5, methods and the Mosul/Rizgari research sites. Its umbrella population category and field sites cannot verify the model's six regional fractions, a uniform ethnicity or a 2025 census. Retained source ID: `MERI-IRAQ-2024`.

### E04 — ERRC Turkey country profile

European Roma Rights Centre. *Turkey: Country Profile 2011–2012*. Information current to April 2013. Produced by Hacer Foggo, Sinan Gokcen, Stephan Müller, Djordje Jovanovic, Dezideriu Gergely, Marianne Powell and Dzavit Berisha. [ERRC report hosted by OSCE/ODIHR](https://odihr.osce.org/sites/default/files/f/documents/9/3/105349.pdf).

**Institutional monitoring/background report.** Relevant: printed p. 5, production/date note; p. 7, population uncertainty, distinct groups and broad regional presence. The 500,000–5,000,000 range explicitly covers Roma and related groups including Dom, Lom and Abdal. It is not the model's Romanlar-only estimate. April 2013 describes currency of information, not an erratum. Retained source ID: `ERRC-TURKEY-2013`.

### E05 — We Are Here! editorial and chapter details

Ebru Uzpeder, Savelina Danova/Roussinova, Sevgi Özçelik and Sinan Gökçen, editors. April 2008. *We Are Here! Discriminatory Exclusion and Struggle for Rights of Roma in Turkey*. İstanbul: ERRC, Helsinki Citizens’ Assembly and Edirne Roma Association. ISBN 978-9944-5783-2-5. [Publisher PDF](https://www.errc.org/uploads/upload_en/file/we-are-here!-discriminatory-exclusion-and-struggle-for-rights-of-roma-in-turkey.pdf).

This is **the same publication as R12**, not independent corroboration. Adrian Marsh's “A Brief History of Gypsies in Turkey” starts on printed p. 5 and “Ethnicity and Identity: Who are the Gypsies?” on p. 21. Modern field research begins on p. 55; the association geography on pp. 119–121 supports broader regional presence. Historical synthesis and 2006–2007 field observations have different evidentiary roles. None establishes the model's numerical regional shares. Retained source ID: `ERRC-TURKEY-2008`.

## 16. Specific correction and institutional reference sources

### C01 — Wallachia and Moldavia

Petre Petcuț, printed “Petre Petcut”. *Wallachia and Moldavia*. Council of Europe, *Factsheets on Romani History* 2.2, eight pages, n.d. [Institutional PDF](https://rm.coe.int/wallachia-and-moldavia-factsheets-on-romani-history/16808b19be).

**Educational historical synthesis.** Relevant: p. 2, the Tismana 1385 household/tent-community donation; p. 8, “The End of Slavery”, including Moldavia in December 1855 and Wallachia in February 1856. It supports the derived abolition correction; it is not a direct inspection of the original statutes or a newly measured population. Retained source ID: `COE-ABOLITION`.

### C02 — Romanian deportations factsheet

See **R31**, Vasile Ionescu's Council of Europe factsheet 5.5, [Deportations from Romania](https://rm.coe.int/deportations-from-romania-factsheets-on-romani-history/16808b1c27). This is the same source as retained ID `COE-DEPORTATIONS`. Its deportee, mortality and survivor summaries are alternatives to compare, not an extra set of victims to add to an inclusive European total.

### C03 — Achim's RomArchive account

See **R30**, Viorel Achim's [Romania](https://www.romarchive.eu/en/voices-of-the-victims/romania/) in *Voices of the Victims*, RomArchive, n.d. This is the same source as retained ID `ACHIM-TRANSNISTRIA`. Relevant sections are the deportation, Transnistria tragedy and return narratives. The model's 15,000-death/10,000-return pairing is explicitly separate from Achim's figures.

### C04 — European genocide overview

United States Holocaust Memorial Museum. [“Genocide of European Roma (Gypsies), 1939–1945”](https://encyclopedia.ushmm.org/content/en/article/genocide-of-european-roma-gypsies-1939-1945). *Holocaust Encyclopedia*. Last edited 24 July 2023; corporate author, Washington, DC.

**Institutional scholarly overview.** The 250,000–500,000 European victim range is retained alongside the brief's 220,000/350,000/500,000 scenarios. The regional persecution accounts help establish scope; this article is not a regional allocation census. Source ID: `USHMM`.

### C05 — Gran Redada and a digitized royal order

Jacklyn van der Colff. 3 September 2021. [“The Royal Order of October 1749 and the Historic Consequences of the Great Roma Round-up”](https://blogs.loc.gov/law/2021/09/the-royal-order-of-october-1749-and-the-historic-consequences-of-the-great-roma-round-up/). *In Custodia Legis*, Law Library of Congress; guest article posted by Stephen Mayeaux.

**Institutional research article linked to primary legal material.** It distinguishes the 30 July roundup from the subsequent October order and reports 9,000–12,000 detained. The 1749 order it discusses is a primary document; the 2021 blog is an interpretation of it, not itself an eighteenth-century record. Source ID: `LOC-REDADA`.

### C06 — Tismana geographic reference

Romanian National Archaeological Register (*Repertoriul Arheologic Național*), entry for the Tismana monastic complex, Gorj, RAN site 82449.04, n.d. [Retained official entry](https://ran.cimec.ro/sel.asp?descript=tismana-oras-tismana-gorj-ansamblul-monastic-de-la-tismana-cod-sit-ran-82449.04).

**Location reference; current fetch unavailable.** This retained link identifies the geographic correction's source, not a complete historical charter review. The page could not be fetched during this documentation audit, so its full current text and update date are not claimed as checked. Source ID: `TISMANA-LOCATION`.

## 17. Geographic data, background mapping and attribution

These inputs constrain or contextualize the display. None measures historical Roma population density. The retained Natural Earth downloads use unpinned `master` URLs; the current upstream release label alone cannot establish which release the retained bytes represent.

### G01 — Natural Earth land

Natural Earth contributors. *1:10m Physical Vectors: Land* (`ne_10m_land`). [Dataset page](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/); [retained download URL](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_land.geojson); [public-domain terms](https://www.naturalearthdata.com/about/terms-of-use/).

The retained global file is `data/geography/natural-earth-land.source.geojson`, SHA-256 `1ac90796408bc6ad6911d69448485d3c4dbf2190370080368a09976e1c9f7416`. It supplies global land checks and placement/connector constraints. Its current-upstream version must not be silently substituted for the retained file's unpinned version.

### G02 — Natural Earth rivers and lake centre lines

Natural Earth contributors. *1:10m Physical Vectors: Rivers + Lake Centerlines* (`ne_10m_rivers_lake_centerlines`). [Dataset page](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/); [retained download URL](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson).

The retained file is `data/geography/natural-earth-rivers.source.geojson`, SHA-256 `bb854a900ecbd3b408df46d5e16e3e0f974ba55993f9d8b5c26e855273c0905a`. Derived `river-corridors.json` and `mesopotamia-rivers.json` provide local reference features. These describe modern physical geography, not ancient channels. Roma's own sampling guides are hand-authored; this dataset's presence does not make every guide an extracted river.

### G03 — OpenStreetMap

OpenStreetMap contributors. [Copyright, attribution and Open Database License information](https://www.openstreetmap.org/copyright/en). OSM-derived vector data provide background map context. Data are under the ODbL; imagery/background use is not a source for historical ethnic identities or headcounts.

### G04 — OpenFreeMap and OpenMapTiles

[OpenFreeMap integration and attribution guidance](https://openfreemap.org/quick_start/); [OpenMapTiles attribution](https://openmaptiles.org/docs/terminology/attribution/). The configured remote vector source is `https://tiles.openfreemap.org/planet`. It provides water, landcover and optional modern boundaries/place labels.

OpenMapTiles code uses BSD 3-Clause terms and its cartographic schema/design CC BY 4.0; the underlying OSM data have their own ODbL obligations. The atlas's map attribution credits OpenMapTiles and OpenStreetMap contributors. A software/schema licence does not replace data-provider attribution.

### G05 — Mapzen/AWS Terrain Tiles

Mapzen/Tilezen Terrain Tiles, Terrarium encoding. [AWS open-data registry](https://registry.opendata.aws/terrain-tiles/); [provider attribution and component terms](https://github.com/tilezen/joerd/blob/master/docs/attribution.md). Configured tiles are at `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`.

These supply background hillshade only. They were not used as a DEM-based route or population-suitability calculation. Provider-specific source terms apply; the whole compilation must not be called universally public domain or CC0. The compact app credit is “Terrain: Mapzen/AWS Terrain Tiles”. The provider inventory is the appropriate source for component acknowledgements; this documentation review is not a complete tile-by-tile licence-compliance audit.

### G06 — Atlas-authored geographic reconstruction

The irregular physical-region polygons, route controls, resource guides, exclusion cores, water-access weights, multiscale texture and component quotas are authored reconstruction parameters in `scripts/prepare-roma-atlas.mjs`, `scripts/roma-landscapes.mjs` and `roma-migrations.geography.json`. They have no external census, climate-grid or archaeological-survey DOI. Their role is to place the already chosen population scenarios plausibly and reproducibly; they are separate from the historical evidence and do not add people.

## 18. Remaining limits and reproducible public explanation

The most consequential uncertainties are early ethnonym identifications and itineraries; the documentary basis behind inherited snippets; relationships among Zutt, later Dom and diverse Iraqi communities; the difference between original W-02/W-03 chronology and the requested comparative route; conversion of later stock scenarios into earlier distributions; the size and timing of progressive descendant support; detention/mortality/return alternatives; overlap of modern mobile pools; and local resource/historical-geography detail.

This is one explicit, inspectable reconstruction. Connected journeys, progressive settlement fronts, internal numerical consistency and a smooth camera improve the visualization without resolving those historical questions. Readers can trace a record to its cited work, see whether the evidence is primary, mediated, contextual or unresolved, and distinguish it from the numerical and geographic choices that make the animation run.

The public document and intended public atlas/model can be published together. Complete supplied prose, private working material and private source history remain in the private archive. Publication status belongs to the combined repository's publishing owner and index; this local file alone does not establish a push or deployment. The continuous-journeys revision supersedes the previous snapshot's model/video description.

## Appendix A. Complete progressive descendant-support schedule

This is a model-parameter inventory, not a historical birth, immigration or census series. All 35 entries are ranged and marked `descendantSupport:true`; no entry seeds an empty foreign destination. The actual dates below govern support, while the epoch embedded in an ID describes its fitting block. Values are people, with six decimal places retained for fitted interval boundaries where necessary. Their sum is not independent demographic evidence.

| Support ID | Pool | Interval | Low / central / high | Semantics |
| --- | --- | --- | --- | --- |
| SUPPORT-DOM-ANATOLIA-500 | DOM-ANATOLIA | 550.01–649.95 | 17,000 / 27,000 / 30,000 | Progressive descendant support |
| SUPPORT-ARMENIA-800 | ARMENIA | 770.01–849.95 | 3,500 / 8,000 / 15,000 | Progressive descendant support |
| SUPPORT-BYZANTIUM-1100 | BYZANTIUM | 1050.01–1099.95 | 41,000 / 65,000 / 99,000 | Progressive descendant support |
| SUPPORT-BYZANTIUM-1300 | BYZANTIUM | 1199.95–1299.95 | 6,500 / 15,000 / 26,500 | Progressive descendant support |
| SUPPORT-BYZANTIUM-1450 | BYZANTIUM | 1350–1450 | 1,500 / 3,500 / 10,500 | Progressive descendant support |
| SUPPORT-BALKAN-CORE-1450 | BALKAN-CORE | 1350–1450 | 8,000 / 16,000 / 32,000 | Progressive descendant support |
| SUPPORT-BALKAN-CORE-2000 | BALKAN-CORE | 1900–2000 | 84,500 / 152,500 / 247,500 | Progressive descendant support |
| SUPPORT-DANUBIAN-CORE-1700 | DANUBIAN-CORE | 1600–1700 | 22,500 / 39,500 / 58,500 | Progressive descendant support |
| SUPPORT-DANUBIAN-CORE-1850 | DANUBIAN-CORE | 1750–1850 | 149,500 / 199,500 / 249,500 | Progressive descendant support |
| SUPPORT-DANUBIAN-CORE-2000 | DANUBIAN-CORE | 1900–2000 | 44,000 / 138,000 / 295,000 | Progressive descendant support |
| SUPPORT-CENTRAL-CORE-1300 | CENTRAL-CORE | 1360.01–1389.95 | 2,000 / 2,500 / 4,500 | Progressive descendant support |
| SUPPORT-CENTRAL-CORE-1700 | CENTRAL-CORE | 1600–1700 | 30,500 / 42,500 / 54,500 | Progressive descendant support |
| SUPPORT-CENTRAL-CORE-1938 | CENTRAL-CORE | 1838–1938 | 0 / 6,500 / 14,000 | Progressive descendant support |
| SUPPORT-CENTRAL-CORE-1945 | CENTRAL-CORE | 1938–1944.95 | 23,500 / 45,000 / 70,000 | Progressive descendant support |
| SUPPORT-CENTRAL-CORE-1988 | CENTRAL-CORE | 1944.95–1988 | 18,000 / 30,000 / 45,000 | Progressive descendant support |
| SUPPORT-CENTRAL-CORE-2000 | CENTRAL-CORE | 1988–2000 | 37,000 / 67,500 / 112,500 | Progressive descendant support |
| SUPPORT-SINTI-CORE-1300 | SINTI-CORE | 1412.51–1416.95 | 2,000 / 2,000 / 2,000 | Progressive descendant support |
| SUPPORT-SINTI-CORE-1450 | SINTI-CORE | 1416.95–1461.021429 | 4,500 / 10,500 / 20,000 | Progressive descendant support |
| SUPPORT-SINTI-CORE-1938 | SINTI-CORE | 1838–1938 | 71,500 / 117,500 / 169,500 | Progressive descendant support |
| SUPPORT-IBERIAN-CORE-1700 | IBERIAN-CORE | 1600–1700 | 7,500 / 8,000 / 10,000 | Progressive descendant support |
| SUPPORT-NE-CORE-1938 | NE-CORE | 1838–1938 | 78,000 / 127,000 / 179,500 | Progressive descendant support |
| SUPPORT-SOUTH-VLAX-1938 | SOUTH-VLAX | 1838–1938 | 8,500 / 13,500 / 20,500 | Progressive descendant support |
| SUPPORT-SOUTH-VLAX-1960 | SOUTH-VLAX | 1938–1960 | 40,000 / 80,000 / 130,000 | Progressive descendant support |
| SUPPORT-SOUTH-VLAX-1988 | SOUTH-VLAX | 1960–1988 | 29,500 / 49,500 / 74,500 | Progressive descendant support |
| MODERN-SUPPORT-IRAQ-BASRA | IRAQ-BASRA | 1900–2024 | 11,250 / 22,500 / 45,000 | Progressive descendant support |
| MODERN-SUPPORT-IRAQ-THIQAR | IRAQ-THIQAR | 1900–2024 | 9,000 / 18,000 / 36,000 | Progressive descendant support |
| MODERN-SUPPORT-IRAQ-DIWANIYA | IRAQ-DIWANIYA | 1900–2024 | 6,750 / 13,500 / 27,000 | Progressive descendant support |
| MODERN-SUPPORT-IRAQ-MAYSAN | IRAQ-MAYSAN | 1900–2024 | 6,750 / 13,500 / 27,000 | Progressive descendant support |
| MODERN-SUPPORT-IRAQ-BAGHDAD | IRAQ-BAGHDAD | 1900–2024 | 6,750 / 13,500 / 27,000 | Progressive descendant support |
| MODERN-SUPPORT-IRAQ-NORTH | IRAQ-NORTH | 1900–2024 | 4,500 / 9,000 / 18,000 | Progressive descendant support |
| MODERN-SUPPORT-ROMANLAR-MARMARA | ROMANLAR-MARMARA | 1900–2013 | 198,000 / 395,000 / 790,000 | Progressive descendant support |
| MODERN-SUPPORT-ROMANLAR-AEGEAN | ROMANLAR-AEGEAN | 1900–2013 | 173,000 / 346,000 / 692,000 | Progressive descendant support |
| MODERN-SUPPORT-ROMANLAR-MEDITERRANEAN | ROMANLAR-MEDITERRANEAN | 1900–2013 | 74,000 / 148,000 / 296,000 | Progressive descendant support |
| MODERN-SUPPORT-ROMANLAR-ANKARA | ROMANLAR-ANKARA | 1900–2013 | 24,500 / 49,000 / 98,000 | Progressive descendant support |
| MODERN-SUPPORT-ROMANLAR-BLACKSEA | ROMANLAR-BLACKSEA | 1900–2013 | 24,500 / 49,000 / 98,000 | Progressive descendant support |

## Appendix B. Documentation checks

The document is derived from the frozen generated model without regenerating it. The 35 support triples/intervals, three opening-root triples, journey/pool counts and snapshot hashes match the input files. All 38 original URLs, 23 additional named-reference rows and 28 wave-reference mappings remain present. Sections 10–17 were preserved byte-for-byte during this model-description update; their SHA-256 is `c3c9d783b73863c9e041febdb17f693dba533c29d73b8b1ae047ef76583cce11`. The supplied text remains `ad528f20b62f64de963ee4107a6e6b209f4a3daacda49d397bb53974f5283ebf`. Software, browser/video and historical verification remain separate claims.
