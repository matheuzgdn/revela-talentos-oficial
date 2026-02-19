import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Star } from 'lucide-react';

export default function UpgradeToElite() {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
                    <Crown className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Acesso Exclusivo para Atletas de Elite</h1>
                <p className="text-xl text-gray-400 mb-8">
                    O Plano de Carreira é uma ferramenta poderosa disponível apenas para membros do plano Elite. Faça o upgrade para ter acesso a gestão de carreira personalizada, contato direto com especialistas e muito mais.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg px-8 py-6 rounded-xl hover:opacity-90 transition-opacity">
                    <Star className="w-5 h-5 mr-3" />
                    QUERO SER ELITE
                </Button>
            </motion.div>
        </div>
    );
}