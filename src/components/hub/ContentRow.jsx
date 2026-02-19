import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ContentRow({ title, contents, user, size = "normal" }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    const scrollAmount = size === "large" ? 600 : 400;
    const newScrollLeft = direction === 'left' 
      ? scrollRef.current.scrollLeft - scrollAmount
      : scrollRef.current.scrollLeft + scrollAmount;
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    // Update scroll button states
    setTimeout(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }, 300);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };
  
  // Mobile responsive card sizes
  const cardWidth = size === 'large' 
    ? 'w-[85vw] md:w-[28rem]' 
    : 'w-[75vw] md:w-80';
  const cardAspect = 'aspect-video';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div className="flex items-center justify-between mb-4 md:mb-6 px-4 md:px-0">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">{title}</h2>
        
        {/* Scroll Controls - Hidden on Mobile */}
        <div className="hidden md:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-white rounded-full disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-white rounded-full disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth -m-2 p-2 px-4 md:px-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {contents.map((content, index) => {
          const isEliteContent = content.access_level === 'elite';
          const isLocked = isEliteContent && user?.subscription_level !== 'elite';
          
          return (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex-shrink-0 ${cardWidth} group/item cursor-pointer relative transition-transform duration-300 ease-in-out hover:scale-105 hover:z-10`}
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className={`relative ${cardAspect} rounded-xl overflow-hidden shadow-lg`}>
                <img 
                  src={content.thumbnail_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1793&auto=format&fit=crop"}
                  alt={content.title}
                  className={`w-full h-full object-cover transition-all duration-300 ${isLocked ? 'grayscale' : ''}`}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                {isLocked ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-3 md:p-4">
                      <Lock className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mb-2"/>
                      <p className="text-white font-bold text-sm md:text-base">Conteúdo Elite</p>
                      <p className="text-gray-300 text-xs md:text-sm text-center">Faça upgrade para acessar</p>
                  </div>
                ) : (
                  <>
                    {/* Content info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <h3 className="text-white font-bold text-base md:text-lg truncate drop-shadow-lg">
                        {content.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                         <Badge 
                          className={`${content.access_level === 'elite' ? 'bg-yellow-500/80 text-black' : 'bg-blue-500/80 text-white'} text-xs backdrop-blur-sm border-none`}
                        >
                          {content.access_level === 'elite' ? 'ELITE' : 'BÁSICO'}
                        </Badge>
                      </div>
                    </div>

                    {/* Hover Action Buttons - Adjusted for Mobile */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 md:group-hover/item:opacity-100 group-active/item:opacity-100 transition-opacity duration-300 bg-black/50">
                      <div className="flex gap-2 md:gap-3">
                        <Link to={createPageUrl("RevelaTalentos")}>
                          <Button 
                            size="icon"
                            className="bg-white text-black hover:bg-gray-200 rounded-full w-10 h-10 md:w-12 md:h-12"
                          >
                            <Play className="w-4 h-4 md:w-5 md:h-5 ml-0.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}