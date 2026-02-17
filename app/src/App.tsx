import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import MembershipPage from './pages/MembershipPage';
import PublicationsPage from './pages/PublicationsPage';
import WebinarsPage from './pages/WebinarsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen bg-eu-surface">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/webinars" element={<WebinarsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-eu-surface flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-eu-blue/20 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-eu-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
          <img src="/logo.png" alt="UZEURO" className="h-16 w-auto" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
