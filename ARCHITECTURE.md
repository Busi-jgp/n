# Neighbourhood Guard - Application Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (Frontend)                         │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  React SPA (Vite)                                              │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  Pages / Components                                      │ │ │
│  │  │  • Incident Dashboard  • Group Management               │ │ │
│  │  │  • User Profile        • Check-In Tracker               │ │ │
│  │  │  • News Feed           • Trusted Contacts               │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  │                                                                  │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  Context API / State Management                          │ │ │
│  │  │  • AuthContext      → User Authentication               │ │ │
│  │  │  • AppContext       → Incidents & Safety Data            │ │ │
│  │  │  • GroupContext     → Groups & Posts                     │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  │                                                                  │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  UI Component Library (Radix UI + Tailwind)             │ │ │
│  │  │  • Buttons, Cards, Dialogs, Forms                       │ │ │
│  │  │  • Toast Notifications, Dropdowns, etc.                 │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↓↑ (HTTP/WebSocket)
┌─────────────────────────────────────────────────────────────────────┐
│                    API CLIENT LAYER (Shared)                         │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  API Client (@workspace/api-client-react)                     │ │
│  │  • custom-fetch.ts      → HTTP Request Handler               │ │
│  │  • Generated OpenAPI Client → Type-Safe API Calls            │ │
│  │  • Zod Schemas (@workspace/api-zod) → Runtime Validation     │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↓↑ (REST/gRPC)
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVER LAYER (Backend)                            │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Express.js API Server                                        │ │
│  │  • CORS Enabled        • JSON Body Parser                     │ │
│  │  • Pino Logger         • Error Middleware                     │ │
│  │                                                                │ │
│  │  Routes (/api/...):                                           │ │
│  │  • /health             → Server Health Check                  │ │
│  │  • /auth               → Authentication Endpoints (Future)    │ │
│  │  • /incidents          → Incident CRUD Operations (Future)    │ │
│  │  • /groups             → Group Management (Future)            │ │
│  │  • /users              → User Profile Operations (Future)     │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↓↑ (Supabase Client)
┌─────────────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Backend)                              │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Supabase (PostgreSQL + Auth)                                │ │
│  │                                                                │ │
│  │  Authentication:                                              │ │
│  │  • Email/Phone Signup  • JWT Tokens                           │ │
│  │  • MFA Support         • Session Management                   │ │
│  │                                                                │ │
│  │  Core Tables:                                                 │ │
│  │  • users               → User Profiles                        │ │
│  │  • incidents           → Safety Reports (Geo-Indexed)        │ │
│  │  • incident_upvotes    → Incident Ratings                    │ │
│  │  • neighbourhood_groups → Groups by Suburb                   │ │
│  │  • group_members       → Group Membership                     │ │
│  │  • group_posts         → Group Feed Posts                     │ │
│  │  • post_reactions      → Post Reactions/Likes                 │ │
│  │  • trusted_contacts    → Emergency Contacts                   │ │
│  │  • check_ins           → Location Check-Ins                   │ │
│  │  • subscriptions       → Subscription Management              │ │
│  │  • news_articles       → Local News & Alerts                  │ │
│  │  • audit_logs          → Moderation & Security Logs           │ │
│  │                                                                │ │
│  │  RLS Policies:                                                │ │
│  │  • Row-Level Security enabled on all tables                  │ │
│  │  • Users see own data + public data                           │ │
│  │  • Data isolation by user_id & group_id                       │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Database Functions & Triggers                                │ │
│  │  • update_incident_upvote_count()      → Auto-increment      │ │
│  │  • update_post_reaction_count()        → Auto-increment      │ │
│  │  • update_group_member_count()         → Auto-increment      │ │
│  │  • get_incidents_within_radius()       → Geo-fencing Queries │ │
│  │  • Audit Triggers                      → Security Logging    │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↓↑ (Real-Time Subscriptions)
┌─────────────────────────────────────────────────────────────────────┐
│                    REAL-TIME LAYER                                   │
│                                                                       │
│  Supabase Real-Time Subscriptions:                                   │
│  • Incident updates → Live feed refresh                             │
│  • Group posts → Chat-like updates                                  │
│  • User status → Online/Offline indicators                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19.1 + TypeScript | UI Components & State |
| **Build Tool** | Vite 5.4 | Fast development & production builds |
| **Styling** | Tailwind CSS + Radix UI | Component library & utility-first CSS |
| **State Management** | React Context API | Global app state |
| **HTTP Client** | Fetch API + Custom wrapper | API communication |
| **Validation** | Zod + OpenAPI | Schema validation & code generation |
| **Backend** | Express.js + Node.js | REST API server |
| **Database** | PostgreSQL (via Supabase) | Data persistence & real-time |
| **Authentication** | Supabase Auth | User authentication & sessions |
| **Real-Time** | Supabase WebSockets | Live data synchronization |
| **Deployment** | Vercel + Supabase Cloud | Hosting & database services |

