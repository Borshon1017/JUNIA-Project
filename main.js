// ─── SCROLL REVEAL — disabled for eco score ───

// ─── TAB FILTER ───
function setTab(el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
}

// ─── NUMBER COUNTERS ───
const nio = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.t;
    const suffix = el.dataset.s || '';
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / 1800, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target).toLocaleString('fr-FR') + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    nio.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.nval[data-t]').forEach(n => nio.observe(n));

// ─── MOBILE NAV ───
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('main-nav');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navToggle.focus();
    }
  });
}

// ─── SEARCH BAR ───
const SEARCH_DATA = [
  { title: 'Cycle Ingénieur Grande École', titleEN: 'Engineering Grande École Programme', cat: 'Formation · Bac → Bac+5', catEN: 'Course · Bac → Bac+5', icon: '◆', href: 'formations.html' },
  { title: 'Ingénieur en Alternance', titleEN: 'Work-Study Engineering', cat: 'Formation · 3 ans', catEN: 'Course · 3 years', icon: '↻', href: 'formations.html#alternance' },
  { title: 'Masters & Mastères Spécialisés', titleEN: 'Masters & Specialised Degrees', cat: 'Formation · Bac+5', catEN: 'Course · Bac+5', icon: '◈', href: 'formations.html' },
  { title: 'Bachelor Développeur Informatique', titleEN: 'Bachelor in Software Development', cat: 'Formation · Bac+3', catEN: 'Course · Bac+3', icon: '◇', href: 'formations.html' },
  { title: 'Formation Continue & VAE', titleEN: 'Continuing Education & RPL', cat: 'Formation · Pro', catEN: 'Course · Professional', icon: '▲', href: 'formations.html' },
  { title: 'Doubles Diplômes Internationaux', titleEN: 'International Double Degrees', cat: 'International', catEN: 'International', icon: '◉', href: 'international.html' },
  { title: 'HEI — Énergie & Industrie', titleEN: 'HEI — Energy & Industry', cat: 'Programme Grande École', catEN: 'Grande École Programme', icon: '◆', href: 'hei.html' },
  { title: 'ISEN — Numérique & IA', titleEN: 'ISEN — Digital & AI', cat: 'Programme Grande École', catEN: 'Grande École Programme', icon: '◈', href: 'isen.html' },
  { title: 'ISA — Agriculture & Environnement', titleEN: 'ISA — Agriculture & Environment', cat: 'Programme Grande École', catEN: 'Grande École Programme', icon: '◇', href: 'isa.html' },
  { title: 'Campus de Lille', titleEN: 'Lille Campus', cat: 'Campus', catEN: 'Campus', icon: '◉', href: 'campus.html' },
  { title: 'Campus de Bordeaux', titleEN: 'Bordeaux Campus', cat: 'Campus', catEN: 'Campus', icon: '◉', href: 'campus.html' },
  { title: 'Candidater — Admissions', titleEN: 'Apply — Admissions', cat: 'Admissions', catEN: 'Admissions', icon: '▸', href: 'admissions.html' },
  { title: 'Parcoursup', titleEN: 'Parcoursup Application', cat: 'Admissions', catEN: 'Admissions', icon: '▸', href: 'admissions.html' },
  { title: "Contact & Portes ouvertes", titleEN: 'Contact & Open Days', cat: 'Contact', catEN: 'Contact', icon: '◈', href: 'contact.html' },
  { title: 'Politique RSE & Éco-score', titleEN: 'CSR Policy & Eco Score', cat: "L'École", catEN: 'The School', icon: '✦', href: 'ecole.html' },
  { title: 'Réseau Alumni', titleEN: 'Alumni Network', cat: "L'École", catEN: 'The School', icon: '◆', href: 'ecole.html' },
  { title: 'Entreprises & Partenariats', titleEN: 'Companies & Partnerships', cat: 'Entreprises', catEN: 'Companies', icon: '◇', href: 'entreprises.html' },
  { title: 'Brochures & Documents', titleEN: 'Brochures & Documents', cat: 'Documents', catEN: 'Documents', icon: '↓', href: 'brochures.html' },
];

const searchWrap = document.getElementById('searchWrap');
const searchBtn = document.getElementById('searchBtn');
const searchPanel = document.getElementById('searchPanel');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const searchDropdown = document.getElementById('searchDropdown');

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

