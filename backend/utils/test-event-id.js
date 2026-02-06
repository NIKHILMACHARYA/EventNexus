require('dotenv').config();
const { supabase } = require('../config/db');

const testEventById = async () => {
  const eventId = 'ccc1fa4e-b3c6-4223-8759-8bbd6b1f137e';
  
  console.log('🧪 Testing Event.findById...\n');
  console.log('Event ID:', eventId);
  
  // Test 1: Simple query
  console.log('\n1. Simple query:');
  const { data: simple, error: simpleError } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();
  
  if (simpleError) {
    console.log('❌ Error:', simpleError.message, simpleError.code);
  } else {
    console.log('✅ Event found:', simple.title, `(${simple.status})`);
  }
  
  // Test 2: With join
  console.log('\n2. Query with user join:');
  const { data: withJoin, error: joinError } = await supabase
    .from('events')
    .select(`
      *,
      organizer:users!organizer_id(id, name, email, college)
    `)
    .eq('id', eventId)
    .single();
  
  if (joinError) {
    console.log('❌ Error:', joinError.message, joinError.code);
  } else {
    console.log('✅ Event with organizer:', withJoin.title);
    console.log('   Organizer:', withJoin.organizer);
  }
  
  // Test 3: List all events to see IDs
  console.log('\n3. All event IDs:');
  const { data: allEvents } = await supabase
    .from('events')
    .select('id, title, status')
    .limit(5);
  
  allEvents.forEach(e => {
    console.log(`   ${e.id} - ${e.title} (${e.status})`);
  });
  
  process.exit(0);
};

testEventById();
