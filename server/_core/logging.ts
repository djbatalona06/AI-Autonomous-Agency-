import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

/**
 * Structured JSON logging. Emits one line per request with timing + status, and
 * exposes a small logger used by error handlers. NEVER logs request bodies,
 * cookies, auth headers, passwords or tokens — only safe metadata.
 */

type Level = "info" | "warn" | "error";

function emit(level: Level, message: string, fields: Record<string, unknown> = {}) {
  const line = JSON.stringify({ level, message, ts: new Date().toISOString(), ...fields });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (message: string, fields?: Record<string, unknown>) => emit("info", message, fields),
  warn: (message: string, fields?: Record<string, unknown>) => emit("warn", message, fields),
  error: (message: string, fields?: Record<string, unknown>) => emit("error", message, fields),
};

/** Express middleware: structured request logging with a per-request id. */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = crypto.randomUUID();
  (req as Request & { requestId?: string }).requestId = requestId;
  res.setHeader("x-request-id", requestId);

  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    emit(res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info", "request", {
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
    });
  });

  next();
}
