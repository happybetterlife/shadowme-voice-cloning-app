'use client';

import { useState, useEffect } from 'react';
import { Language, translations } from '../utils/i18n';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('ko');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // 클라이언트에서만 언어 감지
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferredLanguage') as Language | null;
      if (stored) {
        setLanguage(stored);
      } else {
        const browserLang = navigator.language || navigator.languages[0];
        const lang = browserLang.toLowerCase().split('-')[0];
        setLanguage(lang === 'ko' ? 'ko' : 'en');
      }
    }
  }, []);
  
  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', newLang);
      window.dispatchEvent(new Event('languagechange'));
    }
  };
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
  
  // 서버 사이드에서는 기본값 반환
  if (!mounted) {
    return {
      t: (key: string) => key,
      language: 'ko' as Language,
      changeLanguage: () => {},
    };
  }
  
  return {
    t,
    language,
    changeLanguage,
  };
}