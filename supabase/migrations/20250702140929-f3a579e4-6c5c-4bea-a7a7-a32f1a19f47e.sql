
-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET row_security = on;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'registered' CHECK (role IN ('anonymous', 'registered', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create annonces table
CREATE TABLE IF NOT EXISTS annonces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre TEXT NOT NULL,
    description TEXT NOT NULL,
    categorie TEXT NOT NULL,
    lieu TEXT NOT NULL,
    date_perte DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'perdu' CHECK (status IN ('perdu', 'retrouve', 'rendu')),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matching table
CREATE TABLE IF NOT EXISTS matching (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    annonce_perte_id UUID NOT NULL REFERENCES annonces(id) ON DELETE CASCADE,
    annonce_retrouvee_id UUID NOT NULL REFERENCES annonces(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(annonce_perte_id, annonce_retrouvee_id)
);

-- Create restitutions table
CREATE TABLE IF NOT EXISTS restitutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    annonce_id UUID NOT NULL REFERENCES annonces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date_restitution DATE NOT NULL DEFAULT CURRENT_DATE,
    confirmation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE annonces ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching ENABLE ROW LEVEL SECURITY;
ALTER TABLE restitutions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all users" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Allow user creation on signup" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for annonces table
CREATE POLICY "Anyone can view annonces" ON annonces
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own annonces" ON annonces
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own annonces" ON annonces
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own annonces" ON annonces
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all annonces" ON annonces
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for matching table
CREATE POLICY "Anyone can view matching results" ON matching
    FOR SELECT USING (true);

CREATE POLICY "System can create matching results" ON matching
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage matching" ON matching
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for restitutions table
CREATE POLICY "Users can view their own restitutions" ON restitutions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create restitutions" ON restitutions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own restitutions" ON restitutions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all restitutions" ON restitutions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_annonces_user_id ON annonces(user_id);
CREATE INDEX IF NOT EXISTS idx_annonces_status ON annonces(status);
CREATE INDEX IF NOT EXISTS idx_annonces_categorie ON annonces(categorie);
CREATE INDEX IF NOT EXISTS idx_annonces_lieu ON annonces(lieu);
CREATE INDEX IF NOT EXISTS idx_matching_scores ON matching(score DESC);
CREATE INDEX IF NOT EXISTS idx_restitutions_user_id ON restitutions(user_id);
CREATE INDEX IF NOT EXISTS idx_restitutions_annonce_id ON restitutions(annonce_id);
