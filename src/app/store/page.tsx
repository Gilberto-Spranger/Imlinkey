"use client";

import React from "react";
import Image from "next/image";
import useAuthRedirect from "@/hooks/use-auth-redirect";
import { LoadingPage } from "@/components/ui";

const products = [
  {
    id: 1,
    name: "Product One",
    price: "$29.99",
    image: "https://i.pinimg.com/736x/7c/3e/fd/7c3efdf0f066b9574647f83fdfab3154.jpg",
  },
  {
    id: 2,
    name: "Product Two",
    price: "$49.99",
    image: "https://i.pinimg.com/736x/39/54/b2/3954b2582b0349c60d5689b11321f63f.jpg",
  },
  {
    id: 3,
    name: "Product Three",
    price: "$19.99",
    image: "https://i.pinimg.com/736x/52/2c/56/522c567946b5ebee1ce5ed20cf017243.jpg",
  },
  {
    id: 4,
    name: "Product Four",
    price: "$109.99",
    image: "https://i.pinimg.com/736x/98/09/34/98093434c34a60401f15166b355102a4.jpg",
  },
];

export default function Store() {
  const loadingAuth = useAuthRedirect();

  if (loadingAuth) return <LoadingPage />
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 bg-[#020617] min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-center text-white">Loja</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center transition hover:scale-105 hover:shadow-xl duration-300"
          >
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
            <p className="text-base text-gray-700 mb-4">{product.price}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
