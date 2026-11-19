(() => {
  // Tour 2 : couche d'interactions. Chargée après axem.js et GSAP.
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const still = reduce || /[?&]static\b/.test(location.search);
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof gsap !== 'undefined';
  document.body.classList.add('t2');
  if (hasGsap) gsap.registerPlugin(...[window.ScrollTrigger, window.SplitText, window.ScrambleTextPlugin].filter(Boolean));

  // Défilement doux, synchronisé avec ScrollTrigger
  let lenis = null;
  if (!still && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, anchors: true });
    if (hasGsap && window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }

  // Curseur contextuel
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  if (fine && !reduce) {
    document.documentElement.classList.add('has-cur');
    const c = document.createElement('div'); c.className = 'cur';
    const l = document.createElement('div'); l.className = 'cur-l';
    document.body.append(c, l);
    const p = { x: mouse.x, y: mouse.y };
    const loop = () => {
      p.x += (mouse.x - p.x) * 0.35; p.y += (mouse.y - p.y) * 0.35;
      c.style.transform = l.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('pointerover', e => {
      const lab = e.target.closest('[data-cursor]');
      const hide = e.target.closest('[data-cursor-off]');
      const link = e.target.closest('a, button');
      c.className = 'cur' + (hide ? ' off' : lab ? ' lab' : link ? ' link' : '');
      l.textContent = lab && !hide ? lab.dataset.cursor : '';
      l.classList.toggle('on', !!(lab && !hide));
    });
  }

  // Titre du hero : graisse variable selon la distance au curseur
  const heroH = document.querySelector('.hero');
  if (heroH) {
    document.querySelectorAll('.hero h1 .word > span').forEach(s => { s.innerHTML = [...s.textContent].map(ch => `<span class="ch">${ch}</span>`).join(''); });
    if (fine && !still) {
      const chars = [...heroH.querySelectorAll('.ch')];
      let active = false;
      heroH.addEventListener('pointerenter', () => { active = true; });
      heroH.addEventListener('pointerleave', () => { active = false; chars.forEach(ch => gsap.to(ch, { '--wg': 900, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })); });
      const tick = () => {
        if (active) chars.forEach(ch => {
          const r = ch.getBoundingClientRect();
          const d = Math.hypot(mouse.x - (r.left + r.width / 2), mouse.y - (r.top + r.height / 2));
          const w = 300 + 600 * Math.min(1, d / 420);
          gsap.to(ch, { '--wg': w, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
        });
        requestAnimationFrame(tick);
      };
      tick();
    }
  }

  // Aperçu flottant sur les offres
  const rows = document.querySelectorAll('.row[data-peek]');
  if (rows.length && fine && !reduce && hasGsap) {
    const pk = document.createElement('div'); pk.className = 'peek'; pk.setAttribute('aria-hidden', 'true');
    pk.innerHTML = '<span class="sq"></span><div class="k"></div><div class="v"></div><img class="pi" alt="">';
    document.body.appendChild(pk);
    const xTo = gsap.quickTo(pk, 'x', { duration: 0.55, ease: 'power3.out' }), yTo = gsap.quickTo(pk, 'y', { duration: 0.55, ease: 'power3.out' });
    let lastX = mouse.x;
    addEventListener('pointermove', () => { xTo(mouse.x + 70); yTo(mouse.y + 30); gsap.to(pk, { rotation: gsap.utils.clamp(-8, 8, (mouse.x - lastX) * 0.6), duration: 0.5, overwrite: 'auto' }); lastX = mouse.x; }, { passive: true });
    rows.forEach(r => {
      r.addEventListener('pointerenter', () => { pk.querySelector('.k').textContent = r.dataset.peekK || ''; pk.querySelector('.v').textContent = r.dataset.peek; const pi = pk.querySelector('.pi'); if (r.dataset.peekImg) { pi.src = new URL(r.dataset.peekImg, document.baseURI).href; } pk.classList.toggle('has-img', !!r.dataset.peekImg); gsap.to(pk, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }); });
      r.addEventListener('pointerleave', () => gsap.to(pk, { opacity: 0, scale: 0.6, duration: 0.3 }));
    });
  }

  // Brouillage des lettres au survol (liens de navigation, noms)
  if (hasGsap && window.ScrambleTextPlugin && !reduce) {
    document.querySelectorAll('.nav .links a, [data-scramble]').forEach(el => {
      const txt = el.textContent;
      el.addEventListener('pointerenter', () => gsap.to(el, { duration: 0.6, scrambleText: { text: txt, chars: 'axemAXEM', speed: 0.6 }, overwrite: true }));
    });
  }

  // Bandeau clients : vitesse et inclinaison selon la vitesse de défilement
  const mq = document.getElementById('mq');
  if (mq && hasGsap) {
    let x = 0, boost = 0, hover = false;
    mq.parentElement.addEventListener('pointerenter', () => { hover = true; });
    mq.parentElement.addEventListener('pointerleave', () => { hover = false; });
    if (lenis) lenis.on('scroll', e => { boost = gsap.utils.clamp(-40, 40, e.velocity); });
    if (!reduce) gsap.ticker.add(() => {
      boost *= 0.92;
      const half = mq.scrollWidth / 2;
      x -= hover ? 0 : 0.9 + Math.abs(boost) * 0.5;
      if (x <= -half) x += half;
      mq.style.transform = `translate3d(${x}px,0,0) skewX(${(-boost * 0.35).toFixed(2)}deg)`;
    });
  }

  // Wordmark du pied de page : lettres qui se soulèvent près du curseur
  const big = document.querySelector('footer .big');
  if (big) {
    const tn = [...big.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    if (tn) { const w = document.createElement('span'); w.innerHTML = [...tn.textContent.trim()].map(ch => `<span class="fl">${ch}</span>`).join(''); big.replaceChild(w, tn); }
    if (fine && !reduce) {
      const fls = [...big.querySelectorAll('.fl')];
      big.closest('footer').addEventListener('pointermove', () => fls.forEach(f => {
        const r = f.getBoundingClientRect(), d = Math.abs(mouse.x - (r.left + r.width / 2));
        f.style.transform = `translateY(${(-Math.max(0, 1 - d / 260) * 0.14).toFixed(3)}em)`;
      }));
      big.closest('footer').addEventListener('pointerleave', () => fls.forEach(f => { f.style.transform = ''; }));
    }
  }

  // Magnétique étendu à la réservation de la barre et aux liens forts
  if (fine && !reduce && hasGsap) document.querySelectorAll('.nav .book, .teaser .more, [data-mag]').forEach(b => {
    const xTo = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3.out' }), yTo = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3.out' });
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.4); });
    b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });

  // Lignes révélées au scroll
  if (hasGsap && window.SplitText && window.ScrollTrigger && !still) {
    document.fonts.ready.then(() => document.querySelectorAll('[data-lines]').forEach(el => {
      SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'ln', autoSplit: true, onSplit: self => gsap.from(self.lines, { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 85%', once: true } }) });
    }));
  }

  /* ---------- Variante 1 : noms géants, portrait qui suit le curseur ---------- */
  const dn = document.querySelector('.dn-list');
  const fl = document.querySelector('.dn-float');
  if (dn && fl && fine && !reduce && hasGsap) {
    const xTo = gsap.quickTo(fl, 'x', { duration: 0.7, ease: 'power3.out' }), yTo = gsap.quickTo(fl, 'y', { duration: 0.7, ease: 'power3.out' });
    let lx = mouse.x;
    addEventListener('pointermove', () => { xTo(mouse.x + 22); yTo(mouse.y + 16); gsap.to(fl, { rotation: gsap.utils.clamp(-10, 10, (mouse.x - lx) * 0.5), duration: 0.6, overwrite: 'auto' }); lx = mouse.x; }, { passive: true });
    dn.querySelectorAll('.dn-row').forEach(r => {
      r.addEventListener('pointerenter', () => { fl.classList.add('on'); fl.querySelectorAll('img').forEach(i => i.classList.toggle('on', i.dataset.who === r.dataset.who)); });
    });
    dn.addEventListener('pointerleave', () => fl.classList.remove('on'));
  }

  /* ---------- Variante 2 : portraits qui se croisent, section épinglée ---------- */
  const dx = document.querySelector('.duo-x');
  if (dx && hasGsap && window.ScrollTrigger && !still) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: dx, start: 'top top', end: '+=90%', pin: dx.querySelector('.dx-pin'), scrub: 1 } });
      tl.from('.dx-name.l', { xPercent: 40, ease: 'none' }, 0)
        .from('.dx-name.r', { xPercent: -40, ease: 'none' }, 0)
        .from('.dx-ph.a', { x: () => -innerWidth * 0.55, rotation: -14, ease: 'power2.out' }, 0)
        .from('.dx-ph.b', { x: () => innerWidth * 0.55, rotation: 14, ease: 'power2.out' }, 0)
        .to('.dx-ph.a', { rotation: -3, ease: 'none', duration: 0.3 }, 0.7)
        .to('.dx-ph.b', { rotation: 3, ease: 'none', duration: 0.3 }, 0.7)
        .from('.dx-line, .dx-note', { autoAlpha: 0, y: 40, ease: 'power2.out', duration: 0.3 }, 0.7);
    });
    // Au survol, le portrait se redresse
    dx.querySelectorAll('.dx-ph').forEach(ph => {
      ph.addEventListener('pointerenter', () => gsap.to(ph, { rotation: 0, scale: 1.04, duration: 0.6, ease: 'power3.out', overwrite: 'auto' }));
      ph.addEventListener('pointerleave', () => gsap.to(ph, { rotation: ph.classList.contains('a') ? -3 : 3, scale: 1, duration: 0.6, ease: 'power3.out', overwrite: 'auto' }));
    });
  }

  /* ---------- Variante 3 : fiches qui s'ouvrent ---------- */
  document.querySelectorAll('.df-card').forEach(card => {
    const b = card.querySelector('.df-plus');
    b.addEventListener('click', e => { e.stopPropagation(); const o = card.classList.toggle('open'); b.setAttribute('aria-expanded', o); b.setAttribute('aria-label', (o ? 'Refermer' : 'Ouvrir') + ' la fiche de ' + card.dataset.who); card.dataset.cursor = o ? 'Refermer' : 'Ouvrir'; const l = document.querySelector('.cur-l'); if (l && l.classList.contains('on')) l.textContent = card.dataset.cursor; });
    card.querySelector('.df-ph').addEventListener('click', () => b.click());
  });
})();
