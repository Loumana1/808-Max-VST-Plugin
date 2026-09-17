#!/usr/bin/env node

/**
 * Script pour générer les métadonnées des samples 808
 * Analyse tous les fichiers .wav et .aif et extrait :
 * - Waveform simplifiée
 * - Caractéristiques audio (agressivité, decay, attack, brightness)
 * - Couleur et position dans le gradient
 */

const fs = require('fs');
const path = require('path');

// Note: Pour analyser l'audio, on aurait besoin de bibliothèques comme 'wavefile' ou 'node-wav'
// Pour ce prototype, on va créer des données de base et laisser le frontend analyser les fichiers

const SAMPLES_DIR = path.join(__dirname, '../../HISE Project/808_max/Samples/808');
const OUTPUT_FILE = path.join(__dirname, 'samples_metadata.json');

// Fonction pour analyser le nom du fichier et inférer des caractéristiques
function analyzeFileName(fileName) {
    const name = fileName.toLowerCase();
    
    // Inférer agressivité basée sur le nom
    let aggressiveness = 0.5; // Par défaut
    if (name.includes('distort') || name.includes('wtf') || name.includes('murda') || 
        name.includes('bnx') || name.includes('fuego') || name.includes('patek')) {
        aggressiveness = 0.8 + Math.random() * 0.2; // 0.8-1.0
    } else if (name.includes('clean') || name.includes('mellow') || name.includes('tyler') || 
               name.includes('baby') || name.includes('sanctuary')) {
        aggressiveness = 0.0 + Math.random() * 0.3; // 0.0-0.3
    } else if (name.includes('reese') || name.includes('wavey')) {
        aggressiveness = 0.4 + Math.random() * 0.3; // 0.4-0.7
    }
    
    // Inférer decay
    let decay = 0.5;
    if (name.includes('long') || name.includes('sustain')) {
        decay = 0.7 + Math.random() * 0.3; // 0.7-1.0
    } else if (name.includes('short') || name.includes('punch')) {
        decay = 0.0 + Math.random() * 0.3; // 0.0-0.3
    }
    
    // Inférer attack
    let attack = 0.5;
    if (name.includes('click') || name.includes('punch') || name.includes('hard')) {
        attack = 0.7 + Math.random() * 0.3; // 0.7-1.0
    } else if (name.includes('soft') || name.includes('smooth')) {
        attack = 0.0 + Math.random() * 0.3; // 0.0-0.3
    }
    
    // Inférer brightness
    let brightness = 0.5;
    if (name.includes('bright') || name.includes('high')) {
        brightness = 0.7 + Math.random() * 0.3; // 0.7-1.0
    } else if (name.includes('sub') || name.includes('dark') || name.includes('low')) {
        brightness = 0.0 + Math.random() * 0.3; // 0.0-0.3
    }
    
    return {
        aggressiveness: Math.max(0, Math.min(1, aggressiveness)),
        decay: Math.max(0, Math.min(1, decay)),
        attack: Math.max(0, Math.min(1, attack)),
        brightness: Math.max(0, Math.min(1, brightness))
    };
}

// Fonction pour calculer la couleur basée sur l'agressivité
function getColorFromAggressiveness(aggressiveness) {
    // aggressiveness: 0 (clean/bleu) à 1 (distorted/rouge)
    let hue, saturation, lightness;
    
    if (aggressiveness < 0.2) {
        // Bleu (clean)
        hue = 240;
        saturation = 100;
        lightness = 50;
    } else if (aggressiveness < 0.4) {
        // Violet
        hue = 270;
        saturation = 100;
        lightness = 50;
    } else if (aggressiveness < 0.6) {
        // Jaune
        hue = 60;
        saturation = 100;
        lightness = 50;
    } else if (aggressiveness < 0.8) {
        // Orange
        hue = 30;
        saturation = 100;
        lightness = 50;
    } else {
        // Rouge (agressif)
        hue = 0;
        saturation = 100;
        lightness = 50;
    }
    
    return {
        hue: hue,
        saturation: saturation,
        lightness: lightness,
        hex: hslToHex(hue, saturation, lightness)
    };
}

