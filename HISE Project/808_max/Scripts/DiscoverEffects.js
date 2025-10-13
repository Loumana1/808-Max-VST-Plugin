// ========== EFFECT DISCOVERY SCRIPT ==========
// Run this to see all available effects in your HISE project

// 1. List all effects in the project
Console.print("=== ALL EFFECTS ===");
const allEffects = Synth.getIdList("Effect");
Console.print("Effect IDs: " + allEffects.join(", "));

// 2. List all synths/samplers
Console.print("=== ALL SYNTHS/SAMPLERS ===");
const allSynths = Synth.getIdList("Synth");
Console.print("Synth IDs: " + allSynths.join(", "));

// 3. Try to access each effect
Console.print("=== TESTING EFFECT ACCESS ===");
for (effectId in allEffects)
{
    try {
        const effect = Synth.getEffect(effectId);
        Console.print("✅ SUCCESS: " + effectId + " - accessible via Synth.getEffect()");
    } catch (error) {
        Console.print("❌ FAILED: " + effectId + " - " + error);
    }
}

// 4. Try to access each synth
Console.print("=== TESTING SYNTH ACCESS ===");
for (synthId in allSynths)
{
    try {
        const synth = Synth.getChildSynth(synthId);
        Console.print("✅ SUCCESS: " + synthId + " - accessible via Synth.getChildSynth()");
    } catch (error) {
        Console.print("❌ FAILED: " + synthId + " - " + error);
    }
}

// 5. Test specific effects from your project
Console.print("=== TESTING KNOWN EFFECTS ===");

// Test saturator (we know this works)
try {
    const saturator = Synth.getEffect("SaturatorTape");
    Console.print("✅ SaturatorTape: accessible");
} catch (error) {
    Console.print("❌ SaturatorTape: " + error);
}

// Test sampler (we know this works)
try {
    const sampler = Synth.getChildSynth("Sampler1");
    Console.print("✅ Sampler1: accessible");
} catch (error) {
    Console.print("❌ Sampler1: " + error);
}

// Test your script FX
try {
    const scriptFX = Synth.getEffect("ScriptFX1");
    Console.print("✅ ScriptFX1: accessible via getEffect()");
} catch (error) {
    Console.print("❌ ScriptFX1: " + error);
    
    // Try alternative method
    try {
        const scriptFX2 = Synth.getChildSynth("ScriptFX1");
        Console.print("✅ ScriptFX1: accessible via getChildSynth()");
    } catch (error2) {
        Console.print("❌ ScriptFX1 via getChildSynth(): " + error2);
    }
}

Console.print("=== DISCOVERY COMPLETE ===");
