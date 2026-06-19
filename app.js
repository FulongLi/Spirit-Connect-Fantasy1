import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const books = [
  {
    id: "moon",
    glyph: "月",
    title: "月球暗面",
    kicker: "档案 I · 第一扇门",
    status: "已出版",
    theme: "意识迁出 · 死球理论",
    accent: "#2bb8ff",
    image: "assets/humanexistence.png",
    link: "fantasy-content/zh/anotherworld/storylines.md",
    description:
      "2118 年，吉姆·维尔走进灵接舱进行第二次数字矫正，却带回了不属于自己的记忆。月球暗面的古老记录系统、数字双生体与 LUNA-EXIT 计划开始浮出水面。",
  },
  {
    id: "whale",
    glyph: "鲸",
    title: "巨鲸陨落",
    kicker: "档案 II · 法厄同证词",
    status: "筹备中",
    theme: "文明遗产 · 鲸歌回声",
    accent: "#7755ff",
    image: "assets/anotherworldmain.png",
    link: "fantasy-content/zh/spicopedia/whale-echo.md",
    description:
      "查理在一具陌生身体里醒来，站在尸体堆成的山上，看见一头燃烧的巨鲸从天而降。它像星舰，也像一个文明的记忆本身正在坠落。",
  },
  {
    id: "cat",
    glyph: "猫",
    title: "灵猫",
    kicker: "档案 III · 安娜的区域",
    status: "伏笔开放",
    theme: "动物意识 · 时间井",
    accent: "#2aa875",
    image: "assets/archive-field.png",
    link: "fantasy-content/zh/anotherworld/storylines.md",
    description:
      "安娜被困在非人类意识区域。记录边缘的森林里，有一只能够直视意识的猫影；那里的时间不走直线，灵猫文明仍在等待被归档。",
  },
];

const reserved = [
  "数字吉姆",
  "泰拉撒记录",
  "罗斯威尔接口",
  "双生模式",
  "黑潮 2053",
  "杜尔塞战争",
  "法厄同残响",
  "LUNA-EXIT",
  "主体核",
];

const SECTIONS = 12;
const canvas = document.getElementById("scene");
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

const scrollStage = document.getElementById("scroll-stage");
scrollStage.style.position = "fixed";
scrollStage.style.inset = "0";
scrollStage.style.overflowY = "auto";
scrollStage.style.overflowX = "hidden";
scrollStage.style.overscrollBehavior = "none";
scrollStage.style.zIndex = "2";
scrollStage.querySelector(".scroll-space").style.height = `${SECTIONS * 100}vh`;

let progressTarget = 0;
let progress = 0;
let activeBook = -1;
let pointerX = 0;
let pointerY = 0;
let smoothPointerX = 0;
let smoothPointerY = 0;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color("#f4f9ff");
scene.fog = new THREE.Fog("#f5fbff", 90, 520);

const camera = new THREE.PerspectiveCamera(
  58,
  window.innerWidth / window.innerHeight,
  0.1,
  900
);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
scene.environmentIntensity = 0.58;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.42,
  0.58,
  0.72
);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const hemi = new THREE.HemisphereLight("#ffffff", "#b8c2cc", 1.5);
scene.add(hemi);

const keyLight = new THREE.DirectionalLight("#ffffff", 3.4);
keyLight.position.set(60, 96, 84);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -180;
keyLight.shadow.camera.right = 180;
keyLight.shadow.camera.top = 180;
keyLight.shadow.camera.bottom = -180;
scene.add(keyLight);

const coolLight = new THREE.PointLight("#77d7ff", 28, 260, 1.8);
coolLight.position.set(0, 32, 0);
scene.add(coolLight);

const warmLight = new THREE.PointLight("#ffd08a", 10, 190, 2);
warmLight.position.set(-44, 18, 58);
scene.add(warmLight);

const root = new THREE.Group();
scene.add(root);

const mats = {
  white: new THREE.MeshPhysicalMaterial({
    color: "#f7fbff",
    roughness: 0.32,
    metalness: 0.08,
    clearcoat: 0.5,
    clearcoatRoughness: 0.22,
  }),
  pearl: new THREE.MeshPhysicalMaterial({
    color: "#dfeaf3",
    roughness: 0.2,
    metalness: 0.18,
    clearcoat: 0.85,
  }),
  glass: new THREE.MeshPhysicalMaterial({
    color: "#cfefff",
    roughness: 0.05,
    metalness: 0,
    transmission: 0.55,
    transparent: true,
    opacity: 0.42,
    clearcoat: 1,
    side: THREE.DoubleSide,
  }),
  darkGlass: new THREE.MeshPhysicalMaterial({
    color: "#10263c",
    roughness: 0.18,
    metalness: 0.3,
    transparent: true,
    opacity: 0.42,
    clearcoat: 1,
  }),
  rail: new THREE.MeshStandardMaterial({
    color: "#b5c4d2",
    roughness: 0.34,
    metalness: 0.45,
  }),
  blueGlow: new THREE.MeshStandardMaterial({
    color: "#07131d",
    emissive: "#2bb8ff",
    emissiveIntensity: 1.35,
    roughness: 0.4,
  }),
  goldGlow: new THREE.MeshStandardMaterial({
    color: "#1a1206",
    emissive: "#d79b3a",
    emissiveIntensity: 0.72,
    roughness: 0.42,
  }),
};

