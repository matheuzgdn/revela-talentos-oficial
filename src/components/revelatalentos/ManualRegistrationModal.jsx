
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { appClient } from '@/api/backendClient';
import { toast } from 'sonner';
import { Loader2, CheckCircle, User as UserIcon, Activity, Video, Trophy, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ManualRegistrationModal({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  const [existingUser, setExistingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    // ETAPA 1: Criação de Conta (só se não estiver logado)
    email: '',
    password: '',
    confirm_password: '',
    
    // ETAPA 2: Dados pessoais
    full_name: '',
    birth_date: '',
    phone: '',
    nationality: 'Brasileira',
    city: '',
    state: '',
    
    // Dados do responsável (se menor)
    responsible_full_name: '',
    responsible_phone: '',
    responsible_email: '',
    responsible_relation: '',
    
    // ETAPA 3: Dados físicos e profissionais
    height: '',
    weight: '',
    preferred_foot: '',
    position: '',
    club: '',
    playing_style: '',
    career_objectives: '',
    strengths: '',
    areas_improvement: '',
    
    // ETAPA 4: Vídeo
    video_url: '',
    
    // LGPD
    lgpd_consent: false
  });

  // Verificar se já está logado ao abrir o modal
  useEffect(() => {
    const checkIfLoggedIn = async () => {
      if (isOpen) {
        try {
          const currentUser = await appClient.auth.me();
          if (currentUser) {
            setIsAlreadyLoggedIn(true);
            setExistingUser(currentUser);
            
            // Preencher dados já existentes
            setFormData(prev => ({
              ...prev,
              email: currentUser.email || '',
              full_name: currentUser.full_name || '',
              phone: currentUser.phone || '',
              birth_date: currentUser.birth_date ? new Date(currentUser.birth_date).toISOString().split('T')[0] : '', // Format date for input type="date"
              city: currentUser.city || '',
              state: currentUser.state || '',
              nationality: currentUser.nationality || 'Brasileira',
              height: currentUser.height || '',
              weight: currentUser.weight || '',
              preferred_foot: currentUser.preferred_foot || '',
              position: currentUser.position || '',
              club: currentUser.club || '',
            }));
            
            // Pular para etapa 2 (dados pessoais)
            setCurrentStep(2);
          } else {
            setIsAlreadyLoggedIn(false);
            setExistingUser(null);
            setCurrentStep(1); // Ensure it starts at step 1 if not logged in
          }
        } catch (error) {
          // If appClient.auth.me() fails (e.g., no token, expired token), treat as not logged in
          console.log("Not logged in or session expired:", error.message);
          setIsAlreadyLoggedIn(false);
          setExistingUser(null);
          setCurrentStep(1); // Ensure it starts at step 1 if not logged in
        }
      } else {
        // Reset state when modal closes
        setCurrentStep(1);
        setIsSubmitting(false);
        setIsAlreadyLoggedIn(false);
        setExistingUser(null);
        setFormData({
          // Reset all fields for next open
          email: '', password: '', confirm_password: '',
          full_name: '', birth_date: '', phone: '', nationality: 'Brasileira', city: '', state: '',
          responsible_full_name: '', responsible_phone: '', responsible_email: '', responsible_relation: '',
          height: '', weight: '', preferred_foot: '', position: '', club: '', playing_style: '', career_objectives: '', strengths: '', areas_improvement: '',
          video_url: '',
          lgpd_consent: false
        });
      }
    };
    
    checkIfLoggedIn();
  }, [isOpen]);

  const totalSteps = isAlreadyLoggedIn ? 3 : 4; // If already logged in, skip step 1. Visual steps 1,2,3 instead of 1,2,3,4.

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

  const validateStep = () => {
    // If already logged in, step 1 is visually skipped. If currentStep is 1 internally, allow progression to 2.
    if (isAlreadyLoggedIn && currentStep === 1) {
      return true;
    }
    
    switch (currentStep) {
      case 1:
        // This case is only relevant if not already logged in
        if (!isAlreadyLoggedIn) {
          if (!formData.email || !formData.password || !formData.confirm_password) {
            toast.error('Preencha todos os campos obrigatórios');
            return false;
          }
          if (formData.password !== formData.confirm_password) {
            toast.error('As senhas não coincidem');
            return false;
          }
          if (formData.password.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres');
            return false;
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
            toast.error('Digite um email válido');
            return false;
          }
        }
        return true;
        
      case 2:
        if (!formData.full_name || !formData.birth_date || !formData.phone || !formData.city || !formData.state) {
          toast.error('Preencha todos os campos obrigatórios');
          return false;
        }
        if (isMinor()) {
          if (!formData.responsible_full_name || !formData.responsible_phone || !formData.responsible_email || !formData.responsible_relation) {
            toast.error('Preencha os dados do responsável (você é menor de 18 anos)');
            return false;
          }
        }
        return true;
        
      case 3:
        if (!formData.height || !formData.weight || !formData.preferred_foot || !formData.position) {
          toast.error('Preencha todos os campos obrigatórios');
          return false;
        }
        return true;
        
      case 4:
        if (!formData.video_url) {
          toast.error('Por favor, adicione o link do seu vídeo');
          return false;
        }
        if (!formData.lgpd_consent) {
          toast.error('Você precisa aceitar os termos de uso e política de privacidade');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      const age = calculateAge(formData.birth_date);
      let currentUser = existingUser; // Start with existing user if available
      
      // PASSO 1: Criar conta APENAS se não estiver logado
      if (!isAlreadyLoggedIn) {
        try {
          // Tenta criar nova conta
          await appClient.auth.signup({
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name
          });
          
          // Aguarda um pouco para garantir que o signup foi concluído
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Faz login automático
          await appClient.auth.login(formData.email, formData.password);
          
          // Aguarda um pouco para garantir que o login foi concluído
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          currentUser = await appClient.auth.me();
        } catch (signupError) {
          // Se o erro for de email já existente, tenta fazer login
          if (signupError.message?.includes('already') || signupError.message?.includes('exists')) {
            try {
              await appClient.auth.login(formData.email, formData.password);
              await new Promise(resolve => setTimeout(resolve, 1000));
              currentUser = await appClient.auth.me();
            } catch (loginError) {
              throw new Error('Email já cadastrado com senha diferente. Use a senha correta ou outro email.');
            }
          } else {
            throw signupError;
          }
        }
      }
      
      if (!currentUser) {
        throw new Error('Erro ao processar cadastro. Tente novamente.');
      }
      
      // PASSO 2: Atualizar dados completos do usuário
      await appClient.auth.updateMe({
        full_name: formData.full_name,
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
        has_revela_talentos_access: true,
        responsible_full_name: isMinor() ? formData.responsible_full_name : null,
        responsible_phone: isMinor() ? formData.responsible_phone : null,
        responsible_email: isMinor() ? formData.responsible_email : null,
        responsible_relation: isMinor() ? formData.responsible_relation : null,
      });

      // PASSO 3: Criar registro na Seletiva
      await appClient.entities.Seletiva.create({ // Corrected entity access
        user_id: currentUser.id,
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

      toast.success(isAlreadyLoggedIn 
        ? 'Cadastro completado! Sua inscrição na seletiva foi enviada.' 
        : 'Cadastro completado! Você já está logado e pode acessar todo o conteúdo.');
      
      // Recarrega a página para atualizar o estado
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      onComplete();
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error(error.message || 'Erro ao completar cadastro. Tente novamente.');
    }
    setIsSubmitting(false);
  };

  // Helper to get the displayed step number
  const getDisplayedStepNumber = (internalStep) => {
    if (isAlreadyLoggedIn) {
      // If logged in, internal step 2 is displayed as 1, 3 as 2, 4 as 3.
      return internalStep - 1;
    }
    // If not logged in, internal step 1 is displayed as 1, 2 as 2, etc.
    return internalStep;
  };

  const renderStep = () => {
    // If already logged in, step 1 is skipped visually
    if (isAlreadyLoggedIn && currentStep === 1) {
      return null;
    }
    
    switch (currentStep) {
      case 1:
        // This case should only render if not already logged in
        if (isAlreadyLoggedIn) return null;
        
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Criar Sua Conta</h3>
                <p className="text-sm text-gray-400">Email e senha para acessar a plataforma</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="seu@email.com"
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>

              <div>
                <Label>Senha *</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Mínimo 6 caracteres"
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>

              <div>
                <Label>Confirmar Senha *</Label>
                <Input
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                  placeholder="Digite a senha novamente"
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>

              <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-sm">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Use este email e senha para fazer login depois
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
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

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Dados Físicos e Profissionais</h3>
                <p className="text-sm text-gray-400">Sobre você como atleta</p>
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

              <div className="col-span-2">
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

              <div className="col-span-1">
                <Label>Clube Atual</Label>
                <Input
                  value={formData.club}
                  onChange={(e) => setFormData({...formData, club: e.target.value})}
                  placeholder="Ex: Santos FC"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="col-span-3">
                <Label>Estilo de Jogo</Label>
                <Textarea
                  value={formData.playing_style}
                  onChange={(e) => setFormData({...formData, playing_style: e.target.value})}
                  placeholder="Descreva seu estilo de jogo..."
                  className="bg-gray-800 border-gray-700"
                  rows={2}
                />
              </div>

              <div className="col-span-3">
                <Label>Objetivos de Carreira</Label>
                <Textarea
                  value={formData.career_objectives}
                  onChange={(e) => setFormData({...formData, career_objectives: e.target.value})}
                  placeholder="Quais são seus objetivos no futebol?"
                  className="bg-gray-800 border-gray-700"
                  rows={2}
                />
              </div>

              <div className="col-span-3">
                <Label>Pontos Fortes (separados por vírgula)</Label>
                <Input
                  value={formData.strengths}
                  onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                  placeholder="Ex: Velocidade, Finalização, Passe longo"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="col-span-3">
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
                <p className="text-sm text-gray-400">Mostre suas habilidades em campo</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-2 border-blue-500/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Video className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-400 text-sm font-semibold mb-1">Cole o link do seu vídeo</p>
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
                  <p className="text-green-400 font-semibold text-sm">Link adicionado com sucesso!</p>
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
          <DialogTitle className="text-2xl">
            {isAlreadyLoggedIn ? 'Completar Inscrição na Seletiva' : 'Criar Conta e Completar Cadastro'}
          </DialogTitle>
          <p className="text-gray-400">
            {isAlreadyLoggedIn 
              ? 'Complete seus dados para participar da Seletiva EC10' 
              : 'Crie sua conta na EC10 Talentos e participe da Seletiva'}
          </p>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[...Array(totalSteps)].map((_, index) => {
            const stepNum = index + 1; // This is the displayed step number (1, 2, 3 or 1, 2, 3, 4)
            // actualStep refers to the original internal step numbers (1, 2, 3, 4)
            const actualStep = isAlreadyLoggedIn ? stepNum + 1 : stepNum;
            
            return (
              <div key={stepNum} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= actualStep 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {stepNum}
                </div>
                {stepNum < totalSteps && ( // Only show connecting line if it's not the last displayed step
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > actualStep ? 'bg-cyan-500' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="mb-6">
          <Badge variant="outline" className="mb-2">
            Etapa {getDisplayedStepNumber(currentStep)} de {totalSteps}
          </Badge>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // If already logged in, the first *actual* step displayed is 2 (internal). So, if currentStep is 2, it's like step 1.
              // If not logged in, the first *actual* step displayed is 1 (internal).
              const firstDisplayableInternalStep = isAlreadyLoggedIn ? 2 : 1;
              if (currentStep > firstDisplayableInternalStep) {
                setCurrentStep(currentStep - 1);
              } else {
                onClose();
              }
            }}
            disabled={isSubmitting}
          >
            {currentStep === (isAlreadyLoggedIn ? 2 : 1) ? 'Cancelar' : 'Voltar'}
          </Button>

          {/* The submit button is shown on the *last internal step*, which is always 4 */}
          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
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
                  {isAlreadyLoggedIn ? 'Enviando inscrição...' : 'Criando conta...'}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isAlreadyLoggedIn ? 'Enviar Inscrição' : 'Criar Conta e Participar'}
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

