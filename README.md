# Spirit Connect Fantasy Archives

一个用于展示 **Spirit Connect Fantasy / 灵接幻想** 小说宇宙的沉浸式网页原型。

项目通过 Three.js 构建可滚动的 3D 档案空间，将小说封面、故事简介、故事线和角色关系图整合到同一个网页体验中，方便读者快速浏览这个幻想系列的世界观与书卷内容。

## Website

- Online site: <https://fulongli.github.io/Spirit-Connect-Fantasy/>
- Storyline reference: <https://fulongli.github.io/Spirit-Connect-Fantasy/anotherworld/storylines/>

## Preview Locally

如果本地预览服务已经启动，可以直接打开：

```text
http://127.0.0.1:8790/
```

如果服务没有启动，可以在项目根目录使用任意静态服务器运行。因为页面使用了 ES modules 和 import map，建议通过 HTTP 服务访问，而不是直接双击打开 HTML 文件。

## What It Includes

- Scroll-driven 3D archive scene
- Novel cover display and book detail panels
- Chinese / English language toggle
- Day / Night theme toggle
- Archive overview
- Story Lines view
- Relation Graph view

## Project Files

- `index.html`  
  页面结构、顶部导航、档案区和最终展示区。

- `styles.css`  
  页面布局、响应式样式、主题视觉、档案卡片、故事线和关系图样式。

- `app.js`  
  Three.js 场景、镜头路径、语言与主题切换、书籍数据、故事线和关系图逻辑。

- `assets/`  
  小说封面、logo 等视觉资源。

## Editing Content

主要内容都在 `app.js` 中维护：

- 修改 `books` 来更新书籍标题、简介、封面和链接。
- 修改 `storyBooks` 来调整故事线内容。
- 修改 `graphNodes`、`graphTypes` 和 `graphLinks` 来调整关系图。
- 修改 `uiText` 来更新中英文界面文案。