---

## 🎯 Core Modules & Responsibilities

### 1. **Frontend (`/src`)**
- **Entry Point**: `index.html` → `main.tsx` → `App.tsx`
- **Components**:
  - `/components/ui/` → Reusable UI components (Buttons, Cards, Forms, etc.)
  - `/components/mockups/` → Design system mockups for development
- **Hooks**: Custom React hooks for common functionality
- **Lib**: Utility functions and helpers
- **Styling**: Tailwind CSS configuration + global styles

### 2. **Backend (`/backend/api`)**
- **Entry Point**: `src/index.ts` → Express app initialization
- **Routes** (`src/routes/`): API endpoints
  - Health check endpoint for deployment verification
  - Future: Auth, Incidents, Groups, Users endpoints
- **Middleware**: CORS, JSON parsing, logging
- **Logger**: Pino logging for structured logging
- **Build**: ESBuild for Node.js bundling

### 3. **Database (`/backend/db`)**
- **Schema** (`src/schema/`): Drizzle ORM definitions (future-ready)
- **Configuration**: `drizzle.config.ts` for database migrations
- **Currently**: Managed directly via Supabase SQL

### 4. **Shared Code (`/shared`)**

#### **API Spec** (`shared/api-spec/`)
- `openapi.yaml` → OpenAPI specification for API contract
- `orval.config.ts` → Configuration for automatic client generation

#### **API Zod** (`shared/api-zod/`)
- Generated Zod schemas for request/response validation
- Type-safe validation at runtime
- Exported for use in frontend and backend

### 5. **API Client** (`/frontend/api-client-react/`)
- `custom-fetch.ts` → HTTP wrapper with error handling
- `generated/` → Auto-generated OpenAPI client from spec
- Handles authentication tokens, retries, error states

---

## 🔄 Data Flow

### User Signs Up
```
1. User enters credentials in SignUp form
   ↓
2. Frontend calls Supabase Auth API
   ↓
3. Supabase creates user in auth system
   ↓
4. Trigger creates user profile in 'users' table
   ↓
5. User automatically assigned to local neighbourhood_group
   ↓
6. AuthContext updates with user state
   ↓
7. User redirected to Dashboard
```

### User Reports an Incident
```
1. User fills Incident Form (type, location, description, image/video)
   ↓
2. Frontend validates with Zod schema
   ↓
3. Frontend sends HTTP POST to /api/incidents
   ↓
4. Backend creates incident record in database
   ↓
5. Trigger updates geo-index for location queries
   ↓
6. Real-time subscription fires
   ↓
7. All users in that suburb get live update
   ↓
8. Incident appears on dashboard with upvote counter
```

### User Upvotes an Incident
```
1. User clicks upvote icon
   ↓
2. Frontend creates incident_upvotes record
   ↓
3. Trigger fires: update_incident_upvote_count()
   ↓
4. Incident.upvote_count increments in database
   ↓
5. Real-time subscription sends update to all clients
   ↓
6. UI updates counter instantly across all users
```

### User Joins a Group
```
1. User clicks "Join Group"
   ↓
2. Frontend creates group_members record
   ↓
3. Trigger fires: update_group_member_count()
   ↓
4. Group.member_count increments
   ↓
5. User added to GroupContext
   ↓
6. User can now post & react in group feed
```

---

## 🗂️ Project Structure

