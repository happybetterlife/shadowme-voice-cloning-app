import { NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_a44152702031b3af9f1a87072171fc9993fdbfb477fba26c";

export async function GET() {
  try {
    console.log('🔍 Checking ElevenLabs voices...');
    
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 
        'xi-api-key': ELEVENLABS_API_KEY,
        'Accept': 'application/json'
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      const userVoices = data.voices.filter((voice: any) => 
        voice.name.startsWith('user_voice_') && voice.category === 'cloned'
      );
      
      console.log(`📊 Total voices: ${data.voices.length}`);
      console.log(`🎤 User cloned voices: ${userVoices.length}`);
      
      return NextResponse.json({
        success: true,
        total_voices: data.voices.length,
        user_voices: userVoices.length,
        user_voice_list: userVoices.map((v: any) => ({
          id: v.voice_id,
          name: v.name,
          category: v.category
        })),
        api_key_status: 'valid'
      });
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      
      return NextResponse.json({
        success: false,
        error: errorText,
        status: response.status,
        api_key_status: response.status === 401 ? 'invalid' : 'unknown'
      });
    }
  } catch (error) {
    console.error('💥 Check voices error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    });
  }
}