# 🏗️ System Architecture Design - College Event Aggregator

## 📋 Executive Summary

The **College Event Aggregator** is a full-stack web application designed to centralize college events, hackathons, coding contests, workshops, and cultural activities. The platform enables students to discover, filter, save, and submit events while providing administrators with tools to manage and approve submissions.

**Technology Stack:**
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: React Context API

---

## 🎯 System Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[React Application]
        C[Vite Dev Server]
    end
    
    subgraph "Application Layer"
        D[Express.js Server]
        E[REST API Endpoints]
        F[Middleware Layer]
        G[Controllers]
    end
    
    subgraph "Data Layer"
        H[Supabase PostgreSQL]
        I[Authentication Service]
        J[Storage Service]
    end
    
    subgraph "External Services"
        K[Email Service]
        L[Notification Service]
    end
    
    A --> B
    B --> C
    B -->|HTTP/HTTPS| E
    E --> F
    F --> G
    G --> H
    G --> I
    G --> J
    G --> K
    G --> L
    
    style A fill:#e1f5ff
    style B fill:#bbdefb
    style D fill:#c8e6c9
    style H fill:#fff9c4
```

---

## 🏛️ Architecture Layers

### 1. **Presentation Layer** (Frontend)

The client-side application built with React provides an interactive user interface.

```mermaid
graph LR
    subgraph "React Application Structure"
        A[App.jsx] --> B[Router]
        B --> C[Pages]
        B --> D[Components]
        
        C --> C1[Home]
        C --> C2[Events]
        C --> C3[Dashboard]
        C --> C4[Profile]
        C --> C5[Admin]
        
        D --> D1[Layout Components]
        D --> D2[Event Components]
        D --> D3[Auth Components]
        D --> D4[Common Components]
        
        E[Context Providers] --> E1[AuthContext]
        E --> E2[EventContext]
        E --> E3[NotificationContext]
        
        F[Services] --> F1[API Service]
        F --> F2[Auth Service]
        F --> F3[Event Service]
        F --> F4[Notification Service]
    end
    
    style A fill:#4fc3f7
    style E fill:#81c784
    style F fill:#ffb74d
```

**Key Features:**
- **Responsive Design**: Tailwind CSS for mobile-first responsive layouts
- **Component-Based Architecture**: Reusable React components
- **State Management**: Context API for global state
- **Client-Side Routing**: React Router for SPA navigation
- **API Integration**: Axios for HTTP requests

**Directory Structure:**
```
frontend/src/
├── components/
│   ├── auth/          # Login, Register components
│   ├── common/        # Shared UI components
│   ├── events/        # Event cards, filters
│   └── layout/        # Navbar, Footer, Sidebar
├── pages/             # Route-level components
├── context/           # React Context providers
├── services/          # API service modules
└── utils/             # Helper functions
```

---

### 2. **Application Layer** (Backend)

The server-side application built with Node.js and Express handles business logic and API requests.

```mermaid
graph TB
    subgraph "Express Server Architecture"
        A[server.js] --> B[Middleware Stack]
        
        B --> B1[CORS]
        B --> B2[Body Parser]
        B --> B3[Error Handler]
        B --> B4[Auth Middleware]
        
        C[Routes] --> C1[/api/auth]
        C --> C2[/api/events]
        C --> C3[/api/notifications]
        
        C1 --> D1[authController]
        C2 --> D2[eventController]
        C3 --> D3[notificationController]
        
        D1 --> E[Models]
        D2 --> E
        D3 --> E
        
        E --> E1[User Model]
        E --> E2[Event Model]
        E --> E3[Notification Model]
        
        F[Utils] --> F1[JWT Helper]
        F --> F2[Validators]
        F --> F3[Seeders]
    end
    
    style A fill:#66bb6a
    style B fill:#ffa726
    style C fill:#42a5f5
    style E fill:#ab47bc
