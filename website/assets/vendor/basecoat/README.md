# Basecoat settings controls

Vendored from the official `basecoat-css@1.0.2` npm package (MIT).

`settings.css` contains the button, radio, checkbox and range rules from
`dist/basecoat.cdn.css` (Vega style), plus their referenced tokens and Tailwind
property defaults. Selectors are scoped to `.form`; `.btn` and `.input` are
renamed to `.bc-button` and `.bc-input` to avoid landing-page class conflicts.
Only a minimal control reset is included; no global reset, page styles or
unrelated components are included.

`basecoat.min.js` and `range.min.js` are unchanged upstream files. The runtime
initializes range inputs inserted by the demo and cleans them up on rerender.
Theme and layout overrides live in `../../site.css`.

Upstream: https://basecoatui.com/ and https://github.com/hunvreus/basecoat
Tarball: https://registry.npmjs.org/basecoat-css/-/basecoat-css-1.0.2.tgz
SHA-1: `e85e8ce3ec452c3cc38a696b1d269b7168176f6c`

See `LICENSE.md` and `TAILWIND-LICENSE` for license notices.
