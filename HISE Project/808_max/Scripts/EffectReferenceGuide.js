// ========== HISE Effect Reference Guide ==========
// Based on actual working examples from this project

// ===== 1. REGULAR AUDIO EFFECTS (Filters, Saturators, Reverbs, etc.) =====
// Use: Synth.getEffect("EffectName")
// ✅ WORKING EXAMPLE from Saturation.js:
const saturator = Synth.getEffect("SaturatorTape");

// For a filter effect, you would use:
// const filter = Synth.getEffect("FilterName"); // Replace "FilterName" with actual name

// ===== 2. SAMPLER/SYNTH INSTANCES =====
// Use: Synth.getChildSynth("SynthName")
// ✅ WORKING EXAMPLE from Preset.js:
const Sampler1 = Synth.getChildSynth("Sampler1");

// Alternative method for multiple samplers:
// ✅ WORKING EXAMPLE from keyboard.js:
const samplerIds = Synth.getIdList("Sampler");
const samplers = [];
for (id in samplerIds)
    samplers.push(Synth.getSampler(id));

// ===== 3. EFFECTS INSIDE SAMPLERS (Child Effects) =====
// These are accessed through the sampler instance, NOT directly
// ✅ WORKING EXAMPLES from Buttons.js and Preset.js:

// Access sampler and then its properties:
Sampler1.setAttribute(Sampler1.Reversed, true);
Sampler1.asSampler().loadSampleMap("SampleMapName");

// For sampler effects like envelope, filter, etc., you access them via the sampler:
// Sampler1.setAttribute(Sampler1.GainAHDSR, value);
// Sampler1.setAttribute(Sampler1.FilterFreqModulationMod, value);

// ===== 4. SCRIPT NODE EFFECTS =====
// ❌ These CANNOT be accessed via Synth.getEffect()
// ✅ Instead, use macros or UI components:

// Method 1: Via macros (most reliable)
// const macroValue = Synth.getMacroControl(0).getDisplayValue();

// Method 2: Via UI components
// const scriptControl = Content.getComponent("ScriptNodeControlName");

// ===== 5. TESTING WHICH METHOD TO USE =====
// To find out what effects exist in your project:
Console.print("All Effect IDs: " + Synth.getIdList("Effect"));
Console.print("All Synth IDs: " + Synth.getIdList("Synth"));

// ===== 6. COMMON MISTAKES =====
// ❌ WRONG: Trying to access sampler effects directly
// const samplerFilter = Synth.getEffect("SamplerFilter"); // This won't work

// ✅ CORRECT: Access through the sampler
// const sampler = Synth.getChildSynth("Sampler1");
// sampler.setAttribute(sampler.FilterFrequency, 1000);
