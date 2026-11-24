/* Fills social links / contact cards from js/config.js */
(function () {
  const S = SITE.social;
  const socials = $("#socials");
  if (socials) socials.innerHTML = ["instagram", "threads", "facebook", "tiktok", "linkedin"].filter(k => SITE.hasLink(k)).map(k =>
    `<a href="${S[k].url}" target="_blank" rel="noopener" aria-label="${S[k].label}">${ICON[k]}</a>`).join("");

  const list = $("#info-list");
  if (list) list.innerHTML =
    `<a class="info" href="tel:+${SITE.phoneDigits}"><small>${ICON.phone} Call / text</small><span>${SITE.phone}</span></a>` +
    `<a class="info" href="https://wa.me/${SITE.phoneDigits}" target="_blank" rel="noopener"><small>${ICON.whatsapp} WhatsApp</small><span>${SITE.phone}</span></a>` +
    `<a class="info" href="viber://chat?number=%2B${SITE.phoneDigits}"><small>${ICON.viber} Viber</small><span>${SITE.phone}</span></a>` +
    `<a class="info" href="mailto:${SITE.email}"><small>Email</small><span>${SITE.email}</span></a>` +
    ["instagram", "tiktok", "threads", "facebook"].filter(k => SITE.hasLink(k)).map(k =>
      `<a class="info" href="${S[k].url}" target="_blank" rel="noopener"><small>${ICON[k]} ${S[k].label}</small><span>${S[k].handle}</span></a>`).join("");

  const ig = $("#ig-link"), tt = $("#tt-link");
  if (ig) ig.href = S.instagram.url; if (tt) tt.href = S.tiktok.url;
})();
