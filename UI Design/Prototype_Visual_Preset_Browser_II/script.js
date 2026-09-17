// Main script for Prototype II - Waveform Grid Browser

// Configuration
const ENABLE_PREVIEW_ON_HOVER = true; // Always enabled for hover preview

let samplesData = [];
let selectedSample = null;
let hoveredSample = null;
let currentPreview = null;
let audioContext = null;
let activeFilters = {
    search: '',
    aggressiveness: [],
    decay: [],
    attack: [],
    brightness: []
};

// Sample files list (relative to the HTML file)
// Samples are now in the assets/ folder
const SAMPLES_BASE_PATH = 'assets/';

// List of 808 samples in assets folder
const SAMPLE_FILES = [
    '808 - Beej.wav',
    '808 - Blow.aif',
    '808 - BNYX LONG D CK.wav',
    '808 - BNYX WTF.wav',
    '808 - bulk.wav',
    '808 - Clean 2.wav',
    '808 - Couch.wav',
    '808 - Danny Brown The Cave.wav',
    '808 - Domo23.wav',
    '808 - Drum 04 D.wav',
    '808 - Everybody Got This.wav',
    '808 - F Metro Boomin.wav',
    '808 - FUEGO one shot bouncy F.wav',
    '808 - G Sign.wav',
    '808 - Geek.wav',
    '808 - Ghosted.wav',
    '808 - Guitar Hero.wav',
    '808 - Life.wav',
    '808 - Lil Torrent.wav',
    '808 - LogDrum 2.wav',
    '808 - LogDrum 9.wav',
    '808 - Long D_ck.wav',
    '808 - Lovin.wav',
    '808 - meh.wav',
    '808 - Mellow.wav',
    '808 - MURDA BANANA SPLIT C.wav',
    '808 - MURDA GOYARD E.wav',
    '808 - MURDA SLIDES C.wav',
    '808 - MURDA TRUNK C.wav',
    '808 - Oh Lawd.wav',
    '808 - OMGRONNY patek C.wav',
    '808 - OMGRONNY plz turn me up C.wav',
    '808 - OMGRONNY tunnel vision C.wav',
    '808 - Opium.wav',
    '808 - OS GH G Powa.wav',
    '808 - OS HAF C Neo.wav',
    '808 - OS HAF C Warm.wav',
    '808 - OS HAF C X.wav',
    '808 - OS MTS F Money.wav',
    '808 - pep.wav',
    '808 - pong.wav',
    '808 - PVLACE one shot ardour G.wav'
];

// Initialize AudioContext
function initAudioContext() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
        console.error('Error initializing AudioContext:', error);
    }
}

