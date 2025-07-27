import { NextApiRequest, NextApiResponse } from 'next';

const ELEVENLABS_API_KEY = "sk_a44152702031b3af9f1a87072171fc9993fdbfb477fba26c";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🧪 Voice cloning test endpoint called');
  console.log('🔑 ELEVENLABS_API_KEY present:', !!ELEVENLABS_API_KEY);
  console.log('🔗 Request method:', req.method);
  console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
  
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'API working', 
      apiKeyPresent: !!ELEVENLABS_API_KEY,
      timestamp: new Date().toISOString() 
    });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 간단한 TTS 테스트
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: '안녕하세요! 음성 클로닝 테스트입니다.',
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ElevenLabs API error:', errorText);
      return res.status(500).json({ error: 'ElevenLabs API failed', details: errorText });
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('✅ Audio generated successfully, size:', audioBuffer.byteLength);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline; filename="test_voice.mp3"');
    res.send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error('❌ Test voice error:', error);
    return res.status(500).json({ error: 'Test failed', details: error });
  }
}