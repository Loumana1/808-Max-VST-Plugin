#!/bin/bash

# 808 Max VST Plugin - Copy and Rename Samples Script
# This script copies samples from Audio Assets and renames them properly

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Project paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SAMPLES_DIR="$PROJECT_ROOT/Samples"
AUDIO_ASSETS_DIR="$(cd "$PROJECT_ROOT/../../Audio Assets/August samples" && pwd)"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

print_category() {
    echo -e "${PURPLE}[CATEGORY]${NC} $1"
}

# Function to clean filename (remove special characters and unwanted words)
clean_filename() {
    local filename="$1"
    
    # Remove file extension first
    local name=$(basename "$filename" .wav)
    name=$(basename "$name" .aif)
    
    # Remove special characters and replace with spaces
    name=$(echo "$name" | sed 's/[^a-zA-Z0-9 ]/ /g')
    
    # Remove unwanted words (808, bass, synth, etc.)
    name=$(echo "$name" | sed -E 's/(^| )([sS][yY][nN][tT][hH]|[bB][aA][sS][sS]|808)( |$)/ /g')
    
    # Remove extra spaces and trim
    name=$(echo "$name" | sed 's/  */ /g' | sed 's/^ *//' | sed 's/ *$//')
    
    echo "$name"
}

# Function to categorize samples based on filename
categorize_sample() {
    local filename="$1"
    local lower_filename=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
    
    # 808 samples patterns
    if [[ "$lower_filename" =~ 808 ]] || [[ "$lower_filename" =~ "uz!" ]] || [[ "$lower_filename" =~ "type sh!t" ]] || \
       [[ "$lower_filename" =~ "r5" ]] || [[ "$lower_filename" =~ "amp" ]] || [[ "$lower_filename" =~ "@meh" ]] || \
       [[ "$lower_filename" =~ "omgronny" ]] || [[ "$lower_filename" =~ "rku" ]] || [[ "$lower_filename" =~ "abti" ]] || \
       [[ "$lower_filename" =~ "abn" ]] || [[ "$lower_filename" =~ "os_" ]] || [[ "$lower_filename" =~ "murda" ]] || \
       [[ "$lower_filename" =~ "pvlace" ]] || [[ "$lower_filename" =~ "sh \[808\]" ]] || [[ "$lower_filename" =~ "@wavey" ]] || \
       [[ "$lower_filename" =~ "tyler 808" ]] || [[ "$lower_filename" =~ "couch" ]] || [[ "$lower_filename" =~ "she" ]] || \
       [[ "$lower_filename" =~ "domo23" ]] || [[ "$lower_filename" =~ "bnyx" ]] || [[ "$lower_filename" =~ "ski mask" ]] || \
       [[ "$lower_filename" =~ "danny brown" ]] || [[ "$lower_filename" =~ "teejayx6" ]] || [[ "$lower_filename" =~ "rico nasty" ]] || \
       [[ "$lower_filename" =~ "sub 808" ]] || [[ "$lower_filename" =~ "pep 808" ]] || [[ "$lower_filename" =~ "pong 808" ]] || \
       [[ "$lower_filename" =~ "bulk 808" ]] || [[ "$lower_filename" =~ "sry" ]] || [[ "$lower_filename" =~ "womb 808" ]] || \
       [[ "$lower_filename" =~ "wrist 808" ]] || [[ "$lower_filename" =~ "metro boomin" ]] || [[ "$lower_filename" =~ "sign 808" ]] || \
       [[ "$lower_filename" =~ "fuego" ]] || [[ "$lower_filename" =~ "beej" ]] || [[ "$lower_filename" =~ "os_gh" ]] || \
       [[ "$lower_filename" =~ "sway purpleflame" ]] || [[ "$lower_filename" =~ "blow 808" ]]; then
        echo "808"
    
    # Synth Bass samples patterns
    elif [[ "$lower_filename" =~ "bass" ]] || [[ "$lower_filename" =~ "synth" ]] || [[ "$lower_filename" =~ "reese" ]] || \
         [[ "$lower_filename" =~ "jupiter" ]] || [[ "$lower_filename" =~ "e7" ]] || [[ "$lower_filename" =~ "moog" ]] || \
         [[ "$lower_filename" =~ "tsp_noisia" ]] || [[ "$lower_filename" =~ "tp_ukd" ]] || [[ "$lower_filename" =~ "wa " ]] || \
         [[ "$lower_filename" =~ "pmbt" ]] || [[ "$lower_filename" =~ "reggae" ]] || [[ "$lower_filename" =~ "bndlz" ]] || \
         [[ "$lower_filename" =~ "nd bass" ]] || [[ "$lower_filename" =~ "sway rusty" ]] || [[ "$lower_filename" =~ "sway memphis" ]] || \
         [[ "$lower_filename" =~ "lofi" ]] || [[ "$lower_filename" =~ "collateral damage" ]] || [[ "$lower_filename" =~ "womb bass" ]] || \
         [[ "$lower_filename" =~ "boxer stab" ]] || [[ "$lower_filename" =~ "rae bass" ]] || [[ "$lower_filename" =~ "krne" ]] || \
         [[ "$lower_filename" =~ "death stab" ]] || [[ "$lower_filename" =~ "death rainbow" ]] || [[ "$lower_filename" =~ "likeiloveyou" ]] || \
         [[ "$lower_filename" =~ "acbass" ]] || [[ "$lower_filename" =~ "runner" ]] || [[ "$lower_filename" =~ "prisoner" ]] || \
         [[ "$lower_filename" =~ "ye bass" ]]; then
        echo "Synth Bass"
    
    # Default to 808 if unsure
    else
        echo "808"
    fi
}

