-- Princess profiles table creation
CREATE TABLE IF NOT EXISTS public.princess_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    line_name VARCHAR(255),
    attribute VARCHAR(100),
    age INTEGER,
    birth_year INTEGER,
    birth_date VARCHAR(20),
    current_residence VARCHAR(255),
    birthplace VARCHAR(255),
    blood_type VARCHAR(10),
    occupation VARCHAR(255),
    contact_time VARCHAR(100),
    favorite_drink VARCHAR(255),
    favorite_cigarette VARCHAR(255),
    bottle_name VARCHAR(255),
    favorite_help VARCHAR(255),
    hobby TEXT,
    specialty TEXT,
    holiday VARCHAR(100),
    favorite_brand VARCHAR(255),
    marriage VARCHAR(50),
    children VARCHAR(50),
    partner VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_princess_profiles_store_id ON public.princess_profiles(store_id);
CREATE INDEX IF NOT EXISTS idx_princess_profiles_name ON public.princess_profiles(name);

-- Enable RLS
ALTER TABLE public.princess_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for read access
CREATE POLICY "Enable read access for princess_profiles" ON public.princess_profiles
    FOR SELECT USING (true);

-- Create policy for insert access (authenticated users can insert into their store)
CREATE POLICY "Enable insert for authenticated users" ON public.princess_profiles
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for update access (authenticated users can update their store's princesses)
CREATE POLICY "Enable update for authenticated users" ON public.princess_profiles
    FOR UPDATE USING (auth.uid() IS NOT NULL);