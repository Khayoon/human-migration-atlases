# Turkic migrations across Eurasia: sources and methodology

**Edition:** `/turks/`, 2200 BCE–1520 CE. **Documentation snapshot:** 15 November 2026. **Model:** schema version 1, corrected arrivals and outlined population dots.

This atlas animates a reconstruction of Turkic-speaking and associated populations across Inner Asia, Siberia, Central Asia, the western steppe, Iran, the Caucasus, Anatolia and the Balkans. Its prehistoric homelands, disputed Hunnic and Avar affiliations, reconstructed corridors and population estimates have different evidential strengths. A moving dot is a unit in the visualization model. It is not a documented individual, a genetic sample or a claim that an entire political territory spoke one language.

The immediate research input is a supplied synthesis, *Demographic and Spatial Reconstruction of Turkic Migrations Across Eurasia: A Methodological Framework and Chronological Register for Animated Cartography*. Its author, publication venue and publication date were not supplied. It is not presented here as a peer-reviewed publication. The atlas preserves its evidence separately from geographic and demographic modelling. The bibliography below identifies the works and leads that synthesis names; locating a publication does not independently verify the synthesis's interpretation or its numerical ranges.

## A short explanation suitable for sharing

Each full dot represents **1,000 modelled people**. Dots stand at an origin, depart over a broad period, follow a reconstructed geographic corridor and remain at their destination until a later modelled departure. Branches draw from a shared stock rather than receiving a new copy of the parent population. Enlarging a dot or adding its black outline changes visibility, not the number of people it represents.

The map uses the report's low, central and high **person scenarios**, with additional assumptions recorded separately. Medieval tents, households, army rosters and genetic ancestry percentages are not interchangeable units. Unknown source and indigenous populations remain unknown. The current edition does not add a fabricated census of the Iranian, Tocharian, Slavic, Armenian, Greek, Evenki or other backgrounds against which these movements occurred.

Origins and destinations use irregular river-terrace, oasis, lowland, foothill and pasture mosaics. Their controls are hand-prepared geographic reconstructions informed by retained land and river geometry. They are not measured historical settlement boundaries, climate simulations or carrying-capacity estimates. The same distinction applies to the paths and dates inside broad migration windows.

The current model also needs explicit support populations because the supplied parent scenarios cannot fund every later descendant. Those support quantities are labelled bookkeeping assumptions. They now stand at reconstructed sources and travel to destinations; they no longer appear suddenly at a destination before a route arrives. This fixes a visible continuity error without turning the added support into historical evidence.

The animation covers the full chronology in **64.625 seconds**: 500 years per second until 350 CE, then 20 years per second to 1520 CE, plus the final hold. These are display rates. Passing the software checks establishes that this particular model behaves consistently; it does not verify a medieval census, an exact itinerary or a disputed ethnic identification.

## 1. What is being documented

The canonical entry configuration is `public/projects/turks.json`. The prepared master contains **41 original table rows, 50 expanded source-cohort records and 11 contextual records**. The current map has **70 journeys**: 56 original prepared journeys and allocations, plus 14 explicit transfers of existing support priors. Its standing ledger has **80 pools**. Geographic placement uses **54 named profiles**, 4,096 stable candidate positions per pool, and 140 origin/destination stages.

These counts describe records and model features. They do not count distinct peoples, independent historical witnesses or non-overlapping migrant populations. An inclusive parent, a later observation and a child branch can refer to overlapping people.

| Artifact | Role |
| --- | --- |
| `turkic-migrations.source.txt` | Untouched supplied synthesis; private retained input. |
| `turkic-migrations.extracted.json` | Exact table extraction, expanded cohort IDs, contextual material and unresolved source conflicts. |
| `turkic-migrations.register.json` | Source-preserving register, including original prose and unknown source values. |
| `turkic-migrations.atlas.json` | Research workspace and presentation metadata. The private master embeds the original register in `research.original`. |
| `turkic-migrations.population.json` | Separate low/central/high scenarios, units, allocations and inclusion relationships. |
| `turkic-migrations.journeys.json` | Reconstructed origins, destinations, dates, corridors and source/model identifiers. |
| `turkic-migrations.ledger.json` | Standing source stocks, single debits and credits, support transfers and resource placement. |
| `turkic-migrations.review.json` | Representation, accounting, geography, placement and unresolved limitations. |

The full supplied prose, working history and original source bundles belong in the private archive. Public release preparation must deliberately separate them from the intended public model and this explanation; copying the private master's entire `public/` directory would also copy embedded original prose. File paths here identify the prepared master and are not promises that private originals are publicly downloadable. Public deployment and repository links belong in the combined repository index.

Reproducible preparation is implemented in [the Turkic preparation script](../../../scripts/prepare-turkic-atlas.mjs), [the resource-placement definitions](../../../scripts/turkic-landscapes.mjs), [the population compiler](../../../src/data/atlas-model.ts) and [the standing ledger](../../../src/data/population-ledger.ts). Writing this document did **not** regenerate the model or alter its estimates.

## 2. Evidence, labels and source dependence

The report's labels are retained as claims made by that report:

| Evidence type | Meaning in this edition | What it does not establish |
| --- | --- | --- |
| `DOC` / reported movement | The synthesis describes a movement and invokes historical evidence. | Independent checking of the cited passage, its units or the supplied headcount. |
| Dated presence or attestation | A text, inscription or other observation places a group or language in a region. | The year of arrival, migration duration or migrant population. |
| Tradition | A later author or transmitted narrative offers an origin or migration account. | Contemporary eyewitness testimony merely because an early event is narrated. |
| `REC-COR` / reconstruction | A route, staging interval or connection is prepared for animation. | That a source records the exact plotted itinerary or departure year. |
| `LING-GEN` | Linguistic or genetic reasoning is invoked for chronology, affiliation or a homeland hypothesis. | A census, a uniquely determined language of every sampled person, or proof of one exact route. |
| Political or contextual material | Conquest, dynastic rule, army service, language change or later history provides context. | Resident population throughout an empire, complete replacement, or a new migrant cohort. |

The dataset's immediate source is `REPORT`. `SUPPLIED-REF-01` through `SUPPLIED-REF-18` are grouped bibliography leads, often containing several authors and dates. They are not 18 independent demonstrations of every row. A modern synthesis may repeat a chronicle, and several modern studies may share samples or an earlier argument. The catalogue preserves those relationships rather than counting citations as votes.

Where the report calls an interpretation “proven” or “validated,” that wording remains part of the retained evidence, not an endorsement by the atlas preparer. Huns, Xiongnu-related formations, Rouran-derived Avars and mixed Turco-Mongol cohorts retain their disputed or mixed status. **Turkic** here does not mean that every included confederation, elite or inhabitant was Turkish or exclusively Turkic-speaking.

No claim-to-page concordance was supplied for much of the report. The bibliography distinguishes an identified work from a passage actually checked. Exact author-year references that could not be resolved remain visible as leads; they have not been replaced silently with a familiar book by that author.

## 3. Chronology and geographic paths

Original date strings and source chronology are retained. The animation uses numerical windows alongside them. Movement is spread across those windows, with staggered departures and a traversal period. With `arrivalsWithinWindow: true`, the final traversal completes within the prepared window. A source's presence date or political event is not silently relabelled as a documented arrival.

The paths connect regional reference points through plausible steppe belts, river basins, oasis approaches, passes and foothills. Intermediate control points guide motion; they are not all asserted historical stops. Great-circle interpolation and present-land checks are geometric tools, not travel diaries or a least-cost archaeological route solution. Reconstructed paths and dates are identified in details by **“Path and dates are reconstructed.”** Uncertainty is marked compactly with `?`; estimated populations remain opaque.

The Mamluk Black Sea–Straits–Mediterranean transport and Ottoman Bosphorus crossing have explicit maritime legs. Other prepared corridors are checked for unintended open-water shortcuts. Coastal adjustments to present land are recorded in the review file. Modern shorelines, reservoirs, Caspian/Aral changes, seasonal channels and climatic shifts are not reconstructed comprehensively.

Administrative debit ancestry is distinct from geographic origin. Kyrgyz movement starts in the reconstructed Altai/Irtysh component; Qoyunlu flows start in eastern Anatolian/Upper Mesopotamian components; Qizilbash integration starts in Azerbaijan. A broad parent pool can have disconnected regional resource components. It does not populate the entire space between those components or imply that all its members passed through the same settlement.

Some chronology conflicts require explicit model choices. The Pannonian Bulgar component is staged before the later 660s breakup so that the earlier 631 episode is not forced to occur after it. The Uyghur/Ganzhou textual chronology, including the report's later kingdom date, remains distinct from the prepared dispersal window. These adjustments make the display operable; they do not resolve the historical conflicts.

## 4. Resource and terrain placement

The placement method is a **piecewise resource/terrain mosaic**, not a circular cloud clipped to land. Positive components are bent corridors with changing widths and polygon envelopes, representing named river terraces, water/pasture belts, foothills, basin margins or oasis fans. Shares assign candidate positions across those components. Small populated prefixes alternate between components, so a small cohort does not occupy only whichever component was listed first.

Examples include Xiliao–Xar Moron terraces; Orkhon/Selenga pasture; Altai/Irtysh and Ili/Chu/Talas lowlands; Syr/Amu/Zarafshan terraces; Tarim and Hexi oasis margins; Baikal and Lena–Aldan–Amga terrace/alas mosaics; Pontic/Pannonian river-pasture belts; Caucasian and Anatolian foothills; Iranian basins; Balkan valleys; and narrow Nile/Tigris terrace components. Separate western-Siberian Ishim–Irtysh and Erciş/Mosul profiles locate the relocated support reserves at their reconstructed origins.

Candidate positions must satisfy the retained land geometry and declared component/exclusion rules. Named wetland, reed/channel, salt-lake, dune/desert and rugged summit cores are excluded where defined. The current sampler applies a **0.45 km** retained-river-centerline clearance to components classified as terraces or garrisons; it is not imposed on every resource component. That number is a rendering/model control, not a measured medieval channel width. The hull surrounding disconnected components is an indexing extent; it is not inhabited fill.

**Important limit:** the positive envelopes, widths, weights and local exclusions are hand-prepared assumptions. The sampler does not ingest an elevation raster, reconstruct historical climate, estimate carrying capacity, or establish that a particular pasture was occupied in a given century. The hillshade displayed behind the dots is a separate cartographic layer. “Terrain-informed” should not be read as a validated terrain or palaeoenvironmental simulation.

### Geographic and cartographic sources

