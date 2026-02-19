import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronDown, Trophy, Target, TrendingUp, Calendar, User, GitCommit } from 'lucide-react';

export default function PerformanceHistoryItem({ game }) {
  const [isOpen, setIsOpen] = useState(false);

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'bg-green-600';
    if (rating >= 6) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  const isCompleted = game.status === 'completed';

  return (
    <Card className={`bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors ${!isCompleted ? 'border-yellow-500/50' : ''}`}>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
          <div className="col-span-2 md:col-span-1 flex items-center gap-3">
             <Calendar className="w-5 h-5 text-gray-400 hidden md:block"/>
             <div>
                <p className="font-semibold text-white">{new Date(game.game_date).toLocaleDateString('pt-BR')}</p>
                <p className="text-sm text-gray-400">vs {game.opponent}</p>
             </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-400">Gols</p>
            <p className="font-bold text-lg text-green-400 flex items-center justify-center gap-2">
                <Target className="w-4 h-4"/>{game.goals || 0}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-400">Assist.</p>
            <p className="font-bold text-lg text-yellow-400 flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4"/>{game.assists || 0}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400">Nota</p>
            {isCompleted ? (
              <Badge className={`${getRatingColor(game.rating)} text-white`}>
                <Trophy className="w-3 h-3 mr-1.5"/>
                {game.rating}/10
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-400 border-gray-600">Pendente</Badge>
            )}
          </div>

          <div className="col-span-2 md:col-span-1 text-right">
            {(game.analyst_notes || game.athlete_feeling) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-cyan-400 hover:text-cyan-300"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Diário
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            )}
          </div>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-700/50 grid md:grid-cols-2 gap-6">
                {/* Coluna do Atleta */}
                <div>
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2"><User className="w-4 h-4"/>Sua Autoavaliação</h4>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div>
                      <p className="font-medium text-gray-400">Como se sentiu na partida?</p>
                      <p className="italic">"{game.athlete_feeling || 'Não informado'}"</p>
                    </div>
                     <div>
                      <p className="font-medium text-gray-400">Resumo da semana:</p>
                      <p className="italic">"{game.athlete_weekly_summary || 'Não informado'}"</p>
                    </div>
                  </div>
                </div>
                {/* Coluna do Analista */}
                {isCompleted && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2"><GitCommit className="w-4 h-4"/>Análise do Especialista</h4>
                     <div className="space-y-3 text-sm text-gray-300">
                        <div>
                          <p className="font-medium text-gray-400">Observações do Analista:</p>
                          <p className="italic">"{game.analyst_notes || 'Sem observações.'}"</p>
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}