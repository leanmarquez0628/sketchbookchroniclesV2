/* Language (English / Filipino) and the Country/Region picker in the footer.
   - The choice is remembered in this browser (localStorage "sbc_lang").
   - Filipino is applied by translating text in place, so nothing in the shop or forms is rebuilt.
   - To add or fix a translation, edit the FIL list below (English text on the left, Filipino on the right). */
(function () {
  "use strict";
  const KEY = "sbc_lang";
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  let lang = ls.get(KEY);
  if (lang !== "en" && lang !== "fil") lang = /^(fil|tl)\b/i.test(navigator.language || "") ? "fil" : "en";
  window.LANG = lang;

  const FIL = {
 "Skip to content": "Lumaktaw sa nilalaman",
 "Home": "Tahanan",
 "About Me": "Tungkol sa Akin",
 "Services": "Mga Serbisyo",
 "Art Gallery": "Galeriya ng Sining",
 "Shop": "Tindahan",
 "Blog": "Blog",
 "Contact": "Makipag-ugnayan",
 "Commission me": "Mag-commission",
 "Main": "Pangunahin",
 "The Sketchbook Chronicles — Home": "The Sketchbook Chronicles — Tahanan",
 "Menu": "Menu",
 "Your email": "Iyong email",
 "Subscribe": "Mag-subscribe",
 "Hello, welcome to my art website": "Kumusta, maligayang pagdating sa aking art website",
 "Artist · Illustrator · Aspiring Digital, Painting, Graphic Artist · Metro Manila, PH": "Artist · Illustrator · Nagsisimulang Digital, Painting, Graphic Artist · Metro Manila, PH",
 "Welcome to The Sketchbook Chronicles": "Maligayang pagdating sa The Sketchbook Chronicles",
 "— a visual diary where emotion, storytelling, and technique intersect. Traditional graphite portraits and vibrant anime illustrations, with a growing exploration into painting, digital art, and graphic design.": "— isang visual diary kung saan nagtatagpo ang damdamin, pagkukuwento, at teknik. Mga tradisyonal na graphite portrait at makukulay na anime illustration, na may lumalagong paggalugad sa pagpipinta, digital art, at graphic design.",
 "See my artwork": "Tingnan ang aking mga likha",
 "Work with me": "Makipagtulungan sa Akin",
 "Pencil portraits": "Mga portrait na lapis",
 "Ink drawings": "Mga guhit na tinta",
 "Anime art": "Anime art",
 "Fan art": "Fan art",
 "Paintings": "Mga Pintura",
 "Digital art": "Digital art",
 "Architectural plans": "Mga plano ng arkitektura",
 "Graphic design": "Graphic design",
 "Selected work": "Mga piling gawa",
 "Fresh from the sketchbook": "Bagong-bago mula sa sketchbook",
 "View full gallery →": "Tingnan ang buong galeriya →",
 "Graphite on paper": "Graphite sa papel",
 "Fineliner & ink": "Fineliner at tinta",
 "Fineliner, architectural ink": "Fineliner, tintang pang-arkitektura",
 "Fineliner & marker": "Fineliner at marker",
 "Digital graphic design": "Digital na graphic design",
 "What I can draw for you": "Ano ang maiguguhit ko para sa iyo",
 "Commissions open": "Bukas ang mga commission",
 "All services →": "Lahat ng serbisyo →",
 "Pencil Portrait": "Portrait na Lapis",
 "Hand-drawn graphite portraits with subtle shading — a timeless keepsake.": "Mga graphite portrait na iginuhit ng kamay na may pinong shading — isang alaalang walang kupas.",
 "Anime & Fan Art": "Anime at Fan Art",
 "Your favorite characters in markers and colored pencils.": "Ang paborito mong mga karakter sa marker at kulay na lapis.",
 "Ink Drawing": "Guhit na Tinta",
 "Bold monochrome illustrations with crisp line work.": "Matitingkad na monochrome na ilustrasyon na may malinaw na linya.",
 "Architectural Plans": "Mga Plano ng Arkitektura",
 "Clean floor plans, elevations and sections drafted to scale.": "Malilinis na floor plan, elevation at section na iginuhit nang may sukat.",
 "Have a project in mind?": "May proyekto ka bang naiisip?",
 "Let's draw something": "Gumuhit tayo ng bagay",
 "you'll love.": "na magugustuhan mo.",
 "Start a commission": "Magsimula ng commission",
 "Explore": "Tuklasin",
 "Commissions": "Mga Commission",
 "Graphic Design": "Graphic Design",
 "Architectural Plan Drawings": "Mga Guhit ng Plano ng Arkitektura",
 "Painting and Digital Art (Coming Soon)": "Pintura at Digital Art (Malapit Na)",
 "Posters": "Mga Poster",
 "Prints (coming soon)": "Mga Print (malapit na)",
 "Follow me": "Sundan Ako",
 "Shipping Policy": "Patakaran sa Pagpapadala",
 "Refund Policy": "Patakaran sa Refund",
 "Cancellation Policy": "Patakaran sa Pagkansela",
 "Terms of Service": "Mga Tuntunin ng Serbisyo",
 "Privacy Policy": "Patakaran sa Privacy",
 "Newsletter": "Newsletter",
 "Contacts": "Mga Contact",
 "Metro Manila, Philippines": "Metro Manila, Pilipinas",
 "Lean Miguel Marquez • The Sketchbook Chronicles • All rights reserved.": "Lean Miguel Marquez • The Sketchbook Chronicles • Lahat ng karapatan ay nakalaan.",
 "01 — About me": "01 — Tungkol sa akin",
 "Hi, I'm Miguel.": "Kumusta, ako si Miguel.",
 "Artist, illustrator, and a lifelong doodler who turned a sketchbook habit into a creative practice.": "Artist, ilustrador, at habambuhay na doodler na ginawang malikhaing gawain ang hilig sa sketchbook.",
 "Drawing is how I": "Ang pagguhit ang paraan ko ng",
 "pay attention.": "pagmamasid.",
 "Hi, I'm": "Kumusta, ako si",
 ", an Illustration Artist and aspiring Digital, Painting, and Graphic Design Artist based in the Philippines. For me, drawing is an act of storytelling and structure—where what begins as a few quiet pencil lines on paper gradually comes alive as a fully realized character, a vivid face, or a compelling narrative.": ", isang Illustration Artist at nagsisimulang Digital, Painting, at Graphic Design Artist na nakabase sa Pilipinas. Para sa akin, ang pagguhit ay pagkukuwento at estruktura—kung saan ang ilang tahimik na guhit ng lapis sa papel ay unti-unting nabubuhay bilang isang ganap na karakter, isang buhay na mukha, o isang kapana-panabik na kuwento.",
 "My creative practice bridges the gap between traditional craftsmanship and expanding digital horizons. I enjoy creating": "Pinag-uugnay ng aking malikhaing gawain ang tradisyonal na husay at ang lumalawak na digital na abot-tanaw. Mahilig akong gumawa ng",
 "vibrant anime & fan art": "makukulay na anime at fan art",
 "with markers and colored pencils, as well as executing patient graphite portraits driven by subtle, meticulous shading. Complementing my character and illustration work, I produce expressive": "gamit ang marker at kulay na lapis, pati na ng matiyagang graphite portrait na nakasalalay sa pino at maingat na shading. Bukod sa aking mga karakter at ilustrasyon, gumagawa rin ako ng mga ekspresibong",
 "ink drawings": "guhit na tinta",
 "doodles": "doodle",
 ", and": ", at",
 "architectural design": "disenyong arkitektural",
 "As I continually evolve as a creative, I am actively expanding my skill set into digital art, modern painting techniques, and graphic design—merging my disciplined eye for layout and geometry with expressive visual media. Whether through hand-drawn textures or digital canvases, every piece is crafted with": "Habang patuloy akong umuunlad bilang malikhain, aktibo kong pinalalawak ang aking kasanayan sa digital art, makabagong teknik sa pagpipinta, at graphic design—pinagsasama ang disiplinado kong mata sa layout at geometry at ang ekspresibong visual media. Maging sa hand-drawn na texture o sa digital na canvas, bawat likha ay ginagawa nang may",
 "intention, precision, and a deep appreciation for visual depth.": "layunin, katumpakan, at malalim na pagpapahalaga sa lalim ng biswal.",
 "Anime fan art": "Anime fan art",
 "Markers": "Mga marker",
 "Colored pencil": "Kulay na lapis",
 "Graphite portraits": "Mga graphite portrait",
 "Doodle art": "Doodle art",
 "See the gallery": "Tingnan ang galeriya",
 "Tools of the trade": "Mga kagamitan ng sining",
 "What's in my pencil case": "Ano ang laman ng aking lalagyan ng lapis",
 "Graphite": "Graphite",
 "HB to 6B for portraits": "HB hanggang 6B para sa mga portrait",
 "Vibrant anime colors": "Makukulay na kulay-anime",
 "Colored pencils": "Mga kulay na lapis",
 "Layered blending": "Patong-patong na paghahalo",
 "Ink & fineliners": "Tinta at fineliner",
 "Crisp line and hatching": "Malinaw na linya at hatching",
 "Watercolor & acrylic": "Watercolor at acrylic",
 "Coming soon": "Malapit na",
 "Digital": "Digital",
 "02 — Services": "02 — Mga Serbisyo",
 "What I can draw for you.": "Ano ang maiguguhit ko para sa iyo.",
 "I offer a wide range of artwork including pencil portraits, anime and fan art, ink drawings, paintings, digital art, graphic design, and scaled architectural plan drawings. Here's the information about each service:": "Nag-aalok ako ng iba't ibang likhang-sining kabilang ang mga portrait na lapis, anime at fan art, guhit na tinta, pintura, digital art, graphic design, at mga guhit ng plano ng arkitektura na may sukat. Narito ang impormasyon sa bawat serbisyo:",
 "Custom hand-drawn graphite portraits crafted with subtle shading — a timeless, personal keepsake or gift for any occasion.": "Mga custom na graphite portrait na iginuhit ng kamay na may pinong shading — isang walang kupas at personal na alaala o regalo para sa anumang okasyon.",
 "Pricing for this pencil portrait service is negotiable.": "Napag-uusapan ang presyo ng serbisyong pencil portrait na ito.",
 "Anime Art": "Anime Art",
 "Vibrant, dynamic portraits of your favorite anime characters, hand-drawn using rich markers and colored pencils.": "Makukulay at dinamikong portrait ng paborito mong mga karakter sa anime, iginuhit ng kamay gamit ang mayayamang marker at kulay na lapis.",
 "Fan Art": "Fan Art",
 "Bring your favorite pop culture icons to life in a custom traditional piece — made for collectors, fans, and unique gifts.": "Bigyang-buhay ang paborito mong pop culture icons sa isang custom na tradisyonal na likha — para sa mga kolektor, tagahanga, at natatanging regalo.",
 "Bold monochrome illustrations defined by crisp line work, high-contrast shadows, and meticulous cross-hatching.": "Matitingkad na monochrome na ilustrasyon na binibigyang-hugis ng malinaw na linya, mataas-na-kontrast na anino, at maingat na cross-hatching.",
 "Painting": "Pintura",
 "Original hand-painted works in watercolor or acrylic, rich in color and texture — ready to frame and display.": "Orihinal na mga likhang pininturahan ng kamay sa watercolor o acrylic, mayaman sa kulay at tekstura — handa nang i-frame at ipakita.",
 "Coming Soon": "Malapit Na",
 "Digital Art": "Digital Art",
 "Crisp digital portraits and character illustrations delivered as high-resolution files — ready to print, frame, or share online.": "Malilinaw na digital portrait at ilustrasyon ng karakter na ihahatid bilang high-resolution na file — handa nang i-print, i-frame, o ibahagi online.",
 "Architectural Plan Drawing": "Guhit ng Plano ng Arkitektura",
 "Clean, accurate floor plans, elevations, and sections drafted to scale — ideal for residential concepts and academic plates.": "Malilinis at tumpak na floor plan, elevation, at section na iginuhit nang may sukat — angkop para sa mga konsepto ng tirahan at mga academic plate.",
 "Pricing for this Architectural Plan Drawing service is negotiable.": "Napag-uusapan ang presyo ng serbisyong Guhit ng Plano ng Arkitektura na ito.",
 "Bold posters, wallpapers and layouts, with big typography, clean color blocking and your subject front and center.": "Matitingkad na poster, wallpaper at layout, na may malaking typography, malinis na color blocking at ang iyong paksa sa gitna.",
 "Pricing for this Graphic Design service is negotiable.": "Napag-uusapan ang presyo ng serbisyong Graphic Design na ito.",
 "How to commission me": "Paano mag-commission sa akin",
 "Message me": "Padalhan mo ako ng mensahe",
 "Send an inquiry with your preferred style, size, subject details, and clear reference photos to kick things off.": "Magpadala ng inquiry na may gusto mong estilo, sukat, detalye ng paksa, at malilinaw na reference photo para makapagsimula.",
 "Get a quote": "Kumuha ng quote",
 "Once I review your concept, I'll reply with a custom quote, estimated turnaround time, and shipping details.": "Kapag nasuri ko na ang konsepto mo, sasagot ako ng custom na quote, tinatayang oras ng paggawa, at detalye ng pagpapadala.",
 "Approve the sketch": "Aprubahan ang sketch",
 "For custom commissions, I'll send a preliminary sketch for your approval so we can refine any details before finalizing.": "Para sa mga custom na commission, magpapadala ako ng paunang sketch para sa iyong pag-apruba upang maayos natin ang mga detalye bago tapusin.",
 "Receive your art": "Tanggapin ang iyong likha",
 "I'll send a preview of the finished piece before securely packaging and shipping your physical artwork — or delivering your high-res digital files.": "Magpapadala ako ng preview ng natapos na likha bago ligtas na i-pack at ipadala ang iyong pisikal na likhang-sining — o ihatid ang iyong high-res na digital file.",
 "03 — Art gallery": "03 — Galeriya ng sining",
 "Pieces from the sketchbook.": "Mga likha mula sa sketchbook.",
 "Pencil portraits, ink drawings and graphic design from my sketchbooks and screen. Tap any piece to see it larger. Paintings are coming soon.": "Mga portrait na lapis, guhit na tinta at graphic design mula sa aking mga sketchbook at screen. I-tap ang alinmang likha para makita nang mas malaki. Malapit nang dumating ang mga pintura.",
 "All": "Lahat",
 "Portraits": "Mga Portrait",
 "Ink Drawings": "Mga Guhit na Tinta",
 "· soon": "· malapit na",
 "Hand-painted pieces in watercolor and acrylic are on the way.": "Paparating na ang mga likhang pininturahan ng kamay sa watercolor at acrylic.",
 "Watercolor and acrylic pieces are on the way.": "Paparating na ang mga likha sa watercolor at acrylic.",
 "See the Paintings tab →": "Tingnan ang tab na Mga Pintura →",
 "coming soon": "malapit na",
 "Categories": "Mga kategorya",
 "Previous slide": "Nakaraang slide",
 "Next slide": "Susunod na slide",
 "Artwork viewer": "Tagatingin ng likha",
 "Close": "Isara",
 "Previous": "Nakaraan",
 "Next": "Susunod",
 "04 — Shop": "04 — Tindahan",
 "Art for your wall.": "Sining para sa iyong dingding.",
 "F1 driver posters are available now. Pick framed or print only on each poster, choose a size, then tap Order to email me — more prints and original pieces are on the way.": "Available na ngayon ang mga poster ng F1 driver. Piliin kung may frame o print lang sa bawat poster, pumili ng sukat, saka i-tap ang Order para i-email ako — darating pa ang mas maraming print at orihinal na likha.",
 "F1 Posters": "Mga F1 Poster",
 "(framed or print only)": "(may frame o print lang)",
 "Show prices in": "Ipakita ang presyo sa",
 "PHP · Philippine peso (₱)": "PHP · Piso ng Pilipinas (₱)",
 "USD · US dollar": "USD · Dolyar ng US",
 "SGD · Singapore dollar": "SGD · Dolyar ng Singapore",
 "EUR · Euro": "EUR · Euro",
 "CAD · Canadian dollar": "CAD · Dolyar ng Canada",
 "GBP · British pound": "GBP · Pound ng Britanya",
 "AUD · Australian dollar": "AUD · Dolyar ng Australia",
 "JPY · Japanese yen": "JPY · Yen ng Japan",
 "AED · UAE dirham": "AED · Dirham ng UAE",
 "HKD · Hong Kong dollar": "HKD · Dolyar ng Hong Kong",
 "SAR · Saudi riyal": "SAR · Riyal ng Saudi",
 "KRW · South Korean won": "KRW · Won ng South Korea",
 "Framed poster": "May frame na poster",
 "Print only": "Print lang",
 "Ships rolled in a tube": "Ipinapadala nang nakarolyo sa tubo",
 "Code:": "Code:",
 "Order": "Order",
 "Art prints": "Mga art print",
 "· coming soon": "· malapit na",
 "Archival prints of my pencil portraits and ink drawings.": "Mga archival print ng aking mga portrait na lapis at guhit na tinta.",
 "Original pieces": "Mga orihinal na likha",
 "One-of-a-kind paintings and drawings, ready to frame.": "Natatanging mga pintura at guhit, handa nang i-frame.",
 "Place an order": "Mag-order",
 "I'll confirm availability, shipping and payment by email.": "Kukumpirmahin ko sa email ang availability, pagpapadala at bayad.",
 "Quantity": "Dami",
 "Total": "Kabuuan",
 "Your name": "Pangalan mo",
 "Please enter your name.": "Pakilagay ang iyong pangalan.",
 "Email": "Email",
 "Please enter a valid email.": "Maglagay ng wastong email.",
 "Phone (optional)": "Telepono (opsyonal)",
 "Delivery address / notes": "Address ng paghahatid / mga tala",
 "Payment method": "Paraan ng pagbabayad",
 "e-wallet": "e-wallet",
 "Bank transfer": "Bank transfer",
 "BDO / Metrobank / GoTyme / other": "BDO / Metrobank / GoTyme / iba pa",
 "Which bank will you use?": "Aling bangko ang gagamitin mo?",
 "Send to this bank": "Ipadala sa bangkong ito",
 "Other bank": "Ibang bangko",
 "Send order": "Ipadala ang order",
 "Format": "Format",
 "Size": "Sukat",
 "Decrease quantity": "Bawasan ang dami",
 "Increase quantity": "Dagdagan ang dami",
 "Order received": "Natanggap ang order",
 "One more step": "Isa pang hakbang",
 "Price each:": "Presyo bawat isa:",
 "(shipping quoted by email)": "(ibibigay sa email ang singil sa pagpapadala)",
 "Your order reference": "Reference ng iyong order",
 "Tap": "I-tap ang",
 "Send order email": "Ipadala ang order email",
 "so I get your details right away.": "para agad kong matanggap ang iyong mga detalye.",
 ". This is what delivers your order to me.": ". Ito ang naghahatid ng iyong order sa akin.",
 "I'll reply to confirm availability and shipping.": "Sasagot ako para kumpirmahin ang availability at pagpapadala.",
 "I'll reply to confirm availability and shipping, and send my": "Sasagot ako para kumpirmahin ang availability at pagpapadala, at ipapadala ko ang aking",
 "account details.": "account details.",
 "Then pay by": "Pagkatapos, magbayad sa pamamagitan ng",
 "in Philippine pesos": "sa Philippine peso",
 "and reply with your reference": "at i-reply ang iyong reference",
 "and the receipt.": "at ang resibo.",
 "Bank": "Bangko",
 "Account name": "Pangalan ng account",
 "Account number": "Numero ng account",
 "GCash number": "Numero ng GCash",
 "Maya number": "Numero ng Maya",
 "Copy": "Kopyahin",
 "Send your payment after I confirm availability, then reply with your order reference and the receipt.": "Ipadala ang iyong bayad pagkatapos kong kumpirmahin ang availability, saka i-reply ang iyong order reference at ang resibo.",
 "Copied.": "Nakopya.",
 "Select the text and copy it manually.": "Piliin ang teksto at kopyahin nang mano-mano.",
 "Order received!": "Natanggap ang order!",
 "Could not save your order. Please email me directly.": "Hindi na-save ang iyong order. Pakiemail na lang ako nang direkta.",
 "Please send the order email to finish.": "Pakipadala ang order email para matapos.",
 "Please wait a few seconds before sending again.": "Maghintay ng ilang segundo bago magpadala muli.",
 "Sorry, something went wrong. Please try again.": "Paumanhin, may nangyaring mali. Subukan muli.",
 "05 — Blog": "05 — Blog",
 "Fresh from my feeds.": "Bagong-bago mula sa aking mga feed.",
 "My personal blog lives on social media. Here are the latest posts from YouTube, TikTok, Instagram and Facebook.": "Nasa social media ang aking personal na blog. Narito ang mga pinakabagong post mula sa YouTube, TikTok, Instagram at Facebook.",
 "Social platforms": "Mga social platform",
 "Latest Shorts": "Pinakabagong Shorts",
 "Pinned & latest": "Naka-pin at pinakabago",
 "Pinned": "Naka-pin",
 "Latest posts": "Pinakabagong post",
 "Latest threads": "Pinakabagong thread",
 "Process": "Proseso",
 "— Contact": "— Makipag-ugnayan",
 "Let's work together": "Magtulungan tayo",
 "Have an idea for a portrait, character illustration, graphic layout, or architectural drawing? Reach out with the details — I'd love to collaborate and bring it to life.": "May ideya ka ba para sa portrait, ilustrasyon ng karakter, graphic layout, o guhit na arkitektural? Ipadala ang mga detalye — gusto kong makipagtulungan at bigyang-buhay ito.",
 "Call / text": "Tawag / text",
 "Compose an email": "Sumulat ng email",
 "Have a commission, collaboration, or general inquiry in mind? Fill out the form below to automatically generate an email in your default mail app, or feel free to reach out directly through my social channels.": "May commission, kolaborasyon, o pangkalahatang tanong? Punan ang form sa ibaba para awtomatikong gumawa ng email sa iyong default na mail app, o makipag-ugnayan nang direkta sa aking mga social channel.",
 "First name": "Pangalan",
 "Required": "Kinakailangan",
 "Last name": "Apelyido",
 "Enter a valid email address.": "Maglagay ng wastong email address.",
 "Subject": "Paksa",
 "Leave me a message…": "Mag-iwan ng mensahe…",
 "Please write a short message.": "Magsulat ng maikling mensahe.",
 "Submit": "Isumite",
 "Sending…": "Ipinapadala…",
 "Preview my email": "I-preview ang email ko",
 "Hide email preview": "Itago ang email preview",
 "Email preview": "Email preview",
 "Open in my email app": "Buksan sa aking email app",
 "Copy text": "Kopyahin ang teksto",
 "Please fill in the required fields.": "Pakipunan ang mga kinakailangang field.",
 "Email text copied.": "Nakopya ang teksto ng email.",
 "Message saved!": "Naitala ang mensahe!",
 "Could not save your message. Please use the email button below.": "Hindi na-save ang iyong mensahe. Pakigamit ang email button sa ibaba.",
 "Thanks for subscribing!": "Salamat sa pag-subscribe!",
 "Services & Commissions": "Mga Serbisyo at Commission",
 "Page not found": "Hindi natagpuan ang pahina",
 "This page wandered off the sketchbook.": "Naligaw ang pahinang ito palabas ng sketchbook.",
 "The link may be old or mistyped. Here is where to go next.": "Maaaring luma o mali ang pagkakatype ng link. Narito ang susunod mong puntahan.",
 "Back home": "Balik sa tahanan",
 "Visit the shop": "Bisitahin ang tindahan",
 "Country/Region": "Bansa/Rehiyon",
 "Language": "Wika"
};
  const CAT = { "Portrait": "Portrait", "Ink drawing": "Guhit na tinta", "Graphic design": "Graphic design", "Painting": "Pintura" };

  /* texts that carry numbers or names are matched by pattern */
  const RULES = [
    [/^Slide (\d+) \/ (\d+)$/, m => `Pahina ${m[1]} / ${m[2]}`],
    [/^(\d+) pieces?$/, m => `${m[1]} likha`],
    [/^Open (.+)$/, m => `Buksan ang ${m[1]}`],
    [/^Copy (.+)$/, m => `Kopyahin ang ${m[1]}`],
    [/^Follow on (.+)$/, m => `Sundan sa ${m[1]}`],
    [/^Starting from (.+)$/, m => `Simula sa ${m[1]}`],
    [/^(A\d) \((.+) in\)$/, m => `${m[1]} (${m[2]} pulgada)`],
    [/^(A\d) print, (.+) in$/, m => `${m[1]} na print, ${m[2]} pulgada`],
    [/^Frame (.+) in$/, m => `Frame ${m[1]} pulgada`],
    [/^Code: (.+)$/, m => `Code: ${m[1]}`],
    [/^(Framed poster|Print only) · (A\d)$/, m => `${tr(m[1])} · ${m[2]}`],
    [/^· (Framed poster|Print only) · (A\d) × (\d+)$/, m => `· ${tr(m[1])} · ${m[2]} × ${m[3]}`],
    [/^(GCash|Maya|Bank transfer) details$/, m => `Mga detalye ng ${m[1]}`],
    [/^I'll send my (.+) account details by email once I confirm availability and shipping\. Please don't pay before then\.$/,
      m => `Ipapadala ko sa email ang aking mga detalye ng account sa ${m[1]} kapag nakumpirma ko na ang availability at pagpapadala. Pakiusap, huwag munang magbayad bago iyon.`],
    [/^(Portrait|Ink drawing|Graphic design|Painting) · (.+)$/, m => `${CAT[m[1]]} · ${tr(m[2])}`],
    [/^Estimated( at today's rate)? \((.+)\)\. You pay in Philippine pesos; the final amount is confirmed by email\.$/,
      m => `Tantiya${m[1] ? " sa rate ngayon" : ""} (${m[2]}). Magbabayad ka sa Philippine peso; kukumpirmahin sa email ang pinal na halaga.`],
    [/^Prices are charged in Philippine pesos \(₱\)\. The (\w+) amount is only an estimate, and I'll confirm the final amount by email\.$/,
      m => `Sinisingil ang mga presyo sa Philippine peso (₱). Tantiya lamang ang halaga sa ${m[1]}, at kukumpirmahin ko sa email ang pinal na halaga.`],
    [/^Message received! If your email app does not open, copy the email below and send it to (.+)$/,
      m => `Natanggap ang mensahe! Kung hindi bumukas ang iyong email app, kopyahin ang email sa ibaba at ipadala ito sa ${m[1]}`],
    [/^Almost done: please send the email that opens \(or copy the text below\) to (.+) so I get your message\.$/,
      m => `Halos tapos na: pakipadala ang email na bubukas (o kopyahin ang teksto sa ibaba) sa ${m[1]} para matanggap ko ang iyong mensahe.`]
  ];
  function tr(s) {
    if (lang !== "fil" || !s) return s;
    if (Object.prototype.hasOwnProperty.call(FIL, s)) return FIL[s];
    for (let i = 0; i < RULES.length; i++) { const m = s.match(RULES[i][0]); if (m) return RULES[i][1](m); }
    return s;
  }
  /* t("English text") for strings made in JavaScript; {name} placeholders are filled from the second argument */
  window.t = (s, v) => { let r = tr(s); if (v) r = r.replace(/\{(\w+)\}/g, (x, k) => (k in v ? v[k] : x)); return r; };

  /* ---------- translate the page ---------- */
  const SKIP = "script,style,noscript,textarea,#admin-main,.hp,#preview-text,[data-no-i18n],.foot-prefs";
  const ATTRS = ["placeholder", "aria-label", "title"];
  function text(n) {
    const raw = n.nodeValue, core = raw.trim(); if (!core) return;
    const s = core.replace(/\s+/g, " "), out = tr(s);
    if (out !== s) n.nodeValue = raw.replace(core, out);
  }
  function attrs(el) { ATTRS.forEach(a => { const v = el.getAttribute && el.getAttribute(a); if (v) { const o = tr(v.trim()); if (o !== v.trim()) el.setAttribute(a, o); } }); }
  function walk(root) {
    if (lang !== "fil" || !root) return;
    if (root.nodeType === 3) { if (root.parentElement && !root.parentElement.closest(SKIP)) text(root); return; }
    if (root.nodeType !== 1 || root.closest(SKIP)) return;
    attrs(root);
    root.querySelectorAll("*").forEach(el => { if (!el.closest(SKIP)) attrs(el); });
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { if (n.parentElement && !n.parentElement.closest(SKIP)) text(n); }
  }
  function title() {
    if (lang !== "fil") return;
    const p = document.title.split(" — "); p[0] = tr(p[0]); document.title = p.join(" — ");
  }

  /* ---------- Country / Region + Language picker (footer) ---------- */
  const COUNTRY = { PHP: "PH", USD: "US", SGD: "SG", EUR: "EU", CAD: "CA", GBP: "GB", AUD: "AU", JPY: "JP", AED: "AE", HKD: "HK", SAR: "SA", KRW: "KR" };
  const FALLBACK_NAME = { PH: "Philippines", US: "United States", SG: "Singapore", EU: "Europe", CA: "Canada", GB: "United Kingdom", AU: "Australia", JP: "Japan", AE: "United Arab Emirates", HK: "Hong Kong", SA: "Saudi Arabia", KR: "South Korea" };
  function regionName(cc) {
    try { return new Intl.DisplayNames([lang === "fil" ? "fil" : "en"], { type: "region" }).of(cc) || FALLBACK_NAME[cc]; } catch (e) { return FALLBACK_NAME[cc]; }
  }
  function symbol(code) {
    try { const p = new Intl.NumberFormat("en", { style: "currency", currency: code, currencyDisplay: "narrowSymbol" }).formatToParts(1).find(x => x.type === "currency"); return p ? p.value : code; } catch (e) { return code; }
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function buildPrefs() {
    const bottom = document.querySelector(".foot-bottom"); if (!bottom || document.querySelector(".foot-prefs")) return;
    const box = document.createElement("div"); box.className = "foot-prefs";
    const hasCur = window.CUR && Array.isArray(CUR.list);
    const opts = hasCur ? CUR.list.map(([c]) => `<option value="${c}">${esc(regionName(COUNTRY[c] || "PH"))} | ${c} ${esc(symbol(c))}</option>`).join("") : "";
    box.innerHTML =
      (hasCur ? `<div><label for="pref-country">${esc(t("Country/Region"))}</label><select id="pref-country" name="country" autocomplete="country">${opts}</select></div>` : "") +
      `<div><label for="pref-lang">${esc(t("Language"))}</label><select id="pref-lang" name="language" autocomplete="off"><option value="en">English</option><option value="fil">Filipino</option></select></div>`;
    bottom.parentNode.insertBefore(box, bottom);
    const lsel = box.querySelector("#pref-lang"); lsel.value = lang;
    lsel.addEventListener("change", () => { ls.set(KEY, lsel.value); location.reload(); });
    const csel = box.querySelector("#pref-country");
    if (csel) {
      csel.value = CUR.code();
      csel.addEventListener("change", () => CUR.set(csel.value));
      window.addEventListener("sbc:cur", () => { csel.value = CUR.code(); });
      if (CUR.refresh) CUR.refresh();
    }
  }

  /* ---------- go ---------- */
  document.documentElement.lang = lang === "fil" ? "fil" : "en";
  buildPrefs();
  title();
  walk(document.body);
  if (lang === "fil") {
    let queue = new Set(), raf = 0;
    const flush = () => { raf = 0; const q = queue; queue = new Set(); q.forEach(n => { if (n.isConnected) walk(n); }); };
    new MutationObserver(list => {
      list.forEach(m => {
        if (m.type === "characterData") queue.add(m.target);
        else if (m.type === "attributes") queue.add(m.target);
        else m.addedNodes.forEach(n => queue.add(n));
      });
      if (!raf) raf = requestAnimationFrame(flush);
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
})();
