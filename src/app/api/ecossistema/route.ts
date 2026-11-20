import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";

/**
 * GET /api/ecossistema — proxy autenticado para o Media-Kit.
 *
 * Sincronização OpenBot ↔ clodoaldo.vercel.app (Task 19/11):
 *  - exige sessão admin válida (mesma sessão HMAC do painel);
 *  - chama server-side clodoaldo.vercel.app/api/openbot/overview, repassando
 *    a chave OPENBOT_API_KEY (se configurada na Vercel) para receber também
 *    os respondentes recentes;
 *  - SEM a chave, o Media-Kit ainda devolve os agregados públicos — o painel
 *    funciona de qualquer forma (modo degradado, nunca quebra).
 *
 * Read-only: não altera nada no Media-Kit.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MEDIA_KIT_URL =
  process.env.MEDIA_KIT_URL || "https://clodoaldo.vercel.app";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const headers: Record<string, string> = {};
    if (process.env.OPENBOT_API_KEY) {
      headers["x-openbot-key"] = process.env.OPENBOT_API_KEY;
    }
    const res = await fetch(`${MEDIA_KIT_URL}/api/openbot/overview`, {
      headers,
      cache: "no-store",
      signal: ctrl.signal,
    });
    const data = await res.json();
    return NextResponse.json(data, {
      status: res.ok ? 200 : 502,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, erro: `Media-Kit indisponível: ${(e as Error).message}` },
      { status: 502 }
    );
  } finally {
    clearTimeout(timer);
  }
}
