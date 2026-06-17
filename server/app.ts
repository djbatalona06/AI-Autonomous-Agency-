import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./context";
import { authRouter } from "./_core/auth";

/**
 * Builds the API Express app (no `listen`, no static serving) so it can be
 * shared by the local server (`server/index.ts`) and the Vercel serverless
 * entrypoint (`api/index.ts`). Mounts only the API surface: `/api/auth` and
 * `/trpc`. Static client assets are served by the host (Vite locally, Vercel
 * static output in production).
 */
export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use("/api/auth", authRouter);
  app.use(
    "/trpc",
    createExpressMiddleware({ router: appRouter, createContext }),
  );

  return app;
}
