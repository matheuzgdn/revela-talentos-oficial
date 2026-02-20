import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompleteProfilePrompt({ user, onComplete }) {
  // Verificar campos obrigatórios faltando
  const missingFields = [];
  
  if (!user.full_name) missingFields.push("Nome completo");
  if (!user.birth_date) missingFields.push("Data de nascimento");
  if (!user.position) missingFields.push("Posição");
  if (!user.height) missingFields.push("Altura");
  if (!user.weight) missingFields.push("Peso");

  if (missingFields.length === 0) return null;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-20 md:top-24 left-4 right-4 md:left-auto md:right-8 md:max-w-sm z-50"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border-2 border-orange-500/50 rounded-3xl p-4 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-orange-500/10 blur-xl" />
        
        <div className="relative z-10">
          <div className="flex items-start gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <AlertCircle className="w-5 h-5 text-orange-400" />
            </motion.div>
            <div className="flex-1">
              <h4 className="text-white font-black text-sm mb-1">Complete seu perfil!</h4>
              <p className="text-gray-300 text-xs">
                Faltam alguns dados importantes para você aproveitar 100% da plataforma
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-xl p-3 mb-3">
            <p className="text-xs text-orange-300 font-bold mb-2">Campos faltando:</p>
            <ul className="space-y-1">
              {missingFields.map((field, idx) => (
                <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                  <div className="w-1 h-1 bg-orange-400 rounded-full" />
                  {field}
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold h-10 rounded-xl shadow-lg"
          >
            Completar agora
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}