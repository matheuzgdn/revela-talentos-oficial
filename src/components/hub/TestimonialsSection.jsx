import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Play, X } from 'lucide-react';
import { Testimonial } from '@/entities/Testimonial';
import { Button } from '@/components/ui/button';

const VideoModal = ({ videoUrl, onClose }) => {
    if (!videoUrl) return null;

    let embedUrl = videoUrl;
    // Tenta converter links do YouTube para o formato de embed
    if (videoUrl.includes("youtube.com/watch?v=")) {
      const videoId = videoUrl.split('v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (videoUrl.includes("youtu.be/")) {
      const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white z-50" onClick={onClose}>
                <X className="w-8 h-8" />
            </Button>
            <div className="w-full max-w-4xl aspect-video relative" onClick={(e) => e.stopPropagation()}>
                <iframe
                    src={embedUrl}
                    title="Depoimento EC10 Talentos"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>
            </div>
        </div>
    );
};


export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [playingVideoUrl, setPlayingVideoUrl] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await Testimonial.filter({ is_active: true });
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      }
    };
    fetchTestimonials();
  }, []);
  
  const handlePlay = (videoUrl) => {
    setPlayingVideoUrl(videoUrl);
  };

  const handleCloseModal = () => {
    setPlayingVideoUrl(null);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900 px-6">
      <VideoModal videoUrl={playingVideoUrl} onClose={handleCloseModal} />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Depoimentos que <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-400">Inspiram</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Histórias reais de atletas que transformaram suas carreiras
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card 
                className="bg-gray-800/50 border-gray-700/50 hover:border-green-500/30 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => handlePlay(testimonial.video_url)}
              >
                <div className="relative group">
                  <img 
                    src={testimonial.thumbnail_url}
                    alt={testimonial.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-green-500/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                   <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-white font-bold text-lg">{testimonial.name}</h3>
                      <p className="text-green-300 text-sm">{testimonial.position}</p>
                   </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}