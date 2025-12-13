/**
 * CLIENT-SIDE ENTRY POINT
 *
 * This file runs ONLY in the browser.
 * It's loaded as a <script> tag and executes after the HTML is received.
 *
 * Two possible modes:
 *
 * 1. HYDRATION MODE (with SSR):
 *    - Server sends HTML with content already rendered
 *    - This script attaches React event listeners to existing HTML
 *    - Makes the static HTML interactive without re-rendering
 *    - Used when running with Express server (npm run dev / npm run preview)
 *
 * 2. CLIENT-SIDE RENDERING MODE (no SSR):
 *    - Server sends empty HTML shell
 *    - This script renders entire app from scratch in browser
 *    - Used for static hosting like GitHub Pages
 *
 * NEVER runs on the server.
 */

import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')!

// Check if the app was server-rendered (has actual element content, not just comments)
const hasServerContent = rootElement.children.length > 0

if (hasServerContent) {
  // HYDRATION: Attach React to server-rendered HTML
  // The HTML is already visible, we're just adding interactivity
  // Does NOT re-render the DOM, just attaches event handlers
  hydrateRoot(
    rootElement,
    <StrictMode>
      <App />
    </StrictMode>
  )
} else {
  // CLIENT-SIDE RENDERING: Render the entire app from scratch
  // Used when no SSR (GitHub Pages static hosting)
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
