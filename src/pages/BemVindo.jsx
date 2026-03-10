import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfileSetup from "@/components/athlete/ProfileSetup";
import { CheckCircle2, Sparkles } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function BemVindo() {
  const [user, setUser] = useState(null);
  const [openSetup, setOpenSetup] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await base44.auth.me();
        if (mounted) setUser(me);
        if (me) {
          // Usuários logados sempre entram na Zona de Membros
          navigate(createPageUrl("ZonaMembros"), { replace: true });
        }
      } catch (e) {
        // Visitante não autenticado: mantém na página BemVindo sem redirecionar para login
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  const handleFinished = async () => {
    // Reload user to confirm completion and go to Zona de Membros
    const me = await base44.auth.me();
    if (!me.onboarding_completed) {
      // Some setups may not flip the flag immediately; still proceed to members area.
    }
    navigate(createPageUrl("ZonaMembros"), { replace: true });
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-black via-[#0A1220] to-black">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Bem-vindo(a) ao EC10 Talentos
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Vamos configurar seu acesso
          </h1>
          <p className="text-gray-400 mt-3">
            Leva menos de 2 minutos. Após concluir, você entra direto na Zona de Membros.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6">
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Definir suas informações básicas</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Escolher posição e preferências</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Ativar notificações e pronto!</li>
          </ul>

          <div className="mt-5 flex justify-center">
            <Button onClick={() => setOpenSetup(true)} className="bg-cyan-600 hover:bg-cyan-500">
              Iniciar cadastro
            </Button>
          </div>
        </div>
      </div>

      {user && (
        <ProfileSetup
          isOpen={openSetup}
          onClose={() => setOpenSetup(false)}
          user={user}
          onSave={handleFinished}
        />
      )}
    </div>
  );
}