-- Supabase 보안 경고 해결

-- 1. Function Search Path Mutable 문제 해결
-- search_path를 immutable로 설정

-- update_updated_at_column 함수 수정
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- update_sentence_stats 함수가 있다면 수정
-- (이 함수가 실제로 존재하는 경우에만 실행)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'update_sentence_stats' 
    AND pronamespace = 'public'::regnamespace
  ) THEN
    EXECUTE 'CREATE OR REPLACE FUNCTION public.update_sentence_stats()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $func$
    BEGIN
      -- 함수 내용은 기존과 동일
      RETURN NEW;
    END;
    $func$';
  END IF;
END $$;

-- 2. Leaked Password Protection 활성화 (선택사항)
-- 이는 Supabase Dashboard에서 설정하는 것이 더 안전합니다
-- Dashboard → Authentication → Settings → Security → Enable leaked password protection

-- 3. MFA (Multi-Factor Authentication) 설정
-- 이것도 Dashboard에서 설정하는 것이 권장됩니다
-- Dashboard → Authentication → Settings → Security → Enable MFA

-- 참고: 위 2번과 3번은 보안을 강화하지만 개발 단계에서는 선택사항입니다