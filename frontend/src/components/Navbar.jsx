// src/components/Navbar.jsx (Zakładam, że jest w components, jeśli nie, zmień ścieżkę)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Upewnij się, że kliknięcie poza panelem bocznym i hamburgerem zamyka panel
      if (isOpen && !e.target.closest('.side-panel') && !e.target.closest('.hamburger')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false); // Zamknij panel boczny po nawigacji
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => handleNavigate('/')}>The Well Meant</div>

      {/* Hamburger menu - widoczne tylko na małych ekranach */}
      <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Standardowe linki nawigacyjne - ukryte na małych ekranach */}
      <ul className="nav-links">
        <li><button onClick={() => handleNavigate('/blogs')}>Blogi</button></li>
        <li><button onClick={() => handleNavigate('/login')}>Logowanie</button></li>
        <li><button className="cta-button" onClick={() => handleNavigate('/buy-now')}>Kup teraz</button></li> {/* Zmieniono na cta-button */}
      </ul>

      {/* Panel boczny dla hamburger menu - widoczny tylko na małych ekranach */}
      <div className={`side-panel ${isOpen ? 'visible' : ''}`}>
        <button onClick={() => handleNavigate('/login')}>Logowanie</button>
        <button onClick={() => handleNavigate('/blogs')}>Blogi</button>
        <button className="cta-button" onClick={() => handleNavigate('/buy-now')}>Kup teraz</button> {/* Zmieniono na cta-button */}
      </div>
    </nav>
  );
}