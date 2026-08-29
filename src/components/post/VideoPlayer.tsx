'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Download, Rewind, FastForward } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string; // Suporte a capa/thumbnail opcional
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showAd, setShowAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showAd) {
      interval = setInterval(() => {
        setAdCountdown((prev) => {
          if (prev <= 1) {
            setShowAd(false);
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play();
            }
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showAd]);

  const handleEnded = () => {
    setShowAd(true);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (videoRef.current) {
      const time = (Number(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(Number(e.target.value));
    }
  };

  const rewind = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const fastForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
    }
  };

  const downloadVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = src;
    a.download = 'video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video group cursor-pointer"
      onClick={togglePlay}
    >
      {/* Elemento de Vídeo com Poster (Thumbnail) */}
      {!hasError ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            showAd ? 'opacity-30 blur-md' : 'opacity-100'
          }`}
          muted={isMuted}
          playsInline
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white/50 text-sm">
          Vídeo indisponível
        </div>
      )}

      {/* Botão Central de Play (Visível quando o vídeo está pausado) */}
      {!isPlaying && !showAd && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 pointer-events-auto cursor-pointer transition-transform hover:scale-105">
            <Play className="w-8 h-8 ml-1 fill-white" />
          </div>
        </div>
      )}

      {/* Overlay de Anúncio Intersticial */}
      {showAd && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-bold rounded-full mb-4">
            Anúncio
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Imlinkey Premium</h3>
          <p className="text-white/70 text-sm mb-6 text-center max-w-[80%]">
            Experimente a rede social do futuro sem interrupções.
          </p>
          <button
            className="px-6 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            Saber mais
          </button>

          <div className="absolute bottom-4 right-4 text-xs font-mono text-white/50 bg-black/50 px-2 py-1 rounded">
            O vídeo recomeça em {adCountdown}s
          </div>
        </div>
      )}

      {/* Controlos Personalizados */}
      {!showAd && !hasError && (
        <div className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 pointer-events-none">
          <div className="pointer-events-auto w-full mb-3">
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={handleSeek}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-1 bg-white/30 hover:h-1.5 rounded-lg appearance-none cursor-pointer accent-green-400 transition-all"
            />
          </div>
          <div className="w-full flex items-center justify-between pointer-events-auto text-white">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="hover:text-green-400 transition-colors">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={rewind} className="hover:text-green-400 transition-colors" title="Recuar 10s">
                <Rewind className="w-5 h-5" />
              </button>
              <button onClick={fastForward} className="hover:text-green-400 transition-colors" title="Avançar 10s">
                <FastForward className="w-5 h-5" />
              </button>
              <button onClick={toggleMute} className="hover:text-green-400 transition-colors">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={downloadVideo} className="hover:text-green-400 transition-colors" title="Descarregar">
                <Download className="w-5 h-5" />
              </button>
              <button onClick={toggleFullscreen} className="hover:text-green-400 transition-colors" title="Ecrã inteiro">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
