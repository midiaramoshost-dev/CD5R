import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ResponsavelSidebar } from "./ResponsavelSidebar";
import { AppHeader } from "./AppHeader";
import { useEffect } from "react";

const readFileAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });

export function ResponsavelLayout() {
  // VibeCoding: intercepta uploads de foto nos formulários (sem mexer neles diretamente),
  // salvando temporariamente no localStorage via atributo data-profile-photo.
  useEffect(() => {
    const handler = async (ev: Event) => {
      const target = ev.target as HTMLInputElement | null;
      if (!target) return;
      if (target.tagName !== "INPUT") return;
      if (target.type !== "file") return;

      const key = target.getAttribute("data-profile-photo");
      if (!key) return;

      const file = target.files?.[0];
      if (!file) return;
      if (!file.type?.startsWith("image/")) return;

      try {
        const dataUrl = await readFileAsDataURL(file);
        localStorage.setItem(key, dataUrl);
      } catch {
        // silencioso
      } finally {
        target.value = "";
      }
    };

    document.addEventListener("change", handler, true);
    return () => document.removeEventListener("change", handler, true);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ResponsavelSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6 animate-fade-in">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
