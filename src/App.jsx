import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import DestinationExplorer from './pages/DestinationExplorer';
import WeatherPlanner from './pages/WeatherPlanner';
import BudgetPlanner from './pages/BudgetPlanner';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/destination" 
              element={
                <ProtectedRoute>
                  <DestinationExplorer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/weather" 
              element={
                <ProtectedRoute>
                  <WeatherPlanner />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/budget" 
              element={
                <ProtectedRoute>
                  <BudgetPlanner />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
