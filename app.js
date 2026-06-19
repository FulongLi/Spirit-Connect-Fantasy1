import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const books = [
  {
    id: "dark-moon",
    glyph: { zh: "月", en: "DM" },
    title: { zh: "月球暗面", en: "Darkside of the Moon" },
    kicker: { zh: "档案 I · 第一扇门", en: "Archive I · The First Gate" },
    status: { zh: "已出版", en: "Published" },
    theme: { zh: "意识迁出 · 死球理论", en: "Consciousness Exodus · Dead Moon Theory" },
    accent: "#2bb8ff",
    cover: { zh: "assets/DM.png", en: "assets/DM_E.png" },
    link: "fantasy-content/zh/anotherworld/storylines.md",
    description: {
      zh: "2118 年，吉姆·维尔走进灵接舱进行第二次数字矫正，却带回了不属于自己的记忆。月球暗面的古老记录系统、数字双生体与 LUNA-EXIT 计划开始浮出水面。",
      en: "In 2118, Jim Vale enters a Spirit Connect cabin for his second digital calibration and returns with memories that are not his own. The hidden archive on the Moon begins to open.",
    },
  },
  {
    id: "whale-fall",
    glyph: { zh: "鲸", en: "WF" },
    title: { zh: "巨鲸陨落", en: "Whale Fall" },
    kicker: { zh: "档案 II · 法厄同证词", en: "Archive II · Phaethon Testimony" },
    status: { zh: "筹备中", en: "In Development" },
    theme: { zh: "文明遗产 · 鲸歌回声", en: "Civilization Relic · Whale Echo" },
    accent: "#4da3ff",
    cover: { zh: "assets/WF1.png", en: "assets/WF.png" },
    link: "fantasy-content/zh/spicopedia/whale-echo.md",
    description: {
      zh: "查理在一具陌生身体里醒来，站在尸体堆成的山上，看见一头燃烧的巨鲸从天而降。它像星舰，也像一个文明的记忆本身正在坠落。",
      en: "Charlie wakes inside a stranger's body on a mountain of the dead, as a burning whale falls from the sky like a starship and a civilization's memory.",
    },
  },
  {
    id: "mystic-cat",
    glyph: { zh: "猫", en: "MC" },
    title: { zh: "灵猫", en: "Mystic Cat" },
    kicker: { zh: "档案 III · 安娜的区域", en: "Archive III · Anna's Region" },
    status: { zh: "伏笔开放", en: "Foreshadowed" },
    theme: { zh: "动物意识 · 时间井", en: "Animal Consciousness · Time Well" },
    accent: "#e2a72b",
    cover: { zh: "assets/MC.png", en: "assets/MC.png" },
    link: "fantasy-content/zh/anotherworld/storylines.md",
    description: {
      zh: "安娜被困在非人类意识区域。记录边缘的森林里，有一只能够直视意识的猫影；那里的时间不走直线。",
      en: "Anna is trapped in a non-human consciousness region. At the edge of the archive, a cat-shaped shadow can look directly into the mind.",
    },
  },
  {
    id: "death-cruise",
    glyph: { zh: "邮", en: "DC" },
    title: { zh: "生死邮轮", en: "Death Cruise" },
    kicker: { zh: "档案 IV · 海上亡灵", en: "Archive IV · The Sea of the Dead" },
    status: { zh: "预告", en: "Preview" },
    theme: { zh: "邮轮 · 轮回 · 失踪航线", en: "Cruise · Rebirth · Missing Route" },
    accent: "#ff4f9a",
    cover: { zh: "assets/DC1.png", en: "assets/DC1.png" },
    link: "#",
    description: {
      zh: "一艘驶向未知海域的邮轮，把生者、死者和未完成的记忆带进同一条航线。",
      en: "A cruise ship sails beyond the mapped ocean, carrying the living, the dead, and unfinished memories on the same route.",
    },
  },
  {
    id: "home-soul",
    glyph: { zh: "魂", en: "HS" },
    title: { zh: "灵魂归处", en: "Where Souls Return" },
    kicker: { zh: "档案 V · 归处", en: "Archive V · Return Point" },
    status: { zh: "预留", en: "Reserved" },
    theme: { zh: "归乡 · 意识余辉", en: "Return · Afterglow" },
    accent: "#42d6ff",
    cover: { zh: "assets/HS.png", en: "assets/HS.png" },
    link: "#",
    description: {
      zh: "当身体和数字人格都不能回答“我是谁”，灵魂也许会寻找第三个归处。",
      en: "When neither body nor digital persona can answer who you are, the soul may search for a third place to return.",
    },
  },
  {
    id: "little-destiny",
    glyph: { zh: "命", en: "LD" },
    title: { zh: "浅窥命运", en: "A Glimpse of Fate" },
    kicker: { zh: "档案 VI · 人生十年", en: "Archive VI · Ten Years" },
    status: { zh: "预留", en: "Reserved" },
    theme: { zh: "命运 · 自由意志", en: "Fate · Free Will" },
    accent: "#bfc7d5",
    cover: { zh: "assets/LD.png", en: "assets/LD.png" },
    link: "#",
    description: {
      zh: "如果十年后的命运能被浅浅看见，人是否还会沿着原来的路走下去？",
      en: "If a person could glimpse the next ten years, would they still walk the same road?",
    },
  },
  {
    id: "lecture-maze",
    glyph: { zh: "迷", en: "LS" },
    title: { zh: "演讲迷宫", en: "Lecture Maze" },
    kicker: { zh: "档案 VII · 你是出不去的", en: "Archive VII · No Exit" },
    status: { zh: "预留", en: "Reserved" },
    theme: { zh: "迷宫 · 语言 · 认知陷阱", en: "Maze · Language · Cognitive Trap" },
    accent: "#f4f4f4",
    cover: { zh: "assets/LS.png", en: "assets/LS.png" },
    link: "#",
    description: {
      zh: "一场演讲变成了迷宫。每一句解释都像出口，每一个出口都通向更深的房间。",
      en: "A lecture becomes a maze. Every explanation looks like an exit, and every exit leads deeper inside.",
    },
  },
  {
    id: "zero-domain",
    glyph: { zh: "零", en: "ZD" },
    title: { zh: "零域之境", en: "Zero Domain" },
    kicker: { zh: "档案 VIII · 边界之外", en: "Archive VIII · Beyond the Boundary" },
    status: { zh: "预留", en: "Reserved" },
    theme: { zh: "零域 · 黑箱 · 另一层现实", en: "Zero Field · Black Box · Outer Reality" },
    accent: "#ffd447",
    cover: { zh: "assets/ZD.png", en: "assets/ZD.png" },
    link: "#",
    description: {
      zh: "零域不是地点，而是一种状态：当世界的边界被压缩到一点，意识仍然会向外寻找空间。",
      en: "Zero Domain is not a place but a state: when the world's boundary collapses to a point, the mind still searches outward.",
    },
  },
];

