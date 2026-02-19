import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { 
  Loader2, 
  Trophy, 
  Video, 
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  Award
} from 'lucide-react';

export default function SeletivaEventModal({ isOpen, onClose, event, user, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    video_url: '',
    additional_videos: '',
    why_participate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.video_url) {
      toast.error('Por favor, adicione o link do seu vídeo principal');
      return;
    }

    if (!formData.why_participate || formData.why_participate.length < 50) {
      toast.error('Por favor, descreva por que deseja participar (mínimo 50 caracteres)');
      return;
    }

    setIsSubmitting(true);
    try {
      const additionalVideos = formData.additional_videos
        ? formData.additional_videos.split('\n').filter(url => url.trim())
        : [];

      await base44.entities.SeletivaApplication.create({
        user_id: user.id,
        event_id: event.id,
        full_name: user.full_name,
        birth_date: user.birth_date,
        position: user.position,
        city: user.city,
        state: user.state,
        phone: user.phone,
        video_url: formData.video_url,
        additional_videos: additionalVideos,
        height: user.height,
        weight: user.weight,
        preferred_foot: user.preferred_foot,
        current_club: user.club,
        why_participate: formData.why_participate,
        status: 'pending'
      });

      // Atualizar contador de participantes
      await base44.entities.SeletivaEvent.update(event.id, {
        current_participants: (event.current_participants || 0) + 1
      });

      toast.success('🎉 Candidatura enviada com sucesso!');
      onSuccess();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Erro ao enviar candidatura. Tente novamente.');
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            Candidatar-se: {event.title}
          </DialogTitle>
        </DialogHeader>

        {/* Event Info */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4 mb-6">
          <img
            src={event.thumbnail_url || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80'}
            alt={event.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          
          <p className="text-gray-300">{event.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Até: {new Date(event.end_date).toLocaleDateString('pt-BR')}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
            {event.max_participants && (
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span>{event.max_participants - event.current_participants} vagas disponíveis</span>
              </div>
            )}
          </div>

          {event.benefits && event.benefits.length > 0 && (
            <div>
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                Benefícios e Oportunidades:
              </h4>
              <ul className="space-y-1 text-sm text-gray-300">
                {event.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {event.requirements && event.requirements.length > 0 && (
            <div>
              <h4 className="font-semibold text-white mb-2">Requisitos Obrigatórios:</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                {event.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-white flex items-center gap-2 mb-2">
                <Video className="w-4 h-4 text-yellow-400" />
                Link do Vídeo Principal *
              </Label>
              <Input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                placeholder="https://youtube.com/watch?v=... ou https://drive.google.com/..."
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Envie um vídeo de jogo completo ou melhores momentos (YouTube, Google Drive, etc.)
              </p>
            </div>

            <div>
              <Label className="text-white mb-2">Vídeos Adicionais (opcional)</Label>
              <Textarea
                value={formData.additional_videos}
                onChange={(e) => setFormData({...formData, additional_videos: e.target.value})}
                placeholder="Cole links adicionais (um por linha)&#10;https://youtube.com/watch?v=...&#10;https://youtube.com/watch?v=..."
                className="bg-gray-800 border-gray-700 text-white h-24"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-white mb-2">
                Por que você quer participar desta seletiva? *
              </Label>
              <Textarea
                value={formData.why_participate}
                onChange={(e) => setFormData({...formData, why_participate: e.target.value})}
                placeholder="Conte-nos suas motivações, objetivos e o que espera desta oportunidade..."
                className="bg-gray-800 border-gray-700 text-white h-32"
                required
                minLength={50}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.why_participate.length}/50 caracteres mínimos
              </p>
            </div>
          </div>

          {/* User Info Summary */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">Seus Dados (do perfil):</h4>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
              <div><span className="text-gray-500">Nome:</span> {user.full_name}</div>
              <div><span className="text-gray-500">Posição:</span> {user.position}</div>
              <div><span className="text-gray-500">Idade:</span> {user.age} anos</div>
              <div><span className="text-gray-500">Cidade/Estado:</span> {user.city}/{user.state}</div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.video_url || formData.why_participate.length < 50}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  Enviar Candidatura
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}