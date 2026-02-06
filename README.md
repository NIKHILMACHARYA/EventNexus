# 🎓 College Event Aggregator Platform

A full-stack web application that aggregates and displays college events, hackathons, coding contests, workshops, and more. Students can discover, filter, save favorites, and even submit their own events!

![College Event Aggregator](https://via.placeholder.com/800x400?text=College+Event+Aggregator)

## 🚀 Features

### For Students
- 🔍 **Discover Events** - Browse hackathons, coding contests, workshops, seminars, cultural events, and more
- 🎯 **Smart Filtering** - Filter by category, date, location, college, and event type
- ❤️ **Save Favorites** - Bookmark events you're interested in
- 🔔 **Notifications** - Get notified about upcoming events and deadlines
- 📍 **Map View** - Visualize events on an interactive map
- 👤 **User Profiles** - Personalized dashboard with your events and preferences
- ➕ **Submit Events** - Share events with the community

### Event Categories
- 💻 Hackathons
- 🏆 Coding Contests
- 🎯 Challenges
- 📚 Workshops
- 🎤 Seminars & Tech Talks
- 🎭 Cultural Events
- ⚽ Sports Events
- 🎓 Academic Events

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **State Management** | React Context API |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |

## 📁 Project Structure

```
Event-Aggregator/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets
│   └── ...
├── server/                 # Node.js Backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd Event-Aggregator
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   
   Create `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/college-events
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events (with filters) |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create new event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| POST | `/api/events/:id/favorite` | Toggle favorite |
| GET | `/api/events/favorites` | Get user's favorites |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/users/my-events` | Get user's submitted events |

## 🎨 Screenshots

*Screenshots will be added after the UI is complete*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for college students everywhere!
