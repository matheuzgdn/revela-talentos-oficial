import React from 'react';
import { ExternalLink, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PlanosGrid({ planos, isLoading }) {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-video bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!planos || planos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-900/50 rounded-lg border border-gray-800">
        <Lock className="w-12 h-12 text-gray-600 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Planos em Breve</h3>
        <p className="text-gray-400 text-sm">Novos planos serão adicionados em breve</p>
      </div>
    );
  }

  const sortedPlanos = [...planos].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return (
    <div className="relative group">
      {/* Setas Desktop */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-3 px-3 md:mx-0 md:px-0">
        {sortedPlanos.map((plano) => (
          <div
            key={plano.id}
            onClick={() => plano.external_link && window.open(plano.external_link, '_blank')}
            className="relative flex-shrink-0 w-72 sm:w-80 md:w-96 aspect-video rounded-xl overflow-hidden cursor-pointer group/card hover:scale-105 transition-transform shadow-xl"
          >
            <img
              src={plano.thumbnail_url}
              alt={plano.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">{plano.title}</h3>
              {plano.description && (
                <p className="text-gray-300 text-sm line-clamp-2">{plano.description}</p>
              )}
            </div>

            {plano.external_link && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 text-black" />
              </div>
            )}

            <div className="absolute top-4 left-4">
              <Lock className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}