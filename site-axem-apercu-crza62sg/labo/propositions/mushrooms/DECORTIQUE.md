# Décortiqué : mushrooms.agency (mesuré en Playwright, 1440x900 et 390 px, 20/11/2026)

Sources : ref/d0 à d8 (9 états desktop), ref/m0 à m3 (mobile), ref/y*.jpg (13 coupes), ref/mesures.json (géométrie et styles calculés), ref/dom.html.

## Les 14 mécaniques mesurées, et ce qu'on en fait

1. **Fond du haut : ciel photo clair, pas une grille sombre.** Section .accroche, 1097 px de haut, fond rgb(207,227,248), fond animé : translate3d(0, p*60px) + scale(1 + p*.05) piloté par une variable CSS --p (progression de défilement). A2 partait d'un fond sombre quadrillé : écart principal, corrigé (ciel généré, herbe, 3 nuages).
2. **Titre d'accroche** : 72 px, graisse 500, interligne 74,88 px (1,04), interlettrage -2,52 px (-0,035 em), encre #0B0C0F. Le mot clé est dans une pastille blanche arrondie, couleur bleu #2A2ECD (le nôtre : #2349FF). Nous : clamp jusqu'à 76 px, mêmes ratios.
3. **Titres de section** : 56 px (statement) et 64 px (h2), interligne 1,04, interlettrage -0,035 em. Nous : clamp(36px, 5vw, 64px).
4. **Police** : Geist (titres, texte) et Geist Mono (étiquettes 12 px, majuscules, interlettrage .96 px). Nous : Geist et Geist Mono (paquet fontsource, licence OFL), étiquettes montées à 15 px.
5. **Barre de navigation** : pilule fixe, top 12 px, 62 px de haut, largeur 1180, verre dépoli (flou 12 px), lien 14,5 px graisse 500 à 62 % d'opacité, bouton jaune citron #F0FF5A. Nous : même pilule, bouton citron #E9FF4D, texte 15,5 px.
6. **Bouton principal** : rayon 20 px, petit carré arrondi d'icône flèche accolé à droite, ombre colorée. Reproduit.
7. **Essaim de curseurs** : curseurs de rôle avec étiquette colorée, déplacés par script vers des cibles (boutons, cartes, barres), clic simulé (onde + pression de la cible). Mesure : trajets de 1,5 à 2 s, pause 1 à 2 s entre deux clics, trois à cinq curseurs. Nous : trois curseurs nommés (Clément #2349FF, Alexis #7B5CFF, Claude #D97757), trajet power3.inOut de 1,5 à 2,2 s, onde 0,8 s en expo.out, pause 1,1 à 2,4 s.
8. **Bandeaux de pilules d'outils** : deux lignes, défilement CSS linéaire infini, 59 s et 78 s en sens inverse, écart 12 px, arrêt au survol. Nous : 70 s et 90 s, 63 logos officiels (26 de modèles et d'outils d'IA, 37 d'outils métier).
9. **Grille de confiance** : 992 px de large, 90 px de haut, logos clients dans des cases séparées par des traits. Nous : 4 cases, plus un cadre de sélection à poignées qui saute de case en case toutes les 1,8 s (expo.out, 0,8 s).
10. **Panneau d'offre** : fond bleu pâle quadrillé, rayon 28 px (var --radius-bloc 1,75 rem), 1168 px de large, cartes blanches de 432 px, titre de carte 17,92 px, description 15,2 px à 62 % d'opacité, mini interfaces animées dans chaque carte (graphique, bouton agent avec curseur, bascules, chronologie). Nous : 4 cartes (formation en premier, automatisation, agents, livrables), mini interfaces à 15 px minimum, curseurs Alexis et Claude qui cliquent dans les cartes 2 et 3.
11. **Empilement** : les étapes de la méthode sont des cartes qui se recouvrent. Nous : cartes en position collante, haut = 96 px + rang x 22 px, la carte précédente passe à l'échelle .94 en défilement lié.
12. **Courbes** : variable --ease-atmos = cubic-bezier(.22, 1, .36, 1) (équivalent expo.out), transition par défaut .15 s cubic-bezier(.4,0,.2,1). Nous : expo.out partout, aucun rebond.
13. **Herbe et prairie** : l'herbe passe devant la maquette du haut et a son propre décalage de parallaxe (70 px sur desktop, 170 px sur l'ancienne mesure mobile). Même effet : herbe à +70 px sur la hauteur de la section. Le contact reprend une prairie en bas.
14. **Pied de page et rythme** : sections hautes de 363 à 1935 px, espacement vertical py-20 à py-32 (80 à 128 px), pied blanc 371 px avec trait de séparation. Reproduit à l'échelle.

## Ce que nous ajoutons (absent chez la référence)

- **Mur de logos qui s'organise au défilement** : section de 340 vh, 36 logos officiels dispersés (position, rotation, échelle tirées d'une graine fixe) qui se rangent en grille 9 x 4 (6 colonnes sur mobile) en défilement lié (scrub .7), puis un cadre de sélection à poignées saute de logo en logo avec l'étiquette du nom (8 sauts).
- Compteurs : +300, +3 000, +100 000, 2,2 s en expo.out.
- Diagnostic IA par volet métier : quatre onglets (Commercial, RH, Finance, Support).

## Écarts assumés

- Textes de l'interface de la référence à 10 à 13 px : montés à 15 px minimum (consigne), donc cartes un peu plus aérées.
- Bouton citron et Geist ne sont pas la palette AXEM stricte : gardés pour la ressemblance, le bleu #2349FF porte le mot clé, les poignées et les étiquettes.
- Images du ciel, des nuages, de l'herbe et de la prairie générées par calcul (bruit fractal), aucune image de la référence reprise.
