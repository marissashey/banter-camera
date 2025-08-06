import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixlqkyljxnqukdoossin.supabase.co';
const supabaseKey = 'sb_publishable_RvE_dLkTcUHmFERU-jj76Q_wlQPOWTZ';

export const supabase = createClient(supabaseUrl, supabaseKey);
