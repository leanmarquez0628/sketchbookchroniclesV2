/* Personal blog: profile-style feeds for YouTube, TikTok, Instagram and Facebook */
(function () {
  const root = $("#feed"); if (!root) return;
  const S = SITE.social, F = SEED.social_feed;
  const order = ["youtube", "tiktok", "instagram", "facebook", "threads"];
  let cur = "youtube";

  const tabs = $("#feed-tabs");
  tabs.innerHTML = order.map(k => `<button type="button" class="tab" role="tab" aria-selected="${k === cur}" data-k="${k}"><span class="ti">${ICON[k]}</span> ${F[k].label}</button>`).join("");

  function posts(g) {
    return `<div class="feed-block"><h4>${esc(g.title)}</h4><div class="thread-grid">` + g.items.map(p =>
      `<${SITE.hasLink(cur) ? `a class="thread" href="${esc(S[cur].url)}" target="_blank" rel="noopener"` : `div class="thread"`}><img src="${esc(p.src)}" alt="Drawing shared on ${esc(F[cur].label)}" loading="lazy" decoding="async"><div class="tc"><small>${p.pinned ? "Pinned" : esc(p.date || "")}</small><p>${esc(p.caption)}</p></div></${SITE.hasLink(cur) ? "a" : "div"}>`).join("") + `</div></div>`;
  }
  function grid(g) {
    if (g.type === "posts") return posts(g);
    return `<div class="feed-block"><h4>${esc(g.title)}</h4><div class="feed-grid ar-${g.ratio}">` +
      g.items.map(it => `<a class="feed-tile" href="${esc(F[cur].url || S[cur].url)}" target="_blank" rel="noopener" aria-label="Open ${esc(F[cur].label)}"><img src="${esc(it)}" alt="${esc(g.alt)}" loading="lazy" decoding="async"></a>`).join("") + `</div></div>`;
  }
  function render() {
    const f = F[cur], s = S[cur];
    root.innerHTML = `<div class="feed-head"><span class="feed-ico">${ICON[cur]}</span><div><b>${esc(f.label)}</b><br><span>${esc(f.handle || s.handle || "")}${f.note ? " · " + esc(f.note) : ""}</span></div>
      ${SITE.hasLink(cur) ? `<a class="btn sm" href="${esc(s.url)}" target="_blank" rel="noopener">Follow on ${esc(f.label)}</a>` : ""}</div>` + f.groups.map(grid).join("");
  }
  tabs.addEventListener("click", e => { const b = e.target.closest(".tab"); if (!b) return; $$(".tab", tabs).forEach(x => x.setAttribute("aria-selected", x === b)); cur = b.dataset.k; render(); });
  render();
})();
