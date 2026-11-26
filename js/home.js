/* Home: preview of gallery */
(async function () {
  const g = $("#home-gallery"); if (!g) return;
  const items = (await DB.list("gallery_items", "id.asc")).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.id - b.id).filter((_, i) => [0, 1, 2, 3, 4, 5].includes(i)).slice(0, 6);
  g.innerHTML = items.map(it => `<figure class="art"><a href="gallery.html?cat=${esc(it.category)}"><img src="${esc(it.image_url)}" alt="${esc(it.title)}" width="800" height="1000" loading="eager" decoding="async"></a><figcaption><b>${esc(it.title)}</b><span>${esc(it.medium)}</span></figcaption></figure>`).join("");
})();
