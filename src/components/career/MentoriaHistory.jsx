import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Clock, 
  User, 
  Calendar,
  Play,
  CheckCircle,
  TrendingUp
} from "lucide-react";

export default function MentoriaHistory({ user, mentorias }) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterOptions = [
    { id: "all", label: "Todas Mentorias", icon: Video },
    { id: "completed", label: "Assistidas", icon: CheckCircle },
    { id: "pending", label: "Pendentes", icon: Clock }
  ];

  const mentoriasSample = mentorias.length > 0 ? mentorias : [
    {
      id: 1,
      title: "Análise Tática: Posicionamento em Campo",
      instructor: "Carlos Mendes",
      duration: 45,
      thumbnail_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop",
      completed: true,
      progress: 100,
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Preparação Mental para Competições",
      instructor: "Dr. Silva",
      duration: 30,
      thumbnail_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      completed: false,
      progress: 65,
      date: "2024-01-20"
    },
    {
      id: 3,
      title: "Técnicas de Finalização",
      instructor: "Roberto Santos",
      duration: 35,
      thumbnail_url: "https://images.unsplash.com/photo-1592656094267-764a45160876?w=400&h=250&fit=crop",
      completed: false,
      progress: 0,
      date: "2024-01-25"
    }
  ];

  const filteredMentorias = mentoriasSample.filter(mentoria => {
    if (selectedFilter === "completed") return mentoria.completed;
    if (selectedFilter === "pending") return !mentoria.completed;
    return true;
  });

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Histórico de Mentorias</h1>
        <p className="text-gray-400">Acompanhe seu progresso nas mentorias personalizadas</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {mentoriasSample.filter(m => m.completed).length}
                  </p>
                  <p className="text-gray-400 text-sm">Mentorias Concluídas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {mentoriasSample.reduce((total, m) => total + m.duration, 0)}
                  </p>
                  <p className="text-gray-400 text-sm">Minutos Assistidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(mentoriasSample.reduce((acc, m) => acc + m.progress, 0) / mentoriasSample.length)}%
                  </p>
                  <p className="text-gray-400 text-sm">Progresso Médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3">
        {filterOptions.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? "default" : "outline"}
            onClick={() => setSelectedFilter(filter.id)}
            className={`${
              selectedFilter === filter.id 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' 
                : 'border-gray-700 text-gray-300 hover:bg-gray-800'
            }`}
          >
            <filter.icon className="w-4 h-4 mr-2" />
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Mentorias Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentorias.map((mentoria, index) => (
            <motion.div
              key={mentoria.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all duration-300 group cursor-pointer">
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={mentoria.thumbnail_url}
                    alt={mentoria.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-green-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      {mentoria.completed ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1" />
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={mentoria.completed ? 'bg-green-600' : 'bg-yellow-600'}>
                      {mentoria.completed ? 'Concluída' : 'Em Progresso'}
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  {mentoria.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                      <div 
                        className="h-full bg-green-400 transition-all duration-300"
                        style={{ width: `${mentoria.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-white line-clamp-2">
                    {mentoria.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{mentoria.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{mentoria.duration} min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(mentoria.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {mentoria.progress > 0 && (
                      <span className="text-xs text-green-400">
                        {mentoria.progress}% concluído
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}