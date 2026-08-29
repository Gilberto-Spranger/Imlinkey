"use client";

import { useState, useEffect, useCallback, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { api } from "@/utils";
import { LoadingPage, Button } from "@/components/ui";
import useAuthRedirect from "@/hooks/use-auth-redirect";

export default function UploadBgImage() {
  const [bgImage, setBgImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentBg, setCurrentBg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const loadingAuth = useAuthRedirect();

  const router = useRouter();

  // Fetch atual
  const fetchBgImage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ bg_image?: string }>("bg_image/", { withCredentials: true });
      setCurrentBg(res.data.bg_image || null);
    } catch (err) {
      console.error("Erro ao carregar imagem de fundo:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBgImage(); }, [fetchBgImage]);

  // Seleção via click ou drop
  const handleFile = (file: File) => {
    setBgImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) handleFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  // Upload / update
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bgImage) {
      setMessage("Selecione uma imagem primeiro.");
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("bg_image", bgImage);

      await api.put("bg_image/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setMessage("Imagem de fundo atualizada com sucesso!");
      setBgImage(null);
      setPreview(null);
      fetchBgImage();
      router.replace("/profile/");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao enviar a imagem.");
    } finally {
      setSaving(false);
    }
  }, [bgImage, fetchBgImage, router]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Tem certeza que deseja remover a imagem de fundo?")) return;
    setSaving(true);
    setMessage(null);
    try {
      await api.delete("bg_image/", { withCredentials: true });
      setMessage("Imagem de fundo removida com sucesso!");
      setCurrentBg(null);
      setPreview(null);
      setBgImage(null);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao remover a imagem.");
    } finally {
      setSaving(false);
    }
  }, []);

  if (loading || loadingAuth) return <LoadingPage />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Gerenciar Background</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-md">
        {/* Área clicável / drag & drop */}
        <div
          onClick={() => document.getElementById("bg-upload")?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative w-full h-64 mb-4 rounded-2xl overflow-hidden border-2 border-white/10 shadow-inner cursor-pointer hover:border-sky-500 transition-all"
        >
          {(preview || currentBg) ? (
            <Image
              src={preview || currentBg!}
              alt="Background"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white/40 text-lg font-medium">
              Clique ou arraste uma imagem
            </div>
          )}
          <input
            id="bg-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
          <div className="absolute bottom-2 right-2 bg-sky-500 p-2 rounded-full">
            <Pencil className="w-5 h-5 text-white" />
          </div>
        </div>

        {message && (
          <p className={`text-center p-2 rounded-xl ${message.includes("sucesso") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{message}</p>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={saving || !bgImage} className="px-6 py-3 bg-sky-500 hover:bg-sky-600">
            {saving ? "Salvando..." : "Salvar"}
          </Button>
          {currentBg && (
            <Button onClick={handleDelete} disabled={saving} className="px-6 py-3 bg-red-600 hover:bg-red-700">
              {saving ? "Removendo..." : "Remover"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}