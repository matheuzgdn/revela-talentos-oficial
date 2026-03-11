import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Mail, UserPlus, Loader2, CheckCircle2, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateMemberUserModal({ open, onOpenChange, onInvited }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal is opened/closed
  React.useEffect(() => {
    if (open) {
      setEmail("");
      setFullName("");
      setInviteMessage("");
      setGeneratedCode("");
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
      // 1. Generate a temporary password
      const code = Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map(n => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[n % 62])
        .join("");

      setGeneratedCode(code);

      // 2. Format the message for the email body
      const zonaLink = 'https://revelatalentos.com/?page=ZonaMembros';
      const msg = `Olá${fullName ? ' ' + fullName : ''}!\n\nExcelente notícia! Seu acesso exclusivo à Zona de Membros da EC10 Talentos foi liberado.\nPara simplificar seu acesso, já criamos a sua conta e você pode entrar direto.\n\nAcesse a plataforma através do link abaixo:\n🔗 Link de Acesso: ${zonaLink}\n\nSuas credenciais para entrar:\n📧 E-mail: ${email}\n🔑 Senha temporária: ${code}\n\n(Aconselhamos que você altere sua senha após o primeiro acesso no seu perfil).\n\nEstamos felizes em ter você conosco!\nUm abraço,\nEquipe EC10 Talentos`;

      setInviteMessage(msg);

      // 3. Create the user directly
      await base44.entities.User.create({
        email: email.toLowerCase(),
        password: code,
        full_name: fullName || email.split('@')[0],
        has_zona_membros_access: true,
        onboarding_completed: true,
        is_approved: true,
        role: 'user',
        language: 'pt'
      });

      // 4. Show success screen
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
                  O sistema criará a conta do atleta instantaneamente com acesso liberado à Zona de Membros e uma senha gerada.
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="py-4 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 text-center">Conta Criada!</h3>
              <p className="text-sm text-gray-400 text-center mb-6">
                O acesso à Zona de Membros foi ativado para <span className="text-white font-bold">{email}</span>.
              </p>

              <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Senha Gerada:</span>
                  <span className="text-lg font-mono font-bold text-cyan-400 select-all">{generatedCode}</span>
                </div>
                <p className="text-[10px] text-gray-500 line-clamp-2 md:line-clamp-none">
                  O atleta já pode acessar o sistema com o e-mail e esta senha. Envie o convite abaixo para notificá-lo.
                </p>
              </div>

              <div className="w-full space-y-3">
                <Button
                  onClick={handleOpenGmail}
                  className="w-full h-12 bg-white text-black hover:bg-gray-200 font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
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