- **GEO-01 — Natural Earth, *Land*, 1:10 million physical vectors.** Used for retained present-land geometry and water/coast checks. The current download page lists version 5.1.1; the retained local file does not establish that release identity, so its checksum below identifies the actual input. **“10m” means 1:10 million scale, not 10-metre resolution.** [Dataset and description](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/).
- **GEO-02 — Natural Earth, *Rivers + lake centerlines*, 1:10 million physical vectors.** Used for named river directions and geographic anchors, not surveyed historical banks or settlements. The download page lists version 5.0.0. Retained-file release provenance is not asserted beyond the file checksum. [Dataset and description](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/).
- **GEO-03 — Natural Earth contributors, terms and attribution.** The provider places its map data in the public domain. This does not make the atlas's historical interpretations or hand-drawn resource envelopes measured evidence. [Provider terms](https://www.naturalearthdata.com/about/terms-of-use/).
- **MAP-01 — OpenFreeMap.** Supplies the live vector-tile service and fonts used by the custom basemap. The application uses the `planet` tile source, rather than treating a default style as a historical dataset. [Provider documentation](https://openfreemap.org/quick_start/).
- **MAP-02 — OpenMapTiles.** Provides the vector-map schema/cartographic stack credited in the basemap. [Project description](https://openmaptiles.org/about/).
- **MAP-03 — OpenStreetMap contributors.** Modern reference geography served through the tile stack. The map retains contributor attribution; modern names and boundaries do not prove ancient settlement or language. [Copyright and data attribution](https://www.openstreetmap.org/copyright).
- **MAP-04 — Mapzen, *Terrain Tiles*, hosted on AWS Open Data.** The application reads Terrarium elevation tiles for background relief/hillshade. This is separate from the population sampler's manual terrain controls. [Dataset registry and documentation](https://registry.opendata.aws/terrain-tiles/).

These provider pages were checked on 15 November 2026. None supplies a historical Turkic population census or validates the model's resource allocation weights.

## 5. Population units, conversions and scenarios

The report supplies calibrated **low / central / high person scenarios**. These are retained separately from unknown source-population fields. They are not statistical confidence intervals. The original report displays central values at **2,500 people per dot**; this application defaults to **1,000 people per dot**. The original unit remains in evidence. For example, 35,000 people are 35 full dots at the application default, irrespective of the dot's pixel radius.

The preparation generally copies the report's person scenarios and explicitly partitions aggregates. It does not independently recalculate each cohort from the named literature. When the report invokes household conversion, its example factors are **3.5 / 5.0 / 6.5 people per household or tent**. Those factors are model assumptions with incomplete source calibration, not universal constants or a formula applied again to already-converted person totals.

For example, the report links `COH-14A` to a 4,000-household notice. Multiplying 4,000 by 5 gives 20,000 people before additional bands; the retained central scenario is 22,500. Its 14,000 / 22,500 / 32,000 range therefore is not just three household products. The report adds reconstruction assumptions. The exact primary passage, counting unit, and allocation of those extra bands have not been independently established here.

The report also discusses correction factors for rhetorical medieval tent or army totals. Such factors are not validated automatically by identifying Korobeinikov, Lindner, Smith or another author in the bibliography. Warriors, households, families, slaves, cumulative arrivals and standing corps require different treatment. The report's alternative 200,000/20,000 tents readings, very large Ibn Saʿīd totals, Georgian “40,000” traditions and Mongol military estimates remain unresolved source/model issues, not interchangeable observations.

Functional categories are retained where supplied: pastoral-household-associated people (`PH`), military contingents (`MC`), enslaved people (`EP`), refugees (`RF`) and permanent settlers (`PS`). Their central allocations are in people within the supplied scenario; they must not be multiplied by a household factor a second time. For geographically divided rows, category allocations may be proportional model choices. The current app does not implement a separate historical category filter, nor does it invent low/high category breakdowns where none were supplied.

Unknown indigenous substrates retain `null` headcounts. Genetic ancestry percentages, haplogroup frequencies, bottleneck dates and elite genetic affinities are never converted into dot totals. The source's linguistic/genetic arguments can motivate a hypothesis, but do not provide the 35,000 prehistoric, 12,500 Sakha or other person counts by themselves.

### Shared aggregates and explicit allocations

| Aggregate or case | Current preparation |
| --- | --- |
| Old Great Bulgaria (`COH-02`) | Inclusive selectable alias, not a second 145,000-person wave. Branches debit a common pool. |
| Combined Pannonian Bulgar allocation | One 12,000 / 25,000 / 35,000 envelope; Macedonia and Italy receive 80% / 20% for the missing branch bounds. Source central 20,000 / 5,000 is preserved. |
| Uyghur dispersal | Shanxi, Gansu and Qocho branches share the Orkhon source stock. They are not three copies of the combined scenario. |
| Ghilmān (`COH-EP1`) | One aggregate split 50% Samarra, 25% Bukhara and 25% Ghazna. |
| Mongol redistribution (`COH-MNG1`) | Two-thirds Central Asia and one-third Jochid steppe; mixed Turkic/Mongol composition remains explicit. |
| Second Anatolian redistribution (`COH-16B`) | 70% western/northern frontier and 30% Taurus/Karaman. |
| Cuman branches | Georgia, Hungary, the Balkans and slave-flow departures draw from the common model stock, with support assumptions exposed. |
| Kazakh/Uzbek consolidation (`COH-12E`) | Central 250,000 / 225,000 partition; low/high partitions preserve the supplied 250,000 / 475,000 / 750,000 aggregate. |
| Salar (`CTX-SALAR`, `MODEL-SALAR`) | Prose-only movement gets a separate 1200–1500 display window and 5,000 / 12,500 / 25,000 analogical scenario. The source's exact date and population remain unknown. Analogy with a small pastoral migration is not a measured Salar headcount. |

### Stock-flow accounting and support priors

Every transfer debits one standing pool and credits one destination. A descendant is not a new copy of its parent. Arrival stocks persist, and later departures consume that shared stock. The model declares **zero natural growth**, with no explicit additions or losses beyond the activation of dated initial source priors. It is not a generational birth/death or mortality model; persistent occupancy units must not be read as the same individuals living for centuries.

The report's genealogical estimates do not conserve stock on their own. For example, its 90,000 `COH-00B` is smaller than the combined later European Hun, Iranian Hun and Oghur scenarios; its 95,000 Oghur scenario is below the later Bulgar/Khazar branches; later Cuman, Ottoman and Kazakh/Uzbek allocations also exceed some earlier parent envelopes. A family tree spanning centuries cannot serve as a funded demographic ledger without additional assumptions.

The preparation first calculates each pool's maximum cumulative debit deficit across the scenarios using the **original 56 prepared journeys, before support relocation**. In simplified form, for scenario `s`:

```text
required_s = max(0, -minimum_over_time(cumulative_arrivals_s - cumulative_departures_s))
central_prior = round_up_to_1000(max(required_central, required_low / 0.4, required_high / 2.2))
                + separately_declared_retained_allowance
```

The default support envelope is 40% / 100% / 220% of its central prior. For independent source roots, the illustrative retained allowance is `round_up_to_1000(0.2 × required_central)`, rather than 20% of the final fitted prior. The Yenisei core instead has a separately specified approximately 100,000 central retained anchor from the synthesis. Relocation transports the already-calculated quantities; the dedicated reserves receive no second allowance and the requirements are not refitted over the added support journeys. These are bookkeeping priors, not observed births, census estimates, statistical intervals or validated carrying capacities.

All 14 former positive destination priors have been **relocated, not copied**, to dedicated `SUPPORT-ORIGIN-*` source reserves. `MODEL-SUPPORT-*` transfers carry them to the existing destinations. Each destination begins at zero and is audited as credited arrivals minus debited departures. Support windows can be shorter than the linked reported movement window so that the existing onward departures are funded; these transport dates are separate display reconstructions.

The Caucasus correction illustrates the distinction. The unchanged reported Oghur scenario is 45,000 / 95,000 / 160,000. Its separate support envelope is 67,200 / 168,000 / 369,600, standing at a reconstructed Ishim–Irtysh source from 350 CE and transported over 463–515. In the compiled central animation, the Caucasus stock is zero in 463, 470 and 480; first dot arrivals occur at 481.2. It then accumulates, instead of spawning 168,000 people at the destination when departure starts. **481.2 is a model event time, not a newly discovered historical arrival date.**

At each model date, standing plus travelling people equals the activated source priors. Their final central sum is **4,472,000**. This is neither the sum of all historical migrant waves nor Eurasia's population. People can be counted in successive movements, and unquantified local populations remain outside the quantified display. The source table's central sum, 5,110,000, is only an extraction checksum across overlapping rows; it is not a distinct-person total.

## 6. Display, camera, variants and export

The current default dot scale is **2.2**, with a **black 1.25 CSS-pixel outline** and **3.5 CSS-pixel minimum radius**. Radius/magnification changes legibility, not people per dot. A fractional dot retains its population weight; a contrast outline does not create an extra person or cohort. The export fixes the central scenario at 1,000 people per dot and disables level-of-detail reductions.

Default colours organize destination regions; the app also supports group colour mode. A colour is a cartographic category, not a genetic percentage or proof of ethnic uniformity. Paths guide the people but are hidden by default. The current view is population-animation-first, not a set of route arrows or one event marker per migration.

Automatic framing starts on occupied ground rather than future endpoints, expands to include current travelling and settled populations, and respects filters and manual pan/zoom. The home control resumes automatic framing. Two explicit camera-only retirements keep retained ancestral stocks from anchoring the default overview forever: `INNER-MONGOLIA` after 1200 BCE, and residual `COH-00A` after 160 CE. Their populations remain in the model and can still be inspected. Moving cohorts always contribute to framing; explicit selections restore the selected footprint. Later Tiele, Yuan, Salar or Sakha activity can bring eastern areas back into view.

The current Turkic manifest provides one prepared geographic model with low/central/high scenarios. It does **not** offer separate selectable homeland, route or language-change variants. Competing hypotheses remain in the evidence and limitations. In particular, the synthesis's requested indigenous-background and in-place language-shift animations are not implemented as a quantified census or language model. Modern local populations' absence from this layer does not imply empty land.

The app and export use the same explicit two-phase clock:

| Phase | Rate | Timeline duration |
| --- | ---: | ---: |
| 2200 BCE–350 CE | 500 years/second | 5.1 seconds |
| 350–1520 CE | 20 years/second | 58.5 seconds |

Adaptive, density, idle-gap and minimum-travel slowdowns do not modify these configured export phases. Explicit manual playback choices remain user controls. No source dates are moved to improve pacing. With no introductory hold, one second at the final year and frame rounding at 24 fps, the corrected export is **1,551 frames, 64.625 seconds**, 1920×1080 H.264/yuv420p. Its filename is `Turkic-Migrations-2200BCE-1520CE-corrected-arrivals-outlined-2026-11-15.mp4`. Earlier exports are retained; they are not alternative historical scenarios.

## 7. Verification and remaining work

Recorded checks for the corrected edition include **18 passing Turkic regressions**, separate camera metadata tests, type checking, production build, entry/subpath checks and headless browser checks for filters, source details, manual camera control, preference isolation, reverse scrubbing and the 390-pixel layout. The complete MP4 decoded without errors; native playback and ending seek passed. Decoded 10-second, in-transit and arrival frames were inspected. The shared-workspace full-suite snapshot at that check was 348/349, with an unrelated Roma metadata failure; it was not a clean all-edition result.

The video metadata records stable Turkic project/model/source inputs during capture. Shared `src/main.ts` changed on disk during that isolated capture; hot reload was disabled, the running capture kept its loaded module, and the change flag is retained. A subsequent app build and isolated compiled-browser check passed. These records describe software and media checks, not historical peer review.

Remaining limitations include:

- Incomplete primary-text editions, manuscript witnesses, passage locators and chronicle counting units.
- Disputed prehistoric homelands, language-family dating, Xiongnu/Hun continuity and Avar/Rouran language assignments.
- Ancient DNA's sampling and interpretive limits; elite affinity, shared ancestry, linguistic affiliation and migrant headcounts are different questions.
- Overlapping source generations, cumulative movements, political expansion and unquantified local integration.
- Large support priors and their reconstructed activation/source locations. Conservation is internally checked, but those choices are not an independent historical population reconstruction.
- The source's conflicting tents readings, rhetorical army totals and household correction assumptions.
- Generalized modern geography, manually weighted resource components and incomplete historical coast/climate information.
- Contextual mortality, massacres, later Fuyu/Khoton history and background-language change that are retained as evidence without invented quantitative layers.

The next historical work would be claim-by-claim passage review and demographic calibration, not another round of software tests. The following catalogue is a transparent starting point for that review.

## 8. Bibliography: reading the status labels

**Metadata checked** means a publisher, journal, institutional catalogue or comparable bibliographic record was located for the stated identity. **Candidate** means an identified work may fit an author-only lead, but the report's intended work is unresolved. **Report-only/unresolved** means the supplied reference remains incomplete. No label implies that a complete work was read, its historical argument endorsed, or its figures independently calibrated for this atlas. Access and metadata checks were made on 15 November 2026.

### 8.1 Linguistics and genetic scholarship

#### SUPPLIED-REF-01 — Janhunen; Golden; Róna-Tas

- **Juha Janhunen (2010). Citation trail; original item not verified.** The bibliography of [Savelyev and Jeong (2020)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7612788/) identifies a 2010 contribution in *Anantam śāstram: Indological and Linguistic Studies in Honour of Bertil Tikkanen*. Its original chapter/publisher record was not checked within this pass, so no page range or DOI is asserted here. Role in the supplied synthesis: Proto-Turkic homeland and early chronology. Reading: bibliography trail only.
- **Peter B. Golden (1998). Report-only lead.** The report associates this author/year with early Turkic history and dating but does not supply an exact chapter, edition or passage. The later-edition catalogue lead could not be re-opened reliably for this document; no unrelated or guessed publisher URL is retained. The original citation remains unresolved.
- **András Róna-Tas (1998). Report-only lead.** The report invokes Proto-Turkic reconstruction and chronology without an edition or passage. A later-edition table-of-contents lead does not establish the 1998 publication identity or its wording; no chapter pagination is certified here.

#### SUPPLIED-REF-02 — Robbeets and Savelyev

- **Martine Robbeets and Alexander Savelyev, editors (2017). *Language Dispersal Beyond Farming*. John Benjamins.** Identity verified on the [publisher catalogue](https://www.benjamins.com/catalog/z.215); volume DOI [10.1075/z.215](https://doi.org/10.1075/z.215). Its table of contents also identifies Robbeets's chapter *The language of the Transeurasian farmers*. The supplied 2017 lead could refer to that chapter, but this match is not certain; its chapter DOI and page span were not verified. Role: farming/language dispersal and reconstructed subsistence. Reading: catalogue/contents only.
- **Martine Robbeets and Alexander Savelyev, editors (2020). *The Oxford Guide to the Transeurasian Languages*. Oxford University Press.** Identity verified; [publisher record](https://academic.oup.com/book/41762), DOI [10.1093/oso/9780198804628.001.0001](https://doi.org/10.1093/oso/9780198804628.001.0001). Role: comparative reference framework, including Turkic classification. Reading: book metadata and abstract only.
- **Martine Robbeets (2020). “The Transeurasian homeland: where, what, and when?”** In that Oxford guide, **772–783**. Identity and pagination verified on the [chapter record](https://academic.oup.com/book/41762/chapter-abstract/354242912); DOI [10.1093/oso/9780198804628.003.0045](https://doi.org/10.1093/oso/9780198804628.003.0045). Role: a proposed homeland/dispersal hypothesis, not a settled prehistoric population count. Reading: publisher abstract/metadata only.
- **Additional Robbeets (2017) lead.** A [publisher PDF](https://brill.com/view/journals/ldc/7/2/article-p210_4.pdf) is indexed as *Language Dynamics and Change* **7**, **210–251**, and the retrieved excerpt discusses agriculture, pastoralism and the 2200 BCE ecological hypothesis. The opening/title metadata could not be inspected reliably because subsequent access returned 403. No guessed article title or DOI is supplied; this is not treated as interchangeable with the Benjamins chapter. Reading: indexed body excerpt only.

#### SUPPLIED-REF-03 — Dybo; Tenishev; Mudrak; Wichmann and Rama

- **Анна Дыбо / Anna Dybo (2007). *Лингвистические контакты ранних тюрков. Лексический фонд. Пратюркский период*. Moscow: Восточная литература.** Identity, year and imprint verified against the author's [Institute of Linguistics, Russian Academy of Sciences profile](https://iling-ran.ru/web/en/scholars/dybo), which lists the title in scholarly transliteration. No page count or DOI is asserted. Role: early Turkic lexical contacts and the proposed interpretation of Xiongnu vocabulary. Reading: institutional publication record only; the book's linguistic arguments were not assessed.
- **E. R. Tenishev and colleagues (2001). Report-only lead.** The source invokes comparative reconstruction/lexicostatistical dating but supplies no unique title, edition or identifier. No book title or page reference has been supplied from memory. Reading: none.
- **Oleg Mudrak (2009). Report-only lead.** Cited for a quantitative split date; the exact publication was not identified independently. A [2020 institutional author-hosted chapter](https://iling-ran.ru/savelyev/2020_chuvash_and_the_bulgharic_languages.pdf) provides a scholarly citation trail, but it is not the original 2009 work. Reading: indexed excerpt only.
- **Wichmann and Rama (2021). Report-only lead.** The source attributes a linguistic-homeland estimation method to this pair; a unique title, complete author names, venue and DOI were not resolved in the bounded search. Reading: none.

#### SUPPLIED-REF-04 — Savelyev and Jeong

- **Alexander Savelyev and Choongwon Jeong (2020). “Early nomads of the Eastern Steppe and their tentative connections in the West.” *Evolutionary Human Sciences* 2, e20.** Identity verified through the [open-access article record](https://pmc.ncbi.nlm.nih.gov/articles/PMC7612788/); DOI [10.1017/ehs.2020.18](https://doi.org/10.1017/ehs.2020.18). Role: critical comparison of linguistic and genetic arguments about Xiongnu/Hun and Rouran/Avar connections. Reading: abstract, introduction and selected bibliography excerpts, not the complete article.
- **Savelyev and Jeong (2022), corrigendum.** *Evolutionary Human Sciences* **4**, e8; DOI [10.1017/ehs.2022.8](https://doi.org/10.1017/ehs.2022.8), verified on the [publisher's correction](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/93165A4827F88B7081AC2CFFAD508911/S2513843X22000081a.pdf/early-nomads-of-the-eastern-steppe-and-their-tentative-connections-in-the-west-corrigendum.pdf). The correction should accompany any later substantive reading of the 2020 paper. Its effect on the supplied synthesis was not assessed.

#### SUPPLIED-REF-05 — Pulleyblank and Vovin

- **Edwin G. Pulleyblank. Report-only author lead.** No unique work/year is supplied. Savelyev and Jeong's bibliography points to a 1962 *Asia Major* contribution/appendix concerning Xiongnu and Old Chinese phonology, but the original issue was not checked. Do not silently convert this into a fully verified citation. Role: proposed Xiongnu/Jie linguistic identifications. Reading: citation trail only.
- **Alexander Vovin (2000). “Did the Xiong-nu speak a Yeniseian language?” Citation trail.** Identified in the scholarly bibliography of [Savelyev and Jeong](https://pmc.ncbi.nlm.nih.gov/articles/PMC7612788/); the original journal item was not independently retrieved. Original issue/page metadata is deliberately omitted here. Role: a disputed linguistic interpretation, not an established language assignment. Reading: citation trail only.
- **Alexander Vovin (2017). Unresolved version lead.** A [2021 publisher note on the decipherment history](https://brill.com/downloadpdf/view/journals/jeal/3/2/article-p153_2.pdf) distinguishes 2017 conference/draft circulation from later journal publication. It does not uniquely resolve the supplied report's separate claim about Vovin's 2017 Xiongnu interpretation. Reading: note excerpt only; no invented title.
- **Alexander Vovin (2018). “An Interpretation of the Khüis Tolgoi Inscription.” *Journal Asiatique* 306(2).** Title, author and issue verified on the [publisher issue contents](https://poj.peeters-leuven.be/content.php?issue=2&journal_code=JA&url=issue&vol=306). Pagination needs reconciliation: that table of contents displays **303–313**, while the 2020 synthesis's bibliography gives **141–151**. No normalized page range is asserted. Role: the proposed early Mongolic interpretation of the Khüis Tolgoi evidence. Reading: publisher contents only.
- **Alexander Vovin (2019). “A Sketch of the Earliest Mongolic Language: the Brāhmī Bugut and Khüis Tolgoi Inscriptions.” *International Journal of Eurasian Linguistics* 1, 162–197.** Identity and pagination verified from the [publisher PDF's first-page metadata](https://brill.com/view/journals/jeal/1/1/article-p162_8.pdf); DOI [10.1163/25898833-12340008](https://doi.org/10.1163/25898833-12340008). Role: early Mongolic linguistic evidence. Reading: first page/abstract excerpt only.
- **Alexander Vovin (2019), second candidate. “Groping in the Dark: The First Attempt to Interpret the Bugut Brāhmī Inscription.”** The [publisher article record](https://poj.peeters-leuven.be/content.php?id=3286344&url=article) confirms the title/byline; the 2019 association is also present in the 2020 citation trail. Exact issue/pagination were not independently confirmed here. Role: Bugut inscription interpretation. Reading: publisher abstract excerpt, not the article.
- **Alexander Vovin (2020). Report-only lead.** The precise work behind the supplied Jie/Old Arin claim was not identified securely. Do not merge it with the 2000 paper or an earlier coauthored article merely because the topics overlap. Reading: none.

#### SUPPLIED-REF-06 — Damgaard and Jeong

- **Peter de Barros Damgaard, Nina Marchi, Simon Rasmussen and colleagues (2018). “137 ancient human genomes from across the Eurasian steppes.” *Nature* 557, 369–374.** Identity/pagination verified on the [journal record](https://www.nature.com/articles/s41586-018-0094-2); DOI [10.1038/s41586-018-0094-2](https://doi.org/10.1038/s41586-018-0094-2). Role: ancient genomic comparisons across steppe populations. Reading: journal bibliographic record, not the full paper; reader comments on that page were not used as evidence. An [indexed author correction](https://pubmed.ncbi.nlm.nih.gov/30166629/) also exists and should accompany later full-text review.
- **Choongwon Jeong, Ke Wang, Shevan Wilkin and colleagues (2020). “A Dynamic 6,000-Year Genetic History of Eurasia's Eastern Steppe.” *Cell* 183(4), 890–904.e29.** Title, year, journal, pagination and DOI were visible in the [indexed primary record](https://pubmed.ncbi.nlm.nih.gov/33157037/), DOI [10.1016/j.cell.2020.10.015](https://doi.org/10.1016/j.cell.2020.10.015). The DOI/full publisher page returned an access error in the initial pass; the later primary-index result resolves the bibliographic identity. Role: Eastern Steppe genomic context. Reading: indexed metadata only, not the complete article or a demographic calibration.

#### SUPPLIED-REF-07 — Hunnic and Avar ancient DNA

- **Zoltán Maróti and colleagues (2022). “The genetic origin of Huns, Avars, and conquering Hungarians.” *Current Biology* 32(13), 2858–2870.e7.** Identity/pagination verified through the [primary index record](https://pubmed.ncbi.nlm.nih.gov/35617951/); DOI [10.1016/j.cub.2022.04.093](https://doi.org/10.1016/j.cub.2022.04.093); [publisher PDF](https://www.cell.com/article/S0960982222007321/pdf). Role: sampled ancient genetic lineages and mixture models. Reading: metadata only.
- **Guido Alberto Gnecchi-Ruscone and colleagues (2022). “Ancient genomes reveal origin and rapid trans-Eurasian migration of 7th century Avar elites.” *Cell* 185(8), 1402–1413.e21.** Identity/pagination verified through the [primary index](https://pubmed.ncbi.nlm.nih.gov/35366416/); DOI [10.1016/j.cell.2022.03.007](https://doi.org/10.1016/j.cell.2022.03.007); [open-access manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC9042794/). Role: Avar elite mobility and sampled ancestry. Reading: metadata and selected indexed text excerpts, not the full paper.
- **Guido Alberto Gnecchi-Ruscone, Zsófia Rácz and colleagues (2025). “Ancient genomes reveal trans-Eurasian connections between the European Huns and the Xiongnu Empire.” *Proceedings of the National Academy of Sciences* 122(9), e2418485122.** Identity/article number verified through the [primary index](https://pubmed.ncbi.nlm.nih.gov/39993190/); DOI [10.1073/pnas.2418485122](https://doi.org/10.1073/pnas.2418485122); [publisher PDF](https://www.pnas.org/doi/pdf/10.1073/pnas.2418485122). Role: connections among sampled individuals across regions. Reading: metadata and abstract/result excerpts only. These links do not identify every member of a confederation, its language or its total migrant population.

#### SUPPLIED-REF-08 — Pakendorf and Sakha/Yakut history

- **Brigitte Pakendorf, Innokentij N. Novgorodov, Vladimir L. Osakovskij, Al'bina P. Danilova, Artur P. Protod'jakonov and Mark Stoneking (2006). “Investigating the effects of prehistoric migrations in Siberia: genetic variation and the origins of Yakuts.” *Human Genetics* 120(3), 334–353.** Identity/pagination verified through the [primary index](https://pubmed.ncbi.nlm.nih.gov/16845541/); DOI [10.1007/s00439-006-0213-2](https://doi.org/10.1007/s00439-006-0213-2). Role: Sakha/Yakut population history and founder effects. Reading: metadata and abstract only. The abstract does not support treating extensive indigenous admixture as conclusively established by this paper alone; no 12,500-person migration count is authenticated by it.
- **Related linguistic follow-up, not a substitute for the 2006 item:** Brigitte Pakendorf (2007), *Contact in the prehistory of the Sakha (Yakuts): Linguistic and genetic perspectives*. A thesis identity/year is verified in the [Max Planck institutional repository](https://pure.mpg.de/view/item_1554705); [repository full text](https://pure.mpg.de/pubman/item/item_405668_5/component/file_405667/sakha_pakendorf2007_s.pdf). Role: a possible source for the report's language-contact discussion. Reading: repository metadata and indexed excerpt only; the thesis was not read in full.

#### Additional unresolved leads retained from the supplied prose

- **Shiratori; Benzing; Schönig:** author-only attributions concerning early steppe languages. Titles, dates and unique works remain unidentified. They have not been expanded into guessed citations.
- **Anonymous 2023 twelve-stage Tocharian sociolinguistic model:** no author, title or identifier is supplied; report-only lead.
- **Anonymous 2025 genome-wide Kyrgyz study:** no unique author/title/identifier is supplied; report-only lead. Reported genetic percentages and divergence dates remain attributed claims, not independently verified results in this bibliography pass.

The source's terms “proven” and “validated” are not adopted as review judgments. Bibliographic identification, a complete reading, evaluation of an argument and validation of an atlas's demographic reconstruction are different steps. No model, application, source register, journey, or population file was changed to prepare this fragment.



### 8.2 Primary texts, historical traditions and inscription leads

#### `SUPPLIED-REF-09`: Priscus and Armenian tradition

- **Priscus of Panium (Πρίσκος), fragmentary historical work.** The synthesis attributes the Saragur/Urog/Onogur displacement chain and embassy to a notice concerning **463 CE**. The register supplies no fragment numbering system, editor, translator, publication date or page. The original work survives through a fragmentary transmission; the year of the narrated embassy is not the publication date of a modern edition. **Status: report-only passage attribution; exact fragment and wording unverified.** A publisher-site check did not return usable catalogue content, so no unverified modern translation is silently installed as the source.

- **Movsēs Xorenacʿi / Moses Khorenatsi (Մովսէս Խորենացի), *Patmutʿiwn Hayocʿ* (Պատմութիւն Հայոց; *History of the Armenians*).** An identified checking edition is Robert W. Thomson, translation and commentary, *History of the Armenians*, Harvard Armenian Texts and Studies 4 (Cambridge, MA: Harvard University Press, **1978**), ISBN **0674395719 / 9780674395718**. The institutional record confirms the original title and publication identity. The synthesis invokes an earlier Bulgar/Caucasus tradition, but gives no book/chapter/page. **Status: edition identity checked; the Bulgar passage, its transmission and the report's dating of the author/text were not independently resolved.** The catalogue does not establish the report's claim that this is straightforward contemporary fourth- or fifth-century migration evidence. [Indiana University institutional catalogue](https://iucat.iu.edu/iuk/1828356).

#### `SUPPLIED-REF-10`: Chinese historical compilations

The following seven works are individually named in the retained report. The native titles identify the works; they are not citations to a particular printed edition or digital transcription. The report uses them collectively for Dingling, Gaoche/Chile/Tiele, Xiongnu and related steppe attestations, sometimes alongside later linguistic interpretations. It does not provide a source-to-cohort passage concordance. The date of an event described in a later compilation must be kept distinct from the date of composition and from the date of an edited witness.

| Named work | Native title / conventional identification | What remains missing |
| --- | --- | --- |
| *Shiji*, *Records of the Grand Historian* | 史記, *Shǐjì*; conventionally associated with Sima Qian (司馬遷) | Chosen edition, relevant juan/chapter, exact transcription/translation and cited passage. |
| *Weilüe* | 魏略, *Wèilüè*; conventionally associated with Yu Huan (魚豢) | Edition and the surviving quotation/witness being used; the described ancient event is not automatically contemporary testimony. |
| *Jin Shu*, *Book of Jin* | 晉書, *Jìnshū* | Editorial/edition identification and relevant juan/passages. |
| *Weishu*, *Book of Wei* | 魏書, *Wèishū* | Editorial/edition identification and relevant juan/passages. |
| *Suishu*, *Book of Sui* | 隋書, *Suíshū* | Editorial/edition identification and relevant juan/passages. |
| *Beishi*, *History of the Northern Dynasties* | 北史, *Běishǐ* | Editorial/edition identification and relevant juan/passages. |
| *Xin Tangshu*, *New Book of Tang* | 新唐書, *Xīn Tángshū* | Editorial/edition identification and relevant juan/passages; this title must not be conflated with the *Jiu Tangshu* (舊唐書). |

**Status for all seven: named source identities retained; atlas-specific editions, passages and population interpretations unverified.** No exact dates for compilation or translated headcounts have been added in this catalogue. The [Academia Sinica Institute of History and Philology](https://www1.ihp.sinica.edu.tw/en) provides an institutional access point to Scripta Sinica and historical-text resources; it is a corpus-access lead, not a verified link to one of the passages above. Direct retrieval of the Scripta Sinica endpoint and Chinese Text Project's *Shiji* page was unavailable to the checking tool, so their full text was not inspected here.

#### `SUPPLIED-REF-11`: Persian and Arabic chronicles and geographical writing

- **Abū l-Faḍl Bayhaqī / Beyhaqi (ابوالفضل بیهقی), *Tārīkh-i Bayhaqī* (تاریخ بیهقی).** Identified modern translation: C. E. Bosworth, revised and further annotated by Mohsen Ashtiany, *The History of Beyhaqi: The History of Sultan Masʿud of Ghazna, 1030–1041*, **3 volumes, 2011**, under the auspices of the Center for Iranian Studies, Center for Hellenic Studies and Ilex Foundation, distributed by Harvard University Press. The contemporaneous institutional announcement establishes that edition identity. The synthesis attributes **4,000 Turkmen households/tents in 1025** to Bayhaqī, but no precise location is supplied or checked. **Status: translation identity checked; exact passage, counting unit and applicability to the atlas's conversions unverified.** [Association for the Study of Persianate Societies, Fall 2011 newsletter, announcement](https://www.persianatesocieties.org/wp-content/uploads/2019/04/ASPS-Newsletter-27-Fall-2011.pdf).

- **“Maʿtofi,” as written in the synthesis.** This spelling appears beside Bayhaqī in the report's attribution of the 4,000-household anchor. No forename, work title, date, edition or locator is supplied. **Status: unresolved author/reference identity.** It has not been silently normalized to Mustawfī, assigned a Persian chronicle, or counted as independent corroboration of Bayhaqī. The two names joined by a slash in the report do not establish two independently checked witnesses.

- **ʿAlāʾ al-Dīn ʿAṭā-Malik Juwaynī / Juvayni (عطاء ملک جوینی), *Tārīkh-i Jahāngushā* (تاریخ جهانگشا).** An identified translation is J. A. Boyle, *The History of the World-Conqueror*, **2 volumes, Manchester, 1958**. The title, translator, place, year and volume count are corroborated by the Cambridge University Press bibliography; publisher details of that original printing were not separately rechecked. The synthesis uses Juwaynī for Hülegü's force selection and accompanying migration; it does not supply a volume/page for the “two out of every ten” statement. **Status: translation identity corroborated; the specific quotation, military strength calculation and household expansion remain unverified here.** [*The Cambridge History of Iran*, bibliography](https://www.cambridge.org/core/books/abs/cambridge-history-of-iran/bibliography/9BB32C2625CDD8AD68ADB9E01A9E57D2).

- **ʿIzz al-Dīn Ibn al-Athīr (عز الدين ابن الأثير), *al-Kāmil fī l-taʾrīkh* (الكامل في التاريخ).** The report invokes a **960 CE tents/conversion notice**, preserving competing 200,000/20,000 readings or reconstructions. It gives no Arabic edition, volume, annal locator or translation. A checked modern publication is D. S. Richards, *The Chronicle of Ibn al-Athir for the Crusading Period from al-Kamil fi'l-Ta'rikh*, Part 1, **491–541 AH / 1097–1146 CE** (Routledge, **2006**), ISBN **9780754640776**. **That partial translation does not cover 960 CE and cannot be cited as verification of the atlas's 960 anchor.** **Status: work and this later-period translation identified; the actual relevant edition and passage remain unresolved.** [Routledge publisher record](https://www.routledge.com/The-Chronicle-of-Ibn-al-Athir-for-the-Crusading-Period-from-al-Kamil-fil-Tarikh/Richards/p/book/9780754640776).

- **Ibn Saʿīd al-Maghribī (ابن سعيد المغربي), *Kitāb al-Jughrāfiyā* (كتاب الجغرافيا).** Although the grouped register entry gives only the author, the retained prose identifies this title and supplies **c. 1280 CE**. It associates the work with the large Anatolian tent totals, including the Denizli, Kastamonu and Ankara/Kütahya figures. It does not specify an Arabic edition, manuscript, translator or page. **Status: title/date attribution retained from the report; exact edition and numerical wording unverified.** The report's ecological recalibration is not presented as a verified correction made by the primary author.

#### `SUPPLIED-REF-12`: Lexicography and Bukhara's local history

- **Maḥmūd al-Kāshgharī (محمود الكاشغري), *Dīwān lughāt al-Turk* (ديوان لغات الترك).** The synthesis uses this work for named languages, urban/tribal bilingualism and regional language history. It names the text but no edition, volume, page or quoted entry. A checking lead explicitly catalogued in a Cambridge University Press bibliography is Besim Atalay's *Divanü lûgat-it Türk* (Ankara, **1939–1941**). This is **not** an assertion that the supplied report used Atalay, nor that its individual bilingualism statements were collated. **Status: work identity and one edition lead corroborated; atlas-specific entries and interpretation unverified.** [*The Cambridge History of Iran*, bibliography](https://www.cambridge.org/core/books/abs/cambridge-history-of-iran/bibliography/9BB32C2625CDD8AD68ADB9E01A9E57D2).

- **Abū Bakr Muḥammad b. Jaʿfar Narshakhī (نرشخی), *History of Bukhara* / *Tārīkh-i Bukhārā* (تاریخ بخارا).** The report supplies **943–944 CE** as the historical work's date and invokes urban development and relations between steppe and oasis populations. An identified English translation is Richard N. Frye, *The History of Bukhara* (Cambridge, MA, **1954**), corroborated by the Cambridge University Press scholarly notice of Frye; the report does not identify that translation as its source. The text's language/redaction history, exact passages and the implications for migrant population are not re-evaluated here. **Status: translation identity corroborated; atlas-specific passages unverified.** [Cambridge University Press, notice of Richard Nelson Frye](https://www.cambridge.org/core/journals/iranian-studies/article/professor-richard-nelson-frye-10-january-192027-march-2014-a-distinguished-scholar-of-iranian-studies/40FD9E3FBB623504B2C918A0EA4C7536).

#### `SUPPLIED-REF-16`: Byzantine, Syriac and eastern Islamic narrative/geography

- **John Skylitzes (Ἰωάννης Σκυλίτζης), *Synopsis historiarum* / *Synopsis historion* (Σύνοψις Ἱστοριῶν).** Checked edition: John Wortley, translation, *John Skylitzes: A Synopsis of Byzantine History, 811–1057* (Cambridge University Press, **2010**), hardback ISBN **9780521767057**; first paperback **2011**, ISBN **9781107404748**. The official title/copyright/contents pages were inspected. The **Constantine IX reign section (1042–1055) begins on p. 397**, a broad checking location for the period of the report's 1048 Pecheneg claim; the actual Pecheneg wording and headcount were not collated. The work's stated terminal year also means that the report's 1064 Uzes event cannot simply be assigned to this work without distinguishing other authors or continuations. **Status: edition and broad section verified; individual atlas passages unverified.** [Cambridge publisher record](https://www.cambridge.org/core/books/john-skylitzes-a-synopsis-of-byzantine-history-8111057/ACB23324CCE959136B8CCE8AD8262C39), [official frontmatter and contents](https://assets.cambridge.org/97811074/04748/frontmatter/9781107404748_frontmatter.pdf).

- **Michael Attaleiates (Μιχαὴλ Ἀτταλειάτης), *History* (Ἱστορία).** An identified translation is Anthony Kaldellis and Dimitris Krallis, *Michael Attaleiates: History* (**2012**), corroborated by a Cambridge University Press bibliography. The Harvard publisher endpoint returned a browser-verification challenge, so its detailed record was not inspected. The report groups Attaleiates with Skylitzes for Pecheneg/Uzes events but supplies no passage locator. **Status: translation identity corroborated; the report's event-specific attribution and numbers unverified.** [Cambridge bibliography identifying the translation](https://www.cambridge.org/core/books/abs/cambridge-intellectual-history-of-byzantium/bibliography/6CF98C454DECE5ECB3B72552AE17D04E).

- **Michael the Syrian / Michael the Great (Syriac chronicler), *Chronicle*.** An identified edition/translation is J.-B. Chabot, *Chronique de Michel le Syrien, patriarche jacobite d'Antioche*, **4 volumes, Paris, 1899–1910**. Its identity is documented by the scholarly entry and by the publisher of later facsimile/translation volumes. The synthesis cites the Bulgarios tradition and a reported 10,000 crossing the Danube. No book/chapter/page for that specific tradition was supplied or checked. **Status: edition identity corroborated; the tradition's text, chronology and numerical application unverified.** [Florence Jullien, Encyclopaedia Iranica entry and bibliography](https://www.iranicaonline.org/articles/michael-syrian/), [Gorgias Press edition-series description](https://www.gorgiaspress.com/texts-and-translations-of-the-chronicle-of-michael-the-great-entire-set-1-of-11-volumes).

- **Abū Saʿīd ʿAbd al-Ḥayy Gardīzī (گردیزی), *Zayn al-akhbār* (زین الاخبار).** Identified publication: C. Edmund Bosworth, translator, *The Ornament of Histories: A History of the Eastern Islamic Lands AD 650–1041: The Persian Text of Abu Saʿid ʿAbd al-Hayy Gardizi* (I.B. Tauris, **2011**), ISBN **9781848853539**, **192 pages**. The publisher record and table of contents were checked. The synthesis invokes Gardīzī for Kimek/Kipchak federation information. **Coverage warning:** the checked publication's contents list the Arab governors and Iranian/Ghaznavid dynasties; its existence alone does not establish that it contains the particular ethnographic passage about Kimek tribes. **Status: publication metadata verified; relevant textual section/edition and historical interpretation unverified.** [Bloomsbury/I.B. Tauris publisher record](https://www.bloomsbury.com/us/ornament-of-histories-a-history-of-the-eastern-islamic-lands-ad-6501041-9781848853539/).

- **Anonymous, *Ḥudūd al-ʿālam* (حدود العالم; *The Regions of the World*).** The geography is dated **372 AH / 982 CE**. Identified translation: V. Minorsky, *Ḥudūd al-ʿĀlam, “The Regions of the World”: A Persian Geography, 372 A.H.–982 A.D.*, Gibb Memorial Series, New Series 11, **London, 1937**, corroborated by a Cambridge University Press bibliography. The current Gibb Trust catalogue separately advertises a **2026 reprint**, ISBN **9781909724730**; that reprint is not silently substituted for the 1937 translation or attributed to the report. The synthesis invokes the text for Kimek/Kipchak geography and federation context but supplies no numbered section/page. **Status: work and edition identity corroborated; atlas-specific passages and headcounts unverified.** [Cambridge bibliography](https://www.cambridge.org/core/books/abs/empires-and-exchanges-in-eurasian-late-antiquity/bibliography/7AB1B46FFD65B15E9F9388869A0DC2F3), [Gibb Memorial Trust catalogue](https://www.gibbtrust.org/hudud-al-alam-the-regions-of-the-world/).

#### Additional epigraphic, manuscript and unnamed textual leads in the prose

These primary objects are mentioned outside the register's grouped bibliography. They belong in the source inventory, but the report does not supply an edition or stable object-level identifier for them. Their language and historical interpretations have not been independently verified for this document.

| Object or corpus named in the report | Atlas role and unresolved citation information |
| --- | --- |
| **Old Turkic Orkhon runic inscriptions** | Epigraphic attestation of named Turkic speech communities. The Kurykan discussion mentions a mourning ceremony attributed in the synthesis to Bilge Qaghan. Exact inscription, face/line, edition, translation, event/person attribution and reading remain unresolved. A generic corpus name is not a passage citation. |
| **Yenisei runic inscriptions** | Epigraphic/linguistic context for Siberian Turkic groups. No individual monument inventory number, text edition or line reference is supplied. |
| **Old Uyghur manuscripts** | Attested linguistic and script history. No manuscript shelfmark, archive, edited text or passage is identified; this is a corpus-level lead rather than one independently checked witness. |
| **Kutadgu Bilig / Qutadğu Bilig** | Named Qarakhanid/Middle Turkic literary evidence. The synthesis gives no edition, translator, manuscript witness or passage locator. The work's existence is not a migrant headcount. |
| **Bugut and Khüis Tolgoi Brāhmī inscriptions** | The report gives a combined 584–620 CE context and invokes proposed Mongolic/Para-Mongolic readings in its discussion of Rouran and related ruling languages. Individual objects, sides/lines, editions, readings and the link between the inscriptions' dates and earlier political formations require checking; no ruling-language consensus is established by this catalogue. |
| **Unnamed late-twelfth-century Third Crusade Latin account** | The synthesis invokes an alleged 100,000-tent statement for Denizli/Isparta. It identifies no author, title, edition or passage. This remains an unresolved textual lead and is not counted as independently verified corroboration of Ibn Saʿīd. |

#### Citation limits that matter for interpreting the animation

The catalogue does not turn a later chronicle's tradition into a contemporary arrival record. It does not treat an ethnonym in a Chinese compilation as proof that every member of the named political population spoke Turkic. A medieval army, a tent count, a transmitted family count, a conversion notice and an empire's territorial footprint are different counting and evidentiary units. Their calibrated display values live in the separate atlas model. The source register retains the synthesis's wording and its unresolved citations; this document makes those gaps visible instead of inventing the missing editions or passage numbers.


### 8.3 Historical scholarship and demographic-method leads

#### SUPPLIED-REF-13 — Anatolian nomads and critique of chronicle counts

**Supplied bundle:** “Korobeinikov (2012, 2014); Lindner (1983); Vambery (1870); Koprulu.” The prose associates this bundle with Ibn Saʿīd's tent figures, a proposed Denizli population of 20,000–25,000, a Turkmenistan comparison, and competing household multipliers.

| Lead and status | Bibliographic identity / checked record | Proposed role and remaining limitation |
| --- | --- | --- |
| Dimitri Korobeinikov, **2014 candidate** | *Byzantium and the Turks in the Thirteenth Century*. Oxford University Press, 2014. [Publisher record and book DOI](https://academic.oup.com/book/8557), DOI `10.1093/acprof:oso/9780198708261.001.0001`. | The title, author, publisher and year are verified. This is a plausible match to the supplied 2014 lead. The publisher overview supports the broad Byzantine–Seljuk/Mongol subject; it does **not** verify the specific Denizli 20,000–25,000 estimate, tax-register argument, or critique-factor range. No claim-specific pages were verified. |
| Dimitri Korobeinikov, **2012 unresolved lead** | The report supplies a year but no title, venue or pages. | Keep separate from the identified 2014 book. Do not silently treat “2012/2014” as two verified editions of one work or fill in a canonical article. |
| Rudi Paul Lindner, **1983 candidate** | *Nomads and Ottomans in Medieval Anatolia*. Sinor Research Institute of Inner Asian Studies, 1983. [Indiana University Press record](https://iupress.org/9780933070127/nomads-and-ottomans-in-medieval-anatolia/). | Publisher metadata verifies the dated book and its pastoral/early Ottoman subject. It is a strong candidate for the report's dated lead, whose title is not supplied. The asserted interpretation of Ibn Saʿīd remains a passage-level check; no supporting page was verified here. |
| Armin Vambery / Ármin Vámbéry, **1870 unresolved lead** | The report supplies an author/year and a claim about 196,500 tents across 24 tribes, but no title or publication details. | Retain the exact numerical attribution as a report assertion. No 1870 publication, edition, counting scope or passage was securely identified in this bounded check. Do not substitute a later travel book or ethnographic work merely because the author is well known. |
| M. F. Köprülü, **author-only unresolved lead** | The report gives no title, edition or date for the ten-person multiplier or the Hulagu tent calculation. | Keep the ten-person conversion as an unverified attribution. A general Ottoman-origins book must not be inserted as its source without identifying the relevant work and passage. |

#### SUPPLIED-REF-14 — Household and pastoral conversion methods

**Supplied bundle:** “Josiah Cox Russell; Khazanov; Golden, household and pastoral conversion indices.” These are author-level leads, not a documented common formula. The report's 3.5 / 5.0 / 6.5-person scenarios and other conversion factors remain the supplied visualization method until their particular supporting passages are checked.

| Lead and status | Bibliographic identity / checked record | Proposed role and remaining limitation |
| --- | --- | --- |
| Josiah Cox Russell, **candidate work** | *Late Ancient and Medieval Population*. *Transactions of the American Philosophical Society*, vol. 48, part 3, 1958. The [Penn Press / American Philosophical Society publisher listing](https://www.pennpress.org/9781422376683/late-ancient-and-medieval-population/) verifies the title, year and series identity. | A relevant demographic-method candidate; the report does not name this work. The alleged universal 3.5-person nuclear-family baseline, and its applicability to these Turkic pastoral cohorts, were **not** verified. No supporting pages supplied. |
| Anatoly M. Khazanov, **candidate title; edition unresolved** | *Nomads and the Outside World*. A [Cambridge University Press advertisement in journal back matter](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/5AAC4CE4B77A4C3C6F01E205534FDBC2/S0026318400029448a.pdf/rms_volume_28_issue_2_cover_and_back_matter.pdf) confirms the title/author association and pastoral-nomadism subject. | Useful as a comparative pastoralism lead. The accessed publisher material does not establish which edition the report meant or where a five-person household index or 60–200-animal range appears. Do not present those numerical assumptions as validated by this title's existence. |
| Peter B. Golden, **candidate work** | *An Introduction to the History of the Turkic Peoples*. Wiesbaden: Otto Harrassowitz, 1992. An [institutional catalogue record from the Turkish Historical Society](https://kutuphane.ttk.gov.tr/details?id=493163&materialType=KT&query=Golden%2C+Peter+B.) confirms the short title, author, publisher and year. | A relevant historical synthesis candidate. The supplied lead identifies only Golden; it does not select this book or verify the household multiplier. The catalogue title is abbreviated, so a full subtitle and specific pages are not reconstructed here. |

#### SUPPLIED-REF-15 — Mongol manpower and Persian population

**Identified work:** John Masson Smith, Jr., “Mongol Manpower and Persian Population” — **1975 as stated in the supplied report**. The [Brill publisher preview](https://brill.com/previewpdf/journals/jesh/18/1/article-p271_14.xml) directly confirms the title and author; it supplies a two-page preview. The [JSTOR stable record](https://www.jstor.org/stable/3632138) resolves but exposes no usable bibliographic detail in the retrieved view.

A later [Brill journal bibliography](https://brill.com/view/journals/jesh/60/6/article-p788_788.pdf) gives *Journal of the Economic and Social History of the Orient* **18/3 (1975): 271–299**; [another Brill bibliography](https://brill.com/display/book/9789004192119/B9789004192119-s014.pdf) gives **270–299**. Those are citation-trail metadata, with the first-page discrepancy left explicit; they are not a newly checked claim-specific locator.

**Coverage checked:** bibliographic identity and preview availability only. This bounded pass did not establish the complete journal/issue/pagination record from the original article's own catalogue/title-page record, nor verify the report's exact 60% strength, 15–17 tümen, 55,290–85,000-warrior, family-conversion or 180,000–550,000-person calculations. Do not attach inferred pinpoint pages or treat every number in the report's composite paragraph as Smith's own estimate. The clear title match distinguishes this entry from the author-only candidates above.

#### SUPPLIED-REF-17 — Seljuk society and Anatolian transformation

**Supplied bundle:** “Carole Hillenbrand; Andrew Peacock; Speros Vryonis Jr., Seljuk and Anatolian history.” The report's prose associates Hillenbrand/Peacock with household-scale nomadic society and Vryonis with changes affecting Byzantine ecclesiastical institutions; it supplies no exact work titles or pages.

| Lead and status | Bibliographic identity / checked record | Proposed role and remaining limitation |
| --- | --- | --- |
| Carole Hillenbrand, **candidate work** | *Turkish Myth and Muslim Symbol: The Battle of Manzikert*. Edinburgh University Press, 2007. [Publisher record](https://edinburghuniversitypress.com/book-turkish-myth-and-muslim-symbol.html). | Title, author, year and the work's analysis of Manzikert sources and later interpretations are verified from the publisher. It is a relevant candidate, not a proved source for the report's migrating-household composition or numerical totals. No claim-specific passage was checked. |
| Andrew C. S. Peacock, **candidate work** | *Early Seljūq History: A New Interpretation*. Routledge, 2010. A [Cambridge journal review record](https://www.cambridge.org/core/journals/bulletin-of-the-school-of-oriental-and-african-studies/article/abs/andrew-cs-peacock-early-seljuq-history-a-new-interpretation-routledge-studies-in-the-history-of-iran-and-turkey-xi-190-pp-london-and-new-york-routledge-2010-80-isbn-978-0-415-54853-3/454E75C557FDA43269DCBF2F928F37FB) verifies the book's bibliographic identity. | A dated, relevant Seljuk-history candidate. The report does not identify which Peacock work it intended. The review's own pagination must not be cited as book pages supporting the report's household or migration claims. |
| Speros Vryonis, Jr., **author-only unresolved lead** | No work title, date, edition or supporting pages are given in the report. The attempted publisher record was inaccessible in this bounded check. | Retain the stated research role—Anatolian transformation and ecclesiastical change—without silently selecting a familiar monograph. Bibliographic identification and claim-specific coverage remain open. |

#### SUPPLIED-REF-18 — Bactrian documents, Hunnic identities and disputed affiliations

| Lead and status | Bibliographic identity / checked record | Proposed role and remaining limitation |
| --- | --- | --- |
| Nicholas Sims-Williams, **document corpus identified; intended volume unresolved** | *Bactrian Documents from Northern Afghanistan*: I, *Legal and Economic Documents* (2000; revised edition 2012); II, *Letters and Buddhist Texts* (2007). The [Corpus Inscriptionum Iranicarum publication catalogue hosted by SOAS](https://www.soas.ac.uk/sites/default/files/2025-03/CII%20publications%20Parts%201-4%20%26%20Suppl.pdf) verifies these volumes/edition dates; the [SOAS scholar record](https://www.soas.ac.uk/about/nicholas-sims-williams) verifies the author/corpus association. | Relevant editions for checking particular Bactrian documents and their chronology. The report's “Rob documents” lead does not identify volume, document number or passage. Corpus identification alone does not verify a count of over 150 documents, every administrative-language claim, or a population-wide ethnic/linguistic conclusion. |
| Frantz Grenet, **author-only unresolved lead** | The report attributes an interpretation of *al- / khon* to Grenet but gives no work, year or pages. No matching institutional publication record was located within the bounded pass. | Retain the proposed etymology as the report's disputed attribution. Do not supply a generic Sogdian/Central Asian book as though it contained that argument. |
| Christopher Atwood, **author-only unresolved lead** | The report names Atwood in its Xiongnu/Hun terminology discussion without specifying a publication. [Cambridge's peer-reviewed comparative review](https://www.cambridge.org/core/journals/evolutionary-human-sciences/article/early-nomads-of-the-eastern-steppe-and-their-tentative-connections-in-the-west/4CBA0E2CB74C8093EC1CA38C95067D55) also cites Atwood's work in this debate. | This confirms the relevance of the scholarly lead, not the identity of the report's intended work or all of its equivalence claims. No exact Atwood citation or pinpoint pages are invented here. |
| Étienne de la Vaissière, **identified 2005 work; candidate dated-lead match** | “Huns et Xiongnu.” *Central Asiatic Journal* 49 (2005): 3–26. The article's bibliographic identity and full article range are recorded in a [Cambridge University Press bibliography](https://www.cambridge.org/core/books/abs/empires-and-exchanges-in-eurasian-late-antiquity/bibliography/7AB1B46FFD65B15E9F9388869A0DC2F3). | A plausible match to the report's explicit 2005 lead. Pages 3–26 are verified **bibliographic coverage**, not a checked pinpoint for the report's every linguistic, political or demographic inference. A naming/continuity argument must not be turned into an uncontested uniform language, ethnicity or migrant headcount. |
| Étienne de la Vaissière, **2018 unresolved lead** | The report separately mentions 2018 in its Bugut/Khüis Tolgoi language discussion, but provides no title or publication details. | Keep distinct from the 2005 article and from works by other inscription specialists. The specific work, division of authorship, passage and interpretation remain unverified here. |



## 9. Source-to-model audit appendices

The following tables are generated from the inspected prepared master. They expose its assumptions rather than supplying new historical evidence. Numeric low/central/high entries are people, not dots; `unknown` preserves an absent source bound. Inclusive source rows overlap with their branches and must not be summed.

### A. Complete supplied-bundle crosswalk

| Register ID | Named sources/leads | Claimed role in supplied synthesis |
| --- | --- | --- |
| `SUPPLIED-REF-01` | Janhunen; Golden; Róna-Tas | Homeland and linguistic chronology; see status and limitations in the catalogue. |
| `SUPPLIED-REF-02` | Robbeets; Robbeets and Savelyev | Transeurasian comparative/dispersal hypotheses; see status and limitations in the catalogue. |
| `SUPPLIED-REF-03` | Dybo; Tenishev; Mudrak; Wichmann and Rama | Lexical contact, split dating and phylogeography; see status and limitations in the catalogue. |
| `SUPPLIED-REF-04` | Savelyev and Jeong | Critical interdisciplinary synthesis; see status and limitations in the catalogue. |
| `SUPPLIED-REF-05` | Pulleyblank; Vovin | Disputed Xiongnu/Jie and early Mongolic readings; see status and limitations in the catalogue. |
| `SUPPLIED-REF-06` | Damgaard; Jeong | Ancient genomic context; see status and limitations in the catalogue. |
| `SUPPLIED-REF-07` | Maróti; Gnecchi-Ruscone | Hunnic/Avar sampled genetic evidence; see status and limitations in the catalogue. |
| `SUPPLIED-REF-08` | Pakendorf and colleagues | Sakha/Yakut population and contact history; see status and limitations in the catalogue. |
| `SUPPLIED-REF-09` | Priscus; Xorenacʿi | Late-antique narrative and Armenian tradition; see status and limitations in the catalogue. |
| `SUPPLIED-REF-10` | Seven named Chinese historical compilations | Attestations of steppe groups and languages; see status and limitations in the catalogue. |
| `SUPPLIED-REF-11` | Bayhaqī; Maʿtofi; Juwaynī; Ibn al-Athīr; Ibn Saʿīd | Chronicle/geographical notices and numerical anchors; see status and limitations in the catalogue. |
| `SUPPLIED-REF-12` | al-Kāshgharī; Narshakhī | Language geography and Bukhara history; see status and limitations in the catalogue. |
| `SUPPLIED-REF-13` | Korobeinikov; Lindner; Vámbéry; Köprülü | Anatolian nomadism and critique of numbers; see status and limitations in the catalogue. |
| `SUPPLIED-REF-14` | Russell; Khazanov; Golden | Comparative demographic/pastoral method leads; see status and limitations in the catalogue. |
| `SUPPLIED-REF-15` | John Masson Smith Jr. | Mongol manpower/population argument; see status and limitations in the catalogue. |
| `SUPPLIED-REF-16` | Skylitzes; Attaleiates; Michael the Syrian; Gardīzī; Ḥudūd | Byzantine/Syriac/Persian narrative and geography; see status and limitations in the catalogue. |
| `SUPPLIED-REF-17` | Hillenbrand; Peacock; Vryonis | Seljuk/Anatolian historical interpretation; see status and limitations in the catalogue. |
| `SUPPLIED-REF-18` | Sims-Williams; Grenet; Atwood; de la Vaissière | Bactrian documents and disputed affiliations; see status and limitations in the catalogue. |

### B. All 56 original prepared journeys and allocations

These are animation records, including explicit geographic allocations and model-only Salar/Pannonian records. The 14 support transfers are listed separately below. `recordIds` links can include inclusive parents; this is not a list to sum into a migrant total. Dates here are prepared display windows, with original textual dates retained privately.

| ID and group | Display window | Low / central / high people | Funded parent → destination pool | Source/model record links |
| --- | --- | ---: | --- | --- |
| `COH-00A` — Proto-Macro-Turkic to Immediate Proto-Turkic | 2200 BCE–1200 BCE | 15,000 / 35,000 / 75,000 | `INNER-MONGOLIA` → `COH-00A` | `COH-00A` |
| `COH-00B` — Dingling (West & North) & Early Xiongnu Core | 209 BCE–160 CE | 40,000 / 90,000 / 180,000 | `COH-00A` → `COH-00B` | `COH-00B` |
| `COH-00C` — European Hun Immigrant Core (Disputed / Multiethnic) | 350 CE–453 CE | 10,000 / 25,000 / 50,000 | `COH-00B` → `COH-00C` | `COH-00C` |
| `COH-00D` — Iranian Huns: Kidarites, Alchon & Hephthalites (Disputed) | 360 CE–520 CE | 20,000 / 45,000 / 90,000 | `COH-00B` → `COH-00D` | `COH-00D` |
| `COH-01` — Oghurs, Saragurs, Onogurs & Sabirs | 463 CE–515 CE | 45,000 / 95,000 / 160,000 | `COH-00B` → `COH-01` | `COH-01` |
| `COH-04A` — Fufuluo (Tiele / Gaoche) Dzungarian State | 487 CE–546 CE | 70,000 / 140,000 / 250,000 | `TIELE-CORE` → `COH-04A` | `COH-04A` |
| `COH-01A` — Pannonian Avar Immigrant Elite Core | 555 CE–568 CE | 15,000 / 35,000 / 65,000 | `ROURAN-CORE` → `COH-01A` | `COH-01A` |
| `COH-05` — Western Göktürks (On Oq) & Türgesh | 552 CE–704 CE | 85,000 / 175,000 / 320,000 | `COH-04A` → `COH-05` | `COH-05` |
| `MODEL-PANNONIAN-BULGARS` — Pannonian Bulgar component | 515 CE–600 CE | 12,000 / 25,000 / 35,000 | `COH-01` → `PANNONIAN-BULGARS` | `MODEL-PANNONIAN-BULGARS`, `COH-02`, `COH-02D`, `COH-02E` |
| `COH-02A` — Batbayan's "Black Bulgars" | 665 CE–700 CE | 20,000 / 35,000 / 60,000 | `COH-01` → `COH-02A` | `COH-02A`, `COH-02` |
| `COH-02B` — Volga Bulgars (Kotrag's Branch & Suvars) | 660 CE–922 CE | 25,000 / 50,000 / 85,000 | `COH-01` → `COH-02B` | `COH-02B`, `COH-02` |
| `COH-02C` — Danube Bulgars (Asparuh's Horde) | 668 CE–681 CE | 15,000 / 35,000 / 60,000 | `COH-01` → `COH-02C` | `COH-02C`, `COH-02` |
| `COH-02D` — Kuber Macedonian Bulgars | 670 CE–680 CE | 9,600 / 20,000 / 28,000 | `PANNONIAN-BULGARS` → `COH-02D` | `COH-02D`, `COH-02` |
| `COH-02E` — Alcek Italian Bulgars | 631 CE–680 CE | 2,400 / 5,000 / 7,000 | `PANNONIAN-BULGARS` → `COH-02E` | `COH-02E`, `COH-02` |
| `COH-03` — Khazar Khaganate Core Expansion | 650 CE–750 CE | 40,000 / 80,000 / 140,000 | `COH-01` → `COH-03` | `COH-03` |
| `COH-06` — Karluks (Üç Qarluq) to Semirechye & Tian Shan | 745 CE–766 CE | 60,000 / 120,000 / 200,000 | `ALTAI-CORE` → `COH-06` | `COH-06` |
| `COH-13` — Oghuz Migration to Semirechye & Syr Darya | 750 CE–820 CE | 80,000 / 160,000 / 280,000 | `MONGOLIAN-TURKIC-CORE` → `COH-13` | `COH-13` |
| `COH-08A` — Uyghur refugees to Shanxi | 840 CE–866 CE | 25,000 / 50,000 / 80,000 | `ORKHON-UYGHURS` → `COH-08A` | `COH-08A`, `COH-08A, 08B, 08C` |
| `COH-08B` — Ganzhou Uyghurs / Yughurs | 840 CE–880 CE | 30,000 / 65,000 / 110,000 | `ORKHON-UYGHURS` → `COH-08B` | `COH-08B`, `COH-08A, 08B, 08C` |
| `COH-08C` — Qocho / Turfan Uyghurs | 840 CE–866 CE | 55,000 / 110,000 / 190,000 | `ORKHON-UYGHURS` → `COH-08C` | `COH-08C`, `COH-08A, 08B, 08C` |
| `COH-10A` — Yenisei Kyrgyz Expansion to Altai, Irtysh & E. Tian Shan | 840 CE–924 CE | 25,000 / 55,000 / 95,000 | `YENISEI-KYRGYZ` → `COH-10A` | `COH-10A` |
| `COH-11` — Kimek–Kipchak Confederation Formation & Westward Drift | 840 CE–1000 CE | 75,000 / 150,000 / 260,000 | `ALTAI-CORE` → `COH-11` | `COH-11` |
| `COH-EP1` — Abbasid Samarra, Samanid & Early Ghaznavid Ghilmān | 833 CE–1030 CE | 17,500 / 32,500 / 55,000 | `COH-06` → `COH-EP1` | `COH-EP1` |
| `MODEL-EP1-BUKHARA` — Ghilmān flow to Bukhara | 833 CE–1030 CE | 8,750 / 16,250 / 27,500 | `COH-06` → `EP1-BUKHARA` | `MODEL-EP1-BUKHARA`, `COH-EP1` |
| `MODEL-EP1-GHAZNA` — Ghilmān flow to Ghazna | 962 CE–1030 CE | 8,750 / 16,250 / 27,500 | `COH-06` → `EP1-GHAZNA` | `MODEL-EP1-GHAZNA`, `COH-EP1` |
| `COH-17` — Pecheneg Migration to the Pontic–Danubian Steppe | 889 CE–915 CE | 60,000 / 120,000 / 200,000 | `ARAL-KANGAR` → `COH-17` | `COH-17` |
| `COH-07A` — Qarakhanids into Transoxiana | 960 CE–1013 CE | 35,000 / 75,000 / 130,000 | `COH-06` → `COH-07A` | `COH-07A`, `COH-07A & 07B` |
| `COH-07B` — Qarakhanids into Khotan | 960 CE–1013 CE | 20,000 / 40,000 / 70,000 | `COH-06` → `COH-07B` | `COH-07B`, `COH-07A & 07B` |
| `COH-14A` — Seljuk Clan to Jand, Nur-Bukhara & Khorasan ("Iraqi Turkmens") | 985 CE–1028 CE | 14,000 / 22,500 / 32,000 | `COH-13` → `COH-14A` | `COH-14A` |
| `COH-14B` — Main Seljuk Wave into Khwarazm & Khorasan (Tughril, Chaghri, Musa) | 1030 CE–1045 CE | 45,000 / 85,000 / 145,000 | `COH-13` → `COH-14B` | `COH-14B` |
| `COH-12A` — Qangli / Eastern Kipchaks to Syr Darya | 1030 CE–1070 CE | 50,000 / 100,000 / 165,000 | `COH-11` → `COH-12A` | `COH-12A`, `COH-12A & 12B` |
| `COH-12B` — Pontic Cumans / Western Kipchaks | 1030 CE–1070 CE | 90,000 / 175,000 / 285,000 | `COH-11` → `COH-12B` | `COH-12B`, `COH-12A & 12B` |
| `COH-17A` — Pechenegs into Balkans | 1036 CE–1091 CE | 30,000 / 60,000 / 100,000 | `COH-17` → `COH-17A` | `COH-17A`, `COH-17A & 13A` |
| `COH-13A` — Uzes / Western Oghuz into Balkans | 1064 CE–1091 CE | 15,000 / 30,000 / 50,000 | `COH-13` → `COH-13A` | `COH-13A`, `COH-17A & 13A` |
| `COH-15` — Seljuk/Turkmen Settlement in Azerbaijan, Arran & NW Iran | 1042 CE–1150 CE | 55,000 / 110,000 / 185,000 | `COH-14B` → `COH-15` | `COH-15` |
| `COH-16A` — First Wave of Turkmen Settlement in Anatolia (Manzikert to Kösedağ) | 1050 CE–1220 CE | 90,000 / 180,000 / 300,000 | `COH-15` → `COH-16A` | `COH-16A` |
| `COH-12D` — Oghuz, Kipchak & Qangli Settlement in Khwarazm | 1077 CE–1220 CE | 45,000 / 90,000 / 150,000 | `COH-12A` → `COH-12D` | `COH-12D` |
| `COH-12B-GEO` — Khan Otrok's Kipchak Settlement in Georgia | 1118 CE–1125 CE | 35,000 / 60,000 / 100,000 | `COH-12B` → `COH-12B-GEO` | `COH-12B-GEO` |
| `COH-MNG1` — Chagatai & Jochid Turco-Mongol Ulus Redistribution in Central Asia | 1219 CE–1270 CE | 80,000 / 150,000 / 250,000 | `MONGOLIAN-MIXED-CORE` → `COH-MNG1` | `COH-MNG1` |
| `MODEL-MNG1-JOCHI` — Jochid Turco-Mongol redistribution | 1219 CE–1270 CE | 40,000 / 75,000 / 125,000 | `MONGOLIAN-MIXED-CORE` → `JOCHID-STEPPE` | `MODEL-MNG1-JOCHI`, `COH-MNG1` |
| `COH-16B` — Second Wave Turkmen Flight into Anatolia & Post-Kösedağ Peripheral Uç Shift | 1220 CE–1280 CE | 70,000 / 129,500 / 217,000 | `COH-16A` → `COH-16B` | `COH-16B` |
| `MODEL-16B-TAURUS` — Taurus / Karaman Turkmen redistribution | 1243 CE–1280 CE | 30,000 / 55,500 / 93,000 | `COH-16A` → `TAURUS-TURKMENS` | `MODEL-16B-TAURUS`, `COH-16B` |
| `COH-12B-HUN` — Cuman refugees to Kunsag / Hungary | 1238 CE–1246 CE | 40,000 / 75,000 / 115,000 | `COH-12B` → `COH-12B-HUN` | `COH-12B-HUN`, `COH-12B-HUN & BLK` |
| `COH-12B-BLK` — Cuman refugees to Dobruja / Balkans | 1238 CE–1246 CE | 25,000 / 40,000 / 65,000 | `COH-12B` → `COH-12B-BLK` | `COH-12B-BLK`, `COH-12B-HUN & BLK` |
| `COH-MNG2` — Hulagu's Ilkhanid Tamma/Tümen Expedition to Azerbaijan & Iran | 1253 CE–1265 CE | 180,000 / 325,000 / 550,000 | `MONGOLIAN-MIXED-CORE` → `COH-MNG2` | `COH-MNG2` |
| `COH-EP2-EGY` — Kipchak mamluks to Egypt and Syria | 1240 CE–1368 CE | 35,000 / 65,000 / 105,000 | `COH-12B` → `COH-EP2-EGY` | `COH-EP2-EGY`, `COH-EP2` |
| `COH-EP2-YUAN` — Kipchak troops and Uyghur refugees in Yuan China | 1240 CE–1368 CE | 30,000 / 55,000 / 90,000 | `COH-08C` → `COH-EP2-YUAN` | `COH-EP2-YUAN`, `COH-EP2` |
| `COH-09A` — Sakha (Yakut) Northward Migration to the Central Lena Basin | 1250 CE–1400 CE | 5,000 / 12,500 / 25,000 | `BAIKAL-KURYKANS` → `COH-09A` | `COH-09A` |
| `COH-10C` — Kyrgyz Migration & Consolidation in the Tian Shan (Mongol to Moghulistan Era) | 1207 CE–1510 CE | 45,000 / 90,000 / 160,000 | `COH-10A` → `COH-10C` | `COH-10C` |
| `COH-16C` — Ottoman Turkish Expansion & Settlement in the Balkans | 1354 CE–1520 CE | 125,000 / 250,000 / 420,000 | `COH-16B` → `COH-16C` | `COH-16C` |
| `COH-15A` — Qara Qoyunlu | 1374 CE–1468 CE | 45,000 / 85,000 / 140,000 | `COH-15` → `COH-15A` | `COH-15A`, `COH-15A & 15B` |
| `COH-15B` — Aq Qoyunlu | 1378 CE–1508 CE | 65,000 / 130,000 / 210,000 | `COH-15` → `COH-15B` | `COH-15B`, `COH-15A & 15B` |
| `COH-15C` — Safavid Conquest & Qizilbash Integration in Azerbaijan & Iran | 1501 CE–1510 CE | 85,000 / 165,000 / 275,000 | `COH-15A` → `COH-15C` | `COH-15C` |
| `COH-12E` — Kazakh Steppe Consolidation & Shaybanid Uzbek Conquest of Transoxiana (1500) | 1465 CE–1510 CE | 130,000 / 250,000 / 395,000 | `COH-12A` → `COH-12E` | `COH-12E` |
| `MODEL-12E-UZBEK` — Shaybanid / Qongrat Uzbek redistribution | 1465 CE–1510 CE | 120,000 / 225,000 / 355,000 | `COH-12A` → `UZBEK-TRANSOXIANA` | `MODEL-12E-UZBEK`, `COH-12E` |
| `MODEL-SALAR` — Salar eastward migration to Qinghai | 1200 CE–1500 CE | 5,000 / 12,500 / 25,000 | `COH-13` → `SALAR-QINGHAI` | `MODEL-SALAR`, `CTX-SALAR` |

### C. Every positive initial prior, including the 14 transported supports

All 24 entries below are visualization priors, not additional historical census observations. The 56 other pools start at zero. A support entry is activated once at its reconstructed source and then debited by its `MODEL-SUPPORT-*` transfer. Source reference coordinates are not exact historical settlements. All quantities are people.

| Pool | Activation | Low / central / high | Subsequent support transport, when applicable |
| --- | --- | ---: | --- |
| `INNER-MONGOLIA` | 2200 BCE | 18,000 / 45,000 / 99,000 | Initial source stock; debited by its linked movements. |
| `TIELE-CORE` | 487 CE | 81,200 / 203,000 / 446,600 | Initial source stock; debited by its linked movements. |
| `ROURAN-CORE` | 555 CE | 18,000 / 45,000 / 99,000 | Initial source stock; debited by its linked movements. |
| `ALTAI-CORE` | 745 CE | 156,800 / 392,000 / 862,400 | Initial source stock; debited by its linked movements. |
| `MONGOLIAN-TURKIC-CORE` | 750 CE | 92,800 / 232,000 / 510,400 | Initial source stock; debited by its linked movements. |
| `ORKHON-UYGHURS` | 840 CE | 128,000 / 320,000 / 704,000 | Initial source stock; debited by its linked movements. |
| `YENISEI-KYRGYZ` | 209 BCE | 65,200 / 163,000 / 358,600 | Initial source stock; debited by its linked movements. |
| `ARAL-KANGAR` | 889 CE | 69,600 / 174,000 / 382,800 | Initial source stock; debited by its linked movements. |
| `MONGOLIAN-MIXED-CORE` | 1219 CE | 344,000 / 860,000 / 1,892,000 | Initial source stock; debited by its linked movements. |
| `BAIKAL-KURYKANS` | 700 CE | 6,400 / 16,000 / 35,200 | Initial source stock; debited by its linked movements. |
| `SUPPORT-ORIGIN-COH-00A` | 2200 BCE | 25,200 / 63,000 / 138,600 | 2200 BCE–1200 BCE → `COH-00A`; source reference 120, 43.5 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-00B` | 1200 BCE | 35,200 / 88,000 / 193,600 | 209 BCE–160 CE → `COH-00B`; source reference 102.5, 47.5 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-01` | 350 CE | 67,200 / 168,000 / 369,600 | 463 CE–515 CE → `COH-01`; source reference 70, 54 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-04A` | 350 CE | 15,200 / 38,000 / 83,600 | 487 CE–546 CE → `COH-04A`; source reference 102, 48 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-06` | 552 CE | 30,000 / 75,000 / 165,000 | 745 CE–766 CE → `COH-06`; source reference 86.5, 47.5 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-10A` | 209 BCE | 20,000 / 50,000 / 110,000 | 840 CE–924 CE → `COH-10A`; source reference 91.4, 53.7 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-11` | 656 CE | 65,200 / 163,000 / 358,600 | 840 CE–1000 CE → `COH-11`; source reference 85, 48 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-14B` | 985 CE | 10,000 / 25,000 / 55,000 | 1030 CE–1042 CE → `COH-14B`; source reference 61.9, 45.6 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-12A` | 1000 CE | 245,200 / 613,000 / 1,348,600 | 1030 CE–1070 CE → `COH-12A`; source reference 64, 51.5 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-12B` | 1000 CE | 45,200 / 113,000 / 248,600 | 1030 CE–1070 CE → `COH-12B`; source reference 64, 51.5 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-15` | 1030 CE | 145,200 / 363,000 / 798,600 | 1042 CE–1050 CE → `COH-15`; source reference 58.8, 36.2 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-16A` | 1042 CE | 10,000 / 25,000 / 55,000 | 1050 CE–1220 CE → `COH-16A`; source reference 46.3, 38.1 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-16B` | 1200 CE | 55,200 / 138,000 / 303,600 | 1220 CE–1280 CE → `COH-16B`; source reference 32.5, 37.9 (longitude, latitude) |
| `SUPPORT-ORIGIN-COH-15A` | 1350 CE | 40,000 / 100,000 / 220,000 | 1374 CE–1468 CE → `COH-15A`; source reference 43.4, 39 (longitude, latitude) |

### D. Context retained without an invented census

| Context ID | Retained topic | Quantitative treatment |
| --- | --- | --- |
| `CTX-HOMELAND-EAST` | Eastern Inner Mongolia / Western Manchuria hypothesis | Contextual evidence retained; no new independent population layer is inferred from this record. |
| `CTX-HOMELAND-SAYAN` | Sayan-Altai to Inner Mongolia / Shanxi pre-split reconstruction | Contextual evidence retained; no new independent population layer is inferred from this record. |
| `CTX-LANGUAGE-SPLIT` | Oghuric / Common Turkic split and lexical contacts | Contextual evidence retained; no new independent population layer is inferred from this record. |
| `CTX-DISPUTED` | Disputed Xiongnu, Hun, Iranian Hun, Rouran and Avar connections | Contextual evidence retained; no new independent population layer is inferred from this record. |
| `CTX-FUYU` | Fuyu Kyrgyz eastward relocation | Contextual evidence retained; no new independent population layer is inferred from this record. |
| `CTX-KHOTON` | Khoton relocation to western Mongolia | Contextual evidence retained; no new independent population layer is inferred from this record. |
| `CTX-SALAR` | Salar eastward migration to Qinghai | Separate `MODEL-SALAR` analogy as disclosed above; source exact date and population remain unknown. |
| `CTX-SAKA` | Saka displacement, coexistence and assimilation | Contextual evidence retained; no new independent population layer is inferred from this record. |
| `CTX-OASIS-PHASES` | Oasis settlement, bilingualism and language-shift phases | Contextual evidence retained; no new independent population layer is inferred from this record. |
| `CTX-COUNTS` | Chronicle topoi and competing demographic reconstructions | Contextual evidence retained; no new independent population layer is inferred from this record. |
| `CTX-METHOD` | Household multipliers, calibration and cohort branching protocol | Contextual evidence retained; no new independent population layer is inferred from this record. |

### E. Placement profiles and reproducibility

All controls and allocation weights are visible in [the resource-profile source](../../../scripts/turkic-landscapes.mjs). The following is the complete list of 54 profiles in the prepared review, rather than a claim of independently measured historical resource areas.

| Profile | Reconstructed geographic footprint |
| --- | --- |
| `eastern-mongolia` | Xiliao–Xar Moron forest-steppe terraces |
| `sayan-mongolia` | Sayan–Altai basin chains and northern Mongolian pasture |
| `zaysan-semirechye` | Zaysan/Irtysh, Ili and Chu resource lobes |
| `pannonia` | Tisza, Danube interfluve and Mures fan pasture |
| `bactria-gandhara` | Balkh/Tokharistan and Gandhara lowland components |
| `kuban-caucasus` | Kuban–Azov, Manych and Terek/Sulak pasture margins |
| `orkhon-selenga` | Orkhon–Selenga–Tuul river/pasture mosaic |
| `dzungaria` | Dzungarian basin water margins and foothill pastures |
| `chu-talas-chach` | Ili–Chu–Talas–Chach lowland/foothill mosaic |
| `azov-don` | Lower Don terraces and Manych pasture |
| `volga-bolgar` | Middle Volga/Kama terrace and Chuvash upland mosaic |
| `moesia` | Lower Danube terraces and Pliska inland plateau |
| `macedonia` | Pelagonia and lower Vardar inhabited basins |
| `matese` | Matese basin margins and Volturno foothill chain |
| `lower-volga-don` | Don bends, Volga/Akhtuba terraces and interfluve pasture |
| `altai-irytsh` | Altai intermontane and Black Irtysh pasture |
| `chu-talas` | Chu and Talas inhabited valley/pasture margins |
| `lower-syr` | Lower Syr Darya levee/terrace and Aral-margin pasture |
| `shanxi` | Sanggan–Datong frontier valley and pasture strips |
| `gansu` | Hexi oasis fans and Qilian foothill water margins |
| `turfan` | Turfan–Qocho oasis and northern-basin fan strip |
| `yenisei` | Minusinsk–Abakan and Tuva basin terraces |
| `north-kazakh` | Middle Irtysh, Ishim/Tobol and southern-Ural pasture belts |
| `samarra` | Tigris terrace/garrison banks around Samarra |
| `bukhara-local` | Bukhara local oasis/garrison strip |
| `ghazna` | Ghazni basin and local valley/garrison margins |
| `aral-kangar` | Emba/Ural and north-Aral pasture approaches |
| `pontic` | Dniester–Bug, Dnieper and Azov steppe water/pasture belts |
| `transoxiana` | Zarafshan, Kashka Darya and Khwarazm oasis components |
| `khotan` | Khotan/Yarkand southern Tarim oasis fans |
| `rayy` | Qazvin–Rayy southern Alborz piedmont water strip |
| `khorasan` | Nishapur, Kopet-Dag piedmont, Merv and Herat oasis components |
| `middle-syr` | Sighnaq and middle Syr Darya river/pasture terraces |
| `thrace-macedonia` | Maritsa, Vardar and Struma inhabited valley mosaics |
| `azerbaijan-frontier` | Eastern Anatolian and Azerbaijan Turkmen resource components |
| `central-anatolia` | Konya, Ankara, Sivas and plateau river/pasture mosaics |
| `khwarazm` | Lower Amu Darya oasis branches and irrigable terraces |
| `georgia` | Kura and Alazani inhabited valley/terrace margins |
| `west-anatolia` | Menderes, Gediz, Bithynia and Kastamonu valley components |
| `taurus-karaman` | Karaman basin and inhabited Taurus valley/foothill pasture |
| `dobruja` | Dobruja plateau and Danube bank mosaic |
| `azerbaijan` | Tabriz/Ahar, Mughan–Aras and Ardabil seasonal foothill mosaics |
| `cairo` | Cairo/Fustat Nile bank and local irrigable terrace strip |
| `beijing` | Beijing/Hai basin foothill–alluvial settlement strips |
| `baikal` | Western Baikal/Angara and upper-Lena pasture pockets |
| `lena-alases` | Central Lena–Aldan–Amga terraces and alas meadow mosaic |
| `tian-shan` | Chu/Issyk-Kul and Naryn inhabited valley/pasture lobes |
| `qoyunlu-mosaic` | Azerbaijan, Tigris and Fars separate seasonal resource components |
| `safavid` | Azerbaijan and Qazvin–Rayy inhabited piedmont components |
| `kazakh-core` | Saryarka river/pasture mosaics and Syr-Darya margins |
| `uzbek-oases` | Transoxiana and Khwarazm separate oasis components |
| `qinghai` | Upper Yellow River/Xunhua terrace and valley-pasture mosaic |
| `west-siberian-oghur` | Ishim–Irtysh western Siberian forest-steppe source terraces |
| `ercis-mosul` | Erciş north-Van foothills and Mosul/Tigris seasonal source components |

### F. Prepared-master fingerprints

These SHA-256 values identify the retained prepared master inspected for this document. A deliberately sanitized public model can have different hashes because full private prose is removed; these are not promises of byte identity with that public copy.

| Artifact | SHA-256 |
| --- | --- |
| `public/projects/turks.json` | `3c804303c7c5367629f992a652263429b12b0392009c3f7f4d6c74bf049b71b1` |
| `public/data/research/turkic-migrations.source.txt` | `a56957fbf22008a269eb1304ddf5e22f54a2741c808369935453a3312fbb0610` |
| `public/data/research/turkic-migrations.atlas.json` | `af1c75301c77156029d2cb1e2a0f944ad15f1f194ba1c322c2dfdb58edc5dd72` |
| `public/data/research/turkic-migrations.population.json` | `4f111a12c994f8e42e5f98d6da7ad6e53e50499acd22632094586600e790eb4d` |
| `public/data/research/turkic-migrations.journeys.json` | `7e12e265194c86022c185d9a29738317fada0ec0ed06f587aa58c70f2507b37e` |
| `public/data/research/turkic-migrations.ledger.json` | `1b1fae754e6ade0a4d883bc177a8fa139d877db9e1ea7be4b221760fc9800686` |
| `public/data/research/turkic-migrations.review.json` | `25399339bfbab831307baf2a658272df7c7894309ee1a060cccb1c093d3227b9` |
| `data/geography/natural-earth-land.source.geojson` | `1ac90796408bc6ad6911d69448485d3c4dbf2190370080368a09976e1c9f7416` |
| `data/geography/natural-earth-rivers.source.geojson` | `bb854a900ecbd3b408df46d5e16e3e0f974ba55993f9d8b5c26e855273c0905a` |

