import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, Calendar, User } from 'lucide-react';

export default function NewsSection({ contents }) {
  // Filter and prepare news content
  const newsContent = contents
    .filter(content => content.category === 'feed_posts' || content.is_featured)
    .slice(0, 3);

  // Mock news if no content available
  const mockNews = [
    {
      id: 1,
      title: "EC10 Talentos expande operações para mais 3 países europeus",
      description: "Nova parceria com clubes da França, Alemanha e Itália amplia oportunidades para nossos atletas.",
      thumbnail_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
      created_date: "2024-01-15",
      category: "internacional",
      author: "Equipe EC10"
    },
    {
      id: 2,
      title: "Novo programa de mentorias técnicas com ex-jogadores profissionais",
      description: "Profissionais com experiência na Europa compartilham conhecimentos exclusivos com nossos atletas.",
      thumbnail_url: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop",
      created_date: "2024-01-12",
      category: "mentoria",
      author: "Eric Cena"
    },
    {
      id: 3,
      title: "Resultados do último EuroCamp: 15 atletas conquistaram oportunidades",
      description: "Mais um evento de sucesso com atletas brasileiros sendo avaliados por scouts europeus.",
      thumbnail_url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=400&fit=crop",
      created_date: "2024-01-10",
      category: "eurocamp",
      author: "Equipe EC10"
    }
  ];

  const displayContent = newsContent.length > 0 ? newsContent : mockNews;

  const getCategoryColor = (category) => {
    const colors = {
      internacional: "from-purple-500 to-violet-500",
      mentoria: "from-blue-500 to-cyan-500",
      eurocamp: "from-green-500 to-emerald-500",
      feed_posts: "from-amber-500 to-orange-500"
    };
    return colors[category] || "from-gray-500 to-slate-500";
  };

  const getCategoryLabel = (category) => {
    const labels = {
      internacional: "Internacional",
      mentoria: "Mentoria",
      eurocamp: "EuroCamp",
      feed_posts: "Notícias"
    };
    return labels[category] || "Novidades";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-full px-6 py-3 mb-6">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Últimas Novidades</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Fique por <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Dentro</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Acompanhe as últimas novidades, conquistas dos nossos atletas e oportunidades exclusivas.
          </p>
        </motion.div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayContent.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={news.thumbnail_url || `https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop`}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <Badge className={`absolute top-4 left-4 bg-gradient-to-r ${getCategoryColor(news.category)} text-white border-none font-bold`}>
                      {getCategoryLabel(news.category)}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(news.created_date)}</span>
                      </div>
                      {news.author && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{news.author}</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {news.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 leading-relaxed flex-1 line-clamp-3">
                      {news.description}
                    </p>

                    {/* Read More */}
                    <Button variant="ghost" className="mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 justify-start px-0">
                      Ler mais
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-slate-900/80 to-blue-900/80 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Não perca nenhuma novidade
              </h3>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Receba as últimas atualizações, oportunidades exclusivas e dicas dos nossos especialistas diretamente no seu email.
              </p>
              
              <div className="max-w-md mx-auto flex gap-3">
                <input
                  type="email"
                  placeholder="Seu melhor email"
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold px-6 rounded-lg transition-all hover:scale-105">
                  Assinar
                </Button>
              </div>
              
              <p className="text-sm text-slate-400 mt-4">
                📧 Sem spam. Cancele a qualquer momento.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}