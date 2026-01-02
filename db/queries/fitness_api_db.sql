-- Schema for fitness_app_db (PostgreSQL Database)
-- This contains all tables for the fitness application

-- Create fitapp_exercises table
CREATE TABLE IF NOT EXISTS fitapp_exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    muscle_group VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    equipment VARCHAR(255),
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create fitapp_workout_plans table
CREATE TABLE IF NOT EXISTS fitapp_workout_plans (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create fitapp_workout_plan_exercises junction table
CREATE TABLE IF NOT EXISTS fitapp_workout_plan_exercises (
    id SERIAL PRIMARY KEY,
    workout_plan_id INTEGER NOT NULL REFERENCES fitapp_workout_plans(id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES fitapp_exercises(id) ON DELETE CASCADE,
    sets INTEGER DEFAULT 3,
    reps INTEGER DEFAULT 10,
    order_index INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workout_plan_id, exercise_id)
);

-- Create fitapp_employees table
CREATE TABLE IF NOT EXISTS fitapp_employees (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fitapp_exercises_muscle_group ON fitapp_exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_fitapp_exercises_difficulty ON fitapp_exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_fitapp_workout_plans_user_id ON fitapp_workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_fitapp_workout_plan_exercises_workout_plan_id ON fitapp_workout_plan_exercises(workout_plan_id);
CREATE INDEX IF NOT EXISTS idx_fitapp_workout_plan_exercises_exercise_id ON fitapp_workout_plan_exercises(exercise_id);

-- Insert sample exercises
INSERT INTO fitapp_exercises (name, description, muscle_group, difficulty, equipment, instructions) VALUES
('Push-ups', 'Classic bodyweight exercise', 'chest', 'beginner', 'none', 'Start in plank position, lower body, push back up'),
('Squats', 'Lower body compound movement', 'legs', 'beginner', 'none', 'Stand with feet shoulder-width apart, lower hips, stand back up'),
('Deadlift', 'Full body compound exercise', 'back', 'advanced', 'barbell', 'Bend at hips, grip bar, stand up while keeping back straight'),
('Bench Press', 'Upper body pressing exercise', 'chest', 'intermediate', 'barbell', 'Lie on bench, lower bar to chest, press up'),
('Pull-ups', 'Upper body pulling exercise', 'back', 'intermediate', 'pull-up bar', 'Hang from bar, pull body up until chin over bar')
ON CONFLICT DO NOTHING;