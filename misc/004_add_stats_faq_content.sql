-- Add stats and faq sections to landing_page_content
-- Run this in Supabase SQL Editor

-- Insert Stats section
INSERT INTO landing_page_content (section, title, subtitle, metadata)
VALUES (
  'stats',
  'Our Impact',
  'The numbers that drive us forward',
  '{"items": [
    {"value": 500, "label": "Members", "suffix": ""},
    {"value": 50, "label": "Events Hosted", "suffix": ""},
    {"value": 100, "label": "Projects Built", "suffix": ""},
    {"value": 250, "label": "Bounties Completed", "suffix": ""},
    {"value": 10000, "label": "Community Reach", "suffix": "+"}
  ]}'::jsonb
)
ON CONFLICT (section) DO UPDATE
SET title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

-- Insert FAQ section
INSERT INTO landing_page_content (section, title, subtitle, metadata)
VALUES (
  'faq',
  'Frequently Asked Questions',
  'Got questions? We have answers.',
  '{"items": [
    {
      "question": "What is Superteam Malaysia?",
      "answer": "Superteam Malaysia is the local chapter of Superteam, a global community of Solana builders. We serve as the digital headquarters for Web3 developers, designers, and entrepreneurs in Malaysia, connecting them with opportunities, resources, and the broader Solana ecosystem."
    },
    {
      "question": "How do I join?",
      "answer": "Join our community by connecting with us on Telegram, Discord, or Twitter. Fill out our membership form on the website to become an official member and gain access to exclusive events, bounties, and opportunities."
    },
    {
      "question": "What opportunities are available?",
      "answer": "We offer various opportunities including hackathons, grants, bounties, mentorship programs, job listings, and networking events. Members can participate in building projects, attend workshops, and connect with potential investors and partners."
    },
    {
      "question": "How can projects collaborate?",
      "answer": "Projects can collaborate through our community events, hackathons, and by joining our ecosystem. We regularly feature projects built by our members and help connect them with resources and partnerships."
    },
    {
      "question": "Do I need to be a developer to join?",
      "answer": "No! We welcome builders of all backgrounds including developers, designers, product managers, marketers, content creators, and community managers. Web3 needs diverse skills to succeed."
    }
  ]}'::jsonb
)
ON CONFLICT (section) DO UPDATE
SET title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();
