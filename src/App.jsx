import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import MainComponent from './components/MainComponent/MainComponent';
import Footer from './components/Footer/Footer';
import MenuPage from './pages/MenuPage/MenuPage';
import CartPage from './pages/CartPage/CartPage';
import ReservationPage from './pages/ReservationPage/ReservationPage';
import AboutPage from './pages/AboutPage/AboutPage';
import ChatFeatureContainer from './components/ChatAssistant/ChatFeatureContainer';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          <Header />
          {/* Add padding-top to account for the fixed header */}
          <div style={{ flexGrow: 1, paddingTop: '82px' }}> 
            <Routes>
              <Route path="/" element={<MainComponent />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/reservations" element={<ReservationPage />} />
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
