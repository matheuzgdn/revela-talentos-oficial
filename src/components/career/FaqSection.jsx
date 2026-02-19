import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "Como funciona a análise de performance?",
    answer: "Você envia vídeos das suas partidas através da nossa plataforma. Nossa equipe de analistas especializados avalia sua performance técnica e tática, fornecendo feedback detalhado com notas e sugestões de melhoria. O relatório fica disponível na sua área de Análise de Performance."
  },
  {
    question: "Quantos vídeos posso enviar por mês?",
    answer: "No Plano de Carreira, você pode enviar quantos vídeos desejar. Não há limitação mensal. Recomendamos enviar pelo menos um vídeo por semana para acompanhar sua evolução consistentemente."
  },
  {
    question: "Como agendar um jogo na plataforma?",
    answer: "Na aba 'Painel' do seu Plano de Carreira, você encontra o formulário 'Próximo Jogo'. Preencha as informações da partida (adversário, data, local) e nossa equipe ficará ciente para acompanhar sua performance naquele jogo específico."
  },
  {
    question: "Posso conversar diretamente com os especialistas?",
    answer: "Sim! Na aba 'Mensagens' do Plano de Carreira, você tem acesso direto a analistas de performance, preparadores físicos, mentores de carreira e equipe de marketing. Cada especialista tem sua área de expertise."
  },
  {
    question: "Como funciona o Plano Internacional?",
    answer: "Através da nossa rede de scouts e parcerias com clubes europeus, ajudamos atletas talentosos a conseguir oportunidades no exterior. Você preenche um formulário detalhado e nossa equipe avalia seu perfil para possíveis indicações."
  },
  {
    question: "Qual a diferença entre Revela Talentos e Plano de Carreira?",
    answer: "O Revela Talentos foca no desenvolvimento técnico com mentorias em grupo e conteúdos educacionais. Já o Plano de Carreira inclui tudo do Revela Talentos MAIS gestão personalizada de carreira, chat direto com especialistas, análises individuais e acesso a oportunidades exclusivas."
  },
  {
    question: "Como posso acompanhar meu progresso?",
    answer: "Seu progresso é acompanhado através de várias métricas: notas das análises de performance, estatísticas dos jogos, progresso nas mentorias assistidas e feedback dos especialistas. Tudo fica registrado no seu painel principal."
  },
  {
    question: "Posso cancelar minha assinatura quando quiser?",
    answer: "Sim, você pode cancelar sua assinatura a qualquer momento através da área 'Meus Serviços'. O acesso continuará ativo até o final do período pago, sem renovação automática após o cancelamento."
  }
];

export default function FaqSection() {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleItem = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400 text-2xl">
            <HelpCircle className="w-6 h-6" />
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqData.map((faq, index) => {
            const isExpanded = expandedItems.has(index);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-black/30 border-gray-700 hover:border-gray-600 transition-colors">
                  <Button
                    variant="ghost"
                    onClick={() => toggleItem(index)}
                    className="w-full p-4 justify-between text-left hover:bg-gray-800/50 rounded-lg"
                  >
                    <span className="text-white font-medium text-sm md:text-base">
                      {faq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                  
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}