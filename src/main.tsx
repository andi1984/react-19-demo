import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')!

// Check if the app was server-rendered (has actual element content, not just comments)
const hasServerContent = rootElement.children.length > 0

if (hasServerContent) {
  // Hydrate when server-rendered (Express SSR)
  hydrateRoot(
    rootElement,
    <StrictMode>
      <App />
    </StrictMode>
  )
} else {
  // Client-side render when no SSR (GitHub Pages static hosting)
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
