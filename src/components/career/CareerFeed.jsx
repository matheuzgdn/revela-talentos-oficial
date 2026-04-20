
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Corrected syntax here
import { Badge } from "@/components/ui/badge";
import { 
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Trophy,
  BarChart3,
  Users,
  Video,
  Star,
  Plus,
  Zap,
  Award,
  Book,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

// VersÃ­culos prÃ©-definidos como fallback
const fallbackVerses = [
  {
    verse: "Posso todas as coisas naquele que me fortalece.",
    reference: "Filipenses 4:13",
    reflection: "No futebol, como na vida, enfrentamos desafios que parecem impossÃ­veis. Mas com fÃ© e determinaÃ§Ã£o, podemos superar qualquer obstÃ¡culo e alcanÃ§ar nossos sonhos."
  },
  {
    verse: "NÃ£o foi Deus que lhe disse: Seja forte e corajoso? NÃ£o tenha medo, nÃ£o desanime, pois o Senhor, o seu Deus, estarÃ¡ com vocÃª por onde vocÃª andar.",
    reference: "JosuÃ© 1:9",
    reflection: "Cada jogo, cada treino Ã© uma oportunidade de mostrar coragem. Quando confiamos em algo maior que nÃ³s mesmos, encontramos a forÃ§a para seguir em frente mesmo nas derrotas."
  },
  {
    verse: "Os planos do Senhor permanecem para sempre; os propÃ³sitos do seu coraÃ§Ã£o, por todas as geraÃ§Ãµes.",
    reference: "Salmos 33:11",
    reflection: "Sua jornada no futebol faz parte de um propÃ³sito maior. Cada passo, cada conquista e atÃ© mesmo cada dificuldade contribuem para o seu crescimento como atleta e pessoa."
  },
  {
    verse: "Tudo tem o seu tempo determinado, e hÃ¡ tempo para todo propÃ³sito debaixo do cÃ©u.",
    reference: "Eclesiastes 3:1",
    reflection: "Na carreira esportiva, aprendemos que cada fase tem seu momento. PaciÃªncia e perseveranÃ§a sÃ£o virtudes essenciais para alcanÃ§ar nossos objetivos no futebol."
  },
  {
    verse: "Mas os que esperam no Senhor renovarÃ£o as suas forÃ§as; subirÃ£o com asas como Ã¡guias; correrÃ£o, e nÃ£o se cansarÃ£o; caminharÃ£o, e nÃ£o se fatigarÃ£o.",
    reference: "IsaÃ­as 40:31",
    reflection: "O preparo fÃ­sico e mental sÃ£o fundamentais, mas a forÃ§a espiritual nos sustenta nos momentos mais desafiadores da nossa jornada esportiva."
  }
];

export default function CareerFeed({ user, uploads, progress, performance, gameSchedules, feedPosts, onRefresh, setActiveTab }) {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [dailyVerse, setDailyVerse] = useState(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);
  const [dailyVerseLikes, setDailyVerseLikes] = useState(0);
  const [isDailyVerseLiked, setIsDailyVerseLiked] = useState(false);

  // Load daily devotional automatically for Plano de Carreira users
  useEffect(() => {
    if (user?.has_plano_carreira_access) {
      loadDailyVerse();
    }
  }, [user]);

  const loadDailyVerse = async () => {
    setIsLoadingVerse(true);
    
    // Usar diretamente o fallback devido a limitaÃ§Ãµes de quota da API
    try {
      // Seleciona um versÃ­culo aleatÃ³rio baseado no dia atual para consistÃªncia
      const today = new Date();
      // Calculate day of the year (0-indexed)
      const startOfYear = new Date(today.getFullYear(), 0, 0);
      const diff = today.getTime() - startOfYear.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      const verseIndex = dayOfYear % fallbackVerses.length;
      
      const selectedVerse = fallbackVerses[verseIndex];
      
      setDailyVerse(selectedVerse);
      setDailyVerseLikes(Math.floor(Math.random() * 20) + 15); // Random initial likes (15-34)
      setIsDailyVerseLiked(false);
    } catch (error) {
      console.error("Error loading daily verse:", error);
      // Fallback para o primeiro versÃ­culo se houver qualquer problema inesperado (e.g. if fallbackVerses is empty)
      setDailyVerse(fallbackVerses[0]); // Ensure there's always at least one verse
      setDailyVerseLikes(12);
      setIsDailyVerseLiked(false);
    }
    
    setIsLoadingVerse(false);
  };

  const handleSuggestionClick = async (suggestion) => {
    try {
      let updateData = {};
      
      switch(suggestion.type) {
        case 'complete_profile':
          // Auto-populate missing profile fields
          if (!user.career_objectives) {
            updateData.career_objectives = "AlcanÃ§ar o futebol profissional e representar meu paÃ­s em competiÃ§Ãµes internacionais.";
          }
          if (!user.playing_style) {
            updateData.playing_style = "Jogador tÃ©cnico com boa visÃ£o de jogo";
          }
          break;
        case 'upload_video':
          // This should trigger the tab change on the PlanoCarreiraPage
          setActiveTab('upload');
          toast.info("Acesse a aba 'Upload' para enviar seu vÃ­deo.");
          return;
        case 'performance_analysis':
          // Redirect to performance analysis
          window.location.href = createPageUrl("AnalisePerformance");
          return;
      }
      
      if (Object.keys(updateData).length > 0) {
        await UserEntity.updateMyUserData(updateData);
        toast.success("Perfil atualizado automaticamente!");
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error handling suggestion:", error);
      toast.error("NÃ£o foi possÃ­vel aplicar a sugestÃ£o.");
    }
  };

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const newLikes = new Set(prev);
      if (newLikes.has(postId)) {
        newLikes.delete(postId);
      } else {
        newLikes.add(postId);
      }
      return newLikes;
    });
  };

  const handleDailyVerseLike = () => {
    if (isDailyVerseLiked) {
      setDailyVerseLikes(prev => prev - 1);
    } else {
      setDailyVerseLikes(prev => prev + 1);
    }
    setIsDailyVerseLiked(!isDailyVerseLiked);
  };

  // Stats calculation
  const completedMentorias = progress?.filter(p => p.completed).length || 0;
  const completedAnalyses = performance?.filter(p => p.status === 'completed') || [];
  const averageRating = completedAnalyses.length > 0
    ? (completedAnalyses.reduce((sum, p) => sum + p.rating, 0) / completedAnalyses.length)
    : 0;

  const stories = [
    { id: 'upload', icon: Plus, label: 'Upload', color: 'from-green-400 to-emerald-500', action: () => setActiveTab('upload') },
    { id: 'videos', icon: Video, label: `${uploads?.length || 0} VÃ­deos`, color: 'from-blue-400 to-cyan-500' },
    { id: 'mentorias', icon: Star, label: `${completedMentorias} Mentorias`, color: 'from-yellow-400 to-orange-500' },
    { id: 'performance', icon: Trophy, label: `${averageRating.toFixed(1)} Nota`, color: 'from-purple-400 to-pink-500' }
  ];

  // Enhanced suggestions with auto-fill capability
  const suggestions = [
    {
      id: 'complete_profile',
      title: 'Complete seu perfil',
      description: 'Adicione mais informaÃ§Ãµes profissionais',
      type: 'complete_profile',
      icon: UserCheck
    },
    {
      id: 'upload_video',
      title: 'Envie um vÃ­deo',
      description: 'Mostre suas habilidades',
      type: 'upload_video',
      icon: Video
    },
    {
      id: 'performance_analysis',
      title: 'AnÃ¡lise de Performance',
      description: 'Veja seus dados estatÃ­sticos',
      type: 'performance_analysis',
      icon: BarChart3
    }
  ];

  // Dynamically generate allPosts from feedPosts
  const allPosts = (feedPosts || []).map(post => {
    if (post.post_type) { // It's a CareerPost
      const common = {
        id: post.id,
        user: { name: 'EC10 Talentos', avatar: 'https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png' },
        time: new Date(post.created_date).toLocaleDateString('pt-BR'),
        likes: post.likes || 0, // Start with real likes or 0
        image: post.image_url
      };
      switch(post.post_type) {
        case 'devotional':
           // Devotionals from admin are now regular posts
          return {
            ...common,
            content: `"${post.content}" - ${post.reference}`,
            reflection: post.reflection,
            isDevocional: true
          };
        case 'player_of_week':
          return {
            ...common,
            content: `Jogador Destaque da Semana: ${post.content}`,
            isDestaque: true,
          };
        case 'challenge':
          return {
            ...common,
            content: `Desafio da Semana: ${post.content}`,
            isDesafio: true,
          };
        default:
          return null;
      }
    } else { // It's a Content entity post
      return {
        id: post.id,
        type: 'admin_post',
        user: { name: 'EC10 Talentos', avatar: 'https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png' },
        content: post.description,
        image: post.thumbnail_url,
        time: new Date(post.created_date).toLocaleDateString('pt-BR'),
        likes: post.likes || 0, // Start with real likes or 0
      };
    }
  }).filter(Boolean);

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto lg:max-w-none">
      {/* Stories/Highlights */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-2 min-w-fit">
            <div 
              className={`w-16 h-16 rounded-full bg-gradient-to-tr ${story.color} p-0.5 cursor-pointer transition-transform hover:scale-110`}
              onClick={story.action}
            >
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <story.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-xs text-gray-400 text-center max-w-16 truncate">
              {story.label}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className="bg-black border border-gray-800 cursor-pointer hover:scale-105 transition-transform"
        >
          <Link to={createPageUrl("AnalisePerformance")}>
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-white mx-auto mb-2" />
              <h3 className="font-bold text-white text-sm">AnÃ¡lise Performance</h3>
              <p className="text-xs text-gray-400 mt-1">{performance?.length || 0} anÃ¡lises</p>
            </CardContent>
          </Link>
        </Card>

        <Card 
          className="bg-black border border-gray-800 cursor-pointer hover:scale-105 transition-transform"
        >
          <Link to={createPageUrl("RevelaTalentos")}>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-white mx-auto mb-2" />
              <h3 className="font-bold text-white text-sm">Mentorias</h3>
              <p className="text-xs text-gray-400 mt-1">{completedMentorias} concluÃ­das</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Daily Devotional Section */}
      {(dailyVerse || isLoadingVerse) && user?.has_plano_carreira_access && (
        <Card className="bg-black border-2 border-purple-500/50 relative overflow-hidden shadow-2xl shadow-purple-500/20">
          {/* Neon glow effect */}
          <div className="absolute inset-0 bg-purple-500/5 rounded-lg"></div>
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(168,85,247,0.15)] rounded-lg"></div>
          
          <CardHeader className="relative z-10">
            <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2">
              <Book className="w-5 h-5 text-purple-400" />
              Devocional do Dia
            </h3>
          </CardHeader>
          <CardContent className="relative z-10">
            {isLoadingVerse ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                <p className="text-purple-300 mt-2">Carregando mensagem inspiradora...</p>
              </div>
            ) : (
              <>
                <p className="text-white text-lg italic leading-relaxed mb-2">"{dailyVerse.verse}"</p>
                <p className="text-right text-purple-300 mt-1 font-medium">- {dailyVerse.reference}</p>
                <div className="mt-4 p-4 bg-purple-900/20 rounded-lg border-l-4 border-purple-400 backdrop-blur-sm">
                  <p className="text-purple-100 text-sm leading-relaxed">{dailyVerse.reflection}</p>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDailyVerseLike}
                    className={`p-0 h-auto transition-all duration-200 ${
                      isDailyVerseLiked 
                        ? 'text-red-400 scale-110' 
                        : 'text-gray-400 hover:text-red-400/80 hover:scale-105'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isDailyVerseLiked ? 'fill-current animate-pulse' : ''}`} />
                  </Button>
                  <span className="font-semibold text-white text-sm">
                    {dailyVerseLikes} curtidas
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Intelligent Suggestions */}
      {user?.has_plano_carreira_access && (
        <Card className="bg-black border border-gray-800">
          <CardHeader>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              SugestÃµes para VocÃª
            </h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map(suggestion => (
              <div 
                key={suggestion.id}
                className="bg-gray-900/50 p-3 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-3">
                  <suggestion.icon className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-semibold text-white text-sm">{suggestion.title}</p>
                    <p className="text-xs text-gray-400">{suggestion.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Feed Posts */}
      <div className="space-y-6">
        {allPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-black border border-gray-800 overflow-hidden">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.user.avatar} />
                    <AvatarFallback className="bg-green-600 text-white text-sm">
                      EC
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white text-sm">{post.user.name}</p>
                      {post.isDevocional && <Badge className="bg-purple-600 text-white text-xs"><Book className="w-3 h-3 mr-1" />Devocional</Badge>}
                      {post.isDestaque && <Badge className="bg-yellow-600 text-black text-xs"><Award className="w-3 h-3 mr-1" />Destaque</Badge>}
                      {post.isDesafio && <Badge className="bg-red-600 text-white text-xs"><Zap className="w-3 h-3 mr-1" />Desafio</Badge>}
                    </div>
                    <p className="text-xs text-gray-400">{post.time}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-white text-sm leading-relaxed">{post.content}</p>
                
                {/* Reflection for admin-posted devotionals */}
                {post.isDevocional && post.reflection && (
                  <div className="mt-3 p-3 bg-purple-900/30 rounded-lg border-l-4 border-purple-400">
                    <p className="text-purple-200 text-sm italic">{post.reflection}</p>
                  </div>
                )}
              </div>

              {/* Post Media */}
              {post.image && (
                <div className="relative">
                  <img 
                    src={post.image} 
                    alt="Post" 
                    className="w-full aspect-square object-cover"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id)}
                      className={`p-0 h-auto ${
                        likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400">
                      <MessageCircle className="w-6 h-6" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400">
                      <Send className="w-6 h-6" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400">
                    <Bookmark className="w-6 h-6" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-white text-sm">
                    {(post.likes + (likedPosts.has(post.id) ? 1 : 0))} curtidas
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


