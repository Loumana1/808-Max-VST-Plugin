#!/bin/bash

# 808 Max VST Plugin - Generate SampleMaps Script
# This script generates XML sample maps for all samples in Samples/808 and Samples/Synth Bass

SAMPLES_808="../Samples/808"
SAMPLES_SYNTH="../Samples/Synth Bass"
SAMPLEMAPS="../SampleMaps"

# Function to create XML sample map
create_xml() {
    local sample_name="$1"
    local category="$2"
    local file_name="$3"
    local xml_file="$SAMPLEMAPS/$sample_name.xml"

    # Only create if it doesn't exist
    if [ -f "$xml_file" ]; then
        echo "[SKIP] $xml_file already exists."
        return
    fi

    # Determine folder for FileName
    local folder="$category"
    if [ "$category" == "808" ]; then
        folder="808"
    else
        folder="Synth Bass"
    fi

    cat > "$xml_file" << EOF
<?xml version="1.0" encoding="UTF-8"?>

<samplemap CrossfadeGamma="1.0" ID="$sample_name" RRGroupAmount="1.0" MicPositions=";"
           SaveMode="0">
  <sample Root="36" LoKey="24" HiKey="60" LoVel="0" HiVel="127" RRGroup="1"
          FileName="{PROJECT_FOLDER}$folder/$file_name"
          Duplicate="1" SampleStart="0" SampleEnd="300000" SampleRate="48000.0"/>
</samplemap>
EOF
    echo "[OK] Created $xml_file"
}

# Process 808 samples
for f in "$SAMPLES_808"/*.wav "$SAMPLES_808"/*.aif; do
    [ -e "$f" ] || continue
    base=$(basename "$f")
    name="${base%.*}"
    create_xml "$name" "808" "$base"
done

# Process Synth Bass samples
for f in "$SAMPLES_SYNTH"/*.wav "$SAMPLES_SYNTH"/*.aif; do
    [ -e "$f" ] || continue
    base=$(basename "$f")
    name="${base%.*}"
    create_xml "$name" "Synth Bass" "$base"
done

echo "Done generating sample maps." 