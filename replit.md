# Business Idea Journey App

## Overview
A Flutter Web application that guides users through the journey of transforming a business idea into a reality. The app provides a structured workflow from initial idea validation through business planning, execution planning, and implementation tracking.

**Note**: The original React version is preserved in the `src/` directory. The new Flutter version is in `business_idea_flutter/`.

## Tech Stack
- **Framework**: Flutter 3.32.0 (Web only)
- **State Management**: Riverpod 3.0 (modern Notifier API)
- **Routing**: GoRouter 14.6.2
- **Design**: Material Design 3 with custom color scheme
- **Animations**: Flutter's built-in animation system

## Project Structure
```
business_idea_flutter/
├── lib/
│   ├── main.dart                          # Entry point and routing
│   ├── config/
│   │   ├── routes.dart                    # Route definitions
│   │   └── theme.dart                     # App theme and colors
│   ├── core/
│   │   ├── models/
│   │   │   ├── idea.dart                  # Idea model
│   │   │   └── user_profile.dart          # User profile model
│   │   └── providers/
│   │       └── app_state.dart             # Riverpod state management
│   ├── features/
│   │   ├── onboarding/
│   │   │   └── pages/
│   │   │       ├── intro_video_page.dart  # Animated intro
│   │   │       ├── login_page.dart        # Login screen
│   │   │       └── profile_setup_page.dart # Profile setup
│   │   └── idea_flow/
│   │       └── pages/
│   │           ├── idea_page.dart         # Idea submission
│   │           ├── validation_page.dart   # Idea validation
│   │           ├── business_plan_page.dart # Business planning
│   │           ├── planner_page.dart      # Task planning
│   │           ├── implementation_page.dart # Implementation
│   │           └── outcomes_page.dart     # Outcomes tracking
│   └── widgets/
│       ├── app_sidebar.dart               # Navigation sidebar
│       └── suggestions_panel.dart         # AI suggestions panel
├── web/
│   └── index.html                         # Web entry point
└── pubspec.yaml                           # Dependencies
```

## Development Setup
- **Port**: The dev server runs on port 5000
- **Host**: Configured to bind to 0.0.0.0 for Replit environment
- **Hot Reload**: Enabled via Flutter's hot restart (press R in terminal)

## Available Commands
- `flutter run -d web-server --web-port 5000 --web-hostname 0.0.0.0` - Start development server
- `flutter build web` - Build production bundle
- `flutter pub get` - Install dependencies

## Deployment Configuration
- **Type**: Autoscale deployment (stateless web app)
- **Build**: `cd business_idea_flutter && flutter build web`
- **Run**: Serve the `business_idea_flutter/build/web` directory

## Key Features
1. **Intro Video**: Animated introduction showing the journey from idea to business
2. **Authentication**: Simple login system
3. **Profile Setup**: User profile configuration
4. **Idea Management**: Submit and track business ideas
5. **Validation**: Validate ideas with scoring system
6. **Business Planning**: Generate and manage business plans
7. **Planning & Implementation**: Track tasks and progress
8. **Outcomes Tracking**: Monitor results and achievements
9. **Notifications**: Stay updated on progress

## Design System
The app uses a custom design system with:
- Dark mode support via `next-themes`
- Custom color tokens using oklch color space
- Responsive design with Tailwind utilities
- Accessible components via Radix UI

## Recent Changes (October 15, 2025)
- **Converted entire React app to Flutter Web**
- Installed Flutter 3.32.0 SDK with web support
- Created complete Flutter project structure with clean architecture
- Implemented Riverpod 3.0 state management with modern Notifier API
- Set up GoRouter with authentication guards and navigation flow
- Built all onboarding pages (Intro, Login, Profile Setup)
- Implemented Idea submission page with form validation
- Created placeholder pages for Validation, Business Plan, Planner, Implementation, and Outcomes
- Built navigation sidebar with route highlighting
- Configured Material Design 3 theme matching original color scheme
- Successfully running on port 5000 with Flutter Web server
- Created comprehensive code reference document (FLUTTER_CODE_REFERENCE.md)

## Notes
- Flutter Web app uses Material Design 3 components
- State management uses Riverpod 3.0 with modern Notifier API (not deprecated StateNotifier)
- For simple state (bool, String), uses legacy.StateProvider from 'package:riverpod/legacy.dart'
- The app uses client-side state management (no backend currently)
- Original React app preserved in `src/` directory for reference
- All Flutter code is documented in FLUTTER_CODE_REFERENCE.md
