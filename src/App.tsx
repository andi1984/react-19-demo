/**
 * UNIVERSAL COMPONENT (Runs on BOTH server and client)
 *
 * Execution flow:
 *
 * 1. SERVER (entry-server.tsx):
 *    - Component executes during SSR (renderToString)
 *    - useState initializes with default value ("suspense")
 *    - Event handlers (onClick) are ignored on server
 *    - Returns HTML string with initial state
 *
 * 2. CLIENT (main.tsx):
 *    - Component executes again during hydration
 *    - useState re-initializes with same default value
 *    - React matches server HTML with client render
 *    - Attaches event handlers to make buttons interactive
 *    - setState now works and causes re-renders
 *
 * Key point: This code runs TWICE (once server, once client)
 * But the user only sees ONE seamless experience.
 */

import { useState } from "react";
import { SuspenseDemo } from "./demos/SuspenseDemo";
import { ActivityDemo } from "./demos/ActivityDemo";
import { ViewTransitionsDemo } from "./demos/ViewTransitionsDemo";
import { ServerComponentsDemo } from "./demos/ServerComponentsDemo";
import "./App.css";

type Demo = "suspense" | "activity" | "viewtransitions" | "servercomponents";

function App() {
  // useState: Works differently on server vs client
  // - Server: Only uses initial value, no re-renders possible
  // - Client: Full state management with re-renders
  const [activeDemo, setActiveDemo] = useState<Demo>("suspense");

  return (
    <div className="app">
      <header className="app-header">
        <h1>React 19 Features Demo</h1>
        <p>Exploring Suspense, Activity, View Transitions, and Server Components</p>
      </header>

      <nav className="demo-nav">
        <button
          className={`nav-button ${activeDemo === "suspense" ? "active" : ""}`}
          onClick={() => setActiveDemo("suspense")}
        >
          Suspense
        </button>
        <button
          className={`nav-button ${activeDemo === "activity" ? "active" : ""}`}
          onClick={() => setActiveDemo("activity")}
        >
          Activity
        </button>
        <button
          className={`nav-button ${
            activeDemo === "viewtransitions" ? "active" : ""
          }`}
          onClick={() => setActiveDemo("viewtransitions")}
        >
          View Transitions
        </button>
        <button
          className={`nav-button ${
            activeDemo === "servercomponents" ? "active" : ""
          }`}
          onClick={() => setActiveDemo("servercomponents")}
        >
          Server Components
        </button>
      </nav>

      <main className="demo-content">
        {activeDemo === "suspense" && <SuspenseDemo />}
        {activeDemo === "activity" && <ActivityDemo />}
        {activeDemo === "viewtransitions" && <ViewTransitionsDemo />}
        {activeDemo === "servercomponents" && <ServerComponentsDemo />}
      </main>
    </div>
  );
}

export default App;