// Load all samples and generate metadata
async function loadAllSamples() {
    const loadingMessage = document.getElementById('loadingMessage');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const grid = document.getElementById('sampleGrid');
    
    loadingMessage.textContent = `Chargement de ${SAMPLE_FILES.length} samples...`;
    progressContainer.style.display = 'block';
    
    samplesData = [];
    
    // Initialize audio context
    initAudioContext();
    
    // Load samples one by one (with progress)
    for (let i = 0; i < SAMPLE_FILES.length; i++) {
        const fileName = SAMPLE_FILES[i];
        const filePath = SAMPLES_BASE_PATH + fileName;
        
        const progress = ((i + 1) / SAMPLE_FILES.length) * 100;
        progressFill.style.width = progress + '%';
        progressText.textContent = `${Math.round(progress)}% - ${i + 1}/${SAMPLE_FILES.length}`;
        loadingMessage.textContent = `Chargement ${i + 1}/${SAMPLE_FILES.length}: ${fileName}`;
        
        try {
            const audioBuffer = await loadAudioFile(filePath);
            if (audioBuffer) {
                const metadata = generateSampleMetadata(fileName, filePath, audioBuffer);
                samplesData.push(metadata);
            } else {
                console.warn(`Failed to load: ${fileName}`);
            }
        } catch (error) {
            console.error(`Error loading ${fileName}:`, error);
        }
        
        // Small delay to prevent browser freeze
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // Sort by position Y (aggressiveness) for vertical gradient
    samplesData.sort((a, b) => a.position.y - b.position.y);
    
    // Hide loading message and progress
    loadingMessage.style.display = 'none';
    progressContainer.style.display = 'none';
    
    // Render grid
    renderGrid();
    
    // Initialize filter count
    initializeFilterCount();
    
    // Show completion message
    console.log(`✅ Loaded ${samplesData.length} samples successfully!`);
}

// Render the sample grid
function renderGrid() {
    const grid = document.getElementById('sampleGrid');
    grid.innerHTML = ''; // Clear
    
    const filteredSamples = getFilteredSamples();
    
    filteredSamples.forEach((sample, index) => {
        const item = createSampleItem(sample, index);
        grid.appendChild(item);
    });
    
    // Update filter count
    updateFilterCount(filteredSamples.length);
}

// Get filtered samples based on active filters
function getFilteredSamples() {
    return samplesData.filter(sample => {
        // Search filter
        if (activeFilters.search) {
            const searchLower = activeFilters.search.toLowerCase();
            if (!sample.fileName.toLowerCase().includes(searchLower)) {
                return false;
            }
        }
        
        // Aggressiveness filter
        if (activeFilters.aggressiveness.length > 0) {
            const char = sample.characteristics;
            let matches = false;
            
            if (activeFilters.aggressiveness.includes('aggressive') && char.aggressiveness > 0.7) matches = true;
            if (activeFilters.aggressiveness.includes('clean') && char.aggressiveness < 0.3) matches = true;
            if (activeFilters.aggressiveness.includes('warm') && char.aggressiveness >= 0.3 && char.aggressiveness <= 0.7) matches = true;
            
            if (!matches) return false;
        }
        
        // Decay filter
        if (activeFilters.decay.length > 0) {
            const char = sample.characteristics;
            let matches = false;
            
            if (activeFilters.decay.includes('short') && char.decay < 0.3) matches = true;
            if (activeFilters.decay.includes('medium') && char.decay >= 0.3 && char.decay <= 0.7) matches = true;
            if (activeFilters.decay.includes('long') && char.decay > 0.7) matches = true;
            
            if (!matches) return false;
        }
        
        // Attack filter
        if (activeFilters.attack.length > 0) {
            const char = sample.characteristics;
            let matches = false;
            
            if (activeFilters.attack.includes('soft') && char.attack < 0.3) matches = true;
            if (activeFilters.attack.includes('medium') && char.attack >= 0.3 && char.attack <= 0.7) matches = true;
            if (activeFilters.attack.includes('clicky') && char.attack > 0.7) matches = true;
            
            if (!matches) return false;
        }
        
        // Brightness filter
        if (activeFilters.brightness.length > 0) {
            const char = sample.characteristics;
            let matches = false;
            
            if (activeFilters.brightness.includes('dark') && char.brightness < 0.3) matches = true;
            if (activeFilters.brightness.includes('balanced') && char.brightness >= 0.3 && char.brightness <= 0.7) matches = true;
            if (activeFilters.brightness.includes('bright') && char.brightness > 0.7) matches = true;
            
            if (!matches) return false;
        }
        
        return true;
    });
}

// Update filter count display
function updateFilterCount(count) {
    const filterCount = document.getElementById('filterCount');
    if (filterCount) {
        filterCount.textContent = `${count} sample${count !== 1 ? 's' : ''}`;
    }
}

// Create a sample item element
function createSampleItem(sample, index) {
    const div = document.createElement('div');
    div.className = 'sample-item';
    div.dataset.index = index;
    div.dataset.fileName = sample.fileName;
    
    // Create canvas for waveform
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 50;
    
    // Draw waveform
    drawWaveform(canvas, sample.waveform, sample.color);
    
    div.appendChild(canvas);
    
    // Event listeners
    div.addEventListener('mouseenter', (e) => onSampleHover(sample, div, e));
    div.addEventListener('mouseleave', () => onSampleLeave());
    div.addEventListener('click', (e) => onSampleClick(sample, div, e));
    
    return div;
}

// Handle sample hover
let hoverTimeout = null;

function onSampleHover(sample, element, event) {
    hoveredSample = sample;
    
    // NO tooltip on hover - only sound preview
    // showTooltip(sample, event.clientX, event.clientY);
    
    // Stop any currently playing preview
    if (currentPreview) {
        currentPreview.stop();
        currentPreview = null;
    }
    
    // Clear any pending timeout
    if (hoverTimeout) {
        clearTimeout(hoverTimeout);
    }
    
    // Play preview immediately (no delay)
    if (ENABLE_PREVIEW_ON_HOVER) {
        playPreview(sample.filePath);
    }
}

// Handle sample leave
function onSampleLeave() {
    hoveredSample = null;
    // NO tooltip on hover, so no need to hide it
    
    // Clear hover timeout
    if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
    }
    
    // Stop preview immediately when mouse leaves
    if (currentPreview) {
        currentPreview.stop();
        currentPreview = null;
    }
}

