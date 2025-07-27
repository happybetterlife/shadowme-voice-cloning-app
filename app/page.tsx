'use client';

import { useState, useEffect } from 'react';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { AuthScreen } from '../components/AuthScreen';
import { Dashboard } from '../components/Dashboard';
import { PracticeScreen } from '../components/PracticeScreen';
import { LevelTestScreen } from '../components/LevelTestScreen';
import { LevelSelectionScreen } from '../components/LevelSelectionScreen';
import { TestResultScreen } from '../components/TestResultScreen';
import { PermissionScreen } from '../components/PermissionScreen';
import { TutorialScreen } from '../components/TutorialScreen';
import { ExplanationScreen } from '../components/ExplanationScreen';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { apiClient } from '../utils/api';

type Screen = 'welcome' | 'auth' | 'dashboard' | 'practice' | 'levelTest' | 'levelSelection' | 'testResult' | 'settings' | 'permission' | 'tutorial' | 'explanation';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');
  const [testResults, setTestResults] = useState<any>(null);
  const [clonedVoiceData, setClonedVoiceData] = useState<{ url: string; sampleText: string; audioBlob?: Blob; sessionId?: string } | null>(null);

  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        apiClient.setAccessToken(session.access_token);
        apiClient.setUserId(session.user.id);
        loadUserProfile();
        loadClonedVoiceData(); // 저장된 클로닝 음성 데이터 로드
        setCurrentScreen('dashboard');
      }
    });
  }, []);

  const loadUserProfile = async () => {
    try {
      const { profile } = await apiClient.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  // 클로닝된 음성 데이터 로컬 스토리지에 저장
  const saveClonedVoiceData = (data: { url: string; sampleText: string; audioBlob?: Blob } | null) => {
    if (data) {
      // audioBlob은 로컬 스토리지에 저장할 수 없으므로 URL과 텍스트만 저장
      const dataToSave = { url: data.url, sampleText: data.sampleText };
      localStorage.setItem('clonedVoiceData', JSON.stringify(dataToSave));
    } else {
      localStorage.removeItem('clonedVoiceData');
    }
  };

  // 클로닝된 음성 데이터 로컬 스토리지에서 로드
  const loadClonedVoiceData = () => {
    try {
      const saved = localStorage.getItem('clonedVoiceData');
      if (saved) {
        const data = JSON.parse(saved);
        setClonedVoiceData(data);
        console.log('📦 저장된 클로닝 음성 데이터 로드:', data);
      }
    } catch (error) {
      console.error('Failed to load cloned voice data:', error);
    }
  };

  const handleAuth = (userData: any, token: string) => {
    setUser(userData);
    apiClient.setAccessToken(token);
    apiClient.setUserId(userData.id);
    
    // 회원가입인 경우 설명 화면으로 이동
    if (authMode === 'signup') {
      setCurrentScreen('explanation');
    } else {
      // 로그인인 경우 대시보드로 이동
      loadUserProfile();
      setCurrentScreen('dashboard');
    }
  };

  const handleLevelTestComplete = async (level: string) => {
    try {
      await apiClient.saveSession({
        type: 'level_test',
        level,
        completed_at: new Date().toISOString()
      });
      await loadUserProfile();
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Failed to save level test:', error);
      setCurrentScreen('dashboard');
    }
  };

  const handlePracticeComplete = async (sessionData: any) => {
    try {
      await apiClient.saveSession({
        type: 'practice',
        ...sessionData,
        practice_time: 300,
        overall_accuracy: sessionData.averageAccuracy || 75
      });
      await loadUserProfile();
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Failed to save practice session:', error);
      setCurrentScreen('dashboard');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setClonedVoiceData(null);
    saveClonedVoiceData(null); // 클로닝 음성 데이터 정리
    apiClient.setAccessToken(null);
    apiClient.setUserId(null);
    setCurrentScreen('welcome');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onGetStarted={() => {
              setAuthMode('signup');
              setCurrentScreen('auth');
            }}
            onLogin={() => {
              setAuthMode('login');
              setCurrentScreen('auth');
            }}
          />
        );
      
      case 'auth':
        return (
          <AuthScreen
            mode={authMode}
            onBack={() => setCurrentScreen('welcome')}
            onAuthSuccess={handleAuth}
          />
        );

      case 'levelSelection':
        return (
          <LevelSelectionScreen
            onNext={(level, purpose) => {
              setSelectedLevel(level);
              setSelectedPurpose(purpose);
              setCurrentScreen('tutorial');
            }}
            onBack={() => setCurrentScreen('permission')}
          />
        );

      case 'levelTest':
        return (
          <LevelTestScreen
            level={selectedLevel}
            purpose={selectedPurpose}
            clonedVoiceData={clonedVoiceData}
            onComplete={(results) => {
              setTestResults(results);
              setCurrentScreen('testResult');
            }}
          />
        );

      case 'testResult':
        return (
          <TestResultScreen
            results={testResults}
            onComplete={() => {
              handleLevelTestComplete(testResults?.adjustedLevel || selectedLevel);
            }}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            onStartPractice={() => setCurrentScreen('practice')}
            onSettings={() => setCurrentScreen('settings')}
            userProfile={userProfile}
            clonedVoiceData={clonedVoiceData}
          />
        );
      
      case 'practice':
        return (
          <PracticeScreen
            userProfile={userProfile}
            clonedVoiceData={clonedVoiceData}
            onBack={() => setCurrentScreen('dashboard')}
            onComplete={handlePracticeComplete}
          />
        );
      
      case 'permission':
        return (
          <PermissionScreen
            onPermissionGranted={() => setCurrentScreen('levelSelection')}
          />
        );
      
      case 'tutorial':
        return (
          <TutorialScreen
            onComplete={(clonedVoiceData) => {
              setClonedVoiceData(clonedVoiceData || null);
              saveClonedVoiceData(clonedVoiceData || null); // 로컬 스토리지에 저장
              loadUserProfile();
              setCurrentScreen('levelTest');
            }}
          />
        );
      
      case 'explanation':
        return (
          <ExplanationScreen
            onNext={() => setCurrentScreen('permission')}
          />
        );
      
      case 'settings':
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-sm mx-auto px-4 py-6">
              <h1 className="text-xl mb-6 text-gray-800 dark:text-gray-200">설정</h1>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-gray-700 dark:text-gray-300">다크 모드</span>
                  <button
                    onClick={toggleDarkMode}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      isDarkMode ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors min-h-[48px]"
                >
                  로그아웃
                </button>
                
                <button
                  onClick={() => setCurrentScreen('dashboard')}
                  className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors min-h-[48px]"
                >
                  돌아가기
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-full max-w-sm mx-auto ${isDarkMode ? 'dark' : ''}`}>
      {renderScreen()}
    </div>
  );
}