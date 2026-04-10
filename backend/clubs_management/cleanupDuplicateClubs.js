require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function cleanup() {
  const { data, error } = await supabase.from('clubs').select('id, name');
  if (error) {
    console.error(error); return;
  }
  
  const seen = new Set();
  const duplicateIds = [];
  
  for (const club of data) {
    if (seen.has(club.name)) {
      duplicateIds.push(club.id);
    } else {
      seen.add(club.name);
    }
  }

  if (duplicateIds.length > 0) {
    console.log(`Found ${duplicateIds.length} duplicates. Deleting...`);
    const { error: deleteError } = await supabase.from('clubs').delete().in('id', duplicateIds);
    if (deleteError) {
      console.error(deleteError);
    } else {
      console.log('Successfully deleted duplicates.');
    }
  } else {
    console.log('No duplicates found.');
  }
}
cleanup();
