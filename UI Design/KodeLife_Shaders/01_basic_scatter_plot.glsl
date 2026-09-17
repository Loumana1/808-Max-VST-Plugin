/*{
    "DESCRIPTION": "808 MAX - Basic Scatter Plot",
    "CREDIT": "808 Max VST Plugin UI Prototype",
    "CATEGORIES": ["Visualization"],
    "INPUTS": []
}*/

#version 150

precision highp float;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

// Sample data (hardcoded for testing - replace with texture later)
const int NUM_SAMPLES = 100;

// View Modes (change this to switch between modes)
// 0 = Galaxy View (free scatter - similarity based)
// 1 = Grid View (organized grid - easy to browse)
// 2 = Cluster View (grouped by category)
const int VIEW_MODE = 0;  // CHANGE THIS: 0, 1, or 2

// XO Color Palette (from Night theme)
const vec3 COLOR_NIGHT = vec3(0.063, 0.063, 0.063);        // #101010 - background
const vec3 COLOR_PICTON_BLUE = vec3(0.004, 0.655, 0.996);  // #01A7FE
const vec3 COLOR_AMARANTH = vec3(0.898, 0.063, 0.282);     // #E51048 - red
const vec3 COLOR_XANTHOUS = vec3(0.914, 0.706, 0.016);     // #E9B404 - yellow
const vec3 COLOR_HELIOTROPE = vec3(0.804, 0.349, 0.996);   // #CD59FE - purple

// Get sample category (0-3 for 4 categories)
int getSampleCategory(int index) {
    float fi = float(index);
    float y = fract(sin(fi * 78.233) * 43758.5453);
    return int(floor(y * 4.0));  // 0=blue, 1=yellow, 2=red, 3=purple
}

// Helper function to create sample positions - MODE DEPENDENT
vec3 getSamplePosition(int index) {
    float fi = float(index);
    
    // Base random values
    float rx = fract(sin(fi * 12.9898) * 43758.5453);
    float ry = fract(sin(fi * 78.233) * 43758.5453);
    float rz = fract(sin(fi * 45.164) * 43758.5453);
    
    // MODE 1: GRID VIEW (organized grid like Atlas Earth View)
    if (VIEW_MODE == 1) {
        int cols = 10;  // 10x10 grid for 100 samples
        int row = index / cols;
        int col = index - (row * cols);
        
        return vec3(
            float(col) / float(cols - 1),  // X: 0.0 to 1.0
            float(row) / float(cols - 1),  // Y: 0.0 to 1.0
            0.5  // Z: all at same depth
        );
    }
    
    // MODE 2: CLUSTER VIEW (grouped by category)
    if (VIEW_MODE == 2) {
        int category = getSampleCategory(index);
        
        // 4 cluster centers (one per category)
        vec2 centers[4];
        centers[0] = vec2(0.25, 0.25);  // Blue cluster (bottom-left)
        centers[1] = vec2(0.75, 0.25);  // Yellow cluster (bottom-right)
        centers[2] = vec2(0.25, 0.75);  // Red cluster (top-left)
        centers[3] = vec2(0.75, 0.75);  // Purple cluster (top-right)
        
        vec2 center = centers[category];
        
        // Scatter around cluster center
        float spread = 0.15;
        return vec3(
            center.x + (rx - 0.5) * spread,
            center.y + (ry - 0.5) * spread,
            rz
        );
    }
    
    // MODE 0: GALAXY VIEW (free scatter - default)
    return vec3(rx, ry, rz);
}

// Draw a single dot - XO style with uniform size
float drawDot(vec2 p, vec2 center, float baseSize, bool isSelected, out float whiteCircle) {
    float dist = length(p - center);
    
    // All dots same size - no depth scaling
    float dotRadius = baseSize * 0.5;
    
    // Main circle - perfectly round, solid filled with anti-aliasing
    float edgeSoftness = 0.0003;  // Very crisp edges
    float circle = smoothstep(dotRadius + edgeSoftness, dotRadius - edgeSoftness, dist);
    
    // Big thin white circle around selected dot
    whiteCircle = 0.0;
    if (isSelected) {
        // Large circle - 6x the dot size
        float whiteOuter = dotRadius * 6.0;
        float whiteInner = whiteOuter - 0.0015;  // Very thin (1px)
        
        whiteCircle = smoothstep(whiteInner - edgeSoftness, whiteInner, dist) * 
                      smoothstep(whiteOuter + edgeSoftness, whiteOuter, dist);
    }
    
    return circle;
}

