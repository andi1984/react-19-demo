/**
 * UNIVERSAL COMPONENT (Runs on BOTH server and client)
 *
 * Server execution (entry-server.tsx):
 * - useState/useEffect initialize with default values
 * - useEffect cleanup/effects are NOT executed on server
 * - Returns HTML with initial state
 *
 * Client execution (main.tsx):
 * - Hydrates the server-rendered content
 * - useEffect runs after hydration
 * - Interactive state management and timers work
 */

import { useState, useEffect, Activity } from "react";

// Component with state and effects
// - Server: Only initial state, no effects run
// - Client: Full lifecycle with effects and timers
function VideoPlayer({ id }: { id: string }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Simulate video playback with a timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((t) => {
        if (t >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return t + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="video-player">
      <div className="video-placeholder">
        <span>Video {id}</span>
        {isPlaying && <span className="playing-indicator">Playing...</span>}
      </div>
      <div className="video-controls">
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={currentTime}
          onChange={(e) => setCurrentTime(Number(e.target.value))}
          className="time-slider"
        />
        <span>{currentTime}s</span>
      </div>
      <p className="state-indicator">
        State: {isPlaying ? "Playing" : "Paused"} at {currentTime}s
      </p>
    </div>
  );
}

// A component with form state
function CommentDraft() {
  const [text, setText] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="comment-draft">
      <h4>Draft Comment</h4>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="comment-input"
      />
      <textarea
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="comment-textarea"
      />
      <p className="state-indicator">
        Draft: {name ? `${name}: ` : ""}
        {text || "(empty)"}
      </p>
    </div>
  );
}

type Tab = "video" | "comment" | "other";

export function ActivityDemo() {
  const [activeTab, setActiveTab] = useState<Tab>("video");

  return (
    <div className="demo-section">
      <h2>Activity Demo</h2>
      <p className="demo-description">
        <code>Activity</code> (formerly Offscreen) preserves component state
        when hidden. Switch tabs and notice how state is maintained without
        unmounting components.
      </p>

      <div className="tab-bar">
        <button
          className={`tab-button ${activeTab === "video" ? "active" : ""}`}
          onClick={() => setActiveTab("video")}
        >
          Video Player
        </button>
        <button
          className={`tab-button ${activeTab === "comment" ? "active" : ""}`}
          onClick={() => setActiveTab("comment")}
        >
          Comment Draft
        </button>
        <button
          className={`tab-button ${activeTab === "other" ? "active" : ""}`}
          onClick={() => setActiveTab("other")}
        >
          Other Tab
        </button>
      </div>

      <div className="tab-content">
        {/* Activity keeps components mounted but hidden, preserving their state */}
        <Activity mode={activeTab === "video" ? "visible" : "hidden"}>
          <div className="tab-panel">
            <VideoPlayer id="main" />
          </div>
        </Activity>

        <Activity mode={activeTab === "comment" ? "visible" : "hidden"}>
          <div className="tab-panel">
            <CommentDraft />
          </div>
        </Activity>

        <Activity mode={activeTab === "other" ? "visible" : "hidden"}>
          <div className="tab-panel">
            <h4>Other Content</h4>
            <p>This tab has no stateful content to demonstrate the contrast.</p>
            <p>
              Try editing the video player time or typing in the comment draft,
              then switching tabs!
            </p>
          </div>
        </Activity>
      </div>

      <div className="demo-note">
        <strong>Note:</strong> Activity is still experimental
        (unstable_Activity). It's useful for tab interfaces, navigation drawers,
        and any UI where you want to preserve state while hiding content.
      </div>
    </div>
  );
}
