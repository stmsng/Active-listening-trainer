# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Active Listening Dojo is a Next.js application that teaches active listening skills through interactive AI-powered conversations. Users practice with diverse AI personalities that represent different communication styles and scenarios.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: TailwindCSS 4.1.9 with CSS variables
- **AI Integration**: BAML (BoundaryML) for structured AI conversations
- **Typography**: Geist Sans & Mono fonts
- **Analytics**: Vercel Analytics

### Core Structure
- `app/` - Next.js App Router pages and layouts
  - `page.tsx` - Landing page with hero section and AI personality cards
  - `layout.tsx` - Root layout with fonts and analytics
  - `globals.css` - Global styles and TailwindCSS imports
- `components/` - React components
  - `ui/` - Complete shadcn/ui component library
  - `theme-provider.tsx` - Dark/light mode support
- `lib/` - Utilities
  - `utils.ts` - TailwindCSS class merging utilities
- `hooks/` - Custom React hooks
- `baml_src/` - AI conversation logic and prompts
  - `dojo.baml` - Defines coach characteristics, conversation flow, and grading system

### AI Conversation System
The application uses BAML to structure AI interactions:
- **CoachCharacteristics**: Defines personality traits (name, introversion level)
- **Talk()**: Handles conversational flow with coach characteristics and scenario context
- **GradeActiveListening()**: Evaluates user's active listening performance
- **OpenAI GPT-4**: Configured as the AI client with API key from environment

### UI Design Philosophy
- Uses shadcn/ui "new-york" style with neutral base colors
- CSS variables for theming support
- Responsive design with mobile-first approach
- Gradient backgrounds and glass morphism effects
- AI personality cards with hover animations and rating metrics

## Important Notes

- The Next.js config disables TypeScript and ESLint build errors for development flexibility
- Images are unoptimized in the Next.js config
- Path aliases use `@/*` pattern for clean imports
- BAML requires `OPENAI_API_KEY` environment variable for AI functionality
- The application showcases 6 distinct AI personalities (Sarah, Marcus, Elena, Alex, Dr. James, Maya) each with unique communication styles