import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Settings,
  Grid3X3,
  User,
  MapPin,
  Calendar,
  Trophy,
  Edit3
} from "lucide-react";
import AthleteCurriculumModal from "./AthleteCurriculumModal";

export default function AthleteProfileHeader({ user, onUserUpdate, detailed = false }) {
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);

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

  if (!detailed) {
    // Versão compacta para o header
    return (
      <div className="flex items-center gap-4 p-4 border-b border-gray-800">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.profile_picture_url} />
          <AvatarFallback className="bg-green-600 text-white">
            {user?.full_name?.charAt(0) || 'A'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-bold text-white">{user?.full_name}</h2>
          <p className="text-gray-400 text-sm">{user?.position}</p>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  // Versão completa estilo perfil do Instagram
  return (
    <>
      <div className="p-4 space-y-6">
        {/* Profile Info */}
        <div className="flex items-start gap-4">
          <Avatar className="w-20 h-20 md:w-24 md:h-24">
            <AvatarImage src={user?.profile_picture_url} />
            <AvatarFallback className="bg-green-600 text-white text-xl">
              {user?.full_name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-xl text-white">{user?.full_name}</h1>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setShowCurriculumModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-white">127</div>
                <div className="text-gray-400">posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white">2.1k</div>
                <div className="text-gray-400">seguidores</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white">180</div>
                <div className="text-gray-400">seguindo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          {user?.position && (
            <Badge className="bg-green-600 text-white">
              {user.position}
            </Badge>
          )}
          
          <div className="space-y-1 text-sm">
            {user?.club && (
              <div className="flex items-center gap-2 text-gray-300">
                <Trophy className="w-4 h-4 text-green-400" />
                <span>{user.club}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4 text-green-400" />
              <span>{calculateAge(user?.birth_date)} anos</span>
            </div>
            
            {(user?.city || user?.state) && (
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-green-400" />
                <span>{user?.city}{user?.city && user?.state && ', '}{user?.state}</span>
              </div>
            )}
          </div>

          {user?.career_objectives && (
            <p className="text-white text-sm mt-2">
              {user.career_objectives}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-green-600 hover:bg-green-700">
            Seguir
          </Button>
          <Button variant="outline" className="border-gray-700">
            Mensagem
          </Button>
        </div>

        {/* Highlights/Stories salvos */}
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {['Treinos', 'Jogos', 'Conquistas', 'Viagens'].map((highlight, index) => (
            <div key={highlight} className="flex flex-col items-center space-y-2 min-w-fit">
              <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-xs text-gray-400 text-center">
                {highlight}
              </span>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800">
          <Button variant="ghost" className="flex-1 text-green-400 border-b-2 border-green-400 rounded-none">
            <Grid3X3 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className="flex-1 text-gray-400 rounded-none">
            <User className="w-5 h-5" />
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>

      <AthleteCurriculumModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
        user={user}
        onUpdate={onUserUpdate}
      />
    </>
  );
}