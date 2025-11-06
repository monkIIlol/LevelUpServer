import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

//componentes de layout
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; 

//páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';

const AppLayout = () => {
  return (
    <>
      <ScrollToTop /> 
      <Header />
      <Outlet /> 
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="product/:code" element={<ProductDetailPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<BlogDetailPage />} /> 
        
      </Route>
    </Routes>
  );
}

export default App;