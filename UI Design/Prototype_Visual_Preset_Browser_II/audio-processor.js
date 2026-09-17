// Audio Processor - Functions for loading and processing audio files

/**
 * Load an audio file and return the AudioBuffer
 */
async function loadAudioFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load audio file: ${filePath}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
    } catch (error) {
        console.error('Error loading audio file:', error);
        return null;
    }
}

/**
 * Extract simplified waveform data from AudioBuffer
 * @param {AudioBuffer} audioBuffer - The audio buffer to process
 * @param {number} resolution - Number of points in the waveform (default: 150)
 * @returns {Array} Array of waveform points {avg, peak}
 */
function extractWaveform(audioBuffer, resolution = 150) {
    if (!audioBuffer) return [];
    
    const channelData = audioBuffer.getChannelData(0); // Use first channel (mono)
    const blockSize = Math.floor(channelData.length / resolution);
    const waveform = [];
    
    for (let i = 0; i < resolution; i++) {
        const start = i * blockSize;
        const end = Math.min(start + blockSize, channelData.length);
        let sum = 0;
        let max = 0;
        let count = 0;
        
        for (let j = start; j < end; j++) {
            const abs = Math.abs(channelData[j]);
            sum += abs;
            max = Math.max(max, abs);
            count++;
        }
        
        waveform.push({
            avg: count > 0 ? sum / count : 0,
            peak: max
        });
    }
    
    return waveform;
}

/**
 * Draw waveform on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element to draw on
 * @param {Array} waveform - Waveform data array
 * @param {string} color - Color for the waveform (CSS color)
 */
function drawWaveform(canvas, waveform, color) {
    if (!waveform || waveform.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set color
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    
    const barWidth = width / waveform.length;
    const centerY = height / 2;
    
    waveform.forEach((point, i) => {
        const x = i * barWidth;
        const barHeight = Math.max(point.peak * height * 0.8, 1); // Scale to 80% of height
        
        // Draw centered bars (symmetrical waveform)
        const yTop = centerY - barHeight / 2;
        const yBottom = centerY + barHeight / 2;
        
        // Draw top bar
        ctx.fillRect(x, yTop, Math.max(barWidth - 1, 1), barHeight / 2);
        
        // Draw bottom bar (mirrored)
        ctx.fillRect(x, centerY, Math.max(barWidth - 1, 1), barHeight / 2);
    });
}

/**
 * Calculate audio characteristics from AudioBuffer
 * @param {AudioBuffer} audioBuffer - The audio buffer to analyze
 * @returns {Object} Characteristics object
 */
function calculateCharacteristics(audioBuffer) {
    if (!audioBuffer) {
        return {
            aggressiveness: 0.5,
            decay: 0.5,
            attack: 0.5,
            brightness: 0.5,
            duration: 0
        };
    }
    
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const duration = audioBuffer.duration;
    
    // Calculate RMS (Root Mean Square) for overall level
    let rms = 0;
    for (let i = 0; i < channelData.length; i++) {
        rms += channelData[i] * channelData[i];
    }
    rms = Math.sqrt(rms / channelData.length);
    
    // Find peak (attack)
    let peakIndex = 0;
    let peakValue = 0;
    const searchWindow = Math.min(channelData.length, sampleRate * 0.1); // First 100ms
    for (let i = 0; i < searchWindow; i++) {
        const abs = Math.abs(channelData[i]);
        if (abs > peakValue) {
            peakValue = abs;
            peakIndex = i;
        }
    }
    const attack = peakIndex / searchWindow; // 0-1
    
    // Calculate decay (how long it takes to drop to 10% of peak)
    const threshold = peakValue * 0.1;
    let decayEnd = channelData.length;
    for (let i = peakIndex; i < channelData.length; i++) {
        if (Math.abs(channelData[i]) < threshold) {
            decayEnd = i;
            break;
        }
    }
    const decayTime = (decayEnd - peakIndex) / sampleRate;
    const decay = Math.min(decayTime / 2.0, 1.0); // Normalize to 0-1 (2 seconds = 1.0)
    
    // Calculate brightness (high frequency content)
    // Simple approximation: ratio of high amplitude samples
    let highFreqCount = 0;
    const highFreqThreshold = 0.3;
    for (let i = 0; i < channelData.length; i += 10) { // Sample every 10th point
        if (Math.abs(channelData[i]) > highFreqThreshold) {
            highFreqCount++;
        }
    }
    const brightness = Math.min(highFreqCount / (channelData.length / 10), 1.0);
    
    // Calculate aggressiveness (distortion, high RMS, fast attack)
    const aggressiveness = Math.min(
        (rms * 2 + attack + brightness) / 3,
        1.0
    );
    
    return {
        aggressiveness: aggressiveness,
        decay: decay,
        attack: attack,
        brightness: brightness,
        duration: duration
    };
}

/**
 * Get color from position Y (aggressiveness)
 * @param {number} y - Position Y (0 = clean/blue, 1 = aggressive/red)
 * @returns {string} CSS color string
 */
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

/**
 * Generate sample metadata from audio file
 * @param {string} fileName - Name of the file
 * @param {string} filePath - Path to the file
 * @param {AudioBuffer} audioBuffer - Decoded audio buffer
 * @returns {Object} Sample metadata object
 */
function generateSampleMetadata(fileName, filePath, audioBuffer) {
    const waveform = extractWaveform(audioBuffer, 150);
    const characteristics = calculateCharacteristics(audioBuffer);
    
    // Position Y based on aggressiveness (0 = clean/bottom, 1 = aggressive/top)
    const positionY = characteristics.aggressiveness;
    
    // Position X based on decay (0 = short/left, 1 = long/right)
    const positionX = characteristics.decay;
    
    // Get color from position
    const color = getColorFromPosition(positionY);
    
    return {
        fileName: fileName,
        filePath: filePath,
        waveform: waveform,
        characteristics: characteristics,
        color: color,
        position: {
            x: positionX,
            y: positionY
        }
    };
}
