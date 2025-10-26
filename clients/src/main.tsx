//  import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'



createRoot(document.getElementById('root')!).render(
  // <StrictMode>

  //   <App />

  // </StrictMode>,
   <React.StrictMode>
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <App />
      
    </BrowserRouter>
  </React.StrictMode>
)
