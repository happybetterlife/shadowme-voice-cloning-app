// 다국어 지원 시스템

// 지원 언어
export type Language = 'ko' | 'en';

// 번역 타입
export interface Translations {
  // 공통
  appName: string;
  appDescription: string;
  
  // 홈 화면
  welcome: string;
  welcomeDescription: string;
  getStarted: string;
  login: string;
  
  // 프로필 설정
  profileSetup: string;
  email: string;
  name: string;
  selectLevel: string;
  selectPurpose: string;
  level: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  purpose: {
    conversation: string;
    business: string;
    exam: string;
  };
  continue: string;
  
  // 튜토리얼
  tutorial: string;
  recordSample: string;
  recordingInstructions: string;
  recording: string;
  recordingComplete: string;
  processingVoice: string;
  startPractice: string;
  reRecord: string;
  
  // 레벨 테스트
  levelTest: string;
  sentence: string;
  record: string;
  listen: string;
  next: string;
  complete: string;
  processing: string;
  
  // 연습 화면
  practice: string;
  pronunciationPractice: string;
  sentenceProgress: string;
  playOriginal: string;
  playCloned: string;
  startRecording: string;
  stopRecording: string;
  analyzing: string;
  accuracy: string;
  retry: string;
  nextSentence: string;
  practiceComplete: string;
  
  // 결과 화면
  results: string;
  testComplete: string;
  practiceComplete2: string;
  overallScore: string;
  fluency: string;
  pronunciation: string;
  recommendedLevel: string;
  feedback: string;
  backToHome: string;
  continuePractice: string;
  
  // 에러 메시지
  microphoneError: string;
  processingError: string;
  networkError: string;
  
  // 발음 정확도 가이드
  accuracyGuide: string;
  excellent: string;
  good: string;
  needsImprovement: string;
  
  // 진행 상황
  progress: string;
  completed: string;
  remaining: string;
  
  // 버튼
  back: string;
  skip: string;
  save: string;
  cancel: string;
  
  // 홈 화면 기능 설명
  voiceCloning: string;
  voiceCloningDesc: string;
  personalizedLearning: string;
  personalizedLearningDesc: string;
  realtimeFeedback: string;
  realtimeFeedbackDesc: string;
}

