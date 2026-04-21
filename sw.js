/* ─── JUNIA Service Worker — sw.js ───────────────────────────────────────
   Strategies:
     HTML  → Network First  (fresh content when online, cache fallback offline)
     Assets → Cache First  (instant load; network update in background)
   Delete this file + its <script> registration to remove offline support.
   ───────────────────────────────────────────────────────────────────── */

const CACHE = 'junia-offline-v1';

/* Pages to pre-cache at install time (clean URLs — Netlify strips .html) */
const PAGES = [
  '/',
  '/formations',
  '/ecole',
  '/campus',
  '/contact',
  '/international',
  '/entreprises',
  '/admissions',
  '/hei',
  '/isen',
  '/isa',
  '/mentions-legales',
  '/confidentialite',
  '/accessibilite',
];

/* Static assets to pre-cache */
const ASSETS = [
  '/styles.css',
  '/page.css',
  '/main.js',
  '/page.js',
  '/page-search.js',
  '/reading-mode.css',
  '/reading-mode.js',
  '/offline-mode.css',
  '/offline-mode.js',
];

/* Fallback page served when a navigation request is offline and not cached */
const FALLBACK_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Page non disponible hors connexion — JUNIA</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Georgia,'Times New Roman',serif;background:#fff;color:#111;
       max-width:65ch;margin:4rem auto;padding:2rem 1rem;line-height:1.85}
  h1{font-size:1.55rem;margin-bottom:.9rem}
  p{font-size:1.1rem;margin-bottom:1.4rem;color:#444}
  ul{padding-left:1.4rem;margin-bottom:1.4rem}
  li{margin-bottom:.55rem}
  a{color:#3F2A56;font-weight:600}
  .badge{display:inline-block;background:#fff3f0;color:#d94420;font-family:
         -apple-system,'Segoe UI',sans-serif;font-size:.72rem;font-weight:700;
         padding:.22rem .7rem;border-radius:99px;margin-bottom:1.4rem}
</style>
</head>
<body>
<div class="badge">Mode hors connexion</div>
<h1>Cette page n'est pas disponible hors ligne.</h1>
<p>Reconnectez-vous pour accéder à l'ensemble du site JUNIA.
   Les pages suivantes sont disponibles dans votre cache&nbsp;:</p>
<ul>
  <li><a href="/">Accueil — JUNIA</a></li>
  <li><a href="/formations">Formations &amp; Admissions</a></li>
  <li><a href="/ecole">L'École JUNIA</a></li>
  <li><a href="/campus">Nos Campus</a></li>
  <li><a href="/contact">Contact &amp; Portes ouvertes</a></li>
  <li><a href="/international">International</a></li>
  <li><a href="/entreprises">Entreprises &amp; Partenariats</a></li>
  <li><a href="/admissions">Admissions</a></li>
  <li><a href="/hei">HEI — Énergie &amp; Industrie</a></li>
  <li><a href="/isen">ISEN — Numérique &amp; IA</a></li>
  <li><a href="/isa">ISA — Agriculture &amp; Environnement</a></li>
</ul>
<p style="font-size:.9rem;color:#888">
  JUNIA — Grande École des Transitions · Lille · Bordeaux · Châteauroux
</p>
</body>
</html>`;

/* ── Install: pre-cache everything ──────────────────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled([
        ...PAGES.map(url =>
          cache.add(new Request(url, { credentials: 'same-origin' })).catch(() => {})
        ),
        ...ASSETS.map(url =>
          cache.add(new Request(url, { credentials: 'same-origin' })).catch(() => {})
        ),
      ])
    ).then(() => self.skipWaiting())
  );
});

/* ── Activate: purge stale caches ───────────────────────────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch ───────────────────────────────────────────────────────────── */
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  /* Only intercept same-origin requests */
  if (url.origin !== self.location.origin) return;

  /* Ignore non-GET */
  if (req.method !== 'GET') return;

  const path = url.pathname;
  const isNavigation = req.mode === 'navigate';
  const isAsset = /\.(css|js|woff2?|ttf|otf|png|jpg|jpeg|gif|webp|svg|ico)(\?.*)?$/.test(path);

  /* ── HTML pages: Network First ── */
  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            caches.open(CACHE).then(cache => cache.put(req, res.clone()));
          }
          return res;
        })
        .catch(() => lookupPage(req, url))
    );
    return;
  }

  /* ── Static assets: Cache First ── */
  if (isAsset) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) {
          /* Update cache in background */
          fetch(req).then(res => {
            if (res && res.status === 200) {
              caches.open(CACHE).then(cache => cache.put(req, res));
            }
          }).catch(() => {});
          return cached;
        }
        return fetch(req).then(res => {
          if (res && res.status === 200) {
            caches.open(CACHE).then(cache => cache.put(req, res.clone()));
          }
          return res;
        }).catch(() => new Response('', { status: 404 }));
      })
    );
  }
});

/* ── Page lookup: try both clean URL and .html form ─────────────────── */
function lookupPage(req, url) {
  return caches.match(req).then(cached => {
    if (cached) return cached;

    /* Try stripping .html (e.g. /formations.html → /formations) */
    if (url.pathname.endsWith('.html')) {
      const clean = url.pathname.replace(/\.html$/, '');
      return caches.match(new Request(url.origin + clean)).then(cached2 => {
        if (cached2) return cached2;
        return offlineFallback();
      });
    }

    /* Try adding .html (e.g. /formations → /formations.html) */
    return caches.match(new Request(url.origin + url.pathname + '.html')).then(cached3 => {
      return cached3 || offlineFallback();
    });
  });
}

function offlineFallback() {
  return new Response(FALLBACK_HTML, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