const reserved = [
  { zh: "数字吉姆", en: "Digital Jim" },
  { zh: "泰拉撒记录", en: "Terasa Records" },
  { zh: "罗斯威尔接口", en: "Roswell Interface" },
  { zh: "主体核", en: "Subject Core" },
];

const uiText = {
  zh: {
    htmlLang: "zh-CN",
    navOverview: "档案总览",
    navStory: "故事线",
    day: "白天",
    night: "夜间",
    enter: "进入小说档案",
    introEyebrow: "另一个世界 · 叙事档案馆",
    introTitle: "十二座灵接舱，十二本未醒来的书。",
    introBody:
      "这里把 Spirit Connect Fantasy 的小说设定整理成一个可漫游的档案空间：镜头会从中央环形大厅进入每一座舱，展示书卷封面、核心概念与后续阅读入口。",
    archiveEyebrow: "ARCHIVE INDEX",
    archiveTitle: "Spirit Connect Fantasy 书卷序列",
    archiveLead:
      "已挂入现有封面资源；英文封面暂缺的书卷会先使用中文封面，之后你替换文件即可继续扩展。",
    reservedPrefix: "预留舱",
    reservedText: "后续卷宗入口预留。",
  },
  en: {
    htmlLang: "en",
    navOverview: "Archive",
    navStory: "Storylines",
    day: "Day",
    night: "Night",
    enter: "Open archive",
    introEyebrow: "Another World · Narrative Archive",
    introTitle: "Twelve cabins. Twelve books waiting to wake.",
    introBody:
      "This immersive archive turns Spirit Connect Fantasy into a navigable chamber: the camera moves from the central ring to each cabin, revealing covers, concepts, and reading entry points.",
    archiveEyebrow: "ARCHIVE INDEX",
    archiveTitle: "Spirit Connect Fantasy Book Sequence",
    archiveLead:
      "Current cover assets are wired in. When an English cover is missing, the site falls back to the Chinese cover until you replace it.",
    reservedPrefix: "Reserved Cabin",
    reservedText: "Future volume entry reserved.",
  },
};

