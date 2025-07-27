import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_a44152702031b3af9f1a87072171fc9993fdbfb477fba26c";
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice

// 클로닝된 음성 세션 저장소 (실제 프로덕션에서는 데이터베이스 사용)
const voiceCloneCache = new Map<string, {
  voiceId: string;
  createdAt: number;
  sampleText: string;
}>();

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Speech generation request received (App Router)...');
    const body = await request.json();
    const { text, sessionId, useClonedVoice = false } = body;
    
    console.log('📝 Text:', text);
    console.log('🆔 Session ID:', sessionId);
    console.log('🎭 Use cloned voice:', useClonedVoice);
    
    let voiceId = DEFAULT_VOICE_ID;
    
    // 클로닝된 음성 사용 요청이고 세션 ID가 있는 경우
    if (useClonedVoice && sessionId) {
      console.log('🔍 캐시된 음성 찾는 중... sessionId:', sessionId);
      console.log('📊 현재 캐시된 세션들:', Array.from(voiceCloneCache.keys()));
      
      const cachedVoice = voiceCloneCache.get(sessionId);
      if (cachedVoice) {
        voiceId = cachedVoice.voiceId;
        console.log('⚡ 캐시된 클로닝 음성 사용:', voiceId);
      } else {
        console.log('⚠️ 세션에 캐시된 음성 없음, 기본 음성 사용 (먼저 샘플 녹음 필요)');
        console.log('🔑 요청된 sessionId:', sessionId);
        console.log('🗂️ 캐시에 있는 sessionId들:', Array.from(voiceCloneCache.keys()));
        // 기본 음성 사용 (사용자가 아직 샘플 녹음을 하지 않은 경우)
      }
    } else {
      console.log('❌ useClonedVoice:', useClonedVoice, ', sessionId:', sessionId);
    }
    
    // TTS 생성
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: voiceId === DEFAULT_VOICE_ID ? 'eleven_monolingual_v1' : 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8,
          style: 0.5,
          use_speaker_boost: voiceId !== DEFAULT_VOICE_ID,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ TTS generation failed:', errorText);
      throw new Error('TTS generation failed');
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="speech.mp3"',
        'Access-Control-Allow-Origin': '*',
        'Accept-Ranges': 'bytes',
      },
    });

  } catch (error) {
    console.error('💥 Speech generation error:', error);
    return NextResponse.json({ error: 'Speech generation failed' }, { status: 500 });
  }
}

// 클로닝된 음성 세션 저장 (내부 사용)
export function cacheVoiceClone(sessionId: string, voiceId: string, sampleText: string) {
  voiceCloneCache.set(sessionId, {
    voiceId,
    createdAt: Date.now(),
    sampleText
  });
  
  console.log(`💾 Cached voice clone for session ${sessionId}: ${voiceId}`);
}