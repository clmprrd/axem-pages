/* Accueil tour 25 : film (tour 24), logos 5A (tour 25), duo (tour 24), avis 6 (tour 25).
   Uniquement les blocs necessaires, copies de outils/t24/t24.js et outils/t25/t25.js.
   Cette page est dans variantes/ : les logos passent par ../img/logos/. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HOVER = matchMedia('(hover: hover)').matches;
  const ease = 'expo.out';
  if (typeof gsap === 'undefined') return;

  /* ============ 1. FILM ============ */
  const fb = document.querySelector('.hero .fb-wrap .fb');
  if (fb) {
    const slot = fb.parentElement, vid = fb.querySelector('video'), bar = fb.querySelector('.bar');
    const ring = fb.closest('.fb-wrap').querySelector('.fb-ring path'), cap = fb.closest('.fb-wrap').querySelector('.fb-cap .h-m');
    const back = document.querySelector('.fx-back'), ui = document.querySelector('.fx-ui');
    const snd = ui.querySelector('.snd'), close = ui.querySelector('.close');
    const PREV = vid.dataset.prev, FULL = vid.dataset.full, HOLD = 1.5;
    const L = ring.getTotalLength(), Z = L + 10;
    gsap.set(ring, { strokeDasharray: L, strokeDashoffset: Z });
    let hold = null, big = false, busy = false;
    const capTxt = cap.textContent;

    const preview = on => {
      if (big) return;
      if (on) {
        if (vid.getAttribute('src') !== PREV) { vid.src = PREV; }
        vid.muted = true; vid.loop = true; vid.play().catch(() => {});
        fb.classList.add('prev');
      } else {
        fb.classList.remove('prev'); vid.pause();
      }
    };
    /* le film tourne deja en petit, sans le son, des qu'il est a l'ecran */
    if (!RM) new IntersectionObserver(es => es.forEach(e => preview(e.isIntersecting)), { threshold: .2 }).observe(fb);
    const startHold = () => {
      if (big || busy) return;
      preview(true);
      cap.textContent = 'Restez dessus : le film s’ouvre';
      hold = gsap.timeline({ onComplete: () => open(false) })
        .to(ring, { strokeDashoffset: 0, duration: HOLD, ease: 'none' }, 0)
        .to(bar, { scaleX: 1, duration: HOLD, ease: 'none' }, 0)
        .to(fb, { scale: 1.22, duration: HOLD, ease: 'power2.in' }, 0);
    };
    const stopHold = () => {
      if (big) return;
      if (hold) { hold.kill(); hold = null; }
      cap.textContent = capTxt;
      gsap.to(ring, { strokeDashoffset: Z, duration: .5, ease: 'power2.out' });
      gsap.to(bar, { scaleX: 0, duration: .4 });
      gsap.to(fb, { scale: 1, duration: .6, ease });
    };
    const target = () => {
      const vw = innerWidth, vh = innerHeight, m = Math.min(64, vw * .05);
      let w = vw - 2 * m, h = w * 9 / 16;
      if (h > vh - 2 * m) { h = vh - 2 * m; w = h * 16 / 9; }
      return { left: (vw - w) / 2, top: (vh - h) / 2, width: w, height: h };
    };
    const open = byClick => {
      if (big || busy) return; busy = true;
      if (hold) { hold.kill(); hold = null; }
      const r = fb.getBoundingClientRect();
      gsap.set(fb, { scale: 1 });
      fb.classList.add('big');
      gsap.set(fb, { left: r.left, top: r.top, width: r.width, height: r.height, inset: 'auto' });
      back.classList.add('on');
      gsap.to(ring, { strokeDashoffset: Z, duration: .3 });
      gsap.to(fb, { ...target(), duration: RM ? 0 : .9, ease: 'expo.inOut', onComplete: () => { busy = false; ui.classList.add('on'); close.focus({ preventScroll: true }); } });
      big = true;
      vid.src = FULL; vid.loop = false; vid.currentTime = 0; vid.muted = false;
      vid.play().then(() => { snd.hidden = true; }).catch(() => { vid.muted = true; vid.play().catch(() => {}); snd.hidden = false; });
      fb.classList.add('prev');
      cap.textContent = capTxt;
    };
    const shut = () => {
      if (!big || busy) return; busy = true;
      ui.classList.remove('on');
      const r = slot.getBoundingClientRect();
      back.classList.remove('on');
      gsap.to(fb, { left: r.left, top: r.top, width: r.width, height: r.height, duration: RM ? 0 : .75, ease: 'expo.inOut', onComplete: () => {
        fb.classList.remove('big', 'prev'); gsap.set(fb, { clearProps: 'left,top,width,height,inset' });
        vid.src = PREV; vid.muted = true; vid.loop = true; vid.play().catch(() => {}); fb.classList.add('prev'); big = false; busy = false;
        gsap.set(bar, { scaleX: 0 });
      } });
    };
    if (HOVER) {
      fb.addEventListener('pointerenter', startHold);
      fb.addEventListener('pointerleave', stopHold);
    }
    fb.addEventListener('click', () => { if (!big) open(true); });
    fb.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !big) { e.preventDefault(); open(true); } });
    back.addEventListener('click', shut);
    close.addEventListener('click', shut);
    snd.addEventListener('click', () => { vid.muted = false; vid.currentTime = 0; vid.play(); snd.hidden = true; });
    vid.addEventListener('ended', () => { if (big) shut(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
    addEventListener('resize', () => { if (big && !busy) gsap.set(fb, target()); });
  }

  /* le petit bloc se cale au-dessus des chiffres, sous le bouton : il ne masque ni le titre ni le bouton */
  (() => {
    const wrap = document.querySelector('.hero .fb-wrap'); if (!wrap) return;
    const hero = wrap.closest('.hero'), row = hero.querySelector('.mk-row'), kp = hero.querySelector('.mk-kpis'), btn = hero.querySelector('.l2 .btn');
    const capEl = wrap.querySelector('.fb-cap');
    const place = () => {
      const fl = hero.querySelector('.mk-flow'), l2 = hero.querySelector('.l2');
      if (innerWidth <= 860 || !row || !fl || !l2) { wrap.style.removeProperty('--fb-b'); wrap.style.removeProperty('--fbw'); return; }
      /* le film se pose a gauche, dans l'espace entre le titre et le schema, au-dessus du schema */
      const h = hero.getBoundingClientRect(), fr = fl.getBoundingClientRect(), t = l2.getBoundingClientRect();
      const room = fr.top - t.bottom - 40 - 28;
      const w = Math.max(150, Math.min(210, room * 16 / 9));
      wrap.style.setProperty('--fbw', w + 'px');
      wrap.style.setProperty('--fb-b', (h.bottom - fr.top + 40) + 'px');
    };
    place();
    [400, 1200, 3000, 5400, 6600, 8600].forEach(t => setTimeout(place, t));
    addEventListener('resize', place);
    addEventListener('load', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  })();



  /* ============ 2. DUO ============ */
  const duo = document.querySelector('.duo5');
  if (duo) {
    const cur = document.querySelector('.cur-in'), curT = cur.querySelector('span');
    const cards = { clement: duo.querySelector('.pc.clement'), alexis: duo.querySelector('.pc.alexis') };
    const u = duo.querySelector('.duo-top u path');
    if (u) { const l = u.getTotalLength(); gsap.set(u, { strokeDasharray: l, strokeDashoffset: l });
      new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { gsap.to(u, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', delay: .3 }); o.disconnect(); } }), { threshold: .5 }).observe(u); }
    /* cercle de feutre autour de chaque visage : se trace une fois quand le portrait entre a l'ecran */
    const rings = [...duo.querySelectorAll('.pc .ring path')];
    if (!RM) {
      gsap.set(rings, { strokeDashoffset: 1.03 });
      const io = new IntersectionObserver((es, o) => es.forEach(e => {
        if (!e.isIntersecting) return;
        const r = e.target.querySelector('.ring path');
        gsap.to(r, { strokeDashoffset: 0, duration: 1.3, ease: 'expo.out', delay: .2 });
        o.unobserve(e.target);
      }), { threshold: .35 });
      Object.values(cards).forEach(c => io.observe(c));
    }
    let active = null;
    const light = k => {
      if (active === k) return;
      if (active) off(active);
      active = k;
      cards[k].classList.add('on');
      curT.textContent = 'Suivre ' + (k === 'clement' ? 'Clément' : 'Alexis');
    };
    const off = k => {
      cards[k].classList.remove('on');
      if (active === k) active = null;
    };
    duo.querySelectorAll('[data-k]').forEach(el => {
      const k = el.dataset.k;
      el.addEventListener('pointerenter', () => { light(k); cur.classList.add('on'); });
      el.addEventListener('pointerleave', () => { off(k); cur.classList.remove('on'); });
    });
    let x = 0, y = 0, tx = 0, ty = 0;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    gsap.ticker.add(() => { x += (tx - x) * .22; y += (ty - y) * .22; cur.style.left = x + 'px'; cur.style.top = y + 'px'; });
  }

  const U = f => `url('${new URL('../img/logos/' + f, location.href).href}')`;
  const NS = 'http://www.w3.org/2000/svg';

  /* Données provisoires : remplacées par matiere/missions-logos-2026-09-30.md dès qu'elle est vérifiée.
     p = prestation (pastille), b = le détail en gros, w = ce qu'on a fait. */
  const LG = [
    { f: 'carrefour.svg', n: 'Carrefour', p: 'Formation', b: '4 sites', w: 'Ateliers IA sur Gemini, sur plusieurs entités du groupe.' },
    { f: 'kit.png', n: 'K.I.T. Group', p: 'Conseil', b: '13 entretiens', w: 'Audit IA sur site, puis pilote de trois cas d\u2019usage.' },
    { f: 'geodis.svg', n: 'GEODIS', p: 'Formation', b: 'Équipe RH', w: 'Cadrage, puis une journée IA pour l\u2019équipe RH.' },
    { f: 'puig.svg', n: 'Nina Ricci', p: 'Formation', b: '2 missions', w: 'Formations IA pour les équipes France.' },
    { f: 'my-little-paris.png', n: 'My Little Paris', p: 'Formation', b: '3 sessions', w: 'Formations IA sur Gemini Enterprise.' },
    { f: 'gravotech.png', n: 'Gravotech', p: 'Formation', b: '8 participants', w: 'Une journée IA, socle Gemini Pro.' },
    { f: 'avantis.png', n: 'Avantis', p: 'Formation', b: 'Une journée', w: 'Initiation IA des fonctions support : RH, compta, DAF.' },
    { f: 'espace2.png', n: 'Espace 2', p: 'Formation', b: '2 jours', w: 'Acculturation et formation IA d\u2019un promoteur immobilier.' },
    { f: 'gestuel-sante.png', n: 'Gestuel Santé', p: 'Formation', b: '10 participants', w: 'Formation Claude en présentiel à Brive, sur deux jours.' },
    { f: 'afl-diversity.svg', n: 'AFL Diversity', p: 'Formation', b: 'Sur site à Irigny', w: 'Formation IA des fondateurs, en présentiel.' },
    { f: 'credit-agricole-assurances.svg', n: 'Crédit Agricole Assurances', p: 'Formation', b: 'Équipes internes', w: 'Formateurs IA sur place : formation des équipes en interne.' }
  ];
  window.AXEM_LOGOS = LG;
  const fill = d => ({
    p: d.p || 'Mission',
    b: d.b || d.n,
    w: d.w || 'Détail de la mission en cours de vérification.'
  });

  /* le cercle de feutre : une boucle qui dépasse, comme autour des visages */
  const LOOP = 'M118 14 C 92 2, 34 4, 14 26 C -2 44, 24 70, 74 74 C 124 78, 158 60, 150 34 C 144 14, 110 6, 78 10';
  const loopSvg = () => `<svg viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1.03" d="${LOOP}"/></svg>`;
  const draw = (p, on) => {
    if (!p) return;
    gsap.killTweensOf(p);
    if (RM) { p.style.strokeDashoffset = on ? 0 : 1.03; return; }
    gsap.to(p, on ? { strokeDashoffset: 0, duration: .7, ease: 'expo.out' } : { strokeDashoffset: 1.03, duration: .3, ease: "power2.in" });
  };

  /* ================= 5A. LA GRILLE ENTOUREE ================= */
  (() => {
    const sec = document.querySelector('.g5'); if (!sec) return;
    const grid = sec.querySelector('.g5-grid'), card = sec.querySelector('.g5-card');
    const pill = card.querySelector('.pill'), big = card.querySelector('.big'), what = card.querySelector('.what'), arr = card.querySelector('.arr');
    grid.innerHTML = LG.map((d, i) => `<button class="g5-cell" data-i="${i}" aria-label="${d.n}"><span class="lo" style="--u:${U(d.f)}"></span>${loopSvg()}</button>`).join('');
    const cells = [...grid.children];
    let cur = -1, idle = null, cyc = null, human = false;

    function place(c) {
      const g = sec.getBoundingClientRect(), r = c.getBoundingClientRect();
      const cw = card.offsetWidth, ch = card.offsetHeight;
      const cx = r.left + r.width / 2 - g.left;
      let left = Math.max(12, Math.min(g.width - cw - 12, cx - cw * .72));
      const above = r.top - g.top - ch - 34 > 0;
      const top = above ? r.top - g.top - ch - 20 : r.bottom - g.top + 20;
      card.classList.toggle('below', !above);
      card.style.left = left + 'px'; card.style.top = top + 'px';
      arr.style.left = Math.max(10, Math.min(cw - 50, cx - left - 20)) + 'px';
      arr.style.right = 'auto';
    }
    function on(i) {
      if (i === cur) return;
      off(true);
      cur = i; const c = cells[i], d = fill(LG[i]);
      grid.classList.add('act'); c.classList.add('on');
      pill.textContent = d.p; big.textContent = d.b; what.textContent = d.w;
      place(c); card.classList.add('on');
      draw(c.querySelector('path'), true);
    }
    function off(keep) {
      if (cur >= 0) { cells[cur].classList.remove('on'); draw(cells[cur].querySelector('path'), false); }
      cur = -1;
      if (!keep) { grid.classList.remove('act'); card.classList.remove('on'); }
    }
    const withData = LG.map((d, i) => d.b ? i : -1).filter(i => i >= 0);
    function cycle() {
      clearInterval(cyc); let k = 0;
      cyc = setInterval(() => { if (!human) on(withData[k++ % withData.length]); }, 2600);
    }
    cells.forEach((c, i) => {
      c.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse') return; human = true; clearTimeout(idle); on(i); });
      c.addEventListener('click', () => { human = true; clearTimeout(idle); on(i); });
    });
    grid.addEventListener('mouseleave', () => { off(); clearTimeout(idle); idle = setTimeout(() => { human = false; }, 2500); });
    addEventListener('resize', () => { if (cur >= 0) place(cells[cur]); });
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { cycle(); if (cur < 0 && !human) on(withData[0]); }
      else { clearInterval(cyc); if (!human) off(); }
    }), { threshold: .35 }).observe(sec);
  })();


  /* ================= 6. LES AVIS DANS LA DA ================= */
  (() => {
    const sec = document.querySelector('.av6'); if (!sec) return;
    const T = { Coaching: 't-co', Formation: 't-fo', 'Déploiement': 't-de' };
    const AV = [
      { w: 'Pertinent', q: 'Beaucoup plus pertinent, et bien mieux que le simple web.', n: 'José N.', c: 'MSI Experts', p: 'Coaching' },
      { w: 'Incroyable', q: 'Je suis bien contente : ça ouvre des horizons incroyables.', n: 'Isabelle G.', c: 'Galy Avocat', p: 'Coaching' },
      { w: 'Extraordinaire', q: 'Mon site fait avec Claude en une demi-journée : extraordinaire.', n: 'Benoît Q.', c: 'LAB 1882', p: 'Formation' },
      { w: 'Bluffant', q: 'Assez bluffant : il accède à tous les CV et dossiers.', n: 'Marie-Eve B.', c: 'Cofondatrice', p: 'Coaching' },
      { w: 'Génial', q: 'Un simple raccourci et c’est fait : c’est génial.', n: 'Pierre G.', c: 'GP Invest', p: 'Coaching' },
      { w: 'Super', q: 'Une super initiation.', n: 'Benoît Q.', c: 'LAB 1882', p: 'Formation' },
      { w: 'Génial', q: 'Retrouver l’historique d’un fournisseur ou d’un client : c’est génial.', n: 'Marie M.', c: 'ALMA Entreprise', p: 'Déploiement' },
      { w: 'Exceptionnel', q: 'Pour les Excel et les analyses, c’est exceptionnel.', n: 'Pierre G.', c: 'GP Invest', p: 'Coaching' }
    ];
    const ini = n => n.split(/[\s-]+/).map(s => s[0]).join('').slice(0, 2).toUpperCase();
    /* petits traits de feutre autour du disque, comme sur les photos LinkedIn */
    const BURST = 'M8 14 L3 9 M29 4 L29 -2 M50 12 L55 7 M56 34 L62 36 M47 53 L52 58';
    const card = a => `<article class="c6"><div class="band ${T[a.p]}"><span>${a.p}</span></div><div class="body">
      <b class="w f" style="--n:${a.w.length}">${a.w}<svg viewBox="0 0 160 90" preserveAspectRatio="none"><path pathLength="1" d="${LOOP}"/></svg></b>
      <p>« ${a.q} »</p>
      <div class="who"><span class="pph"><i>${ini(a.n)}</i><svg viewBox="0 0 58 58" aria-hidden="true"><path d="${BURST}"/></svg></span><span><b>${a.n}</b><small>${a.c}</small></span></div>
    </div></article>`;
    const half = [AV.slice(0, 4), AV.slice(4)];
    const belts = [...sec.querySelectorAll('.belt6')].map((b, k) => {
      const tr = b.querySelector('.track6');
      const set = half[k].map(card).join('');
      tr.innerHTML = set + set + set;
      const o = { el: tr, dir: +b.dataset.dir, x: 0, v: 1, tv: 1, w: 0 };
      b.addEventListener('mouseenter', () => o.tv = 0);
      b.addEventListener('mouseleave', () => o.tv = 1);
      return o;
    });
    const measure = () => belts.forEach(o => { o.w = o.el.scrollWidth / 3; if (o.dir > 0) o.x = -o.w; });
    measure(); addEventListener('resize', measure);
    let vis = false;
    new IntersectionObserver(es => es.forEach(e => vis = e.isIntersecting)).observe(sec);
    if (RM) return;
    gsap.ticker.add((t, dt) => {
      if (!vis) return;
      belts.forEach(o => {
        o.v += (o.tv - o.v) * .08;
        o.x += o.dir * o.v * dt * .045;
        if (o.x <= -2 * o.w) o.x += o.w;
        if (o.x >= 0) o.x -= o.w;
        o.el.style.transform = `translate3d(${o.x}px,0,0)`;
      });
    });
  })();
})();
