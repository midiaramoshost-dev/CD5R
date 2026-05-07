import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type TrialStatus = "loading" | "none" | "active" | "expired" | "error";

export interface TrialState {
  status: TrialStatus;
  startedAt?: string;
  expiresAt?: string;
  msRemaining: number;
}

const STORAGE_KEY = "iescolas_trial_v1";

function getFingerprint(): string {
  let fp = localStorage.getItem("iescolas_fp");
  if (!fp) {
    fp = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("iescolas_fp", fp);
  }
  return fp;
}

async function callTrial(action: "start" | "check"): Promise<any> {
  const { data, error } = await supabase.functions.invoke("trial-check", {
    body: { action, fingerprint: getFingerprint() },
  });
  if (error) throw error;
  return data;
}

function readLocal(): { startedAt?: string; expiresAt?: string } {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeLocal(startedAt?: string, expiresAt?: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ startedAt, expiresAt }));
}

export function useTrial(autoCheck = true): TrialState & {
  startTrial: () => Promise<void>;
  refresh: () => Promise<void>;
} {
  const [state, setState] = useState<TrialState>({
    status: "loading",
    msRemaining: 0,
  });

  const compute = useCallback((startedAt?: string, expiresAt?: string, serverStatus?: string) => {
    if (!expiresAt) {
      setState({ status: (serverStatus as TrialStatus) || "none", msRemaining: 0 });
      return;
    }
    const ms = new Date(expiresAt).getTime() - Date.now();
    const status: TrialStatus = ms <= 0 ? "expired" : "active";
    setState({ status, startedAt, expiresAt, msRemaining: Math.max(0, ms) });
  }, []);

  const refresh = useCallback(async () => {
    try {
      const local = readLocal();
      // Optimistic from local
      if (local.expiresAt) {
        compute(local.startedAt, local.expiresAt);
      }
      const data = await callTrial("check");
      if (data.status === "active" || data.status === "expired") {
        writeLocal(data.started_at, data.expires_at);
        compute(data.started_at, data.expires_at, data.status);
      } else {
        setState({ status: data.status, msRemaining: 0 });
      }
    } catch {
      const local = readLocal();
      if (local.expiresAt) compute(local.startedAt, local.expiresAt);
      else setState({ status: "error", msRemaining: 0 });
    }
  }, [compute]);

  const startTrial = useCallback(async () => {
    const data = await callTrial("start");
    if (data.status === "active" || data.status === "expired") {
      writeLocal(data.started_at, data.expires_at);
      compute(data.started_at, data.expires_at, data.status);
    }
  }, [compute]);

  useEffect(() => {
    if (autoCheck) refresh();
  }, [autoCheck, refresh]);

  // Tick every minute to keep countdown fresh
  useEffect(() => {
    if (state.status !== "active") return;
    const t = setInterval(() => {
      const local = readLocal();
      if (local.expiresAt) compute(local.startedAt, local.expiresAt);
    }, 60_000);
    return () => clearInterval(t);
  }, [state.status, compute]);

  return { ...state, startTrial, refresh };
}

export function formatRemaining(ms: number): string {
  if (ms <= 0) return "Expirado";
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m restantes`;
}
