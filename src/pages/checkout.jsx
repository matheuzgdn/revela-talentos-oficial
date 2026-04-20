import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

import jsPDF from 'jspdf';
import {
  CheckCircle,
  Calendar,
  CreditCard,
  User,
  Mail,
  ShieldCheck,
  Download,
  PlayCircle,
  Star,
} from 'lucide-react';

const REVELA_LOGO =
  'https://static.wixstatic.com/media/933cdd_2a46d0206f1149cc87acf3ca1dfc003b~mv2.png/v1/fill/w_537,h_537,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/933cdd_2a46d0206f1149cc87acf3ca1dfc003b~mv2.png';
const EC10_LOGO =
  'https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png';
const VIDEO_BG =
  'https://video.wixstatic.com/video/933cdd_388c6e2a108d49f089ef70033306e785/1080p/mp4/file.mp4';

export default function CheckoutSuccess({
  platformUrlOverride,
  isPending = false,
}) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statusAccentClasses = isPending
    ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
    : 'bg-green-500/20 border-green-500/30 text-green-400';

  const statusTextClasses = isPending ? 'text-yellow-400' : 'text-green-400';

  const clientInfo = {
    name: user?.name || 'Atleta Elite',
    email: user?.email || 'atleta@revelatalentos.com',
    orderId: `RT-${Math.floor(Math.random() * 1000000)}`,
    date: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    plan: 'Plano',
    status: isPending ? 'Acesso Pendente' : 'Acesso Liberado',
    amount: 'R$ 297,00',
  };

  const handleAccessPlatform = () => {
    if (platformUrlOverride) {
      window.location.href = platformUrlOverride;
      return;
    }

    if (user) {
      window.location.href = '/RevelaTalentos';
      return;
    }

    window.location.href = 'https://revelatalentos.com/';
  };

  const downloadReceipt = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 160] });

    doc.setDrawColor(200);
    doc.roundedRect(5, 5, 70, 150, 3, 3);
    doc.setFillColor(0, 229, 255);
    doc.rect(5, 10, 70, 12, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('REVELA TALENTOS', 40, 18, { align: 'center' });

    doc.setTextColor(30);
    doc.setFontSize(11);
    doc.text('RECIBO DE COMPRA', 40, 28, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text(`Pedido: ${clientInfo.orderId}`, 10, 38);
    doc.text(`Data: ${clientInfo.date}`, 10, 44);

    if (doc.setLineDash) {
      doc.setLineDash([1, 1], 0);
    }

    doc.setDrawColor(180);
    doc.line(8, 50, 72, 50);

    if (doc.setLineDash) {
      doc.setLineDash([]);
    }

    doc.setTextColor(120);
    doc.text('Atleta', 10, 58);
    doc.setTextColor(0);
    doc.text(`${clientInfo.name}`, 10, 64, { maxWidth: 60 });

    doc.setTextColor(120);
    doc.text('Email', 10, 72);
    doc.setTextColor(0);
    doc.text(`${clientInfo.email}`, 10, 78, { maxWidth: 60 });

    doc.setTextColor(120);
    doc.text('Plano', 10, 86);
    doc.setTextColor(0);
    doc.text('REVELA TALENTOS', 10, 92);

    doc.setDrawColor(200);
    doc.line(8, 100, 72, 100);

    doc.setFillColor(0, 229, 255);
    doc.roundedRect(10, 106, 60, 14, 3, 3, 'F');
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('VALOR', 40, 112, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`${clientInfo.amount}`, 40, 119, { align: 'center' });

    doc.setTextColor(120);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Ambiente 100% seguro', 40, 136, { align: 'center' });
    doc.text('suporte@revelatalentos.com', 40, 141, { align: 'center' });

    doc.setDrawColor(180);
    doc.setLineWidth(0.2);

    if (doc.setLineDash) {
      doc.setLineDash([1, 1], 0);
    }

    doc.line(8, 148, 72, 148);

    if (doc.setLineDash) {
      doc.setLineDash([]);
    }

    doc.save(`recibo-${clientInfo.orderId}.pdf`);
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src={VIDEO_BG} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-80"></div>

      <div
        className={`relative z-10 w-full max-w-5xl mx-auto px-6 py-12 transition-all duration-1000 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="flex justify-between items-center mb-12">
          <img
            src={REVELA_LOGO}
            alt="Revela Talentos"
            className="h-16 md:h-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 cursor-pointer"
          />
          <img
            src={EC10_LOGO}
            alt="EC10"
            className="h-12 md:h-16 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 cursor-pointer"
          />
        </div>

        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[45deg] animate-[shine_3s_infinite_ease-in-out]"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full border mb-4 animate-[pulse_2s_infinite] ${statusAccentClasses}`}
              >
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4">
                  Sua jornada de <br />
                  <span className="text-yellow-400">Elite</span> começa agora.
                </h1>

                {isPending ? (
                  <div className="text-gray-400 text-lg space-y-3">
                    <p>Boleto gerado com sucesso.</p>
                    <p>
                      Realize o pagamento dentro do prazo para garantir sua participação.
                      Após a compensação bancária, que pode levar de 1 a 3 dias úteis,
                      todos os dados de acesso serão enviados para o e-mail cadastrado.
                    </p>
                    <p>Dê o próximo passo rumo à sua carreira no futebol.</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-lg">
                    Pagamento confirmado com sucesso. Você acaba de dar o primeiro passo
                    para transformar sua carreira no futebol.
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                  onClick={handleAccessPlatform}
                >
                  <PlayCircle className="w-5 h-5" />
                  Acessar Plataforma
                </button>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-inner">
              <div className="flex items-center gap-3 border-b border-white/10 pb-6 mb-6">
                <Star className="text-yellow-400 w-6 h-6" />
                <h3 className="text-xl font-semibold text-white">Resumo da Aquisição</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                      <User className="w-4 h-4" /> Atleta
                    </p>
                    <p className="text-white font-medium truncate">{clientInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                      <Mail className="w-4 h-4" /> Email
                    </p>
                    <p className="text-white font-medium truncate" title={clientInfo.email}>
                      {clientInfo.email.length > 20
                        ? `${clientInfo.email.substring(0, 20)}...`
                        : clientInfo.email}
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Plano
                    </p>
                    <p className="text-gray-400 text-sm mt-1">REVELA TALENTOS</p>
                    <p className="text-white font-medium">VALOR R$ 297,00</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Status
                    </p>
                    <p className={`${statusTextClasses} font-medium`}>
                      {clientInfo.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Data
                    </p>
                    <p className="text-white font-medium">{clientInfo.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                      <CreditCard className="w-4 h-4" /> Valor Total
                    </p>
                    <p className="text-white font-medium">{clientInfo.amount}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-gray-500 text-xs font-mono">
                  ID: {clientInfo.orderId}
                </span>
                <button
                  onClick={downloadReceipt}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm group"
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                  Baixar Recibo
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm font-light">
          Ambiente 100% Seguro. Dúvidas? suporte@revelatalentos.com
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }
      `,
        }}
      />
    </div>
  );
}
