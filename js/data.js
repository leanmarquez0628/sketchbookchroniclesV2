/* ==========================================================================
   SEED CONTENT — used when no database is connected (or the tables are empty).
   Field names match the columns in database/schema.sql, so moving this content
   into Supabase later is a copy/paste.
   ========================================================================== */
window.SEED = {
  // Personal blog feeds (your own posts). Add or replace images in assets/social/.
  social_feed: {
    youtube:   { label: "YouTube",   handle: "Shorts", groups: [{ title: "Latest Shorts", type: "posts", items: [
      {"src": "assets/social/yt-1.jpg", "date": "Short", "caption": "Every stroke tells a story."},
      {"src": "assets/social/yt-2.jpg", "date": "Short", "caption": "A quiet dream of you."},
      {"src": "assets/social/yt-3.jpg", "date": "Short", "caption": "Pencil in hand, screaming internally, trusting the process."}] }] },
    tiktok:    { label: "TikTok",    handle: "@lnmglmrq", groups: [{ title: "Pinned & latest", type: "posts", items: [
      {"src": "assets/social/tt-1.jpg", "pinned": true, "caption": "Pencil portrait with a headscarf."},
      {"src": "assets/social/tt-2.jpg", "pinned": true, "caption": "Sketchbook spread of portrait studies."},
      {"src": "assets/social/tt-3.jpg", "pinned": true, "caption": "May your tomorrow be brighter than today."},
      {"src": "assets/social/tt-4.jpg", "date": "Video", "caption": "Every stroke tells a story."},
      {"src": "assets/social/tt-5.jpg", "date": "Poster", "caption": "Lewis Hamilton · Ferrari. Minimal F1 poster design."},
      {"src": "assets/social/tt-6.jpg", "date": "Process", "caption": "Graphite sketching in the sketchbook, pencils and fineliner on the page."}] }] },
    instagram: { label: "Instagram", handle: "@lnmglmrqz", groups: [{ title: "Pinned & latest", type: "posts", items: [
      {"src": "assets/social/ig-1.jpg", "pinned": true, "caption": "Sketchbook time. Pencil, ink and a quiet corner."},
      {"src": "assets/social/ig-2.jpg", "pinned": true, "caption": "She inspired me to start drawing again."},
      {"src": "assets/social/ig-3.jpg", "pinned": true, "caption": "Sketchbook pages in progress."},
      {"src": "assets/social/ig-4.jpg", "date": "Reel", "caption": "Lost in the lines, found in the sketch."},
      {"src": "assets/social/ig-5.jpg", "date": "Reel", "caption": "Every stroke tells a story."},
      {"src": "assets/social/ig-6.jpg", "date": "Post", "caption": "Pencil studies from the sketchbook."}] }] },
    facebook:  { label: "Facebook",  handle: "Miguel Marquez", groups: [{ title: "Latest posts", type: "posts", items: [
      { src: "assets/social/fbp-4.jpg", date: "Nov 12", caption: "Random Drawing 1: Fashion. Every crease in a garment, every shadow on paper, tells a story of structure, movement, and mood. Finding the harmony between personal style and artistic vision. #art #drawing #fyp #viral #artoftheday" },
      { src: "assets/social/fbp-7.jpg", date: "Nov 9", caption: "Minimal poster design of F1 cars and number of drivers in their team #F1 #Formula1 #posterdesign #posters" },
      { src: "assets/social/fbr-2.jpg", date: "Reel", caption: "Sketching is how I slow down time. No rush, no noise—just the sound of pencil and ink bringing an idea to life one line at a time." },
      { src: "assets/social/fbr-3.jpg", date: "Reel", caption: "True passion for drawing isn't about making every page a masterpiece; it's about loving the process enough to keep sketching even when the lines get messy. #drawing #art #reels #viral #sketch" },
      { src: "assets/social/fbr-1.jpg", date: "Reel", caption: "Patience for the details. Fear through the first line. Belief in the final result. #art #viral #reels #explore #drawing" },
      { src: "assets/social/fbp-1.jpg", date: "Photos", caption: "Steel Ball Run: complete process of drawing Jojo's Bizarre Adventure Steel Ball Run. #art #anime #conceptart #valuesketches #jojosbizarreadventure" }] }] },
    threads:   { label: "Threads",   handle: "@lnmglmrqz", groups: [{ title: "Latest threads", type: "posts", items: [
      { src: "assets/social/th-5.jpg", pinned: true, caption: "Poster design of F1 cars and numbers of the drivers (version 2) #f1 #mercedes #ferrari #redbull #mclaren #audi #formula1 #posterart" },
      { src: "assets/social/th-4.jpg", caption: "Random Drawing 23: Fashion. Every crease in a garment, every shadow on paper, tells a story of structure, movement, and mood. #art #drawing #artoftheday" },
      { src: "assets/social/th-3.jpg", date: "Oct 6", caption: "Random Drawing 20: Random Person. Follow my Social Media. Stay Positive. #art #drawing #artist #artoftheday" },
      { src: "assets/social/th-2.jpg", date: "Aug 28", caption: "Random Drawing 15: Known #art #drawing #fyp #viral" },
      { src: "assets/social/th-1.jpg", date: "Aug 16", caption: "Random Drawing 14: Luxurious. Elevated in every detail #drawing #art #fyp #viral #artoftheday" }] }] }
  },
  gallery_items: [
    { id: 1, title: "Two Faces", category: "portrait", medium: "Graphite on paper", year: null, image_url: "assets/gallery/portrait-01.jpg" },
    { id: 2, title: "Ink Portrait with Hat", category: "ink", medium: "Fineliner & ink", year: null, image_url: "assets/gallery/ink-01.jpg" },
    { id: 3, title: "Sketchbook Pair", category: "portrait", medium: "Graphite on paper", year: null, image_url: "assets/gallery/portrait-02.jpg" },
    { id: 4, title: "Ink Duo", category: "ink", medium: "Fineliner & ink", year: null, image_url: "assets/gallery/ink-02.jpg" },
    { id: 5, title: "Two Girls", category: "portrait", medium: "Graphite on paper", year: null, image_url: "assets/gallery/portrait-03.jpg" },
    { id: 6, title: "Street Facade", category: "ink", medium: "Fineliner, architectural ink", year: null, image_url: "assets/gallery/ink-03.jpg" },
    { id: 7, title: "Pencil Spread", category: "portrait", medium: "Graphite on paper", year: null, image_url: "assets/gallery/portrait-04.jpg" },
    { id: 8, title: "Narrow Building", category: "ink", medium: "Fineliner, architectural ink", year: null, image_url: "assets/gallery/ink-04.jpg" },
    { id: 9, title: "Glasses & Stars", category: "portrait", medium: "Graphite on paper", year: null, image_url: "assets/gallery/portrait-05.jpg" },
    { id: 10, title: "Cross-hatch Close-up", category: "ink", medium: "Fineliner & marker", year: null, image_url: "assets/gallery/ink-05.jpg" },
    { id: 11, title: "Four Faces", category: "portrait", medium: "Graphite on paper", year: null, image_url: "assets/gallery/portrait-06.jpg" },
    { id: 12, title: "Dark Helmet", category: "ink", medium: "Fineliner & marker", year: null, image_url: "assets/gallery/ink-06.jpg" },
    { id: 13, title: "Lewis Hamilton · Crown", category: "graphic", medium: "Digital graphic design", year: null, image_url: "assets/gallery/graphic-01.jpg" },
    { id: 14, title: "Max Verstappen · Crown", category: "graphic", medium: "Digital graphic design", year: null, image_url: "assets/gallery/graphic-02.jpg" },
    { id: 15, title: "Lando Norris · Champion", category: "graphic", medium: "Digital graphic design", year: null, image_url: "assets/gallery/graphic-03.jpg" },
    { id: 16, title: "Charles Leclerc · 16", category: "graphic", medium: "Digital graphic design", year: null, image_url: "assets/gallery/graphic-04.jpg" },
    { id: 17, title: "Lando Norris · Number 4", category: "graphic", medium: "Digital graphic design", year: null, image_url: "assets/gallery/graphic-05.jpg" },
    { id: 18, title: "Lewis Hamilton · Number 44", category: "graphic", medium: "Digital graphic design", year: null, image_url: "assets/gallery/graphic-06.jpg" }
  ],

  // Prices in PHP. Change them freely.
  products: [
    { code: "F1-10", name: "Lewis Hamilton · Ferrari", team: "Ferrari", image_url: "assets/shop/f1-10.jpg", framed_a5: 1400, framed_a4: 1600, framed_a3: 2100, print_a5: 520, print_a4: 620, print_a3: 890 },
    { code: "F1-11", name: "Charles Leclerc · Ferrari", team: "Ferrari", image_url: "assets/shop/f1-11.jpg", framed_a5: 1400, framed_a4: 1600, framed_a3: 2100, print_a5: 520, print_a4: 620, print_a3: 890 },
    { code: "F1-12", name: "Max Verstappen · Red Bull", team: "Red Bull", image_url: "assets/shop/f1-12.jpg", framed_a5: 1400, framed_a4: 1600, framed_a3: 2100, print_a5: 520, print_a4: 620, print_a3: 890 },
    { code: "F1-13", name: "Lando Norris · McLaren", team: "McLaren", image_url: "assets/shop/f1-13.jpg", framed_a5: 1400, framed_a4: 1600, framed_a3: 2100, print_a5: 520, print_a4: 620, print_a3: 890 },
    { code: "F1-14", name: "Oscar Piastri · McLaren", team: "McLaren", image_url: "assets/shop/f1-14.jpg", framed_a5: 1400, framed_a4: 1600, framed_a3: 2100, print_a5: 520, print_a4: 620, print_a3: 890 },
    { code: "F1-15", name: "Kimi Antonelli · Mercedes", team: "Mercedes", image_url: "assets/shop/f1-15.jpg", framed_a5: 1400, framed_a4: 1600, framed_a3: 2100, print_a5: 520, print_a4: 620, print_a3: 890 },
    { code: "F1-16", name: "George Russell · Mercedes", team: "Mercedes", image_url: "assets/shop/f1-16.jpg", framed_a5: 1400, framed_a4: 1600, framed_a3: 2100, print_a5: 520, print_a4: 620, print_a3: 890 },
    { code: "F1-17", name: "Fernando Alonso · Aston Martin", team: "Aston Martin", image_url: "assets/shop/f1-17.jpg", framed_a5: 1400, framed_a4: 1600, framed_a3: 2100, print_a5: 520, print_a4: 620, print_a3: 890 },
    { code: "F1-18", name: "Lewis Hamilton · Ferrari (V2)", team: "Ferrari", image_url: "assets/shop/f1-18.jpg", framed_a5: 1400, framed_a4: 1600, framed_a3: 2100, print_a5: 520, print_a4: 620, print_a3: 890 },
    { code: "F1-19", name: "Kimi Antonelli · Mercedes (V2)", team: "Mercedes", image_url: "assets/shop/f1-19.jpg", framed_a5: 1400, framed_a4: 1600, framed_a3: 2100, print_a5: 520, print_a4: 620, print_a3: 890 },
    { code: "F1-20", name: "Lando Norris · McLaren (V2)", team: "McLaren", image_url: "assets/shop/f1-20.jpg", framed_a5: 1400, framed_a4: 1600, framed_a3: 2100, print_a5: 520, print_a4: 620, print_a3: 890 },
    { code: "F1-21", name: "Max Verstappen · Red Bull (V2)", team: "Red Bull", image_url: "assets/shop/f1-21.jpg", framed_a5: 1400, framed_a4: 1600, framed_a3: 2100, print_a5: 520, print_a4: 620, print_a3: 890 }
  ]
};
