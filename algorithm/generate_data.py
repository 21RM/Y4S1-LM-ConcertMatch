import json
import random
import uuid

import os

# Configuration
NUM_USERS = 100000
# Ensure users.json is always in the same directory as this script
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "users.json")

# Mock Data Pools
ARTISTS = [
    # Pop
    "Taylor Swift", "Harry Styles", "Dua Lipa", "The Weeknd", "Olivia Rodrigo",
    "Billie Eilish", "Ariana Grande", "Lady Gaga", "Beyoncé", "Rihanna",
    # Rock / Alt
    "Arctic Monkeys", "The Strokes", "Fontaines D.C.", "Radiohead", "Nirvana",
    "Queen", "The Beatles", "Pink Floyd", "Red Hot Chili Peppers",
    # Indie
    "Phoebe Bridgers", "Tame Impala", "Beach House", "Clairo", "Mitski",
    "Sufjan Stevens", "Bon Iver", "Vampire Weekend",
    # Hip Hop
    "Kendrick Lamar", "Drake", "Travis Scott", "Kanye West", "Tyler, The Creator",
    "Frank Ocean", "A$AP Rocky", "J. Cole",
    # Electronic
    "Fred again..", "Daft Punk", "Jamie xx", "Disclosure", "Four Tet",
    "Aphex Twin", "Kaytranada"
]

GENRES = [
    "Pop", "Rock", "Indie Rock", "Alternative", "Hip Hop", "R&B", 
    "Electronic", "House", "Techno", "Jazz", "Folk", "Metal", "Punk"
]

CITIES = [
    {"name": "Lisbon", "lat": 38.7223, "lon": -9.1393},
    {"name": "Porto", "lat": 41.1579, "lon": -8.6291},
    {"name": "Coimbra", "lat": 40.2033, "lon": -8.4103},
    {"name": "Faro", "lat": 37.0179, "lon": -7.9308},
    {"name": "Braga", "lat": 41.5454, "lon": -8.4265},
    {"name": "Aveiro", "lat": 40.6405, "lon": -8.6538},
    {"name": "Evora", "lat": 38.5714, "lon": -7.9135}
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
    users_artists = random.sample(ARTISTS, num_artists)
    
    # Infer genres from artists (simplified) or just pick random genres
    # For this mock, we'll pick random genres heavily weighted? No, just random.
    num_genres = random.randint(2, 5)
    users_genres = random.sample(GENRES, num_genres)

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
