template <int NumVoices> struct snex_shaper2
{
	SNEX_NODE(snex_shaper2);
	float drive = 10.5;
	float mix = 0.8;
	float outputGain = 0.9;
	
	// Implement the Waveshaper here...
	
	inline float fastTanh(float x)
		{
			if (x < -3.0f)
				return -1.0f;
			if (x > 3.0f)
				return 1.0f;
	
			float x2 = x * x;
			return x * (27.0f + x2) / (27.0f + 9.0f * x2);
		}
	
	float getSample(float input)
	{
		float driven = input * drive;
		float shaped = fastTanh(driven);
		return mix * shaped + (1.0f - mix) * input;
	}
	
	// These functions are the glue code that call the function above
	template <typename T> void process(T& data)
	{
		for(auto ch: data)
		{
			for(auto& s: data.toChannelData(ch))
			{
				s = getSample(s);
			}
		}
	}
	template <typename T> void processFrame(T& data)
	{
		for(auto& s: data)
			s = getSample(s);
	}
	void reset()
	{
		
	}
	void prepare(PrepareSpecs ps)
	{
		
	}
	
	void setExternalData(const ExternalData& d, int index)
	{
	}
	template <int P> void setParameter(double v)
	{
	if (P == 0)
		drive = v;

	}
};


function prepareToPlay(sampleRate, blockSize)
{
	
}
 function processBlock(channels)
{
	
}
 function onControl(number, value)
{
	
}
 