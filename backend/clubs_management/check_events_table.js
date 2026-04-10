import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '../.env' }); // or whichever has SUPABASE_URL

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  const { data: clubs } = await supabase.from('clubs').select('id, name').limit(2);
  const { data: events } = await supabase.from('events').select('id, title').limit(5);

  console.log("Clubs count:", clubs?.length);
  console.log("Clubs slice:", clubs);
  console.log("Events count:", events?.length);
  console.log("Events slice:", events);
}

testFetch();
