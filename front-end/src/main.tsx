import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from "react-router"
import {QueryProvider} from "../src/lib/query-providers";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryProvider>
        <Router>
          <App />
        </Router>
      </QueryProvider>
  </StrictMode>,
)
