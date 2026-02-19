import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AthleteStories({ stories }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!stories || stories.length === 0) return null;

  const getCategoryEmoji = (category) => {
    switch(category) {
      case 'atleta': return '👤';
      case 'vaga': return '💼';
      case 'novidade': return '📰';
      default: return '⭐';
    }
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'atleta': return 'Atleta';
      case 'vaga': return 'Vaga';
      case 'novidade': return 'Novidade';
      default: return 'Destaque';
    }
  };

  return (
    <>
      <div className="relative group">
        <div className="flex items-center justify-between mb-3 md:mb-4 px-3 md:px-0">
          <h2 className="text-lg md:text-2xl font-bold text-white">
            ⭐ Destaques RT
          </h2>
        </div>

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

        <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-3 px-3 md:mx-0 md:px-0">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="relative flex-shrink-0 w-24 sm:w-28 md:w-32 cursor-pointer group/story"
            >
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden border-2 border-cyan-400 shadow-lg">
                <img
                  src={story.thumbnail_url || story.media_url}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {story.media_type === 'video' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-black ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute top-2 left-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  {getCategoryEmoji(story.category)}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                  <p className="text-white font-bold text-xs truncate">{story.title}</p>
                </div>

                <div className="absolute inset-0 bg-cyan-400/0 group-hover/story:bg-cyan-400/10 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Story */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedStory(null)}
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-md w-full aspect-[9/16] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedStory.media_type === 'video' ? (
                <video
                  src={selectedStory.media_url}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={selectedStory.media_url}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getCategoryEmoji(selectedStory.category)}</span>
                  <span className="text-cyan-400 text-sm font-bold uppercase">
                    {getCategoryLabel(selectedStory.category)}
                  </span>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{selectedStory.title}</h3>
                {selectedStory.description && (
                  <p className="text-gray-200 text-sm mb-3">{selectedStory.description}</p>
                )}
                {selectedStory.link_url && (
                  <a
                    href={selectedStory.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Saiba Mais
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}