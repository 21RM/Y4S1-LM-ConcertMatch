import streamlit as st
import json
import pandas as pd
import generate_data
import match_users

st.set_page_config(page_title="ConcertMatch Algorithm Debugger", layout="wide")

st.title("ConcertMatch Algorithm")

# --- DATA GENERATION ---
st.sidebar.header("Data Generation")
num_users = st.sidebar.number_input("Number of Users", min_value=10, max_value=100000, value=50, step=10)

if st.sidebar.button("Generate New Dataset"):
    with st.spinner("Generating users..."):
        users = generate_data.generate_dataset(num_users=num_users)
    st.sidebar.success(f"Generated {len(users)} users!")
    st.rerun()

# --- MATCHING ---
st.header("Match Inspector")

try:
    with open(match_users.INPUT_FILE, "r") as f:
        users = json.load(f)
except FileNotFoundError:
    st.warning("No user data found. Please generate a dataset using the sidebar.")
    st.stop()

# User Selection
user_options = {u["name"]: u["id"] for u in users}
selected_name = st.selectbox("Select Target User", options=list(user_options.keys()))
selected_id = user_options[selected_name]

if selected_id:
    target_user, matches = match_users.find_matches_data(selected_id, users_data=users)
    
    if target_user:
        # Display Target Stats
        col1, col2, col3 = st.columns(3)
        with col1:
            st.subheader("Target User")
            st.metric("Name", target_user["name"])
            st.text(f"From {target_user['location']['city_u']}")
        
        with col2:
            st.caption("Top Artists")
            st.write(", ".join(target_user["stats"]["top_artists"]))
            
        with col3:
            st.caption("Top Genres")
            st.write(", ".join(target_user["stats"]["top_genres"]))

        st.divider()
        
        # Display Matches
        st.subheader("Top Matches")
        
        match_data = []
        for m in matches: # Show all matches
            u = m["user"]
            shared_artists = set(target_user["stats"]["top_artists"]).intersection(set(u["stats"]["top_artists"]))
            shared_genres = set(target_user["stats"]["top_genres"]).intersection(set(u["stats"]["top_genres"]))
            
            match_data.append({
                "Rank": len(match_data) + 1,
                "Name": u["name"],
                "City": u["location"]["city_u"],
                "Music Match %": m['music_score'] * 100,
                "True Match %": m['true_match_score'] * 100,
                "Distance": m['distance_km'],
                "Shared Artists": ", ".join(shared_artists) if shared_artists else "-",
                "Shared Genres": ", ".join(shared_genres) if shared_genres else "-"
            })
            
        df = pd.DataFrame(match_data)
        st.dataframe(
            df,
            hide_index=True,
            column_config={
                "Name": st.column_config.TextColumn(width="medium"),
                "City": st.column_config.TextColumn(width="small"),
                "Music Match %": st.column_config.NumberColumn(format="%.1f%%", width="small"),
                "True Match %": st.column_config.NumberColumn(format="%.1f%%", width="small"),
                "Distance": st.column_config.NumberColumn(format="%.1f km", width="small"),
                "Shared Artists": st.column_config.TextColumn(width="large"),
                "Shared Genres": st.column_config.TextColumn(width="large"),
            }
        )

    else:
        st.error("User not found in dataset.")
