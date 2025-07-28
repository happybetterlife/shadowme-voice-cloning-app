import { useState, useEffect } from 'react';
import { Language, getCurrentLanguage, setStoredLanguage, translations } from '../utils/i18n';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(getCurrentLanguage());
  
  useEffect(() => {
    // 컴포넌트 마운트 시 현재 언어 설정
    setLanguage(getCurrentLanguage());
  }, []);
  
  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    setStoredLanguage(newLang);
    // 페이지 새로고침 없이 언어 변경
    window.dispatchEvent(new Event('languagechange'));
  };
  
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
    changeLanguage,
  };
}