// Convertir HSL en Hex
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Générer une waveform simulée (sera remplacée par l'analyse réelle dans le frontend)
function generateSimulatedWaveform() {
    const resolution = 150;
    const waveform = [];
    
    for (let i = 0; i < resolution; i++) {
        // Simuler une waveform avec attack rapide et decay
        const t = i / resolution;
        let value;
        
        if (t < 0.1) {
            // Attack rapide
            value = t * 10;
        } else {
            // Decay exponentiel
            value = Math.exp(-(t - 0.1) * 5) * (0.5 + Math.random() * 0.5);
        }
        
        waveform.push(Math.max(0, Math.min(1, value)));
    }
    
    return waveform;
}

// Fonction principale
function generateMetadata() {
    console.log('🎵 Génération des métadonnées des samples 808...\n');
    
    if (!fs.existsSync(SAMPLES_DIR)) {
        console.error(`❌ Dossier non trouvé: ${SAMPLES_DIR}`);
        process.exit(1);
    }
    
    const files = fs.readdirSync(SAMPLES_DIR)
        .filter(file => file.endsWith('.wav') || file.endsWith('.aif'))
        .sort();
    
    console.log(`📁 ${files.length} fichiers trouvés\n`);
    
    const samples = [];
    
    files.forEach((file, index) => {
        const filePath = path.join(SAMPLES_DIR, file);
        const fileName = path.basename(file, path.extname(file));
        
        // Analyser le nom du fichier
        const characteristics = analyzeFileName(file);
        
        // Calculer couleur et position
        const color = getColorFromAggressiveness(characteristics.aggressiveness);
        
        // Position Y basée sur agressivité (0 = bas/bleu, 1 = haut/rouge)
        const positionY = characteristics.aggressiveness;
        
        // Position X basée sur decay (0 = gauche/court, 1 = droite/long)
        const positionX = characteristics.decay;
        
        // Générer waveform simulée (sera analysée dans le frontend)
        const waveform = generateSimulatedWaveform();
        
        const sample = {
            id: index,
            fileName: file,
            filePath: `../../HISE Project/808_max/Samples/808/${file}`,
            name: fileName,
            waveform: waveform, // Sera remplacé par analyse réelle dans le frontend
            characteristics: characteristics,
            color: color,
            position: {
                x: positionX,
                y: positionY
            },
            tags: generateTags(characteristics, fileName)
        };
        
        samples.push(sample);
        console.log(`✅ ${file} - Agressivité: ${characteristics.aggressiveness.toFixed(2)}, Couleur: ${color.hex}`);
    });
    
    // Trier par position Y (agressivité) pour créer le gradient vertical
    samples.sort((a, b) => a.position.y - b.position.y);
    
    const output = {
        generatedAt: new Date().toISOString(),
        totalSamples: samples.length,
        samples: samples
    };
    
    // Sauvegarder
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    
    console.log(`\n✨ ${samples.length} samples traités`);
    console.log(`📄 Métadonnées sauvegardées dans: ${OUTPUT_FILE}\n`);
    
    // Statistiques
    const stats = {
        clean: samples.filter(s => s.position.y < 0.3).length,
        medium: samples.filter(s => s.position.y >= 0.3 && s.position.y < 0.7).length,
        aggressive: samples.filter(s => s.position.y >= 0.7).length
    };
    
    console.log('📊 Statistiques:');
    console.log(`   Clean (bleu): ${stats.clean}`);
    console.log(`   Medium (jaune/orange): ${stats.medium}`);
    console.log(`   Aggressive (rouge): ${stats.aggressive}`);
}

// Générer tags basés sur les caractéristiques
function generateTags(characteristics, fileName) {
    const tags = [];
    const name = fileName.toLowerCase();
    
    if (characteristics.aggressiveness < 0.3) tags.push('Clean');
    if (characteristics.aggressiveness > 0.7) tags.push('Distorted');
    if (characteristics.decay < 0.3) tags.push('Short');
    if (characteristics.decay > 0.7) tags.push('Long');
    if (characteristics.attack > 0.7) tags.push('Punchy');
    if (characteristics.brightness > 0.7) tags.push('Bright');
    if (characteristics.brightness < 0.3) tags.push('Sub Heavy');
    
    // Tags basés sur le nom
    if (name.includes('reese')) tags.push('Reese');
    if (name.includes('murda')) tags.push('Murda');
    if (name.includes('mellow')) tags.push('Mellow');
    if (name.includes('wavey')) tags.push('Wavey');
    
    return tags.length > 0 ? tags : ['Balanced'];
}

// Exécuter
if (require.main === module) {
    generateMetadata();
}

module.exports = { generateMetadata };
