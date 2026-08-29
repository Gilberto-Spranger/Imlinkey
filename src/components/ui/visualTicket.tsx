"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, MapPin, Ticket as TicketIcon, Check } from "lucide-react";
import { motion } from "framer-motion";

interface VisualTicketProps {
  ticket: {
    id: string;
    short_code?: string;
    ticket_type: string;
    price: number | string;
    status: string;
    qr_hash?: string;
  };
  event: {
    title: string;
    location: string;
    date: string;
    image?: string;
  };
  currency?: string;
}

export function VisualTicket({ ticket, event, currency = "AKZ" }: VisualTicketProps) {
  const isPaid = ticket.status === "paid";
  const displayCode = ticket.short_code || ticket.id.split("-")[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-2xl h-48 flex items-stretch rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl group"
    >
      {/* LADO ESQUERDO: INFO DO EVENTO (IMAGEM DE FUNDO) */}
      <div className="relative flex-[1.5] p-6 flex flex-col justify-between overflow-hidden">
        {/* Background Image com Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        {/* Conteúdo do Evento */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-blue-600 text-[8px] font-black uppercase tracking-widest text-white mb-2">
            <TicketIcon size={10} /> {ticket.ticket_type}
          </div>
          <h3 className="text-2xl font-black text-white leading-tight uppercase italic tracking-tighter italic">
            {event.title}
          </h3>
        </div>

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-slate-300 text-[10px] font-bold">
            <Calendar size={12} className="text-blue-500" /> {event.date}
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[10px] font-bold">
            <MapPin size={12} className="text-blue-500" /> {event.location}
          </div>
        </div>
      </div>

      {/* LINHA DIVISORA (SERRILHADO ESTILIZADO) */}
      <div className="relative w-px border-l border-dashed border-white/20 my-4">
        <div className="absolute -top-6 -left-3 w-6 h-6 bg-slate-950 rounded-full border border-white/5" />
        <div className="absolute -bottom-6 -left-3 w-6 h-6 bg-slate-950 rounded-full border border-white/5" />
      </div>

      {/* LADO DIREITO: QR CODE E PREÇO */}
      <div className="flex-1 bg-slate-900/80 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center">
        <div className="relative p-2 bg-white rounded-xl mb-3 shadow-lg">
          <QRCodeSVG
            value={`https://imlinkey.store/ticket/verify?hash=${ticket.qr_hash}&id=${ticket.id}`}
            size={70}
            level="H"
            imageSettings={{
              src: "/favicon.ico",
              height: 15,
              width: 15,
              excavate: true,
            }}
          />
          {isPaid && (
            <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1 border-2 border-slate-900">
              <Check size={10} className="text-white" strokeWidth={4} />
            </div>
          )}
        </div>

        <div className="space-y-0">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Admit One</p>
          <p className="text-xl font-black text-white italic leading-none">
             {typeof ticket.price === 'number' ? ticket.price.toLocaleString() : ticket.price} 
             <span className="text-[10px] ml-1 not-italic opacity-60">{currency}</span>
          </p>
          <code className="block mt-2 text-[9px] font-mono font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase">
             #{displayCode}
          </code>
        </div>
      </div>
    </motion.div>
  );
}