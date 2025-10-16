# Business Idea Journey App

## Overview
A React web application that guides users through the journey of transforming a business idea into a reality. The app provides a structured workflow from initial idea validation through business planning, execution planning, and implementation tracking.

## Tech Stack
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.3
- **Language**: TypeScript 5.6.2
- **UI Components**: Radix UI with shadcn/ui
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 12.23.24
- **Forms**: React Hook Form 7.54.2
- **Charts**: Recharts 2.15.0
- **Icons**: Lucide React 0.462.0

## Project Structure
```
src/
├── components/
│   ├── ui/                          # Reusable UI components (shadcn/ui)
│   ├── figma/                       # Figma-specific components
│   ├── IntroVideoPage.tsx           # Animated intro page
│   ├── LoginPage.tsx                # Authentication page
│   ├── ProfileSetupPage.tsx         # User profile setup
│   ├── IdeaPage.tsx                 # Idea submission and management
│   ├── ValidationPage.tsx           # Idea validation with scoring
│   ├── BusinessPlanPage.tsx         # Business plan creation
│   ├── PlannerPage.tsx              # Task planning interface
│   ├── ImplementationPage.tsx       # Implementation tracking
│   ├── OutcomesPage.tsx             # Outcomes monitoring
│   ├── NotificationsPage.tsx        # Notifications center
│   ├── Sidebar.tsx                  # Navigation sidebar
│   └── SuggestionsPanel.tsx         # AI suggestions panel
├── styles/
│   └── globals.css                  # Global styles and Tailwind config
├── App.tsx                          # Main app component with routing
└── main.tsx                         # Entry point
```

## Development Setup
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (allows external connections)
- **HMR**: WebSocket configured for Replit proxy environment

## Available Commands
- `npm run dev` - Start development server on port 5000
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment Configuration
- **Type**: Autoscale (stateless web app)
- **Build**: `npm run build`
- **Run**: Serves the built application with Vite preview server

## Key Features
1. **Intro Video**: Animated introduction showing the journey from idea to business
2. **Authentication**: Simple login system with username-based auth
3. **Profile Setup**: User profile configuration (industry, expertise, goals)
4. **Idea Management**: Submit, review, and track business ideas
5. **Validation**: Multi-section validation with confidence scoring system
6. **Business Planning**: Template selection and business plan generation with task tables
7. **Planning Interface**: Organize tasks, resources, budget, hardware, timeline, goals, and partnerships
8. **Implementation Tracking**: Timeline, calendar, and journey map views for tracking progress
9. **Outcomes Tracking**: Monitor results, analyze achievements, and view previous idea journeys
10. **Notifications**: Real-time updates on validation, tasks, milestones, and deadlines

## Design System
- Uses shadcn/ui components built on Radix UI primitives
- Tailwind CSS with custom configuration
- Dark mode support via next-themes
- Responsive design with mobile considerations
- Custom animations with Framer Motion

## Recent Changes (October 16, 2025)

### GitHub Import Setup - Replit Environment Configuration
- Successfully imported project from GitHub (https://github.com/kotireddy-g/epa.git)
- Installed all npm dependencies:
  - Frontend: 495 packages (React, Vite, Radix UI, Tailwind CSS, etc.)
  - Backend: 105 packages (Express, better-sqlite3, CORS)
- Configured dual-workflow setup:
  - **Backend**: Express server on port 3001 (localhost only, console output)
  - **Frontend**: Vite dev server on port 5000 (0.0.0.0 for public access, webview output)
- Fixed Vite configuration for Replit environment:
  - Removed incorrect base path ('/epa-project/')
  - Maintained WebSocket HMR with WSS protocol for proxy compatibility
  - Host configuration using REPLIT_DEV_DOMAIN environment variable
  - API proxy configured to route /api requests to backend on port 3001
- Verified both servers running successfully:
  - Backend API endpoints accessible and database initialized
  - Frontend displays animated intro page correctly
  - Vite HMR connected and working

### Styling Fixes
- Fixed dialog background visibility issue:
  - Converted CSS color variables from mixed formats (hex/oklch) to consistent HSL format
  - Updated Tailwind configuration to properly map CSS variables
  - Dialogs now display with proper white/dark backgrounds
- Verified button styling across all components using shadcn/ui Button component

### Backend API Implementation (Complete)
- **Database**: SQLite with better-sqlite3
  - Foreign key enforcement enabled for CASCADE deletes
  - Tables: ideas, validations, business_plans, implementation_items
  - All relationships properly configured with ON DELETE CASCADE
  
- **Backend Server**: Express.js on port 3001
  - CORS enabled for frontend communication
  - JSON parsing middleware
  - Comprehensive error handling
  - Consistent camelCase response format (no snake_case exposure)
  
- **Full REST API Endpoints**:
  - **Ideas**: GET (list/single), POST, PUT, DELETE with CASCADE
  - **Validations**: GET (by ideaId), POST, PUT, DELETE
  - **Business Plans**: GET (by ideaId), POST, PUT, DELETE
  - **Implementation Items**: GET (by ideaId/single), POST, PUT, DELETE
  
- **Frontend API Client**: TypeScript service at `src/services/api.ts`
  - Type-safe interfaces for all entities
  - Error handling built-in
  - Mirrors backend endpoint structure

### Documentation
- Created comprehensive API_INTEGRATION_GUIDE.md:
  - Flutter vs React API patterns comparison
  - Step-by-step integration guide
  - Complete examples with useState and useEffect hooks
  - Error handling and loading state patterns
  - Full API method reference

## Technical Notes
- **Backend**: Express.js + SQLite (port 3001, localhost only)
- **Frontend**: React + Vite (port 5000, public via 0.0.0.0)
- **Data Flow**: API client (src/services/api.ts) → Backend API → SQLite database
- **Response Format**: All API responses use camelCase for consistency with React/TypeScript
- **Foreign Keys**: Enabled with CASCADE deletes for data integrity
- Vite HMR is configured to work through Replit's proxy with WSS protocol
- TypeScript strict mode enabled for type safety
- ESLint configured with React hooks and refresh plugins

## Architecture Decisions
- **Backend Database**: SQLite (file-based) chosen for Replit environment compatibility
- **API Architecture**: RESTful API with full CRUD operations on all entities
- **State Management**: Transitioning from in-memory to API-backed data persistence
- **Data Serialization**: Transform functions ensure consistent camelCase responses
- **Routing**: Page-based navigation managed in App.tsx (could be upgraded to React Router)
- **Styling**: Utility-first approach with Tailwind CSS
- **Component Library**: shadcn/ui for consistent, accessible components

## Next Steps
- Integrate API calls into React components (replace useState with API data)
- Add loading states and error handling to UI components
- Implement optimistic UI updates for better UX
- Consider adding user authentication and multi-user support