# Function to process a single sample
process_sample() {
    local source_file="$1"
    local filename=$(basename "$source_file")
    
    # Categorize the sample
    local category=$(categorize_sample "$filename")
    print_category "Categorized '$filename' as $category"
    
    # Clean and format the sample name
    local clean_name=$(clean_filename "$filename")
    
    # Add category prefix
    if [[ "$category" == "808" ]]; then
        clean_name="808 - $clean_name"
    elif [[ "$category" == "Synth Bass" ]]; then
        clean_name="Synth bass - $clean_name"
    fi
    
    # Add file extension
    local extension=$(echo "$filename" | sed 's/.*\.//')
    if [[ "$extension" == "aif" ]]; then
        clean_name="$clean_name.aif"
    else
        clean_name="$clean_name.wav"
    fi
    
    # Create category directory if it doesn't exist
    local category_dir="$SAMPLES_DIR/$category"
    if [ ! -d "$category_dir" ]; then
        mkdir -p "$category_dir"
        print_status "Created category directory: $category"
    fi
    
    # Copy file to samples directory
    local dest_file="$category_dir/$clean_name"
    if [ ! -f "$dest_file" ]; then
        cp "$source_file" "$dest_file"
        print_status "Copied: $clean_name"
        return 0
    else
        print_warning "Sample already exists: $clean_name"
        return 1
    fi
}

# Function to process all samples
process_all_samples() {
    print_header "Copying and Renaming Samples from Audio Assets"
    
    if [ ! -d "$AUDIO_ASSETS_DIR" ]; then
        print_error "Audio Assets directory not found: $AUDIO_ASSETS_DIR"
        exit 1
    fi
    
    local total_files=0
    local processed_files=0
    local skipped_files=0
    
    # Process WAV files
    for file in "$AUDIO_ASSETS_DIR"/*.wav; do
        if [ -f "$file" ]; then
            ((total_files++))
            if process_sample "$file"; then
                ((processed_files++))
            else
                ((skipped_files++))
            fi
        fi
    done
    
    # Process AIF files
    for file in "$AUDIO_ASSETS_DIR"/*.aif; do
        if [ -f "$file" ]; then
            ((total_files++))
            if process_sample "$file"; then
                ((processed_files++))
            else
                ((skipped_files++))
            fi
        fi
    done
    
    print_header "Processing Complete"
    echo "Total files found: $total_files"
    echo "Files processed: $processed_files"
    echo "Files skipped: $skipped_files"
}

# Function to show sample statistics
show_stats() {
    print_header "Sample Statistics"
    
    local total_samples=0
    
    # Count 808 samples
    if [ -d "$SAMPLES_DIR/808" ]; then
        local count_808=$(find "$SAMPLES_DIR/808" -name "*.wav" -o -name "*.aif" | wc -l)
        echo "808 samples: $count_808"
        total_samples=$((total_samples + count_808))
    fi
    
    # Count Synth Bass samples
    if [ -d "$SAMPLES_DIR/Synth Bass" ]; then
        local count_synth=$(find "$SAMPLES_DIR/Synth Bass" -name "*.wav" -o -name "*.aif" | wc -l)
        echo "Synth Bass samples: $count_synth"
        total_samples=$((total_samples + count_synth))
    fi
    
    echo "Total samples: $total_samples"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  process    Copy and rename all samples from Audio Assets"
    echo "  stats      Show sample statistics"
    echo "  help       Show this help message"
    echo ""
    echo "This script will:"
    echo "  1. Copy samples from Audio Assets/August samples"
    echo "  2. Categorize samples as '808' or 'Synth Bass'"
    echo "  3. Clean filenames (remove special characters)"
    echo "  4. Rename with proper format: '808 - name.wav' or 'Synth bass - name.wav'"
    echo "  5. Copy to appropriate directories"
}

# Main script logic
case "$1" in
    "process")
        process_all_samples
        ;;
    "stats")
        show_stats
        ;;
    "help"|"--help"|"-h")
        show_usage
        ;;
    *)
        print_header "808 Max Sample Copy and Rename Tool"
        echo "Use '$0 help' for usage information"
        echo ""
        show_stats
        ;;
esac 