// 808 MAX - Animated Selection & Pulsing (KodeLife)
// This version adds selection animation and pulsing effect

precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const int NUM_SAMPLES = 10;

// Sample positions
vec3 getSamplePosition(int index) {
    if (index == 0) return vec3(0.3, 0.2, 0.6);
    if (index == 1) return vec3(0.5, 0.9, 0.8);
    if (index == 2) return vec3(0.7, 0.5, 0.7);
    if (index == 3) return vec3(0.2, 0.15, 0.5);
    if (index == 4) return vec3(0.8, 0.8, 0.9);
    if (index == 5) return vec3(0.4, 0.3, 0.4);
    if (index == 6) return vec3(0.6, 0.7, 0.8);
    if (index == 7) return vec3(0.35, 0.25, 0.6);
    if (index == 8) return vec3(0.75, 0.85, 0.7);
    if (index == 9) return vec3(0.5, 0.5, 0.5);
    return vec3(0.5, 0.5, 0.5);
}

vec3 getToneColor(int index) {
    int tone = index % 6;
    if (tone == 0) return vec3(0.54, 0.0, 0.0);
    if (tone == 1) return vec3(1.0, 0.0, 0.0);
    if (tone == 2) return vec3(1.0, 0.2, 0.0);
    if (tone == 3) return vec3(1.0, 0.4, 0.0);
    if (tone == 4) return vec3(1.0, 0.6, 0.0);
    if (tone == 5) return vec3(0.8, 0.0, 0.4);
    return vec3(1.0, 0.0, 0.0);
}

float getAttack(int index) {
    if (index == 1) return 0.9;
    if (index == 4) return 0.8;
    if (index == 0) return 0.2;
    return 0.5;
}

// Enhanced dot drawing with glow
float drawDot(vec2 p, vec2 center, float size, float attack, float glow, out float borderMask) {
    float dist = length(p - center);
    float radius = size * 0.5;
    
    // Main circle with anti-aliasing
    float circle = smoothstep(radius + 0.002, radius - 0.002, dist);
    
    // Border
    float borderWidth = attack * 0.008;
    float borderInner = radius - borderWidth;
    borderMask = smoothstep(borderInner - 0.002, borderInner, dist) * 
                 smoothstep(radius, radius - 0.002, dist);
    
    // Add glow (for selection/hover)
    if (glow > 0.01) {
        float glowRadius = radius + 0.015 * glow;
        float glowFalloff = smoothstep(glowRadius, radius, dist);
        circle = max(circle, glowFalloff * glow * 0.5);
    }
    
    return circle;
}

vec3 getFogColor(float y) {
    vec3 fogColor = vec3(0.0);
    float fogIntensity = 0.0;
    
    if (y > 0.7) {
        fogIntensity = pow((y - 0.7) / 0.3, 2.0);
        fogColor = mix(vec3(0.54, 0.0, 0.0), vec3(1.0, 0.0, 0.0), fogIntensity);
        return fogColor * fogIntensity * 0.4;
    }
    else if (y < 0.3) {
        fogIntensity = pow((0.3 - y) / 0.3, 2.0);
        fogColor = mix(vec3(0.0, 0.2, 0.4), vec3(0.0, 0.4, 1.0), fogIntensity);
        return fogColor * fogIntensity * 0.4;
    }
    
    return vec3(0.0);
}

float drawGrid(vec2 uv) {
    float gridSize = 0.1;
    vec2 grid = abs(fract(uv / gridSize - 0.5) - 0.5) / fwidth(uv / gridSize);
    float line = min(grid.x, grid.y);
    float gridAlpha = (1.0 - min(line, 1.0)) * (1.0 - uv.y * 0.5);
    return gridAlpha * 0.15;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 mouseUV = mouse / resolution;
    
    // Background
    vec3 color = vec3(0.04, 0.04, 0.04);
    color += vec3(0.1, 0.1, 0.1) * drawGrid(uv);
    color += getFogColor(uv.y);
    
    // Find nearest dot to mouse for selection
    int selectedIndex = -1;
    float minDist = 0.05;  // Selection radius
    
    for (int i = 0; i < NUM_SAMPLES; i++) {
        vec3 samplePos = getSamplePosition(i);
        vec2 dotPos = vec2(
            0.1 + samplePos.x * 0.8,
            0.1 + (1.0 - samplePos.y) * 0.8
        );
        
        float dist = length(mouseUV - dotPos);
        if (dist < minDist) {
            minDist = dist;
            selectedIndex = i;
        }
    }
    
    // Pulsing animation (2 second cycle)
    float pulse = 0.9 + 0.1 * sin(time * 3.14159);
    
    // Draw all dots
    for (int i = 0; i < NUM_SAMPLES; i++) {
        vec3 samplePos = getSamplePosition(i);
        vec2 dotPos = vec2(
            0.1 + samplePos.x * 0.8,
            0.1 + (1.0 - samplePos.y) * 0.8
        );
        
        float dotSize = 0.015 + samplePos.z * 0.015;
        vec3 toneColor = getToneColor(i);
        float attack = getAttack(i);
        
        toneColor *= (0.5 + samplePos.z * 0.5);
        
        // Calculate opacity and glow based on state
        float opacity = 0.7;
        float glow = 0.0;
        float sizeMultiplier = 1.0;
        
        // Hover effect
        float hoverDist = length(uv - dotPos);
        if (hoverDist < 0.03) {
            float hoverIntensity = smoothstep(0.03, 0.015, hoverDist);
            glow = hoverIntensity * 0.8;
            sizeMultiplier = 1.0 + hoverIntensity * 0.3;
            opacity = 1.0;
        }
        
        // Selection effect (overrides hover)
        if (i == selectedIndex) {
            glow = 1.0 * pulse;  // Pulsing glow
            sizeMultiplier = 1.2 * pulse;  // Pulsing size
            opacity = 1.0;
            
            // Dim all other dots
            if (i != selectedIndex) {
                opacity = 0.3;
            }
        } else if (selectedIndex >= 0) {
            // Dim non-selected dots when something is selected
            opacity = 0.3;
        }
        
        // Draw dot
        float borderMask;
        float dot = drawDot(uv, dotPos, dotSize * sizeMultiplier, attack, glow, borderMask);
        
        vec3 dotColor = toneColor;
        
        // Brighter border
        if (borderMask > 0.01) {
            dotColor = mix(dotColor, vec3(1.0), 0.5);
        }
        
        // Add extra glow for selection
        if (glow > 0.01) {
            dotColor += vec3(0.3, 0.0, 0.0) * glow;
        }
        
        // Composite
        color = mix(color, dotColor, dot * opacity);
        if (borderMask > 0.01) {
            color = mix(color, dotColor, borderMask * opacity);
        }
    }
    
    gl_FragColor = vec4(color, 1.0);
}

