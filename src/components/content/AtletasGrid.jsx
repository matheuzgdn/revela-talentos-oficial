import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AtletasGrid({ atletas, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 md:gap-6">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full bg-gray-800 rounded-full" />
        ))}
      </div>
    );
  }

  if (atletas.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <Card className="bg-black border border-yellow-400/30 max-w-2xl mx-auto p-12">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Atletas em Breve</h3>
            <p className="text-gray-400">
              Estamos preparando os perfis dos nossos atletas em destaque. Em breve você conhecerá os talentos da EC10.
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Nossos Atletas</h2>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Conheça os talentos que fazem parte da família EC10 Talentos
        </p>
      </motion.div>

      {/* Grid de Cards Circulares */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 md:gap-6">
        {atletas.map((atleta, index) => (
          <motion.div
            key={atleta.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            className="cursor-pointer group"
          >
            <div className="flex flex-col items-center">
              {/* Circular Image Container */}
              <div className="relative aspect-square w-full mb-3">
                <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-yellow-400 transition-colors duration-300 shadow-2xl">
                  <img 
                    src={atleta.thumbnail_url || "https://images.unsplash.com/photo-1594736797933-d0c27e036bcd?q=80&w=400&auto=format&fit=crop"}
                    alt={atleta.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Featured Star Badge */}
                {atleta.is_featured && (
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-black">
                    <Star className="w-4 h-4 text-black" />
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="font-bold text-white text-sm text-center line-clamp-1 group-hover:text-yellow-400 transition-colors">
                {atleta.title}
              </h3>
              
              {/* Description */}
              {atleta.description && (
                <p className="text-xs text-gray-400 text-center line-clamp-1 mt-1">
                  {atleta.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}