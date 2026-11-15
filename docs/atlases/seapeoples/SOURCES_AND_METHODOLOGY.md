# Sea Peoples atlas: sources and methodology

Documentation snapshot: **15 November 2026**. This document describes the finished traditional seafaring edition, including its battle and settlement events and the later, slower sea-crossing clock. It is a public derivative explanation; the supplied research report and its verbatim evidence register remain private.

The atlas animates explicit, weighted populations through a reconstruction of Mediterranean mobility. Its default scenario includes Sardinia, Sicily and Tyrrhenian Italy, alongside Aegean, Anatolian, Cypriot, Egyptian and Levantine connections. These are selectable historical interpretations. A line, dot, place label or smooth animation does not establish an ancient itinerary, homeland, headcount or attacker’s identity.

## 1. Edition, scope and provenance

| Item | Current edition |
| --- | --- |
| Entry point | `/seapeoples/` |
| Prepared project | `public/projects/seapeoples.json` |
| Default model | `west-external-1175` |
| Compatibility identifiers | Dataset `modelRevision: 2`; browser model storage `traditional-v2` |
| Animated period | c. 1300–1140 BCE by default; c. 1300–1095 BCE for the later settlement alternatives |
| Retained documentary scope | c. 1400–900 BCE, with some earlier contextual references |
| Default population display | Central scenario; 1,000 people per full weighted dot |
| Default compiled model | 42 journeys, 65 corridors, 107 origin/stage records and 25 standing reservoirs |
| Population register | 42 movement estimates and nine inclusive, nonrendered group summaries |
| Events | 23 historical/contextual entries, supported by a 35-entry event source catalogue |

The starting material is an unpublished, user-supplied synthesis titled *Reconstructing Late Bronze to Early Iron Age Population Movements and the Sea Peoples Phenomenon*. Its nine group records, original wording, native identifiers, chronology, conflicting tallies and unknown populations were retained locally. The original text contains no URLs or DOIs. Bibliographic expansions in this document are subsequent work, not citations that were present in that text.

The retained original is 82,080 bytes, SHA-256 `92605050a0d9b7d8bff06faf1713ac3a3e89fb733c1e9e8bab4efb6d26dc0250`. This identifies the private input without reproducing it. Local normalized files also contain verbatim source material in `suppliedText` or `research.original`; their presence in an application directory does **not** authorize publishing those fields. Public distribution requires a sanitized derivative package. This documentation task did not regenerate or publish the original, application data or exports.

The pipeline keeps four things distinct: supplied evidence; normalized evidence records; a separate visualization population/geography model; and compiled journeys, standing ledgers and display events. The report is an inherited synthesis, not an independently verified edition of every cited ancient text. Targeted later checks improved particular routes and events; they do not validate the entire report.

## 2. Names, evidence types and historical limits

The following identifiers reproduce the register’s supplied typography. They are not a newly standardized transliteration, and question marks mark proposed identifications rather than established equivalences.

| Record | Display name | Supplied native/textual identifiers |
| --- | --- | --- |
| `LUKKA` | Lukka | Rkw; Lukka; Likki |
| `SHERDEN` | Sherden | Šrdn; Š3rd3n3; S-ar-di-na |
| `DENYEN` | Denyen / Danuna | D3iniwn3; Dnỉn; Danuna; dnnym / ʾdnnym; Hiyawa / Adanawa |
| `EKWESH` | Ekwesh | 'Ikwš; Ahhiyawa?; Achaiwoi? |
| `TERESH` | Teresh | Twrš; Trš; Taruisa?; Tyrsenoi? |
| `SHEKELESH` | Shekelesh | Š3krwš3; Škrš; Šikalayu? |
| `PELESET` | Peleset / Philistine-related communities | Pw-r'-s'-t; Palistin / Walistin; Philistines |
| `TJEKER` | Tjeker / Sikil | Ṯkr; Sikil / Skl; Šikalayu? |
| `WESHESH` | Weshesh | W3š3š3; Wšš n p3 ym |

Reported movement, dated presence, reconstruction, tradition and context remain different evidence types. A person or ethnonym attested at a place proves neither the date of arrival nor a whole population’s origin. A political name, pottery assemblage, military contingent, landholding survey and ancestry measurement have different scopes. The atlas does not turn a polity’s extent into resident population or a pottery connection into a census.

The traditional western option associates Sherden with Sardinia, Shekelesh with Sicily and Teresh with Tyrrhenian Italy. Ekwesh and Denyen use Aegean connections, Peleset and the external Tjeker option use Cretan/Aegean origins, and Lukka uses Lycia. Weshesh has no established homeland; an Amurru staging footprint is an explicit geographic proxy. Name resemblance and imported Nuragic pottery support discussion of contact and competing hypotheses, not proof of ethnicity or migration direction. See the Gothenburg project, Gradoli et al., Bürge et al., Cline and Yasur-Landau in the bibliography.

### Egypt: deaths, captivity and continued residence

The three requested campaign events are represented separately: **Merneptah’s year 5 victory over a Libyan-led coalition at Perire**, and **Ramesses III’s year 8 land fighting in the Djahy frontier and naval fighting at the river mouths**. Conventional absolute dates vary; Perire is shown c. 1208/1207 BCE and both year 8 events at 1175 BCE, retaining c. 1177/1175 in their descriptions. The exact Djahy battlefield and ancient river-mouth location are disputed. A shared display date does not assert a land-then-sea sequence.

The royal texts and scenes describe killing, mutilated-body-part tallies, capture and victory. Their victory rhetoric must be read alongside evidence for living captives, military service and later residence. Harris I supports settlement of living captives; Wilbour provides later Sherden landholding context. Therefore all dots reaching Egypt are not automatically annihilated. Earlier Sherden in Egyptian service are also not automatically members of a later hostile coalition. See Manassa, the Medinet Habu editions, Harris I, Abbas, Ben-Dor Evian, Emanuel and the Wilbour discussions below.

The model applies explicit scenario deaths at Perire. Year 8 mortality is **unknown**: no invented 50% death ratio or doubled attacking army is derived from the surviving settlement envelope. Egyptian settlement dots represent the stated survivor/resident scenario, including families and earlier residents, rather than the full enemy force before battle. Household continuity across generations is not a claim that identical individuals lived through every attestation.

### Greece, Anatolia and the limits of attack attribution

Destruction, rebuilding, abandonment and continuity are shown as events rather than fabricated invading populations. Greek entries include Gla, Thebes, Mycenae, Pylos, Tiryns and Midea. Anatolian/adjacent entries include Hattusa, Troy VIIa, Tarsus and Kilise Tepe, together with Ugarit and Carchemish. Their dates are broad, site-specific archaeological windows, not one simultaneous wave.

Hattusa is represented as **abandonment and burning**, with the identity of attackers unknown. Clearance/abandonment and later fires do not establish a Sea Peoples army marching inland to sack the Hittite capital. Carchemish supplies a continuity counterexample. Alalakh and Miletus were considered as context but excluded from an unsupported blanket c. 1200 BCE sack sequence. The archaeology and interpretations are discussed in the excavation and scholarly references below. Neither an event title nor the category “attested” authenticates a named perpetrator or an exact solar year.

The supplied report’s aggregate audit of 153 sites and its percentage of rejected destruction claims lack a complete underlying site register here. Those statistics have not been independently replicated and are not used to generate attack dots.

## 3. Chronology and the eight alternatives

