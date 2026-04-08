// ─── SEARCH — Shared for all inner pages (FR) ───
const SEARCH_DATA = [
  { title: 'Cycle Ingénieur Grande École', titleEN: 'Engineering Grande École Programme', cat: 'Formation · Bac → Bac+5', catEN: 'Course · Bac → Bac+5', icon: '🏛️', href: 'formations.html' },
  { title: 'Ingénieur en Alternance', titleEN: 'Work-Study Engineering', cat: 'Formation · 3 ans', catEN: 'Course · 3 years', icon: '🔄', href: 'formations.html#alternance' },
  { title: 'Masters & Mastères Spécialisés', titleEN: 'Masters & Specialised Degrees', cat: 'Formation · Bac+5', catEN: 'Course · Bac+5', icon: '🔬', href: 'formations.html' },
  { title: 'Bachelor Développeur Informatique', titleEN: 'Bachelor in Software Development', cat: 'Formation · Bac+3', catEN: 'Course · Bac+3', icon: '💻', href: 'formations.html' },
  { title: 'Formation Continue & VAE', titleEN: 'Continuing Education & RPL', cat: 'Formation · Pro', catEN: 'Course · Professional', icon: '📈', href: 'formations.html' },
  { title: 'Doubles Diplômes Internationaux', titleEN: 'International Double Degrees', cat: 'International', catEN: 'International', icon: '✈️', href: 'international.html' },
  { title: 'HEI — Énergie & Industrie', titleEN: 'HEI — Energy & Industry', cat: 'Programme Grande École', catEN: 'Grande École Programme', icon: '⚡', href: 'hei.html' },
  { title: 'ISEN — Numérique & IA', titleEN: 'ISEN — Digital & AI', cat: 'Programme Grande École', catEN: 'Grande École Programme', icon: '💡', href: 'isen.html' },
  { title: 'ISA — Agriculture & Environnement', titleEN: 'ISA — Agriculture & Environment', cat: 'Programme Grande École', catEN: 'Grande École Programme', icon: '🌱', href: 'isa.html' },
  { title: 'Campus de Lille', titleEN: 'Lille Campus', cat: 'Campus', catEN: 'Campus', icon: '📍', href: 'campus.html' },
  { title: 'Campus de Bordeaux', titleEN: 'Bordeaux Campus', cat: 'Campus', catEN: 'Campus', icon: '📍', href: 'campus.html' },
  { title: 'Candidater — Admissions', titleEN: 'Apply — Admissions', cat: 'Admissions', catEN: 'Admissions', icon: '🎓', href: 'admissions.html' },
  { title: 'Parcoursup', titleEN: 'Parcoursup Application', cat: 'Admissions', catEN: 'Admissions', icon: '📝', href: 'admissions.html' },
  { title: "Contact & Portes ouvertes", titleEN: 'Contact & Open Days', cat: 'Contact', catEN: 'Contact', icon: '📅', href: 'contact.html' },
  { title: "Politique RSE & Éco-score", titleEN: 'CSR Policy & Eco Score', cat: "L'École", catEN: 'The School', icon: '♻️', href: 'ecole.html' },
  { title: 'Réseau Alumni', titleEN: 'Alumni Network', cat: "L'École", catEN: 'The School', icon: '🤝', href: 'ecole.html' },
  { title: 'Entreprises & Partenariats', titleEN: 'Companies & Partnerships', cat: 'Entreprises', catEN: 'Companies', icon: '🏢', href: 'entreprises.html' },
  { title: 'Brochures & Documents', titleEN: 'Brochures & Documents', cat: 'Documents', catEN: 'Documents', icon: '📥', href: 'brochures.html' },
  { title: 'Programmes Grande École', titleEN: 'Grande École Programmes', cat: 'Programmes', catEN: 'Programmes', icon: '🎓', href: 'programmes.html' },
];

const searchWrap = document.getElementById('searchWrap');
const searchBtn = document.getElementById('searchBtn');
const searchPanel = document.getElementById('searchPanel');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const searchDropdown = document.getElementById('searchDropdown');

if (!searchBtn) { /* search not present on this page */ return; }

let searchOpen = false;
const isEN = () => document.documentElement.lang === 'en';

function openSearch() {
  searchOpen = true;
  searchWrap.classList.add('open');
  searchPanel.setAttribute('aria-hidden', 'false');
  searchBtn.setAttribute('aria-expanded', 'true');
  setTimeout(() => searchInput && searchInput.focus(), 60);
  renderResults('');
}

function closeSearch() {
  searchOpen = false;
  searchWrap.classList.remove('open', 'has-results');
  searchPanel.setAttribute('aria-hidden', 'true');
  searchBtn.setAttribute('aria-expanded', 'false');
  if (searchInput) searchInput.value = '';
  if (searchDropdown) searchDropdown.innerHTML = '';
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
  const en = isEN();
  const q = query.trim().toLowerCase();
  const results = q === ''
    ? SEARCH_DATA.slice(0, 6)
    : SEARCH_DATA.filter(d =>
        (en ? d.titleEN : d.title).toLowerCase().includes(q) ||
        (en ? d.catEN : d.cat).toLowerCase().includes(q)
      ).slice(0, 8);

  const labelText = q === '' ? (en ? 'Quick links' : 'Liens rapides') : (en ? 'Results' : 'Résultats');
  let html = '<span class="sdrop-label">' + labelText + '</span>';

  if (results.length === 0) {
    html += '<div class="sdrop-empty">' + (en ? 'No results found' : 'Aucun résultat trouvé') + '</div>';
  } else {
    results.forEach((item, idx) => {
      const title = en ? item.titleEN : item.title;
      const cat = en ? item.catEN : item.cat;
      html += '<a class="sdrop-item" href="' + item.href + '" role="option">' +
        '<span class="sdrop-icon">' + item.icon + '</span>' +
        '<span>' +
        '<span class="sdrop-title">' + highlight(title, q) + '</span>' +
        '<span class="sdrop-cat">' + cat + '</span>' +
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
  if (e.key === 'Enter') {
    const first = searchDropdown.querySelector('.sdrop-item');
    if (first) first.click();
  }
  if (e.key === 'ArrowDown') {
    const items = searchDropdown.querySelectorAll('.sdrop-item');
    if (items.length) items[0].focus();
    e.preventDefault();
  }
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
