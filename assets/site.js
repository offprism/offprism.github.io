// Fills download links, sizes and the version label from the latest GitHub release.
(function () {
  var REPO = "offprism/launcher";
  var FALLBACK = "https://github.com/" + REPO + "/releases/latest";
  var ru = document.documentElement.lang === "ru";

  var patterns = {
    "win-setup": /^OffPrism-Windows-MSVC-Setup-.*\.exe$/,
    "win-portable": /^OffPrism-Windows-MSVC-Portable-.*\.zip$/,
    "winarm-setup": /^OffPrism-Windows-MSVC-arm64-Setup-.*\.exe$/,
    "winarm-portable": /^OffPrism-Windows-MSVC-arm64-Portable-.*\.zip$/,
    "linux-appimage": /^OffPrism-Linux-x86_64\.AppImage$/,
    "linux-portable": /^OffPrism-Linux-Qt6-Portable-.*\.tar\.gz$/,
    "mac-dmg": /^OffPrism-macOS-.*\.dmg$/,
    "mac-zip": /^OffPrism-macOS-.*\.zip$/,
    "source": /^OffPrism-\d.*\.tar\.gz$/
  };

  var text = ru ? {
    names: { win: "Windows", winarm: "Windows на ARM", mac: "macOS", linux: "Linux" },
    notes: {
      win: "Установщик для Windows 10 и 11 (x64)",
      winarm: "Установщик для Windows на ARM64",
      mac: "Образ диска для Intel и Apple Silicon",
      linux: "AppImage — запускается в любом дистрибутиве"
    },
    mb: " МБ"
  } : {
    names: { win: "Windows", winarm: "Windows on ARM", mac: "macOS", linux: "Linux" },
    notes: {
      win: "Installer for Windows 10 and 11 (x64)",
      winarm: "Installer for Windows on ARM64",
      mac: "Disk image for Intel and Apple Silicon",
      linux: "AppImage — runs on any distribution"
    },
    mb: " MB"
  };

  function detectOs() {
    var ua = navigator.userAgent || "";
    var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    if (/Android|iPhone|iPad/i.test(ua)) return "";
    if (/Win/i.test(platform) || /Windows/i.test(ua)) return /ARM|aarch64/i.test(ua) ? "winarm" : "win";
    if (/Mac/i.test(platform) || /Mac OS/i.test(ua)) return "mac";
    if (/Linux|X11/i.test(platform) || /Linux/i.test(ua)) return "linux";
    return "";
  }

  var os = detectOs();
  var primaryKey = { win: "win-setup", winarm: "winarm-setup", mac: "mac-dmg", linux: "linux-appimage" }[os];

  if (os) {
    document.querySelectorAll("[data-os-name]").forEach(function (el) { el.textContent = text.names[os]; });
  }

  var main = document.getElementById("recommended");
  if (main && os) {
    main.hidden = false;
    var icon = document.querySelector("[data-os-svg='" + os + "']");
    var slot = main.querySelector("[data-main-icon]");
    if (icon && slot) slot.appendChild(icon.cloneNode(true));
    var note = main.querySelector("[data-main-note]");
    if (note) note.textContent = text.notes[os];
  }

  function sizeLabel(bytes) {
    var n = (bytes / 1024 / 1024).toFixed(1);
    return (ru ? n.replace(".", ",") : n) + text.mb;
  }

  fetch("https://api.github.com/repos/" + REPO + "/releases/latest")
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (release) {
      var found = {};
      (release.assets || []).forEach(function (asset) {
        Object.keys(patterns).forEach(function (key) {
          if (patterns[key].test(asset.name)) found[key] = asset;
        });
      });
      document.querySelectorAll("[data-asset]").forEach(function (el) {
        var asset = found[el.getAttribute("data-asset")];
        if (!asset) { el.href = FALLBACK; return; }
        el.href = asset.browser_download_url;
        var small = el.querySelector("small");
        if (small) small.textContent = small.textContent + " · " + sizeLabel(asset.size);
      });
      document.querySelectorAll("[data-primary-download]").forEach(function (el) {
        if (primaryKey && found[primaryKey]) el.href = found[primaryKey].browser_download_url;
      });
      var name = release.name || release.tag_name;
      document.querySelectorAll("[data-version]").forEach(function (el) { el.textContent = name; });
      document.querySelectorAll("[data-version-num]").forEach(function (el) { el.textContent = release.tag_name; });
    })
    .catch(function () {
      document.querySelectorAll("[data-asset]").forEach(function (el) {
        if (el.getAttribute("href") === "#") el.href = FALLBACK;
      });
    });
})();