The focused animation starts at 1300 BCE to avoid a long inactive lead-in. Earlier Amarna evidence remains in the evidence register and is not recast as an exact 1300 arrival. Western origin reservoirs visible at opening are display priors funding later journeys, not reconstructed island censuses or a claim that every departure began that year. Later tenth/ninth-century attestations remain documentary context rather than an inactive tail of the animation.

Broad source periods are spread into explicit departure, travel, stage-hold and arrival intervals. Those exact animation years and intermediate stops are reconstructed. The final default arrival is 1145 BCE, followed by the story end at 1140. Later settlement models move the relevant Dor/Philistia windows by 45 years, have their last arrival at 1100 BCE and end at 1095. They do not shift every Egyptian or northern event by 45 years.

| Model ID | Central Mediterranean interpretation | Carmel interpretation | Main settlement choice |
| --- | --- | --- | --- |
| `west-external-1175` | Traditional western | External Cretan arrival | c. 1175 BCE; default |
| `west-local-1175` | Traditional western | Local continuity / Cypriot integration | c. 1175 BCE |
| `east-external-1175` | Eastern alternative | External Cretan arrival | c. 1175 BCE |
| `east-local-1175` | Eastern alternative | Local continuity / Cypriot integration | c. 1175 BCE |
| `west-external-1130` | Traditional western | External Cretan arrival | After c. 1130 BCE |
| `west-local-1130` | Traditional western | Local continuity / Cypriot integration | After c. 1130 BCE |
| `east-external-1130` | Eastern alternative | External Cretan arrival | After c. 1130 BCE |
| `east-local-1130` | Eastern alternative | Local continuity / Cypriot integration | After c. 1130 BCE |

Each variant has 42 journeys and its own standing ledger. They are alternatives and must never be added together. The eastern alternative changes origin geography without forcing every group into a universal reverse-migration circuit. The local Dor alternative allocates two thirds of the Tjeker interaction envelope to local continuity and one third to Cypriot integration. These are illustrative display shares, not measured migrant fractions. In the external alternative both bookkeeping components depart Crete; an inherited component ID containing `LOCAL` does not override that interpretation. All alternatives preserve the same declared demographic totals, although their foreign-entrant interpretation differs.

There is no language-replacement simulation. Names and colours are not language, ancestry or genetic percentages.

## 4. Population estimates, conversions and conservation

All nine source population fields remain **unknown/null**. Low, central and high values are separate visualization scenarios, not censuses, confidence intervals or estimates newly measured from the primary evidence. The six broad envelopes retain the supplied synthesis’s service, campaign and settlement scenarios; no single census or demonstrated conversion establishes their central values. Numerical anchors below provide context and limited reference classes, not a calibration that makes those scenarios measured populations. Fractions result from allocation arithmetic; they express model weights, not a claim to count half a historical person.

### Inclusive stage envelopes

| Envelope | Low | Central | High | Counting unit and scope |
| --- | ---: | ---: | ---: | --- |
| Early Amarna/Kadesh horizon | 500 | 1,500 | 3,500 | Mobile people; reused in later stages where explicitly funded |
| Perire coalition | 1,500 | 4,500 | 9,000 | Combatants, including a carried early subset |
| Cyprus refuge / Ugarit-related mobility | 300 | 1,000 | 2,500 | Independent net new mobile people |
| Egyptian survivor/resident settlement | 2,000 | 5,000 | 10,000 | Settlers including families, earlier Sherden and selected survivors |
| Southern Levant settlement | 2,500 | 7,500 | 20,000 | Illustrative migrant-related or regional interaction cohort |
| Northern Levant / Cilicia | 2,000 | 6,000 | 15,000 | Inclusive illustrative cohort including early Danuna |

The six naive sums are **8,800 / 25,500 / 60,000**, matching the supplied cumulative figures. They are not unique people because the envelopes overlap. Older local notes saying the low sum is 9,000 contain an arithmetic error; this document reports the actual current values. Correct unique-entry accounting is:

| Reconciliation | Low | Central | High |
| --- | ---: | ---: | ---: |
| Naive stage sums | 8,800 | 25,500 | 60,000 |
| Subtract early people carried into Perire | −70 | −210 | −490 |
| Subtract earlier people included in Egypt | −197.5 | −592.5 | −1,405 |
| Subtract early Danuna included in northern pool | −100 | −300 | −700 |
| **Unique declared entries** | **8,432.5** | **24,397.5** | **57,405** |
| Explicit Perire deaths | −1,000 | −3,000 | −4,000 |
| **Final living scenario total** | **7,432.5** | **21,397.5** | **53,405** |

### Component allocations

These fractions are authored model choices. They make the reconstruction inspectable, not statistically calibrated.

| Pool | Allocation |
| --- | --- |
| Early horizon | Sherden 40%; Lukka 30%; Denyen 20%; Ekwesh 10% |
| Perire gross force and modeled deaths | Ekwesh 68%; Teresh 22.5%; Shekelesh 6.5%; Sherden 1.5%; Lukka 1.5% |
| Independent refuge pool | Shekelesh 50%; Teresh 25%; Lukka 25% |
| New Egyptian residual after earlier inclusions | Sherden 70%; Weshesh 30% |
| Southern pool | Peleset 80%; Tjeker 12%; Denyen 8% |
| Peleset southern city distribution | Ashkelon 25%; Ashdod 20%; Ekron 20%; Gath 20%; Gaza 15% |
| Northern residual after early Danuna | Peleset 55%; Denyen 45% |

The early Perire carry is Sherden 10/30/70, Lukka 10/30/70 and Ekwesh 50/150/350, in low/central/high order. The remaining early Sherden 190/570/1,330 and Perire Sherden survivors 7.5/22.5/75 are included inside the Egyptian envelope. Its genuinely new residual is 1,802.5/4,407.5/8,595. The northern residual is 1,900/5,700/14,300 after removing the already counted early Danuna 100/300/700.

Perire scenario deaths occur across the reconstructed 1207.5–1206.5 BCE interval. Survivors total 500/1,500/5,000. Of these, the non-Sherden groups withdraw/disperse west into a broad coastal-fringe footprint by 1200: 492.5/1,477.5/4,925. The smaller Sherden component integrates into the Egyptian accounting above. This broad withdrawal is reconstructed; neither permanent Perire colonization nor a documented return to each western homeland is claimed. The later refuge routes are independent new entries, not a compulsory onward journey for those survivors.

### Source anchors and unit discipline

* **Perire:** retained alternatives of 3,123, 3,165 and 3,241 foreign dead/hands are competing readings/counting conventions, not additive totals. Components include Ekwesh 2,201; Teresh 722/742/790; Shekelesh 200/222/250; Sherden 32+; Lukka unpreserved. The model does not equate each hand with an additional resident migrant, reconcile every damaged tally or derive its scenario mortality mechanically from these alternatives.
* **Wilbour:** 109 listed plot holders × an explicitly assumed household multiplier of four = **436 illustrative people** within one survey scope, with 59 plots retained in the anchor. The 436 are already inside the Egyptian envelope, not a second new cohort or an all-Egypt census. The display uses c. 1142 BCE while retaining Ramesses V year 4/mid-twelfth-century scope; an alternative 1147 chronology is preserved in the source discussion.
* **Galleys:** 35–65 people per galley × 7–20 ships yields a reference capacity of **245–1,300**. This is a transport comparison, not a literal ethnic population count. The report’s unspecified Wachsmann citation remains unresolved.
* **Ashkelon DNA:** ten sampled individuals in Feldman et al. are biological evidence with restricted sampling and chronological scope. An early European-related affinity is not a migration census, exact birthplace, ethnic label or measured percentage of every later Philistine community. Genetic “halos” at unmeasured sites are not rendered.

