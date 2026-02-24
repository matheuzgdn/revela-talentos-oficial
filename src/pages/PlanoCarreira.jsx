import React, { useState, useEffect, useCallback } from "react";
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  MessageCircle,
  PlusSquare,
  User as UserIcon,
  TrendingUp,
  Settings,
  Heart,
  Trophy,
  Target,
  Calendar,
  Star,
  Users,
  CheckCircle,
  BarChart3,
  Video
} from "lucide-react";
import CareerFeed from "../components/career/CareerFeed";
import MessagingCenter from "../components/career/MessagingCenter";
import MaterialGallery from "../components/career/MaterialGallery";
import MarketingHub from "../components/career/MarketingHub";
import AthleteProfileComplete from "../components/career/AthleteProfileComplete";
import LoginModal from "../components/auth/LoginModal";
import { toast } from "sonner";


const PlanoCarreiraLandingPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
    position: "",
    current_club: "",
    experience_level: "amador",
    objectives: "",
    budget_range: "ate_500",
    lgpd_consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lgpd_consent) {
      toast.error("É necessário aceitar os termos LGPD para prosseguir.");
      return;
    }

    setIsSubmitting(true);
    try {
      await Lead.create({
        ...formData,
        lead_category: "plano_carreira",
        source_page: "plano_carreira"
      });
      toast.success("Interesse registrado! Nossa equipe entrará em contato em breve.");
      setFormData({
        full_name: "", email: "", phone: "", birth_date: "", position: "",
        current_club: "", experience_level: "amador", objectives: "",
        budget_range: "ate_500", lgpd_consent: false
      });
    } catch (error) {
      console.error("Erro ao registrar interesse:", error);
      toast.error("Erro ao registrar interesse. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const listeners = [];

    // --- ANIMAÇÃO DE ENTRADA AO ROLAR ---
    const itemsToReveal = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${index * 100}ms`;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      itemsToReveal.forEach(item => observer.observe(item));
    } else {
      itemsToReveal.forEach(item => item.classList.add('is-visible'));
    }

    // --- LÓGICA DO SLIDESHOW ---
    const images = document.querySelectorAll('.slideshow-image');
    let currentImageIndex = 0;
    let slideshowInterval;
    if (images.length > 1) {
      slideshowInterval = setInterval(() => {
        images[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].classList.add('active');
      }, 4000);
    }

    // --- LÓGICA 3D ---
    const add3dEffect = (containerSelector, wrapperSelector, layers) => {
      const container = document.querySelector(containerSelector);
      const wrapper = document.querySelector(wrapperSelector);
      const layerElements = layers.map(l => ({ el: document.querySelector(l.selector), factor: l.factor }));

      if (!container || !wrapper) return;

      const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const { width, height } = rect;

        const rotateX = (y / height - 0.5) * -15;
        const rotateY = (x / width - 0.5) * 15;

        wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        layerElements.forEach(layer => {
          if (layer.el) {
            const moveX = (x / width - 0.5) * -layer.factor;
            const moveY = (y / height - 0.5) * -layer.factor;
            layer.el.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
          }
        });
      };

      const handleMouseLeave = () => {
        wrapper.style.transform = 'rotateX(0) rotateY(0)';
        layerElements.forEach(layer => {
          if (layer.el) layer.el.style.transform = 'translate(-50%, -50%)';
        });
      };

      container.addEventListener('mousemove', handleMouseMove);
      listeners.push({ el: container, type: 'mousemove', handler: handleMouseMove });
      container.addEventListener('mouseleave', handleMouseLeave);
      listeners.push({ el: container, type: 'mouseleave', handler: handleMouseLeave });
    }

    add3dEffect('.interactive-container', '.slideshow-wrapper', [{ selector: '.stats-hud', factor: 30 }]);

    // Cleanup
    return () => {
      clearInterval(slideshowInterval);
      listeners.forEach(({ el, type, handler }) => el.removeEventListener(type, handler));
    };
  }, []);

  const countries = [
    { name: 'BRASIL', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/br.svg' },
    { name: 'CHILE', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/cl.svg' },
    { name: 'ARGENTINA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/ar.svg' },
    { name: 'EUA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/us.svg' },
    { name: 'PORTUGAL', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/pt.svg' },
    { name: 'ESPANHA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/es.svg' },
    { name: 'ITÁLIA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/it.svg' },
    { name: 'ALEMANHA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/de.svg' },
    { name: 'SUÍÇA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/ch.svg' },
    { name: 'ÁUSTRIA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/at.svg' },
    { name: 'ESLOVÁQUIA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/sk.svg' },
    { name: 'REP. TCHECA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/cz.svg' },
    { name: 'CROÁCIA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/hr.svg' },
    { name: 'BÓSNIA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/ba.svg' },
    { name: 'FINLÂNDIA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/fi.svg' },
    { name: 'ANDORRA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/ad.svg' },
    { name: 'DUBAI', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/ae.svg' },
    { name: 'CHINA', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/cn.svg' }
  ];

  return (
    <>
      <style>{`
        /* Estilos Globais */
        .page-container-lp {
            font-family: 'Inter', sans-serif;
            background-color: #020617; /* bg-slate-950 */
            color: #e2e8f0; /* text-slate-200 */
        }

        /* --- Estilos da Seção Herói --- */
        .hero-section { background-color: #020617; position: relative; overflow: hidden; }
        .hero-map-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; opacity: 0.15; }
        .hero-map-svg { width: 100%; height: 100%; object-fit: cover; }
        .land-hero { fill: rgba(14, 165, 233, 0.1); stroke: #0ea5e9; stroke-width: 0.5; filter: drop-shadow(0 0 3px #0ea5e9); }
        .glow-on-hover { box-shadow: 0 0 5px #0ea5e9, 0 0 25px #0ea5e9; transition: all 0.3s ease-in-out; }
        .glow-on-hover:hover { box-shadow: 0 0 10px #0ea5e9, 0 0 40px #0ea5e9, 0 0 80px #0ea5e9; transform: scale(1.05); }
        .interactive-container { position: relative; perspective: 1500px; }
        .slideshow-wrapper { width: 100%; height: 100%; transition: transform 0.1s ease-out; transform-style: preserve-3d; will-change: transform; }
        .stats-hud { position: absolute; top: 50%; left: 50%; width: 150%; height: 150%; transform: translate(-50%, -50%); z-index: 1; pointer-events: none; transition: transform 0.1s ease-out; }
        .stats-hud svg { width: 100%; height: 100%; overflow: visible; opacity: 0.2; }
        .hud-line { stroke: rgba(14, 165, 233, 0.4); stroke-width: 1; }
        .hud-radar-line { stroke: rgba(14, 165, 233, 0.2); stroke-width: 1; }
        .hud-radar-fill { fill: rgba(14, 165, 233, 0.1); stroke: #0ea5e9; stroke-width: 1.5; animation: pulse-radar 4s ease-in-out infinite; transform-origin: center; }
        @keyframes pulse-radar { 0%, 100% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } }
        .slideshow-container { position: relative; width: 100%; height: 100%; transform: translateZ(40px); border-radius: 1.5rem; overflow: hidden; background-color: #020617; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(14, 165, 233, 0.15); border: 1px solid rgba(255, 255, 255, 0.15); }
        .slideshow-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; opacity: 0; transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .slideshow-image.active { opacity: 1; }

        /* --- Estilos da Seção 2 (O que é) --- */
        .section-bg { background-color: #020617; position: relative; overflow: hidden; }
        .video-container { perspective: 1000px; }
        .video-wrapper { border-radius: 1rem; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); transition: transform 0.2s ease-out; transform-style: preserve-3d; will-change: transform; aspect-ratio: 9 / 16; width: 100%; max-width: 320px; margin: auto; }
        @media (min-width: 768px) { .video-wrapper { max-width: 360px; } }
        .stat-card { background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(56, 189, 248, 0.1); transition: all 0.3s ease; }
        .stat-card:hover { transform: scale(1.05); border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 0 30px rgba(14, 165, 233, 0.2); }

        /* --- Estilos da Seção Cases de Sucesso --- */
        .section-bg::before { content: ''; position: absolute; top: 50%; left: 50%; width: 1000px; height: 1000px; background-image: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0) 70%); transform: translate(-50%, -50%); z-index: 0; pointer-events: none; }
        .case-card { background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(56, 189, 248, 0.1); transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); position: relative; aspect-ratio: 9 / 16; perspective: 800px; border-radius: 1rem; overflow: hidden; }
        .case-card:hover { border-color: rgba(56, 189, 248, 0.6); box-shadow: 0 0 5px rgba(56, 189, 248, 0.8), 0 0 15px rgba(56, 189, 248, 0.6), 0 0 30px rgba(56, 189, 248, 0.4); }
        .card-content-wrapper { width: 100%; height: 100%; transition: transform 0.2s ease-out; transform-style: preserve-3d; }
        .case-card .media-placeholder { background-color: #0f172a; position: absolute; width: 100%; height: 100%; top: 0; left: 0; transform: translateZ(20px); }
        .case-card .stats-hud-card { position: absolute; width: 120%; height: 120%; top: -10%; left: -10%; opacity: 0.4; animation: rotate-hud 30s linear infinite reverse; }
        @keyframes rotate-hud { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* --- Estilos da Seção Países (CORRIGIDO COM CARDS ESTILO NETFLIX) --- */
        .country-card {
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(56, 189, 248, 0.2);
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
            position: relative;
            width: 140px;
            height: 90px;
            flex-shrink: 0;
            display: flex;
            align-items: flex-end;
            padding: 0;
            cursor: pointer;
        }

        .country-card:hover {
            border-color: rgba(56, 189, 248, 0.5);
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
        }

        .country-flag {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
        }

        .country-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            padding: 8px 12px;
            z-index: 2;
        }

        .country-name {
            color: white;
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            text-align: center;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }

        /* --- Estilos da Seção Como Funciona --- */
        .tactical-bg { background-color: #020617; position: relative; overflow: hidden; }
        #tactical-field-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; opacity: 0.2; transition: opacity 0.5s ease; }
        #tactical-field { width: 100%; height: 100%; }
        .field-line, .player-marker, .movement-line { transition: all 0.3s ease-in-out; }
        .field-line { stroke: #0ea5e9; stroke-width: 2; }
        .player-marker { fill: #0ea5e9; }
        .movement-line { stroke: #f87171; stroke-width: 2; stroke-dasharray: 4 4; }
        .tactical-bg:hover .field-line { stroke: #38bdf8; filter: drop-shadow(0 0 3px #38bdf8); }
        .tactical-bg:hover .player-marker { fill: #38bdf8; filter: drop-shadow(0 0 5px #38bdf8); }
        .tactical-bg:hover .movement-line { stroke: #fb7185; filter: drop-shadow(0 0 3px #fb7185); }
        .pillar-item { background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(56, 189, 248, 0.1); position: relative; z-index: 2; opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .pillar-item.is-visible { opacity: 1; transform: translateY(0); }
        .pillar-item:hover { border-color: rgba(56, 189, 248, 0.4); background: rgba(15, 23, 42, 0.7); transform: translateY(0) scale(1.03); box-shadow: 0 0 30px rgba(14, 165, 233, 0.15); }
        .pillar-number { font-size: 5rem; font-weight: 900; color: rgba(14, 165, 233, 0.05); position: absolute; top: 50%; left: 1.5rem; transform: translateY(-50%); transition: color 0.4s ease; z-index: 0; }
        .pillar-item:hover .pillar-number { color: rgba(14, 165, 233, 0.1); }
        .pillar-content { position: relative; z-index: 1; }

        /* --- Estilos da Seção Equipe & Depoimentos --- */
        .aurora-bg { background-color: #020617; position: relative; overflow: hidden; }
        .aurora-bg::before, .aurora-bg::after { content: ''; position: absolute; width: 600px; height: 600px; background-image: radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(14, 165, 233, 0) 70%); border-radius: 50%; z-index: 0; pointer-events: none; animation: aurora-flow 20s infinite linear; }
        .aurora-bg::before { top: -150px; right: -150px; }
        .aurora-bg::after { bottom: -150px; left: -150px; animation-delay: -10s; }
        @keyframes aurora-flow { 0%, 100% { transform: translateX(0) translateY(0) scale(1); } 25% { transform: translateX(100px) translateY(50px) scale(1.1); } 50% { transform: translateX(0) translateY(100px) scale(1); } 75% { transform: translateX(-100px) translateY(50px) scale(1.1); } }
        .story-card { background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(56, 189, 248, 0.1); position: relative; overflow: hidden; aspect-ratio: 9 / 16; border-radius: 1rem; perspective: 800px; }
        .story-card:hover { border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 0 40px rgba(14, 165, 233, 0.2); }
        .horizontal-scroll { display: flex; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding: 0.5rem; margin: -0.5rem; }
        .horizontal-scroll::-webkit-scrollbar { display: none; }
        .horizontal-scroll > * { flex-shrink: 0; width: 65%; margin-right: 1rem; }
        .horizontal-scroll > *:last-child { margin-right: 0; }
        @media (min-width: 1024px) { .lg-grid-cols-4 { grid-template-columns: repeat(4, 1fr); } .horizontal-scroll { display: grid; gap: 1.5rem; overflow-x: visible; padding: 0; margin: 0; } .horizontal-scroll > * { width: auto; max-width: none; } }
        .testimonial-card { background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.15); transform-style: preserve-3d; transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); aspect-ratio: 9 / 16; overflow: hidden; display: flex; flex-direction: column; perspective: 1000px; }
        .testimonial-card:hover { border-color: rgba(56, 189, 248, 0.5); box-shadow: 0 10px 50px rgba(14, 165, 233, 0.1); }
        .media-container { position: relative; width: 100%; flex-grow: 1; }
        .media-content { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .text-content { padding: 1rem; background: rgba(15, 23, 42, 0.4); border-top: 1px solid rgba(56, 189, 248, 0.15); }
        .testimonial-carousel { display: flex; gap: 1.5rem; overflow-x: auto; padding: 1rem; margin: -1rem; scrollbar-width: none; -ms-overflow-style: none; scroll-snap-type: x mandatory; }
        .testimonial-carousel::-webkit-scrollbar { display: none; }
        .testimonial-carousel > * { flex-shrink: 0; width: 80%; max-width: 320px; scroll-snap-align: center; }
        @media (min-width: 1024px) { .testimonial-carousel { display: grid; grid-template-columns: repeat(3, 1fr); overflow-x: visible; padding: 0; margin: 0; gap: 2rem; } .testimonial-carousel > * { width: auto; max-width: none; } }

        /* --- Estilos da Seção Planos --- */
        .plan-card { background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(56, 189, 248, 0.3); transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); box-shadow: 0 0 60px rgba(14, 165, 233, 0.1); }
        .plan-card:hover { transform: translateY(-10px) scale(1.03); border-color: rgba(56, 189, 248, 0.5); box-shadow: 0 0 80px rgba(14, 165, 233, 0.2); }
        .glow-button { box-shadow: 0 0 10px rgba(14, 165, 233, 0.5), 0 0 25px rgba(14, 165, 233, 0.3); transition: all 0.3s ease-in-out; }
        .glow-button:hover { box-shadow: 0 0 15px rgba(14, 165, 233, 0.8), 0 0 40px rgba(14, 165, 233, 0.5); transform: scale(1.05); }

        /* Animação de Entrada Genérica */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .reveal-on-scroll { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .reveal-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
      `}</style>
      <div className="page-container-lp">
        {/* Seção 1: Herói */}
        <section className="hero-section min-h-screen flex items-center justify-center p-4">
          <div className="container mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider leading-tight text-white">
                  Plano de Carreira <span className="text-sky-400">EC10 Talentos</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-100 max-w-lg mx-auto md:mx-0">
                  O caminho para o futebol profissional só é possível com uma assessoria esportiva qualificada e uma mentalidade forte.
                </p>
                <div className="mt-10">
                  <a href="#planos" className="inline-block bg-sky-500 text-white font-bold uppercase tracking-wider py-4 px-10 rounded-lg text-lg glow-on-hover">
                    QUERO SER ASSESSORADO
                  </a>
                </div>
              </div>

              <div className="interactive-container w-full max-w-md h-80 md:h-96 mx-auto">
                <div className="stats-hud">
                  <svg viewBox="0 0 300 300">
                    <g>
                      <circle className="hud-radar-line" cx="150" cy="150" r="40"></circle>
                      <circle className="hud-radar-line" cx="150" cy="150" r="80"></circle>
                      <line className="hud-radar-line" x1="150" y1="70" x2="150" y2="230"></line>
                      <line className="hud-radar-line" x1="80.7" y1="110" x2="219.3" y2="190"></line>
                      <line className="hud-radar-line" x1="80.7" y1="190" x2="219.3" y2="110"></line>
                    </g>
                    <polygon className="hud-radar-fill" points="150,80 205,125 185,190 115,190 95,125" />
                  </svg>
                </div>
                <div className="slideshow-wrapper">
                  <div className="slideshow-container">
                    <img src="https://i.imgur.com/o5y6PAr.png" alt="Atleta EC10 Talentos" className="slideshow-image active" />
                    <img src="https://i.imgur.com/05eb8hW.png" alt="Atleta EC10 Talentos" className="slideshow-image" />
                    <img src="https://i.imgur.com/smx6pgd.png" alt="Atleta EC10 Talentos" className="slideshow-image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 2: O que é (com vídeo) */}
        <section id="plano-carreira" className="py-20 px-4 section-bg min-h-screen flex items-center">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="video-container w-full order-last md:order-first reveal-on-scroll">
                <div className="video-wrapper">
                  <iframe src="https://player.vimeo.com/video/1109683681?badge=0&autopause=0&player_id=0&app_id=58479" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} title="EC10 Talentos - O que é o Plano de Carreira?"></iframe>
                </div>
              </div>

              <div className="w-full text-center md:text-left reveal-on-scroll" style={{ transitionDelay: '150ms' }}>
                <h2 className="text-3xl lg:text-5xl font-black uppercase">O que é o <span className="text-sky-400">Plano de Carreira?</span></h2>
                <p className="mt-4 text-lg lg:text-xl text-gray-300">Uma assessoria esportiva com foco em mentoria esportiva e gerar conexões entre atletas de alto rendimento e clubes de futebol profissional.</p>
              </div>
            </div>

            <div className="mt-20">
              <div className="border-t border-sky-500/20 w-1/4 mx-auto reveal-on-scroll"></div>
              <div className="mt-12 text-center reveal-on-scroll">
                <h3 className="text-2xl md:text-4xl font-bold uppercase tracking-wider">Nossos Talentos Pelo Mundo</h3>
                <p className="mt-2 text-gray-400">Resultados que comprovam nossa eficiência.</p>
                <div className="mt-10 flex justify-center">
                  <div className="grid sm:grid-cols-1 gap-6 text-center max-w-xs w-full">
                    <div className="stat-card p-6 rounded-xl"><p className="text-5xl lg:text-6xl font-black text-sky-400">800+</p><p className="mt-2 text-lg text-gray-300">Oportunidades geradas</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 3: Cases de Sucesso */}
        <section id="cases-de-sucesso" className="py-24 px-4 section-bg">
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16 reveal-on-scroll">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide">
                Nossas <span className="text-sky-400">Histórias de Sucesso</span>
              </h2>
              <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                Conheça os atletas que confiaram no nosso trabalho e alcançaram o sonho do futebol profissional.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { img: "https://i.imgur.com/WFU9u8X.jpeg", delay: "0ms" },
                { img: "https://i.imgur.com/UFwuE2e.jpeg", delay: "150ms" },
                { img: "https://i.imgur.com/pB5eDQr.png", delay: "300ms" },
                { img: "https://i.imgur.com/qPtM2rv.png", delay: "450ms" },
                { img: "https://i.imgur.com/QcIhkkT.jpeg", delay: "600ms" },
                { img: "https://i.imgur.com/uZN1u2Q.jpeg", delay: "750ms" },
              ].map((item, index) => (
                <div key={index} className="case-card reveal-on-scroll" style={{ transitionDelay: item.delay }}>
                  <div className="card-content-wrapper">
                    <div className="stats-hud-card">
                      <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="50" r="45" stroke="rgba(14, 165, 233, 0.5)" strokeWidth="1" fill="none" strokeDasharray="2 4"></circle></svg>
                    </div>
                    <div className="media-placeholder">
                      <img src={item.img} alt={`Foto do Atleta ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção 4: Presença Global (CORRIGIDA COM CARDS ESTILO NETFLIX) */}
        <section id="paises" className="py-24 px-4 section-bg">
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16 reveal-on-scroll">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide">
                Presença <span className="text-sky-400">Global</span>
              </h2>
              <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                Nossa rede de contatos abre portas para atletas nos principais mercados do futebol mundial.
              </p>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-4 justify-start px-4" style={{ width: 'max-content' }}>
                {countries.map((country, index) => (
                  <div key={index} className="country-card reveal-on-scroll" style={{ transitionDelay: `${index * 50}ms` }}>
                    <img
                      src={country.flag}
                      alt={`Bandeira ${country.name}`}
                      className="country-flag"
                    />
                    <div className="country-overlay">
                      <p className="country-name">{country.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Seção 5: Como Funciona (CORRIGIDA) */}
        <section id="como-funciona" className="py-24 px-4 tactical-bg">
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black uppercase">Como <span className="text-sky-400">Funciona?</span></h2>
              <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                Vamos trabalhar os 5 pilares fundamentais para o sucesso da sua carreira como atleta.
              </p>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col gap-6">
              {/* Pilar 1: Mentoria */}
              <div className="pillar-item reveal-on-scroll rounded-2xl p-6 md:p-8">
                <span className="pillar-number">01</span>
                <div className="pillar-content flex items-center gap-6">
                  <div className="hidden sm:flex w-16 h-16 bg-sky-900/50 rounded-xl items-center justify-center border border-sky-500/20 flex-shrink-0">
                    <Trophy className="h-8 w-8 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase mb-2">Mentoria 🧠</h3>
                    <p className="text-gray-300">Mentoria semanal com Eric, CEO e ex-atleta profissional com passagens por Argentina, Alemanha, Chile, Portugal e Brasil.</p>
                  </div>
                </div>
              </div>

              {/* Pilar 2: Análise de Desempenho */}
              <div className="pillar-item reveal-on-scroll rounded-2xl p-6 md:p-8">
                <span className="pillar-number">02</span>
                <div className="pillar-content flex items-center gap-6">
                  <div className="hidden sm:flex w-16 h-16 bg-sky-900/50 rounded-xl items-center justify-center border border-sky-500/20 flex-shrink-0">
                    <BarChart3 className="h-8 w-8 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase mb-2">Análise de Desempenho</h3>
                    <p className="text-gray-300">Phidelis, ex-jogador com mais de 16 anos na Europa, fará sua análise mensal para melhorar seu desempenho individual.</p>
                  </div>
                </div>
              </div>

              {/* Pilar 3: Marketing Esportivo */}
              <div className="pillar-item reveal-on-scroll rounded-2xl p-6 md:p-8">
                <span className="pillar-number">03</span>
                <div className="pillar-content flex items-center gap-6">
                  <div className="hidden sm:flex w-16 h-16 bg-sky-900/50 rounded-xl items-center justify-center border border-sky-500/20 flex-shrink-0">
                    <Video className="h-8 w-8 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase mb-2">Marketing Esportivo</h3>
                    <p className="text-gray-300">Assessoria completa com flyers e edição de vídeos individuais com seus melhores momentos para construir sua imagem.</p>
                  </div>
                </div>
              </div>

              {/* Pilar 4: Treino Personalizado */}
              <div className="pillar-item reveal-on-scroll rounded-2xl p-6 md:p-8">
                <span className="pillar-number">04</span>
                <div className="pillar-content flex items-center gap-6">
                  <div className="hidden sm:flex w-16 h-16 bg-sky-900/50 rounded-xl items-center justify-center border border-sky-500/20 flex-shrink-0">
                    <Target className="h-8 w-8 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase mb-2">Treino Personalizado</h3>
                    <p className="text-gray-300">Um preparador físico disponível para desenvolver o melhor programa de treino personalizado de acordo com a análise de desempenho.</p>
                  </div>
                </div>
              </div>

              {/* Pilar 5: Assessoria Esportiva */}
              <div className="pillar-item reveal-on-scroll rounded-2xl p-6 md:p-8">
                <span className="pillar-number">05</span>
                <div className="pillar-content flex items-center gap-6">
                  <div className="hidden sm:flex w-16 h-16 bg-sky-900/50 rounded-xl items-center justify-center border border-sky-500/20 flex-shrink-0">
                    <Users className="h-8 w-8 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase mb-2">Assessoria Esportiva</h3>
                    <p className="text-gray-300">Os atletas mais desenvolvidos são indicados para avaliações em clubes no Brasil ou exterior. (não trabalhamos com peneira)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 6: O Investimento que Muda o Jogo (CORRIGIDA) */}
        <section id="planos" className="py-24 px-4 section-bg">
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16 reveal-on-scroll">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide">
                O INVESTIMENTO QUE <span className="text-sky-400">MUDA O JOGO</span>
              </h2>
              <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                Escolha o plano que melhor se encaixa no seu momento e acelere sua carreira no futebol.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {/* PLANO 12 MESES - ANUAL */}
              <div className="plan-card reveal-on-scroll rounded-2xl p-8 w-full relative border-2 border-sky-400 shadow-2xl shadow-sky-400/20 h-full flex flex-col">
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="bg-sky-400 text-slate-900 text-sm font-bold uppercase px-4 py-1 rounded-full shadow-lg shadow-sky-400/30">MAIS POPULAR</span>
                </div>
                <h3 className="text-2xl font-bold uppercase text-center text-sky-400 mt-4">PLANO 12 MESES (ANUAL)</h3>

                <ul className="space-y-3 my-6 text-gray-400 text-sm flex-grow">
                  <li className="flex justify-between items-center"><span className="line-through">Mentoria semanal</span> <span className="line-through">R$4400</span></li>
                  <li className="flex justify-between items-center"><span className="line-through">Preparador físico</span> <span className="line-through">R$3120</span></li>
                  <li className="flex justify-between items-center"><span className="line-through">Análise de desempenho</span> <span className="line-through">R$2800</span></li>
                  <li className="flex justify-between items-center"><span className="line-through">Assessoria de marketing</span> <span className="line-through">R$3400</span></li>
                  <li className="flex justify-between items-center mt-4 pt-4 border-t border-sky-500/20"><span className="flex items-center gap-2 text-white font-semibold"><Star className="w-4 h-4 text-yellow-400" /> Assessoria para buscar clubes</span> <Badge className="bg-green-500 text-white">Gratuito</Badge></li>
                </ul>

                <div className="text-center my-6">
                  <p className="text-6xl font-black my-1 text-sky-300">12x R$299</p>
                  <p className="text-gray-300 text-lg">ou R$3.099 à vista</p>
                </div>

                <ul className="space-y-4 my-8 text-gray-300 text-base">
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" /><span>Todos os benefícios acima</span></li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" /><span>Análise de Desempenho Mensal</span></li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" /><span>Marketing Completo (Reels e Flyers)</span></li>
                  <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" /><span>Acompanhamento com Preparador Físico</span></li>
                  <li className="flex items-start gap-3 text-white font-bold"><CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" /><span>Assessoria Esportiva para Clubes</span></li>
                </ul>

                <a href="#cadastro" className="block w-full text-center bg-sky-500 text-white font-bold uppercase py-4 rounded-lg glow-button mt-auto">
                  QUERO SER PROFISSIONAL
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 7: Formulário de Cadastro */}
        <section id="cadastro" className="py-24 px-4 section-bg">
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16 reveal-on-scroll">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide">
                CADASTRE SEU <span className="text-sky-400">INTERESSE</span>
              </h2>
              <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                Preencha seus dados e nossa equipe entrará em contato para apresentar o melhor plano para sua carreira.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="plan-card rounded-2xl p-8 space-y-6 reveal-on-scroll">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="full_name" className="block text-white text-sm font-medium mb-2">Nome Completo <span className="text-red-500">*</span></label>
                    <Input
                      id="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Seu nome completo"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white text-sm font-medium mb-2">Email <span className="text-red-500">*</span></label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-white text-sm font-medium mb-2">WhatsApp <span className="text-red-500">*</span></label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="birth_date" className="block text-white text-sm font-medium mb-2">Data de Nascimento <span className="text-red-500">*</span></label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="position" className="block text-white text-sm font-medium mb-2">Posição <span className="text-red-500">*</span></label>
                    <select
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Selecione sua posição</option>
                      <option value="goleiro">Goleiro</option>
                      <option value="zagueiro">Zagueiro</option>
                      <option value="lateral">Lateral</option>
                      <option value="meio-campo">Meio-campo</option>
                      <option value="atacante">Atacante</option>
                      <option value="nao_informar">Prefiro não informar</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="current_club" className="block text-white text-sm font-medium mb-2">Clube Atual</label>
                    <Input
                      id="current_club"
                      type="text"
                      value={formData.current_club}
                      onChange={(e) => setFormData({ ...formData, current_club: e.target.value })}
                      placeholder="Nome do seu clube atual"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="experience_level" className="block text-white text-sm font-medium mb-2">Nível de Experiência</label>
                    <select
                      id="experience_level"
                      value={formData.experience_level}
                      onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="iniciante">Iniciante</option>
                      <option value="amador">Amador</option>
                      <option value="semi_profissional">Semi-profissional</option>
                      <option value="profissional">Profissional</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget_range" className="block text-white text-sm font-medium mb-2">Faixa de Investimento</label>
                    <select
                      id="budget_range"
                      value={formData.budget_range}
                      onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="ate_500">Até R$ 500</option>
                      <option value="500_1000">R$ 500 - R$ 1.000</option>
                      <option value="1000_2000">R$ 1.000 - R$ 2.000</option>
                      <option value="acima_2000">Acima de R$ 2.000</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="objectives" className="block text-white text-sm font-medium mb-2">Objetivos na Carreira</label>
                  <Textarea
                    id="objectives"
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    placeholder="Conte-nos sobre seus objetivos e sonhos no futebol..."
                    className="bg-gray-800 border-gray-700 text-white h-24"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="lgpd"
                    checked={formData.lgpd_consent}
                    onChange={(e) => setFormData({ ...formData, lgpd_consent: e.target.checked })}
                    className="w-4 h-4 text-sky-600 bg-gray-800 border-gray-700 rounded focus:ring-sky-500"
                    required
                  />
                  <label htmlFor="lgpd" className="text-sm text-gray-300 cursor-pointer">
                    Aceito os termos de privacidade e autorizo o uso dos meus dados para contato comercial. <span className="text-red-500">*</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold uppercase py-4 rounded-lg glow-button text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    "CADASTRAR INTERESSE"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer com informações de contato */}
        <footer className="py-12 px-4 section-bg border-t border-gray-800">
          <div className="container mx-auto text-center">
            <p className="text-gray-400 mb-2 text-sm">CNPJ: 54.433.892/0001-43</p>
            <p className="text-gray-400 text-sm">Entre em contato: +351 914 945 252</p>
            <p className="text-gray-500 text-xs mt-4">© {new Date().getFullYear()} EC10 Talentos. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default function PlanoCarreiraPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Career platform state
  const [activeTab, setActiveTab] = useState("feed");
  const [uploads, setUploads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [progress, setProgress] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [gameSchedules, setGameSchedules] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);

  const loadCareerData = useCallback(async (currentUser) => {
    try {
      // Load only essential data first
      const [userUploads, userPerformance] = await Promise.all([
        AthleteUpload.filter({ user_id: currentUser.id }, "-created_date", 20),
        PerformanceData.filter({ user_id: currentUser.id }, "-game_date", 20)
      ]);

      setUploads(userUploads);
      setPerformance(userPerformance);

      // Load remaining data in background
      ChatMessage.filter({
        $or: [
          { sender_id: currentUser.id },
          { receiver_id: currentUser.id }
        ]
      }, "-created_date", 50).then(setMessages).catch(() => { });

      UserProgress.filter({ user_id: currentUser.id }).then(setProgress).catch(() => { });

      GameSchedule.filter({
        user_id: currentUser.id,
        status: "scheduled"
      }, "-game_date", 10).then(setGameSchedules).catch(() => { });

      Promise.all([
        Content.filter({ category: "feed_posts", is_published: true }, "-created_date", 10),
        CareerPost.filter({ is_active: true }, "-created_date", 10)
      ]).then(([generalPosts, careerPosts]) => {
        const combinedPosts = [...generalPosts, ...careerPosts].sort(
          (a, b) => new Date(b.created_date) - new Date(a.created_date)
        );
        setFeedPosts(combinedPosts);
      }).catch(() => { });

    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  const checkAccess = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setIsLoading(false);

      if (currentUser?.has_plano_carreira_access) {
        loadCareerData(currentUser);
      }
    } catch (error) {
      setUser(null);
      setIsLoading(false);
    }
  }, [loadCareerData]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  // If user is authenticated and has access, show the actual platform
  if (user?.has_plano_carreira_access && !isLoading) {
    const tabs = [
      { id: "feed", icon: Home, label: "Feed", color: "text-green-400" },
      { id: "messages", icon: MessageCircle, label: "Mensagens", color: "text-blue-400" },
      { id: "upload", icon: PlusSquare, label: "Upload", color: "text-purple-400" },
      { id: "marketing", icon: TrendingUp, label: "Marketing", color: "text-pink-400" },
      { id: "profile", icon: UserIcon, label: "Perfil", color: "text-yellow-400" }
    ];

    const renderContent = () => {
      switch (activeTab) {
        case "feed":
          return <CareerFeed
            user={user}
            uploads={uploads}
            progress={progress}
            performance={performance}
            gameSchedules={gameSchedules}
            feedPosts={feedPosts}
            onRefresh={() => loadCareerData(user)} // Pass user to loadCareerData
            setActiveTab={setActiveTab}
          />;
        case "messages":
          return <MessagingCenter user={user} messages={messages} />;
        case "upload":
          return <MaterialGallery user={user} uploads={uploads} onUploadComplete={() => loadCareerData(user)} />;
        case "marketing":
          return <MarketingHub user={user} onUploadComplete={() => loadCareerData(user)} />;
        case "profile":
          return <AthleteProfileComplete
            user={user}
            uploads={uploads}
            performance={performance}
            gameSchedules={gameSchedules}
            progress={progress}
            onUserUpdate={() => loadCareerData(user)}
          />;
        default:
          return <CareerFeed
            user={user}
            uploads={uploads}
            progress={progress}
            performance={performance}
            gameSchedules={gameSchedules}
            feedPosts={feedPosts}
            onRefresh={() => loadCareerData(user)}
            setActiveTab={setActiveTab}
          />;
      }
    };

    return (
      <div className="min-h-screen bg-black text-white">
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-screen overflow-hidden">
          {/* Sidebar Left */}
          <div className="w-72 border-r border-gray-800 bg-gray-950 flex flex-col">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <img
                  src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png"
                  alt="EC10"
                  className="h-8 w-auto"
                />
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Plano de Carreira
                </h1>
              </div>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full justify-start p-4 h-auto transition-all ${activeTab === tab.id
                        ? 'bg-gray-800 text-white border-r-4 border-green-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-900'
                      }`}
                  >
                    <tab.icon className={`w-6 h-6 mr-4 ${activeTab === tab.id ? 'text-green-400' : ''}`} />
                    <span className="text-lg">{tab.label}</span>
                  </Button>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user?.profile_picture_url} />
                  <AvatarFallback className="bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold">
                    {user?.full_name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{user?.full_name}</p>
                  <p className="text-sm text-gray-400 truncate">{user?.position}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>

          <div className="w-80 border-l border-gray-800 bg-gray-950 p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Suas Estatísticas
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-900 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-400">{performance.length}</p>
                  <p className="text-xs text-gray-400">Jogos</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-400">{uploads.length}</p>
                  <p className="text-xs text-gray-400">Uploads</p>
                </div>
              </div>
            </div>

            {gameSchedules.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Próximos Jogos
                </h3>
                <div className="space-y-3">
                  {gameSchedules.slice(0, 3).map((game) => (
                    <div key={game.id} className="bg-gray-900 p-3 rounded-lg">
                      <p className="font-semibold text-white text-sm">vs {game.opponent}</p>
                      <p className="text-xs text-gray-400">{new Date(game.game_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" />
                Sugestões para Você
              </h3>
              <div className="space-y-3">
                <div className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <p className="font-semibold text-white text-sm">Complete seu perfil</p>
                  <p className="text-xs text-gray-400">Adicione mais informações</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <p className="font-semibold text-white text-sm">Envie um vídeo</p>
                  <p className="text-xs text-gray-400">Mostre suas habilidades</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  EC10 Carreira
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon">
                  <Heart className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageCircle className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </header>

          <main className="pb-20">
            {renderContent()}
          </main>

          <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-2 z-50">
            <div className="flex justify-around">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 h-auto p-3 ${activeTab === tab.id
                      ? 'text-green-400'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <tab.icon className="w-6 h-6" />
                  <span className="text-xs">{tab.label}</span>
                </Button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    );
  }

  // Landing page for non-authenticated users or users without access
  return (
    <div>
      <PlanoCarreiraLandingPage />
      <div className="fixed top-4 right-4 z-[100]">
        <Button
          onClick={() => setShowLoginModal(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg"
        >
          <UserIcon className="w-4 h-4 mr-2" />
          {user ? 'Acessar Plataforma' : 'Fazer Login'}
        </Button>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          checkAccess();
        }}
      />
    </div>
  );
}