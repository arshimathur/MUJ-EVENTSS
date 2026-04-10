require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedCollegeEvents() {
  console.log('Seeding new College Events...');

  const collegeEvents = [
    {
      title: "HackTheFuture 2026",
      description: "A 24-hour hackathon for all tech enthusiasts to build innovative software solutions.",
      location: "AB1",
      start_time: new Date(Date.now() + 2 * 86400000).toISOString(),
      end_time: new Date(Date.now() + 3 * 86400000).toISOString(),
      capacity: 250,
      is_published: true
    },
    {
      title: "Business Case Study Competition",
      description: "Analyze, strategize, and present your solutions for real-world corporate challenges.",
      location: "AB2",
      start_time: new Date(Date.now() + 5 * 86400000).toISOString(),
      end_time: new Date(Date.now() + 6 * 86400000).toISOString(),
      capacity: 150,
      is_published: true
    },
    {
      title: "Moot Court Competition 2026",
      description: "Annual national mock court competition for law students to debate complex legal cases.",
      location: "AB3",
      start_time: new Date(Date.now() + 8 * 86400000).toISOString(),
      end_time: new Date(Date.now() + 9 * 86400000).toISOString(),
      capacity: 300,
      is_published: true
    },
    {
      title: "Guest Lecture: The Future of Cyber Law",
      description: "An interactive session with leading legal experts on data privacy and digital rights.",
      location: "AB3",
      start_time: new Date(Date.now() + 10 * 86400000).toISOString(),
      end_time: new Date(Date.now() + 10 * 86400000 + 7200000).toISOString(),
      capacity: 200,
      is_published: true
    },
    {
      title: "Fresher's Orientation Ceremony",
      description: "Welcoming the newest batch to the MUJ family with speeches and performances.",
      location: "LHC",
      start_time: new Date(Date.now() + 14 * 86400000).toISOString(),
      end_time: new Date(Date.now() + 14 * 86400000 + 10800000).toISOString(),
      capacity: 800,
      is_published: true
    },
    {
      title: "Mega Concert Night - OneRepublic Cover",
      description: "The biggest musical night of the semester! Prepare for an explosive live band performance.",
      location: "Amphitheater",
      start_time: new Date(Date.now() + 20 * 86400000).toISOString(),
      end_time: new Date(Date.now() + 20 * 86400000 + 18000000).toISOString(),
      capacity: 3000,
      is_published: true
    },
    {
      title: "Inter-College Dance Battle",
      description: "Crews from all over the region face off in a high-stakes hip-hop dance competition.",
      location: "Amphitheater",
      start_time: new Date(Date.now() + 22 * 86400000).toISOString(),
      end_time: new Date(Date.now() + 22 * 86400000 + 14400000).toISOString(),
      capacity: 2500,
      is_published: true
    },
    {
      title: "Robotics Exhibition",
      description: "Showcasing combat robots, line followers, and automation projects by the IEEE chapter.",
      location: "AB1",
      start_time: new Date(Date.now() + 25 * 86400000).toISOString(),
      end_time: new Date(Date.now() + 26 * 86400000).toISOString(),
      capacity: 400,
      is_published: true
    }
  ];

  const { error } = await supabase.from('events').insert(collegeEvents);
  
  if (error) {
     console.error("Error inserting college events:", error);
  } else {
    console.log(`✅ Successfully seeded ${collegeEvents.length} new College Events!`);
  }
}

seedCollegeEvents();
