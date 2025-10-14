namespace WaveformView
{
////---------------------------Morphball setup ----------------------///
    const var sh = Content.createShader("bunny.glsl");

const var Sampler1 = Synth.getChildSynth("Sampler1");

const  p = Content.addPanel("Panel1", 0, 0);

p.data.l == 0.0;


p.setPaintRoutine(function(g)
{
	g.applyShader(sh, this.getLocalBounds(0));
});

p.setTimerCallback(function()
{
	var l = 4.0 * Sampler1.getCurrentLevel(true);
	
	if(l > this.data.l)
		this.data.l = l;
	else
		this.data.l *= 0.8;
	

	sh.setUniformData("amp", this.data.l);
	this.repaint();
});

p.startTimer(15);



//-------------------------------- Switch between Waveform View and Sample View --------------------------------

	inline function getAny(ids)
	{
		for (i in ids)
		{
			local c = Content.getComponent(i);
			if (c) return c;
		}
		return undefined;
	}

	// Panels (support both wrapper IDs and legacy IDs)
	const pnlSampleVisualisation = getAny(["pnlSampleVisualisation", "pnlSample"]);
	const pnlMorphVisualisation = getAny(["pnlMorphVisualisation", "pnlMorph"]);
	const pnlAnalyserVisualistion = getAny(["pnlAnalyserVisualistion", "pnlAnalyser"]);

	// View buttons (only one should be active at a time)
	const btnWaveformViewSphere = Content.getComponent("btnWaveformViewSphere");
	const btnWaveformViewSample = Content.getComponent("btnWaveformViewSample");
	const btnWaveformViewAnalyser = Content.getComponent("btnWaveformViewAnalyser");

	inline function setView(name)
	{
		if (pnlSampleVisualisation) pnlSampleVisualisation.set("visible", name == "Sample");
		if (pnlMorphVisualisation) pnlMorphVisualisation.set("visible", name == "Sphere");
		if (pnlAnalyserVisualistion) pnlAnalyserVisualistion.set("visible", name == "Analyser");

		if (btnWaveformViewSphere) btnWaveformViewSphere.setValue(name == "Sphere" ? 1 : 0);
		if (btnWaveformViewSample) btnWaveformViewSample.setValue(name == "Sample" ? 1 : 0);
		if (btnWaveformViewAnalyser) btnWaveformViewAnalyser.setValue(name == "Analyser" ? 1 : 0);
	}

	inline function onbtnWaveformViewSphereControl(component, value)
	{
		if (value) setView("Sphere");
	}

	inline function onbtnWaveformViewSampleControl(component, value)
	{
		if (value) setView("Sample");
	}

	inline function onbtnWaveformViewAnalyserControl(component, value)
	{
		if (value) setView("Analyser");
	}

	// Hook up callbacks if the components exist
	if (btnWaveformViewSphere) btnWaveformViewSphere.setControlCallback(onbtnWaveformViewSphereControl);
	if (btnWaveformViewSample) btnWaveformViewSample.setControlCallback(onbtnWaveformViewSampleControl);
	if (btnWaveformViewAnalyser) btnWaveformViewAnalyser.setControlCallback(onbtnWaveformViewAnalyserControl);

	// Initial view: try to respect current visibility; otherwise default to Sample
	if (pnlAnalyserVisualistion && pnlAnalyserVisualistion.get("visible")) setView("Analyser");
	else if (pnlMorphVisualisation && pnlMorphVisualisation.get("visible")) setView("Sphere");
	else if (pnlSampleVisualisation && pnlSampleVisualisation.get("visible")) setView("Sample");
	else setView("Sample");


    //===================== REVERSE Buttons =================//


    // Get references to the buttons
    const var btnReverseState = Content.getComponent("btnWaveformPlaybackReverse");




	btnReverseState.set("processorId"  , "Sampler1");			
	btnReverseState.set("parameterId"  , "Reversed");




// Reverse Button
inline function onbtnReverseControl(component, value)
{
    if (value)
    {
       
        btnReverseState.setValue(1);
        Sampler1.setAttribute(Sampler1.Reversed, true);
     
    }else{
	    Sampler1.setAttribute(Sampler1.Normal, true);
    }
}


	Content.getComponent("btnWaveformPlaybackReverse").setControlCallback(onbtnReverseControl);


}

