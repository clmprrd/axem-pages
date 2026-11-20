---
type: decortique
date: 2026-11-20
reference: https://rejouice.com (studio Rejouice, Site of the Day 03/09/2025, note 7,68). Le site s'est chargé, Terminal Industries n'a pas servi.
---

# Décortiqué : rejouice.com (Playwright, Chrome headless, 1440x900 puis 390 px)

Hauteur de page : 8 606 px au bureau, 5 214 px au téléphone. Aucune erreur console. Pile : Nuxt (Vue), Prismic, défilement Lenis (classe `lenis` sur `html`), pas de GSAP global (animations maison). Captures dans `ref/` (d-00 à d-08, m-00 à m-08).

## Les 14 mécaniques mesurées

1. **Mot-symbole géant** : le logo `rejouice` est un SVG de 1360 x 217 px (largeur de l'écran moins 2 x 20 px), posé à 79 px du haut, en blanc sur noir. Il revient identique en pied de page (SVG 1360 x 217 à 8 349 px). Écart de rythme : début et fin de page sont la même signature.
2. **Police** : Suisse Intl, graisses 300 et 400 seulement. Interlettrage négatif partout : -0,015 em sur les grands textes (-1,24 px à 62 px), -0,01 em en petit. Interligne serré (67 px pour 62 px).
3. **Barre du haut** : fixe, 14 px, trois zones. À gauche « The Growth Accelerator », au centre cinq liens (Home, Work, About, Services, Contact), à droite « ↗ Let's talk ↗ ». Les liens s'atténuent en 0,2 s, courbe `cubic-bezier(.39,.575,.565,1)`. Elle se renverse sur fond clair (noir sur blanc). Au téléphone : un bouton « Menu » gris clair à droite.
4. **Menu plein écran** : liens de 60 px, graisse 300, interlettrage -1,5 px, interligne 57 px, empilés à gauche, réseaux et mail à droite.
5. **Bas de l'accueil** : deux petites lignes (« Strategy, Design, Performance. » / « Global Creative & Technology Agency. », 16 px graisse 300) à gauche, flèche vers le bas à droite. La vidéo commence juste dessous : elle dépasse déjà du premier écran (début à 405 px dans le flux, visible à partir de 750 px).
6. **Showreel plein écran** : vidéo 1440 x 900 sans coin arrondi, légende « Showreel » en 62 px graisse 300, centrée en haut. Le curseur devient un rond à légende « Play Reel » (`.cursor__wrapper`, `mix-blend-mode: difference`, déplacé en `translate3d`).
7. **Phrase manifeste** : 62 px, graisse 300, interlettrage -1,24 px, première ligne en retrait d'environ 100 px, lien souligné « our services » dans la phrase.
8. **Rangées à filet** : titre 20 px à gauche, deux paragraphes de 360 px de large à droite, filet fin au-dessus de chaque rangée, lien « ↗ Learn more ↗ » souligné (flèches avant et après).
9. **Sélection de projets** : en-tête « Highlights / See the work ↗ », puis visuels de 1360 x 873 px à bords droits, marque du client en blanc centrée en bas (RIVIAN, OURA, MOXION). Ensuite deux visuels portrait de 670 x 870 px côte à côte, le second décalé vers le bas. Un visuel se révèle en montant du bas.
10. **Rangée de logos** clients en blanc sur noir (hauteur 26 px, largeurs de 62 à 136 px), puis la page bascule du noir au blanc.
11. **« Rejouice at a Glance »** : bande de cartes qui défile à l'horizontale sur fond blanc : carte noire (texte en bas à gauche, logo en bas à droite), carte image avec étiquettes (Location, Technology, Finance), carte grise « 70+ industry-recognized awards » avec logo Behance, carte image, etc. Hauteur de carte environ 40 % de l'écran.
12. **Approche en rangées** (fond blanc) : « Our approach. », puis des rangées filet / libellé à gauche (« A simple philosophy: quality over quantity. ») et paragraphe à droite, avec une grande image inclinée en dessous.
13. **Lien final centré** : « Get to know us », 40 px environ, souligné, sur fond blanc, avec un visuel au-dessus.
14. **Pied de page noir** : phrase « Do it once. Do it right. » en 20 px, colonnes de liens et de réseaux, champ mail à filet, puis le mot-symbole de 1360 x 217 px collé en bas. Courbes de mouvement relevées : `cubic-bezier(.19,1,.22,1)` (expo sortie) et `cubic-bezier(.52,0,0,1)` pour les transitions de panneaux.

## Ce que nous reprenons dans `index.html`
Mot-symbole « axem ia » à pleine largeur (lettres masquées qui montent une à une), barre du haut en trois zones qui se renverse sur fond clair, menu plein écran 60 px, bas de héros à deux petites lignes, scène plein écran sous le héros avec légende, curseur rond à légende en `difference`, phrase manifeste de 62 px en retrait avec lien souligné et mots qui montent, rangées à filet qui se tracent, panneaux 1360 x 873 puis portraits décalés qui se dévoilent du bas, marque en bas centrée, rangée de logos, bande horizontale épinglée sur fond blanc, approche en rangées, lien final centré, pied noir avec mot-symbole, Lenis, expo.out partout.

## Ce qui est à nous (jamais copié)
Textes, images, logos de la référence : rien. La vidéo est remplacée par une scène où 26 logos d'outils sont les acteurs (parallaxe au défilement et à la souris, curseurs nommés Clément et Alexis qui cliquent dessus). Les projets deviennent des formations et des automatisations, avec chaque logo d'outil comme « marque du client » en bas du panneau. Police : Instrument Sans graisse 700 (la 300 de la référence n'existe pas dans notre fichier de police), titres de section en Fraunces.
