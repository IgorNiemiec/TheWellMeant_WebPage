// src/pages/Dashboard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleGoToPreorders = () => {
    navigate('/preorders');
  };

  const handleGoToManageBlogs = () => {
    navigate('/manage-blogs');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Użytkownik wylogowany. Token usunięty.');
    navigate('/'); 
  };

  return (
    <div className="dashboard-page-wrapper"> 
      <div className="dashboard-container">
        <h1>Panel Użytkownika</h1>
        <p>Witaj w panelu użytkownika. Tutaj możesz zarządzać swoimi ustawieniami i zamówieniami.</p>

        <div className="dashboard-actions">
          <button onClick={handleGoToPreorders} className="dashboard-button">
            Zarządzaj Preorderem
          </button>
          <button onClick={handleGoToManageBlogs} className="dashboard-button">
            Zarządzaj Blogami
          </button>
          <button onClick={handleLogout} className="dashboard-logout-button">
            Wyloguj się
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;