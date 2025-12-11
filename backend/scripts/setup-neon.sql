-- Health Journal Database Schema for Neon PostgreSQL
-- Run this script in your Neon database console

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health records table following SOCRATES/OLDCARTS/PQRST
CREATE TABLE IF NOT EXISTS health_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    record_time TIME NOT NULL,
    
    -- SOCRATES Framework
    site VARCHAR(255),           -- Site/Location of symptom
    onset VARCHAR(255),          -- Onset timing
    character TEXT,              -- Character/Quality
    radiation VARCHAR(255),      -- Radiation/Spread
    associations TEXT,           -- Associated symptoms
    time_course TEXT,            -- Time course/Duration
    exacerbating_factors TEXT,   -- What makes it worse
    severity INTEGER CHECK (severity >= 1 AND severity <= 10), -- 1-10 scale
    
    -- Additional OLDCARTS/PQRST elements
    palliating_factors TEXT,     -- What makes it better
    quality TEXT,                -- Quality description
    region VARCHAR(255),         -- Region affected
    
    -- General health data
    symptoms TEXT,
    medications TEXT,
    diet_notes TEXT,
    vital_signs JSONB,           -- {"bp": "120/80", "temp": "98.6", "pulse": "72"}
    
    -- Analysis and notes
    personal_notes TEXT,
    ai_analysis JSONB,           -- Store AI insights
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_health_records_user_date ON health_records(user_id, record_date DESC);

-- Verify tables
SELECT 'Tables created successfully' as status;