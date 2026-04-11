import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, Award, LineChart, Users, Rocket, 
  ChevronDown, ChevronUp, Play, ArrowRight,
  Star, Globe, BookOpen, Shield, Zap, Calendar, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// FAQs adaptadas para os Pais de Atletas
const faqs = [
  {
    q: "O que é a nova parceria da escola com a Revela Talentos?",
    a: "É uma união inovadora onde a escola passa a contar com a metodologia de desenvolvimento humano, esportivo e socioemocional da EC10 Talentos, potencializando o aprendizado e a descoberta das vocações do seu filho dentro e fora das salas de aula."
  },
  {
    q: "Eu preciso pagar algo a mais por isso?",
    a: "Não. Como a instituição do seu filho tornou-se uma Escola Parceira, os acessos básicos às ferramentas educativas e à jornada da Revela Talentos já estão inclusos e estruturados pelo colégio."
  },
  {
    q: "Como será a Live de Lançamento com o Eric Cena?",
    a: "No dia 20/04, Eric Cena, nosso fundador, fará uma apresentação especial explicando todos os pilares da metodologia, os benefícios diretos para sua família e as novas oportunidades que seu filho(a) terá na escola."
  },
  {
    q: "Posso acessar a plataforma para acompanhar meu filho?",
    a: "Com certeza! A plataforma estimula a conexão família-escola, permitindo que os pais acompanhem de perto o engajamento esportivo, as métricas de saúde e o desenvolvimento socioemocional."
  }
];

const benefits = [
  {
    icon: Sparkles,
    title: "Descoberta de Talentos",
    desc: "Ajudamos os atletas a identificarem suas vocações com clareza, gerando autoconfiança e a motivação necessária para o alto rendimento e estudos diários.",
    color: "from-blue-500 to-cyan-400"
  },
  {
    icon: Award,
    title: "Metodologia de Campeões",
    desc: "Acesso a conceitos de excelência utilizados por grandes clubes adaptados inteligentemente ao cotidiano da escola.",
    color: "from-yellow-500 to-orange-400"
  },
  {
    icon: LineChart,
    title: "Acompanhamento 360º",
    desc: "Desenvolvimento pautado nas partes táticas, técnicas, físicas e comportamentais, impulsionando a inteligência emocional do seu filho.",
    color: "from-green-500 to-emerald-400"
  },
  {
    icon: Users,
    title: "Família e Escola Conectadas",
    desc: "Uma comunidade unida, na qual os pais possuem clareza sobre os avanços e podem guiar as decisões de futuro das crianças em conjunto.",
    color: "from-purple-500 to-pink-400"
  },
  {
    icon: Rocket,
    title: "Mente Preparada para Superar",
    desc: "Fortalecimento de foco, disciplina criativa e resiliência cruciais para suportar as transições da adolescência e carreira.",
    color: "from-cyan-500 to-blue-400"
  },
  {
    icon: Globe,
    title: "Oportunidades Reais",
    desc: "Conexão a uma robusta rede de contatos nacional e internacional para que cada jovem voe mais longe.",
    color: "from-red-500 to-rose-400"
  }
];

const steps = [
  {
    num: "01",
    icon: Calendar,
    title: "Live de Lançamento — Dia 20/04",
    desc: "Marque na sua agenda e assista ao evento oficial com Eric Cena. Descubra os detalhes impactantes dessa transformação no ensino."
  },
  {
    num: "02",
    icon: User,
    title: "Recepção dos Acessos",
    desc: "A escola fará a orientação e distribuição das credenciais de acesso para que os estudantes configurem seu perfil na EC10."
  },
  {
    num: "03",
    icon: Shield,
    title: "Acompanhe e Celebre",
    desc: "Veja a evolução através dos novos treinos, mentorias em vídeo, e capacitações presentes no aplicativo."
  }
];

