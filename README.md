# ShadowME - AI Voice Cloning Language Learning App

## 🎯 프로젝트 소개
AI 음성 복제 기술을 활용한 영어 발음 학습 앱입니다. 사용자의 목소리를 학습하여 원어민 발음으로 변환해주는 혁신적인 언어 학습 도구입니다.

## 🚀 시작하기

### 1. 의존성 설치
```bash
cd shadowme-nextjs
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# ElevenLabs API (음성 클로닝)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속하세요.

## 📱 주요 기능

- **🎤 음성 클로닝**: 사용자의 목소리를 AI가 학습하여 원어민 발음으로 변환
- **🌐 다국어 지원**: 한국어/영어 자동 전환 (브라우저 언어 설정 기반)
- **📊 학습 진도 추적**: 일일 학습 목표 및 진행 상황 모니터링
- **🎯 맞춤형 학습**: 사용자 레벨에 맞는 문장 제공

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **AI/ML**: ElevenLabs API (음성 클로닝)
- **Deployment**: Vercel

## 📁 프로젝트 구조
```
shadowme-nextjs/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── clone-voice/   # 음성 클로닝 API
│   │   └── analyze-voice/ # 음성 분석 API
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # UI 컴포넌트 (shadcn/ui)
│   └── ...               # 화면별 컴포넌트
├── hooks/                # Custom React Hooks
├── utils/                # 유틸리티 함수
│   ├── i18n.ts          # 다국어 지원
│   └── voiceApi.ts      # 음성 API 클라이언트
└── supabase/            # Supabase 설정
    └── migrations/      # 데이터베이스 마이그레이션
```

## 🔧 문제 해결

### 음성 클로닝이 작동하지 않는 경우
1. ElevenLabs API 키가 올바르게 설정되었는지 확인
2. 마이크 권한이 허용되었는지 확인
3. 최소 3-5초 이상 녹음했는지 확인
4. WebM 형식을 지원하는 브라우저인지 확인 (Chrome 권장)

### Supabase RLS 오류가 나타나는 경우
Supabase Dashboard → SQL Editor에서 다음 실행:
```sql
-- quick_fix_rls.sql 파일 내용 실행
```

### 배포 관련 문제
1. Vercel에 환경 변수가 올바르게 설정되었는지 확인
2. `vercel.json`의 함수 타임아웃이 60초로 설정되었는지 확인

## 🚀 배포

### Vercel 배포
```bash
git add .
git commit -m "Your commit message"
git push
```

Vercel이 자동으로 배포를 시작합니다.

### 환경 변수 설정 (Vercel)
1. Vercel Dashboard → Settings → Environment Variables
2. 필요한 환경 변수 추가:
   - `ELEVENLABS_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📄 라이선스
This project is private and proprietary.

## 🤝 기여하기
이 프로젝트는 현재 비공개입니다.

## 📞 문의
문의사항은 이슈를 통해 남겨주세요.