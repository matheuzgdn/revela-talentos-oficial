import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, Award, ArrowRight, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Dados mock para quando não houver autenticação
const MOCK_ATHLETES = [
  {
    id: 1,
    full_name: "Gabriel Santos",
    position: "atacante",
    age: 22,
    club: "Santos FC",
    city: "Santos",
    state: "SP",
    profile_picture_url: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400",
    achievements: ["Artilheiro Paulista Sub-20", "Convocado Seleção Sub-23"],
    nationality: "Brasileira"
  },
  {
    id: 2,
    full_name: "Maria Silva",
    position: "meio-campo",
    age: 19,
    club: "Corinthians",
    city: "São Paulo",
    state: "SP",
    profile_picture_url: "https://images.unsplash.com/photo-1494790108755-2616b332?w=400",
    achievements: ["Melhor Jogadora SP", "Destaque Copa do Brasil"],
    nationality: "Brasileira"
  },
  {
    id: 3,
    full_name: "Lucas Oliveira",
    position: "zagueiro",
    age: 24,
    club: "Palmeiras",
    city: "São Paulo",
    state: "SP",
    profile_picture_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    achievements: ["Zagueiro Revelação", "Campeão Paulista"],
    nationality: "Brasileira"
  },
  {
    id: 4,
    full_name: "Ana Costa",
    position: "goleiro",
    age: 21,
    club: "São Paulo FC",
    city: "São Paulo",
    state: "SP",
    profile_picture_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    achievements: ["Melhor Goleira Paulista", "Seleção Sub-20"],
    nationality: "Brasileira"
  },
  {
    id: 5,
    full_name: "Rafael Mendes",
    position: "lateral",
    age: 20,
    club: "Flamengo",
    city: "Rio de Janeiro",
    state: "RJ",
    profile_picture_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    achievements: ["Revelação Carioca", "Campeão Brasileiro Sub-20"],
    nationality: "Brasileira"
  },
  {
    id: 6,
    full_name: "Carla Rodrigues",
    position: "atacante",
    age: 23,
    club: "Internacional",
    city: "Porto Alegre",
    state: "RS",
    profile_picture_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    achievements: ["Artilheira Gaúcha", "Convocada Seleção Brasileira"],
    nationality: "Brasileira"
  }
];

export default function FeaturedAthletesSection() {
  const [featuredAthletes] = useState(MOCK_ATHLETES);
  const [isLoading] = useState(false);

  const getPositionColor = (position) => {
    const colors = {
      goleiro: "from-yellow-500 to-orange-500",
      zagueiro: "from-blue-500 to-cyan-500",
      lateral: "from-green-500 to-emerald-500",
      "meio-campo": "from-purple-500 to-violet-500",
      atacante: "from-red-500 to-pink-500"
    };
    return colors[position] || "from-gray-500 to-slate-500";
  };

  const getPositionLabel = (position) => {
    const labels = {
      goleiro: "Goleiro",
      zagueiro: "Zagueiro",
      lateral: "Lateral",
      "meio-campo": "Meio-Campo",
      atacante: "Atacante"
    };
    return labels[position] || position;
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-64 h-8 bg-slate-700 rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">Nossos Talentos</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Atletas em <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Destaque</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Conheça alguns dos talentos que estão conquistando seus objetivos com o apoio da EC10 Talentos.
          </p>
        </motion.div>

        {/* Athletes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredAthletes.slice(0, 6).map((athlete, index) => (
            <motion.div
              key={athlete.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden h-full">
                <CardContent className="p-0">
                  {/* Header Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={athlete.profile_picture_url || `https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=300&fit=crop&crop=face`}
                      alt={athlete.full_name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Position Badge */}
                    <Badge className={`absolute top-4 left-4 bg-gradient-to-r ${getPositionColor(athlete.position)} text-white border-none font-bold`}>
                      {getPositionLabel(athlete.position)}
                    </Badge>

                    {/* Star Badge */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Name and Age */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {athlete.full_name}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>{athlete.age} anos</span>
                      </div>
                    </div>

                    {/* Club */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="font-medium">{athlete.club}</span>
                      </div>
                    </div>

                    {/* Location */}
                    {athlete.city && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>{athlete.city}, {athlete.state}</span>
                        </div>
                      </div>
                    )}

                    {/* Achievements */}
                    {athlete.achievements && athlete.achievements.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-slate-500 mb-2 font-medium">CONQUISTAS</p>
                        <div className="space-y-1">
                          {athlete.achievements.slice(0, 2).map((achievement, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                              <Award className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span className="truncate">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-slate-900/80 to-amber-900/80 border-amber-500/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-3">
                Quer aparecer aqui também?
              </h3>
              <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
                Junte-se aos nossos atletas de destaque e comece sua jornada rumo ao sucesso no futebol.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-6 py-3 rounded-lg shadow-lg shadow-amber-500/25 transition-all hover:scale-105">
                <Link to={createPageUrl("RevelaTalentos")}>
                  Começar Agora
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}