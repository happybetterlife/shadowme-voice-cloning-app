import { useState, useEffect } from 'react';

export default function TestMicrophone() {
  const [microphoneStatus, setMicrophoneStatus] = useState<string>('초기화 중...');
  const [httpsStatus, setHttpsStatus] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<string>('');

  useEffect(() => {
    // HTTPS 체크
    setHttpsStatus(window.location.protocol === 'https:' ? '✅ HTTPS 연결' : '❌ HTTP 연결 (HTTPS 필요)');

    // 마이크 권한 체크
    async function checkMicrophone() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicrophoneStatus('✅ 마이크 권한 허용됨');
        
        // 마이크 테스트
        const mediaRecorder = new MediaRecorder(stream);
        let chunks: Blob[] = [];
        
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          setMicrophoneStatus(`✅ 마이크 권한 허용됨 (${audioBlob.size} bytes 녹음 가능)`);
        };
        
        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 1000);
        
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        setMicrophoneStatus(`❌ 마이크 권한 거부됨: ${error}`);
      }
    }

    // API 테스트
    async function testAPI() {
      try {
        const response = await fetch('/api/test-voice');
        if (response.ok) {
          const data = await response.json();
          setApiStatus(`✅ API 작동 중: ${JSON.stringify(data)}`);
        } else {
          setApiStatus(`❌ API 오류: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        setApiStatus(`❌ API 연결 실패: ${error}`);
      }
    }

    checkMicrophone();
    testAPI();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔧 시스템 진단 테스트</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">연결 상태</h2>
          <div className="space-y-2">
            <p className="text-lg">{httpsStatus}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">마이크 권한</h2>
          <div className="space-y-2">
            <p className="text-lg">{microphoneStatus}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API 상태</h2>
          <div className="space-y-2">
            <p className="text-lg">{apiStatus}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">문제 해결 가이드</h2>
          <div className="space-y-2 text-gray-700">
            <p>1. HTTPS가 아닌 경우: 브라우저에서 마이크 권한이 차단됩니다.</p>
            <p>2. 마이크 권한이 거부된 경우: 브라우저 설정에서 마이크 권한을 허용해주세요.</p>
            <p>3. API가 작동하지 않는 경우: 서버 배포 상태를 확인해주세요.</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}