/* ==========================================================================
   SITE SETTINGS — edit this file, nothing else needed for basic changes
   ========================================================================== */
window.SITE = {
  name: "The Sketchbook Chronicles",
  owner: "Lean Miguel Marquez",
  email: "leanmarquez0628@yahoo.com",
  phone: "+63 921 358 4345",
  location: "Metro Manila, Philippines",
  // Same number for calls, WhatsApp and Viber (digits only, with country code)
  phoneDigits: "639213584345",

  // Payment details shown in the order form. Fill in your own; anything left
  // empty falls back to "I'll send the payment details after I confirm your order".
  payment: {
    gcash: { name: "Lean Miguel Marquez", number: "09958143364" },
    maya:  { name: "Lean Miguel Marquez", number: "09213584345" },
    bank:  { bank: "BDO", name: "Lean Miguel Marquez", number: "013370120539" }
  },

  // Update these to your exact profile links.
  social: {
    instagram: { label: "Instagram", handle: "@lnmglmrqz", url: "https://www.instagram.com/lnmglmrqz/",  icon: "fa-instagram" },
    tiktok:    { label: "TikTok",    handle: "@lnmglmrq",  url: "https://www.tiktok.com/@lnmglmrq",      icon: "fa-tiktok" },
    pinterest: { label: "Pinterest", handle: "@lnmglmrqz", url: "https://www.pinterest.com/lnmglmrqz/",  icon: "fa-pinterest" },
    facebook:  { label: "Facebook",  handle: "Miguel Marquez", url: "https://www.facebook.com/lnmglmrq", icon: "fa-facebook-f" },
    threads:   { label: "Threads",   handle: "@lnmglmrqz", url: "https://www.threads.net/@lnmglmrqz",    icon: "fa-threads" },
    youtube:   { label: "YouTube",   handle: "lnmglmrqz",  url: "https://www.youtube.com/@lnmglmrqz",    icon: "fa-youtube" },
    linkedin:  { label: "LinkedIn",  handle: "lean-miguel-marquez", url: "https://www.linkedin.com/in/lean-miguel-marquez", icon: "fa-linkedin-in" }
  },

  /* ----------------------------------------------------------------------
     DATABASE (optional but recommended) — Supabase
     1. Create a free project at https://supabase.com
     2. Run database/schema.sql in the SQL Editor
     3. Paste your Project URL and the "anon public" key below.
     While these are empty, the site stores messages/orders/subscribers in
     this browser only (localStorage) so everything still works for testing.
     ---------------------------------------------------------------------- */
  supabaseUrl: "https://ivckjhjrsqzianeamrkl.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Y2tqaGpyc3F6aWFuZWFtcmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1MDE0NjQsImV4cCI6MjExMTA3NzQ2NH0.tfboIhr7FQLYLrrXgPVx8RvABV2-RbywJXl_fnksC3o"   // anon public key: safe to expose, protected by row-level security
};

/* A link is shown when it is a valid web address. Facebook and YouTube currently point to
   their home pages; paste your own profile / channel links above to send visitors straight to you. */
SITE.hasLink = function (k) {
  try { return /^https?:$/.test(new URL(SITE.social[k].url).protocol); } catch (e) { return false; }
};
