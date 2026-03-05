import React, { useState, useEffect } from "react";
import { CheckCircle2, Globe2, ShieldCheck, Play, ArrowRight, MapPin, Mail, Phone, User, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

import { toast } from "sonner";

export default function EC10TrialHub() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
    position: "",
    preferred_country: "",
    plan_type: "carreira_internacional",
    video_links: [""],
    objectives: "",
    lgpd_consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        const allContent = await base44.entities.InternationalPlan.filter({ is_active: true }, "order");
        setTestimonials(allContent.filter(c => c.content_type === 'testimonial'));
        setFaqs(allContent.filter(c => c.content_type === 'faq'));
      } catch (error) {
        console.error("Error loading page content:", error);
        toast.error("Erro ao carregar conteúdo da página.");
      }
    };

    loadPageContent();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlanChange = (plan) => {
    setFormData(prev => ({...prev, plan_type: plan}));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lgpd_consent) {
      toast.error("É necessário aceitar os termos LGPD para prosseguir.");
      return;
    }

    setIsSubmitting(true);
    try {
      const leadData = {
        ...formData,
        source_page: "plano_internacional",
        status: "novo"
      };
      
      await base44.entities.InternationalLead.create(leadData);
      
      toast.success("Inscrição realizada com sucesso! Nossa equipe entrará em contato em breve.");
      setFormData({
        full_name: "", email: "", phone: "", birth_date: "", position: "",
        preferred_country: "", plan_type: "carreira_internacional",
        video_links: [""], objectives: "", lgpd_consent: false
      });
    } catch (error) {
      console.error("Erro ao criar lead:", error);
      toast.error("Erro ao realizar inscrição. Tente novamente.");
    }
    setIsSubmitting(false);
  };
  
  const COUNTRIES = [
    { name: "Espanha", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/250px-Flag_of_Spain.svg.png" },
    { name: "Portugal", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Flag_of_Portugal_%28official%29.svg/250px-Flag_of_Portugal_%28official%29.svg.png" },
    { name: "Eslováquia", imageUrl: "https://static.mundoeducacao.uol.com.br/mundoeducacao/2022/11/bandeira-da-eslovaquia.jpg" },
    { name: "Bósnia", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_Bosnia_and_Herzegovina.svg" },
    { name: "Alemanha", imageUrl: "https://s5.static.brasilescola.uol.com.br/be/2020/10/bandeira-da-alemanha.jpg" },
    { name: "Áustria", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_Austria.svg/330px-Flag_of_Austria.svg.png" },
    { name: "Croácia", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Croatia.svg/330px-Flag_of_Croatia.svg.png" },
    { name: "Argentina", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/1200px-Flag_of_Argentina.svg.png" },
    { name: "EUA", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_the_United_States_%28Web_Colors%29.svg/250px-Flag_of_the_United_States_%28Web_Colors%29.svg.png" },
    { name: "Emirados Árabes", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/960px-Flag_of_the_United_Arab_Emirates.svg.png" },
    { name: "China", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg" },
    { name: "Itália", imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/250px-Flag_of_Italy.svg.png" },
    { name: "Andorra", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_Andorra.svg" },
    { name: "República Tcheca", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg" },
    { name: "Finlândia", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg" },
    { name: "Suíça", imageUrl: "https://img.freepik.com/fotos-premium/bandeira-da-suica-com-papel-antigo-vintage_39526-268.jpg" },
    { name: "Chile", imageUrl: "https://s5.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-chile.jpg" }
  ];

  const VIDEO_TESTIMONIALS = [
    "https://video.wixstatic.com/video/933cdd_3d1fb23bfd77406cafd76f684901837c/720p/mp4/file.mp4",
    "https://video.wixstatic.com/video/933cdd_392801e93e1743bb8e8b273d64ea7f98/480p/mp4/file.mp4",
    "https://video.wixstatic.com/video/933cdd_79113079e95b4c73a31372a8eecacb00/480p/mp4/file.mp4",
    "https://video.wixstatic.com/video/933cdd_e8baae69432c4dc89c880955880639ca/480p/mp4/file.mp4",
    "https://video.wixstatic.com/video/933cdd_c05d9299448444d984132a96081313f9/720p/mp4/file.mp4"
  ];
  
  const Section = ({ id, title, subtitle, children }) => (
    <section id={id} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-sm md:text-base text-zinc-300">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );

  const Card = ({ className = "", children }) => (
    <div className={`rounded-2xl bg-zinc-900/80 ring-1 ring-zinc-800/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,.75)] transition-all duration-300 ${className}`}>{children}</div>
  );

  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Vídeo de fundo contínuo sem som */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="https://video.wixstatic.com/video/933cdd_388c6e2a108d49f089ef70033306e785/1080p/mp4/file.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-[#0b0c0f]/60 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500"/>
            <span className="font-bold">EC10 Talentos</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#como-funciona" className="hover:text-white">Como funciona</a>
            <a href="#planos" className="hover:text-white">Planos</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#inscricao" className="hover:text-white">Inscrição</a>
          </nav>
          <div>
            <a href="#inscricao" className="inline-block bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-400 transition-colors">
              Inscrever-me
            </a>
          </div>
        </div>
      </header>

      {/* HERO COM VÍDEO HERO COM CONTROLES */}
      <section className="relative overflow-hidden min-h-screen z-10">
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[80vh]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sky-300 text-xs md:text-sm">
                  <ShieldCheck className="w-4 h-4"/>
                  <span>Suporte jurídico</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sky-300 text-xs md:text-sm">
                  <Globe2 className="w-4 h-4"/>
                  <span>Rede internacional</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sky-300 text-xs md:text-sm">
                  <Play className="w-4 h-4"/>
                  <span>Mentoria técnica</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Plano de Carreira Internacional EC10 Talentos</h1>
              <p className="mt-4 text-zinc-300 text-base md:text-lg">A partir de 18 anos. Sua chance real de jogar na Europa com preparação, avaliação e acompanhamento completo.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#inscricao" className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold tracking-wide bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-400 hover:to-blue-400 active:scale-[.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 focus-visible:ring-offset-zinc-950">
                  Inscrever-me agora <ArrowRight className="w-4 h-4"/>
                </a>
                <a href="#planos" className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200"><Play className="w-4 h-4"/> Ver planos</a>
              </div>
              <div className="mt-6 text-xs text-zinc-400 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> CNPJ: 54.433.892/0001-43 • Política de Privacidade • Termos</div>
            </div>
            
            {/* VÍDEO HERO COM CONTROLES DE SOM */}
            <div className="flex justify-center">
              <div className="rounded-2xl bg-zinc-900/80 ring-1 ring-zinc-800/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,.75)] transition-all duration-300 p-0 overflow-hidden w-80 md:w-96">
                <div className="aspect-[9/16] w-full bg-gradient-to-br from-zinc-900 to-zinc-800 relative">
                  <video
                    src="https://video.wixstatic.com/video/933cdd_0df014035d9048f298508f9583d3448f/1080p/mp4/file.mp4"
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    playsInline
                    poster="https://images.unsplash.com/photo-1551854374-f3d052d70e2a?w=400&h=800&fit=crop"
                    onLoadedMetadata={(e) => {
                      e.target.muted = false;
                      e.target.volume = 0.7;
                    }}
                  />
                  {/* Overlay responsivo para indicar vídeo */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTRIES */}
      <Section id="onde-estamos" title="Onde estamos" subtitle="Destinos com oportunidades e janelas de avaliação abertas">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {COUNTRIES.map((country, idx) => (
            <Card key={idx} className="h-40 flex flex-col items-center justify-center text-center p-4 relative hover:scale-105 transition-transform">
              <img 
                src={country.imageUrl} 
                alt={`Bandeira de ${country.name}`}
                className="w-20 h-12 object-cover rounded-md mb-3 shadow-lg shadow-black/30"
              />
              <span className="text-sm md:text-base text-zinc-100 font-medium">{country.name}</span>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full shadow-lg"></div>
            </Card>
          ))}
        </div>
      </Section>
      
      {/* HOW IT WORKS */}
      <Section id="como-funciona" title="Como funciona" subtitle="Do envio do material à assinatura do contrato">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: 1, t: "Inscrição e triagem", d: "Perfil, posição e material de jogo." },
            { n: 2, t: "Mentoria preparatória", d: "Treinos, currículo esportivo e mídia." },
            { n: 3, t: "Seleção de destino", d: "País, clube e calendário da janela." },
            { n: 4, t: "Avaliação presencial", d: "Tryout / período de testes acompanhado." },
            { n: 5, t: "Proposta e assinatura", d: "Com suporte jurídico especializado." },
            { n: 6, t: "Acompanhamento", d: "Adaptação e performance pós-chegada." },
          ].map((s) => (
            <Card key={s.n} className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 text-white grid place-items-center font-bold">{s.n}</div>
                <div>
                  <p className="font-semibold text-white">{s.t}</p>
                  <p className="text-sm text-zinc-400">{s.d}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* PLANS */}
      <Section id="planos" title="Plano de Carreira Internacional" subtitle="Escolha a rota que combina com o seu momento">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className={`p-6 ${formData.plan_type === "carreira_internacional" ? "ring-sky-500/50" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Plano de Carreira Internacional</h3>
                <p className="text-zinc-400">A partir de <span className="text-white font-semibold">€200</span> (pagamento único)</p>
              </div>
              <div className="text-xs text-sky-300 bg-sky-500/10 ring-1 ring-sky-500/20 px-3 py-1 rounded-full">Preparatório</div>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {["Mentoria preparatória (performance + currículo)", "Assessoria de treinos e calendário", "Marketing pessoal e mídia", "Planejamento de embarque em até 10 meses"].map((it, i) => (
                <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5"/><span className="text-zinc-300">{it}</span></li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-3">
              <a href="#inscricao" onClick={() => handlePlanChange("carreira_internacional")} className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold tracking-wide bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-400 hover:to-blue-400">Quero este plano</a>
              <span className="text-xs text-zinc-500">*Não inclui passagens, vistos e seguro.</span>
            </div>
          </Card>

          <Card className={`p-6 ${formData.plan_type === "avaliacao" ? "ring-sky-500/50" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Plano de Avaliação Internacional</h3>
                <p className="text-zinc-400">Embarque imediato — A partir de <span className="text-white font-semibold">€1.500</span></p>
              </div>
              <div className="text-xs text-emerald-300 bg-emerald-500/10 ring-1 ring-emerald-500/20 px-3 py-1 rounded-full">Avaliação</div>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {["Alimentação e estadia durante a avaliação", "Assessoria no país de destino", "Embarque na próxima janela de transferências", "Marketing e apresentação ao clube"].map((it, i) => (
                <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5"/><span className="text-zinc-300">{it}</span></li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-3">
              <a href="#inscricao" onClick={() => handlePlanChange("avaliacao")} className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold tracking-wide bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-400 hover:to-blue-400">Quero este plano</a>
              <span className="text-xs text-zinc-500">*Não inclui passagens, vistos e seguro.</span>
            </div>
          </Card>
        </div>
      </Section>
      
      {/* DEPOIMENTOS */}
      <Section id="depoimentos" title="Depoimentos" subtitle="Resultados reais de atletas que confiaram no nosso método">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {VIDEO_TESTIMONIALS.map((videoUrl, i) => (
            <div key={i} className="flex-shrink-0 snap-center">
              <Card className="p-0 overflow-hidden w-60 md:w-72">
                <div className="aspect-[9/16] w-full bg-zinc-800 relative">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">Atleta EC10</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Section>
      
      {/* FORM */}
      <section id="inscricao" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Inscrição</h2>
          <p className="mt-1 text-sm md:text-base text-zinc-300">Envie seus dados e receba o passo a passo para participar</p>
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-zinc-400">Nome completo</label>
                    <input name="full_name" placeholder="Seu nome" required value={formData.full_name} onChange={handleInputChange} className="w-full rounded-xl bg-zinc-900/70 ring-1 ring-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400">Data de nascimento</label>
                    <input name="birth_date" type="date" required value={formData.birth_date} onChange={handleInputChange} className="w-full rounded-xl bg-zinc-900/70 ring-1 ring-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-zinc-400">E-mail</label>
                    <input name="email" type="email" placeholder="seu@email.com" required value={formData.email} onChange={handleInputChange} className="w-full rounded-xl bg-zinc-900/70 ring-1 ring-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400">WhatsApp</label>
                    <input name="phone" placeholder="+351 ___-___-___" required value={formData.phone} onChange={handleInputChange} className="w-full rounded-xl bg-zinc-900/70 ring-1 ring-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-zinc-400">Posição</label>
                    <select name="position" value={formData.position} onChange={handleInputChange} required className="w-full appearance-none rounded-xl bg-zinc-900/70 ring-1 ring-zinc-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option value="" disabled>Selecione…</option>
                      <option value="goleiro">Goleiro</option>
                      <option value="zagueiro">Zagueiro</option>
                      <option value="lateral">Lateral</option>
                      <option value="meio-campo">Meio-Campo</option>
                      <option value="atacante">Atacante</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400">País de interesse</label>
                    <select name="preferred_country" value={formData.preferred_country} onChange={handleInputChange} className="w-full appearance-none rounded-xl bg-zinc-900/70 ring-1 ring-zinc-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option value="" disabled>Selecione…</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <label className="flex items-start gap-3 text-sm text-zinc-300">
                  <input type="checkbox" name="lgpd_consent" className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-900" checked={formData.lgpd_consent} onChange={handleInputChange} />
                  <span>Concordo em ser contatado(a) pela EC10 para fins de avaliação esportiva e entendo a Política de Privacidade (LGPD).</span>
                </label>

                <div className="flex items-center gap-3">
                  <button type="submit" disabled={!formData.lgpd_consent || isSubmitting} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold tracking-wide bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-400 hover:to-blue-400 ${(!formData.lgpd_consent || isSubmitting) ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Concluir inscrição"}
                  </button>
                  <a className="text-sky-300 hover:text-sky-200" href="https://wa.me/351914945252?text=Tenho%20interesse%20no%20programa%20internacional%20da%20EC10" target="_blank" rel="noreferrer">
                    Falar no WhatsApp
                  </a>
                </div>
              </form>
            </Card>
          </div>
          <div className="md:col-span-2 flex flex-col gap-4">
            <Card className="p-6">
              <p className="text-sm text-zinc-400">Atendimento</p>
              <p className="text-white font-semibold">Seg–Sex 09:00–18:00 (CET)</p>
              <div className="mt-3 flex items-center gap-3 text-sm text-zinc-300">
                <MapPin className="w-4 h-4"/> R. Américo Luz, 521 — Gutierrez, Belo Horizonte-MG
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm text-zinc-300">
                <Mail className="w-4 h-4"/> contato@ec10talentos.com
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm text-zinc-300">
                <Phone className="w-4 h-4"/> +351 914 945 252
              </div>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-zinc-400">Legal</p>
              <p className="text-zinc-300">EC10 Talentos • CNPJ 54.433.892/0001-43</p>
              <div className="mt-2 text-xs text-zinc-500">*Alguns serviços não incluem passagens aéreas, vistos, taxas consulares e seguro. Consulte condições.</div>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800/80 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-400">© {new Date().getFullYear()} EC10 Talentos — Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 text-sm">
            <a className="hover:text-white" href="#">Política de Privacidade</a>
            <a className="hover:text-white" href="#">Termos de Uso</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

