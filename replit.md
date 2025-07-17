# TOGAF Quiz Application

## Overview

This is a full-stack TOGAF (The Open Group Architecture Framework) certification quiz application built with React and Express. The application allows users to take timed quizzes with TOGAF certification questions, review their answers, and track their progress.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: In-memory storage (development) with planned PostgreSQL persistence
- **API Design**: RESTful endpoints with JSON responses

### Database Design
- **Users Table**: Basic user management with username/password
- **Questions Table**: TOGAF questions with multiple choice options and answers
- **Quiz Sessions Table**: Tracks user quiz attempts with answers, scores, and timing

## Key Components

### Frontend Components
- **Quiz Interface**: Main quiz taking experience with timer and navigation
- **Question Card**: Individual question display with radio button options
- **Quiz Navigation**: Previous/next navigation with mark for review functionality
- **Results Modal**: Score display and quiz completion summary
- **Review Mode**: Detailed answer review with correct/incorrect highlighting

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **Quiz Management**: Session creation, answer submission, and scoring
- **Question Management**: TOGAF question pool with randomization

### Shared Schema
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Validation**: Zod schemas for API request/response validation
- **Database Models**: Drizzle ORM schema definitions

## Data Flow

1. **Quiz Initialization**: User starts quiz → Backend creates session with randomized questions
2. **Question Display**: Frontend fetches questions → Displays current question with options
3. **Answer Submission**: User selects answer → Frontend updates local state → Backend updates session
4. **Timer Management**: Client-side countdown with periodic backend synchronization
5. **Quiz Completion**: Time expires or user submits → Backend calculates score → Results displayed
6. **Review Process**: User can review answers → Frontend shows correct/incorrect answers with explanations

## External Dependencies

### Production Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Database**: Neon Database for serverless PostgreSQL
- **ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod for runtime type checking
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React Query for server state management

### Development Dependencies
- **Build Tools**: Vite for development server and bundling
- **Language**: TypeScript for type safety
- **Linting**: ESLint for code quality
- **Development Server**: tsx for TypeScript execution

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server for frontend with HMR
- **Backend**: tsx for TypeScript execution with file watching
- **Database**: Neon Database serverless connection
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite build to static assets in dist/public
- **Backend**: esbuild bundle to dist/index.js
- **Database**: Drizzle migrations to PostgreSQL
- **Deployment**: Node.js server serving static files and API routes

### Key Configuration Files
- **drizzle.config.ts**: Database migration configuration
- **vite.config.ts**: Frontend build configuration with path aliases
- **tsconfig.json**: TypeScript configuration with shared paths
- **tailwind.config.ts**: Styling configuration with theme variables

### Notable Features
- **Questions Catalog**: Browse all questions in the database with search functionality and answers highlighted in green
- **Dual Access**: Catalog accessible from both start screen and during quiz without losing progress
- **Expanded Question Pool**: 248+ unique TOGAF questions with authentic content from certification materials
- **Enhanced Review Mode**: Fixed text visibility with proper color contrast for answers
- **Replit Integration**: Configured for Replit development environment
- **Path Aliases**: Configured shortcuts for imports (@/, @shared/, etc.)
- **Type Safety**: End-to-end TypeScript with shared types
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Built on Radix UI for keyboard navigation and screen readers