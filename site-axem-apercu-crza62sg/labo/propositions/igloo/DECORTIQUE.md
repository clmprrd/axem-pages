---
type: decortique
date: 2026-11-21
reference: https://www.igloo.inc/
recompense: Awwwards Site of the Day, 23/07/2024 (SOTD 7,92 ; Dev Award Animations 9,60). Classé « Site of the Year 2024 » sur la liste Awwwards des Sites of the Month.
fiche_awwwards: https://www.awwwards.com/sites/igloo-inc
studio: abeto et Bureaux
en_ligne: oui, chargé en Chrome headless le 21/11/2026
---

**Confondable avec igloo.inc ? Non.** Même famille de mécanique (une seule caméra qui voyage, fil de fer qui devient matière, écrans éclatés, anneau final), mais fond blanc AXEM, Fraunces et bleu #2349FF, quatre secteurs réels avec captures réelles floutées, scroll natif accessible, offre, équipe, FAQ et contact : un juré voit la parenté de méthode, pas le même site.

# Décortiqué de igloo.inc (Playwright headless `channel='chrome'`, `--mute-audio`, 1440x900 et 390 px)

Captures dans `ref/` (16 fichiers : `01-haut` = écran de chargement, `02` à `11` = 10 positions de molette de 2 400 px chacune, `12-hover`, 4 captures mobile). Planche : `planche.jpg`. Données brutes : `ref/info.json`. Le code (`App3D-d68cb154.js`, 1,49 Mo) a été téléchargé et compté.

Mécanique signature : **une seule caméra 3D voyage sans coupure à travers 7 mondes successifs (igloo fil de fer, igloo sur sa montagne, manifeste en blocs éclatés, éclats de glace, anneau qui se reforme, ondes, salle de projet), pilotée par la molette et jamais par le scroll du navigateur.**

## Les mécaniques (mesures lues dans le DOM, le réseau et le code)

