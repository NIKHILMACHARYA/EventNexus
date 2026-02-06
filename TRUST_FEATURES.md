# 🛡️ Trust & Safety Features for College Event Aggregator

## Current Trust Mechanisms (Built-in)

### 1. Event Approval Workflow ✅
- **Status**: Every event has a lifecycle status
  ```
  pending → admin review → approved/rejected
  ```
- **Visibility**: Only approved events show to public users
- **Accountability**: All submissions linked to user accounts

### 2. User Authentication ✅
- JWT-based authentication
- Email required for registration
- User profile tracking

### 3. Admin Moderation ✅
- Admin role with special permissions
- Can approve/reject events
- Can edit/delete inappropriate content
- View all pending submissions

### 4. Organizer Verification ✅
- College/Organization name required
- Contact information mandatory
- Event location details

---

## Recommended Enhancements

### Priority 1: Email Verification

**Implementation:**
```javascript
// Add to User model
emailVerified: { type: Boolean, default: false },
emailVerificationToken: String,
emailVerificationExpires: Date

// Only allow event submission if email verified
if (!user.emailVerified) {
  throw new Error('Please verify your email first');
}
```

**Benefits:**
- Ensures real email addresses
- Reduces spam accounts
- Adds accountability layer

---

### Priority 2: College Email Verification

**Implementation:**
```javascript
// Validate college email domains
const collegeEmailDomains = [
  '@iitd.ac.in',
  '@iitb.ac.in',
  '@bits-pilani.ac.in',
  // ... more
];

// Only allow event submission from verified college emails
const emailDomain = user.email.split('@')[1];
if (!collegeEmailDomains.includes(`@${emailDomain}`)) {
  event.requiresAdminApproval = true;
}
```

**Benefits:**
- Automatically trusts verified college accounts
- Fast-track approval for official organizers
- Reduces fake event submissions

---

### Priority 3: Event Reporting System

**Implementation:**
```javascript
// Add to Event model
reports: [{
  user: { type: ObjectId, ref: 'User' },
  reason: String,
  createdAt: Date
}],
reportCount: { type: Number, default: 0 }

// Auto-hide if reports exceed threshold
if (event.reportCount > 5) {
  event.status = 'under-review';
}
```

**Features:**
- Users can report suspicious events
- Reasons: Fake, Spam, Inappropriate, Scam
- Auto-flag high-report events
- Admin dashboard for reports

---

### Priority 4: Event Source Verification

**Implementation:**
```javascript
// Add verification badges
eventSource: {
  type: String,
  enum: ['official', 'community', 'unverified'],
  default: 'unverified'
},
verified: { type: Boolean, default: false }
```

**Display:**
- ✅ Official (verified college account)
- 👥 Community (approved user submission)
- ⏳ Unverified (pending review)

---

### Priority 5: Registration Link Validation

**Implementation:**
```javascript
// Check if registration link is active
const validateRegistrationLink = async (url) => {
  try {
    const response = await axios.head(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Warn users if link is broken
if (!validateRegistrationLink(event.registration.link)) {
  event.warnings.push('Registration link may be inactive');
}
```

---

### Priority 6: Historical Data & Reputation

**Implementation:**
```javascript
// Add to User model
reputation: {
  eventsCreated: { type: Number, default: 0 },
  eventsCompleted: { type: Number, default: 0 },
  reportedEvents: { type: Number, default: 0 },
  trustScore: { type: Number, default: 50 } // 0-100
}

// Calculate trust score
trustScore = (eventsCompleted / eventsCreated) * 100 
           - (reportedEvents * 10);
```

**Benefits:**
- Track organizer history
- Show reliability metrics
- Reward consistent organizers
- Penalize fake event creators

---

### Priority 7: Social Proof

**Implementation:**
```javascript
// Add to Event model
attendees: [{
  user: { type: ObjectId, ref: 'User' },
  status: { type: String, enum: ['interested', 'going', 'attended'] }
}],
attendeeCount: { type: Number, default: 0 },
reviewsAfterEvent: [{
  user: { type: ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String
}]
```

**Display:**
- "125 people interested"
- "Attended by students from 15 colleges"
- Post-event reviews and ratings
- Photos from past events

---

### Priority 8: Admin Dashboard Improvements

**Features to Add:**
- Pending events queue with sorting
- Quick approve/reject buttons
- Event analytics (views, registrations)
- Flagged events section
- User reputation scores
- Bulk actions

---

### Priority 9: Two-Factor Authentication (2FA)

**For Admin Accounts:**
```javascript
// Add to User model
twoFactorEnabled: { type: Boolean, default: false },
twoFactorSecret: String,

// Require 2FA for admin actions
if (user.role === 'admin' && !verifyTOTP(token)) {
  throw new Error('Invalid 2FA code');
}
```

---

### Priority 10: Event Duplicate Detection

**Implementation:**
```javascript
// Check for similar events
const checkDuplicates = async (newEvent) => {
  const similar = await Event.find({
    title: { $regex: newEvent.title, $options: 'i' },
    'date.start': {
      $gte: new Date(newEvent.date.start - 7 * 24 * 60 * 60 * 1000),
      $lte: new Date(newEvent.date.start + 7 * 24 * 60 * 60 * 1000)
    },
    'location.city': newEvent.location.city
  });
  
  return similar;
};
```

---

## Implementation Roadmap

### Phase 1 (Week 1-2)
- [ ] Email verification system
- [ ] Event reporting feature
- [ ] Admin dashboard improvements

### Phase 2 (Week 3-4)
- [ ] College email domain verification
- [ ] Event source badges
- [ ] User reputation system

### Phase 3 (Week 5-6)
- [ ] Social proof features (attendees, reviews)
- [ ] Registration link validation
- [ ] Duplicate detection

### Phase 4 (Week 7-8)
- [ ] 2FA for admin accounts
- [ ] Advanced analytics
- [ ] Machine learning for spam detection

---

## Best Practices for Users

### For Organizers:
1. Use official college email
2. Provide complete event details
3. Add valid registration links
4. Include contact information
5. Update event if details change

### For Attendees:
1. Check event source badge
2. Verify organizer information
3. Look for social proof (attendees count)
4. Check registration link before deadline
5. Report suspicious events

### For Admins:
1. Verify college/organization
2. Check registration links
3. Cross-check event details with official sources
4. Monitor user reputation scores
5. Investigate reported events quickly

---

## Quick Trust Score Calculation

```javascript
Event Trust Score = 
  + 30 points (Official college account)
  + 20 points (Email verified)
  + 15 points (Valid registration link)
  + 10 points (Complete event details)
  + 10 points (Past successful events)
  + 10 points (High organizer reputation)
  + 5 points  (Social proof - attendees)
  - 50 points (Reports > 5)
  
Total: 0-100 points
- 80-100: Highly Trusted (✅)
- 50-79:  Verified (👍)
- 20-49:  Needs Review (⚠️)
- 0-19:   Suspicious (🚫)
```

---

## Automated Checks

1. **Registration Link Check**: Every 6 hours
2. **Event Date Validation**: Flag if start date passed
3. **Duplicate Detection**: On submission
4. **Spam Detection**: Pattern matching
5. **Reputation Updates**: After each event

---

## Database Setup for MongoDB

Make sure MongoDB is running first:

### Option 1: Local MongoDB
```bash
# Install MongoDB from mongodb.com
# Start MongoDB service
mongod
```

### Option 2: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college-events
   ```

Then run the seeder:
```bash
cd server
npm run seed
```
