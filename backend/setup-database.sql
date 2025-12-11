-- Health Journal Database Schema
-- Run this to set up the database tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health records table
CREATE TABLE IF NOT EXISTS health_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    record_time TIME NOT NULL,
    site VARCHAR(255),
    onset TEXT,
    character VARCHAR(255),
    radiation VARCHAR(255),
    associations TEXT,
    time_course TEXT,
    exacerbating_factors TEXT,
    severity INTEGER CHECK (severity >= 1 AND severity <= 10),
    palliating_factors TEXT,
    quality VARCHAR(255),
    region VARCHAR(255),
    symptoms TEXT NOT NULL,
    medications TEXT,
    diet_notes TEXT,
    vital_signs JSONB,
    personal_notes TEXT,
    ai_analysis JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON health_records(record_date DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert a test user (password is 'testpassword123' hashed)
INSERT INTO users (email, password) VALUES 
('test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;