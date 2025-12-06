import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Apply initial theme class before React renders
const storedTheme = localStorage.getItem('getrem-theme') || 'light';
document.documentElement.classList.add(storedTheme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