```
Neighbourhood-Guard/
├── 📄 index.html                      ← Main entry point
├── 📄 package.json                    ← Workspace configuration
├── 📄 tsconfig.json                   ← TypeScript root config
├── 📄 vite.config.ts                  ← Vite build configuration
├── 📄 tailwind.config.js              ← Tailwind styling
├── 📄 postcss.config.js               ← PostCSS plugins
├── 📄 vercel.json                     ← Vercel deployment config
│
├── 📁 src/                            ← FRONTEND: Main React app
│   ├── 📄 main.tsx                    ← React entry point
│   ├── 📄 App.tsx                     ← Root component
│   ├── 📄 index.css                   ← Global styles
│   ├── 📁 components/
│   │   ├── 📁 ui/                     ← Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── form.tsx
│   │   │   └── ... (30+ components)
│   │   └── 📁 mockups/                ← Design system
│   ├── 📁 hooks/                      ← Custom React hooks
│   │   └── use-mobile.tsx
│   └── 📁 lib/                        ← Utilities
│       └── utils.ts
│
├── 📁 backend/                        ← BACKEND: Server & Database
│   ├── 📁 api/                        ← Express.js API
│   │   ├── 📄 package.json
│   │   ├── 📄 vite.config.ts
│   │   ├── 📁 src/
│   │   │   ├── 📄 index.ts            ← Server entry
│   │   │   ├── 📄 app.ts              ← Express config
│   │   │   ├── 📁 lib/
│   │   │   │   └── logger.ts
│   │   │   ├── 📁 routes/
│   │   │   │   ├── 📄 index.ts        ← Route registry
│   │   │   │   └── 📄 health.ts       ← /api/health endpoint
│   │   │   └── 📁 middlewares/        ← Custom middleware
│   │   └── 📁 dist/                   ← Built output
│   │
│   └── 📁 db/                         ← Database schemas
│       ├── 📄 package.json
│       ├── 📄 drizzle.config.ts       ← ORM configuration
│       └── 📁 src/
│           └── 📁 schema/
│               └── 📄 index.ts        ← Drizzle ORM schemas
│
├── 📁 frontend/                       ← FRONTEND PACKAGES
│   ├── 📁 api-client-react/           ← Generated API client
│   │   ├── 📄 package.json
│   │   └── 📁 src/
│   │       ├── 📄 custom-fetch.ts     ← HTTP wrapper
│   │       ├── 📄 index.ts
│   │       └── 📁 generated/
│   │           ├── 📄 api.ts          ← Generated endpoints
│   │           └── 📁 types/          ← Generated types
│   │
│   └── 📁 mockup-sandbox/             ← Design system dev
│       ├── 📄 package.json
│       ├── 📄 vite.config.ts
│       └── 📁 src/
│           ├── 📄 App.tsx
│           ├── 📄 main.tsx
│           └── 📁 components/
│
├── 📁 shared/                         ← SHARED CODE
│   ├── 📁 api-spec/                   ← OpenAPI specification
│   │   ├── 📄 openapi.yaml            ← API contract
│   │   ├── 📄 orval.config.ts         ← Code generation config
│   │   └── 📄 package.json
│   │
│   └── 📁 api-zod/                    ← Shared schemas
│       ├── 📄 package.json
│       └── 📁 src/
│           ├── 📄 index.ts
│           └── 📁 generated/
│               ├── 📄 api.ts          ← Generated Zod schemas
│               └── 📁 types/          ← Generated types
│
├── 📁 scripts/                        ← Build & utility scripts
│   └── 📄 package.json
│
├── 📁 dist/                           ← Production build output
│   ├── 📄 index.html
│   └── 📁 assets/
│       ├── 📄 index-[hash].js
│       └── 📄 index-[hash].css
│
├── 🗄️ supabase_migration.sql          ← Database schema
├── 📄 .env.example                    ← Environment template
├── 📄 .env.production                 ← Production env vars
└── 📄 vercel.json                     ← Deployment config
```

---

## 🔐 Authentication & Security

### Authentication Flow
```
Supabase Auth (OAuth2)
       ↓
User Registration / Login
       ↓
JWT Token Generated
       ↓
Frontend stores token in memory
       ↓
API requests include Authorization header
       ↓
Backend validates JWT signature
       ↓
Row-Level Security policies enforce data isolation
```

### Row-Level Security (RLS)
- Every table has RLS enabled
- Users can only access:
  - Own profile & data
  - Public data (non-deleted incidents, news)
  - Data shared explicitly (groups, trusted contacts)
- Moderation & admin functions in audit_logs table

---

## 🚀 Deployment Architecture

### Development Environment
```
Local Machine
    ↓
Vite Dev Server (Port 5173)
    ↓
Express Backend (Port 8080)
    ↓
Supabase Local (or Cloud)
```

### Production Environment (Vercel)
```
GitHub Repository
    ↓
Push to main branch
    ↓
Vercel Build Process:
  1. npm install (installs dependencies)
  2. npm run build (Vite compiles frontend → dist/)
  3. Deploys dist/ to CDN
    ↓
Vercel Edge Network (Global CDN)
    ↓
User Browser
```

