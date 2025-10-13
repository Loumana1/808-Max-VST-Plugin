namespace Keyboard
{


const samplerIds = Synth.getIdList("Sampler");
const samplers = [];

for (id in samplerIds)
    samplers.push(Synth.getSampler(id));

// Configuration du panneau de préchargement
const pnlPreload = Content.getComponent("pnlPreload");

// Callback de chargement
pnlPreload.setLoadingCallback(function(isPreloading)
{
    if (!isPreloading)
        setKeyColours(); 
});

//Function
inline function setKeyColours()
{
    for (i = 0; i < 128; i++)
        Engine.setKeyColour(i, Colours.withAlpha(Colours.black, 0.4));

    for (i = 0; i < 128; i++)
    {
        for (s in samplers) 
        {
            if (s.isNoteNumberMapped(i))
                Engine.setKeyColour(i, Colours.withAlpha(Colours.blue, 0.2));
        }
    }
}
}