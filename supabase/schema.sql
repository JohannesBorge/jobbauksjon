-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('poster', 'bidder')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    budget DECIMAL(10,2) NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    poster_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create bids table
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    bidder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(job_id, bidder_id)
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read all profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Jobs table policies
CREATE POLICY "Users can create jobs"
ON jobs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = poster_id);

CREATE POLICY "Users can read all jobs"
ON jobs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own jobs"
ON jobs FOR UPDATE
TO authenticated
USING (auth.uid() = poster_id)
WITH CHECK (auth.uid() = poster_id);

CREATE POLICY "Users can delete their own jobs"
ON jobs FOR DELETE
TO authenticated
USING (auth.uid() = poster_id);

-- Bids table policies
CREATE POLICY "Users can create bids"
ON bids FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = bidder_id);

CREATE POLICY "Users can read all bids"
ON bids FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own bids"
ON bids FOR UPDATE
TO authenticated
USING (auth.uid() = bidder_id)
WITH CHECK (auth.uid() = bidder_id);

CREATE POLICY "Users can delete their own bids"
ON bids FOR DELETE
TO authenticated
USING (auth.uid() = bidder_id);

-- Create function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'name',
        NEW.email,
        'bidder'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_poster_id ON jobs(poster_id);
CREATE INDEX IF NOT EXISTS idx_bids_job_id ON bids(job_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON jobs TO authenticated;
GRANT ALL ON bids TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 