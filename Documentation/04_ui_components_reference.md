# HISE UI Components Reference

Based on the [official HISE UI Components documentation](https://docs.hise.dev/ui-components/index.html), HISE provides several categories of UI components:

## Plugin Components (Basic UI Elements)

These are the basic UI components you can add to the plugin interface using the Interface Designer:

### ScriptSlider
Knobs, sliders, and faders for parameter control.

**Properties:**
- `mode` - Display mode: "NormalizedPercentage", "Frequency", "Time", "Decibel", "Discrete"
- `min` - Minimum value
- `max` - Maximum value
- `stepSize` - Step size for value changes
- `middlePosition` - Default/middle position
- `suffix` - Unit suffix (e.g., " Hz", " ms", "%")
- `showValuePopup` - Popup position: "Above", "Below", "Left", "Right"
- `showTextBox` - Show text box (0 or 1)
- `style` - Slider style: "Horizontal", "Vertical", "Rotary"
- `dragDirection` - Drag direction: "Horizontal", "Vertical"
- `processorId` - Module ID to control
- `parameterId` - Parameter ID to control
- `isMetaParameter` - Is meta parameter (1 or 0)
- `macroControl` - Macro control number (1-8) or "No MacroControl"

**Methods:**
- `setRange(min, max, stepSize)` - Set value range
- `getRange()` - Get value range
- `setValue(value)` - Set current value
- `getValue()` - Get current value
- `setSliderStyle(style)` - Set slider style
- `getSliderStyle()` - Get slider style
- `setRotaryParameters(startAngle, endAngle, interval)` - Set rotary parameters
- `setTextBoxStyle(textBoxPosition, isReadOnly, textEntryBoxWidth, textEntryBoxHeight)` - Set text box style

### ScriptButton
Toggle buttons and regular buttons.

**Properties:**
- `text` - Button text
- `processorId` - Module ID to control
- `parameterId` - Parameter ID to control
- `isMetaParameter` - Is meta parameter (1 or 0)
- `macroControl` - Macro control number (1-8) or "No MacroControl"

**Methods:**
- `setButtonText(text)` - Set button text
- `getButtonText()` - Get button text
- `setToggleMode(enabled)` - Enable/disable toggle mode
- `isToggleMode()` - Check if toggle mode enabled
- `setRadioGroupId(id)` - Set radio group ID
- `getRadioGroupId()` - Get radio group ID

### ScriptComboBox
Dropdown menus and selection lists.

**Properties:**
- `items` - Items list (newline-separated)
- `max` - Maximum number of items
- `processorId` - Module ID to control
- `parameterId` - Parameter ID to control
- `isPluginParameter` - Expose to DAW automation (1 or 0)
- `saveInPreset` - Save in user presets (0 or 1)

**Methods:**
- `setItems(items)` - Set items (newline-separated)
- `getItems()` - Get items
- `setSelectedItemIndex(index)` - Set selected item
- `getSelectedItemIndex()` - Get selected item index
- `getSelectedItem()` - Get selected item text
- `addItem(text)` - Add item
- `removeItem(index)` - Remove item
- `clear()` - Clear all items

### ScriptLabel
Text labels and displays.

**Properties:**
- `text` - Display text
- `fontName` - Font family name
- `fontSize` - Font size
- `fontStyle` - Font style: "bold", "italic", "normal"
- `textColour` - Text color
- `processorId` - Module ID to control
- `parameterId` - Parameter ID to control

**Methods:**
- `setText(text)` - Set text
- `getText()` - Get text
- `setJustificationType(justification)` - Set text justification
- `getJustificationType()` - Get text justification
- `setEditable(isEditable)` - Make editable
- `isEditable()` - Check if editable
- `setFont(font)` - Set font
- `getFont()` - Get font

### ScriptImage
Image display components.

**Properties:**
- `fileName` - Image file path (supports {PROJECT_FOLDER} macro)
- `offset` - Image offset
- `visible` - Visibility (0 or 1)

**Methods:**
- `setImage(image)` - Set image
- `getImage()` - Get image
- `setImageAlpha(alpha)` - Set image alpha
- `getImageAlpha()` - Get image alpha
- `setInterceptsMouseClicks(allowMouseClicks)` - Set mouse intercept
- `setMouseCursor(cursor)` - Set mouse cursor

### ScriptAudioWaveform
Audio waveform display components.

**Properties:**
- `processorId` - Module ID to display
- `showLines` - Show grid lines (0 or 1)
- `enableRange` - Enable range selection (0 or 1)
- `bgColour` - Background color
- `itemColour` - Waveform color
- `itemColour2` - Secondary waveform color

**Methods:**
- `setAudioFile(file)` - Set audio file
- `getAudioFile()` - Get audio file
- `setRange(start, end)` - Set display range
- `getRange()` - Get display range
- `setZoom(zoom)` - Set zoom level
- `getZoom()` - Get zoom level
- `setPlaybackPosition(position)` - Set playback position
- `getPlaybackPosition()` - Get playback position
- `setShowPlaybackPosition(show)` - Show/hide playback position
- `setShowGrid(show)` - Show/hide grid
- `setGridInterval(interval)` - Set grid interval

## Special Components

### ScriptPanel
Generic scripting panels that can be fully customized with scriptable paint routines, mouse events, and timer callbacks.

**Properties:**
- `text` - Panel title
- `bgColour` - Background color
- `itemColour` - Item color
- `itemColour2` - Secondary item color
- `textColour` - Text color
- `locked` - Locked state (0 or 1)
- `visible` - Visibility (0 or 1)
- `parentComponent` - Parent component ID

**Methods:**
- `setPaintRoutine(routine)` - Set custom paint routine
- `getPaintRoutine()` - Get paint routine
- `setOpaque(isOpaque)` - Set opacity
- `isOpaque()` - Check if opaque
- `setInterceptsMouseClicks(allowMouseClicks, allowMouseUp)` - Set mouse intercept
- `addChildComponent(component)` - Add child component
- `removeChildComponent(component)` - Remove child component
- `removeAllChildren()` - Remove all children

### ScriptFloatingTile
Hard-coded interface elements that provide predefined functionalities like Keyboard, CustomSettings, PresetBrowser, etc.

**Content Types:**
- `"Keyboard"` - MIDI keyboard display
- `"PresetBrowser"` - Preset browser interface
- `"AudioAnalyser"` - Audio analyzer display
- `"FilterDisplay"` - Filter response display
- `"CustomSettings"` - Custom settings panel

**Properties:**
- `ContentType` - Type of floating tile
- `bgColour` - Background color
- `itemColour` - Item color
- `itemColour2` - Secondary item color
- `textColour` - Text color
- `FontSize` - Font size
- `Data` - JSON configuration data
- `parentComponent` - Parent component ID

**Keyboard Data Properties:**
```json
{
  "KeyWidth": 20.0,
  "DisplayOctaveNumber": false,
  "LowKey": 17,
  "HiKey": 127,
  "CustomGraphics": false,
  "DefaultAppearance": true,
  "BlackKeyRatio": 0.7,
  "ToggleMode": false,
  "MidiChannel": 1,
  "UseVectorGraphics": true,
  "UseFlatStyle": false,
  "MPEKeyboard": false,
  "MPEStartChannel": 2,
  "MPEEndChannel": 16
}
```

**PresetBrowser Data Properties:**
```json
{
  "ShowSaveButton": true,
  "ShowExpansionsAsColumn": false,
  "ShowFolderButton": true,
  "ShowNotes": true,
  "ShowEditButtons": true,
  "EditButtonOffset": 10,
  "ShowAddButton": true,
  "ShowRenameButton": true,
  "ShowDeleteButton": true,
  "ShowSearchBar": true,
  "ShowFavoriteIcon": true,
  "FullPathFavorites": false,
  "ButtonsInsideBorder": false,
  "NumColumns": 3,
  "ColumnWidthRatio": [0.333, 0.333, 0.333],
  "ListAreaOffset": [0, 0, 0, 0],
  "ColumnRowPadding": [0, 0, 0, 0]
}
```

**Methods:**
- `setContentType(type)` - Set content type
- `getContentType()` - Get content type
- `setLayoutData(data)` - Set layout data
- `getLayoutData()` - Get layout data
- `setVisible(isVisible)` - Set visibility
- `isVisible()` - Check if visible
- `setOpaque(isOpaque)` - Set opacity
- `isOpaque()` - Check if opaque
- `setInterceptsMouseClicks(allowMouseClicks)` - Set mouse intercept
- `setMouseCursor(cursor)` - Set mouse cursor

## Common Component Properties

All UI components share these common properties:

**Basic Properties:**
- `id` - Component ID
- `type` - Component type
- `x` - X position
- `y` - Y position
- `width` - Width
- `height` - Height
- `text` - Display text/name
- `enabled` - Boolean for mouse event reactivity
- `visible` - Boolean for display/hide
- `tooltip` - Hover text
- `useUndoManager` - Enable undo functionality
- `macroControl` - Connect to macro control (1-8)
- `linkedTo` - Link to another control by ID
- `saveInPreset` - Save in user presets
- `isPluginParameter` - Expose to DAW automation
- `processorId` - Module ID to control
- `parameterId` - Parameter ID to control
- `defaultValue` - Default value
- `parentComponent` - Parent component ID

**Position and Size:**
- `area` - Array [x, y, width, height]

**Colors:**
- `bgColour` - Background color
- `itemColour` - Item color
- `itemColour2` - Secondary item color
- `textColour` - Text color
- `borderColour` - Border color
- `outlineColour` - Outline color

**Font Properties:**
- `fontName` - Font family name
- `fontSize` - Font size
- `fontStyle` - Font style (bold, italic, etc.)

**Component-Specific Properties:**
- `value` - Current value
- `valueNormalized` - Normalized value (0-1)
- `isButtonDown` - Button state
- `isMouseOver` - Mouse over state
- `isMouseDown` - Mouse down state

## Advanced UI Styling



// Apply to all buttons
for (x in Content.getAllComponents("btn*"))
    x.setLocalLookAndFeel(button);
```

### Custom Panel Painting
```javascript

### Film Strip Knobs
```javascript
MyKnob.set("mode", "FilmStrip");
MyKnob.set("filmstripImage", "MyKnobStrip.png");
MyKnob.set("numStrips", 128); // matches knob frames
```

## Graphics Context (g) Methods
When using custom paint routines, the graphics context provides these methods:

**Drawing Methods:**
- `g.fillAll(colour)` - Fill entire area
- `g.fillRect(area)` - Fill rectangle
- `g.fillRoundedRectangle(area, cornerRadius)` - Fill rounded rectangle
- `g.fillEllipse(area)` - Fill ellipse
- `g.drawRect(area, lineThickness)` - Draw rectangle outline
- `g.drawRoundedRectangle(area, cornerRadius, lineThickness)` - Draw rounded rectangle outline
- `g.drawEllipse(area, lineThickness)` - Draw ellipse outline
- `g.drawLine(startX, startY, endX, endY, lineThickness)` - Draw line
- `g.drawText(text, area, justification)` - Draw text
- `g.drawAlignedText(text, area, justification)` - Draw aligned text

**Color and Style:**
- `g.setColour(colour)` - Set drawing color
- `g.setOpacity(alpha)` - Set opacity
- `g.setFont(fontName, fontSize, fontStyle)` - Set font
- `g.setGradientFill(gradient)` - Set gradient fill

**Transformations:**
- `g.addTransform(transform)` - Add transformation
- `g.resetTransform()` - Reset transformations
- `g.rotate(angle, centerX, centerY)` - Rotate around point
- `g.scale(scaleX, scaleY)` - Scale
- `g.translate(deltaX, deltaY)` - Translate

**Utility Methods:**
- `g.getCurrentFont()` - Get current font
- `g.getCurrentColour()` - Get current color
- `g.getClipBounds()` - Get clip bounds
- `g.isClipEmpty()` - Check if clip is empty
- `g.excludeClipRectangle(area)` - Exclude rectangle from clip
- `g.intersectClip(area)` - Intersect clip with rectangle

## Common Use Cases

**Sample Map Management:**
```javascript
const sampleMaps = Sampler.getSampleMapList();
const cmbSampleMap = Content.getComponent("cmbSampleMap");
cmbSampleMap.set("items", sampleMaps.join("\n"));

inline function oncmbSampleMapControl(component, value) {
    Sampler1.asSampler().loadSampleMap(sampleMaps[value]);
}
```

**Keyboard Highlighting:**
```javascript
inline function setKeyColours() {
    for (i = 0; i < 128; i++) {
        Engine.setKeyColour(i, Colours.withAlpha(Colours.black, 0.4));
    }
    
    for (i = 0; i < 128; i++) {
        for (s in samplers) {
            if (s.isNoteNumberMapped(i)) {
                Engine.setKeyColour(i, Colours.withAlpha(Colours.blue, 0.2));
            }
        }
    }
}
```

**Dynamic UI Creation:**
```javascript
const knob = Content.addKnob("MyKnob", 100, 100);
knob.setRange(0, 1, 0.01);
knob.setValue(0.5);
knob.set("text", "My Control");
```

This comprehensive documentation covers all the major aspects of HISE UI development. For the complete and most up-to-date reference, always consult the [official HISE UI Components documentation](https://docs.hise.dev/ui-components/index.html).
