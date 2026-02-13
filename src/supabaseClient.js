import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://uktunwxmzxhpvphlkjyl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdHVud3htenhocHZwaGxranlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MDMxMzYsImV4cCI6MjA3ODI3OTEzNn0.as8hKMUN7zdWA8GX_l68XccNUVroAe8xpVXBhatlmNI'
);
