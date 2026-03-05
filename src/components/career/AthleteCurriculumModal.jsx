import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Plus,
  Trash2,
  User as UserIcon,
  Trophy,
  Target,
  BookOpen,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";

export default function AthleteCurriculumModal({ isOpen, onClose, user, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        // Personal Info
        birth_date: user.birth_date || "",
        nationality: user.nationality || "",
        city: user.city || "",
        state: user.state || "",
        height: user.height || "",
        weight: user.weight || "",
        preferred_foot: user.preferred_foot || "",

        // Professional Info
        club: user.club || "",
        position: user.position || "",
        contract_status: user.contract_status || "",
        availability_date: user.availability_date || "",
        market_value: user.market_value || "",

        // Career Info
        club_history: user.club_history || [],
        achievements: user.achievements || [],
        playing_style: user.playing_style || "",
        strengths: user.strengths || [],
        areas_improvement: user.areas_improvement || [],
        injury_history: user.injury_history || [],
        career_objectives: user.career_objectives || "",

        // Additional Info
        education: user.education || "",
        languages: user.languages || [],
        social_media: user.social_media || {},
        agent_name: user.agent_name || "",
        agent_contact: user.agent_contact || ""
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await User.updateMyUserData(formData);
      toast.success("Currículo atualizado com sucesso!");
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar currículo");
      console.error(error);
    }
    setIsLoading(false);
  };

  const addClubHistory = () => {
    setFormData(prev => ({
      ...prev,
      club_history: [...prev.club_history, {
        club_name: "",
        start_year: "",
        end_year: "",
        category: "",
        achievements: ""
      }]
    }));
  };

  const removeClubHistory = (index) => {
    setFormData(prev => ({
      ...prev,
      club_history: prev.club_history.filter((_, i) => i !== index)
    }));
  };

  const updateClubHistory = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      club_history: prev.club_history.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addToArray = (field, value) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
    }
  };

  const removeFromArray = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-400">
            Currículo do Atleta - {user?.full_name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="personal" className="text-xs">
              <UserIcon className="w-4 h-4 mr-1" />
              Pessoal
            </TabsTrigger>
            <TabsTrigger value="professional" className="text-xs">
              <Briefcase className="w-4 h-4 mr-1" />
              Profissional
            </TabsTrigger>
            <TabsTrigger value="career" className="text-xs">
              <Trophy className="w-4 h-4 mr-1" />
              Carreira
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-xs">
              <Target className="w-4 h-4 mr-1" />
              Habilidades
            </TabsTrigger>
            <TabsTrigger value="additional" className="text-xs">
              <BookOpen className="w-4 h-4 mr-1" />
              Adicional
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-1">Data de Nascimento</label>
                    <Input
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Nacionalidade</label>
                    <Input
                      value={formData.nationality}
                      onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: Brasileira"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Cidade</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: São Paulo"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Estado</label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ex: SP"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Altura (cm)</label>
                    <Input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value ? parseInt(e.target.value) : "" }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Peso (kg)</label>
                    <Input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value ? parseInt(e.target.value) : "" }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-1">Pé Preferido</label>
                  <select
                    value={formData.preferred_foot}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferred_foot: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="">Selecione</option>
                    <option value="direito">Direito</option>
                    <option value="esquerdo">Esquerdo</option>
                    <option value="ambidestro">Ambidestro</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Information */}
          <TabsContent value="professional" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-1">Clube Atual</label>
                    <Input
                      value={formData.club}
                      onChange={(e) => setFormData(prev => ({ ...prev, club: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Posição</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Selecione</option>
                      <option value="goleiro">Goleiro</option>
                      <option value="zagueiro">Zagueiro</option>
                      <option value="lateral">Lateral</option>
                      <option value="meio-campo">Meio-Campo</option>
                      <option value="atacante">Atacante</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white mb-1">Status Contratual</label>
                    <select
                      value={formData.contract_status}
                      onChange={(e) => setFormData(prev => ({ ...prev, contract_status: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Selecione</option>
                      <option value="livre">Livre</option>
                      <option value="contratado">Contratado</option>
                      <option value="emprestado">Emprestado</option>
                      <option value="aposentado">Aposentado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white mb-1">Data de Disponibilidade</label>
                    <Input
                      type="date"
                      value={formData.availability_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, availability_date: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-1">Nome do Agente</label>
                    <Input
                      value={formData.agent_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, agent_name: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Contato do Agente</label>
                    <Input
                      value={formData.agent_contact}
                      onChange={(e) => setFormData(prev => ({ ...prev, agent_contact: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career History */}
          <TabsContent value="career" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-400">Histórico de Clubes</CardTitle>
                <Button onClick={addClubHistory} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Clube
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.club_history?.map((club, index) => (
                  <div key={index} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-white font-semibold">Clube {index + 1}</h4>
                      <Button
                        onClick={() => removeClubHistory(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Nome do Clube"
                        value={club.club_name}
                        onChange={(e) => updateClubHistory(index, 'club_name', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Input
                        placeholder="Categoria"
                        value={club.category}
                        onChange={(e) => updateClubHistory(index, 'category', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Input
                        type="number"
                        placeholder="Ano Início"
                        value={club.start_year}
                        onChange={(e) => updateClubHistory(index, 'start_year', e.target.value ? parseInt(e.target.value) : "")}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Input
                        type="number"
                        placeholder="Ano Fim"
                        value={club.end_year}
                        onChange={(e) => updateClubHistory(index, 'end_year', e.target.value ? parseInt(e.target.value) : "")}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <Textarea
                      placeholder="Conquistas neste clube"
                      value={club.achievements}
                      onChange={(e) => updateClubHistory(index, 'achievements', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white mt-3"
                      rows={2}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">Conquistas e Títulos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Digite uma conquista e pressione Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('achievements', e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.achievements?.map((achievement, index) => (
                    <Badge key={index} className="bg-green-600 text-white">
                      {achievement}
                      <button
                        onClick={() => removeFromArray('achievements', index)}
                        className="ml-2 text-white hover:text-red-300"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills and Style */}
          <TabsContent value="skills" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">Estilo de Jogo</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Descreva seu estilo de jogo..."
                  value={formData.playing_style}
                  onChange={(e) => setFormData(prev => ({ ...prev, playing_style: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400">Pontos Fortes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Digite um ponto forte e pressione Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('strengths', e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="bg-gray-700 border-gray-600 text-white mb-3"
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.strengths?.map((strength, index) => (
                      <Badge key={index} className="bg-green-600 text-white">
                        {strength}
                        <button
                          onClick={() => removeFromArray('strengths', index)}
                          className="ml-2 text-white hover:text-red-300"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400">Áreas para Melhoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Digite uma área e pressione Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('areas_improvement', e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="bg-gray-700 border-gray-600 text-white mb-3"
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.areas_improvement?.map((area, index) => (
                      <Badge key={index} className="bg-yellow-600 text-white">
                        {area}
                        <button
                          onClick={() => removeFromArray('areas_improvement', index)}
                          className="ml-2 text-white hover:text-red-300"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">Objetivos de Carreira</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Descreva seus objetivos de carreira..."
                  value={formData.career_objectives}
                  onChange={(e) => setFormData(prev => ({ ...prev, career_objectives: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={4}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Information */}
          <TabsContent value="additional" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">Educação</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Formação educacional..."
                  value={formData.education}
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">Idiomas</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Digite um idioma e pressione Enter"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToArray('languages', e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="bg-gray-700 border-gray-600 text-white mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.languages?.map((language, index) => (
                    <Badge key={index} className="bg-blue-600 text-white">
                      {language}
                      <button
                        onClick={() => removeFromArray('languages', index)}
                        className="ml-2 text-white hover:text-red-300"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">Redes Sociais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Instagram"
                    value={formData.social_media?.instagram || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, instagram: e.target.value }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Input
                    placeholder="YouTube"
                    value={formData.social_media?.youtube || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, youtube: e.target.value }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Input
                    placeholder="TikTok"
                    value={formData.social_media?.tiktok || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, tiktok: e.target.value }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Input
                    placeholder="LinkedIn"
                    value={formData.social_media?.linkedin || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, linkedin: e.target.value }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Salvando..." : "Salvar Currículo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