### Standing ledger

There are 25 standing reservoirs: 20 nonzero declared root cohorts and five initially empty campaign pools. A transfer debits its funded source and credits its destination, retaining cohort identity through movement and arrival. Parent/child transfers do not create another copy of an aggregate population. The nine group-summary rows are inclusive summaries and are not rendered as extra dots. Only declared roots introduce new people; specified deaths remove living population.

Natural growth is explicitly **zero** (`fixedAnnualRate: 0`). This is an accounting/display simplification, not a claim of zero historical births or mortality. No unsourced fertility model, invisible replenishment, or extra population for every political branch is applied. Stage reuse represents cohort continuity through generations rather than demonstrated survival of the same named individuals over a century.

## 5. Routes, terrain and settlement footprints

Routes use authored geographic guides and retained modern land polygons. Maritime guides skirt coasts and islands, including Sicily, Crete and Cyprus; unnamed navigation nodes guide the moving dots without becoming invented resident stops. Land guidance uses A* over modern land cells when a direct segment crosses water: 0.04-degree grid, distance cost, up to 20 km segments, 1 km coastal tolerance and 8 km endpoint allowance. These are geometric rules, not elevation/climate least-cost routes, ancient roads or recovered ship tracks.

The default uses 24 resource-setting footprints; the union of all eight variants uses 26 of 27 authored shapes. They include Sardinian and Sicilian lowlands, Tyrrhenian foothills, Argolid terraces, northern Cretan coastal valleys, Lycian valleys, Cypriot terraces, Cilician lowland/foothill margins, Levantine coastal and valley strips, and Egyptian cultivated margins. The placements are irregular authored polygons rather than land-clipped circular clouds.

For each stage or reservoir, the nearest authored resource polygon is selected by centre distance. A reproducible seed derived from its name/ID generates **128 candidate points** through uniform bounding-box rejection sampling. Accepted points must lie inside the polygon, outside its authored holes, and on the retained modern land mask. The procedure uses a SHA-256-derived 32-bit seed and a deterministic linear congruential generator. These are candidate locations shared by weighted cohorts, not 128 archaeological settlements or a population estimate.

Resource/terrain information enters through **manual shape design**, not measured within-polygon resource weighting. Narrow Cretan lowlands avoid the mountain interior; Delta/Fayum margins avoid selected unsuitable lake/wetland cores; an explicit Amuq exclusion hole avoids the reconstructed lake/wetland centre. No ancient climate raster, crop/pasture productivity surface, carrying-capacity calculation, palaeochannel grid or elevation-based route cost is used. Modern terrain/hillshade provides visual context. The polygons and exclusions are display reconstructions, not surveyed Bronze Age settlement boundaries or independently validated ancient wetland maps.

The land mask derives from Natural Earth 1:10m land polygons. Its original retained GeoJSON SHA-256 is `1ac90796408bc6ad6911d69448485d3c4dbf2190370080368a09976e1c9f7416`; the regional mask retains original ring holes. The recorded URL points to an unversioned `master` branch; the exact upstream release and download date were not recorded. Current modern coasts can differ substantially from ancient deltas, shorelines and channels. Natural Earth river centre lines also appear in the shared basemap, but the shared river-corridor/Arabian-coast assets are not evidence that Sea Peoples journeys used those routes. See cartographic sources below.

## 6. Dots, colours, camera and events

A full weighted dot represents 1,000 people at the default setting. Changing people-per-dot changes rendering density, not scenario totals. Positive fractional cohorts retain a readable full outline while their coloured radius scales with the square root of weight, making coloured area proportional to represented population. A 600-person cohort is a 0.6-weight dot, not a secretly inflated 1,000 people. Consequently raw circle counts alone do not recover totals when several fractional cohorts are visible.

Current readability settings use a 3.2 display scale, a minimum radius of four CSS pixels and a 1.25-pixel black outline. Estimated populations are not faded for uncertainty; a small question mark/caption provides that cue. Routes are hidden by default. Dots persist at destinations and are not replaced by one migration marker, event diamond or dotted trail.

The UI defaults to destination colour mode, but prepared destination stages currently inherit the authored group palette. Destination labels may therefore repeat colours; they are not a unique national colour scheme. Group mode remains available. The group palette is Lukka `#d9b96e`, Sherden `#87bdcc`, Denyen `#af9cd4`, Ekwesh `#c78d71`, Teresh `#d190ab`, Shekelesh `#a6bf7c`, Peleset `#7caecf`, Tjeker `#8bc4ac` and Weshesh `#d0a46e`. Colours do not encode ancestry measurements.

Automatic framing starts with currently occupied footprints and expands as populations move. Future endpoints do not force the opening to the final extent. In expand-only mode the camera keeps the wider view after zooming out. It considers offscreen populations and selected filters; manual pan/zoom suspends following. An explicit resume/reset control restores automatic framing, and Home resets the framing baseline. Event cards do not automatically fly the camera between cities.

The top-right event panel presents source-linked cards, current and past events, same-date peers, and explicit controls to show a date or locate a place. Browsing history or source details pauses playback. A deliberate Locate action can move the map. Events with the same model start year are shown as peers, not given an invented chronological order. Hattusa and the Delta naval encounter receive display emphasis within crowded clusters; this is editorial priority, not a historical sequence. Passive city labels provide context without adding population.

The current 23 entries cover opening seafaring context; Sherden raid/capture/service and Kadesh; six Greek sites; Perire; Hattusa; Tarsus; Carchemish continuity; Cilician connections; Ugarit; Troy VIIa; Dor; Delta and Djahy; Kilise Tepe; Philistia; Egyptian captive settlement; and Wilbour landholding. Some broad event windows continue beyond the focused movie’s ending; the movie is not a complete chronology of every later regional development.

## 7. Actual playback and export timing

The **current clock slows during actual sea motion**, while quiet calendar gaps and isolated land movement pass faster. Its common phase union is derived from all eight alternatives, so changing an alternative does not create a completely different viewing clock. Per-dot moving legs are split from stationary holds; declared sea corridors and sampled water portions of mixed corridors determine sea attention. Mixed-corridor classification samples approximately every 5 km and distinguishes substantial water segments from short coastal artifacts.

| Situation | Current calibration |
| --- | --- |
| Quiet calendar gaps | 50 historical years per screen second |
| Isolated land travel | 20 years per second |
| Short sea transfer | Two-second full-transfer calibration |
| Long sea transfer, at least 2,000 km | Four-second full-transfer calibration |
| Event reading attention | Usually at least 0.75 calendar years at no faster than 0.5 years per second; a battle can extend to its end plus 0.5 year |

Sea calibrations translate to the prepared phase rates of 0.5 or 0.25 years per second for the transfer unit; staggered dots and overlap mean an individual visible crossing need not last exactly two or four seconds. Overlapping requirements use the slowest applicable rate. The common schedule contains 110 phases across 1300–1095 BCE; the default story intersects 94, while the later alternatives use all 110. It includes 44 raw reading windows across the two event chronologies, including duplicates. The opening context card does not impose an opening hold; the first departure starts about 0.04 seconds into the default export. A configuration target of 60 seconds is an initial calibration target, not the final runtime.

At default speed the chronological animation lasts **82.126366 seconds** for each 1175 model and **93.817718 seconds** for each 1130 model. The app and exporter share the same phase conversion. Manual speed changes scale this clock. The current UI displays the applicable phase rate; an internal speed baseline of 20 is not a claim that the entire story runs uniformly at 20 years per second.

