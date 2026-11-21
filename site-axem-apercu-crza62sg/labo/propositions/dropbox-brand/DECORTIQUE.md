---
type: decortique
date: 2026-11-21
reference: https://brand.dropbox.com/
recompense: Awwwards Site of the Day, 12/02/2025 (SOTD 7,67 ; Dev Award 7,8 dont Animations 8,40 et Responsive 8,60)
fiche_awwwards: https://www.awwwards.com/sites/dropbox-brand
studio: Daybreak Studio
en_ligne: oui, chargé en Chrome headless le 21/11/2026
---

**Confondable avec brand.dropbox.com ? Non, pas au premier regard.** Même mécanique d'ouverture (mosaïque de tuiles qui se dézoome et se range en grille, titre dans une tuile, curseurs nommés), mais fond blanc, Fraunces et italique bleu, bleu #2349FF, tuiles faites de vrais travaux AXEM (workflow, skill, tableau de suivi, atelier, application de tri, portraits) au lieu d'illustrations de marque, et une scène épinglée de six secteurs clients qui n'existe pas chez Dropbox. Reste commun : le geste d'ouverture et le rythme de défilement, assumés comme « inspiré de ».


# Décortiqué de brand.dropbox.com (Playwright headless `channel='chrome'`, `--mute-audio`, 1440x900 et 390 px)

Captures dans `ref/` (15 fichiers : `01-haut`, `02` à `10` = 9 positions de scroll de 8 % à 96 %, `12-hover`, 4 captures mobile). Planche : `planche.jpg`. Données brutes : `ref/info.json` (détection des bibliothèques, polices, courbes CSS) et `ref/meca.json` (21 relevés, un tous les 5 % de scroll : éléments épinglés, transformations).

Mécanique signature : **une mosaïque géante de tuiles colorées se dézoome (échelle 2 vers 1, 1 800 px de scroll, page épinglée) et se range en une grille de navigation de 8 univers, chaque univers étant une tuile de couleur différente.**

## Les mécaniques (mesures lues dans le DOM)

