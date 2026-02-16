import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlatformSettings {
  id: string;
  whatsapp_number: string;
  nome_plataforma: string;
  email_suporte: string;
  telefone_suporte: string;
  updated_at: string;
}

export function usePlatformSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_settings" as any)
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data as unknown as PlatformSettings;
    },
    staleTime: 5 * 60 * 1000, // cache 5 min
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<Omit<PlatformSettings, "id" | "updated_at">>) => {
      if (!settings?.id) throw new Error("No settings found");
      const { error } = await supabase
        .from("platform_settings" as any)
        .update(updates as any)
        .eq("id", settings.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
  });

  const whatsappNumber = settings?.whatsapp_number ?? "5515997625135";

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return { settings, isLoading, updateSettings, whatsappNumber, openWhatsApp };
}
