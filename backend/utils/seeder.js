const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Event = require('../models/Event');

dotenv.config();

const sampleEvents = [
  {
    title: 'HackFest 2026 - National Level Hackathon',
    description: 'Join us for the biggest hackathon of the year! HackFest 2026 brings together the brightest minds to solve real-world problems. Build innovative solutions in 36 hours and win exciting prizes worth ₹5,00,000. Open to all college students across India.',
    shortDescription: '36-hour national hackathon with prizes worth ₹5 lakhs',
    category: 'hackathon',
    eventType: 'offline',
    date: {
      start: new Date('2026-02-15'),
      end: new Date('2026-02-16')
    },
    registrationDeadline: new Date('2026-02-10'),
    time: {
      start: '09:00 AM',
      end: '09:00 PM'
    },
    location: {
      venue: 'Main Auditorium',
      address: 'IIT Delhi Campus',
      city: 'New Delhi',
      state: 'Delhi',
      coordinates: { lat: 28.5459, lng: 77.1926 }
    },
    college: {
      name: 'IIT Delhi'
    },
    contact: {
      email: 'hackfest@iitd.ac.in',
      phone: '+91 9876543210',
      website: 'https://hackfest.iitd.ac.in'
    },
    registration: {
      required: true,
      link: 'https://hackfest.iitd.ac.in/register',
      fee: 0,
      maxParticipants: 500
    },
    prizes: [
      { position: '1st', prize: 'Cash Prize', amount: 200000 },
      { position: '2nd', prize: 'Cash Prize', amount: 100000 },
      { position: '3rd', prize: 'Cash Prize', amount: 50000 }
    ],
    tags: ['hackathon', 'coding', 'innovation', 'startup', 'tech'],
    requirements: ['Laptop', 'Student ID', 'Team of 2-4 members'],
    status: 'approved',
    featured: true
  },
  {
    title: 'CodeWars - Competitive Programming Contest',
    description: 'Test your algorithmic skills in this intense competitive programming contest. Solve challenging problems in 3 hours and climb the leaderboard. Top performers get internship opportunities at leading tech companies.',
    shortDescription: 'Competitive programming contest with internship opportunities',
    category: 'coding-contest',
    eventType: 'online',
    date: {
      start: new Date('2026-02-20'),
      end: new Date('2026-02-20')
    },
    registrationDeadline: new Date('2026-02-18'),
    time: {
      start: '06:00 PM',
      end: '09:00 PM'
    },
    location: {
      city: 'Online',
      state: 'Pan India'
    },
    college: {
      name: 'NIT Trichy'
    },
    contact: {
      email: 'codewars@nitt.edu',
      website: 'https://codewars.nitt.edu'
    },
    registration: {
      required: true,
      link: 'https://codewars.nitt.edu/register',
      fee: 0,
      maxParticipants: 2000
    },
    prizes: [
      { position: '1st', prize: 'Internship + Cash', amount: 50000 },
      { position: '2nd', prize: 'Cash Prize', amount: 25000 },
      { position: '3rd', prize: 'Cash Prize', amount: 10000 }
    ],
    tags: ['competitive-programming', 'algorithms', 'data-structures', 'coding'],
    requirements: ['HackerRank account', 'Basic programming knowledge'],
    status: 'approved',
    featured: true
  },
  {
    title: 'Web Development Bootcamp',
    description: 'A comprehensive 2-day workshop covering modern web development with React, Node.js, and MongoDB. Learn from industry experts and build a full-stack project by the end of the workshop.',
    shortDescription: 'Learn full-stack web development in 2 days',
    category: 'workshop',
    eventType: 'hybrid',
    date: {
      start: new Date('2026-02-25'),
      end: new Date('2026-02-26')
    },
    registrationDeadline: new Date('2026-02-22'),
    time: {
      start: '10:00 AM',
      end: '05:00 PM'
    },
    location: {
      venue: 'Computer Science Department',
      address: 'BITS Pilani Campus',
      city: 'Pilani',
      state: 'Rajasthan',
      coordinates: { lat: 28.3639, lng: 75.5870 }
    },
    college: {
      name: 'BITS Pilani'
    },
    contact: {
      email: 'webdev@bits-pilani.ac.in',
      phone: '+91 9123456789'
    },
    registration: {
      required: true,
      link: 'https://bits-pilani.ac.in/webdev',
      fee: 500,
      maxParticipants: 100
    },
    tags: ['web-development', 'react', 'nodejs', 'mongodb', 'javascript'],
    requirements: ['Laptop', 'Basic HTML/CSS knowledge', 'VS Code installed'],
    schedule: [
      { time: '10:00 AM', activity: 'Introduction to Modern Web Development' },
      { time: '11:30 AM', activity: 'React Fundamentals' },
      { time: '02:00 PM', activity: 'Building APIs with Node.js' },
      { time: '04:00 PM', activity: 'Project Work' }
    ],
    status: 'approved',
    featured: false
  },
  {
    title: 'AI/ML Summit 2026',
    description: 'Annual AI/ML summit featuring talks from leading researchers and industry professionals. Learn about the latest trends in artificial intelligence, machine learning, and deep learning.',
    shortDescription: 'Premier AI/ML conference with expert speakers',
    category: 'seminar',
    eventType: 'offline',
    date: {
      start: new Date('2026-03-01'),
      end: new Date('2026-03-02')
    },
    registrationDeadline: new Date('2026-02-25'),
    time: {
      start: '09:00 AM',
      end: '06:00 PM'
    },
    location: {
      venue: 'Convention Center',
      address: 'IISc Campus',
      city: 'Bangalore',
      state: 'Karnataka',
      coordinates: { lat: 13.0219, lng: 77.5671 }
    },
    college: {
      name: 'Indian Institute of Science'
    },
    contact: {
      email: 'aiml@iisc.ac.in',
      website: 'https://aiml-summit.iisc.ac.in'
    },
    registration: {
      required: true,
      link: 'https://aiml-summit.iisc.ac.in/register',
      fee: 1000,
      maxParticipants: 500
    },
    tags: ['ai', 'machine-learning', 'deep-learning', 'data-science', 'research'],
    status: 'approved',
    featured: true
  },
  {
    title: 'Tech Talk: Building Scalable Systems',
    description: 'Join us for an insightful tech talk on building scalable distributed systems. Guest speaker from Google will share experiences from building large-scale infrastructure.',
    shortDescription: 'Learn system design from Google engineer',
    category: 'tech-talk',
    eventType: 'online',
    date: {
      start: new Date('2026-02-18'),
      end: new Date('2026-02-18')
    },
    time: {
      start: '07:00 PM',
      end: '09:00 PM'
    },
    location: {
      city: 'Online',
      state: 'Pan India'
    },
    college: {
      name: 'VIT Vellore'
    },
    contact: {
      email: 'techtalks@vit.ac.in'
    },
    registration: {
      required: true,
      link: 'https://vit.ac.in/techtalk',
      fee: 0,
      maxParticipants: 1000
    },
    tags: ['system-design', 'distributed-systems', 'google', 'tech-talk', 'scalability'],
    status: 'approved',
    featured: false
  },
  {
    title: 'Annual Cultural Fest - Riviera 2026',
    description: 'VIT\'s flagship cultural festival featuring music, dance, drama, and art competitions. 4 days of non-stop entertainment with celebrity performances and exciting prizes.',
    shortDescription: 'Biggest cultural fest with celebrity performances',
    category: 'cultural',
    eventType: 'offline',
    date: {
      start: new Date('2026-03-10'),
      end: new Date('2026-03-13')
    },
    registrationDeadline: new Date('2026-03-05'),
    time: {
      start: '10:00 AM',
      end: '11:00 PM'
    },
    location: {
      venue: 'VIT University Campus',
      address: 'Vellore Main Campus',
      city: 'Vellore',
      state: 'Tamil Nadu',
      coordinates: { lat: 12.9692, lng: 79.1559 }
    },
    college: {
      name: 'VIT University'
    },
    contact: {
      email: 'riviera@vit.ac.in',
      website: 'https://riviera.vit.ac.in'
    },
    registration: {
      required: false,
      fee: 0
    },
    tags: ['cultural', 'fest', 'music', 'dance', 'entertainment'],
    status: 'approved',
    featured: true
  },
  {
    title: 'Inter-College Cricket Tournament',
    description: 'Annual inter-college cricket tournament featuring teams from top engineering colleges. T20 format with exciting matches and prizes.',
    shortDescription: 'T20 cricket tournament for engineering colleges',
    category: 'sports',
    eventType: 'offline',
    date: {
      start: new Date('2026-03-05'),
      end: new Date('2026-03-08')
    },
    registrationDeadline: new Date('2026-02-28'),
    time: {
      start: '08:00 AM',
      end: '06:00 PM'
    },
    location: {
      venue: 'Sports Complex',
      address: 'Anna University Campus',
      city: 'Chennai',
      state: 'Tamil Nadu',
      coordinates: { lat: 13.0108, lng: 80.2354 }
    },
    college: {
      name: 'Anna University'
    },
    contact: {
      email: 'sports@annauniv.edu',
      phone: '+91 9876543210'
    },
    registration: {
      required: true,
      link: 'https://annauniv.edu/cricket',
      fee: 2000,
      maxParticipants: 16
    },
    prizes: [
      { position: '1st', prize: 'Trophy + Cash', amount: 50000 },
      { position: '2nd', prize: 'Cash Prize', amount: 25000 }
    ],
    tags: ['cricket', 'sports', 't20', 'tournament', 'inter-college'],
    status: 'approved',
    featured: false
  },
  {
    title: 'Research Paper Presentation - ICSE 2026',
    description: 'International conference on software engineering. Present your research papers and get feedback from renowned academics and industry experts.',
    shortDescription: 'International software engineering conference',
    category: 'academic',
    eventType: 'hybrid',
    date: {
      start: new Date('2026-03-15'),
      end: new Date('2026-03-17')
    },
    registrationDeadline: new Date('2026-02-15'),
    time: {
      start: '09:00 AM',
      end: '05:00 PM'
    },
    location: {
      venue: 'Academic Block',
      address: 'IIT Bombay Campus',
      city: 'Mumbai',
      state: 'Maharashtra',
      coordinates: { lat: 19.1334, lng: 72.9133 }
    },
    college: {
      name: 'IIT Bombay'
    },
    contact: {
      email: 'icse2026@iitb.ac.in',
      website: 'https://icse2026.iitb.ac.in'
    },
    registration: {
      required: true,
      link: 'https://icse2026.iitb.ac.in/register',
      fee: 2500,
      maxParticipants: 300
    },
    tags: ['research', 'software-engineering', 'academic', 'conference', 'paper-presentation'],
    status: 'approved',
    featured: false
  },
  {
    title: 'Startup Networking Night',
    description: 'Connect with fellow entrepreneurs, investors, and mentors. Pitch your ideas, find co-founders, and explore funding opportunities.',
    shortDescription: 'Network with entrepreneurs and investors',
    category: 'networking',
    eventType: 'offline',
    date: {
      start: new Date('2026-02-22'),
      end: new Date('2026-02-22')
    },
    time: {
      start: '06:00 PM',
      end: '10:00 PM'
    },
    location: {
      venue: 'E-Cell Hub',
      address: 'NSRCEL, IIM Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      coordinates: { lat: 12.9916, lng: 77.5712 }
    },
    college: {
      name: 'IIM Bangalore'
    },
    contact: {
      email: 'ecell@iimb.ac.in'
    },
    registration: {
      required: true,
      link: 'https://iimb.ac.in/startup-night',
      fee: 200,
      maxParticipants: 150
    },
    tags: ['startup', 'networking', 'entrepreneurship', 'investors', 'pitch'],
    status: 'approved',
    featured: false
  },
  {
    title: 'Capture The Flag - Cybersecurity Challenge',
    description: 'Test your cybersecurity skills in this exciting CTF competition. Solve challenges in web security, cryptography, reverse engineering, and more.',
    shortDescription: 'Cybersecurity CTF competition',
    category: 'coding-contest',
    eventType: 'online',
    date: {
      start: new Date('2026-02-28'),
      end: new Date('2026-03-01')
    },
    registrationDeadline: new Date('2026-02-26'),
    time: {
      start: '12:00 PM',
      end: '12:00 PM'
    },
    location: {
      city: 'Online',
      state: 'Global'
    },
    college: {
      name: 'IIIT Hyderabad'
    },
    contact: {
      email: 'ctf@iiit.ac.in',
      website: 'https://ctf.iiit.ac.in'
    },
    registration: {
      required: true,
      link: 'https://ctf.iiit.ac.in/register',
      fee: 0,
      maxParticipants: 500
    },
    prizes: [
      { position: '1st', prize: 'Cash + Swag', amount: 30000 },
      { position: '2nd', prize: 'Cash Prize', amount: 15000 },
      { position: '3rd', prize: 'Cash Prize', amount: 5000 }
    ],
    tags: ['ctf', 'cybersecurity', 'hacking', 'security', 'cryptography'],
    requirements: ['Basic cybersecurity knowledge', 'Kali Linux recommended'],
    status: 'approved',
    featured: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await Event.deleteMany({});
    await User.deleteMany({});
    console.log('Data cleared');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@college-events.com',
      password: 'admin123',
      role: 'admin',
      college: 'System Administrator',
      isVerified: true
    });
    console.log('Admin user created');

    // Create sample user
    const sampleUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
      college: 'IIT Delhi',
      isVerified: true
    });
    console.log('Sample user created');

    // Add organizer to events and create them
    const eventsWithOrganizer = sampleEvents.map(event => ({
      ...event,
      organizer: adminUser._id
    }));

    await Event.insertMany(eventsWithOrganizer);
    console.log('Sample events created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Test Accounts:');
    console.log('   Admin: admin@college-events.com / admin123');
    console.log('   User:  john@example.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
