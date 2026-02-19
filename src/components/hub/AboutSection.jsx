import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-black px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
            EC10 Talentos: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Conectando seu talento</span> com o mundo.
          </h2>
          <p className="text-gray-300 text-lg mb-4 leading-relaxed">
            A EC10 Talentos é uma empresa de assessoria esportiva com o foco em descobrir talentos ao redor do mundo, através de uma captação on-line e presencial.
          </p>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Através de nossos intercâmbios e torneios internacionais, milhares de atletas já tiveram a oportunidade exclusiva de jogar ou fazer avaliação em grandes clubes do exterior.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base px-8 py-6 rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
            <Star className="w-5 h-5 mr-2" />
            Descubra Nossos Planos
          </Button>
        </motion.div>

        {/* Image Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="flex justify-center items-center"
        >
          <div className="relative p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-2xl shadow-cyan-500/20">
            <img 
              src="https://static.wixstatic.com/media/933cdd_5e5c1b2b422c450a8fe12c2867b58d11~mv2.png/v1/fill/w_600,h_600,al_c,q_85,enc_avif,quality_auto/933cdd_5e5c1b2b422c450a8fe12c2867b58d11~mv2.png" 
              alt="EC10 Talentos Conectando Talentos"
              className="rounded-xl w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}