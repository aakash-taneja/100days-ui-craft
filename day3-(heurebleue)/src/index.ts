import { serve, file } from "bun";
import index from "./index.html";
import { join } from "path";
import { readdirSync } from "fs";

const publicDir = join(import.meta.dir, "../public");

// Build routes with static files first, then catch-all for SPA
const routes: Record<string, any> = {};

try {
  const files = readdirSync(publicDir);
  for (const f of files) {
    routes[`/${f}`] = new Response(file(join(publicDir, f)));
  }
} catch (e) {
  console.log("No public directory found");
}

// Catch-all for SPA routing (must be last)
routes["/*"] = index;

const server = serve({
  routes,
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
