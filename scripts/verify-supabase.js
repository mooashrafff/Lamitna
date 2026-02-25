import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL?.trim() || "https://rrxsevbgtprbtfakidqe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || "sb_publishable_e5udXFWl7w_gMFH_ezq-pg_Fx8KvzWd";

async function verifyConnection() {
  console.log('Verifying Supabase connection...');
  console.log(`URL: ${SUPABASE_URL}`);

  if (SUPABASE_URL === "https://rrxsevbgtprbtfakidqe.supabase.co") {
    console.warn('WARNING: Using default demo Supabase URL. If you want to use your own project, please update .env file.');
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  try {
    const { data, error } = await supabase.from('events').select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Connection failed:', error.message);
      process.exit(1);
    } else {
      console.log('✅ Connection successful!');
      console.log('Note: If you are seeing this, the app can successfully communicate with Supabase.');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

verifyConnection();
