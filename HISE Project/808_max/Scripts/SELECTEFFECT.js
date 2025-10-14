namespace SelectEffect
{
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
	const pnlEffectFilter = getAny(["pnlEffectFilter", "pnlFilter"]);
	const pnlEffectSaturation = getAny(["pnlEffectSaturation", "pnlSaturator"]);
	const pnlEffectLFO = getAny(["pnlEffectLFO", "pnlLFO"]);


	// View buttons (only one should be active at a time). Be tolerant of a stray space in the ID.
	const btnEffectViewFilter = getAny(["btnEffectViewFilter "]);
	const btnEffectViewSaturator = getAny(["btnEffectViewSaturator"]);
	const btnEffectViewLFO = getAny(["btnEffectViewLFO"]);


	// ON / OFF buttons (independent from view selection)
	// These are already wired via processorId / parameterId in the UI XML.
	// We only keep references here in case we need them later.
	const btnONFilter = Content.getComponent("btnONFilter");
	const btnONSaturator = Content.getComponent("btnONSaturator");
	const btnONLfo = Content.getComponent("btnONLfo");

	inline function setView(name)
	{
		if (pnlEffectFilter) pnlEffectFilter.set("visible", name == "Filter");
		if (pnlEffectSaturation) pnlEffectSaturation.set("visible", name == "Saturator");
		if (pnlEffectLFO) pnlEffectLFO.set("visible", name == "LFO");		
		if (pnlEffectMB) pnlEffectMB.set("visible", name == "MultiBand");

 
		if (btnEffectViewFilter) btnEffectViewFilter.setValue(name == "Filter" ? 1 : 0);
		if (btnEffectViewSaturator) btnEffectViewSaturator.setValue(name == "Saturator" ? 1 : 0);
		if (btnEffectViewLFO) btnEffectViewLFO.setValue(name == "LFO" ? 1 : 0);
	}
	

	inline function onbtnEffectViewFilterControl(component, value)
	{
		if (value) setView("Filter");
	}

	inline function onbtnEffectViewSaturatorControl(component, value)
	{
		if (value) setView("Saturator");
	}

	inline function onbtnEffectViewLFOControl(component, value)
	{
		if (value) setView("LFO");
	}
	


	// Hook up callbacks if the components exist
	if (btnEffectViewFilter) btnEffectViewFilter.setControlCallback(onbtnEffectViewFilterControl);
	if (btnEffectViewSaturator) btnEffectViewSaturator.setControlCallback(onbtnEffectViewSaturatorControl);
	if (btnEffectViewLFO) btnEffectViewLFO.setControlCallback(onbtnEffectViewLFOControl);


	// Initial view: try to respect current visibility; otherwise default to Saturator
	if (pnlEffectFilter && pnlEffectFilter.get("visible")) setView("Filter");
	else if (pnlEffectSaturation && pnlEffectSaturation.get("visible")) setView("Saturator");
	else if (pnlEffectLFO && pnlEffectLFO.get("visible")) setView("LFO");
	else setView("MultiBand");
	
}


