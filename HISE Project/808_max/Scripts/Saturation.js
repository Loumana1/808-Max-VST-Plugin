// ========Saturation Controls -----------------------
namespace Saturation
{
    

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
}