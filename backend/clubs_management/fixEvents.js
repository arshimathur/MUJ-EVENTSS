require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixEvents() {
  const jaipurTitles = [
    "Jaipur Literature Fest",
    "Jaipur Music Festival",
    "Heritage Walk",
    "Light & Sound Show",
    "Handicrafts Bazaar",
    "Cultural Evening",
    "Vintage Car Rally",
    "Science Expo",
    "Food Fiesta"
  ];

  // 1. Delete existing Jaipur events
  console.log("Deleting old Jaipur events that were mixed...");
  const { error: delErr } = await supabase.from('events').delete().in('title', jaipurTitles);
  if (delErr) {
    console.error("Delete Error:", delErr);
    return;
  }
  
  console.log("Deleted. Now inserting them with is_published = false...");

  const events = [
    {
      title: "Jaipur Literature Fest",
      description: "A celebration of literature and reading featuring international speakers.",
      location: "Diggi Palace, Jaipur",
      start_time: new Date(Date.now() + 86400000).toISOString(),
      end_time: new Date(Date.now() + 90000000).toISOString(),
      capacity: 2000,
      is_published: false
    },
    {
      title: "Jaipur Music Festival",
      description: "Three days of soulful music featuring traditional and contemporary artists.",
      location: "Albert Hall Museum, Jaipur",
      start_time: new Date(Date.now() + 172800000).toISOString(),
      end_time: new Date(Date.now() + 180000000).toISOString(),
      capacity: 1500,
      is_published: false
    },
    {
      title: "Heritage Walk",
      description: "A guided walking tour exploring the rich history of the Pink City.",
      location: "Hawa Mahal, Jaipur",
      start_time: new Date(Date.now() + 259200000).toISOString(),
      end_time: new Date(Date.now() + 280000000).toISOString(),
      capacity: 50,
      is_published: false
    },
    {
      title: "Light & Sound Show",
      description: "An immersive light and sound show narrating the history of Amer Fort.",
      location: "Amer Fort, Jaipur",
      start_time: new Date(Date.now() + 345600000).toISOString(),
      end_time: new Date(Date.now() + 350000000).toISOString(),
      capacity: 500,
      is_published: false
    },
    {
      title: "Handicrafts Bazaar",
      description: "Shop for authentic Rajasthani handicrafts, textiles, and jewelry.",
      location: "Jawahar Kala Kendra, Jaipur",
      start_time: new Date(Date.now() + 432000000).toISOString(),
      end_time: new Date(Date.now() + 480000000).toISOString(),
      capacity: 1000,
      is_published: false
    },
    {
      title: "Cultural Evening",
      description: "Experience the vibrant Rajasthani culture with folk music and dance.",
      location: "Chokhi Dhani, Jaipur",
      start_time: new Date(Date.now() + 518400000).toISOString(),
      end_time: new Date(Date.now() + 530000000).toISOString(),
      capacity: 800,
      is_published: false
    },
    {
      title: "Vintage Car Rally",
      description: "A spectacular display of vintage and classic cars driving through the city.",
      location: "Jai Mahal Palace, Jaipur",
      start_time: new Date(Date.now() + 604800000).toISOString(),
      end_time: new Date(Date.now() + 620000000).toISOString(),
      capacity: 3000,
      is_published: false
    },
    {
      title: "Science Expo",
      description: "An exhibition showcasing innovative science projects by local schools.",
      location: "Birla Planetarium, Jaipur",
      start_time: new Date(Date.now() + 691200000).toISOString(),
      end_time: new Date(Date.now() + 710000000).toISOString(),
      capacity: 600,
      is_published: false
    },
    {
      title: "Food Fiesta",
      description: "Taste the flavors of Jaipur with a variety of street food and delicacies.",
      location: "Masala Chowk, Jaipur",
      start_time: new Date(Date.now() + 777600000).toISOString(),
      end_time: new Date(Date.now() + 800000000).toISOString(),
      capacity: 1200,
      is_published: false
    }
  ];

  const { error } = await supabase.from('events').insert(events);
  if (error) {
    console.error("Insert error:", error);
  } else {
    console.log("✅ Successfully fixed events!");
  }
}

fixEvents();
