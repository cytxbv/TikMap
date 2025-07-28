import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hrttbegcajtrqrfauska.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydHRiZWdjYWp0cnFyZmF1c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MjQwNDEsImV4cCI6MjA2OTIwMDA0MX0.uzjFqOteLjLFGMtpgtfK_5sRcukpCABnUSpDgITDomE';

export const supabase = createClient(supabaseUrl, supabaseKey);
