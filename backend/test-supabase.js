const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('🔍 Testing Supabase Connection...\n');

// Check if environment variables are loaded
console.log('Environment Variables:');
console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('- SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing');
console.log('- SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing required environment variables!');
    process.exit(1);
}

// Test connection
async function testConnection() {
    try {
        console.log('📡 Attempting to connect to Supabase...');
        console.log(`   URL: ${process.env.SUPABASE_URL}\n`);

        // First, try with SERVICE_KEY
        console.log('Test 1: Connection with SERVICE_KEY');
        let supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        try {
            const { data: healthData, error: healthError } = await supabase
                .from('users')
                .select('count')
                .limit(1);

            if (healthError && healthError.code !== 'PGRST116') {
                throw healthError;
            }
            console.log('✅ SERVICE_KEY connection successful!\n');
        } catch (serviceError) {
            console.error('❌ SERVICE_KEY failed:', serviceError.message);

            // Try with ANON_KEY as fallback
            if (process.env.SUPABASE_ANON_KEY) {
                console.log('\nTest 1b: Trying with ANON_KEY instead...');
                supabase = createClient(
                    process.env.SUPABASE_URL,
                    process.env.SUPABASE_ANON_KEY
                );

                const { data, error } = await supabase
                    .from('users')
                    .select('count')
                    .limit(1);

                if (error && error.code !== 'PGRST116') {
                    throw error;
                }
                console.log('✅ ANON_KEY connection successful!\n');
            } else {
                throw serviceError;
            }
        }

        // Test 2: List all tables
        console.log('Test 2: Checking Database Tables');
        const tables = ['users', 'events', 'favorites', 'notifications'];

        for (const table of tables) {
            const { data, error } = await supabase
                .from(table)
                .select('count')
                .limit(1);

            if (error && error.code === 'PGRST116') {
                console.log(`   ⚠️  Table '${table}' does not exist`);
            } else if (error) {
                console.log(`   ❌ Error accessing '${table}':`, error.message);
            } else {
                console.log(`   ✅ Table '${table}' exists and is accessible`);
            }
        }

        console.log('\n✅ All tests completed successfully!');
        console.log('🎉 Your Supabase connection is working!\n');

    } catch (error) {
        console.error('\n❌ Connection Test Failed!');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);

        if (error.cause) {
            console.error('Cause:', error.cause.message || error.cause);
        }

        console.log('\n💡 Troubleshooting Tips:');
        console.log('1. Check your internet connection');
        console.log('2. Verify Supabase credentials at: https://app.supabase.com');
        console.log('3. Ensure your Supabase project is active (not paused)');
        console.log('4. Check if a firewall/proxy is blocking the connection');
        console.log('5. Try using a VPN or different network');
        console.log('6. Check if Node.js can make HTTPS requests\n');

        process.exit(1);
    }
}

testConnection();
