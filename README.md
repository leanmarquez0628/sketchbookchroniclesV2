# The Sketchbook Chronicles — website

Plain HTML + CSS + JavaScript. No build step. Open `index.html` through any static host (Vercel, GitHub Pages, Netlify).
Preview locally: `python3 -m http.server` then open http://localhost:8000

## Pages
index (Home) · about · services · gallery · shop · blog · contact · admin (private inbox)

## Change things
| What | Where |
|---|---|
| Email, phone, social links, database keys | `js/config.js` |
| Gallery pieces, blog posts, poster products and prices | `js/data.js` |
| Your artwork | put images in `assets/gallery/` and edit `js/data.js` |
| Your photo on About | save as `assets/about/me.jpg` |
| Poster images | replace `assets/shop/f1-10.jpg` … `f1-17.jpg` (the included ones are SAMPLE placeholders) |
| Colors (#101D18 #244B3A #5F8C6D #DFE8D9 #F7F4EA) | top of `css/style.css` |

## If a picture does not show after deploying
- Upload the whole folder (the `assets/` folder must come with the HTML). Names are case-sensitive on Vercel: `ink-01.jpg` is not `Ink-01.JPG`.
- A picture that fails to load is retried once and then replaced by a green "LM." tile, so the layout never breaks.
- `vercel.json` sets caching; after replacing a picture, keep the same file name or hard-refresh.

## Database (Supabase, free)
1. Create a project at supabase.com → SQL Editor → paste and run `database/schema.sql` (safe to re-run).
2. Settings → API: copy the Project URL and the `anon public` key into `js/config.js`.
3. Authentication → Users → add yourself (email + password). Sign in at `/admin.html`.
4. Existing `orders` table? Run the `alter table` lines in the comment block of `schema.sql` to add quantity, total and payment_method.

**Tables:** messages, orders, subscribers (visitors can only INSERT), gallery_items, blog_posts, products (visitors can only read published rows). Only the signed-in admin can read, edit or delete.

**Protection built in**
- Hidden honeypot field in the contact, order and newsletter forms (bots are silently ignored).
- 15-second cooldown per form in the browser, plus a database trigger: max 5 messages or orders per email per hour.
- Order total is calculated by the database (price × quantity).
- Failed or offline submissions are queued and retried automatically.
- Storage bucket `artworks` (public read, admin write) for gallery images; view `order_overview` for a quick orders list.

**Data quality (round 3, re-run `schema.sql` once):** emails are lower-cased and checked, one subscription per email, message length and order quantity (1-20) limits, `updated_at` on messages and orders, and a `sort_order` column on `gallery_items` to choose the display order.

**Admin page** (`admin.html`): Messages, Orders, Subscribers and Gallery tabs, status dropdowns, open-order stats, CSV export. The Gallery tab (add / show / hide / delete) needs Supabase. Without Supabase the admin shows only what was saved in this browser.

Payment details shown in the order form (GCash, Maya, bank) come from `payment` in `js/config.js` — fill them in.


## Database
The site is connected to the Supabase project `sketchbook-chronicles` (URL and anon key are in `js/config.js`). Messages, orders and subscribers now save to the database. To read them, create your login in Supabase → Authentication → Users → Add user, then sign in at `admin.html`.

## Payment: banks and currencies
- **Several receiving banks.** In `js/config.js`, under `payment`, add a `banks` list. Buyers pick which bank to send to:
  ```js
  banks: [
    { bank: "BDO",       name: "Your Name", number: "0000 0000 0000" },
    { bank: "Metrobank", name: "Your Name", number: "0000 0000 0000" },
    { bank: "GoTyme",    name: "Your Name", number: "0000 0000 0000" }
  ]
  ```
  The old single `bank: {…}` still works. With no bank filled in, buyers choose the bank they prefer and you reply with its details.
- **Currencies.** The shop shows a "Show prices in" menu (PHP, USD, SGD, EUR, CAD, GBP, AUD, JPY, AED, HKD, SAR, KRW). Prices and orders stay in pesos; other currencies are a live estimate (`js/currency.js`).
- **Admin login.** Only the email in `public.is_owner()` (database/schema.sql) can read orders and messages. Create that user in Supabase → Authentication → Users → Add user.
