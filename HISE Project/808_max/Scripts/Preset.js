namespace Preset
{

  //====================== TOP BAR QUICK Presets DROP DOWN =====================//


// EFFECT
const Sampler1 = Synth.getChildSynth("Sampler1");

// Liste des sample maps disponibles dans le sampler
const sampleMaps = Sampler.getSampleMapList();
const cmbSampleMap = Content.getComponent("cmbSampleMap");

// Remplit la liste déroulante avec les noms des sample maps
cmbSampleMap.set("items", sampleMaps.join("\n"));

// CALLBACK POUR LA LISTE DÉROULANTE
inline function oncmbSampleMapControl(component, value) 
{
    Sampler1.asSampler().loadSampleMap(sampleMaps[value-1]);
}

Content.getComponent("cmbSampleMap").setControlCallback(oncmbSampleMapControl);
}



// =========================== MAIN PRESET WINDOW SET ===================//

