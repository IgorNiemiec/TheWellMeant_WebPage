// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Preorders from './pages/Preorders';
import PrivateRoute from './components/PrivateRoute';

function App() {

 
  return (
    <BrowserRouter>
      <Routes>
        {/* Publiczne */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Chronione */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preorders" element={<Preorders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
