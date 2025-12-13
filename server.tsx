/**
 * SERVER-SIDE ONLY (Node.js/Express)
 *
 * This file runs exclusively on the server (Node.js runtime).
 * It sets up an Express server that:
 * 1. Serves static assets (CSS, JS, images)
 * 2. Performs Server-Side Rendering (SSR) for each request
 * 3. Returns fully rendered HTML to the browser
 *
 * NEVER runs in the browser.
 */

import fs from "node:fs/promises";
import express from "express";

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";
const ssrManifest = isProduction
  ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : undefined;

const app = express();

let vite: any;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// SSR middleware - handles ALL page requests
app.use(async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    let template;
    let render;
    if (!isProduction) {
      // DEV: Load template and transform it with Vite
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      // Load the server-side render function (runs in Node.js)
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      // PROD: Use pre-built template and server bundle
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    // SERVER-SIDE RENDERING: Call render() which executes React components on the server
    // This generates the initial HTML string that will be sent to the browser
    const rendered = await render(url, ssrManifest);

    // Inject the server-rendered HTML into the template
    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "");

    // Send the fully rendered HTML to the browser
    // The browser will then "hydrate" this HTML with JavaScript to make it interactive
    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e: any) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
