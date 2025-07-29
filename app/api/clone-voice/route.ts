import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_a44152702031b3af9f1a87072171fc9993fdbfb477fba26c";

// API 키 상태 자세히 확인
console.log('🔍 DETAILED API KEY CHECK:');
console.log('  - process.env.ELEVENLABS_API_KEY exists:', !!process.env.ELEVENLABS_API_KEY);
console.log('  - Final ELEVENLABS_API_KEY used:', ELEVENLABS_API_KEY.substring(0, 15) + '...');
console.log('  - Key length:', ELEVENLABS_API_KEY.length);
console.log('  - Key starts with sk_:', ELEVENLABS_API_KEY.startsWith('sk_'));
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice

// 세션별 클로닝된 음성 저장소 (메모리 기반 캐시)
const sessionVoiceCache = new Map<string, {
  voiceId: string;
  createdAt: number;
  lastUsed: number;
  sampleText: string;
}>();

// 캐시 정리 (24시간 후 만료) - 음성 제한 절약을 위해 연장
const CACHE_TIMEOUT = 24 * 60 * 60 * 1000; // 24시간

// CORS 헤더 설정
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  let body: any;
  try {
    const startTime = Date.now();
    console.log('🚨 CRITICAL: Voice cloning request received (App Router)...');
    console.log('🚨 Request method:', request.method);
    console.log('🚨 Deploy timestamp:', new Date().toISOString());
    console.log('🚨 Environment check:');
    console.log('  - ELEVENLABS_API_KEY exists:', !!ELEVENLABS_API_KEY);
    console.log('  - ELEVENLABS_API_KEY length:', ELEVENLABS_API_KEY ? ELEVENLABS_API_KEY.length : 0);
    console.log('  - Current time:', new Date().toISOString());
    console.log('  - Vercel region:', process.env.VERCEL_REGION || 'unknown');
    console.log('  - Function timeout limit: 60 seconds (configured in vercel.json)');
    
    body = await request.json();
    console.log('🚨 Request body keys:', Object.keys(body));
    console.log('🚨 Request body size:', JSON.stringify(body).length);
    
    const { text = "Hello, how are you today?", audioData, sessionId } = body;
    
    console.log('🚨 EXTRACTED DATA:');
    console.log('  - text:', text);
    console.log('  - audioData exists:', !!audioData);
    console.log('  - audioData length:', audioData ? audioData.length : 0);
    console.log('  - sessionId:', sessionId);
    
    console.log('📝 Text received:', text);
    console.log('🎵 Audio data present:', !!audioData);
    console.log('🎵 Audio data type:', typeof audioData);
    console.log('🎵 Audio data length:', audioData ? audioData.length : 0);
    console.log('🎵 Audio data starts with:', audioData ? audioData.substring(0, 50) : 'N/A');
    console.log('🆔 Session ID:', sessionId);
    
    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY.length === 0) {
      console.error('❌ ELEVENLABS_API_KEY is not set!');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    if (!audioData || audioData.length < 100) {
      console.log('❌ CRITICAL: No valid audio data provided, using default voice');
      console.log('🔍 Reason: audioData is', audioData ? `too short (${audioData.length} chars)` : 'missing');
      console.log('🚨 FALLBACK: Using default Rachel voice instead of user voice');
      return await generateWithDefaultVoice(text);
    }

    // 세션별 캐시된 음성 확인 (지연시간 최적화)
    if (sessionId) {
      const cachedVoice = sessionVoiceCache.get(sessionId);
      if (cachedVoice && (Date.now() - cachedVoice.lastUsed) < CACHE_TIMEOUT) {
        console.log('⚡ 캐시된 음성 발견! 즉시 TTS 생성:', cachedVoice.voiceId);
        
        // 캐시된 음성으로 즉시 TTS 생성 (클로닝 단계 생략)
        const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cachedVoice.voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.7,
              similarity_boost: 0.8,
              style: 0.5,
              use_speaker_boost: true,
            },
          }),
        });

        if (ttsResponse.ok) {
          // 사용 시간 업데이트
          cachedVoice.lastUsed = Date.now();
          sessionVoiceCache.set(sessionId, cachedVoice);
          
          const audioBuffer = await ttsResponse.arrayBuffer();
          console.log('✅🎉 캐시된 클로닝 음성으로 TTS 완료 (초고속)');
          console.log('🗣️ THIS IS YOUR CACHED CLONED VOICE!');
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Content-Disposition': 'attachment; filename="cached_cloned_voice.mp3"',
            },
          });
        } else {
          console.warn('⚠️ 캐시된 음성으로 TTS 실패, 음성 재생성 필요');
          // 캐시 삭제하고 새로 생성
          sessionVoiceCache.delete(sessionId);
        }
      } else if (cachedVoice) {
        console.log('🗑️ 만료된 캐시 음성 삭제:', sessionId);
        sessionVoiceCache.delete(sessionId);
        
        // ElevenLabs에서도 정리
        try {
          await fetch(`https://api.elevenlabs.io/v1/voices/${cachedVoice.voiceId}`, {
            method: 'DELETE',
            headers: { 'xi-api-key': ELEVENLABS_API_KEY },
          });
        } catch (e) { console.warn('음성 정리 실패:', e); }
      }
    }

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(audioData.split(',')[1], 'base64');
    console.log('📁 Audio data received, size:', audioBuffer.length);
    
    // ElevenLabs 최소 요구사항 체크
    if (audioBuffer.length < 10000) { // 10KB 미만이면 너무 짧음
      console.warn('⚠️ Audio file too small for voice cloning:', audioBuffer.length, 'bytes');
      console.warn('⚠️ ElevenLabs requires at least 1-2 seconds of audio');
      return await generateWithDefaultVoice(text, `Audio file too small: ${audioBuffer.length} bytes (minimum: 10KB)`);
    }
    
    console.log('🧬 Creating voice clone with ElevenLabs...');
    console.log('📊 Environment check:');
    console.log('  - Runtime:', typeof process !== 'undefined' ? 'Node.js' : 'Browser');
    console.log('  - Platform:', typeof process !== 'undefined' ? process.platform : 'Unknown');
    console.log('  - Memory usage:', typeof process !== 'undefined' && process.memoryUsage ? process.memoryUsage() : 'Unknown');
    
    // 실행 시간 체크 - Vercel 함수 타임아웃 방지
    const checkTimeout = () => {
      const elapsed = Date.now() - startTime;
      console.log(`⏱️ Elapsed time: ${elapsed}ms`);
      if (elapsed > 50000) { // 50초 경과시 경고 (60초 제한)
        console.warn('⚠️ Approaching Vercel timeout limit (60s)!');
        return true;
      }
      return false;
    };

    // Step 1: Create voice clone using IVC (Instant Voice Cloning) 
    console.log('🧬 Step 1: Creating voice clone...');
    if (checkTimeout()) {
      console.error('❌ Timeout risk - using fallback voice');
      return await generateWithDefaultVoice(text);
    }
    
    // 오디오 데이터의 실제 형식 감지
    let fileExtension = 'webm';
    let mimeType = 'audio/webm';
    
    // Base64 헤더에서 MIME 타입 추출
    const base64Header = audioData.split(',')[0];
    if (base64Header.includes('audio/webm')) {
      fileExtension = 'webm';
      mimeType = 'audio/webm';
      console.log('🎵 WebM audio detected - ElevenLabs should handle this');
    } else if (base64Header.includes('audio/mp4')) {
      fileExtension = 'mp4';
      mimeType = 'audio/mp4';
      console.log('⚠️ MP4 audio detected - may cause compatibility issues');
    } else if (base64Header.includes('audio/aac')) {
      fileExtension = 'aac';
      mimeType = 'audio/aac';
      console.log('⚠️ AAC audio detected - may cause compatibility issues');
    } else {
      console.log('⚠️ Unknown audio format, defaulting to WebM');
    }
    
    console.log('🎵 Detected audio format:', { mimeType, fileExtension });
    console.log('📦 Audio buffer size:', audioBuffer.length, 'bytes');
    
    // Vercel 환경에서 FormData 호환성을 위한 개선된 방식
    const formData = new FormData();
    formData.append('name', `user_voice_${Date.now()}`);
    formData.append('description', 'User voice for pronunciation learning');
    
    // File 객체로 생성하여 호환성 향상
    const audioFile = new File([audioBuffer], `recording.${fileExtension}`, { 
      type: mimeType,
      lastModified: Date.now()
    });
    formData.append('files', audioFile);

    console.log('🌐 Making ElevenLabs voice clone request...');
    console.log('📊 FormData contents:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  - ${key}: File(name=${value.name}, size=${value.size}, type=${value.type})`);
      } else {
        console.log(`  - ${key}: ${value}`);
      }
    }
    
    const cloneResponse = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: formData,
    });
    
    if (checkTimeout()) {
      console.error('❌ Timeout after voice clone request');
      return await generateWithDefaultVoice(text);
    }

    if (!cloneResponse.ok) {
      const errorText = await cloneResponse.text();
      console.error('❌ Voice cloning failed:', errorText);
      console.error('❌ Response status:', cloneResponse.status);
      console.error('❌ Response headers:', Object.fromEntries(cloneResponse.headers.entries()));
      
      // 상세한 오류 분석
      if (cloneResponse.status === 401) {
        console.error('🔑 AUTHENTICATION ERROR: API key may be invalid or expired');
      } else if (cloneResponse.status === 429) {
        console.error('⏰ RATE LIMIT ERROR: Too many requests');
      } else if (cloneResponse.status === 402) {
        console.error('💳 PAYMENT ERROR: Account may have reached quota limits');
      } else if (cloneResponse.status === 403 && errorText.includes('voice_add_edit_limit_reached')) {
        console.error('📅 MONTHLY LIMIT ERROR: ElevenLabs monthly voice cloning limit reached');
        console.error('💡 SOLUTION: Delete old voices or upgrade plan');
      } else if (errorText.includes('voice_limit_reached')) {
        console.error('🎤 VOICE LIMIT ERROR: Account has reached voice cloning limit');
      }
      
      // If voice limit reached, try to clean up old voices first
      if (errorText.includes('voice_limit_reached')) {
        console.log('🧹 Voice limit reached, attempting to clean up old voices...');
        await cleanupOldVoices();
        // Retry once after cleanup
        console.log('🔄 Retrying voice cloning after cleanup...');
        const retryResponse = await fetch('https://api.elevenlabs.io/v1/voices/add', {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
          },
          body: formData,
        });
        
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          const retryVoiceId = retryData.voice_id;
          console.log('✅ Voice cloned successfully after cleanup! Voice ID:', retryVoiceId);
          
          // Continue with TTS generation
          const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${retryVoiceId}`, {
            method: 'POST',
            headers: {
              'xi-api-key': ELEVENLABS_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.7,
                similarity_boost: 0.8,
                style: 0.5,
                use_speaker_boost: true,
              },
            }),
          });
          
          if (ttsResponse.ok) {
            const finalAudioBuffer = await ttsResponse.arrayBuffer();
            
            // Clean up immediately
            try {
              await fetch(`https://api.elevenlabs.io/v1/voices/${retryVoiceId}`, {
                method: 'DELETE',
                headers: { 'xi-api-key': ELEVENLABS_API_KEY },
              });
              console.log('🗑️ Temporary voice cleaned up immediately');
            } catch (e) { console.warn('Failed to delete voice:', e); }
            
            return new NextResponse(finalAudioBuffer, {
              headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'attachment; filename="cloned_voice.mp3"',
              },
            });
          }
        }
      }
      
      // Fallback to default voice
      return await generateWithDefaultVoice(text, `ElevenLabs voice cloning failed: ${cloneResponse.status} - ${errorText.substring(0, 100)}`);
    }

    const cloneData = await cloneResponse.json();
    const clonedVoiceId = cloneData.voice_id;
    
    console.log('✅ Voice cloned successfully! Voice ID:', clonedVoiceId);
    
    // 세션별 음성 캐시에 저장 (재사용을 위해)
    if (sessionId) {
      sessionVoiceCache.set(sessionId, {
        voiceId: clonedVoiceId,
        createdAt: Date.now(),
        lastUsed: Date.now(),
        sampleText: text
      });
      console.log('💾 세션 음성 캐시에 저장:', sessionId, '->', clonedVoiceId);
      console.log('📊 현재 캐시된 세션들:', Array.from(sessionVoiceCache.keys()));
    } else {
      console.warn('⚠️ sessionId가 없어서 캐시에 저장하지 못했습니다!');
    }

    // Step 2: Generate speech with cloned voice
    console.log('🗣️ Step 2: Generating speech with cloned voice...');
    if (checkTimeout()) {
      console.error('❌ Timeout before TTS generation');
      return await generateWithDefaultVoice(text);
    }
    
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${clonedVoiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('❌ TTS with cloned voice failed:', errorText);
      
      // Clean up the voice
      try {
        await fetch(`https://api.elevenlabs.io/v1/voices/${clonedVoiceId}`, {
          method: 'DELETE',
          headers: { 'xi-api-key': ELEVENLABS_API_KEY },
        });
      } catch (e) { console.warn('Failed to delete voice:', e); }
      
      return await generateWithDefaultVoice(text);
    }

    const finalAudioBuffer = await ttsResponse.arrayBuffer();
    
    const totalTime = Date.now() - startTime;
    console.log('🎉🎉🎉 VOICE CLONING COMPLETED SUCCESSFULLY! 🎉🎉🎉');
    console.log('🗣️ THIS IS YOUR CLONED VOICE - NOT DEFAULT VOICE!');
    console.log(`⏱️ Total execution time: ${totalTime}ms`);
    console.log(`🎯 Cloned voice ID used: ${clonedVoiceId}`);
    
    // 주의: 음성을 즉시 삭제하지 않음 (캐시된 음성 재사용을 위해)
    // 30분 후 자동으로 정리되도록 설정됨
    console.log('💾 음성 캐시에 보관됨 (30분 후 자동 정리)');

    return new NextResponse(finalAudioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="cloned_voice.mp3"',
        'Access-Control-Allow-Origin': '*',
        'Accept-Ranges': 'bytes',
      },
    });

  } catch (error) {
    console.error('💥 Voice cloning error:', error);
    return await generateWithDefaultVoice(body?.text || "Hello, how are you today?");
  }
}

