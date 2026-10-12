import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
            <Route path="/destination" element={<DestinationExplorer />} />
            <Route path="/weather" element={<WeatherPlanner />} />
            <Route path="/budget" element={<BudgetPlanner />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
