import React, { useState, useEffect } from 'react';
import { Play, Star, Trophy, Users, Calendar, Shield, CheckCircle2, ArrowRight, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RevelaTalentosLanding({ onLoginClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
  {
    image: "https://static.wixstatic.com/media/933cdd_37e193eaf78c4effa281baf627db484e~mv2.png",
    title: "Transforme seu Sonho em",
    highlight: "Carreira Profissional"
  },
  {
    image: "https://static.wixstatic.com/media/933cdd_ecfad5b2dac24944890ddefa3b4481fc~mv2.png",
    title: "Mentorias com",
    highlight: "Profissionais de Elite"
  }];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const benefits = [
  { icon: Star, title: "Mentorias Exclusivas", description: "Aulas técnicas com profissionais do futebol brasileiro e internacional" },
  { icon: Trophy, title: "Seletivas Reais", description: "Processos seletivos com clubes parceiros e olheiros profissionais" },
  { icon: Target, title: "Análise de Performance", description: "Feedback detalhado sobre seu jogo com análises técnicas" },
  { icon: Users, title: "Comunidade Ativa", description: "Conecte-se com outros atletas e construa sua rede" },
  { icon: Calendar, title: "Cronograma Estruturado", description: "Plano organizado para maximizar seu desenvolvimento" },
  { icon: Shield, title: "Suporte Contínuo", description: "Acesso direto à equipe de especialistas" }];


  const successCases = [
  "https://i.imgur.com/WFU9u8X.jpeg",
  "https://i.imgur.com/UFwuE2e.jpeg",
  "https://i.imgur.com/pB5eDQr.png",
  "https://i.imgur.com/qPtM2rv.png",
  "https://i.imgur.com/QcIhkkT.jpeg",
  "https://i.imgur.com/uZN1u2Q.jpeg"];


  const features = [
  "Acesso a biblioteca de mentorias",
  "Material técnico em PDF",
  "Participação em seletivas",
  "Lives exclusivas semanais",
  "Mentoria individual mensal",
  "Análise de vídeos",
  "Suporte prioritário via WhatsApp"];


  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) =>
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'}`}>
              <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10" />
            </div>
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black mb-8 text-sm px-6 py-2.5 shadow-2xl shadow-cyan-500/50 border border-cyan-300/50">
            <Sparkles className="w-4 h-4 mr-2" />
            Plataforma #1 de Desenvolvimento
          </Badge>

          <h1 className="mb-8 text-4xl sm:text-5xl md:text-7xl font-black text-center leading-tight drop-shadow-2xl">
            {slides[currentSlide].title}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {slides[currentSlide].highlight}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Mentorias exclusivas. Seletivas reais. Oportunidades que mudam vidas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Button
              onClick={onLoginClick}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-12 py-7 rounded-xl text-xl shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all border border-cyan-300">
              <Play className="w-6 h-6 mr-2" />
              Entrar com Google
            </Button>

            <a
              href="https://www.ec10talentos.com/pricing-plans/checkout?destination=%2Frevela-talentos&referral=restricted-page&referralId=pm8nu&thankYouTitle=Obrigado+pelo+seu+pagamento%21&thankYouCTA=Abrir+p%C3%A1gina&planId=221bef3a-9bb9-477a-92e3-6411cf129ee2&checkoutFlowId=fef63306-7d3c-4e7b-9df0-d1afec6aecdd"
              target="_blank"
              rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline" className="bg-slate-900 px-16 text-xl font-bold rounded-xl inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-11 w-full sm:w-auto border-2 border-cyan-500/50 hover:bg-cyan-500/10 hover:border-cyan-400/60 transition-all">

                Comprar Acesso
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </a>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {slides.map((_, index) =>
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ?
              'w-12 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50' :
              'w-8 bg-white/30 hover:bg-white/50'}`} />
            )}
          </div>
        </div>
      </section>

      {/* O que é o Revela Talentos */}
      <section className="py-24 px-4 relative bg-gradient-to-b from-black to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Badge className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-6 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Sobre a Plataforma
              </Badge>

              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                O que é o <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Revela Talentos?</span>
              </h2>

              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Uma plataforma completa de desenvolvimento e captação de atletas. Oferecemos mentorias técnicas, conteúdo educacional exclusivo e oportunidades reais em seletivas para clubes.
              </p>

              <div className="space-y-4 mb-8">
                {[
                "Conteúdo técnico de alta qualidade",
                "Processos seletivos com clubes parceiros",
                "Análises de performance personalizadas",
                "Comunidade ativa de atletas"].map((item, i) =>
                <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-gray-200">{item}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={onLoginClick}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-8 py-6 rounded-xl text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all border border-cyan-300">
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl rounded-full" />
              <img
                src="https://static.wixstatic.com/media/933cdd_ecfad5b2dac24944890ddefa3b4481fc~mv2.png"
                alt="Revela Talentos"
                className="relative rounded-2xl shadow-2xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-950 via-black to-gray-950 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_65%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Por que escolher o <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Revela Talentos?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Tudo que você precisa para se destacar no futebol profissional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) =>
            <Card key={idx} className="bg-gray-900/50 backdrop-blur-sm border-cyan-500/20 p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20 hover:scale-105 group">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-6 border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all">
                  <benefit.icon className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Histórias de Sucesso */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Histórias de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Sucesso</span>
            </h2>
            <p className="text-xl text-gray-400">
              Atletas que confiaram no Revela Talentos e conquistaram oportunidades reais
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {successCases.map((photo, idx) =>
            <div key={idx} className="relative aspect-[2/3] rounded-xl overflow-hidden border border-cyan-500/20 hover:border-cyan-500/50 transition-all">
                <img src={photo} alt={`Atleta ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={onLoginClick}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-12 py-6 rounded-xl text-xl">

              Quero Ser o Próximo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Plano */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-950 to-black relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Uma <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Oportunidade Única</span>
            </h2>
          </div>

          <Card className="bg-gray-900/50 text-card-foreground px-4 py-12 rounded-2xl backdrop-blur-sm shadow-2xl border-2 border-cyan-500 relative overflow-hidden hover:shadow-cyan-500/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 pointer-events-none" />
            <div className="my-10 pb-2 px-1 py-1 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-gradient-to-r text-black mt-1 mb-2 text-xs font-semibold rounded-full inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/80 from-yellow-400 to-amber-500 shadow-2xl shadow-yellow-500/50 border border-yellow-300">
                <Star className="w-4 h-4 mr-2" />
                OFERTA POR TEMPO LIMITADO
              </Badge>
            </div>

            <div className="text-center mb-8 mt-4">
              <h3 className="text-3xl font-bold mb-4 text-white">Acesso Completo Revela Talentos</h3>
              <div className="mb-2">
                <span className="text-2xl text-gray-500 line-through">De R$ 1.250,00</span>
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-6xl font-black text-cyan-400">R$ 297,00</span>
              </div>
              <span className="text-base text-gray-300">ou em até 12x de R$ 30,00/mês</span>
            </div>

            <div className="grid md:grid-cols-2 gap-2 mb-8">
              {features.map((feature, i) =>
              <div key={i} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative">
              <Button
                onClick={onLoginClick}
                size="lg"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold py-6 rounded-xl text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all border border-cyan-300">
                Entrar com Google
              </Button>

              <a
                href="https://www.ec10talentos.com/pricing-plans/checkout?destination=%2Frevela-talentos&referral=restricted-page&referralId=pm8nu&thankYouTitle=Obrigado+pelo+seu+pagamento%21&thankYouCTA=Abrir+p%C3%A1gina&planId=221bef3a-9bb9-477a-92e3-6411cf129ee2&checkoutFlowId=fef63306-7d3c-4e7b-9df0-d1afec6aecdd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-cyan-500 hover:bg-cyan-500/10 py-6 rounded-xl text-lg font-bold hover:border-cyan-400/60 transition-all">
                  Comprar Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-gray-950 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Pronto para <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">começar?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Junte-se a centenas de atletas que estão transformando sonhos em realidade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onLoginClick}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-12 py-7 rounded-xl text-xl shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all border border-cyan-300">
              Inscrever-se Agora
            </Button>
            
            <a
              href="https://wa.me/351914945252?text=Olá!%20Vi%20sobre%20o%20Revela%20Talentos%20e%20queria%20entender%20melhor"
              target="_blank"
              rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-green-500 hover:bg-green-500/10 px-8 py-7 rounded-xl text-xl font-bold hover:border-green-400 transition-all bg-green-950/20">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.626-2.957 6.584-6.591 6.584zM11.832 9.923c-.197-.1-.99-.487-1.143-.543-.152-.056-.262-.087-.372.087-.11.174-.431.543-.529.653-.098.11-.196.125-.344.043a4.863 4.863 0 0 1-1.546-.96c-.197-.174-.332-.39-.465-.612-.133-.223-.142-.344.043-.464.174-.119.39-.323.588-.488.087-.07.152-.152.223-.262.07-.11.014-.223-.043-.332-.056-.11-.487-1.17-.666-1.606-.174-.422-.344-.367-.465-.367-.11-.007-.247-.007-.372-.007s-.344.043-.529.223c-.185.18-.693.68-.693 1.656 0 .974.71 1.916.81 2.064.098.152 1.397 2.136 3.39 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.087.38-.043 1.17-.487 1.325-1.011s.152-.99.11-.1011c-.043-.014-.152-.056-.344-.1z" />
                </svg>
                Falar no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm mb-2">
            © {new Date().getFullYear()} EC10 Talentos - Todos os direitos reservados
          </p>
          <p className="text-gray-600 text-xs">CNPJ: 54.433.892/0001-43</p>
        </div>
      </footer>

      {/* WhatsApp Flutuante */}
      <a
        href="https://wa.me/351914945252?text=Olá!%20Vi%20sobre%20o%20Revela%20Talentos"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110">

        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.626-2.957 6.584-6.591 6.584zM11.832 9.923c-.197-.1-.99-.487-1.143-.543-.152-.056-.262-.087-.372.087-.11.174-.431.543-.529.653-.098.11-.196.125-.344.043a4.863 4.863 0 0 1-1.546-.96c-.197-.174-.332-.39-.465-.612-.133-.223-.142-.344.043-.464.174-.119.39-.323.588-.488.087-.07.152-.152.223-.262.07-.11.014-.223-.043-.332-.056-.11-.487-1.17-.666-1.606-.174-.422-.344-.367-.465-.367-.11-.007-.247-.007-.372-.007s-.344.043-.529.223c-.185.18-.693.68-.693 1.656 0 .974.71 1.916.81 2.064.098.152 1.397 2.136 3.39 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.087.38-.043 1.17-.487 1.325-1.011s.152-.99.11-.1011c-.043-.014-.152-.056-.344-.1z" />
        </svg>
      </a>
    </div>);

}