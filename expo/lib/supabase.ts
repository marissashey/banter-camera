import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://ixlqkyljxnqukdoossin.supabase.co';
const supabaseKey = 'sb_publishable_RvE_dLkTcUHmFERU-jj76Q_wlQPOWTZ';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // There is no URL to parse in native apps
    detectSessionInUrl: false,
  },
});
