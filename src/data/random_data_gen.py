import random
import json

# Sample data for random generation
categories = ["Environmental Studies", "Urban Development", "Technology Innovation"]
authors_first = ["John", "Jane", "Emily", "Michael", "Samantha", "Andrew", "Sophia", "William", "Ava", "James", "Emma", "Oliver", "Mia"]
authors_last = ["Smith", "Doe", "Zhang", "Johnson", "Lee", "Miller", "Brown", "Davis", "Martinez", "Wilson", "Green", "Taylor", "Clark"]
years = list(range(2018, 2026))
latitude_range = (25.0, 50.0)  # Approximate latitude range for the US
longitude_range = (-125.0, -65.0)  # Approximate longitude range for the US

# Topic templates and descriptions
topics = [
    ("Impact of {adjective} {topic} on {focus}", "Study on how {topic} impacts {focus} in {location}"),
    ("{adjective} Infrastructure for {focus}", "Explores the use of {topic} for {focus} in {location}"),
    ("{adjective} Strategies in {location}", "A case study on {focus} strategies in {location}"),
    ("{focus} and {adjective} {topic}", "Analyzes the relationship between {focus} and {topic} in {location}"),
]

adjectives = ["Sustainable", "Green", "Efficient", "Innovative", "Advanced", "Smart"]
topics_main = ["urban sprawl", "green roofs", "air pollution", "renewable energy", "water conservation", "flood management"]
focuses = ["local ecosystems", "urban heat", "housing equity", "tourism", "coastal resilience", "energy efficiency"]

# Generate a single random entry
def generate_entry():
    author = f"{random.choice(authors_first)} {random.choice(authors_last)}"
    year = random.choice(years)
    latitude = round(random.uniform(*latitude_range), 4)
    longitude = round(random.uniform(*longitude_range), 4)
    category = random.choice(categories)
    topic_template, description_template = random.choice(topics)
    topic = random.choice(topics_main)
    adjective = random.choice(adjectives)
    focus = random.choice(focuses)
    location = random.choice(["New York", "Chicago", "Los Angeles", "Miami", "Austin", "Denver", "San Francisco"])

    name = topic_template.format(adjective=adjective, topic=topic, focus=focus, location=location)
    description = description_template.format(topic=topic, focus=focus, location=location)

    return {
        "name": name,
        "author": author,
        "description": description,
        "category": category,
        "year": year,
        "link": f"https://example.com/{random.randint(1, 10000)}",
        "latitude": latitude,
        "longitude": longitude,
    }

# Generate the dataset
def generate_dataset(num_entries=200):
    return [generate_entry() for _ in range(num_entries)]

# Generate and save the dataset
data = generate_dataset(200)

# Save to a JSON file
with open("generated_dataset.json", "w") as f:
    json.dump(data, f, indent=4)

print("Dataset of 200+ entries generated and saved to 'generated_dataset.json'.")
