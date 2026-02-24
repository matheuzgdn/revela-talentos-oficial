import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Seletiva } from '@/entities/Seletiva';
import { toast } from 'sonner';
import { Loader2, CheckCircle, User as UserIcon, Activity, Video, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AthleteRegistrationModal({ isOpen, onClose, user, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Dados pessoais
    full_name: user?.full_name || '',
    birth_date: '',
    phone: user?.phone || '',
    nationality: 'Brasileira',
    city: '',
    state: '',
    
    // Dados do responsável (se menor)
    responsible_full_name: '',
    responsible_phone: '',
    responsible_email: '',
    responsible_relation: '',
    
    // Dados físicos
    height: '',
    weight: '',
    preferred_foot: '',
    
    // Dados profissionais
    position: '',
    club: '',
    playing_style: '',
    career_objectives: '',
    strengths: '',
    areas_improvement: '',
    
    // Vídeo (APENAS LINK)
    video_url: '',
    
    // LGPD
    lgpd_consent: false
  });

  const totalSteps = 4;

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const isMinor = () => {
    const age = calculateAge(formData.birth_date);
    return age !== null && age < 18;
  };

  const handleSubmit = async () => {
    if (!formData.lgpd_consent) {
      toast.error('Você precisa aceitar os termos de uso e política de privacidade');
      return;
    }

    if (!formData.video_url) {
      toast.error('Por favor, adicione o link do seu vídeo');
      return;
    }

    setIsSubmitting(true);
    try {
      const age = calculateAge(formData.birth_date);
      
      // Atualizar dados do usuário
      await base44.auth.updateMe({
        phone: formData.phone,
        birth_date: formData.birth_date,
        age: age,
        nationality: formData.nationality,
        city: formData.city,
        state: formData.state,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        preferred_foot: formData.preferred_foot,
        position: formData.position,
        club: formData.club,
        playing_style: formData.playing_style,
        career_objectives: formData.career_objectives,
        strengths: formData.strengths ? formData.strengths.split(',').map(s => s.trim()) : [],
        areas_improvement: formData.areas_improvement ? formData.areas_improvement.split(',').map(s => s.trim()) : [],
        onboarding_completed: true,
        responsible_full_name: isMinor() ? formData.responsible_full_name : null,
        responsible_phone: isMinor() ? formData.responsible_phone : null,
        responsible_email: isMinor() ? formData.responsible_email : null,
        responsible_relation: isMinor() ? formData.responsible_relation : null,
      });

      // Criar registro na Seletiva
      await Seletiva.create({
        user_id: user.id,
        full_name: formData.full_name,
        birth_date: formData.birth_date,
        position: formData.position,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        preferred_foot: formData.preferred_foot,
        video_url_game: formData.video_url,
        self_assessment: `${formData.playing_style}\n\nObjetivos: ${formData.career_objectives}`,
        nationality: formData.nationality,
        city: formData.city,
        state: formData.state,
        current_club: formData.club,
        career_objectives: formData.career_objectives,
        playing_style: formData.playing_style,
        strengths: formData.strengths ? formData.strengths.split(',').map(s => s.trim()) : [],
        areas_improvement: formData.areas_improvement ? formData.areas_improvement.split(',').map(s => s.trim()) : [],
        status: 'pending_review',
        lgpd_consent: true,
        responsible_full_name: isMinor() ? formData.responsible_full_name : null,
        responsible_phone: isMinor() ? formData.responsible_phone : null,
        responsible_email: isMinor() ? formData.responsible_email : null,
        responsible_relation: isMinor() ? formData.responsible_relation : null,
      });

      toast.success('Cadastro completado com sucesso! Agora você pode acessar todo o conteúdo.');
      onComplete();
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Erro ao completar cadastro. Tente novamente.');
    }
    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Dados Pessoais</h3>
                <p className="text-sm text-gray-400">Informações básicas sobre você</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Nome Completo *</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>

              <div>
                <Label>Data de Nascimento *</Label>
                <Input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>

              <div>
                <Label>Telefone/WhatsApp *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="(11) 99999-9999"
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>

              <div>
                <Label>Cidade *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>

              <div>
                <Label>Estado *</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  placeholder="SP"
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>
            </div>

            {isMinor() && (
              <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                <p className="text-amber-400 font-semibold mb-4">Dados do Responsável (Menor de 18 anos)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Nome do Responsável *</Label>
                    <Input
                      value={formData.responsible_full_name}
                      onChange={(e) => setFormData({...formData, responsible_full_name: e.target.value})}
                      className="bg-gray-800 border-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <Label>Telefone do Responsável *</Label>
                    <Input
                      value={formData.responsible_phone}
                      onChange={(e) => setFormData({...formData, responsible_phone: e.target.value})}
                      className="bg-gray-800 border-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <Label>Email do Responsável *</Label>
                    <Input
                      type="email"
                      value={formData.responsible_email}
                      onChange={(e) => setFormData({...formData, responsible_email: e.target.value})}
                      className="bg-gray-800 border-gray-700"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Relação *</Label>
                    <Select value={formData.responsible_relation} onValueChange={(v) => setFormData({...formData, responsible_relation: v})}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pai">Pai</SelectItem>
                        <SelectItem value="mae">Mãe</SelectItem>
                        <SelectItem value="tutor_legal">Tutor Legal</SelectItem>
                        <SelectItem value="agente">Agente</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Dados Físicos</h3>
                <p className="text-sm text-gray-400">Informações sobre seu físico</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Altura (cm) *</Label>
                <Input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  placeholder="175"
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>

              <div>
                <Label>Peso (kg) *</Label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  placeholder="70"
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>

              <div>
                <Label>Pé Preferido *</Label>
                <Select value={formData.preferred_foot} onValueChange={(v) => setFormData({...formData, preferred_foot: v})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direito">Direito</SelectItem>
                    <SelectItem value="esquerdo">Esquerdo</SelectItem>
                    <SelectItem value="ambidestro">Ambidestro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-violet-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Dados Profissionais</h3>
                <p className="text-sm text-gray-400">Sua carreira no futebol</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Posição *</Label>
                <Select value={formData.position} onValueChange={(v) => setFormData({...formData, position: v})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goleiro">Goleiro</SelectItem>
                    <SelectItem value="zagueiro">Zagueiro</SelectItem>
                    <SelectItem value="lateral">Lateral</SelectItem>
                    <SelectItem value="meio-campo">Meio-Campo</SelectItem>
                    <SelectItem value="atacante">Atacante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Clube Atual</Label>
                <Input
                  value={formData.club}
                  onChange={(e) => setFormData({...formData, club: e.target.value})}
                  placeholder="Ex: Santos FC"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="col-span-2">
                <Label>Estilo de Jogo</Label>
                <Textarea
                  value={formData.playing_style}
                  onChange={(e) => setFormData({...formData, playing_style: e.target.value})}
                  placeholder="Descreva seu estilo de jogo..."
                  className="bg-gray-800 border-gray-700"
                  rows={3}
                />
              </div>

              <div className="col-span-2">
                <Label>Objetivos de Carreira *</Label>
                <Textarea
                  value={formData.career_objectives}
                  onChange={(e) => setFormData({...formData, career_objectives: e.target.value})}
                  placeholder="Quais são seus objetivos no futebol?"
                  className="bg-gray-800 border-gray-700"
                  rows={3}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label>Pontos Fortes (separados por vírgula)</Label>
                <Input
                  value={formData.strengths}
                  onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                  placeholder="Ex: Velocidade, Finalização, Passe longo"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="col-span-2">
                <Label>Áreas para Melhoria (separados por vírgula)</Label>
                <Input
                  value={formData.areas_improvement}
                  onChange={(e) => setFormData({...formData, areas_improvement: e.target.value})}
                  placeholder="Ex: Marcação, Jogo aéreo"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-500 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Link do Vídeo</h3>
                <p className="text-sm text-gray-400">Envie um vídeo mostrando suas habilidades</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-2 border-blue-500/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Video className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-400 text-sm font-semibold mb-1">📹 Cole o link do seu vídeo</p>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Envie seu vídeo para <strong>YouTube</strong>, <strong>Google Drive</strong>, <strong>Vimeo</strong> ou <strong>WeTransfer</strong> e cole o link abaixo.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-white">Link do Vídeo *</Label>
              <Input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                placeholder="https://youtube.com/watch?v=... ou https://drive.google.com/..."
                className="bg-gray-800 border-gray-700 text-white mt-2"
                required
              />
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Envie um vídeo de jogo completo ou melhores momentos
              </p>
            </div>

            {formData.video_url && (
              <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-green-400 font-semibold text-sm">✅ Link adicionado com sucesso!</p>
                  <p className="text-gray-400 text-xs truncate">{formData.video_url}</p>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.lgpd_consent}
                  onChange={(e) => setFormData({...formData, lgpd_consent: e.target.checked})}
                  className="mt-1"
                  required
                />
                <span className="text-sm text-gray-300">
                  Aceito os <a href="#" className="text-cyan-400 underline">Termos de Uso</a> e a <a href="#" className="text-cyan-400 underline">Política de Privacidade</a> da EC10 Talentos. Autorizo o uso dos meus dados para análise e gestão de carreira. *
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete seu Cadastro</DialogTitle>
          <p className="text-gray-400">Para acessar todo o conteúdo do Revela Talentos, precisamos conhecer você melhor</p>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > step ? 'bg-cyan-500' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <Badge variant="outline" className="mb-2">Etapa {currentStep} de {totalSteps}</Badge>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            disabled={isSubmitting}
          >
            {currentStep === 1 ? 'Cancelar' : 'Voltar'}
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              Próximo
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.video_url || !formData.lgpd_consent}
              className="bg-gradient-to-r from-green-500 to-emerald-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finalizar Cadastro
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}