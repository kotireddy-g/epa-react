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

## Recent Changes (October 15, 2025)
- Successfully set up React + Vite project in Replit environment
- Installed all npm dependencies (396 packages)
- Configured Vite for Replit proxy environment:
  - WebSocket HMR with WSS protocol
  - Host configuration using REPLIT_DEV_DOMAIN
  - Port 5000 with client port 443 for proxy compatibility
- Set up workflow to run development server
- Configured deployment for autoscale hosting
- Verified app is running correctly with intro animation

## Technical Notes
- The app uses client-side state management (no backend currently)
- All data is stored in React state (ideas, validations, business plans, etc.)
- Vite HMR is configured to work through Replit's proxy with WSS protocol
- TypeScript strict mode enabled for type safety
- ESLint configured with React hooks and refresh plugins

## Architecture Decisions
- **State Management**: React useState for simplicity (could be upgraded to Context/Redux for scaling)
- **Routing**: Page-based navigation managed in App.tsx (could be upgraded to React Router)
- **Data Persistence**: Currently in-memory only (future: add database integration)
- **Styling**: Utility-first approach with Tailwind CSS
- **Component Library**: shadcn/ui for consistent, accessible components
