import { useState } from "react";
import { SuspenseDemo } from "./demos/SuspenseDemo";
import { ActivityDemo } from "./demos/ActivityDemo";
import { ViewTransitionsDemo } from "./demos/ViewTransitionsDemo";
import "./App.css";

type Demo = "suspense" | "activity" | "viewtransitions";

function App() {
  const [activeDemo, setActiveDemo] = useState<Demo>("suspense");

  return (
    <div className="app">
      <header className="app-header">
        <h1>React 19 Features Demo</h1>
        <p>Exploring Suspense, Activity, and View Transitions</p>
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
      </nav>

      <main className="demo-content">
        {activeDemo === "suspense" && <SuspenseDemo />}
        {activeDemo === "activity" && <ActivityDemo />}
        {activeDemo === "viewtransitions" && <ViewTransitionsDemo />}
      </main>
    </div>
  );
}

export default App;
