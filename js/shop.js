/* Shop: paged poster cards, framed/print + size options, currency display, order modal -> database + email */
(async function () {
  const wrap = $("#shop-grid"),
    label = $("#shop-label"),
    prev = $("#s-prev"),
    next = $("#s-next");
  const good = (r) =>
    r &&
    r.code &&
    r.image_url &&
    [
      "framed_a5",
      "framed_a4",
      "framed_a3",
      "framed_a2",
      "print_a5",
      "print_a4",
      "print_a3",
      "print_a2",
    ].every((k) => Number(r[k]) > 0);
  let products = ((await DB.list("products", "code.asc")) || []).filter(good);
  if (!products.length)
    products = ((window.SEED && SEED.products) || []).filter(good); // never show an empty or broken shop
  const SIZES = {
    a5: "A5 (5.8 × 8.3 in)",
    a4: "A4 (8.3 × 11.7 in)",
    a3: "A3 (11.7 × 16.5 in)",
    a2: "A2 (16.5 × 23.4 in)",
  };
  const DIM = {
      a5: "5.8 × 8.3",
      a4: "8.3 × 11.7",
      a3: "11.7 × 16.5",
      a2: "16.5 × 23.4",
    },
    FRAME = { a5: "6 × 8", a4: "9 × 12", a3: "12 × 17", a2: "18 × 24" };
  const perPage = () => (innerWidth > 1000 ? 4 : innerWidth > 560 ? 2 : 1);
  let page = 0;

  const price = (p, v, s) => p[(v === "framed" ? "framed_" : "print_") + s];
  const inPhp = () => CUR.code() === "PHP";
  const approx = (php) => `≈ ${CUR.fmt(php)}`;
  const priceHtml = (php) =>
    inPhp() ? peso(php) : `${approx(php)}<small>${peso(php)}</small>`;
  const codeOf = (p, v, s) =>
    `${p.code}-${v === "framed" ? "FR" : "PR"}-${s.toUpperCase()}`;
  const detail = (p, v, s) =>
    v === "framed"
      ? `<b>Framed poster</b><br>${s.toUpperCase()} print, ${DIM[s]} in<br>Frame ${FRAME[s]} in`
      : `<b>Print only</b><br>${s.toUpperCase()} print, ${DIM[s]} in<br>Ships rolled in a tube`;

  function card(p) {
    const safeCode = esc(p.code).replace(/[^a-zA-Z0-9_-]/g, "-");
    return `<article class="product" data-code="${esc(p.code)}">
      <div class="pic"><span class="code">${esc(p.code)}</span><img src="${esc(p.image_url)}" alt="${esc(p.name)} poster" width="600" height="800" loading="eager" decoding="async"></div>
      <h3>${esc(p.name)}</h3>
      <select class="v" id="format-${safeCode}" name="format-${safeCode}" aria-label="Format" autocomplete="off"><option value="framed">Framed poster</option><option value="print">Print only</option></select>
      <select class="s" id="size-${safeCode}" name="size-${safeCode}" aria-label="Size" autocomplete="off"><option value="a5">${SIZES.a5}</option><option value="a4" selected>${SIZES.a4}</option><option value="a3">${SIZES.a3}</option><option value="a2">${SIZES.a2}</option></select>
      <div class="meta"></div>
      <div class="buy"><strong class="pr"></strong><button class="btn sm ghost order" type="button">Order</button></div></article>`;
  }
  function sync(el) {
    const p = products.find((x) => x.code === el.dataset.code),
      v = $(".v", el).value,
      s = $(".s", el).value;
    $(".meta", el).innerHTML =
      `${detail(p, v, s)}<br>Code: <b>${codeOf(p, v, s)}</b>`;
    $(".pr", el).innerHTML = priceHtml(price(p, v, s));
  }
  function render() {
    const n = perPage(),
      pages = Math.ceil(products.length / n);
    page = Math.min(page, pages - 1);
    wrap.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    wrap.innerHTML = products
      .slice(page * n, page * n + n)
      .map(card)
      .join("");
    $$(".product", wrap).forEach(sync);
    label.textContent = `Slide ${page + 1} / ${pages}`;
    prev.disabled = page === 0;
    next.disabled = page >= pages - 1;
  }
  wrap.addEventListener("change", (e) => {
    const el = e.target.closest(".product");
    if (el) sync(el);
  });
  prev.onclick = () => {
    page--;
    render();
  };
  next.onclick = () => {
    page++;
    render();
  };
  let rt;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(render, 150);
  });
  render();

  /* ---- currency picker ---- */
  const curSel = $("#cur"),
    curNote = $("#cur-note");
  curSel.innerHTML = CUR.list
    .map(
      ([c, n]) =>
        `<option value="${c}"${c === CUR.code() ? " selected" : ""}>${c} · ${esc(n)}</option>`,
    )
    .join("");
  function curText() {
    curNote.textContent = inPhp()
      ? ""
      : `Estimated${CUR.isLive() ? " at today's rate" : ""} (₱100 ≈ ${CUR.fmt(100)}). You pay in Philippine pesos; the final amount is confirmed by email.`;
  }
  curSel.addEventListener("change", () => CUR.set(curSel.value));
  addEventListener("sbc:cur", () => {
    curSel.value = CUR.code();
    curText();
    render();
    if (modal.classList.contains("open")) {
      updateTotal();
      showPay();
    }
  });
  curText();
  CUR.refresh().then((ok) => {
    if (ok) {
      curText();
      render();
    }
  });

  /* ---- order modal ---- */
  const modal = $("#order-modal"),
    form = $("#order-form"),
    sum = $("#order-summary");
  let order = null;
  const qty = $("#o-qty"),
    totalEl = $("#o-total"),
    payInfo = $("#pay-info");
  const getQty = () => Math.min(20, Math.max(1, parseInt(qty.value, 10) || 1));
  const curWarn = $("#o-cur-note");
  const totalHtml = (php) =>
    inPhp() ? peso(php) : `${peso(php)} <small>(${approx(php)})</small>`;
  const updateTotal = () => {
    totalEl.innerHTML = order ? totalHtml(order.price * getQty()) : "";
    curWarn.hidden = inPhp();
    if (!inPhp())
      curWarn.textContent = `Prices are charged in Philippine pesos (₱). The ${CUR.code()} amount is only an estimate, and I'll confirm the final amount by email.`;
  };
  $("#q-minus").onclick = () => {
    qty.value = Math.max(1, getQty() - 1);
    updateTotal();
  };
  $("#q-plus").onclick = () => {
    qty.value = Math.min(20, getQty() + 1);
    updateTotal();
  };
  qty.addEventListener("input", updateTotal);
  qty.addEventListener("blur", () => {
    qty.value = getQty();
    updateTotal();
  });
  const PAY = SITE.payment || {};
  const method = () =>
    (form.querySelector("input[name=payment_method]:checked") || {}).value ||
    "GCash";
  const copyBtn = (v) =>
    `<button type="button" class="copy" data-copy="${esc(v)}" aria-label="Copy ${esc(v)}">Copy</button>`;
  /* Banks you receive money in (js/config.js): payment.banks = [{bank,name,number}, …]; the old single payment.bank still works. */
  const COMMON_BANKS = [
    "BDO",
    "Metrobank",
    "GoTyme",
    "UnionBank",
    "Other bank",
  ];
  const myBanks = () =>
    (Array.isArray(PAY.banks) && PAY.banks.length
      ? PAY.banks
      : PAY.bank
        ? [PAY.bank]
        : []
    ).filter((b) => b && b.number);
  const bankSel = $("#o-bank"),
    bankBox = $("#bank-pick"),
    bankLabel = $("#o-bank-label");
  const bankName = () => (bankSel.value || "").trim();
  function setupBanks() {
    const mine = myBanks();
    bankSel.innerHTML = (
      mine.length ? mine.map((b) => b.bank || "Bank") : COMMON_BANKS
    )
      .map((n) => `<option>${esc(n)}</option>`)
      .join("");
    bankLabel.textContent = mine.length
      ? "Send to this bank"
      : "Which bank will you use?";
    bankBox.hidden = method() !== "Bank transfer" || mine.length === 1;
  }
  /* returns [[label, value], …] or null when you haven't filled in that method in js/config.js */
  function payRows(m) {
    if (m === "Bank transfer") {
      const mine = myBanks();
      if (!mine.length) return null;
      const c = mine.find((b) => (b.bank || "Bank") === bankName()) || mine[0];
      return [
        ["Bank", c.bank],
        ["Account name", c.name],
        ["Account number", c.number],
      ].filter((r) => r[1]);
    }
    const c = m === "GCash" ? PAY.gcash : PAY.maya;
    if (!c || !c.number) return null;
    return [
      ["Account name", c.name],
      [m + " number", c.number],
    ].filter((r) => r[1]);
  }
  function payHtml(m) {
    const rows = payRows(m);
    return rows
      ? `<b>${esc(m)} details</b><dl class="pay-rows">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}${/number/i.test(k) ? copyBtn(v) : ""}</dd></div>`).join("")}</dl>`
      : `<b>${esc(m)}${m === "Bank transfer" && bankName() ? " · " + esc(bankName()) : ""}</b><br><small>I'll send my ${esc(m === "Bank transfer" && bankName() ? bankName() : m)} account details by email once I confirm availability and shipping. Please don't pay before then.</small>`;
  }
  function showPay() {
    setupBankVisibility();
    payInfo.innerHTML =
      payHtml(method()) +
      (payRows(method())
        ? `<small>Send your payment after I confirm availability, then reply with your order reference and the receipt.</small>`
        : "");
  }
  function setupBankVisibility() {
    bankBox.hidden = method() !== "Bank transfer" || myBanks().length === 1;
  }
  setupBanks();
  bankSel.addEventListener("change", showPay);
  const newRef = () => {
    const d = new Date(),
      pad = (n) => String(n).padStart(2, "0"),
      A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const rnd = new Uint32Array(6);
    (window.crypto || window.msCrypto).getRandomValues(rnd);
    let r = "";
    for (let i = 0; i < 6; i++) r += A[rnd[i] % A.length];
    return `SBC-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${r}`;
  };
  const done = $("#order-done"),
    title = $("#order-title"),
    subEl = $("#order-sub");
  const copyText = async (v) => {
    try {
      await navigator.clipboard.writeText(v);
      toast("Copied.");
    } catch (e) {
      toast("Select the text and copy it manually.");
    }
  };
  modal.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (b) copyText(b.dataset.copy);
  });
  form.addEventListener("change", (e) => {
    if (e.target.name === "payment_method") showPay();
  });
  wrap.addEventListener("click", (e) => {
    const b = e.target.closest(".order");
    if (!b) return;
    const el = b.closest(".product"),
      p = products.find((x) => x.code === el.dataset.code),
      v = $(".v", el).value,
      s = $(".s", el).value;
    order = {
      product_code: codeOf(p, v, s),
      product_name: p.name,
      variant: v === "framed" ? "Framed poster" : "Print only",
      size: s.toUpperCase(),
      price: price(p, v, s),
    };
    sum.innerHTML = `<b>${esc(p.name)}</b><br>${order.variant} · ${order.size}<br>Code: ${esc(order.product_code)}<br>Price each: <b>${peso(order.price)}</b>${inPhp() ? "" : ` <small>(${approx(order.price)})</small>`} <small>(shipping quoted by email)</small>`;
    form.hidden = false;
    sum.hidden = false;
    done.hidden = true;
    title.textContent = "Place an order";
    subEl.hidden = false;
    qty.value = 1;
    updateTotal();
    showPay();
    openModal(modal);
    setTimeout(() => form.customer_name.focus(), 50);
  });

  let sending = false; // blocks double-submit (double tap = duplicate order)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isBot(form)) {
      closeModal(modal);
      form.reset();
      return toast("Order received!");
    }
    let ok = true;
    $$(".field", form).forEach((f) => {
      const i = $("input,textarea", f);
      if (!i) return;
      const bad =
        (i.required && !i.value.trim()) ||
        (i.type === "email" &&
          !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value.trim()));
      f.classList.toggle("bad", bad);
      if (bad) ok = false;
    });
    if (!ok || sending) return;
    sending = true;
    const ref = newRef(),
      note = form.note.value.trim();
    const bank = method() === "Bank transfer" ? bankName() : "";
    const tags = [
      bank && `Bank: ${bank}`,
      !inPhp() && `Currency: ${approx(order.price * getQty())} (estimate)`,
    ]
      .filter(Boolean)
      .map((t) => `[${t}]`)
      .join(" ");
    const row = Object.assign({}, order, {
      customer_name: form.customer_name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      note: `[${ref}]${tags ? " " + tags : ""}${note ? " " + note : ""}`.slice(
        0,
        2000,
      ),
      quantity: getQty(),
      total: order.price * getQty(),
      payment_method: method(),
    });
    const btn = $("button[type=submit]", form);
    btn.disabled = true;
    const r = await DB.insert("orders", row);
    btn.disabled = false;
    sending = false;
    if (!r.ok)
      return toast(
        r.reason === "slow-down"
          ? sendMsg(r)
          : "Could not save your order. Please email me directly.",
      );
    const body = `Hi Miguel,\n\nI'd like to order:\nOrder reference: ${ref}\n${order.product_name}\n${order.variant} · ${order.size}\nCode: ${order.product_code}\nPrice each: ${peso(order.price)}\nQuantity: ${row.quantity}\nTotal: ${peso(row.total)} (shipping to be quoted)\nPayment method: ${row.payment_method}${bank ? " (" + bank + ")" : ""}\n${inPhp() ? "" : `Preferred currency: ${CUR.code()} (${approx(row.total)}, estimate)\n`}\nName: ${row.customer_name}\nEmail: ${row.email}\nPhone: ${row.phone || "-"}\nNotes: ${note || "-"}\n\nThank you!`;
    const mail = `mailto:${SITE.email}?subject=${encodeURIComponent("Order " + ref + " · " + order.product_code)}&body=${encodeURIComponent(body)}`;
    const saved = r.mode === "database";
    title.textContent = saved ? "Order received" : "One more step";
    subEl.hidden = true;
    sum.hidden = true;
    form.hidden = true;
    done.innerHTML = `<div class="ref"><small>Your order reference</small><b>${esc(ref)}</b>${copyBtn(ref)}</div>
      <p class="od-line"><b>${esc(order.product_name)}</b> · ${esc(order.variant)} · ${esc(order.size)} × ${row.quantity}<br>Total <b>${peso(row.total)}</b>${inPhp() ? "" : ` <small>(${approx(row.total)})</small>`} <small>(shipping quoted by email)</small></p>
      <ol class="od-steps">
        <li>${saved ? "Tap <b>Send order email</b> so I get your details right away." : "Tap <b>Send order email</b>. This is what delivers your order to me."}</li>
        <li>${payRows(row.payment_method) ? "I'll reply to confirm availability and shipping." : `I'll reply to confirm availability and shipping, and send my <b>${esc(bank || row.payment_method)}</b> account details.`}</li>
        <li>Then pay by <b>${esc(row.payment_method)}${bank ? " · " + esc(bank) : ""}</b>${inPhp() ? "" : " in Philippine pesos"} and reply with your reference <b>${esc(ref)}</b> and the receipt.</li>
      </ol>
      <div class="pay-info">${payHtml(row.payment_method)}</div>
      <p class="od-warn"><small><b>Stay safe:</b> only pay to the account details I send you from <b>${esc(SITE.email)}</b>. I will never ask you to pay anyone else or through a link. The final amount is confirmed by me before you pay.</small></p>
      <a class="btn block" href="${mail}">Send order email</a>
      <button type="button" class="btn ghost block" data-close style="margin-top:10px">Close</button>`;
    done.hidden = false;
    form.reset();
    toast(saved ? "Order received!" : "Please send the order email to finish.");
  });
})();