1. **Scroll virtuel, aucune page à défiler.** `document.documentElement.scrollHeight` = 900 px (= la fenêtre), `ScrollTrigger.getAll()` = 0. Le code lit `wheel` : `deltaX/deltaY` additionnés dans un vecteur de position, `deltaMode===1` multiplié, détection du pinch (`ctrlKey`). Pas de Lenis (0 occurrence). Chez nous : un compteur de progression 0 à 1 piloté par `wheel` et `touchmove` avec inertie (lerp), page bloquée `overflow:hidden`, barre de progression par scènes, alternative clavier (flèches, Espace).
2. **Longueur du voyage : environ 24 000 px de molette.** Mesure : à 2 400, 4 800 et 7 200 px d'entrée on est encore au chargement et au fil de fer ; l'igloo texturé arrive vers 9 600, le manifeste vers 12 000, les éclats vers 14 400, l'anneau vers 16 800 à 21 600, la salle de projet vers 24 000. Soit 7 scènes pour environ 27 écrans de molette. Chez nous : 4 mondes métier x 6 000 px de progression = 24 000 px.
3. **Chargement lourd masqué par un écran gris de marque.** Capture 01 à 03 : fond uni `#a4a4b4`, un seul glyphe de progression au centre. Poids réseau : bundle 3D 1,49 Mo, géométries Draco (`igloo.drc`, `mountain.drc`, `shattered_ring.drc`, `smoke_trail.drc`...), textures KTX2, un worker EXR, 17 fichiers audio `.ogg`. Chez nous : chargement léger (moins de 3 Mo) avec le même écran de marque, pour rester sous 4 s.
4. **Scène 1 : le monde se dessine en fil de fer.** Un igloo en maillage blanc fin au centre d'un réseau de lignes (capture 04, planche). Chez nous : la même entrée, mais l'objet est notre « usine » en fil de fer bleu #2349FF sur fond blanc brume, qui se remplit en couleur au cran suivant.
5. **Scène 2 : le même objet devient réel, la caméra orbite lentement.** Igloo en blocs texturés, montagne de glace, brume (captures 05 et 06). Transition fil de fer vers matière par dissolution, sans coupure. Chez nous : le matériau passe de fil de fer à maquette douce (papier, bleu AXEM), brume blanche.
6. **Scène 3 : le texte du manifeste se pose sur l'objet qui s'éclate.** En haut à droite un bloc de texte en monospace (IBM Plex Mono, données MSDF `IBMPlexMono-Medium.json`), en bas à gauche « Scroll down to discover. », les blocs de l'igloo se disloquent et chacun porte un petit écran (capture 06). Chez nous : les blocs qui s'éclatent deviennent nos écrans réels (dashboards, workflows, skills) qui flottent autour de la scène.
7. **Scène 4 : le plan se vide, des éclats floutés passent devant la caméra.** Texte monospace en fond très flou (`blurrytext.drc`, `blurrytext_atlas.ktx2`), éclat de glace translucide avec dispersion de couleur (frange rouge/bleu sur les arêtes, capture 07). C'est le temps mort qui donne le tempo. Chez nous : un plan de respiration entre deux mondes, avec nos logos d'outils en bokeh.
8. **Scène 5 et 6 : un anneau brisé se reforme puis rayonne.** Segments de « shattered ring » qui s'assemblent (capture 08), puis anneau lumineux avec cœur de particules (capture 09), puis ondes concentriques (capture 10). Courbes : `power2.inOut` et `sine.out`. Chez nous : les logos des 15 outils s'assemblent en anneau autour du mot « formation ».
9. **Scène 7 : la salle de projet.** Un personnage en nuage de points sur un piédestal circulaire, flèches gauche et droite, viseur « LinkedIn » en bas (captures 11, 12). Une salle = un projet, on navigue de l'un à l'autre. Chez nous : chaque salle = un contexte métier (usine, cabinet, commerce, RH) avec le personnage Ax en points bleus à la place.
10. **Post-traitement continu.** `EffectComposer` présent, franges chromatiques, brume volumétrique (`ceilingsmoke.drc`, `smoke_trail.drc`), particules d'intro (`intro_particles.drc`). Chez nous : Three r160 `EffectComposer` limité à un léger grain et une brume (désactivés sur mobile et en mouvement réduit).
11. **Moteur et chiffres du code.** GSAP embarqué dans le bundle (51 occurrences, pas de variable globale), `ScrollTrigger` 2 occurrences, `Tween` 25, `CatmullRom` 11 (trajectoires de caméra par courbes), `WebGLRenderer` 34. Courbes GSAP les plus utilisées : `none` 60, `sine.out` 22, `power2.out` 17, `power2.inOut` 16. Durées les plus fréquentes : 0,4 s (14), 2 s (11), 0,75 s (10), 3 s (9), 7,5 s (8). Chez nous : GSAP 3.12.5 + Three r160, trajectoire de caméra par `CatmullRomCurve3`, mêmes ordres de grandeur (0,4 / 0,75 / 2 s).
12. **Interface réduite au strict minimum.** Logo IGLOO blanc en haut à gauche, « Sound: Off » en monospace en bas à gauche, rien d'autre : l'image fait tout. Le son est coupé par défaut (17 pistes, dont `wind`, `shard`, `logo`). Chez nous : logo AXEM, bouton « Réserver 30 minutes » discret, son coupé.
13. **Pas de scroll natif donc pas de barre.** Aucun repère de position sur la page à part le texte « Scroll down to discover. ». Chez nous : on ajoute une ligne de progression en 4 repères (usine, cabinet, commerce, RH).
14. **Mobile : 0 px de débordement** mesuré à 390 px (`mobile_overflow` = 0). La scène 3D continue à tourner au toucher.

## Ce qu'on reprend pour AXEM : « Votre partenaire IA, de A à Z » en caméra qui voyage

