import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importujemy useNavigate
import ManagePreorder from '../components/Preorder/ManagePreorder';
import './Preorders.css'; // Dodamy ten plik CSS dla Preorders

const Preorders = () => {
  const navigate = useNavigate(); // Inicjalizujemy hook useNavigate

  const handleGoToDashboard = () => {
    navigate('/dashboard'); // Przekierowanie do ścieżki /dashboard
  };

  return (
    <div className="preorders-page-container"> {/* Nowy kontener dla całej strony preorderów */}
      <button onClick={handleGoToDashboard} className="back-button">
        &larr; Powrót do Panelu
      </button>

      {/* Komponent ManagePreorder będzie miał swój własny container */}
      <ManagePreorder /> 
    </div>
  );
};

export default Preorders;