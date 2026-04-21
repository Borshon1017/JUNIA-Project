/* ─── READING MODE — reading-mode.js ───
   Delete this file + its <script> tag to remove the feature entirely.
   Zero side effects on existing CSS / JS.                             */
(function () {
  'use strict';

  var STORAGE_KEY = 'junia-reading-mode';

  /* ── Toggle button ── */
  var btn = document.createElement('button');
  btn.id = 'rm-btn';
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-label', 'Activer le mode lecture');
  btn.innerHTML = '<span aria-hidden="true">&#128214;</span> Mode lecture';
  document.body.appendChild(btn);

  /* ── Print shortcut ── */
  var printBtn = document.createElement('button');
  printBtn.id = 'rm-print';
  printBtn.setAttribute('aria-label', 'Imprimer cette page');
  printBtn.innerHTML = '<span aria-hidden="true">&#128438;</span> Imprimer';
  printBtn.addEventListener('click', function () { window.print(); });
  document.body.appendChild(printBtn);

  /* ── Toast ── */
  var toast = document.createElement('div');
  toast.id = 'rm-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('rm-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('rm-visible'); }, 4000);
  }

  /* ── KB savings from hidden resources ── */
  function calcKbSaved() {
    try {
      var entries = performance.getEntriesByType('resource');
      var saved = 0;
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        var url = e.name.toLowerCase();
        /* Count images and webfonts — these are the decorative-element resources */
        if (/\.(png|jpg|jpeg|gif|webp|svg|avif|ico)(\?.*)?$/.test(url) ||
            /\.(woff2?|ttf|otf|eot)(\?.*)?$/.test(url)) {
          saved += (e.transferSize || e.encodedBodySize || 0);
        }
      }
      return Math.round(saved / 1024);
    } catch (_) {
      return 0;
    }
  }

  /* ── Enable ── */
  function enable(silent) {
    document.body.classList.add('reading-mode');
    btn.classList.add('rm-active');
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', 'Désactiver le mode lecture');
    btn.innerHTML = '<span aria-hidden="true">&#10005;</span> Quitter lecture';
    sessionStorage.setItem(STORAGE_KEY, '1');
    if (!silent) {
      var kb = calcKbSaved();
      var msg = kb > 0
        ? 'Mode lecture activé — ~' + kb + '\u202fKB d\'éléments décoratifs masqués'
        : 'Mode lecture activé — éléments décoratifs masqués';
      showToast(msg);
    }
  }

  /* ── Disable ── */
  function disable() {
    document.body.classList.remove('reading-mode');
    btn.classList.remove('rm-active');
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Activer le mode lecture');
    btn.innerHTML = '<span aria-hidden="true">&#128214;</span> Mode lecture';
    sessionStorage.removeItem(STORAGE_KEY);
    showToast('Mode lecture désactivé');
  }

  /* ── Toggle ── */
  btn.addEventListener('click', function () {
    if (document.body.classList.contains('reading-mode')) {
      disable();
    } else {
      enable(false);
    }
  });

  /* ── Keyboard shortcut: Alt + R ── */
  document.addEventListener('keydown', function (e) {
    if (e.altKey && (e.key === 'r' || e.key === 'R')) {
      btn.click();
    }
  });

  /* ── Restore state from sessionStorage (persists across page navigation) ── */
  if (sessionStorage.getItem(STORAGE_KEY) === '1') {
    enable(true); /* silent restore — no toast */
  }
})();
