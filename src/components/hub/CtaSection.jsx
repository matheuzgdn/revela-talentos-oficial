import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star, Trophy } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CtaSection() {
  const handleLoginClick = () => {
    base44.auth.redirectToLogin();
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-blue-500/30 shadow-2xl shadow-blue-500/20 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
              
              {/* Icons */}
              <div className="flex justify-center gap-4 mb-6 relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl md:rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl md:rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                  Pronto para Dar o Próximo Passo?
                </h2>
                <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Junte-se a centenas de atletas que já estão transformando seus sonhos em realidade.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg"
                    onClick={handleLoginClick}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold px-8 py-6 text-base rounded-2xl md:rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 w-full sm:w-auto"
                  >
                    Entrar com Google
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <Button 
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-slate-600 text-white hover:bg-slate-800/50 px-8 py-6 text-base rounded-2xl md:rounded-xl backdrop-blur-sm w-full sm:w-auto"
                  >
                    <Link to={createPageUrl("PlanoInternacional")}>
                      Conhecer Planos
                    </Link>
                  </Button>
                </div>

                {/* Trust Badge */}
                <p className="mt-6 text-sm text-slate-400">
                  ✓ Sem compromisso • ✓ Comece grátis • ✓ Cancele quando quiser
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}