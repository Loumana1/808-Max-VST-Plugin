// Sample Data Generator
function generateSampleData(count = 144) {
    const samples = [];
    const toneColors = [
        { name: 'Pure Sub', color: '#8B0000' },
        { name: '808 Classic', color: '#FF0000' },
        { name: 'Reese', color: '#FF3300' },
        { name: 'Bass Guitar', color: '#FF6600' },
        { name: 'Brassy', color: '#FF9900' },
        { name: 'Synth', color: '#CC0066' }
    ];
    
    const styles = ['Zay', 'CTM', 'Murda', 'Memphis', 'Drill', 'BNYX', 'Lex', 'Pi\'erre'];
    const tags = ['Clean', 'Distorted', 'Warm', 'Punchy', 'Clicky', 'Soft', 'Sub Heavy', 'Bright', 'Long', 'Short'];
    
    for (let i = 0; i < count; i++) {
        const decay = Math.random();
        const cleanness = Math.random(); // 0 = clean, 1 = distorted (inverted for Y position)
        const brightness = Math.random();
        const attack = Math.random();
        const tone = Math.floor(Math.random() * toneColors.length);
        
        // Generate name
        const style = styles[Math.floor(Math.random() * styles.length)];
        const name = `808 - ${style} ${i + 1}`;
        
        // Generate tags
        const sampleTags = [];
        if (cleanness < 0.3) sampleTags.push('Clean');
        if (cleanness > 0.7) sampleTags.push('Distorted');
        if (decay < 0.3) sampleTags.push('Short');
        if (decay > 0.7) sampleTags.push('Long');
        if (attack > 0.7) sampleTags.push('Punchy');
        if (brightness > 0.7) sampleTags.push('Bright');
        if (brightness < 0.3) sampleTags.push('Sub Heavy');
        
        samples.push({
            id: i,
            name: name,
            decay: decay,
            cleanness: cleanness, // 0 = clean (bottom), 1 = distorted (top)
            brightness: brightness,
            attack: attack,
            tone: tone,
            toneName: toneColors[tone].name,
            color: toneColors[tone].color,
            style: style,
            tags: sampleTags.length > 0 ? sampleTags : ['Balanced']
        });
    }
    
    return samples;
}

// Canvas Setup
const canvas = document.getElementById('scatterCanvas');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');

let samples = generateSampleData(144);
let selectedSample = null;
let hoveredSample = null;
let activeFilters = new Set();
let zoom = 1.0;
let panX = 0;
let panY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

// Resize canvas
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Convert normalized coordinates to screen coordinates
function toScreenX(x) {
    return (x * canvas.width * zoom) + panX + (canvas.width / 2);
}

function toScreenY(y) {
    // Invert Y: 0 (clean) at bottom, 1 (distorted) at top
    return canvas.height - (y * canvas.height * zoom) - panY - (canvas.height / 2);
}

// Convert screen coordinates to normalized coordinates
function toNormalizedX(screenX) {
    return ((screenX - panX - canvas.width / 2) / zoom) / canvas.width;
}

function toNormalizedY(screenY) {
    return 1 - ((screenY - panY - canvas.height / 2) / zoom) / canvas.height;
}

// Draw fog gradients
function drawFog() {
    // Red fog (top - distorted)
    const redGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.3);
    redGradient.addColorStop(0, 'rgba(255, 0, 0, 0.2)');
    redGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = redGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.3);
    
    // Blue fog (bottom - clean)
    const blueGradient = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
    blueGradient.addColorStop(0, 'transparent');
    blueGradient.addColorStop(1, 'rgba(0, 102, 255, 0.2)');
    ctx.fillStyle = blueGradient;
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
}

