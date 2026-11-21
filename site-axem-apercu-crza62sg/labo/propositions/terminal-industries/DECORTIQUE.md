---
type: decortique
date: 2026-11-21
reference: https://terminal-industries.com
recompense: Awwwards Site of the Day, 03/09/2025 (SOTD 7,68 ; Dev Award 7,89 dont Animations 8,80 et WPO 8,20)
fiche_awwwards: https://www.awwwards.com/sites/terminal-industries
studio: REJOUICE et PROPAGANDE (attention : REJOUICE est déjà la référence « rejouice.com » d'une autre proposition ; ici c'est un autre site, un produit SaaS, avec une autre mécanique)
en_ligne: oui, chargé en Chrome headless le 21/11/2026
---

**Confondable avec terminal-industries.com ? Non, pas au premier coup d'oeil, oui dans la chorégraphie.** Ce qu'on a repris : le hero épinglé qui s'ouvre en plein écran avec images qui défilent, les mots qui passent du gris à l'encre, le panneau arrondi épinglé à droite qui change à chaque cran, la pilule de navigation, le calculateur intégré et le bandeau coloré avant le pied. Ce qui n'a rien à voir : fond blanc, bleu AXEM, Fraunces et Instrument Sans, vraies images et vrais écrans AXEM, quatre secteurs au lieu d'une cour logistique, aucun fond noir dominant, aucun vert fluo. Un juré qui connaît le site primé reconnaîtra la mécanique, pas la page.


# Décortiqué de terminal-industries.com (Playwright headless `channel='chrome'`, `--mute-audio`, 1440x900 et 390 px)

Captures dans `ref/` (15 fichiers : `01-haut` = écran de chargement, `02` à `10` = 9 positions de scroll de 8 % à 96 %, `12-hover`, 4 captures mobile). Planche : `planche.jpg`. Données brutes : `ref/info.json` et `ref/meca.json` (21 relevés, un tous les 5 % de scroll : éléments épinglés, transformations, couleur du fond sous le centre de l'écran). Les 6 scripts de la page ont été téléchargés pour compter les bibliothèques.

Mécanique signature : **un produit logiciel se « construit » pendant que le texte avance : à gauche un texte dont les mots passent du gris à l'encre au rythme du scroll, à droite un panneau sombre aux coins crantés où le tableau de bord de la cour logistique s'anime (camions en fil de fer, étiquette « ASSIGN TO SPOT 11 »), le tout après un hero épinglé de 1 800 px qui défile comme une séquence d'images.**

## Les mécaniques (mesures lues dans le DOM et le code)

1. **Hero épinglé en séquence d'images.** `sequence-background-wrapper` en `position: sticky`, hauteur 900 px, haut à 0 de 0 à environ 1 800 px de scroll ; un `canvas` de 1 440 x 900 (le seul de la page) porte la séquence (camion au crépuscule, capture 02). Après le pin il remonte avec une parallaxe : à 2 230 px son haut est à -215 px puis à -723 px à 2 973 px (soit 0,68 px par px de scroll), alors que le contenu, lui, défile 1 pour 1 (-430 puis -1 173). Chez nous : canvas 2D qui joue les images d'une scène « usine » par `scrub`, 1 800 px épinglés.
2. **Écran de chargement clair avant le site.** Fond gris très clair, logo au centre, filets en courbes (capture 01), puis le hero apparaît. Chez nous : écran blanc, logo AXEM, filets bleu clair.
3. **Titres énormes, très serrés.** SuisseIntl, 82,5 px (hero) puis 70 px (sections), interlignage serré, centrés (« Introducing the Terminal Yard Operating System », capture 05). Chez nous : Fraunces 82 px avec un mot en italique bleu, Instrument Sans pour les paragraphes.
4. **Texte révélé mot à mot au scroll, du gris clair à l'encre.** « Start with the applications your need most… Live in 5 days, low IT lift, no third-party devices to support. » : les mots déjà lus sont en `#052424` et le reste en gris, la frontière se déplace au scroll (capture 06, « Live in 5 da | ys, low IT lift »). Un repère mono « 02 » à gauche du texte. Chez nous : `SplitText` par mots, `scrub: true`, couleur de #D2D6E6 à #0B0D12.
5. **Panneau produit sombre à coins crantés, épinglé à droite.** Cadre noir de 695 x 830 px environ à droite du texte, découpé en biseau sur le bord gauche (capture 06) ; il reste en place pendant que les paragraphes de gauche changent. Le dashboard à l'intérieur : filets, numéros de places (8, 9, 10, 11, 12, 13), camions en fil de fer, étiquette verte « ASSIGN TO SPOT 11 » en monospace. Chez nous : le panneau montre nos vrais écrans (workflow n8n, dashboard, skill) qui changent à chaque paragraphe ; les coins crantés deviennent des coins arrondis de 22 px.
6. **Étiquettes d'interface en monospace.** Geist Mono pour « EXPLORE PRODUCT », « SCROLL TO EXPLORE », « ASSIGN TO SPOT 11 », espacement des lettres large, capitales (captures 02 et 06). Chez nous : Instrument Sans en capitales espacées (la DA AXEM n'a pas de mono).
7. **Barre de navigation flottante en pilule translucide.** Fixe, floutée, largeur environ 940 px, logo, 5 menus, 3 boutons (vert vif `#ABFF02` « Explore product », blanc « Request demo », gris « Contact us »), visible sur fond clair et sur fond sombre (capture 05 et 06). Chez nous : pilule blanche translucide, bouton bleu #2349FF « Réserver 30 minutes », bouton secondaire crème.
8. **Fond de page qui change de couleur selon le bloc.** Relevés : blanc `#FFF` de 0 à 20 %, teinte verte à 5 % d'opacité `rgba(5,36,36,.05)` à 25 %, blanc, puis un aplat vert fluo `rgb(171,255,2)` à 65 % (bandeau de section), puis vert profond `#052424` à 100 % (pied de page arrondi à l'envers, « The yard of the future starts today. »). Chez nous : blanc, bleu clair `#EEF1FF`, bleu `#2349FF` en bandeau fort, encre en pied.
9. **Calculateur de coût intégré à la page.** « What's your yard costing you? » avec un curseur à 1 à 5 (« 1 - LOW ») et un formulaire dans un panneau vert foncé arrondi (capture 05). L'interaction est la preuve de valeur. Chez nous : « Combien d'heures par semaine perdez-vous sur ce volet ? », curseur 0 à 40 h, résultat « heures gagnées par an » (calcul visible, aucune promesse chiffrée en euros).
10. **Trois cartes « Fix one yard problem »** avec photos aériennes réelles et bouton chacune (capture 03). Chez nous : 3 cartes = diagnostic, formation, automatisation avec nos vraies images.
11. **Questions fréquentes en accordéon** avec « + » à droite (capture 09). Chez nous : 6 questions.
12. **Moteur : Nuxt (Vue) + GSAP + ScrollTrigger + Lenis + SplitText + Flip.** Détecté dans le script `_nuxt/BNdou_Aw.js` (635 Ko) : `gsap` 135 occurrences, `ScrollTrigger` 8, `Lenis` 2, `SplitText` 4, `Flip` 9, `pin: 1`, `scrub` 3, `Vue` 12. Courbes GSAP : `expo.inOut` (11), `expo.out` (7), `power2.inOut` (3). Courbes CSS : `cubic-bezier(0.85, 0, 0.15, 1)`, `(0.16, 1, 0.3, 1)`, `(0.19, 1, 0.22, 1)`, `(0.4, 0, 0.2, 1)`. Chez nous : exactement la même pile (GSAP 3.12.5, ScrollTrigger, Lenis 1.1.18, SplitText), `expo.out` et `expo.inOut` partout.
13. **Longueur : 15 766 px (17,5 écrans).** Chez nous : même ordre de grandeur, 15 000 px, 4 mondes épinglés de 2 500 px chacun.
14. **Mobile : 0 px de débordement** à 390 px (mesuré), panneau sombre empilé sous le texte. Chez nous : même empilement, panneau en dessous.

