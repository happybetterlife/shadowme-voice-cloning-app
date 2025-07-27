-- ShadowME 학습 문장 데이터 삽입
-- learning-content-setup.sql 실행 후에 실행하세요

-- Beginner Conversation 문장들
INSERT INTO sentences (category_id, text, translation_ko, difficulty_score)
SELECT 
    sc.id,
    s.text,
    s.translation_ko,
    s.difficulty_score
FROM sentence_categories sc
CROSS JOIN (VALUES
    ('We call it bear.', '우리는 그것을 곰이라고 불러요.', 30),
    ('It is a nice day.', '좋은 날이에요.', 25),
    ('I like to read books.', '나는 책 읽는 것을 좋아해요.', 35),
    ('She has a red car.', '그녀는 빨간 차를 가지고 있어요.', 30),
    ('The cat is sleeping.', '고양이가 자고 있어요.', 28)
) AS s(text, translation_ko, difficulty_score)
WHERE sc.level = 'beginner' AND sc.purpose = 'conversation';

-- Beginner Business 문장들
INSERT INTO sentences (category_id, text, translation_ko, difficulty_score)
SELECT 
    sc.id,
    s.text,
    s.translation_ko,
    s.difficulty_score
FROM sentence_categories sc
CROSS JOIN (VALUES
    ('Good morning everyone.', '모두 좋은 아침이에요.', 25),
    ('Please take a seat.', '자리에 앉아주세요.', 30),
    ('Thank you for coming.', '와주셔서 감사합니다.', 32),
    ('Let''s start the meeting.', '회의를 시작합시다.', 35),
    ('Have a great day.', '좋은 하루 보내세요.', 28)
) AS s(text, translation_ko, difficulty_score)
WHERE sc.level = 'beginner' AND sc.purpose = 'business';

-- Beginner Exam 문장들
INSERT INTO sentences (category_id, text, translation_ko, difficulty_score)
SELECT 
    sc.id,
    s.text,
    s.translation_ko,
    s.difficulty_score
FROM sentence_categories sc
CROSS JOIN (VALUES
    ('Education is important.', '교육은 중요합니다.', 30),
    ('Study hard every day.', '매일 열심히 공부하세요.', 32),
    ('Knowledge is power.', '아는 것이 힘입니다.', 28),
    ('Learning never stops.', '배움은 끝이 없습니다.', 35),
    ('Books are our friends.', '책은 우리의 친구입니다.', 30)
) AS s(text, translation_ko, difficulty_score)
WHERE sc.level = 'beginner' AND sc.purpose = 'exam';

-- Intermediate Conversation 문장들
INSERT INTO sentences (category_id, text, translation_ko, difficulty_score)
SELECT 
    sc.id,
    s.text,
    s.translation_ko,
    s.difficulty_score
FROM sentence_categories sc
CROSS JOIN (VALUES
    ('I''m planning to visit my family next weekend.', '다음 주말에 가족을 방문할 계획이에요.', 55),
    ('The restaurant we went to last night was amazing.', '어젯밤에 갔던 레스토랑은 정말 놀라웠어요.', 58),
    ('I''ve been learning English for about two years now.', '이제 영어를 배운 지 약 2년이 되었어요.', 60),
    ('Would you mind if I joined your conversation?', '대화에 참여해도 될까요?', 62),
    ('I completely agree with your opinion on this matter.', '이 문제에 대한 당신의 의견에 전적으로 동의합니다.', 65)
) AS s(text, translation_ko, difficulty_score)
WHERE sc.level = 'intermediate' AND sc.purpose = 'conversation';

-- Intermediate Business 문장들
INSERT INTO sentences (category_id, text, translation_ko, difficulty_score)
SELECT 
    sc.id,
    s.text,
    s.translation_ko,
    s.difficulty_score
FROM sentence_categories sc
CROSS JOIN (VALUES
    ('I''d like to discuss the project timeline with you.', '프로젝트 일정에 대해 논의하고 싶습니다.', 60),
    ('Our quarterly results exceeded expectations significantly.', '분기 실적이 예상을 크게 초과했습니다.', 65),
    ('We need to implement new strategies for better efficiency.', '효율성 향상을 위해 새로운 전략을 실행해야 합니다.', 68),
    ('The presentation went smoothly thanks to everyone''s effort.', '모두의 노력 덕분에 프레젠테이션이 순조롭게 진행되었습니다.', 62),
    ('I''m confident that we can achieve our goals together.', '우리가 함께 목표를 달성할 수 있다고 확신합니다.', 58)
) AS s(text, translation_ko, difficulty_score)
WHERE sc.level = 'intermediate' AND sc.purpose = 'business';

-- Intermediate Exam 문장들
INSERT INTO sentences (category_id, text, translation_ko, difficulty_score)
SELECT 
    sc.id,
    s.text,
    s.translation_ko,
    s.difficulty_score
