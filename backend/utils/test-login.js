require('dotenv').config();
const { supabase } = require('../config/db');
const bcrypt = require('bcryptjs');

const testLogin = async () => {
  try {
    console.log('🧪 Testing login functionality...\n');

    // Test 1: Check if users exist
    console.log('1. Checking if test users exist...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role')
      .in('email', ['admin@college-events.com', 'john@example.com']);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      process.exit(1);
    }

    console.log(`✅ Found ${users.length} test users:`);
    users.forEach(u => console.log(`   - ${u.email} (${u.role})`));

    // Test 2: Try to fetch admin user
    console.log('\n2. Fetching admin user...');
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@college-events.com')
      .single();

    if (adminError || !adminUser) {
      console.error('❌ Admin user not found');
      process.exit(1);
    }

    console.log(`✅ Admin user found: ${adminUser.name} (${adminUser.email})`);

    // Test 3: Test password comparison
    console.log('\n3. Testing password comparison...');
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, adminUser.password);

    if (isMatch) {
      console.log(`✅ Password comparison successful!`);
    } else {
      console.log(`❌ Password comparison failed!`);
      console.log('   This means passwords in DB might be incorrectly hashed');
    }

    // Test 4: Check events
    console.log('\n4. Checking events...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, status');

    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError);
    } else {
      console.log(`✅ Found ${events.length} events`);
      const approved = events.filter(e => e.status === 'approved').length;
      const pending = events.filter(e => e.status === 'pending').length;
      console.log(`   - ${approved} approved, ${pending} pending`);
    }

    console.log('\n✅ All tests completed!\n');
    console.log('📝 Login Credentials:');
    console.log('   Admin: admin@college-events.com / admin123');
    console.log('   User:  john@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test Error:', error);
    process.exit(1);
  }
};

testLogin();