const themes = {
  day: {
    bg: "#eaf3fb",
    fog: "#edf5fb",
    fogNear: 70,
    fogFar: 420,
    floor: "#d6e1ea",
    shell: "#f2f7fb",
    pearl: "#c3d0dc",
    glass: "#87d7ff",
    darkGlass: "#18314a",
    rail: "#76899b",
    hemiSky: "#ffffff",
    hemiGround: "#8793a0",
    hemiIntensity: 1.35,
    keyIntensity: 3.2,
    env: 0.5,
    bloom: 0.48,
  },
  night: {
    bg: "#04080f",
    fog: "#07111f",
    fogNear: 80,
    fogFar: 360,
    floor: "#172234",
    shell: "#253348",
    pearl: "#33455f",
    glass: "#42c9ff",
    darkGlass: "#08111e",
    rail: "#6d83a1",
    hemiSky: "#29466f",
    hemiGround: "#03060b",
    hemiIntensity: 0.72,
    keyIntensity: 0.85,
    env: 0.2,
    bloom: 0.85,
  },
};

let language = "zh";
let mode = "day";
let progressTarget = 0;
let progress = 0;
let activeBook = -1;
let pointerX = 0;
let pointerY = 0;
let smoothPointerX = 0;
let smoothPointerY = 0;

const SECTIONS = 12;
const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();
const canvas = document.getElementById("scene");
const scrollStage = document.getElementById("scroll-stage");
const intro = document.querySelector(".chapter-intro");
const panel = document.querySelector("[data-book-panel]");
const overview = document.querySelector(".overview");
const railDot = document.getElementById("rail-dot");
const cover = document.getElementById("book-cover");
const glyph = document.getElementById("book-glyph");
const kicker = document.getElementById("book-kicker");
const title = document.getElementById("book-title");
const description = document.getElementById("book-description");
const statusEl = document.getElementById("book-status");
const themeEl = document.getElementById("book-theme");
const link = document.getElementById("book-link");
const archiveList = document.getElementById("archive-list");

const els = {
  navOverview: document.querySelector("[data-i18n='navOverview']"),
  navStory: document.querySelector("[data-i18n='navStory']"),
  introEyebrow: document.querySelector("[data-i18n='introEyebrow']"),
  introTitle: document.querySelector("[data-i18n='introTitle']"),
  introBody: document.querySelector("[data-i18n='introBody']"),
  archiveEyebrow: document.querySelector("[data-i18n='archiveEyebrow']"),
  archiveTitle: document.querySelector("[data-i18n='archiveTitle']"),
  archiveLead: document.querySelector("[data-i18n='archiveLead']"),
  bookLink: document.querySelector("[data-i18n='enter']"),
  langButtons: [...document.querySelectorAll("[data-lang]")],
  modeButtons: [...document.querySelectorAll("[data-mode]")],
};

scrollStage.style.position = "fixed";
scrollStage.style.inset = "0";
scrollStage.style.overflowY = "auto";
scrollStage.style.overflowX = "hidden";
scrollStage.style.overscrollBehavior = "none";
scrollStage.style.zIndex = "2";
scrollStage.querySelector(".scroll-space").style.height = `${SECTIONS * 100}vh`;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 900);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.52,
  0.58,
  0.66
);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const hemi = new THREE.HemisphereLight("#ffffff", "#8793a0", 1.35);
scene.add(hemi);

const keyLight = new THREE.DirectionalLight("#ffffff", 3.2);
keyLight.position.set(64, 98, 84);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -190;
keyLight.shadow.camera.right = 190;
keyLight.shadow.camera.top = 190;
keyLight.shadow.camera.bottom = -190;
scene.add(keyLight);