// Draw grid
function drawGrid() {
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 1;
    
    const gridSize = 50;
    const startX = (panX % gridSize) - gridSize;
    const startY = (panY % gridSize) - gridSize;
    
    for (let x = startX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = startY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Draw sample point
function drawSample(sample) {
    const x = toScreenX(sample.decay);
    const y = toScreenY(sample.cleanness);
    
    // Skip if outside viewport
    if (x < -20 || x > canvas.width + 20 || y < -20 || y > canvas.height + 20) {
        return;
    }
    
    const size = 8 + (sample.brightness * 8); // 8-16px
    const isHovered = hoveredSample && hoveredSample.id === sample.id;
    const isSelected = selectedSample && selectedSample.id === sample.id;
    
    // Check filters
    let opacity = 0.7;
    if (activeFilters.size > 0) {
        const matches = sampleMatchesFilters(sample);
        if (!matches) {
            opacity = 0.2;
        }
    }
    
    if (isSelected) {
        opacity = 1.0;
    }
    
    // Draw glow for hover/selection
    if (isHovered || isSelected) {
        const glowSize = isSelected ? size * 2.5 : size * 2;
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        glowGradient.addColorStop(0, `rgba(255, 0, 0, ${isSelected ? 0.5 : 0.3})`);
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(x - glowSize, y - glowSize, glowSize * 2, glowSize * 2);
    }
    
    // Draw border (attack)
    if (sample.attack > 0.2) {
        const borderWidth = sample.attack * 3; // 0-3px
        ctx.strokeStyle = sample.color;
        ctx.lineWidth = borderWidth;
        ctx.beginPath();
        ctx.arc(x, y, size + borderWidth / 2, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Draw circle
    ctx.fillStyle = sample.color;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    
    // Draw selection pulse
    if (isSelected) {
        const pulseSize = size * (1.0 + Math.sin(Date.now() / 500) * 0.1);
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
}

// Check if sample matches active filters
function sampleMatchesFilters(sample) {
    if (activeFilters.size === 0) return true;
    
    for (const filter of activeFilters) {
        switch (filter) {
            case 'short':
                if (sample.decay >= 0.3) return false;
                break;
            case 'long':
                if (sample.decay <= 0.7) return false;
                break;
            case 'clean':
                if (sample.cleanness >= 0.3) return false;
                break;
            case 'distorted':
                if (sample.cleanness <= 0.7) return false;
                break;
            case 'punchy':
                if (sample.attack <= 0.7) return false;
                break;
            case 'bright':
                if (sample.brightness <= 0.7) return false;
                break;
            case 'sub':
                if (sample.brightness >= 0.3) return false;
                break;
        }
    }
    return true;
}

// Main draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid();
    
    // Draw fog
    drawFog();
    
    // Draw samples
    for (const sample of samples) {
        drawSample(sample);
    }
}

// Find sample at mouse position
function findSampleAt(x, y) {
    const normX = toNormalizedX(x);
    const normY = toNormalizedY(y);
    
    let closest = null;
    let minDist = Infinity;
    
    for (const sample of samples) {
        const sx = toScreenX(sample.decay);
        const sy = toScreenY(sample.cleanness);
        const size = 8 + (sample.brightness * 8);
        const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
        
        if (dist < size + 5 && dist < minDist) {
            minDist = dist;
            closest = sample;
        }
    }
    
    return closest;
}

// Update tooltip
function updateTooltip(sample, x, y) {
    if (!sample) {
        tooltip.classList.remove('visible');
        return;
    }
    
    tooltip.innerHTML = `
        <div class="tooltip-title">${sample.name}</div>
        <div class="tooltip-info">
            Tone: ${sample.toneName}<br>
            Attack: ${sample.attack < 0.3 ? 'Soft' : sample.attack < 0.7 ? 'Medium' : 'Clicky'} (${sample.attack.toFixed(2)})<br>
            Decay: ${sample.decay < 0.3 ? 'Short' : sample.decay < 0.7 ? 'Medium' : 'Long'} (${sample.decay.toFixed(2)})<br>
            Clean/Dist: ${sample.cleanness.toFixed(2)}<br>
            Brightness: ${sample.brightness.toFixed(2)}
        </div>
    `;
    
    tooltip.style.left = (x + 15) + 'px';
    tooltip.style.top = (y - 10) + 'px';
    tooltip.classList.add('visible');
}

// Update details panel
function updateDetails(sample) {
    if (!sample) {
        document.getElementById('sampleName').textContent = 'Aucun sample sélectionné';
        document.getElementById('presetName').textContent = 'Aucun sélectionné';
        document.getElementById('sampleTags').innerHTML = '';
        document.getElementById('sampleInfo').innerHTML = '';
        return;
    }
    
    document.getElementById('sampleName').textContent = sample.name;
    document.getElementById('presetName').textContent = sample.name;
    
    // Tags
    const tagsHtml = sample.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');
    document.getElementById('sampleTags').innerHTML = tagsHtml;
    
    // Info
    const info = `
        Decay: ${sample.decay < 0.3 ? 'Short' : sample.decay < 0.7 ? 'Medium' : 'Long'} (${sample.decay.toFixed(2)}) | 
        Clean/Dist: ${sample.cleanness.toFixed(2)} | 
        Attack: ${sample.attack < 0.3 ? 'Soft' : sample.attack < 0.7 ? 'Medium' : 'Clicky'} | 
        Tone: ${sample.toneName}
    `;
    document.getElementById('sampleInfo').textContent = info;
}

// Mouse events
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const sample = findSampleAt(x, y);
    
    if (sample !== hoveredSample) {
        hoveredSample = sample;
        if (sample) {
            updateTooltip(sample, x, y);
            // Simulate preview (in real implementation, play audio)
            console.log('Preview:', sample.name);
        } else {
            tooltip.classList.remove('visible');
        }
        draw();
    } else if (sample) {
        updateTooltip(sample, x, y);
    }
    
    if (isDragging) {
        panX += e.clientX - dragStartX;
        panY += e.clientY - dragStartY;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        draw();
    }
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const sample = findSampleAt(x, y);
    
    if (sample) {
        selectedSample = sample;
        updateDetails(sample);
        draw();
    } else {
        // Start dragging
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    hoveredSample = null;
    tooltip.classList.remove('visible');
    isDragging = false;
    draw();
});

// Zoom with mouse wheel
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    zoom = Math.max(0.5, Math.min(2.0, zoom * zoomFactor));
    
    draw();
});

// Double click to reset view
canvas.addEventListener('dblclick', () => {
    zoom = 1.0;
    panX = 0;
    panY = 0;
    draw();
});

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        if (activeFilters.has(filter)) {
            activeFilters.delete(filter);
            btn.classList.remove('active');
        } else {
            activeFilters.add(filter);
            btn.classList.add('active');
        }
        
        document.getElementById('activeFilters').textContent = activeFilters.size;
        draw();
    });
});

// Clear filters
document.getElementById('clearFilters').addEventListener('click', () => {
    activeFilters.clear();
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('activeFilters').textContent = '0';
    draw();
});

// Random button
document.getElementById('randomBtn').addEventListener('click', () => {
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    selectedSample = randomSample;
    updateDetails(randomSample);
    
    // Center view on sample
    panX = -toScreenX(randomSample.decay) + canvas.width / 2;
    panY = -toScreenY(randomSample.cleanness) + canvas.height / 2;
    
    draw();
});

// Play button
let isPlaying = false;
document.getElementById('playBtn').addEventListener('click', () => {
    if (!selectedSample) return;
    
    isPlaying = !isPlaying;
    const btn = document.getElementById('playBtn');
    
    if (isPlaying) {
        btn.textContent = '◼';
        btn.classList.add('playing');
        console.log('Playing:', selectedSample.name);
        // In real implementation, play audio here
    } else {
        btn.textContent = '▶';
        btn.classList.remove('playing');
        console.log('Stopped');
    }
});

// Initial draw
draw();

// Animation loop for selected sample pulse
setInterval(() => {
    if (selectedSample) {
        draw();
    }
}, 16); // ~60fps
