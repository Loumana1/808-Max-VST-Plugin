namespace Panels
{
    const panelIds = ["pnlFilter", "pnlLFO", "pnlLOGO", "pnlWaveform", "pnlSaturator"];

    // Define the paint routine once with dimming support
    const panelPaintRoutine = function(g) {
        var a = this.getLocalBounds(0);
        
        // Simple panel background - dimming is handled by overlay panels
        g.setColour(0xFF1A1A1A );
        g.fillRoundedRectangle(a, 4);
        
        // Panel border
        g.setColour(0xFF070707 );
        g.drawRoundedRectangle(a, 14, 14);
    };

    // Define a separate paint routine for main background panels
    const mainPanelPaintRoutine = function(g) {
        var a = this.getLocalBounds(0);
        
        // Fill with darker shade of gray for main background panels
        g.setColour(0xFF0A0A0A );
        g.fillRoundedRectangle(a, 4);
        
        // Subtle border
        g.setColour(0xFF2D2D2D);
        g.drawRoundedRectangle(a, 4, 2);
    };

    // Apply the paint routine to all panels
    for (var i = 0; i < panelIds.length; i++) {
        var pnlload = Content.getComponent(panelIds[i]);

        if (pnlload) {
            pnlload.setPaintRoutine(panelPaintRoutine);
        }
    }

    // Apply the main background panel paint routine to pnlMain and pnlSamples
    const mainPanelComponent = Content.getComponent("pnlMain");
    const samplesPanelComponent = Content.getComponent("pnlSamples");

    if (mainPanelComponent) {
        mainPanelComponent.setPaintRoutine(mainPanelPaintRoutine);
    }

    if (samplesPanelComponent) {
        samplesPanelComponent.setPaintRoutine(mainPanelPaintRoutine);
    }






// ------------------------- Multi-Window Panel Setup --------------------;


// Add tab buttons
const btnSamples = Content.getComponent("btnSamples");

const btnMain = Content.getComponent("btnMain");


// Show/hide logic

inline function showPanel(name)
{
    samplesPanelComponent.set("visible", name == "Samples");
    mainPanelComponent.set("visible", name == "Main");
    btnSamples.setValue(name == "Samples" ? 1 : 0);
    btnMain.setValue(name == "Main" ? 1 : 0);

}

inline function onbtnSamplesControl(component, value)
{
    if (value) // Only switch if not already active
    {
        showPanel("Samples");
        btnSamples.setValue(1);
        btnMain.setValue(0);
    }
}

inline function onbtnMainControl(component, value)
{
    if (value)
    {
        showPanel("Main");
        btnMain.setValue(1);
        btnSamples.setValue(0);
    }
}

// Use setAttribute instead of direct callback to avoid network parameter conflicts
btnSamples.set("processorId", "Interface");
btnSamples.set("parameterId", "SamplesView");
btnMain.set("processorId", "Interface");
btnMain.set("parameterId", "MainView");

// Initialize with Main panel visible
showPanel("Main");

// --- End Multi-Window Panel Setup ---

btnMain.setControlCallback(onbtnMainControl);
btnSamples.setControlCallback(onbtnSamplesControl);



// ====================== TEXT LABEL STYLING ====================== //

// Get all lblHead components and style them
for (x in Content.getAllComponents("lblHead*"))
{
    x.set("textColour", 0xFFFFFFFF); // White color
    x.set("fontName", "Arial");
    x.set("fontSize", 16);
    x.set("fontStyle", "Bold");
}

// Get all lblTitle components and style them  
for (x in Content.getAllComponents("lblTitle*"))
{
    x.set("textColour", 0xFFB0B0B0); // Gray color
    x.set("fontName", "Arial");
    x.set("fontSize", 11);
    x.set("fontStyle", "bold");
}

}