// Handle sample click
function onSampleClick(sample, element, event) {
    // Remove previous selection
    document.querySelectorAll('.sample-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Select this sample
    element.classList.add('selected');
    selectedSample = sample;
    
    // Update footer buttons
    updateFooterButtons(true);
    
    // Show tooltip ONLY on click (not on hover)
    if (event) {
        showTooltip(sample, event.clientX, event.clientY, true);
    }
    
    // Scroll selected item into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Stop hover preview when clicking
    if (currentPreview) {
        currentPreview.stop();
        currentPreview = null;
    }
}

// Show tooltip
function showTooltip(sample, x, y, isSelected = false) {
    const tooltip = document.getElementById('tooltip');
    
    const char = sample.characteristics;
    const info = `
        <div class="tooltip-title">${sample.fileName}</div>
        <div class="tooltip-info">
            Aggressiveness: ${(char.aggressiveness * 100).toFixed(0)}%<br>
            Decay: ${char.decay < 0.3 ? 'Short' : char.decay < 0.7 ? 'Medium' : 'Long'}<br>
            Attack: ${char.attack < 0.3 ? 'Soft' : char.attack < 0.7 ? 'Medium' : 'Clicky'}<br>
            Brightness: ${(char.brightness * 100).toFixed(0)}%<br>
            Duration: ${char.duration.toFixed(2)}s
        </div>
    `;
    
    tooltip.innerHTML = info;
    tooltip.style.left = (x + 15) + 'px';
    tooltip.style.top = (y - 10) + 'px';
    tooltip.classList.add('visible');
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('visible');
}

// Play preview - loops while hovering
async function playPreview(filePath) {
    if (!audioContext) return;
    
    // Stop current preview if playing
    if (currentPreview) {
        try {
            currentPreview.stop();
        } catch (e) {
            // Ignore errors if already stopped
        }
        currentPreview = null;
    }
    
    try {
        const audioBuffer = await loadAudioFile(filePath);
        if (!audioBuffer) return;
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        // Loop the entire sample while hovering
        source.loop = true;
        source.start(0);
        currentPreview = source;
        
        // Store the source so we can stop it when mouse leaves
    } catch (error) {
        console.error('Error playing preview:', error);
    }
}

// Update footer buttons state
function updateFooterButtons(enabled) {
    const buttons = ['playBtn', 'loadBtn', 'downloadBtn', 'viewMoreBtn'];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.disabled = !enabled;
        }
    });
}

// Footer button handlers
document.getElementById('playBtn')?.addEventListener('click', () => {
    if (selectedSample) {
        playPreview(selectedSample.filePath);
    }
});

