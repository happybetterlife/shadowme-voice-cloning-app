import React, { useState } from 'react';
import { Input } from './ui/input';
import { GradientButton } from './GradientButton';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { apiClient } from '../utils/api';

interface AuthScreenProps {
  onBack: () => void;
  onAuthSuccess: (user: any, token: string) => void;
  mode: 'login' | 'signup';
}

export function AuthScreen({ onBack, onAuthSuccess, mode }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        apiClient.setAccessToken(data.session.access_token);
        apiClient.setUserId(data.user.id);
        onAuthSuccess(data.user, data.session.access_token);
      } else {
        // 회원가입: Supabase Auth를 직접 사용
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              level: 'beginner',
              purpose: 'conversation'
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // 사용자 프로필을 로컬 스토리지에 저장 (임시)
          const profile = {
            id: data.user.id,
            email: formData.email,
            name: formData.name,
            level: 'beginner',
            purpose: 'conversation',
            created_at: new Date().toISOString(),
            streak_count: 0,
            total_practice_time: 0,
            total_sessions: 0,
            average_accuracy: 0
          };
          
          localStorage.setItem(`user_profile_${data.user.id}`, JSON.stringify(profile));
          
          // 자동 로그인
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          if (loginError) throw loginError;

          apiClient.setAccessToken(loginData.session.access_token);
          apiClient.setUserId(loginData.user.id);
          onAuthSuccess(loginData.user, loginData.session.access_token);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      alert(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col text-white">
      <div className="w-full px-4 py-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors mb-6 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="w-full max-w-sm mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-xl border border-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {isLogin ? '로그인' : '회원가입'}
              </h1>
              <p className="text-gray-700 text-sm">
                {isLogin ? (
                  <>
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">ShadowME</span>
                    <span className="text-gray-700">에 로그인하세요</span>
                  </>
                ) : (
                  <>
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">ShadowME</span>
                    <span className="text-gray-700"> 계정을 만들어보세요</span>
                  </>
                )}
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="이름"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 min-h-[48px] bg-white border-gray-300 text-gray-700 placeholder:text-gray-400"
                      required
                    />
                  </div>
                )}
                
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="이메일"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 min-h-[48px] bg-white border-gray-300 text-gray-700 placeholder:text-gray-400"
                    required
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="비밀번호"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 min-h-[48px] bg-white border-gray-300 text-gray-700 placeholder:text-gray-400"
                    required
                  />
                </div>

                <GradientButton
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[56px] bg-white text-blue-600 hover:bg-white/90"
                  size="lg"
                >
                  {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
                </GradientButton>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 text-sm min-h-[44px] px-4 flex items-center justify-center mx-auto transition-colors"
                >
                  {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}