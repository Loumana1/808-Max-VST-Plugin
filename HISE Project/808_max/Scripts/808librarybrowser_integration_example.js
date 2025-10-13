// Example of how to integrate the 808 Library Browser into your main interface
// Add this to your main Interface.js file or create appropriate UI components

// Include the 808 browser script
include("808librarybrowser.js");

// Example button to show/hide the 808 browser
const var btn808Browser = Content.getComponent("btn808Browser");

// Panel to contain the browser (this should be a viewport in your UI)
const var pnl808BrowserContainer = Content.getComponent("pnl808BrowserContainer");

// Toggle browser visibility
inline function onbtn808BrowserControl(component, value)
{
    if (pnl808BrowserContainer)
    {
        pnl808BrowserContainer.set("visible", value);
    }
    
    if (value)
    {
        // Refresh the browser when opened
        Library808Browser.refresh();
    }
}

// Set up the callback if button exists
if (btn808Browser)
{
    btn808Browser.setControlCallback(onbtn808BrowserControl);
}

// Example of how to get the currently selected sample
inline function getCurrentSelected808()
{
    return Library808Browser.getSelectedSample();
}

/* 
UI SETUP REQUIREMENTS:

To use this 808 browser, you need to add these components to your interface:

1. A Viewport component named "Viewport808Browser" 
   - This will contain the scrollable list
   - Set appropriate width/height (e.g., 350x250)

2. A Panel component named "Panel808List" inside the viewport
   - This is where the dynamic list items will be created
   - Initial size doesn't matter as it will be resized dynamically

3. Optional: A Button component named "btn808Browser" 
   - To show/hide the browser
   - Set as toggle button

4. Optional: A Panel component named "pnl808BrowserContainer"
   - To contain the entire browser interface
   - Can be shown/hidden as needed

STYLING RECOMMENDATIONS (following your minimalistic preference):
- Use dark background colors (0xFF2A2A2A)
- Subtle borders and highlights
- Clean typography with Arial or similar fonts
- Reduced color saturation as per your preference
- Simple hover states with minimal visual feedback
*/
