import type { Request, Response } from "express";
import { COOKIE_NAME } from "../shared/const";
import { verifySessionToken } from "./_core/cookies";
import { getUserByOpenId } from "./db";
import type { AppUser } from "./_core/env";

export interface Context {
  req: Request;
  res: Response;
  user: AppUser | null;
}

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined;
  const openId = verifySessionToken(token);
  const user = openId ? (await getUserByOpenId(openId)) ?? null : null;
  return { req, res, user };
}
