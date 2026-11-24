/* Gallery: category tabs, slides of 6 pieces, lightbox */
(async function () {
  const PER = 6;
  const grid = $("#gallery-grid"), pager = $("#gallery-pager"), label = $("#gallery-label");
  const prev = $("#g-prev"), next = $("#g-next");
  const lb = $("#lightbox"), lbImg = $("#lb-img"), lbTitle = $("#lb-title"), lbMeta = $("#lb-meta");
  const items = (await DB.list("gallery_items", "id.asc")).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.id - b.id);
  const NAMES = { portrait: "Portrait", ink: "Ink drawing", graphic: "Graphic design", painting: "Painting" };
  let cat = "all", page = 0, view = [];

  function render() {
    const ORDER = ["portrait", "ink", "graphic", "painting"];
    view = items.filter(i => cat === "all" || i.category === cat);
    if (cat === "all") view = view.slice().sort((a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category) || (a.sort_order || 0) - (b.sort_order || 0) || a.id - b.id);
    const pages = Math.max(1, Math.ceil(view.length / PER));
    page = Math.min(page, pages - 1);
    const slice = view.slice(page * PER, page * PER + PER);
    const HEAD = { portrait: "Portraits", ink: "Ink drawings", graphic: "Graphic design", painting: "Paintings" };
    const head = it => `<h3 class="cat-head"><span>${HEAD[it.category] || it.category}</span><i>${items.filter(x => x.category === it.category).length} pieces</i></h3>`;
    grid.innerHTML = slice.length ? slice.map((it, n) => `${cat === "all" && (n === 0 || slice[n - 1].category !== it.category) ? head(it) : ""}
      <figure class="art rv in" data-i="${page * PER + n}">
        <button type="button" aria-label="Open ${esc(it.title)}"><img src="${esc(it.image_url)}" alt="${esc(it.title)} — ${esc(it.medium)}" loading="lazy" decoding="async"></button>
        <figcaption><b>${esc(it.title)}</b><span>${esc(NAMES[it.category] || it.category)} · ${esc(it.medium)}</span></figcaption>
      </figure>`).join("")
        : `<div class="paint-soon">
        <div class="ps-inner">
          <p class="kicker"><span aria-hidden="true">✎</span> Painting</p>
          <h3 class="tape">Coming soon</h3>
          <p class="msg">Hand-painted pieces in watercolor and acrylic are on the way.</p>
        </div>
      </div>`;
    if (cat === "all" && page === pages - 1 && !items.some(i => i.category === "painting"))
      grid.insertAdjacentHTML("beforeend", `<h3 class="cat-head"><span>Paintings</span><i>coming soon</i></h3><p class="cat-soon">Watercolor and acrylic pieces are on the way. <button type="button" class="link" data-goto="painting">See the Paintings tab →</button></p>`);
    label.textContent = `Slide ${page + 1} / ${pages}`;
    prev.disabled = page === 0; next.disabled = page >= pages - 1;
    pager.style.display = pages > 1 ? "flex" : "none";
  }

  $$(".tab").forEach(t => t.addEventListener("click", () => {
    $$(".tab").forEach(x => x.setAttribute("aria-selected", x === t));
    cat = t.dataset.cat; page = 0; render();
  }));
  grid.addEventListener("click", e => { const b = e.target.closest("[data-goto]"); if (b) { const t = $(`.tab[data-cat="${b.dataset.goto}"]`); if (t) t.click(); } });
  prev.onclick = () => { page--; render(); };
  next.onclick = () => { page++; render(); };

  /* lightbox */
  let cur = 0;
  function show(i) {
    cur = (i + view.length) % view.length; const it = view[cur];
    lbImg.src = it.image_url; lbImg.alt = it.title; lbTitle.textContent = it.title;
    lbMeta.textContent = [NAMES[it.category] || it.category, it.medium, it.year].filter(Boolean).join(" · ");
  }
  grid.addEventListener("click", e => { const f = e.target.closest(".art"); if (!f) return; show(+f.dataset.i); openModal(lb); });
  $("#lb-prev").onclick = () => show(cur - 1); $("#lb-next").onclick = () => show(cur + 1);
  addEventListener("keydown", e => { if (!lb.classList.contains("open")) return; if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });

  const want = new URLSearchParams(location.search).get("cat");
  if (want) { const t = $(`.tab[data-cat="${want}"]`); if (t) t.click(); else render(); } else render();
})();
