import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { imagetools } from "vite-imagetools";

// Runs the Vercel functions in api/ during `npm run dev`, so the quote form,
// reviews and moderation links work locally. Production uses Vercel itself.
function vercelApiInDev(): Plugin {
  return {
    name: "vercel-api-in-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const match = /^\/api\/([a-z-]+)$/.exec(url.pathname);
        const file = match && resolve(`api/${match[1]}.ts`);
        if (!file || !existsSync(file)) return next();
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const raw = Buffer.concat(chunks).toString();
          const type = req.headers["content-type"] ?? "";
          const body = !raw ? undefined : type.includes("application/json") ? JSON.parse(raw) : type.includes("application/x-www-form-urlencoded") ? Object.fromEntries(new URLSearchParams(raw)) : raw;
          const response = Object.assign(res, {
            status(code: number) { res.statusCode = code; return response; },
            json(data: unknown) { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(data)); return response; },
            send(data: string) { res.end(data); return response; },
          });
          const handler = (await server.ssrLoadModule(file)).default;
          await handler(Object.assign(req, { query: Object.fromEntries(url.searchParams), body }), response);
        } catch (error) {
          server.config.logger.error(`api/${match?.[1]} failed: ${String(error)}`);
          if (!res.headersSent) res.statusCode = 500;
          res.end(JSON.stringify({ error: "Local API error" }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Server-side variables (no VITE_ prefix) for the local API bridge only.
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ""))) {
    if (!key.startsWith("VITE_") && process.env[key] === undefined) process.env[key] = value;
  }

  return {
  plugins: [react(), imagetools(), vercelApiInDev()],
  esbuild: {
    logOverride: {
      'ignored-directive': 'silent',
    },
  },
  logLevel: 'info',
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // ignore certain harmless warnings
        if (
          warning.message.includes('Module level directives') ||
          warning.message.includes('"use client"')  ||
          warning.message.includes('"was ignored"')
        ) {
          return;
        }

        // FAIL build on unresolved imports
        if (warning.code === 'UNRESOLVED_IMPORT') {
          throw new Error(`Build failed due to unresolved import:\n${warning.message}`);
        }

        // FAIL build on missing exports (like your Input error)
        if (warning.code === 'PLUGIN_WARNING' && /is not exported/.test(warning.message)) {
          throw new Error(`Build failed due to missing export:\n${warning.message}`);
        }

        // other warnings: log normally
        warn(warning);
      },
    },
  },
  };
});
