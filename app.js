const books = [
  {
    id: "moon",
    glyph: "月",
    title: "月球暗面",
    kicker: "档案 I · 第一扇门",
    status: "已出版",
    theme: "意识迁出 · 死球理论",
    accent: "#2bb8ff",
    image: "url('assets/humanexistence.png')",
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
    image: "url('assets/anotherworldmain.png')",
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
    image: "url('assets/archive-field.png')",
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

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
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

let w = 0;
let h = 0;
let dpr = 1;
let targetProgress = 0;
let progress = 0;
let activeBook = -1;

const capsules = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
  return {
    angle,
    x: Math.cos(angle) * 150,
    z: Math.sin(angle) * 150,
    book: books[i] || null,
  };
});

function clamp(n, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function ease(t) {
  return t * t * (3 - 2 * t);
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  targetProgress = max > 0 ? clamp(window.scrollY / max) : 0;
}

function cameraAt(p) {
  if (p < 0.16) {
    const t = ease(p / 0.16);
    return {
      x: 0,
      y: lerp(250, 115, t),
      z: lerp(390, 250, t),
      yaw: lerp(0, 0.15, t),
      pitch: lerp(0.72, 0.5, t),
    };
  }

  if (p < 0.72) {
    const t = (p - 0.16) / 0.56;
    const orbit = -Math.PI / 2 + t * Math.PI * 2.08;
    const radius = lerp(260, 210, Math.sin(t * Math.PI));
    return {
      x: Math.cos(orbit) * radius,
      y: lerp(86, 72, Math.sin(t * Math.PI)),
      z: Math.sin(orbit) * radius,
      yaw: orbit + Math.PI,
      pitch: 0.26,
    };
  }

  const t = ease((p - 0.72) / 0.28);
  return {
    x: lerp(0, 0, t),
    y: lerp(138, 330, t),
    z: lerp(260, 18, t),
    yaw: lerp(0, 0, t),
    pitch: lerp(0.44, 1.43, t),
  };
}

function project(point, cam) {
  const dx = point.x - cam.x;
  const dy = point.y - cam.y;
  const dz = point.z - cam.z;
  const cy = Math.cos(-cam.yaw);
  const sy = Math.sin(-cam.yaw);
  const x1 = dx * cy - dz * sy;
  const z1 = dx * sy + dz * cy;
  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  const y2 = dy * cp - z1 * sp;
  const z2 = dy * sp + z1 * cp;
  const depth = z2 + 460;
  const scale = Math.min(5, 620 / Math.max(80, depth));
  return {
    x: w / 2 + x1 * scale,
    y: h * 0.54 + y2 * scale,
    s: scale,
    depth,
  };
}

function drawChamber(cam, time) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#eef7ff");
  g.addColorStop(0.46, "#ffffff");
  g.addColorStop(1, "#dce8f2");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const floor = project({ x: 0, y: -4, z: 0 }, cam);
  const floorRx = Math.max(w * 0.34, floor.s * 220);
  const floorRy = Math.max(80, floor.s * 74);
  ctx.save();
  ctx.translate(floor.x, floor.y);
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.strokeStyle = "rgba(90,120,150,0.16)";
  ctx.lineWidth = 1;
  for (let r = 4; r >= 1; r--) {
    ctx.beginPath();
    ctx.ellipse(0, 0, (floorRx * r) / 4, (floorRy * r) / 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  const glow = ctx.createRadialGradient(w / 2, h * 0.46, 0, w / 2, h * 0.48, Math.max(w, h) * 0.62);
  glow.addColorStop(0, "rgba(43,184,255,0.18)");
  glow.addColorStop(0.45, "rgba(255,255,255,0)");
  glow.addColorStop(1, "rgba(80,105,130,0.10)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  drawRing(cam, time);
}

function drawRing(cam, time) {
  const points = [];
  for (let i = 0; i < 144; i++) {
    const a = (i / 144) * Math.PI * 2;
    points.push(project({ x: Math.cos(a) * 105, y: 2, z: Math.sin(a) * 105 }, cam));
  }
  ctx.beginPath();
  points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.strokeStyle = "rgba(43,184,255,0.24)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const pulse = (Math.sin(time * 0.002) + 1) / 2;
  ctx.strokeStyle = `rgba(185,138,50,${0.12 + pulse * 0.13})`;
  ctx.lineWidth = 5;
  ctx.stroke();
}

function drawCapsule(c, cam, i, time) {
  const p = project({ x: c.x, y: 0, z: c.z }, cam);
  const top = project({ x: c.x, y: 38, z: c.z }, cam);
  const active = activeBook === i;
  const book = c.book;
  const size = clamp(p.s, 0.45, 4.2);
  const width = 20 * size;
  const height = Math.max(32, Math.abs(top.y - p.y) + 34 * size);

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(c.angle + cam.yaw + Math.PI / 2);

  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.strokeStyle = active ? (book?.accent || "#2bb8ff") : "rgba(75,100,130,0.24)";
  ctx.lineWidth = active ? 2.2 : 1;

  roundRect(-width, -height * 0.74, width * 2, height, width);
  ctx.fill();
  ctx.stroke();

  const lid = ctx.createLinearGradient(0, -height * 0.74, 0, height * 0.18);
  lid.addColorStop(0, active ? "rgba(43,184,255,0.28)" : "rgba(190,210,226,0.34)");
  lid.addColorStop(1, "rgba(255,255,255,0.08)");
  ctx.fillStyle = lid;
  roundRect(-width * 0.72, -height * 0.62, width * 1.44, height * 0.68, width * 0.8);
  ctx.fill();

  ctx.fillStyle = active ? (book?.accent || "#2bb8ff") : "rgba(97,120,145,0.22)";
  ctx.beginPath();
  ctx.arc(0, -height * 0.22, Math.max(2.5, 2.8 * size), 0, Math.PI * 2);
  ctx.fill();

  if (book) {
    ctx.rotate(-(c.angle + cam.yaw + Math.PI / 2));
    ctx.fillStyle = active ? book.accent : "rgba(20,34,50,0.5)";
    ctx.font = `${Math.max(12, 13 * size)}px Microsoft YaHei, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(book.glyph, 0, -height * 0.9);
  }

  ctx.restore();
}

function roundRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawBookHologram(cam, time) {
  if (activeBook < 0 || !books[activeBook]) return;
  const c = capsules[activeBook];
  const book = books[activeBook];
  const hover = Math.sin(time * 0.0022) * 4;
  const p = project({ x: c.x * 0.94, y: 66 + hover, z: c.z * 0.94 }, cam);
  const s = clamp(p.s, 0.55, 3.8);
  const bw = 34 * s;
  const bh = 52 * s;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.shadowColor = book.accent;
  ctx.shadowBlur = 28;
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  roundRect(-bw / 2, -bh / 2, bw, bh, 5 * s);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = book.accent;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = book.accent;
  ctx.font = `${Math.max(20, 30 * s)}px Microsoft YaHei, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(book.glyph, 0, 0);
  ctx.restore();
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
  cover.style.setProperty("--cover-image", book.image);
  cover.style.borderColor = book.accent;
}

function updateDom(p) {
  railDot.style.top = `${p * 100}%`;
  intro.classList.toggle("is-visible", p < 0.16);
  panel.classList.toggle("is-visible", p >= 0.18 && p < 0.76);
  overview.classList.toggle("is-visible", p >= 0.82);

  if (p >= 0.18 && p < 0.76) {
    const t = (p - 0.18) / 0.58;
    const index = clamp(Math.floor(t * books.length), 0, books.length - 1);
    setActiveBook(index);
  } else if (p < 0.18) {
    setActiveBook(-1);
  }
}

function render(time = 0) {
  progress += (targetProgress - progress) * 0.075;
  updateDom(progress);

  const cam = cameraAt(progress);
  drawChamber(cam, time);

  const ordered = capsules
    .map((c, i) => ({ c, i, p: project({ x: c.x, y: 0, z: c.z }, cam) }))
    .sort((a, b) => b.p.depth - a.p.depth);
  ordered.forEach(({ c, i }) => drawCapsule(c, cam, i, time));
  drawBookHologram(cam, time);

  requestAnimationFrame(render);
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

window.addEventListener("resize", resize);
window.addEventListener("scroll", updateScroll, { passive: true });
resize();
updateScroll();
buildArchive();
setActiveBook(0);
requestAnimationFrame(render);
