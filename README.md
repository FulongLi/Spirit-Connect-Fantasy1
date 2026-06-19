# Spirit Connect Fantasy Archives

An immersive Three.js prototype for presenting the **Spirit Connect Fantasy** novel universe.

The site borrows the scroll-driven camera language of the Spirit Connect main site: a fixed WebGL scene, an internal scroll rail, cinematic camera movement, glowing archive cabins, book covers, story summaries, and a final archive page with story-line and relationship-graph views.

## Preview

Open the local preview server:

```text
http://127.0.0.1:8790/
```

If the preview server is not running, serve this folder with any static HTTP server. The page uses ES modules and an import map, so an HTTP server is recommended.

## Main Files

- `index.html`  
  Page structure, top controls, book detail panel, and final archive containers.

- `styles.css`  
  Responsive layout, day/night visual contrast, archive cards, story-line SVG styling, and relation graph styling.

- `app.js`  
  Three.js scene, six-cabin camera path, language/theme switching, book data, cover mapping, story-line rendering, and relation graph rendering.

- `assets/`  
  Novel cover images. Current mapping:
  - `DM.png` / `DM_E.png` — 月球暗面 / Darkside of the Moon
  - `WF1.png` / `WF.png` — 巨鲸陨落 / Whale Fall
  - `MC.png` — 灵猫 / Mystic Cat
  - `DC1.png` — 生死邮轮 / Death Cruise
  - `HS.png` — 灵魂归处 / Where Souls Return
  - `LD.png` — 浅窥命运 / A Glimpse of Fate
  - `LS.png` — 演讲迷宫 / Lecture Maze
  - `ZD.png` — 零域之境 / Zero Domain

## Features

- Scroll-driven WebGL camera movement
- Six circular archive cabins for the current featured book sequence
- Real cover textures in 3D and UI panels
- Chinese / English language toggle
- Day / Night theme toggle
- Final-page archive index
- Final-page Story Lines view with main nodes and branch nodes
- Final-page Relation Graph view with typed nodes and relationship links

## Editing Content

Most content is in `app.js`.

- Edit `books` to add or update book data, cover images, summaries, and links.
- Edit `CABIN_COUNT` / `cabinBooks` if you want to change how many books receive 3D cabins in the opening journey.
- Edit `storyBooks` to change the final-page story-line nodes and branches.
- Edit `graphNodes`, `graphTypes`, and `graphLinks` to change the relation graph.
- Edit `uiText` to change Chinese/English UI copy.

When an English cover is missing, set `cover.en` to the Chinese image path until the English image is ready.

## Source Reference

The final Story Lines and Relation Graph sections are based on the existing Spirit Connect Fantasy storyline page:

```text
https://fulongli.github.io/Spirit-Connect-Fantasy/anotherworld/storylines/
```

The local cloned source is also available under `fantasy-content/`, especially:

- `fantasy-content/anotherworld/storylines.md`
- `fantasy-content/zh/anotherworld/storylines.md`
- `fantasy-content/assets/storylines.js`
- `fantasy-content/assets/storygraph.js`
