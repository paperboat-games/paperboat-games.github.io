(() => {
  const root = document.documentElement;
  const translations = window.PRESS_KIT_I18N || {};
  const languageSelect = document.querySelector("#language-select");
  const galleryItems = [...document.querySelectorAll("[data-gallery-item]")];
  const gameplayItems = [...document.querySelectorAll("[data-gameplay-item]")];
  const allGalleryItems = [...galleryItems, ...gameplayItems];
  const localizedElements = [...document.querySelectorAll("[data-lang]")];
  const translatedElements = [...document.querySelectorAll("[data-i18n]")];
  const trailerLinks = [...document.querySelectorAll("[data-trailer-link]")];
  const trailerFrame = document.querySelector("[data-trailer-frame]");
  const localePack = document.querySelector("[data-locale-pack]");
  const localePackType = document.querySelector("[data-locale-pack-type]");
  const gameplayPack = document.querySelector("[data-gameplay-pack]");
  const gameplayPackType = document.querySelector("[data-gameplay-pack-type]");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxDownload = lightbox?.querySelector(".lightbox-download");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");
  const metaDescription = document.querySelector('meta[name="description"]');
  const openGraphTitle = document.querySelector('meta[property="og:title"]');
  const openGraphDescription = document.querySelector('meta[property="og:description"]');
  const studioHome = document.querySelector(".studio-mark");
  const primaryNavigation = document.querySelector(".site-nav");
  const heroFacts = document.querySelector(".hero-facts");
  const heroArt = document.querySelector(".hero-art img");

  const defaultLocale = "ko-KR";
  const localeOrder = ["ko-KR", "en-US", "ja-JP", "zh-TW", "pt-BR", "fr-FR", "de-DE"];
  const localeInfo = {
    "ko-KR": { htmlLang: "ko", asset: "ko", title: "히로윙", screenshot: "보도용 스크린샷", gameplayScreenshot: "인게임 스크린샷" },
    "en-US": { htmlLang: "en", asset: "en", title: "Hero Wing", screenshot: "editorial screenshot", gameplayScreenshot: "gameplay screenshot" },
    "ja-JP": { htmlLang: "ja", asset: "ja", title: "ヒーローウィング", screenshot: "プレス用スクリーンショット", gameplayScreenshot: "ゲームプレイスクリーンショット" },
    "zh-TW": { htmlLang: "zh-Hant", asset: "zh", title: "Hero Wing", screenshot: "新聞用遊戲截圖", gameplayScreenshot: "遊戲畫面截圖" },
    "pt-BR": { htmlLang: "pt-BR", asset: "pt", title: "Hero Wing", screenshot: "captura de tela para imprensa", gameplayScreenshot: "captura de gameplay" },
    "fr-FR": { htmlLang: "fr", asset: "fr", title: "Hero Wing", screenshot: "capture d’écran presse", gameplayScreenshot: "capture de gameplay" },
    "de-DE": { htmlLang: "de", asset: "de", title: "Hero Wing", screenshot: "Presse-Screenshot", gameplayScreenshot: "Gameplay-Screenshot" }
  };

  const trailers = {
    "ko-KR": { url: "https://youtu.be/4i2Qahw9Whk", embed: "https://www.youtube-nocookie.com/embed/4i2Qahw9Whk", title: "히로윙 공식 트레일러" },
    "en-US": { url: "https://youtu.be/f3VsO5KyXxc", embed: "https://www.youtube-nocookie.com/embed/f3VsO5KyXxc", title: "Hero Wing official trailer" },
    "ja-JP": { url: "https://youtu.be/aZNtN3Cb_R8", embed: "https://www.youtube-nocookie.com/embed/aZNtN3Cb_R8", title: "ヒーローウィング 公式トレーラー" },
    "zh-TW": { url: "https://youtu.be/7h2DVbvDQbc", embed: "https://www.youtube-nocookie.com/embed/7h2DVbvDQbc", title: "Hero Wing 官方預告片" },
    "pt-BR": { url: "https://youtu.be/yOIKJoR0EhA", embed: "https://www.youtube-nocookie.com/embed/yOIKJoR0EhA", title: "Trailer oficial de Hero Wing" },
    "fr-FR": { url: "https://youtu.be/F44ol3sQPr8", embed: "https://www.youtube-nocookie.com/embed/F44ol3sQPr8", title: "Bande-annonce officielle de Hero Wing" },
    "de-DE": { url: "https://youtu.be/7aEVDb_1wkU", embed: "https://www.youtube-nocookie.com/embed/7aEVDb_1wkU", title: "Offizieller Trailer zu Hero Wing" }
  };

  let currentGalleryItem = null;

  function resolveSupportedLocale(locale) {
    if (localeOrder.includes(locale)) return locale;
    const lower = String(locale || "").toLowerCase();
    const caseInsensitiveMatch = localeOrder.find((candidate) => candidate.toLowerCase() === lower);
    if (caseInsensitiveMatch) return caseInsensitiveMatch;
    if (lower.startsWith("ko")) return "ko-KR";
    if (lower.startsWith("en")) return "en-US";
    if (lower.startsWith("ja")) return "ja-JP";
    if (lower.startsWith("zh")) return "zh-TW";
    if (lower.startsWith("pt")) return "pt-BR";
    if (lower.startsWith("fr")) return "fr-FR";
    if (lower.startsWith("de")) return "de-DE";
    return null;
  }

  function normalizeLocale(locale) {
    return resolveSupportedLocale(locale) || defaultLocale;
  }

  function galleryNumber(item) {
    return String(galleryItems.indexOf(item) + 1).padStart(2, "0");
  }

  function gallerySource(item, locale) {
    return `assets/screenshots/${localeInfo[locale].asset}-${galleryNumber(item)}.png`;
  }

  function galleryAlt(item, locale) {
    const info = localeInfo[locale];
    return `${info.title} ${info.screenshot} ${Number(galleryNumber(item))}`;
  }

  function gameplayNumber(item) {
    return String(gameplayItems.indexOf(item) + 1).padStart(2, "0");
  }

  function gameplaySource(item, locale) {
    return locale === "ko-KR" ? item.dataset.srcKo || "" : item.dataset.srcEn || "";
  }

  function gameplayAlt(item, locale) {
    const info = localeInfo[locale];
    return `${info.title} ${info.gameplayScreenshot} ${Number(gameplayNumber(item))}`;
  }

  function itemSource(item, locale) {
    return item.hasAttribute("data-gameplay-item")
      ? gameplaySource(item, locale)
      : gallerySource(item, locale);
  }

  function itemAlt(item, locale) {
    return item.hasAttribute("data-gameplay-item")
      ? gameplayAlt(item, locale)
      : galleryAlt(item, locale);
  }

  function updateLocalizedCopy(locale) {
    const parents = new Set(localizedElements.map((element) => element.parentElement));
    parents.forEach((parent) => {
      const variants = [...parent.children].filter((child) => child.dataset?.lang);
      const selected = variants.find((variant) => variant.dataset.lang === locale)
        || variants.find((variant) => variant.dataset.lang === "en-US")
        || variants.find((variant) => variant.dataset.lang === defaultLocale);

      variants.forEach((variant) => {
        variant.style.setProperty("display", variant === selected ? "inline" : "none", "important");
      });
    });
  }

  function updateTranslatedCopy(locale) {
    const bundle = translations[locale] || translations["en-US"] || translations[defaultLocale];
    const fallback = translations["en-US"] || translations[defaultLocale];
    if (!bundle || !fallback) return;

    translatedElements.forEach((element) => {
      const key = element.dataset.i18n;
      const value = bundle.strings?.[key] ?? fallback.strings?.[key];
      if (value !== undefined) element.innerHTML = value;
    });

    const ui = bundle.ui || fallback.ui;
    document.title = ui.title;
    if (metaDescription) metaDescription.content = ui.description;
    if (openGraphTitle) openGraphTitle.content = ui.title;
    if (openGraphDescription) openGraphDescription.content = ui.description;
    if (studioHome) studioHome.setAttribute("aria-label", ui.studioHome);
    if (primaryNavigation) primaryNavigation.setAttribute("aria-label", ui.primaryNav);
    if (heroFacts) heroFacts.setAttribute("aria-label", ui.heroFacts);
    if (heroArt) heroArt.alt = ui.heroArtAlt;
    if (languageSelect) languageSelect.setAttribute("aria-label", ui.language);
    if (lightbox) lightbox.setAttribute("aria-label", ui.lightbox);
    if (lightboxClose) lightboxClose.setAttribute("aria-label", ui.lightboxClose);
  }

  function updateGallery(locale) {
    galleryItems.forEach((item) => {
      const image = item.querySelector("img");
      image.src = gallerySource(item, locale);
      image.alt = galleryAlt(item, locale);
      item.setAttribute("aria-label", galleryAlt(item, locale));
    });

    gameplayItems.forEach((item) => {
      const source = gameplaySource(item, locale);
      const image = item.querySelector("img");
      item.hidden = !source;
      if (!source) return;

      image.src = source;
      image.alt = gameplayAlt(item, locale);
      item.setAttribute("aria-label", gameplayAlt(item, locale));
    });

    if (currentGalleryItem && lightbox?.open) {
      if (currentGalleryItem.hidden) {
        lightbox.close();
      } else {
        openLightbox(currentGalleryItem);
      }
    }
  }

  function updateTrailer(locale) {
    const trailer = trailers[locale];
    trailerLinks.forEach((link) => {
      link.href = trailer.url;
    });

    if (trailerFrame) {
      if (trailerFrame.src !== trailer.embed) trailerFrame.src = trailer.embed;
      trailerFrame.title = trailer.title;
    }
  }

  function updateLocalePack(locale) {
    if (localePack) {
      localePack.href = `downloads/hero-wing-screenshot-pack-${locale}.zip`;
    }
    if (localePackType) {
      localePackType.textContent = `ZIP · ${locale.toUpperCase()}`;
    }

    const gameplayLocale = locale === "ko-KR" ? "ko" : "en";
    if (gameplayPack) {
      gameplayPack.href = `downloads/hero-wing-gameplay-screenshots-${gameplayLocale}.zip`;
    }
    if (gameplayPackType) {
      gameplayPackType.textContent = `ZIP · ${gameplayLocale.toUpperCase()}`;
    }
  }

  function setLanguage(locale, persist = true) {
    const nextLocale = normalizeLocale(locale);
    root.dataset.language = nextLocale;
    root.lang = localeInfo[nextLocale].htmlLang;
    if (languageSelect) languageSelect.value = nextLocale;

    updateLocalizedCopy(nextLocale);
    updateTranslatedCopy(nextLocale);
    updateGallery(nextLocale);
    updateTrailer(nextLocale);
    updateLocalePack(nextLocale);
    root.classList.add("i18n-ready");

    if (persist) {
      try {
        localStorage.setItem("hero-wing-presskit-language", nextLocale);
      } catch (_) {
        // 브라우저 저장소를 사용할 수 없어도 페이지 기능은 유지한다.
      }
    }
  }

  function openLightbox(item) {
    if (!lightbox || !lightboxImage || !lightboxDownload) return;

    currentGalleryItem = item;
    const locale = normalizeLocale(root.dataset.language);
    const source = itemSource(item, locale);
    const alt = itemAlt(item, locale);
    if (!source) return;
    lightboxImage.src = source;
    lightboxImage.alt = alt;
    lightboxDownload.href = source;

    if (!lightbox.open) {
      lightbox.showModal();
    }
  }

  function updateLocaleQuery(locale) {
    const url = new URL(window.location.href);
    url.searchParams.set("locale", locale);
    url.searchParams.delete("lang");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function localeFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return resolveSupportedLocale(params.get("locale"))
      || resolveSupportedLocale(params.get("lang"));
  }

  languageSelect?.addEventListener("change", () => {
    const locale = normalizeLocale(languageSelect.value);
    setLanguage(locale);
    updateLocaleQuery(locale);
  });

  allGalleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
  });

  lightboxClose?.addEventListener("click", () => lightbox.close());
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox?.addEventListener("close", () => {
    currentGalleryItem = null;
    if (lightboxImage) lightboxImage.src = "";
  });

  let initialLocale = (navigator.languages || [navigator.language])
    .map(resolveSupportedLocale)
    .find(Boolean) || defaultLocale;
  try {
    const savedLocale = localStorage.getItem("hero-wing-presskit-language");
    const supportedSavedLocale = resolveSupportedLocale(savedLocale);
    if (supportedSavedLocale) initialLocale = supportedSavedLocale;
  } catch (_) {
    // 저장소를 사용할 수 없으면 브라우저 언어를 사용한다.
  }

  initialLocale = localeFromQuery() || initialLocale;

  setLanguage(initialLocale, false);
})();
