// ─── SCROLL REVEAL ───
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('vis'), (i % 4) * 80);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.rv, .rl, .rr').forEach(el => io.observe(el));

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

// ─── LANGUAGE TOGGLE (EN → FR) ───
const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    // Netlify strips .html from URLs — add it back before navigating to FR equivalent
    let page = window.location.pathname.split('/').pop() || '';
    if (!page) page = 'index';
    if (!page.endsWith('.html')) page += '.html';
    window.location.href = '../' + page;
  });
}

// ─── SEARCH DATA (English) ───
const SEARCH_DATA = [
  { title: 'Grande École Engineering Programme', cat: 'Course · Bac → Bac+5', icon: '◆', href: 'formations.html' },
  { title: 'Work-Study Engineering', cat: 'Course · 3 years', icon: '↻', href: 'formations.html#alternance' },
  { title: 'Masters & Specialised Degrees', cat: 'Course · Bac+5', icon: '◈', href: 'formations.html' },
  { title: 'Bachelor in Software Development', cat: 'Course · Bac+3', icon: '◇', href: 'formations.html' },
  { title: 'Continuing Education & RPL', cat: 'Course · Professional', icon: '▲', href: 'formations.html' },
  { title: 'International Double Degrees', cat: 'International', icon: '◉', href: 'international.html' },
  { title: 'HEI — Energy & Industry', cat: 'Grande École Programme', icon: '◆', href: 'hei.html' },
  { title: 'ISEN — Digital & AI', cat: 'Grande École Programme', icon: '◈', href: 'isen.html' },
  { title: 'ISA — Agriculture & Environment', cat: 'Grande École Programme', icon: '◇', href: 'isa.html' },
  { title: 'Lille Campus', cat: 'Campus', icon: '◉', href: 'campus.html' },
  { title: 'Bordeaux Campus', cat: 'Campus', icon: '◉', href: 'campus.html' },
  { title: 'Apply — Admissions', cat: 'Admissions', icon: '▸', href: 'admissions.html' },
  { title: 'Parcoursup Application', cat: 'Admissions', icon: '▸', href: 'admissions.html' },
  { title: 'Contact & Open Days', cat: 'Contact', icon: '◈', href: 'contact.html' },
  { title: 'Alumni Network', cat: 'The School', icon: '◆', href: 'ecole.html' },
  { title: 'Companies & Partnerships', cat: 'Companies', icon: '◇', href: 'entreprises.html' },
  { title: 'Brochures & Documents', cat: 'Documents', icon: '↓', href: 'brochures.html' },
  { title: 'The School — JUNIA', cat: 'The School', icon: '▸', href: 'ecole.html' },
];

// ─── SEARCH BAR (LAZY INIT) ───
const searchWrap = document.getElementById('searchWrap');
const searchBtn = document.getElementById('searchBtn');
let searchPanel, searchInput, searchClear, searchDropdown;
let searchOpen = false;

function initSearchUI() {
  if (searchPanel) return;
  searchPanel = document.createElement('div');
  searchPanel.className = 'search-panel';
  searchPanel.id = 'searchPanel';
  searchPanel.setAttribute('role', 'search');
  searchPanel.setAttribute('aria-hidden', 'true');

  searchInput = document.createElement('input');
  searchInput.className = 'search-input';
  searchInput.type = 'text';
  searchInput.placeholder = 'Search programmes, campus…';
  searchInput.autocomplete = 'off';
  searchInput.setAttribute('aria-label', 'Search');

  searchClear = document.createElement('button');
  searchClear.className = 'search-clear';
  searchClear.setAttribute('aria-label', 'Clear');
  searchClear.textContent = '✕';

  searchDropdown = document.createElement('div');
  searchDropdown.className = 'search-dropdown';
  searchDropdown.setAttribute('role', 'listbox');
  searchDropdown.setAttribute('aria-label', 'Search suggestions');

  searchPanel.append(searchInput, searchClear);
  searchWrap.append(searchPanel, searchDropdown);

  searchClear.addEventListener('click', () => { searchInput.value = ''; searchInput.focus(); renderResults(''); });
  searchInput.addEventListener('input', (e) => renderResults(e.target.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); searchBtn.focus(); }
    if (e.key === 'Enter') { const f = searchDropdown.querySelector('.sdrop-item'); if (f) f.click(); }
    if (e.key === 'ArrowDown') { const items = searchDropdown.querySelectorAll('.sdrop-item'); if (items.length) items[0].focus(); e.preventDefault(); }
  });
  searchDropdown.addEventListener('keydown', (e) => {
    const items = [...searchDropdown.querySelectorAll('.sdrop-item')];
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' && idx < items.length - 1) { items[idx + 1].focus(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { idx > 0 ? items[idx - 1].focus() : searchInput.focus(); e.preventDefault(); }
    if (e.key === 'Escape') { closeSearch(); searchBtn.focus(); }
  });
}

function openSearch() {
  initSearchUI();
  searchOpen = true;
  searchWrap.classList.add('open');
  searchPanel.setAttribute('aria-hidden', 'false');
  searchBtn.setAttribute('aria-expanded', 'true');
  setTimeout(() => searchInput.focus(), 60);
  renderResults('');
}

function closeSearch() {
  if (!searchPanel) return;
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
    `<mark style="background:var(--ps);color:var(--p);border-radius:3px;padding:0 2px;">${text.slice(idx, idx + query.length)}</mark>` +
    text.slice(idx + query.length);
}

function renderResults(query) {
  const q = query.trim().toLowerCase();
  const results = q === ''
    ? SEARCH_DATA.slice(0, 6)
    : SEARCH_DATA.filter(d =>
        d.title.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q)
      ).slice(0, 8);

  const labelText = q === '' ? 'Quick links' : 'Results';
  let html = `<span class="sdrop-label">${labelText}</span>`;

  if (results.length === 0) {
    html += `<div class="sdrop-empty">No results found</div>`;
  } else {
    results.forEach((item, idx) => {
      html += `<a class="sdrop-item" href="${item.href}" role="option"><span class="sdrop-icon">${item.icon}</span><span><span class="sdrop-title">${highlight(item.title, q)}</span><span class="sdrop-cat">${item.cat}</span></span></a>`;
      if (idx === 2 && results.length > 3 && q === '') html += `<div class="sdrop-divider"></div>`;
    });
  }

  searchDropdown.innerHTML = html;
  searchWrap.classList.add('has-results');
  searchDropdown.querySelectorAll('.sdrop-item').forEach(item => {
    item.addEventListener('click', closeSearch);
  });
}

if (searchBtn) {
  searchBtn.addEventListener('click', () => searchOpen ? closeSearch() : openSearch());
  document.addEventListener('click', (e) => {
    if (searchOpen && searchWrap && !searchWrap.contains(e.target)) closeSearch();
  });
}
