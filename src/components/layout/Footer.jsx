import React from 'react';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/50 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <img 
            src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" 
            alt="EC10 Logo" 
            className="h-10 mx-auto md:mx-0 mb-4"
          />
          <p className="text-gray-400 text-sm">Transformando paixão em uma carreira de sucesso no futebol.</p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Contato</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-center justify-center md:justify-start gap-2 hover:text-white">
              <Mail className="w-4 h-4" />
              <span>contato@ec10talentos.com</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-2 hover:text-white">
              <Phone className="w-4 h-4" />
              <span>+351 914 945 252</span>
            </li>
          </ul>
        </div>
        <div>
           <h4 className="font-bold text-white mb-4">Legal</h4>
           <p className="text-gray-400 text-sm">CNPJ: 54.433.892/0001-43</p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-800/50 text-center text-gray-500 text-xs">
        <p>© {new Date().getFullYear()} EC10 Talentos. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}