(function () {
  const supportUrl = "https://books.apple.com/gb/book/darkside-of-the-moon/id6757206984";
  const copy = {
    zh: {
      brand: "灵接幻想",
      archive: "返回档案",
      index: "目录",
      day: "白天",
      night: "夜间",
      kicker: "档案 I · 意识迁出",
      title: "月球暗面",
      subtitle: "Darkside of the Moon",
      intro:
        "遍览古代文明，人类像猴子一样几千年没有成长。阿卡西的海洋像雨水一样浇灌在每一位智人的颅顶，没有高一级的文明介入，就算淹死，猴子依然是猴子。",
      support: `如果你喜欢本系列，欢迎在 Apple Books 支持我：<a href="${supportUrl}">Darkside of the Moon</a>`,
      start: "开始阅读",
      catalogKicker: "章节索引",
      catalogTitle: "中文阅读目录",
      soundtrackKicker: "原声概念",
      soundtrackTitle: "月球暗面 Soundtrack",
      soundtrackLead: "这里预留给本书的音乐列表。每首歌可以对应章节、场景或概念；音频上传后即可在页面里播放。",
      trackPending: "音频待上传",
      trackPlay: "播放",
      trackPause: "暂停",
      trackChapter: "章节",
      playlist: "播放列表",
      supportFooter: `如果你喜欢本系列，欢迎在 Apple Books 支持我：<a href="${supportUrl}">Darkside of the Moon</a>。感谢你的阅读与支持。`,
    },
    en: {
      brand: "SPIRIT CONNECT FANTASY",
      archive: "Archive",
      index: "Index",
      day: "Day",
      night: "Night",
      kicker: "Archive I · Consciousness Exodus",
      title: "Darkside of the Moon",
      subtitle: "月球暗面",
      intro:
        "Across the sweep of ancient civilizations, humanity has remained like monkeys, unchanged for thousands of years. The ocean of Akasha pours like rain onto the crown of every Homo sapiens; without the intervention of a higher civilization, even if drowned, a monkey remains a monkey.",
      support: `If you enjoy this series, you can support me on Apple Books: <a href="${supportUrl}">Darkside of the Moon</a>.`,
      start: "Start reading",
      catalogKicker: "Chapter Index",
      catalogTitle: "English Index",
      soundtrackKicker: "Soundtrack Concepts",
      soundtrackTitle: "Darkside of the Moon Soundtrack",
      soundtrackLead: "A reserved music list for this book. Each track can map to a chapter, scene, or concept; once audio files are uploaded, they can play here.",
      trackPending: "Audio pending",
      trackPlay: "Play",
      trackPause: "Pause",
      trackChapter: "Chapter",
      playlist: "Playlist",
      supportFooter: `If you enjoy this series, you can support me on Apple Books: <a href="${supportUrl}">Darkside of the Moon</a>. Thank you for reading and supporting the work.`,
    },
  };

  const isIndex = document.body.classList.contains("index-page");
  const path = window.location.pathname;
  const requestedLang = new URLSearchParams(window.location.search).get("lang") || localStorage.getItem("darkMoonLang") || localStorage.getItem("spiritConnectLang");
  const currentLang = path.includes("/en_html/") ? "en" : path.includes("/zh_html/") ? "zh" : requestedLang === "en" || requestedLang === "zh" ? requestedLang : "zh";
  const currentTheme = localStorage.getItem("darkMoonTheme") || document.body.dataset.theme || "night";

  function setTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem("darkMoonTheme", theme);
    document.querySelectorAll("[data-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === theme);
    });
  }

  function refreshTopbar(lang) {
    const topbar = document.querySelector(".reader-topbar");
    if (!topbar) return;
    const brand = topbar.querySelector(".reader-brand");
    const nav = topbar.querySelector(".reader-nav a");
    const day = topbar.querySelector("[data-mode='day']");
    const night = topbar.querySelector("[data-mode='night']");
    if (brand) brand.textContent = copy[lang].brand;
    if (nav) nav.textContent = isIndex ? copy[lang].archive : copy[lang].index;
    if (day) day.textContent = copy[lang].day;
    if (night) night.textContent = copy[lang].night;
    topbar.querySelectorAll("button[data-lang]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.lang === lang);
    });
  }

  function chapterTarget(lang) {
    if (isIndex) return lang === "zh" ? "zh_html/00_书名页与写作说明.html" : "en_html/00_书名页与写作说明.html";
    const file = decodeURIComponent(path.split("/").pop());
    if (path.includes("/zh_html/")) return lang === "zh" ? file : "../en_html/" + file;
    if (path.includes("/en_html/")) return lang === "en" ? file : "../zh_html/" + file;
    return lang === "zh" ? "zh_html/00_书名页与写作说明.html" : "en_html/00_书名页与写作说明.html";
  }

  function setIndexLanguage(lang) {
    if (!isIndex) return;
    document.body.dataset.lang = lang;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = copy[lang][node.dataset.i18n];
      if (!value) return;
      if (node.dataset.i18n === "support") node.innerHTML = value;
      else node.textContent = value;
    });
    const start = document.getElementById("start-reading");
    if (start) start.href = chapterTarget(lang);
    localStorage.setItem("darkMoonLang", lang);
    refreshTopbar(lang);
    document.querySelectorAll("button[data-lang]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.lang === lang);
    });
    setupSoundtrack(lang);
  }

  function createTopbar() {
    const topbar = document.createElement("header");
    topbar.className = "reader-topbar";
    topbar.innerHTML = `
      <a class="reader-brand" href="${isIndex ? "../../" : "../../../"}">${copy[currentLang].brand}</a>
      <nav class="reader-nav" aria-label="Reader navigation">
        <a href="${isIndex ? "../../" : "../index.html"}">${isIndex ? copy[currentLang].archive : copy[currentLang].index}</a>
      </nav>
      <div class="toolbar" aria-label="Display controls">
        <div class="segmented" aria-label="Language">
          <button type="button" data-lang="zh">中文</button>
          <button type="button" data-lang="en">EN</button>
        </div>
        <div class="segmented" aria-label="Theme">
          <button type="button" data-mode="day">${copy[currentLang].day}</button>
          <button type="button" data-mode="night">${copy[currentLang].night}</button>
        </div>
      </div>
    `;
    document.body.prepend(topbar);
    topbar.querySelectorAll("[data-lang]").forEach((button) => {
      button.addEventListener("click", () => {
        const lang = button.dataset.lang;
        if (isIndex) setIndexLanguage(lang);
        else if (lang === currentLang) localStorage.setItem("darkMoonLang", lang);
        else window.location.href = chapterTarget(lang);
      });
    });
    topbar.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => setTheme(button.dataset.mode));
    });
  }

  function addSupportFooter() {
    const main = document.querySelector("main");
    if (!main || main.querySelector(".reader-support")) return;
    const footer = document.createElement("aside");
    footer.className = "reader-support";
    footer.innerHTML = copy[currentLang].supportFooter;
    main.append(footer);
  }

  const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l13 7-13 7z"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  let stIndex = 0;
  let stLang = currentLang;

  function setupSoundtrack(lang) {
    stLang = lang;
    const tracks = window.darkMoonSoundtrack || [];
    const player = document.querySelector("[data-soundtrack-player]");
    const audio = document.getElementById("soundtrack-audio");
    if (!player || !audio || !tracks.length) return;

    const number = document.getElementById("track-number");
    const title = document.getElementById("track-title");
    const playBtn = document.getElementById("track-play");
    const toggle = document.getElementById("track-toggle");
    const list = document.getElementById("track-list");
    const ring = document.getElementById("track-ring");
    const RING_C = 2 * Math.PI * 20;

    function setPlayIcon() {
      playBtn.innerHTML = audio.paused ? ICON_PLAY : ICON_PAUSE;
    }

    function setRing(frac) {
      if (!ring) return;
      ring.style.strokeDasharray = RING_C;
      ring.style.strokeDashoffset = RING_C * (1 - Math.max(0, Math.min(1, frac || 0)));
    }

    function highlight() {
      list.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("is-active", Number(b.dataset.i) === stIndex);
      });
    }

    function load(index, autoplay) {
      const track = tracks[index];
      if (!track) return;
      stIndex = index;
      number.textContent = track.number;
      title.textContent = track.title[stLang];
      setRing(0);
      audio.removeAttribute("src");
      playBtn.disabled = !track.src;
      if (track.src) {
        audio.src = "soundtrack/" + track.src;
        if (autoplay) audio.play().catch(function () {});
      }
      setPlayIcon();
      highlight();
    }

    function renderList() {
      list.innerHTML = tracks
        .map(function (t, i) {
          return (
            '<li><button type="button" data-i="' + i + '">' +
            "<span>" + t.number + "</span>" +
            "<strong>" + t.title[stLang] + "</strong>" +
            "<small>" + t.duration + "</small>" +
            "</button></li>"
          );
        })
        .join("");
      list.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          load(Number(b.dataset.i), true);
        });
      });
      highlight();
    }

    // Re-running on language switch: refresh texts, keep playback & open state.
    if (player.dataset.bound) {
      const t = tracks[stIndex];
      if (t) title.textContent = t.title[stLang];
      renderList();
      return;
    }
    player.dataset.bound = "1";

    playBtn.onclick = function () {
      if (!audio.src) {
        load(stIndex, true);
        return;
      }
      if (audio.paused) audio.play().catch(function () {});
      else audio.pause();
    };

    toggle.onclick = function () {
      const open = player.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    audio.addEventListener("play", setPlayIcon);
    audio.addEventListener("pause", setPlayIcon);
    audio.addEventListener("timeupdate", function () {
      if (audio.duration) setRing(audio.currentTime / audio.duration);
    });
    audio.addEventListener("ended", function () {
      setRing(1);
      load((stIndex + 1) % tracks.length, true);
    });

    renderList();
    load(stIndex, false);
  }

  document.body.dataset.lang = currentLang;
  localStorage.setItem("darkMoonLang", currentLang);
  createTopbar();
  refreshTopbar(currentLang);
  setTheme(currentTheme);
  setIndexLanguage(currentLang);
  setupSoundtrack(currentLang);
  addSupportFooter();
})();
