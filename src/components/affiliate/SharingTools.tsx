import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Share2, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  referralCode: string | undefined;
  referralUrl: string | undefined;
  loading: boolean;
}

export function SharingTools({ referralCode, referralUrl, loading }: Props) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const copyLink = () => {
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = () => {
    if (navigator.share && referralUrl) {
      navigator.share({
        title: 'Junte-se a mim!',
        text: 'Ganhe benefícios exclusivos usando meu código de convite!',
        url: referralUrl,
      }).catch(console.error);
    }
  };

  if (loading) {
    return <div className="h-48 animate-pulse bg-white/5 rounded-[3rem]" />;
  }

  return (
    <section className="relative h-full p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
      <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-5 pointer-events-none">
        <Share2 size={240} className="text-indigo-400" />
      </div>
      
      <div className="flex flex-col md:flex-row items-center w-full gap-8 md:gap-12 justify-between relative z-10">
        <div className="text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Share2 size={12} /> Invite & Earn
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-6">Compartilhe o seu Link</h3>
          <div className="flex flex-col gap-2">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Link Exclusivo de Afiliado:</span>
            <div className="flex flex-col md:flex-row gap-4 items-center mt-2">
              <code className="bg-[#020617] px-6 py-4 rounded-2xl border border-white/5 text-indigo-300 font-mono text-sm md:text-base w-full overflow-hidden text-ellipsis shadow-inner">
                {referralUrl}
              </code>
              <button 
                onClick={copyLink}
                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shrink-0 ${
                  copied 
                    ? "bg-emerald-500 text-[#020617] shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                    : "bg-white text-[#020617] hover:bg-slate-200 shadow-lg"
                }`}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div key="c" className="flex items-center gap-2" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Check size={18}/> Copiado!</motion.div>
                  ) : (
                    <motion.div key="n" className="flex items-center gap-2" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Copy size={18}/> Copiar Link</motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mt-8">
            <button onClick={shareNative} className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all backdrop-blur-sm">
              <Share2 size={16} /> Partilhar Nativamente
            </button>
            <button onClick={() => setShowQr(!showQr)} className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all backdrop-blur-sm">
              <QrCode size={16} /> {showQr ? "Ocultar Código QR" : "Mostrar Código QR"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showQr && referralUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="bg-white p-6 rounded-3xl shadow-2xl shrink-0 border-8 border-indigo-100"
            >
              <QRCodeSVG value={referralUrl} size={160} level="H" fgColor="#020617" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
