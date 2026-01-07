@echo off
REM Get the directory of this script
set DIR=%~dp0

REM Run the UI using streamlit
streamlit run "%DIR%ui.py"
pause
