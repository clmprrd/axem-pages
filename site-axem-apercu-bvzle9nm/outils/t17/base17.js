(() => {
  // ---- Tour 17 : socle commun (Reserver un seul a la fois, bouton son WebAudio). Charge sur les
  // 6 pages, avant claude-mark.js et le script propre a chaque page (voir outils/build_t17.py). ----

  // 1) Reserver un seul a la fois. La barre garde .nav .book[data-book] (nav.css). Tant que le grand
  // bouton du hero (.hero .btn[data-book]) est a l'ecran, celui de la barre reste cache, invisible aux
  // lecteurs d'ecran et non focusable. Des qu'il en sort, il apparait et reste, meme en remontant. Sur
  // les pages duo il n'y a pas de hero : le bouton de la barre est visible d'emblee.
  (() => {
    const navBook = document.querySelector('#nav .book[data-book]');
    if (!navBook) return;
    const heroBook = document.querySelector('.hero .btn[data-book]');
    if (!heroBook) { navBook.classList.add('rs-show'); return; }
    navBook.classList.add('rs-hidden');
    navBook.setAttribute('tabindex', '-1');
    navBook.setAttribute('aria-hidden', 'true');
    const reveal = () => {
      navBook.classList.remove('rs-hidden');
      navBook.classList.add('rs-show');
      navBook.removeAttribute('tabindex');
      navBook.removeAttribute('aria-hidden');
    };
    if (!('IntersectionObserver' in window)) { reveal(); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (!entry.isIntersecting) { reveal(); io.disconnect(); } });
    }, { threshold: 0 });
    io.observe(heroBook);
  })();

  // 2) Bouton son : petit egaliseur en bas a gauche, coupe par defaut. Sons synthetises en WebAudio,
  // aucun fichier. Rien ne joue avant un premier clic (ou une preference deja enregistree). Expose
  // window.AxemSound = { play(name), on() } et ecoute l'evenement axem:sound emis ailleurs (survols,
  // ecrans bleus). Chaque lecture/ecriture localStorage est dans un try/catch.
  (() => {
    const KEY = 'axem-son';
    let enabled = false;
    try { enabled = localStorage.getItem(KEY) === '1'; } catch (e) { enabled = false; }

    let ctx = null;
    const audioCtx = () => {
      if (ctx) return ctx;
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      try { ctx = new Ctor(); } catch (e) { ctx = null; }
      return ctx;
    };

    const soundWhoosh = c => {
      const dur = 0.6;
      const buf = c.createBuffer(1, Math.round(c.sampleRate * dur), c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) { const t = i / d.length; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2); }
      const src = c.createBufferSource(); src.buffer = buf;
      const filt = c.createBiquadFilter(); filt.type = 'bandpass'; filt.Q.value = 0.7;
      filt.frequency.setValueAtTime(500, c.currentTime);
      filt.frequency.exponentialRampToValueAtTime(2000, c.currentTime + dur * 0.8);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.13, c.currentTime + 0.09);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      src.connect(filt).connect(g).connect(c.destination);
      src.start(); src.stop(c.currentTime + dur + 0.05);
    };

    const soundTick = c => {
      const osc = c.createOscillator(); osc.type = 'square'; osc.frequency.setValueAtTime(1900, c.currentTime);
      const g = c.createGain();
      g.gain.setValueAtTime(0.08, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.045);
      osc.connect(g).connect(c.destination);
      osc.start(); osc.stop(c.currentTime + 0.06);
    };

    const soundPop = c => {
      const osc = c.createOscillator(); osc.type = 'sine';
      osc.frequency.setValueAtTime(420, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(760, c.currentTime + 0.1);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.15, c.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.24);
      osc.connect(g).connect(c.destination);
      osc.start(); osc.stop(c.currentTime + 0.26);
    };

    const SOUNDS = { whoosh: soundWhoosh, tick: soundTick, pop: soundPop };

    const play = name => {
      if (!enabled || !SOUNDS[name]) return;
      try {
        const c = audioCtx();
        if (!c) return;
        if (c.state === 'suspended') c.resume().catch(() => {});
        SOUNDS[name](c);
      } catch (e) { /* silencieux : le son n'est jamais bloquant */ }
    };

    window.AxemSound = { play, on: () => enabled };
    window.addEventListener('axem:sound', e => { try { play(e.detail && e.detail.name); } catch (er) {} });

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'snd-btn';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Activer le son');
    btn.innerHTML = '<span class="snd-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
    document.body.appendChild(btn);

    const sync = () => {
      btn.classList.toggle('on', enabled);
      btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      btn.setAttribute('aria-label', enabled ? 'Couper le son' : 'Activer le son');
    };
    sync();

    btn.addEventListener('click', () => {
      enabled = !enabled;
      try { localStorage.setItem(KEY, enabled ? '1' : '0'); } catch (e) { /* prive ou bloque : tant pis */ }
      sync();
      if (enabled) play('pop');
    });
  })();
})();
