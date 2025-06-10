// src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
// Możesz stworzyć osobny plik CSS dla LoginPage lub użyć globalnego
import '../styles/Login.css'; // <-- Nowy plik CSS lub zmodyfikuj istniejący

const Login = () => {
  return (
    <div className="login-page-wrapper"> {/* Ten wrapper będzie centrował formularz */}
      <LoginForm />
    </div>
  );
};

export default Login;