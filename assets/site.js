// Fills download links and the version label from the latest GitHub release.
(function () {
  var REPO = "offprism/launcher";
  var FALLBACK = "https://github.com/" + REPO + "/releases/latest";

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

  function detectOs() {
    var ua = navigator.userAgent || "";
    var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    if (/Win/i.test(platform) || /Windows/i.test(ua)) return /ARM|aarch64/i.test(ua) ? "winarm" : "win";
    if (/Mac/i.test(platform) || /Mac OS/i.test(ua)) return "mac";
    if (/Linux|X11/i.test(platform) || /Linux/i.test(ua)) return "linux";
    return "";
  }

  function sizeLabel(bytes) {
    return (bytes / 1024 / 1024).toFixed(1) + " МБ";
  }

  var os = detectOs();
  var osNames = { win: "Windows", winarm: "Windows (ARM)", mac: "macOS", linux: "Linux" };
  var primaryKey = { win: "win-setup", winarm: "winarm-setup", mac: "mac-dmg", linux: "linux-appimage" }[os];

  document.querySelectorAll("[data-os-card='" + os + "']").forEach(function (el) {
    el.classList.add("recommended");
    var badge = el.querySelector(".badge");
    if (badge) badge.hidden = false;
  });
  document.querySelectorAll("[data-os-name]").forEach(function (el) {
    if (osNames[os]) el.textContent = osNames[os];
  });

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
        if (!asset) return;
        el.href = asset.browser_download_url;
        var size = el.querySelector("small");
        if (size) size.textContent = sizeLabel(asset.size);
      });
      document.querySelectorAll("[data-primary-download]").forEach(function (el) {
        if (primaryKey && found[primaryKey]) el.href = found[primaryKey].browser_download_url;
      });
      var name = release.name || release.tag_name;
      document.querySelectorAll("[data-version]").forEach(function (el) {
        el.textContent = name;
      });
    })
    .catch(function () {
      document.querySelectorAll("[data-asset],[data-primary-download]").forEach(function (el) {
        if (!el.getAttribute("href") || el.getAttribute("href") === "#") el.href = FALLBACK;
      });
    });
})();
