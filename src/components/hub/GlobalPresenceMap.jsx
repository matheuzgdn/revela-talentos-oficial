import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import InteractiveMap from './InteractiveMap'; // Importando o novo componente de mapa

const COUNTRIES = [
  { name: "Espanha" }, { name: "Portugal" }, { name: "Eslováquia" },
  { name: "Bósnia" }, { name: "Alemanha" }, { name: "Áustria" },
  { name: "Croácia" }, { name: "Argentina" }, { name: "EUA" },
  { name: "Emirados Árabes" }, { name: "China" }, { name: "Itália" },
  { name: "Andorra" }, { name: "Rep. Tcheca" }, { name: "Finlândia" },
  { name: "Suíça" }, { name: "Chile" }
];

export default function GlobalPresenceMap() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-full px-6 py-3 mb-6">
            <Globe className="w-5 h-5 text-cyan-400 mr-2" />
            <span className="text-cyan-400 font-medium">Presença Global</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nossa rede de contatos abre portas
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Estamos presentes nos principais mercados do futebol mundial, criando pontes para a sua carreira internacional.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 relative bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-400/20 rounded-3xl p-4 sm:p-8"
          >
            <div 
              className="h-80 md:h-96 w-full rounded-2xl overflow-hidden"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.2))'
              }}
            >
              <InteractiveMap />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {COUNTRIES.map((country, index) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <div className="bg-gray-800/50 border border-gray-700/60 rounded-full px-4 py-2 text-sm text-gray-300 font-medium whitespace-nowrap backdrop-blur-sm shadow-md">
                  {country.name}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}