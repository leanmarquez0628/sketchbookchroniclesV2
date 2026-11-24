/* Inline SVG icons (no external icon font needed) */
(function () {
  const wrap = (inner, vb = "0 0 24 24") => `<svg viewBox="${vb}" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  const txt = t => `<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><text x="12" y="17.5" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="900" font-size="${t.length > 1 ? 13 : 17}" fill="currentColor">${t}</text></svg>`;
  window.ICON = {
    instagram: wrap('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>'),
    youtube: wrap('<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l5-2.8z" fill="currentColor"/>'),
    tiktok: wrap('<path d="M14 3v11.2a3.7 3.7 0 1 1-3.7-3.7"/><path d="M14 3c.3 2.4 1.9 4 4.5 4.2"/>'),
    pinterest: txt("P"), facebook: txt("f"), threads: txt("@"), linkedin: txt("in")
  };
})();

/* contact icons */
Object.assign(window.ICON, {
  phone: '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.5z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"/></svg>',
  viber: '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-4 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M9 8.5c0 3 2.5 5.5 5.5 5.5l.8-1.3-1.8-1-.8.7a3.6 3.6 0 0 1-1.6-1.6l.7-.8-1-1.8z"/></svg>'
});
