import type { Express, Request, Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import * as db from "../db";

const secret = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "fallback-secret-change-me"
);

export function registerAdminAuthRoutes(app: Express) {
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    try {
      await db.upsertUser({
        openId: `admin-${username}`,
        name: username,
        email: null,
        loginMethod: "local",
        lastSignedIn: new Date(),
      });
    } catch (e) {
      console.error("DB upsert failed:", e);
      // Continue anyway — we'll still issue the token
    }

    const token = await new SignJWT({ openId: `admin-${username}`, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1y")
      .sign(secret);

    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
    res.json({ success: true });
  });
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { openId: string; role: string };
  } catch {
    return null;
  }
}