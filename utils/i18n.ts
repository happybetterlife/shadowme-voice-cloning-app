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
  reRecordTutorial: string;
  
  // 레벨 테스트
  levelTest: string;
  sentence: string;
  record: string;
  listen: string;
  next: string;
  complete: string;
  processingStatus: string;
  listenClonedVoice: string;
  listenMyNativePronunciation: string;
  playing: string;
  perfect: string;
  nice: string;
  practiceMore: string;
  tryAgain: string;
  speakSameSentence: string;
  scoresUntilNow: string;
  cannotLoadSentence: string;
  
  // 연습 화면
  practice: string;
  pronunciationPractice: string;
  sentenceProgress: string;
  playOriginal: string;
  playCloned: string;
  startRecordingButton: string;
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
  loadingResults: string;
  checkAnalysisResults: string;
  overallAverageScore: string;
  excellentSkills: string;
  scoresBySentence: string;
  levelAdjustment: string;
  levelAppropriate: string;
  levelAppropriateSuffix: string;
  personalizedLearningPlan: string;
  dailyGoal: string;
  fifteenMinPractice: string;
  thirtySentences: string;
  expectedImprovementTime: string;
  twoToThreeWeeks: string;
  startLearning: string;
  
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
  
  // 설정 화면
  settings: string;
  darkMode: string;
  logout: string;
  goBack: string;
  privacyNotice: string;
  
  // 인증 화면
  loginTitle: string;
  signupTitle: string;
  loginTo: string;
  createAccount: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  processingAuth: string;
  noAccount: string;
  hasAccount: string;
  
  // 권한 화면
  micPermissionRequired: string;
  micPermissionGranted: string;
  micPermissionRequesting: string;
  permissionDescription: string;
  permissionRequestingDesc: string;
  shadowmeFeatures: string;
  feature1: string;
  feature2: string;
  feature3: string;
  dataStored: string;
  privacyProtected: string;
  allowMic: string;
  requesting: string;
  allowInBrowser: string;
  startNow: string;
  
  // 설명 화면
  howItWorks: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  readyToStart: string;
  letsStart: string;
  whyEffective: string;
  familiarity: string;
  familiarityDesc: string;
  accuracyBenefit: string;
  accuracyBenefitDesc: string;
  motivation: string;
  motivationDesc: string;
  setupLearning: string;
  
  // 레벨 선택 화면
  chooseLevel: string;
  choosePurpose: string;
  levelDescription: string;
  purposeDescription: string;
  learningSettings: string;
  selectLevelAndPurpose: string;
  currentEnglishLevel: string;
  learningPurpose: string;
  selected: string;
  startTest: string;
  levelDesc: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  purposeDesc: {
    conversation: string;
    business: string;
    exam: string;
  };
  feature: {
    basicWords: string;
    simpleExpressions: string;
    pronunciationBasics: string;
    complexSentences: string;
    variousExpressions: string;
    linkingPractice: string;
    advancedVocabulary: string;
    subtlePronunciation: string;
    nativeLevel: string;
  };
  
  // 튜토리얼 화면
  voiceSetup: string;
  recordYourVoice: string;
  readSentence: string;
  sampleSentence: string;
  startRecordingAction: string;
  recordingNow: string;
  recordingDone: string;
  processingAudio: string;
  uploadSuccess: string;
  voiceReady: string;
  voiceNotReady: string;
  autoplayBlocked: string;
  playbackFailed: string;
  recordingTips: string;
  tip1: string;
  tip2: string;
  tip3: string;
  privacyFooter: string;
  nativeConversionComplete: string;
  yourVoiceSoundsNative: string;
  pausePlayback: string;
  listenNativePronunciation: string;
  reRecordVoice: string;
  processingVoiceToNative: string;
  percentComplete: string;
  
  // 대시보드
  dashboard: string;
  todayProgress: string;
  weeklyProgress: string;
  startShadowing: string;
  voiceCloned: string;
  todayGoal: string;
  practiceTime: string;
  lessonsCompleted: string;
  weeklyGoal: string;
  dayAbbr: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
  
  // 연습 화면
  shadowingPractice: string;
  currentSentence: string;
  yourProgress: string;
  listenOriginal: string;
  listenYourVoice: string;
  practiceAgain: string;
  
  // 레벨 테스트 화면
  levelTestTitle: string;
  testInstructions: string;
  readAloud: string;
  
  // 결과 화면
  greatJob: string;
  yourScore: string;
  detailedResults: string;
  continueStudying: string;
  
  // 공통 UI
  loading: string;
  hello: string;
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
    reRecordTutorial: '다시 녹음',
    
    // 레벨 테스트
    levelTest: '레벨 테스트',
    sentence: '문장',
    record: '녹음',
    listen: '듣기',
    next: '다음',
    complete: '완료',
    processingStatus: '음성을 분석하고 있습니다...',
    listenClonedVoice: '샘플 녹음으로 클로닝된 당신의 목소리를 들어보세요',
    listenMyNativePronunciation: '내 원어민 발음 듣기',
    playing: '재생 중...',
    perfect: '완벽해요!',
    nice: '좋아요!',
    practiceMore: '연습하면 더 좋아질 거예요!',
    tryAgain: '다시 한번 해보세요!',
    speakSameSentence: '이제 같은 문장을 따라 말해보세요',
    scoresUntilNow: '지금까지의 점수',
    cannotLoadSentence: '문장을 로드할 수 없습니다.',
    
    // 연습 화면
    practice: '연습',
    pronunciationPractice: '발음 연습',
    sentenceProgress: '문장 진행도',
    playOriginal: '원본 재생',
    playCloned: '내 목소리로 듣기',
    startRecordingButton: '녹음 시작',
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
    loadingResults: '결과를 불러오는 중...',
    checkAnalysisResults: '분석 결과를 확인해보세요',
    overallAverageScore: '전체 평균 점수',
    excellentSkills: '우수한 실력입니다!',
    scoresBySentence: '문장별 점수',
    levelAdjustment: '레벨 조정',
    levelAppropriate: '선택하신',
    levelAppropriateSuffix: '레벨이 적절합니다.',
    personalizedLearningPlan: '맞춤형 학습 계획',
    dailyGoal: '일일 목표',
    fifteenMinPractice: '15분 연습',
    thirtySentences: '30개 문장',
    expectedImprovementTime: '예상 향상 시간',
    twoToThreeWeeks: '2-3주',
    startLearning: '학습 시작하기',
    
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
    
    // 설정 화면
    settings: '설정',
    darkMode: '다크 모드',
    logout: '로그아웃',
    goBack: '돌아가기',
    privacyNotice: '개인정보는 사용자 기기에만 저장되며 외부로 전송되지 않습니다',
    
    // 인증 화면
    loginTitle: '로그인',
    signupTitle: '회원가입',
    loginTo: '에 로그인하세요',
    createAccount: ' 계정을 만들어보세요',
    namePlaceholder: '이름',
    emailPlaceholder: '이메일',
    passwordPlaceholder: '비밀번호',
    processingAuth: '처리 중...',
    noAccount: '계정이 없으신가요? 회원가입',
    hasAccount: '이미 계정이 있으신가요? 로그인',
    
    // 권한 화면
    micPermissionRequired: '마이크 권한이 필요합니다',
    micPermissionGranted: '마이크 권한 허용됨!',
    micPermissionRequesting: '마이크 권한 요청 중...',
    permissionDescription: 'ShadowMe는 당신의 목소리로 네이티브 발음을 학습하는 앱입니다.',
    permissionRequestingDesc: '브라우저에서 마이크 권한을 요청하고 있습니다.',
    shadowmeFeatures: 'ShadowMe 핵심 기능',
    feature1: '내 목소리로 네이티브 발음 생성',
    feature2: '실시간 발음 정확도 피드백',
    feature3: 'AI 복제 음성으로 섀도잉 학습',
    dataStored: '녹음 데이터는 사용자 디바이스에 저장됩니다',
    privacyProtected: '개인정보는 절대 공유되지 않습니다',
    allowMic: '마이크 권한 허용하고 시작',
    requesting: '권한 요청 중...',
    allowInBrowser: '브라우저 팝업에서 "허용"을 선택해주세요',
    startNow: '바로 시작하기',
    
    // 설명 화면
    howItWorks: 'ShadowMe 사용법',
    step1Title: '1. 당신의 목소리',
    step1Desc: '한국어 억양이 있는 영어 발음',
    step2Title: '2. AI 음성 변환',
    step2Desc: '원어민 발음으로 실시간 변환',
    step3Title: '3. 완벽한 원어민 발음',
    step3Desc: '당신의 목소리로 듣는 원어민 영어',
    readyToStart: '시작할 준비가 되셨나요?',
    letsStart: '시작하기',
    whyEffective: '왜 효과적일까요?',
    familiarity: '친숙함',
    familiarityDesc: '자신의 목소리로 듣기 때문에 집중도가 높아집니다',
    accuracyBenefit: '정확성',
    accuracyBenefitDesc: '원어민 수준의 정확한 발음을 학습할 수 있습니다',
    motivation: '동기부여',
    motivationDesc: '내 목소리가 원어민이 되는 신기한 경험',
    setupLearning: '학습 설정 하기',
    
    // 레벨 선택 화면
    chooseLevel: '영어 레벨을 선택하세요',
    choosePurpose: '학습 목적을 선택하세요',
    levelDescription: '현재 영어 실력에 맞는 레벨을 선택해주세요',
    purposeDescription: '학습하고자 하는 목적을 선택해주세요',
    learningSettings: '학습 설정',
    selectLevelAndPurpose: '당신의 레벨과 목적을 선택해주세요',
    currentEnglishLevel: '현재 영어 레벨',
    learningPurpose: '학습 목적',
    selected: '선택됨',
    startTest: '테스트 시작하기',
    levelDesc: {
      beginner: '기본적인 단어와 문장을 배우고 싶어요',
      intermediate: '어느 정도 대화가 가능하지만 더 자연스럽게 말하고 싶어요',
      advanced: '유창하게 말할 수 있지만 완벽한 발음을 원해요',
    },
    purposeDesc: {
      conversation: '친구들과 자연스럽게 대화하고 싶어요',
      business: '업무에서 전문적으로 소통하고 싶어요',
      exam: 'TOEFL, IELTS 등 시험을 준비하고 있어요',
    },
    feature: {
      basicWords: '기본 단어 300개',
      simpleExpressions: '간단한 일상 표현',
      pronunciationBasics: '발음 기초',
      complexSentences: '복잡한 문장 구조',
      variousExpressions: '다양한 표현',
      linkingPractice: '연음 연습',
      advancedVocabulary: '고급 어휘',
      subtlePronunciation: '미묘한 발음 차이',
      nativeLevel: '원어민 수준',
    },
    
    // 튜토리얼 화면
    voiceSetup: '음성 설정',
    recordYourVoice: '음성 녹음하기',
    readSentence: '아래 문장을 자연스럽게 읽어주세요',
    sampleSentence: 'Hello, I am learning English with ShadowMe.',
    startRecordingAction: '녹음 시작',
    recordingNow: '녹음 중...',
    recordingDone: '녹음 완료',
    processingAudio: '음성 처리 중...',
    uploadSuccess: '업로드 완료!',
    voiceReady: '음성이 준비되었습니다',
    voiceNotReady: '음성이 준비되지 않았습니다. 다시 녹음해주세요.',
    autoplayBlocked: '브라우저에서 자동재생이 차단되었습니다.\n브라우저 설정에서 localhost 자동재생을 허용해주세요.',
    playbackFailed: '음성 재생 실패',
    recordingTips: '💡 녹음 팁:',
    tip1: '• 조용한 환경에서 녹음해주세요',
    tip2: '• 마이크를 입에서 15-20cm 거리에 두세요',
    tip3: '• 자연스럽고 편안하게 말해주세요',
    privacyFooter: '음성 데이터는 사용자 기기에만 저장되며 외부로 전송되지 않습니다',
    nativeConversionComplete: '원어민 발음 변환 완료!',
    yourVoiceSoundsNative: '🎵 당신의 목소리가 원어민처럼 들립니다',
    pausePlayback: '일시정지',
    listenNativePronunciation: '원어민 발음 듣기',
    reRecordVoice: '다시 녹음',
    processingVoiceToNative: '🎤 당신의 목소리를 원어민 발음으로 변환 중...',
    percentComplete: '% 완료',
    
    // 대시보드
    dashboard: '대시보드',
    todayProgress: '오늘의 진행도',
    weeklyProgress: '주간 진행도',
    startShadowing: '섀도잉 연습 시작',
    voiceCloned: '음성 복제 완료',
    todayGoal: '오늘의 목표',
    practiceTime: '연습 시간',
    lessonsCompleted: '완료한 레슨',
    weeklyGoal: '주간 목표',
    dayAbbr: {
      mon: '월',
      tue: '화',
      wed: '수',
      thu: '목',
      fri: '금',
      sat: '토',
      sun: '일',
    },
    
    // 연습 화면
    shadowingPractice: '섀도잉 연습',
    currentSentence: '현재 문장',
    yourProgress: '진행도',
    listenOriginal: '원본 듣기',
    listenYourVoice: '내 목소리로 듣기',
    practiceAgain: '다시 연습',
    
    // 레벨 테스트 화면
    levelTestTitle: '레벨 테스트',
    testInstructions: '다음 문장들을 읽어주세요. AI가 당신의 발음을 분석하여 적절한 레벨을 추천해드립니다.',
    readAloud: '소리내어 읽기',
    
    // 결과 화면
    greatJob: '훌륭해요!',
    yourScore: '당신의 점수',
    detailedResults: '상세 결과',
    continueStudying: '학습 계속하기',
    
    // 공통 UI
    loading: '로딩 중...',
    hello: '안녕하세요!',
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
    reRecordTutorial: 'Re-record',
    
    // 레벨 테스트
    levelTest: 'Level Test',
    sentence: 'Sentence',
    record: 'Record',
    listen: 'Listen',
    next: 'Next',
    complete: 'Complete',
    processingStatus: 'Analyzing your voice...',
    listenClonedVoice: 'Listen to your voice cloned from the sample recording',
    listenMyNativePronunciation: 'Listen to My Native Pronunciation',
    playing: 'Playing...',
    perfect: 'Perfect!',
    nice: 'Nice!',
    practiceMore: 'Practice more and you\'ll get better!',
    tryAgain: 'Try again!',
    speakSameSentence: 'Now try to say the same sentence',
    scoresUntilNow: 'Scores So Far',
    cannotLoadSentence: 'Cannot load sentences.',
    
    // 연습 화면
    practice: 'Practice',
    pronunciationPractice: 'Pronunciation Practice',
    sentenceProgress: 'Sentence Progress',
    playOriginal: 'Play Original',
    playCloned: 'Play with My Voice',
    startRecordingButton: 'Start Recording',
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
    loadingResults: 'Loading results...',
    checkAnalysisResults: 'Check your analysis results',
    overallAverageScore: 'Overall Average Score',
    excellentSkills: 'Excellent skills!',
    scoresBySentence: 'Scores by Sentence',
    levelAdjustment: 'Level Adjustment',
    levelAppropriate: 'Your selected',
    levelAppropriateSuffix: 'level is appropriate.',
    personalizedLearningPlan: 'Personalized Learning Plan',
    dailyGoal: 'Daily Goal',
    fifteenMinPractice: '15 min practice',
    thirtySentences: '30 sentences',
    expectedImprovementTime: 'Expected Improvement Time',
    twoToThreeWeeks: '2-3 weeks',
    startLearning: 'Start Learning',
    
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
    
    // 설정 화면
    settings: 'Settings',
    darkMode: 'Dark Mode',
    logout: 'Logout',
    goBack: 'Go Back',
    privacyNotice: 'Personal data is stored only on your device and is not transmitted externally',
    
    // 인증 화면
    loginTitle: 'Login',
    signupTitle: 'Sign Up',
    loginTo: ' login',
    createAccount: ' create an account',
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    processingAuth: 'Processing...',
    noAccount: "Don't have an account? Sign up",
    hasAccount: 'Already have an account? Login',
    
    // 권한 화면
    micPermissionRequired: 'Microphone Permission Required',
    micPermissionGranted: 'Microphone Permission Granted!',
    micPermissionRequesting: 'Requesting Microphone Permission...',
    permissionDescription: 'ShadowMe is an app that learns native pronunciation with your voice.',
    permissionRequestingDesc: 'Requesting microphone permission from browser.',
    shadowmeFeatures: 'ShadowMe Core Features',
    feature1: 'Generate native pronunciation with your voice',
    feature2: 'Real-time pronunciation accuracy feedback',
    feature3: 'Shadowing practice with AI cloned voice',
    dataStored: 'Recording data is stored on your device',
    privacyProtected: 'Personal information is never shared',
    allowMic: 'Allow Microphone and Start',
    requesting: 'Requesting...',
    allowInBrowser: 'Please select "Allow" in the browser popup',
    startNow: 'Start Now',
    
    // 설명 화면
    howItWorks: 'How ShadowMe Works',
    step1Title: '1. Your Voice',
    step1Desc: 'English pronunciation with Korean accent',
    step2Title: '2. AI Voice Conversion',
    step2Desc: 'Real-time conversion to native pronunciation',
    step3Title: '3. Perfect Native Pronunciation',
    step3Desc: 'Native English with your own voice',
    readyToStart: 'Ready to get started?',
    letsStart: 'Let\'s Start',
    whyEffective: 'Why is it effective?',
    familiarity: 'Familiarity',
    familiarityDesc: 'Higher concentration because you hear your own voice',
    accuracyBenefit: 'Accuracy',
    accuracyBenefitDesc: 'Learn accurate native-level pronunciation',
    motivation: 'Motivation',
    motivationDesc: 'Amazing experience of your voice becoming native',
    setupLearning: 'Setup Learning',
    
    // 레벨 선택 화면
    chooseLevel: 'Choose Your English Level',
    choosePurpose: 'Choose Your Learning Purpose',
    levelDescription: 'Please select a level that matches your current English skills',
    purposeDescription: 'Please select your learning purpose',
    learningSettings: 'Learning Settings',
    selectLevelAndPurpose: 'Select your level and purpose',
    currentEnglishLevel: 'Current English Level',
    learningPurpose: 'Learning Purpose',
    selected: 'Selected',
    startTest: 'Start Test',
    levelDesc: {
      beginner: 'I want to learn basic words and sentences',
      intermediate: 'I can have conversations but want to speak more naturally',
      advanced: 'I can speak fluently but want perfect pronunciation',
    },
    purposeDesc: {
      conversation: 'I want to have natural conversations with friends',
      business: 'I want to communicate professionally at work',
      exam: 'I am preparing for exams like TOEFL or IELTS',
    },
    feature: {
      basicWords: '300 basic words',
      simpleExpressions: 'Simple daily expressions',
      pronunciationBasics: 'Pronunciation basics',
      complexSentences: 'Complex sentence structures',
      variousExpressions: 'Various expressions',
      linkingPractice: 'Linking practice',
      advancedVocabulary: 'Advanced vocabulary',
      subtlePronunciation: 'Subtle pronunciation differences',
      nativeLevel: 'Native level',
    },
    
    // 튜토리얼 화면
    voiceSetup: 'Voice Setup',
    recordYourVoice: 'Record Your Voice',
    readSentence: 'Please read the sentence naturally',
    sampleSentence: 'Hello, I am learning English with ShadowMe.',
    startRecordingAction: 'Start Recording',
    recordingNow: 'Recording...',
    recordingDone: 'Recording Complete',
    processingAudio: 'Processing Audio...',
    uploadSuccess: 'Upload Complete!',
    voiceReady: 'Voice is Ready',
    voiceNotReady: 'Voice is not ready. Please record again.',
    autoplayBlocked: 'Autoplay blocked by browser.\nPlease allow autoplay for localhost in browser settings.',
    playbackFailed: 'Audio playback failed',
    recordingTips: '💡 Recording Tips:',
    tip1: '• Record in a quiet environment',
    tip2: '• Keep microphone 15-20cm from your mouth',
    tip3: '• Speak naturally and comfortably',
    privacyFooter: 'Voice data is stored only on your device and is not transmitted externally',
    nativeConversionComplete: 'Native Pronunciation Conversion Complete!',
    yourVoiceSoundsNative: '🎵 Your voice now sounds like a native speaker',
    pausePlayback: 'Pause',
    listenNativePronunciation: 'Listen to Native Pronunciation',
    reRecordVoice: 'Re-record',
    processingVoiceToNative: '🎤 Converting your voice to native pronunciation...',
    percentComplete: '% complete',
    
    // 대시보드
    dashboard: 'Dashboard',
    todayProgress: 'Today\'s Progress',
    weeklyProgress: 'Weekly Progress',
    startShadowing: 'Start Shadowing Practice',
    voiceCloned: 'Voice Cloned',
    todayGoal: 'Today\'s Goal',
    practiceTime: 'Practice Time',
    lessonsCompleted: 'Lessons Completed',
    weeklyGoal: 'Weekly Goal',
    dayAbbr: {
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun',
    },
    
    // 연습 화면
    shadowingPractice: 'Shadowing Practice',
    currentSentence: 'Current Sentence',
    yourProgress: 'Your Progress',
    listenOriginal: 'Listen Original',
    listenYourVoice: 'Listen Your Voice',
    practiceAgain: 'Practice Again',
    
    // 레벨 테스트 화면
    levelTestTitle: 'Level Test',
    testInstructions: 'Please read the following sentences. AI will analyze your pronunciation and recommend an appropriate level.',
    readAloud: 'Read Aloud',
    
    // 결과 화면
    greatJob: 'Great Job!',
    yourScore: 'Your Score',
    detailedResults: 'Detailed Results',
    continueStudying: 'Continue Studying',
    
    // 공통 UI
    loading: 'Loading...',
    hello: 'Hello!',
  },
};

