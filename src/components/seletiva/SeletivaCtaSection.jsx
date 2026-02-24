import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
export default function SeletivaCtaSection() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
    setIsLoading(false);
  };

  const handleParticipateClick = () => {
    // Sempre vai para a página SeletivaOnline
    // A página em si vai lidar com a lógica de mostrar cadastro ou oportunidades
    navigate(createPageUrl('SeletivaOnline'));
  };

  // Verificar se tem cadastro completo
  const hasCompletedProfile = user && user.onboarding_completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8 }}
      className="my-16 md:my-24">

      <Card className="relative bg-gradient-to-r from-slate-900 via-yellow-950/80 to-slate-900 border-2 border-yellow-400/30 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl shadow-yellow-500/15">
        <div className="absolute inset-0 bg-contain bg-no-repeat bg-center opacity-5" style={{ backgroundImage: "url('https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png')" }} />
        <div className="relative text-center">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full shadow-lg shadow-yellow-400/30 mb-6">
            <Trophy className="w-10 h-10 text-slate-900" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-wider">
            Seletiva Online <span className="text-yellow-400">EC10</span>
          </h2>
          
          <p className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl mt-6 leading-relaxed">
            {hasCompletedProfile ?
            'Explore as oportunidades disponíveis, candidate-se às seletivas e acompanhe o status das suas candidaturas.' :
            'Esta é a sua chance de ser visto por nossa equipe de especialistas. Envie seus vídeos, preencha seus dados e dê o primeiro passo para uma carreira de sucesso.'
            }
          </p>
          
          <div className="mt-10 flex justify-center">
            <Button
              onClick={handleParticipateClick}
              size="lg"
              disabled={isLoading} 
              className="bg-gradient-to-r text-slate-900 px-4 py-6 text-lg font-bold rounded-xl flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary/90 h-11 from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 shadow-lg shadow-yellow-400/30 transform hover:scale-105 transition-transform w-full md:w-auto">

              {isLoading ?
              'Carregando...' :
              hasCompletedProfile ?
              <>
                  <Trophy className="w-5 h-5 mr-3" />
                  Ver Oportunidades
                  <ArrowRight className="w-5 h-5 ml-3" />
                </> :

              <>
                  <Video className="w-5 h-5 mr-3" />
                  {user ? 'Completar Cadastro e Participar' : 'Participar da Seletiva'}
                  <ArrowRight className="w-5 h-5 ml-3" />
                </>
              }
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>);

}