import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header/Header';
import MainComponent from './components/layout/MainComponent/MainComponent';
import Footer from './components/layout/Footer/Footer';
import MenuPage from './pages/MenuPage/MenuPage';
import CartPage from './pages/CartPage/CartPage';
import ReservationPage from './pages/ReservationPage/ReservationPage';
import AboutPage from './pages/AboutPage/AboutPage';
import MyReservationsPage from './pages/MyReservationsPage/MyReservationsPage';
import ChatFeatureContainer from './components/features/ChatAssistant/ChatFeatureContainer';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          <Header />
          {/* The paddingTop is now handled by App.css for responsiveness */}
          <div className="contentAreaWrapper">
            <Routes>
              <Route path="/" element={<MainComponent />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/reservations" element={<ReservationPage />} />
              <Route path="/my-reservations" element={<MyReservationsPage />} />
              {/* Add other routes here as needed */}
            </Routes>
          </div>
          <Footer />
          <ChatFeatureContainer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
