# Migration Atlas data format

Import a UTF-8 JSON file in the Data tab, or drop it onto the map. Start with [starter.json](../data/starter.json) for a small example with unknown population sizes. The bundled [demo.json](../data/demo.json) exercises more features. Both datasets are fictional software examples, not historical sources.

Historical content belongs in your JSON. No application code needs to change when you add populations, routes, places, dates or references.

## Small complete example

```json
{
  "meta": {
    "title": "Fictional example",
    "synthetic": true,
    "peoplePerDot": 1000,
    "timeRange": ["1100 BCE", "600 BCE"],
    "defaultView": { "center": [16, 34], "zoom": 4 }
  },
  "groups": [
    { "id": "example", "name": "Example population (fictional)", "color": "#2f6fd1" }
  ],
  "places": [],
  "migrations": [
    {
      "id": "journey", "group": "example", "name": "Fictional journey",
      "start": "1000 BCE", "end": "800 BCE",
      "path": [[12, 32], [16, 34], [20, 36]],
      "toSettlement": "destination", "routeCertainty": "approximate"
    }
  ],
  "settlements": [
    {
      "id": "destination", "group": "example", "name": "Fictional destination",
      "start": "800 BCE", "center": [20, 36], "radiusKm": 80,
      "boundary": "fuzzy"
    }
  ],
  "regions": [],
  "events": []
}
```

Omitted population estimates stay unknown: this example draws a route and settlement area without inventing population dots.

## File structure and shared fields

The root is an object with `meta` and six optional arrays: `groups`, `places`, `migrations`, `settlements`, `regions`, `events`. A missing collection behaves as an empty array. A supplied collection must be an array.

Give every record a stable, nonempty string `id`, unique within its collection. Globally distinct IDs also keep event `related` references unambiguous. IDs connect records; names are for display. Missing IDs and duplicate IDs are normalized with validation messages, so explicit unique IDs are recommended for reliable editing and updates.

For groups, migrations, settlements and regions, use `name`, `description`, `tags` (an array of strings), and `sources` as needed. Events support `description` and `sources`; places contain only their identity, name and coordinates in the drawing model. Unknown authoring fields remain in the raw dataset but do not affect visualization.

`confidence` accepts `high`, `medium`, `low`, or `speculative` on migrations, settlements, regions and population estimates. Omission defaults to `medium`; that default is a rendering category, not an assessment of your evidence.

Sources may be bibliography strings, HTTP(S) URL strings, or objects:

```json
"sources": [
  "Your bibliography entry",
  { "title": "Your source title", "url": "https://example.org/reference", "note": "Page or passage" }
]
```

Only absolute HTTP(S) source URLs become links. Other URL schemes are omitted from the drawing model with a warning. Source text is displayed as text.

## Dates and chronology

Dates accept signed numbers or strings such as `-1200`, `"1200 BCE"`, `"500 CE"`, `"AD 500"`, `"12000 BP"`, and `"45 kya"`. BC/AD and dotted era abbreviations are accepted. BP, ka/kya, and ma/mya use **1950** as their fixed present, not the current year. Fractional years are supported.

The internal axis is continuous: negative years are BCE and positive years are CE. Numeric zero is the axis boundary. This is an approximation across the BCE/CE boundary, not a historical year-zero calendar; explicit `"0 BCE"` and `"0 CE"` are rejected. Use this atlas for year-scale chronology rather than exact day/calendar conversion.

Prefixes such as `c.`, `ca.`, `circa`, `about`, or `~` mark approximate dates during parsing. They place the record at the supplied central year and produce an informational validation message. The renderer does not calculate probabilistic date bands. Preserve alternative chronology, date ranges and rationale in `description`, custom raw fields, confidence and sources. Use separate waves when they represent separate movements.

Migrations need `start` and `end`; an unknown date is not replaced by an invented historical duration. Undated or otherwise incomplete records remain available in the Data editor and raw export, but cannot be animated until enough information is supplied. Settlements and regions need `start`; omitting `end` intentionally leaves them open-ended. Events need `year` and may have `endYear`. An end must not precede its start. Equal migration dates use a tiny internal interval for rendering.