1. **Page très courte, un seul geste.** Hauteur totale 2 700 px (3 écrans). 1 800 px sont épinglés (`outro-page` en `position: sticky`, hauteur 900 px, haut à 0), les 900 derniers sont le dégagement. Chez nous : la même économie, une séquence épinglée de 1 800 px par monde, sur 4 mondes.
2. **Dézoom de la grille : `nav-tile` passe de scale 2,00 à 1,00.** Relevés : de 0 à 1 080 px la tuile 3 passe de 2,00 à 1,70 (pente douce, environ 0,00028 par px) ; la tuile 2 de 1,65 (1 170 px) à 1,53 (1 350 px) ; la tuile 1 de 1,44 (1 440 px) à 1,34 (1 530 px) puis 1,00 à 1 800 px. Trois tuiles se suivent au lieu de bouger ensemble. Chez nous : `gsap.timeline({scrollTrigger:{scrub:1, pin:true, end:'+=1800'}})`, scale 2 vers 1 sur un wrapper, 4 tuiles décalées de 180 px de scroll.
3. **Grille de fond en filets fins de 1 px bleu clair.** Colonnes aux x = 320, 608, 832, 1 119 px, lignes aux y = 50, 338, 562, 849 px (capture 01). Elle donne l'effet « papier millimétré » et fait comprendre que tout est rangé. Chez nous : même grille en `#DCE3FF` sur blanc, aux couleurs AXEM.
4. **Hero : un seul titre bleu sur blanc, gras, 4 lignes.** « At Dropbox, our Brand Guidelines help us infuse everything we make with identity. » (capture 01), logo en bas à gauche, double chevron « descendre » en bas à droite. Zéro image, zéro bouton. Chez nous : « Votre partenaire IA, de A à Z » en Fraunces avec un mot en italique bleu, logo AXEM en bas à gauche.
5. **Les tuiles arrivent par les bords.** Une tuile orange entre par la gauche (x = 0), une cyan par la droite (captures 02 à 07), une bleu pleine au centre porte le texte « From icons to illustration… ». Chaque couleur = une catégorie. Chez nous : bleu #2349FF (diagnostic), violet #7B5CFF (formation), orangé Claude #D97757 (automatisation), crème (suivi).
6. **Tuile-texte épinglée au centre pendant que les couleurs défilent autour.** La tuile bleue reste au même endroit de la capture 02 à 07 (de 8 % à 72 %), seules les tuiles autour bougent. Chez nous : la tuile centrale = le contexte courant (« L'usine », « Le cabinet »...), le décor de tuiles autour change de contenu.
7. **Bento final de 8 univers.** Framework, Voice & Tone, Logo, Typography, Iconography, Color, Motion, Imagery : 8 tuiles de couleurs pleines de tailles différentes, aux angles droits, avec un micro-visuel dans chacune (guillemets jaunes, « Aa » orange, courbe d'animation violette, dessin rose) (capture 09). Chez nous : 8 tuiles = 4 volets métier (usine, cabinet, commerce, RH) x (workflow, dashboard) avec nos vrais écrans dedans.
8. **Chaque tuile a sa petite animation vectorielle.** Fichier JSON `DB_Master_Dropbox.json` chargé par la page (probablement une animation Lottie maîtresse, non vérifiée tuile par tuile). Chez nous : Lottie ou SVG animé, pas de vidéo.
9. **Moteur : Webflow Interactions (IX2) + jQuery 3.5.1, aucun GSAP.** `window.gsap` absent, `ScrollTrigger` absent, `Webflow` présent. Les courbes viennent du CSS : `cubic-bezier(0.5, 0, 0.05, 1)`, `(0.4, 0, 0.3, 1)`, `(0.15, 0.5, 0.05, 1)`, `(.6, 0, 0, 1)`. Chez nous : GSAP + ScrollTrigger + Lenis, courbes équivalentes (`expo.out` pour entrer, `power2.inOut` pour le dézoom), sans rebond.
10. **Typographie : DB Sharp Grotesk Variable (titres) et Atlas Grotesk Web (texte).** Une famille variable à chasse large, très grasse. Chez nous : Fraunces (axe SOFT) pour les titres et Instrument Sans pour le texte, mais tailles aussi grosses (au moins 48 px pour le titre).
11. **Fond blanc pur dominant, couleur seulement dans les tuiles.** `body` = `rgb(255,255,255)` à chaque relevé de 0 % à 100 %. Chez nous : c'est exactement la DA AXEM (fond blanc), la couleur n'apparaît que dans les tuiles.
12. **Aucune barre de navigation classique pendant la séquence** : les tuiles font la navigation (`outro-nav-background`, `nav-tile-1/2/3`). Chez nous : 4 tuiles de métiers cliquables = menu de la page, avec curseurs nommés (Clément, Alexis, Claude) qui cliquent dessus.
13. **Mobile : 0 px de débordement** à 390 px (mesuré) : sur téléphone la tuile carrée reste centrée sur la même grille de filets, le texte garde sa taille (captures 13 à 16). Chez nous : bento en 2 colonnes, dézoom conservé.
14. **Bandeau de consentement dans une `iframe`** (hors page, caché sur nos captures). Chez nous : un bandeau discret en bas, sans iframe, sans bloquer l'écran.

## Ce qu'on reprend pour AXEM : « Votre partenaire IA, de A à Z » en mosaïque de métiers

Fond blanc, filets #DCE3FF, tuiles en aplats (bleu #2349FF, violet #7B5CFF, Claude #D97757, crème #FAF6EA, encre #0B0D12), angles arrondis de 22 px (« rien de carré » dans le brief commun, donc on arrondit la tuile). Titres Fraunces, texte Instrument Sans.

| Scroll (pin de 1 800 px par monde) | Scène (la mosaïque change de contexte) | Au premier plan | Assets réels |
|---|---|---|---|
| Écran 1 | Grille blanche à filets, un titre bleu : « Votre partenaire IA, de A à Z » | « Réserver 30 minutes », logo AXEM, 3 chiffres exacts en petit (+300, +3 000, +100 000) | logo AXEM |
| Monde 1 : **usine** | La mosaïque en dézoom (2 vers 1) : chaque tuile est un poste d'usine ; la tuile centrale devient l'écran réel de l'application de tri | Diagnostic IA par volet métier : tuile « Volet production » avec la vraie capture de l'application | `cas-reels/cas-gestuel-usine-chef-equipe.jpg`, `cas-reels/cas-gestuel-app-tri-semaine.png` |
| Monde 2 : **cabinet** | Les tuiles se redistribuent (même grille, autres couleurs) : dossiers, factures, workflows | Accompagnement au déploiement : le workflow n8n en tuile, logos Make, Zapier, Notion, Gmail, Drive posés comme tampons | logos `../logos/vrais/`, captures `workflows-dashboards` (en petit) |
| Monde 3 : **commerce** | Tuiles-vitrines, grille décalée de 1 case | Formation des équipes : salle, support, groupe, le tout en une tuile plein cadre qui s'agrandit au survol | `formation/formation-illustration-atelier.jpg`, `post-claude-pour-l-industrie.jpg` |
| Monde 4 : **RH** | Tuiles-cartes de poste, la tuile centrale = la mascotte Ax | Automatisation et suivi : skills, agents, tableau de suivi | `post-mascotte-ax-3d.jpg` |
| Fin | **Le bento final de 8 tuiles** : 4 volets métier x (workflow, dashboard) | Équipe (Clément, Alexis) en 2 tuiles portrait, clients (Carrefour, Geodis, Puig, KIT) en 4 petites tuiles, CTA | `equipe-*-portrait-micro.jpg`, `../img/clients/` |

Images : 9 à 12, toutes dans des tuiles (jamais flottantes).

## Ce qu'on fait MIEUX que l'original

- **La mosaïque raconte quelque chose** : chez Dropbox les tuiles sont de la couleur ; chez nous chaque tuile est un vrai écran client (workflow, dashboard, skill) qui s'ouvre au clic.
- **Un vrai parcours à 4 mondes** là où Dropbox n'a qu'un seul dézoom ; le décor de tuiles change de contexte à chaque monde (usine, cabinet, commerce, RH).
- **Interactif** : curseurs nommés qui cliquent les tuiles (Clément, Alexis, Claude), au lieu d'une démo muette.
- **Plus de preuves** : chiffres exacts, logos clients, bouton de réservation toujours visible.
- **Gain de vitesse** : la page se fabrique avec des `div` + GSAP (moins de 300 Ko hors images), sans WebGL, donc la plus rapide des 4.
