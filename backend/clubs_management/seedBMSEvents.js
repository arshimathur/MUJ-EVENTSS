require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedJaipurEvents() {
  console.log('Seeding Jaipur Events...');

  const events = [
    {
      title: "Jaipur Literature Fest",
      description: "A celebration of literature and reading featuring international speakers.",
      location: "Diggi Palace, Jaipur",
      start_time: new Date(Date.now() + 86400000).toISOString(),
      end_time: new Date(Date.now() + 90000000).toISOString(),
      capacity: 2000,
      is_published: true,
      external_url: "https://jaipurliteraturefestival.org"
    },
    {
      title: "Jaipur Music Festival",
      description: "Three days of soulful music featuring traditional and contemporary artists.",
      location: "Albert Hall Museum, Jaipur",
      start_time: new Date(Date.now() + 172800000).toISOString(),
      end_time: new Date(Date.now() + 180000000).toISOString(),
      capacity: 1500,
      is_published: true,
      external_url: "https://in.bookmyshow.com"
    },
    {
      title: "Heritage Walk",
      description: "A guided walking tour exploring the rich history of the Pink City.",
      location: "Hawa Mahal, Jaipur",
      start_time: new Date(Date.now() + 259200000).toISOString(),
      end_time: new Date(Date.now() + 280000000).toISOString(),
      capacity: 50,
      is_published: true,
      external_url: "https://in.bookmyshow.com"
    },
    {
      title: "Light & Sound Show",
      description: "An immersive light and sound show narrating the history of Amer Fort.",
      location: "Amer Fort, Jaipur",
      start_time: new Date(Date.now() + 345600000).toISOString(),
      end_time: new Date(Date.now() + 350000000).toISOString(),
      capacity: 500,
      is_published: true,
      external_url: "https://in.bookmyshow.com"
    },
    {
      title: "Handicrafts Bazaar",
      description: "Shop for authentic Rajasthani handicrafts, textiles, and jewelry.",
      location: "Jawahar Kala Kendra, Jaipur",
      start_time: new Date(Date.now() + 432000000).toISOString(),
      end_time: new Date(Date.now() + 480000000).toISOString(),
      capacity: 1000,
      is_published: true,
      external_url: "https://in.bookmyshow.com"
    },
    {
      title: "Cultural Evening",
      description: "Experience the vibrant Rajasthani culture with folk music and dance.",
      location: "Chokhi Dhani, Jaipur",
      start_time: new Date(Date.now() + 518400000).toISOString(),
      end_time: new Date(Date.now() + 530000000).toISOString(),
      capacity: 800,
      is_published: true,
      external_url: "https://in.bookmyshow.com"
    },
    {
      title: "Vintage Car Rally",
      description: "A spectacular display of vintage and classic cars driving through the city.",
      location: "Jai Mahal Palace, Jaipur",
      start_time: new Date(Date.now() + 604800000).toISOString(),
      end_time: new Date(Date.now() + 620000000).toISOString(),
      capacity: 3000,
      is_published: true,
      external_url: "https://in.bookmyshow.com"
    },
    {
      title: "Science Expo",
      description: "An exhibition showcasing innovative science projects by local schools.",
      location: "Birla Planetarium, Jaipur",
      start_time: new Date(Date.now() + 691200000).toISOString(),
      end_time: new Date(Date.now() + 710000000).toISOString(),
      capacity: 600,
      is_published: true,
      external_url: "https://in.bookmyshow.com"
    },
    {
      title: "Food Fiesta",
      description: "Taste the flavors of Jaipur with a variety of street food and delicacies.",
      location: "Masala Chowk, Jaipur",
      start_time: new Date(Date.now() + 777600000).toISOString(),
      end_time: new Date(Date.now() + 800000000).toISOString(),
      capacity: 1200,
      is_published: true,
      external_url: "https://in.bookmyshow.com"
    }
  ];

  const { error } = await supabase.from('events').insert(events);
  
  if (error) {
    if (error.message.includes('external_url')) {
       // Table might not have external_url, strip it and retry
       console.log('No external_url column, retrying without it...');
       const eventsNoExternal = events.map(({external_url, ...rest}) => rest);
       const { error: err2 } = await supabase.from('events').insert(eventsNoExternal);
       if (err2) {
          console.error("Error inserting:", err2);
       } else {
          console.log("✅ Successfully seeded Jaipur Events without external_url!");
       }
    } else {
      console.error("Error inserting:", error);
    }
  } else {
    console.log("✅ Successfully seeded Jaipur Events!");
  }
}

seedJaipurEvents();
