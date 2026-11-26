/* Footer social links + small helpers (kept out of the HTML so the CSP can forbid inline scripts) */
(function () {
  var ok = /^https?:\/\//i;
  var safe = function (u) { return ok.test(String(u || "")) ? String(u) : "#"; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  window.safeUrl = window.safeUrl || safe;
  var ul = document.getElementById("foot-social");
  if (ul && window.SITE) {
    ["instagram", "tiktok", "threads", "facebook", "youtube"].forEach(function (k) {
      if (!SITE.hasLink(k)) return;
      var s = SITE.social[k], li = document.createElement("li"), a = document.createElement("a");
      a.href = safe(s.url); a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = s.label;
      li.appendChild(a); ul.appendChild(li);
    });
  }
  /* images marked data-hide-on-error disappear if they fail to load */
  document.querySelectorAll("img[data-hide-on-error]").forEach(function (im) {
    var hide = function () { im.remove(); };
    if (im.complete && im.naturalWidth === 0) hide(); else im.addEventListener("error", hide);
  });
})();
