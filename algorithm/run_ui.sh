#!/bin/bash
# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Run the UI using streamlit
streamlit run "$DIR/ui.py"
