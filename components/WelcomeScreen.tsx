import { GradientButton } from './GradientButton';
import { WaveformVisualizer } from './WaveformVisualizer';
import { Mic, Volume2, Brain, Zap, Globe } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/i18n';
import { Button } from './ui/button';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function WelcomeScreen({ onGetStarted, onLogin }: WelcomeScreenProps) {
  const { t, language, changeLanguage } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full px-4 py-8 flex flex-col justify-center min-h-screen">
        
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-600" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeLanguage(language === 'ko' ? 'en' : 'ko')}
            className="text-sm"
          >
            {language === 'ko' ? 'EN' : '한국어'}
          </Button>
        </div>
        
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="relative">
                <Mic className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <Brain className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              {t('appName')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 px-2">
              {t('appDescription')}
            </p>
          </div>
          
          {/* Waveform Animation */}
          <div className="mb-6">
            <WaveformVisualizer isActive={true} className="opacity-60" />
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                  {t('voiceCloning')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('voiceCloningDesc')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                  {t('personalizedLearning')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('personalizedLearningDesc')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                  {t('realtimeFeedback')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('realtimeFeedbackDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <GradientButton 
            size="lg" 
            onClick={onGetStarted}
            className="w-full min-h-[56px]"
          >
            {t('getStarted')}
          </GradientButton>
          <GradientButton 
            size="lg" 
            variant="secondary"
            onClick={onLogin}
            className="w-full min-h-[56px]"
          >
            {t('login')}
          </GradientButton>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 px-4">
            개인정보는 사용자 기기에만 저장되며 외부로 전송되지 않습니다
          </p>
        </div>
      </div>
    </div>
  );
}