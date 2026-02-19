import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

export default function ModernServiceGrid({ services, user }) {
  const canAccess = (service) => {
    if (service.public) return true;
    if (!user) return false;
    return true;
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Acelere sua <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Carreira</span>
          </h2>
          <p className="text-md text-slate-400 max-w-2xl mx-auto">
            Escolha o plano ideal para seu nível e objetivos. Cada serviço foi desenvolvido para maximizar seu potencial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const isAccessible = canAccess(service);
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Card className={`
                  relative h-full border transition-all duration-300
                  bg-gray-900/50 border-gray-800 hover:border-blue-500/60
                  backdrop-blur-sm overflow-hidden
                  hover:shadow-2xl hover:shadow-blue-500/10
                `}>
                  
                  <CardContent className="p-6 relative z-10 h-full flex flex-col">
                    <div className={`w-12 h-12 bg-gradient-to-r ${service.gradient} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <Button asChild className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm">
                        <Link to={createPageUrl(service.route)}>
                          Saber Mais
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}