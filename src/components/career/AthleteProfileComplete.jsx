
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  MapPin,
  Calendar,
  Trophy,
  Edit3,
  BarChart3,
  Target,
  TrendingUp,
  Award,
  Video,
  Camera,
  Play,
  Users,
  Zap,
  Star,
  ChevronDown,
  ChevronUp,
  Building2,
  Phone,
  Flag,
  Ruler,
  Weight
} from "lucide-react";
import AthleteCurriculumModal from "./AthleteCurriculumModal";

export default function AthleteProfileComplete({ 
  user, 
  uploads, 
  performance, 
  gameSchedules, 
  progress, 
  onUserUpdate,
  isAdminView = false 
}) {
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [showMobileCurriculum, setShowMobileCurriculum] = useState(false);

  // Calculate statistics (Moved before early return for consistent hook order)
  const totalGoals = performance?.reduce((sum, game) => sum + (game.goals || 0), 0) || 0;
  const totalAssists = performance?.reduce((sum, game) => sum + (game.assists || 0), 0) || 0;
  const averageRating = performance?.length > 0
    ? (performance.reduce((sum, game) => sum + (game.rating || 0), 0) / performance.length).toFixed(1)
    : "0.0";

  const completedMentorias = progress?.filter(p => p.completed).length || 0;

  // Generate achievements based on performance (Moved before early return for consistent hook order)
  const generatedAchievements = useMemo(() => {
    const achievements = [];
    
    // Performance-based achievements
    if (totalGoals >= 10) achievements.push("Artilheiro - 10+ Gols");
    if (totalGoals >= 5) achievements.push("Primeiro Gol Profissional");
    if (totalAssists >= 5) achievements.push("Assistente - 5+ Assistências");
    if (parseFloat(averageRating) >= 8.0) achievements.push("Excelência - Nota Média 8+");
    if (parseFloat(averageRating) >= 7.0) achievements.push("Alto Desempenho - Nota Média 7+");
    
    // Development achievements
    if (completedMentorias >= 5) achievements.push("Dedicado - 5+ Mentorias");
    if (uploads?.length >= 10) achievements.push("Ativo - 10+ Uploads");
    if (uploads?.length >= 5) achievements.push("Primeiro Upload");
    
    // Participation achievements  
    if (performance?.length >= 10) achievements.push("Experiente - 10+ Jogos");
    if (performance?.length >= 5) achievements.push("Em Desenvolvimento - 5+ Jogos");
    if (gameSchedules?.length >= 3) achievements.push("Agenda Cheia - 3+ Jogos Agendados");
    
    // Add user's manual achievements if they exist
    if (user?.achievements?.length > 0) {
      achievements.push(...user.achievements);
    }
    
    return Array.from(new Set(achievements)); // Remove duplicates
  }, [totalGoals, totalAssists, averageRating, completedMentorias, uploads, performance, gameSchedules, user?.achievements]);

  if (!user) {
    return <div className="p-4 text-center text-gray-400">Carregando perfil do atleta...</div>;
  }

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return user?.age || "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const profileTabs = [
    { id: "overview", label: "Visão Geral", icon: User },
    { id: "stats", label: "Estatísticas", icon: BarChart3 },
    { id: "media", label: "Mídia", icon: Video },
    { id: "schedule", label: "Agenda", icon: Calendar },
    { id: "achievements", label: "Conquistas", icon: Trophy }
  ];

  // Complete curriculum sections for mobile/desktop
  const curriculumSections = [
    {
      id: 'basic',
      title: 'Informações Básicas',
      icon: User,
      data: [
        { label: 'Posição', value: user?.position, icon: Target },
        { label: 'Idade', value: `${calculateAge(user?.birth_date)} anos`, icon: Calendar },
        { label: 'Altura', value: user?.height ? `${user.height}cm` : 'N/A', icon: Ruler },
        { label: 'Peso', value: user?.weight ? `${user.weight}kg` : 'N/A', icon: Weight },
        { label: 'Pé Preferido', value: user?.preferred_foot, icon: Target }
      ]
    },
    {
      id: 'contact',
      title: 'Contato & Localização',
      icon: MapPin,
      data: [
        { label: 'Telefone', value: user?.phone, icon: Phone },
        { label: 'Cidade', value: user?.city, icon: MapPin },
        { label: 'Estado', value: user?.state, icon: MapPin },
        { label: 'Nacionalidade', value: user?.nationality, icon: Flag }
      ]
    },
    {
      id: 'career',
      title: 'Carreira',
      icon: Trophy,
      data: [
        { label: 'Clube Atual', value: user?.club, icon: Building2 },
        { label: 'Status Contratual', value: user?.contract_status, icon: Award },
        { label: 'Valor de Mercado', value: user?.market_value ? `€${user.market_value.toLocaleString()}` : 'N/A', icon: TrendingUp },
        { label: 'Agente', value: user?.agent_name, icon: Users }
      ]
    },
    {
      id: 'style',
      title: 'Estilo de Jogo',
      icon: Zap,
      data: [
        { label: 'Estilo', value: user?.playing_style, fullWidth: true },
        { label: 'Pontos Fortes', value: user?.strengths?.join(', '), fullWidth: true },
        { label: 'A Melhorar', value: user?.areas_improvement?.join(', '), fullWidth: true }
      ]
    }
  ];

  const MobileCurriculumCards = () => (
    <div className="lg:hidden mt-4">
      {/* Always show first card */}
      {curriculumSections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-3 mb-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center">
              {(() => {
                const Icon = curriculumSections[0].icon;
                return <Icon className="w-3 h-3 text-green-400" />;
              })()}
            </div>
            <h4 className="text-sm font-semibold text-green-400">{curriculumSections[0].title}</h4>
          </div>
          <div className="space-y-1">
            {curriculumSections[0].data.filter(item => item.value).map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`flex ${item.fullWidth ? 'flex-col' : 'justify-between items-center'} text-xs`}>
                  <span className="text-gray-400 flex items-center gap-1">
                    {Icon && <Icon className="w-3 h-3" />}
                    {item.label}:
                  </span>
                  <span className="text-white font-medium text-right">{item.value}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
      
      {/* Show/Hide button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowMobileCurriculum(!showMobileCurriculum)}
        className="w-full text-green-400 hover:text-green-300 hover:bg-green-500/10 mb-3"
      >
        {showMobileCurriculum ? (
          <>
            <ChevronUp className="w-4 h-4 mr-2" />
            Mostrar Menos
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-2" />
            Mostrar Mais Informações
          </>
        )}
      </Button>

      {/* Additional cards (shown/hidden) */}
      {showMobileCurriculum && (
        <div className="space-y-3">
          {curriculumSections.slice(1).map((section, index) => {
            const hasData = section.data.some(item => item.value);
            if (!hasData) return null;
            const SectionIcon = section.icon;
            
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center">
                    <SectionIcon className="w-3 h-3 text-green-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-green-400">{section.title}</h4>
                </div>
                <div className="space-y-1">
                  {section.data.filter(item => item.value).map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={idx} className={`flex ${item.fullWidth ? 'flex-col' : 'justify-between items-center'} text-xs`}>
                        <span className="text-gray-400 flex items-center gap-1">
                          {ItemIcon && <ItemIcon className="w-3 h-3" />}
                          {item.label}:
                        </span>
                        <span className="text-white font-medium text-right">{item.value}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeProfileTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-green-400" />
                    Informações Pessoais
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSection('personal')}
                  >
                    {expandedSections.has('personal') ? (
                       <> <ChevronUp className="w-4 h-4 mr-2" /> Mostrar Menos </>
                    ) : (
                       <> <ChevronDown className="w-4 h-4 mr-2" /> Mostrar Mais </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Posição</p>
                    <p className="text-white font-medium">{user?.position || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Idade</p>
                    <p className="text-white font-medium">{calculateAge(user?.birth_date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Clube Atual</p>
                    <p className="text-white font-medium">{user?.club || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Localização</p>
                    <p className="text-white font-medium">
                      {user?.city && user?.state ? `${user.city}, ${user.state}` : 'Não informado'}
                    </p>
                  </div>
                </div>

                {expandedSections.has('personal') && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700 overflow-hidden"
                  >
                    <div>
                      <p className="text-gray-400 text-sm">Altura</p>
                      <p className="text-white font-medium">{user?.height ? `${user.height}cm` : 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Peso</p>
                      <p className="text-white font-medium">{user?.weight ? `${user.weight}kg` : 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Pé Preferido</p>
                      <p className="text-white font-medium">{user?.preferred_foot || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Nacionalidade</p>
                      <p className="text-white font-medium">{user?.nationality || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status Contratual</p>
                      <p className="text-white font-medium">{user?.contract_status || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Agente</p>
                      <p className="text-white font-medium">{user?.agent_name || 'Não informado'}</p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {user?.career_objectives && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Objetivos de Carreira
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{user.career_objectives}</p>
                </CardContent>
              </Card>
            )}

            {user?.playing_style && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    Estilo de Jogo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Estilo Principal</p>
                    <p className="text-white font-medium">{user.playing_style}</p>
                  </div>
                  {user?.strengths?.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm">Pontos Fortes</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.strengths.map((strength, index) => (
                          <Badge key={index} className="bg-green-600/20 text-green-300">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {user?.areas_improvement?.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm">Áreas para Melhorar</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.areas_improvement.map((area, index) => (
                          <Badge key={index} className="bg-yellow-600/20 text-yellow-300">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "stats":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-black border border-gray-800">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{performance?.length || 0}</p>
                  <p className="text-xs text-green-300">Jogos</p>
                </CardContent>
              </Card>
              
              <Card className="bg-black border border-gray-800">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{totalGoals}</p>
                  <p className="text-xs text-blue-300">Gols</p>
                </CardContent>
              </Card>
              
              <Card className="bg-black border border-gray-800">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{totalAssists}</p>
                  <p className="text-xs text-yellow-300">Assistências</p>
                </CardContent>
              </Card>
              
              <Card className="bg-black border border-gray-800">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{averageRating}</p>
                  <p className="text-xs text-purple-300">Nota Média</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  Progresso de Desenvolvimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Mentorias Concluídas</span>
                  <span className="text-white font-bold">{completedMentorias}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Uploads Realizados</span>
                  <span className="text-white font-bold">{uploads?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Próximos Jogos</span>
                  <span className="text-white font-bold">{gameSchedules?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "media":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-1">
              {uploads?.map((upload) => (
                <div key={upload.id} className="aspect-square bg-gray-800 rounded relative group cursor-pointer">
                  {upload.file_type === 'video' ? (
                    <div className="w-full h-full bg-black flex items-center justify-center rounded">
                      <video src={upload.file_url} className="w-full h-full object-cover rounded" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                          <Play className="w-8 h-8 text-white" />
                       </div>
                    </div>
                  ) : (
                    <img 
                      src={upload.file_url} 
                      alt={upload.file_name} 
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                    {upload.file_type === 'video' ? (
                      <Video className="w-6 h-6 text-white" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
              ))}
              
              {!isAdminView && (
                <div className="aspect-square bg-gray-800 border-2 border-dashed border-gray-600 rounded flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors"
                  onClick={() => {
                    const uploadTab = document.querySelector('a[href="#upload"]');
                    if (uploadTab) uploadTab.click();
                  }}
                >
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Adicionar</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-4">
            {gameSchedules?.length > 0 ? (
              gameSchedules.map((game) => (
                <Card key={game.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-white">vs {game.opponent}</p>
                        <p className="text-sm text-gray-400">{game.venue}</p>
                        <p className="text-xs text-gray-500">{game.competition}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {new Date(game.game_date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(game.game_date).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        <Badge className={`mt-1 ${
                          game.importance === 'high' ? 'bg-red-600' :
                          game.importance === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'
                        }`}>
                          {game.importance === 'high' ? 'Alta' : 
                           game.importance === 'medium' ? 'Média' : 'Baixa'} Importância
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhum jogo agendado</p>
              </div>
            )}
          </div>
        );

      case "achievements":
        return (
          <div className="space-y-4">
            {generatedAchievements.length > 0 ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Conquistas Desbloqueadas</h3>
                  <p className="text-sm text-gray-400">Baseadas no seu desempenho e atividade na plataforma</p>
                </div>
                {generatedAchievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-400/30">
                      <CardContent className="p-4 flex items-center gap-4">
                        <Award className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-white">{achievement}</p>
                          <p className="text-sm text-gray-400">Conquista desbloqueada</p>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-300">
                          <Star className="w-3 h-3 mr-1" />
                          Novo
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="mb-2">Continue jogando e participando</p>
                <p className="text-sm">Suas conquistas aparecerão aqui conforme você progride!</p>
                {!isAdminView && (
                  <Button 
                    onClick={() => setShowCurriculumModal(true)}
                    className="mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Adicionar Conquistas Manuais
                  </Button>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-start gap-4 w-full md:w-auto">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
              <AvatarImage src={user?.profile_picture_url} />
              <AvatarFallback className="bg-green-600 text-white text-2xl">
                {user?.full_name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 md:hidden">
              <MobileCurriculumCards />
            </div>
          </div>
          
          <div className="flex-1 space-y-4 w-full md:w-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{user?.full_name}</h1>
                <p className="text-gray-400">{user?.position || 'Posição'} • {user?.club || 'Clube'}</p>
              </div>
              
              {!isAdminView && (
                <Button 
                  onClick={() => setShowCurriculumModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              )}
            </div>
            
            <div className="flex gap-8 text-center">
              <div>
                <div className="font-bold text-xl text-white">{uploads?.length || 0}</div>
                <div className="text-gray-400 text-sm">posts</div>
              </div>
              <div>
                <div className="font-bold text-xl text-white">{performance?.length || 0}</div>
                <div className="text-gray-400 text-sm">jogos</div>
              </div>
              <div>
                <div className="font-bold text-xl text-white">{completedMentorias}</div>
                <div className="text-gray-400 text-sm">mentorias</div>
              </div>
            </div>
          </div>
        </div>

        {user?.career_objectives && (
          <div className="text-white">
            <p>{user.career_objectives}</p>
          </div>
        )}

        {/* Mobile Tabs */}
        <div className="lg:hidden">
          <div className="border-b border-gray-800 mb-6">
            <div className="flex space-x-8 overflow-x-auto">
              {profileTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 px-1 border-b-2 transition-colors whitespace-nowrap ${
                    activeProfileTab === tab.id
                      ? 'border-green-400 text-green-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile Tab Content */}
          <div>
            {renderTabContent()}
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden lg:block">
          <div className="border-b border-gray-800">
            <div className="flex space-x-8 overflow-x-auto">
              {profileTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 px-1 border-b-2 transition-colors whitespace-nowrap ${
                    activeProfileTab === tab.id
                      ? 'border-green-400 text-green-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {!isAdminView && (
        <AthleteCurriculumModal
          isOpen={showCurriculumModal}
          onClose={() => setShowCurriculumModal(false)}
          user={user}
          onUpdate={onUserUpdate}
        />
      )}
    </>
  );
}
