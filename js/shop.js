/* Shop: paged poster cards, framed/print + size options, order modal -> database + email */
(async function () {
  const wrap = $("#shop-grid"), label = $("#shop-label"), prev = $("#s-prev"), next = $("#s-next");
  const products = await DB.list("products", "code.asc");
  const SIZES = { a5: "A5 (5.8 × 8.3 in)", a4: "A4 (8.3 × 11.7 in)", a3: "A3 (11.7 × 16.5 in)" };
  const DIM = { a5: "5.8 × 8.3", a4: "8.3 × 11.7", a3: "11.7 × 16.5" }, FRAME = { a5: "6 × 8", a4: "9 × 12", a3: "12 × 17" };
  const perPage = () => innerWidth > 1000 ? 4 : innerWidth > 560 ? 2 : 1;
  let page = 0;

  const price = (p, v, s) => p[(v === "framed" ? "framed_" : "print_") + s];
  const codeOf = (p, v, s) => `${p.code}-${v === "framed" ? "FR" : "PR"}-${s.toUpperCase()}`;
  const detail = (p, v, s) => v === "framed"
    ? `<b>Framed poster</b><br>${s.toUpperCase()} print, ${DIM[s]} in<br>Frame ${FRAME[s]} in`
    : `<b>Print only</b><br>${s.toUpperCase()} print, ${DIM[s]} in<br>Ships rolled in a tube`;

  function card(p) {
    return `<article class="product" data-code="${esc(p.code)}">
      <div class="pic"><span class="code">${esc(p.code)}</span><img src="${esc(p.image_url)}" alt="${esc(p.name)} poster" loading="lazy" decoding="async"></div>
      <h3>${esc(p.name)}</h3>
      <select class="v" aria-label="Format"><option value="framed">Framed poster</option><option value="print">Print only</option></select>
      <select class="s" aria-label="Size"><option value="a5">${SIZES.a5}</option><option value="a4" selected>${SIZES.a4}</option><option value="a3">${SIZES.a3}</option></select>
      <div class="meta"></div>
      <div class="buy"><strong class="pr"></strong><button class="btn sm ghost order" type="button">Order</button></div></article>`;
  }
  function sync(el) {
    const p = products.find(x => x.code === el.dataset.code), v = $(".v", el).value, s = $(".s", el).value;
    $(".meta", el).innerHTML = `${detail(p, v, s)}<br>Code: <b>${codeOf(p, v, s)}</b>`;
    $(".pr", el).textContent = peso(price(p, v, s));
  }
  function render() {
    const n = perPage(), pages = Math.ceil(products.length / n); page = Math.min(page, pages - 1);
    wrap.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    wrap.innerHTML = products.slice(page * n, page * n + n).map(card).join("");
    $$(".product", wrap).forEach(sync);
    label.textContent = `Slide ${page + 1} / ${pages}`; prev.disabled = page === 0; next.disabled = page >= pages - 1;
  }
  wrap.addEventListener("change", e => { const el = e.target.closest(".product"); if (el) sync(el); });
  prev.onclick = () => { page--; render(); }; next.onclick = () => { page++; render(); };
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(render, 150); });
  render();

  /* ---- order modal ---- */
  const modal = $("#order-modal"), form = $("#order-form"), sum = $("#order-summary");
  let order = null;
  const qty = $("#o-qty"), totalEl = $("#o-total"), payInfo = $("#pay-info");
  const getQty = () => Math.min(20, Math.max(1, parseInt(qty.value, 10) || 1));
  const updateTotal = () => { totalEl.textContent = order ? peso(order.price * getQty()) : ""; };
  $("#q-minus").onclick = () => { qty.value = Math.max(1, getQty() - 1); updateTotal(); };
  $("#q-plus").onclick = () => { qty.value = Math.min(20, getQty() + 1); updateTotal(); };
  qty.addEventListener("input", updateTotal);
  qty.addEventListener("blur", () => { qty.value = getQty(); updateTotal(); });
  const PAY = SITE.payment || {};
  const method = () => (form.querySelector("input[name=payment_method]:checked") || {}).value || "GCash";
  const copyBtn = v => `<button type="button" class="copy" data-copy="${esc(v)}" aria-label="Copy ${esc(v)}">Copy</button>`;
  /* returns [[label, value], …] or null when you haven't filled in that method in js/config.js */
  function payRows(m) {
    const c = m === "GCash" ? PAY.gcash : m === "Maya" ? PAY.maya : PAY.bank; if (!c || !c.number) return null;
    return (m === "Bank transfer" ? [["Bank", c.bank], ["Account name", c.name], ["Account number", c.number]] : [["Account name", c.name], [m + " number", c.number]]).filter(r => r[1]);
  }
  function payHtml(m) {
    const rows = payRows(m);
    return rows
      ? `<b>${esc(m)} details</b><dl class="pay-rows">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}${/number/i.test(k) ? copyBtn(v) : ""}</dd></div>`).join("")}</dl>`
      : `<b>${esc(m)}</b><br><small>I'll send my ${esc(m)} account details by email once I confirm availability and shipping. Please don't pay before then.</small>`;
  }
  function showPay() {
    payInfo.innerHTML = payHtml(method()) + (payRows(method()) ? `<small>Send your payment after I confirm availability, then reply with your order reference and the receipt.</small>` : "");
  }
  const newRef = () => {
    const d = new Date(), pad = n => String(n).padStart(2, "0"), A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let r = ""; for (let i = 0; i < 4; i++) r += A[Math.floor(Math.random() * A.length)];
    return `SBC-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${r}`;
  };
  const done = $("#order-done"), title = $("#order-title"), subEl = $("#order-sub");
  const copyText = async v => { try { await navigator.clipboard.writeText(v); toast("Copied."); } catch (e) { toast("Select the text and copy it manually."); } };
  modal.addEventListener("click", e => { const b = e.target.closest("[data-copy]"); if (b) copyText(b.dataset.copy); });
  form.addEventListener("change", e => { if (e.target.name === "payment_method") showPay(); });
  wrap.addEventListener("click", e => {
    const b = e.target.closest(".order"); if (!b) return;
    const el = b.closest(".product"), p = products.find(x => x.code === el.dataset.code), v = $(".v", el).value, s = $(".s", el).value;
    order = { product_code: codeOf(p, v, s), product_name: p.name, variant: v === "framed" ? "Framed poster" : "Print only", size: s.toUpperCase(), price: price(p, v, s) };
    sum.innerHTML = `<b>${esc(p.name)}</b><br>${order.variant} · ${order.size}<br>Code: ${esc(order.product_code)}<br>Price each: <b>${peso(order.price)}</b> <small>(shipping quoted by email)</small>`;
    form.hidden = false; sum.hidden = false; done.hidden = true; title.textContent = "Place an order"; subEl.hidden = false;
    qty.value = 1; updateTotal(); showPay();
    openModal(modal); setTimeout(() => form.customer_name.focus(), 50);
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (isBot(form)) { closeModal(modal); form.reset(); return toast("Order received!"); }
    let ok = true;
    $$(".field", form).forEach(f => {
      const i = $("input,textarea", f); if (!i) return;
      const bad = i.required && !i.value.trim() || (i.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value.trim()));
      f.classList.toggle("bad", bad); if (bad) ok = false;
    });
    if (!ok) return;
    const ref = newRef(), note = form.note.value.trim();
    const row = Object.assign({}, order, { customer_name: form.customer_name.value.trim(), email: form.email.value.trim(), phone: form.phone.value.trim(), note: `[${ref}]${note ? " " + note : ""}`.slice(0, 2000), quantity: getQty(), total: order.price * getQty(), payment_method: method() });
    const btn = $("button[type=submit]", form); btn.disabled = true;
    const r = await DB.insert("orders", row); btn.disabled = false;
    if (!r.ok) return toast(r.reason === "slow-down" ? sendMsg(r) : "Could not save your order. Please email me directly.");
    const body = `Hi Miguel,\n\nI'd like to order:\nOrder reference: ${ref}\n${order.product_name}\n${order.variant} · ${order.size}\nCode: ${order.product_code}\nPrice each: ${peso(order.price)}\nQuantity: ${row.quantity}\nTotal: ${peso(row.total)} (shipping to be quoted)\nPayment method: ${row.payment_method}\n\nName: ${row.customer_name}\nEmail: ${row.email}\nPhone: ${row.phone || "-"}\nNotes: ${note || "-"}\n\nThank you!`;
    const mail = `mailto:${SITE.email}?subject=${encodeURIComponent("Order " + ref + " · " + order.product_code)}&body=${encodeURIComponent(body)}`;
    const saved = r.mode === "database";
    title.textContent = saved ? "Order received" : "One more step"; subEl.hidden = true; sum.hidden = true; form.hidden = true;
    done.innerHTML = `<div class="ref"><small>Your order reference</small><b>${esc(ref)}</b>${copyBtn(ref)}</div>
      <p class="od-line"><b>${esc(order.product_name)}</b> · ${esc(order.variant)} · ${esc(order.size)} × ${row.quantity}<br>Total <b>${peso(row.total)}</b> <small>(shipping quoted by email)</small></p>
      <ol class="od-steps">
        <li>${saved ? "Tap <b>Send order email</b> so I get your details right away." : "Tap <b>Send order email</b>. This is what delivers your order to me."}</li>
        <li>${payRows(row.payment_method) ? "I'll reply to confirm availability and shipping." : `I'll reply to confirm availability and shipping, and send my <b>${esc(row.payment_method)}</b> account details.`}</li>
        <li>Then pay by <b>${esc(row.payment_method)}</b> and reply with your reference <b>${esc(ref)}</b> and the receipt.</li>
      </ol>
      <div class="pay-info">${payHtml(row.payment_method)}</div>
      <a class="btn block" href="${mail}">Send order email</a>
      <button type="button" class="btn ghost block" data-close style="margin-top:10px">Close</button>`;
    done.hidden = false; form.reset(); toast(saved ? "Order received!" : "Please send the order email to finish.");
  });
})();
