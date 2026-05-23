/* ============================================================
   script.js — fichier conservé pour référence uniquement.
   ============================================================

   Tout le JavaScript de production du site cliniquedubatiment.ca
   est intégré inline dans <script>...</script> à la fin
   d'index.html, juste avant </body>.

   Modules présents inline dans index.html :
   - Scroll-reveal (IntersectionObserver sur .reveal)
   - Menu mobile (burger toggle + Escape)
   - Cases à cocher actives (.check input)
   - Bandeau succès du formulaire (?envoye=1)
   - Formatage automatique du téléphone
   - Portfolio : filtres par catégorie
   - Portfolio : lightbox accessible (clavier ←/→/Échap)
   - Scroll-spy : lien actif dans le menu selon la section

   Raison du choix « tout inline » : voir style.css (note jumelle).

   Si vous voulez extraire ce JS dans un fichier séparé :
   1. Copier le contenu du <script>...</script> d'index.html ici
   2. Ajouter <script src="script.js" defer></script> avant </body>
   3. Supprimer le bloc <script> de l'index.html

   ⚠️  Les sauvegardes antérieures (script.js.bak) contiennent
   un JS différent et obsolète — ne PAS les restaurer sans
   vérification.

   Dernière revue : 2026-05-20
   ============================================================ */
