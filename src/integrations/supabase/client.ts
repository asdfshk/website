
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gkiwgfujlfoylgqecbzv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdraXdnZnVqbGZveWxncWVjYnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjI0NjAsImV4cCI6MjA1OTM5ODQ2MH0.uogG6YlO_iBi8REvqsccQDRKCffjKzDs9KUSLzbMv4g";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