const coolLight = new THREE.PointLight("#40caff", 34, 280, 1.7);
coolLight.position.set(0, 30, 0);
scene.add(coolLight);

const warmLight = new THREE.PointLight("#ffd08a", 12, 190, 2);
warmLight.position.set(-44, 18, 58);
scene.add(warmLight);

const root = new THREE.Group();
scene.add(root);

const mats = {
  floor: new THREE.MeshPhysicalMaterial({ color: "#d6e1ea", roughness: 0.42, metalness: 0.05, clearcoat: 0.28 }),
  white: new THREE.MeshPhysicalMaterial({ color: "#f2f7fb", roughness: 0.3, metalness: 0.08, clearcoat: 0.5, clearcoatRoughness: 0.2 }),
  pearl: new THREE.MeshPhysicalMaterial({ color: "#c3d0dc", roughness: 0.22, metalness: 0.2, clearcoat: 0.8 }),
  glass: new THREE.MeshPhysicalMaterial({ color: "#87d7ff", roughness: 0.05, metalness: 0, transmission: 0.35, transparent: true, opacity: 0.5, clearcoat: 1, side: THREE.DoubleSide }),
  darkGlass: new THREE.MeshPhysicalMaterial({ color: "#18314a", roughness: 0.18, metalness: 0.3, transparent: true, opacity: 0.58, clearcoat: 1 }),
  rail: new THREE.MeshStandardMaterial({ color: "#76899b", roughness: 0.34, metalness: 0.52 }),
  blueGlow: new THREE.MeshStandardMaterial({ color: "#07131d", emissive: "#2bb8ff", emissiveIntensity: 1.55, roughness: 0.4 }),
  goldGlow: new THREE.MeshStandardMaterial({ color: "#1a1206", emissive: "#d79b3a", emissiveIntensity: 0.9, roughness: 0.42 }),
};

const camPositions = [
  [0, 98, 315],
  [0, 60, 226],
  [96, 38, 144],
  [136, 26, 30],
  [92, 24, -112],
  [-24, 23, -150],
  [-128, 25, -68],
  [-138, 28, 62],
  [-62, 34, 142],
  [0, 86, 190],
  [0, 204, 70],
  [0, 300, 0],
];

const camTargets = [
  [0, 18, 0],
  [0, 16, 0],
  [74, 14, 78],
  [120, 13, 0],
  [72, 13, -96],
  [0, 14, -126],
  [-104, 13, -60],
  [-120, 13, 54],
  [-64, 13, 110],
  [0, 16, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const posCurve = new THREE.CatmullRomCurve3(camPositions.map((p) => new THREE.Vector3(...p)), false, "centripetal");
const targetCurve = new THREE.CatmullRomCurve3(camTargets.map((p) => new THREE.Vector3(...p)), false, "centripetal");
const camPos = new THREE.Vector3();
const camTarget = new THREE.Vector3();
const clock = new THREE.Clock();

buildEnvironment();
const capsules = buildCapsules();
const starField = buildParticles();
const bookSprites = buildBookSprites();
wireControls();
applyLanguage("zh");
applyTheme("day");
onResize();
onScroll();
animate();

function getCover(book) {
  return book.cover[language] || book.cover.zh || book.cover.en;
}

function getTexture(url) {
  if (!textureCache.has(url)) {
    const texture = textureLoader.load(url);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    textureCache.set(url, texture);
  }
  return textureCache.get(url);
}

function buildEnvironment() {
  const floor = new THREE.Mesh(new THREE.CircleGeometry(230, 180), mats.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  const outer = new THREE.Mesh(new THREE.TorusGeometry(154, 1.5, 16, 192), mats.blueGlow);
  outer.rotation.x = Math.PI / 2;
  outer.position.y = 0.55;
  root.add(outer);

  const inner = new THREE.Mesh(new THREE.TorusGeometry(72, 0.9, 12, 160), mats.goldGlow);
  inner.rotation.x = Math.PI / 2;
  inner.position.y = 0.78;
  root.add(inner);

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const path = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.45, 76), mats.rail);
    path.position.set(Math.cos(a) * 110, 0.42, Math.sin(a) * 110);
    path.rotation.y = -a;
    path.castShadow = true;
    path.receiveShadow = true;
    root.add(path);
  }

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(238, 80, 28, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshPhysicalMaterial({
      color: "#b9d1e4",
      roughness: 0.16,
      metalness: 0.02,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    })
  );
  dome.name = "dome-shell";
  dome.position.y = -1.5;
  root.add(dome);

  const ribMat = new THREE.LineBasicMaterial({ color: "#6e879b", transparent: true, opacity: 0.34 });
  ribMat.name = "rib-line";
  for (let i = 0; i < 24; i++) {
    const curve = new THREE.EllipseCurve(0, 0, 238, 238, 0, Math.PI, false);
    const pts = curve.getPoints(72).map((p) => new THREE.Vector3(p.x, p.y - 1.5, 0));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, ribMat);
    line.rotation.y = (i / 24) * Math.PI * 2;
    root.add(line);
  }

  const core = new THREE.Mesh(new THREE.CylinderGeometry(26, 34, 8, 72), mats.pearl);
  core.position.y = 4;
  core.castShadow = true;
  core.receiveShadow = true;
  root.add(core);

  const coreRing = new THREE.Mesh(new THREE.TorusGeometry(38, 0.8, 12, 140), mats.blueGlow);
  coreRing.rotation.x = Math.PI / 2;
  coreRing.position.y = 9.2;
  root.add(coreRing);
}