### Database (Supabase Cloud)
```
Hosted PostgreSQL Instance
    ↓
Real-time Subscriptions via WebSocket
    ↓
Row-Level Security (RLS) Policies
    ↓
Auth Management (JWT)
```

---

## 📈 Scalability Considerations

### Current Design
- **Frontend**: Fully static, scalable via CDN (Vercel)
- **Backend**: Stateless Express.js, easily scaled horizontally
- **Database**: Managed by Supabase, includes backups & replication
- **Real-time**: Supabase handles WebSocket connections

### Future Enhancements
1. **Caching**: Redis for frequently accessed data
2. **Image Processing**: Cloud storage (Supabase Storage)
3. **Background Jobs**: Bull queues for async tasks
4. **API Rate Limiting**: Redis-based rate limiter
5. **Microservices**: Split backend into services (Notifications, Analytics, etc.)

---

## 🎓 Key Architectural Principles

1. **Separation of Concerns**
   - Frontend (UI/UX) separate from backend (API)
   - Shared types prevent type mismatches

2. **Type Safety**
   - End-to-end TypeScript
   - Zod runtime validation
   - OpenAPI code generation

3. **Scalability**
   - Stateless backend
   - Real-time via subscriptions
   - CDN-friendly frontend

4. **Security**
   - JWT authentication
   - Row-level database policies
   - Environment variable isolation

5. **Developer Experience**
   - Monorepo structure for shared code
   - Code generation from OpenAPI
   - Hot module replacement (HMR) in dev

---

## 🔧 Development Workflow

```
1. Define API in openapi.yaml
   ↓
2. Generate types & client: orval
   ↓
3. Generate Zod schemas: zod-openapi
   ↓
4. Implement backend endpoints (Express routes)
   ↓
5. Create frontend components using generated client
   ↓
6. Test in dev: npm run dev
   ↓
7. Build & verify: npm run build
   ↓
8. Deploy: git push → Vercel automatically deploys
```

---

## 📞 Component Communication

### Frontend Components → Supabase
```
React Component
    ↓
useEffect / onClick handler
    ↓
API Client (custom-fetch.ts)
    ↓
Supabase REST API / WebSocket
    ↓
Database Query / Subscribe
    ↓
Result → Context State
    ↓
Component Re-renders
```

### Real-Time Updates
```
Supabase PostgreSQL
    ↓
Trigger fires (e.g., INSERT into incidents)
    ↓
Broadcast to subscribed clients
    ↓
Context listener receives update
    ↓
State updated
    ↓
All subscribed components re-render
```

---

## 🎯 Key Features by Layer

| Feature | Frontend | Backend | Database |
|---------|----------|---------|----------|
| **User Authentication** | Context API | Express middleware | Supabase Auth |
| **Incident Reports** | React Form | REST endpoint | PostgreSQL table + Triggers |
| **Group Management** | UI Components | REST endpoints | Multiple tables + RLS |
| **Real-time Updates** | WebSocket subscriptions | Broadcast | Triggers + webhooks |
| **Data Validation** | Zod schemas | Express validation | Database constraints |
| **Location Queries** | Map component | Geo-query endpoint | PostGIS geo-index |
| **User Preferences** | Local state | Database storage | User profile table |

---

## 🌍 Geo-Spatial Architecture

```
Incident Reports
    ↓
latitude, longitude stored
    ↓
GiST Index on (latitude, longitude)
    ↓
get_incidents_within_radius() function
    ↓
Haversine distance calculation
    ↓
Return nearby incidents to user
```

---

## 📊 Database Relationships

```
users (1) ──────────┐
                    │
              ┌─────┴─────┐
              ↓           ↓
         incidents    neighbourhood_groups
              │           │
              ├─ incident_upvotes
              │           │
              │       group_members ─────┐
              │           │              │
              │       group_posts ───────┤
              │           │              │
              └───────────┴─ post_reactions
                          
users (1) ──────────────┐
                        ↓
            trusted_contacts (many)
            check_ins (many)
            subscriptions (1)
            audit_logs (many)
```

---

This architecture supports:
- ✅ Community safety coordination
- ✅ Real-time incident alerts
- ✅ Neighbourhood group management
- ✅ User authentication & authorization
- ✅ Scalable deployment
- ✅ Type-safe end-to-end development
