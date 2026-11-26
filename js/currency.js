/* Currency display for the shop. Prices are stored and charged in Philippine pesos (PHP);
   other currencies are an estimate. Rates refresh from a free public API (cached 12 h)
   and fall back to the built-in approximate rates below if the visitor is offline. */
(function () {
  const LIST = [
    ["PHP", "Philippine peso (₱)"],
    ["USD", "US dollar"],
    ["SGD", "Singapore dollar"],
    ["EUR", "Euro"],
    ["CAD", "Canadian dollar"],
    ["GBP", "British pound"],
    ["AUD", "Australian dollar"],
    ["JPY", "Japanese yen"],
    ["AED", "UAE dirham"],
    ["HKD", "Hong Kong dollar"],
    ["SAR", "Saudi riyal"],
    ["KRW", "South Korean won"],
  ];
  /* approximate units of each currency per 1 PHP: used only when live rates cannot be loaded */
  const FALLBACK = {
    PHP: 1,
    USD: 0.017,
    SGD: 0.022,
    EUR: 0.015,
    CAD: 0.024,
    GBP: 0.013,
    AUD: 0.026,
    JPY: 2.6,
    AED: 0.063,
    HKD: 0.133,
    SAR: 0.064,
    KRW: 24,
  };
  const KEY = "sbc_cur",
    RK = "sbc_rates",
    MAX_AGE = 12 * 3600 * 1000;
  const lsGet = (k, d) => {
    try {
      const v = localStorage.getItem(k);
      return v == null ? d : JSON.parse(v);
    } catch (e) {
      return d;
    }
  };
  const lsSet = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  };

  let rates = Object.assign({}, FALLBACK),
    live = false,
    code = lsGet(KEY, "PHP");
  if (!LIST.some((c) => c[0] === code)) code = "PHP";
  const cached = lsGet(RK, null);
  if (cached && cached.rates && Date.now() - cached.t < MAX_AGE) {
    rates = Object.assign({}, FALLBACK, cached.rates);
    live = true;
  }

  async function refresh() {
    if (live) return false;
    const ctl = new AbortController(),
      t = setTimeout(() => ctl.abort(), 5000);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/PHP", {
        signal: ctl.signal,
      });
      const data = await res.json();
      if (data && data.rates && data.rates.USD) {
        const r = {};
        LIST.forEach(([c]) => {
          if (data.rates[c]) r[c] = data.rates[c];
        });
        rates = Object.assign({}, FALLBACK, r);
        live = true;
        lsSet(RK, { t: Date.now(), rates: r });
        return true;
      }
    } catch (e) {
      /* offline or blocked: keep the built-in rates */
    } finally {
      clearTimeout(t);
    }
    return false;
  }

  window.CUR = {
    list: LIST,
    code: () => code,
    set(c) {
      if (LIST.some((x) => x[0] === c)) {
        code = c;
        lsSet(KEY, c);
        try {
          window.dispatchEvent(new Event("sbc:cur"));
        } catch (e) {}
      }
    },
    rate: (c) => rates[c || code] || 1,
    isLive: () => live,
    refresh,
    /** format a peso amount in the chosen currency (no "≈") */
    fmt(php, c) {
      c = c || code;
      if (c === "PHP")
        return window.peso
          ? window.peso(php)
          : "₱" + Number(php).toLocaleString("en-PH");
      const v = php * (rates[c] || 1),
        d = c === "JPY" || c === "KRW" ? 0 : 2;
      try {
        return new Intl.NumberFormat("en", {
          style: "currency",
          currency: c,
          minimumFractionDigits: d,
          maximumFractionDigits: d,
        }).format(v);
      } catch (e) {
        return c + " " + v.toFixed(d);
      }
    },
  };
})();