// Filters panel toggle
document.getElementById('filtersBtn')?.addEventListener('click', () => {
    const panel = document.getElementById('filtersPanel');
    panel.classList.toggle('open');
});

document.getElementById('closeFilters')?.addEventListener('click', () => {
    const panel = document.getElementById('filtersPanel');
    panel.classList.remove('open');
});

// Search input
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    activeFilters.search = e.target.value;
    renderGrid();
});

// Filter tag buttons
document.querySelectorAll('.filter-tag').forEach(btn => {
    btn.addEventListener('click', () => {
        const filterType = btn.dataset.type;
        const filterValue = btn.dataset.filter;
        
        btn.classList.toggle('active');
        
        if (btn.classList.contains('active')) {
            if (!activeFilters[filterType].includes(filterValue)) {
                activeFilters[filterType].push(filterValue);
            }
        } else {
            activeFilters[filterType] = activeFilters[filterType].filter(f => f !== filterValue);
        }
        
        renderGrid();
    });
});

// Clear all filters
document.getElementById('clearAllFilters')?.addEventListener('click', () => {
    // Reset filters
    activeFilters = {
        search: '',
        aggressiveness: [],
        decay: [],
        attack: [],
        brightness: []
    };
    
    // Clear search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    // Remove active class from all filter tags
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.remove('active');
    });
    
    renderGrid();
});

// Preview is always enabled on hover - no toggle needed

// Initialize filter count on load
function initializeFilterCount() {
    updateFilterCount(samplesData.length);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!selectedSample) return;
    
    const currentIndex = samplesData.findIndex(s => s.fileName === selectedSample.fileName);
    let newIndex = currentIndex;
    
    switch(e.key) {
        case 'ArrowUp':
            newIndex = Math.max(0, currentIndex - 10); // Move up by 10 (one row)
            e.preventDefault();
            break;
        case 'ArrowDown':
            newIndex = Math.min(samplesData.length - 1, currentIndex + 10); // Move down by 10
            e.preventDefault();
            break;
        case 'ArrowLeft':
            newIndex = Math.max(0, currentIndex - 1);
            e.preventDefault();
            break;
        case 'ArrowRight':
            newIndex = Math.min(samplesData.length - 1, currentIndex + 1);
            e.preventDefault();
            break;
        case 'Enter':
        case ' ':
            if (selectedSample) {
                playPreview(selectedSample.filePath);
            }
            e.preventDefault();
            break;
        case 'Escape':
            // Deselect
            document.querySelectorAll('.sample-item').forEach(item => {
                item.classList.remove('selected');
            });
            selectedSample = null;
            updateFooterButtons(false);
            hideTooltip();
            e.preventDefault();
            break;
    }
    
    if (newIndex !== currentIndex && samplesData[newIndex]) {
        const newSample = samplesData[newIndex];
        const element = document.querySelector(`[data-file-name="${newSample.fileName}"]`);
        if (element) {
            onSampleClick(newSample, element);
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we can access the samples
    // If running from file://, show a message
    if (window.location.protocol === 'file:') {
        const grid = document.getElementById('sampleGrid');
        grid.innerHTML = `
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #808080;">
                <p style="margin-bottom: 10px;">⚠️ Ce prototype nécessite un serveur web</p>
                <p style="font-size: 12px;">Utilisez un serveur local (ex: Python http.server)</p>
                <p style="font-size: 12px; margin-top: 10px;">
                    <code style="background: #2A2A2A; padding: 4px 8px; border-radius: 4px;">
                        python3 -m http.server 8001
                    </code>
                </p>
                <p style="font-size: 11px; margin-top: 10px; color: #666;">
                    Depuis le dossier: UI Design/Prototype_Visual_Preset_Browser_II/
                </p>
            </div>
        `;
    } else {
        // Load samples
        loadAllSamples();
    }
});