```

**Directory Structure:**
```
backend/
├── config/
│   └── db.js              # Supabase connection
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   └── notificationController.js
├── middleware/
│   ├── auth.js            # JWT verification
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Event.js
│   └── supabase/          # Supabase models
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   └── notificationRoutes.js
├── utils/
│   └── seeder.supabase.js
└── server.js              # Entry point
```

---

### 3. **Data Layer** (Database)

Supabase PostgreSQL provides a robust, cloud-hosted database solution.

```mermaid
erDiagram
    USERS ||--o{ EVENTS : creates
    USERS ||--o{ FAVORITES : has
    USERS ||--o{ NOTIFICATIONS : receives
    EVENTS ||--o{ FAVORITES : "favorited by"
    EVENTS ||--o{ NOTIFICATIONS : triggers
    
    USERS {
        uuid id PK
        string email UK
        string password
        string name
        string college
        string role
        timestamp created_at
        timestamp updated_at
    }
    
    EVENTS {
        uuid id PK
        string title
        text description
        string category
        string event_type
        date event_date
        string location
        string college
        string organizer
        string registration_link
        string image_url
        string status
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    FAVORITES {
        uuid id PK
        uuid user_id FK
        uuid event_id FK
        timestamp created_at
    }
    
    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        uuid event_id FK
        string type
        string message
        boolean is_read
        timestamp created_at
    }
```

**Database Tables:**

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts and profiles | id, email, password, role, college |
| `events` | Event listings | id, title, category, event_date, status, created_by |
| `favorites` | User's saved events | user_id, event_id |
| `notifications` | User notifications | user_id, event_id, type, message, is_read |

---

## 🔄 Data Flow Architecture

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Supabase
    
    U->>F: Enter credentials
    F->>B: POST /api/auth/login
    B->>DB: Query user by email
    DB-->>B: User data
    B->>B: Verify password (bcrypt)
    B->>B: Generate JWT token
    B-->>F: Return token + user data
    F->>F: Store token in localStorage
    F->>F: Update AuthContext
    F-->>U: Redirect to dashboard
    
    Note over F,B: Subsequent requests include JWT in headers
    
    F->>B: GET /api/events (with JWT)
    B->>B: Verify JWT token
    B->>DB: Fetch events
    DB-->>B: Events data
    B-->>F: Return events
```

### Event Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Supabase
    participant N as Notification Service
    
    U->>F: Fill event form
    F->>F: Validate input
    F->>B: POST /api/events (with JWT)
    B->>B: Verify authentication
    B->>B: Validate event data
    B->>DB: Insert event (status: pending)
    DB-->>B: Event created
    B->>N: Notify admins
    B-->>F: Success response
    F-->>U: Show success message
    
    Note over B,N: Admin receives notification
    
    U->>F: Admin approves event
    F->>B: PUT /api/events/:id
    B->>DB: Update status to approved
    DB-->>B: Updated
    B->>N: Notify event creator
    B-->>F: Success
```

### Event Discovery Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Supabase
    
    U->>F: Browse events page
    F->>B: GET /api/events?category=hackathon&date=upcoming
    B->>DB: Query with filters
    DB-->>B: Filtered events
    B-->>F: Events array
    F->>F: Render event cards
    
    U->>F: Click favorite icon
    F->>B: POST /api/events/:id/favorite
    B->>DB: Insert into favorites table
    DB-->>B: Success
    B-->>F: Updated event
    F->>F: Update UI
```

---

## 🔐 Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        A[Client Security]
        B[Transport Security]
        C[Application Security]
        D[Database Security]
    end
    
    A --> A1[Input Validation]
    A --> A2[XSS Prevention]
    A --> A3[CSRF Protection]
    
    B --> B1[HTTPS/TLS]
    B --> B2[CORS Policy]
    
    C --> C1[JWT Authentication]
    C --> C2[Password Hashing - bcrypt]
    C --> C3[Role-Based Access Control]
    C --> C4[Rate Limiting]
    C --> C5[Input Sanitization]
    
    D --> D1[Row Level Security]
    D --> D2[Prepared Statements]
    D --> D3[Encrypted Connections]
    
    style A fill:#ef5350
    style B fill:#ffa726
    style C fill:#66bb6a
    style D fill:#42a5f5
```

**Security Measures:**

1. **Authentication & Authorization**
   - JWT tokens with 7-day expiration
   - bcrypt password hashing (10 rounds)
   - Role-based access control (admin, user)
   - Protected routes with auth middleware

2. **Data Protection**
   - Environment variables for sensitive data
   - HTTPS for production
   - Supabase service keys (never exposed to client)
   - SQL injection prevention via parameterized queries

3. **API Security**
   - CORS configuration for allowed origins
   - Request validation with express-validator
   - Error handling without exposing internals
   - Rate limiting (future enhancement)

---

## 🌐 API Architecture

### REST API Endpoints

```mermaid
graph LR
    subgraph "API Routes"
        A[/api] --> B[/auth]
        A --> C[/events]
        A --> D[/notifications]
        
        B --> B1[POST /register]
        B --> B2[POST /login]
        B --> B3[GET /me]
        B --> B4[PUT /profile]
        
        C --> C1[GET /]
        C --> C2[GET /:id]
        C --> C3[POST /]
        C --> C4[PUT /:id]
        C --> C5[DELETE /:id]
        C --> C6[POST /:id/favorite]
        C --> C7[GET /favorites]
        
        D --> D1[GET /]
        D --> D2[PUT /:id/read]
        D --> D3[DELETE /:id]
    end
    
    style B fill:#4fc3f7
    style C fill:#81c784
    style D fill:#ffb74d
```

**API Endpoint Details:**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | ❌ | Register new user |
| `/api/auth/login` | POST | ❌ | Login user |
| `/api/auth/me` | GET | ✅ | Get current user |
| `/api/auth/profile` | PUT | ✅ | Update profile |
| `/api/events` | GET | ❌ | Get all events (with filters) |
| `/api/events/:id` | GET | ❌ | Get single event |
| `/api/events` | POST | ✅ | Create event |
| `/api/events/:id` | PUT | ✅ | Update event (owner/admin) |
| `/api/events/:id` | DELETE | ✅ | Delete event (owner/admin) |
| `/api/events/:id/favorite` | POST | ✅ | Toggle favorite |
| `/api/events/favorites` | GET | ✅ | Get user favorites |
| `/api/notifications` | GET | ✅ | Get user notifications |
| `/api/notifications/:id/read` | PUT | ✅ | Mark as read |
| `/api/notifications/:id` | DELETE | ✅ | Delete notification |

---

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        A[Domain/DNS]
        
        subgraph "Frontend Hosting"
            B[Vercel/Netlify]
            C[CDN]
        end
        
        subgraph "Backend Hosting"
            D[Render/Railway/Heroku]
            E[Node.js Server]
        end
        
        subgraph "Database"
            F[Supabase Cloud]
            G[PostgreSQL]
            H[Backup Service]
        end
        
        subgraph "Monitoring"
            I[Error Tracking]
            J[Analytics]
            K[Logging]
        end
    end
    
    A --> B
    B --> C
    A --> D
    D --> E
    E --> F
    F --> G
    F --> H
    E --> I
    B --> J
    E --> K
    
    style B fill:#00bcd4
    style D fill:#66bb6a
    style F fill:#ffa726
    style I fill:#ef5350
```

**Deployment Strategy:**

| Component | Platform | Configuration |
|-----------|----------|---------------|
| **Frontend** | Vercel/Netlify | Auto-deploy from Git, CDN, HTTPS |
| **Backend** | Render/Railway | Node.js environment, Auto-scaling |
| **Database** | Supabase | Managed PostgreSQL, Auto-backups |
| **Environment** | Production | NODE_ENV=production, Secure keys |

---

## 📊 System Components

### Frontend Components

```mermaid
graph TB
    subgraph "Page Components"
        A[Home.jsx]
        B[Events.jsx]
        C[EventDetail.jsx]
        D[CreateEvent.jsx]
        E[Dashboard.jsx]
        F[Profile.jsx]
        G[Admin.jsx]
        H[Login.jsx]
        I[Register.jsx]
        J[Favorites.jsx]
        K[Notifications.jsx]
    end
    
    subgraph "Reusable Components"
        L[Navbar]
        M[Footer]
        N[EventCard]
        O[FilterBar]
        P[SearchBox]
        Q[Loader]
        R[Modal]
    end
    
    subgraph "Context Providers"
        S[AuthContext]
        T[EventContext]
        U[NotificationContext]
    end
    
    A --> L
    B --> N
    B --> O
    C --> R
    
    S --> A
    S --> B
    T --> B
    U --> K
    
    style A fill:#e3f2fd
    style L fill:#fff9c4
    style S fill:#f3e5f5
```

### Backend Controllers

```mermaid
graph LR
    subgraph "Controllers"
        A[authController]
        B[eventController]
        C[notificationController]
    end
    
    A --> A1[register]
    A --> A2[login]
    A --> A3[getMe]
    A --> A4[updateProfile]
    
    B --> B1[getEvents]
    B --> B2[getEvent]
    B --> B3[createEvent]
    B --> B4[updateEvent]
    B --> B5[deleteEvent]
    B --> B6[toggleFavorite]
    B --> B7[getFavorites]
    
    C --> C1[getNotifications]
    C --> C2[markAsRead]
    C --> C3[deleteNotification]
    
    style A fill:#4fc3f7
    style B fill:#81c784
    style C fill:#ffb74d
```

---

## 🔧 Technology Stack Details

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI library |
| Vite | 7.3.1 | Build tool & dev server |
| React Router | 6.21.0 | Client-side routing |
| Axios | 1.6.2 | HTTP client |
| Tailwind CSS | 3.4.0 | Utility-first CSS |
| Lucide React | 0.294.0 | Icon library |
| Supabase JS | 2.90.1 | Supabase client |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express | 4.18.2 | Web framework |
| Supabase JS | 2.90.1 | Database client |
| bcryptjs | 2.4.3 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT authentication |
| express-validator | 7.0.1 | Input validation |
| cors | 2.8.5 | CORS middleware |
| dotenv | 16.3.1 | Environment variables |
| multer | 1.4.5 | File upload (future) |

### Database

| Feature | Technology |
|---------|------------|
| Database | PostgreSQL (via Supabase) |
| ORM | Supabase Client SDK |
| Hosting | Supabase Cloud |
| Backup | Automated daily backups |
| Scaling | Auto-scaling |

---

## 🎨 User Roles & Permissions

```mermaid
graph TB
    subgraph "User Roles"
        A[Guest User]
        B[Registered User]
        C[Admin User]
    end
    
    A --> A1[View Events]
    A --> A2[Search & Filter]
    A --> A3[View Event Details]
    
    B --> B1[All Guest Permissions]
    B --> B2[Create Events]
    B --> B3[Favorite Events]
    B --> B4[Receive Notifications]
    B --> B5[Update Profile]
    B --> B6[View Dashboard]
    
    C --> C1[All User Permissions]
    C --> C2[Approve/Reject Events]
    C --> C3[Delete Any Event]
    C --> C4[View Admin Panel]
    C --> C5[Manage Users]
    
    style A fill:#e0e0e0
    style B fill:#81c784
    style C fill:#ef5350
```

**Permission Matrix:**

| Feature | Guest | User | Admin |
|---------|-------|------|-------|
| View Events | ✅ | ✅ | ✅ |
| Search/Filter | ✅ | ✅ | ✅ |
| Register/Login | ✅ | ✅ | ✅ |
| Create Event | ❌ | ✅ | ✅ |
| Edit Own Event | ❌ | ✅ | ✅ |
| Delete Own Event | ❌ | ✅ | ✅ |
| Favorite Events | ❌ | ✅ | ✅ |
| Notifications | ❌ | ✅ | ✅ |
| Approve Events | ❌ | ❌ | ✅ |
| Delete Any Event | ❌ | ❌ | ✅ |
| Admin Panel | ❌ | ❌ | ✅ |

---

## 🔄 State Management

```mermaid
graph TB
    subgraph "React Context Architecture"
        A[App.jsx]
        
        A --> B[AuthProvider]
        A --> C[EventProvider]
        A --> D[NotificationProvider]
        
        B --> B1[User State]
        B --> B2[Token State]
        B --> B3[Login/Logout]
        
        C --> C1[Events State]
        C --> C2[Filters State]
        C --> C3[CRUD Operations]
        
        D --> D1[Notifications State]
        D --> D2[Unread Count]
        D --> D3[Mark as Read]
        
        E[Components] --> B
        E --> C
        E --> D
    end
    
    style B fill:#4fc3f7
    style C fill:#81c784
    style D fill:#ffb74d
```

**Context Providers:**

1. **AuthContext**
   - Current user data
   - Authentication token
   - Login/logout functions
   - User role & permissions

2. **EventContext**
   - Events list
   - Active filters
   - CRUD operations
   - Favorites management

3. **NotificationContext**
   - Notifications list
   - Unread count
   - Mark as read/delete
   - Real-time updates (future)

---

## 📈 Scalability Considerations

```mermaid
graph TB
    subgraph "Scalability Strategy"
        A[Current Architecture]
        B[Optimization Layer]
        C[Future Enhancements]
    end
    
    A --> A1[Supabase Auto-scaling]
    A --> A2[Stateless Backend]
    A --> A3[CDN for Frontend]
    
    B --> B1[Database Indexing]
    B --> B2[Query Optimization]
    B --> B3[Caching Layer - Redis]
    B --> B4[Image Optimization]
    
    C --> C1[Horizontal Scaling]
    C --> C2[Load Balancer]
    C --> C3[Microservices]
    C --> C4[Real-time WebSockets]
    C --> C5[Search Engine - Elasticsearch]
    
    style A fill:#81c784
    style B fill:#ffa726
    style C fill:#42a5f5
```

**Performance Optimizations:**

1. **Database Level**
   - Indexed columns (email, event_date, category)
   - Connection pooling
   - Query optimization
   - Pagination for large datasets

2. **Application Level**
   - Lazy loading components
   - Code splitting
   - Debounced search
   - Optimistic UI updates

3. **Infrastructure Level**
   - CDN for static assets
   - Gzip compression
   - HTTP/2 support
   - Auto-scaling on Supabase

---

## 🧪 Testing Strategy

```mermaid
graph LR
    subgraph "Testing Pyramid"
        A[Unit Tests]
        B[Integration Tests]
        C[E2E Tests]
        D[Manual Testing]
    end
    
    A --> A1[Controller Functions]
    A --> A2[Utility Functions]
    A --> A3[React Components]
    
    B --> B1[API Endpoints]
    B --> B2[Database Operations]
    B --> B3[Authentication Flow]
    
    C --> C1[User Journeys]
    C --> C2[Critical Paths]
    
    D --> D1[UI/UX Testing]
    D --> D2[Cross-browser]
    D --> D3[Accessibility]
    
    style A fill:#4caf50
    style B fill:#ffc107
    style C fill:#ff9800
    style D fill:#f44336
```

---

## 🔮 Future Enhancements

```mermaid
mindmap
  root((Future Features))
    Real-time Features
      WebSocket Integration
      Live Event Updates
      Chat Support
    Advanced Search
      Elasticsearch
      AI Recommendations
      Semantic Search
    Social Features
      User Profiles
      Event Reviews
      Social Sharing
    Mobile App
      React Native
      Push Notifications
      Offline Support
    Analytics
      Event Analytics
      User Behavior
      Dashboard Insights
    Integrations
      Calendar Sync
      Email Reminders
      Payment Gateway
```

**Planned Features:**

1. **Phase 2**
   - Email notifications
   - Calendar integration
   - Advanced filtering
   - Event reviews & ratings

2. **Phase 3**
   - Real-time updates (WebSockets)
   - Mobile application
   - Social sharing
   - Payment integration

3. **Phase 4**
   - AI-powered recommendations
   - Advanced analytics
   - Multi-language support
   - Accessibility improvements

---

## 📝 Development Workflow

```mermaid
graph LR
    A[Local Development] --> B[Git Commit]
    B --> C[Push to GitHub]
    C --> D[CI/CD Pipeline]
    D --> E{Tests Pass?}
    E -->|Yes| F[Deploy to Staging]
    E -->|No| G[Fix Issues]
    G --> B
    F --> H[Manual Testing]
    H --> I{Approved?}
    I -->|Yes| J[Deploy to Production]
    I -->|No| G
    
    style A fill:#e3f2fd
    style D fill:#fff9c4
    style F fill:#c8e6c9
    style J fill:#81c784
```

---

## 🎯 Conclusion

The College Event Aggregator is built on a modern, scalable architecture that separates concerns across presentation, application, and data layers. The use of React, Node.js, Express, and Supabase provides a robust foundation for rapid development and future growth.

**Key Architectural Strengths:**
- ✅ **Modular Design**: Clear separation of concerns
- ✅ **Scalable**: Cloud-native with auto-scaling capabilities
- ✅ **Secure**: JWT authentication, bcrypt hashing, RBAC
- ✅ **Maintainable**: Well-organized codebase with clear patterns
- ✅ **Developer-Friendly**: Hot reload, modern tooling, comprehensive docs
- ✅ **Cost-Effective**: Generous free tiers for development

**Technology Decisions Rationale:**
- **React + Vite**: Fast development, modern tooling, excellent DX
- **Express.js**: Lightweight, flexible, extensive ecosystem
- **Supabase**: Managed PostgreSQL, no infrastructure overhead, built-in features
- **JWT**: Stateless authentication, scalable across multiple servers
- **Tailwind CSS**: Rapid UI development, consistent design system

This architecture supports the current requirements while providing flexibility for future enhancements and scaling as the platform grows.
