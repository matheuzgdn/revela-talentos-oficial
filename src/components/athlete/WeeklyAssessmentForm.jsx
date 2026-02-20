import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Target, Activity, Brain, Apple, Moon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";

export default function WeeklyAssessmentForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    had_game: false,
    games_played: 0,
    goals_scored: 0,
    assists: 0,
    minutes_played: 0,
    training_sessions: 0,
    training_quality: "",
    physical_condition: "",
    mental_state: "",
    nutrition_quality: "",
    sleep_hours: 8,
    injuries: "",
    highlights: "",
    challenges: "",
    goals_next_week: ""
  });

  const handleSubmit = async () => {
    try {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      
      await base44.entities.WeeklyAssessment.create({
        user_id: user.id,
        week_start_date: weekStart.toISOString().split('T')[0],
        ...formData
      });

      // Award points
      await base44.auth.updateMe({
        total_points: (user.total_points || 0) + 50
      });

      onSuccess?.();
    } catch (error) {
      console.error("Erro ao enviar assessoria:", error);
    }
  };

  return (
    <div className="bg-[#111111] border border-[#222] rounded-3xl p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#00E5FF] rounded-2xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-black" />
        </div>
        <div>
          <h3 className="text-white text-xl font-black">Assessoria Semanal</h3>
          <p className="text-[#666] text-sm">Como foi sua semana?</p>
        </div>
      </div>

      {/* Game Stats */}
      <Section icon={Target} title="Estatísticas de Jogo">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[#666] text-xs font-bold mb-2 block">Jogos</label>
            <Input
              type="number"
              value={formData.games_played}
              onChange={(e) => setFormData({ ...formData, games_played: parseInt(e.target.value) })}
              className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
            />
          </div>
          <div>
            <label className="text-[#666] text-xs font-bold mb-2 block">Gols</label>
            <Input
              type="number"
              value={formData.goals_scored}
              onChange={(e) => setFormData({ ...formData, goals_scored: parseInt(e.target.value) })}
              className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
            />
          </div>
          <div>
            <label className="text-[#666] text-xs font-bold mb-2 block">Assistências</label>
            <Input
              type="number"
              value={formData.assists}
              onChange={(e) => setFormData({ ...formData, assists: parseInt(e.target.value) })}
              className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
            />
          </div>
          <div>
            <label className="text-[#666] text-xs font-bold mb-2 block">Minutos</label>
            <Input
              type="number"
              value={formData.minutes_played}
              onChange={(e) => setFormData({ ...formData, minutes_played: parseInt(e.target.value) })}
              className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
            />
          </div>
        </div>
      </Section>

      {/* Training */}
      <Section icon={Activity} title="Treinos">
        <div className="space-y-3">
          <div>
            <label className="text-[#666] text-xs font-bold mb-2 block">Treinos Realizados</label>
            <Input
              type="number"
              value={formData.training_sessions}
              onChange={(e) => setFormData({ ...formData, training_sessions: parseInt(e.target.value) })}
              className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
            />
          </div>
          <div>
            <label className="text-[#666] text-xs font-bold mb-2 block">Qualidade dos Treinos</label>
            <Select
              value={formData.training_quality}
              onValueChange={(value) => setFormData({ ...formData, training_quality: value })}
            >
              <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white rounded-xl">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-[#333]">
                <SelectItem value="excellent" className="text-white">Excelente</SelectItem>
                <SelectItem value="good" className="text-white">Boa</SelectItem>
                <SelectItem value="average" className="text-white">Média</SelectItem>
                <SelectItem value="poor" className="text-white">Ruim</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* Physical & Mental */}
      <Section icon={Brain} title="Condição Física e Mental">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[#666] text-xs font-bold mb-2 block">Físico</label>
            <Select
              value={formData.physical_condition}
              onValueChange={(value) => setFormData({ ...formData, physical_condition: value })}
            >
              <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white rounded-xl">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-[#333]">
                <SelectItem value="excellent" className="text-white">Excelente</SelectItem>
                <SelectItem value="good" className="text-white">Bom</SelectItem>
                <SelectItem value="average" className="text-white">Médio</SelectItem>
                <SelectItem value="poor" className="text-white">Ruim</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[#666] text-xs font-bold mb-2 block">Mental</label>
            <Select
              value={formData.mental_state}
              onValueChange={(value) => setFormData({ ...formData, mental_state: value })}
            >
              <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white rounded-xl">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-[#333]">
                <SelectItem value="excellent" className="text-white">Excelente</SelectItem>
                <SelectItem value="good" className="text-white">Bom</SelectItem>
                <SelectItem value="average" className="text-white">Médio</SelectItem>
                <SelectItem value="poor" className="text-white">Ruim</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* Lifestyle */}
      <Section icon={Apple} title="Estilo de Vida">
        <div className="space-y-3">
          <div>
            <label className="text-[#666] text-xs font-bold mb-2 block">Nutrição</label>
            <Select
              value={formData.nutrition_quality}
              onValueChange={(value) => setFormData({ ...formData, nutrition_quality: value })}
            >
              <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white rounded-xl">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-[#333]">
                <SelectItem value="excellent" className="text-white">Excelente</SelectItem>
                <SelectItem value="good" className="text-white">Boa</SelectItem>
                <SelectItem value="average" className="text-white">Média</SelectItem>
                <SelectItem value="poor" className="text-white">Ruim</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[#666] text-xs font-bold mb-2 block flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Horas de Sono (média/noite)
            </label>
            <Input
              type="number"
              step="0.5"
              value={formData.sleep_hours}
              onChange={(e) => setFormData({ ...formData, sleep_hours: parseFloat(e.target.value) })}
              className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
            />
          </div>
        </div>
      </Section>

      {/* Notes */}
      <div className="space-y-3">
        <div>
          <label className="text-[#666] text-xs font-bold mb-2 block">Destaques da Semana</label>
          <Textarea
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            placeholder="O que deu certo?"
            className="bg-[#1a1a1a] border-[#333] text-white rounded-xl min-h-[80px]"
          />
        </div>
        <div>
          <label className="text-[#666] text-xs font-bold mb-2 block">Desafios</label>
          <Textarea
            value={formData.challenges}
            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
            placeholder="Dificuldades encontradas?"
            className="bg-[#1a1a1a] border-[#333] text-white rounded-xl min-h-[80px]"
          />
        </div>
        <div>
          <label className="text-[#666] text-xs font-bold mb-2 block">Metas para Próxima Semana</label>
          <Textarea
            value={formData.goals_next_week}
            onChange={(e) => setFormData({ ...formData, goals_next_week: e.target.value })}
            placeholder="O que você quer alcançar?"
            className="bg-[#1a1a1a] border-[#333] text-white rounded-xl min-h-[80px]"
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full py-6 bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-black text-lg rounded-2xl"
      >
        Enviar Assessoria (+50 pontos)
      </Button>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-[#1a1a1a]/50 border border-[#333] rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-[#00E5FF]" />
        <h4 className="text-white font-bold">{title}</h4>
      </div>
      {children}
    </div>
  );
}