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

const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/verify/:email/:token" element={<VerifyEmail />} />

      <Route exact path="/signup" element={<Register />} />
      <Route exact path="/account" element={<Account />} />
      <Route exact path="/account/update" element={<AccountUpdate />} />

      <Route exact path="/admin/orders" element={<ManageOrders />} />
      <Route exact path="/admin/orders/:id" element={<OrderUpdate />} />


    </Routes>
  </Router>
);
