'use client'

import { 
  FiInstagram, 
  FiFacebook, 
  FiLinkedin, 
  FiYoutube, 
} from "react-icons/fi";
import { FaPinterestP, FaTiktok, FaWhatsapp } from "react-icons/fa";

export default function Maintenance() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#020617] text-white px-4">
      <div className="text-center max-w-md space-y-6">
        
        {/* Spinner */}
        <div className="relative w-14 h-14 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin" />
        </div>

        {/* Título */}
        <h1 className="text-4xl font-extrabold">Voltamos em breve 🚀</h1>

        {/* Mensagem principal */}
        <p className="text-base text-gray-300 leading-relaxed">
          Estamos realizando uma manutenção programada para melhorar sua experiência.
          <br className="hidden sm:inline" />
          Agradecemos pela compreensão. 🙌
        </p>

        {/* Contato */}
        <div className="text-sm text-gray-400">
          Contato:{" "}
          <a href="mailto:support@imlinkey.store" className="underline hover:text-white">
            support@imlinkey.store
          </a>
        </div>

        {/* Redes sociais */}
        <div className="flex justify-center flex-wrap gap-5 text-gray-400 pt-4">
          <a
            href="https://instagram.com/imlinked_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-colors"
          >
            <FiInstagram size={24} />
          </a>
          <a
            href="https://facebook.com/imlinked_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            <FiFacebook size={24} />
          </a>
          <a
            href="https://linkedin.com/in/imlinked_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <FiLinkedin size={24} />
          </a>
          <a
            href="https://pinterest.com/imlinked_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition-colors"
          >
            <FaPinterestP size={24} />
          </a>
          <a
            href="https://youtube.com/@imlinked_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 transition-colors"
          >
            <FiYoutube size={24} />
          </a>
          <a
            href="https://wa.me/5500000000000" // coloque seu número com código do país
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500 transition-colors"
          >
            <FaWhatsapp size={24} />
          </a>
          <a
            href="https://tiktok.com/@imlinked_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
          >
            <FaTiktok size={24} />
          </a>
        </div>
      </div>
    </main>
  )
}
