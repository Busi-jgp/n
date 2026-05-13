# Neighbourhood Guard - Getting Started

Welcome to the Neighbourhood Guard web application! This guide will help you get up and running quickly.

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Verify Supabase Environment

Check that `.env` contains the correct Supabase credentials:

```
VITE_SUPABASE_URL=https://mjmgwybqpfyjcnvcukic.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_ZjiAKLbiWOZK03znVf9_dw_YV3VaJJb
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## 🗄️ Supabase Setup

### Initial Database Setup

1. Log into your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `SUPABASE_SETUP.sql`
5. Paste it into the query editor
6. Click **Run**

This creates all 12 tables with:
- ✅ Full Row Level Security (RLS)
- ✅ Automatic timestamp management
- ✅ Comprehensive indexes for performance
- ✅ Production-ready policies

### Tables Created

1. **users** - User profiles with subscription tiers
2. **incidents** - Safety reports and alerts
3. **incident_upvotes** - Track incident relevance
4. **groups** - Neighbourhood watch groups
5. **group_members** - Group membership tracking
6. **group_posts** - Posts within groups
7. **post_comments** - Comments on posts
8. **emergency_contacts** - Emergency contact info
9. **check_ins** - User safety check-ins
10. **subscriptions** - Subscription management
11. **announcements** - News and alerts
12. **audit_logs** - Action logging

---

## 📁 Project Structure

```
project-root/
├── index.html              ← Entry point (Vite serves this)
├── package.json            ← Dependencies and scripts
├── vite.config.ts          ← Vite configuration
├── tsconfig.json           ← TypeScript configuration
├── tailwind.config.js      ← Tailwind CSS setup
├── postcss.config.js       ← PostCSS configuration
│
├── .env                    ← Supabase credentials (NEVER commit)
├── .env.example            ← Template for developers
├── .gitignore              ← Git exclusions
│
├── src/                    ← Application source code
│   ├── main.tsx            ← React entry point
│   ├── App.tsx             ← Root component
│   ├── index.css           ← Global styles
│   ├── lib/                ← Utilities and helpers
│   │   └── supabase.ts     ← Supabase client
│   ├── components/         ← React components
│   └── hooks/              ← Custom React hooks
│
├── SUPABASE_SETUP.sql      ← Database schema (copy to Supabase SQL Editor)
├── GETTING_STARTED.md      ← This file
└── README.md               ← Project overview
```

---

## 🔑 Environment Variables

### Required (.env)
```
VITE_SUPABASE_URL=https://mjmgwybqpfyjcnvcukic.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_ZjiAKLbiWOZK03znVf9_dw_YV3VaJJb
```

### Optional
```
BASE_PATH=/               # Change if serving from subdirectory
APP_BASE_URL=http://localhost:5173
```

**IMPORTANT:** 
- `.env` is in `.gitignore` - never commit it
- Use `.env.example` to share template with team
- Always use `VITE_` prefix for frontend environment variables

---

## 🛠️ Development

### Start Dev Server
```bash
npm run dev
```

### Build Production
```bash
npm run build
```

### Preview Built App
```bash
npm run preview
```

### Type Check
```bash
npm run typecheck
```

### Code Formatting
```bash
npx prettier --write src/
```

---

## 🔐 Authentication with Supabase

The project uses Supabase's built-in authentication. Initialize the client:

```typescript
import { supabase } from '@/lib/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

---

## 📊 Database Operations

### Insert
```typescript
const { data, error } = await supabase
  .from('users')
  .insert([{ name: 'John', suburb: 'Brooklyn', phone: '+1234567890' }]);
```

### Select
```typescript
const { data, error } = await supabase
  .from('incidents')
  .select('*')
  .eq('suburb', 'Brooklyn');
```

### Update
```typescript
const { data, error } = await supabase
  .from('users')
  .update({ name: 'Jane' })
  .eq('id', userId);
```

### Delete
```typescript
const { data, error } = await supabase
  .from('incidents')
  .delete()
  .eq('id', incidentId);
```

---

## 🚀 Deployment

### Vercel

1. **Connect Repository**
   ```bash
   git remote add origin https://github.com/username/neighbourhood-guard.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Select your GitHub repository
   - Click "Import"

3. **Set Environment Variables**
   - In Vercel project settings, add:
     - `VITE_SUPABASE_URL=https://mjmgwybqpfyjcnvcukic.supabase.co`
     - `VITE_SUPABASE_ANON_KEY=sb_publishable_ZjiAKLbiWOZK03znVf9_dw_YV3VaJJb`

4. **Deploy**
   - Vercel auto-deploys on push to `main`

### GitHub Pages

1. **Build**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Push `dist/` folder to `gh-pages` branch
   - Or use GitHub Actions

---

## 🔄 Git Workflow

### Initialize Repository
```bash
git init
git add .
git commit -m "Initial commit: Clean project setup with Supabase integration"
git branch -M main
git remote add origin https://github.com/username/neighbourhood-guard.git
git push -u origin main
```

### Regular Development
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "Add my feature"

# Push and create PR
git push origin feature/my-feature
```

---

## ⚠️ Important Notes

### .env File
- **NEVER** commit `.env` to Git
- **ALWAYS** use `.env.example` as template
- Each developer has their own `.env` locally
- Production secrets managed via deployment platform

### Security
- Row Level Security (RLS) enabled on all tables
- All database operations restricted by user authentication
- Never expose anon key in client-side code (it's safe - designed for client)
- Use service role key only on backend (if you create one)

### Performance
- All tables have appropriate indexes
- Use `select()` to avoid loading unnecessary columns
- Implement pagination for large datasets
- Consider caching frequently accessed data

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clean install
rm -r node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Loading
- Verify `.env` exists at project root
- Variables must start with `VITE_` to be accessible in frontend
- Restart dev server after changing `.env`

### Database Connection Issues
- Check `.env` has correct URL and key
- Verify Supabase project is active
- Ensure row level security policies are correct

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## 💬 Need Help?

- Check existing issues in GitHub
- Review Supabase docs for database questions
- Check Vite documentation for build issues
- Review TypeScript errors in terminal

---

**Happy Coding! 🛡️**

Last updated: 2026-05-13
