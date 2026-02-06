# 🚀 Supabase Setup Guide - College Event Aggregator

Your project has been migrated from MongoDB to **Supabase (PostgreSQL)**! Follow this guide to get everything running.

---

## ✅ What Changed?

- **Database**: MongoDB → Supabase (PostgreSQL)
- **Authentication**: Still using JWT (custom auth)
- **Models**: Mongoose schemas → Supabase client queries
- **Benefits**: 
  - ✨ No local database installation needed
  - ✨ Built-in authentication & storage
  - ✨ Real-time subscriptions ready
  - ✨ Free tier with 500MB database
  - ✨ Better query performance

---

## 📋 Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Click **"New Project"**

---

## 🔧 Step 2: Create New Project

Fill in project details:
- **Name**: `college-events` (or any name)
- **Database Password**: Create a strong password (save it!)
- **Region**: Choose closest to you (e.g., `ap-south-1` for India)
- **Plan**: Free (sufficient for development)

Click **"Create new project"** and wait 2 minutes for setup.

---

## 🔑 Step 3: Get API Keys

1. In your Supabase project, click **"Settings"** (⚙️ icon in sidebar)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJh...`)
   - **service_role key** (starts with `eyJh...` - longer)

**⚠️ Keep these secret!**

---

## 📝 Step 4: Create Database Tables

1. In Supabase dashboard, click **"SQL Editor"** in sidebar
2. Click **"New Query"**
3. Copy the entire content from your project file:
   \`\`\`
   server/database/schema.sql
   \`\`\`
4. Paste it into the SQL Editor
5. Click **"Run"** or press `Ctrl+Enter`

You should see: ✅ **Success. No rows returned**

This creates all necessary tables: `users`, `events`, `favorites`, `notifications`

---

## 🔐 Step 5: Update Environment Variables

Open your `.env` file:
\`\`\`
server/.env
\`\`\`

Replace with your Supabase credentials:

\`\`\`env
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeHh4eHh4eHh4eHh4eHh4IiAgInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU3NjAwMH0...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeHh4eHh4eHh4eHh4eHh4IiAgInJvbGUiOiJhbm9uIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjIwMTU1NzYwMDB9...

# JWT Secret (for custom auth)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-long-random-string
JWT_EXPIRE=7d
NODE_ENV=development
\`\`\`

**Replace**:
- `SUPABASE_URL` with your Project URL
- `SUPABASE_SERVICE_KEY` with your service_role key (from Step 3)
- `SUPABASE_ANON_KEY` with your anon key

---

## 🌱 Step 6: Seed the Database

Run the seeder to populate sample data:

\`\`\`bash
cd server
npm run seed
\`\`\`

You should see:
\`\`\`
🌱 Starting database seed...
✅ Users created successfully
✅ Events created successfully
✅ Favorites added
🎉 Database seeded successfully!

📝 Test Accounts:
Admin: admin@college-events.com / admin123
User: john@example.com / password123

📊 Created 10 events
\`\`\`

---

## 🚀 Step 7: Start the Application

### Start Backend:
\`\`\`bash
cd server
npm run dev
\`\`\`

You should see:
\`\`\`
✅ Supabase Connected Successfully
🚀 Server running on port 5000
\`\`\`

### Start Frontend (new terminal):
\`\`\`bash
cd client
npm run dev
\`\`\`

Visit: **http://localhost:5173**

---

## 🧪 Step 8: Test the Application

### Login as Admin:
- Email: `admin@college-events.com`
- Password: `admin123`
- You can approve/reject events

### Login as Regular User:
- Email: `john@example.com`
- Password: `password123`
- You can browse and favorite events

---

## 📊 View Your Data in Supabase

1. Go to Supabase dashboard
2. Click **"Table Editor"** in sidebar
3. Select tables to view:
   - **users** - See registered users
   - **events** - See all events
   - **favorites** - See user favorites
   - **notifications** - See notifications

You can edit data directly in the table editor!

---

## 🔍 Common Issues & Solutions

### ❌ "Invalid API key"
- Check your `.env` file has correct `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
- Make sure you copied the **service_role** key, not anon key
- Restart server after updating `.env`

### ❌ "relation does not exist"
- Run the SQL schema from `server/database/schema.sql`
- Make sure all tables are created in Supabase

### ❌ Seeder fails
- Check your Supabase credentials in `.env`
- Make sure database tables exist
- Try running SQL schema again

### ❌ Can't login
- Run seeder first: `npm run seed`
- Use exact credentials: `admin@college-events.com` / `admin123`
- Check browser console for errors

---

## 🎯 Next Steps

1. **Browse Events**: Go to http://localhost:5173/events
2. **Create Account**: Register a new user
3. **Submit Event**: Login and create a new event
4. **Admin Panel**: Login as admin to approve events
5. **Favorite Events**: Click heart icon on events

---

## 📚 Supabase Features You Can Add

Your project is now ready for advanced features:

✨ **Email Authentication**: Supabase built-in auth
✨ **File Upload**: Store event images in Supabase Storage
✨ **Real-time**: Live event updates without refresh
✨ **Row Level Security**: Database-level permissions
✨ **Social Login**: Google, GitHub, etc.

---

## 🆘 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Your Database Schema**: `server/database/schema.sql`
- **API Endpoints**: Test at http://localhost:5000/api/health

---

## 🎉 Congratulations!

Your College Event Aggregator is now running on Supabase! 🚀

**No MongoDB installation needed** - everything runs in the cloud!
