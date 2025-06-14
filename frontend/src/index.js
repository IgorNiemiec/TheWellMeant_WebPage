import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './index.css';

import App from './App';
import { AuthProvider } from './context/AuthContext';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
   <AuthProvider>
    <App />
  </AuthProvider>,
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
