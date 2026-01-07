@echo off
streamlit run ui.py
if exist users.json del users.json
pause
