(() => {
  // Tour 3 : page coaching. Chargé après axem.js et t2.js.
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const still = reduce || /[?&]static\b/.test(location.search);
  const ST = window.ScrollTrigger && window.gsap ? window.ScrollTrigger : null;
  if (ST) gsap.registerPlugin(ST);

  // Le constat : les mots s'allument au fil du défilement, la dernière phrase passe en bleu
  const h = document.querySelector('[data-words]');
  if (h) {
    const txt = h.textContent.trim();
    h.setAttribute('aria-label', txt);
    const hotFrom = h.dataset.hot ? txt.indexOf(h.dataset.hot) : txt.lastIndexOf('Pas ');
    let pos = 0;
    h.innerHTML = txt.split(' ').map(w => {
      const hot = pos >= hotFrom; pos += w.length + 1;
      return `<span class="w${hot ? ' hot' : ''}" aria-hidden="true">${w}</span>`;
    }).join(' ');
    const ws = [...h.querySelectorAll('.w')];
    if (still || !ST) ws.forEach(w => w.classList.add('on'));
    else ST.create({ trigger: h, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: s => { const n = Math.round(s.progress * ws.length); ws.forEach((w, i) => w.classList.toggle('on', i < n)); } });
  }

  // Deux façons d'arriver : bascule entre les deux parcours
  const btns = [...document.querySelectorAll('.cas-b')];
  const panes = [...document.querySelectorAll('.cas-p')];
  panes.forEach(p => p.querySelectorAll('.ps').forEach((li, i) => li.style.setProperty('--i', i)));
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
    panes.forEach(p => { const on = p.dataset.p === b.dataset.cas; p.hidden = !on; p.classList.toggle('on', on); });
    if (ST) ST.refresh();
  }));

  // La séance minute par minute : la barre avance avec le défilement, chaque étape s'allume à son tour
  const fmt = document.querySelector('.format');
  const wrap = fmt && fmt.querySelector('.mn-wrap');
  if (wrap && ST && !still && matchMedia('(min-width: 861px)').matches) {
    const bar = wrap.querySelector('.mn-bar i');
    const mns = [...wrap.querySelectorAll('.mn')];
    fmt.classList.add('scrub'); bar.style.setProperty('--p', 0);
    ST.create({ trigger: wrap, start: 'top 78%', end: 'bottom 55%', scrub: 0.4,
      onUpdate: s => {
        const m = s.progress * 60;
        bar.style.setProperty('--p', s.progress.toFixed(3));
        mns.forEach(li => li.classList.toggle('on', m >= parseFloat(getComputedStyle(li).getPropertyValue('--a')) - 0.01 && s.progress > 0));
      } });
  }
})();
