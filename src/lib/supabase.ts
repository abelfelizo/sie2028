import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://zrsgaiiqahdxdtetydpo.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc2dhaWlxYWhkeGR0ZXR5ZHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3ODMzNzgsImV4cCI6MjA4OTM1OTM3OH0.WfGZApl3CScICPYRJYPhA_V2e1cM7EcQgIg0kaIHsQU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
