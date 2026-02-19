import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Trophy,
  Eye,
  Video,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MinhasSeletivasModal({ isOpen, onClose, applications, events }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'under_review':
        return <Eye className="w-5 h-5 text-blue-400" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'waitlist':
        return <AlertCircle className="w-5 h-5 text-purple-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'under_review':
        return 'bg-blue-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'waitlist':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Aguardando Análise';
      case 'under_review':
        return 'Em Análise';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Não Aprovado';
      case 'waitlist':
        return 'Lista de Espera';
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Minhas Candidaturas ({applications.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Você ainda não se candidatou a nenhuma seletiva.</p>
            </div>
          ) : (
            applications.map((application) => {
              const event = events.find(e => e.id === application.event_id);
              if (!event) return null;

              return (
                <Card key={application.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={event.thumbnail_url || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80'}
                        alt={event.title}
                        className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-xl text-white">{event.title}</h3>
                            <p className="text-gray-400 text-sm">{event.description}</p>
                          </div>
                          <Badge className={`${getStatusColor(application.status)} text-white ml-4 flex-shrink-0`}>
                            {getStatusIcon(application.status)}
                            <span className="ml-2">{getStatusLabel(application.status)}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Candidatura: {new Date(application.created_date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            <a 
                              href={application.video_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:underline"
                            >
                              Ver Vídeo Enviado
                            </a>
                          </div>
                        </div>

                        {application.analyst_notes && (
                          <div className="bg-gray-900 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Observações do Analista:</p>
                            <p className="text-sm text-gray-300">{application.analyst_notes}</p>
                          </div>
                        )}

                        {application.feedback && (
                          <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3">
                            <p className="text-xs text-green-500 font-semibold mb-1">Feedback:</p>
                            <p className="text-sm text-green-300">{application.feedback}</p>
                          </div>
                        )}

                        {application.rating && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Avaliação:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(10)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-6 rounded ${
                                    i < application.rating ? 'bg-yellow-400' : 'bg-gray-700'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 font-bold text-yellow-400">{application.rating}/10</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}