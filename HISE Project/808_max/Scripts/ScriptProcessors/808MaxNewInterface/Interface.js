Content.makeFrontInterface(1200, 800);

const var dsp = Engine.createDspNetwork("Saturationshaper");
if (dsp)
    dsp.setForwardControlsToParameters(false);

include("Buttons.js");
include("Panels.js");
include("Preset.js");
include("LookAndFeel.js");
include("SELECTEFFECT.js");
include ("WaveformView.js");

//Laod 




// ================= ====================808 Library Browser =================================
// Panel inside the viewport that will contain list rows

// Sampler reference
const var Sampler1 = Synth.getChildSynth("Sampler1");

/** Dynamic List example

    This example snippet shows the usage of the new addChildPanel() function
    in order to implement a dynamic list of items that are aligned vertically
    (like the list items in a viewport).

    The text from the label will be used as data for each row. Just enter some
    text and press the Add Item button and it will create a new row.
    
    Each row has a close button on the right that will remove the item.
    
    This example can be used as starting point for any kind of dynamic list
    (eg. file browser, custom preset browser, etc).
*/

// This is the canvas for the list items. It's placed in a viewport and will
// be dynamically resized to match the height of the list.
const var Panel1 = Content.getComponent("pnl808ListViewort");

const var Label1 = Content.getComponent("lblHead808Selection");



// Liste des sample maps disponibles dans le sampler
const sampleMaps = Sampler.getSampleMapList();



// This array will contain all list items. It's important to store the child
// panels in a variable or array because they will be deleted when they are
// not referenced anymore
const var list = [];

Panel1.setPaintRoutine(function(g)
{
	g.fillAll(0xFF444444);
});

const var lineHeight = 30;

// Selection state tracking
var selectedRowIndex = -1;

/** This function will be called whenever the list item changes. */
inline function updateList()
{
    Panel1.set("height", list.length * lineHeight);
    
    local y = 0;
    
    for(c in list)
    {
        c.set("y", y);
        y += lineHeight;
    }
}





inline function createRow(text, index)
{
    local p = Panel1.addChildPanel();
    p.data.text = text;
    p.data.index = index;  // Store the sample map index
    p.data.hover = false;  // Track hover state
    
    // We'll place it inside the panel. The y-position will get updated with 
    // updateList later on, but the other values will remain the same
    p.setPosition(0, list.length * lineHeight, Panel1.getWidth(), lineHeight);
    
    // Create clickable area as child panel
    local clickArea = p.addChildPanel();
    p.data.clickArea = clickArea;  // Store reference
    
    // Position clickable area to fill the row
    clickArea.setPosition(0, 0, p.getWidth(), lineHeight);
    
    // Enable hover and click callbacks
    clickArea.set("allowCallbacks", "Clicks & Hover");
    
    // Click and hover handler
    clickArea.setMouseCallback(function(event)
    {
        // Update hover state
        this.getParentPanel().data.hover = event.hover;
        
        if (event.clicked)
        {
            // Update selection
            selectedRowIndex = this.getParentPanel().data.index;
            
            // Load the sample map using the correct index
            Sampler1.asSampler().loadSampleMap(sampleMaps[this.getParentPanel().data.index]);
            
            // Repaint all rows to update visual selection
            for (row in list)
                row.repaint();
                
            Console.print("Selected and loaded: " + sampleMaps[this.getParentPanel().data.index]);
        }
        
        // Repaint for hover effect
        this.getParentPanel().repaint();
    });
    
    // Paint routine for the row
    p.setPaintRoutine(function(g)
    {
        var a = [0, 0, this.getWidth(), this.getHeight() - 1];
        
        // Different colors for selected vs unselected vs hover
        if (this.data.index == selectedRowIndex)
        {
            // Selected row - highlighted background
            g.setColour(0xFF000000);
            g.fillRect(a);
            g.setColour(0xFFFFFFFF);  // White border for selected
            g.drawRect(a, 2);
        }
        else if (this.data.hover)
        {
            // Hover state - subtle highlight
            g.setColour(0xFF444444);
            g.fillRect(a);
            g.setColour(0x88FFFFFF);
            g.drawRect(a, 1);
        }
        else
        {
            // Normal state
            g.setColour(0x44FFFFFF);
            g.drawRect(a, 1);
        }
        
        g.setFont("Oxygen", 16.0);
        g.setColour(this.data.index == selectedRowIndex ? 0xFFFFFFFF : 
                   this.data.hover ? 0xDDFFFFFF : 0x88FFFFFF);
        a[0] += 10;
        
        g.drawAlignedText(this.data.text, a, "left"); 
    });

    // add the row to the array so it will be referenced
    list.push(p);
    updateList();
}

// on initialisation there will be no rows, so we'll set the height to zero.
Panel1.set("height", 0);

sampleMaps.map(function(element,index)
{
	createRow(element, index);  // Pass the index to createRow
});
		
		    



// Clean the list from all elements 
/*
inline function ontestCleanControl(component, value)
{
	if(value){
		Panel1.set("height", 0);
	}
}
Content.getComponent("testClean").setControlCallback(ontestCleanControl);
*/

// ================= ======================== End 808 Library Browser =================




// ------------------------------- Saturation combobox dropdown ------------------//

const knbSaturator= Content.getComponent("knbSaturator");
const saturator = Synth.getEffect("SaturatorTape");

const cmbSaturation = Content.getComponent("cmbSaturation");
const saturationTypes = [
    "Tape Saturation",
    "Overdrive", 
    "Tube Saturation",
    "Transistor",
    "Distortion (hard clip)"
];
cmbSaturation.set("items", saturationTypes.join("\n"));
knbSaturator.setRange(0, 1, 0.01);
knbSaturator.setValue(0.0);

var currentSaturationType = 0;




function onNoteOn()
{
	
}
 function onNoteOff()
{
	
}
 function onController()
{
	
}
 function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 