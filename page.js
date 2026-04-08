// ─── REVEAL ANIMATIONS — disabled for eco score ───

// ─── NAV ACTIVE STATE ───
const path = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === path || href === path.replace(/\.html$/, '')) {
    a.classList.add('active');
  }
});

// ─── MOBILE NAV TOGGLE ───
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('main-nav');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
}

// ─── SEARCH BAR (FR inner pages) ───
const SEARCH_DATA = [
  { title: 'Cycle Ingénieur Grande École', cat: 'Formation · Bac → Bac+5', icon: '◆', href: 'formations.html' },
  { title: 'Ingénieur en Alternance', cat: 'Formation · 3 ans', icon: '↻', href: 'formations.html#alternance' },
  { title: 'Masters & Mastères Spécialisés', cat: 'Formation · Bac+5', icon: '◈', href: 'formations.html' },
  { title: 'Bachelor Développeur Informatique', cat: 'Formation · Bac+3', icon: '◇', href: 'formations.html' },
  { title: 'Formation Continue & VAE', cat: 'Formation · Pro', icon: '▲', href: 'formations.html' },
  { title: 'Doubles Diplômes Internationaux', cat: 'International', icon: '◉', href: 'international.html' },
  { title: 'HEI — Énergie & Industrie', cat: 'Programme Grande École', icon: '◆', href: 'hei.html' },
  { title: 'ISEN — Numérique & IA', cat: 'Programme Grande École', icon: '◈', href: 'isen.html' },
  { title: 'ISA — Agriculture & Environnement', cat: 'Programme Grande École', icon: '◇', href: 'isa.html' },
  { title: 'Campus de Lille', cat: 'Campus', icon: '◉', href: 'campus.html' },
  { title: 'Campus de Bordeaux', cat: 'Campus', icon: '◉', href: 'campus.html' },
  { title: 'Candidater — Admissions', cat: 'Admissions', icon: '▸', href: 'admissions.html' },
  { title: 'Parcoursup', cat: 'Admissions', icon: '▸', href: 'admissions.html' },
  { title: 'Contact & Portes ouvertes', cat: 'Contact', icon: '◈', href: 'contact.html' },
  { title: 'Politique RSE & Éco-score', cat: "L'École", icon: '✦', href: 'ecole.html' },
  { title: 'Réseau Alumni', cat: "L'École", icon: '◆', href: 'ecole.html' },
  { title: 'Entreprises & Partenariats', cat: 'Entreprises', icon: '◇', href: 'entreprises.html' },
  { title: 'Brochures & Documents', cat: 'Documents', icon: '↓', href: 'brochures.html' },
  { title: 'Programmes Grande École', cat: 'Programmes', icon: '◆', href: 'programmes.html' },
];

const searchWrap = document.getElementById('searchWrap');
const searchBtn = document.getElementById('searchBtn');
const searchPanel = document.getElementById('searchPanel');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const searchDropdown = document.getElementById('searchDropdown');

if (searchBtn) {
  let searchOpen = false;

  function openSearch() {
    searchOpen = true;
    searchWrap.classList.add('open');
    searchPanel.setAttribute('aria-hidden', 'false');
    searchBtn.setAttribute('aria-expanded', 'true');
    setTimeout(() => searchInput.focus(), 60);
    renderResults('');
  }

  function closeSearch() {
    searchOpen = false;
    searchWrap.classList.remove('open', 'has-results');
    searchPanel.setAttribute('aria-hidden', 'true');
    searchBtn.setAttribute('aria-expanded', 'false');
    searchInput.value = '';
    searchDropdown.innerHTML = '';
  }

  function highlight(text, query) {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return text.slice(0, idx) +
      '<mark style="background:var(--ps);color:var(--p);border-radius:3px;padding:0 2px;">' +
      text.slice(idx, idx + query.length) + '</mark>' +
      text.slice(idx + query.length);
  }

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    const results = q === ''
      ? SEARCH_DATA.slice(0, 6)
      : SEARCH_DATA.filter(d =>
          d.title.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q)
        ).slice(0, 8);

    const label = q === '' ? 'Liens rapides' : 'Résultats';
    let html = '<span class="sdrop-label">' + label + '</span>';

    if (results.length === 0) {
      html += '<div class="sdrop-empty">Aucun résultat trouvé</div>';
    } else {
      results.forEach((item, idx) => {
        html += '<a class="sdrop-item" href="' + item.href + '" role="option">' +
          '<span class="sdrop-icon">' + item.icon + '</span>' +
          '<span>' +
          '<span class="sdrop-title">' + highlight(item.title, q) + '</span>' +
          '<span class="sdrop-cat">' + item.cat + '</span>' +
          '</span></a>';
        if (idx === 2 && results.length > 3 && q === '') {
          html += '<div class="sdrop-divider"></div>';
        }
      });
    }

    searchDropdown.innerHTML = html;
    searchWrap.classList.add('has-results');
    searchDropdown.querySelectorAll('.sdrop-item').forEach(item => {
      item.addEventListener('click', closeSearch);
    });
  }

  searchBtn.addEventListener('click', () => searchOpen ? closeSearch() : openSearch());
  searchClear.addEventListener('click', () => { searchInput.value = ''; searchInput.focus(); renderResults(''); });
  searchInput.addEventListener('input', (e) => renderResults(e.target.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); searchBtn.focus(); }
    if (e.key === 'Enter') { const first = searchDropdown.querySelector('.sdrop-item'); if (first) first.click(); }
    if (e.key === 'ArrowDown') { const items = searchDropdown.querySelectorAll('.sdrop-item'); if (items.length) items[0].focus(); e.preventDefault(); }
  });
  searchDropdown.addEventListener('keydown', (e) => {
    const items = [...searchDropdown.querySelectorAll('.sdrop-item')];
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' && idx < items.length - 1) { items[idx + 1].focus(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { idx > 0 ? items[idx - 1].focus() : searchInput.focus(); e.preventDefault(); }
    if (e.key === 'Escape') { closeSearch(); searchBtn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (searchOpen && !searchWrap.contains(e.target)) closeSearch();
  });
}

// ─── LANGUAGE TOGGLE (inner FR pages → EN) ───
(function(){
  var btn = document.getElementById('langToggle');
  if (!btn) return;
  // Derive the current page filename and build en/ path
  var page = window.location.pathname.split('/').pop() || 'index.html';
  if (!page.endsWith('.html')) page = 'index.html';
  btn.addEventListener('click', function(){
    window.location.href = 'en/' + page;
  });
  // Style the button as "active" class is not needed — it stays FR/EN
  btn.setAttribute('aria-label', 'Passer en anglais');
})();
