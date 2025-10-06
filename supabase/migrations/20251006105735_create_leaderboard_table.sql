/*
  # Geography Game Leaderboard Schema

  ## Overview
  Creates a leaderboard table to store player scores for the geography matching game.

  ## New Tables
  
  ### `leaderboard`
  Stores player game results with the following columns:
  - `id` (uuid, primary key) - Unique identifier for each entry
  - `player_name` (text, not null) - Name of the player
  - `score` (integer, not null, default 0) - Points earned in the game
  - `time_remaining` (integer, not null, default 0) - Seconds remaining when game completed
  - `created_at` (timestamptz, default now()) - Timestamp of when the score was recorded

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the `leaderboard` table
  - Public read access: Anyone can view leaderboard entries
  - Public insert access: Anyone can submit their scores
  - No update or delete access: Scores are permanent once submitted

  ## Notes
  - Scores are ordered by highest score first, then by time remaining (more time = better)
  - The table allows anonymous submissions for a frictionless game experience
  - No authentication required for this casual game feature
*/

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  time_remaining integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view leaderboard entries
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert their scores
CREATE POLICY "Anyone can insert scores"
  ON leaderboard
  FOR INSERT
  WITH CHECK (true);