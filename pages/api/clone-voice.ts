import { NextApiRequest, NextApiResponse } from 'next';
import { cacheVoiceClone } from './generate-speech';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_a44152702031b3af9f1a87072171fc9993fdbfb477fba26c";
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice

// 세션별 클로닝된 음성 저장소 (메모리 기반 캐시)
const sessionVoiceCache = new Map<string, {
  voiceId: string;
  createdAt: number;
  lastUsed: number;
  sampleText: string;
}>();

// 캐시 정리 (30분 후 만료)
const CACHE_TIMEOUT = 30 * 60 * 1000; // 30분

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🎤 Voice cloning request received...');
    console.log('📝 Request body keys:', Object.keys(req.body));
    
    const { text = "Hello, how are you today?", audioData, sessionId } = req.body;
    
    console.log('📝 Text received:', text);
    console.log('🎵 Audio data present:', !!audioData);
    console.log('🎵 Audio data type:', typeof audioData);
    console.log('🆔 Session ID:', sessionId);
    
    if (!audioData) {
      console.log('❌ No audio data provided, using default voice');
      return await generateWithDefaultVoice(text, res);
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
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Content-Disposition', 'attachment; filename="cached_cloned_voice.mp3"');
          console.log('✅ 캐시된 음성으로 TTS 완료 (초고속)');
          return res.send(Buffer.from(audioBuffer));
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
    
    console.log('🧬 Creating voice clone with ElevenLabs...');
    
    // Step 1: Create voice clone using IVC (Instant Voice Cloning) 
    const formData = new FormData();
    formData.append('name', `user_voice_${Date.now()}`);
    formData.append('description', 'User voice for pronunciation learning');
    
    // Create blob from buffer
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
    formData.append('files', audioBlob, 'recording.webm');

    const cloneResponse = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: formData,
    });

    if (!cloneResponse.ok) {
      const errorText = await cloneResponse.text();
      console.error('❌ Voice cloning failed:', errorText);
      
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
            
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Content-Disposition', 'attachment; filename="cloned_voice.mp3"');
            return res.send(Buffer.from(finalAudioBuffer));
          }
        }
      }
      
      // Fallback to default voice
      return await generateWithDefaultVoice(text, res);
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
      
      // generate-speech API용 캐시에도 저장
      cacheVoiceClone(sessionId, clonedVoiceId, text);
    } else {
      console.warn('⚠️ sessionId가 없어서 캐시에 저장하지 못했습니다!');
    }

    // Step 2: Generate speech with cloned voice
    console.log('🗣️ Generating speech with cloned voice...');
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
      
      return await generateWithDefaultVoice(text, res);
    }

    const finalAudioBuffer = await ttsResponse.arrayBuffer();
    
    console.log('🎉 Voice cloning completed successfully!');
    
    // 주의: 음성을 즉시 삭제하지 않음 (캐시된 음성 재사용을 위해)
    // 30분 후 자동으로 정리되도록 설정됨
    console.log('💾 음성 캐시에 보관됨 (30분 후 자동 정리)');

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline; filename="cloned_voice.mp3"');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Accept-Ranges', 'bytes');
    return res.send(Buffer.from(finalAudioBuffer));

  } catch (error) {
    console.error('💥 Voice cloning error:', error);
    return await generateWithDefaultVoice(req.body?.text || "Hello, how are you today?", res);
  }
}

async function generateWithDefaultVoice(text: string, res: NextApiResponse) {
  try {
    console.log('🔄 Using default voice fallback...');
    
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
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', 'inline; filename="fallback_voice.mp3"');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Accept-Ranges', 'bytes');
      return res.send(Buffer.from(audioBuffer));
    } else {
      const errorText = await response.text();
      console.error('❌ Fallback voice generation failed:', errorText);
    }
  } catch (error) {
    console.error('💥 Fallback voice generation failed:', error);
  }

  return res.status(500).json({ error: 'All voice generation methods failed' });
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}