---
type: decortique
date: 2026-11-21
references: launch.joinautopilot.com, loopsii.com, justkamalthings.com
---

# Décortiqué des trois sites de Clément (21/11/2026, Playwright headless, 1440x900 et 390x844)

Captures : `ref/` (planches par site, `-m-` pour mobile). Ce qu'on copie : la mécanique et le rythme du récit, jamais leurs textes, images ni logos.

## Ce que Clément a demandé, et ce que ça veut dire

- **Autopilot** : le gabarit de la page de lancement, plein cadre, une idée par écran.
- **Loopsii** : « reverse engineer le storytelling », la formulation et le rythme, avec « le truc des curseurs qui cliquent » et plein d'assets image.
- **Kamal** : les faux curseurs nommés (« Mentor », « Founder », « Product designer ») et le curseur de souris maison, qui porte une étiquette.
- « Changer le curseur de la souris classique » : sur notre site, la flèche disparaît, un rond bleu AXEM la remplace.
- Fil conducteur graphique : les photos LinkedIn de Clément et Alexis (fond blanc à fines lignes verticales, grand rond bleu, petits traits rayonnants). Couleurs inchangées.

## 1. Loopsii : le storytelling, section par section

Stack : Astro, GSAP (CustomEase, DrawSVG), OGL (WebGL), police Saans, accent manuscrit Caveat, mosaïque de formes en vert anis, orange, bleu ciel, sauge. Titres 55 px, grands titres 125 px.

| # | Section | Formulation (paraphrase) | Fonction | Rythme |
|---|---|---|---|---|
| 1 | Hero | « One app for your [mot qui tourne : time tracking, invoices…] » | Accroche : le bénéfice et le mot qui change | 2 lignes, sous-titre de 3 lignes à droite, 4 mots aux coins d'une grille (EDITS, TIME MANAGEMENT, COMMUNICATION, INVOICES) |
| 2 | Qu'est-ce que c'est | « Loopsii helps freelance designers and developers manage their entire workflow… » puis « Every project follows a familiar loop. Loopsii keeps it moving » | Définition simple puis promesse de boucle | Texte flou qui devient net au défilement |
| 3 | Tension | « Too many things pulling you away / from the work that actually matters » entre parenthèses, avec 11 pastilles d'angoisses : « Forgot to start the timer », « Where's that file? »… | Le lecteur se reconnaît, il rit | Titre coupé en deux (gauche, droite), pastilles blanches sur fond sombre flou |
| 4 | Pivot | « That's why Loopsii exists » + bouton | Une phrase de 5 mots, un seul bouton | Court. Puis grande capture de l'appli sur des onglets de couleur |
| 5 | Le coût caché | « the copy-paste tax / Your workflow shouldn't cost this much », cartes d'outils avec leur prix annuel, puis « Your whole stack, in one app. Everything on it, connected. » | Chiffrer le désordre, puis tout relier | Grille de lignes fines, cercle pointillé avec 6 mots en orbite autour du produit |
| 6 | Tout est géré | « Everything around your work, handled », 6 cartes empilées « 1/6 … 6/6 » : titre, une phrase, 4 puces, maquette à droite | Le coeur de la preuve | Cartes sticky, onglet de couleur qui dépasse de chaque carte, chaque maquette a son mini-scénario |
| 7 | Sortie | « Go back to doing the work » + bouton | Boucle : on revient au métier | Défilé de mots « Project » |
| 8 | Contenu | « Everything you need, at every project stage », 4 phases (NEGOTIATION, WORKING, CLOSURE, PLANNING), tuiles de couleur à pictogramme noir, « Up next » en italique manuscrit sur celles à venir | Liste exhaustive mais jouable | Tuiles carrées bleu, orange, sauge, anis |
| 9 | Preuve | « Heard from the early ones. » + citation + 5 noms avec fonction | Preuve humaine, pas de logo | Carrousel 01/05 |
| 10 | Offre | « One Plan. Everything included. » | Aucun palier à décoder | Bascule mensuel / annuel |
| 11 | Plan | « No fake launch dates. Just the actual plan. » 4 chiffres géants (01 à 04) sur un arc | Honnêteté sur la suite | Cartes inclinées sur un arc pointillé |
| 12 | Chiffre + FAQ | « 160 freelancers already using Loopsii », FAQ « Good questions, straight answers. », bas de page « Shipped weekly, shaped by you » | Réponses directes aux peurs réelles (« Does Loopsii add a bot to my calls? » → « No. ») | Réponses commencent par oui ou non |

