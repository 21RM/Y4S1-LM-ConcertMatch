import json
import random
import uuid

import os

# Configuration
NUM_USERS = 100000
# Ensure users.json is always in the same directory as this script
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "users.json")

# Mock Data Pools
ARTISTS = {
    # Pop
    "Taylor Swift": ["Pop"], "Harry Styles": ["Pop", "Rock"], "Dua Lipa": ["Pop", "Electronic"], 
    "The Weeknd": ["Pop", "R&B"], "Olivia Rodrigo": ["Pop", "Rock"],
    "Billie Eilish": ["Pop", "Alternative"], "Ariana Grande": ["Pop", "R&B"], 
    "Lady Gaga": ["Pop", "Electronic"], "Beyoncé": ["R&B", "Pop"], "Rihanna": ["R&B", "Pop"],
    # Rock / Alt
    "Arctic Monkeys": ["Rock", "Indie Rock"], "The Strokes": ["Rock", "Indie Rock"], 
    "Fontaines D.C.": ["Post-Punk", "Indie Rock"], "Radiohead": ["Alternative", "Rock"], 
    "Nirvana": ["Rock", "Grunge"], "Queen": ["Rock"], "The Beatles": ["Rock", "Pop"], 
    "Pink Floyd": ["Rock", "Progressive Rock"], "Red Hot Chili Peppers": ["Rock", "Funk"],
    # Indie
    "Phoebe Bridgers": ["Indie Folk", "Alternative"], "Tame Impala": ["Psych Rock", "Indie Rock"], 
    "Beach House": ["Dream Pop", "Indie Rock"], "Clairo": ["Lo-Fi", "Pop"], 
    "Mitski": ["Indie Rock", "Alternative"], "Sufjan Stevens": ["Indie Folk", "Alternative"], 
    "Bon Iver": ["Indie Folk", "Alternative"], "Vampire Weekend": ["Indie Rock", "Pop"],
    # Hip Hop
    "Kendrick Lamar": ["Hip Hop"], "Drake": ["Hip Hop", "R&B"], "Travis Scott": ["Hip Hop"], 
    "Kanye West": ["Hip Hop"], "Tyler, The Creator": ["Hip Hop", "R&B"],
    "Frank Ocean": ["R&B", "Soul"], "A$AP Rocky": ["Hip Hop"], "J. Cole": ["Hip Hop"],
    # Electronic
    "Fred again..": ["House", "Electronic"], "Daft Punk": ["Electronic", "House"], 
    "Jamie xx": ["Electronic", "UK Garage"], "Disclosure": ["House", "Pop"], 
    "Four Tet": ["Electronic", "Ambient"], "Aphex Twin": ["IDM", "Electronic"], 
    "Kaytranada": ["Electronic", "Hip Hop"]
}

# Derived from above
ALL_ARTIST_NAMES = list(ARTISTS.keys())

CITIES = [
    {"name": "Lisbon", "lat": 38.7223, "lon": -9.1393},
    {"name": "Porto", "lat": 41.1579, "lon": -8.6291},
    {"name": "Coimbra", "lat": 40.2033, "lon": -8.4103},
    {"name": "Faro", "lat": 37.0179, "lon": -7.9308},
    {"name": "Braga", "lat": 41.5454, "lon": -8.4265},
    {"name": "Aveiro", "lat": 40.6405, "lon": -8.6538},
    {"name": "Evora", "lat": 38.5714, "lon": -7.9135},
    {"name": "Setúbal", "lat": 38.5244, "lon": -8.8882},
    {"name": "Leiria", "lat": 39.7438, "lon": -8.8078},
    {"name": "Viseu", "lat": 40.6566, "lon": -7.9125},
    {"name": "Viana do Castelo", "lat": 41.6918, "lon": -8.8344},
    {"name": "Guimarães", "lat": 41.4425, "lon": -8.2918},
    {"name": "Castelo Branco", "lat": 39.8197, "lon": -7.4969},
    {"name": "Guarda", "lat": 40.5373, "lon": -7.2658},
    {"name": "Beja", "lat": 38.0175, "lon": -7.8687},
    {"name": "Santarém", "lat": 39.2333, "lon": -8.6833},
    {"name": "Vila Real", "lat": 41.3012, "lon": -7.7471}
]

FIRST_NAMES = ["Maria", "João", "Ana", "Pedro", "Sofia", "Tiago", "Beatriz", "Diogo", "Mariana", "Gonçalo", "Inês", "Lucas", "Rita", "Miguel"]
LAST_NAMES = ["Silva", "Santos", "Ferreira", "Pereira", "Oliveira", "Costa", "Rodrigues", "Martins", "Jesus", "Sousa", "Fernandes", "Gonçalves"]

def generate_user():
    first = random.choice(FIRST_NAMES)
    last = random.choice(LAST_NAMES)
    city = random.choice(CITIES)
    
    # Randomly scatter location slightly to avoid stacking (approx 5km radius)
    lat_offset = random.uniform(-0.04, 0.04)
    lon_offset = random.uniform(-0.04, 0.04)
    
    num_artists = random.randint(3, 10)
    users_artists = random.sample(ALL_ARTIST_NAMES, num_artists)
    
    # Infer genres from artists
    genre_counts = {}
    for artist in users_artists:
        for genre in ARTISTS[artist]:
            genre_counts[genre] = genre_counts.get(genre, 0) + 1
            
    # Sort genres by frequency
    sorted_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)
    
    # Pick top 2-5 genres
    num_genres = min(len(sorted_genres), random.randint(2, 5))
    users_genres = [g[0] for g in sorted_genres[:num_genres]]

    return {
        "id": str(uuid.uuid4()),
        "name": f"{first} {last}",
        "location": {
            "city_u": city["name"], # Rough city name
            "lat": city["lat"] + lat_offset,
            "lon": city["lon"] + lon_offset
        },
        "stats": {
            "minutes_listened": random.randint(5000, 150000),
            "top_artists": users_artists,
            "top_genres": users_genres
        }
    }

def generate_dataset(num_users=NUM_USERS, output_file=OUTPUT_FILE):
    print(f"Generating {num_users} users...")
    users = [generate_user() for _ in range(num_users)]
    
    with open(output_file, "w") as f:
        json.dump(users, f, indent=2)
    
    print(f"Done! Saved to {output_file}")
    return users

def main():
    generate_dataset()

if __name__ == "__main__":
    main()
