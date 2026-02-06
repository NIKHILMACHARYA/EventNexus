export const CATEGORIES = [
  { value: 'hackathon', label: '💻 Hackathon', icon: 'Laptop' },
  { value: 'coding-contest', label: '🏆 Coding Contest', icon: 'Code' },
  { value: 'workshop', label: '📚 Workshop', icon: 'BookOpen' },
  { value: 'seminar', label: '🎤 Seminar', icon: 'Mic' },
  { value: 'tech-talk', label: '💡 Tech Talk', icon: 'Mic' },
  { value: 'cultural', label: '🎭 Cultural', icon: 'Music' },
  { value: 'sports', label: '⚽ Sports', icon: 'Dumbbell' },
  { value: 'academic', label: '🎓 Academic', icon: 'GraduationCap' },
  { value: 'networking', label: '🤝 Networking', icon: 'Users' },
  { value: 'other', label: '📅 Other', icon: 'Calendar' }
];

export const EVENT_TYPES = [
  { value: 'online', label: '🌐 Online' },
  { value: 'offline', label: '📍 In-Person' },
  { value: 'hybrid', label: '🔄 Hybrid' }
];

export const CITIES = [
  'New Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Bhopal',
  'Vellore',
  'Pilani',
  'Kharagpur',
  'Kanpur',
  'Roorkee',
  'Guwahati',
  'Online'
];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export const POPULAR_COLLEGES = [
  'IIT Delhi',
  'IIT Bombay',
  'IIT Madras',
  'IIT Kanpur',
  'IIT Kharagpur',
  'IIT Roorkee',
  'IIT Guwahati',
  'IIT Hyderabad',
  'BITS Pilani',
  'NIT Trichy',
  'NIT Warangal',
  'NIT Karnataka',
  'IIIT Hyderabad',
  'IIIT Delhi',
  'VIT Vellore',
  'SRM University',
  'Anna University',
  'Delhi University',
  'IISc Bangalore',
  'IIM Bangalore',
  'IIM Ahmedabad',
  'Other'
];

export const STATUS_COLORS = {
  'draft': 'bg-gray-100 text-gray-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'approved': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800',
  'cancelled': 'bg-red-100 text-red-800',
  'completed': 'bg-blue-100 text-blue-800'
};

export const API_URL = 'http://localhost:5000/api';