FROM sentence_categories sc
CROSS JOIN (VALUES
    ('Academic success requires consistent effort and dedication.', '학업 성공은 꾸준한 노력과 헌신을 필요로 합니다.', 65),
    ('The research methodology was thoroughly explained in the paper.', '연구 방법론이 논문에 자세히 설명되어 있습니다.', 68),
    ('Environmental conservation is becoming increasingly important globally.', '환경 보전은 전 세계적으로 점점 더 중요해지고 있습니다.', 70),
    ('Technology has revolutionized the way we communicate.', '기술은 우리가 소통하는 방식을 혁명적으로 변화시켰습니다.', 62),
    ('Critical thinking skills are essential for problem-solving.', '비판적 사고 능력은 문제 해결에 필수적입니다.', 65)
) AS s(text, translation_ko, difficulty_score)
WHERE sc.level = 'intermediate' AND sc.purpose = 'exam';

-- Advanced Conversation 문장들
INSERT INTO sentences (category_id, text, translation_ko, difficulty_score)
SELECT 
    sc.id,
    s.text,
    s.translation_ko,
    s.difficulty_score
FROM sentence_categories sc
CROSS JOIN (VALUES
    ('I find it fascinating how different cultures approach hospitality.', '다른 문화권이 환대에 접근하는 방식이 매력적이라고 생각합니다.', 80),
    ('The nuances in his speech patterns suggest he''s quite sophisticated.', '그의 말투의 뉘앙스는 그가 꽤 세련되었음을 시사합니다.', 85),
    ('I''m particularly intrigued by the philosophical implications of that statement.', '그 진술의 철학적 함의에 특히 흥미를 느낍니다.', 88),
    ('The conversation meandered through various topics before settling on politics.', '대화는 정치로 정착하기 전에 다양한 주제를 거쳐갔습니다.', 82),
    ('His articulate explanation clarified several misconceptions I had.', '그의 명료한 설명은 내가 가지고 있던 여러 오해를 해소해주었습니다.', 80)
) AS s(text, translation_ko, difficulty_score)
WHERE sc.level = 'advanced' AND sc.purpose = 'conversation';

-- Advanced Business 문장들
INSERT INTO sentences (category_id, text, translation_ko, difficulty_score)
SELECT 
    sc.id,
    s.text,
    s.translation_ko,
    s.difficulty_score
FROM sentence_categories sc
CROSS JOIN (VALUES
    ('We need to leverage our competitive advantages strategically.', '우리는 경쟁 우위를 전략적으로 활용해야 합니다.', 82),
    ('The market volatility requires us to diversify our portfolio.', '시장 변동성은 우리에게 포트폴리오 다각화를 요구합니다.', 85),
    ('Stakeholder engagement is crucial for sustainable growth.', '이해관계자 참여는 지속 가능한 성장에 매우 중요합니다.', 80),
    ('Our organizational restructuring will optimize operational efficiency.', '조직 개편은 운영 효율성을 최적화할 것입니다.', 88),
    ('The comprehensive analysis reveals significant opportunities for expansion.', '종합적인 분석은 확장을 위한 중요한 기회를 보여줍니다.', 85)
) AS s(text, translation_ko, difficulty_score)
WHERE sc.level = 'advanced' AND sc.purpose = 'business';

-- Advanced Exam 문장들
INSERT INTO sentences (category_id, text, translation_ko, difficulty_score)
SELECT 
    sc.id,
    s.text,
    s.translation_ko,
    s.difficulty_score
FROM sentence_categories sc
CROSS JOIN (VALUES
    ('The intricate relationship between socioeconomic factors and educational outcomes.', '사회경제적 요인과 교육 성과 간의 복잡한 관계.', 90),
    ('Contemporary literature reflects the complexities of modern society.', '현대 문학은 현대 사회의 복잡성을 반영합니다.', 85),
    ('Empirical evidence substantiates the hypothesis proposed in the study.', '경험적 증거가 연구에서 제안된 가설을 입증합니다.', 92),
    ('The paradigm shift necessitates a fundamental reevaluation of our assumptions.', '패러다임 전환은 우리 가정의 근본적인 재평가를 필요로 합니다.', 95),
    ('Interdisciplinary approaches yield more comprehensive solutions to complex problems.', '학제간 접근법은 복잡한 문제에 대한 더 포괄적인 해결책을 제공합니다.', 88)
) AS s(text, translation_ko, difficulty_score)
WHERE sc.level = 'advanced' AND sc.purpose = 'exam';

-- 일부 태그 추가 (선택사항)
INSERT INTO sentence_tags (name)
VALUES 
    ('daily_life'),
    ('formal'),
    ('academic'),
    ('technical'),
    ('casual')
ON CONFLICT DO NOTHING;