-- Create support_tickets table for admin tracking of issues and feedback
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('simulation', 'content_error', 'ui_issue', 'feature_request', 'other')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    subject TEXT,
    message TEXT NOT NULL,
    context_url TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own tickets
CREATE POLICY "Users can create support tickets"
ON public.support_tickets FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Admin-only view policy (assuming an 'admin' role or just restricted for now)
-- For now, let's allow users to see their OWN tickets if they need to, 
-- but the user specified it's mainly for the admin.
CREATE POLICY "Users can view their own tickets"
ON public.support_tickets FOR SELECT
USING (auth.uid() = user_id);

-- Instructions: Refresh the Supabase dashboard and run this in the SQL Editor.
