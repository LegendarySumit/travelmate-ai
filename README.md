<div align="center">

# ✈️ TravelMate AI

**Your intelligent travel companion for exploring destinations, checking weather, and planning budgets**

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Groq](https://img.shields.io/badge/Groq_API-FF6B35?style=for-the-badge&logo=api&logoColor=white)

*🌍 Destination Explorer • 🌤️ Weather Planner • 💰 Budget Calculator*

[Live Demo](#) • [Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 About

**TravelMate AI** is a comprehensive travel planning platform that empowers users to make informed travel decisions. Built with modern web technologies and powered by AI, it provides intelligent insights for destination exploration, weather-aware packing suggestions, and smart budget planning.

The application demonstrates a complete full-stack implementation combining React frontend, Firebase cloud infrastructure, Groq AI integration, and real-time data APIs. Whether you're a backpacker planning your next adventure or a business traveler preparing for a trip, TravelMate AI helps you plan smarter.

**Perfect for**: Travel enthusiasts, budget-conscious adventurers, and anyone looking to plan trips efficiently with AI-powered recommendations.

---

## ✨ Features

### 🌍 Destination Explorer
- ✅ Search 200+ countries with AI-powered summaries
- ✅ Get detailed travel information (culture, food, best time to visit)
- ✅ Save favorite destinations to cloud storage
- ✅ Interactive OpenStreetMap integration
- ✅ Country flag display with REST Countries data
- ✅ Personalized travel tips powered by Groq AI

### 🌤️ Weather Planner
- ✅ Real-time weather for any city worldwide
- ✅ 7-day forecast with temperature trends
- ✅ AI-powered smart packing suggestions
- ✅ Weather highlights (humidity, wind, UV index, pressure)
- ✅ Location map with coordinates
- ✅ Hardcoded fallback for data reliability

### 💰 Budget Planner
- ✅ Estimate travel costs by category (accommodation, food, transport, activities)
- ✅ Real-time currency conversion with live exchange rates
- ✅ Support for 35+ currencies with flag icons
- ✅ Save & manage multiple trip budgets in cloud
- ✅ Interactive cost breakdown charts
- ✅ Per-day vs total cost calculator

### 🔐 Authentication & Cloud Storage
- ✅ Email/password registration with password strength validation
- ✅ Google Sign-In integration
- ✅ Firebase authentication with security rules
- ✅ Firestore cloud database for persistent storage
- ✅ Protected routes requiring authentication
- ✅ User profile with display name and photo

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library and component framework |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Router** | Client-side routing and navigation |
| **Lucide React** | Modern icon system (150+ icons) |
| **FontAwesome** | Brand icons (Google sign-in) |

### Backend & Services
| Technology | Purpose |
|-----------|---------|
| **Firebase** | Authentication, Firestore, cloud hosting |
| **Groq API** | AI-powered intelligent suggestions (3 model fallback) |
| **REST Countries API** | Country data and information |
| **OpenWeather API** | Real-time weather data |
| **Exchange Rate API** | Live currency conversion rates |
| **OpenStreetMap/OSRM** | Interactive maps and routing |

### Database & Storage
| Technology | Purpose |
|-----------|---------|
| **Firestore** | NoSQL cloud database |
| **Firebase Auth** | User authentication |
| **Security Rules** | Row-level security enforcement |

### Development Tools
| Tool | Purpose |
|-----------|---------|
| **Git** | Version control |
| **GitHub** | Repository hosting |
| **Postman** | API testing |
| **ESLint** | Code linting |
| **Vercel** | Frontend deployment (optional) |

---

## 📁 Project Structure

```
travelmate-ai/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation with auth state
│   │   ├── ProtectedRoute.jsx       # Route guard for auth
│   │   ├── AuthModal.jsx            # Login/signup modal
│   │   ├── LoginPromptModal.jsx     # Prompt to login
│   │   └── Footer.jsx               # Footer component
│   │
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page
│   │   ├── DestinationExplorer.jsx  # Country search & save
│   │   ├── WeatherPlanner.jsx       # Weather & packing tips
│   │   └── BudgetPlanner.jsx        # Budget calculator
│   │
│   ├── services/
│   │   ├── auth.js                  # Firebase auth functions
│   │   └── firestore.js             # Firestore CRUD operations
│   │
│   ├── lib/
│   │   └── firebase.js              # Firebase config
│   │
│   ├── assets/
│   │   └── images/                  # Country images
│   │
│   ├── App.jsx                      # Main app component
│   └── main.jsx                     # Entry point
│
├── public/                          # Static assets
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
├── FIREBASE_SETUP.md                # Firebase setup guide
└── README.md                        # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/LegendarySumit/travelmate-ai.git
cd travelmate-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment variables**
```bash
cp .env.example .env.local
```

4. **Add your API keys** (see [Configuration](#-configuration) section)

5. **Start development server**
```bash
npm run dev
```

6. **Open browser**
Navigate to `http://localhost:5173`

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# External APIs
VITE_GROQ_API_KEY=your_groq_api_key
VITE_OPENWEATHER_API_KEY=your_openweather_key
VITE_API_URL=http://localhost:3000
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password + Google)
3. Create a **Firestore Database** with these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      match /budgets/{budgetId} {
        allow read, write: if request.auth.uid == userId;
      }
      
      match /destinations/{destId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. Copy your Firebase config to `.env.local`

### External APIs

- **Groq API**: Get key from [console.groq.com](https://console.groq.com)
- **OpenWeather**: Get key from [openweathermap.org](https://openweathermap.org)
- **Exchange Rates**: Uses free API (no key needed) [open.er-api.com](https://open.er-api.com)

---

## 📚 Usage

### 🌍 Destination Explorer

1. Search for any country (e.g., "Japan", "France")
2. View AI-powered travel summaries, culture, food, and best time to visit
3. See interactive map with country coordinates
4. **Save** destinations to your cloud profile for later reference
5. Access saved destinations anytime (requires login)

**Key Features**:
- Groq AI with 3-model fallback for reliability
- Flag icons from flagsapi.com
- OpenStreetMap integration
- Cloud storage of favorites

### 🌤️ Weather Planner

1. Search for a city (e.g., "Tokyo", "New York")
2. View current conditions, humidity, wind, UV index
3. Check 7-day forecast with temperature trends
4. Get AI-powered packing suggestions based on weather
5. See location map with detailed weather highlights

**Key Features**:
- Real-time weather data
- Temperature trend chart
- Packing tips per weather condition
- Interactive weather highlights

### 💰 Budget Planner

1. Select destination and currency
2. Set trip duration and expenses by category
3. View cost breakdown and per-day estimate
4. Use currency converter with live exchange rates
5. **Save** budget to cloud for future reference
6. Edit or delete saved budgets

**Key Features**:
- 35+ currency support with flags
- Real-time exchange rates
- Interactive cost charts
- Save/load/edit budgets in cloud

---

## 🔐 Authentication

### Sign Up
- Email and password with strength validation
- Password must contain: 8+ chars, 1 uppercase, 1 number
- Display name stored in user profile

### Sign In
- Email/password login
- Google Sign-In
- Persistent authentication across sessions

### Protected Routes
- Destination Explorer, Weather Planner, Budget Planner require login
- Non-authenticated users see login prompt modal
- User profile displayed in navbar when logged in

---

## 💾 Database Schema

### Users Collection
```javascript
users/{userId}
├── displayName: string
├── email: string
├── photoURL: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Budgets Sub-Collection
```javascript
users/{userId}/budgets/{budgetId}
├── destination: string
├── currency: string
├── duration: number
├── expenses: object
├── cost: string
├── dates: string
├── savedAt: timestamp
└── updatedAt: timestamp
```

### Destinations Sub-Collection
```javascript
users/{userId}/destinations/{destId}
├── name: string
├── region: string
├── capital: string
├── description: string
├── aiSummary: string
├── culture: string
├── food: string
├── bestTimeToVisit: string
├── heroImage: string
├── countryCode: string
├── attractions: array
├── aiTips: array
├── recommendedCountries: array
├── coordinates: object
├── savedAt: timestamp
└── updatedAt: timestamp
```

---

## 🔧 Build & Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

---

## 🐛 Troubleshooting

### Issue: User data not saving to Firestore
**Solution**: 
- Check Firebase security rules are properly configured
- Verify `.env.local` has correct Firebase credentials
- Ensure user is logged in before saving

### Issue: Weather not loading
**Solution**:
- Check OpenWeather API key is valid
- Verify city name spelling
- Check API rate limits

### Issue: Currency conversion showing wrong rates
**Solution**:
- Check internet connection
- Verify exchange rate API is accessible
- Try refreshing the page

### Issue: Google Sign-In not working
**Solution**:
- Verify Google OAuth is enabled in Firebase Console
- Check authorized domains in Google Cloud Console
- Clear browser cache and cookies

---

## 🔮 Future Enhancements

- [ ] Mobile app version (React Native)
- [ ] Offline mode with service workers
- [ ] Trip itinerary builder
- [ ] Booking integration (flights, hotels)
- [ ] Travel community forum
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Export budgets as PDF
- [ ] Real-time collaboration
- [ ] Travel insurance recommendations
- [ ] Visa requirement checker
- [ ] Local restaurant recommendations

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Pages** | 4 (Home, Explorer, Weather, Budget) |
| **Components** | 5+ reusable components |
| **Countries Supported** | 200+ |
| **Currencies** | 35+ |
| **Cities Pre-loaded** | 6 (expandable) |
| **AI Models** | 3 (with automatic fallback) |
| **External APIs** | 5 integrated |
| **Database Collections** | 3 (users, budgets, destinations) |

---

## 📄 License

This project is built for educational purposes as part of a CX Design course.

---

## 👨‍💻 Author

**LegendarySumit**

- GitHub: [@LegendarySumit](https://github.com/LegendarySumit)
- Project: [TravelMate AI](https://github.com/LegendarySumit/travelmate-ai)
- Live Demo: [TravelMate AI](https://travelmate-ai.vercel.app)

---

<div align="center">

### 🌍 Explore the World Smarter with TravelMate AI

**Built with React • Powered by AI • Secured by Firebase**

⭐ **Star this repo if you find it helpful!**

Made with ❤️ by LegendarySumit

</div>
