
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Trophy, Globe, Target, Award, TrendingUp, Star } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "1200+",
      label: "Atletas Conectados",
      description: "Profissionais em desenvolvimento",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0
    },
    {
      icon: Trophy,
      value: "800+",
      label: "Oportunidades Criadas",
      description: "Conexões com clubes nacionais e internacionais",
      gradient: "from-green-500 to-emerald-500",
      delay: 0.1
    },
    {
      icon: Globe,
      value: "18",
      label: "Países Alcançados",
      description: "Rede global de contatos",
      gradient: "from-purple-500 to-violet-500",
      delay: 0.2
    },
    {
      icon: Target,
      value: "85%",
      label: "Taxa de Sucesso",
      description: "Atletas que alcançaram seus objetivos",
      gradient: "from-amber-500 to-orange-500",
      delay: 0.3
    }
  ];

  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Números que <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Impressionam</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Resultados concretos que comprovam nosso compromisso com o sucesso dos nossos atletas.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="relative group"
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 h-full">
                <CardContent className="p-6 text-center relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`absolute -inset-3 bg-gradient-to-r ${stat.gradient} rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
                    <div className={`relative w-16 h-16 mx-auto bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Value */}
                  <motion.h3 
                    className="text-3xl md:text-4xl font-bold text-white mb-2"
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: stat.delay + 0.2, type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.h3>

                  {/* Label */}
                  <h4 className="text-base font-semibold text-slate-200 mb-2">
                    {stat.label}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {stat.description}
                  </p>

                  {/* Decorative Element */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Award className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Metodologia Comprovada</h3>
              <p className="text-slate-400 text-sm">
                Processo estruturado em 5 pilares fundamentais para o desenvolvimento completo do atleta.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Crescimento Constante</h3>
              <p className="text-slate-400 text-sm">
                Acompanhamento contínuo do progresso com métricas e feedback personalizado.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Star className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Excelência Reconhecida</h3>
              <p className="text-slate-400 text-sm">
                Referência no desenvolvimento de talentos para o futebol nacional e internacional.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
