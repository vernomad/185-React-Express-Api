import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const contactDetails = <></>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App contactDetails={contactDetails} />
  </StrictMode>,
)
