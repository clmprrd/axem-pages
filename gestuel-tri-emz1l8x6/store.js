/* Couche de données de l'application de tri.
   Deux modes, même interface :
   - "local"  : tout reste dans ce navigateur (mode essai, rien ne part).
   - "rest"   : table `posts` partagée (contrat PostgREST, Supabase). Les choix sont envoyés au serveur,
                mis en file d'attente si le réseau tombe, et rattrapés au retour. */
(function () {
  'use strict';
  var CFG = window.GESTUEL_CONFIG || { backend: 'local' };
  var SEED = window.GESTUEL_POSTS || [];
  var KEY = 'gestuel-tri-v1', QKEY = 'gestuel-tri-file-v1', CKEY = 'gestuel-tri-code-v1';
  var rest = CFG.backend === 'rest';
  var posts = [], subs = [], queue = [], online = true, flushing = false, timer = null, lastOk = 0, errored = false;

  function ls(get, k, v) { try { if (get) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function emit() { subs.forEach(function (f) { try { f(posts, status()); } catch (e) {} }); }
  function status() {
    return { mode: rest ? 'rest' : 'local', online: online, pending: queue.length, error: errored, lastOk: lastOk };
  }
  function norm(p) {
    p = clone(p);
    p.statut = p.statut || 'a_trier'; p.remarque = p.remarque || ''; p.motif = p.motif || '';
    p.texte_origine = p.texte_origine || p.texte;
    if (typeof p.sources === 'string') { try { p.sources = JSON.parse(p.sources); } catch (e) { p.sources = []; } }
    p.sources = p.sources || [];
    /* fait personnel à confirmer par Cédric : le texte vient du serveur, ou à défaut de la graine (même identifiant) ; « confirme » = son clic « C'est exact » */
    if (p.a_confirmer == null) { var g = SEED.filter(function (x) { return x.id === p.id; })[0]; p.a_confirmer = (g && g.a_confirmer) || ''; }
    p.confirme = p.confirme === true || p.confirme === 'true';
    return p;
  }
  function sortPosts() { posts.sort(function (a, b) { return a.publish_at < b.publish_at ? -1 : 1; }); }

  function code() {
    var c = null, m = /[#&]code=([^&]+)/.exec(location.hash || '');
    if (m) { c = decodeURIComponent(m[1]); ls(false, CKEY, c); try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
    return c || ls(true, CKEY) || '';
  }
  function headers(extra) {
    var h = { apikey: CFG.key || 'anon', Authorization: 'Bearer ' + (CFG.key || 'anon'), 'x-gestuel-code': code() };
    for (var k in (extra || {})) h[k] = extra[k];
    return h;
  }
  function api(path, opt) { return fetch((CFG.url || '') + '/rest/v1/' + path, opt); }

  /* ---------- mode local ---------- */
  function loadLocal() {
    var ov = ls(true, KEY) || {};
    posts = SEED.map(function (p) { var q = norm(p); var o = ov[q.id]; if (o) for (var k in o) q[k] = o[k]; return q; });
    sortPosts();
  }
  function saveLocal() {
    var ov = {}; posts.forEach(function (p) { ov[p.id] = { statut: p.statut, texte: p.texte, remarque: p.remarque, motif: p.motif, confirme: p.confirme, maj: p.maj }; });
    ls(false, KEY, ov);
  }

  /* ---------- mode serveur ---------- */
  function saveQueue() { ls(false, QKEY, queue); }
  function pull() {
    return api('posts?select=*&order=publish_at.asc', { headers: headers() }).then(function (r) {
      if (r.status === 401 || r.status === 403) { var e = new Error('code'); e.code = 'refus'; throw e; }
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (rows) {
      var pend = {}; queue.forEach(function (q) { pend[q.id] = q.patch; });
      posts = rows.map(function (row) { var p = norm(row); if (pend[p.id]) for (var k in pend[p.id]) p[k] = pend[p.id][k]; return p; });
      sortPosts(); ls(false, KEY + '-cache', rows); online = true; errored = false; lastOk = Date.now(); emit();
    });
  }
  function flush() {
    if (flushing || !queue.length) return Promise.resolve();
    flushing = true;
    var step = function () {
      if (!queue.length) { flushing = false; return Promise.resolve(); }
      var q = queue[0];
      return api('posts?id=eq.' + encodeURIComponent(q.id), { method: 'PATCH', headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=representation' }), body: JSON.stringify(q.patch) })
        .then(function (r) {
          if (r.status === 401 || r.status === 403) { var e = new Error('code'); e.code = 'refus'; throw e; }
          if (!r.ok && r.status < 500) { queue.shift(); saveQueue(); return step(); }   // refus définitif : on n'insiste pas
          if (!r.ok) throw new Error('http ' + r.status);
          return r.json().catch(function () { return null; }).then(function (rows) {
            queue.shift(); saveQueue(); online = true; lastOk = Date.now();
            if (Array.isArray(rows) && rows.length === 0) {      // aucune ligne modifiée : mauvais code, ou post déjà publié
              return pull().then(function () { errored = !posts.length; emit(); return step(); });
            }
            errored = false; emit(); return step();
          });
        });
    };
    return step().catch(function (e) { flushing = false; if (e.code === 'refus') errored = true; else online = false; emit(); });
  }
  function tick() { if (document.hidden) return; flush().then(function () { return queue.length ? null : pull(); }).catch(function (e) { if (e.code === 'refus') errored = true; else online = false; emit(); }); }

  function init() {
    if (!rest) { loadLocal(); emit(); return Promise.resolve(posts); }
    queue = ls(true, QKEY) || [];
    var cache = ls(true, KEY + '-cache'); if (cache) { posts = cache.map(norm); sortPosts(); }
    emit();
    return pull().catch(function (e) { if (e.code === 'refus') errored = true; else online = false; emit(); }).then(function () {
      flush(); timer = setInterval(tick, 20000);
      window.addEventListener('online', function () { online = true; tick(); });
      window.addEventListener('offline', function () { online = false; emit(); });
      document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
      return posts;
    });
  }

  function update(id, patch) {
    var p = posts.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    patch.maj = new Date().toISOString();
    for (var k in patch) p[k] = patch[k];
    if (!rest) { saveLocal(); emit(); return; }
    var q = queue.filter(function (x) { return x.id === id; })[0];
    if (q) for (var k2 in patch) q.patch[k2] = patch[k2]; else queue.push({ id: id, patch: clone(patch) });
    saveQueue(); emit(); flush();
  }

  window.Store = {
    init: init, update: update, status: status, posts: function () { return posts; },
    subscribe: function (f) { subs.push(f); },
    get: function (id) { return posts.filter(function (x) { return x.id === id; })[0]; },
    reset: function () { if (!rest) { ls(false, KEY, {}); loadLocal(); emit(); } }
  };
})();
