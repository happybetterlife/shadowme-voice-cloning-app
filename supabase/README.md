# Supabase RLS 설정 가이드

## RLS(Row Level Security) 활성화하기

Supabase에서 보안 오류를 해결하기 위해 다음 단계를 따라주세요:

### 방법 1: Supabase Dashboard에서 직접 실행

1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. `migrations/enable_rls.sql` 파일의 내용을 복사하여 붙여넣기
5. **Run** 버튼 클릭

### 방법 2: 각 테이블별로 UI에서 설정

1. Supabase Dashboard에서 **Table Editor** 이동
2. 각 테이블 옆의 ⋮ 메뉴 클릭
3. **Enable RLS** 선택
4. **Policies** 탭에서 적절한 정책 추가

### RLS 정책 설명

- **sentence_categories, sentences, sentence_tags, sentence_tag_relations**: 
  - 모든 사용자가 읽기 가능 (공개 콘텐츠)

- **user_profiles, user_sessions, daily_progress**:
  - 각 사용자는 자신의 데이터만 읽기/쓰기 가능
  - `auth.uid() = user_id` 조건으로 보호

### 주의사항

RLS를 활성화하면:
- 인증되지 않은 사용자는 사용자별 데이터에 접근할 수 없습니다
- 문장 데이터는 공개적으로 읽을 수 있습니다
- 각 사용자는 자신의 데이터만 수정할 수 있습니다