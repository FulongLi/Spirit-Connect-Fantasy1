# 巨鲸陨落 Soundtrack

Put finished audio files in `audio/` (use English ASCII filenames) and update `catalog.js`.

Current tracks (see `track-name-map.md` for the full English ↔ 中文 name map):

- `audio/shadows-above-the-ruins.mp3` — Shadows Above the Ruins / 废墟之上的阴影
- `audio/phaethon-in-memory.mp3` — Phaethon in Memory / 记忆中的法厄同
- `audio/ancient-lament-of-return.mp3` — Ancient Lament of Return / 古老的归来挽歌
- `cover.jpg` or `cover.png` if a soundtrack cover is needed later

The reading page uses `window.whaleFallSoundtrack` from `catalog.js`. Each track's display name is
bilingual via `title { zh, en }` — the English page shows English, the Chinese page shows Chinese.
A track plays only when its `src` is set; leave `src` empty while a track is only a concept.