buildArchive();
buildEnvironment();

const capsules = buildCapsules();
const starField = buildParticles();
const bookSprites = buildBookSprites();

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

const posCurve = new THREE.CatmullRomCurve3(
  camPositions.map((p) => new THREE.Vector3(...p)),
  false,
  "centripetal"
);
const targetCurve = new THREE.CatmullRomCurve3(
  camTargets.map((p) => new THREE.Vector3(...p)),
  false,
  "centripetal"
);

const camPos = new THREE.Vector3();
const camTarget = new THREE.Vector3();
const clock = new THREE.Clock();

function buildEnvironment() {
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(230, 160),
    mats.white
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  const outer = new THREE.Mesh(
    new THREE.TorusGeometry(154, 1.3, 16, 192),
    mats.blueGlow
  );
  outer.rotation.x = Math.PI / 2;
  outer.position.y = 0.42;
  root.add(outer);

  const inner = new THREE.Mesh(
    new THREE.TorusGeometry(72, 0.8, 12, 160),
    mats.goldGlow
  );
  inner.rotation.x = Math.PI / 2;
  inner.position.y = 0.65;
  root.add(inner);

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const path = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.35, 76),
      mats.rail
    );
    path.position.set(Math.cos(a) * 110, 0.35, Math.sin(a) * 110);
    path.rotation.y = -a;
    root.add(path);
  }

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(238, 80, 28, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshPhysicalMaterial({
      color: "#f5fbff",
      roughness: 0.16,
      metalness: 0.02,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    })
  );
  dome.position.y = -1.5;
  root.add(dome);

  const ribs = new THREE.Group();
  const ribMat = new THREE.LineBasicMaterial({
    color: "#9fb8ca",
    transparent: true,
    opacity: 0.18,
  });
  for (let i = 0; i < 24; i++) {
    const curve = new THREE.EllipseCurve(0, 0, 238, 238, 0, Math.PI, false);
    const pts = curve.getPoints(72).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, ribMat);
    line.rotation.y = (i / 24) * Math.PI * 2;
    ribs.add(line);
  }
  ribs.position.y = -1.5;
  root.add(ribs);

  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(26, 34, 8, 72),
    mats.pearl
  );
  core.position.y = 4;
  core.castShadow = true;
  core.receiveShadow = true;
  root.add(core);

  const coreRing = new THREE.Mesh(
    new THREE.TorusGeometry(38, 0.7, 12, 140),
    mats.blueGlow
  );
  coreRing.rotation.x = Math.PI / 2;
  coreRing.position.y = 9.2;
  root.add(coreRing);
}

function buildCapsules() {
  const group = new THREE.Group();
  const items = [];
  const podGeo = new THREE.CapsuleGeometry(8, 26, 12, 26);
  const baseGeo = new THREE.BoxGeometry(18, 3.5, 44);
  const canopyGeo = new THREE.CapsuleGeometry(6.5, 20, 10, 22);

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const radius = 134;
    const pod = new THREE.Group();
    const book = books[i] || null;
    pod.userData.book = book;

    pod.position.set(Math.cos(angle) * radius, 3.8, Math.sin(angle) * radius);
    pod.rotation.y = -angle + Math.PI / 2;

    const base = new THREE.Mesh(baseGeo, mats.pearl);
    base.position.y = -1.9;
    base.castShadow = true;
    base.receiveShadow = true;
    pod.add(base);

    const body = new THREE.Mesh(podGeo, mats.white);
    body.rotation.x = Math.PI / 2;
    body.scale.set(1.05, 1.0, 0.66);
    body.position.y = 2;
    body.castShadow = true;
    body.receiveShadow = true;
    pod.add(body);

    const canopy = new THREE.Mesh(canopyGeo, book ? mats.glass : mats.darkGlass);
    canopy.rotation.x = Math.PI / 2;
    canopy.scale.set(0.78, 0.82, 0.38);
    canopy.position.set(0, 6.6, -1.6);
    pod.add(canopy);

    const rimMat = book
      ? new THREE.MeshStandardMaterial({
          color: "#07131d",
          emissive: book.accent,
          emissiveIntensity: 1.2,
          roughness: 0.4,
        })
      : mats.rail;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(8.4, 0.25, 10, 70), rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(0, 6.75, -1.6);
    pod.add(rim);

    const marker = makeTextSprite(book ? book.glyph : String(i + 1).padStart(2, "0"), {
      color: book?.accent || "#8da1b3",
      fontSize: 54,
      bg: "rgba(255,255,255,0)",
    });
    marker.position.set(0, 22, 0);
    marker.scale.set(14, 14, 1);
    pod.add(marker);

    group.add(pod);
    items.push({ pod, book, angle, marker, rimMat });
  }
  root.add(group);
  return items;
}

