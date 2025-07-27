import { useState } from 'react';
import { Button } from './ui/button';
import { GradientButton } from './GradientButton';
import { Mic, Shield, Lock } from 'lucide-react';

// 마이크 권한 요청 함수
const requestMicrophonePermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch {
    return false;
  }
};

interface PermissionScreenProps {
  onPermissionGranted: () => void;
}

export function PermissionScreen({ onPermissionGranted }: PermissionScreenProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isGranted, setIsGranted] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    
    const success = await requestMicrophonePermission();
    
    if (success) {
      setIsGranted(true);
      setTimeout(() => {
        onPermissionGranted();
      }, 1000);
    } else {
      alert('마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크를 허용해주세요.');
    }
    
    setIsRequesting(false);
  };

  if (isGranted) {
    return (
      <div className="min-h-screen bg-background flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="w-24 h-24 rounded-full bg-app-success flex items-center justify-center">
            <span className="text-white text-3xl">✓</span>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-app-success">마이크 권한 허용됨!</h2>
            <p className="text-muted-foreground">
              AI 음성 복제 기능을 사용할 수 있습니다.
            </p>
          </div>
          
          <Button onClick={onPermissionGranted} className="w-full" size="lg">
            바로 시작하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
          isRequesting ? 'gradient-primary animate-pulse' : 'gradient-primary'
        }`}>
          <Mic className="w-12 h-12 text-white" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            {isRequesting ? '마이크 권한 요청 중...' : '마이크 권한이 필요합니다'}
          </h2>
          <p className="text-muted-foreground">
            {isRequesting 
              ? '브라우저에서 마이크 권한을 요청하고 있습니다.'
              : 'ShadowMe는 당신의 목소리로 네이티브 발음을 학습하는 앱입니다.'
            }
          </p>
        </div>

        {!isRequesting && (
          <>
            <div className="w-full p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
              <div className="text-center space-y-2">
                <h4 className="text-blue-800 font-medium text-sm">🎯 ShadowMe 핵심 기능</h4>
                <p className="text-blue-700 text-xs">
                  • 내 목소리로 네이티브 발음 생성<br/>
                  • 실시간 발음 정확도 피드백<br/>
                  • AI 복제 음성으로 섀도잉 학습
                </p>
              </div>
            </div>
            
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Shield className="w-5 h-5 text-app-success" />
                <span className="text-sm">녹음 데이터는 사용자 디바이스에 저장됩니다</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Lock className="w-5 h-5 text-app-success" />
                <span className="text-sm">개인정보는 절대 공유되지 않습니다</span>
              </div>
            </div>
          </>
        )}
        
        <GradientButton 
          onClick={handleRequestPermission}
          size="lg"
          disabled={isRequesting}
          className="w-full min-h-[56px]"
        >
          <Mic className="w-5 h-5 mr-2" />
          {isRequesting ? '권한 요청 중...' : '마이크 권한 허용하고 시작'}
        </GradientButton>
        
        {isRequesting && (
          <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-xs text-center">
              💡 브라우저 팝업에서 "허용"을 선택해주세요
            </p>
          </div>
        )}
      </div>
      
      {isGranted && (
        <div className="flex justify-center">
          <GradientButton 
            variant="secondary"
            onClick={onPermissionGranted}
            size="lg"
            className="min-h-[56px]"
          >
            계속
          </GradientButton>
        </div>
      )}
    </div>
  );
}