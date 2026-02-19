import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CareerCtaSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-16"
        >
            <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-cyan-400/30 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl shadow-blue-500/10">
                <div className="absolute -inset-px rounded-3xl border-2 border-cyan-400/50 opacity-20 animate-pulse"></div>
                <div className="relative text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-cyan-400/30">
                        <Crown className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl md:text-4xl font-bold text-white">
                        Acelere sua Carreira no Futebol
                    </h3>
                    
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                        Com nossos planos especializados, você tem acesso a mentoria personalizada, 
                        análises técnicas e oportunidades internacionais exclusivas.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button 
                            asChild
                            size="lg"
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-cyan-400/25"
                        >
                            <Link to={createPageUrl("PlanoCarreira")}>
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Plano de Carreira
                            </Link>
                        </Button>
                        
                        <Button 
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-white/50 bg-white/10 text-white hover:bg-white/20 hover:border-white font-bold text-lg px-8 py-4 rounded-xl backdrop-blur-sm"
                        >
                            <Link to={createPageUrl("PlanoInternacional")}>
                                <Globe className="w-5 h-5 mr-2" />
                                Plano Internacional
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}