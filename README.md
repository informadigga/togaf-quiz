# TOGAF Quiz Application

A comprehensive web-based TOGAF certification quiz application built with React and Express.

## Features

- ✅ Interactive quiz interface with 25 random TOGAF questions from a pool of 248+ questions
- ✅ Timer that shows elapsed time
- ✅ Dark mode enabled by default
- ✅ Review mode to check answers after completion
- ✅ Home button with confirmation dialog
- ✅ **Questions Catalog** - Browse all questions in the database with answers highlighted
- ✅ Catalog accessible from both start screen and during quiz
- ✅ Search functionality in the catalog
- ✅ Responsive design for mobile and desktop
- ✅ Accessible UI with proper ARIA labels

## Adding More Questions

To add more questions to the quiz pool, edit the `client/src/data/questions.ts` file:

### Step 1: Open the Questions File

Navigate to `client/src/data/questions.ts` and locate the `togafQuestions` array.

### Step 2: Add New Questions

Add your new questions following this exact format:

```typescript
{
  question: "Your question text here?",
  options: {
    A: "Option A text",
    B: "Option B text", 
    C: "Option C text",
    D: "Option D text",
    E: "Option E text" // Optional - you can have 4 or 5 options
  },
  answer: "A" // The correct answer option (A, B, C, D, or E)
}
```

### Step 3: Example

Here's an example of adding a new question:

```typescript
export const togafQuestions = [
  // ... existing questions ...
  {
    question: "What does TOGAF stand for?",
    options: {
      A: "The Open Group Architecture Framework",
      B: "Technical Operations Guidelines and Framework",
      C: "Total Organizational Governance and Framework",
      D: "The Official Guide to Architecture Fundamentals"
    },
    answer: "A"
  }
  // Add more questions here...
];
```

### Step 4: Save and Test

1. Save the file
2. The application will automatically reload
3. Start a new quiz to see your new questions

## Technical Details

- **Frontend**: React 18 with TypeScript, Tailwind CSS, Shadcn/ui components
- **Backend**: Express.js with TypeScript
- **State Management**: React Query for server state
- **Styling**: Dark mode with Tailwind CSS
- **Storage**: In-memory storage (development)

## Running the Application

The application runs automatically in Replit. If you need to restart it manually:

1. Click the "Start application" workflow
2. The app will be available at the provided URL

## Project Structure

```
├── client/src/
│   ├── data/
│   │   └── questions.ts          # Quiz questions data
│   ├── components/
│   │   └── quiz/                 # Quiz-related components
│   └── pages/
│       └── quiz.tsx              # Main quiz page
├── server/
│   ├── storage.ts                # Data storage layer
│   └── routes.ts                 # API endpoints
└── shared/
    └── schema.ts                 # Shared TypeScript types
```

## Using the Questions Catalog

### Accessing the Catalog

The Questions Catalog can be accessed in two ways:

1. **From the Start Screen**: Click the "Browse Questions Catalog" button before starting the quiz
2. **During the Quiz**: Click the book icon (📚) in the top-right corner of the quiz interface

### Catalog Features

- **Search**: Type keywords to find specific questions
- **Question Count**: Shows total number of questions available (248+ unique questions)
- **Correct Answers**: Highlighted in green with a "Correct Answer" badge
- **Scrollable**: Browse through all questions easily
- **Non-Destructive**: Opening the catalog doesn't affect your quiz progress

## Customization

### Changing Quiz Length

By default, the quiz shows 25 random questions. To change this:

1. Edit `server/routes.ts`
2. Look for the line that shuffles and slices questions
3. Change the number in `.slice(0, 25)` to your desired count

### Styling

The application uses Tailwind CSS with a dark theme. To customize:

1. Edit `client/src/index.css` for global styles
2. Modify component-specific styles in individual component files

## Support

For any issues or questions about adding content to the quiz, refer to the existing questions in `client/src/data/questions.ts` for proper formatting examples.