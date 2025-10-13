template <int NumVoices> struct snex_shaper
{
	SNEX_NODE(snex_shaper);
	
	static const int NUM_CHANNELS = 2;
	
	// SNEX has a special float object that handles automatic smoothing
	// they are stateful, so we need two of them for stereo operations
	span<sfloat, NUM_CHANNELS> k;
	
	float getSample(float input, float ck)
	{
		return (1.0f + ck) * input / (1.0f + ck * Math.abs(input));
	}
	
	
	template <typename T> void process(T& data)
	{
		const int numChannels = Math.min(data.getNumChannels(), NUM_CHANNELS);
		
		for(int i = 0; i < numChannels; i++)
		{
			for(auto& s: data[i])
			{
				s = getSample(s, k[i].advance());
			}
		}
		

	}
	template <typename T> void processFrame(T& data)
	{
		int i = 0;

		for(auto& s: data)
			s = getSample(s, k[i++].advance());
	}
	void reset()
	{
		// this resets the smoothing and will be called when there
		// needs to be a reininitialisation in the signal stream
		for(auto& ck: k)
			ck.reset();
	}
	
	void prepare(PrepareSpecs ps)
	{
		// change 1000 to 50 for a normal smoothing
		// I set it to 1s fade time so you can clearly hear it in action
		const double SMOOTHING_TIME = 1000.0;
		
		for(auto& ck: k)
			ck.prepare(ps.sampleRate, SMOOTHING_TIME);
	}
	
	void setExternalData(const ExternalData& d, int index)
	{
	}
	
	template <int P> void setParameter(double v)
	{
		if(P == 0)
		{
			const auto s = Math.min((float)v, 0.999f);					
			const auto nk = 2.0f * s / (1.0f - s);
			
			for(auto& ck: k)
				ck.set(nk);
		}
	}
};