The verified current video is `Sea-Peoples-Traditional-Western-Seafaring-Battles-And-Events-2026-11-15.mp4`: **83.15 seconds**, 4,989 frames, 1920 × 1080, 60 fps, H.264. It uses `west-external-1175`, the chronological duration above, a one-second final hold and endpoint/frame quantization. SHA-256: `7b7fca761ba116d10c011dec197cecd794c88006301225a8a3b9bfc0ec4cfb4b`.

The retained verification found about 54 seconds containing actual water motion. One tracked early Sherden partial dot retained weight 0.6 across about three seconds of continuous open-water motion in the encoded samples beginning near second 6.64. The broader safe-water reference interval in the phase audit lasts 3.21 seconds. These are evidence of visible motion in that export, not historical voyage durations.

An earlier fixed 50-then-20-years-per-second clock produced a roughly 6.47-second story and was superseded after the request for at least 30 seconds and slower crossings. An older six-minute export is also not the current artifact. Neither obsolete duration describes this edition. Source-module snapshots and asset hashes identify the modules/data actually captured; later edits in the shared workspace do not retroactively change that video.

## 8. Reproduction, checks and remaining work

The preparation entry is `npm run prepare-seapeoples`. Authoring logic lives in `scripts/prepare-seapeoples-atlas.mjs`; event and pacing helpers remain separate. Prepared artifact families include `.atlas.json`, `.population.json`, `.journeys.json`, `.ledger.json`, `.events.json`, `.pacing.json` and `.review.json`, plus journeys/ledger pairs for each model ID. Canonical unsuffixed journeys and ledger refer to the default variant. These file relationships describe the local build; a sanitized public package may omit the private source and verbatim original register.

Reproducing the private ingestion byte-for-byte requires the retained private input. A public derivative should support inspection of compiled display assumptions without pretending to include that unpublished source. The publisher must preserve geographic attribution and keep the original source and private history in the private archive. The public repository location is assigned by the shared atlas publisher; no repository URL is invented in this document.

At the finished animation revision, targeted population/event/timeline checks passed 23 tests, the real-project browser audit passed 13 checks, and independent media verification passed 49 checks. The recorded media check included all-frame FFmpeg decoding, complete normal-speed playback, source/capture hash checks and passive inspection of decoded frames. Type checking and production builds passed at that revision. The full test suite recorded **371/372**, with one unrelated Slavic camera-region expectation failure; it is not reported as an all-green suite. These are recorded implementation snapshots, not a fresh whole-workspace test claim made by this documentation-only update.

Software conservation, land-mask checks, visible movement and a successfully decoded MP4 do not establish disputed historical routes, event perpetrators, populations, exact battle coordinates or absolute chronologies. Important remaining limits are incomplete edition/page locators for many inherited references; uncertain ethnonym equivalences; selective archaeological coverage; unknown source populations; authored allocation ratios; modern coastlines; manually designed resource polygons; and the absence of a measured environmental/demographic model. The bibliography records metadata corrections and unresolved citations rather than silently converting them into verified evidence.

## 9. Bibliography and source-status catalogue

The catalogue below separates ancient evidence locators, modern editions and scholarship, excavation/context references, geographic inputs and unresolved leads. Repeated IDs or alternative links to one work are aliases, not independent corroboration. “Metadata checked” means authorship/title/date or an identifier was checked; it does not mean every historical inference in the work was reread and validated. Where no page, edition, DOI or year was securely identified, it is left unresolved.

### 9.1 Retained synthesis and review status

This bibliography distinguishes sources retained in the supplied synthesis from references added for the atlas’s routes, battles and site events. A listed publication does not validate every claim attributed to it. Archaeological destruction, an ethnic identification, a reconstructed itinerary and a population estimate require different arguments.

**T — targeted text or source-page check:** relevant passages, selected plates, an excavation summary or a translation were examined during preparation. This does not mean that an entire book, corpus or excavation archive was reviewed. **M — metadata or abstract check:** bibliographic identity or a limited summary was checked; detailed claims remain qualified. **I — inherited or unresolved:** the synthesis supplies a name or identifier without enough information to establish an exact edition, work or passage. These statuses describe the review performed, not the intrinsic quality of a publication.

**`REPORT` — I.** *Reconstructing Late Bronze to Early Iron Age Population Movements and the Sea Peoples Phenomenon (1400–900 BCE): An Analytical Framework and Cartographic Register* is the retained supplied synthesis. It contains no formal bibliography, URLs or DOIs. Its preservation establishes provenance, not comprehensive historical verification. The references below add publication identities and targeted checks without silently supplying missing original citations.

### 9.2 Primary corpora and retained identifiers

These 28 families retain the synthesis’s identifiers. Except where an edition elsewhere in this catalogue is explicitly linked, their individual readings, dates and modern editions remain **I**. A tablet code or monument name is not a complete bibliography. Asterisks/question marks in the evidence must not disappear during citation cleanup.

