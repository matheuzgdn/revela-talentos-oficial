
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Clock, Play, User, Eye } from "lucide-react";

export default function LiveMentorias({ user, contents, onContentSelect, isLoading, translations }) {
  if (isLoading) {
    return <div className="text-center text-gray-400">Carregando sessões ao vivo...</div>
  }

  const liveContents = contents.filter(c => c.category === 'live' && c.status === 'live');

  if (liveContents.length === 0) {
    return null;
  }
  
  const t = translations || { liveNow: "Mentoria ao Vivo Agora", liveDescription: "Participe da sessão exclusiva...", liveStatus: "AO VIVO", viewers: "Espectadores", watchNow: "Assistir Agora", minutes: "min" };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left space-y-2 px-3 md:px-0"
      >
        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h2 className="text-xl md:text-2xl font-bold text-white"
              style={{
                textShadow: '0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.4)'
              }}>
            {t.liveNow}
          </h2>
        </div>
        <p className="text-gray-400 text-sm md:text-base">
          {t.liveDescription}
        </p>
      </motion.div>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
        {liveContents.map((content, index) => (
          <motion.div
            key={content.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            className="w-64 flex-shrink-0 cursor-pointer group"
            onClick={() => onContentSelect(content)}
          >
            <Card className="bg-black border-red-500/50 hover:border-red-500 transition-colors shadow-lg shadow-red-500/10 overflow-hidden">
              <div className="relative">
                <img src={content.thumbnail_url || "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&q=80"} alt={content.title} className="w-full h-36 object-cover" />
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  <Badge className="bg-red-600 text-white flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" />
                    {t.liveStatus}
                  </Badge>
                  {content.viewers && (
                    <Badge className="bg-gray-700 text-white flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {content.viewers} {t.viewers}
                    </Badge>
                  )}
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-black ml-1" />
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-white text-sm mb-2 line-clamp-2">{content.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{content.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {content.instructor && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{content.instructor}</span>
                    </div>
                  )}
                  {content.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{content.duration} {t.minutes}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
