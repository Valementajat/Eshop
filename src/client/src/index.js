import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './pages/App';
import Login from './pages/Login';
import Register from './pages/Register';

const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Register />} />

    </Routes>
  </Router>
);
