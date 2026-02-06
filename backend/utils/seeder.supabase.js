require('dotenv').config();
const { supabase } = require('../config/db');
const bcrypt = require('bcryptjs');

const sampleEvents = [
  {
    title: 'HackIndia 2026 - National Hackathon',
    description: 'India\'s largest 48-hour hackathon bringing together the brightest minds to solve real-world problems. Win prizes worth ₹10 lakhs and get mentorship from industry leaders.',
    category: 'hackathon',
    event_type: 'offline',
    date: new Date('2026-02-15T10:00:00'),
    end_date: new Date('2026-02-17T18:00:00'),
    venue: 'Main Auditorium',
    city: 'Mumbai',
    college: 'IIT Bombay',
    organizer: 'Tech Club IITB',
    registration_link: 'https://hackindia2026.tech',
    registration_fee: 0,
    registration_deadline: new Date('2026-02-10T23:59:59'),
    max_participants: 500,
    status: 'approved',
    tags: ['coding', 'innovation', 'prizes', 'mentorship'],
    requirements: ['Laptop', 'Team of 2-4 members', 'Student ID'],
    prizes: [
      { position: 'Winner', amount: 500000, currency: 'INR' },
      { position: 'Runner Up', amount: 300000, currency: 'INR' },
      { position: '2nd Runner Up', amount: 200000, currency: 'INR' },
    ],
  },
  {
    title: 'CodeChef March Challenge 2026',
    description: 'Monthly coding contest featuring 10 challenging problems. Compete with programmers worldwide and improve your algorithmic skills.',
    category: 'coding-contest',
    event_type: 'online',
    date: new Date('2026-03-01T15:00:00'),
    end_date: new Date('2026-03-10T15:00:00'),
    city: 'Online',
    college: 'CodeChef',
    organizer: 'CodeChef Team',
    registration_link: 'https://codechef.com/march26',
    registration_fee: 0,
    status: 'approved',
    tags: ['competitive-programming', 'algorithms', 'online'],
    requirements: ['CodeChef account', 'Basic programming knowledge'],
  },
  {
    title: 'AI/ML Workshop Series',
    description: 'Comprehensive 3-day workshop on Artificial Intelligence and Machine Learning. Learn from scratch with hands-on projects including computer vision and NLP.',
    category: 'workshop',
    event_type: 'hybrid',
    date: new Date('2026-02-20T10:00:00'),
    end_date: new Date('2026-02-22T17:00:00'),
    venue: 'CSE Department, Block A',
    city: 'Bangalore',
    college: 'IIIT Bangalore',
    organizer: 'AI Club IIITB',
    registration_link: 'https://iiitb.ai-workshop.com',
    registration_fee: 500,
    registration_deadline: new Date('2026-02-18T23:59:59'),
    max_participants: 100,
    status: 'approved',
    tags: ['AI', 'ML', 'Python', 'hands-on'],
    requirements: ['Laptop', 'Python basics', 'Google Colab account'],
  },
  {
    title: 'Google Cloud Next - Student Edition',
    description: 'Learn about cloud computing, DevOps, and modern deployment strategies. Free credits worth $300 for all attendees!',
    category: 'tech-talk',
    event_type: 'online',
    date: new Date('2026-02-25T16:00:00'),
    end_date: new Date('2026-02-25T18:00:00'),
    city: 'Online',
    college: 'Google for Students',
    organizer: 'Google Cloud Team',
    registration_link: 'https://cloud.google.com/students',
    registration_fee: 0,
    max_participants: 1000,
    status: 'approved',
    tags: ['cloud', 'DevOps', 'GCP', 'free-credits'],
    requirements: ['Google account'],
  },
  {
    title: 'TechFest 2026 - Innovation Challenge',
    description: 'Showcase your innovative projects and compete for funding opportunities. Categories include IoT, Web Development, Mobile Apps, and Hardware.',
    category: 'hackathon',
    event_type: 'offline',
    date: new Date('2026-03-10T09:00:00'),
    end_date: new Date('2026-03-12T20:00:00'),
    venue: 'College Grounds',
    city: 'Delhi',
    college: 'IIT Delhi',
    organizer: 'TechFest Committee',
    registration_link: 'https://techfest-iitd.com',
    registration_fee: 200,
    registration_deadline: new Date('2026-03-05T23:59:59'),
    max_participants: 300,
    status: 'approved',
    tags: ['innovation', 'projects', 'startup', 'funding'],
    requirements: ['Team of 2-5', 'Working prototype', 'Presentation'],
    prizes: [
      { position: 'Winner', amount: 300000, currency: 'INR' },
      { position: 'Runner Up', amount: 150000, currency: 'INR' },
    ],
  },
  {
    title: 'Web Development Bootcamp',
    description: 'Learn full-stack web development from industry experts. Build 5 real-world projects including e-commerce and social media apps.',
    category: 'workshop',
    event_type: 'offline',
    date: new Date('2026-02-28T10:00:00'),
    end_date: new Date('2026-03-02T17:00:00'),
    venue: 'IT Lab, 3rd Floor',
    city: 'Pune',
    college: 'MIT Pune',
    organizer: 'Web Dev Club',
    registration_link: 'https://mit-webdev.com',
    registration_fee: 1000,
    registration_deadline: new Date('2026-02-26T23:59:59'),
    max_participants: 50,
    status: 'approved',
    tags: ['web-development', 'React', 'Node.js', 'projects'],
    requirements: ['Laptop', 'Basic HTML/CSS knowledge'],
  },
  {
    title: 'Startup Pitch Competition',
    description: 'Present your startup idea to VCs and angel investors. Top 3 teams get seed funding and mentorship!',
    category: 'networking',
    event_type: 'offline',
    date: new Date('2026-03-05T14:00:00'),
    end_date: new Date('2026-03-05T18:00:00'),
    venue: 'Business School Auditorium',
    city: 'Hyderabad',
    college: 'ISB Hyderabad',
    organizer: 'Entrepreneurship Cell',
    registration_link: 'https://isb-pitch.com',
    registration_fee: 0,
    registration_deadline: new Date('2026-03-01T23:59:59'),
    max_participants: 20,
    status: 'pending',
    tags: ['startup', 'funding', 'entrepreneurship', 'pitch'],
    requirements: ['Business plan', 'Pitch deck', 'Team of 2-4'],
    prizes: [
      { position: 'Winner', amount: 1000000, currency: 'INR' },
    ],
  },
  {
    title: 'Cyber Security Awareness Seminar',
    description: 'Learn about latest cyber threats, ethical hacking, and how to protect yourself online. Certification provided.',
    category: 'seminar',
    event_type: 'hybrid',
    date: new Date('2026-02-18T11:00:00'),
    end_date: new Date('2026-02-18T15:00:00'),
    venue: 'Main Hall',
    city: 'Chennai',
    college: 'Anna University',
    organizer: 'Cyber Security Club',
    registration_link: 'https://anna-cybersec.edu',
    registration_fee: 200,
    max_participants: 200,
    status: 'approved',
    tags: ['cybersecurity', 'ethical-hacking', 'certification'],
    requirements: ['Student ID'],
  },
  {
    title: 'Data Science Competition',
    description: 'Solve real-world data science problems using machine learning. Dataset and problem statement will be revealed on day 1.',
    category: 'coding-contest',
    event_type: 'online',
    date: new Date('2026-03-15T10:00:00'),
    end_date: new Date('2026-03-22T22:00:00'),
    city: 'Online',
    college: 'Kaggle x Universities',
    organizer: 'Kaggle',
    registration_link: 'https://kaggle.com/uni-challenge',
    registration_fee: 0,
    status: 'approved',
    tags: ['data-science', 'ML', 'Kaggle', 'competition'],
    requirements: ['Kaggle account', 'Python/R knowledge'],
    prizes: [
      { position: 'Winner', amount: 200000, currency: 'INR' },
      { position: 'Runner Up', amount: 100000, currency: 'INR' },
    ],
  },
  {
    title: 'Mobile App Development Workshop',
    description: 'Build your first Android and iOS app in one weekend! Learn React Native and publish to app stores.',
    category: 'workshop',
    event_type: 'offline',
    date: new Date('2026-02-22T09:00:00'),
    end_date: new Date('2026-02-23T18:00:00'),
    venue: 'CS Lab',
    city: 'Kolkata',
    college: 'Jadavpur University',
    organizer: 'Mobile Dev Club',
    registration_link: 'https://ju-mobiledev.com',
    registration_fee: 800,
    registration_deadline: new Date('2026-02-20T23:59:59'),
    max_participants: 60,
    status: 'pending',
    tags: ['mobile-dev', 'React Native', 'Android', 'iOS'],
    requirements: ['Laptop', 'JavaScript basics', 'Node.js installed'],
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('password123', salt);

    // Clear existing data
    console.log('Clearing existing data...');
    await supabase.from('favorites').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Create users
    console.log('Creating users...');
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .insert([
        {
          name: 'Admin User',
          email: 'admin@college-events.com',
          password: adminPassword,
          role: 'admin',
          college: 'Platform Admin',
        },
      ])
      .select()
      .single();

    if (adminError) throw adminError;

    const { data: regularUser, error: userError } = await supabase
      .from('users')
      .insert([
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: userPassword,
          role: 'user',
          college: 'IIT Bombay',
        },
      ])
      .select()
      .single();

    if (userError) throw userError;

    console.log('✅ Users created successfully');

    // Only seed sample events in development
    if (!isProduction) {
      // Assign organizer IDs to events
      const eventsWithOrganizers = sampleEvents.map((event, index) => ({
        ...event,
        organizer_id: index % 2 === 0 ? adminUser.id : regularUser.id,
      }));

      // Create events
      console.log('Creating events...');
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .insert(eventsWithOrganizers)
        .select();

      if (eventsError) throw eventsError;

      console.log('✅ Events created successfully');

      // Add some favorites
      if (events && events.length >= 3) {
        await supabase.from('favorites').insert([
          { user_id: regularUser.id, event_id: events[0].id },
          { user_id: regularUser.id, event_id: events[1].id },
          { user_id: regularUser.id, event_id: events[2].id },
        ]);
        console.log('✅ Favorites added');
      }

      console.log(`\n📊 Created ${events.length} events`);
    } else {
      console.log('\n⚠️  PRODUCTION: Skipping sample events. Use admin panel to create real events.');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Admin Account:');
    console.log('Email: admin@college-events.com');
    console.log('Password: admin123');
    if (!isProduction) {
      console.log('\nUser Account:');
      console.log('Email: john@example.com');
      console.log('Password: password123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedDatabase();