## Ce qu'on reprend pour AXEM : « Votre partenaire IA, de A à Z » avec un vrai tableau de bord qui se construit

Fond blanc, encre #0B0D12, bleu #2349FF, bandeau fort en bleu au lieu du vert fluo. Fraunces / Instrument Sans.

| Scroll | Scène (le décor change de contexte) | Texte à gauche (mots qui s'allument) | Panneau à droite (réel AXEM) |
|---|---|---|---|
| 0 à 1 800 (hero épinglé) | **L'usine** en séquence d'images (convoyeur, chef d'équipe), titre « Votre partenaire IA, de A à Z » | « Du diagnostic au suivi, un seul partenaire. » | image réelle `cas-reels/cas-gestuel-usine-chef-equipe.jpg` pleine hauteur |
| 1 800 à 5 000 | **Usine, 1 : diagnostic IA par volet métier** | Texte « On repère les 3 volets où l'IA vous fait gagner du temps » | panneau sombre arrondi : l'application de tri qu'on a construite (`cas-gestuel-app-tri-semaine.png`), étiquette verte remplacée par « VOLET 1 : PRODUCTION » |
| 5 000 à 8 500 | **Le cabinet comptable** : le fond de la page passe au bleu clair `#EEF1FF` | Accompagnement au déploiement : « On branche l'IA sur vos outils, avec vous » | panneau : workflow n8n qui s'exécute, les nœuds s'allument un par un, logos Gmail, Drive, Notion, Make, Zapier |
| 8 500 à 11 500 | **Le commerce** : fond crème | Formation des équipes : « Vos équipes savent s'en servir dès la première semaine » | panneau : support de formation projeté, `formation-illustration-atelier.jpg`, anneau de logos Claude, ChatGPT, Copilot, Mistral, Gemini |
| 11 500 à 14 000 | **Le service RH** | Automatisation et suivi : « Des agents et des skills qui tournent, un tableau de suivi chaque mois » | panneau : dashboard de suivi (capture `workflows-dashboards`, en petit) |
| 14 000 à 15 000 | Bandeau bleu fort puis pied encre | **Calculateur d'heures gagnées**, chiffres +300 / +3 000 / +100 000, logos Carrefour, Geodis, Puig, KIT, FAQ, « Réserver 30 minutes » | équipe : `equipe-clement-portrait-micro.jpg`, `equipe-alexis-portrait-micro.jpg` |

Images : 8 à 12, dans le panneau de droite ou en carte.

## Ce qu'on fait MIEUX que l'original

- **Le panneau est interactif** : Terminal montre une animation que l'on regarde ; chez nous les curseurs nommés (Clément, Alexis, Claude) travaillent dans le panneau (déplacent un nœud du workflow, cochent une tâche), preuve de « ça se fait avec vous ».
- **4 contextes de décor** au lieu d'un seul (cour logistique) : la mosaïque usine, cabinet, commerce, RH s'enchaîne dans la même mécanique de panneau.
- **Un seul vrai chiffre mis en scène** (le calculateur d'heures) plutôt que 3 cartes génériques.
- **Plus léger** : image-séquence limitée à 60 images WebP (moins de 1,5 Mo), pas de vidéo lourde.
- **Accessible** : mouvement réduit = texte entièrement encré, panneau fixe sur sa première image.
