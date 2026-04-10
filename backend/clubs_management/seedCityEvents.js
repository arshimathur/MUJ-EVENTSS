require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedCityEvents() {
  console.log('Seeding 15 Jaipur Events into city_events table...');

  const events = [
    {
      title: "Jaipur Literature Fest",
      description: "A celebration of literature and reading featuring international speakers.",
      location: "Diggi Palace, Jaipur",
      start_time: new Date(Date.now() + 86400000).toISOString(),
      end_time: new Date(Date.now() + 90000000).toISOString(),
      capacity: 2000,
      image_url: "https://images.unsplash.com/photo-1544640808-32cb4f5f5eed"
    },
    {
      title: "Jaipur Music Festival",
      description: "Three days of soulful music featuring traditional and contemporary artists.",
      location: "Albert Hall Museum, Jaipur",
      start_time: new Date(Date.now() + 172800000).toISOString(),
      end_time: new Date(Date.now() + 180000000).toISOString(),
      capacity: 1500,
      image_url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea"
    },
    {
      title: "Heritage Walk",
      description: "A guided walking tour exploring the rich history of the Pink City.",
      location: "Hawa Mahal, Jaipur",
      start_time: new Date(Date.now() + 259200000).toISOString(),
      end_time: new Date(Date.now() + 280000000).toISOString(),
      capacity: 50,
      image_url: "https://images.unsplash.com/photo-1477587458883-47145ed94245"
    },
    {
      title: "Light & Sound Show",
      description: "An immersive light and sound show narrating the history of Amer Fort.",
      location: "Amer Fort, Jaipur",
      start_time: new Date(Date.now() + 345600000).toISOString(),
      end_time: new Date(Date.now() + 350000000).toISOString(),
      capacity: 500,
      image_url: "https://images.unsplash.com/photo-1516086774640-eb6eacc2baaa"
    },
    {
      title: "Handicrafts Bazaar",
      description: "Shop for authentic Rajasthani handicrafts, textiles, and jewelry.",
      location: "Jawahar Kala Kendra, Jaipur",
      start_time: new Date(Date.now() + 432000000).toISOString(),
      end_time: new Date(Date.now() + 480000000).toISOString(),
      capacity: 1000,
      image_url: "https://images.unsplash.com/photo-1596484552834-6a58f850d0fa"
    },
    {
      title: "Cultural Evening",
      description: "Experience the vibrant Rajasthani culture with folk music and dance.",
      location: "Chokhi Dhani, Jaipur",
      start_time: new Date(Date.now() + 518400000).toISOString(),
      end_time: new Date(Date.now() + 530000000).toISOString(),
      capacity: 800,
      image_url: "https://images.unsplash.com/photo-1621213032549-ee51887e2b1b"
    },
    {
      title: "Vintage Car Rally",
      description: "A spectacular display of vintage and classic cars driving through the city.",
      location: "Jai Mahal Palace, Jaipur",
      start_time: new Date(Date.now() + 604800000).toISOString(),
      end_time: new Date(Date.now() + 620000000).toISOString(),
      capacity: 3000,
      image_url: "https://images.unsplash.com/photo-1511210283088-fe6bd0ff5bc3"
    },
    {
      title: "Science Expo",
      description: "An exhibition showcasing innovative science projects by local schools.",
      location: "Birla Planetarium, Jaipur",
      start_time: new Date(Date.now() + 691200000).toISOString(),
      end_time: new Date(Date.now() + 710000000).toISOString(),
      capacity: 600,
      image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d"
    },
    {
      title: "Food Fiesta",
      description: "Taste the flavors of Jaipur with a variety of street food and delicacies.",
      location: "Masala Chowk, Jaipur",
      start_time: new Date(Date.now() + 777600000).toISOString(),
      end_time: new Date(Date.now() + 800000000).toISOString(),
      capacity: 1200,
      image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"
    },
    {
      title: "Tech Expo Jaipur",
      description: "Showcasing the latest startups, gadgets, and technical innovations.",
      location: "JECC, Jaipur",
      start_time: new Date(Date.now() + 864000000).toISOString(),
      end_time: new Date(Date.now() + 880000000).toISOString(),
      capacity: 2500,
      image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    },
    {
      title: "Jaipur Startup Weekend",
      description: "Pitch ideas and build startups in 48 hours.",
      location: "WTP, Jaipur",
      start_time: new Date(Date.now() + 950400000).toISOString(),
      end_time: new Date(Date.now() + 960000000).toISOString(),
      capacity: 200,
      image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
    },
    {
      title: "Rajasthani Food Fest",
      description: "An upscale food festival highlighting authentic local dishes.",
      location: "Rambagh Palace, Jaipur",
      start_time: new Date(Date.now() + 1036800000).toISOString(),
      end_time: new Date(Date.now() + 1050000000).toISOString(),
      capacity: 400,
      image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
    },
    {
      title: "Kite Festival",
      description: "A sky filled with vibrant kites in celebration of Makar Sankranti.",
      location: "Jal Mahal, Jaipur",
      start_time: new Date(Date.now() + 1123200000).toISOString(),
      end_time: new Date(Date.now() + 1140000000).toISOString(),
      capacity: 5000,
      image_url: "https://images.unsplash.com/photo-1506869628045-8c0356dedcf1"
    },
    {
      title: "Camel Safari",
      description: "A sunset camel ride in the outskirts of the pink city.",
      location: "Aravaali Hills, Jaipur",
      start_time: new Date(Date.now() + 1209600000).toISOString(),
      end_time: new Date(Date.now() + 1220000000).toISOString(),
      capacity: 100,
      image_url: "https://images.unsplash.com/photo-1543329976-1b32dff3cf7d"
    },
    {
      title: "Photography Walk",
      description: "Explore hidden architectural gems with professional photographers.",
      location: "City Palace, Jaipur",
      start_time: new Date(Date.now() + 1296000000).toISOString(),
      end_time: new Date(Date.now() + 1310000000).toISOString(),
      capacity: 30,
      image_url: "https://images.unsplash.com/photo-1516961642265-531546e84af2"
    }
  ];

  const { error } = await supabase.from('city_events').insert(events);
  
  if (error) {
     console.error("Error inserting into city_events:", error);
  } else {
    console.log("✅ Successfully seeded 15 Jaipur City Events into city_events!");
  }
}

seedCityEvents();
