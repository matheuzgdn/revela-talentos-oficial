import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Mail, UserPlus, Loader2, CheckCircle2, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateMemberUserModal({ open, onOpenChange, onInvited }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal is opened/closed
  React.useEffect(() => {
    if (open) {
      setEmail("");
      setFullName("");
      setInviteMessage("");
      setCopied(false);
      setIsSuccess(false);
    }
  }, [open]);

  const handleCreate = async () => {
    if (!email) {
      toast.error("Informe o e-mail do usuário");
      return;
    }
    setIsSending(true);
    try {
      // 1. Silent Registration
      // We create the user. Note that 'password' is not hashed by the entity API, 
      // so they MUST use "Forgot Password" to set it up initially.
      await base44.entities.User.create({
        email: email.toLowerCase(),
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Dummy password
        full_name: fullName || email.split('@')[0],
        has_zona_membros_access: true,
        onboarding_completed: true,
        is_approved: true,
        role: 'user',
        language: 'pt',
        achievements: '',
        career_highlights: '',
        profile_picture_url: '',
        birth_date: '2000-01-01',
        fifa_attributes: {},
        career_stats: {},
        jersey_number: '0',
        height: 0,
        player_cutout_url: '',
        weight: 0,
        current_club_crest_url: '',
        nationality: '',
        position: '',
        current_club_name: ''
      });

      // 2. Format the message for the email body
      const zonaLink = `${window.location.origin}${createPageUrl('ZonaMembros')}`;
      const msg = `Olá${fullName ? ' ' + fullName : ''}!\n\nExcelente notícia! Seu acesso exclusivo à Zona de Membros da EC10 Talentos foi liberado.\nPara simplificar seu processo, já criamos a sua conta em nosso sistema.\n\nComo este é o seu primeiro acesso, você precisa definir a sua senha pessoal.\n\nSiga os passos abaixo:\n1. Acesse a plataforma pelo link: ${zonaLink}\n2. Na tela de Login, clique em "Forgot password?" (Esqueci minha senha).\n3. Insira este seu e-mail (${email}) e você receberá um link/código seguro no seu e-mail para criar a sua senha definitiva.\n\nDepois disso, é só aproveitar o conteúdo!\n\nUm abraço,\nEquipe EC10 Talentos`;

      setInviteMessage(msg);

      // 3. Show success screen
      setIsSuccess(true);
      toast.success('Usuário criado com sucesso e acesso liberado!');
      onInvited?.();

    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("Falha ao criar usuário. Verifique se o e-mail já existe.");
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenGmail = () => {
    const subject = encodeURIComponent("Convite VIP: Seu acesso à Zona de Membros EC10 Talentos");
    const body = encodeURIComponent(inviteMessage);
    const to = encodeURIComponent(email);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-950 border-gray-800 text-white max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-400" />
            Cadastrar Usuário Zona de Membros
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 py-2"
            >
              <div>
                <Label className="text-gray-400">Nome completo (opcional)</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">E-mail</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@email.com"
                    className="pl-9 bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  O sistema criará a conta do atleta instantaneamente com acesso à Zona de Membros. A própria plataforma fará a gestão da redefinição de segurança.
                </p>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="text-gray-300 border-gray-700 hover:bg-gray-800">
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={isSending} className="bg-cyan-600 hover:bg-cyan-500">
                  {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  Cadastrar Atleta
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 flex flex-col items-center text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-cyan-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Usuário Criado!</h3>
                <p className="text-sm text-gray-400">
                  O atleta já está cadastrado no sistema. Agora, mande o e-mail para ele definir a própria senha.
                </p>
              </div>

              <div className="w-full bg-gray-900 rounded-xl p-4 space-y-3 text-left border border-gray-800">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold">E-mail Cadastrado</span>
                  <p className="text-white font-medium">{email}</p>
                </div>
              </div>

              <div className="w-full space-y-3">
                <Button
                  onClick={handleOpenGmail}
                  className="w-full text-base py-6 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Enviar Convite pelo Meu Gmail
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-gray-900 border-gray-700 text-gray-300 hover:text-white"
                    onClick={async () => {
                      await navigator.clipboard.writeText(inviteMessage);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? "Copiado!" : "Copiar Texto"}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 bg-gray-900 border-gray-700 text-gray-300 hover:text-white"
                    onClick={() => {
                      const subject = encodeURIComponent("Convite VIP: Seu acesso à Zona de Membros EC10 Talentos");
                      const body = encodeURIComponent(inviteMessage);
                      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                    }}
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Outro E-mail
                  </Button>
                </div>
              </div>

              <Button variant="ghost" className="w-full mt-4 text-gray-500" onClick={() => onOpenChange(false)}>
                Fechar Janela
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}