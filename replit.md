# Fraction Fun - Kids Learning Game

## Overview

Fraction Fun is an educational web application designed to teach children fractions through interactive, gamified lessons. The app features visual fraction representations (pizza slices, bar models), quizzes with immediate feedback, progress tracking, and a reward/badge system. The design follows Duolingo-style gamification with playful, kid-friendly aesthetics using bright colors, animations, and an encouraging mascot character.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS with custom kid-friendly color scheme and CSS variables for theming (light/dark mode)
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Animations**: Framer Motion for engaging, playful transitions and micro-interactions
- **Typography**: Nunito and Fredoka fonts (Google Fonts) for child-friendly readability

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Build System**: Custom build script using esbuild for server bundling and Vite for client

### Data Layer
- **ORM**: Drizzle ORM with Zod schema validation
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` contains Zod schemas for lessons, questions, progress, and badges
- **Current Storage**: In-memory storage implementation in `server/storage.ts` with lesson and question data hardcoded; ready for database migration

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/   # UI components (game-specific + shadcn/ui)
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data access layer
│   └── vite.ts       # Vite dev server integration
├── shared/           # Shared types and schemas
│   └── schema.ts     # Zod schemas for data validation
└── migrations/       # Database migrations (Drizzle)
```

### Key Design Patterns
- **Shared Schema Validation**: Zod schemas in `shared/` ensure type safety across client and server
- **API Client**: Centralized fetch wrapper in `queryClient.ts` with error handling
- **Component Composition**: Game components (Quiz, FractionVisual, Mascot) compose shadcn/ui primitives
- **Progressive Enhancement**: In-memory storage allows development without database; easily swappable for Drizzle/Postgres

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires DATABASE_URL environment variable)
- **Drizzle Kit**: Database migration and schema management via `db:push` script

### Third-Party Services
- None currently integrated; architecture supports future additions (authentication, analytics)

### Key NPM Packages
- **UI Framework**: @radix-ui/* components, class-variance-authority, tailwind-merge
- **Data Fetching**: @tanstack/react-query
- **Animations**: framer-motion
- **Form Handling**: react-hook-form, @hookform/resolvers, zod
- **Session Management**: express-session, connect-pg-simple (prepared for auth)
- **Build Tools**: Vite, esbuild, tsx

### Fonts (External CDN)
- Google Fonts: Nunito, Fredoka (loaded in client/index.html)