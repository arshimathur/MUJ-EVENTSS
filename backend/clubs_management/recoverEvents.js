require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function recoverAndFix() {
  console.log('--- RECOVERING COLLEGE EVENTS ---');
  
  // 1. Recover College Events (inserted into the original 'events' table)
  const collegeEvents = [
    {
      title: "Annual Tech Summit 2024",
      description: "Join us for the biggest technical festival of the year! Hackathons, guest lectures, and more.",
      location: "Main Auditorium, Campus",
      start_time: new Date(Date.now() + 86400000).toISOString(),
      end_time: new Date(Date.now() + 90000000).toISOString(),
      capacity: 500,
      is_published: true
    },
    {
      title: "Cultural Night - Spandan",
      description: "Experience the vibrant cultural performances from various clubs.",
      location: "Open Air Theatre",
      start_time: new Date(Date.now() + 172800000).toISOString(),
      end_time: new Date(Date.now() + 180000000).toISOString(),
      capacity: 1000,
      is_published: true
    },
    {
      title: "Inter-department Sports Meet",
      description: "Cheer for your department in basketball, football, and athletics.",
      location: "University Sports Complex",
      start_time: new Date(Date.now() + 259200000).toISOString(),
      end_time: new Date(Date.now() + 280000000).toISOString(),
      capacity: 300,
      is_published: true
    }
  ];

  const { error: collegeError } = await supabase.from('events').insert(collegeEvents);
  if (collegeError) {
    console.log("Error recovering college events:", collegeError.message);
  } else {
    console.log("✅ Successfully restored College Events!");
  }

  console.log('\n--- SETUP CITY EVENTS (BookMyShow) ---');
  
  // 2. We use a separate table 'city_events' for BookMyShow to avoid schema collisions!
  // We will run raw SQL to create it using RPC if possible. Oh wait, we can't run raw SQL directly without RPC.
  // Instead, I will instruct the user to create 'city_events' via the dashboard.
}

recoverAndFix();
