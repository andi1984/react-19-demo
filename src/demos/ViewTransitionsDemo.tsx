/**
 * UNIVERSAL COMPONENT (Runs on BOTH server and client)
 *
 * Server execution (entry-server.tsx):
 * - Renders initial state (list view or detail view)
 * - document.startViewTransition is NOT available on server
 * - Returns static HTML
 *
 * Client execution (main.tsx):
 * - Hydrates the server-rendered content
 * - View Transitions API works in browser
 * - Interactive state changes trigger smooth visual transitions
 *
 * Note: View Transitions are a CLIENT-ONLY browser feature
 */

import { useState, useCallback } from "react";
import { flushSync } from "react-dom";

interface Item {
  id: number;
  title: string;
  description: string;
  image: string;
}

const items: Item[] = [
  {
    id: 1,
    title: "Mountain Vista",
    description:
      "A breathtaking view of snow-capped mountains at sunrise. The golden light paints the peaks in warm hues while the valleys below remain in cool shadow.",
    image: "🏔️",
  },
  {
    id: 2,
    title: "Ocean Waves",
    description:
      "Powerful waves crash against weathered rocks on a dramatic coastline. The sea spray catches the afternoon light, creating rainbows in the mist.",
    image: "🌊",
  },
  {
    id: 3,
    title: "Forest Path",
    description:
      "A winding trail through an ancient forest, dappled sunlight filtering through the canopy. Moss covers the ground in a soft green carpet.",
    image: "🌲",
  },
  {
    id: 4,
    title: "Desert Sunset",
    description:
      "The vast desert landscape transforms under a spectacular sunset. Cacti stand as silhouettes against the vibrant orange and purple sky.",
    image: "🏜️",
  },
];

function ListView({ onSelect }: { onSelect: (item: Item) => void }) {
  return (
    <div className="list-view">
      <h3>Gallery</h3>
      <div className="item-grid">
        {items.map((item) => (
          <button
            key={item.id}
            className="item-card"
            onClick={() => onSelect(item)}
          >
            <span
              className="item-emoji"
              style={{ viewTransitionName: `image-${item.id}` }}
            >
              {item.image}
            </span>
            <span
              className="item-title"
              style={{ viewTransitionName: `title-${item.id}` }}
            >
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailView({ item, onBack }: { item: Item; onBack: () => void }) {
  return (
    <div className="detail-view">
      <button className="back-button" onClick={onBack}>
        ← Back to Gallery
      </button>
      <div className="detail-content">
        <span
          className="detail-emoji"
          style={{ viewTransitionName: `image-${item.id}` }}
        >
          {item.image}
        </span>
        <h3
          className="detail-title"
          style={{ viewTransitionName: `title-${item.id}` }}
        >
          {item.title}
        </h3>
        <p className="detail-description">{item.description}</p>
      </div>
    </div>
  );
}

export function ViewTransitionsDemo() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleSelect = useCallback((item: Item) => {
    // View Transitions API requires synchronous DOM updates
    // flushSync forces React to update the DOM immediately
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setSelectedItem(item);
        });
      });
    } else {
      setSelectedItem(item);
    }
  }, []);

  const handleBack = useCallback(() => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setSelectedItem(null);
        });
      });
    } else {
      setSelectedItem(null);
    }
  }, []);

  return (
    <div className="demo-section">
      <h2>View Transitions Demo</h2>
      <p className="demo-description">
        View Transitions use the browser's View Transitions API with{" "}
        <code>flushSync</code> to force synchronous DOM updates. Elements with
        matching <code>viewTransitionName</code> styles animate smoothly between
        views.
      </p>

      <div className="transition-container">
        {selectedItem ? (
          <DetailView item={selectedItem} onBack={handleBack} />
        ) : (
          <ListView onSelect={handleSelect} />
        )}
      </div>

      <div className="demo-note">
        <strong>Note:</strong> View Transitions require browser support (Chrome
        111+, Edge 111+). The <code>flushSync</code> ensures the DOM updates
        synchronously within the transition callback.
      </div>
    </div>
  );
}
