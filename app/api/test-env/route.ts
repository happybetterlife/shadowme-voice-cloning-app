import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  return NextResponse.json({
    apiKeyExists: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'Not found',
    timestamp: new Date().toISOString(),
    vercelRegion: process.env.VERCEL_REGION || 'unknown'
  });
}