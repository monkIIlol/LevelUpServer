import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
//COMPONENTES DE LA TIENDA 
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
//PÁGINAS DE LA TIENDA 
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
import ProfilePage from './pages/ProfilePage';
// --- COMPONENTES DEL ADMIN 
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserFormPage from './pages/admin/AdminUserFormPage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutErrorPage from './pages/CheckoutErrorPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

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
      {/*RUTAS DE LA TIENDA*/}
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
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout-success" element={<CheckoutSuccessPage />} />
        <Route path="checkout-error" element={<CheckoutErrorPage />} />
        <Route path="perfil" element={<ProfilePage />} />
      </Route>

      {/*RUTAS DEL PANEL DE ADMINISTRACIÓN*/}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="product-new" element={<AdminProductFormPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="user-new" element={<AdminUserFormPage />} />
        
      </Route>
    </Routes>
  );
}

export default App;