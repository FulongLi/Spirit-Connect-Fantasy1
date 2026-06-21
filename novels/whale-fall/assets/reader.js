(function () {
  const copy = {
    zh: {
      brand: "灵接幻想",
      archive: "返回档案",
      index: "目录",
      day: "白天",
      night: "夜间",
      kicker: "档案 II · 法厄同证词",
      title: "巨鲸陨落",
      subtitle: "Whale Fall",
      intro:
        "尸山之上，查理在一具陌生身体里醒来。天空裂开，巨鲸从天而降；一场远古战争的尾声，开始反向照亮地球生命的来处。",
      start: "开始阅读",
      catalogKicker: "章节索引",
      catalogTitle: "中文阅读目录",
    },
    en: {
      brand: "SPIRIT CONNECT FANTASY",
      archive: "Archive",
      index: "Index",
      day: "Day",
      night: "Night",
      kicker: "Archive II · Phaeton Testimony",
      title: "Whale Fall",
      subtitle: "巨鲸陨落",
      intro:
        "On a mountain of the dead, Charlie wakes inside a stranger's body. The sky splits, a giant whale falls, and the end of an ancient war begins to illuminate the origin of life on Earth.",
      start: "Start reading",
      catalogKicker: "Chapter Index",
      catalogTitle: "English Reading Index",
    },
  };

  const storagePrefix = "whaleFall";
  const isIndex = document.body.classList.contains("index-page");
  const path = window.location.pathname;
  const currentLang = path.includes("/en_html/") ? "en" : path.includes("/zh_html/") ? "zh" : localStorage.getItem(storagePrefix + "Lang") || "zh";
  const currentTheme = localStorage.getItem(storagePrefix + "Theme") || document.body.dataset.theme || "night";

  function setTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem(storagePrefix + "Theme", theme);
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
      if (value) node.textContent = value;
    });
    const start = document.getElementById("start-reading");
    if (start) start.href = chapterTarget(lang);
    localStorage.setItem(storagePrefix + "Lang", lang);
    refreshTopbar(lang);
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
        else if (lang === currentLang) localStorage.setItem(storagePrefix + "Lang", lang);
        else window.location.href = chapterTarget(lang);
      });
    });
    topbar.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => setTheme(button.dataset.mode));
    });
  }

  document.body.dataset.lang = currentLang;
  localStorage.setItem(storagePrefix + "Lang", currentLang);
  createTopbar();
  refreshTopbar(currentLang);
  setTheme(currentTheme);
  setIndexLanguage(currentLang);
})();
