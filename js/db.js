/* ==========================================================================
   Data layer
   - Supabase configured (js/config.js) -> reads/writes go to your Postgres database.
   - Not configured / offline            -> localStorage, so the site never breaks.
   Extras: request timeouts, retry "outbox" for submissions that failed to
   send, cached content reads, and a simple per-visitor rate limit.
   ========================================================================== */
(function () {
  const S = window.SITE;
  const configured = () => !!(S.supabaseUrl && S.supabaseKey);
  const base = () => S.supabaseUrl.replace(/\/$/, "") + "/rest/v1/";
  const TIMEOUT = 8000, CACHE_MS = 5 * 60 * 1000, COOLDOWN_MS = 15 * 1000;

  const headers = (extra, token) => Object.assign({
    apikey: S.supabaseKey,
    Authorization: "Bearer " + (token || S.supabaseKey),
    "Content-Type": "application/json"
  }, extra);

  /* fetch with a timeout so a slow network never freezes a form */
  async function http(url, opts) {
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), TIMEOUT);
    try { return await fetch(url, Object.assign({}, opts, { signal: ctl.signal })); }
    finally { clearTimeout(t); }
  }

  /* tiny storage helpers (never throw) */
  const store = (area) => ({
    get(k, d) { try { const v = area.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { area.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  });
  const LS = store(window.localStorage), SS = store(window.sessionStorage);
  const local = t => LS.get("sbc_" + t, []);
  const saveLocal = (t, rows) => LS.set("sbc_" + t, rows);

  /* ---- outbox: submissions that could not reach the database are retried later ---- */
  const outbox = { get: () => LS.get("sbc_outbox", []), set: v => LS.set("sbc_outbox", v) };
  async function flush() {
    if (!configured() || !navigator.onLine) return;
    const q = outbox.get(); if (!q.length) return;
    const left = [];
    for (const item of q) {
      try {
        const r = await http(base() + item.table, { method: "POST", headers: headers({ Prefer: "return=minimal" }), body: JSON.stringify(item.row) });
        if (!r.ok && r.status !== 409 && r.status >= 500) left.push(item);   // retry only server errors
      } catch (e) { left.push(item); }
    }
    outbox.set(left);
  }
  addEventListener("online", flush);

  /* ---- rate limit: one submission per table every few seconds ---- */
  function tooFast(table) {
    const k = "sbc_last_" + table, last = SS.get(k, 0);
    if (Date.now() - last < COOLDOWN_MS) return true;
    SS.set(k, Date.now()); return false;
  }

  const DB = {
    configured,

    /** Save a visitor submission (messages, orders, subscribers). */
    async insert(table, row) {
      if (tooFast(table)) return { ok: false, reason: "slow-down" };
      const record = Object.assign({}, row, { created_at: new Date().toISOString() });
      if (configured()) {
        try {
          const res = await http(base() + table, { method: "POST", headers: headers({ Prefer: "return=minimal" }), body: JSON.stringify(row) });
          if (res.ok) return { ok: true, mode: "database" };
          if (res.status === 409) return { ok: true, mode: "database", duplicate: true };
          if (res.status === 429 || (res.status === 400 && /rate/i.test(await res.clone().text()))) return { ok: false, reason: "slow-down" };
          console.warn("Supabase insert failed", res.status);
        } catch (e) { console.warn("Supabase unreachable — queued for retry", e); }
        outbox.set(outbox.get().concat({ table, row }));        // retry later
      }
      const rows = local(table); rows.unshift(Object.assign({ id: Date.now() }, record));
      return { ok: saveLocal(table, rows), mode: "local" };
    },

    /** Load site content (gallery_items, products). Cached briefly, falls back to SEED. */
    async list(table, order) {
      if (configured()) {
        const key = "sbc_cache_" + table + order, hit = SS.get(key);
        if (hit && Date.now() - hit.t < CACHE_MS) return hit.rows;
        try {
          const res = await http(base() + table + "?select=*" + (order ? "&order=" + order : ""), { headers: headers() });
          if (res.ok) { const rows = await res.json(); if (rows.length) { SS.set(key, { t: Date.now(), rows }); return rows; } }
        } catch (e) { console.warn("Supabase unreachable, using built-in content", e); }
      }
      return (window.SEED[table] || []).slice();
    },

    /* ---------------- admin ---------------- */
    local, clearLocal(t) { saveLocal(t, []); },
    async signIn(email, password) {
      const res = await http(S.supabaseUrl.replace(/\/$/, "") + "/auth/v1/token?grant_type=password", {
        method: "POST", headers: { apikey: S.supabaseKey, "Content-Type": "application/json" }, body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error("Wrong email or password");
      return (await res.json()).access_token;
    },
    async adminList(table, token) {
      const order = table === "products" ? "code.asc" : "created_at.desc";
      const res = await http(base() + table + "?select=*&order=" + order, { headers: headers({}, token) });
      if (!res.ok) throw new Error("Could not load " + table);
      return res.json();
    },
    async adminUpdate(table, id, patch, token) {
      const key = table === "products" ? "code" : "id";
      if (!token) { const rows = local(table).map(r => String(r[key]) === String(id) ? Object.assign(r, patch) : r); return saveLocal(table, rows); }
      const res = await http(base() + table + "?" + key + "=eq." + encodeURIComponent(id), { method: "PATCH", headers: headers({ Prefer: "return=minimal" }, token), body: JSON.stringify(patch) });
      if (!res.ok) throw new Error("Update failed (" + res.status + ")");
      return true;
    },
    async adminDelete(table, id, token) {
      const key = table === "products" ? "code" : "id";
      if (!token) return saveLocal(table, local(table).filter(r => String(r[key]) !== String(id)));
      const res = await http(base() + table + "?" + key + "=eq." + encodeURIComponent(id), { method: "DELETE", headers: headers({ Prefer: "return=minimal" }, token) });
      if (!res.ok) throw new Error("Delete failed (" + res.status + ")");
      return true;
    },
    async adminInsert(table, row, token) {
      const res = await http(base() + table, { method: "POST", headers: headers({ Prefer: "return=minimal" }, token), body: JSON.stringify(row) });
      if (!res.ok) throw new Error("Save failed (" + res.status + ")");
      return true;
    },
    flush
  };
  window.DB = DB;
  flush();   // try sending anything that was queued earlier
})();
