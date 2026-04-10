require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupEvents() {
  const jaipurTitles = [
    "Jaipur Literature Fest",
    "Jaipur Music Festival",
    "Heritage Walk",
    "Light & Sound Show",
    "Handicrafts Bazaar",
    "Cultural Evening",
    "Vintage Car Rally",
    "Science Expo",
    "Food Fiesta",
    "Jaipur Startup Weekend",
    "Rajasthani Food Fest",
    "Tech Expo Jaipur",
    "Kite Festival",
    "Camel Safari",
    "Photography Walk"
  ];

  console.log("Deleting strictly Jaipur events from the primary 'events' table...");
  const { error } = await supabase.from('events').delete().in('title', jaipurTitles);
  
  if (error) {
    console.error("Cleanup Error:", error);
  } else {
    console.log("✅ Main events table purged of Jaipur City events.");
  }
}

cleanupEvents();
