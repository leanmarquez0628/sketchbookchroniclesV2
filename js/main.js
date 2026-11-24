/* Shared behaviour: theme, mobile menu, reveal-on-scroll, typed text, toast, newsletter */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  window.$ = $; window.$$ = $$;

  /* ---- toast ---- */
  let toastTimer;
  window.toast = function (msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 4200);
  };

  /* ---- modal helpers ---- */
  window.openModal = el => { el.classList.add("open"); document.body.style.overflow = "hidden"; };
  window.closeModal = el => { el.classList.remove("open"); document.body.style.overflow = ""; };
  document.addEventListener("click", e => {
    const m = e.target.closest(".modal, .lightbox");
    if (m && (e.target === m || e.target.closest("[data-close]"))) closeModal(m);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") $$(".modal.open, .lightbox.open").forEach(closeModal); });

  /* ---- theme ---- */
  const root = document.documentElement;
  const setTheme = t => { root.setAttribute("data-theme", t); try { localStorage.setItem("sbc_theme", t); } catch (e) {} };
  $$(".theme").forEach(b => b.addEventListener("click", () => setTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light")));

  /* ---- mobile menu ---- */
  const burger = $(".burger"), panel = $(".mobile-panel");
  if (burger && panel) {
    burger.addEventListener("click", () => { const o = panel.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
    panel.addEventListener("click", e => { if (e.target.closest("a")) panel.classList.remove("open"); });
  }

  /* ---- reveal (never leave content hidden) ---- */
  const rv = $$(".rv");
  const showAll = () => rv.forEach(el => el.classList.add("in"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    rv.forEach(el => io.observe(el));
    setTimeout(showAll, 4000);               // safety net: if the observer never fires, show everything
  } else showAll();

  /* ---- navigation: solid when scrolled, tucks away while reading down, returns on scroll up ---- */
  (function () {
    const shell = $(".nav-shell"), nav = $(".nav"); if (!shell || !nav) return;
    let last = scrollY, tick = false;
    const upd = () => {
      const y = scrollY, menuOpen = $(".mobile-panel.open");
      nav.classList.toggle("scrolled", y > 24);
      shell.classList.toggle("hide", y > 160 && y > last + 4 && !menuOpen);
      if (y < last - 4 || y < 160) shell.classList.remove("hide");
      last = y; tick = false;
    };
    addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    nav.addEventListener("focusin", () => shell.classList.remove("hide"));
  })();

  /* ---- ghost word parallax ---- */
  const ghost = $(".hero .ghost-word");
  if (ghost && !matchMedia("(prefers-reduced-motion: reduce)").matches)
    addEventListener("scroll", () => { ghost.style.transform = `translate(${-scrollY * .12}px, -50%)`; }, { passive: true });

  /* ---- typed text ---- */
  const typed = $("[data-typed]");
  if (typed) {
    const words = typed.dataset.typed.split("|"); let w = 0, i = 0, del = false;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) typed.textContent = words[0];
    else (function tick() {
      const word = words[w];
      typed.textContent = word.slice(0, i);
      if (!del && i === word.length) { del = true; return setTimeout(tick, 1400); }
      if (del && i === 0) { del = false; w = (w + 1) % words.length; }
      i += del ? -1 : 1; setTimeout(tick, del ? 45 : 95);
    })();
  }

  /* ---- newsletter (footer) ---- */
  const nf = $("#newsletter");
  if (nf) nf.addEventListener("submit", async e => {
    e.preventDefault();
    if (isBot(nf)) { nf.reset(); return toast("Thanks for subscribing!"); }
    const email = nf.email.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast("Please enter a valid email address.");
    const r = await DB.insert("subscribers", { email });
    nf.reset();
    toast(r.ok ? "Thanks for subscribing!" : sendMsg(r));
  });

  /* ---- spam trap: a hidden field humans never fill in ---- */
  $$("#contact-form, #order-form, #newsletter").forEach(f => {
    const w = document.createElement("div"); w.className = "hp"; w.setAttribute("aria-hidden", "true");
    w.innerHTML = '<label>Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label>'; f.appendChild(w);
  });
  window.isBot = f => !!(f && f.elements.website && f.elements.website.value);
  window.sendMsg = r => r && r.reason === "slow-down" ? "Please wait a few seconds before sending again." : "Sorry, something went wrong. Please try again.";

  /* ---- footer year ---- */
  $$(".yr").forEach(n => n.textContent = new Date().getFullYear());
})();

/* escape helper used by renderers */
window.esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
window.peso = n => "₱" + Number(n).toLocaleString("en-PH");

/* Hero ghost name: letters rise in, then a colour wave loops through "MIGUEL MARQUEZ" */
(function () {
  const g = document.querySelector(".hero .ghost-word"); if (!g) return;
  const lines = g.innerHTML.split(/<br\s*\/?>/i); let n = 0;
  g.setAttribute("aria-label", lines.join(" ")); 
  g.innerHTML = lines.map(l => `<span class="gl">${[...l].map(c => `<span class="gc" style="--i:${n++}">${c}</span>`).join("")}</span>`).join("");
})();

/* Pictures that fail to load: retry once (cache-busted), then show a tidy placeholder instead of a broken icon */
document.addEventListener("error", e => {
  const img = e.target;
  if (!img || img.tagName !== "IMG" || img.dataset.fb === "done" || img.id === "lb-img") return;
  if (!img.dataset.fb) {
    img.dataset.fb = "retry";
    const u = img.getAttribute("src") || "";
    if (u && !/^data:/.test(u)) { img.src = u + (u.includes("?") ? "&" : "?") + "r=" + Date.now(); return; }
  }
  img.dataset.fb = "done";
  const box = document.createElement("span");
  box.className = "img-fallback"; box.setAttribute("role", "img"); box.setAttribute("aria-label", img.alt || "Picture unavailable");
  box.textContent = "LM.";
  img.replaceWith(box);
}, true);