async function generateWithDefaultVoice(text: string, reason: string = 'Voice cloning failed') {
  try {
    console.log('🚨🚨🚨 USING DEFAULT VOICE FALLBACK - NOT USER VOICE! 🚨🚨🚨');
    console.log('🔄 Reason:', reason);
    console.log('🔄 Using Rachel voice instead of user voice');
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8,
        },
      }),
    });

    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': 'inline; filename="fallback_voice.mp3"',
          'Access-Control-Allow-Origin': '*',
          'Accept-Ranges': 'bytes',
          'X-Fallback-Reason': reason.substring(0, 200), // 실패 이유를 헤더에 포함
        },
      });
    } else {
      const errorText = await response.text();
      console.error('❌ Fallback voice generation failed:', errorText);
    }
  } catch (error) {
    console.error('💥 Fallback voice generation failed:', error);
  }

  return NextResponse.json({ error: 'All voice generation methods failed' }, { status: 500 });
}

async function cleanupOldVoices() {
  try {
    console.log('🔍 Fetching current voices...');
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': ELEVENLABS_API_KEY },
    });
    
    if (response.ok) {
      const data = await response.json();
      const userVoices = data.voices.filter((voice: any) => 
        voice.name.startsWith('user_voice_') && voice.category === 'cloned'
      );
      
      console.log(`🎯 Found ${userVoices.length} user voices to clean up`);
      
      // Delete oldest user voices (keep only the most recent 2)
      const voicesToDelete = userVoices.slice(0, -2);
      
      for (const voice of voicesToDelete) {
        try {
          await fetch(`https://api.elevenlabs.io/v1/voices/${voice.voice_id}`, {
            method: 'DELETE',
            headers: { 'xi-api-key': ELEVENLABS_API_KEY },
          });
          console.log(`🗑️ Deleted old voice: ${voice.name}`);
        } catch (e) {
          console.warn(`Failed to delete voice ${voice.name}:`, e);
        }
      }
      
      console.log('✅ Cleanup completed');
    }
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

// 만료된 세션 캐시 정리 함수
function cleanupExpiredSessions() {
  const now = Date.now();
  const sessionsToDelete: string[] = [];
  
  for (const [sessionId, voice] of sessionVoiceCache) {
    if (now - voice.lastUsed > CACHE_TIMEOUT) {
      sessionsToDelete.push(sessionId);
      
      // ElevenLabs에서 음성 삭제
      fetch(`https://api.elevenlabs.io/v1/voices/${voice.voiceId}`, {
        method: 'DELETE',
        headers: { 'xi-api-key': ELEVENLABS_API_KEY },
      }).catch(e => console.warn('음성 삭제 실패:', e));
    }
  }
  
  sessionsToDelete.forEach(sessionId => {
    sessionVoiceCache.delete(sessionId);
    console.log('🗑️ 만료된 세션 정리:', sessionId);
  });
  
  if (sessionsToDelete.length > 0) {
    console.log(`✅ ${sessionsToDelete.length}개 만료된 세션 정리 완료`);
  }
}

// 정기적 캐시 정리 (10분마다)
setInterval(cleanupExpiredSessions, 10 * 60 * 1000);