const testimonials = [
  {
    name: "Mãe do Matheus (14 anos)",
    school: "Escola Parceira",
    text: "Meu filho mudou radicalmente de postura em casa e nos estudos. A mentalidade que ele adotou agora é de um verdadeiro atleta nota 10!",
    rating: 5,
    avatar: "M"
  },
  {
    name: "Pai da Sofia (12 anos)",
    school: "Escola Parceira",
    text: "Assistir as explicações sobre a metodologia me deu imensa segurança. Ter essa excelência junto ao colégio é um projeto brilhante.",
    rating: 5,
    avatar: "P"
  },
  {
    name: "Mãe do Lucas (15 anos)",
    school: "Escola Parceira",
    text: "Saber que a escola forma meu filho não somente como aluno, mas prepara o caráter humano pro mundo real, nos dá uma paz tremenda.",
    rating: 5,
    avatar: "M"
  }
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ${open ? 'bg-white/5' : 'bg-white/[0.02]'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left gap-4"
      >
        <span className="text-white font-medium text-lg">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-6 text-gray-300 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function EscolaParceira() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden">

      {/* STICKY HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="Revela Talentos" className="h-10 w-auto" />
          </Link>
          <a href="#como-funciona">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold px-6 rounded-xl shadow-lg shadow-cyan-500/20">
              Sobre a Live
            </Button>
          </a>
        </div>
      </header>

      {/* HERO — VIDEO BACKGROUND (EC10 PRINCIPAL) NETFLIX STYLE */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video BG Oficial EC10 */}
        <div className="absolute inset-0 z-0">
          <video
            src="https://video.wixstatic.com/video/933cdd_388c6e2a108d49f089ef70033306e785/1080p/mp4/file.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            className="absolute inset-0 w-full h-full object-cover transform scale-[1.03] opacity-60"
            style={{ pointerEvents: 'none' }}
          />
          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 md:from-black/95 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Copy voltado para Pais */}
          <div className="space-y-6">
            <Badge className="bg-red-500/10 text-red-500 border border-red-500/30 px-4 py-1.5 text-sm font-bold rounded-full animate-pulse flex inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              Lançamento Oficial | Dia 20/04
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              A Educação do Século <span className="text-white">XXI</span>{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Chegou Na Escola do Seu Filho(a)
              </span>
            </h1>
            <p className="text-gray-300 text-xl leading-relaxed tracking-wide">
              Prepare-se para o encontro que vai transformar a rotina, a disciplina e o foco do jovem atleta de casa. Reserve a sua presença na <strong>Live de Lançamento</strong> com a metodologia da Revela Talentos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-4">
              <a href="#video-teasers" className="w-full sm:w-auto">
                <Button className="h-14 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-lg rounded-xl shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:scale-105 w-full">
                  <Calendar className="mr-2 w-5 h-5" /> Colocar na Agenda
                </Button>
              </a>
            </div>

            {/* Apresentador - Eric Cena */}
            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/20">
                <img src="https://static.wixstatic.com/media/933cdd_7baddddb15fc4bb0ad2e2455589ba598~mv2.jpg/v1/fill/w_300,h_300,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Eric%20Cena.jpg" alt="Eric Cena" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">Com Eric Cena</p>
                <p className="text-cyan-400 text-sm mt-1">Fundador da Revela Talentos</p>
              </div>
            </div>
          </div>

          {/* Right: Embedded Video no lugar do form */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 group backdrop-blur-md bg-black/60 p-2">
            <h3 className="absolute z-10 top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 pb-8 text-center text-sm text-gray-300 font-semibold pointer-events-none">
              Vídeo Promocional
            </h3>
            <div className="w-full h-full rounded-xl overflow-hidden relative">
              <iframe
                src="https://www.youtube.com/embed/9xGNPAYuRb4?autoplay=0&rel=0&modestbranding=1"
                className="absolute inset-0 w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Mensagem sobre a Live"
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/40" />
        </div>
      </section>

      {/* DESAFIO DOS PAIS */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge className="bg-white/5 text-gray-400 border border-white/10 px-4 py-1.5 text-sm rounded-full mb-6">
            O Cenário Atual
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Seu Filho(a) Está Pronto para{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              os Desafios Reais?
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-12">No mundo exigente de hoje, estudar é metade do processo. A outra é forjar uma mente inabalável.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Como dar confiança para ele acreditar nos próprios talentos além das telas e celulares?",
              "Como motivá-lo a manter dedicação aos estudos alinhada com seus sonhos e paixões e esporte?",
              "O que as grandes academias preparam mentalmente em atletas e que pode ser trazido à escola?"
            ].map((q, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-left hover:border-cyan-500/30 transition-all duration-300 hover:bg-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-sm font-bold mb-4">{i + 1}</div>
                <p className="text-gray-300 leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-cyan-500/20 rounded-2xl">
            <p className="text-lg text-gray-300 leading-relaxed">
              Descubra na Live que a solução inclui criar <span className="text-cyan-400 font-semibold">novos desafios emocionantes</span> que eleve o padrão moral, a disciplina, saúde e o ânimo do jovem para dentro de sala e dos gramados.
            </p>
          </div>
        </div>
      </section>

      {/* BENFICÍCIOS DIRETOS */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-white/5 text-gray-400 border border-white/10 px-4 py-1.5 text-sm rounded-full mb-6">
              Vantagens para Casa e Escola
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Por Trás da Nova{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Mentalidade Em Formação
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 cursor-default">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <b.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CRONOGRAMA */}
      <section id="como-funciona" className="py-24 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1.5 text-sm rounded-full mb-6">
              Passos a Seguir
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tudo Começa no Dia{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                20 de Abril
              </span>
            </h2>
            <p className="text-gray-400 text-xl">Como vai funcionar esta trajetória inesquecível para pais e alunos</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-[2px] h-[calc(100%-96px)] bg-gradient-to-b from-cyan-500/50 to-transparent" />
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 hover:bg-white/[0.06] transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl font-black text-white/10">{step.num}</span>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 items-center justify-center text-xl font-black text-white shadow-lg shadow-cyan-500/30 flex-shrink-0 z-10">
                    {i + 1}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS FAMÍLIA */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-4 py-1.5 text-sm rounded-full mb-6">
              Opinião de Outras Famílias
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              O Que Dizem os Pais{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Experientes
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-yellow-500/20 hover:bg-white/[0.06] transition-all duration-300">
                <div className="flex gap-1 mb-6">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 text-lg italic">"{t.text}"</p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-bold">{t.name}</p>
                    <p className="text-gray-500 text-sm">{t.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA INVITATION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.1)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Badge className="bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-1.5 text-sm font-bold rounded-full mb-6">
            Dia 20 de Abril
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Sua Presença é{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Fundamental!
            </span>
          </h2>
          <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Nós te esperamos nesta live reveladora onde Eric Cena mergulha nos projetos focados para seu filho. Preste atenção nas mensagens oficiais enviadas pela escola e não perca!
          </p>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <Button className="h-16 px-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xl rounded-xl shadow-2xl shadow-red-500/30 transition-all duration-300 hover:-translate-y-1">
              <Calendar className="mr-3 w-6 h-6" /> Agendar Lembrete na Live
            </Button>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-white/5 text-gray-400 border border-white/10 px-4 py-1.5 text-sm rounded-full mb-6">
              Dúvidas da Família
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Perguntas Comuns</h2>
            <p className="text-gray-400">O que você precisa saber antes do lançamento de 20/04.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="Revela Talentos" className="h-8 w-auto opacity-80" />
          <p className="text-gray-600 text-sm text-center">
            © 2026 Revela Talentos & Escola Parceira. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-gray-600 text-sm">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
