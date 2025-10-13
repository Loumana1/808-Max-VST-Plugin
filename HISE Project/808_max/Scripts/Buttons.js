




namespace Buttons
{
    const button = Content.createLocalLookAndFeel();
    {
        button.registerFunction("drawToggleButton", function(g, obj)
        {
            var a = obj.area;
            var isOn = obj.value > 0.5;
            
            // Modern flat button
            g.setColour(isOn ? 0x66FF0000 : 0xFF070707);
            g.fillRoundedRectangle(a, 4);
            
        
            g.setColour(0xFF000000);
            g.drawRoundedRectangle(a, 4, 1);
            
            // Text
            g.setColour(0xFFFFFFFF);
            g.setFont("Oxygen", 10);
            g.drawAlignedText(obj.text, a, "centred");
        });
        
        // Apply to all buttons
        for (x in Content.getAllComponents("btn*"))
            x.setLocalLookAndFeel(button);
    }


}