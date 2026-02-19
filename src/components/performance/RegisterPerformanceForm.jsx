import React, { useState, useEffect } from "react";
import { AthleteUpload } from "@/entities/AthleteUpload";
import { PerformanceData } from "@/entities/PerformanceData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPerformanceForm({ user, onNewData }) {
  const [uploads, setUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    associated_video_url: "",
    opponent: "",
    game_date: "",
    minutes_played: "",
    athlete_feeling: "",
    athlete_weekly_summary: ""
  });

  useEffect(() => {
    const fetchUploads = async () => {
      if (user?.id) {
        const userUploads = await AthleteUpload.filter({ user_id: user.id, file_type: 'video' });
        setUploads(userUploads);
      }
    };
    fetchUploads();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.associated_video_url || !formData.opponent || !formData.game_date || !formData.minutes_played) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setIsLoading(true);
    try {
      await PerformanceData.create({
        user_id: user.id,
        ...formData,
        minutes_played: parseInt(formData.minutes_played),
        status: 'pending_analysis'
      });
      toast.success("Partida registrada com sucesso! Aguardando análise.");
      setFormData({
        associated_video_url: "",
        opponent: "",
        game_date: "",
        minutes_played: "",
        athlete_feeling: "",
        athlete_weekly_summary: ""
      });
      onNewData();
    } catch (error) {
      console.error("Error creating performance data:", error);
      toast.error("Erro ao registrar partida.");
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value) => {
    setFormData(prev => ({...prev, associated_video_url: value}));
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-cyan-400">
          <PlusCircle />
          Registrar Partida para Análise
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2 text-sm">Vídeo da Partida (Obrigatório)</label>
            <Select onValueChange={handleSelectChange} value={formData.associated_video_url}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Selecione um vídeo enviado..." />
              </SelectTrigger>
              <SelectContent>
                {uploads.length > 0 ? (
                  uploads.map(upload => (
                    <SelectItem key={upload.id} value={upload.file_url}>
                      {upload.file_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="disabled" disabled>
                    Nenhum vídeo encontrado. Faça upload primeiro.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Input name="opponent" placeholder="Adversário" value={formData.opponent} onChange={handleInputChange} className="bg-gray-800 border-gray-700 text-white" required />
            <Input name="game_date" type="date" value={formData.game_date} onChange={handleInputChange} className="bg-gray-800 border-gray-700 text-white" required />
            <Input name="minutes_played" type="number" placeholder="Minutos jogados" value={formData.minutes_played} onChange={handleInputChange} className="bg-gray-800 border-gray-700 text-white" required />
          </div>
          <Textarea name="athlete_feeling" placeholder="Como você se sentiu na partida?" value={formData.athlete_feeling} onChange={handleInputChange} className="bg-gray-800 border-gray-700 text-white" />
          <Textarea name="athlete_weekly_summary" placeholder="Como foi sua semana de treinos?" value={formData.athlete_weekly_summary} onChange={handleInputChange} className="bg-gray-800 border-gray-700 text-white" />
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Enviar para Análise
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}