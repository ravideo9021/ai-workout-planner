# AI Workout Planner

A modern, responsive web application that generates personalized workout plans using AI based on user's fitness level, goals, available equipment, and time constraints.

## Features

- Personalized workout generation based on user inputs
- Interactive progress tracking
- Mobile-responsive design
- Modern UI with intuitive user experience

## Tech Stack

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: (To be implemented)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-workout-planner.git
   cd ai-workout-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
ai-workout-planner/
├── app/               # Next.js app directory
│   ├── components/    # Reusable UI components
│   ├── context/       # React Context providers
│   ├── utils/         # Utility functions
│   ├── api/           # API routes
│   ├── types/         # TypeScript type definitions
│   ├── about/         # About page
│   ├── create-workout/# Workout creation page
│   ├── progress-tracker/# Progress tracking page
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home page
│   └── globals.css    # Global styles
├── public/            # Static assets
└── README.md          # Project documentation
```

## Future Enhancements

- User authentication and profile management
- Workout logging and progress visualization
- Social sharing features
- Integration with fitness tracking devices/apps
- Nutritional advice based on fitness goals

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 