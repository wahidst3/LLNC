import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './config/firebase'; // Initialize Firebase
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import ProductPage from './pages/ProductPage';
import CartProvider from './context/CartContext';
import AuthProvider from './context/AuthContext';
import AdminProvider from './context/AdminContext';
import LoadingScreen from './components/LoadingScreen';
import './index.css';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <Router>
            <LoadingScreen />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/panel" element={<AdminPanel />} />
            </Routes>
          </Router>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;