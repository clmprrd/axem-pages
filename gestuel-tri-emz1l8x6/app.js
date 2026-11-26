/* Application de tri : accueil (la semaine), tri (une carte à la fois), fin.
   Version du 18/11/2026 (corrections du relecteur 3) : tampon PROGRAMMÉ, repère « …voir plus » vivant,
   geste au feutre, fin de carte, pile de cartes, messages qui nomment le post, états d'écran. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fin_hover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var TZ = 'Europe/Paris', LIM = 210, MAXC = 3000;
  var MOTIFS = ['Trop long', 'Pas le ton de Cédric', 'Sujet déjà traité', 'Pas le bon moment', 'Autre raison'];
  var queue = [], cards = {}, dec = {}, hist = [], lastDir = {}, ids = [], view = 'home', editing = false, busy = false, firstHome = true;
  var tToast = null, tCachet = null, chargement = true, undoAttend = false;
  var NB = '\u00a0';

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* typographie française des textes de l'interface et des titres : apostrophe courbe, espace insécable avant : ; ? ! » et après « */
  function typo(s) {
    return String(s).replace(/(\p{L})'(?=\p{L})/gu, '$1’').replace(/ +([:;?!»])/g, NB + '$1').replace(/(«) +/g, '$1' + NB);
  }
  var FMT = {};
  function fmt(o) { var k = JSON.stringify(o); return FMT[k] || (FMT[k] = new Intl.DateTimeFormat('fr-FR', Object.assign({ timeZone: TZ }, o))); }
  function parts(iso, o) { return fmt(o).format(new Date(iso)); }
  function heure(iso) {
    var d = new Date(iso), h = fmt({ hour: 'numeric', hour12: false }).format(d), m = fmt({ minute: '2-digit' }).format(d);
    var mm = parseInt(m.replace(/\D/g, ''), 10) || 0;
    return String(parseInt(h.replace(/\D/g, ''), 10)) + NB + 'h' + (mm ? NB + (mm < 10 ? '0' : '') + mm : '');
  }
  function jourLong(iso) { return cap(parts(iso, { weekday: 'long', day: 'numeric', month: 'long' })); }
  function quand(iso) { return jourLong(iso) + ' · ' + heure(iso); }
  function announce(t) { var l = $('#live'); l.textContent = ''; setTimeout(function () { l.textContent = t; }, 30); }
  function buzz(n) { try { if (navigator.vibrate) navigator.vibrate(n); } catch (e) {} }
  function isLocal() { return Store.status().mode === 'local'; }
  function dur(d) { return reduit ? 0 : d; }
  function court(h, n) { h = String(h); return h.length > n ? h.slice(0, n).replace(/\s+\S*$/, '') + '…' : h; }

  /* ---------- pictogrammes des écrans d'état ---------- */
  var S0 = '<svg viewBox="0 0 48 48" fill="none" stroke="#2349FF" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
  var S1 = S0.replace('#2349FF', '#C9302F');
  var PICT = {
    spin: S0 + '<circle cx="24" cy="24" r="17" opacity=".2"/><path d="M24 7a17 17 0 0 1 17 17"/></svg>',
    cle: S0 + '<circle cx="16" cy="31" r="9"/><path d="M23 24 41 6M33 14l5 5M28 19l4 4"/></svg>',
    reseau: S0 + '<path d="M6 19a26 26 0 0 1 36 0M13 26a16 16 0 0 1 22 0M20 33a7 7 0 0 1 8 0"/><circle cx="24" cy="40" r="1.6" fill="#2349FF"/><path d="M8 7l32 34"/></svg>',
    vide: S0 + '<rect x="7" y="10" width="34" height="31" rx="6"/><path d="M7 20h34M16 5v9M32 5v9"/><path d="m18 31 4 4 8-8"/></svg>',
    refus: S1 + '<rect x="9" y="21" width="30" height="21" rx="6"/><path d="M16 21v-5a8 8 0 0 1 16 0v5"/><path d="m20 28 8 8M28 28l-8 8"/></svg>',
    refaire: S0 + '<path d="M40 24a16 16 0 1 1-5-11.6"/><path d="M40 6v8h-8"/></svg>'
  };
  function setPict(sel, name, tourne) { var el = $(sel); if (!el) return; el.innerHTML = PICT[name] || ''; el.classList.toggle('tourne', !!tourne); el.classList.toggle('alerte', name === 'refus'); }
  /* pas de code d'accès du tout (lien incomplet) : distinct d'un code refusé et d'un « rien à trier » */
  function sansCode() { try { return !localStorage.getItem('gestuel-tri-code-v1'); } catch (e) { return false; } }
  setPict('#pict', 'spin', true); $('#home').classList.add('etat-on');

  /* ---------- affichage des vues ---------- */
  function show(v) {
    view = v;
    ['home', 'tri', 'fin'].forEach(function (x) { $('#' + x).hidden = (x !== v); });
    if (v !== 'tri') hideToast(true);
    window.scrollTo(0, 0);
    if (v === 'home' && !firstHome && !reduit && window.gsap) gsap.from('#home .hero, #home .pos', { y: 30, opacity: 0, duration: .8, ease: 'expo.out', stagger: .06 });
  }

  /* ---------- le geste signature : le trait de feutre bleu ---------- */
  function feutre(wrap, delay) {
    var path = wrap && $('.feutre path', wrap); if (!path) return;
    wrap.classList.add('on');
    if (reduit || !window.gsap) { path.style.strokeDashoffset = '0'; return; }
    gsap.killTweensOf(path);
    gsap.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .6, delay: delay || 0, ease: 'power2.inOut' });
  }

  /* ---------- accueil ---------- */
  var ETAT = { a_trier: 'À trier', programme: 'Programmé', retire: 'Retiré', publie: 'Publié' };
  /* les posts qui concernent Marie : ceux pas encore publiés (les publiés vont dans l'archive en bas de page) */
  function aVenir(P) { return P.filter(function (p) { return p.statut !== 'publie'; }); }
  function dayKey(d) { return fmt({ year: 'numeric', month: '2-digit', day: '2-digit' }).format(d); }
  function fr(x, o) { return new Intl.DateTimeFormat('fr-FR', Object.assign({ timeZone: TZ }, o)).format(x); }
  function wdIdx(d) { return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' }).format(d)); }
  function lundiDe(d) { return new Date(d.getTime() - ((wdIdx(d) + 6) % 7) * 86400000); }
  function labelLundi(lun) { var ven = new Date(lun.getTime() + 4 * 86400000); return 'Semaine du ' + fr(lun, ven.getMonth() !== lun.getMonth() ? { day: 'numeric', month: 'long' } : { day: 'numeric' }) + ' au ' + fr(new Date(lun.getTime() + 4 * 86400000), { day: 'numeric', month: 'long' }); }
  /* les jours ouvrés, semaine par semaine ; sur plusieurs semaines, on retire les jours vides avant le premier post et après le dernier */
  function weekDays(P) {
    var A = aVenir(P); if (!A.length) return [];
    var vus = {}, lundis = [], out = [];
    A.forEach(function (p) { var l = lundiDe(new Date(p.publish_at)), k = dayKey(l); if (!vus[k]) { vus[k] = 1; lundis.push(l); } });
    lundis.sort(function (x, y) { return x - y; });
    lundis.forEach(function (lun) {
      for (var i = 0; i < 5; i++) {
        var day = new Date(lun.getTime() + i * 86400000), k = dayKey(day);
        out.push({ date: day, iso: day.toISOString(), post: A.filter(function (p) { return dayKey(new Date(p.publish_at)) === k; })[0] || null, label: labelLundi(lun), multi: lundis.length > 1 });
      }
    });
    if (lundis.length > 1) {
      while (out.length && !out[0].post) out.shift();
      while (out.length && !out[out.length - 1].post) out.pop();
    }
    out.forEach(function (w, i) { w.first = i === 0 || out[i - 1].label !== w.label; });
    return out;
  }
  function pleins(D) {  /* relecteur 6 (25/11) : seuls les jours qui ont un post */
    var o = D.filter(function (w) { return w.post; }); if (!o.length) return D;
    o.forEach(function (w, i) { w.first = i === 0 || o[i - 1].label !== w.label; }); return o;
  }
  function semaineLabel(P) {
    var D = weekDays(P); if (!D.length) return 'Cette semaine';
    return D[0].multi ? 'Du ' + fr(D[0].date, { day: 'numeric', month: 'long' }) + ' au ' + fr(D[D.length - 1].date, { day: 'numeric', month: 'long' }) : D[0].label;
  }
  /* le titre : trois lignes au plus, une ligne vide disparaît, la taille suit la longueur */
  function setH1(a, b, c) {
    var L = [a, b, c], h = $('#h1');
    ['#h1a', '#h1b', '#h1c'].forEach(function (s, i) { var el = $(s); el.textContent = typo(L[i] || ''); el.closest('.ln').style.display = L[i] ? '' : 'none'; });
    var nl = L.filter(Boolean).length, mx = Math.max.apply(null, L.map(function (x) { return (x || '').length; }));
    h.classList.toggle('deux', nl === 2); h.classList.toggle('long', nl === 3 && mx > 12);
  }
  function renderHome(animate) {
    var P = Store.posts(), n = P.filter(function (p) { return p.statut === 'a_trier'; }).length;
    var prog = P.filter(function (p) { return p.statut === 'programme'; }).length, ret = P.filter(function (p) { return p.statut === 'retire'; }).length;
    var st = Store.status(), erreur = !P.length && st.mode === 'rest';
    var code = erreur && (st.error || st.online), reseau = erreur && !code, vide = !P.length && !erreur;
    var etatEcran = erreur || vide, avecFeutre = false;
    var manque = code && sansCode();
    $('#semaine').textContent = manque ? 'Code manquant' : code ? 'Code refusé' : reseau ? 'Réseau' : semaineLabel(P);
    $('.regles').hidden = !(n > 0 && P.length);
    $('#home').classList.toggle('etat-on', etatEcran); $('#home-grid').classList.toggle('ecran', etatEcran);
    $('#go').hidden = true; $('#contact').hidden = !code;
    $('#fw-h1').classList.remove('on');
    if (manque) {
      setH1('Il manque', 'votre code', 'd\'accès.'); setPict('#pict', 'cle');
      $('#lead').textContent = typo('Ce lien est incomplet. Ouvrez le lien exact qu\'AXEM vous a envoyé : il contient votre code d\'accès. Si ça ne marche toujours pas, écrivez-nous, nous vous renvoyons le lien.');
    } else if (code) {
      setH1('Aucun post', 'avec ce code', 'd\'accès.'); setPict('#pict', 'refus');
      $('#lead').textContent = typo('Soit le code de votre lien n\'est pas le bon, soit AXEM n\'a encore rien déposé. Ouvrez le lien exact qu\'AXEM vous a envoyé ; si ça ne marche toujours pas, écrivez-nous, nous vous renvoyons le lien.');
    } else if (reseau) {
      setH1('Pas de', 'connexion', 'pour l\'instant.'); setPict('#pict', 'reseau');
      $('#lead').textContent = typo('Vos posts s\'affichent dès que le réseau revient. Rien n\'est perdu.');
    } else if (vide) {
      setH1('Rien à trier', 'cette semaine.', ''); setPict('#pict', 'vide');
      $('#lead').textContent = typo('AXEM prépare les posts de la semaine. Ils apparaîtront ici, prêts à être triés. Vous n\'avez rien à faire pour l\'instant.');
    } else if (n > 0) {
      setH1(n + ' post' + (n > 1 ? 's' : ''), n > 1 ? 'attendent' : 'attend', 'votre geste.'); avecFeutre = true;
      $('#lead').textContent = 'Gardez ceux qui sonnent juste, retirez les autres. Deux minutes suffisent.';
      $('#go-t').textContent = 'Commencer le tri'; $('#go').hidden = false;
    } else if (prog === 0) {
      setH1('Tout est retiré.', 'À bientôt.', '');
      $('#lead').textContent = typo('AXEM réécrit ' + (ret > 1 ? 'les ' + ret + ' posts' : 'le post') + ' et ' + (ret > 1 ? 'les remet' : 'le remet') + ' ici dès qu\'' + (ret > 1 ? 'ils sont prêts' : 'il est prêt') + '. Vous pouvez encore changer d\'avis.');
      $('#go-t').textContent = 'Revoir la semaine'; $('#go').hidden = false;
    } else {
      setH1('Tout est trié.', 'À bientôt.', '');
      $('#lead').textContent = typo(prog + ' post' + (prog > 1 ? 's' : '') + ' programmé' + (prog > 1 ? 's' : '') + (ret ? ', ' + ret + ' retiré' + (ret > 1 ? 's' : '') + ' : AXEM ' + (ret > 1 ? 'les réécrit' : 'le réécrit') : '') + '. Vous pouvez encore changer d\'avis jusqu\'à l\'heure de publication.');
      $('#go-t').textContent = 'Revoir la semaine'; $('#go').hidden = false;
    }
    var ol = $('#liste');
    ol.innerHTML = pleins(weekDays(P)).map(function (w) {
      var p = w.post, sep = (w.first && w.multi) ? '<li class="sem-sep">' + esc(w.label) + '</li>' : '', dt = '<div class="date"><b>' + parts(w.iso, { day: 'numeric' }) + '</b><small>' + parts(w.iso, { weekday: 'short' }).replace('.', '') + '</small></div>';
      if (!p) return sep + '<li class="pos vide">' + dt + '<div class="corps-l"><span class="fmt">Pas de post prévu</span></div></li>';
      var lbl = ETAT[p.statut] + (p.statut === 'programme' ? ' · ' + heure(p.publish_at) : p.statut === 'retire' ? ' · AXEM réécrit' : '');
      var act = p.statut === 'retire' ? '<button class="lien" data-remettre="' + esc(p.id) + '" type="button">Redemander une version</button>' : '';
      return sep + '<li class="pos" data-id="' + esc(p.id) + '">' + (p.statut !== 'publie' ? '<button class="tap" type="button" aria-label="Ouvrir : ' + esc(typo(p.hook)) + '"></button>' : '') + dt +
        '<div class="mini"><img alt="" src="' + esc(p.visuel) + '" loading="lazy"></div>' +
        '<div class="corps-l"><span class="fmt">' + esc(p.format) + '</span><h3>' + esc(typo(p.hook)) + '</h3><span class="etat ' + p.statut + '">' + lbl + '</span>' + (act ? '<div class="acts">' + act + '</div>' : '') + '</div></li>';
    }).join('');
    var pub = P.filter(function (p) { return p.statut === 'publie'; }).sort(function (x, y) { return x.publish_at < y.publish_at ? 1 : -1; });
    $('#archive-h').hidden = $('#archive').hidden = !pub.length || etatEcran;
    $('#archive-h').textContent = typo('Déjà publiés sur le LinkedIn de Cédric (' + pub.length + ')');
    $('#archive').innerHTML = pub.map(function (p) {
      var st = (p.likes != null ? p.likes + ' réaction' + (p.likes > 1 ? 's' : '') : '') + (p.commentaires ? ' · ' + p.commentaires + ' commentaire' + (p.commentaires > 1 ? 's' : '') : '');
      return '<li class="parch"><div class="date"><b>' + parts(p.publish_at, { day: 'numeric' }) + '</b><small>' + parts(p.publish_at, { month: 'short' }).replace('.', '') + '</small></div>' +
        '<div class="mini">' + (p.visuel ? '<img alt="' + esc(p.alt || '') + '" src="' + esc(p.visuel) + '" loading="lazy">' : '') + '</div>' +
        '<div class="corps-l"><span class="fmt">' + esc(p.format) + '</span><h3>' + esc(typo(p.hook)) + '</h3><span class="etat publie">Publié' + (st ? ' · ' + st : '') + '</span>' +
        (p.url ? '<div class="acts"><a class="lien" href="' + esc(p.url) + '" target="_blank" rel="noopener">Voir sur LinkedIn</a></div>' : '') + '</div></li>';
    }).join('');
    var h1 = $('#h1');
    if (avecFeutre) $('#fw-h1').classList.add('on');
    if (animate && !reduit && window.gsap) {
      var path = $('#fw-h1 .feutre path'); if (avecFeutre) gsap.set(path, { strokeDashoffset: 1 });
      h1.classList.remove('libre');
      gsap.from('.hero h1 .ln>span', { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: .12, onComplete: function () { h1.classList.add('libre'); if (avecFeutre) feutre($('#fw-h1'), .1); } });
      gsap.from(['.hero .eyebrow', '.hero .lead', '.hero .cta-row', '.hero .regles', '.hero .pict'], { y: 26, opacity: 0, duration: 1, ease: 'expo.out', stagger: .09, delay: .25 });
      gsap.from('.pos', { y: 70, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .11, delay: .3 });
    } else {
      h1.classList.add('libre'); if (avecFeutre) { var p2 = $('#fw-h1 .feutre path'); if (p2) p2.style.strokeDashoffset = '0'; if (window.gsap) gsap.set(p2, { strokeDashoffset: 0 }); }
    }
  }

  /* ---------- pastille de synchronisation ---------- */
  /* libellés courts (jamais tronqués) : « Synchronisé », « Hors ligne · N », « Envoi… », « Code refusé », « Mode essai » ; le détail est dans l'aide */
  function renderSync(s) {
    var b = $('#sync'), t = '', l = '', c = '';
    if (chargement) { t = 'Chargement'; c = 'load'; }
    else if (s.mode === 'local') { t = 'Mode essai'; c = ''; }
    else if (s.error || (!Store.posts().length && s.online && !s.pending)) { t = sansCode() ? 'Sans code' : 'Code refusé'; c = 'err'; }
    else if (!s.online) { t = 'Hors ligne' + (s.pending ? ' · ' + (s.pending > 9 ? '9+' : s.pending) : ''); l = s.pending ? ' en file' : ''; c = 'att'; }
    else if (s.pending) { t = 'Envoi…'; c = 'att'; }
    else { t = 'Synchronisé'; c = 'ok'; }
    b.className = 'sync ' + c; $('span', b).innerHTML = esc(t) + (l ? '<span class="l">' + esc(l) + '</span>' : '');
    $('#aide-mode').textContent = typo(s.mode === 'local'
      ? 'Mode essai : vos choix restent sur cet appareil. Rien n\'est envoyé à AXEM et rien n\'est publié sur LinkedIn.'
      : (s.error || !Store.posts().length) ? 'Aucun post n\'est visible : soit il n\'y a rien à trier, soit le code d\'accès manque. Ouvrez le lien exact envoyé par AXEM.'
      : !s.online ? 'Hors ligne : vos choix sont gardés sur cet appareil et partent vers AXEM dès que le réseau revient. Un post qui n\'est pas arrivé chez AXEM avant 8 h 15 ne sera pas publié.'
      : 'Vos choix partent chez AXEM dès que vous les faites. Un post gardé est publié sur LinkedIn à 8 h 15 le jour prévu ; vous pouvez le retirer ou le modifier jusqu\'à cette heure.');
  }

  /* ---------- cartes ---------- */
  function cutIndex(t) {
    if (t.length <= LIM) return null;
    var nl = t.lastIndexOf('\n', LIM); if (nl >= 60) return nl;
    var k = t.lastIndexOf(' ', LIM); return k < 60 ? LIM : k;
  }
  var VOIR = '<span class="coupe" title="Dans le fil LinkedIn, le texte s\'arrête ici (environ)">…voir plus</span><small class="coupe-l">ici, LinkedIn coupe le texte dans le fil</small>';
  function br(s) { return esc(s).replace(/(^|\n)([•▪◦])[ ]?/g, '$1<span class="puce">•</span> ').replace(/\n/g, '<br>'); }
  function corpsHtml(t) {
    var cut = cutIndex(t), paras = t.split(/\n\s*\n/), pos = 0, out = '', marked = false;
    paras.forEach(function (par) {
      var start = pos, end = pos + par.length; pos = end + 2;
      if (cut === null) { out += '<p>' + br(par) + '</p>'; return; }
      if (marked) { out += '<p class="suite">' + br(par) + '</p>'; return; }
      if (cut >= end + 3) { out += '<p>' + br(par) + '</p>'; return; }
      if (cut >= end) { marked = true; out += '<p>' + br(par) + VOIR + '</p>'; return; }
      var k = Math.max(0, cut - start); marked = true;
      out += '<p>' + br(par.slice(0, k)) + VOIR + '<span class="suite">' + (par.charAt(k) === '\n' ? '<br>' : ' ') + br(par.slice(k).replace(/^\s+/, '')) + '</span></p>';
    });
    return out;
  }
  /* aperçu de la carte repliée : le texte du post APRÈS son accroche (qui est déjà en titre), rogné par un fondu */
  var apercuCoupe = false;
  function apercuHtml(p) {
    apercuCoupe = false;
    var t = String(p.texte || ''), h = String(p.hook || '').trim();
    if (h && t.indexOf(h) === 0) { var r = t.slice(h.length).replace(/^[\s]+/, ''); if (r.length > 40) t = r; }
    if (t.length > 700) apercuCoupe = true;
    return t.slice(0, 700).split(/\n\s*\n/).filter(Boolean).map(function (par) { return '<p>' + br(par.replace(/^\s+|\s+$/g, '')) + '</p>'; }).join('');
  }

  /* ---------- split screen : le post qui a marché à côté de celui de Cédric ---------- */
  function paras(t) { return String(t || '').split(/\n\s*\n/).filter(Boolean).map(function (x) { return '<p>' + br(x.replace(/^\s+|\s+$/g, '')) + '</p>'; }).join(''); }
  function nbr(n) { return n == null ? '' : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NB); }
  /* relecteur 7 : « Pourquoi il marche » en points (Accroche, Structure, Levier, Chute), plus un bloc de texte */
  function pourquoiHtml(t) {
    var parts = String(t).split(/(?:^|\.\s+)(Accroche|Structure|Levier|Chute et visuel|Visuel)\s*:\s*/).filter(function (x) { return x && x.trim(); });
    if (parts.length < 2) return esc(t);
    var out = '';
    var MOTS = { 'Accroche': 'Comment il commence', 'Structure': 'Comment il est construit', 'Levier': 'Ce qui fait réagir', 'Chute et visuel': 'Comment il finit', 'Visuel': 'L\'image' };
    for (var k = 0; k + 1 < parts.length; k += 2) out += '<dt>' + esc(MOTS[parts[k]] || parts[k]) + '</dt><dd>' + esc((function (v) { v = v.replace(/\.?\s*$/, '.'); return v.charAt(0).toUpperCase() + v.slice(1); })(parts[k + 1])) + '</dd>';
    return '<dl>' + out + '</dl>';
  }
  function openSplit(p) {
    var m = p.modele || {}, d = $('#split');
    var who = m.auteur || 'Un dirigeant de la niche';
    var stats = (m.reactions != null ? '<span class="stat"><b>' + esc(nbr(m.reactions)) + '</b> réaction' + (m.reactions > 1 ? 's' : '') + '</span>' : '') + (m.commentaires ? '<span class="stat"><b>' + esc(nbr(m.commentaires)) + '</b> commentaire' + (m.commentaires > 1 ? 's' : '') + '</span>' : '');
    $('.pane.mod', d).innerHTML = '<p class="kick">' + (m.texte_fr ? 'Le post d\'origine, traduit de l\'' + esc(m.langue || 'anglais') : 'Le post d\'origine, tel que publié') + '</p><div class="aut2"><b>' + esc(who) + '</b>' + (m.date ? '<small>' + esc(quand(m.date)) + '</small>' : '') + '</div>' +
      (stats ? '<div class="stats">' + stats + '</div>' : '') + (m.visuel ? '<img class="mvis" alt="" src="' + esc(m.visuel) + '">' : '') +
      '<div class="corps">' + paras(m.texte_fr || m.texte) + '</div>' +
      (m.texte_fr ? '<details class="vo"><summary>Lire le texte original (' + esc(m.langue || 'anglais') + ')</summary><div class="corps" lang="en">' + paras(m.texte) + '</div></details>' : '') +
      (m.pourquoi ? '<div class="bloc pq"><b>Ce qui a fonctionné</b>' + pourquoiHtml(m.pourquoi) + '</div>' : '') +
      (m.url ? '<a class="lien-ext" href="' + esc(m.url) + '" target="_blank" rel="noopener">Voir le post d\'origine ↗</a>' : '');
    $('.pane.cd', d).innerHTML = '<p class="kick">La version de Cédric</p><div class="aut2"><b>Cédric Golfier</b><small>' + esc(quand(p.publish_at)) + '</small></div>' +
      '<img class="mvis" alt="' + esc(p.alt || '') + '" src="' + esc(p.visuel) + '">' + '<div class="corps">' + paras(p.texte) + '</div>' +
      (m.twist ? '<div class="bloc twist"><b>Ce qu\'on a changé pour Cédric</b>' + esc(m.twist) + '</div>' : '');
    $$('.split-tabs [role=tab]', d).forEach(function (b) { b.setAttribute('aria-selected', b.dataset.pane === 'mod' ? 'true' : 'false'); });
    d.dataset.pane = 'mod';
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
    var hh = $('#split-h'); hh.tabIndex = -1; hh.style.outline = 'none'; hh.focus({ preventScroll: true });   /* relecteur 7 : pas d'anneau sur Fermer à la souris */
  }
  document.addEventListener('click', function (e) {
    var sp = e.target.closest('[data-split]');
    if (sp) { var c = sp.closest('.carte'), p = c && Store.get(c.dataset.id); if (p && p.modele) openSplit(p); return; }
    var tab = e.target.closest('#split [role=tab]');
    if (tab) { var d = $('#split'); d.dataset.pane = tab.dataset.pane; $$('.split-tabs [role=tab]', d).forEach(function (b) { b.setAttribute('aria-selected', b === tab ? 'true' : 'false'); }); return; }
    if (e.target.closest('#split-x')) { var dd = $('#split'); if (dd.close) dd.close(); else dd.removeAttribute('open'); }
  });

  /* relecteur 8 (25/11) : sur ordinateur large, le visuel est posé à côté de la zone qui défile, pas dedans */
  var mqLarge = window.matchMedia('(min-width:1100px) and (min-height:640px)');
  function placeVisuels() {
    Array.prototype.forEach.call(document.querySelectorAll('#scene .carte'), function (c) {
      var v = c.querySelector('.c-visuel'), g = c.querySelector('.c-gauche'); if (!v || !g) return;
      if (mqLarge.matches) { if (v.parentNode !== c) c.insertBefore(v, c.firstChild); }
      else if (v.parentNode !== g) g.insertBefore(v, g.firstChild);
    });
  }
  if (mqLarge.addEventListener) mqLarge.addEventListener('change', placeVisuels);
  function cardHtml(p, k, N) {
    var src = (p.sources || []).map(function (s) { return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a>'; }).join('<br>');
    var photo = window.GESTUEL_CONFIG && window.GESTUEL_CONFIG.photo;
    return '<article class="carte" data-id="' + esc(p.id) + '" role="group" aria-label="Post ' + (k + 1) + ' sur ' + N + '">' +
      '<div class="stamp k" aria-hidden="true">GARDER</div><div class="stamp r" aria-hidden="true">RETIRER</div>' +
      '<div class="c-defil"><div class="c-gauche">' +
      '<div class="c-visuel"><img class="flou" alt="" aria-hidden="true" src="' + esc(p.visuel) + '" draggable="false"><img class="net" alt="' + esc(p.alt || '') + '" src="' + esc(p.visuel) + '" draggable="false"></div>' +
      '<p class="quand-c">' + quand(p.publish_at) + ' · ' + esc(p.format) + '</p><h2 class="accroche">' + esc(typo(p.hook)) + '</h2>' +
      (function () { var h = apercuHtml(p); return '<div class="apercu"' + (apercuCoupe ? ' data-coupe="1"' : '') + '><div class="corps">' + h + '</div></div>'; })() +
      '<button type="button" class="lire" data-lire="1" aria-expanded="false">Lire la suite ↓</button>' +
      (p.modele ? '<button type="button" class="comparer" data-split="1">' + ('<span class="l-long">Voir le post qui l\'a inspiré</span><span class="l-court">Voir l\'original</span>' + (p.modele.reactions ? ' <span class="nb">' + nbr(p.modele.reactions) + '\u00a0réactions</span>' : '')) + '</button>' : '') +
      '<div class="c-texte"><div class="aut"><span class="av">' + (photo ? '<img alt="" src="' + esc(photo) + '">' : 'CG') + '</span><div><b>Cédric Golfier</b><small>Dirigeant · Gestuel\'Santé</small><small class="quand">' + quand(p.publish_at) + '</small></div><span class="etq">' + esc(p.format) + '</span></div>' +
      '<div class="chips-m">' + (p.sources && p.sources.length ? '<a href="' + esc(p.sources[0].url) + '" target="_blank" rel="noopener">Source du chiffre ↗</a>' : '') + '<button type="button" data-bas="1">Pourquoi ce post ↓</button></div>' +
      '<div class="seg" role="group" aria-label="Affichage du texte"><button type="button" class="on" data-v="plein" aria-pressed="true">Post complet</button><button type="button" data-v="fil" aria-pressed="false">Dans le fil</button></div>' +
      '<div class="corps">' + corpsHtml(p.texte) + '</div>' +
      '<div class="edit-zone" hidden><p class="edit-h">Modifier le texte du post</p><div class="edit-wrap"><div class="edit-mirror" aria-hidden="true"></div><textarea class="edit" aria-label="Texte du post" spellcheck="true" lang="fr"></textarea></div>' +
      '<p class="vu"></p><div class="edit-pied"><span class="n"></span><button type="button" class="lien orig" disabled>Revenir au texte d\'origine</button></div></div></div>' +
      '<div class="c-meta">' + (src ? '<div class="bloc" id="src-' + k + '"><b>Source des chiffres</b>' + src + '</div>' : '') + '<div class="bloc"><b>Pourquoi ce post</b>' + esc(p.pourquoi || '') + '</div>' + (p.origine ? '<div class="bloc"><b>D\'où vient l\'idée</b>' + esc(p.origine) + '</div>' : '') + '</div>' +
      '</div></div>' +
      '<button type="button" class="suite-pastille" data-suite="1" tabindex="-1" aria-hidden="true">La suite du post ↓</button></article>';
  }

  /* fin de carte : fondu de 24 px et pastille « La suite du post », tant qu'il reste du texte sous la ligne de flottaison */
  function reste(c) {
    if (!c) return; var s = $('.c-defil', c), pl = $('.suite-pastille', c); if (!s || !pl) return;
    var plus = s.scrollHeight - s.scrollTop - s.clientHeight > 6;
    s.classList.toggle('reste', plus);
    var ap = $('.apercu', c); if (ap && ap.offsetHeight) ap.classList.toggle('plein', ap.scrollHeight <= ap.clientHeight + 2 && !ap.dataset.coupe); ap.classList.toggle('mini', ap.clientHeight < 38);
    var li = $('.lire', c); if (li && ap && !c.classList.contains('ouvert')) li.textContent = ap.classList.contains('plein') ? 'Sources et détails ↓' : 'Lire la suite ↓';
    var on = plus && s.scrollTop < 12 && c.dataset.top === '1' && !c.classList.contains('editing') && !c.classList.contains('vole');
    pl.classList.toggle('on', on); pl.tabIndex = on ? 0 : -1; pl.setAttribute('aria-hidden', on ? 'false' : 'true');
  }
  function majReste(c) { if (!c) return; reste(c); setTimeout(function () { reste(c); }, 120); setTimeout(function () { reste(c); }, 520); }
  function brancheCarte(c) {
    var s = $('.c-defil', c); s.addEventListener('scroll', function () { reste(c); }, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(function () { reste(c); }).observe(s);
  }
  window.addEventListener('resize', function () { var c = cards[queue[0]]; if (c) { majReste(c); var ta = $('.edit', c); if (editing && ta) autosize(c); } });

  /* ---------- tri ---------- */
  function openDeck(list, startId) {
    ids = list.slice(); queue = list.slice(); dec = {}; hist = []; lastDir = {}; editing = false; busy = false;
    if (startId) { queue = [startId].concat(queue.filter(function (i) { return i !== startId; })); ids = queue.slice(); }
    cachetRange();
    var sc = $('#scene'); sc.innerHTML = ids.map(function (id, k) { return cardHtml(Store.get(id), k, ids.length); }).join(''); placeVisuels();
    cards = {}; $$('.carte', sc).forEach(function (c) { cards[c.dataset.id] = c; brancheCarte(c); gsap.set(c, { transformOrigin: '50% 100%' }); });
    $('#pips').innerHTML = ids.map(function () { return '<i></i>'; }).join('');
    $('#legende').hidden = ids.length < 2;
    $('#indice').hidden = false;
    show('tri'); place(false); $('#barre').classList.remove('edition');
    if (!reduit && window.gsap) { gsap.from(cards[queue[0]], { y: 90, opacity: 0, scale: .94, duration: 1, ease: 'expo.out' }); gsap.from('.barre .rond', { y: 40, opacity: 0, duration: .9, ease: 'expo.out', stagger: .06, delay: .15, clearProps: 'opacity,transform' });   /* clearProps : sans lui, GSAP figeait l'opacité du bouton grisé (Défaire) à .38 pour toute la session */ }
    hint();
  }
  function hint() {
    try { if (localStorage.getItem('gestuel-indice-v1')) return; localStorage.setItem('gestuel-indice-v1', '1'); } catch (e) {}
    if (reduit || !window.gsap) return;
    setTimeout(function () { var c = cards[queue[0]]; if (c && !busy && !editing && view === 'tri') gsap.to(c, { x: 34, rotation: 2.2, duration: .5, ease: 'expo.out', yoyo: true, repeat: 1 }); }, 1500);
  }
  function updatePips() {
    var g = 0, r = 0;
    $$('#pips i').forEach(function (p, k) { var id = ids[k], d = dec[id]; if (d === 'garder') g++; else if (d) r++; p.className = d ? (d === 'garder' ? 'ok' : 'non') : (queue[0] === id ? 'now' : ''); });
    var n = ids.length - queue.length + 1; $('#compteur').textContent = queue.length ? Math.min(n, ids.length) + ' sur ' + ids.length : '';
    $('#pips').setAttribute('aria-label', (queue.length ? 'Post ' + Math.min(n, ids.length) + ' sur ' + ids.length + '. ' : 'Tri terminé. ') + g + (g > 1 ? ' gardés' : ' gardé') + ', ' + r + (r > 1 ? ' retirés' : ' retiré') + '.');
    $('#legende').style.visibility = (g + r) ? 'visible' : 'hidden';
    $('#b-undo').disabled = !hist.length;
    $('#b-oui').disabled = $('#b-non').disabled = $('#b-edit').disabled = !queue.length;
  }
  /* la pile : la carte du dessus, et deux cartes visibles derrière (jamais deux textes lisibles à la fois) */
  function place(anim) {
    ids.forEach(function (id) { var c = cards[id]; delete c.dataset.top; if (queue.indexOf(id) < 0 || queue.indexOf(id) > 2) { if (!c.classList.contains('vole')) c.style.display = 'none'; } });
    queue.slice(0, 3).forEach(function (id, p) {
      var c = cards[id], nouvelle = c.style.display === 'none' || !c.style.display && false;
      c.style.display = 'flex'; c.style.zIndex = 10 - p; c.style.pointerEvents = p === 0 ? 'auto' : 'none'; c.setAttribute('aria-hidden', p === 0 ? 'false' : 'true'); c.inert = p > 0;
      c.classList.toggle('cache', p > 0); c.classList.toggle('p2', p > 1); if (p === 0) c.dataset.top = '1';
      var t = { x: 0, y: p * 8, scale: 1 - p * .04, rotation: 0, opacity: 1 };
      if (anim && !reduit && window.gsap) {
        if (nouvelle) gsap.set(c, { opacity: 0, y: p * 8 + 14, scale: 1 - p * .04 - .02 });
        gsap.to(c, Object.assign({ duration: .65, ease: 'expo.out', overwrite: 'auto' }, t));
      } else gsap.set(c, t);
    });
    var top = cards[queue[0]];
    if (top) { $$('.stamp', top).forEach(function (s) { gsap.set(s, { opacity: 0 }); }); var d = $('.c-defil', top); if (d) d.scrollTop = 0; majReste(top); }
    updatePips();
  }
  /* le message de choix : une feuille compacte posée en bas de la carte, jamais sur la barre de progression ni sur le haut de la carte.
     Fond opaque dès la première image (seule la position bouge, jamais l'opacité à l'entrée). Défaire reste dans la barre d'actions, actif. */
  function hideToast(vite) { var el = $('#toast'); clearTimeout(tToast); el.classList.remove('on'); $('#barre').classList.remove('toast-on'); if (window.gsap) { gsap.killTweensOf(el); if (vite) gsap.set(el, { opacity: 0, y: 16 }); else gsap.to(el, { y: 16, opacity: 0, duration: dur(.25), ease: 'power2.in' }); } else el.style.opacity = '0'; }
  function placeToast() {
    /* relecteur 7 : le message prend la place de la barre d'actions, il ne couvre plus la carte suivante */
    var el = $('#toast'), r = $('#scene').getBoundingClientRect(), b = $('#barre').getBoundingClientRect(), w = Math.min(r.width - 16, innerWidth >= 1100 ? 900 : 640);
    el.style.left = (r.left + (r.width - w) / 2) + 'px'; el.style.width = Math.max(240, w) + 'px'; el.style.bottom = Math.max(8, innerHeight - b.bottom + 10) + 'px';
  }
  function toast(kind, p, sub, motifs) {
    var el = $('#toast'); clearTimeout(tToast);
    var dbt = '«' + NB + court(typo(p.hook).replace(/^«\s*/, '').replace(/\s*»$/, ''), 34) + NB + '»';
    var head = kind === 'garder' ? '<b>Gardé</b> · ' + esc(quand(p.publish_at)) : '<b>Retiré</b> · ' + esc(dbt);
    var sec = esc(typo(sub));
    el.innerHTML = '<div class="l1"><img alt="" src="' + esc(p.visuel) + '"><div class="tt"><div class="t1">' + head + '</div><div class="t2">' + sec + '</div><div class="t3">Glissez le post suivant pour continuer.</div></div><button type="button" class="t-undo">Défaire</button></div>' +
      (motifs ? '<div class="motifs" role="group" aria-label="Pourquoi retirer ce post (facultatif, ça aide AXEM à réécrire)"><button type="button" class="q" aria-expanded="false">Dire pourquoi' + NB + '? (facultatif)</button>' + MOTIFS.map(function (m) { return '<button type="button" data-m="' + esc(m) + '">' + m + '</button>'; }).join('') + '</div>' : '');
    var id = p.id;
    $('.t-undo', el).onclick = function () { undo(); };
    var qb = $('.motifs .q', el); if (qb) qb.onclick = function () { var m = qb.parentNode, o = !m.classList.contains('ouvert'); m.classList.toggle('ouvert', o); qb.setAttribute('aria-expanded', o ? 'true' : 'false'); clearTimeout(tToast); tToast = setTimeout(hideToast, 9000); placeToast(); };
    $$('.motifs button', el).forEach(function (b) { b.onclick = function () { $$('.motifs button', el).forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); Store.update(id, { motif: b.dataset.m }); clearTimeout(tToast); tToast = setTimeout(hideToast, 3200); }; });
    placeToast(); el.classList.add('on'); $('#barre').classList.add('toast-on');
    if (window.gsap) { gsap.killTweensOf(el); gsap.set(el, { opacity: 1 }); gsap.fromTo(el, { y: 14 }, { y: 0, duration: dur(.45), ease: 'expo.out' }); } else el.style.opacity = '1';
    tToast = setTimeout(hideToast, motifs ? 7000 : 4500);
  }
  /* le tampon bleu « PROGRAMMÉ » avec le jour et l'heure : il tombe SUR la carte gardée et part avec elle (19/11 : il restait sur la carte suivante) */
  function cachetRange() { var el = $('#cachet'); if (el.parentNode !== document.body) document.body.appendChild(el); el.classList.remove('sur-carte'); if (window.gsap) gsap.killTweensOf(el); el.style.opacity = '0'; }
  function cachet(p, c) {
    var el = $('#cachet'), r = $('#scene').getBoundingClientRect(); clearTimeout(tCachet);
    var jour = parts(p.publish_at, { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase();
    if (reduit || !window.gsap) { cachetRange(); el.innerHTML = '<b>PROGRAMMÉ</b><span>' + esc(jour) + ' · ' + esc(heure(p.publish_at).toUpperCase()) + '</span>'; el.style.left = (r.left + r.width / 2) + 'px'; el.style.top = (r.top + Math.min(r.height * .42, 250)) + 'px'; el.style.opacity = '1'; tCachet = setTimeout(function () { el.style.opacity = '0'; }, 1600); return; }
    gsap.killTweensOf(el); el.innerHTML = '<b>PROGRAMMÉ</b><span>' + esc(jour) + ' · ' + esc(heure(p.publish_at).toUpperCase()) + '</span>';
    el.style.left = ''; el.style.top = ''; el.classList.add('sur-carte'); c.appendChild(el);
    el.style.transform = 'none'; gsap.set(el, { xPercent: -50, yPercent: -50, rotation: -8, opacity: 0, scale: 1.3 });   /* 19/11 : départ à 1,3 (et non 2,4) : le tampon n'est jamais plus large que la carte, même à 120 ms */
    gsap.timeline().to(el, { opacity: 1, scale: 1, duration: .24, ease: 'power4.in' })
      .to(el, { scale: 1.06, duration: .08, yoyo: true, repeat: 1, ease: 'sine.inOut' });
  }
  /* le trait de feutre sur Garder : une coche tracée en 600 ms */
  function cocheFeutre() {
    var path = $('#coche'); if (!path || reduit || !window.gsap) return;
    gsap.killTweensOf(path); gsap.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .6, ease: 'power2.out' });
  }

  function decide(act, fromDrag) {
    if (busy || editing || !queue.length) return;
    var id = queue[0], c = cards[id], p = Store.get(id), dir = act === 'garder' ? 1 : -1;
    $('#indice').hidden = true; busy = true; hist.push({ id: id, prev: { statut: p.statut, motif: p.motif } }); dec[id] = act; queue.shift(); lastDir[id] = dir; delete c.dataset.top; c.inert = true;
    Store.update(id, { statut: act === 'garder' ? 'programme' : 'retire', motif: '' });
    var qd = quand(p.publish_at);
    var hors = !isLocal() && (!Store.status().online || !navigator.onLine), horsTxt = 'Enregistré sur cet appareil. Il part vers AXEM dès que le réseau revient.';
    if (act === 'garder') {
      toast('garder', p, isLocal() ? 'Mode essai : rien n\'est publié sur LinkedIn.' : hors ? horsTxt : 'Prévu à ' + heure(p.publish_at) + ' sur LinkedIn. Modifiable jusque-là.', false);
      announce('Post gardé, publication ' + qd); cachet(p, c); cocheFeutre(); buzz([14, 40, 18]);
    } else { toast('retirer', p, hors ? horsTxt : 'AXEM le réécrit et le remet ici.', true); announce('Post retiré'); buzz(8); }
    var done = function () { c.classList.remove('vole'); c.style.display = 'none'; if (act === 'garder' && $('#cachet').parentNode === c) cachetRange(); busy = false; if (undoAttend) { undo(); return; } if (!queue.length) setTimeout(finDeTri, dur(.35) * 1000); majReste(cards[queue[0]]); updatePips(); };
    updatePips();
    if (reduit || !window.gsap) { c.style.display = 'none'; place(false); done(); return; }
    c.classList.add('vole'); c.style.zIndex = 20; reste(c);
    if (act === 'garder') gsap.to($$('.stamp', c)[0], { opacity: 0, duration: .1 }); else gsap.set($$('.stamp', c)[1], { opacity: 1 });   /* GARDER s'efface : le tampon PROGRAMMÉ le remplace */
    gsap.to(c, { x: dir * (innerWidth * 1.15), rotation: dir * 16, y: fromDrag ? 20 : 60, duration: act === 'garder' ? .52 : .62, delay: act === 'garder' ? .08 : 0, ease: 'expo.in', onComplete: done });
    place(true);
  }
  function undo() {
    if (editing || !hist.length) return;
    if (busy) { undoAttend = true; return; }      /* Défaire juste après un choix : pris en compte dès que la carte a fini de partir */
    undoAttend = false;
    var h = hist.pop(), id = h.id, c = cards[id];
    Store.update(id, { statut: h.prev.statut, motif: h.prev.motif }); delete dec[id]; queue.unshift(id); hideToast(); announce('Dernier choix défait');
    if (view !== 'tri') { show('tri'); }
    c.style.display = 'flex'; c.classList.remove('vole'); place(!reduit);
    if (!reduit && window.gsap) { var d = lastDir[id] || 1; gsap.killTweensOf(c); gsap.fromTo(c, { x: d * innerWidth * .9, rotation: d * 14, y: 0, scale: 1, opacity: 1 }, { x: 0, rotation: 0, duration: .8, ease: 'expo.out' }); }
    buzz(6);
  }
  function finDeTri() {
    if (queue.length || view !== 'tri') return;
    var rest = Store.posts().filter(function (p) { return p.statut === 'a_trier'; }).length;
    if (rest) { show('home'); renderHome(false); return; }
    var P = Store.posts(), K = P.filter(function (p) { return p.statut === 'programme'; }), tout = !K.length;
    show('fin'); $('#gros').textContent = '0'; $('#gros-wrap').classList.remove('on');
    $('#fin-h').innerHTML = tout ? 'Tout est <em>retiré.</em>' : 'Vos posts sont <em>prêts.</em>';
    $('#gros-wrap').hidden = tout; $('#fin-pict').hidden = !tout; if (tout) setPict('#fin-pict', 'refaire');
    var RR = P.filter(function (p) { return p.statut === 'retire'; }).length;
    $('#fin-sous').textContent = typo(tout ? 'Aucun post gardé : AXEM les réécrit et vous les remet ici.' : 'post' + (K.length > 1 ? 's' : '') + ' gardé' + (K.length > 1 ? 's' : '') + (RR ? ', ' + RR + (RR > 1 ? ' reviennent réécrits' : ' revient réécrit') + ' par AXEM' : '') + '.' + (isLocal() ? ' Mode essai : rien ne part sur LinkedIn.' : ' Chacun part sur le LinkedIn de Cédric à 8 h 15, le jour prévu.'));
    $('#fin-liste').innerHTML = '<h3>Le calendrier</h3><div class="rail">' + pleins(weekDays(P)).map(function (w) {
      var p = w.post, jr = '<div class="jr"><span>' + parts(w.iso, { day: 'numeric' }) + '</span><b>' + parts(w.iso, { weekday: 'short' }).replace('.', '') + ' ' + parts(w.iso, { month: 'short' }).replace('.', '') + '</b></div>';
      if (!p) return '<div class="slot vide">' + jr + '<div class="txt"><p>Pas de post</p></div></div>';
      var ok = p.statut === 'programme';
      return '<div class="slot ' + (ok ? 'ok' : 'r') + '">' + jr + '<div class="thumb"><img alt="" src="' + esc(p.visuel) + '"></div><div class="txt"><p>' + esc(typo(p.hook)) + '</p><span class="etat ' + p.statut + '">' + (ok ? 'Gardé · ' + heure(p.publish_at) : 'Retiré' + (p.motif ? ' · ' + esc(p.motif) : ' · AXEM le réécrit')) + '</span></div></div>';
    }).join('') + '</div>';
    var o = { n: 0 };
    if (window.gsap && !reduit) {
      gsap.to(o, { n: K.length, duration: .9, ease: 'power2.out', onUpdate: function () { $('#gros').textContent = Math.round(o.n); }, onComplete: function () { $('#gros').textContent = K.length; } });
      gsap.fromTo('#gros', { scale: .55 }, { scale: 1, duration: 1.05, ease: 'back.out(2.6)' });
      if (!tout) feutre($('#gros-wrap'), .8);
      gsap.from('#fin .fin-in > *:not(.cta-row)', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: .09 });
      gsap.from('#fin .cta-row', { y: 40, duration: 1, ease: 'expo.out', delay: .2 });   /* les boutons ne passent jamais par un état translucide (contraste lisible dès la première image) */
      gsap.from('.rail .slot', { y: -60, opacity: 0, rotation: -3, duration: .9, ease: 'expo.out', stagger: .06, delay: .45 });
      gsap.from('.slot.ok .etat', { scale: 2.1, opacity: 0, rotation: -16, duration: .4, ease: 'back.out(2)', stagger: .06, delay: .7 });
    } else { $('#gros').textContent = K.length; if (!tout) feutre($('#gros-wrap'), 0); }
    announce(K.length + (K.length > 1 ? ' posts programmés' : ' post programmé'));
  }

  /* ---------- modification du texte : le repère « …voir plus » suit la frappe ---------- */
  /* le champ occupe la hauteur de la carte et défile en interne ; le repère « …voir plus » (miroir) suit son défilement */
  function syncMirror(c) { var ta = $('.edit', c), m = $('.edit-mirror', c); if (ta && m) m.scrollTop = ta.scrollTop; }
  function autosize(c) { syncMirror(c); }
  function mirrorHtml(t) {
    var cut = cutIndex(t);
    if (cut === null) return esc(t) + '\u200b';
    return '<span class="vis">' + esc(t.slice(0, cut)) + '</span><span class="cut"></span>' + esc(t.slice(cut)) + '\u200b';
  }
  function vuTexte(t) {
    var cut = cutIndex(t);
    if (cut === null) return 'Tout le texte est visible dans le fil&nbsp;: <b>' + t.length.toLocaleString('fr-FR') + ' caractères</b>, pas de «' + NB + '…voir plus' + NB + '».';
    var n = t.slice(0, cut).replace(/\s+$/, '').length;
    return 'Sur LinkedIn, on lit les <b>' + n.toLocaleString('fr-FR') + ' premiers caractères</b> avant «' + NB + '…voir plus' + NB + '»';
  }
  function setOuvert(c, o) {
    c.classList.toggle('ouvert', o); var l = $('.lire', c); l.setAttribute('aria-expanded', o ? 'true' : 'false'); l.textContent = o ? 'Replier ↑' : 'Lire la suite ↓';
    /* relecteur 6 (25/11) : à l'ouverture, le texte du post arrive tout de suite à l'écran */
    var sc = $('.c-defil', c), cib = $('.c-texte .seg', c) || $('.c-texte .corps', c);
    if (!sc) return; if (!o || !cib) { sc.scrollTop = 0; return; }
    requestAnimationFrame(function () { var y = cib.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 10; sc.scrollTo({ top: Math.max(0, y), behavior: reduit ? 'auto' : 'smooth' }); });
  }
  function counter(c) {
    var ta = $('.edit', c), n = ta.value.length, el = $('.edit-pied .n', c);
    el.textContent = n.toLocaleString('fr-FR') + ' / ' + MAXC.toLocaleString('fr-FR') + ' caractères'; el.className = 'n' + (n > MAXC ? ' max' : '');
    $('#b-edit-ok').disabled = n > MAXC || !ta.value.trim();
    $('.orig', c).disabled = ta.value === Store.get(c.dataset.id).texte_origine;
    $('.edit-mirror', c).innerHTML = mirrorHtml(ta.value); $('.vu', c).innerHTML = vuTexte(ta.value);
    syncMirror(c); reste(c);
  }
  function startEdit() {
    if (busy || editing || !queue.length) return;
    var id = queue[0], c = cards[id], p = Store.get(id); editing = true; setOuvert(c, true);
    $('.c-texte .corps', c).hidden = true; $('.edit-zone', c).hidden = false; var ta = $('.edit', c); ta.value = p.texte;
    $('#indice').style.display = 'none';
    ta.oninput = function () { counter(c); }; ta.onscroll = function () { syncMirror(c); }; $('.orig', c).onclick = function () { if (this.disabled) return; ta.value = p.texte_origine; counter(c); ta.focus(); };
    $('#barre').classList.add('edition'); c.classList.add('editing'); counter(c);
    var s = $('.c-defil', c); if (s) s.scrollTop = 0; ta.scrollTop = 0; ta.focus({ preventScroll: true }); ta.setSelectionRange(0, 0); majReste(c);
  }
  function endEdit(save) {
    if (!editing) return; var id = queue[0], c = cards[id], ta = $('.edit', c);
    if (save) {
      if (ta.value.length > MAXC || !ta.value.trim()) return;
      var v = ta.value.replace(/\s+$/, ''); if (v !== Store.get(id).texte) { Store.update(id, { texte: v }); $('.c-texte .corps', c).innerHTML = corpsHtml(v); $('.apercu .corps', c).innerHTML = apercuHtml(Store.get(id)); announce('Texte enregistré'); }
    }
    editing = false; $('#indice').style.display = ''; $('.c-texte .corps', c).hidden = false; $('.edit-zone', c).hidden = true; $('#barre').classList.remove('edition'); c.classList.remove('editing'); majReste(c);
    if (save && window.gsap && !reduit) gsap.fromTo($('.c-texte .corps', c), { opacity: .2, y: 8 }, { opacity: 1, y: 0, duration: .7, ease: 'expo.out' });
  }

  $('#scene').addEventListener('click', function (e) {
    var lire = e.target.closest('[data-lire]'); if (lire) { var cl = lire.closest('.carte'); setOuvert(cl, !cl.classList.contains('ouvert')); majReste(cl); return; }
    var sui = e.target.closest('[data-suite]'); if (sui) { var s0 = $('.c-defil', sui.closest('.carte')); s0.scrollBy({ top: Math.round(s0.clientHeight * .75), behavior: reduit ? 'auto' : 'smooth' }); return; }
    var bas = e.target.closest('[data-bas]'); if (bas) { var s1 = $('.c-defil', bas.closest('.carte')); s1.scrollTo({ top: s1.scrollHeight, behavior: reduit ? 'auto' : 'smooth' }); return; }
    var b = e.target.closest('.seg button'); if (!b) return; var c = b.closest('.carte'), fil = b.dataset.v === 'fil';
    c.classList.toggle('fil', fil); $$('.seg button', c).forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    majReste(c); announce(fil ? 'Aperçu comme dans le fil LinkedIn' : 'Post complet');
  });

  /* ---------- geste : glisser la carte ---------- */
  var drag = null;
  $('#scene').addEventListener('pointerdown', function (e) {
    if ($('#toast').classList.contains('on')) hideToast();   /* relecteur 7 : toucher la carte suivante rend la barre d'actions */
    var c = cards[queue[0]]; if (!c || busy || editing || e.button > 0 || !c.contains(e.target)) return;
    if (e.target.closest('a,button,textarea,.edit-wrap')) return;
    drag = { x: e.clientX, y: e.clientY, id: e.pointerId, c: c, go: false, dx: 0, v: 0, lx: e.clientX, lt: performance.now() };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.go) { if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.3) { drag.go = true; drag.c.classList.add('drag'); try { drag.c.setPointerCapture(e.pointerId); } catch (_) {} } else return; }
    var now = performance.now(); drag.v = (e.clientX - drag.lx) / Math.max(1, now - drag.lt); drag.lx = e.clientX; drag.lt = now; drag.dx = dx;
    gsap.set(drag.c, { x: dx, rotation: dx * .04, y: Math.abs(dx) * .04 });
    var pr = Math.min(1, Math.abs(dx) / 220), n1 = cards[queue[1]], n2 = cards[queue[2]];
    if (n1) gsap.set(n1, { y: 8 * (1 - pr), scale: .96 + .04 * pr });
    if (n2) gsap.set(n2, { y: 16 - 8 * pr, scale: .92 + .04 * pr });
    var st = $$('.stamp', drag.c); gsap.set(st[0], { opacity: Math.max(0, Math.min(1, dx / 130)) }); gsap.set(st[1], { opacity: Math.max(0, Math.min(1, -dx / 130)) });
  });
  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return; var d = drag; drag = null; d.c.classList.remove('drag'); if (!d.go) return;
    var v = (performance.now() - d.lt < 90) ? d.v : 0;      // la vitesse ne compte que si le doigt bouge encore au moment de lâcher
    var proj = d.dx + v * 220;
    if (proj > 150) decide('garder', true); else if (proj < -150) decide('retirer', true);
    else {
      var n1 = cards[queue[1]], n2 = cards[queue[2]];
      if (n1) gsap.to(n1, { y: 8, scale: .96, duration: dur(.6), ease: 'expo.out' }); if (n2) gsap.to(n2, { y: 16, scale: .92, duration: dur(.6), ease: 'expo.out' });
      gsap.to(d.c, { x: 0, y: 0, rotation: 0, duration: dur(.7), ease: 'expo.out' }); $$('.stamp', d.c).forEach(function (s) { gsap.to(s, { opacity: 0, duration: .25 }); });
    }
  }
  window.addEventListener('pointerup', endDrag); window.addEventListener('pointercancel', endDrag);

  /* ---------- boutons, clavier ---------- */
  $('#b-oui').addEventListener('click', function () { decide('garder'); });
  $('#b-non').addEventListener('click', function () { decide('retirer'); });
  $('#b-undo').addEventListener('click', undo);
  $('#b-edit').addEventListener('click', startEdit);
  $('#b-edit-ok').addEventListener('click', function () { endEdit(true); });
  $('#b-edit-non').addEventListener('click', function () { endEdit(false); });
  $('#retour').addEventListener('click', function () { endEdit(false); show('home'); renderHome(false); });
  $('#fin-annuler').addEventListener('click', undo);
  $('#fin-revoir').addEventListener('click', function () { show('home'); renderHome(false); });
  $('#go').addEventListener('click', function () {
    var P = Store.posts(), pend = P.filter(function (p) { return p.statut === 'a_trier'; }).map(function (p) { return p.id; });
    openDeck(pend.length ? pend : P.filter(function (p) { return p.statut !== 'publie'; }).map(function (p) { return p.id; }));
  });
  $('#liste').addEventListener('click', function (e) {
    var r = e.target.closest('[data-remettre]'); if (r) { Store.update(r.dataset.remettre, { statut: 'a_trier', motif: '' }); renderHome(false); announce('Nouvelle version demandée : le post revient dans la file'); return; }
    var li = e.target.closest('.pos'); if (!li || !e.target.closest('.tap')) return; var id = li.dataset.id, p = Store.get(id);
    if (p.statut === 'a_trier') openDeck(Store.posts().filter(function (x) { return x.statut === 'a_trier'; }).map(function (x) { return x.id; }), id); else openDeck([id]);
  });
  var dlg = $('#aide'); function openAide() { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
  $('#aide-btn').addEventListener('click', openAide); $('#sync').addEventListener('click', openAide);
  $('#aide-ok').addEventListener('click', function () { dlg.close ? dlg.close() : dlg.removeAttribute('open'); });
  document.addEventListener('keydown', function (e) {
    if (dlg.open) return; var k = e.key, meta = e.metaKey || e.ctrlKey;
    if (view === 'tri') {
      if (editing) { if (k === 'Escape') { e.preventDefault(); endEdit(false); } else if (k === 'Enter' && meta) { e.preventDefault(); endEdit(true); } return; }
      if (e.target.closest && e.target.closest('button,a') && (k === 'Enter' || k === ' ')) return;
      if (k === 'ArrowRight') { e.preventDefault(); decide('garder'); } else if (k === 'ArrowLeft') { e.preventDefault(); decide('retirer'); }
      else if (k === 'z' || k === 'Z') undo(); else if (k === 'e' || k === 'E') { e.preventDefault(); startEdit(); } else if (k === 'Escape') { show('home'); renderHome(false); }
    } else if (view === 'home' && k === 'Enter' && !(e.target.closest && e.target.closest('button,a')) && !$('#go').hidden) $('#go').click();
    if (k === '?') openAide();
  });
  if (fin_hover && window.gsap && !reduit) {
    document.addEventListener('pointermove', function (e) {
      var t = e.target.closest && e.target.closest('.go,.rond .d'); if (!t) return;
      var r = t.getBoundingClientRect(); gsap.to(t, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .22, duration: .5, ease: 'expo.out', overwrite: 'auto' });
    });
    document.addEventListener('pointerout', function (e) { var t = e.target.closest && e.target.closest('.go,.rond .d'); if (t && !t.contains(e.relatedTarget)) gsap.to(t, { x: 0, y: 0, duration: .7, ease: 'expo.out' }); });
  }

  /* ---------- démarrage ---------- */
  Store.subscribe(function (P, s) { renderSync(s); if (view === 'home' && !firstHome) renderHome(false); });
  function pret() {
    chargement = false; renderSync(Store.status()); renderHome(true); firstHome = false;
    window.__app = { openDeck: openDeck, decide: decide, undo: undo, state: function () { return { view: view, queue: queue.slice(), editing: editing }; } };
    document.documentElement.setAttribute('data-pret', '1');
    if (!/accueil/.test(location.search) && Store.posts().some(function (p) { return p.statut === 'a_trier'; })) $('#go').click();
  }
  Store.init().then(pret, pret);
})();
