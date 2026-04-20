import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  FileImage,
  Video,
  Send,
  Loader2,
  History,
  CheckCircle,
  Clock,
  Eye,
  Calendar // Added
} from "lucide-react";
import { appClient } from "@/api/backendClient";


import { toast } from "sonner";
// Componente para Informar PrÃ³ximo Jogo
const NextGameForm = ({ user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameData, setGameData] = useState({
    opponent: "",
    game_date: "",
    venue: ""
  });

  const handleGameSubmit = async (e) => {
    e.preventDefault();
    if (!user || !gameData.opponent || !gameData.game_date || !gameData.venue) {
      toast.error("Preencha todos os campos do prÃ³ximo jogo.");
      return;
    }
    setIsSubmitting(true);
    try {
      await appClient.entities.GameSchedule.create({
        user_id: user.id,
        ...gameData,
        location: gameData.venue,
        status: 'scheduled'
      });
      toast.success("PrÃ³ximo jogo informado com sucesso!");
      setGameData({ opponent: "", game_date: "", venue: "" });
    } catch (error) {
      toast.error("Erro ao informar prÃ³ximo jogo.");
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="bg-black border-2 border-green-500/50 relative overflow-hidden shadow-2xl shadow-green-500/20 h-full">
      <div className="absolute inset-0 bg-green-500/5 rounded-lg"></div>
      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(74,222,128,0.15)] rounded-lg"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400 z-10 relative">
          <Calendar className="w-5 h-5" />
          Informar PrÃ³ximo Jogo
        </CardTitle>
      </CardHeader>
      <CardContent className="z-10 relative">
        <p className="text-gray-400 text-sm mb-4">Mantenha nossa equipe de scouting informada sobre suas prÃ³ximas partidas.</p>
        <form onSubmit={handleGameSubmit} className="space-y-4">
          <Input
            name="opponent"
            placeholder="AdversÃ¡rio"
            value={gameData.opponent}
            onChange={(e) => setGameData({ ...gameData, opponent: e.target.value })}
            className="bg-gray-800 border-gray-700"
          />
          <Input
            name="game_date"
            type="datetime-local"
            value={gameData.game_date}
            onChange={(e) => setGameData({ ...gameData, game_date: e.target.value })}
            className="bg-gray-800 border-gray-700"
          />
          <Input
            name="venue"
            placeholder="Local (EstÃ¡dio, Cidade)"
            value={gameData.venue}
            onChange={(e) => setGameData({ ...gameData, venue: e.target.value })}
            className="bg-gray-800 border-gray-700"
          />
          <Button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Enviar InformaÃ§Ãµes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};


export default function MarketingHub({ user, onUploadComplete }) {
  const [requestType, setRequestType] = useState("flyer");
  const [formData, setFormData] = useState({
    video_urls: "",
    flyer_title: "",
    flyer_subtitle: "",
    additional_info: ""
  });
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    if (!user) return;
    setIsHistoryLoading(true);
    try {
      const userRequests = await appClient.entities.Marketing.filter({ user_id: user.id }, "-created_date");
      setRequests(userRequests);
    } catch (error) {
      console.error("Error loading marketing requests:", error);
      toast.error("Erro ao carregar histÃ³rico de solicitaÃ§Ãµes.");
    }
    setIsHistoryLoading(false);
  }, [user]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    setSelectedPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (requestType === 'flyer' && selectedPhotos.length === 0) {
      toast.error("Por favor, selecione pelo menos uma foto para o flyer.");
      return;
    }

    setIsLoading(true);
    toast.info("Enviando solicitaÃ§Ã£o e fazendo upload dos arquivos...");

    try {
      let uploadedPhotoUrls = [];

      if (selectedPhotos.length > 0) {
        for (const photo of selectedPhotos) {
          const { file_url } = await appClient.storage.uploadFile({ file: photo });
          uploadedPhotoUrls.push(file_url);

          await appClient.entities.AthleteUpload.create({
            user_id: user.id,
            file_url,
            file_name: photo.name,
            file_type: 'photo',
            category: 'marketing',
            description: `Foto para ${formData.flyer_title || 'solicitaÃ§Ã£o de marketing'}`,
            processing_status: 'completed',
            file_size: photo.size
          });
        }
      }

      const payload = {
        user_id: user.id,
        request_type: requestType,
        photo_urls: uploadedPhotoUrls,
        video_urls: formData.video_urls.split(',').map(url => url.trim()).filter(url => url),
        flyer_title: formData.flyer_title,
        flyer_subtitle: formData.flyer_subtitle,
        additional_info: formData.additional_info
      };

      await appClient.entities.Marketing.create(payload);

      toast.success("SolicitaÃ§Ã£o enviada com sucesso!");
      setFormData({
        video_urls: "",
        flyer_title: "",
        flyer_subtitle: "",
        additional_info: ""
      });
      setSelectedPhotos([]);
      loadRequests();
      if (onUploadComplete) onUploadComplete();

    } catch (error) {
      console.error("Error creating marketing request:", error);
      toast.error("Falha ao enviar solicitaÃ§Ã£o.");
    }
    setIsLoading(false);
  };

  const statusConfig = {
    pending: { label: "Pendente", color: "bg-yellow-500", icon: Clock },
    in_progress: { label: "Em ProduÃ§Ã£o", color: "bg-blue-500", icon: Loader2 },
    completed: { label: "ConcluÃ­do", color: "bg-green-500", icon: CheckCircle },
    rejected: { label: "Rejeitado", color: "bg-red-500", icon: Eye }
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white">Central de Marketing</h1>
        <p className="text-gray-400 mt-2">Solicite peÃ§as de marketing e informe seus prÃ³ximos jogos Ã  nossa equipe.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <NextGameForm user={user} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black border-2 border-purple-500/50 relative overflow-hidden shadow-2xl shadow-purple-500/20 h-full">
            <div className="absolute inset-0 bg-purple-500/5 rounded-lg"></div>
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(192,132,252,0.15)] rounded-lg"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400 z-10 relative">
                <PlusCircle className="w-5 h-5" />
                Solicitar Material de DivulgaÃ§Ã£o
              </CardTitle>
            </CardHeader>
            <CardContent className="z-10 relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-2 p-1 bg-gray-800/50 rounded-lg">
                  <Button
                    type="button"
                    onClick={() => setRequestType("flyer")}
                    className={`flex-1 text-sm transition-all ${requestType === 'flyer' ? 'bg-purple-600 text-white shadow-md' : 'bg-transparent text-gray-300 hover:bg-gray-700/50'}`}
                  >
                    <FileImage className="w-4 h-4 mr-2" />
                    Criar Flyer de Jogo
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setRequestType("video_highlight")}
                    className={`flex-1 text-sm transition-all ${requestType === 'video_highlight' ? 'bg-purple-600 text-white shadow-md' : 'bg-transparent text-gray-300 hover:bg-gray-700/50'}`}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    VÃ­deo Destaque
                  </Button>
                </div>

                {requestType === "flyer" && (
                  <div className="space-y-4">
                    <Input
                      name="flyer_title"
                      placeholder="TÃ­tulo do Flyer (Ex: Jogo da Semana!)"
                      value={formData.flyer_title}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Input
                      name="flyer_subtitle"
                      placeholder="SubtÃ­tulo (Ex: Flamengo vs Vasco)"
                      value={formData.flyer_subtitle}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <div>
                      <label className="block text-white mb-2 text-sm">Fotos para o Flyer *</label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isLoading}
                        className="bg-gray-800 border-gray-700 text-white file:text-white file:bg-gray-700 file:border-none file:px-4 file:py-2 file:rounded-lg file:mr-4 hover:file:bg-gray-600"
                      />
                      {selectedPhotos.length > 0 && (
                        <p className="text-xs text-gray-400 mt-2">{selectedPhotos.length} foto(s) selecionada(s).</p>
                      )}
                    </div>
                  </div>
                )}

                {requestType === "video_highlight" && (
                  <div className="space-y-4">
                    <Textarea
                      name="video_urls"
                      placeholder="Cole as URLs dos seus melhores vÃ­deos, separadas por vÃ­rgula"
                      value={formData.video_urls}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white h-24"
                    />
                  </div>
                )}

                <Textarea
                  name="additional_info"
                  placeholder="InstruÃ§Ãµes adicionais (opcional)."
                  value={formData.additional_info}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-white h-24"
                />

                <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Enviar SolicitaÃ§Ã£o
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <History className="w-5 h-5 text-gray-400" />
              Minhas SolicitaÃ§Ãµes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isHistoryLoading ? (
              <div className="text-center text-gray-400 py-8">Carregando histÃ³rico...</div>
            ) : requests.length > 0 ? (
              <div className="space-y-3">
                {requests.map(req => {
                  const config = statusConfig[req.status];
                  const Icon = config.icon;
                  return (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">
                          {req.request_type === 'flyer' ? 'Flyer' : 'VÃ­deo Destaque'}
                          {req.flyer_title && `: ${req.flyer_title}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          Solicitado em: {new Date(req.created_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge className={`${config.color} text-white`}>
                        <Icon className={`w-3 h-3 mr-1 ${req.status === 'in_progress' ? 'animate-spin' : ''}`} />
                        {config.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhuma solicitaÃ§Ã£o encontrada.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}




