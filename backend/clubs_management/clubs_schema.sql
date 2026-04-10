-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. Table: clubs
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    image_url TEXT,
    contact_email TEXT,
    website_url TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 2. Table: club_members
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.club_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT CHECK (role IN ('member', 'admin')) DEFAULT 'member',
    status TEXT CHECK (status IN ('pending', 'approved')) DEFAULT 'pending',
    application_data JSONB DEFAULT '{}'::jsonb,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 3. Indexes
-- --------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_clubs_category ON public.clubs(category);
CREATE INDEX IF NOT EXISTS idx_club_members_club_id ON public.club_members(club_id);
CREATE INDEX IF NOT EXISTS idx_club_members_user_id ON public.club_members(user_id);

-- --------------------------------------------------------
-- 4. Row Level Security (RLS)
-- --------------------------------------------------------
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR 'clubs' TABLE

-- Anyone can read clubs
CREATE POLICY "Anyone can read clubs"
ON public.clubs FOR SELECT
USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can create clubs"
ON public.clubs FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Only creator or admin can update
CREATE POLICY "Creator or admin can update clubs"
ON public.clubs FOR UPDATE
USING (
    auth.uid() = created_by OR
    EXISTS (
        SELECT 1 FROM public.club_members
        WHERE club_id = clubs.id AND user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
);

-- Only creator can delete
CREATE POLICY "Creator can delete clubs"
ON public.clubs FOR DELETE
USING (auth.uid() = created_by);

-- POLICIES FOR 'club_members' TABLE

-- Anyone can read club members
CREATE POLICY "Anyone can read club members"
ON public.club_members FOR SELECT
USING (true);

-- Users can request to join
CREATE POLICY "Users can insert pending join requests"
ON public.club_members FOR INSERT
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Admins can update statuses and roles
CREATE POLICY "Admins can update members"
ON public.club_members FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.clubs WHERE id = club_members.club_id AND created_by = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM public.club_members admin
        WHERE admin.club_id = club_members.club_id AND admin.user_id = auth.uid() AND admin.role = 'admin' AND admin.status = 'approved'
    )
);

-- --------------------------------------------------------
-- 5. Table: events (BookMyShow / City Events)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    location TEXT,
    image_url TEXT,
    external_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Anyone can read events
CREATE POLICY "Anyone can read events"
ON public.events FOR SELECT
USING (true);
