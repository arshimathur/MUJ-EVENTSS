require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding your original 25 MUJ clubs data...');
  
  const dummyUserId = "00000000-0000-0000-0000-000000000000"; 
  
  const originalClubs = [
    { name: 'IEEE Student Branch', description: 'IEEE APS deals with antenna and propagation research.', category: 'Technical', created_by: dummyUserId },
    { name: 'ACM MUJ Student Chapter', description: 'Promotes computing and technical excellence.', category: 'Technical', created_by: dummyUserId },
    { name: 'Cyber Space', description: 'Focuses on cybersecurity and ethical hacking.', category: 'Technical', created_by: dummyUserId },
    { name: 'IEEE MTTS Student Chapter', description: 'Focuses on microwave theory and technology.', category: 'Technical', created_by: dummyUserId },
    { name: 'IEEE MUJ Women in Engineering', description: 'A student-led technical community.', category: 'Technical', created_by: dummyUserId },
    { name: 'LearnIT', description: 'Dedicated to software development and coding.', category: 'Technical', created_by: dummyUserId },
    { name: 'Turing Sapiens', description: 'Focuses on AI, ML, and problem-solving.', category: 'Technical', created_by: dummyUserId },
    { name: 'ANOVA', description: 'Data science and analytics club.', category: 'Technical', created_by: dummyUserId },
    { name: 'AIML Community', description: 'Community dedicated to AI and machine learning.', category: 'Technical', created_by: dummyUserId },
    { name: 'Cosmos - The Science Club', description: 'Exploring science through hands-on projects.', category: 'Technical', created_by: dummyUserId },
    { name: 'IEEE RAS', description: 'For robotics enthusiasts.', category: 'Technical', created_by: dummyUserId },
    { name: 'Google Developer Student Clubs', description: 'Fosters developer skills and innovation.', category: 'Technical', created_by: dummyUserId },
    { name: 'Aperture', description: 'Photography and cinematography club of MUJ.', category: 'Non-Technical', created_by: dummyUserId },
    { name: 'Cactus - Socio Cultural', description: 'Fosters cultural and social creativity.', category: 'Non-Technical', created_by: dummyUserId },
    { name: 'Finance Club', description: 'Explore finance, investing, and economics.', category: 'Non-Technical', created_by: dummyUserId },
    { name: 'Litmus - Cultural', description: 'Promotes literature, poetry, and expression.', category: 'Non-Technical', created_by: dummyUserId },
    { name: 'Coreografia', description: 'Official dance club of MUJ.', category: 'Non-Technical', created_by: dummyUserId },
    { name: 'Humans of Manipal Jaipur', description: 'Sharing inspiring stories of MUJ.', category: 'Non-Technical', created_by: dummyUserId },
    { name: 'Olympism', description: 'Promotes sportsmanship and Olympic spirit.', category: 'Non-Technical', created_by: dummyUserId },
    { name: 'The Music Club', description: 'For passionate singers and instrumentalists.', category: 'Non-Technical', created_by: dummyUserId },
    { name: 'Yes!+ Student Chapter', description: 'Promotes mindfulness and personal growth.', category: 'Non-Technical', created_by: dummyUserId },
    { name: 'Cinefilia', description: 'Dramatics and filmmaking society.', category: 'Non-Technical', created_by: dummyUserId },
    { name: 'Glitch!', description: 'Blending creativity, art and tech.', category: 'Non-Technical', created_by: dummyUserId },
    { name: 'Abhigya', description: 'Encourages knowledge-sharing and debate.', category: 'Non-Technical', created_by: dummyUserId },
    { name: 'Alternative Dispute Resolution Cell', description: 'For legal discussions and conflict resolution.', category: 'Non-Technical', created_by: dummyUserId }
  ];

  // Optional: clear out the old dummy ones first (or wait, let's just delete the 3 dummy ones we inserted previously)
  await supabase.from('clubs').delete().in('name', ['Tech Innovators', 'Art & Design Hub', 'Sports Committee']);

  // Insert original clubs
  const { data, error } = await supabase.from('clubs').insert(originalClubs).select();

  if (error) {
    console.error('Error seeding clubs:', error.message);
  } else {
    console.log(`Successfully seeded ${data.length} clubs into Supabase!`);
  }
}

seed();
