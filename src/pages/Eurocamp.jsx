import React from 'react';

export default function Eurocamp() {
  return (
    <div className="bg-[#0a1120] text-white font-sans antialiased overflow-x-hidden min-h-screen">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-[#060a13]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full border-2 border-[#eab308] flex items-center justify-center">
                <i className="fa-solid fa-star text-[#eab308] text-xs"></i>
              </div>
              <span className="font-bold text-xl tracking-wider">EUROCAMP</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
              <a href="#programa" className="hover:text-white transition">O PROGRAMA</a>
              <a href="#clubes" className="hover:text-white transition">CLUBES</a>
              <a href="#experiencias" className="hover:text-white transition">EXPERIÊNCIAS</a>
              <a href="#atletas" className="hover:text-white transition">ATLETAS</a>
              <a href="#planos" className="hover:text-white transition">PLANOS</a>
              <a href="#contato" className="hover:text-white transition">CONTATO</a>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex">
              <a 
                href="https://wa.me/5511999999999?text=Olá,%20tenho%20interesse%20no%20Eurocamp" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#eab308] hover:bg-yellow-400 text-[#060a13] px-6 py-2.5 rounded-md font-bold text-sm transition shadow-[0_0_15px_rgba(234,179,8,0.3)]"
              >
                QUERO PARTICIPAR
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <a 
                href="https://wa.me/5511999999999?text=Olá,%20tenho%20interesse%20no%20Eurocamp" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#eab308] hover:bg-yellow-400 text-[#060a13] px-4 py-2 rounded-md font-bold text-xs"
              >
                PARTICIPAR
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative pt-28 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 bg-cover bg-center bg-no-repeat md:bg-fixed min-h-[92vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(6, 10, 19, 0.96) 0%, rgba(6, 10, 19, 0.75) 45%, rgba(6, 10, 19, 0.35) 100%), linear-gradient(to top, rgba(6, 10, 19, 1) 0%, transparent 35%), url('/images/eurocamp/hero-cinematic.png')`
        }}
      >
        {/* Decorative gradient slash at the bottom */}
        <div className="absolute bottom-0 right-0 w-1/2 h-3 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 transform -skew-x-12 translate-x-4 z-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl">
            
            {/* Hero Image / Brand Logo */}
            <div className="mb-6 max-w-sm sm:max-w-md">
              <img 
                src="https://static.wixstatic.com/media/933cdd_16f2d1b837fb45538ae0cace2dd86d6f~mv2.png/v1/fill/w_600,h_257,al_c,q_85,enc_auto/933cdd_16f2d1b837fb45538ae0cace2dd86d6f~mv2.png" 
                alt="Eurocamp Logo" 
                className="w-full h-auto object-contain filter drop-shadow-[0_0_25px_rgba(234,179,8,0.3)]"
              />
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black italic tracking-tighter text-white mb-2 leading-none">
              EUROCAMP
            </h1>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#eab308] mb-6 tracking-wide drop-shadow-md">
              Espanha / Portugal
            </h2>
            
            <p className="text-gray-200 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed font-normal drop-shadow-sm">
              Experiência internacional de futebol com jogos avaliativos, clubes parceiros, tours exclusivos e acompanhamento esportivo.
            </p>
            
            <a 
              href="https://wa.me/5511999999999?text=Olá,%20tenho%20interesse%20no%20Eurocamp" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-3 bg-[#eab308] hover:bg-yellow-400 text-[#060a13] px-9 py-4.5 rounded-lg font-black text-base transition duration-300 transform hover:-translate-y-0.5 shadow-[0_0_25px_rgba(234,179,8,0.4)] group"
            >
              QUERO PARTICIPAR 
              <i className="fa-solid fa-arrow-right group-hover:translate-x-1.5 transition-transform duration-300"></i>
            </a>

            {/* Feature Icons row */}
            <div className="flex flex-wrap gap-6 sm:gap-10 border-t border-white/20 pt-8 mt-12 backdrop-blur-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#eab308]/10 border border-[#eab308]/30 flex items-center justify-center">
                  <i className="fa-regular fa-clipboard text-[#eab308] text-lg"></i>
                </div>
                <span className="text-xs font-bold tracking-wider text-gray-200 leading-tight">AVALIAÇÃO<br />EM CLUBES</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#eab308]/10 border border-[#eab308]/30 flex items-center justify-center">
                  <i className="fa-regular fa-user text-[#eab308] text-lg"></i>
                </div>
                <span className="text-xs font-bold tracking-wider text-gray-200 leading-tight">ACOMPANHAMENTO<br />ESPORTIVO</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#eab308]/10 border border-[#eab308]/30 flex items-center justify-center">
                  <i className="fa-solid fa-globe text-[#eab308] text-lg"></i>
                </div>
                <span className="text-xs font-bold tracking-wider text-gray-200 leading-tight">VIVÊNCIA<br />INTERNACIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Info */}
      <section id="programa" className="py-20 bg-[#0a1120] border-t border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold tracking-wide uppercase mb-4">O Programa Eurocamp</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-[#eab308]/50"></div>
              <i className="fa-solid fa-star text-[#eab308] text-sm"></i>
              <div className="h-px w-16 bg-[#eab308]/50"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 flex items-center gap-6 shadow-xl transform hover:-translate-y-1 transition duration-300">
              <div className="text-[#0a1120] text-4xl">
                <i className="fa-regular fa-calendar-alt"></i>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1 tracking-wider">DATAS DISPONÍVEIS</p>
                <p className="text-[#0a1120] font-bold text-lg leading-tight">Janeiro / Fevereiro /<br />Agosto</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 flex items-center gap-6 shadow-xl transform hover:-translate-y-1 transition duration-300">
              <div className="text-[#0a1120] text-4xl">
                <i className="fa-regular fa-clock"></i>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1 tracking-wider">DURAÇÃO BASE</p>
                <p className="text-[#0a1120] font-bold text-xl">10 dias</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 flex items-center gap-6 shadow-xl transform hover:-translate-y-1 transition duration-300">
              <div className="text-[#0a1120] text-4xl">
                <i className="fa-regular fa-futbol"></i>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1 tracking-wider">QUANTIDADE DE JOGOS</p>
                <p className="text-[#0a1120] font-bold text-xl">4 a 5 jogos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clubs & Opportunities */}
      <section id="clubes" className="py-20 bg-[radial-gradient(circle_at_center,_rgba(17,27,51,0.8)_0%,_rgba(10,17,32,1)_100%)] relative border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold tracking-wide uppercase mb-4">Clubes e Oportunidades</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-[#eab308]/50"></div>
              <i className="fa-solid fa-star text-[#eab308] text-sm"></i>
              <div className="h-px w-16 bg-[#eab308]/50"></div>
            </div>
          </div>

          {/* Spain Clubs */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-full bg-white/20"></div>
              <h4 className="text-lg font-bold tracking-widest text-white whitespace-nowrap">ESPANHA</h4>
              <div className="h-px w-full bg-white/20"></div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {[
                { name: 'Valladolid', img: 'https://tmssl.akamaized.net/images/wappen/head/366.png' },
                { name: 'Getafe', img: 'https://tmssl.akamaized.net/images/wappen/head/3709.png' },
                { name: 'Málaga', img: 'https://tmssl.akamaized.net/images/wappen/head/1084.png' },
                { name: 'Sevilha', img: 'https://tmssl.akamaized.net/images/wappen/head/368.png' },
                { name: 'Leganés', img: 'https://tmssl.akamaized.net/images/wappen/head/1244.png' },
                { name: 'Atlético de Madrid', img: 'https://tmssl.akamaized.net/images/wappen/head/13.png' },
                { name: 'Rayo Vallecano', img: 'https://tmssl.akamaized.net/images/wappen/head/367.png' },
                { name: 'Betis', img: 'https://tmssl.akamaized.net/images/wappen/head/150.png' }
              ].map((club, idx) => (
                <div key={idx} className="flex flex-col items-center justify-between gap-3 bg-[#111b33]/60 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-[#eab308] hover:bg-[#111b33] hover:-translate-y-1 transition-all duration-300 cursor-default group w-[100px] md:w-32 shadow-xl">
                  <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center p-1 group-hover:scale-110 transition-transform duration-300">
                    <img src={club.img} alt={club.name} className="max-w-full max-h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
                  </div>
                  <span className="text-[11px] md:text-sm font-bold text-center text-gray-300 group-hover:text-[#eab308] transition leading-tight">{club.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Portugal Clubs */}
          <div>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-full bg-white/20"></div>
              <h4 className="text-lg font-bold tracking-widest text-white whitespace-nowrap">PORTUGAL</h4>
              <div className="h-px w-full bg-white/20"></div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {[
                { name: 'Braga', img: 'https://tmssl.akamaized.net/images/wappen/head/1075.png' },
                { name: 'Famalicão', img: 'https://tmssl.akamaized.net/images/wappen/head/3329.png' },
                { name: 'Feirense', img: 'https://tmssl.akamaized.net/images/wappen/head/3349.png' },
                { name: 'Beira-Mar', img: 'https://tmssl.akamaized.net/images/wappen/head/1436.png' },
                { name: 'Leixões', img: 'https://images.fotmob.com/image_resources/logo/teamlogo/6421.png' }
              ].map((club, idx) => (
                <div key={idx} className="flex flex-col items-center justify-between gap-3 bg-[#111b33]/60 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-green-500 hover:bg-[#111b33] hover:-translate-y-1 transition-all duration-300 cursor-default group w-[100px] md:w-32 shadow-xl">
                  <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center p-1 group-hover:scale-110 transition-transform duration-300">
                    <img src={club.img} alt={club.name} className="max-w-full max-h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
                  </div>
                  <span className="text-[11px] md:text-sm font-bold text-center text-gray-300 group-hover:text-green-500 transition leading-tight">{club.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Included */}
      <section id="experiencias" className="py-20 bg-[#0a1120] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold tracking-wide uppercase mb-4">Experiências Inclusas</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-[#eab308]/50"></div>
              <i className="fa-solid fa-star text-[#eab308] text-sm"></i>
              <div className="h-px w-16 bg-[#eab308]/50"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-lg overflow-hidden border border-white/10 group cursor-pointer shadow-xl">
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Quarto de Hotel" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="bg-[#111b33] py-4 text-center">
                <h4 className="font-bold text-sm tracking-wider uppercase text-white">ESTADIA</h4>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-white/10 group cursor-pointer shadow-xl">
              <div className="h-48 overflow-hidden relative">
                <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Panoramic_santiago_bernabeu.jpg?width=800" alt="Tour Bernabéu" className="w-full h-full object-cover group-hover:scale-110 transition duration-500 bg-gray-900" />
              </div>
              <div className="bg-[#111b33] py-4 text-center">
                <h4 className="font-bold text-sm tracking-wider uppercase text-white">TOUR: BERNABÉU</h4>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-white/10 group cursor-pointer shadow-xl">
              <div className="h-48 overflow-hidden">
                <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Estádio_do_Dragão.JPG?width=800" alt="Estádio do Dragão" className="w-full h-full object-cover group-hover:scale-110 transition duration-500 bg-gray-900" />
              </div>
              <div className="bg-[#111b33] py-4 text-center">
                <h4 className="font-bold text-sm tracking-wider uppercase text-white">TOUR: ESTÁDIO DO DRAGÃO</h4>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-white/10 group cursor-pointer shadow-xl">
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Jogo da LaLiga" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="bg-[#111b33] py-4 text-center">
                <h4 className="font-bold text-sm tracking-wider uppercase text-white">JOGO DA LALIGA</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Athletes & Past Experiences Section */}
      <section id="atletas" className="py-16 bg-[#060a13] border-t border-white/5">
        <div className="max-w-[90rem] mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-xl md:text-2xl font-bold tracking-wide uppercase mb-4">Atletas e Experiências Anteriores</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-[#eab308]/50"></div>
              <i className="fa-solid fa-star text-[#eab308] text-xs"></i>
              <div className="h-px w-16 bg-[#eab308]/50"></div>
            </div>
          </div>

          {/* Athletes Gallery / Carousel Grid */}
          <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x justify-start md:justify-center">
            
            {/* 1. SEVILHA - Imagem 1 (input_file_0) */}
            <div className="snap-center shrink-0 w-44 flex flex-col">
              <div className="w-full aspect-[3/4] rounded-t-lg overflow-hidden relative bg-gray-800 border border-white/10 border-b-0">
                <img 
                  src="/images/eurocamp/sevilha-player.png" 
                  alt="Atleta Sevilha" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="bg-[#111b33] py-2 text-center border border-white/10 border-t-0 rounded-b-lg">
                <p className="text-[11px] font-bold tracking-wider text-gray-200">SEVILHA</p>
              </div>
            </div>

            {/* 2. GETAFE - Imagem 2 (input_file_1) */}
            <div className="snap-center shrink-0 w-44 flex flex-col">
              <div className="w-full aspect-[3/4] rounded-t-lg overflow-hidden relative bg-blue-900 border border-blue-500/30 border-b-0">
                <img 
                  src="/images/eurocamp/getafe-player.png" 
                  alt="Atleta Getafe" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="bg-blue-950 py-2 text-center border border-blue-500/30 border-t-0 rounded-b-lg">
                <p className="text-[11px] font-bold tracking-wider text-blue-200">GETAFE</p>
              </div>
            </div>

            {/* 3. ATLÉTICO DE MADRID - Imagem 3 (input_file_2) */}
            <div className="snap-center shrink-0 w-44 flex flex-col">
              <div className="w-full aspect-[3/4] rounded-t-lg overflow-hidden relative bg-red-900 border border-red-500/30 border-b-0">
                <img 
                  src="/images/eurocamp/atletico-player.png" 
                  alt="Atleta Atlético de Madrid" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="bg-red-950 py-2 text-center border border-red-500/30 border-t-0 rounded-b-lg">
                <p className="text-[11px] font-bold tracking-wider text-red-200">ATLÉTICO DE MADRID</p>
              </div>
            </div>

            {/* 4. CRISTOFER - BRAGA - Imagem 4 (input_file_3) */}
            <div className="snap-center shrink-0 w-44 flex flex-col">
              <div className="w-full aspect-[3/4] rounded-t-lg overflow-hidden relative bg-red-800 border border-white/10 border-b-0">
                <img 
                  src="/images/eurocamp/braga-cristofer.jpg" 
                  alt="Cristofer - Braga" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="bg-[#111b33] py-2 text-center border border-white/10 border-t-0 rounded-b-lg">
                <p className="text-[11px] font-bold tracking-wider text-gray-200">CRISTOFER - BRAGA</p>
              </div>
            </div>

            {/* 5. ESTRELA AMADORA - Vídeo MP4 em Autoplay */}
            <div className="snap-center shrink-0 w-44 flex flex-col">
              <div className="w-full aspect-[3/4] rounded-t-lg overflow-hidden relative bg-green-900 border border-green-500/30 border-b-0">
                <video 
                  src="https://video.wixstatic.com/video/933cdd_e8baae69432c4dc89c880955880639ca/480p/mp4/file.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-green-950 py-2 text-center border border-green-500/30 border-t-0 rounded-b-lg">
                <p className="text-[11px] font-bold tracking-wider text-green-200">ESTRELA AMADORA</p>
              </div>
            </div>

            {/* 6. FEIRENSE - Foto Wix fornecida */}
            <div className="snap-center shrink-0 w-44 flex flex-col">
              <div className="w-full aspect-[3/4] rounded-t-lg overflow-hidden relative bg-blue-800 border border-white/10 border-b-0">
                <img 
                  src="https://static.wixstatic.com/media/933cdd_dd9e620898aa4c44ab1350e8961a6a62~mv2.png" 
                  alt="Feirense" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="bg-[#111b33] py-2 text-center border border-white/10 border-t-0 rounded-b-lg">
                <p className="text-[11px] font-bold tracking-wider text-gray-200">FEIRENSE</p>
              </div>
            </div>

            {/* 7. BEIRA-MAR - Foto Wix fornecida */}
            <div className="snap-center shrink-0 w-44 flex flex-col">
              <div className="w-full aspect-[3/4] rounded-t-lg overflow-hidden relative bg-yellow-600 border border-yellow-500/30 border-b-0">
                <img 
                  src="https://static.wixstatic.com/media/933cdd_64a14cbf943d48c1b216684edb9a2380~mv2.jpeg" 
                  alt="Beira-Mar" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="bg-yellow-900 py-2 text-center border border-yellow-500/30 border-t-0 rounded-b-lg">
                <p className="text-[11px] font-bold tracking-wider text-yellow-200">BEIRA-MAR</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-20 bg-[#0a1120] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold tracking-wide uppercase mb-4">Planos Eurocamp</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-[#eab308]/50"></div>
              <i className="fa-solid fa-star text-[#eab308] text-sm"></i>
              <div className="h-px w-16 bg-[#eab308]/50"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Plan 1: Bronze */}
            <div className="bg-white rounded-xl p-8 text-[#0a1120] flex flex-col shadow-xl">
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600 text-2xl">
                  <i className="fa-solid fa-medal"></i>
                </div>
                <h4 className="font-bold text-orange-600 text-lg uppercase tracking-wider mb-2">Plano Bronze</h4>
                <div className="text-4xl font-black mb-1">2200€</div>
              </div>
              
              <ul className="space-y-3 flex-grow text-sm font-medium text-gray-700">
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-orange-500 mt-1"></i> 10 dias</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-orange-500 mt-1"></i> 5 jogos</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-orange-500 mt-1"></i> Tour</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-orange-500 mt-1"></i> Alguns jogos gravados</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-orange-500 mt-1"></i> Roupa de viagem</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-orange-500 mt-1"></i> Roupa de jogo</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-orange-500 mt-1"></i> Marketing esportivo</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-orange-500 mt-1"></i> Assessoria esportiva na carreira</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-orange-500 mt-1"></i> Mentoria esportiva</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-orange-500 mt-1"></i> Alimentação</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-orange-500 mt-1"></i> Estadia</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-orange-500 mt-1"></i> Transporte</li>
              </ul>
            </div>

            {/* Plan 2: Silver */}
            <div className="bg-white rounded-xl p-8 text-[#0a1120] flex flex-col shadow-xl">
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-500 text-2xl">
                  <i className="fa-solid fa-medal"></i>
                </div>
                <h4 className="font-bold text-gray-500 text-lg uppercase tracking-wider mb-2">Plano Prata</h4>
                <div className="text-4xl font-black mb-1">30 <span className="text-2xl font-bold">dias</span></div>
              </div>
              
              <div className="text-sm font-medium text-gray-700 text-center mb-6 border-b pb-4">
                10 dias de jogos avaliativos<br />+ 20 dias de avaliação em um dos nossos clubes parceiros
              </div>

              <ul className="space-y-3 flex-grow text-sm font-medium text-gray-700">
                <li className="flex items-start gap-2 font-bold"><i className="fa-solid fa-check-double text-gray-500 mt-1"></i> Inclui tudo o que tem no Plano Bronze</li>
                <li className="flex items-start gap-2 mt-6 pt-4 border-t border-dashed border-gray-300"><i className="fa-regular fa-star text-gray-500 mt-1"></i> Mais tempo, mais visibilidade e mais oportunidades de avaliação.</li>
              </ul>
            </div>

            {/* Plan 3: Gold (Highlighted) */}
            <div className="bg-[#111b33] rounded-xl p-8 border-2 border-[#eab308] relative overflow-hidden flex flex-col shadow-[0_0_30px_rgba(234,179,8,0.15)] transform scale-105 z-10">
              <div className="absolute top-4 -right-12 bg-[#eab308] text-[#060a13] font-bold text-[10px] py-1 px-12 rotate-45 text-center shadow-md z-20">
                MAIS COMPLETO
              </div>

              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-4 text-[#eab308] text-2xl">
                  <i className="fa-solid fa-medal"></i>
                </div>
                <h4 className="font-bold text-[#eab308] text-lg uppercase tracking-wider mb-2">Plano Ouro</h4>
                <div className="text-3xl font-black mb-1">3.500€ <span className="text-base font-normal">de entrada</span><br />+ 700€ <span className="text-base font-normal">/ mês</span></div>
              </div>
              
              <ul className="space-y-4 flex-grow text-sm font-medium text-gray-300">
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-[#eab308] mt-1"></i> 10 meses</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-[#eab308] mt-1"></i> 10 dias de jogos avaliativos e, em seguida, permanência para a temporada de forma definitiva</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-[#eab308] mt-1"></i> Alimentação / estadia</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-[#eab308] mt-1"></i> Mentoria esportiva</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-[#eab308] mt-1"></i> Marketing</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-[#eab308] mt-1"></i> Assessoria de carreira</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-[#eab308] mt-1"></i> Gestão de carreira</li>
              </ul>
            </div>

            {/* Plan 4: Kids */}
            <div className="bg-white rounded-xl p-8 text-[#0a1120] flex flex-col shadow-xl">
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 text-2xl">
                  <i className="fa-solid fa-children"></i>
                </div>
                <h4 className="font-bold text-green-600 text-lg uppercase tracking-wider mb-1">Eurocamp Kids</h4>
                <p className="text-xs text-gray-500 font-bold mb-3">9 a 13 anos</p>
                <div className="text-4xl font-black mb-1">3.000€</div>
              </div>
              
              <ul className="space-y-4 flex-grow text-sm font-medium text-gray-700">
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-1"></i> Intercâmbio individual de 7 dias em um clube de expressão do futebol europeu</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-1"></i> Marketing</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-1"></i> Assessoria esportiva</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-1"></i> Experiência de treinamento</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-1"></i> Roupa de treino</li>
                <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-1"></i> Mentoria esportiva</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contato" className="relative py-20 bg-gradient-to-r from-[#0a1120] via-blue-950 to-[#060a13] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight uppercase tracking-tight">
              Prepare seu próximo passo<br />no futebol internacional
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Viva uma experiência única entre Espanha e Portugal<br className="hidden md:block" />
              com estrutura, mentoria e avaliação em clubes parceiros.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://wa.me/5511999999999?text=Olá,%20quero%20falar%20com%20a%20equipe%20sobre%20o%20Eurocamp" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center gap-2 bg-[#eab308] hover:bg-yellow-400 text-[#060a13] px-8 py-3.5 rounded-md font-bold transition"
              >
                FALAR COM A EQUIPE <i className="fa-brands fa-whatsapp text-lg"></i>
              </a>
              <a 
                href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20solicitar%20mais%20informações%20sobre%20o%20Eurocamp" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white px-8 py-3.5 rounded-md font-bold transition"
              >
                SOLICITAR INFORMAÇÕES <i className="fa-regular fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060a13] pt-16 pb-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full border-2 border-[#eab308] flex items-center justify-center">
                  <i className="fa-solid fa-star text-[#eab308] text-xs"></i>
                </div>
                <span className="font-bold text-xl tracking-wider">EUROCAMP</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 max-w-xs">
                Conectando talentos a oportunidades reais no futebol europeu.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Navegação</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#programa" className="hover:text-[#eab308] transition">O Programa</a></li>
                <li><a href="#clubes" className="hover:text-[#eab308] transition">Clubes</a></li>
                <li><a href="#experiencias" className="hover:text-[#eab308] transition">Experiências</a></li>
                <li><a href="#atletas" className="hover:text-[#eab308] transition">Atletas</a></li>
                <li><a href="#planos" className="hover:text-[#eab308] transition">Planos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Programa</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><span>Avaliação em clubes</span></li>
                <li><span>Acompanhamento esportivo</span></li>
                <li><span>Mentoria</span></li>
                <li><span>Experiências exclusivas</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Contato</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-center gap-3">
                  <i className="fa-brands fa-whatsapp text-gray-500 text-lg"></i>
                  <span>Atendimento oficial EC10</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 mt-8 flex items-center justify-center gap-4 text-xs text-gray-500 tracking-widest text-center">
            <i className="fa-solid fa-shield-halved text-[#eab308]/50"></i>
            <p>&copy; EUROCAMP - EXPERIÊNCIA. AVALIAÇÃO. OPORTUNIDADES.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
