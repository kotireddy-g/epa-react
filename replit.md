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
│   ├── LandingPage.tsx              # Marketing landing page with animations
│   ├── FloatingHomeButton.tsx       # Floating home navigation button
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
│   ├── Sidebar.tsx                  # Navigation sidebar with logout
│   └── SuggestionsPanel.tsx         # AI suggestions panel
├── styles/
│   └── globals.css                  # Global styles and Tailwind config
├── App.tsx                          # Main app component with routing & session management
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
1. **Landing Page**: Professional marketing page with animated hero section and four pillars showcase
2. **Session Persistence**: User sessions maintained across page refreshes using localStorage
3. **Intro Video**: Animated introduction showing the journey from idea to business
4. **Authentication**: Simple login system with username-based auth
5. **Profile Setup**: User profile configuration (industry, expertise, goals)
6. **Idea Management**: Submit, review, and track business ideas
7. **Validation**: Multi-section validation with confidence scoring system
8. **Business Planning**: Template selection and business plan generation with task tables
9. **Planning Interface**: Organize tasks, resources, budget, hardware, timeline, goals, and partnerships
10. **Implementation Tracking**: Timeline, calendar, and journey map views for tracking progress
11. **Outcomes Tracking**: Monitor results, analyze achievements, and view previous idea journeys
12. **Notifications**: Real-time updates on validation, tasks, milestones, and deadlines

## Design System
- Uses shadcn/ui components built on Radix UI primitives
- Tailwind CSS with custom configuration
- Dark mode support via next-themes
- Responsive design with mobile considerations
- Custom animations with Framer Motion

## Recent Changes

### October 17, 2025 - GitHub Import Setup (Fresh Clone)
- **Successfully imported and configured the project**:
  - Installed all npm dependencies (frontend: 495 packages, backend: 105 packages)
  - Fixed TypeScript configuration by adding Node.js types to tsconfig.node.json
  - Configured dual-workflow system:
    - **Backend**: Express server on port 3001 (localhost, console output)
    - **Frontend**: Vite dev server on port 5000 (0.0.0.0, webview output)
  - Verified both servers running successfully:
    - Backend API endpoints accessible at http://localhost:3001/api
    - Frontend displays landing page correctly with all animations and styling
  - Configured deployment for autoscale:
    - Build: `npm run build`
    - Run: Backend server + Vite preview server on port 5000
  - Vite configuration already properly set for Replit environment:
    - Host: 0.0.0.0 for external access
    - Port: 5000 (required for Replit frontend)
    - allowedHosts: true (required for Replit proxy)
    - HMR configured with WSS protocol for proxy compatibility
    - Cache-Control headers properly set

### October 17, 2025 - External API Authentication & Dialog Styling Fix
- **Dialog Styling Resolution**:
  - Fixed critical dialog background visibility issue by converting all CSS color variables to HSL format
  - Changed from mixed formats (hex/oklch) to consistent `hsl(H S% L%)` notation in globals.css
  - Updated Tailwind configuration to properly reference CSS variables with `hsl()` function
  - Login and Sign Up dialogs now display with proper white/dark backgrounds
  
- **External Authentication Integration**:
  - Created `authApi.ts` service to integrate with external login API (http://192.168.1.111:8089/accounts/login/)
  - Implemented token-based authentication with access and refresh tokens stored in localStorage
  - Enhanced session management to persist user data, profile information, and authentication tokens
  - Updated API service (`api.ts`) to include Authorization headers with Bearer tokens for all requests
  - Integrated real API into LandingPage login modal with proper error handling and loading states
  - Removed unused imports from LandingPage component for cleaner code
  
- **Security Measures**:
  - Addressed critical security issue by removing exposed JWT tokens from committed files
  - Implemented proper token storage using localStorage with getters for secure access
  - All API requests now authenticated with access tokens from session storage

### October 17, 2025 - Replit Environment Setup (GitHub Import)
- **Project Successfully Imported and Configured**:
  - Installed all npm dependencies (frontend: 495 packages, backend: 105 packages)
  - Configured Vite for Replit proxy environment with `allowedHosts: true`
  - Set up dual-workflow system:
    - **Backend**: Express server on port 3001 (localhost, console output)
    - **Frontend**: Vite dev server on port 5000 (0.0.0.0, webview output)
  - Configured deployment for autoscale with build and run commands
  - Verified both servers running successfully with API endpoints accessible
  - Frontend displays landing page correctly with all animations and styling

### October 17, 2025 - Landing Page & Session Management
- **Landing Page Implementation**:
  - Added comprehensive landing page (LandingPage.tsx) with animations using Framer Motion
  - Hero section with animated circular diagram showing four pillars of execution
  - Navigation menu with sections: Pillars, How It Works, Why Now, Services, About
  - Login and Sign Up modals for authentication flow
  - Professional marketing copy highlighting value proposition
  
- **Session Persistence**:
  - Implemented localStorage-based session management
  - User sessions persist across page refreshes
  - On refresh, authenticated users return to home (Idea page) instead of landing/login
  - Session includes authentication status and user profile data
  
- **Navigation Improvements**:
  - Home button now navigates to Idea page (not intro screen)
  - Added FloatingHomeButton component (red circular button, bottom-right)
  - Sidebar updated with logout functionality
  - Logout clears session and returns to landing page
  
- **Theme Updates**:
  - Updated color scheme to red accent (#dc2626) matching landing page
  - Primary colors changed from blue to red throughout application
  - Sidebar branding updated: "Execution Planner" with "The Best Way How" tagline
  - Consistent red theme across buttons, links, and interactive elements
  - Added Tailwind directives to globals.css for proper styling

### October 16, 2025 - GitHub Import Setup
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