function renderResults(query) {
  const isEN = document.documentElement.lang === 'en';
  const q = query.trim().toLowerCase();
  const results = q === ''
    ? SEARCH_DATA.slice(0, 6)
    : SEARCH_DATA.filter(d =>
        (isEN ? d.titleEN : d.title).toLowerCase().includes(q) ||
        (isEN ? d.catEN : d.cat).toLowerCase().includes(q)
      ).slice(0, 8);

  const labelText = q === '' ? (isEN ? 'Quick links' : 'Liens rapides') : (isEN ? 'Results' : 'Résultats');
  let html = `<span class="sdrop-label">${labelText}</span>`;

  if (results.length === 0) {
    html += `<div class="sdrop-empty">${isEN ? 'No results found' : 'Aucun résultat trouvé'}</div>`;
  } else {
    results.forEach((item, idx) => {
      const title = isEN ? item.titleEN : item.title;
      const cat = isEN ? item.catEN : item.cat;
      html += `
        <a class="sdrop-item" href="${item.href}" role="option">
          <span class="sdrop-icon">${item.icon}</span>
          <span>
            <span class="sdrop-title">${highlight(title, q)}</span>
            <span class="sdrop-cat">${cat}</span>
          </span>
        </a>`;
      if (idx === 2 && results.length > 3 && q === '') {
        html += `<div class="sdrop-divider"></div>`;
      }
    });
  }

  searchDropdown.innerHTML = html;
  searchWrap.classList.add('has-results');

  // Close on item click
  searchDropdown.querySelectorAll('.sdrop-item').forEach(item => {
    item.addEventListener('click', closeSearch);
  });
}

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return text.slice(0, idx) +
    `<mark style="background:var(--ps);color:var(--p);border-radius:3px;padding:0 2px;">${text.slice(idx, idx + query.length)}</mark>` +
    text.slice(idx + query.length);
}

