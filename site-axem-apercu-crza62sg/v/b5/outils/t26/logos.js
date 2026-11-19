/* tour 26 : logos 5C, le mur et la fiche complete */
(() => {
  'use strict';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BASE = new URL('../../', document.currentScript.src).href;
  const U = f => `url('${new URL('img/' + f, BASE).href}')`;
  const CYCLE = 4200;

  /* outils : seulement ceux dont la trace ecrite existe (voir matiere/missions-logos-2026-09-30-v2.md) */
  const T = {
    claude: ['logos-ia/claude.svg', 'Claude'],
    gemini: ['logos-ia/gemini.svg', 'Gemini'],
    geminiE: ['logos-ia/gemini.svg', 'Gemini Enterprise'],
    geminiP: ['logos-ia/gemini.svg', 'Gemini Pro'],
    n8n: ['logos-ia/n8n.svg', 'n8n']
  };

  /* fig = [grand chiffre, legende] ; st = 'l' livree, 'e' en cours, 'v' a venir ; sans fig = fiche standard */
  const LG = [
    { f: 'carrefour.svg', n: 'Carrefour', p: 'Formation', st: 'l', meta: 'Ateliers de 3 heures, en présentiel', fig: ['4', 'sites du groupe'], w: 'Ateliers IA pratiques sur Gemini, animés dans plusieurs entités du groupe. Le même format court a été répété de site en site.', t: ['gemini'] },
    { f: 'kit.png', n: 'K.I.T. Group', p: 'Conseil', st: 'e', meta: 'Audit sur site, deux jours', fig: ['13', 'entretiens menés'], w: 'Audit IA sur site, restitué en pack, puis pilote de trois cas d’usage : tri des mails Outlook, comptes rendus de réunion et rapprochement de factures d’hôtel.', t: ['claude'] },
    { f: 'geodis.svg', n: 'GEODIS', p: 'Formation', st: '', meta: 'Équipe RH, cadrage puis journée', fig: ['1', 'journée de formation'], w: 'Cadrage des besoins avec l’équipe RH le 29 avril, puis une journée de formation IA pour cette équipe.', t: [] },
    { f: 'puig.svg', n: 'Nina Ricci', p: 'Formation', st: 'l', meta: 'Équipes France', fig: ['2', 'missions, juin et septembre'], w: 'Formations IA pour les équipes France, en deux missions distinctes, la dernière le 16 septembre.', t: [] },
    { f: 'my-little-paris.png', n: 'My Little Paris', p: 'Formation', st: 'l', meta: 'Sessions thématiques, de mai à juillet', fig: ['3', 'sessions'], w: 'Formations IA sur Gemini Enterprise, en trois sessions réparties entre mai et juillet.', t: ['geminiE'] },
    { f: 'gravotech.png', n: 'Gravotech', p: 'Formation', st: 'l', meta: 'Une journée, le 31 mars', fig: ['8', 'participants inscrits'], w: 'Journée IA construite sur Gemini Pro avec le compte Google Workspace de l’entreprise, prolongée par une livraison technique fin avril.', t: ['geminiP'] },
    { f: 'avantis.png', n: 'Avantis', p: 'Formation', st: 'l', meta: 'À distance, le 9 avril', fig: ['8 à 10', 'participants'], w: 'Initiation IA des fonctions support : ressources humaines, comptabilité et direction financière.', t: [] },
    { f: 'espace2.png', n: 'Espace 2', p: 'Formation', st: 'l', meta: 'Promoteur immobilier', fig: ['2', 'jours, les 17 et 23 avril'], w: 'Acculturation puis formation IA d’un promoteur immobilier, en deux journées.', t: [] },
    { f: 'gestuel-sante.png', n: 'Gestuel Santé', p: 'Formation', st: 'l', meta: 'Brive, en présentiel, 26 et 27 août', fig: ['10', 'participants, 14 heures'], w: 'Formation à Claude en présentiel sur deux jours, pour dix participants.', t: ['claude'] },
    { f: 'afl-diversity.svg', n: 'AFL Diversity', p: 'Formation', st: 'l', meta: 'Irigny, le 1er septembre', fig: ['Sur site', 'en présentiel'], w: 'Formation IA des fondateurs, en présentiel, dans les locaux de l’entreprise.', t: [] },
    { f: 'viverde-group.svg', n: 'Viverde Group', p: 'Automatisation', st: 'e', meta: 'Outil de prospection, suivi par Alexis', fig: ['125', 'entreprises ciblées au premier essai'], w: 'Outil de prospection automatisé pour les commerciaux : filtres par code APE, département et région, en production sur n8n. Un second outil est en cours de proposition.', t: ['n8n'] },
    { f: 'tikehau-capital.svg', n: 'Tikehau Capital', p: 'Animation', st: 'l', meta: 'Séminaire, 6 et 7 juillet', fig: ['2', 'jours de séminaire'], w: 'Animation d’un séminaire de deux jours, avec notre partenaire AI Sisters.', t: [] },
    { f: 'bdo.svg', n: 'BDO', p: 'Animation', st: 'l', meta: 'Atelier RH, le 10 juillet', fig: ['1', 'atelier'], w: 'Animation d’un atelier consacré à l’administration RH, avec notre partenaire AI Sisters.', t: [] },
    { f: 'carmila.png', n: 'Carmila', p: 'Formation', st: 'l', meta: 'Cadrage le 23 mars', fig: ['3 h', 'de formation, le 26 mars'], w: 'Cadrage des besoins le 23 mars, puis trois heures de formation IA trois jours plus tard.', t: [] },
    { f: 'zoetis.svg', n: 'Zoetis', p: 'Formation', st: 'v', meta: 'Toulouse, animée par Alexis', fig: ['27 oct.', 'date de la formation'], w: 'Formation IA programmée le 27 octobre, précédée d’un temps de cadrage avec le client.', t: [] },
    { f: 'suricog.png', n: 'Suricog', p: 'Coaching et formation', st: 'v', meta: 'Coaching dès octobre, formation à Strasbourg et Paris', fig: ['2', 'séances de coaching en octobre'], w: 'Séances de coaching IA d’une heure, puis formation à Claude à Strasbourg le 27 octobre et à Paris le 28.', t: ['claude'] },
    { f: 'gecina.svg', n: 'Gecina', p: 'Formation', st: 'v', meta: 'Projet remporté en avril', w: 'Projet de formation IA remporté en avril, sur un modèle proche de celui de Carrefour. Le démarrage est en cours de calage.', t: [] },
    { f: 'sodexo.svg', n: 'Sodexo', p: 'Mission', st: '', meta: 'Groupe international de services', w: 'Une mission d’accompagnement IA menée par Axem IA. Le détail se raconte de vive voix, en rendez-vous.', t: [] },
    { f: 'credit-agricole-assurances.svg', n: 'Crédit Agricole Assurances', p: 'Formation', st: '', meta: 'Équipes internes', w: 'Axem IA est intervenu comme formateur IA : formation des équipes en interne.', t: [] },
    { f: 'essec.svg', n: 'ESSEC', p: 'Intervention', st: '', meta: 'École de commerce', w: 'Une intervention d\u2019Axem IA à l\u2019ESSEC.', t: [] }
  ];
  window.AXEM_LOGOS_5C = LG;
  const CHIP = { l: 'Livrée', e: 'En cours', v: 'À venir', '': '' };
  const N = LG.length;

  /* cercle de feutre autour du logo actif */
  const LOOP = 'M118 14 C 92 2, 34 4, 14 26 C -2 44, 24 70, 74 74 C 124 78, 158 60, 150 34 C 144 14, 110 6, 78 10';
  const loopSvg = () => `<svg viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1.03" d="${LOOP}"/></svg>`;
  const draw = (p, on) => {
    if (!p) return;
    gsap.killTweensOf(p);
    if (RM) { p.style.strokeDashoffset = on ? 0 : 1.03; return; }
    gsap.to(p, on ? { strokeDashoffset: 0, duration: .7, ease: 'expo.out' } : { strokeDashoffset: 1.03, duration: .3, ease: 'power2.in' });
  };

  const sec = document.querySelector('.c5'); if (!sec) return;
  const grid = sec.querySelector('.c5-grid'), wall = sec.querySelector('.c5-wall'), cardEl = sec.querySelector('.c5-card');
  const body = sec.querySelector('.c5-body');
  const pill = body.querySelector('.pill'), chip = body.querySelector('.chip'), nm = body.querySelector('.nm'), meta = body.querySelector('.meta');
  const fig = body.querySelector('.fig'), figB = fig.querySelector('b'), figS = fig.querySelector('span');
  const what = body.querySelector('.what'), tools = body.querySelector('.tools'), plate = body.querySelector('.plate');
  const arrow = sec.querySelector('.c5-arrow'), ln = arrow.querySelector('.ln'), hd = arrow.querySelector('.hd');
  const gr = arrow.querySelector('linearGradient');
  const kids = [body.querySelector('.top'), nm, meta, fig, what, tools, plate];

  wall.innerHTML = LG.map((d, i) => `<button class="c5-l" data-i="${i}" aria-label="${d.n}"><span class="lo" style="--u:${U('logos/' + d.f)}"></span>${loopSvg()}</button>`).join('') +
    '<div class="c5-stat"><b class="f">+200</b><span>entreprises accompagnées<small>,<br>+3 000 collaborateurs formés</small></span></div>';
  const ls = [...wall.querySelectorAll('.c5-l')];
  [ln, hd].forEach(p => { p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1 2'; p.style.strokeDashoffset = 1.03; });

  /* remplit la fiche, sans animation */
  function fill(i) {
    const d = LG[i];
    pill.textContent = d.p;
    chip.textContent = CHIP[d.st];
    nm.textContent = d.n;
    meta.textContent = d.meta;
    if (d.fig) { fig.classList.remove('none'); figB.textContent = d.fig[0]; figS.textContent = d.fig[1]; } else fig.classList.add('none');
    what.textContent = d.w;
    plate.style.setProperty('--u', U('logos/' + d.f)); plate.style.display = d.fig ? 'none' : '';
    tools.innerHTML = d.t.length ? '<span class="lbl">Outils utilisés</span>' + d.t.map(k => `<span class="tl"><i style="--u:${U(T[k][0])}"></i>${T[k][1]}</span>`).join('') : '';
  }
  /* la fiche garde la hauteur de la plus grande, elle ne saute jamais */
  function fit() {
    body.style.minHeight = '';
    let m = 0; const keep = cur;
    for (let i = 0; i < N; i++) { fill(i); m = Math.max(m, body.offsetHeight); }
    body.style.minHeight = m + 'px';
    if (keep >= 0) fill(keep);
  }

  function drawArrow(c) {
    const s = grid.getBoundingClientRect(), r = c.getBoundingClientRect(), k = cardEl.getBoundingClientRect();
    const x1 = r.right - s.left - r.width * .1, y1 = r.top - s.top + r.height * .5;
    const x2 = k.left - s.left + 14, y2 = k.top - s.top + 122, kx = k.left - s.left;
    gr.setAttribute('x1', kx - .5); gr.setAttribute('x2', kx + .5);
    const mx = (x1 + x2) / 2, lift = Math.min(90, Math.abs(x2 - x1) * .22 + Math.abs(y2 - y1) * .1);
    ln.setAttribute('d', `M${x1} ${y1} C ${mx} ${y1 - lift}, ${mx} ${y2 + lift * .4}, ${x2} ${y2}`);
    const a = Math.atan2(lift * -.4, x2 - mx), L = 15;
    const p1 = [x2 - L * Math.cos(a - .5), y2 - L * Math.sin(a - .5)], p2 = [x2 - L * Math.cos(a + .5), y2 - L * Math.sin(a + .5)];
    hd.setAttribute('d', `M${p1[0]} ${p1[1]} L${x2} ${y2} L${p2[0]} ${p2[1]}`);
  }

  let cur = -1, hover = false, vis = false, pauseUntil = 0, leaveT = null;
  function on(i) {
    if (i === cur) return;
    if (cur >= 0) { ls[cur].classList.remove('on'); draw(ls[cur].querySelector('path'), false); }
    cur = i; const c = ls[i];
    wall.classList.add('act'); c.classList.add('on');
    draw(c.querySelector('path'), true);
    if (getComputedStyle(arrow).display !== 'none') {
      drawArrow(c);
      gsap.killTweensOf([ln, hd]);
      gsap.set([ln, hd], { strokeDashoffset: 1.03 });
      gsap.to(ln, { strokeDashoffset: 0, duration: RM ? 0 : .6, ease: 'power2.out', delay: .12 });
      gsap.to(hd, { strokeDashoffset: 0, duration: RM ? 0 : .2, ease: 'power2.out', delay: .66 });
    }
    gsap.killTweensOf(kids);
    if (RM) { fill(i); gsap.set(kids, { yPercent: 0, opacity: 1 }); return; }
    gsap.to(kids, {
      yPercent: -25, opacity: 0, duration: .16, stagger: .02, ease: 'power2.in', onComplete: () => {
        fill(i);
        gsap.fromTo(kids, { yPercent: 35, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, stagger: .05, ease: 'expo.out' });
      }
    });
  }

  ls.forEach((c, i) => {
    c.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') on(i); });
    c.addEventListener('click', () => { pauseUntil = Date.now() + 7000; on(i); });
  });
  sec.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hover = true; clearTimeout(leaveT); } });
  sec.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { clearTimeout(leaveT); leaveT = setTimeout(() => { hover = false; pauseUntil = Date.now() + 1200; }, 300); } });

  /* le defilement au repos */
  setInterval(() => {
    if (RM || hover || !vis || Date.now() < pauseUntil) return;
    on((cur + 1) % N);
  }, CYCLE);
  new IntersectionObserver(es => {
    vis = es[0].isIntersecting;
    if (vis && cur < 0) { fit(); on(0); }
  }, { threshold: .35 }).observe(sec);

  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { fit(); if (cur >= 0) { fill(cur); drawArrow(ls[cur]); } }, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fit(); if (cur >= 0) { fill(cur); drawArrow(ls[cur]); } });
  window.__c5 = { on, LG, get cur() { return cur; }, get hover() { return hover; } };
})();
