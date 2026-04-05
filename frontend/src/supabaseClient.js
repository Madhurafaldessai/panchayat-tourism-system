import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ukissixrretjgwtythxl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVraXNzaXhycmV0amd3dHl0aHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjIwODksImV4cCI6MjA5MDg5ODA4OX0.dkQc_MHk9NIyAvJsnNikHzKS325wnk9Div1vSRp9kzk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
