import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_BASE = "https://connector-gateway.lovable.dev";

interface Destinatario {
  aluno_nome: string;
  aluno_matricula?: string;
  responsavel_nome?: string;
  telefone?: string;
  telegram_chat_id?: string;
  status_chamada: "falta" | "atraso";
}

interface Payload {
  destinatarios: Destinatario[];
  disciplina: string;
  turma: string;
  data: string;
  escola_nome?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as Payload;
    if (!body.destinatarios?.length) {
      return new Response(JSON.stringify({ error: "Sem destinatários" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    const TWILIO_FROM_SMS = Deno.env.get("TWILIO_FROM_SMS");
    const TWILIO_FROM_WHATSAPP = Deno.env.get("TWILIO_FROM_WHATSAPP");

    const dataFmt = new Date(body.data + "T12:00:00").toLocaleDateString("pt-BR");
    const escola = body.escola_nome ?? "i ESCOLAS";

    const resultados: Array<{ aluno: string; canal: string; ok: boolean; erro?: string }> = [];

    async function logEnvio(
      d: Destinatario,
      canal: string,
      ok: boolean,
      erro?: string,
    ) {
      await supabase.from("notificacoes_chamada").insert({
        aluno_nome: d.aluno_nome,
        aluno_matricula: d.aluno_matricula,
        responsavel_nome: d.responsavel_nome,
        telefone: d.telefone,
        telegram_chat_id: d.telegram_chat_id,
        status_chamada: d.status_chamada,
        disciplina: body.disciplina,
        turma: body.turma,
        data_chamada: body.data,
        canal,
        status_envio: ok ? "enviado" : "falhou",
        erro: erro ?? null,
      });
      resultados.push({ aluno: d.aluno_nome, canal, ok, erro });
    }

    for (const d of body.destinatarios) {
      const tipo = d.status_chamada === "falta" ? "ausência" : "atraso";
      const msg = `${escola}: Olá${d.responsavel_nome ? `, ${d.responsavel_nome}` : ""}. Registramos ${tipo} de ${d.aluno_nome} (${body.turma}) na aula de ${body.disciplina} em ${dataFmt}.`;

      // Twilio SMS
      if (TWILIO_API_KEY && LOVABLE_API_KEY && TWILIO_FROM_SMS && d.telefone) {
        try {
          const r = await fetch(`${GATEWAY_BASE}/twilio/Messages.json`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": TWILIO_API_KEY,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ To: d.telefone, From: TWILIO_FROM_SMS, Body: msg }),
          });
          const j = await r.json();
          await logEnvio(d, "sms", r.ok, r.ok ? undefined : JSON.stringify(j));
        } catch (e) {
          await logEnvio(d, "sms", false, String(e));
        }
      }

      // Twilio WhatsApp
      if (TWILIO_API_KEY && LOVABLE_API_KEY && TWILIO_FROM_WHATSAPP && d.telefone) {
        try {
          const r = await fetch(`${GATEWAY_BASE}/twilio/Messages.json`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": TWILIO_API_KEY,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              To: `whatsapp:${d.telefone}`,
              From: `whatsapp:${TWILIO_FROM_WHATSAPP}`,
              Body: msg,
            }),
          });
          const j = await r.json();
          await logEnvio(d, "whatsapp", r.ok, r.ok ? undefined : JSON.stringify(j));
        } catch (e) {
          await logEnvio(d, "whatsapp", false, String(e));
        }
      }

      // Telegram
      if (TELEGRAM_API_KEY && LOVABLE_API_KEY && d.telegram_chat_id) {
        try {
          const r = await fetch(`${GATEWAY_BASE}/telegram/sendMessage`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": TELEGRAM_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ chat_id: d.telegram_chat_id, text: msg }),
          });
          const j = await r.json();
          await logEnvio(d, "telegram", r.ok, r.ok ? undefined : JSON.stringify(j));
        } catch (e) {
          await logEnvio(d, "telegram", false, String(e));
        }
      }
    }

    const enviados = resultados.filter((r) => r.ok).length;
    return new Response(
      JSON.stringify({ total: resultados.length, enviados, resultados }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
