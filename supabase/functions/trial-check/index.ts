import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TRIAL_HOURS = 72;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Detect public IP from headers
    const fwd = req.headers.get("x-forwarded-for") || "";
    const ip = (fwd.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
    const userAgent = req.headers.get("user-agent") || "";

    const body = await req.json().catch(() => ({}));
    const action = body.action || "check";
    const fingerprint = body.fingerprint || null;

    // Find existing session by IP or fingerprint
    const { data: existing } = await supabase
      .from("trial_sessions")
      .select("*")
      .or(`ip_address.eq.${ip}${fingerprint ? `,fingerprint.eq.${fingerprint}` : ""}`)
      .order("started_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const now = new Date();

    if (action === "start") {
      if (existing) {
        const expired = new Date(existing.expires_at) < now;
        return jsonResp({
          status: expired || existing.blocked ? "expired" : "active",
          started_at: existing.started_at,
          expires_at: existing.expires_at,
          ip,
        });
      }

      const expiresAt = new Date(now.getTime() + TRIAL_HOURS * 3600 * 1000);
      const { data: created, error } = await supabase
        .from("trial_sessions")
        .insert({
          ip_address: ip,
          fingerprint,
          user_agent: userAgent,
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (error) {
        return jsonResp({ status: "error", message: error.message }, 500);
      }

      return jsonResp({
        status: "active",
        started_at: created.started_at,
        expires_at: created.expires_at,
        ip,
      });
    }

    // action === "check"
    if (!existing) {
      return jsonResp({ status: "none", ip });
    }

    const expired = new Date(existing.expires_at) < now;
    if (expired && !existing.blocked) {
      await supabase
        .from("trial_sessions")
        .update({ blocked: true, blocked_at: now.toISOString() })
        .eq("id", existing.id);
    }

    return jsonResp({
      status: expired || existing.blocked ? "expired" : "active",
      started_at: existing.started_at,
      expires_at: existing.expires_at,
      ip,
    });
  } catch (e) {
    return jsonResp({ status: "error", message: (e as Error).message }, 500);
  }
});

function jsonResp(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
