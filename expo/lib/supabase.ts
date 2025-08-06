import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'TODO';
const supabaseKey = 'TODO';

export const supabase = createClient(supabaseUrl, supabaseKey);
