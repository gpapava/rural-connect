import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { normalizePath, recordPageView } from "@/lib/pageViews";

export const dynamic = "force-dynamic";

const BOTS = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget|python/i;

// Counting is best effort: the response is always 204 so it never affects the page.
export async function POST(request: NextRequest) {
  const done = new NextResponse(null, { status: 204 });
  try {
    const site = request.headers.get("sec-fetch-site");
    if (site && site !== "same-origin") return done;
    if (BOTS.test(request.headers.get("user-agent") ?? "bot")) return done;

    const body = await request.json();
    const view = typeof body?.path === "string" ? normalizePath(body.path) : null;
    if (!view) return done;

    // The session is only used to pick an audience group; nothing about the user is stored.
    const role = (await auth())?.user?.role;
    if (role === "ADMIN") return done;
    const audience = role === "NEET_USER" ? "neet" : role === "COUNSELOR" ? "counselor" : "visitor";

    await recordPageView({ ...view, audience });
  } catch (error) {
    console.error("[page-view] not recorded", error);
  }
  return done;
}
