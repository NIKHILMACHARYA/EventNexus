const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'hackathon',
      'coding-contest',
      'workshop',
      'seminar',
      'tech-talk',
      'cultural',
      'sports',
      'academic',
      'networking',
      'other'
    ]
  },
  eventType: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    default: 'offline'
  },
  image: {
    type: String,
    default: ''
  },
  date: {
    start: {
      type: Date,
      required: [true, 'Please provide start date']
    },
    end: {
      type: Date
    }
  },
  registrationDeadline: {
    type: Date
  },
  time: {
    start: String,
    end: String
  },
  location: {
    venue: {
      type: String
    },
    address: {
      type: String
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    state: {
      type: String
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  college: {
    name: {
      type: String,
      required: [true, 'Please provide college/organization name']
    },
    logo: String
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contact: {
    email: String,
    phone: String,
    website: String
  },
  registration: {
    required: {
      type: Boolean,
      default: true
    },
    link: String,
    fee: {
      type: Number,
      default: 0
    },
    maxParticipants: Number,
    currentParticipants: {
      type: Number,
      default: 0
    }
  },
  prizes: [{
    position: String,
    prize: String,
    amount: Number
  }],
  tags: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String
  }],
  schedule: [{
    time: String,
    activity: String
  }],
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  favoritesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes for searching
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });
eventSchema.index({ 'date.start': 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ 'location.city': 1 });

module.exports = mongoose.model('Event', eventSchema);
