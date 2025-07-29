# Supabase 보안 설정 가이드

## 🔧 보안 경고 해결 방법

### 1. Function Search Path Mutable 경고
**문제**: 함수의 search_path가 변경 가능하여 보안 취약점이 될 수 있음

**해결방법**:
```sql
-- fix_warnings.sql 실행
-- SQL Editor에서 실행하면 자동으로 해결됩니다
```

### 2. Leaked Password Protection 경고
**문제**: 유출된 비밀번호 보호 기능이 비활성화되어 있음

**해결방법**:
1. Supabase Dashboard 접속
2. **Authentication** → **Settings** → **Security** 탭
3. **Leaked password protection** 옵션 활성화

### 3. Insufficient MFA Options 경고
**문제**: 다중 인증(MFA) 옵션이 부족함

**해결방법**:
1. Supabase Dashboard 접속
2. **Authentication** → **Settings** → **Security** 탭
3. **Enable MFA** 활성화
4. MFA 옵션 선택:
   - TOTP (Time-based One-Time Password)
   - SMS (문자 메시지)

## 📋 빠른 해결 순서

### 개발 환경 (최소 보안)
1. SQL Editor에서 `fix_warnings.sql` 실행 ✅
2. 나머지는 선택사항

### 프로덕션 환경 (권장 보안)
1. SQL Editor에서 `fix_warnings.sql` 실행 ✅
2. Dashboard에서 Leaked Password Protection 활성화 ✅
3. Dashboard에서 MFA 활성화 ✅

## 🎯 우선순위

1. **높음**: Function Search Path (SQL로 즉시 해결 가능)
2. **중간**: Leaked Password Protection (사용자 보호)
3. **낮음**: MFA (개발 단계에서는 선택사항)

## 💡 참고사항

- **개발 중**에는 Function Search Path만 수정해도 충분합니다
- **프로덕션 배포 전**에 모든 보안 설정을 활성화하세요
- MFA는 사용자 경험에 영향을 줄 수 있으므로 신중히 결정하세요