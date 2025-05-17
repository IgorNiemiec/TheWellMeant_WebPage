// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { token } = useAuth(); 
  // Jeżeli nie ma tokena → przekierowanie do logowania
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
