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
