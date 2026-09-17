# Prototype Web - Visual Preset Browser

Ce prototype web permet de tester le concept de représentation visuelle des presets pour le plugin 808 Max.

## 🚀 Utilisation

1. Ouvrir `index.html` dans un navigateur web moderne (Chrome, Firefox, Safari, Edge)
2. Le prototype se charge automatiquement avec 144 samples générés aléatoirement

## 🎮 Interactions

### Navigation
- **Survol** : Passez la souris sur un point pour voir les informations du sample
- **Clic** : Cliquez sur un point pour le sélectionner
- **Drag** : Cliquez et glissez sur le fond pour déplacer la vue
- **Molette** : Utilisez la molette pour zoomer/dézoomer
- **Double-clic** : Double-cliquez sur le fond pour réinitialiser la vue

### Filtres
- Cliquez sur les boutons de filtre pour afficher uniquement certains types de samples
- Cliquez sur "Effacer" pour réinitialiser tous les filtres

### Contrôles
- **Bouton Random (⟳)** : Sélectionne un sample aléatoire et centre la vue dessus
- **Bouton Play (▶)** : Simule la lecture du sample sélectionné (console.log dans ce prototype)

## 🎨 Encodage Visuel

### Position
- **X (Horizontal)** : Decay - Gauche = Court, Droite = Long
- **Y (Vertical)** : Clean/Distorted - Bas = Clean (bleu), Haut = Distorted (rouge)

### Couleur
Les couleurs représentent le type de tone :
- **Rouge foncé (#8B0000)** : Pure Sub
- **Rouge (#FF0000)** : 808 Classic
- **Orange-rouge (#FF3300)** : Reese
- **Orange (#FF6600)** : Bass Guitar
- **Orange clair (#FF9900)** : Brassy
- **Violet-rouge (#CC0066)** : Synth

### Taille
La taille du point représente la brightness (présence de hautes fréquences) :
- **Petit** : Sub-heavy, pas de high-end
- **Grand** : Bright, avec high-end

### Bordure
L'épaisseur de la bordure représente l'attaque :
- **Pas de bordure** : Attack doux
- **Bordure fine** : Attack moyen
- **Bordure épaisse** : Attack clicky

## 🔍 Fonctionnalités à Tester

1. **Densité** : Le prototype génère 144 samples. Testez avec différentes quantités
2. **Navigation** : Testez le drag, zoom, et double-clic
3. **Filtres** : Testez les différents filtres et leur combinaison
4. **Tooltip** : Vérifiez que les informations au survol sont claires
5. **Performance** : Vérifiez que l'interface reste fluide à 60fps

## 📝 Notes

- Ce prototype utilise des données générées aléatoirement
- La pré-écoute audio n'est pas implémentée (simulée avec console.log)
- Les animations de pulse pour le sample sélectionné sont fonctionnelles
- Le fog (brouillard) rouge et bleu est affiché pour renforcer l'organisation verticale

## 🔄 Prochaines Étapes

1. Tester avec de vrais noms de samples et métadonnées
2. Implémenter la pré-écoute audio réelle
3. Ajouter plus de filtres et options
4. Optimiser pour gérer 1000+ samples
5. Ajouter la navigation clavier
6. Implémenter le mode daltonien

## 🐛 Limitations Actuelles

- Pas de pré-écoute audio réelle
- Données générées aléatoirement (pas de vrais samples)
- Pas de navigation clavier
- Pas de mode daltonien
- Performance non optimisée pour 1000+ samples

## 📚 Documentation

Voir le document principal : [05_visual_preset_browser_concept.md](../../Documentation/05_visual_preset_browser_concept.md)
