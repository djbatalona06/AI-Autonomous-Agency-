import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import { ENV } from "./_core/env";
import { logger } from "./_core/logging";

/**
 * In production the error formatter strips internal details (message/stack) and
 * returns a generic message plus the tRPC error code, while the full error is
 * logged server-side. In development the original message/shape is preserved
 * for fast debugging. Expected client-facing errors (4xx-style codes such as
 * BAD_REQUEST/UNAUTHORIZED/FORBIDDEN/NOT_FOUND/CONFLICT/TOO_MANY_REQUESTS) keep
 * their message so the UI can show actionable feedback.
 */
const SAFE_CODES = new Set([
  "BAD_REQUEST",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "TOO_MANY_REQUESTS",
  "PRECONDITION_FAILED",
  "UNPROCESSABLE_CONTENT",
]);

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    if (!ENV.isProd) return shape;

    // Always log the full error server-side.
    logger.error("trpc_error", {
      code: error.code,
      message: error.message,
      cause: error.cause instanceof Error ? error.cause.message : undefined,
    });

    const exposeMessage = SAFE_CODES.has(error.code) && !error.cause;
    return {
      ...shape,
      message: exposeMessage ? shape.message : "An unexpected error occurred.",
      data: {
        code: shape.data.code,
        httpStatus: shape.data.httpStatus,
        // Strip path/stack/zod internals from prod responses.
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

/** Requires a signed-in user; narrows `ctx.user` to non-null for downstream resolvers. */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in." });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