// 언어별 번역
export const translations: Record<Language, Translations> = {
  ko: {
    // 공통
    appName: 'ShadowME',
    appDescription: 'AI 음성 복제로 원어민처럼 말하기',
    
    // 홈 화면
    welcome: '환영합니다',
    welcomeDescription: 'AI 음성 복제 기술로 당신의 목소리로 원어민처럼 영어를 말해보세요',
    getStarted: '시작하기',
    login: '로그인',
    
    // 프로필 설정
    profileSetup: '프로필 설정',
    email: '이메일',
    name: '이름',
    selectLevel: '영어 레벨 선택',
    selectPurpose: '학습 목적 선택',
    level: {
      beginner: '초급',
      intermediate: '중급',
      advanced: '고급',
    },
    purpose: {
      conversation: '일상 대화',
      business: '비즈니스',
      exam: '시험 준비',
    },
    continue: '계속',
    
    // 튜토리얼
    tutorial: '튜토리얼',
    recordSample: '음성 샘플 녹음',
    recordingInstructions: '아래 문장을 읽어주세요',
    recording: '녹음 중...',
    recordingComplete: '녹음 완료',
    processingVoice: '음성 처리 중...',
    startPractice: '연습 시작',
    reRecord: '다시 녹음',
    
    // 레벨 테스트
    levelTest: '레벨 테스트',
    sentence: '문장',
    record: '녹음',
    listen: '듣기',
    next: '다음',
    complete: '완료',
    processing: '처리 중...',
    
    // 연습 화면
    practice: '연습',
    pronunciationPractice: '발음 연습',
    sentenceProgress: '문장 진행도',
    playOriginal: '원본 재생',
    playCloned: '내 목소리로 듣기',
    startRecording: '녹음 시작',
    stopRecording: '녹음 중지',
    analyzing: '분석 중...',
    accuracy: '정확도',
    retry: '다시 시도',
    nextSentence: '다음 문장',
    practiceComplete: '연습 완료',
    
    // 결과 화면
    results: '결과',
    testComplete: '테스트 완료!',
    practiceComplete2: '연습 완료!',
    overallScore: '종합 점수',
    fluency: '유창성',
    pronunciation: '발음',
    recommendedLevel: '추천 레벨',
    feedback: '피드백',
    backToHome: '홈으로',
    continuePractice: '연습 계속하기',
    
    // 에러 메시지
    microphoneError: '마이크 권한이 필요합니다',
    processingError: '처리 중 오류가 발생했습니다',
    networkError: '네트워크 연결을 확인해주세요',
    
    // 발음 정확도 가이드
    accuracyGuide: '발음 정확도',
    excellent: '훌륭해요',
    good: '좋아요',
    needsImprovement: '연습이 필요해요',
    
    // 진행 상황
    progress: '진행 상황',
    completed: '완료',
    remaining: '남음',
    
    // 버튼
    back: '뒤로',
    skip: '건너뛰기',
    save: '저장',
    cancel: '취소',
    
    // 홈 화면 기능 설명
    voiceCloning: '음성 복제 기술',
    voiceCloningDesc: 'AI가 내 목소리를 학습하여 원어민 발음으로 변환',
    personalizedLearning: '맞춤형 학습',
    personalizedLearningDesc: '개인의 수준과 목적에 맞는 맞춤형 연습 문장 제공',
    realtimeFeedback: '실시간 피드백',
    realtimeFeedbackDesc: '발음 정확도와 유창성을 즉시 분석하여 개선점 제시',
  },
  
  en: {
    // 공통
    appName: 'ShadowME',
    appDescription: 'Speak like a native with AI voice cloning',
    
    // 홈 화면
    welcome: 'Welcome',
    welcomeDescription: 'Speak English like a native speaker with your own voice using AI voice cloning technology',
    getStarted: 'Get Started',
    login: 'Login',
    
    // 프로필 설정
    profileSetup: 'Profile Setup',
    email: 'Email',
    name: 'Name',
    selectLevel: 'Select English Level',
    selectPurpose: 'Select Learning Purpose',
    level: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    },
    purpose: {
      conversation: 'Daily Conversation',
      business: 'Business',
      exam: 'Exam Preparation',
    },
    continue: 'Continue',
    
    // 튜토리얼
    tutorial: 'Tutorial',
    recordSample: 'Record Voice Sample',
    recordingInstructions: 'Please read the sentence below',
    recording: 'Recording...',
    recordingComplete: 'Recording Complete',
    processingVoice: 'Processing voice...',
    startPractice: 'Start Practice',
    reRecord: 'Re-record',
    
    // 레벨 테스트
    levelTest: 'Level Test',
    sentence: 'Sentence',
    record: 'Record',
    listen: 'Listen',
    next: 'Next',
    complete: 'Complete',
    processing: 'Processing...',
    
    // 연습 화면
    practice: 'Practice',
    pronunciationPractice: 'Pronunciation Practice',
    sentenceProgress: 'Sentence Progress',
    playOriginal: 'Play Original',
    playCloned: 'Play with My Voice',
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    analyzing: 'Analyzing...',
    accuracy: 'Accuracy',
    retry: 'Try Again',
    nextSentence: 'Next Sentence',
    practiceComplete: 'Practice Complete',
    
    // 결과 화면
    results: 'Results',
    testComplete: 'Test Complete!',
    practiceComplete2: 'Practice Complete!',
    overallScore: 'Overall Score',
    fluency: 'Fluency',
    pronunciation: 'Pronunciation',
    recommendedLevel: 'Recommended Level',
    feedback: 'Feedback',
    backToHome: 'Back to Home',
    continuePractice: 'Continue Practice',
    
    // 에러 메시지
    microphoneError: 'Microphone permission required',
    processingError: 'An error occurred during processing',
    networkError: 'Please check your network connection',
    
    // 발음 정확도 가이드
    accuracyGuide: 'Pronunciation Accuracy',
    excellent: 'Excellent',
    good: 'Good',
    needsImprovement: 'Needs Practice',
    
    // 진행 상황
    progress: 'Progress',
    completed: 'Completed',
    remaining: 'Remaining',
    
    // 버튼
    back: 'Back',
    skip: 'Skip',
    save: 'Save',
    cancel: 'Cancel',
    
    // 홈 화면 기능 설명
    voiceCloning: 'Voice Cloning Technology',
    voiceCloningDesc: 'AI learns your voice and transforms it to native pronunciation',
    personalizedLearning: 'Personalized Learning',
    personalizedLearningDesc: 'Practice sentences tailored to your level and goals',
    realtimeFeedback: 'Real-time Feedback',
    realtimeFeedbackDesc: 'Instant analysis of pronunciation accuracy and fluency',
  },
};

