import { NextApiRequest, NextApiResponse } from 'next';

const ELEVENLABS_API_KEY = "sk_a44152702031b3af9f1a87072171fc9993fdbfb477fba26c";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔍 Debug voice endpoint called');
  
  try {
    // 1. API 키 테스트
    console.log('🔑 Testing ElevenLabs API key...');
    const keyTestResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });
    
    console.log('🔑 Key test response status:', keyTestResponse.status);
    
    if (!keyTestResponse.ok) {
      const errorText = await keyTestResponse.text();
      console.error('❌ API key test failed:', errorText);
      return res.status(500).json({ 
        error: 'API key test failed', 
        status: keyTestResponse.status,
        details: errorText 
      });
    }
    
    // 2. 간단한 TTS 테스트
    console.log('🗣️ Testing basic TTS...');
    const ttsResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: '테스트 음성입니다.',
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        }
      }),
    });
    
    console.log('🗣️ TTS response status:', ttsResponse.status);
    
    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('❌ TTS test failed:', errorText);
      return res.status(500).json({ 
        error: 'TTS test failed', 
        status: ttsResponse.status,
        details: errorText 
      });
    }
    
    const audioBuffer = await ttsResponse.arrayBuffer();
    console.log('✅ TTS test successful, audio size:', audioBuffer.byteLength);
    
    return res.status(200).json({
      success: true,
      message: 'All tests passed',
      apiKeyValid: true,
      ttsWorking: true,
      audioSize: audioBuffer.byteLength,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Debug test error:', error);
    return res.status(500).json({ 
      error: 'Debug test failed', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
}