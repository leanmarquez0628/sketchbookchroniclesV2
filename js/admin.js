/* Admin dashboard: messages, orders, subscribers and gallery (needs Supabase for gallery; works locally for the rest) */
(function () {
  const out = $("#admin-out"), tabs = $("#admin-tabs"), login = $("#login"), status = $("#admin-status"), stats = $("#admin-stats"), gform = $("#gallery-form");
  const STATUS = { messages: ["new", "replied", "archived"], orders: ["new", "confirmed", "paid", "shipped", "cancelled"] };
  const COLS = {
    messages: [["created_at", "Date"], ["name", "From"], ["email", "Email"], ["subject", "Subject"], ["message", "Message"], ["status", "Status"]],
    orders: [["created_at", "Date"], ["product_code", "Code"], ["variant", "Format"], ["size", "Size"], ["quantity", "Qty"], ["total", "Total"], ["payment_method", "Pay"], ["customer_name", "Customer"], ["email", "Email"], ["phone", "Phone"], ["note", "Notes"], ["status", "Status"]],
    subscribers: [["created_at", "Date"], ["email", "Email"]],
    gallery_items: [["title", "Title"], ["category", "Category"], ["medium", "Medium"], ["year", "Year"], ["published", "Shown"]]
  };
  let current = "messages", token = null, rows = [];
  const keyOf = t => t === "products" ? "code" : "id";
  const needsDb = t => t === "gallery_items";

  function cell(t, r, c) {
    if (c === "created_at") return esc(r[c] ? new Date(r[c]).toLocaleString() : "");
    if (c === "name") return esc(`${r.first_name || ""} ${r.last_name || ""}`.trim());
    if (c === "total") return esc(peso(r.total ?? (r.price || 0) * (r.quantity || 1)));
    if (c === "quantity") return esc(r.quantity ?? 1);
    if (c === "status") return `<select data-act="status" aria-label="Status">${STATUS[t].map(s => `<option${s === r.status ? " selected" : ""}>${s}</option>`).join("")}</select>`;
    if (c === "published") return `<input type="checkbox" data-act="published" aria-label="Shown on site"${r.published ? " checked" : ""}>`;
    return esc(r[c]);
  }

  async function load() {
    stats.textContent = ""; gform.style.display = current === "gallery_items" && token ? "block" : "none";
    if (needsDb(current) && !DB.configured()) { out.innerHTML = `<div class="empty">Connect Supabase in <code>js/config.js</code> to manage the gallery from here. Until then the gallery uses <code>js/data.js</code>.</div>`; rows = []; return; }
    try { rows = DB.configured() ? await DB.adminList(current, token) : DB.local(current); }
    catch (e) { out.innerHTML = `<div class="empty">${esc(e.message)}</div>`; rows = []; return; }
    const cols = COLS[current], k = keyOf(current);
    if (current === "orders") {
      const open = rows.filter(r => ["new", "confirmed"].includes(r.status || "new"));
      stats.innerHTML = `<b>${open.length}</b> open order${open.length === 1 ? "" : "s"} · <b>${peso(open.reduce((a, r) => a + (r.total ?? (r.price || 0) * (r.quantity || 1)), 0))}</b> pending`;
    } else if (current === "messages") {
      const n = rows.filter(r => (r.status || "new") === "new").length; stats.innerHTML = `<b>${n}</b> new message${n === 1 ? "" : "s"}`;
    } else stats.innerHTML = `<b>${rows.length}</b> total`;
    out.innerHTML = rows.length ? `<div class="table-wrap"><table><thead><tr>${cols.map(c => `<th>${c[1]}</th>`).join("")}<th></th></tr></thead><tbody>
      ${rows.map(r => `<tr data-id="${esc(r[k])}">${cols.map(c => `<td>${cell(current, r, c[0])}</td>`).join("")}<td><button type="button" class="btn sm ghost danger" data-act="delete" aria-label="Delete">Delete</button></td></tr>`).join("")}</tbody></table></div>`
      : `<div class="empty">Nothing here yet.</div>`;
  }

  tabs.addEventListener("click", e => { const b = e.target.closest(".tab"); if (!b) return; $$(".tab", tabs).forEach(x => x.setAttribute("aria-selected", x === b)); current = b.dataset.t; load(); });

  out.addEventListener("change", async e => {
    const act = e.target.dataset.act, tr = e.target.closest("tr"); if (!act || !tr) return;
    const patch = act === "status" ? { status: e.target.value } : { published: e.target.checked };
    try { await DB.adminUpdate(current, tr.dataset.id, patch, token); toast("Saved."); if (act === "status") load(); } catch (err) { toast(err.message); load(); }
  });
  out.addEventListener("click", async e => {
    const b = e.target.closest("[data-act=delete]"); if (!b) return;
    if (!b.dataset.sure) { b.dataset.sure = 1; b.textContent = "Sure?"; setTimeout(() => { b.dataset.sure = ""; b.textContent = "Delete"; }, 3000); return; }   // two-tap confirm (no popups)
    try { await DB.adminDelete(current, b.closest("tr").dataset.id, token); toast("Deleted."); load(); } catch (err) { toast(err.message); }
  });

  gform.addEventListener("submit", async e => {
    e.preventDefault();
    const f = gform.elements, title = f.title.value.trim(), url = f.image_url.value.trim();
    if (!title || !/^https?:\/\/|^assets\//.test(url)) return toast("Add a title and an image link.");
    try { await DB.adminInsert("gallery_items", { title, category: f.category.value, medium: f.medium.value.trim() || null, year: f.year.value ? +f.year.value : null, image_url: url }, token); gform.reset(); toast("Added to the gallery."); load(); }
    catch (err) { toast(err.message); }
  });

  $("#export").onclick = () => {
    if (!rows.length) return toast("Nothing to export.");
    const keys = [...new Set(rows.flatMap(r => Object.keys(r)))], q = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [keys.join(","), ...rows.map(r => keys.map(c => q(r[c])).join(","))].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = current + ".csv"; a.click();
  };
  $("#clear").onclick = () => { if (DB.configured()) return toast("Delete rows from the table, or with the Delete buttons."); if (!$("#clear").dataset.sure) { $("#clear").dataset.sure = 1; $("#clear").textContent = "Tap again to clear"; setTimeout(() => { $("#clear").dataset.sure = ""; $("#clear").textContent = "Clear local"; }, 3000); return; } DB.clearLocal(current); toast("Cleared."); load(); };

  if (DB.configured()) {
    status.innerHTML = "Connected to <b>Supabase</b>. Sign in with the admin user you created in Supabase Auth.";
    login.style.display = "block"; $("#admin-main").style.display = "none";
    login.addEventListener("submit", async e => {
      e.preventDefault();
      try { token = await DB.signIn(login.email.value, login.password.value); login.style.display = "none"; $("#admin-main").style.display = "block"; load(); }
      catch (err) { toast(err.message); }
    });
  } else {
    status.innerHTML = "No database connected yet — showing entries saved <b>in this browser only</b>. Connect Supabase in <code>js/config.js</code> to collect them from every visitor.";
    login.style.display = "none"; load();
  }
})();
