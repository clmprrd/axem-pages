---
type: decortique
date: 2026-11-21
reference: https://landonorris.com/
recompense: Awwwards Site of the Day, 17/11/2025 (SOTD 8,18 : Design 8,12, Usability 7,90, Creativity 8,71, Content 8,18 ; Dev Award 7,58 dont Animations 8,60). Listé « Site of the Year 2025 » sur la liste Awwwards des Sites of the Month (la fiche du site ne mentionne que le SOTD).
fiche_awwwards: https://www.awwwards.com/sites/lando-norris
studio: OFF+BRAND
en_ligne: oui, chargé en Chrome headless le 21/11/2026
---

**Confondable avec landonorris.com ? Non à l'œil nu, oui dans la mécanique.** Ce qu'on a gardé : la mise en scène (portraits détourés au centre, cercle qui s'agrandit au survol puis au défilement, grands mots, galerie horizontale épinglée, scène qui change de décor). Ce qui change : fond blanc, bleu AXEM et crème, polices AXEM, nos deux visages, nos vrais cas, aucun élément de la marque d'origine (ni texte, ni photo, ni couleur, ni logo). Un connaisseur reconnaîtra la gestuelle, jamais le site.


# Décortiqué de landonorris.com (Playwright headless `channel='chrome'`, `--mute-audio`, 1440x900 et 390 px)

Captures dans `ref/` (15 fichiers : `01-haut`, `02` à `10` = 9 positions de scroll de 8 % à 96 %, `12-hover`, 4 captures mobile). Planche : `planche.jpg`. Données brutes : `ref/info.json` et `ref/meca.json` (21 relevés, un tous les 5 % de scroll : éléments épinglés, transformations, couleur du fond). Les deux scripts du site (`lando-offbrand...js`, 1,3 Mo, et un fichier annexe de 0,5 Mo) ont été téléchargés et comptés.

Mécanique signature : **un récit éditorial en typographie géante qui mélange deux familles (une sans grasse et une serif vert-citron), où des photos se révèlent dans la phrase, puis une galerie horizontale prend le relais ; le fond de la page passe du vert-olive sombre au crème, au noir, puis revient, par fondus scrubés au scroll.**

## Les mécaniques (mesures lues dans le DOM et le code)

1. **Hero épinglé de 900 px, portrait plein cadre.** `sticky-item home-hero`, hauteur 900 px, haut à 0 de 0 à environ 900 px de scroll, puis il remonte (haut à -368 px à 1 268 px). Visière dorée posée sur le visage (capture 01). Un canvas de 1 440 x 900 est présent (animation Rive détectée : 217 occurrences de « rive » dans le script). Chez nous : portrait de Clément et d'Alexis épinglé, 900 px.
2. **Titre en ligne qui défile avec une photo dans la phrase.** « AT HOME WEEKEND / MEMBER… » : deux lignes qui défilent en sens inverse, serif lime au-dessus et sans grasse crème en dessous, un portrait carré en noir et blanc planté au milieu de la ligne (capture 02). Chez nous : « Votre partenaire IA, de A à Z » en deux lignes (Fraunces italique bleu au-dessus, Instrument Sans gras en dessous), le portrait des deux associés au milieu.
3. **Manifeste en typographie géante, 6 lignes, mots clés en serif lime.** « REDEFINING LIMITS, FIGHTING FOR WINS, BRINGING IT ALL IN ALL WAYS. DEFINING A LEGACY IN FORMULA 1 ON AND OFF TRACK » : les mots forts sont en serif vert (« REDEFINING », « WINS », « LEGACY ») (capture 03). Des **rectangles verts pleins** viennent effacer la fin de phrase comme un surligneur qui avance. Chez nous : « DIAGNOSTIC, FORMATION, AUTOMATISATION… » avec les mots-clés en Fraunces italique bleu et des rectangles bleus qui défilent sur la fin de phrase.
4. **Le fond change de couleur en 2 536 px de scroll (fondu scrubé).** Relevés au centre de l'écran : `rgb(40,44,32)` (olive sombre) de 0 à 2 536 px, `rgb(98,100,90)` à 3 170, `rgb(179,180,172)` à 3 804, `rgb(228,228,221)` à 4 438, `rgb(244,244,237)` (crème `#F4F4ED`) à 5 072 px. Chez nous : blanc `#FFFFFF`, bleu clair, crème `#FAF6EA`, encre `#0B0D12` : on part du bleu encre, on arrive au blanc par 5 étapes.
5. **Galerie horizontale épinglée, déplacement 1 pour 1.** `horizontal-track` : translateX -609 px à 2 536 px de scroll, -1 243 à 3 170, -1 877 à 3 804, -2 511 à 4 438, -3 143 à 5 072 px : soit exactement 1 px de piste pour 1 px de scroll (2 534 px de déplacement pour 2 536 px de scroll), puis la piste est relâchée. Les images à l'intérieur ont un décalage propre : translateX 30,7 vers 53,3 px (parallaxe interne). Chez nous : piste horizontale de 2 500 px, 6 cartes cas réels, `scrub: 1`.
6. **Images dispersées à échelles et ratios variés, avec légendes minuscules.** Une grande photo carrée au centre, une petite en haut à droite, une carte « casque » en bas à droite, légendes de 10 px en capitales (capture 04). Chez nous : écrans réels (application de tri, workflow, dashboard) à 3 tailles, légendes de 15 px (règle AXEM : texte utile au moins 15 px).
7. **Choix « ON TRACK / OFF TRACK » en deux colonnes** : « ON » en serif vert italique qui chevauche « TRACK » (capture 06), deux boutons ronds verts, un casque à gauche et un visage de profil à droite qui encadrent le choix. Le mot « ON » fait 97,5 px (Brier), « TRACK » 93,3 px (Mona Sans). Chez nous : « Votre usine / Votre cabinet » en deux colonnes cliquables avec deux visages (Clément à gauche, Alexis à droite).
8. **Retournement au noir pour la galerie de casques.** Fond `rgb(17,17,18)` de 7 607 à 8 875 px de scroll, grille de 4 cartes (« Season 2026 », « Discoball », « Las Vegas »), chaque carte `helmet-grid-item` avec décalage vertical 34,8 px puis 16,5 px (parallaxe décroissante) et un `scale(1.05)` d'apparition. Chez nous : le bloc des 4 volets (usine, cabinet, commerce, RH) en encre.
9. **Parallaxe verticale légère sur les photos « exe-scroll ».** translateY -13,7 px (9 509), -32,4 px (10 143), -51,2 px (10 777) : environ -0,03 px par px de scroll. Chez nous : même coefficient 0,03 sur les images de cas.
10. **Cartes de réseaux sociaux qui se redressent.** `callout-socials-card` : matrice de rotation d'environ -21° (échelle 0,78) à 12 045 px puis environ -14° (échelle 0,85) : les cartes arrivent penchées et se remettent droites en scrubant. Chez nous : cartes « clients » (Carrefour, Geodis, Puig, KIT) qui arrivent penchées de -20° et se redressent.
11. **Signature manuscrite en vert au-dessus de la fin.** « Always bringing the fight » en grosse sans et serif, signature vert vif, retour au fond olive `rgb(40,44,32)` à 12 679 px (capture 10). Chez nous : la signature manuscrite de Clément et d'Alexis (SVG tracé animé) sur « Réserver 30 minutes ».
12. **Moteur : GSAP 3.13.0 + ScrollTrigger + SplitText + Flip + Lenis (lerp 0,1) + Rive, sur Webflow.** Script : `gsap` 83 occurrences, `ScrollTrigger` 19, `scrub` 42, `SplitText` 3, `Flip` 7, `Lenis` 3, `lerp:0.1`. Courbes GSAP : `power2.out` (36), `power2.inOut` (15), `power1.inOut` (12), `expo.inOut` (12), `power3.out` (10), `expo.out` (5). Durées : 0,5 s (21), 2 s (19), 0,6 s (14), 0,3 s (11). Courbes CSS : `cubic-bezier(0.19, 1, 0.22, 1)` (easeOutExpo) et `(0.65, 0.05, 0, 1)`. Chez nous : GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.18 (lerp 0,1), mêmes courbes et durées.
13. **Typographie : Mona Sans Variable (sans) et Brier (serif d'affichage).** Étiquettes de 32 px, titres 93 à 98 px. Fond avec courbes de niveau en filets fins (carte topographique) visibles sur le crème et l'olive (captures 01, 06). Chez nous : Instrument Sans et Fraunces (axe SOFT), courbes de niveau remplacées par un réseau de nœuds de workflow en filets.
14. **Page de 13 579 px (15,1 écrans), mobile : 0 px de débordement** à 390 px (mesuré). Cinq alternances de fond sur la page (olive, crème, noir, crème, olive).

## Ce qu'on reprend pour AXEM : « Votre partenaire IA, de A à Z » en récit éditorial géant

Fond blanc dominant, ouverture et clôture en bleu encre, noir `#0B0D12` seulement pour la grille des 4 volets. Accent = bleu #2349FF (en remplacement du vert citron).

| Scroll | Scène (le décor change à chaque cran) | Texte géant | Visuel qui se révèle (réel AXEM) |
|---|---|---|---|
| 0 à 900 (hero épinglé) | Fond bleu encre, courbes de nœuds en filets | « Votre partenaire IA, de A à Z » (2 lignes qui défilent en sens inverse) | portrait Clément + Alexis au milieu de la ligne (`equipe-clement-portrait-micro.jpg`, `equipe-alexis-portrait-micro.jpg`) |
| 900 à 2 500 | **L'usine** : le fond reste encre, rectangles bleus qui avancent | Manifeste : « DIAGNOSTIC PAR VOLET MÉTIER, ACCOMPAGNEMENT AU DÉPLOIEMENT, FORMATION DES ÉQUIPES, AUTOMATISATION, SUIVI » | photo d'usine réelle dans un cadre carré (`cas-gestuel-usine-chef-equipe.jpg`) |
| 2 500 à 5 000 | **Fondu du bleu encre au blanc** (5 étapes) | piste horizontale de 6 cas | l'application de tri (`cas-gestuel-app-tri-semaine.png`), le guide Claude pour l'industrie (`post-claude-pour-l-industrie.jpg`), workflows et dashboards en petit |
| 5 000 à 7 500 | **Le cabinet / le commerce** en deux colonnes : « Votre usine / Votre cabinet » | choix cliquable, curseurs Clément, Alexis, Claude | portraits de profil de chaque associé |
| 7 500 à 9 000 | **Grille des 4 volets en encre** (usine, cabinet, commerce, RH) | 4 cartes avec parallaxe | un écran réel par carte, logos des outils |
| 9 000 à 11 500 | **Le service RH**, retour au blanc : formation | « 3 000 collaborateurs formés » en géant | `formation-illustration-atelier.jpg`, mascotte Ax |
| 11 500 à 12 600 | Cartes clients penchées qui se redressent | Carrefour, Geodis, Puig, KIT, +300 entreprises, +100 000 personnes | logos `../img/clients/` |
| 12 600 à 13 500 | Clôture bleu encre | « Votre partenaire, de A à Z. » + signature manuscrite + « Réserver 30 minutes » | portraits |

Images : 10 à 14, chacune révélée par un masque (clip-path) au scroll.

## Ce qu'on fait MIEUX que l'original

- **Le contenu travaille pour la vente** : chez Lando c'est un portrait de pilote ; chez nous chaque révélation d'image est une preuve (application réelle, workflow réel, cas client), et le texte géant porte l'offre complète A à Z.
- **Les 4 contextes** (usine, cabinet, commerce, RH) servent de décors successifs et de choix cliquable, pas seulement de fond.
- **Fond clair dominant** (Lando alterne avec de longs passages sombres, 3 fonds sombres sur 5 blocs mesurés) : la lecture est plus simple pour des clients dirigeants.
- **Surlignage qui compte** : les rectangles bleus qui effacent la fin de phrase révèlent à chaque fois un chiffre exact de la page (+300, +3 000, +100 000).
- **Reproductible** : une section = un composant (titre géant + visuel + coefficient de parallaxe) ; 4 métiers de plus = 4 sections dupliquées.
