# HISE Documentation for AI Assistant

## Overview
HISE (Hart Instruments Sampler Engine) is a toolkit for developing sample-based virtual instruments with integrated scripting capabilities. This documentation serves as a comprehensive reference for AI assistants working with HISE projects.

## Documentation Structure

### 📚 [01_hise_syntax_rules.md](01_hise_syntax_rules.md)
Essential HISE syntax rules and common mistakes to avoid:
- Function declaration syntax (`inline function`)
- Variable declaration rules
- Loop syntax requirements
- Component existence checking
- Best practices

### 🔧 [02_hise_api_reference.md](02_hise_api_reference.md)
Complete HISE Scripting API reference:
- Engine Object functions and properties
- Content Object for UI management
- Synth Object for module access
- Sampler Object for sample-specific functionality
- Console Object for debugging
- Colours Object for color utilities
- MIDI callbacks and performance considerations

### 🎛️ [03_scriptnode_reference.md](03_scriptnode_reference.md)
Scriptnode DSP toolkit reference:
- Core concepts and architecture
- Module types (Script FX, Scriptnode Synthesiser, Script Modulators)
- Development workflow and best practices
- Vocabulary and terminology
- Performance optimization guidelines

### 🎨 [04_ui_components_reference.md](04_ui_components_reference.md)
HISE UI Components reference:
- Plugin components (ScriptSlider, ScriptButton, ScriptComboBox, etc.)
- Special components (ScriptPanel, ScriptFloatingTile)
- Advanced UI styling and custom painting
- Graphics context methods
- Common use cases and examples

### 🔊 [05_sound_generators_reference.md](05_sound_generators_reference.md)
Sound Generators reference:
- StreamingSampler for sample-based instruments
- Synthesiser for digital synthesis
- Scriptnode Synthesiser for advanced DSP
- AudioSampleProcessor base class
- Best practices and integration examples

## Key HISE Rules

1. **Always use `inline function`** instead of `function`
2. **Never declare variables inside `inline function` declarations** - declare them outside
3. **Use HISE-specific loop syntax** (`for (item in array)`) when possible
4. **Always check if components exist** before accessing them
5. **Audio effects must be in Script FX modules**, not in main interface
6. **Use proper variable declaration keywords** (const, var, or let, but not combinations)

## Quick Reference

### Basic Function Declaration
```javascript
// ✅ CORRECT
inline function myFunction(component, value) {
    // function body
}

// ❌ WRONG
function myFunction(component, value) {
    // function body
}
```

### Variable Declaration
```javascript
// ✅ CORRECT - Declare outside inline functions
const myVariable = "value";
var localVar = "local";

inline function myFunction() {
    Console.print(myVariable);  // Use existing variables
}

// ❌ WRONG - No declarations inside inline functions
inline function myFunction() {
    const newVar = "value";     // This will cause errors
}
```

### Component Access
```javascript
// ✅ CORRECT - Always check existence
const component = Content.getComponent("myComponent");
if (component) {
    component.setValue(0.5);
}

// ❌ WRONG - Direct access might crash
const component = Content.getComponent("myComponent");
component.setValue(0.5); // Might crash if component doesn't exist
```

## External Resources

- [Official HISE Documentation](https://docs.hise.dev/)
- [HISE Scripting Documentation](https://docs.hise.dev/scripting/index.html)
- [HISE Scriptnode Documentation](https://docs.hise.dev/scriptnode/index.html)
- [HISE UI Components Documentation](https://docs.hise.dev/ui-components/index.html)
- [HISE Modules Documentation](https://docs.hise.dev/hise-modules/index.html)

## Notes for AI Assistants

- All code examples in these files are HISE-compliant
- Syntax mistakes have been corrected according to HISE rules
- Information is organized by topic for easy reference
- Each file focuses on a specific aspect of HISE development
- Examples demonstrate both correct and incorrect patterns where educational

---

*This documentation is based on the official HISE documentation and has been organized and corrected for AI assistant use.*
