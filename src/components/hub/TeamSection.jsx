
import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const founders = [
  { name: 'Eric Cena', role: 'Sócio Fundador & Ex-Atleta', img: 'https://i.imgur.com/3Ldxw7s.png' },
  { name: 'Igor', role: 'Sócio Fundador & Gestor de Eventos', img: 'https://i.imgur.com/sOQSHUk.jpeg' },
  { name: 'Pablo', role: 'Sócio Fundador & Rep. Portugal', img: 'https://i.imgur.com/WuM3320.jpeg' },
  { name: 'Phidelis', role: 'Sócio Fundador & Analista de Desempenho', img: 'https://static.wixstatic.com/media/933cdd_0e4324a6ccca449ab360fc24e56720c5~mv2.png/v1/fill/w_369,h_381,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/933cdd_0e4324a6ccca449ab360fc24e56720c5~mv2.png', video: 'https://player.vimeo.com/video/1099081518' },
];

const team = [
  { name: 'Flavio', role: 'Preparador Físico', img: 'https://static.wixstatic.com/media/933cdd_fcd5d9dce9ad49c3a4ad883966aae7e8~mv2.png/v1/fill/w_296,h_326,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/933cdd_fcd5d9dce9ad49c3a4ad883966aae7e8~mv2.png', video: 'https://player.vimeo.com/video/1099081145' },
  { name: 'Matheus', role: 'Marketing Esportivo', img: 'https://i.imgur.com/6KZBP76.jpeg' },
  { name: 'Léo', role: 'Agente FIFA', img: 'https://i.imgur.com/sU1n8rp.jpeg' },
  { name: 'Reinaldo', role: 'Jurídico', img: 'https://i.imgur.com/Xmv0Hmo.jpeg' }
];

const TeamMemberCard = ({ member, isFounder = false }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <div className="relative w-full h-80 overflow-hidden rounded-xl 
                      bg-gray-900/50 border border-gray-800 
                      hover:border-blue-500/50 transition-colors duration-300 
                      transform group-hover:scale-105 transition-transform duration-300">
        <img src={member.img} alt={member.name} className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {member.video && (
          <a href={member.video} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 z-10 bg-white text-blue-600 rounded-full p-2 transition-transform group-hover:scale-110">
            <PlayCircle className="w-7 h-7" />
          </a>
        )}

        <div className="absolute bottom-0 left-0 p-4 w-full z-10">
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="text-sm text-cyan-300">{member.role}</p>
        </div>
        
        {isFounder && (
          <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold">
            Sócio Fundador
          </Badge>
        )}
      </div>
    </motion.div>
  );
};

export default function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-black px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Sócios Fundadores */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Conheça os Sócios Fundadores</h2>
          <p className="text-lg text-gray-400">Os especialistas que idealizaram o projeto e vão transformar a sua carreira.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20">
          {founders.map(member => <TeamMemberCard key={member.name} member={member} isFounder={true} />)}
        </div>

        {/* Nossa Equipe */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Nossa Equipe</h2>
          <p className="text-lg text-gray-400">Os profissionais dedicados a cada pilar do seu desenvolvimento.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {team.map(member => <TeamMemberCard key={member.name} member={member} />)}
        </div>
      </div>
    </section>
  );
}
