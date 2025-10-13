template <int NumVoices> struct Overdrive
{
    SNEX_NODE(Overdrive);
    
    static const int NUM_CHANNELS = 2;
    
    span<sfloat, NUM_CHANNELS> drive;
    span<sfloat, NUM_CHANNELS> tone;
    span<float, NUM_CHANNELS> lastSample;
    
    float getSample(float input)
    {
        float driveAmount = drive[0].getCurrentValue();
        float toneValue = tone[0].getCurrentValue();
        
        // Pre-gain stage
        float x = input * (1.0f + driveAmount * 4.0f);
        
        // Simple waveshaping using polynomial soft clipping
        // This is a basic x/(1+|x|) soft clipper
        float absX = Math.abs(x);
        x = x / (1.0f + absX);
        
        // Apply tone control (lowpass filter)
        float toneCoeff = 0.1f + toneValue * 0.8f;
        lastSample[0] = lastSample[0] + toneCoeff * (x - lastSample[0]);
        
        // Mix between direct and filtered signal
        x = x * (1.0f - toneValue) + lastSample[0] * toneValue;
        
        // Output gain compensation
        return x * (0.7f / (1.0f + driveAmount));
    }
    
    void prepare(PrepareSpecs ps)
    {
        const double SMOOTHING_TIME = 50.0;
        
        for(auto& d: drive)
            d.prepare(ps.sampleRate, SMOOTHING_TIME);
        for(auto& t: tone)
            t.prepare(ps.sampleRate, SMOOTHING_TIME);
            
        reset();
    }
    
    void reset()
    {
        for(auto& d: drive)
            d.reset();
        for(auto& t: tone)
            t.reset();
        for(auto& ls: lastSample)
            ls = 0.0f;
    }
    
    void setExternalData(const ExternalData& d, int index)
    {
    }
    
    template <int P> void setParameter(double v)
    {
        if(P == 0)
        {
            const auto driveValue = Math.min((float)v, 0.999f);
            for(auto& d: drive)
                d.set(driveValue);
        }
        else if(P == 1)
        {
            const auto toneValue = Math.min((float)v, 0.999f);
            for(auto& t: tone)
                t.set(toneValue);
        }
    }
};