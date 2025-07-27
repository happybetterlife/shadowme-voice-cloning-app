import { useState, useRef } from 'react';

export default function SafariTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testRecording = async () => {
    try {
      addLog('🎤 Starting Safari recording test...');
      
      // 브라우저 감지
      const userAgent = navigator.userAgent;
      const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
      addLog(`📱 Browser: ${isSafari ? 'Safari' : 'Other'} (${userAgent})`);
      
      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      addLog('✅ Microphone access granted');
      
      // 지원되는 MIME 타입 확인
      const supportedTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/mp4',
        'audio/aac',
        'audio/wav',
        'audio/mpeg'
      ];
      
      const supported = supportedTypes.filter(type => MediaRecorder.isTypeSupported(type));
      addLog(`🎵 Supported formats: ${supported.join(', ') || 'None'}`);
      
      // 가장 적합한 형식 선택
      let options: MediaRecorderOptions = {};
      if (isSafari) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4' };
        } else if (MediaRecorder.isTypeSupported('audio/aac')) {
          options = { mimeType: 'audio/aac' };
        }
      } else {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          options = { mimeType: 'audio/webm;codecs=opus' };
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm' };
        }
      }
      
      addLog(`🎯 Using format: ${JSON.stringify(options)}`);
      
      // MediaRecorder 생성
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          addLog(`📦 Data chunk received: ${event.data.size} bytes`);
        }
      };
      
      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        addLog(`🎵 Recording stopped. Blob created: ${blob.size} bytes, type: ${blob.type}`);
        
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Base64로 변환해서 API 호출 테스트
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          addLog(`📝 Base64 length: ${base64.length}`);
          addLog(`📝 Base64 header: ${base64.substring(0, 50)}...`);
          
          // API 테스트
          testAPI(base64);
        };
        reader.readAsDataURL(blob);
        
        // 스트림 정리
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.onerror = (event) => {
        addLog(`❌ Recording error: ${event}`);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      addLog('🎙️ Recording started...');
      
      // 3초 후 자동 정지
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 3000);
      
    } catch (error) {
      addLog(`❌ Error: ${error}`);
      setIsRecording(false);
    }
  };

  const testAPI = async (base64Audio: string) => {
    try {
      addLog('🌐 Testing API call...');
      const response = await fetch('/api/clone-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Safari test',
          audioData: base64Audio,
          sessionId: 'safari-test'
        }),
      });
      
      addLog(`📡 API Response: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        addLog('✅ API call successful!');
      } else {
        const errorText = await response.text();
        addLog(`❌ API error: ${errorText}`);
      }
    } catch (error) {
      addLog(`❌ API call failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🧪 Safari 음성 녹음 테스트</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={testRecording}
            disabled={isRecording}
            className={`w-full py-4 px-6 rounded-lg text-white font-semibold ${
              isRecording 
                ? 'bg-red-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isRecording ? '🎙️ 녹음 중... (3초)' : '🎤 녹음 테스트 시작'}
          </button>
        </div>

        {audioUrl && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">녹음된 오디오</h2>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">실시간 로그</h2>
          <div className="h-96 overflow-y-auto bg-gray-50 p-4 rounded font-mono text-sm">
            {log.map((entry, index) => (
              <div key={index} className="mb-1">
                {entry}
              </div>
            ))}
          </div>
          <button
            onClick={() => setLog([])}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            로그 지우기
          </button>
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