## Metadata

| Field | Meaning |
| --- | --- |
| `title`, `description` | Dataset title and explanatory text. |
| `synthetic` | `true` labels the dataset as a synthetic demo. Set it appropriately for your own work. |
| `peoplePerDot` | Positive default number represented by a dot; default 1000. The Layers tab can change the viewing scale. |
| `timeRange` | `[start, end]` in any accepted date form. Otherwise computed from records/keyframes with padding. |
| `defaultView` | `{ "center": [longitude, latitude], "zoom": 3 }`; supported zoom range 0.8–14. |

A range that excludes records produces a warning. Playback range controls change the current view of time; use Dataset settings in the Data tab to save a different default range.

## Coordinates, groups and places

Coordinates are `[longitude, latitude]` in degrees, in that order. Latitude must be -90…90; longitude normally -180…180. Some 0…360 longitudes are wrapped with a warning. The Web Mercator map limits the visible polar latitudes. Route segments take the short geographic arc between waypoints, including across the antimeridian; add intermediate waypoints to specify a different course.

A group is a population identity, not an automatic count:

```json
{ "id": "branch", "name": "Fictional branch", "parent": "example", "color": "#15999e" }
```

`parent` supports subgroup filtering and related colors. Missing colors are assigned automatically. Group parentage does not create, transfer or duplicate people.

A place is a reusable named coordinate:

```json
{ "id": "origin", "name": "Fictional origin", "coord": [12, 32] }
```

Use `"@origin"` wherever a coordinate is accepted, including route points, circle centers and event locations. Coordinates also accept `{ "lon": 12, "lat": 32 }` or `{ "place": "origin" }`. Keep place definitions simple; if one place refers to another, define the referenced place first.

## Migrations

A migration needs `id`, `group`, `start`, `end`, and at least two `path` points. `name` and a free-form `type` help exploration; type defaults to `migration` and can be `displacement`, `return`, `expansion`, or your own category.

```json
{
  "id": "timed-wave", "group": "example", "name": "Fictional timed wave",
  "type": "migration", "start": "1000 BCE", "end": "800 BCE",
  "path": [
    "@origin",
    { "coord": [16, 34], "year": "900 BCE", "name": "Fictional waypoint" },
    [20, 36]
  ],
  "population": { "estimate": 12000, "min": 8000, "max": 16000, "confidence": "low" },
  "corridorWidthKm": 80, "spread": 0.5,
  "routeCertainty": "approximate", "toSettlement": "destination",
  "persist": true
}
```

Interior waypoint dates describe when the **leading edge** reaches that waypoint. They must be chronological and inside `start`…`end`; invalid timing is ignored with a warning. Untimed distances interpolate between the timed points. `spread` is the fraction of the event interval over which departures are staggered, from 0 up to but excluding 1 (default 0.5). All cohorts arrive by `end`.

| Optional field | Behavior |
| --- | --- |
| `population` | Number or estimate object. Omit when unknown. |
| `routeCertainty` | `known`, `approximate` (default), or `conjectural`; changes route styling. |
| `corridorWidthKm` | Nonnegative spread width; a display default is derived from route length. |
| `arrivalRadiusKm` | Nonnegative destination scatter radius; defaults to 1.5 × corridor width. |
| `fromSettlement` | Settlement ID; positions departing dots within its geometry. Resident estimates are not automatically reduced. |
| `toSettlement` | Settlement ID; positions arrivals within its geometry and hands their display to its numeric resident timeline, if supplied. |
| `persist` | Default `true`: keep arrivals visible when no numeric destination timeline takes over. `false` fades them after arrival. |
| `persistUntil` | Optional end of arrival persistence. |
| `parent` | Parent migration ID; identifies a branch of the same inclusive cohort. See accounting below. |

As an alternative to `path`, provide `from`, optional `waypoints`, and `to` coordinates. These are concatenated in that order; avoid repeating endpoints in multiple forms. `origin`/`destination` are accepted aliases. Each wave should have its own ID and dates.

