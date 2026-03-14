import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AIMastery from '../ai-mastery-app.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AIMastery />
  </StrictMode>,
)
