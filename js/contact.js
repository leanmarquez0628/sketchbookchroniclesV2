/* Contact: validation, live email preview, save to database, open default mail app */
(function () {
  const form = $("#contact-form"); if (!form) return;
  const preview = $("#preview"), pre = $("#preview-text"), tog = $("#toggle-prev");
  const val = n => form[n].value.trim();

  function compose() {
    const name = `${val("first_name")} ${val("last_name")}`.trim() || "[your name]";
    const subject = val("subject") || `Inquiry from ${name}`;
    const body = `Hi Miguel,\n\n${val("message") || "[your message]"}\n\nThanks,\n${name}\n${val("email") || "[your email]"}`;
    return { subject, body };
  }
  function refresh() {
    const { subject, body } = compose();
    pre.textContent = `To: ${SITE.email}\nSubject: ${subject}\n\n${body}`;
  }
  tog.addEventListener("click", () => { preview.classList.toggle("show"); tog.textContent = preview.classList.contains("show") ? "Hide email preview" : "Preview my email"; refresh(); });
  form.addEventListener("input", refresh);

  $("#copy-mail").addEventListener("click", async () => {
    refresh();
    try { await navigator.clipboard.writeText(pre.textContent); toast("Email text copied."); } catch (e) { toast("Select the text and copy it manually."); }
  });
  $("#open-mail").addEventListener("click", () => { const c = compose(); location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.body)}`; });

  // prefill from ?subject=...
  const qs = new URLSearchParams(location.search);
  if (qs.get("subject")) form.subject.value = qs.get("subject");

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (isBot(form)) { form.reset(); return toast("Message saved!"); }
    let ok = true;
    $$(".field", form).forEach(f => {
      const i = $("input,textarea", f); if (!i) return;
      const v = i.value.trim();
      const bad = (i.required && !v) || (i.type === "email" && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));
      f.classList.toggle("bad", bad); if (bad) ok = false;
    });
    if (!ok) { toast("Please fill in the required fields."); return $(".bad input, .bad textarea", form).focus(); }
    const btn = $("button[type=submit]", form); btn.disabled = true; btn.textContent = "Sending…";
    const row = { first_name: val("first_name"), last_name: val("last_name"), email: val("email"), subject: val("subject"), message: val("message") };
    const r = await DB.insert("messages", row);
    btn.disabled = false; btn.textContent = "Submit";
    if (!r.ok) return toast(r.reason === "slow-down" ? sendMsg(r) : "Could not save your message. Please use the email button below.");
    const c = compose();
    toast(r.mode === "database" ? "Message received! If your email app does not open, copy the email below and send it to " + SITE.email : "Almost done: please send the email that opens (or copy the text below) to " + SITE.email + " so I get your message.");
    preview.classList.add("show"); refresh();
    setTimeout(() => { location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.body)}`; }, 900);
    form.reset();
  });
})();
