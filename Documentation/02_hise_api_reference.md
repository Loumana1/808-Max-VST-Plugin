# HISE Scripting API Reference

Based on the [official HISE documentation](https://docs.hise.dev/scripting/index.html), HISE provides 200+ built-in functions for accessing and modifying virtual instrument components.

## Core API Objects

### Engine Object
The Engine object provides access to global HISE functionality.

**Functions:**
- `Engine.setKeyColour(noteNumber, colour)` - Set keyboard key colors
- `Engine.undo()` - Undo last operation
- `Engine.redo()` - Redo last operation
- `Engine.setKeyColour(i, Colours.withAlpha(Colours.black, 0.4))` - Set key with alpha
- `Engine.setKeyColour(i, Colours.withAlpha(Colours.blue, 0.2))` - Highlight mapped keys
- `Engine.getSampleRate()` - Get current sample rate
- `Engine.getBlockSize()` - Get current block size
- `Engine.getUptime()` - Get uptime in seconds
- `Engine.getCpuUsage()` - Get CPU usage percentage
- `Engine.getMemoryUsage()` - Get memory usage
- `Engine.isOffline()` - Check if in offline mode
- `Engine.getMacroControl(index)` - Get macro control value (1-8)
- `Engine.setMacroControl(index, value)` - Set macro control value
- `Engine.getPlayHead()` - Get playhead position
- `Engine.getTempo()` - Get current tempo
- `Engine.getTimeSignature()` - Get time signature
- `Engine.getRootFrequency()` - Get root frequency
- `Engine.getGainValue()` - Get gain value
- `Engine.setGainValue(value)` - Set gain value

### Content Object
The Content object manages the user interface and components.

**Functions:**
- `Content.makeFrontInterface(width, height)` - Create main interface
- `Content.getComponent(componentId)` - Get UI component reference
- `Content.getAllComponents(pattern)` - Get components matching pattern
- `Content.createLocalLookAndFeel()` - Create custom styling
- `Content.addKnob(id, x, y)` - Dynamically add knob
- `Content.addButton(id, x, y)` - Dynamically add button
- `Content.addSlider(id, x, y)` - Dynamically add slider
- `Content.addComboBox(id, x, y)` - Dynamically add combo box
- `Content.addLabel(id, x, y)` - Dynamically add label
- `Content.addPanel(id, x, y)` - Dynamically add panel
- `Content.addImage(id, x, y)` - Dynamically add image
- `Content.addAudioWaveform(id, x, y)` - Dynamically add waveform display
- `Content.addFloatingTile(id, x, y)` - Dynamically add floating tile
- `Content.setValuePopupData(component, data)` - Set popup data for components
- `Content.setTooltip(component, text)` - Set tooltip for component
- `Content.repaint()` - Repaint the interface
- `Content.repaintWithMessage(message)` - Repaint with message
- `Content.setLoadingCallback(callback)` - Set loading callback
- `Content.setTimerCallback(callback)` - Set timer callback
- `Content.setMouseCallback(callback)` - Set mouse callback
- `Content.setKeyCallback(callback)` - Set key callback
- `Content.setPaintCallback(callback)` - Set paint callback
- `Content.setResizeCallback(callback)` - Set resize callback

**Properties:**
- `Content.width` - Interface width
- `Content.height` - Interface height
- `Content.isFront` - Is front interface
- `Content.isPopup` - Is popup interface
- `Content.isModal` - Is modal interface

### Synth Object
The Synth object provides access to synthesizer modules.

**Functions:**
- `Synth.getChildSynth(synthId)` - Get child synthesizer
- `Synth.getIdList(moduleType)` - Get list of module IDs
- `Synth.getSampler(id)` - Get sampler reference
- `Synth.getEffect(effectId)` - Get effect reference
- `Synth.getModulator(modulatorId)` - Get modulator reference
- `Synth.getChildSynth("Sampler1")` - Get specific sampler
- `Synth.getIdList("Sampler")` - Get all sampler IDs
- `Synth.getIdList("Effect")` - Get all effect IDs
- `Synth.getIdList("Modulator")` - Get all modulator IDs
- `Synth.getIdList("ScriptFX")` - Get all script FX IDs
- `Synth.getIdList("Scriptnode")` - Get all scriptnode IDs
- `Synth.addChildSynth(id, type)` - Add child synthesizer
- `Synth.removeChildSynth(id)` - Remove child synthesizer
- `Synth.getParameter(id, parameterId)` - Get parameter value
- `Synth.setParameter(id, parameterId, value)` - Set parameter value
- `Synth.getAttribute(id, attributeId)` - Get attribute value
- `Synth.setAttribute(id, attributeId, value)` - Set attribute value
- `Synth.getBypassed(id)` - Get bypass state
- `Synth.setBypassed(id, bypassed)` - Set bypass state
- `Synth.getGain(id)` - Get gain value
- `Synth.setGain(id, gain)` - Set gain value
- `Synth.getPan(id)` - Get pan value
- `Synth.setPan(id, pan)` - Set pan value

### Sampler Object
The Sampler object provides access to sampler-specific functionality.

**Functions:**
- `Sampler.getSampleMapList()` - Get available sample maps
- `Sampler.asSampler().loadSampleMap(mapName)` - Load sample map
- `Sampler.isNoteNumberMapped(noteNumber)` - Check if note is mapped
- `Sampler.getSampleForNote(noteNumber)` - Get sample for note
- `Sampler.getVelocityLayer(noteNumber, velocity)` - Get velocity layer
- `Sampler.getRRGroup(noteNumber)` - Get round robin group
- `Sampler.getSampleStart(noteNumber)` - Get sample start position
- `Sampler.getSampleEnd(noteNumber)` - Get sample end position
- `Sampler.getSampleLoopStart(noteNumber)` - Get loop start
- `Sampler.getSampleLoopEnd(noteNumber)` - Get loop end
- `Sampler.getSampleLoopEnabled(noteNumber)` - Check if loop enabled
- `Sampler.getSamplePitch(noteNumber)` - Get sample pitch
- `Sampler.getSampleGain(noteNumber)` - Get sample gain
- `Sampler.getSamplePan(noteNumber)` - Get sample pan
- `Sampler.getSampleFilter(noteNumber)` - Get sample filter
- `Sampler.getSampleModulation(noteNumber)` - Get sample modulation
- `Sampler.getSampleEnvelope(noteNumber)` - Get sample envelope
- `Sampler.getSampleLFO(noteNumber)` - Get sample LFO
- `Sampler.getSampleReverb(noteNumber)` - Get sample reverb
- `Sampler.getSampleDelay(noteNumber)` - Get sample delay
- `Sampler.getSampleChorus(noteNumber)` - Get sample chorus
- `Sampler.getSampleDistortion(noteNumber)` - Get sample distortion
- `Sampler.getSampleCompressor(noteNumber)` - Get sample compressor
- `Sampler.getSampleLimiter(noteNumber)` - Get sample limiter
- `Sampler.getSampleEQ(noteNumber)` - Get sample EQ

### Console Object
The Console object provides debugging and logging functionality.

**Functions:**
- `Console.print(message)` - Print message to console
- `Console.printError(message)` - Print error message
- `Console.printWarning(message)` - Print warning message
- `Console.clear()` - Clear console
- `Console.log(message)` - Log message (alias for print)
- `Console.error(message)` - Log error (alias for printError)
- `Console.warn(message)` - Log warning (alias for printWarning)

### Colours Object
The Colours object provides color utilities and predefined colors.

**Functions:**
- `Colours.withAlpha(colour, alpha)` - Add alpha to color
- `Colours.overlay(colour1, colour2)` - Overlay colors
- `Colours.blend(colour1, colour2, ratio)` - Blend colors
- `Colours.darken(colour, amount)` - Darken color
- `Colours.lighten(colour, amount)` - Lighten color
- `Colours.invert(colour)` - Invert color
- `Colours.fromRGB(r, g, b)` - Create color from RGB
- `Colours.fromRGBA(r, g, b, a)` - Create color from RGBA
- `Colours.fromHSV(h, s, v)` - Create color from HSV
- `Colours.fromHSL(h, s, l)` - Create color from HSL

**Predefined Colors:**
- `Colours.black` - Black color
- `Colours.white` - White color
- `Colours.red` - Red color
- `Colours.green` - Green color
- `Colours.blue` - Blue color
- `Colours.yellow` - Yellow color
- `Colours.cyan` - Cyan color
- `Colours.magenta` - Magenta color
- `Colours.grey` - Grey color
- `Colours.lightgrey` - Light grey color
- `Colours.darkgrey` - Dark grey color
- `Colours.transparent` - Transparent color
- `Colours.lightblue` - Light blue color
- `Colours.lightgreen` - Light green color
- `Colours.lightred` - Light red color
- `Colours.lightyellow` - Light yellow color
- `Colours.lightcyan` - Light cyan color
- `Colours.lightmagenta` - Light magenta color

## MIDI Callbacks
Standard MIDI processing callbacks that can be implemented in HISE scripts:

```javascript
// MIDI Note Events
inline function onNoteOn() {
    // Called when MIDI note on is received
    // Access note data via Engine.getNoteNumber(), Engine.getVelocity(), etc.
}

inline function onNoteOff() {
    // Called when MIDI note off is received
}

// MIDI Controller Events
inline function onController() {
    // Called when MIDI controller message is received
    // Access controller data via Engine.getControllerNumber(), Engine.getControllerValue()
}

// Timer Callback
inline function onTimer() {
    // Called periodically (set via Content.setTimerCallback())
}

// Control Callback
inline function onControl(number, value) {
    // Called when UI control value changes
    // number: control ID, value: new value
}

// Additional MIDI Callbacks
inline function onNoteOn(noteNumber, velocity) {
    // Alternative signature with direct parameters
}

inline function onNoteOff(noteNumber, velocity) {
    // Alternative signature with direct parameters
}

inline function onController(controllerNumber, controllerValue) {
    // Alternative signature with direct parameters
}
```

## Performance Considerations

According to the [HISE documentation](https://docs.hise.dev/scripting/index.html), JavaScript is slower than compiled C++ code, but it's suitable for:

- **Event handling** (MIDI data, timers every 50ms)
- **UI interactions** and component management
- **Parameter automation** and control
- **Custom GUI interactions**

For performance-critical audio processing, consider:

- Using **Scriptnode** for complex DSP
- **Exporting to C++** for production code
- **Minimizing operations** in audio callbacks
- **Caching component references** instead of repeated lookups
