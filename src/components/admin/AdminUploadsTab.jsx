import React, { useState } from "react";
import { appClient } from "@/api/backendClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AdminVideoReviewModal from "./AdminVideoReviewModal";
import { 
  Upload,
  Calendar,
  Eye,
  Sparkles
} from "lucide-react";

export default function AdminUploadsTab() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { data: videos = [], isLoading, refetch } = useQuery({
    queryKey: ['adminVideos'],
    queryFn: () => appClient.entities.AthleteVideo.list('-created_date', 100),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => appClient.entities.User.list('-created_date', 200),
  });

  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'processing':
        return 'bg-yellow-600';
      case 'pending':
        return 'bg-blue-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const pendingVideos = videos.filter(v => v.status === 'pending');
  const approvedVideos = videos.filter(v => v.status === 'approved');
  const rejectedVideos = videos.filter(v => v.status === 'rejected');

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">VÃ­deos dos Atletas</h3>
          <div className="flex gap-2">
            <Badge className="bg-yellow-600 text-white">{pendingVideos.length} Pendentes</Badge>
            <Badge className="bg-green-600 text-white">{approvedVideos.length} Aprovados</Badge>
          </div>
        </div>

        {/* Pending Videos - Priority */}
        {pendingVideos.length > 0 && (
          <div>
            <h4 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Aguardando AnÃ¡lise
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingVideos.map((video) => {
                const user = getUserById(video.athlete_id);
                if (!user) return null;

                return (
                  <Card key={video.id} className="bg-gray-800/50 border-yellow-700/50 hover:border-yellow-600 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profile_picture_url} />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {user.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-white">{user.full_name}</h4>
                            <p className="text-gray-400 text-sm">{video.title}</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-600 text-white text-xs">
                          Pendente
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] text-xs">
                            {video.position}
                          </Badge>
                          <Badge className="bg-purple-600/20 text-purple-400 text-xs">
                            {video.category}
                          </Badge>
                          {video.ai_analysis && (
                            <Badge className="bg-purple-500 text-white text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              IA Analisado
                            </Badge>
                          )}
                        </div>

                        {video.description && (
                          <p className="text-gray-300 text-sm line-clamp-2">"{video.description}"</p>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(video.created_date).toLocaleString('pt-BR')}
                        </div>

                        <Button
                          onClick={() => setSelectedVideo(video)}
                          className="w-full bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-bold"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Analisar e Revisar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Approved Videos */}
        {approvedVideos.length > 0 && (
          <div>
            <h4 className="text-green-400 font-bold mb-4">VÃ­deos Aprovados</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {approvedVideos.slice(0, 6).map((video) => {
                const user = getUserById(video.athlete_id);
                if (!user) return null;

                return (
                  <Card key={video.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer" onClick={() => setSelectedVideo(video)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profile_picture_url} />
                          <AvatarFallback className="bg-blue-600 text-white text-xs">
                            {user.full_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{user.full_name}</p>
                          <p className="text-gray-400 text-xs truncate">{video.title}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white text-xs">Aprovado</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {videos.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            <Upload className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhum vÃ­deo encontrado</h3>
            <p>Os vÃ­deos dos atletas aparecerÃ£o aqui.</p>
          </div>
        )}
      </div>

      {selectedVideo && (
        <AdminVideoReviewModal
          video={selectedVideo}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onUpdate={refetch}
        />
      )}
    </>
  );
}
