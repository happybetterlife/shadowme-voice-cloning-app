// 클로닝된 음성 세션 저장소 (실제 프로덕션에서는 데이터베이스 사용)
const voiceCloneCache = new Map<string, {
  voiceId: string;
  createdAt: number;
  sampleText: string;
}>();

// 클로닝된 음성 세션 저장
export function cacheVoiceClone(sessionId: string, voiceId: string, sampleText: string) {
  voiceCloneCache.set(sessionId, {
    voiceId,
    createdAt: Date.now(),
    sampleText
  });
  
  console.log(`💾 Cached voice clone for session ${sessionId}: ${voiceId}`);
}

// 캐시된 음성 조회
export function getCachedVoice(sessionId: string) {
  return voiceCloneCache.get(sessionId);
}

// 캐시된 세션 목록 조회
export function getCachedSessions() {
  return Array.from(voiceCloneCache.keys());
}