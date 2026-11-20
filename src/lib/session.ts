import crypto from "crypto";

export const SESSION_COOKIE = "openbot_session";
const MAX_AGE_SECONDS = 7 * 24 * 3600; // 7 dias

function getSecret(): string {
  return process.env.SESSION_SECRET || "dev-only-secret-troque-em-producao";
}

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

export function createSessionToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ email, iat: Date.now() }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export interface SessionData {
  email: string;
}

export function verifySessionToken(
  token: string | undefined | null,
): SessionData | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.email !== "string") return null;
    if (Date.now() - data.iat > MAX_AGE_SECONDS * 1000) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

/** Comparacao em tempo constante para credenciais (evita leakage por tempo). */
export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