## Population estimates and accounting

An estimate may be a nonnegative number, or `{ "estimate": 12000, "min": 8000, "max": 16000, "confidence": "low", "note": "Your rationale" }`. A range without `estimate` uses its midpoint. One supplied bound alone supplies the display value. Negative or nonfinite populations are rejected/ignored with diagnostics. Zero is known zero; omission means unknown. The Layers tab can display best, lower, or upper supplied estimates.

Settlement timelines describe **residents at that location**, excluding people currently traveling. Supply the resident decline yourself when a migration departs; the application does not subtract a migration from the supplied settlement timeline. Likewise, a destination's numeric timeline should include its residents after arrival. Arrived migration dots are suppressed when that numeric timeline takes over. When the destination has no numeric estimate, known migration arrivals can remain visible there without inventing the destination's total population.

For a split, set each child migration's `parent` to the shared parent migration. The parent's estimate is inclusive of the child branches. Departed child cohorts are reserved from the parent's visible cohort before filters are applied, so hiding a child does not recreate its population in the parent. If known child estimates exceed the known parent's available estimate, their displayed allocations are scaled proportionally and validation warns about the supplied inconsistency. Correct the data rather than relying on this visual guard. An unknown parent's estimate does not impose an invented cap.

For a merge, describe each incoming migration separately and point it at the same destination settlement. Supply a combined resident timeline there, and add a `merge` event if useful. The application does not infer a merged demographic estimate. Use end dates, persistence and settlement links to prevent an old cohort remaining visible as a separate population. Group hierarchy and semantic events are annotations; only migration `parent` links have shared-cohort accounting.

Dot locations are deterministic illustrative distributions, not individual trajectories or an exact census. Caps and zoom-dependent aggregation keep rendering usable; large records may use a higher effective number of people per dot. Counts of rendered dots are not demographic totals. Areas and routes with missing estimates remain visible without demographic dots. Political/cultural footprints never create population dots.

## Settlements and changing areas

A settlement needs `id`, `group`, `start`, and a circle or polygon. Add `end`, `population`, `confidence`, `boundary`, and fate information as known. `boundary` is `fuzzy` (default) or `defined`; use fuzzy boundaries to avoid implying precise historical limits.

```json
{
  "id": "destination", "group": "example", "name": "Fictional residents",
  "start": "800 BCE", "center": [20, 36], "radiusKm": 80,
  "extent": [
    { "year": "800 BCE", "radiusKm": 80 },
    { "year": "600 BCE", "radiusKm": 160 }
  ],
  "population": [
    { "year": "800 BCE", "estimate": 12000 },
    { "year": "600 BCE", "estimate": 18000, "min": 14000, "max": 22000 }
  ],
  "boundary": "fuzzy", "end": "500 BCE",
  "fate": "assimilated", "into": "receiving-group", "transitionYears": 50
}
```

Define `receiving-group` in `groups` before using that assimilation example. `fate` accepts `continues`, `assimilated`, `dispersed`, `extinct`, or `unknown`. With `assimilated`, `into` names the receiving group: the area changes color near `end` and then fades. This does not add residents to another settlement; supply the receiving population timeline separately. `transitionYears` controls the visual fade period. Open-ended settlements default to `continues`.

Population keyframes interpolate linearly and hold their first/last supplied value outside the keyframe interval, subject to the settlement lifetime and fades. A constant number or estimate object is also accepted. Duplicate population years keep the last entry with a warning. Unknown population is represented by omitting `population` or using an empty array.

Circles use `center` plus `radiusKm`; radius must be greater than zero and no larger than 20,038 km. An omitted radius uses a stated 100 km display default. For polygons use an array of at least three distinct vertices:

```json
"polygon": [[19, 35], [21, 35], [22, 37], [19, 37]]
```

