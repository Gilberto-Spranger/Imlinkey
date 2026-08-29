"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProfileLayout, Section, Button, LoadingPage } from "@/components/ui";
import {
  ShoppingBag,
  Plus,
  Trash2,
  ExternalLink,
  Package,
  DollarSign,
  Tag,
} from "lucide-react";
import { api } from "@/utils";
import { useAccountSettings } from "@/hooks/use-account-settings";
import { useTheme } from "@/hooks/use-theme";
import useAuthRedirect from "@/hooks/use-auth-redirect"; 

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  stock: number;
  brand: string;
  model: string;
  image_url: string | null;
  link_url: string | null;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingAuth = useAuthRedirect();
  const { settings, loading: loadingSettings } = useAccountSettings();
  useTheme(settings?.theme_preference || "dark");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products/");
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading || loadingSettings || loadingAuth) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProfileLayout>
        <div className="max-w-5xl mx-auto p-6 space-y-12">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <ShoppingBag className="w-6 h-6 text-blue-400" />
                </div>

                <h1 className="text-4xl font-black tracking-tight">
                  Produtos
                </h1>
              </div>

              <p className="text-foreground/40 text-sm max-w-md">
                A tua vitrine digital de alta performance. Cada produto aqui é uma oportunidade de venda.
              </p>
            </div>

            <Button
              onClick={() => router.push("/products/create_products")}
              className="bg-foreground text-background hover:bg-blue-500 hover:text-white rounded-2xl font-black px-6 h-12 flex items-center gap-2 transition-all"
            >
              <Plus size={18} /> Criar Produto
            </Button>
          </div>

          {/* GRID PREMIUM */}
          <Section title="Inventário Premium">
            <div className="space-y-8 mt-6">

              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() =>
                    product.link_url
                      ? window.open(product.link_url, "_blank")
                      : router.push(`/products/${product.id}`)
                  }
                  className="
                    group relative cursor-pointer
                    bg-foreground/5 hover:bg-foreground/10
                    border border-blue-500/10 hover:border-blue-500/30
                    rounded-3xl overflow-hidden
                    transition-all duration-300
                    hover:-translate-y-1
                  "
                >

                  <div className="flex flex-col md:flex-row">

                    {/* IMAGE SECTION (DOMINANTE) */}
                    <div className="relative w-full md:w-72 h-56 md:h-auto">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          quality={100}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-background">
                          <Package className="text-foreground/20 w-10 h-10" />
                        </div>
                      )}

                      {/* overlay premium */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 p-6 md:p-8 space-y-4">

                      {/* TITLE + STOCK */}
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-2xl font-black tracking-tight">
                          {product.title}
                        </h3>

                        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Stock {product.stock}
                        </span>
                      </div>

                      {/* DESCRIPTION */}
                      <p className="text-sm text-foreground/50 leading-relaxed max-w-xl">
                        {product.description}
                      </p>

                      {/* META GRID */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs mt-4">

                        <div className="flex items-center gap-2 text-blue-400 font-bold">
                          <DollarSign size={14} />
                          {Number(product.price).toLocaleString("pt-AO")}
                        </div>

                        <div className="flex items-center gap-2 text-foreground/50">
                          <Tag size={14} />
                          {product.category}
                        </div>

                        <div className="text-foreground/40">
                          <strong>{product.brand}</strong>
                        </div>

                        <div className="text-foreground/40">
                          {product.model}
                        </div>

                      </div>

                      {/* ACTIONS */}
                      <div
                        className="flex items-center gap-3 pt-4 opacity-0 group-hover:opacity-100 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {product.link_url && (
                          <a
                            href={product.link_url}
                            target="_blank"
                            className="p-2 rounded-xl hover:bg-blue-500/10 text-foreground/40 hover:text-foreground transition"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}

                        <button className="p-2 rounded-xl hover:bg-red-500/10 text-foreground/40 hover:text-red-400 transition">
                          <Trash2 size={16} />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="text-center py-20 text-foreground/20 text-sm">
                  Nenhum produto ainda — começa a tua loja agora 🚀
                </div>
              )}

            </div>
          </Section>

          {/* SIDE INSIGHT */}
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-3xl p-10 backdrop-blur-md">
            <h3 className="font-black text-2xl mb-3">
              Performance Insight 🚀
            </h3>

            <p className="text-sm text-foreground/50 leading-relaxed max-w-xl">
              Produtos com imagem grande, descrição clara e preço visível convertem até 3x mais.
              Isto não é design — é engenharia de vendas.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-foreground/60 font-bold">
                Conversion Engine Active
              </span>
            </div>
          </div>

        </div>
      </ProfileLayout>
    </div>
  );
}