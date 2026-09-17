# Prototype II - Visual Preset Browser avec Waveforms

Ce prototype affiche les vrais samples 808 avec leurs waveforms organisées sur une grille dense, organisée verticalement par couleur (rouge = agressif, bleu = clean).

## 🚀 Installation et Utilisation

### Important : Nécessite un Serveur Web

Ce prototype utilise Web Audio API qui nécessite un serveur web (pas de `file://`). 

### Option 1 : Python (Recommandé)

```bash
cd "UI Design/Prototype_Visual_Preset_Browser_II"
python3 -m http.server 8001
```

Puis ouvrez : `http://localhost:8001`

### Option 2 : Node.js

```bash
cd "UI Design/Prototype_Visual_Preset_Browser_II"
npx http-server -p 8001
```

Puis ouvrez : `http://localhost:8001`

### Option 3 : VS Code Live Server

Si vous utilisez VS Code, installez l'extension "Live Server" et cliquez sur "Go Live".

## 📁 Structure des Fichiers

```
Prototype_Visual_Preset_Browser_II/
├── index.html              # Structure HTML
├── style.css               # Styles CSS
├── script.js               # Logique principale
├── audio-processor.js      # Fonctions de traitement audio
├── assets/                 # Dossier contenant les samples 808
│   └── 808 - *.wav         # Fichiers audio
└── README.md               # Ce fichier
```

## 🎨 Fonctionnalités

### Affichage
- **Grille dense** : Tous les samples 808 affichés en grille
- **Waveforms réelles** : Chaque sample affiche sa waveform réelle
- **Organisation verticale** : Rouge (haut) = Agressif, Bleu (bas) = Clean
- **Couleurs dynamiques** : Couleur basée sur les caractéristiques audio

### Interactions
- **Survol** : Affiche un tooltip avec les informations du sample
- **Clic** : Sélectionne le sample (bordure rouge)
- **Pré-écoute** : Optionnelle au survol (peut être activée dans le code)

### Caractéristiques Analysées
- **Agressiveness** : Niveau de distorsion/agressivité
- **Decay** : Durée de décroissance
- **Attack** : Temps d'attaque (transient)
- **Brightness** : Contenu en hautes fréquences

## ⚙️ Configuration

### Chemin des Samples

Les samples sont maintenant dans le dossier `assets/` du prototype. Le chemin est configuré dans `script.js` :

```javascript
const SAMPLES_BASE_PATH = 'assets/';
```

Pour ajouter plus de samples, placez-les dans le dossier `assets/` et ajoutez leurs noms dans le tableau `SAMPLE_FILES` dans `script.js`.

### Pré-écoute au Survol

Pour activer la pré-écoute automatique au survol, décommentez dans `script.js` :

```javascript
// Dans onSampleHover()
playPreview(sample.filePath); // Décommentez cette ligne
```

## 🐛 Dépannage

### Erreur CORS
- **Problème** : Les fichiers audio ne se chargent pas
- **Solution** : Utilisez un serveur web (pas `file://`)

### Samples ne se chargent pas
- **Vérifiez** : Le chemin `SAMPLES_BASE_PATH` est correct
- **Vérifiez** : Les fichiers existent dans le dossier

### Performance lente
- **Normal** : Le chargement de 40 fichiers audio peut prendre 5-15 secondes
- **Optimisation** : Les waveforms sont générées à la volée, considérez un pré-calcul

## 📝 Notes

- Les waveforms sont générées en temps réel lors du chargement
- Les caractéristiques audio sont calculées automatiquement
- L'organisation verticale est basée sur l'agressiveness calculée
- Les couleurs suivent un gradient : Rouge → Orange → Jaune → Violet → Bleu

## 🔄 Améliorations Futures

- [ ] Pré-calculer les waveforms (script Node.js)
- [ ] Cache des waveforms générées
- [ ] Lazy loading pour le scroll
- [ ] Filtres par caractéristiques
- [ ] Recherche textuelle
- [ ] Zoom dans la grille
- [ ] Export des métadonnées