function buildParticles() {
  const count = 900;
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const blue = new THREE.Color("#87dfff");
  const white = new THREE.Color("#ffffff");
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 40 + Math.random() * 210;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = 8 + Math.random() * 150;
    pos[i * 3 + 2] = Math.sin(a) * r;
    const c = white.clone().lerp(blue, Math.random() * 0.6);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.9,
    vertexColors: true,
    transparent: true,
    opacity: 0.54,
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
    const sprite = makeCoverSprite(book);
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    sprite.position.set(Math.cos(angle) * 112, 38, Math.sin(angle) * 112);
    sprite.scale.set(24, 36, 1);
    sprite.visible = false;
    group.add(sprite);
    return sprite;
  });
  root.add(group);
  return items;
}

function makeTextSprite(text, options = {}) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = options.bg || "rgba(255,255,255,0.72)";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = options.color || "#111827";
  ctx.font = `800 ${options.fontSize || 84}px "Microsoft YaHei", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 130);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  });
  return new THREE.Sprite(mat);
}

function makeCoverSprite(book) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 768;
  const ctx = c.getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, 512, 768);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.35, book.accent);
  grad.addColorStop(1, "#101827");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 768);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(30, 30, 452, 708);
  ctx.strokeStyle = "rgba(255,255,255,0.72)";
  ctx.lineWidth = 3;
  ctx.strokeRect(42, 42, 428, 684);
  ctx.fillStyle = "#ffffff";
  ctx.font = '900 170px "Microsoft YaHei", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText(book.glyph, 256, 420);
  ctx.font = '800 42px "Microsoft YaHei", sans-serif';
  ctx.fillText(book.title, 256, 560);
  ctx.font = "700 20px ui-monospace, monospace";
  ctx.fillText(book.kicker.toUpperCase(), 256, 622);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  return new THREE.Sprite(mat);
}

function buildArchive() {
  const items = [
    ...books.map((book) => ({
      title: book.title,
      text: `${book.kicker}。${book.theme}。${book.description.slice(0, 58)}...`,
      empty: false,
    })),
    ...reserved.map((name, i) => ({
      title: `预留舱 ${String(i + 4).padStart(2, "0")}`,
      text: `${name} · 后续卷宗入口预留。`,
      empty: true,
    })),
  ];

  archiveList.innerHTML = items
    .map(
      (item) => `
        <article class="archive-card ${item.empty ? "is-empty" : ""}">
          <strong>${item.title}</strong>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

function clamp(n, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function setActiveBook(index) {
  if (index === activeBook) return;
  activeBook = index;
  if (index < 0 || !books[index]) return;

  const book = books[index];
  glyph.textContent = book.glyph;
  kicker.textContent = book.kicker;
  title.textContent = book.title;
  description.textContent = book.description;
  statusEl.textContent = book.status;
  themeEl.textContent = book.theme;
  link.href = book.link;
  cover.style.setProperty("--cover-image", `url('${book.image}')`);
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

  const panelOpacity = fadeWindow(p, 0.16, 0.74);
  panel.classList.toggle("is-visible", panelOpacity > 0.02);
  panel.style.opacity = panelOpacity.toFixed(3);
  panel.style.transform = `translate(-50%, ${-42 + (1 - panelOpacity) * 4}%)`;

  overview.classList.toggle("is-visible", p >= 0.82);

  if (p >= 0.16 && p < 0.74) {
    const local = (p - 0.16) / 0.58;
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
  coolLight.intensity = 25 + Math.sin(elapsed * 1.2) * 4;
  bloom.strength = 0.38 + Math.sin(elapsed * 0.8) * 0.04;

  capsules.forEach((item, i) => {
    const isActive = activeBook === i;
    const pulse = (Math.sin(elapsed * 2.1 + i) + 1) / 2;
    item.pod.position.y = 3.8 + Math.sin(elapsed * 0.7 + i) * 0.25;
    item.pod.scale.setScalar(isActive ? 1.055 : 1);
    if (item.rimMat.emissive) {
      item.rimMat.emissiveIntensity = isActive ? 2.1 + pulse * 0.55 : 0.85 + pulse * 0.18;
    }
  });

  bookSprites.forEach((sprite, i) => {
    const active = activeBook === i && progress > 0.17 && progress < 0.74;
    sprite.visible = active;
    sprite.material.opacity += ((active ? 0.98 : 0) - sprite.material.opacity) * Math.min(1, dt * 5);
    sprite.position.y = 39 + Math.sin(elapsed * 1.5) * 1.4;
    sprite.lookAt(camera.position);
  });
}

function onScroll() {
  const max = scrollStage.scrollHeight - scrollStage.clientHeight;
  progressTarget = max > 0 ? scrollStage.scrollTop / max : 0;
}

function onWheel(ev) {
  if (ev.ctrlKey) return;
  ev.preventDefault();
  const factor =
    ev.deltaMode === 1 ? 33 : ev.deltaMode === 2 ? window.innerHeight : 1;
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

setActiveBook(0);
onResize();
onScroll();
animate();
