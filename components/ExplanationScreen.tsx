import { Button } from './ui/button';
import { GradientButton } from './GradientButton';
import { WaveformVisualizer } from './WaveformVisualizer';
import { Play, User, Volume2, Brain, Zap, ArrowDown, Globe } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface ExplanationScreenProps {
  onNext: () => void;
}

export function ExplanationScreen({ onNext }: ExplanationScreenProps) {
  const { t, language, changeLanguage } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full px-4 py-8 flex flex-col justify-center min-h-screen">
        
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => changeLanguage(language === 'ko' ? 'en' : 'ko')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            {language === 'ko' ? 'EN' : '한국어'}
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            {t('voiceCloning')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 px-2">
            {t('voiceCloningDesc')}
          </p>
          
          {/* Waveform Animation */}
          <div className="mt-6">
            <WaveformVisualizer isActive={true} className="opacity-60" />
          </div>
        </div>
        
        {/* Key Features */}
        <div className="space-y-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                  {t('step1Title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('step1Desc')}
                </p>
              </div>
              <WaveformVisualizer size="sm" />
            </div>
          </div>
          
          <div className="flex justify-center py-2">
            <ArrowDown className="w-6 h-6 text-blue-500 animate-bounce" />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                  {t('step2Title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('step2Desc')}
                </p>
              </div>
              <WaveformVisualizer isActive size="sm" />
            </div>
          </div>
          
          <div className="flex justify-center py-2">
            <ArrowDown className="w-6 h-6 text-green-500 animate-bounce" />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                  {t('step3Title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('step3Desc')}
                </p>
              </div>
              <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                <Play className="w-4 h-4 mr-1" />
                {t('listen')}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">{t('whyEffective')}</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{t('familiarity')}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">{t('familiarityDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Brain className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{t('accuracyBenefit')}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">{t('accuracyBenefitDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Volume2 className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{t('motivation')}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">{t('motivationDesc')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <GradientButton onClick={onNext} className="w-full" size="lg">
            {t('setupLearning')}
          </GradientButton>
          {/* 삭제됨 */}
        </div>
      </div>
    </div>
  );
}