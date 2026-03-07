import React, { useState } from 'react';
import { Clock, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const TEXTS = {
  pt: {
    title: 'Aguardando Aprovação',
    greeting: 'Olá,',
    body: 'Sua conta foi criada com sucesso. Nossa equipe está revisando seu cadastro e em breve você terá acesso completo à plataforma.',
    notifyTitle: 'Você será notificado',
    notifyDesc: 'Enviaremos um email assim que seu acesso for liberado',
    timeTitle: 'Tempo estimado',
    timeDesc: 'A aprovação geralmente leva até 24 horas',
    whatsapp: 'https://wa.me/351914945252?text=Olá!%20Criei%20uma%20conta%20e%20gostaria%20de%20saber%20sobre%20minha%20aprovação',
    support: 'Falar com Suporte',
    logout: 'Sair da Conta',
  },
  es: {
    title: 'Esperando Aprobación',
    greeting: '¡Hola,',
    body: 'Tu cuenta fue creada con éxito. Nuestro equipo está revisando tu registro y pronto tendrás acceso completo a la plataforma.',
    notifyTitle: 'Serás notificado',
    notifyDesc: 'Te enviaremos un email en cuanto tu acceso sea habilitado',
    timeTitle: 'Tiempo estimado',
    timeDesc: 'La aprobación generalmente tarda hasta 24 horas',
    whatsapp: 'https://wa.me/351914945252?text=¡Hola!%20Creé%20una%20cuenta%20y%20quisiera%20saber%20sobre%20mi%20aprobación',
    support: 'Hablar con Soporte',
    logout: 'Cerrar Sesión',
  },
};

export default function PendingApproval({ user }) {
  const [lang, setLang] = useState('pt');
  const t = TEXTS[lang];

  const handleLogout = async () => {
    await base44.auth.logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-2xl">

          {/* Language Toggle */}
          <div className="flex justify-end mb-4">
            <div className="flex rounded-lg overflow-hidden border border-gray-700 text-xs font-semibold">
              <button
                onClick={() => setLang('pt')}
                className={`px-3 py-1.5 transition-colors ${lang === 'pt' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                🇧🇷 PT
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-3 py-1.5 transition-colors ${lang === 'es' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                🇪🇸 ES
              </button>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="p-4 bg-yellow-500/10 rounded-full">
              <Clock className="w-16 h-16 text-yellow-400 animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-3">
            {t.title}
          </h1>

          <p className="text-gray-400 text-center mb-8">
            {t.greeting} <span className="text-white font-semibold">{user?.full_name}</span>!{' '}
            {t.body}
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg">
              <Shield className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">{t.notifyTitle}</p>
                <p className="text-gray-400 text-xs">{t.notifyDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg">
              <Mail className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">{t.timeTitle}</p>
                <p className="text-gray-400 text-xs">{t.timeDesc}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={t.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.626-2.957 6.584-6.591 6.584zM11.832 9.923c-.197-.1-.99-.487-1.143-.543-.152-.056-.262-.087-.372.087-.11.174-.431.543-.529.653-.098.11-.196.125-.344.043a4.863 4.863 0 0 1-1.546-.96c-.197-.174-.332-.39-.465-.612-.133-.223-.142-.344.043-.464.174-.119.39-.323.588-.488.087-.07.152-.152.223-.262.07-.11.014-.223-.043-.332-.056-.11-.487-1.17-.666-1.606-.174-.422-.344-.367-.465-.367-.11-.007-.247-.007-.372-.007s-.344.043-.529.223c-.185.18-.693.68-.693 1.656 0 .974.71 1.916.81 2.064.098.152 1.397 2.136 3.39 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.087.38-.043 1.17-.487 1.325-1.011s.152-.99.11-.1011c-.043-.014-.152-.056-.344-.1z" />
              </svg>
              {t.support}
            </a>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-700 text-gray-400 hover:text-white"
            >
              {t.logout}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}