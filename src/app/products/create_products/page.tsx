"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileLayout, Button, LoadingPage } from "@/components/ui";

import {
  ImagePlus,
  DollarSign,
  Link as LinkIcon,
  Package,
  Tag,
} from "lucide-react";

import { api } from "@/utils";
import { useAccountSettings } from "@/hooks/use-account-settings";
import { useTheme } from "@/hooks/use-theme";
import useAuthRedirect from "@/hooks/use-auth-redirect";

export default function CreateProduct() {
  const router = useRouter();

  const { settings, loading } = useAccountSettings();
  useTheme(settings?.theme_preference || "dark");
  const loadingAuth = useAuthRedirect();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    link_url: "",
    brand: "",
    model: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading || loadingAuth) return <LoadingPage />;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price) {
      alert("Preenche os campos obrigatórios 😒");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", String(Number(form.price)));
      formData.append("category", form.category);
      formData.append("stock", String(Number(form.stock) || 0));
      formData.append("link_url", form.link_url);

      formData.append("brand", form.brand);
      formData.append("model", form.model);

      if (image) {
        formData.append("image_file", image);
      }

      await api.post("/products/", formData);

      router.push("/products");
    } catch (err) {
      console.error("Erro ao criar produto:", err);
      alert("Erro ao publicar produto");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProfileLayout>
        <div className="max-w-3xl mx-auto p-6 space-y-8">

          <div>
            <h1 className="text-3xl font-black">Novo Produto</h1>
            <p className="text-foreground/40 text-sm">
              Cria e começa a vender já 🚀
            </p>
          </div>

          <div className="space-y-6">

            <input
              name="title"
              placeholder="Nome do produto"
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-2xl p-4"
            />

            {/* BRAND + MODEL */}
            <div className="grid grid-cols-2 gap-4">

              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  name="brand"
                  placeholder="Marca (ex: BMW)"
                  onChange={handleChange}
                  className="w-full pl-10 bg-background border border-border rounded-2xl p-4"
                />
              </div>

              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  name="model"
                  placeholder="Modelo (ex: M4 Competition)"
                  onChange={handleChange}
                  className="w-full pl-10 bg-background border border-border rounded-2xl p-4"
                />
              </div>

            </div>

            <textarea
              name="description"
              placeholder="Descrição do produto"
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-2xl p-4 h-32 resize-none"
            />

            <div className="grid grid-cols-2 gap-4">

              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  name="price"
                  placeholder="Preço"
                  onChange={handleChange}
                  className="w-full pl-10 bg-background border border-border rounded-2xl p-4"
                />
              </div>

              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  name="stock"
                  placeholder="Stock"
                  onChange={handleChange}
                  className="w-full pl-10 bg-background border border-border rounded-2xl p-4"
                />
              </div>

            </div>

            <input
              name="category"
              placeholder="Categoria"
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-2xl p-4"
            />

            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                name="link_url"
                placeholder="Link de checkout"
                onChange={handleChange}
                className="w-full pl-10 bg-background border border-border rounded-2xl p-4"
              />
            </div>

            <div className="border border-dashed border-border rounded-2xl p-6 text-center">
              <label className="cursor-pointer flex flex-col items-center gap-2">
                <ImagePlus className="w-6 h-6 text-foreground/40" />
                <span className="text-sm text-foreground/50">
                  Clique para adicionar imagem
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>

              {preview && (
                <img
                  src={preview}
                  className="mt-4 rounded-xl object-cover h-40 w-full"
                />
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black"
            >
              {submitting ? "Publicando..." : "Publicar Produto"}
            </Button>

          </div>
        </div>
      </ProfileLayout>
    </div>
  );
}