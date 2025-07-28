'use client';

import { useState, useEffect } from 'react';
import { Language, translations } from '../utils/i18n';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('ko'); // SSR에서는 한국어로 시작
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // 클라이언트에서 브라우저 언어 설정만 사용
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language || navigator.languages[0];
      const lang = browserLang.toLowerCase().split('-')[0];
      const detectedLang = lang === 'ko' ? 'ko' : 'en';
      setLanguage(detectedLang);
    }
  }, []);
  
  
  // 서버 사이드와 클라이언트 모두에서 같은 t 함수 사용
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
  
  return {
    t,
    language,
  };
}