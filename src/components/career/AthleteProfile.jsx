import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User as UserIcon,
  Calendar,
  MapPin,
  Trophy,
  Target,
  Edit3,
  Phone,
  Mail,
  Ruler,
  Weight,
  Users,
  Globe
} from "lucide-react";
import AthleteCurriculumModal from "./AthleteCurriculumModal";

export default function AthleteProfile({ user, onUserUpdate }) {
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

  const getContractStatusColor = (status) => {
    const colors = {
      'livre': 'bg-green-600',
      'contratado': 'bg-blue-600',
      'emprestado': 'bg-yellow-600',
      'aposentado': 'bg-gray-600'
    };
    return colors[status] || 'bg-gray-600';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-green-400/30 shadow-xl shadow-green-400/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Photo and Basic Info */}
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 border-4 border-green-400 shadow-lg shadow-green-400/30">
                  <AvatarImage src={user?.profile_picture_url} />
                  <AvatarFallback className="bg-green-600 text-white text-2xl">
                    {user?.full_name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-2xl font-bold text-white mb-2">{user?.full_name}</h2>
                
                {user?.position && (
                  <Badge className="bg-green-600 text-white mb-2">
                    {user.position}
                  </Badge>
                )}
                
                {user?.contract_status && (
                  <Badge className={`${getContractStatusColor(user.contract_status)} text-white`}>
                    {user.contract_status}
                  </Badge>
                )}
              </div>

              {/* Detailed Info */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h3 className="text-green-400 font-semibold flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Informações Pessoais
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      {user?.email && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail className="w-4 h-4 text-green-400" />
                          <span>{user.email}</span>
                        </div>
                      )}
                      
                      {user?.phone && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="w-4 h-4 text-green-400" />
                          <span>{user.phone}</span>
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
                  </div>

                  {/* Physical & Professional Info */}
                  <div className="space-y-3">
                    <h3 className="text-green-400 font-semibold flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Informações Técnicas
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      {user?.height && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Ruler className="w-4 h-4 text-green-400" />
                          <span>{user.height} cm</span>
                        </div>
                      )}
                      
                      {user?.weight && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Weight className="w-4 h-4 text-green-400" />
                          <span>{user.weight} kg</span>
                        </div>
                      )}
                      
                      {user?.club && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Users className="w-4 h-4 text-green-400" />
                          <span>{user.club}</span>
                        </div>
                      )}
                      
                      {user?.preferred_foot && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Target className="w-4 h-4 text-green-400" />
                          <span>Pé {user.preferred_foot}</span>
                        </div>
                      )}
                      
                      {user?.nationality && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Globe className="w-4 h-4 text-green-400" />
                          <span>{user.nationality}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6 flex gap-3">
                  <Button 
                    onClick={() => setShowCurriculumModal(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Ver/Editar Currículo Completo
                  </Button>
                </div>

                {/* Quick Stats */}
                {(user?.achievements?.length > 0 || user?.club_history?.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex flex-wrap gap-4 text-xs">
                      {user?.club_history?.length > 0 && (
                        <span className="text-gray-400">
                          <strong className="text-green-400">{user.club_history.length}</strong> clubes
                        </span>
                      )}
                      {user?.achievements?.length > 0 && (
                        <span className="text-gray-400">
                          <strong className="text-green-400">{user.achievements.length}</strong> conquistas
                        </span>
                      )}
                      {user?.languages?.length > 0 && (
                        <span className="text-gray-400">
                          <strong className="text-green-400">{user.languages.length}</strong> idiomas
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AthleteCurriculumModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
        user={user}
        onUpdate={onUserUpdate}
      />
    </>
  );
}