(() => {
  // Lien de réservation : à renseigner quand Clément aura tranché. Vide = les boutons restent sur la page.
  const BOOKING_URL = 'https://calendly.com/clem-pred/30min';
  if (BOOKING_URL) document.querySelectorAll('[data-book]').forEach(a => { a.href = BOOKING_URL; a.target = '_blank'; a.rel = 'noopener'; });

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ') + '';

  // Grille 12 colonnes
  document.querySelectorAll('.grid').forEach(g => { for (let k = 0; k < 12; k++) { const i = document.createElement('i'); i.style.setProperty('--k', k); g.appendChild(i); } });

  // Titres découpés mot par mot
  document.querySelectorAll('[data-split]').forEach(el => {
    const off = +(el.dataset.offset || 0);
    el.innerHTML = el.textContent.trim().split(' ').map((w, n) => `<span class="word"><span style="--w:${n + off}">${w}</span></span>`).join(' ');
  });
  document.querySelectorAll('[data-label]').forEach(el => el.setAttribute('aria-label', el.dataset.label));

  // Carrés des packs
  document.querySelectorAll('.dots').forEach(d => { for (let n = 0; n < +d.dataset.n; n++) { const s = document.createElement('span'); s.style.setProperty('--n', n); d.appendChild(s); } });

  // Bandeau : on double le contenu pour une boucle sans couture
  const mq = document.getElementById('mq');
  if (mq) mq.insertAdjacentHTML('beforeend', mq.innerHTML.replace(/<span(?=[ >])/g, '<span aria-hidden="true"'));

  requestAnimationFrame(() => requestAnimationFrame(() => { document.body.classList.add('ready'); document.getElementById('grid').classList.add('on'); }));

  // Compteurs de prix
  const count = el => {
    const to = +el.dataset.count;
    if (reduce) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 1400;
    const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(to * e); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  // Révélations au scroll
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    // Le mot-symbole du pied de page démarre sous le bord visible : on observe le pied de page entier
    if (e.target.tagName === 'FOOTER') e.target.querySelectorAll('.big').forEach(b => b.classList.add('in'));
    e.target.querySelectorAll('[data-count]').forEach(c => setTimeout(() => count(c), +(getComputedStyle(e.target).getPropertyValue('--d') || 0)));
    if (e.target.classList.contains('grid')) e.target.classList.add('on');
    const ph = e.target.classList.contains('person') && e.target.querySelector('.ph');
    if (ph) { ph.classList.add('in'); setTimeout(() => ph.classList.add('done'), 1700); }
    setTimeout(() => e.target.classList.add('done'), 1700);
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
  // La photo est masquée par un clip-path, que l'observateur compte comme invisible : on observe son parent.
  const targets = document.querySelectorAll('.rv, .person, footer, .prices .grid, .teaser .grid');
  targets.forEach(el => io.observe(el));
  if (reduce) document.querySelectorAll('.rv, .ph, footer .big, .grid').forEach(el => el.classList.add('in', 'on', 'done'));

  // Navigation : fond au scroll, masquée en descendant, visible en remontant
  const nav = document.getElementById('nav');
  let last = scrollY, ticking = false;
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('solid', y > 40);
    nav.classList.toggle('hide', y > 400 && y > last);
    last = y;
    if (!reduce) parallax.forEach(p => {
      const r = p.getBoundingClientRect(), c = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      p.style.setProperty('--py', (c * +p.dataset.parallax).toFixed(1) + 'px');
    });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Boutons magnétiques (souris seulement)
  if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.32}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }
})();
