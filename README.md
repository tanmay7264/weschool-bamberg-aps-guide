# WeSchool to Bamberg APS Exchange Guide

[Open the student guide](https://tanmay7264.github.io/weschool-bamberg-aps-guide/)

Interactive student SOP for a short-term institutional exchange. Includes the complete responsibility flowchart, twelve detailed steps, document checklists, form guidance, handover tools, official sources, and downloads of the PDF SOP, Word document and one-page flowchart.

The interface uses React 19 and real Meta Astryx 0.7.17 components. The exchange theme extends Astryx Neutral with blue accents and a larger reading scale. The application shell is adapted from Astryx's shell-nav template; its MIT license is included in ASTRYX-LICENSE.txt.

## Development and publication

```sh
npm ci
npm run dev
npm run build
npm run astryx -- doctor --built dist
```

Application source is in app/. Canonical SOP content is in app/content.json. The generated theme module is astryx-themes.js; local theme source and settings are under themes/exchange/, and its compiled runtime is under src/themes/exchange/.

The build produces dist/ and copies its entry and local assets to the repository root. GitHub Pages serves the root of main. Commit source changes, compiled index.html, and assets/ after a successful build, then push main to publish. The three downloadable documents remain alongside the entry file.

Checklist progress uses the original browser-local storage key so the redesign preserves returning students' ticks. Cohort worksheet text stays in memory and is not saved or transmitted. Hash links such as #step-7 remain supported. The print action includes all steps and reference material.

## Content review

Public sources were verified on 24 November 2026. Cohort eligibility, PGDM classification and group payment instructions need institutional confirmation, as explained in the guide. Recheck APS and university instructions before each new cohort. The interface redesign does not change the published SOP requirements.

## Interactive learning features

The overview has an illustrated three-chapter explorer, a route-aware next-action helper using the student’s saved checklist ticks, and three practice scenarios with immediate explanations. Run `npm run check` for suggestion branches and route gates. Route choices and practice answers are session-only; the existing checklist storage key is preserved.

The three illustrations are AI-generated educational artwork, not photographs of a campus, official documents or real applicants. They were made with the built-in image generator after the requested Higgsfield generation was rejected because the connected account requires Basic or higher. Their prompts and provenance are in `app/media/illustration-prompts.json`.

## Animated journey map

`#flowchart` opens the focused map. The overview embeds the same component. SVG tiles use perspective and extruded surfaces for depth, with a flat-view toggle, zoom controls, keyboard navigation and a phone-friendly step list. The guided walkthrough advances every five seconds only after Play is pressed. Manual selection, pausing motion, reduced motion and hiding the browser tab stop playback.

The graph keeps the confirmed exemption exit, parallel university tasks and the additional-records return loop explicit. It is a preparation guide and reading order, not an application status or processing timeline. `npm run check` also validates these branches and the walkthrough boundary.

## Appearance, quick tour and credits

The sun/moon action switches the full Astryx theme, including the navbar, sidebar, controls and map. The preference uses `aps-guide-appearance-v1`, separate from checklist storage. Quick tour starts automatically on the first visit and spotlights fifteen features across all nine guide sections, with anchored explanations and Back, Next, Skip, Finish and try-this-section actions. Dismissal or completion is remembered with `aps-guide-quick-tour-v2`; the navbar and overview can replay it anytime. A native modal keeps keyboard focus inside the tour, Escape dismisses it, and the highlighted target and panel reposition on scrolling or resizing. Phone layouts use the active step list when the 3D map is not shown.

Website and print credits name Tanmay Narnaware. Both downloadable PDFs carry the same footer credit on every page and in author metadata. The original page counts, instructions and sources are retained. The standalone map and SOP page 2 now use the same graph as the website.

## Keep the print map in sync

After editing `app/flow-model.js`, run `python3 scripts/build-flowchart-pdfs.py` with Node on PATH and the ReportLab/pypdf packages available. This creates the vector one-page map and replaces only page 2 of the SOP. Both PDFs include clickable links to full step instructions. The normal build and checks compare a graph fingerprint in both PDFs with the website model and refuse to publish a stale PDF. After generating the PDFs, run `python3 scripts/update-word-guide.py` with python-docx, Pillow and Poppler available, then render the Word file for layout review. All three downloads carry the same graph fingerprint; the build also verifies the Word artifact hash. Versioned download links avoid reusing older cached files.

The editable Word copy includes the current map as a high-resolution inline figure, Tanmay Narnaware on the cover and page footers, and the same author metadata. Its instructions and tables are preserved.
