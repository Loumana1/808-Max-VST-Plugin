# Rapport - Prototype II : Visual Preset Browser avec Waveforms

## 📋 Vue d'ensemble

Ce rapport analyse les images fournies (Citizen DJ et interfaces similaires) pour identifier les éléments à copier et propose un plan d'implémentation pour le deuxième prototype qui affichera les vrais samples 808 avec leurs waveforms organisées sur une carte visuelle.

---

## 🎯 Éléments à Copier des Images

### 1. **Organisation Verticale par Couleur (Gradient)**

**Ce que montrent les images :**
- Les samples sont organisés verticalement avec un gradient de couleur clair
- **Haut** : Couleurs chaudes (rouge, rose, orange, jaune)
- **Bas** : Couleurs froides (vert, cyan, bleu)
- Le gradient est visible et crée des zones distinctes

**Pourquoi c'est important :**
- Permet une navigation intuitive : l'utilisateur sait que les samples agressifs sont en haut (rouge) et les acoustiques en bas (bleu)
- Crée une "carte" visuelle facile à mémoriser
- Évite de lire les noms pour comprendre le caractère du sample

**Comment l'implémenter :**
- Analyser chaque sample audio pour extraire un "score d'agressivité" (0-1)
- Mapper ce score à une position Y dans la grille (0 = bas/bleu, 1 = haut/rouge)
- Assigner une couleur basée sur la position Y dans le gradient
- Trier les samples par ce score avant de les afficher

---

### 2. **Représentation par Waveform (pas juste des points)**

**Ce que montrent les images :**
- Chaque sample est représenté par sa **waveform réelle** (ou spectrogram)
- Les waveforms sont visibles même à petite taille
- Elles sont colorées selon leur catégorie
- Chaque waveform est unique et reconnaissable

**Pourquoi c'est important :**
- La waveform donne des informations visuelles sur le son (attack, decay, sustain)
- Permet de distinguer visuellement les samples sans les écouter
- Plus informatif que de simples points colorés

**Comment l'implémenter :**
- Utiliser Web Audio API pour charger chaque fichier `.wav` ou `.aif`
- Extraire les données d'amplitude (channelData) du buffer audio
- Réduire la résolution (downsample) pour créer une waveform simplifiée
- Dessiner la waveform sur un `<canvas>` de petite taille (ex: 80x30px)
- Colorer la waveform selon sa catégorie (rouge, orange, bleu, etc.)

---

### 3. **Grille Dense et Compacte**

