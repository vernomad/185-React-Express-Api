//  import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'

// --- Fix mobile viewport height ---
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// run immediately
setViewportHeight();

// update if viewport size significantly changes
window.addEventListener('resize', setViewportHeight);

// --- END FIX ---

createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <App />
      
    </BrowserRouter>
  </React.StrictMode>
)