// Get dot color based on attributes (XO-style color coding)
vec3 getDotColor(vec3 pos) {
    // Color dots based on position/attributes
    // Using XO's vibrant color palette
    float attribute = pos.y;  // Use Y position as example attribute
    
    if (attribute < 0.25) {
        return COLOR_PICTON_BLUE;  // Clean/Sub
    } else if (attribute < 0.5) {
        return COLOR_XANTHOUS;      // Warm/Mid
    } else if (attribute < 0.75) {
        return COLOR_AMARANTH;      // Distorted/Aggressive
    } else {
        return COLOR_HELIOTROPE;    // Synthetic/Bright
    }
}

// Draw grid
float drawGrid(vec2 uv) {
    float gridSize = 0.1;
    float lineWidth = 0.002;
    
    vec2 grid = abs(fract(uv / gridSize - 0.5) - 0.5) / fwidth(uv / gridSize);
    float line = min(grid.x, grid.y);
    
    float gridAlpha = 1.0 - min(line, 1.0);
    
    // Fade towards back
    gridAlpha *= (1.0 - uv.y * 0.5);
    
    return gridAlpha * 0.15;
}

void main() {
    // Normalize coordinates (0.0 to 1.0)
    vec2 uv = gl_FragCoord.xy / resolution;
    
    // XO-style background - Night color (#101010)
    vec3 color = COLOR_NIGHT;
    
    // Subtle grid (much darker than before)
    float grid = drawGrid(uv);
    color += vec3(0.02, 0.02, 0.02) * grid;
    
    // Mouse-based selection (no animation)
    int selectedIndex = -1;  // No selection by default
    
    // Find closest dot to mouse cursor
    float minDist = 0.05;  // Selection radius (5% of screen)
    for (int i = 0; i < NUM_SAMPLES; i++) {
        vec3 samplePos = getSamplePosition(i);
        vec2 dotPos = vec2(
            0.1 + samplePos.x * 0.8,
            0.1 + (1.0 - samplePos.y) * 0.8
        );
        
        // Normalize mouse position
        vec2 mousePos = mouse / resolution;
        
        float dist = length(uv - dotPos);
        if (dist < minDist && length(mousePos - dotPos) < 0.03) {
            minDist = dist;
            selectedIndex = i;
        }
    }
    
    // Draw all sample dots with DEPTH SORTING
    // First pass: collect all dots with their depth
    // Second pass: draw from back to front for proper 3D layering
    
    for (int i = 0; i < NUM_SAMPLES; i++) {
        vec3 samplePos = getSamplePosition(i);
        
        // 3D to 2D projection
        // X and Y are direct, Z affects size (perspective)
        vec2 dotPos = vec2(
            0.1 + samplePos.x * 0.8,
            0.1 + (1.0 - samplePos.y) * 0.8  // Flip Y for screen coords
        );
        
        // Base dot size - larger in Grid View for easier clicking
        float baseDotSize = (VIEW_MODE == 1) ? 0.012 : 0.008;
        
        // Check if this dot is selected
        bool isSelected = (i == selectedIndex);
        
        // Draw dot (all same size)
        float whiteCircle;
        float dot = drawDot(uv, dotPos, baseDotSize, isSelected, whiteCircle);
        
        // Get XO-style color for this dot
        vec3 dotColor = getDotColor(samplePos);
        
        // Apply depth-based opacity for 3D feel
        float depthOpacity = 0.6 + (samplePos.z * 0.4);  // Far dots are more transparent
        
        // Composite dot with its vibrant color
        if (dot > 0.01) {
            color = mix(color, dotColor, dot * depthOpacity);
        }
        
        // Add big thin white circle for selected dot
        if (whiteCircle > 0.01) {
            color = mix(color, vec3(1.0, 1.0, 1.0), whiteCircle);  // Pure white
        }
    }
    
    // Output
    fragColor = vec4(color, 1.0);
}

