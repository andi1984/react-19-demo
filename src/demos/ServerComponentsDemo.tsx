/**
 * UNIVERSAL COMPONENT (Currently runs on BOTH server and client)
 *
 * CURRENT REALITY (Traditional SSR):
 * - This entire file is bundled and sent to the browser
 * - All code executes on BOTH server (during SSR) and client (during hydration)
 * - All JavaScript is included in the client bundle
 *
 * WHAT IT DEMONSTRATES (React Server Components - requires Next.js App Router):
 * In a true RSC environment, this code would be split:
 * - Server Components: Run ONLY on server, zero client JS
 * - Client Components: Marked with 'use client', sent to browser
 * - Server Actions: Marked with 'use server', secure server-only functions
 *
 * Why can't we use 'use server' here?
 * - RSC requires special bundler support (Next.js, experimental Vite plugins)
 * - Current Vite RSC plugins are too unstable for this demo
 * - This demonstrates the concepts - use Next.js App Router for production RSC
 *
 * Key difference:
 * - Traditional SSR: Code runs twice (server then client), all code in bundle
 * - RSC: Server components run once (server), no client JS for those components
 */

import { Suspense, use, useState } from "react";

// Simulated database/API calls
// CURRENT: Runs on both server (SSR) and client (after hydration)
// TRUE RSC: Would run ONLY on server, never in browser
async function fetchServerData(): Promise<{
  products: Array<{
    id: number;
    name: string;
    price: number;
    serverOnly: string;
  }>;
}> {
  // Simulate server-side database query
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    products: [
      {
        id: 1,
        name: "Laptop",
        price: 999,
        serverOnly:
          "Secret: Database connection string - never sent to client!",
      },
      {
        id: 2,
        name: "Mouse",
        price: 29,
        serverOnly: "Secret: API key - stays on server!",
      },
      {
        id: 3,
        name: "Keyboard",
        price: 79,
        serverOnly: "Secret: Internal server data",
      },
    ],
  };
}

// Cache for server data (in true RSC, this would be automatic)
let serverDataCache: Promise<{
  products: Array<{
    id: number;
    name: string;
    price: number;
    serverOnly: string;
  }>;
}> | null = null;

function getServerData() {
  if (!serverDataCache) {
    serverDataCache = fetchServerData();
  }
  return serverDataCache;
}

/**
 * ServerProductList - Simulates a Server Component
 *
 * CURRENT (Traditional SSR):
 * - Runs on server during SSR (entry-server.tsx)
 * - Runs again on client during hydration (main.tsx)
 * - All code is in the client JavaScript bundle
 *
 * TRUE RSC (would require Next.js App Router or similar):
 * - Would run ONLY on server
 * - Would NOT be in client JavaScript bundle at all
 * - Could directly query databases, access filesystem, use API keys
 * - Client would receive only the rendered HTML/RSC payload
 */
