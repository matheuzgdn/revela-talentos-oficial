import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { Mail, UserPlus, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function InviteAthleteModal({ open, onOpenChange, onInvited }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendWelcome, setSendWelcome] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInvite = async () => {
    if (!email) {
      toast.error("Informe o e-mail do atleta");
      return;
    }
    setIsSending(true);
    try {
      await base44.users.inviteUser(email, "user");
      const code = Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map(n => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[n % 62])
        .join("");
      const loginLink = `${window.location.origin}/login?from_url=` + encodeURIComponent(`${window.location.origin}/`);
      const msg = `Olá${fullName ? ' ' + fullName : ''}!\n\nSeu acesso ao EC10 Talentos foi criado.\nAcesse por este link: ${loginLink}\nCódigo temporário: ${code}\nNo primeiro acesso, crie sua própria senha.\n\n— Equipe EC10 Talentos`;
      setGeneratedCode(code);
      setInviteMessage(msg);
      setCopied(false);
      if (sendWelcome) {
        await base44.integrations.Core.SendEmail({
          to: email,
          from_name: 'EC10 Admin',
          subject: 'Bem-vindo ao EC10 Talentos',
          body: msg
        });
      }
      toast.success("Convite enviado! Mensagem gerada para você copiar e enviar.");
      onInvited?.();
    } catch (e) {
      toast.error("Falha ao enviar convite. Verifique o e-mail.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-950 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-400" />
            Cadastrar/Convidar Atleta
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
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
            <Label className="text-gray-400">E-mail do atleta</Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="atleta@email.com"
                className="pl-9 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Um código temporário será gerado abaixo apenas para o texto do e-mail (o atleta criará a própria senha no primeiro acesso).
              <br />
              O atleta receberá um e-mail para criar a senha. Após o primeiro login, ele será direcionado à Zona de Membros.
            </p>
            <div className="flex items-center justify-between mt-3">
              <Label className="text-gray-400">Enviar e-mail de boas-vindas</Label>
              <Switch checked={sendWelcome} onCheckedChange={setSendWelcome} className="data-[state=checked]:bg-cyan-500" />
            </div>
          </div>
        </div>


        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-gray-300 border-gray-700 hover:bg-gray-800">
            Cancelar
          </Button>
          <Button onClick={handleInvite} disabled={isSending} className="bg-cyan-600 hover:bg-cyan-500">
            {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
            Enviar Convite
          </Button>
        </DialogFooter>

        {inviteMessage && (
          <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-300">Mensagem para enviar ao atleta</p>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => { await navigator.clipboard.writeText(inviteMessage); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}
                className="h-8"
              >
                <Copy className="w-4 h-4 mr-1" />
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
            <Textarea readOnly value={inviteMessage} className="min-h-[140px] text-sm" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}