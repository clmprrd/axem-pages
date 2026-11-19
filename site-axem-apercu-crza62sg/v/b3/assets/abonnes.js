/* Abonnés LinkedIn : une seule source, datée. Ce fichier est réécrit par la mise à jour automatique ;
   la page affiche chaque chiffre avec sa date de relevé, jamais un chiffre sans date.
   Sources : Clément, mesure du 13/09/2026 (09-Marketing-LinkedIn/ADAPTATIONS-personal-branding-solo-duo) ;
   Alexis, mesure du 19/08/2026 (01-Axem-IA/Vision-et-positionnement.md). */
window.AXEM_ABONNES = {
  clement: { n: 71289, releve: '2026-11-18' },
  alexis: { n: 43960, releve: '2026-11-18' }
};

(() => {
  const A = window.AXEM_ABONNES;
  const fmt = n => n.toLocaleString('fr-FR').replace(/ | /g, ' ');
  const jour = d => d.split('-').reverse().slice(0, 2).join('/');
  const run = () => {
    document.querySelectorAll('[data-abo]').forEach(b => {
      const p = A[b.dataset.abo]; if (!p) return;
      b.textContent = fmt(p.n);
      const lab = b.parentElement.querySelector('.abo-d');
      if (lab) lab.textContent = `abonnés LinkedIn au ${jour(p.releve)}`;
    });
    const tot = Object.values(A).reduce((s, p) => s + p.n, 0);
    document.querySelectorAll('[data-abo-total]').forEach(el => { el.textContent = fmt(tot); if (el.dataset.to) el.dataset.to = tot; });
    document.querySelectorAll('[data-abo-sum]').forEach(el => { el.innerHTML = `<b>${fmt(tot)}</b> abonnés LinkedIn à nous deux`; });
  };
  // Chargé en fin de page : on écrit tout de suite, avant que le compteur du hero ne lise data-to.
  run(); if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
})();