function ServerProductList() {
  // use() hook: Unwraps promises
  // CURRENT: Works on both server and client
  // TRUE RSC: Would run only on server
  const data = use(getServerData());

  return (
    <div className="server-component-box">
      <h3>Server Component (simulated)</h3>
      <p className="info-text">
        In a true RSC setup, this component runs only on the server. No
        JavaScript for this component is sent to the client!
      </p>

      <div className="products-grid">
        {data.products.map((product) => (
          <div key={product.id} className="product-card">
            <h4>{product.name}</h4>
            <p className="price">${product.price}</p>
            <p className="server-secret">{product.serverOnly}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ClientCounter - Simulates a Client Component
 *
 * CURRENT (Traditional SSR):
 * - Runs on server during SSR (initial render with count=0)
 * - Runs on client during hydration (re-renders with count=0)
 * - All code is in the client bundle
 *
 * TRUE RSC (would be marked with 'use client'):
 * - Would run ONLY on client
 * - Server would send a placeholder/boundary for this component
 * - Client would render it for the first time (not hydrate)
 * - This is required because it uses interactivity (useState, onClick)
 */
function ClientCounter({ productName }: { productName: string }) {
  // useState with interactivity
  // - Server: Initializes but onClick handlers don't work
  // - Client: Full interactivity after hydration
  const [count, setCount] = useState(0);

  return (
    <div className="client-component-box">
      <h4>Client Component: {productName}</h4>
      <p className="info-text">
        This component is marked with 'use client' (conceptually). It includes
        JavaScript in the client bundle for interactivity.
      </p>
      <div className="counter-controls">
        <button onClick={() => setCount(count - 1)}>-</button>
        <span className="count">Quantity: {count}</span>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
    </div>
  );
}

/**
 * ServerAction simulation
 * In true RSC, this would be marked with 'use server'
 */
async function submitOrder(formData: { product: string; quantity: number }) {
  // Simulate server-side processing
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Server action executed:", formData);
  return { success: true, orderId: Math.random().toString(36).substring(7) };
}

function ServerActionDemo() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      product: formData.get("product") as string,
      quantity: Number(formData.get("quantity")),
    };

    // Call the server action
    const response = await submitOrder(data);
    setResult(`Order ${response.orderId} created successfully!`);
    setLoading(false);
  };

  return (
    <div className="server-action-box">
      <h3>Server Actions (simulated)</h3>
      <p className="info-text">
        Server Actions let you call server-side functions from client
        components. They're marked with 'use server' and run securely on the
        server.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          name="product"
          defaultValue="Laptop"
          placeholder="Product name"
          required
        />
        <input
          name="quantity"
          type="number"
          defaultValue="1"
          min="1"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit Order (Server Action)"}
        </button>
      </form>

      {result && <p className="result-message">{result}</p>}
    </div>
  );
}

/**
 * ServerComponentsDemo - Main demo component
 *
 * CURRENT: Runs on both server and client (traditional SSR)
 * All child components also run on both server and client
 */
export function ServerComponentsDemo() {
  // State management
  // - Server: Uses initial value (false)
  // - Client: Re-initializes and becomes interactive
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="demo-section">
      <h2>React Server Components Demo</h2>
      <div className="demo-description">
        <p>
          React Server Components (RSC) let components run exclusively on the
          server, reducing client bundle size and enabling direct backend
          access.
        </p>
        <ul className="feature-list">
          <li>
            <strong>Server Components:</strong> Run only on server, zero client
            JS
          </li>
          <li>
            <strong>Client Components:</strong> Marked with 'use client',
            interactive
          </li>
          <li>
            <strong>Server Actions:</strong> Marked with 'use server', secure
            server functions
          </li>
          <li>
            <strong>Async Components:</strong> Can await data directly in
            component body
          </li>
        </ul>
        <p className="note">
          Note: This demo illustrates RSC concepts within traditional SSR.
          For production RSC, use Next.js App Router which has mature, stable support.
        </p>
      </div>

      <button
        onClick={() => {
          serverDataCache = null; // Reset cache
          setShowDemo(!showDemo);
        }}
        className="demo-button"
      >
        {showDemo ? "Reset Demo" : "Load Server Components"}
      </button>

      {showDemo && (
        <div className="rsc-demo-container">
          {/* Server Component with Suspense */}
          <Suspense
            fallback={
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Loading from server...</span>
              </div>
            }
          >
            <ServerProductList />
          </Suspense>

          {/* Client Component (would be marked 'use client') */}
          <ClientCounter productName="Laptop" />

          {/* Server Actions Demo */}
          <ServerActionDemo />

          {/* Composition Example */}
          <div className="composition-box">
            <h3>Component Composition</h3>
            <p className="info-text">
              Server Components can render Client Components as children. This
              creates an optimal balance: server-side data fetching with
              client-side interactivity where needed.
            </p>
            <div className="composition-example">
              <div className="server-wrapper">
                Server Component (wrapper)
                <div className="client-island">
                  Client Component (interactive island)
                  <ClientCounter productName="Mouse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