Ce que le récit fait de bien : (a) un seul mot de promesse en gros qui tourne ; (b) la douleur dite avec les mots exacts du lecteur, en pastilles ; (c) la solution en 5 mots ; (d) chaque fonction est une carte avec son titre en forme de bénéfice (« Know when you can take on more ») ; (e) honnêteté assumée (plan réel, pas de fausses dates, une seule offre) ; (f) FAQ qui commence par « Non » ou « Oui ».

## 2. Le truc des curseurs qui cliquent (Loopsii + Kamal)

- **Kamal, faux curseurs nommés dans le hero** : 6 `div.fc` en `position:absolute`, une flèche SVG 22 px (remplie de la couleur, contour blanc 1,4) et une étiquette `font 500 12px`, fond de la couleur, coin 4 px, accolée à 14 px sous la flèche. Animation `drift` 13 à 19 s, `ease-in-out infinite alternate`, translate (36, -22), (-18, 30)… avec `animation-delay` négatifs pour les désynchroniser. Étiquettes : « Product designer », « Founder », « Mentor », « Srinivas · co-founder » (le nom d'un associé fait partie du jeu). Ils sont masqués sur mobile.
- **Kamal, le curseur de souris maison** : `#cur` fixe, `cursor:none` sur le corps, flèche SVG + étiquette « You », lissage `x += (cible - x) * .35` à chaque image (rAF), l'étiquette passe à « Open » sur un lien ou à un texte précis via `data-cur="Email"`, orange au survol, vert au glisser. Actif seulement avec `(pointer:fine)` et sans mouvement réduit.
- **Loopsii, curseur qui clique dans les maquettes** : dans les cartes, un petit curseur noir à étiquette « You » (ou « Client ») parcourt la maquette : il glisse sur la frise de projets, clique, une barre apparaît ou se déplace. Boucle de quelques secondes, pas de bruit.
- **Comment on le fait chez AXEM** : un acteur JS (`Acteur`) par maquette, avec un scénario `[cible, attente, action]`. GSAP déplace le curseur au centre de la cible (expo.out), un anneau « clic » s'ouvre, la cible change d'état (coche, bascule, pastille qui apparaît). Boucle seulement quand la maquette est visible. Trois acteurs nommés : **Clément** (bleu), **Alexis** (encre), **votre équipe** (crème, contour encre). Fin de boucle : retour au point de départ.
- **Mouvement réduit** : curseurs posés, maquettes à l'état final.

## 3. Autopilot : le gabarit de la page de lancement

- Site Webflow signé OFF+BRAND, police FK Grotesk, défilement Lenis, Three et canvas.
- Un seul film plein cadre sur fond noir, des vignettes d'interface (graphiques, téléphone) qui flottent autour d'une personne. Le titre « Autopilot » en 125 px en bas à gauche.
- **Trois étapes épinglées** : pastille « Step 01 », 02, 03 en bas à gauche, un titre court (« Pick your stocks. », « Users invest. », « Monetize your strategy. »), une ligne d'explication de 15 px, puis une interface qui sort de l'image. Transition entre étapes : trame de points (demi-teinte) qui se déforme.
- **Une courbe qui se dessine** avec un curseur « With 50,000 subscribers » sur une ligne horizontale : le chiffre « ~$10,000,000/yr » monte quand le curseur avance (interactif, pas une vidéo).
- Panneau qui arrondit les coins en sortant du plein cadre (« It's your time to take off »).
- Compteurs au défilement : « $12.2B », « $10.0M », « $1.6B », avec la date « as of Nov 21, 2026 » sous chaque chiffre (preuve datée).
- Citation de fin : « The next Warren Buffett will be found on Autopilot. » (promesse démesurée, mais une seule).

## 4. Assets : comment ils sont dosés et placés

- **Loopsii** : presque aucune photo. Des formes géométriques pleines (disques, quarts de disque, losanges, triangles) en 5 couleurs, des pictogrammes noirs sur tuiles de couleur, de vraies captures d'interface dans des cadres arrondis. Densité : un objet fort par écran.
- **Kamal** : beaucoup d'objets, sans grille rigide : autocollants (fusée, Figma, Android, tampon), post-it penchés avec ruban, bulles de discussion, pastilles de pile technique, un tampon rotatif « tampon » en coin. Chaque objet porte une légende courte. Les cartes de projets sont des maquettes à bord noir.
- **Autopilot** : un décor plein cadre (film) et 3 à 5 vignettes d'interface par étape. Pas de logos clients.
- **Chez AXEM** : une grille de tuiles avec nos vrais assets (portraits au rond bleu, mascotte Ax, guides « Claude pour… », illustrations papier découpé, captures de livrables), au plus 1 objet fort et 3 satellites par écran, les logos d'outils en orbite autour du monogramme.

## 5. Typographie, grilles, couleurs

- Loopsii : titres en grotesque 400 à 600, interlettrage serré, hero 125 px ; labels 12 px en majuscules ; accent manuscrit pour les « Up next ». Chez nous : Fraunces 800 SOFT 100 (une demi-phrase en italique bleu 400) et Instrument Sans ; aucun manuscrit, 15 px minimum.
- Grille : lignes fines de 1 px sur toute la largeur, croix aux intersections, marge de 72 px. Chez nous : fines lignes verticales bleu pâle comme sur les photos LinkedIn, trame fixe derrière toute la page.
- Panneaux : coins de 20 à 34 px, cartes en piles décalées. Chez nous : rayon 28 à 34 px, onglet coloré qui dépasse.
- Courbes : `cubic-bezier(.16,1,.3,1)`, jamais de rebond.

## 6. Ce qu'on copie, et comment ça s'applique à AXEM

| Source | Mécanique copiée | Chez AXEM |
|---|---|---|
| Loopsii 1 | Mot qui tourne dans l'accroche, 4 mots aux coins | « Votre partenariat IA, de A à Z » + « un seul partenaire pour votre diagnostic / formation / déploiement / automatisation » ; coins DIAGNOSTIC, DÉPLOIEMENT, FORMATION, AUTOMATISATIONS |
| Loopsii 2 | Texte flou qui devient net | Définition d'AXEM en deux phrases, mot par mot |
| Loopsii 3 | Douleur en pastilles entre parenthèses | « Par où commencer ? », « Un outil de plus, pour quoi faire ? »… sur panneau encre avec le grand rond bleu |
| Loopsii 4 | Phrase pivot de 5 mots | « C'est pour ça qu'AXEM existe. » |
| Loopsii 5 | Orbite autour du produit | Logos d'outils autour du monogramme AXEM |
| Loopsii 6 | Pile de cartes sticky avec maquettes animées | 4 volets : diagnostic IA par volet métier, déploiement, formation, automatisations |
| Loopsii 8 | Tuiles colorées | 4 secteurs : événementiel, santé, grande distribution, logistique |
| Loopsii 11 | « Pas de fausses dates, le vrai plan » | « Le plan réel, sans jargon » : 4 étapes |
| Loopsii 12 | FAQ qui répond par oui ou non | 6 questions réelles de dirigeants |
| Kamal | Faux curseurs nommés + curseur maison à étiquette + autocollants et bulles | « Clément », « Alexis », « votre équipe » qui cliquent ; rond bleu AXEM ; assets réels en tuiles |
| Autopilot | Étapes numérotées 01 02 03 épinglées, compteurs datés, plein cadre | Plan en 4 étapes et compteurs +300, +3 000, +100 000 |

## 7. La DA qui reste : le motif des photos LinkedIn

Fond blanc, fines lignes verticales bleu pâle d'espacement irrégulier, **grand rond bleu #2349FF**, **petits traits rayonnants** en éventail de 3, coins arrondis. Il devient le fil conducteur : le rond et ses traits entourent chaque titre fort, les portraits (versions au rond bleu seulement) s'intègrent au fond blanc sans cadre, les acteurs-curseurs sont bleu, encre, crème.
