import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, safeEqual, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

/** Limite simples de tentativas por IP (por instancia de servidor). */
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_ATTEMPTS = 8;

function tooManyAttempts(ip: string): boolean {
  const rec = attempts.get(ip);
  if (!rec) return false;
  if (Date.now() - rec.first > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return rec.count >= MAX_ATTEMPTS;
}

function registerFailure(ip: string) {
  const rec = attempts.get(ip);
  attempts.set(
    ip,
    rec && Date.now() - rec.first <= WINDOW_MS
      ? { count: rec.count + 1, first: rec.first }
      : { count: 1, first: Date.now() },
  );
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  if (tooManyAttempts(ip)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente." },
      { status: 429 },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
  } | null;

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "Credenciais do administrador nao configuradas no servidor (env ADMIN_EMAIL / ADMIN_PASSWORD)." },
      { status: 500 },
    );
  }

  if (!safeEqual(email, adminEmail) || !safeEqual(password, adminPassword)) {
    registerFailure(ip);
    return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
  }

  attempts.delete(ip);

  const res = NextResponse.json({ ok: true, email });
  res.cookies.set(SESSION_COOKIE, createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