Fond blanc brume (#FFFFFF vers #EEF1FF), encre #0B0D12, bleu #2349FF. Titres Fraunces avec un mot en italique bleu, texte Instrument Sans (jamais Google Fonts pour Fraunces, `../fonts/`). Le message est le même que celui du brief : diagnostic IA par volet métier, accompagnement au déploiement, formation des équipes, automatisation, suivi.

Plan de page, section par section (une seule scène 3D plein cadre, la caméra avance sur un chemin, 24 000 px de progression) :

| Progression | Monde (décor) | Ce qu'AXEM y fait (au premier plan) | Assets réels |
|---|---|---|---|
| 0 à 1 500 | Écran de marque blanc, glyphe AXEM, chargement | Titre « Votre partenaire IA, de A à Z », « Défiler pour explorer » | logo AXEM `06-Skills-Claude/axem-da/assets/logo/` |
| 1 500 à 6 500 | **L'usine** en fil de fer bleu qui se matérialise (halle, convoyeur, poste de travail) | Étape 1, diagnostic IA par volet métier : un chef d'équipe, des post-its, les 3 volets repérés ; écrans flottants | `cas-reels/cas-gestuel-usine-chef-equipe.jpg` en texture d'un écran, `visuels-posts/post-claude-pour-l-industrie.jpg` |
| 6 500 à 12 500 | **Le cabinet comptable** (bureaux, piles de dossiers) : les blocs de l'usine s'éclatent et se réassemblent en meubles | Étape 2, accompagnement au déploiement : le workflow qui se branche, nœuds n8n, Make, Zapier qui s'allument | `cas-reels/cas-gestuel-app-tri-semaine.png` (application réellement construite), logos `../logos/vrais/` |
| 12 500 à 18 500 | **Le commerce** (vitrine, caisse, étagères) vu depuis un anneau de logos d'outils qui se reforme | Étape 3, formation des équipes : salle, groupe, support projeté ; l'anneau « Claude, ChatGPT, Copilot, Mistral, Gemini » autour de « formation » | `formation/formation-illustration-atelier.jpg`, 15 logos |
| 18 500 à 23 000 | **Le service RH** (salle de réunion, cartes de candidats) : points bleus de la mascotte Ax au centre | Étape 4, automatisation et suivi : skills, agents, tableau de bord de suivi | `visuels-posts/post-mascotte-ax-3d.jpg`, captures `workflows-dashboards` (basse définition, en petit) |
| 23 000 à 24 000 | Salle de sortie : piédestal circulaire, Clément et Alexis | +300 entreprises accompagnées, +3 000 collaborateurs formés, +100 000 personnes dans notre communauté ; bouton « Réserver 30 minutes » | `equipe/equipe-clement-portrait-micro.jpg`, `equipe-alexis-portrait-micro.jpg`, logos Carrefour, Geodis, Puig, KIT |

Images : 8 à 10, toutes posées comme textures d'écrans dans la scène (pas de galerie). Chaque monde est fabriqué avec des primitives Three arrondies (boîtes, cylindres) plus des plans texturés : pas de modèle Blender de 3 mois.

## Ce qu'on fait MIEUX que l'original

- **Le décor raconte le métier du client** : Igloo raconte un igloo, nous racontons 4 contextes que le visiteur reconnaît. Le « monde » change vraiment à chaque cran (usine, cabinet, commerce, RH), avec nos vrais workflows au premier plan.
- **Du texte lisible et de la preuve** : Igloo n'a presque pas de texte ; nous gardons 1 phrase par monde et des chiffres exacts.
- **Fond clair** (Igloo est gris-bleu sombre en fin de parcours) : tout reste sur blanc brume, lisible en plein jour.
- **Accessible** : clavier, `prefers-reduced-motion` (4 images fixes de la scène à la place de la caméra), repère de progression, bouton « passer » vers la page classique. Igloo n'a ni scroll natif ni alternative (Dev Award : accessibilité 6,60).
- **Scalable** : un monde = une fonction `buildScene(contexte)` ; ajouter un 5e métier (logistique, santé) demande un décor et une image, sans toucher à la caméra.
