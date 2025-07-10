-- User Table
CREATE TABLE "users" (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    image_url TEXT,
    preferences FLOAT[],  -- Array of floats
    rating REAL             -- Optional: can be NULL
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    sso_id TEXT
);

-- Event Table
CREATE TABLE Event (
    event_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    address TEXT,
    price DECIMAL(10, 2),
    categories FLOAT[],   -- Array of floats
    description TEXT,
    organiser_id INTEGER REFERENCES "User"(user_id) ON DELETE CASCADE
);

-- Participation History Table
CREATE TABLE participation_history (
    participant_history_id SERIAL PRIMARY KEY,
    participant_id INTEGER REFERENCES "User"(user_id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES Event(event_id) ON DELETE CASCADE,
    is_over BOOLEAN DEFAULT FALSE,
    rating REAL,
    comments TEXT
);

-- User Table
CREATE TABLE "User" (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    image_url TEXT,
    preferences INTEGER[],  -- Array of integers
    rating REAL             -- Optional: can be NULL
);

-- Event Table
CREATE TABLE Event (
    event_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    address TEXT,
    price DECIMAL(10, 2),
    categories FLOAT[],   -- Array of integers
    description TEXT
    organiser_id INTEGER REFERENCES "User"(user_id) ON DELETE CASCADE;
)

-- Participation History Table
CREATE TABLE participation_history (
    participant_history_id SERIAL PRIMARY KEY,
    participant_id INTEGER REFERENCES "User"(user_id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES Event(event_id) ON DELETE CASCADE,
    is_over BOOLEAN DEFAULT FALSE,
    rating REAL,
    comments TEXT
);

"""
ALTER TABLE "User"
ADD COLUMN email TEXT UNIQUE NOT NULL,
ADD COLUMN password_hash TEXT NOT NULL,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
"""