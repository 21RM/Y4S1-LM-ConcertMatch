import json
import math
import sys

import os

# Configuration
INPUT_FILE = os.path.join(os.path.dirname(__file__), "users.json")

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) * math.sin(dlat / 2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlon / 2) * math.sin(dlon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def calculate_music_score(user_a, user_b):
    artists_a = set(user_a["stats"]["top_artists"])
    artists_b = set(user_b["stats"]["top_artists"])
    genres_a = set(user_a["stats"]["top_genres"])
    genres_b = set(user_b["stats"]["top_genres"])
    
    # Jaccard Similarity
    if not artists_a and not artists_b:
        artist_score = 0
    else:
        artist_score = len(artists_a.intersection(artists_b)) / len(artists_a.union(artists_b))
        
    if not genres_a and not genres_b:
        genre_score = 0
    else:
        genre_score = len(genres_a.intersection(genres_b)) / len(genres_a.union(genres_b))
    
    # Weight: Artists matter more (e.g. 70% artists, 30% genres)
    return (0.7 * artist_score) + (0.3 * genre_score)

def calculate_location_factor(distance_km):
    # < 20km = 1.0
    # > 500km = 0.0
    # Linear decay
    min_dist = 20
    max_dist = 500
    
    if distance_km <= min_dist:
        return 1.0
    elif distance_km >= max_dist:
        return 0.0
    else:
        return 1.0 - ((distance_km - min_dist) / (max_dist - min_dist))

def find_matches_data(target_user_id=None, users_data=None):
    if users_data is None:
        try:
            with open(INPUT_FILE, "r") as f:
                users = json.load(f)
        except FileNotFoundError:
            return None, "users.json not found"
    else:
        users = users_data

    # Select target User
    target_user = None
    if target_user_id:
        for u in users:
            if u["id"] == target_user_id:
                target_user = u
                break
        if not target_user:
            return None, f"User ID {target_user_id} not found"
    else:
        target_user = users[0] # Default to first user
        
    scored_matches = []
    
    for user in users:
        if user["id"] == target_user["id"]:
            continue
            
        # 1. Calculate Music Score (0.0 to 1.0)
        music_score = calculate_music_score(target_user, user)
        
        # 2. Calculate Location Factor (0.0 to 1.0)
        lat1, lon1 = target_user["location"]["lat"], target_user["location"]["lon"]
        lat2, lon2 = user["location"]["lat"], user["location"]["lon"]
        distance_km = haversine(lat1, lon1, lat2, lon2)
        
        location_factor = calculate_location_factor(distance_km)
        
        # 3. Calculate True Match Score
        # "if their music score % is above 85%, they should be considererd perfect"
        # Meaning: Boost location factor to 1.0 regardless of distance
        if music_score > 0.85:
            final_location_factor = 1.0
        else:
            final_location_factor = location_factor
            
        # Concept: Distance acts as a decay on the Music Score
        # If too far, score -> 0 (unless music match is super high)
        true_match_score = music_score * final_location_factor
        
        scored_matches.append({
            "user": user,
            "true_match_score": true_match_score, # For sorting
            "music_score": music_score, # For display
            "location_factor": location_factor,
            "distance_km": distance_km
        })
        
    scored_matches.sort(key=lambda x: x["true_match_score"], reverse=True)
    return target_user, scored_matches

def find_matches(target_user_id=None):
    target_user, matches = find_matches_data(target_user_id)
    
    if not target_user:
        print(matches) # Error message
        return

    print(f"\n--- Finding Matches for {target_user['name']} ---")
    print(f"Location: {target_user['location']['city_u']}")
    print(f"Top Artists: {', '.join(target_user['stats']['top_artists'][:3])}...")
    print(f"Top Genres: {', '.join(target_user['stats']['top_genres'])}")
    print("-" * 50)
    
    # Output Top 5
    print("\nTop 5 Matches:\n")
    for i, match in enumerate(matches[:5]):
        u = match["user"]
        pct = match["true_match_score"] * 100
        dist = match["distance_km"]
        shared_artists = set(target_user["stats"]["top_artists"]).intersection(set(u["stats"]["top_artists"]))
        
        print(f"{i+1}. {u['name']} ({u['location']['city_u']}) - Match: {pct:.1f}%")
        print(f"   Distance: {dist:.1f} km")
        print(f"   Shared Artists: {', '.join(shared_artists) if shared_artists else 'None'}")
        print(f"   Top Genres: {', '.join(u['stats']['top_genres'])}")
        print("")

if __name__ == "__main__":
    target_id = sys.argv[1] if len(sys.argv) > 1 else None
    find_matches(target_id)
