// src/app/page.tsx  
"use client";  
  
import { useEffect, useState } from "react";  
import { useRouter } from "next/navigation";  
import Link from "next/link";  
import Image from "next/image";  
  
export default function Home() {  
  const router = useRouter();  
  
  const [colorIndex, setColorIndex] = useState(0);  
  const colors = ["green", "white", "black", "red"];  
  
  useEffect(() => {  
    const cookies = document.cookie;  
    const hasAuth = cookies.split(";").some((c) =>  
      c.trim().startsWith("auth_token=")  
    );  
    if (hasAuth) router.replace("/dashboard");  
  
    const interval = setInterval(() => {  
      setColorIndex((prev) => (prev + 1) % colors.length);  
    }, 10000); // troca de cor a cada 10s  
    return () => clearInterval(interval);  
  }, [router]);  
  
  return (  
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-tr from-purple-900 via-black to-indigo-900 animate-gradient bg-[length:400%_400%]">  
  
      {/* Botão Animate Donate antes da primeira div */}  
      <a  
        href="https://www.paypal.com/donate/?hosted_button_id=EDX4TRQU3LJVU"  
        target="_blank"  
        rel="noopener noreferrer"  
        style={{  
          display: "inline-block",  
          fontSize: "1rem",  
          padding: "0.5rem 1rem",  
          borderRadius: "4px",  
          textAlign: "center",  
          marginBottom: "2rem",  
          transition: "all 0.3s ease",  
          backgroundColor: colors[colorIndex],  
          color: colorIndex === 1 ? "black" : "white",  
          animation: "wave 2s infinite, pulse 1s infinite",  
        }}  
      >  
        Donate any amount to Imlinkey  
      </a>  
  
      <div className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-xl w-full text-white text-center space-y-6 transition-all">  
        <Image  
          src="/favicon.png"  
          alt="Imlinkey Logo"  
          width={100}  
          height={100}  
          className="mx-auto rounded-full shadow-md"  
        />  
        <h1 className="text-4xl font-extrabold tracking-tight">  
          Bem-vindo ao <span className="text-green-400">Imlinkey</span>  
        </h1>  
        <p className="text-lg text-gray-300">  
          Partilhe seus <strong>links de afiliados</strong> e{" "}  
          <strong>redes sociais</strong> com estilo.  
        </p>  
        <div className="flex justify-center gap-4">  
          <Link  
            href="/auth"  
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"  
          >  
            Start now  
          </Link>  
        </div>  
      </div>  
  
      {/* Animações inline */}  
      <style jsx>{`  
        @keyframes wave {  
          0% { transform: rotate(0deg); }  
          15% { transform: rotate(15deg); }  
          30% { transform: rotate(-10deg); }  
          45% { transform: rotate(15deg); }  
          60% { transform: rotate(-10deg); }  
          75% { transform: rotate(15deg); }  
          100% { transform: rotate(0deg); }  
        }  
  
        @keyframes pulse {  
          0%, 100% { transform: scale(1); }  
          50% { transform: scale(1.15); }  
        }  
  
        body {  
          margin: 0;  
          font-family: 'Inter', sans-serif;  
          background: black;  
        }  
  
        .animate-gradient {  
          animation: gradientBG 8s ease infinite;  
        }  
  
        @keyframes gradientBG {  
          0% { background-position: 0% 50%; }  
          50% { background-position: 100% 50%; }  
          100% { background-position: 0% 50%; }  
        }  
      `}</style>  
    </main>  
  );  
}  