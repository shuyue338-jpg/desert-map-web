# Desert Map Web

## Project Purpose

`desert-map-web` is a Vite + React map narrative prototype for a PRP project on the "China Desertification Control Atlas".

The project explores how desertification-control cases can be presented through an atlas-style website. It combines a real interactive map, narrative sections, case cards, and a lightweight historical context timeline.

## Current Stage

This project is currently a functional mid-term MVP. It is suitable for demonstrating the information architecture, interaction flow, and real-map direction of the atlas website.

It is not yet a finished publication website. Case text, sources, images, location names, and final narrative writing still need further checking and refinement.

## Current Features

- Real Leaflet map with a soft, low-saturation atlas style
- Case markers based on longitude / latitude coordinates
- Marker colors controlled by narrative section:
  `Green`, `Home`, `Land`, `Hope`
- Top navigation:
  `Opening / Map Guide / Green / Home / Land / Hope / Ending`
- Section filtering for map markers
- Hover tooltip / mini card for markers
- Click marker to open a right-side atlas case card
- Section intro panels when no case is selected
- Map Guide explaining how to read the website
- Bottom lightweight historical context timeline
- Timeline highlight linked to selected case
- Chinese / English UI language switching
- Responsive layout for presentation and mobile preview
- Case data loaded from `public/data/cases.json`

## Information Architecture

The website is organized into seven top-level sections:

- `Opening`: introduces the atlas question
- `Map Guide`: explains how to read the map narrative
- `Green`: ecological restoration and vegetation recovery
- `Home`: communities, livelihoods, and lived environments
- `Land`: land systems, engineering routes, and spatial governance
- `Hope`: global relevance, cooperation, and continuing stories
- `Ending`: closing narrative frame

The bottom timeline is not a precise date axis. It provides broad historical context groups:

- Han Dynasty
- Qing Dynasty
- Since 1978
- Around 2000s
- Around 2020s
- 2025+

## Real Map Upgrade

The conceptual map area has been upgraded to a real Leaflet map using:

- `leaflet`
- `react-leaflet`
- CARTO Positron light basemap

Coordinates are read from `public/data/cases.json`. Leaflet receives marker positions as `[lat, lng]`.

The map is styled to remain calm and presentation-ready rather than looking like a navigation tool. Marker hue is determined only by `section`; hover and selected states use size, opacity, border, and halo changes.

## Data Structure

Main data file:

```text
public/data/cases.json
```

Current normalized fields include:

- `id`
- `title`
- `section`
- `period`
- `timelineGroup`
- `location`
- `coordinates`
- `theme`
- `caseType`
- `narrativeRole`
- `shortSummary`
- `detailSummary`
- `keywords`
- `sourceStatus`

Some fields still use placeholders such as `Need source confirmation`.

## Main Files

```text
src/App.jsx
src/App.css
src/i18n/uiText.js
public/data/cases.json
```

The current MVP is still mostly implemented in `App.jsx`. Future development may benefit from extracting components after the presentation version stabilizes.

## Suggested Presentation Screenshots

1. `Opening`: show the opening narrative frame.
2. `Map Guide`: show the reading guide with the real map visible.
3. `Real map overview`: show all visible markers on the Leaflet map.
4. `Selected case detail`: click one marker and show the right-side atlas case card.
5. `Thematic section`: show a section such as `Green` or `Hope` with filtered markers and the section intro.

## Current Limitations

- The map uses real coordinates, but some coordinates are still draft prototype locations.
- Some case titles, summaries, and keywords still need source checking and editing.
- Images are not yet fully integrated as final visual evidence.
- The timeline is a historical context aid, not an exact event chronology.
- Some content is not yet fully bilingual at the case-data level.
- The project is not yet optimized as a final public-facing website.

## Next Steps

- Verify case sources, names, locations, and summaries
- Improve bilingual case data
- Add confirmed images or archival / field materials
- Refine map marker clustering or overlap handling if case count grows
- Extract React components for easier maintenance
- Prepare final PRP presentation screenshots and speaking notes

## Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm.cmd run dev
```

Build:

```bash
npm.cmd run build
```

Lint:

```bash
npm.cmd run lint
```
