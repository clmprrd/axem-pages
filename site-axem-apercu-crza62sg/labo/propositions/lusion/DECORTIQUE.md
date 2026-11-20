---
type: decortique
date: 2026-11-20
reference: https://lusion.co
---

# Décortiqué de lusion.co (Playwright headless, 1440x900 et 390 px, captures dans ref/)

Mesures lues dans le DOM et les CSS de la référence (ref/info.json, ref/info2.json). Ce qu'on copie : la mécanique. Ni textes, ni images, ni logos.

1. **Scène 3D plein cadre en haut de page.** Un canvas WebGL fixe, des objets 3D lustrés (bleu, noir, blanc) qui occupent un panneau sombre. Chez nous : Three r160, pastilles 3D portant 48 logos officiels (atlas de textures), bords bleu, violet, noir, crème.
2. **Panneau arrondi dans la page.** Cadre à bords arrondis 20 px (`--global-border-radius: 20px`, cartes projets 15 px), marge latérale `max(5vw, 40px)` = 72 px à 1440. Chez nous : `--pad` 72 px, rayon 22 px, panneau animé par clip-path.
3. **Les objets répondent au pointeur.** Attraction douce, inertie. Chez nous : ressort et attirance au pointeur dans l'espace monde, onde de choc au clic, info-bulle du nom de l'outil au survol.
4. **Défilement virtuel lissé.** `window.scrollTo` ne fait rien chez lusion (scroll virtuel), la page est pilotée à la molette. Chez nous : Lenis 1.1.18 branché sur ScrollTrigger.
5. **En-tête fixe en 4 blocs.** Hauteur 146 px, padding 50 px 72 px, z-index 52 : logo, pitch de 3 lignes, cercle, pilule sombre (`#2b2e3a`, 44,8 px de haut, rayon 87,5 px) et pilule claire (`#e4e6ef`). Chez nous : même grille, pilule sombre « Réserver 30 minutes », pilule douce « Menu ».
6. **Le pitch de l'en-tête sort en roulant.** Les lignes montent et disparaissent dès que la scène bouge, et ne reviennent pas plus bas. Chez nous : `yPercent -118`, 0,9 s, expo.out, décalage .09 s par ligne.
7. **Couleur d'en-tête qui bascule avec le fond.** Variable `--header-color`, classe `is-white-bg`, transition `color .4s`. Chez nous : classe `dk` quand le panneau sombre est sous l'en-tête, transition 0,6 s.
8. **Scrollbar maison fine.** Piste fixe de 6 px sur 180 px, à droite (x 1418, y 360). Chez nous : même piste, bascule claire/sombre.
9. **Courbes.** `cubic-bezier(0.16, 1, 0.3, 1)` (expo.out), `(0.4, 0, 0.1, 1)`, `(0.35, 0, 0, 1)`, durées 0,4 s sur boutons. Chez nous : `--ease: cubic-bezier(.16,1,.3,1)` partout, aucun rebond.
10. **Typographie sobre au-dessus de la 3D.** Aeonik (régulier, moyen, italique) et une mono, titres très gros en deux lignes (« Bold Ideas, Brought to Life »). Chez nous : Fraunces pour les titres avec un mot en italique bleu, Instrument Sans pour le reste.
11. **Repères « + » aux coins et « Scroll to explore ».** Quatre croix et un mot centré sous le panneau. Chez nous : les mêmes, « Défiler pour explorer ».
12. **Grille de projets 2 colonnes.** Cartes 634x412 à 72 et 734 px, gouttière 2vw, rythme vertical 582 px. Chez nous : grille de 2 cartes d'image arrondies avec le logo de l'outil au centre et trois logos satellites.
13. **Fond de la page qui change de teinte.** Passage du fond clair au panneau sombre puis retour au clair. Chez nous : crème, panneau encre, crème.
14. **Chargement avec entrée échelonnée.** Les contrôles de l'en-tête apparaissent en cascade. Chez nous : stagger .08, 1,1 s.

Ce qu'on ajoute : au défilement, les logos se rangent en 3 anneaux autour du mot « formation » puis se dispersent ; dégradation sans WebGL (image fixe) et état final lisible en mouvement réduit.
