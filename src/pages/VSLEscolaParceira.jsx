import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Shield, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const videoUrl = 'https://video.wixstatic.com/video/933cdd_0331ab67517b44d0af21dd72e8b0cb59/1080p/mp4/file.mp4';
const posterUrl = 'https://static.wixstatic.com/media/933cdd_7baddddb15fc4bb0ad2e2455589ba598~mv2.jpg/v1/fill/w_1200,h_675,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Eric%20Cena.jpg';

export default function VSLEscolaParceira() {
  const [isFocusedPlayback, setIsFocusedPlayback] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isFocusedPlayback;
    video.loop = !isFocusedPlayback;
    video.controls = isFocusedPlayback;

    if (isFocusedPlayback) {
      video.currentTime = 0;
    }

    video.play().catch(() => {});
  }, [isFocusedPlayback]);

  const handleActivatePlayback = () => {
    setIsFocusedPlayback(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040507] font-sans text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,243,255,0.08),transparent_34%),radial-gradient(circle_at_bottom,rgba(37,99,235,0.12),transparent_38%)]" />

      <header className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
          <Link to="/escola-parceira" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
            <ArrowLeft className="h-5 w-5" /> Voltar
          </Link>
          <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="Revela Talentos" className="h-8 w-auto opacity-80" />
        </div>
      </header>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-24 sm:px-6">
        <div className="mb-8 max-w-3xl text-center">
          <Badge className="mb-5 border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">
            Replay em story
          </Badge>
          <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Se voce nao puder estar presente no dia, assista em <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">formato story</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            O preview ja entra em movimento para gerar contexto imediato. Quando quiser acompanhar a apresentacao completa, basta ativar o audio.
          </p>
        </div>

        <div className="relative w-full max-w-[390px]">
          <div className="pointer-events-none absolute inset-[-10%] rounded-[40px] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.24),transparent_58%)] blur-3xl" />

          <div className="relative overflow-hidden rounded-[32px] border border-cyan-400/20 bg-black shadow-[0_40px_120px_rgba(0,243,255,0.18)]">
            <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
              <div className="flex gap-1.5">
                <span className="h-1.5 w-14 rounded-full bg-white" />
                <span className="h-1.5 w-8 rounded-full bg-white/30" />
                <span className="h-1.5 w-8 rounded-full bg-white/20" />
              </div>
              <Badge className="border border-white/10 bg-black/40 text-[10px] uppercase tracking-[0.18em] text-white/80">
                Story oficial
              </Badge>
            </div>

            <div className="relative aspect-[9/16] bg-black">
              <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.45)_62%,rgba(0,0,0,0.88)_100%)]" />

              <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-6">
                <Badge className="mb-3 border border-cyan-400/25 bg-cyan-500/12 text-[10px] uppercase tracking-[0.22em] text-cyan-300">
                  Eric Cena
                </Badge>
                <h2 className="max-w-[15ch] text-3xl font-black uppercase leading-[0.95] text-white">
                  Revela Talentos
                </h2>
                <p className="mt-3 max-w-[28ch] text-sm leading-6 text-white/80">
                  Metodologia, beneficios da parceria e o caminho de desenvolvimento para os alunos das escolas parceiras.
                </p>

                <div className="mt-5 flex flex-col gap-3">
                  <Button
                    type="button"
                    onClick={handleActivatePlayback}
                    className="h-12 w-full justify-center gap-3 rounded-full border-0 bg-white font-semibold text-black hover:bg-white/90"
                  >
                    {isFocusedPlayback ? <Volume2 className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                    {isFocusedPlayback ? 'Audio ativado' : 'Ativar audio e assistir'}
                  </Button>

                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/55">
                    <span>{isFocusedPlayback ? 'Video completo' : 'Preview em movimento'}</span>
                    <span>{isFocusedPlayback ? 'Com controles' : 'Autoplay silencioso'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-gray-400">
          <Shield className="h-4 w-4 text-cyan-500" /> Site oficial e seguro - Revela Talentos
        </div>

        <div className="mt-8">
          <Button asChild className="bg-white text-black hover:bg-white/90">
            <Link to="/escola-parceira">Voltar para o agendamento</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
