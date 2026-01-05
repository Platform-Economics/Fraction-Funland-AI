# Design Guidelines: Fractions Learning Game for Kids

## Design Approach
**Reference-Based**: Drawing inspiration from Duolingo's gamification, Khan Academy Kids' playful aesthetics, and Prodigy Math's reward systems. This is a highly experience-focused application where visual appeal and emotional engagement are critical for an 8-year-old audience.

## Core Design Principles
1. **Playful & Encouraging**: Every interaction celebrates progress
2. **Visual Learning**: Graphics and illustrations over text-heavy explanations
3. **Age-Appropriate Complexity**: Simple, large touch targets with clear visual hierarchies
4. **Progressive Disclosure**: Information revealed in digestible chunks

## Layout System
- **Spacing**: Use Tailwind units of 3, 4, 6, and 8 for consistent, generous spacing (p-6, gap-4, m-8)
- **Container Width**: max-w-4xl for lesson content, max-w-6xl for dashboard views
- **Grid System**: Single column on mobile, 2-column layouts for lesson selection/progress cards on desktop

## Typography
- **Primary Font**: 'Fredoka' or 'Nunito' (Google Fonts) - rounded, friendly, highly readable for children
- **Headings**: text-3xl to text-5xl, font-bold, playful and encouraging tone
- **Body Text**: text-lg to text-xl (larger than typical for young readers)
- **Button Text**: text-base to text-lg, font-semibold, uppercase for primary actions

## Component Library

### Navigation
- **Top Bar**: Large mascot/logo on left, progress indicator in center, badge/reward counter on right
- **Back Button**: Oversized (h-12 w-12) with clear "←" icon, positioned top-left

### Lesson Introduction Card
- **Layout**: Full-width card with illustration on left (40%), content on right (60%)
- **Structure**: 
  - Large heading "Why Fractions Matter!"
  - 2-3 real-world examples with small icons (pizza slices, measuring cups, sharing toys)
  - Bright "Start Learning!" button with arrow icon
  - Friendly mascot character providing encouragement

### Interactive Fraction Game Area
- **Visual Fraction Displays**: Large circular pie charts or rectangular bar models (min 200px width)
- **Answer Options**: Grid of 2x2 or 3x1 large cards (min h-20) with clear numbers/fractions
- **Drag-and-Drop Zones**: Generous drop targets with dashed borders (min 120px height)

### Progress & Rewards System
- **Progress Bar**: Rainbow gradient fill, large (h-4), shows percentage and star milestones
- **Badge Display**: Circular badges (w-16 h-16) with shiny effects, earned badges have glow treatment
- **Celebration Modal**: Full-screen overlay with confetti animation, large badge display, encouraging message

### Question Cards
- **Structure**: Centered max-w-2xl card with generous padding (p-8)
- **Question Text**: text-2xl, illustrated problem scenario
- **Interactive Elements**: Touch-friendly spacing (gap-4 between options)
- **Feedback Zone**: Immediate visual response (checkmark/encouragement for correct, gentle hint for incorrect)

### Dashboard/Home
- **Lesson Cards**: Grid layout with rounded-3xl cards showing:
  - Lesson number badge (top-left)
  - Large fraction illustration
  - Lesson title
  - Progress indicator (stars earned out of total)
  - Lock icon for unavailable lessons
- **Layout**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-6

### Mascot/Character System
- **Placement**: Bottom-right corner during lessons (w-24 h-24 on mobile, w-32 h-32 on desktop)
- **Purpose**: Provides encouragement, hints, and celebrates wins
- **Treatment**: Friendly animal or friendly geometric character with expressive faces

## Images
- **Hero Image**: No traditional hero needed; start immediately with mascot welcome screen
- **Lesson Illustrations**: Custom colorful illustrations for each fraction concept (pizza, chocolate bars, measuring cups, groups of objects)
- **Badge Icons**: Unique illustrated badges for milestones (Bronze/Silver/Gold stars, themed badges like "Fraction Master")
- **Mascot**: Consistent character throughout appearing in different poses/emotions
- **Background Patterns**: Subtle playful geometric patterns or soft gradients, never distracting

## Interaction Patterns
- **Immediate Feedback**: Every answer shows instant visual response
- **Sound Cues**: Cheerful sounds for correct answers, gentle encouraging sound for tries
- **Animation**: Celebratory bounce/scale animations on success, gentle shake on errors
- **Encouragement**: Always positive framing ("Try again!" vs "Wrong!")

## Accessibility
- **Touch Targets**: Minimum 44px height for all interactive elements
- **Contrast**: High contrast between text and backgrounds for readability
- **Simple Language**: Age-appropriate vocabulary, short sentences
- **Visual Cues**: Icons paired with all text labels
- **Screen Reader**: Descriptive labels for all interactive elements

## Special Features
- **Streak Counter**: Daily completion tracking with flame icon
- **Parent Dashboard**: Separate simplified view showing progress (optional toggle)
- **Hints System**: Progressive hints revealed with lightbulb icon
- **Practice Mode**: Revisit completed lessons without affecting progress