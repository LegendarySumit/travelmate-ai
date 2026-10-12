# TravelMate AI — Smart Travel Companion 🌍✈️

A modern web application that helps users explore destinations, check weather conditions, and plan travel budgets with AI-powered insights.

## 🎯 Project Overview

TravelMate AI is a comprehensive travel planning platform built for a Customer Experience (CX) Design course project. It demonstrates the complete CX/UX design and development pipeline from user research to implementation.

### Features

- **🌍 Destination Explorer**: Search countries, view detailed information, and get AI-powered travel summaries
- **🌤️ Weather Planner**: Check current weather conditions and receive smart packing advice
- **💰 Travel Budget Planner**: Estimate expenses, convert currencies, and get budget optimization tips

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Vite | Application structure and fast development |
| Styling | Tailwind CSS | Responsive, clean UI design |
| Routing | React Router | Page navigation |
| Icons | Lucide React | Modern icon system |
| External APIs | REST Countries, OpenWeather, Exchange Rate | Real-time data |
| Backend | Node.js + Express | API proxy and AI integration |
| AI | Groq API | Intelligent suggestions and summaries |
| Database | Firebase Firestore | Data persistence and CRUD operations |
| Testing | Postman + UI Testing | API and functionality verification |
| Analytics | Google Analytics | Usage tracking and metrics |
| Design | Figma | UX/UI prototyping |
| Accessibility | Lighthouse + WAVE | WCAG 2.1 compliance |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/travelmate-ai.git
cd travelmate-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
travelmate-ai/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── FeatureCard.jsx
│   │   ├── LoadingState.jsx
│   │   └── ErrorMessage.jsx
│   ├── pages/           # Main application pages
│   │   ├── Home.jsx
│   │   ├── DestinationExplorer.jsx
│   │   ├── WeatherPlanner.jsx
│   │   └── BudgetPlanner.jsx
│   ├── services/        # API service functions
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Application entry point
├── server/              # Backend API (to be added)
└── public/              # Static assets
```

## 👥 Team Structure

This project follows an equal work distribution model where each team member implements a complete feature independently:

| Student | Feature | APIs | Responsibilities |
|---------|---------|------|------------------|
| Student A | Destination Explorer | REST Countries | Country search, AI summaries, Firestore CRUD, Testing |
| Student B | Weather Planner | OpenWeather | Weather data, AI packing advice, Firestore CRUD, Testing |
| Student C | Budget Planner | Exchange Rate | Currency conversion, AI budget tips, Firestore CRUD, Testing |

**Shared Work**: Design system, navigation, documentation, integration, GitHub workflow, usability testing

## 📋 Implementation Roadmap

### Phase 0: Research & Validation ✅
- [x] User survey and problem statement
- [ ] Analyze user needs and pain points

### Phase 1: Design (In Progress)
- [ ] Create personas and customer journey map
- [ ] Design Figma prototypes for all pages
- [ ] Conduct accessibility review (WCAG 2.1)

### Phase 2: Project Setup ✅
- [x] Initialize React + Vite project
- [x] Configure Tailwind CSS
- [x] Set up routing with React Router
- [x] Create folder structure

### Phase 3: Frontend Development (In Progress)
- [x] Landing page with hero section
- [x] Navigation and footer
- [x] Feature cards and UI components
- [ ] Implement form validation
- [ ] Add loading and error states

### Phase 4: API Integration
- [ ] Integrate REST Countries API
- [ ] Integrate OpenWeather API
- [ ] Integrate Exchange Rate API
- [ ] Handle edge cases and errors

### Phase 5: Backend & AI
- [ ] Set up Express server
- [ ] Configure Groq API integration
- [ ] Create API proxy endpoints
- [ ] Implement AI prompt engineering

### Phase 6: Database
- [ ] Configure Firebase Firestore
- [ ] Implement CRUD operations
- [ ] Set up security rules
- [ ] Test data persistence

### Phase 7: Testing & Evaluation
- [ ] Postman API testing
- [ ] Usability testing with users
- [ ] Lighthouse accessibility audit
- [ ] A/B testing for UI elements

### Phase 8: Deployment & Polish
- [ ] Fix bugs and issues
- [ ] Deploy frontend and backend
- [ ] Final documentation
- [ ] Prepare presentation

## 🎨 Design System

### Colors
- **Primary Blue**: `#3b82f6` - Main actions and branding
- **Navy**: `#0f172a` - Text and headings
- **Gray Scale**: Light backgrounds and borders
- **Accent Colors**: Green (weather), Purple (budget)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, Navy-900
- **Body**: Regular, Gray-600

### Components
- **Cards**: Rounded corners (16px), subtle shadows, hover effects
- **Buttons**: Primary (blue), Secondary (outline)
- **Inputs**: Clean borders, focus states with primary color

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend (to be added)
VITE_API_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
OPENWEATHER_API_KEY=your_openweather_key

# Firebase (to be added)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## 📊 CX Design Modules Coverage

### Module 1: Customer Experience Design
- ✅ Persona development
- ✅ Customer journey mapping
- ✅ Pain point analysis
- ✅ Kano model application

### Module 2: UX Design
- ✅ Wireframing and prototyping (Figma)
- ✅ Responsive design
- ✅ WCAG 2.1 accessibility compliance
- ✅ Usability testing

### Module 3 & 4: Programming
- ✅ React components and hooks
- ✅ Async/await and API integration
- ✅ State management
- ✅ Form validation and error handling

### Module 5: Database & Project Management
- 🔄 Firebase Firestore CRUD operations
- 🔄 GitHub Projects for task management
- 🔄 Git workflow and collaboration

### Module 6: Evaluation & Feedback
- 🔄 User feedback collection
- 🔄 Google Analytics integration
- 🔄 CSAT/CES metrics
- 🔄 Sentiment analysis

### Module 7: AI Integration
- 🔄 Groq API for intelligent suggestions
- 🔄 Ethical AI considerations
- 🔄 Transparency and bias awareness

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🤝 Contributing

This is an academic project. Each team member works on their designated feature independently, following the agreed design system and conventions.

## 📄 License

This project is built for educational purposes as part of a CX Design course.

## 🙏 Acknowledgments

- REST Countries API for destination data
- OpenWeather for weather information
- Groq for AI capabilities
- Course instructors and peers for feedback

---

**Built with ❤️ by the TravelMate AI Team**
