import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importujemy useNavigate
import ManagePreorder from '../components/Preorder/ManagePreorder';
import './Preorders.css';

const Preorders = () => {
  const navigate = useNavigate(); 

  const handleGoToDashboard = () => {
    navigate('/dashboard'); 
  };

  return (
    <div className="preorders-page-container"> 
      <button onClick={handleGoToDashboard} className="back-button">
        &larr; Powrót do Panelu
      </button>

      <ManagePreorder /> 
    </div>
  );
};

export default Preorders;