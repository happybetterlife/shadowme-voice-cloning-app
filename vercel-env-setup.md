# Vercel 환경 변수 설정 가이드

## 1. Vercel 대시보드에서 환경 변수 설정하기

1. https://vercel.com 에 로그인
2. 프로젝트 선택 (shadowme-voice-cloning-app)
3. Settings 탭 클릭
4. 왼쪽 메뉴에서 "Environment Variables" 클릭
5. 다음 환경 변수 추가:

### 필수 환경 변수

```
ELEVENLABS_API_KEY=sk_a44152702031b3af9f1a87072171fc9993fdbfb477fba26c
```

- Name: `ELEVENLABS_API_KEY`
- Value: `sk_a44152702031b3af9f1a87072171fc9993fdbfb477fba26c`
- Environment: Production, Preview, Development 모두 체크

### 설정 후 재배포

환경 변수 추가 후 반드시 재배포해야 적용됩니다:
1. Deployments 탭으로 이동
2. 최신 deployment 옆의 ... 메뉴 클릭
3. "Redeploy" 클릭

## 2. 로컬 환경 변수 (.env.local)

로컬 개발 환경에서는 `.env.local` 파일에 이미 설정되어 있습니다.

## 3. 환경 변수 확인

배포 후 브라우저 개발자 도구에서 확인:
1. F12로 개발자 도구 열기
2. Console 탭에서 API 호출 시 로그 확인
3. "ELEVENLABS_API_KEY exists: true" 확인