if (searchBtn) {
  searchBtn.addEventListener('click', () => searchOpen ? closeSearch() : openSearch());
  searchClear.addEventListener('click', () => { searchInput.value = ''; searchInput.focus(); renderResults(''); });
  searchInput.addEventListener('input', (e) => renderResults(e.target.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); searchBtn.focus(); }
    if (e.key === 'Enter') {
      const first = searchDropdown.querySelector('.sdrop-item');
      if (first) { first.click(); }
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
}

// ─── LANGUAGE TOGGLE (FR ↔ EN) ───
const TRANSLATIONS = {
  // NAV
  'Formations': 'Programmes',
  'Programmes': 'Programmes',
  "L'École": 'The School',
  'International': 'International',
  'Entreprises': 'Companies',
  'Campus': 'Campus',
  'Brochure': 'Brochure',
  'Candidater →': 'Apply →',

  // HERO eyebrow
  "Grande École d'Ingénieurs · Lille · CTI · Depuis 1885": "Engineering School · Lille · CTI · Since 1885",
  // HERO h1 lines
  'Former les': 'Training the',
  'ingénieurs': 'engineers',
  'de demain': 'of tomorrow',
  // HERO sub
  "JUNIA réunit HEI, ISEN et ISA pour former des ingénieurs prêts à relever les transitions énergétiques, numériques et alimentaires du 21e siècle. Moteur d'innovations depuis 1885.":
    "JUNIA brings together HEI, ISEN and ISA to train engineers ready to tackle the energy, digital and food transitions of the 21st century. A driver of innovation since 1885.",
  'Trouver ma formation →': 'Find my programme →',
  'Portes ouvertes': 'Open Days',
  // Stats
  'Étudiants': 'Students',
  'Insertion pro.': 'Employment rate',
  'Partenaires int.': 'Intl. partners',
  // Float card
  'Parcoursup ouvert': 'Applications open',
  'Candidatures 2025–26': 'Applications 2025–26',
  // Formations section
  'Formations & Admissions': 'Programmes & Admissions',
  'Un parcours pour chaque ambition': 'A pathway for every ambition',
  "De bac+3 à bac+5, formation initiale ou alternance — JUNIA s'adapte à votre profil et votre projet professionnel.":
    'From 3 to 5 years post-baccalaureate, full-time or work-study — JUNIA adapts to your profile and career goals.',
  'Tous': 'All',
  'Formation initiale': 'Full-time',
  'Alternance': 'Work-study',
  'Masters': 'Masters',
  // Cards
  'Cycle Ingénieur Grande École': 'Grande École Engineering Programme',
  "5 ans d'études, diplôme CTI. Cycle préparatoire intégré puis spécialisation HEI, ISEN ou ISA. Transitions technologiques et environnementales.":
    '5-year programme, CTI accredited degree. Integrated preparatory cycle then HEI, ISEN or ISA specialisation. Technological and environmental transitions.',
  'Prépa intégrée · 5 ans': 'Integrated prep · 5 years',
  'Ingénieur en Alternance': 'Work-Study Engineer',
  "Combinez études et entreprise. Un diplôme d'ingénieur CTI et une expérience terrain solide dès la 1re année. Financement possible.":
    'Combine study and work. A CTI engineering degree and solid hands-on experience from year one. Funding available.',
  'Bac+2 requis · 3 ans': 'Bac+2 required · 3 years',
  'Masters & Mastères Spécialisés': 'Masters & Specialised Degrees',
  "Approfondissez une expertise en partenariat avec les meilleures universités mondiales. MS labellisés CGE, doubles diplômes.":
    'Deepen your expertise in partnership with the world\'s top universities. CGE-labelled MS, double degrees.',
  'Bac+4 requis · 1–2 ans': 'Bac+4 required · 1–2 years',
  'Bachelor Développeur Informatique': 'Bachelor in Software Development',
  "Intégrez rapidement le monde du développement logiciel. Formation intensive, projets réels, en 3 ans après le bac.":
    'Enter the world of software development quickly. Intensive training, real projects, in 3 years after school.',
  'Bac requis · 3 ans': 'School leaving cert required · 3 years',
  'Formation Continue & VAE': 'Continuing Education & RPL',
  "Évoluez en restant en activité. Programmes flexibles, finançables CPF, conçus pour les professionnels. Rentrée décalée disponible.":
    'Progress while staying employed. Flexible programmes, CPF-eligible, designed for professionals. Staggered start available.',
  'Tous profils · Modulaire': 'All profiles · Modular',
  'Doubles Diplômes Internationaux': 'International Double Degrees',
  '180+ universités partenaires sur 5 continents. Partez 1 an à l\'étranger via Erasmus+ et revenez diplômé de deux institutions reconnues.':
    '180+ partner universities on 5 continents. Spend 1 year abroad via Erasmus+ and return with two recognised degrees.',
  'Erasmus+ · 180 univ.': 'Erasmus+ · 180 univ.',
  // Numbers
  'JUNIA en chiffres': 'JUNIA in numbers',
  'Des résultats qui prouvent tout': 'Results that speak for themselves',
  "Une école qui tient ses promesses — mesurée, suivie, publiée chaque année.":
    'A school that keeps its promises — measured, tracked, published every year.',
  "Taux d'insertion pro à 6 mois": 'Employment rate at 6 months',
  'Étudiants sur 3 campus': 'Students across 3 campuses',
  'Universités partenaires dans le monde': 'Partner universities worldwide',
  'Alumni dans le réseau JUNIA': 'Alumni in the JUNIA network',
  // Tracks
  'Programmes Grande École': 'Grande École Programmes',
  '3 visions, 1 seule école': '3 visions, 1 school',
  'HEI, ISEN, ISA : trois approches complémentaires pour former les ingénieurs de toutes les transitions.':
    'HEI, ISEN, ISA: three complementary approaches to train engineers for all transitions.',
  'Énergie · Bâtiment · Industrie · Smart Grids': 'Energy · Buildings · Industry · Smart Grids',
  'Transitions énergétiques, des bâtiments & des industries': 'Energy, building & industrial transitions',
  "Concevez les infrastructures et systèmes énergétiques de demain. Smart grids, bâtiments durables, industrie 4.0, ville en transition.":
    'Design tomorrow\'s energy infrastructure and systems. Smart grids, sustainable buildings, industry 4.0, cities in transition.',
  'Découvrir HEI →': 'Discover HEI →',
  'Numérique · IA · Cyber · Électronique': 'Digital · AI · Cyber · Electronics',
  'ISEN — Systèmes intelligents & transitions numériques': 'ISEN — Intelligent systems & digital transitions',
  'Découvrir ISEN →': 'Discover ISEN →',
  'Agri · Alim · Environnement': 'Agri · Food · Environment',
  'ISA — Transitions agricoles, alimentaires & environnementales': 'ISA — Agricultural, food & environmental transitions',
  'Découvrir ISA →': 'Discover ISA →',
  'Approche combinée · JUNIA2035': 'Combined approach · JUNIA2035',
  'Un campus, trois expertises complémentaires': 'One campus, three complementary areas of expertise',
  "Des passerelles entre filières, des démonstrateurs industriels, des projets trans-disciplinaires et une communauté de 5 000 étudiants.":
    'Bridges between programmes, industrial demonstrators, cross-disciplinary projects and a community of 5,000 students.',
  // Why
  'Ce qui nous différencie': 'What sets us apart',
  "Bien plus qu'une école d'ingénieurs": 'Far more than an engineering school',
  "JUNIA forme des ingénieurs-citoyens, capables de comprendre les enjeux planétaires et d'y répondre techniquement. Une stratégie assumée : JUNIA2035 — Transformation(s).":
    'JUNIA trains engineer-citizens, able to understand global challenges and respond technically. A clear strategy: JUNIA2035 — Transformation(s).',
  'Pourquoi JUNIA': 'Why JUNIA',
  "Une école qui s'engage vraiment": 'A school that truly commits',
  "Ans d'histoire": 'Years of history',
  'Accrédité': 'Accredited',
  'Éco-score': 'Eco score',
  'Top école régionale': 'Top regional school',
  '#1 Hauts-de-France 2025': '#1 Hauts-de-France 2025',
  'Engagement RSE sincère': 'Genuine CSR commitment',
  "Campus certifiés, politique carbone mesurée, site éco-conçu A+ Carbon. Politique RSE publiée et suivie annuellement.":
    'Certified campuses, measured carbon policy, A+ Carbon eco-designed website. CSR policy published and tracked annually.',
  'Réseau alumni actif': 'Active alumni network',
  "42 000 diplômés, Career Center dédié, 97% d'insertion à 6 mois. Accompagnement tout au long de la carrière.":
    '42,000 graduates, dedicated Career Centre, 97% employed within 6 months. Support throughout your career.',
  'Recherche & Innovation': 'Research & Innovation',
  "4 démonstrateurs industriels (Industrie du futur, Ville en transition, Agriculture & alimentation), projets de recherche appliquée.":
    '4 industrial demonstrators (Factory of the future, City in transition, Agriculture & food), applied research projects.',
  'Ouverture internationale': 'International openness',
  "180+ universités partenaires, Erasmus+, doubles diplômes sur 5 continents, accueil des étudiants internationaux.":
    '180+ partner universities, Erasmus+, double degrees on 5 continents, international student welcome.',
  "Découvrir l'école →": 'Discover the school →',
  // Testimonials
  'Témoignages': 'Testimonials',
  'Ils ont choisi JUNIA': 'They chose JUNIA',
  "Des étudiants, anciens élèves et partenaires racontent leur expérience.":
    'Students, alumni and partners share their experience.',
  'Diplômée HEI · Ingénieure Engie Renewables': 'HEI Graduate · Engineer at Engie Renewables',
  'Diplômé ISEN · Lead Developer chez Decathlon Tech': 'ISEN Graduate · Lead Developer at Decathlon Tech',
  'Étudiante ISA · 4e année · Agroécologie': 'ISA Student · 4th year · Agroecology',
  // Eco
  'Éco-conception & RSE': 'Eco-design & CSR',
  'Un site aussi engagé que l\'école': 'A website as committed as the school',
  "Ce site est éco-conçu — zéro image externe, polices système natives, CSS uniquement, hébergement 100% vert. Conforme à la politique RSE de JUNIA.":
    'This site is eco-designed — no external images, native system fonts, CSS only, 100% green hosting. Compliant with JUNIA CSR policy.',
  '🌿 Hébergement vert 100%': '🌿 100% green hosting',
  '⚡ Polices système natives': '⚡ Native system fonts',
  '📦 Zéro image externe': '📦 Zero external images',
  '♿ WCAG 2.2 AA': '♿ WCAG 2.2 AA',
  'Score Carbon Website': 'Carbon Website Score',
  'CO₂ par page vue': 'CO₂ per page view',
  'Énergie renouvelable': 'Renewable energy',
  'Sites les plus propres': 'Cleanest websites',
  // CTA
  "🎓 Parcoursup · Admissions parallèles · International": '🎓 Parcoursup · Parallel admissions · International',
  "Prêt à rejoindre l'école des transitions ?": 'Ready to join the school of transitions?',
  "Candidatez dès maintenant. Notre équipe vous accompagne à chaque étape de votre dossier d'admission.":
    'Apply now. Our team will guide you through every step of your application.',
  'Déposer ma candidature →': 'Submit my application →',
  'Télécharger la brochure': 'Download the brochure',
  'Portes ouvertes': 'Open Days',
  'Rencontrez nos équipes à Lille, Bordeaux & Châteauroux. Consultez la page contact pour les dates.':
    'Meet our teams in Lille, Bordeaux & Châteauroux. Check the contact page for dates.',
  'Besoin de conseils ?': 'Need advice?',
  "Nos conseillers répondent sous 24h à toutes vos questions d'admission.":
    'Our advisors respond within 24h to all your admission questions.',
  'Brochures gratuites': 'Free brochures',
  'Téléchargez nos brochures par programme et par campus.': 'Download our brochures by programme and campus.',
  // Footer
  'Programmes': 'Programmes',
  'HEI — Énergie & Industrie': 'HEI — Energy & Industry',
  'ISEN — Numérique & IA': 'ISEN — Digital & AI',
  'ISA — Agriculture': 'ISA — Agriculture',
  'Toutes les formations': 'All programmes',
  'Candidater': 'Apply',
  "Nos valeurs": 'Our values',
  'Campus Lille': 'Lille Campus',
  'Politique RSE': 'CSR Policy',
  'Alumni JUNIA': 'JUNIA Alumni',
  'Nous rejoindre': 'Join us',
  'Contact': 'Contact',
  'Candidatures': 'Applications',
  'Contact général': 'General contact',
  'Étudiants internationaux': 'International students',
  'Accessibilité': 'Accessibility',
  '© 2025 JUNIA — Grande École des Transitions · Lille · Bordeaux · Châteauroux':
    '© 2025 JUNIA — School of Transitions · Lille · Bordeaux · Châteauroux',
  'Mentions légales': 'Legal notices',
  'Confidentialité': 'Privacy',
  'Plan du site': 'Sitemap',
  '🌿 Site éco-conçu · Score A+ Carbon': '🌿 Eco-designed site · A+ Carbon Score',
  'Grande École d\'Ingénieurs. JUNIA réunit HEI, ISEN et ISA pour former les ingénieurs des transitions énergétiques, numériques et environnementales. Présente à Lille, Bordeaux et Châteauroux depuis 1885.':
    'Engineering School. JUNIA brings together HEI, ISEN and ISA to train engineers for energy, digital and environmental transitions. Present in Lille, Bordeaux and Châteauroux since 1885.',
};

// Build reverse map for EN→FR
const TRANSLATIONS_EN_FR = {};
Object.entries(TRANSLATIONS).forEach(([fr, en]) => {
  if (en && en !== fr) TRANSLATIONS_EN_FR[en] = fr;
});

let currentLang = 'fr';
const langToggle = document.getElementById('langToggle');

function translateNode(node, map) {
  if (node.nodeType === Node.TEXT_NODE) {
    const t = node.textContent.trim();
    if (t && map[t]) node.textContent = node.textContent.replace(t, map[t]);
    return;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    // Skip script/style
    if (['SCRIPT','STYLE','svg','SVG'].includes(node.tagName)) return;
    // Translate placeholder
    if (node.hasAttribute('placeholder') && map[node.getAttribute('placeholder')]) {
      node.setAttribute('placeholder', map[node.getAttribute('placeholder')]);
    }
    // Translate title attr
    if (node.hasAttribute('title') && map[node.getAttribute('title')]) {
      node.setAttribute('title', map[node.getAttribute('title')]);
    }
    node.childNodes.forEach(child => translateNode(child, map));
  }
}

function applyTranslation(map, lang) {
  translateNode(document.body, map);
  document.documentElement.lang = lang;
  // Update nav links href for EN (pointing to en/ pages)
  if (lang === 'en') {
    document.querySelectorAll('.nav-links a').forEach(a => {
      if (!a.href.includes('/en/') && !a.href.startsWith('#')) {
        const file = a.getAttribute('href');
        if (file && !file.startsWith('http') && !file.startsWith('/en/')) {
          a.setAttribute('data-fr-href', file);
          a.setAttribute('href', 'en/' + file);
        }
      }
    });
  } else {
    document.querySelectorAll('.nav-links a[data-fr-href]').forEach(a => {
      a.setAttribute('href', a.getAttribute('data-fr-href'));
    });
  }
  // Update search placeholder
  if (searchInput) {
    searchInput.placeholder = lang === 'en' ? 'Search programmes, campus…' : 'Rechercher formations, campus…';
  }
  // Re-render search if open
  if (searchOpen) renderResults(searchInput ? searchInput.value : '');
}

if (langToggle) {
  langToggle.addEventListener('click', () => {
    window.location.href = 'en/index.html';
  });
}
