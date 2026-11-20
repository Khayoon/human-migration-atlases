# Reference implementation files

The selected files under `scripts/` and `src/` are authored reference copies linked from the edition methodology documents. They make the described model, geography, accounting and rendering choices inspectable.

They are **not a complete build tree**: the original full build source, private research inputs and working history are retained in the private archive. Their imports and input paths describe that working project; dependencies and private inputs are not supplied by these selected copies.

The prepared public application is the static website under [site/atlas](site/atlas/). The [README](README.md) links to the hosted atlas entries and the seven public source/methodology documents. Public model files are sanitized derivatives; oversized JSON copies are losslessly packaged for the viewer.

These reference copies do not republish the private full research reports, prompts or raw source registers. See each edition document for historical evidence, reconstruction choices and the recorded verification scope.

## Roma release provenance — 19 November 2026

The published Roma application is the frozen 16 November build: `main-Cxij54qR.js`, SHA-256 `764422c5a7be6995118d843cc801668aaa2ac69d51afd9293d0736c900661c1f`. Its prepared data, final methodology and 90.25-second video retain their verified fingerprints. The linked runtime implementation files were recovered byte-for-byte from that export’s source capture. The shared development checkout has changed since that build and was not used to rebuild this release.

The private archive preserves 39 of the 42 exact handoff files, all runtime source files in that handoff, both final documents and the original source/register. Exact historical versions of these three test files could not be recovered:

- `tests/descendant-support.test.ts` — expected SHA-256 `5815cfaf6f6baadd7d3e4fd59f025669fb3744bcdd8a1e5f56ca59aa49be6479`
- `tests/local-lineage-spread.test.ts` — expected SHA-256 `51de47f71dc04fa728b0c441e078865c310f5f5e8f5e1c13bb12e30724cf0804`
- `tests/settlement-dispersal.test.ts` — expected SHA-256 `751e88690c538fe22846152448c2d05d28165ca74fd5a0071ce4339e5b3fae74`

The recorded 427-pass result applies to the original frozen run. The archive does not claim a complete reproducible copy of that test suite; newer test versions are not substituted. The retained compiled build is independently checked in the deployed browser.