function buildCapsules() {
  const group = new THREE.Group();
  const items = [];
  const podGeo = new THREE.CapsuleGeometry(8, 26, 12, 26);
  const baseGeo = new THREE.BoxGeometry(19, 4, 46);
  const canopyGeo = new THREE.CapsuleGeometry(6.7, 20, 10, 22);

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const pod = new THREE.Group();
    const book = books[i] || null;
    pod.position.set(Math.cos(angle) * 134, 3.8, Math.sin(angle) * 134);
    pod.rotation.y = -angle + Math.PI / 2;

    const base = new THREE.Mesh(baseGeo, mats.pearl);
    base.position.y = -1.9;
    base.castShadow = true;
    base.receiveShadow = true;
    pod.add(base);

    const body = new THREE.Mesh(podGeo, mats.white);
    body.rotation.x = Math.PI / 2;
    body.scale.set(1.08, 1.0, 0.68);
    body.position.y = 2;
    body.castShadow = true;
    body.receiveShadow = true;
    pod.add(body);

    const canopy = new THREE.Mesh(canopyGeo, book ? mats.glass : mats.darkGlass);
    canopy.rotation.x = Math.PI / 2;
    canopy.scale.set(0.78, 0.82, 0.4);
    canopy.position.set(0, 6.6, -1.6);
    pod.add(canopy);

    const rimMat = book
      ? new THREE.MeshStandardMaterial({ color: "#07131d", emissive: book.accent, emissiveIntensity: 1.2, roughness: 0.4 })
      : mats.rail;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(8.5, 0.3, 10, 70), rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(0, 6.75, -1.6);
    pod.add(rim);

    const marker = makeTextSprite(book ? book.glyph.zh : String(i + 1).padStart(2, "0"), book?.accent || "#8da1b3");
    marker.position.set(0, 22, 0);
    marker.scale.set(14, 14, 1);
    pod.add(marker);

    group.add(pod);
    items.push({ pod, book, marker, rimMat });
  }
  root.add(group);
  return items;
}

function buildParticles() {
  const count = 1000;
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const blue = new THREE.Color("#67d8ff");
  const amber = new THREE.Color("#ffd078");
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 36 + Math.random() * 214;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = 8 + Math.random() * 150;
    pos[i * 3 + 2] = Math.sin(a) * r;
    const c = blue.clone().lerp(amber, Math.random() * 0.25);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 1.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.64,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  root.add(points);
  return points;
}

function buildBookSprites() {
  const group = new THREE.Group();
  const items = books.map((book, i) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: getTexture(getCover(book)),
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }));
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    sprite.position.set(Math.cos(angle) * 112, 39, Math.sin(angle) * 112);
    sprite.scale.set(27, 40, 1);
    sprite.visible = false;
    group.add(sprite);
    return sprite;
  });
  root.add(group);
  return items;
}

function makeTextSprite(text, color) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = color;
  ctx.font = '800 54px "Microsoft YaHei", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,.35)";
  ctx.shadowBlur = 10;
  ctx.fillText(text, 128, 130);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
}

