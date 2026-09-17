# 808 MAX - KodeLife Shader Guide

This folder contains GLSL shaders you can use in KodeLife to prototype your 808 MAX UI.

## Quick Start with KodeLife

### 1. Open KodeLife
- Launch KodeLife on your Mac
- You should see a default shader with some animation

### 2. Copy & Paste Shaders
1. Open `01_basic_scatter_plot.glsl` in a text editor
2. Select ALL the code (Cmd+A)
3. Copy it (Cmd+C)
4. In KodeLife, click in the code editor
5. Select all (Cmd+A) and paste (Cmd+V)
6. The shader should compile automatically

### 3. Interact with the Shader
- **Move your mouse** over the viewport to see hover effects
- The **time** uniform creates animations
- **Mouse position** controls interaction

## Shader Files

### `01_basic_scatter_plot.glsl` - RECOMMENDED START HERE
**What it does:**
- Renders 10 sample dots on a scatter plot
- Shows fog effect (red top, blue bottom)
- Displays grid background
- Basic hover effect on mouse movement
- Color-coded by tone type (6 colors)
- Border thickness based on attack

**Features:**
- ✅ X-axis: Decay (left = short, right = long)
- ✅ Y-axis: Cleanness (bottom = clean, top = distorted)
- ✅ Size: Brightness
- ✅ Color: Tone category
- ✅ Border: Attack thickness
- ✅ Fog zones (red & blue)
- ✅ Grid background

### `02_animated_selection.glsl` - ADVANCED
**What it does:**
- Everything from `01_basic_scatter_plot.glsl` PLUS:
- Click/hover to select a dot
- Selected dot pulses (animated)
- Selected dot has glow effect
- Non-selected dots dim when one is selected
- Smooth animations

**Features:**
- ✅ All features from shader 01
- ✅ Selection system (nearest dot to mouse)
- ✅ Pulsing animation (2s cycle)
- ✅ Glow effects
- ✅ Opacity states (selected vs not)

## KodeLife Uniforms Reference

KodeLife automatically provides these uniforms:

```glsl
uniform vec2 resolution;   // Viewport size (1920x1080, etc.)
uniform float time;        // Elapsed time in seconds
uniform vec2 mouse;        // Mouse position in pixels
uniform sampler2D texture; // Input texture (if using)
```

## Customization Tips

### Change Number of Samples
In the shader, find:
```glsl
const int NUM_SAMPLES = 10;
```
Change to your desired number (max ~50 for good performance).

Then add more cases in `getSamplePosition()`:
```glsl
if (index == 10) return vec3(0.6, 0.4, 0.7);
if (index == 11) return vec3(0.3, 0.8, 0.5);
// etc...
```

### Change Colors
Modify `getToneColor()` function:
```glsl
if (tone == 0) return vec3(0.54, 0.0, 0.0);  // Pure Sub
if (tone == 1) return vec3(1.0, 0.0, 0.0);   // 808 Classic
// RGB values: vec3(red, green, blue) from 0.0 to 1.0
```

### Adjust Fog Intensity
In `getFogColor()`, change the multiplier:
```glsl
return fogColor * fogIntensity * 0.4;  // Change 0.4 to 0.2-0.8
```

### Change Dot Sizes
In `main()`, adjust:
```glsl
float dotSize = 0.015 + samplePos.z * 0.015;  // Min + (brightness * range)
```

### Change Grid Density
In `drawGrid()`, adjust:
```glsl
float gridSize = 0.1;  // Smaller = denser grid (try 0.05 or 0.2)
```

## Performance Tips

1. **Keep NUM_SAMPLES low** while prototyping (10-20)
2. **Disable features** you don't need (comment out fog, grid, etc.)
3. **Watch the FPS** in KodeLife (should be 60fps)
4. **Simplify calculations** in the loop if slow

## Next Steps

### Test in KodeLife
1. Start with shader 01 to verify basic rendering
2. Move to shader 02 to test interactions
3. Experiment with values (colors, sizes, positions)

### Export for HISE
Once you're happy with the shader:
1. Copy the shader code
2. In HISE, create a ScriptPanel
3. Use `Panel.setShader()` to load your GLSL
4. Replace `mouse` uniform with actual click detection
5. Replace hardcoded data with real sample data

## Troubleshooting

### Shader doesn't compile
- Check for syntax errors (missing semicolons, etc.)
- KodeLife shows errors in the console (bottom panel)
- Make sure all functions are defined before they're used

### Nothing appears
- Background might be too dark: increase `vec3(0.04)` to `vec3(0.1)`
- Dots might be too small: increase dot size multiplier
- Check that `NUM_SAMPLES` matches your data

### Performance is slow
- Reduce `NUM_SAMPLES`
- Simplify calculations in the loop
- Remove fog or grid effects temporarily

### Mouse interaction doesn't work
- Make sure you're moving the mouse over the KodeLife viewport
- Check that `mouseUV` calculation is correct
- Try increasing hover radius: `smoothstep(0.05, 0.02, ...)`

## Additional Resources

- **KodeLife Docs**: https://hexler.net/kodelife/manual
- **GLSL Reference**: https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language
- **ShaderToy** (for inspiration): https://www.shadertoy.com/

## Sample Data Format

When you move to HISE, your sample data should look like:
```javascript
const samples = [
    {
        decay: 0.3,      // 0.0-1.0 (X-axis)
        cleanness: 0.2,  // 0.0-1.0 (Y-axis, 0=clean, 1=distorted)
        brightness: 0.6, // 0.0-1.0 (size)
        attack: 0.2,     // 0.0-1.0 (border)
        tone: 0          // 0-5 (color category)
    },
    // ... more samples
];
```

## Questions?

If you run into issues:
1. Check the KodeLife console for errors
2. Start with the simplest shader (01) first
3. Comment out sections to isolate problems
4. Verify uniforms are being passed correctly

Happy shader coding! 🎨🔊

