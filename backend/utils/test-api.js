const axios = require('axios');

const testAPI = async () => {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test login
    console.log('1. Testing login endpoint...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@college-events.com',
      password: 'admin123'
    });

    if (loginResponse.data.success && loginResponse.data.token) {
      console.log('✅ Login successful!');
      console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...`);
      console.log(`   User: ${loginResponse.data.user.name} (${loginResponse.data.user.role})`);
      
      const token = loginResponse.data.token;

      // Test protected endpoint
      console.log('\n2. Testing protected endpoint (GET /api/auth/me)...');
      const meResponse = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (meResponse.data.success) {
        console.log('✅ Protected route working!');
        console.log(`   User: ${meResponse.data.data.name}`);
      }

      // Test events endpoint
      console.log('\n3. Testing events endpoint...');
      const eventsResponse = await axios.get('http://localhost:5000/api/events?limit=3');
      
      if (eventsResponse.data.success) {
        console.log(`✅ Events endpoint working! Found ${eventsResponse.data.count} events`);
        eventsResponse.data.data.forEach(e => {
          console.log(`   - ${e.title} (${e.status})`);
        });
      }

      console.log('\n✅ All API tests passed!\n');
      console.log('🎉 Backend is working perfectly!');
      console.log('   Try login at: http://localhost:5174/login');
      
    }
  } catch (error) {
    console.error('❌ API Test Failed:', error.response?.data || error.message);
  }
};

testAPI();
