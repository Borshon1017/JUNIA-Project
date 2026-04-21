/* ─── OFFLINE MODE — offline-mode.js ────────────────────────────────────
   Handles: online/offline detection, reading-mode class toggle,
            banner, reading-nav, manual toggle, sessionStorage persistence.
   Fully bilingual: detects html[lang] and uses FR or EN strings throughout.
   Delete this file + its <script> tag to remove the feature entirely.
   Zero side effects on existing CSS / JS.
   ───────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
     1. LANGUAGE
     Detect once; used for all labels, nav links, messages.
     ══════════════════════════════════════════════════════ */
  var isEN = document.documentElement.lang === 'en';

  var T = {
    btnOff:    isEN ? 'Reading mode'         : 'Mode lecture',
    btnOn:     isEN ? 'Exit reading'         : 'Quitter lecture',
    ariaOff:   isEN ? 'Enable reading mode'  : 'Activer le mode lecture',
    ariaOn:    isEN ? 'Disable reading mode' : 'Désactiver le mode lecture',
    dismiss:   isEN ? 'Close banner'         : 'Fermer ce bandeau',
    offline:   isEN
      ? 'You\u2019re offline \u2014 reading mode activated. The page still works fully.'
      : 'Hors connexion \u2014 mode lecture activ\u00e9. La page reste enti\u00e8rement accessible.',
    online:    isEN ? 'Connection restored.'  : 'Connexion r\u00e9tablie.',
    navLabel:  isEN ? 'Reading mode navigation' : 'Navigation mode lecture',
    statusOn:  isEN ? 'Online'               : 'En ligne',
    statusOff: isEN ? 'Offline'              : 'Hors ligne',
  };

  /* Nav links: EN pages live under /en/, FR at root */
  var NAV_LINKS = isEN ? [
    { label: 'Home',       href: '/en/' },
    { label: 'Programmes', href: '/en/formations' },
    { label: 'School',     href: '/en/ecole' },
    { label: 'Campus',     href: '/en/campus' },
    { label: 'Contact',    href: '/en/contact' },
  ] : [
    { label: 'Accueil',    href: '/' },
    { label: 'Formations', href: '/formations' },
    { label: 'École',      href: '/ecole' },
    { label: 'Campus',     href: '/campus' },
    { label: 'Contact',    href: '/contact' },
  ];

  /* ══════════════════════════════════════════════════════
     2. REMOVE PRINT BUTTON
     #rm-print is injected by reading-mode.js. Kill it now
     and again after DOMContentLoaded in case reading-mode.js
     defers after us.
     ══════════════════════════════════════════════════════ */
  function removePrintBtn() {
    var p = document.getElementById('rm-print');
    if (p && p.parentNode) p.parentNode.removeChild(p);
  }
  removePrintBtn();
  document.addEventListener('DOMContentLoaded', removePrintBtn);

  /* ══════════════════════════════════════════════════════
     3. SESSION STORAGE
     ══════════════════════════════════════════════════════ */
  var STORE_KEY = 'readingMode';
  function storeSet(active) {
    try { active ? sessionStorage.setItem(STORE_KEY, 'true') : sessionStorage.removeItem(STORE_KEY); }
    catch (_) {}
  }
  function storeGet() {
    try { return sessionStorage.getItem(STORE_KEY) === 'true'; }
    catch (_) { return false; }
  }

  /* ══════════════════════════════════════════════════════
     4. READING-MODE NAVIGATION BAR
     ══════════════════════════════════════════════════════ */
  function currentPathMatches(href) {
    var p = window.location.pathname;
    /* Root paths */
    if (href === '/') {
      return p === '/' || p === '' || p === '/index.html';
    }
    if (href === '/en/' || href === '/en') {
      return p === '/en/' || p === '/en' || p === '/en/index.html';
    }
    return p === href ||
           p === href + '.html' ||
           p === href + '/' ||
           p.indexOf(href + '.') === 0 ||
           p.indexOf(href + '/') === 0;
  }

  function updateNavStatus() {
    var el = document.getElementById('rn-status');
    if (!el) return;
    var online = navigator.onLine;
    while (el.firstChild) el.removeChild(el.firstChild);
    var d = document.createElement('span');
    d.className = 'rn-dot ' + (online ? 'rn-dot-online' : 'rn-dot-offline');
    d.setAttribute('aria-hidden', 'true');
    var t = document.createElement('span');
    t.textContent = online ? T.statusOn : T.statusOff;
    el.appendChild(d);
    el.appendChild(t);
  }

  function injectReadingNav() {
    if (document.getElementById('reading-nav')) {
      updateNavStatus(); /* already present — just refresh status */
      return;
    }

    var nav = document.createElement('nav');
    nav.id = 'reading-nav';
    nav.setAttribute('aria-label', T.navLabel);

    var left = document.createElement('div');
    left.className = 'rn-left';

    var brand = document.createElement('span');
    brand.className = 'rn-brand';
    brand.textContent = 'JUNIA';
    left.appendChild(brand);

    NAV_LINKS.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      a.className = currentPathMatches(item.href) ? 'rn-link rn-active' : 'rn-link';
      left.appendChild(a);
    });

    var right = document.createElement('div');
    right.className = 'rn-right';
    right.id = 'rn-status';

    nav.appendChild(left);
    nav.appendChild(right);

    /* Slot in right after #om-banner so it sits in the normal flow below it */
    var bannerEl = document.getElementById('om-banner');
    if (bannerEl) {
      bannerEl.parentNode.insertBefore(nav, bannerEl.nextSibling);
    } else {
      document.body.insertBefore(nav, document.body.firstChild);
    }

    updateNavStatus();
  }

  function removeReadingNav() {
    var nav = document.getElementById('reading-nav');
    if (nav && nav.parentNode) nav.parentNode.removeChild(nav);
  }

  /* ══════════════════════════════════════════════════════
     5. BUILD OFFLINE BANNER
     ══════════════════════════════════════════════════════ */
  var banner   = document.createElement('div');
  var dot      = document.createElement('span');
  var statusEl = document.createElement('span');
  var dismiss  = document.createElement('button');

  banner.id = 'om-banner';
  banner.setAttribute('role', 'status');
  banner.setAttribute('aria-live', 'polite');

  dot.id = 'om-dot';
  dot.setAttribute('aria-hidden', 'true');

  statusEl.id = 'om-status';

  dismiss.id = 'om-dismiss';
  dismiss.setAttribute('aria-label', T.dismiss);
  dismiss.textContent = '\u2715'; /* ✕ */
  dismiss.addEventListener('click', dismissBanner);

  banner.appendChild(dot);
  banner.appendChild(statusEl);
  banner.appendChild(dismiss);

  /* Insert as body's first child — reading-nav will slot in right after it */
  document.body.insertBefore(banner, document.body.firstChild);

  /* ══════════════════════════════════════════════════════
     6. BUILD TOGGLE BUTTON
     We always create our own #om-btn with the correct language
     label. reading-mode.js's #rm-btn is hidden via offline-mode.css
     so there is never a duplicate visible button.
     ══════════════════════════════════════════════════════ */
  var toggleBtn = document.createElement('button');
  toggleBtn.id = 'om-btn';
  toggleBtn.setAttribute('aria-pressed', 'false');
  toggleBtn.setAttribute('aria-label', T.ariaOff);
  toggleBtn.textContent = T.btnOff;
  document.body.appendChild(toggleBtn);
  toggleBtn.addEventListener('click', onToggleClick);

  /* ══════════════════════════════════════════════════════
     7. MUTATION OBSERVER
     Watches body.classList for reading-mode additions from
     ANY source — including reading-mode.js's own sessionStorage
     restore — so the nav and button stay in sync regardless
     of which script triggered the toggle.
     ══════════════════════════════════════════════════════ */
  if (window.MutationObserver) {
    new MutationObserver(function () {
      if (document.body.classList.contains('reading-mode')) {
        injectReadingNav();
        updateBtnState(true);
      } else {
        removeReadingNav();
        updateBtnState(false);
      }
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  /* ══════════════════════════════════════════════════════
     8. STATE
     ══════════════════════════════════════════════════════ */
  var dismissed      = false;
  var fadeTimer      = null;
  var offlineTrigger = false; /* true when reading mode was forced by going offline */

  /* ══════════════════════════════════════════════════════
     9. BANNER HELPERS
     ══════════════════════════════════════════════════════ */
  function showBanner(text, isOnline) {
    dismissed = false;
    clearTimeout(fadeTimer);
    banner.classList.remove('om-fade');
    statusEl.textContent = text;
    dot.className = isOnline ? 'om-online' : '';
    banner.classList.add('om-show');
  }

  function dismissBanner() {
    banner.classList.add('om-fade');
    fadeTimer = setTimeout(function () {
      banner.classList.remove('om-show', 'om-fade');
    }, 950);
    dismissed = true;
  }

  /* ══════════════════════════════════════════════════════
     10. BUTTON STATE SYNC
     ══════════════════════════════════════════════════════ */
  function updateBtnState(active) {
    if (active) {
      toggleBtn.textContent = T.btnOn;
      toggleBtn.setAttribute('aria-pressed', 'true');
      toggleBtn.setAttribute('aria-label', T.ariaOn);
    } else {
      toggleBtn.textContent = T.btnOff;
      toggleBtn.setAttribute('aria-pressed', 'false');
      toggleBtn.setAttribute('aria-label', T.ariaOff);
    }
  }

  /* ══════════════════════════════════════════════════════
     11. READING MODE CORE
     Only touches the class + sessionStorage.
     MutationObserver (section 7) reacts and handles
     nav injection and button label update.
     ══════════════════════════════════════════════════════ */
  function enableReading() {
    document.body.classList.add('reading-mode');
    storeSet(true);
  }

  function disableReading() {
    document.body.classList.remove('reading-mode');
    storeSet(false);
  }

  function onToggleClick() {
    if (document.body.classList.contains('reading-mode')) {
      offlineTrigger = false; /* manual override cancels auto-trigger */
      disableReading();
    } else {
      enableReading();
    }
  }

  /* ══════════════════════════════════════════════════════
     12. ONLINE / OFFLINE HANDLERS
     ══════════════════════════════════════════════════════ */
  function handleOffline() {
    offlineTrigger = true;
    enableReading();
    /* updateNavStatus() is a safe no-op if nav isn't injected yet;
       MutationObserver will call injectReadingNav() → updateNavStatus() */
    updateNavStatus();
    if (!dismissed) showBanner(T.offline, false);
  }

  function handleOnline() {
    /* Only auto-exit reading mode if it was forced by going offline */
    if (offlineTrigger) {
      offlineTrigger = false;
      disableReading();
    }
    updateNavStatus();
    showBanner(T.online, true);
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(dismissBanner, 3000);
  }

  /* ══════════════════════════════════════════════════════
     13. PAGE LOAD — restore from sessionStorage
     Explicit synchronous call so the nav appears before
     any user interaction, without waiting for the observer.
     ══════════════════════════════════════════════════════ */
  if (storeGet()) {
    document.body.classList.add('reading-mode');
    injectReadingNav();  /* synchronous — no visible flash */
    updateBtnState(true);
  }

  /* ══════════════════════════════════════════════════════
     14. INITIAL OFFLINE CHECK
     ══════════════════════════════════════════════════════ */
  if (typeof navigator.onLine === 'boolean' && !navigator.onLine) {
    handleOffline();
  }

  /* ══════════════════════════════════════════════════════
     15. EVENT LISTENERS
     ══════════════════════════════════════════════════════ */
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online',  handleOnline);

})();