| Family | Retained identifiers; edition/coverage qualification |
| --- | --- |
| 1. Amarna correspondence | **EA 38, 81, 122, 123, 151**. No named edition/translation supplied. |
| 2. Hittite CTH texts | **CTH 142, 376, 76, 181, 82, 147, 571.2, 211, 61, 105, 183, 572, 570**. Includes royal annals, prayers, treaties, Madduwatta and Tawagalawa; individual mappings unchecked. [Hethitologie-Portal catalogue](https://hatti.adwudlit.uni-mainz.de/CTH/index.php?l=Inventar&lang=EN). |
| 3. Alashiya naval text | **KBo 12.38**; precise edition/passage not supplied. |
| 4. Lycian royal inscriptions | **Yalburt; Südburg**; no specific modern editions. |
| 5. Earlier Byblos reference | **Byblos Obelisk**; inherited Lukka association, outside the animated period. |
| 6. Ugarit guard records | **RS 15.073, 15.015, 15.094, 15.095, 15.103**; administrative references, not additive migrations. |
| 7. Ugarit raiding correspondence | **RS 20.238; RS 34.129**. Emanuel’s supplementary discussion also identifies **RS 20.18**; that latter code is not explicit in the supplied synthesis. Šikalayu identification remains disputed. |
| 8. Ugarit fleet request | **UT 2062**; edition and claimed 150-ship context unresolved. |
| 9. Pylos Linear B | **PY An 1, An 610, An 724; o-ka watcher tablets**. Individual watcher IDs and modern editions unspecified. |
| 10. Kadesh | Ramesses II’s **Kadesh inscriptions and reliefs**, including Luxor context; service discussed by Abbas/Kelder, no dedicated edition supplied. |
| 11. Tanis | Ramesses II’s **Tanis Stele**; contextual discussion above, no separate edition entry. |
| 12. Merneptah monuments | **Great Karnak Inscription; Athribis Stele; Cairo Column; Heliopolis Inscription; Hymn of Victory/Israel Stele**. Manassa is the explicit Karnak reference, not blanket verification of every parallel tally. |
| 13. Medinet Habu | **Year 8 inscriptions/reliefs and separate campaign/captive scenes**; OIP 8 and SAOC 12 in §9.3. |
| 14. Harris | **Papyrus Harris I**, especially **76.6–9** in the supplementary review; Breasted translation in §9.3. |
| 15. Anastasi | **Papyri Anastasi I and II**; no complete editions specified. |
| 16. Wilbour | **Papyrus Wilbour**, Ramesses V; later landholding evidence. [Brooklyn Museum](https://opencollection.brooklynmuseum.org/objects/152126) dates it around 1147 BCE; the atlas retains its synthesis’s 1142 display convention. |
| 17. Sherden stelae | **Stemhebu; Padjesef; Donation Stele of Osorkon II**. Individual catalogue/edition details unresolved. |
| 18. Later documentary papyri | **Papyrus Amiens; Adoption Papyrus; BM 10326; BM 10375; Turin 2026**. Exact editions/readings not checked. |
| 19. Amenemope | **Onomasticon of Amenemope**; no explicit edition. Lists/presence do not date arrivals. |
| 20. Golenischeff | **Onomasticon Golenischeff; Papyrus Moscow 169**. Supplied nomenclature and its relationship to other onomastica remain unresolved. |
| 21. Wenamun | **Report of Wenamun**; Goedicke’s 1975 study in §9.3. Narrative setting is not a migrant census. |
| 22. Deir el-Medina | **Rhetorical Stele, Chapel C**; exact corpus/edition unspecified. |
| 23. Diplomatic letter | **Ramesses II–Hattusili III correspondence mentioning Danuna**; no individual letter ID supplied. |
| 24. Cilician inscriptions | **Çineköy; Karatepe; Zincirli; İncirli; Hassan Beyli**. Later Phoenician/Luwian evidence, with no named critical editions. |
| 25. Northern Palistin/Walistin | **Aleppo 6–7; Meharde; Sheizar; Tell Tayinat 1; Arsuz**; Taita/Halparuntiyas associations remain separately debated. |
| 26. Pedeset | **Pedeset Inscription, c. 900 BCE?** Identification unresolved; do not silently merge it with Padjesef. |
| 27. Biblical material | **Genesis 10:14; Deuteronomy 2:23; Amos 1:8, 9:7; Judges; 1–2 Samuel; Septuagint Caphtor interpretation**. No textual edition specified; later traditions remain distinct from Bronze Age itineraries. |
| 28. Greek traditions | **Ichnussa, Danaoi, Achai(w)oi, Tyrsenoi/Mopsos comparisons**. No ancient author/work/passage supplied; no inferred passage numbers are added. |

### 9.3 Modern studies, excavation reports and event references

The following 35 IDs are the event catalogue’s source identifiers. The register’s aliases are consolidated here: `GOTHENBURG-SEA-PEOPLES` identifies the first entry, `FELDMAN2019` the Ashkelon paper, and `DOR-REPORT` the Dor final-report project. Register entries `CLINE2014` and `REPORT` are listed separately below. Different works by the same author remain separate references.

**Mediterranean connections and archaeological context**

1. **`GOTHENBURG-SEAFARING-CONTEXT`**; alias **`GOTHENBURG-SEA-PEOPLES`**. University of Gothenburg, [*The Collapse of Bronze Age Societies in the Eastern Mediterranean: Sea Peoples in Cyprus?*](https://www.gu.se/en/research/the-collapse-of-bronze-age-societies-in-the-eastern-mediterranean-sea-peoples-in-cyprus). **T:** the project description presents traditional western/eastern identifications while emphasizing that migration explanations remain unproved. It supports a qualified reconstruction, not established ethnic homelands.

2. **`SARDINIAN-POTTERY-HST-2020`**. Maria G. Gradoli, Paula Waiman-Barak, Teresa Bürge, Zachary C. Dunseth, Johannes H. Sterba, Fulvia Lo Schiavo, Mauro Perra, Serena Sabatini and Peter M. Fischer, [“Cyprus and Sardinia in the Late Bronze Age: Nuragic table ware at Hala Sultan Tekke”](https://doi.org/10.1016/j.jasrep.2020.102479), *Journal of Archaeological Science: Reports* 33 (2020), 102479. **M:** archaeometric identification of Sardinian-made vessels supports contacts; vessel provenance does not identify their owners as Sherden or specify migrant numbers.

3. **`AEGEAN-DEGER-JALKOTZY-2008`**. Sigrid Deger-Jalkotzy, [“Decline, Destruction, Aftermath”](https://doi.org/10.1017/CCOL9780521814447.018), in *The Cambridge Companion to the Aegean Bronze Age* (2008), 387–416. **M:** chronological and interpretive overview; individual palace destructions should not be collapsed into one named army’s campaign.

4. **`PYLOS-EXCAVATION-UC`**. University of Cincinnati, [*Blegen Bulletin* 2016](https://classics.uc.edu/images/documents/Blegen_Bulletin_2016.pdf). **T:** excavator account of the Palace of Nestor’s final fire, conventionally around 1180 BCE. It does not identify the attackers.

5. **`PYLOS-EPHORATE`**. Ephorate of Antiquities of Messenia, [“Palace of Nestor on Ano Englianos”](https://www.efamess.gr/en/pois/anaktoro-nestoros-ston-ano-egkliano/). **T:** official archaeological overview using a broader late-thirteenth/early-twelfth-century destruction date. This broader framing remains visible alongside the Cincinnati chronology.

6. **`TIRYNS-DAI-MARAN`**. Joseph Maran and colleagues, [Tiryns: work in 2012–2014](https://doi.org/10.34780/c2b2-e294), *DAI eForschungsberichte* 2015/3, 47–55. **T:** excavation discussion of destruction and rebuilding, rather than proof of a particular invader.

7. **`ARGOLID-HERACLES-2018`**. Klaus-G. Hinzen, Joseph Maran, Hector Hinojosa-Prieto, Ursula Damm-Meinhardt, Sharon K. Reamer, Jana Tzislakis, Kilian Kemna, Gregor Schweppe, Claus Fleischer and Katie Demakopoulou, [“Reassessing the Mycenaean Earthquake Hypothesis: Results of the HERACLES Project from Tiryns and Midea, Greece”](https://doi.org/10.1785/0120170348), *Bulletin of the Seismological Society of America* 108.3A (2018), 1046–1070. **M:** the study and institutional account challenge an earthquake explanation; rejecting an earthquake does not establish Sea Peoples attackers.

8. **`THEBES-MUSEUM`**. Archaeological Museum of Thebes, [“Mycenaean period”](https://www.mthv.gr/en/permanent-exhibition/mycenaean-period/). **T:** burnt archives and palatial damage, with cause unknown. The source does not synchronize every building’s destruction.

9. **`MIDEA-SWEDISH-INSTITUTE`**. Swedish Institute at Athens, [Midea excavation overview](https://www.sia.gr/en/articles.php?tid=339). **T:** physical destruction and subsequent rebuilding; earthquake and attack interpretations require separate evaluation.

10. **`HATTUSA-DARK-AGE-2025`**. Federico Giusfredi and Alvise Matessi, [“The Dark Age”](https://iris.univr.it/retrieve/16bc11e4-06cf-4e3e-931b-be32934e3f7a/9789004729704-BP000002.pdf) (2025), especially p. 21. **T:** targeted chapter discussion of clearance, abandonment and nonuniform burning. This review does not establish a securely identified Sea Peoples assault on the capital.

11. **`HATTUSA-BIAA-LOCATION`**. British Institute at Ankara, [Boğazköy/Hattuşa site record](https://digitalrepository.biaa.ac.uk/biaaplace000143). **M:** site identity and geographic anchor; coordinates are not evidence for an invading army’s route.

12. **`TROY-TUEBINGEN`**. Stephan W. E. Blum, Michaela Thater and Diane Thumm-Doğrayan, [*Studia Troica Monograph* 5](https://publikationen.uni-tuebingen.de/xmlui/bitstream/handle/10900/73578/StTrMonograph5_Blum_Thater_Thumm-Dograyan.pdf?isAllowed=y&sequence=1). **M:** chronological reference for Troy VI/VIIa, including the approximately 1190/1180 BCE framework. The catalogue’s descriptive title is not a full bibliographic transcription of the volume.

13. **`TROY-CINCINNATI`**. University of Cincinnati, [history of its archaeological excavations](https://classics.uc.edu/humanities/classics/about/archinclassics). **T:** Blegen’s Troy VIIa interpretation and excavation history; an association with Trojan War tradition does not identify Sea Peoples.

14. **`UGARIT-YON-1995`**. Marguerite Yon, [French archaeological mission account of Ras Shamra–Ugarit](https://www.ancientportsantiques.com/wp-content/uploads/Documents/PLACES/Levant/Ugarit-Yon1995.pdf) (1995; hosted mirror). **T:** targeted destruction chronology around 1190/1180 BCE. An excavated destruction is distinct from identifying its attackers.

15. **`UGARIT-LETTERS-CHS`**. Jeffrey P. Emanuel, [“Cretan Lie and Historical Truth: Examining Odysseus’ Raid on Egypt in its Late Bronze Age Context”](https://www-current.chs.harvard.edu/jeffrey-p-emanuel-cretan-lie-and-historical-truth-examining-odysseus-raid-on-egypt-in-its-late-bronze-age-context/) (2012). **T:** translations/discussion of RS 20.238 and RS 20.18. Enemy ships are attested; their ethnic identities and exact earlier travels are not thereby established.

16. **`KILISE-EXCAVATORS-2014`**. C. Bouthillier and colleagues, [“Further work at Kilise Tepe, 2007–11”](https://eprints.gla.ac.uk/89953/1/89953.pdf), *Anatolian Studies* 64 (2014), 95–161. **T:** distinct phases, fires and occupation history; these cannot be flattened into one universal 1200 BCE invasion.

17. **`CILICIA-GATES-2007`**. Marie-Henriette Gates, [“Sea Peoples or Syrian Peddlers? The Late Bronze–Iron I Aegean Presence in Syria and Cilicia”](https://www.academia.edu/448676/Sea_Peoples_Or_Syrian_Peddlers_The_Late_Bronze_Iron_I_Aegean_Presence_In_Syria_and_Cilicia_2007_) (2007). **M:** material-cultural interaction is relevant; pottery styles alone are not ethnic censuses.

18. **`KARKEMISH-EXCAVATORS-2025`**. Turco-Italian Archaeological Expedition, [Karkemish exhibition catalogue, *OrientLab* 3](https://cris.unibo.it/retrieve/504ac79c-3eb5-4495-b315-d18e75c29c7f/Karkemish_Exhibition_Catalogue_OrientLab3.pdf) (2025), especially 30–31. **T:** urban continuity and a sealed administrative complex without violent destruction provide a counterexample to blanket collapse maps.

19. **`ASHKELON-ANCIENT-DNA-2019`**; alias **`FELDMAN2019`**. Michal Feldman, Daniel M. Master, Raffaela A. Bianco, Marta Burri, Philipp W. Stockhammer, Alissa Mittnik, Adam J. Aja, Choongwon Jeong and Johannes Krause, [“Ancient DNA sheds light on the genetic origins of early Iron Age Philistines”](https://doi.org/10.1126/sciadv.aax0061), *Science Advances* 5.7 (2019), eaax0061. **M:** publication identity and abstract checked. Ten sampled genomes are not a city census, a uniquely identified homeland or a measured fraction of migrants.

20. **`DOR-FINAL-REPORT-2018`**; alias **`DOR-REPORT`**. Ilan Sharon, Ayelet Gilboa, Jeffrey R. Zorn and Sveta Matskevitch, [*Excavations at Dor, Final Report*](https://whitelevy.fas.harvard.edu/publications/excavations-dor-final-report-directed-ephraim-stern-1986%E2%80%932000-ilan-sharon-and), *Qedem Reports* 10–12 (2018), Institute of Archaeology, Hebrew University of Jerusalem, in cooperation with the Israel Exploration Society. **T:** the publication-programme page confirms the authors, volumes and architectural/ceramic continuity; the full multivolume excavation publication was not exhaustively reviewed.

21. **`DOR-EXCAVATORS-2014`**. Gilboa, Sharon and Zorn, [“An Iron Age I Canaanite/Phoenician Courtyard House at Tel Dor”](https://ecommons.cornell.edu/bitstream/1813/103931/2/Iron_Age_I_Canaanite-Phoenician_Courtyard_House_at_Tel_Dor_JSTOR.pdf), *BASOR* 372 (2014). **T:** targeted discussion of continuity and archaeological context, rather than an exact dated foreign replacement.

22. **`ALALAKH-EXCAVATORS-2020`**. Tara Ingman, Stefanie Eisenmann, Eirini Skourtanioti, Murat Akar, Jana Ilgner, Guido Alberto Gnecchi Ruscone, Petrus le Roux, Rula Shafiq, Gunnar U. Neumann, Marcel Keller, Cäcilia Freund, Sara Marzo, Mary Lucas, Johannes Krause, Patrick Roberts, K. Aslıhan Yener and Philipp W. Stockhammer, [“Human mobility at Tell Atchana (Alalakh), Hatay, Turkey during the 2nd millennium BC: Integration of isotopic and genomic evidence”](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0241883), *PLOS ONE* 16.6 (2021), e0241883, DOI **10.1371/journal.pone.0241883**. **M:** publisher metadata and abstract checked. **The retained ID/title says 2020; the publisher dates the paper 30 June 2021.** The documentation uses 2021 without concealing the catalogue discrepancy.

23. **`MILETUS-EXCAVATION`**. University of Hamburg, [Miletus excavation: city history](https://www.miletgrabung.uni-hamburg.de/en/milet/milet-geschichte.html). **T:** excavation-project chronology; a simplified dated Sea Peoples sack is not adopted.

24. **`MILETUS-MOUNTJOY-2004`**. P. A. Mountjoy, [“Miletos: a note”](https://doi.org/10.1017/S006824540001707X), *The Annual of the British School at Athens* 99 (2004), 189–200. **M:** publication/chronological discussion; the later online-publication date should not replace the 2004 volume date.

25. **`DESTRUCTION-REVIEW-2024`**. Guy D. Middleton, [“Getting closer to the Late Bronze Age collapse in the Aegean and eastern Mediterranean, c. 1200 BC”](https://www.cambridge.org/core/journals/antiquity/article/getting-closer-to-the-late-bronze-age-collapse-in-the-aegean-and-eastern-mediterranean-c-1200-bc/482564326A668899FF183DD949FC520F), *Antiquity* 98 (2024), 260–263. **T:** scholarly review, including Millek’s work; it is not the excavation archive or Millek’s complete underlying audit.

**Egyptian campaigns, service and settlement**

26. **`EGYPT-ABBAS-2017`**. Mohamed Raafat Abbas, [“A Survey of the Military Role of the Sherden Warriors in the Egyptian Army during the Ramesside Period”](https://www.enim-egyptologie.fr/revue/2017/2/Abbas_ENiM10_p7-23.pdf), *ENiM* 10 (2017), 7–23. **T:** Sherden capture, service and integration; a service context must not be reassigned automatically to a hostile coalition.

27. **`EGYPT-MANASSA-2003`**. Colleen Manassa, [*The Great Karnak Inscription of Merneptah: Grand Strategy in the 13th Century BC*](https://doi.org/10.2307/j.ctvhrcxxf), *Yale Egyptological Studies* 5, Yale Egyptology, cited as 2003. **M:** epigraphic reference identity checked; no complete-volume verification is claimed. **The DOI registry records 31 December 2004**, while the retained bibliography uses 2003. Keep the print citation and digital metadata date distinguishable rather than silently substituting one.

28. **`EGYPT-EMANUEL-2018`**. Jeffrey P. Emanuel, [*Black Ships and Sea Raiders: The Late Bronze and Early Iron Age Context of Odysseus’ Second Cretan Lie*](https://www.asau.ru/files/pdf/1638165.pdf), Lanham: Lexington Books, cited as 2018, especially 73–77 and 155–157; hosted copy. **T:** selected campaign/counting and later-residence discussions, not a comprehensive review of every source cited in the book. The scan’s title/copyright pages identify Lexington Books and ©2017, whereas its digital wrapper says 2018; that distinction is retained rather than silently resolving edition dating.

29. **`EGYPT-MH-I`**. The Epigraphic Survey, [*Medinet Habu I: Earlier Historical Records of Ramses III*](https://isac.uchicago.edu/publications/medinet-habu-volume-i-earlier-historical-records), *Oriental Institute Publications* 8 (1930). **T:** selected primary facsimile material. Different regnal years/campaign scenes retain their identities.

30. **`EGYPT-MH-TRANSLATION`**. William F. Edgerton and John A. Wilson, [*Historical Records of Ramses III: The Texts in Medinet Habu Volumes I and II*](https://oi.uchicago.edu/sites/default/files/uploads/shared/docs/saoc12.pdf), *Studies in Ancient Oriental Civilization* 12 (1936). **T:** selected translations complement, rather than replace, the facsimile corpus.

31. **`EGYPT-HOFFMEIER-2018`**. James K. Hoffmeier, [“A Possible Location in Northwest Sinai for the Sea and Land Battles between the Sea Peoples and Ramesses III”](https://www.academia.edu/38697603/A_Possible_Location_in_Northwest_Sinai_for_the_Sea_and_Land_Battles_between_the_Sea_Peoples_and_Ramesses_III), *BASOR* 380 (2018), 1–25. **M:** a geographic interpretation, not a settled battlefield location.

32. **`EGYPT-HARRIS-I`**. Papyrus Harris I 76.6–9, translated in James H. Breasted, [*Ancient Records of Egypt*, IV, §403, p. 201](https://www.mercaba.es/egipto/documentos_IV_egipcios.pdf); hosted scan. **T:** capture and stronghold settlement coexist with royal annihilation rhetoric. This is neither an exact migrant census nor a list of identified stronghold coordinates.

33. **`EGYPT-KELDER-GETTY`**. Jorrit M. Kelder, [“From Thutmose III to Homer to Blackadder: Egypt, the Aegean, and the ‘Barbarian Periphery’ of the Late Bronze Age World System”](https://www.getty.edu/publications/egypt-classical-world/01/), chapter 1 in *Egypt and the Classical World*, especially paragraphs 32–35. **T:** military service, landholding and integration context; author and full chapter title rechecked on the Getty publication page.

34. **`EGYPT-ETHNICITY-UCLA`**. *UCLA Encyclopedia of Egyptology*, [“Ethnicity”](https://escholarship.org/uc/item/32r9x0jr). **T:** selected discussion of documentary identities and later Sherden presence. Ethnic designations do not prove unchanged individuals across generations.

35. **`EGYPT-BENDOR-EVIAN-2017`**. Shirly Ben-Dor Evian, [“Ramesses III and the ‘Sea-peoples’: Towards a New Philistine Paradigm”](https://doi.org/10.1111/ojoa.12115), *Oxford Journal of Archaeology* 36.3 (2017), 267–285. **M:** an alternative interpretation of the scenes and chronology; the atlas does not present contested locations or scene order as certain.

**Other retained references and metadata qualifications**

**`CLINE2014` — T.** Eric H. Cline, *1177 B.C.: The Year Civilization Collapsed*, Princeton: Princeton University Press (2014), [publisher’s prologue](https://assets.press.princeton.edu/chapters/s10185.pdf); the route review also links [another publisher-hosted prologue](https://assets.press.princeton.edu/chapters/p10597.pdf). Both were inspected for the competing homeland models and distinct coalitions. Excerpt filenames alone do not establish edition differences.

The following references are missing as independent event-catalogue entries, although their wording or review citations remain retained:

| Reference or lead | Identification and status |
| --- | --- |
| Robert Drews (1993), synthesis §2.2 | **M:** [*The End of the Bronze Age: Changes in Warfare and the Catastrophe ca. 1200 B.C.*](https://press.princeton.edu/books/ebook/9780691209975/the-end-of-the-bronze-age), Princeton University Press. Publisher metadata confirmed; the atlas has not independently replicated the book’s destruction map. |
| Jesse Millek, cited as 2017–2023, §§2.2/5 | **M:** [*Destruction and Its Impact on Ancient Societies at the End of the Bronze Age*](https://www.isdistribution.com/PdfRender.aspx?aId=155294), Lockwood Press (2023), ISBN 9781948488839. The range does not identify every earlier work. Middleton’s review is a separate reference; numerical audit totals remain attributed claims. |
| Hans Goedicke (1975), §3.2 Tjeker | **M:** [*The Report of Wenamun*](https://ci.nii.ac.jp/ncid/BA30976516?l=ja), Johns Hopkins University Press. Academic-library metadata corroborated; the particular proposed geographical reinterpretation was not reverified. |
| Eshel and colleagues (2020), §2.4 | **M:** T. Eshel, N. Yahalom-Mack, O. Tirosh, A. M. Maeir, Y. Harlavan, A. Gilboa and Y. Erel, *Pollution and Human Mobility in the Southern Levant During the Iron Age Using Chemical and Isotopic Analysis of Human Tooth Enamel*, *Journal of Archaeological Science* 124, 105262. [Coauthor’s publication announcement](https://gath.wordpress.com/2020/11/07/new-article-on-lead-pollution-and-human-mobility-in-the-iron-age-levant-including-safi/) checked. Its multisite study should not be reduced to an independently verified Gath-only claim. |
| Moffat and colleagues (2020), §2.4 | **M:** Ian Moffat, Renaud Joannes-Boyau, Les Kinsley, Malte Willmes and Rainer Grün, [“Strontium Isotope Investigation of Human Mobility based on Teeth from Cave T1”](https://researchnow.flinders.edu.au/en/publications/strontium-isotope-investigation-of-human-mobility-based-on-teeth-/), in Aren M. Maeir and Joe Uziel, eds., *Tell es-Safi/Gath II: Excavations and Studies*, Ägypten und Altes Testament 105, Münster: Zaphon. Flinders gives **237–245**; another university record gives **227–245**. Prefer the author’s record while flagging the disagreement. DOI **10.31219/osf.io/sxkbd** identifies an accepted manuscript, not a verified publisher chapter DOI. |
| Moreu (2020), §3.2 Ekwesh | **I/M:** the synthesis names **Francisco Moreu**; the located [*The First Wave of Sea Peoples*](https://www.ancientportsantiques.com/wp-content/uploads/Documents/AUTHORS/SeaPeoples/SeaPeoples-Moreu2020.pdf) names **Carlos J. Moreu**. This remains a candidate match; venue/peer-review status and the proposed Tel Nami itinerary are not established by that match. |
| Route-review additions | Teresa Bürge and Peter M. Fischer with Serena Sabatini, Mauro Perra and Maria Giuseppina Gradoli, [“Nuragic Pottery from Hala Sultan Tekke: The Cypriot-Sardinian Connection”](https://austriaca.at/0xc1aa5576_0x003b51ab.pdf), *Ägypten und Levante* 29 (2019), 231–244; Assaf Yasur-Landau, [*The Philistines and Aegean Migration at the End of the Late Bronze Age*](https://www.cambridge.org/core/books/philistines-and-aegean-migration-at-the-end-of-the-late-bronze-age/47F89801F12D8073A797FFE775CE5856), Cambridge University Press (2010); Jeffrey P. Emanuel, [“Sherden from the Sea”](https://emanuel.scholars.harvard.edu/sherden-from-the-sea_jaei-5-1), *JAEI* 5.1 (2013), 14–27. **M:** explicit retained review references, distinct from similarly named catalogue works. |
| Additional chronology references | British Museum, [Troy exhibition large-print guide](https://www.britishmuseum.org/sites/default/files/2019-12/Large%20print%20guide_Troy.pdf), described in the route review as “Looking for the Trojan War,” for the conventional Kadesh label; this is a descriptive reference, not a newly verified exact publication title. Kaniewski and colleagues, [“The Sea Peoples, from Cuneiform Tablets to Carbon Dating”](https://pmc.ncbi.nlm.nih.gov/articles/PMC3110627/), *PLOS ONE* 6.6 (2011), e20232, DOI **10.1371/journal.pone.0020232**. **M/T:** northern-Levant chronology is relevant; it does not identify every attacker or establish a climatic itinerary. |

### 9.4 Unresolved scholarly leads and citation limits

The synthesis names the following scholars without consistently specifying titles, years or pages. These remain **I** unless an independently identified work above is explicitly cited; sharing an author does not establish that two citations refer to the same publication.

| Topic and synthesis section | Retained leads |
| --- | --- |
| Terminology, §1 | Emmanuel de Rougé, 1855 attribution; exact publication unresolved. |
| Dor/Tjeker, §§1.2/3.2 | Ayelet Gilboa; Ilan Sharon. The listed excavation reports do not resolve every attributed linguistic argument. |
| Danuna/Adana, §1.2 | Mirko Novák; Massimo Forlanini; Karen Radner. |
| Geographical identification, §1.2 | Reinhard Jung. |
| Campaign lists and lower chronology, §§2.1/2.3 | Dan’el Kahn. |
| Accounting, §2.1 | Ian Shaw; Colleen Manassa. Their paired attribution is not automatically Manassa’s identified monograph. |
| Ships and flotillas, §§2.1/4.1 | Shelley Wachsmann; no exact work or page supplied. |
| Traditional chronology, §2.3 | Lawrence Stager; Moshe Dothan; Trude Dothan. |
| Lower chronology, §2.3 | Israel Finkelstein; David Ussishkin; Kahn; Shirly Ben-Dor Evian. |
| Tayinat sequence, §§2.3/3.2 | Lynn Welton; Timothy Harrison; Brian Janeway; Brian Routledge. |
| Genetics and identity, §2.4 | Daniel Master. |
| Circumcision/trophy interpretation, §3.2 | Konstantinos Kopanias. A relevant candidate is [“Mercenaries or refugees?”](https://doi.org/10.32028/jga.v2i.575), *Journal of Greek Archaeology* 2 (2017), 115–130; metadata confirmed, exact original attribution unresolved. |
| Denyen/Danites, §3.2 | Wolfgang Zwickel. |
| Northern Palistin connection, §3.2 | Itamar Singer; J. David Hawkins; Harrison. |
| Qualifications to that connection, §3.2 | Mark Weeden; K. Lawson Younger; Welton’s team. |
| Demographic models, §§4.1/4.3 | Finkelstein; Assaf Yasur-Landau; Stager. No missing page references or precise derivations are invented. |

A verified relevant Tayinat field report is Welton and colleagues, [“Shifting Networks and Community Identity at Tell Tayinat in the Iron I”](https://doi.org/10.3764/aja.123.2.0291), *American Journal of Archaeology* 123.2 (2019). It is a candidate for contextual reading, not a complete resolution of the grouped attribution; Routledge is not among this article’s authors.

The supplied synthesis discusses Etesian winds, coastal cabotage, island hops and provisioning constraints without naming a specific environmental or paleoclimate study. Those statements remain inherited contextual assumptions. No drought bibliography is invented, and Kaniewski’s chronology paper is not treated as evidence determining every route. Archaeological and genetic sources likewise do not supply a direct population conversion merely because they support contact or mobility.

### 9.5. Cartographic inputs, software services and attribution

These sources describe modern reference geography and display services, not evidence for an ancient migration, population total or attacker. Metadata/configuration were checked on 15 November 2026. An access date here is not a previously unrecorded asset acquisition date.

| Input | Source and retained version information | Use and limitation |
| --- | --- | --- |
| Natural Earth land | Natural Earth, [1:10m Land](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/); retained [GeoJSON upstream path](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_land.geojson). Source hash given in section 5; release/download date unrecorded. | Modern land clipping and route geometry. The locally derived mask has schema version 1, which is not a Natural Earth release number. |
| Natural Earth rivers | Natural Earth, [1:10m Rivers and Lake Centerlines](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/); retained [GeoJSON upstream path](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson), SHA-256 `bb854a900ecbd3b408df46d5e16e3e0f974ba55993f9d8b5c26e855273c0905a`. Release/download date unrecorded. | Shared modern river reference, including the Mesopotamian overlay; not proof of Sea Peoples river itineraries or ancient channel positions. |
| OpenFreeMap | [OpenFreeMap project and attribution](https://openfreemap.org/); configured vector TileJSON `https://tiles.openfreemap.org/planet` and font endpoint `https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf`. No pinned tile build/version. | Physical-map reference tiles and labels. Service/software licensing does not replace upstream map-data licensing. |
| OpenStreetMap | [OpenStreetMap contributors, copyright and licensing](https://www.openstreetmap.org/copyright), Open Database License (ODbL). | Modern geographic data underlying the vector map. Required attribution remains applicable to map images/video. |
| OpenMapTiles | [OpenMapTiles project](https://openmaptiles.org/) and [license](https://github.com/openmaptiles/openmaptiles/blob/master/LICENSE.md): BSD 3-Clause for code; CC BY 4.0 for the cartographic/schema design, with attribution. | Vector schema/design; neither an ancient historical dataset nor a declaration that every underlying feature is public domain. |
| Mapzen/AWS Terrain Tiles | [AWS open-data registry](https://registry.opendata.aws/terrain-tiles/) and [upstream attribution inventory](https://github.com/tilezen/joerd/blob/master/docs/attribution.md). Configured endpoint `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`, Terrarium encoding, 256-pixel tiles, maximum zoom 12. No per-tile source/version manifest retained. | Modern elevation/hillshade context. Providers have multiple attribution/licensing conditions; there is no blanket public-domain claim. Elevation does not drive the Sea Peoples routing cost or population calculation. |

Natural Earth states that its raster and vector data are [public domain](https://www.naturalearthdata.com/about/terms-of-use/). OpenFreeMap’s [licensing notice](https://raw.githubusercontent.com/hyperknot/openfreemap/main/LICENSE.md) also identifies component licenses, including SIL Open Font License 1.1 for Noto Sans; that notice is separate from OSM data licensing. Preserve the displayed map credit and the applicable upstream attributions when distributing screenshots or video.

The publication is a derivative atlas, not a redistribution license for the linked scholarly PDFs, journal pages or unpublished input. Links identify evidence and context; their copyright and access terms remain with their rights holders.
