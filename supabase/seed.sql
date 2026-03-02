-- Create Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  source TEXT NOT NULL, -- Booking.com, Expedia, Google
  comment TEXT,
  sentiment_tag TEXT, -- Positive, Negative, Neutral
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RBAC / Multi-hotel: We could add a users_hotels table here
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT DEFAULT 'manager',
  hotel_id UUID REFERENCES hotels(id)
);

-- Seeding Logic (1,000+ rows)
-- Insert a test hotel first
INSERT INTO hotels (id, name, location) 
VALUES ('00000000-0000-0000-0000-000000000001', 'ZENITH Grand Resort', 'Maldives')
ON CONFLICT (id) DO NOTHING;

-- Function to generate random reviews
DO $$
DECLARE
    i INT := 1;
    sources TEXT[] := ARRAY['Booking.com', 'Expedia', 'Google'];
    sentiments TEXT[] := ARRAY['Positive', 'Negative', 'Neutral'];
    names TEXT[] := ARRAY['John Doe', 'Jane Smith', 'Alice Johnson', 'Michael Brown', 'Sophia Davis', 'David Wilson', 'Emma Martinez', 'Chris Anderson'];
    comments_pos TEXT[] := ARRAY[
        'Amazing service and stunning views! The room was spotless.',
        'Perfect stay. The staff went above and beyond for our anniversary.',
        'Great location, close to everything. Highly recommended!',
        'The spa treatment was the highlight of our trip. Truly luxurious.',
        'Exceptional breakfast buffet with so many options.'
    ];
    comments_neg TEXT[] := ARRAY[
        'The AC was making noise all night. Management didnt help much.',
        'Room service was very slow, took 2 hours for a sandwich.',
        'The pool was closed for maintenance, which was disappointing.',
        'Overpriced for what it offers. Expecting more for a 5-star hotel.',
        'Check-in process took way too long.'
    ];
BEGIN
    FOR i IN 1..1000 LOOP
        INSERT INTO reviews (hotel_id, guest_name, rating, source, comment, sentiment_tag, created_at)
        VALUES (
            '00000000-0000-0000-0000-000000000001',
            names[1 + floor(random() * 8)],
            CASE WHEN random() > 0.3 THEN 4 + floor(random() * 2) ELSE 1 + floor(random() * 3) END,
            sources[1 + floor(random() * 3)],
            CASE WHEN random() > 0.3 THEN comments_pos[1 + floor(random() * 5)] ELSE comments_neg[1 + floor(random() * 5)] END,
            CASE WHEN random() > 0.3 THEN 'Positive' ELSE 'Negative' END,
            NOW() - (random() * interval '30 days')
        );
    END LOOP;
END $$;
