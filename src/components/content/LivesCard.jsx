
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Radio, Play, Users, ArrowRight, Clock, Calendar, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { appClient } from "@/api/backendClient";

export default function LivesCard({ liveCount = 0, isLiveActive = false, image = null, schedule = null }) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    show_card: true,
    is_live_active: false,
    is_postponed: false,
    default_schedule: 'Todas as segundas Ã s 20h',
    custom_schedule: '',
    custom_image_url: '',
    postpone_message: 'Live adiada para terÃ§a Ã s 20h',
    next_live_date: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLiveSettings();
  }, []);

  const loadLiveSettings = async () => {
    setIsLoading(true);
    try {
      const allSettings = await appClient.entities.PlatformSettings.list();
      
      const loadedSettings = {
        // CORREÃ‡ÃƒO: Verifica se Ã© exatamente 'true', se nÃ£o achar assume true (padrÃ£o)
        show_card: (() => {
          const setting = allSettings.find(s => s.setting_key === 'show_live_card');
          if (!setting) return true; // Se nÃ£o existe, mostra por padrÃ£o
          return setting.setting_value === 'true'; // SÃ³ mostra se for explicitamente 'true'
        })(),
        is_live_active: allSettings.find(s => s.setting_key === 'is_live_active')?.setting_value === 'true',
        is_postponed: allSettings.find(s => s.setting_key === 'live_is_postponed')?.setting_value === 'true',
        default_schedule: allSettings.find(s => s.setting_key === 'live_default_schedule')?.setting_value || 'Todas as segundas Ã s 20h',
        custom_schedule: allSettings.find(s => s.setting_key === 'live_custom_schedule')?.setting_value || '',
        custom_image_url: allSettings.find(s => s.setting_key === 'live_custom_image')?.setting_value || '',
        postpone_message: allSettings.find(s => s.setting_key === 'live_postpone_message')?.setting_value || 'Live adiada para terÃ§a Ã s 20h',
        next_live_date: allSettings.find(s => s.setting_key === 'next_live_date')?.setting_value || ''
      };
      
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading live settings:', error);
    }
    setIsLoading(false);
  };

  // Se ainda estÃ¡ carregando, nÃ£o mostra nada
  if (isLoading) {
    return null;
  }

  // Se o admin desabilitou o card, nÃ£o mostra nada
  if (!settings.show_card) {
    return null;
  }

  // Usar as props passadas ou as configuraÃ§Ãµes carregadas
  const displaySchedule = schedule || settings.custom_schedule || settings.default_schedule;
  const displayImage = image || settings.custom_image_url || null;

  // Determinar o status e badge
  let statusBadge = null;
  let statusColor = 'blue';
  
  if (settings.is_live_active) {
    statusBadge = (
      <Badge className="bg-red-600 text-white text-[10px] px-2 py-0.5 animate-pulse flex items-center gap-1">
        <Radio className="w-2.5 h-2.5" />
        AO VIVO
      </Badge>
    );
    statusColor = 'red';
  } else if (settings.is_postponed) {
    statusBadge = (
      <Badge className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 flex items-center gap-1">
        <AlertCircle className="w-2.5 h-2.5" />
        ADIADO
      </Badge>
    );
    statusColor = 'yellow';
  } else {
    statusBadge = (
      <Badge className="bg-blue-600 text-white text-[10px] px-2 py-0.5 flex items-center gap-1">
        <Clock className="w-2.5 h-2.5" />
        EM BREVE
      </Badge>
    );
    statusColor = 'blue';
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className="w-40 flex-shrink-0 cursor-pointer group"
      onClick={() => navigate(createPageUrl("Lives"))}
    >
      <div className={`relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl ${
        statusColor === 'red' ? 'bg-gradient-to-br from-red-900 to-black' :
        statusColor === 'yellow' ? 'bg-gradient-to-br from-yellow-900 to-black' :
        'bg-gradient-to-br from-blue-900 to-black'
      }`}>
        {/* Imagem de Fundo Customizada */}
        {displayImage ? (
          <img 
            src={displayImage} 
            alt="Lives EC10" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        {/* Badge de Status */}
        <div className="absolute top-2 right-2 z-10">
          {statusBadge}
        </div>

        {/* Icon Central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            settings.is_live_active 
              ? 'bg-red-600 animate-pulse' 
              : settings.is_postponed 
                ? 'bg-yellow-600/80'
                : 'bg-blue-600/80'
          }`}>
            <Radio className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <h3 className="font-bold text-white text-sm leading-tight mb-2">
            Lives EC10
          </h3>
          
          {/* HorÃ¡rio das Lives */}
          <div className="flex items-start gap-1 text-[10px] text-gray-200 mb-2 bg-black/40 backdrop-blur-sm p-2 rounded">
            <Calendar className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span className="leading-tight">
              {settings.is_postponed ? settings.postpone_message : displaySchedule}
            </span>
          </div>

          {/* PrÃ³xima Live (se houver data definida) */}
          {settings.next_live_date && !settings.is_postponed && (
            <div className="flex items-center gap-1 text-[10px] text-cyan-300 mb-2 bg-cyan-900/30 p-1.5 rounded">
              <Clock className="w-3 h-3" />
              <span>
                {new Date(settings.next_live_date).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}

          {liveCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-300 mb-2">
              <Users className="w-3 h-3" />
              <span>{liveCount} {liveCount === 1 ? 'live disponÃ­vel' : 'lives disponÃ­veis'}</span>
            </div>
          )}

          <div className={`flex items-center gap-1 text-xs font-semibold ${
            settings.is_live_active ? 'text-red-400' : 'text-blue-400'
          }`}>
            <span>Ver Lives</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-black ml-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