For holes, nest rings: `"polygon": [outerRing, holeRing]`. A repeated closing vertex is optional. Zero-area outer rings and holes are rejected. Supply simple, non-self-intersecting rings with holes entirely inside the outer ring; validation does not perform complete topology repair. GeoJSON `geometry` with type `Polygon` is accepted; for `MultiPolygon`, only the first polygon is used and a warning is shown. Use separate settlement records for disconnected areas. Invalid route coordinates and invalid outer rings are not silently skipped or replaced by shortcuts.

`extent` contains dated geometry keyframes. With a base circle, keyframes may change only `radiusKm` or inherit its radius while moving the center. Otherwise provide a complete `center` + `radiusKm`, or `polygon`, in each keyframe. Circles interpolate across the interval. Polygon or mixed-geometry areas crossfade near the next keyframe, with seeded dots moving between corresponding sampled positions. They are approximate transitions, not a reconstruction of exact historical boundaries.

## Political, cultural and other footprints

`regions` are geographic footprints separate from demographic presence. A region needs `id`, `group`, `start`, and circle/polygon geometry. It supports `end`, `extent`, `confidence`, `description`, sources and tags. `kind` accepts `political`, `cultural`, `linguistic`, `religious`, or `other` and selects its style. Regions never imply resident population, territorial replacement or migration.

## Events

```json
{
  "id": "example-merge", "type": "merge", "name": "Fictional merge annotation",
  "year": "800 BCE", "groups": ["example"], "coord": [20, 36],
  "related": ["journey", "destination"], "description": "Your explanation"
}
```

`type` is free-form (`split`, `merge`, `assimilation`, `founding`, `abandonment`, `contact`, `note`, etc.). `year` is required; `endYear` is optional. `groups` lists associated group IDs. `coord` or `place` is optional; only located events draw a geographic marker. `related` lists associated record IDs. Events provide timeline/context annotations and navigation. They do not automatically alter routes, populations, identities or estimates.

## Editing, merging and validation

Import replaces the current raw dataset. Merge updates a record with the same ID **within its collection**, replacing that whole record; new IDs append. Merge keeps the current metadata when it already exists. Use Dataset settings to change metadata. A merge does not delete omitted records; delete them in the editor or import a complete replacement.

The raw JSON is kept separately from the compiled drawing model. Export JSON preserves raw fields, source date strings, notes, unknown fields and partial records; it does not silently replace them with generated defaults. Per-record editing saves the entire object displayed in its editor. Keep IDs stable because renaming one does not rewrite references elsewhere.

Validation reports errors, warnings and informational notes with a field path and record ID where available. A malformed root/collection shape is rejected while keeping the current dataset. Valid root objects may contain incomplete records: their raw data remains editable/exportable while records lacking necessary dates/geometry are excluded from rendering. Invalid optional pieces may be ignored with diagnostics. Review the Validation list after each change; the visible map alone cannot establish that every imported record is complete.

The browser stores the current dataset in local storage. Export regularly for a portable copy. Restore previous dataset provides one in-session dataset-level restore point; it is not a version history or a replacement for exported files.

## Camera presentation

Optional `meta.cameraRetirements` contains `{ "from": 160, "settlementIds": ["ancestral-pool"] }` rules. After that date, the listed retained settlements stop constraining the default occupied-population camera. Their people, positions and rendering remain intact. Moving cohorts always constrain the camera, and an explicit group, region or record filter restores the complete selected footprint. This is a presentation choice, separate from source chronology or population loss. Each rule requires a finite numeric date and a nonempty list of exact compiled settlement IDs.

## Stationary language adoption

Optional `meta.languageShifts` describes a reconstructed language change among people who remain in place. It recolours existing settlement dots across a geographic front without adding people, changing their positions or fading their population weight. It is separate from genetic ancestry and migrant transfers.

Each definition requires unique `id`, `reservoirId` (the exact compiled settlement ID), finite numeric `start` and `end` years with end after start, `fromLabel`, `toLabel`, a valid `color`, `basis`, and nonempty `sourceRecordIds`. Optional `direction` is `west-to-east` (default), `east-to-west`, `south-to-north`, or `north-to-south`. Dates, extent and language assignment remain model assumptions. Invalid or duplicate definitions produce validation warnings and are omitted.