function wireControls() {
  els.langButtons.forEach((btn) => btn.addEventListener("click", () => applyLanguage(btn.dataset.lang)));
  els.modeButtons.forEach((btn) => btn.addEventListener("click", () => applyTheme(btn.dataset.mode)));
}

function applyLanguage(next) {
  language = next;
  const copy = uiText[language];
  document.documentElement.lang = copy.htmlLang;
  document.body.dataset.lang = language;
  els.navOverview.textContent = copy.navOverview;
  els.navStory.textContent = copy.navStory;
  els.introEyebrow.textContent = copy.introEyebrow;
  els.introTitle.textContent = copy.introTitle;
  els.introBody.textContent = copy.introBody;
  els.archiveEyebrow.textContent = copy.archiveEyebrow;
  els.archiveTitle.textContent = copy.archiveTitle;
  els.archiveLead.textContent = copy.archiveLead;
  els.bookLink.textContent = copy.enter;
  els.langButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.lang === language));
  els.modeButtons.forEach((btn) => {
    btn.textContent = btn.dataset.mode === "day" ? copy.day : copy.night;
  });
  capsules?.forEach((item) => {
    if (!item.book) return;
    item.marker.material.map.dispose();
    const newMarker = makeTextSprite(item.book.glyph[language] || item.book.glyph.zh, item.book.accent);
    item.marker.material = newMarker.material;
  });
  bookSprites?.forEach((sprite, i) => {
    sprite.material.map = getTexture(getCover(books[i]));
    sprite.material.needsUpdate = true;
  });
  buildArchive();
  setActiveBook(activeBook < 0 ? 0 : activeBook, true);
}

function applyTheme(next) {
  mode = next;
  const t = themes[mode];
  document.body.dataset.theme = mode;
  scene.background = new THREE.Color(t.bg);
  scene.fog = new THREE.Fog(t.fog, t.fogNear, t.fogFar);
  scene.environmentIntensity = t.env;
  renderer.toneMappingExposure = mode === "day" ? 1.0 : 0.92;
  hemi.color.set(t.hemiSky);
  hemi.groundColor.set(t.hemiGround);
  hemi.intensity = t.hemiIntensity;
  keyLight.intensity = t.keyIntensity;
  bloom.strength = t.bloom;
  mats.floor.color.set(t.floor);
  mats.white.color.set(t.shell);
  mats.pearl.color.set(t.pearl);
  mats.glass.color.set(t.glass);
  mats.darkGlass.color.set(t.darkGlass);
  mats.rail.color.set(t.rail);
  els.modeButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.mode === mode));
}

