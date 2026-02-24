import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Upload,
  Video,
  Camera,
  Calendar,
  ExternalLink
} from "lucide-react";

export default function AdminUploadsTab({ uploads, users }) {
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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Uploads dos Atletas</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {uploads.map((upload) => {
          const user = getUserById(upload.user_id);
          if (!user) return null;

          return (
            <Card key={upload.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
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
                      <p className="text-gray-400 text-sm">{upload.file_name}</p>
                    </div>
                  </div>
                  {upload.file_url && (
                    <a 
                      href={upload.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-purple-600 text-white text-xs">
                      {upload.category}
                    </Badge>
                    <Badge className={`${getStatusColor(upload.processing_status)} text-white text-xs`}>
                      {upload.processing_status === 'completed' ? 'Processado' :
                       upload.processing_status === 'processing' ? 'Processando' :
                       upload.processing_status === 'pending' ? 'Pendente' : 'Falhou'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      {upload.file_type === 'video' ? <Video className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                      <span>{upload.file_type}</span>
                    </div>
                    {upload.file_size && (
                      <span className="text-gray-400">{formatFileSize(upload.file_size)}</span>
                    )}
                  </div>

                  {upload.description && (
                    <p className="text-gray-300 text-sm italic">"{upload.description}"</p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(upload.created_date).toLocaleString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {uploads.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Upload className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhum upload encontrado</h3>
          <p>Os uploads dos atletas aparecerão aqui.</p>
        </div>
      )}
    </div>
  );
}