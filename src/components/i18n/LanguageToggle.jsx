import React from 'react';
import { useLanguage } from './LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function LanguageToggle({ variant = 'default', className = '' }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      onClick={toggleLanguage}
      variant={variant}
      size="sm"
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        key={language}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="flex items-center gap-2"
      >
        <span className="text-lg">{language === 'pt' ? '🇧🇷' : '🇪🇸'}</span>
        <span className="font-bold uppercase">{language}</span>
      </motion.div>
    </Button>
  );
}