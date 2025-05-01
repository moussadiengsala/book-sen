import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toast } from './components/Toast.tsx'
import { BrowserRouter as Router } from "react-router"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
      <Toast />
    </Router>
  </StrictMode>,
)
