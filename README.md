# Fraction Funland

An interactive, gamified web application designed to teach children fractions through engaging visual lessons, quizzes, and rewards. Built with a playful, kid-friendly aesthetic inspired by popular learning apps like Duolingo.

## Features

- **Visual Fraction Learning**: Interactive tutorials using pizza slices, bar models, and circle representations to make fractions intuitive
- **Step-by-Step Tutorials**: Guided lessons covering fraction basics, division with decimals, and algebraic thinking
- **Interactive Quizzes**: Multiple choice and visual identification questions with immediate feedback
- **Math Scratch Pad**: Built-in drawing canvas and typing area for working out problems step-by-step
- **Progress Tracking**: Track completion across lessons with visual progress indicators
- **Rewards & Badges**: Earn badges for completing lessons and achieving milestones
- **Mascot Character**: Friendly fox mascot provides encouragement and celebrates achievements
- **Sound Effects**: Audio feedback for correct/incorrect answers and celebrations
- **Dark/Light Mode**: Full theme support for comfortable learning in any environment
- **Mobile Responsive**: Works great on tablets and phones for learning on the go

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling with custom kid-friendly color scheme
- **Framer Motion** for smooth animations
- **shadcn/ui** components built on Radix UI
- **TanStack React Query** for data fetching
- **Wouter** for routing

### Backend
- **Node.js** with Express
- **TypeScript**
- **Drizzle ORM** with PostgreSQL support
- **Zod** for schema validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fraction-funland.git
cd fraction-funland
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Add your database URL (optional - app works with in-memory storage)
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5000`

## Project Structure

```
fraction-funland/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── FractionVisual.tsx    # Pizza/bar/circle visualizations
│   │   │   ├── Quiz.tsx              # Quiz component with scoring
│   │   │   ├── SketchPad.tsx         # Drawing/typing scratch pad
│   │   │   ├── VisualTutorial.tsx    # Interactive lesson tutorials
│   │   │   └── Mascot.tsx            # Animated fox mascot
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and sounds
├── server/                 # Express backend
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Data layer (in-memory or database)
│   └── vite.ts             # Vite dev server integration
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Zod schemas for validation
└── migrations/             # Database migrations (Drizzle)
```

## Lessons Included

1. **What Are Fractions?** - Introduction to fractions using pizza slices
2. **Sharing Equally** - Division concepts with money and equal sharing
3. **Fractions as Decimals** - Converting between fractions and decimals
4. **Comparing Fractions** - Understanding which fractions are larger/smaller

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and component patterns
- Use TypeScript for type safety
- Add `data-testid` attributes to interactive elements for testing
- Test on both light and dark modes
- Ensure mobile responsiveness

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Design inspiration from [Duolingo](https://www.duolingo.com/) and [KetoNow Kids](https://app.ketonow.ai/kids)
- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Icons from [Lucide](https://lucide.dev/)
- Fonts: Nunito and Fredoka from Google Fonts

---

Made with love for young learners everywhere.
