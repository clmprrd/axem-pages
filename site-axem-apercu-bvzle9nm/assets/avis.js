/* Avis clients : uniquement des avis réels, recueillis par écrit, avec l'accord de la personne.
   Une ligne par avis : { prenom, contexte, texte, source }. La source ne s'affiche pas, elle sert à vérifier.
   Tant que la liste est vide, la section reste masquée. ?avis=demo montre la mise en page, sans aucun texte inventé. */
window.AXEM_AVIS = [
];

(() => {
  const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>';
  const demo = /[?&]avis=demo\b/.test(location.search);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const run = () => {
    const sec = document.querySelector('section.avis');
    if (!sec) return;
    let list = window.AXEM_AVIS.filter(a => a && a.prenom && a.texte);
    if (!list.length && demo) list = Array.from({ length: 6 }, (_, i) => ({ prenom: 'Prénom ' + (i + 1), contexte: 'Fonction, entreprise', texte: 'Emplacement réservé à un avis réel, reproduit mot pour mot tel que le client l’a écrit.' }));
    if (!list.length) { sec.remove(); return; }
    sec.hidden = false;
    const stars = sec.querySelector('.av-stars');
    if (stars) stars.innerHTML = STAR.repeat(5);
    const count = sec.querySelector('[data-av-count]');
    if (count) count.textContent = demo && !window.AXEM_AVIS.length ? 'Aperçu de mise en page' : `5 sur 5, ${list.length} avis`;
    const note = sec.querySelector('[data-av-note]');
    if (note && demo && !window.AXEM_AVIS.length) note.textContent = 'Mise en page de démonstration : aucun avis n’est affiché tant qu’il n’a pas été recueilli par écrit.';
    const card = (a, hide) => `<figure class="av-c"${hide ? ' aria-hidden="true"' : ''}><div class="av-s" role="img" aria-label="5 étoiles sur 5">${STAR.repeat(5)}</div><blockquote>${esc(a.texte)}</blockquote><figcaption><b>${esc(a.prenom)}</b>${a.contexte ? `<span>${esc(a.contexte)}</span>` : ''}</figcaption></figure>`;
    const row = sec.querySelector('[data-av]');
    // Deux passages pour une boucle sans couture ; le second est masqué aux lecteurs d'écran
    row.innerHTML = list.map(a => card(a)).join('') + list.map(a => card(a, true)).join('');
    row.style.setProperty('--n', list.length);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
