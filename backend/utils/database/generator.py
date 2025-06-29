"""this code is to generate sample events for the events table. currently(29/6/2025), inserted 50 events into the table."""

import random
from datetime import datetime, timedelta

def generate_event_inserts(n):
    # Common event data components
    event_titles = [
        "Tech Conference 2023", "Music Festival", "Art Exhibition", 
        "Food Tasting", "Charity Run", "Startup Pitch", 
        "Workshop on AI", "Book Reading", "Comedy Night", 
        "Science Fair", "Hackathon", "Wine Tasting"
    ]
    descriptions = [
        "Join us for an exciting event!", "Don't miss this opportunity",
        "A gathering of like-minded individuals", "Learn something new",
        "Fun for the whole family", "Network with professionals"
    ]
    addresses = [
        "123 Main St, Cityville", "456 Park Ave, Townsville",
        "789 Broadway, Metropolis", "321 Center St, Urbantown",
        "654 Elm St, Villageton"
    ]
    
    # Current date for reference
    now = datetime.now()
    
    # Generate n events
    inserts = []
    for i in range(1, n+1):
        # Random data generation
        title = random.choice(event_titles)
        if n > 1:  # Add number if generating multiple events
            title = f"{title} #{i}"
        
        # Random dates (start between tomorrow and 30 days from now)
        days_from_now = random.randint(1, 30)
        start_date = now + timedelta(days=days_from_now)
        # Duration between 1 hour and 3 days
        duration = timedelta(hours=random.randint(1, 72))
        end_date = start_date + duration
        
        address = random.choice(addresses)
        price = round(random.uniform(0, 100), 2)  # Some free events
        categories = random.sample(range(1, 10), random.randint(1, 3))  # 1-3 random categories
        description = random.choice(descriptions)
        organiser_id = 1  # Assuming organizer IDs 1-10 exist
        
        # Build the INSERT statement
        insert = f"""
        INSERT INTO Event (title, start_date, end_date, address, price, categories, description, organiser_id)
        VALUES (
            '{title.replace("'", "''")}',
            '{start_date.isoformat()}',
            '{end_date.isoformat()}',
            {'NULL' if random.random() < 0.2 else f"'{address.replace("'", "''")}'"},  -- 20% chance no address
            {price},  -- Free events have NULL price
            ARRAY{categories},
            '{description.replace("'", "''")}',
            {organiser_id}
        );"""
        
        inserts.append(insert)
    
    return "\n".join(inserts)

# Example usage:
# print(generate_event_inserts(50))