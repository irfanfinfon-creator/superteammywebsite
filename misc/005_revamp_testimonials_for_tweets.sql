ALTER TABLE testimonials 
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS role,
DROP COLUMN IF EXISTS company,
DROP COLUMN IF EXISTS photo_url,
DROP COLUMN IF EXISTS content,
DROP COLUMN IF EXISTS twitter_url;

-- Add tweet_url only if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='testimonials' AND column_name='tweet_url') THEN
        ALTER TABLE testimonials ADD COLUMN tweet_url TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add some initial sample data if needed, but usually we just let the user fill it.
-- For now, I'll just leave the table structure ready.