**Ce que montrent les images :**
- Les samples sont organisés en **grille dense** avec peu d'espace entre eux
- La grille est scrollable (verticalement et horizontalement)
- Tous les samples sont visibles en même temps (vue d'ensemble)
- Les cellules peuvent avoir des tailles légèrement variables

**Pourquoi c'est important :**
- Permet de voir beaucoup de samples d'un coup d'œil
- Facilite la comparaison visuelle
- Maximise l'utilisation de l'espace écran

**Comment l'implémenter :**
- Utiliser CSS Grid avec `grid-template-columns: repeat(auto-fill, minmax(80px, 1fr))`
- Chaque cellule contient un canvas avec la waveform
- Taille fixe recommandée : 80x40px par sample
- Espacement minimal : 2-4px entre les cellules
- Container avec `overflow: auto` pour le scroll

---

### 4. **Sélection/Hover avec Bordure Rouge**

**Ce que montrent les images :**
- Quand un sample est survolé ou sélectionné, une **bordure rouge vive** apparaît
- La bordure est fine (1-2px) mais très visible
- Le sample reste à la même taille (pas de zoom)

**Pourquoi c'est important :**
- Feedback visuel immédiat et clair
- Ne perturbe pas la disposition de la grille
- Facile à repérer même dans une grille dense

**Comment l'implémenter :**
- CSS : `.sample-item:hover { border: 2px solid #FF0000; }`
- JavaScript : Ajouter classe `selected` au clic
- Gérer l'état : un seul sample peut être sélectionné à la fois

---

### 5. **Organisation par Zones de Couleur Visibles**

**Ce que montrent les images :**
- Les zones de couleur sont **clairement visibles** et forment des clusters
- Il y a des transitions graduelles entre les zones
- Les zones ne sont pas parfaitement uniformes (certains samples peuvent être "entre" deux zones)

**Pourquoi c'est important :**
- L'utilisateur peut rapidement identifier la zone qui l'intéresse
- Les transitions graduelles reflètent la nature continue des caractéristiques audio

**Comment l'implémenter :**
- Calculer un "score de couleur" pour chaque sample (0-1)
- Mapper ce score à une couleur HSL/HSV dans le gradient
- Optionnel : Ajouter un fond coloré subtil derrière chaque cellule pour renforcer les zones
- Trier les samples par score avant de les placer dans la grille

---

### 6. **Interface Minimaliste avec Header/Footer**

**Ce que montrent les images :**
- **Header** : Titre, sélecteur de collection, boutons d'action globaux
- **Footer** : Boutons de filtre, actions contextuelles pour le sample sélectionné
- **Fond noir** : Pour faire ressortir les waveforms colorées

**Pourquoi c'est important :**
- Interface épurée qui ne distrait pas de la grille principale
- Les contrôles sont accessibles mais discrets

**Comment l'implémenter :**
- Header fixe en haut avec `position: fixed` ou `position: sticky`
- Footer fixe en bas
- Zone principale (grille) prend tout l'espace restant
- Fond noir (#0A0A0A) pour le contraste

---

## 🔧 Plan d'Implémentation Technique

### Phase 1 : Préparation des Données Audio

**Objectif** : Analyser tous les fichiers `.wav` et `.aif` du dossier `@808` pour extraire :
- Les données de waveform (amplitude over time)
- Les caractéristiques audio (agressivité, decay, attack, etc.)
- Les métadonnées (nom, durée, format)

**Méthode** :
1. **Script Node.js/Python** (à exécuter une fois) :
   - Parcourir le dossier `HISE Project/808_max/Samples/808/`
   - Pour chaque fichier audio :
     - Charger avec `audiocontext` (JS) ou `librosa` (Python)
     - Extraire le buffer audio
     - Calculer waveform simplifiée (100-200 points)
     - Analyser caractéristiques :
       - **Agressivité** : RMS des hautes fréquences, distorsion
       - **Decay** : Temps de décroissance de l'enveloppe
       - **Attack** : Temps d'attaque (transient)
       - **Brightness** : Contenu fréquentiel (ratio hautes/basses fréquences)
     - Sauvegarder dans un JSON : `samples_metadata.json`

2. **Structure JSON** :
```json
{
  "samples": [
    {
      "fileName": "808 - Tyler.wav",
      "filePath": "HISE Project/808_max/Samples/808/808 - Tyler.wav",
      "waveform": [0.2, 0.8, 0.9, 0.7, 0.3, ...], // 100-200 valeurs normalisées
      "characteristics": {
        "aggressiveness": 0.3,  // 0 = clean, 1 = distorted
        "decay": 0.6,            // 0 = short, 1 = long
        "attack": 0.2,           // 0 = soft, 1 = clicky
        "brightness": 0.5        // 0 = dark, 1 = bright
      },
      "color": {
        "hue": 240,              // 0-360 (HSL)
        "saturation": 100,
        "lightness": 50
      },
      "position": {
        "x": 0.6,                // 0-1 (pour organisation horizontale)
        "y": 0.3                 // 0-1 (0 = bas/bleu, 1 = haut/rouge)
      }
    }
  ]
}
```

---

### Phase 2 : Structure HTML

**Fichier** : `index.html`

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>808 Max - Visual Preset Browser II</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-left">
            <h1>808 MAX</h1>
            <div class="collection-selector">
                <label>Collection:</label>
                <select id="collectionSelect">
                    <option value="808">808 Library</option>
                </select>
            </div>
        </div>
        <div class="header-right">
            <button class="action-btn">Explore</button>
            <button class="action-btn">Remix</button>
            <button class="action-btn">Browse & Download</button>
        </div>
    </header>

    <!-- Main Grid Container -->
    <main class="grid-container" id="sampleGrid">
        <!-- Samples will be dynamically inserted here -->
    </main>

    <!-- Footer -->
    <footer class="footer">
        <button class="filter-btn" id="filtersBtn">Filters</button>
        <div class="contextual-actions">
            <button id="playBtn" disabled>Play in context</button>
            <button id="loadBtn" disabled>Load into Plugin</button>
            <button id="downloadBtn" disabled>Download</button>
            <button id="viewMoreBtn" disabled>View more</button>
        </div>
    </footer>

    <!-- Tooltip (appears on hover) -->
    <div class="tooltip" id="tooltip"></div>

    <script src="audio-processor.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

---

### Phase 3 : CSS - Grille et Styling

**Fichier** : `style.css`

**Points clés** :
1. **Grille CSS Grid** :
```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 4px;
    padding: 20px;
    overflow: auto;
    background: #0A0A0A;
}
```

2. **Cellule de Sample** :
```css
.sample-item {
    width: 80px;
    height: 40px;
    background: #1A1A1A;
    border: 1px solid transparent;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    transition: border 0.1s ease;
}

.sample-item:hover {
    border: 2px solid #FF0000;
}

.sample-item.selected {
    border: 2px solid #FF0000;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
}
```

3. **Canvas pour Waveform** :
```css
.sample-item canvas {
    width: 100%;
    height: 100%;
    display: block;
}
```

4. **Gradient de Fond (Optionnel)** :
```css
.grid-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        to bottom,
        rgba(255, 0, 0, 0.1) 0%,
        rgba(255, 165, 0, 0.1) 25%,
        rgba(255, 255, 0, 0.1) 50%,
        rgba(138, 43, 226, 0.1) 75%,
        rgba(0, 102, 255, 0.1) 100%
    );
    pointer-events: none;
    z-index: 0;
}
```

---

### Phase 4 : JavaScript - Génération de Waveforms

**Fichier** : `audio-processor.js`

**Fonctionnalités** :
1. **Charger et décoder audio** :
```javascript
async function loadAudioFile(filePath) {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}
```

2. **Extraire waveform simplifiée** :
```javascript
function extractWaveform(audioBuffer, resolution = 150) {
    const channelData = audioBuffer.getChannelData(0); // Mono
    const blockSize = Math.floor(channelData.length / resolution);
    const waveform = [];
    
    for (let i = 0; i < resolution; i++) {
        const start = i * blockSize;
        const end = start + blockSize;
        let sum = 0;
        let max = 0;
        
        for (let j = start; j < end && j < channelData.length; j++) {
            const abs = Math.abs(channelData[j]);
            sum += abs;
            max = Math.max(max, abs);
        }
        
        // Utiliser la moyenne et le max pour créer une waveform plus riche
        waveform.push({
            avg: sum / blockSize,
            peak: max
        });
    }
    
    return waveform;
}
```

3. **Dessiner waveform sur canvas** :
```javascript
function drawWaveform(canvas, waveform, color) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    
    const barWidth = width / waveform.length;
    
    waveform.forEach((point, i) => {
        const x = i * barWidth;
        const barHeight = point.peak * height;
        const y = (height - barHeight) / 2;
        
        // Dessiner barre centrée (waveform symétrique)
        ctx.fillRect(x, y, barWidth - 1, barHeight);
        ctx.fillRect(x, height - y - barHeight, barWidth - 1, barHeight);
    });
}
```

---

### Phase 5 : JavaScript - Organisation et Affichage

**Fichier** : `script.js`

**Fonctionnalités principales** :

1. **Charger les métadonnées** :
```javascript
let samplesData = [];

async function loadSamplesMetadata() {
    const response = await fetch('samples_metadata.json');
    const data = await response.json();
    samplesData = data.samples;
    
    // Trier par position Y (agressivité) pour créer le gradient vertical
    samplesData.sort((a, b) => a.position.y - b.position.y);
    
    renderGrid();
}
```

2. **Créer la grille** :
```javascript
function renderGrid() {
    const grid = document.getElementById('sampleGrid');
    grid.innerHTML = ''; // Clear
    
    samplesData.forEach((sample, index) => {
        const item = createSampleItem(sample, index);
        grid.appendChild(item);
    });
}

function createSampleItem(sample, index) {
    const div = document.createElement('div');
    div.className = 'sample-item';
    div.dataset.index = index;
    div.dataset.fileName = sample.fileName;
    
    // Canvas pour waveform
    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 40;
    
    // Dessiner waveform (depuis données pré-calculées)
    drawWaveformFromData(canvas, sample.waveform, sample.color);
    
    div.appendChild(canvas);
    
    // Event listeners
    div.addEventListener('mouseenter', () => onSampleHover(sample, div));
    div.addEventListener('mouseleave', () => onSampleLeave());
    div.addEventListener('click', () => onSampleClick(sample, div));
    
    return div;
}
```

3. **Couleur basée sur position Y** :
```javascript
function getColorFromPosition(y) {
    // y: 0 (bas/bleu) à 1 (haut/rouge)
    if (y < 0.2) {
        // Bleu (clean)
        return `hsl(240, 100%, 50%)`;
    } else if (y < 0.4) {
        // Violet
        return `hsl(270, 100%, 50%)`;
    } else if (y < 0.6) {
        // Jaune
        return `hsl(60, 100%, 50%)`;
    } else if (y < 0.8) {
        // Orange
        return `hsl(30, 100%, 50%)`;
    } else {
        // Rouge (agressif)
        return `hsl(0, 100%, 50%)`;
    }
}
```

4. **Pré-écoute au survol** :
```javascript
let currentPreview = null;

async function onSampleHover(sample, element) {
    // Afficher tooltip
    showTooltip(sample, element);
    
    // Pré-écouter (optionnel, peut être désactivé pour performance)
    if (ENABLE_PREVIEW_ON_HOVER) {
        await playPreview(sample.filePath);
    }
}

async function playPreview(filePath) {
    // Arrêter preview précédent
    if (currentPreview) {
        currentPreview.stop();
    }
    
    // Charger et jouer extrait (première seconde)
    const audioContext = new AudioContext();
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    
    // Jouer seulement 1 seconde
    source.start(0, 0, 1);
    currentPreview = source;
}
```

---

## 📊 Questions UX à Résoudre

### 1. **Densité de la Grille**
- **Question** : Combien de samples par ligne ? 10, 15, 20 ?
- **Recommandation** : Commencer avec 10-12 par ligne, ajuster selon la taille d'écran
- **Test** : Vérifier que les waveforms restent lisibles

### 2. **Taille des Waveforms**
- **Question** : Quelle taille minimale pour que la waveform soit reconnaissable ?
- **Recommandation** : 80x40px minimum, tester avec différentes résolutions
- **Alternative** : Taille adaptative selon zoom

### 3. **Pré-écoute au Survol**
- **Question** : Activer la pré-écoute automatique au survol ?
- **Avantages** : Navigation rapide
- **Inconvénients** : Peut être bruyant, nécessite chargement audio
- **Recommandation** : Option activable/désactivable, délai de 200ms avant lecture

### 4. **Organisation Horizontale**
- **Question** : Comment organiser horizontalement (axe X) ?
- **Options** :
  - Par decay (court → long)
  - Par style (Memphis, Drill, etc.)
  - Aléatoire (seulement vertical par couleur)
- **Recommandation** : Par decay pour l'instant, peut être changé plus tard

### 5. **Performance avec 80+ Samples**
- **Question** : Comment gérer le chargement de 80+ waveforms ?
- **Solutions** :
  - Pré-calculer toutes les waveforms (script Node.js)
  - Lazy loading : charger seulement les waveforms visibles
  - Cache des waveforms générées
- **Recommandation** : Pré-calculer + lazy loading pour le scroll

---

## 🎨 Détails Visuels Spécifiques

### Couleurs du Gradient (Vertical)
```
Haut (Y = 1.0) : Rouge    #FF0000 (Agressif, Distorted)
                 ↓
                 Orange   #FF6600
                 ↓
                 Jaune    #FFCC00
                 ↓
                 Violet   #9932CC
                 ↓
Bas (Y = 0.0)   : Bleu    #0066FF (Clean, Acoustique)
```

### Style de Waveform
- **Type** : Barres verticales centrées (symétrique)
- **Couleur** : Basée sur position Y dans gradient
- **Fond** : Noir ou très sombre (#1A1A1A)
- **Contraste** : Élevé pour visibilité

### Bordure de Sélection
- **Couleur** : Rouge vif #FF0000
- **Épaisseur** : 2px
- **Style** : Solid
- **Animation** : Aucune (instantanée)

---

## 📁 Structure des Fichiers du Prototype II

```
Prototype_Visual_Preset_Browser_II/
├── index.html
├── style.css
├── script.js
├── audio-processor.js
├── samples_metadata.json (généré par script)
├── generate_metadata.js (script Node.js pour pré-calculer)
└── README.md
```

---

## ⚠️ Limitations et Considérations

### Limitations Techniques
1. **CORS** : Les fichiers audio doivent être servis depuis un serveur (pas `file://`)
   - **Solution** : Utiliser un serveur local (Python `http.server`, Node.js `http-server`)

2. **Performance** : Charger 80+ fichiers audio peut être lent
   - **Solution** : Pré-calculer les waveforms, utiliser lazy loading

3. **Compatibilité Navigateurs** : Web Audio API supporté par tous les navigateurs modernes
   - **Vérifier** : Chrome, Firefox, Safari, Edge

### Améliorations Futures
1. **Zoom** : Permettre de zoomer dans la grille
2. **Filtres** : Filtrer par tags (Clean, Distorted, etc.)
3. **Recherche** : Recherche textuelle par nom
4. **Drag & Drop** : Glisser un sample dans le plugin
5. **Comparaison** : Comparer plusieurs samples côte à côte

---

## ✅ Checklist d'Implémentation

- [ ] Créer script Node.js pour analyser tous les samples et générer `samples_metadata.json`
- [ ] Implémenter structure HTML avec header/footer
- [ ] Créer CSS pour grille dense avec waveforms
- [ ] Implémenter fonction de dessin de waveform sur canvas
- [ ] Créer système de couleurs basé sur position Y
- [ ] Implémenter hover avec bordure rouge
- [ ] Ajouter pré-écoute au survol (optionnel)
- [ ] Tester avec tous les 80+ samples réels
- [ ] Optimiser performance (lazy loading si nécessaire)
- [ ] Tester sur différents navigateurs

---

## 🚀 Prochaines Étapes

Une fois ce rapport approuvé :

1. **Créer le script de pré-calcul** (`generate_metadata.js`) pour analyser tous les samples
2. **Implémenter la structure HTML/CSS** de base
3. **Créer les fonctions JavaScript** pour charger et afficher les waveforms
4. **Tester avec les vrais samples** du dossier `@808`
5. **Itérer** selon les retours

---

**Date** : 2024  
**Version** : 1.0  
**Statut** : En attente d'approbation
