import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Shield, Default } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function VSLEscolaParceira() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-[#040507] min-h-screen text-white overflow-hidden relative font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,243,255,0.06),transparent_60%)]" />
      
      {/* HEADER */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
        <Link to="/escola-parceira" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Voltar
        </Link>
        <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="Revela Talentos" className="h-8 w-auto opacity-70" />
      </header>

      {/* VSL CONTENT */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20 pb-32">
        
        <div className="max-w-4xl w-full text-center mb-8">
          <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1 text-sm font-bold tracking-widest uppercase rounded-full mb-6">
            Vídeo Oficial e Obrigatório
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            Assista ao Resumo Completo da <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Nossa Metodologia</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Evite distrações. Recomendamos que utilize fones de ouvido para compreender com clareza a evolução proposta para o seu filho.
          </p>
        </div>

        {/* Cinematic Video Player */}
        <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,243,255,0.15)] border border-white/10 relative group bg-black">
          {!isPlaying ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer" onClick={() => setIsPlaying(true)}>
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors" />
              <img 
                src="https://static.wixstatic.com/media/933cdd_7baddddb15fc4bb0ad2e2455589ba598~mv2.jpg/v1/fill/w_1200,h_675,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Eric%20Cena.jpg" 
                alt="Thumbnail" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              
              <div className="relative z-30 flex flex-col items-center transform group-hover:scale-105 transition-transform duration-300">
                <div className="w-24 h-24 rounded-full bg-cyan-500/90 flex items-center justify-center shadow-[0_0_40px_rgba(0,243,255,0.6)] mb-4">
                  <Play className="w-10 h-10 text-white ml-2" fill="white" />
                </div>
                <p className="text-white font-bold tracking-widest uppercase text-sm drop-shadow-lg">Clique para Reproduzir</p>
              </div>
            </div>
          ) : (
            <video
              src="https://video.wixstatic.com/video/933cdd_0331ab67517b44d0af21dd72e8b0cb59/1080p/mp4/file.mp4"
              controls
              autoPlay
              className="absolute inset-0 w-full h-full border-0 z-10"
            />
          )}
        </div>

        {/* Guarantee / Safe */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Shield className="w-4 h-4 text-cyan-500" /> Site Oficial e Seguro — EC10 Talentos
        </div>

      </main>
    </div>
  );
}
