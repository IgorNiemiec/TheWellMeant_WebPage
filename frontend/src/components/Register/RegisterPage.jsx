import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/api';
import '../Login/LoginPage.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const { message, success } = await registerUser(email, password);
    if (success) {
      setSuccess('Rejestracja zakończona! Możesz się zalogować.');
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError(message || 'Rejestracja nie powiodła się');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Rejestracja</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło (min 6 znaków)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button type="submit">Zarejestruj się</button>
        <p style={{ marginTop: '1rem' }}>
          Masz już konto? <a href="/">Zaloguj się</a>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
