/**
 * SERVER-SIDE RENDERING ENTRY POINT
 *
 * This file runs ONLY on the server (Node.js).
 * It's called by server.tsx during each page request to generate HTML.
 *
 * Flow:
 * 1. Server calls render() function
 * 2. renderToString() executes all React components on the server
 * 3. Returns HTML string (no interactivity yet)
 * 4. Server sends this HTML to browser
 * 5. Browser receives HTML and displays it immediately (fast initial paint)
 * 6. Browser downloads and runs main.tsx to "hydrate" (add interactivity)
 *
 * NEVER runs in the browser.
 */

import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export function render(_url: string, _ssrManifest?: string) {
  // renderToString(): Synchronously renders React tree to HTML string
  // All components in <App /> execute HERE on the server
  const html = renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  )

  return { html }
}
