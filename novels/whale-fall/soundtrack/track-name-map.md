# 巨鲸陨落 / Whale Fall — 音乐文件名中英对照
# Soundtrack Track Name Map (English ↔ 中文)

这是音乐文件的"中间对照文档"。文件名统一用英文 ASCII(避免中文文件名在网页/服务器上的编码问题),
中英文显示名称由 `catalog.js` 的 `title.en` / `title.zh` 控制:英文页面显示英文名,中文页面显示中文名。

This is the intermediate map for soundtrack files. Filenames are kept in English ASCII (to avoid
encoding issues with Chinese filenames on the web/server). The bilingual display names are driven by
`title.en` / `title.zh` in `catalog.js` — the English page shows English, the Chinese page shows Chinese.

| # | 文件名 (filename) | English title | 中文名称 | 章节 Chapter | 时长 Duration |
|---|-------------------|---------------|----------|--------------|---------------|
| 01 | `audio/shadows-above-the-ruins.mp3` | Shadows Above the Ruins | 废墟之上的阴影 | 01 尸山之上 / On the Mountain of Dead | 3:29 |
| 02 | `audio/phaethon-in-memory.mp3` | Phaethon in Memory | 记忆中的法厄同 | 05 法厄同的天空裂开 / Phaethon's Sky Cracks | 2:55 |
| 03 | `audio/ancient-lament-of-return.mp3` | Ancient Lament of Return | 古老的归来挽歌 | 48 蓝鲸在地球歌唱 / Blue Whales Sing on Earth | 1:52 |

## 重命名记录 / Rename log
- `记忆中的法厄同.mp3` → `phaethon-in-memory.mp3`(中文文件名 → 英文 ASCII / Chinese filename → English ASCII)

## 新增音乐的步骤 / How to add a new track
1. 把音频放进 `audio/`,文件名用英文 ASCII(如 `my-new-track.mp3`)。
   Drop the audio into `audio/` with an English ASCII filename.
2. 在本表加一行:文件名 / English title / 中文名称 / 章节 / 时长。
   Add a row here: filename / English title / 中文名称 / chapter / duration.
3. 在 `catalog.js` 新增一个条目,`title` 填 `{ zh, en }` 双语,`src` 指向该文件。
   Add an entry in `catalog.js` with bilingual `title { zh, en }` and `src` pointing to the file.
