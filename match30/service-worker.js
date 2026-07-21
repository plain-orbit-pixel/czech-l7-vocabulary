const CACHE_NAME = "czech-l7-match-30-v4";
const APP_FILES = [
  "./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest",
  "./icon-180.png", "./icon-512.png",
  "./assets/beverage_voda.png", "./assets/beverage_kava.png", "./assets/beverage_caj.png",
  "./assets/dairy_mleko.png", "./assets/bread_chleb.png", "./assets/bread_rohlik.png",
  "./assets/dairy_syr.png", "./assets/dairy_maslo.png", "./assets/meat_vejce.png",
  "./assets/meat_kureci_maso.png", "./assets/fruit_jablko.png", "./assets/fruit_banan.png",
  "./assets/fruit_pomeranc.png", "./assets/vegetable_brambory.png", "./assets/vegetable_rajcata.png",
  "./assets/vegetable_cibule.png", "./assets/vegetable_mrkev.png", "./assets/beverage_pivo.png",
  "./assets/beverage_vino.png", "./assets/sweet_cokolada.png", "./assets/dairy_jogurt.png",
  "./assets/vegetable_paprika.png", "./assets/vegetable_okurka.png", "./assets/vegetable_salat.png",
  "./assets/fruit_jahody.png", "./assets/fruit_hruska.png", "./assets/fruit_citron.png",
  "./assets/meat_sunka.png", "./assets/meat_klobasa.png", "./assets/beverage_dzus.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
