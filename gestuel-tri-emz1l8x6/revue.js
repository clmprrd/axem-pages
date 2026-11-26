/* Vue « écran partagé » (26/11/2026). Même données que l'ancienne appli (store.js), autre affichage :
   chaque post est montré EN ENTIER, à côté du post qui a buzzé et dont il est adapté. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var TZ = 'Europe/Paris';
  var fJour = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ });
  var fCourt = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: TZ });
  var fNum = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', timeZone: TZ });
  var fH = new Intl.DateTimeFormat('fr-FR', { hour: 'numeric', minute: '2-digit', hour12: false, timeZone: TZ });
  var LIB = { a_trier: 'À trier', programme: 'Gardé', retire: 'Retiré', publie: 'Publié' };
  var MOTIFS = ['Pas mon ton', 'Pas vrai pour moi', 'Sujet déjà traité', 'Autre raison'];
  var editing = {}, rendu = false, tAnn = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function heure(iso) { var p = fH.format(new Date(iso)).split(':'); return parseInt(p[0], 10) + ' h ' + p[1]; }
  function jour(iso) { return cap(fJour.format(new Date(iso))); }
  function nb(n) { return Number(n || 0).toLocaleString('fr-FR'); }
  function initiales(n) { return String(n || '?').replace(/[^A-Za-zÀ-ÿ ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(function (x) { return x[0]; }).join('').toUpperCase(); }
  function liste() { return Store.posts().filter(function (p) { return p.statut !== 'publie'; }); }
  function annonce(t) { var a = $('#annonce'); a.textContent = t; a.classList.add('on'); clearTimeout(tAnn); tAnn = setTimeout(function () { a.classList.remove('on'); }, 3200); }

  /* ---------- rendu d'un post ---------- */
  function postHtml(p, k, N) {
    var m = p.modele || {}, photo = window.GESTUEL_CONFIG && window.GESTUEL_CONFIG.photo;
    var img = p.visuel ? '<img class="li-img" loading="lazy" src="' + esc(p.visuel) + '" alt="' + esc(p.alt || '') + '">' : '';
    return '<article class="duo" id="p-' + esc(p.id) + '" data-id="' + esc(p.id) + '" data-vue="cedric" aria-labelledby="t-' + esc(p.id) + '">' +
      '<header class="d-tete"><div><div class="d-num">Post ' + (k + 1) + ' sur ' + N + '</div>' +
      '<h2 class="d-date" id="t-' + esc(p.id) + '">' + jour(p.publish_at) + '<small>' + heure(p.publish_at) + '</small></h2></div>' +
      '<span class="etat" data-s="' + esc(p.statut) + '">' + LIB[p.statut] + '</span></header>' +
      '<div class="bascule" role="tablist" aria-label="Choisir le volet">' +
      '<button role="tab" aria-selected="true" data-vue="cedric">Le post de Cédric</button>' +
      '<button role="tab" aria-selected="false" data-vue="modele">Le modèle (' + nb(m.reactions) + ')</button></div>' +
      '<div class="grille">' +
      '<section class="col-modele" aria-label="Le modèle">' +
      '<p class="col-tete">Le modèle qui a buzzé <em>' + esc(m.auteur || '') + '</em></p>' +
      '<div class="modele">' +
      '<div class="m-aut"><span class="m-av">' + esc(initiales(m.auteur)) + '</span><div><b>' + esc(m.auteur || 'Modèle') + '</b><small>Post LinkedIn' + (m.date ? ' du ' + esc(new Date(m.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })) : '') + '</small></div></div>' +
      '<div class="m-score"><strong>' + nb(m.reactions) + '</strong><span>réactions<br>' + nb(m.commentaires) + ' commentaires</span></div>' +
      (m.url ? '<a class="m-lien" href="' + esc(m.url) + '" target="_blank" rel="noopener">Voir le post d’origine sur LinkedIn ↗</a>' : '') +
      '<p class="m-texte">' + esc(m.texte_fr || m.texte || '') + '</p>' +
      (m.texte_fr && m.texte && m.texte_fr !== m.texte ? '<details class="m-vo"><summary>Lire le texte original</summary><p>' + esc(m.texte) + '</p></details>' : '') +
      '<div class="m-pourquoi">' +
      (m.pourquoi ? '<div><b>Pourquoi il a marché</b>' + esc(m.pourquoi) + '</div>' : '') +
      (m.twist ? '<div><b>Ce qu’on a changé pour Cédric</b>' + esc(m.twist) + '</div>' : '') +
      '</div></div></section>' +
      '<section class="col-cedric" aria-label="Le post de Cédric">' +
      '<p class="col-tete">Le post de Cédric <em>' + nb((p.texte || '').length) + ' signes</em></p>' +
      '<div class="li">' +
      '<div class="li-aut"><span class="li-av">' + (photo ? '<img alt="" src="' + esc(photo) + '">' : 'CG') + '</span><div><b>Cédric Golfier</b><small>Prévention des gestes au travail</small><small>' + jour(p.publish_at) + ' à ' + heure(p.publish_at) + '</small></div></div>' +
      '<p class="li-texte">' + esc(p.texte) + '</p>' + img +
      '<div class="li-pied"><span>' + nb((p.texte || '').length) + ' signes</span><span>Publication automatique à ' + heure(p.publish_at) + '</span></div>' +
      '</div>' +
      (p.a_confirmer ? '<div class="verif' + (p.confirme ? ' ok' : '') + '"><div><b>À vérifier par Cédric</b>' + esc(p.a_confirmer) + '</div><button data-act="confirmer">' + (p.confirme ? 'Vérifié ✓' : 'C’est exact') + '</button></div>' : '') +
      '</section></div>' +
      '<div class="actions" role="group" aria-label="Décision sur ce post"></div>' +
      '</article>';
  }

  function actionsHtml(p) {
    var quand = fCourt.format(new Date(p.publish_at)).replace('.', '') + ' ' + fNum.format(new Date(p.publish_at)) + ' à ' + heure(p.publish_at);
    if (editing[p.id]) return '<span class="msg">Vous modifiez ce post.</span>' +
      (p.texte !== p.texte_origine ? '<button class="btn" data-act="origine">Revenir au texte proposé</button>' : '') +
      '<button class="btn" data-act="annuler">Annuler</button><button class="btn oui" data-act="enregistrer">Enregistrer</button>';
    if (p.statut === 'programme') return '<span class="msg"><b>Gardé.</b> Il part le ' + esc(quand) + '.</span><button class="btn" data-act="modifier">Modifier</button><button class="btn" data-act="remettre">Remettre à trier</button>';
    if (p.statut === 'retire') return '<span class="msg"><b>Retiré.</b> Pourquoi ? (facultatif)</span><button class="btn" data-act="remettre">Le remettre</button>' +
      '<div class="motifs">' + MOTIFS.map(function (x) { return '<button data-motif="' + esc(x) + '" aria-pressed="' + (p.motif === x) + '">' + esc(x) + '</button>'; }).join('') + '</div>';
    return '<span class="msg q">Ce post vous ressemble ?</span><button class="btn non" data-act="retirer">Retirer</button><button class="btn" data-act="modifier">Modifier</button><button class="btn oui" data-act="garder">Garder</button>';
  }

  function majPost(p) {
    var a = $('#p-' + CSS.escape(p.id)); if (!a) return;
    var e = $('.etat', a); e.dataset.s = p.statut; e.textContent = LIB[p.statut];
    if (!editing[p.id]) {
      $('.actions', a).innerHTML = actionsHtml(p);
      var t = $('.li-texte', a); if (t && t.textContent !== p.texte) t.textContent = p.texte;
    }
    var v = $('.verif', a); if (v) { v.classList.toggle('ok', !!p.confirme); $('button', v).textContent = p.confirme ? 'Vérifié ✓' : 'C’est exact'; }
    var f = $('.frise a[href="#p-' + p.id + '"]'); if (f) f.dataset.s = p.statut;
  }

  function majHaut(s) {
    var L = liste(), c = function (st) { return L.filter(function (p) { return p.statut === st; }).length; };
    $('#n-trier').textContent = c('a_trier'); $('#n-garde').textContent = c('programme'); $('#n-retire').textContent = c('retire');
    if (L.length) { var d1 = fJour.format(new Date(L[0].publish_at)).replace(/^\S+ /, ''), d2 = fJour.format(new Date(L[L.length - 1].publish_at)).replace(/^\S+ /, ''); $('#periode').textContent = d1 === d2 ? 'Prévu le ' + fJour.format(new Date(L[0].publish_at)) : 'Du ' + d1 + ' au ' + d2; }
    var y = $('#sync'), t = 'Enregistré', cl = '';
    if (s.mode === 'local') { t = 'Mode essai'; cl = 'attente'; }
    else if (s.error) { t = 'Lien incomplet'; cl = 'err'; }
    else if (s.pending) { t = 'Envoi en cours'; cl = 'attente'; }
    else if (!s.online) { t = 'Hors ligne, choix gardés ici'; cl = 'attente'; }
    y.textContent = t; y.className = 'sync ' + cl;
  }

  function rendre() {
    var L = liste(), s = Store.status();
    majHaut(s);
    if (!L.length) {
      $('#posts').innerHTML = '<p class="vide">' + (s.error || s.mode === 'rest' ? 'Aucun post n’est visible. Ouvrez le lien exact envoyé par AXEM, il contient votre code d’accès.' : 'Rien à trier pour le moment.') + '</p>';
      return;
    }
    $('#frise').innerHTML = L.map(function (p) {
      var d = new Date(p.publish_at);
      return '<li><a href="#p-' + esc(p.id) + '" data-s="' + esc(p.statut) + '">' + esc(cap(fCourt.format(d).replace('.', ''))) + '<b>' + fNum.format(d) + '</b><i></i></a></li>';
    }).join('');
    $('#posts').innerHTML = L.map(function (p, k) { return postHtml(p, k, L.length); }).join('');
    L.forEach(majPost);
    rendu = true;
    observer();
  }

  /* apparition douce et repère « ici » dans la frise ; aucun mouvement automatique du texte */
  function observer() {
    var arts = $$('.duo');
    if (!('IntersectionObserver' in window)) { arts.forEach(function (a) { a.classList.add('vu'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vu'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    arts.forEach(function (a) { io.observe(a); });
    var ici = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$('.frise a').forEach(function (x) { x.classList.toggle('ici', x.getAttribute('href') === '#' + e.target.id); });
        var c = $('.frise a.ici'); if (c && c.scrollIntoView) { var ol = c.parentNode.parentNode; ol.scrollTo({ left: c.offsetLeft - ol.clientWidth / 2 + c.clientWidth / 2, behavior: 'smooth' }); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    arts.forEach(function (a) { ici.observe(a); });
    colle(); window.addEventListener('resize', colle);
  }
  /* sur ordinateur, le modèle reste à côté du post tant qu'il tient dans l'écran */
  function colle() { $$('.col-modele').forEach(function (c) { c.classList.toggle('colle', c.offsetHeight < innerHeight - 130); }); }

  function ouvrirEdition(a, p) {
    editing[p.id] = true;
    var t = $('.li-texte', a), ta = document.createElement('textarea');
    ta.value = p.texte; ta.setAttribute('aria-label', 'Texte du post');
    t.replaceWith(ta);
    var c = document.createElement('div'); c.className = 'compte'; ta.after(c);
    var compte = function () { c.textContent = nb(ta.value.length) + ' signes'; ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight + 4) + 'px'; };
    ta.addEventListener('input', compte); compte(); ta.focus();
    $('.actions', a).innerHTML = actionsHtml(p);
  }
  function fermerEdition(a, p, valeur) {
    delete editing[p.id];
    var ta = $('textarea', a), c = $('.compte', a);
    if (valeur != null && valeur !== p.texte) { Store.update(p.id, { texte: valeur }); annonce('Texte enregistré'); }
    var t = document.createElement('p'); t.className = 'li-texte'; t.textContent = Store.get(p.id).texte;
    if (c) c.remove(); if (ta) ta.replaceWith(t);
    majPost(Store.get(p.id));
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var a = b.closest('.duo'); if (!a) return;
    var id = a.dataset.id, p = Store.get(id); if (!p) return;
    if (b.dataset.vue) {
      a.dataset.vue = b.dataset.vue;
      $$('.bascule button', a).forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      return;
    }
    if (b.dataset.motif) { Store.update(id, { motif: p.motif === b.dataset.motif ? '' : b.dataset.motif }); annonce('Merci, c’est noté'); return; }
    switch (b.dataset.act) {
      case 'garder': Store.update(id, { statut: 'programme', motif: '' }); annonce('Gardé : il sera publié le ' + jour(p.publish_at).toLowerCase() + ' à ' + heure(p.publish_at)); break;
      case 'retirer': Store.update(id, { statut: 'retire' }); annonce('Retiré : il ne sera pas publié'); break;
      case 'remettre': Store.update(id, { statut: 'a_trier', motif: '' }); annonce('Le post revient à trier'); break;
      case 'modifier': ouvrirEdition(a, p); break;
      case 'annuler': fermerEdition(a, p, null); break;
      case 'enregistrer': fermerEdition(a, p, $('textarea', a).value.replace(/\s+$/, '')); break;
      case 'origine': var ta = $('textarea', a); ta.value = p.texte_origine; ta.dispatchEvent(new Event('input')); break;
      case 'confirmer': Store.update(id, { confirme: !p.confirme }); annonce(p.confirme ? 'Noté comme vérifié' : 'Vérification annulée'); break;
    }
  });

  Store.subscribe(function (P, s) {
    if (!rendu) { if (liste().length) rendre(); else majHaut(s); return; }
    var ids = $$('.duo').map(function (a) { return a.dataset.id; }).join(), now = liste().map(function (p) { return p.id; }).join();
    if (ids !== now && !Object.keys(editing).length) { rendre(); return; }
    majHaut(s); liste().forEach(majPost);
  });
  Store.init().then(rendre, rendre);
})();
