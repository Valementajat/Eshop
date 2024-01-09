import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './pages/App';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import AccountUpdate from './pages/AccountUpdate';
import VerifyEmail from './pages/VerifyEmail';
import ManageOrders from './pages/ManageOrders';
import OrderUpdate from './pages/OrderUpdate';
import Ufooter from "./components/footer";
import CartDetail from './pages/CartDetail';
import Cart from './pages/Cart';
import OrderDetail from './pages/OrderDetail';
import ProductPage from './pages/ProductPage';
import ToolbarComponent from "./components/ToolbarComponent";
import { CartProvider } from './CartContext';
import About from './pages/About';


const root = createRoot(document.getElementById('root'));

root.render(
  <>
    <CartProvider>
      <Router>
      <ToolbarComponent/>
        <Routes>
          <Route exact path="/" element={<App />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/verify/:email/:token" element={<VerifyEmail />} />

          <Route exact path="/signup" element={<Register />} />
          <Route exact path="/account" element={<Account />} />
          <Route exact path="/account/update" element={<AccountUpdate />} />

          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/cart/:id" element={<CartDetail />} />

          <Route exact path="/admin/orders" element={<ManageOrders />} />
          <Route exact path="/admin/orders/:id" element={<OrderUpdate />} />

          <Route exact path="/orders/:id" element={<OrderDetail />} />
          <Route exact path="/product/:id" element={<ProductPage />} />

          <Route exact path="/About" element={<About />} />
        </Routes>
        <Ufooter />
      </Router>
    </CartProvider>
  </>
);