function buildArchive() {
  const copy = uiText[language];
  const items = [
    ...books.map((book) => ({
      title: book.title[language] || book.title.zh,
      text: `${book.kicker[language] || book.kicker.zh}。${book.theme[language] || book.theme.zh}。${(book.description[language] || book.description.zh).slice(0, 86)}...`,
      empty: false,
      cover: getCover(book),
    })),
    ...reserved.map((name, i) => ({
      title: `${copy.reservedPrefix} ${String(i + books.length + 1).padStart(2, "0")}`,
      text: `${name[language] || name.zh} · ${copy.reservedText}`,
      empty: true,
    })),
  ];

  archiveList.innerHTML = items
    .map(
      (item) => `
        <article class="archive-card ${item.empty ? "is-empty" : ""}">
          ${item.cover ? `<span class="archive-thumb" style="background-image:url('${item.cover}')"></span>` : ""}
          <strong>${item.title}</strong>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

function setActiveBook(index, force = false) {
  if (index === activeBook && !force) return;
  activeBook = index;
  if (index < 0 || !books[index]) return;
  const book = books[index];
  glyph.textContent = book.glyph[language] || book.glyph.zh;
  kicker.textContent = book.kicker[language] || book.kicker.zh;
  title.textContent = book.title[language] || book.title.zh;
  description.textContent = book.description[language] || book.description.zh;
  statusEl.textContent = book.status[language] || book.status.zh;
  themeEl.textContent = book.theme[language] || book.theme.zh;
  link.href = book.link;
  cover.style.setProperty("--cover-image", `url('${getCover(book)}')`);
  cover.style.borderColor = book.accent;
}

function fadeWindow(p, start, end) {
  const fade = Math.min(0.035, (end - start) * 0.32);
  if (p < start || p > end) return 0;
  if (p < start + fade) return (p - start) / fade;
  if (p > end - fade) return (end - p) / fade;
  return 1;
}

function updateDom(p) {
  railDot.style.top = `${p * 100}%`;
  const introOpacity = fadeWindow(p, 0, 0.14);
  intro.classList.toggle("is-visible", introOpacity > 0.02);
  intro.style.opacity = introOpacity.toFixed(3);
  const panelOpacity = fadeWindow(p, 0.16, 0.78);
  panel.classList.toggle("is-visible", panelOpacity > 0.02);
  panel.style.opacity = panelOpacity.toFixed(3);
  panel.style.transform = `translate(-50%, ${-42 + (1 - panelOpacity) * 4}%)`;
  overview.classList.toggle("is-visible", p >= 0.82);

  if (p >= 0.16 && p < 0.78) {
    const local = (p - 0.16) / 0.62;
    setActiveBook(clamp(Math.floor(local * books.length), 0, books.length - 1));
  } else if (p < 0.16) {
    setActiveBook(-1);
  }
}

function updateScene(dt, elapsed) {
  const t = clamp(progress / 0.86);
  posCurve.getPoint(t, camPos);
  targetCurve.getPoint(t, camTarget);
  smoothPointerX += (pointerX - smoothPointerX) * Math.min(1, dt * 3);
  smoothPointerY += (pointerY - smoothPointerY) * Math.min(1, dt * 3);
  camera.position.copy(camPos);
  camera.lookAt(camTarget);
  camera.translateX(smoothPointerX * 2.2);
  camera.translateY(-smoothPointerY * 1.1);

  root.rotation.y = Math.sin(elapsed * 0.08) * 0.012;
  starField.rotation.y += dt * 0.012;
  coolLight.intensity = (mode === "day" ? 30 : 42) + Math.sin(elapsed * 1.2) * 4;
  warmLight.intensity = mode === "day" ? 12 : 18;
  capsules.forEach((item, i) => {
    const isActive = activeBook === i;
    const pulse = (Math.sin(elapsed * 2.1 + i) + 1) / 2;
    item.pod.position.y = 3.8 + Math.sin(elapsed * 0.7 + i) * 0.25;
    item.pod.scale.setScalar(isActive ? 1.065 : 1);
    if (item.rimMat.emissive) {
      item.rimMat.emissiveIntensity = isActive ? 2.35 + pulse * 0.65 : 0.9 + pulse * 0.18;
    }
  });
  bookSprites.forEach((sprite, i) => {
    const active = activeBook === i && progress > 0.17 && progress < 0.78;
    sprite.visible = active || sprite.material.opacity > 0.01;
    sprite.material.opacity += ((active ? 1 : 0) - sprite.material.opacity) * Math.min(1, dt * 5);
    sprite.position.y = 40 + Math.sin(elapsed * 1.5) * 1.4;
    sprite.lookAt(camera.position);
  });
}

function clamp(n, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function onScroll() {
  const max = scrollStage.scrollHeight - scrollStage.clientHeight;
  progressTarget = max > 0 ? scrollStage.scrollTop / max : 0;
}

function onWheel(ev) {
  if (ev.ctrlKey) return;
  ev.preventDefault();
  const factor = ev.deltaMode === 1 ? 33 : ev.deltaMode === 2 ? window.innerHeight : 1;
  scrollStage.scrollTop += ev.deltaY * factor;
}

function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloom.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

window.addEventListener("wheel", onWheel, { passive: false });
window.addEventListener("resize", onResize);
window.addEventListener("pointermove", (ev) => {
  pointerX = (ev.clientX / window.innerWidth - 0.5) * 2;
  pointerY = (ev.clientY / window.innerHeight - 0.5) * 2;
});
scrollStage.addEventListener("scroll", onScroll, { passive: true });

function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;
  progress += (progressTarget - progress) * Math.min(1, dt * 1.75);
  updateDom(progress);
  updateScene(dt, elapsed);
  composer.render();
  requestAnimationFrame(animate);
}
