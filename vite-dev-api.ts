// Runs the /api serverless functions inside `npm run dev`. On the live site Vercel runs them;
// without this, every /api call on localhost is a 404 (so e.g. job applications fail).
// Dev only. The functions use the keys in .env.local, so emails and payments made locally are REAL.
import fs from "node:fs";
import path from "node:path";
import { loadEnv, type Plugin } from "vite";

const MAX_BODY_BYTES = 1_000_000;

export default function devApi(mode: string): Plugin {
  return {
    name: "dev-api",
    apply: "serve",
    configureServer(server) {
      const root = server.config.root;
      // Server-only keys have no VITE_ prefix, so Vite doesn't load them by itself.
      for (const [key, value] of Object.entries(loadEnv(mode, root, ""))) process.env[key] ??= value;

      server.middlewares.use("/api", async (req, res) => {
        const reply = (status: number, data: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(data));
        };

        // Only top-level files are routes, as on Vercel (api/_lib is not reachable).
        const name = (req.url || "").split("?")[0].slice(1);
        const file = path.join(root, "api", `${name}.js`);
        if (!/^[a-z0-9][a-z0-9-]*$/.test(name) || !fs.existsSync(file)) return reply(404, { error: "Not found" });

        try {
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            size += chunk.length;
            if (size > MAX_BODY_BYTES) return reply(413, { error: "Request too large" });
            chunks.push(chunk);
          }

          // The same small helpers Vercel adds to the request and response.
          const response = Object.assign(res, {
            status(code: number) {
              res.statusCode = code;
              return response;
            },
            json(data: unknown) {
              reply(res.statusCode, data);
              return response;
            },
          });
          const { default: handler } = await server.ssrLoadModule(`/api/${name}.js`);
          await handler(Object.assign(req, { body: Buffer.concat(chunks).toString("utf8") }), response);
        } catch (err) {
          console.error(`[dev-api] ${name}`, err);
          if (!res.writableEnded) reply(500, { error: "Server error" });
        }
      });
    },
  };
}
