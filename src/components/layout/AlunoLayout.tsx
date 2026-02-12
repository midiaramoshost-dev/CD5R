import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AlunoSidebar } from "./AlunoSidebar";
import { AppHeader } from "./AppHeader";
import { useEffect } from "react";

const readFileAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });

export function AlunoLayout() {
  // VibeCoding: como não temos acesso aos formulários aqui, eu "plugo" um interceptador
  // leve no layout para capturar qualquer <input type="file" data-profile-photo="...">.
  // Quando o usuário escolher a imagem, salvamos um DataURL temporário no localStorage.
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
        // silencioso: é temporário; o formulário pode tratar UX
      } finally {
        // permite reenviar o mesmo arquivo
        target.value = "";
      }
    };

    document.addEventListener("change", handler, true);
    return () => document.removeEventListener("change", handler, true);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AlunoSidebar />
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
