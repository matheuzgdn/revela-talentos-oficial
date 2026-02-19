import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp } from 'lucide-react';

export default function FeaturedAthletesRow({ athletes = [] }) {
  // Se não há atletas em destaque, não renderiza a seção
  if (!athletes || athletes.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.7 }}
      className="my-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <Star className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Talentos em Destaque
        </h2>
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
          PLANO DE CARREIRA
        </Badge>
      </div>
      
      <p className="text-gray-400 mb-8 max-w-2xl">
        Conheça os atletas que estão elevando suas carreiras com nosso Plano de Carreira completo.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {athletes.slice(0, 6).map((athlete, index) => (
          <motion.div
            key={athlete.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="bg-gray-900/50 border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      {athlete.profile_picture_url ? (
                        <img
                          src={athlete.profile_picture_url}
                          alt={athlete.full_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-yellow-400">
                          {athlete.full_name?.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-yellow-400 text-black rounded-full p-1">
                      <TrendingUp className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2">
                  {athlete.full_name}
                </h3>
                
                <div className="space-y-2 text-sm">
                  {athlete.position && (
                    <Badge variant="outline" className="border-yellow-400/50 text-yellow-400">
                      {athlete.position}
                    </Badge>
                  )}
                  
                  <div className="flex items-center justify-center gap-4 text-gray-400">
                    {athlete.age && (
                      <span>{athlete.age} anos</span>
                    )}
                    {athlete.club && (
                      <span>{athlete.club}</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs font-medium">CARREIRA ATIVA</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {athletes.length > 6 && (
        <div className="text-center mt-8">
          <p className="text-gray-400">
            E mais {athletes.length - 6} atletas desenvolvendo suas carreiras...
          </p>
        </div>
      )}
    </motion.div>
  );
}