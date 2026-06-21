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
      supportFooter: `If you enjoy this series, you can support me on Apple Books: <a href="${supportUrl}">Darkside of the Moon</a>. Thank you for reading and supporting the work.`,
    },
  };

  const isIndex = document.body.classList.contains("index-page");
  const path = window.location.pathname;
  const currentLang = path.includes("/en_html/") ? "en" : path.includes("/zh_html/") ? "zh" : localStorage.getItem("darkMoonLang") || "zh";
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

  function setupSoundtrack(lang) {
    const tracks = window.darkMoonSoundtrack || [];
    const list = document.getElementById("track-list");
    const audio = document.getElementById("soundtrack-audio");
    const play = document.getElementById("track-play");
    const number = document.getElementById("track-number");
    const title = document.getElementById("track-title");
    const mood = document.getElementById("track-mood");
    const duration = document.getElementById("track-duration");
    if (!list || !audio || !play || !tracks.length) return;

    let activeIndex = Number(list.dataset.activeIndex || 0);
    let isPlaying = false;

    function paintTrack(index) {
      const track = tracks[index];
      if (!track) return;
      activeIndex = index;
      list.dataset.activeIndex = String(index);
      number.textContent = track.number;
      title.textContent = track.title[lang];
      mood.textContent = track.mood[lang];
      duration.textContent = track.duration;
      play.disabled = !track.src;
      play.textContent = track.src ? copy[lang].trackPlay : copy[lang].trackPending;
      audio.removeAttribute("src");
      if (track.src) audio.src = "soundtrack/" + track.src;
      list.querySelectorAll("button").forEach((button) => {
        button.classList.toggle("is-active", Number(button.dataset.trackIndex) === index);
      });
      isPlaying = false;
    }

    function renderList() {
      list.innerHTML = tracks
        .map((track, index) => `
          <li>
            <button type="button" data-track-index="${index}">
              <span>${track.number}</span>
              <strong>${track.title[lang]}</strong>
              <small>${copy[lang].trackChapter} ${track.chapter} · ${track.duration}</small>
            </button>
          </li>
        `)
        .join("");
      list.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => paintTrack(Number(button.dataset.trackIndex)));
      });
      paintTrack(activeIndex);
    }

    play.onclick = async () => {
      if (!audio.src) return;
      if (isPlaying) {
        audio.pause();
        play.textContent = copy[lang].trackPlay;
        isPlaying = false;
        return;
      }
      await audio.play();
      play.textContent = copy[lang].trackPause;
      isPlaying = true;
    };

    audio.onended = () => {
      play.textContent = copy[lang].trackPlay;
      isPlaying = false;
    };

    renderList();
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
