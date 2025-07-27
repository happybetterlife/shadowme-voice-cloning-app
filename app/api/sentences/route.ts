import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zxyvqsevekrhwzjulyaq.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4eXZxc2V2ZWtyaHd6anVseWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTMzNDgsImV4cCI6MjA2ODIyOTM0OH0.1uG9-dGGkuiFFWz0zxtjN54dPjMxbSWjii0n9SC-KgY"
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get('level');
    const purpose = searchParams.get('purpose');
    const limit = searchParams.get('limit') || '10';
    const random = searchParams.get('random') === 'true';

    console.log('📚 문장 요청:', { level, purpose, limit, random });

    // 카테고리 조회
    let categoryQuery = supabase
      .from('sentence_categories')
      .select('id')
      .single();

    if (level) categoryQuery = categoryQuery.eq('level', level);
    if (purpose) categoryQuery = categoryQuery.eq('purpose', purpose);

    const { data: category, error: categoryError } = await categoryQuery;

    if (categoryError || !category) {
      console.error('카테고리 조회 실패:', categoryError);
      // 카테고리가 없으면 하드코딩된 데이터 반환
      return NextResponse.json({ 
        sentences: getDefaultSentences(level || 'beginner', purpose || 'conversation'),
        source: 'hardcoded' 
      });
    }

    // 문장 조회
    let sentencesQuery = supabase
      .from('sentences')
      .select('*')
      .eq('category_id', category.id)
      .eq('is_active', true)
      .limit(parseInt(limit));

    // 랜덤 순서로 가져오기
    if (random) {
      // Supabase는 직접적인 random 지원이 제한적이므로
      // 모든 문장을 가져온 후 클라이언트에서 섞기
      sentencesQuery = sentencesQuery.limit(50); // 충분한 수를 가져옴
    }

    const { data: sentences, error: sentencesError } = await sentencesQuery;

    if (sentencesError) {
      console.error('문장 조회 실패:', sentencesError);
      return NextResponse.json({ 
        sentences: getDefaultSentences(level || 'beginner', purpose || 'conversation'),
        source: 'hardcoded' 
      });
    }

    // 랜덤 섞기 및 limit 적용
    let finalSentences = sentences || [];
    if (random && finalSentences.length > 0) {
      finalSentences = shuffleArray(finalSentences).slice(0, parseInt(limit));
    }

    console.log(`✅ ${finalSentences.length}개 문장 반환`);

    return NextResponse.json({ 
      sentences: finalSentences,
      source: 'database'
    });

  } catch (error) {
    console.error('💥 문장 API 오류:', error);
    return NextResponse.json({ 
      sentences: getDefaultSentences('beginner', 'conversation'),
      source: 'hardcoded',
      error: 'Database error' 
    });
  }
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 하드코딩된 기본 문장들 (fallback)
function getDefaultSentences(level: string, purpose: string) {
  const sentences = {
    beginner: {
      conversation: [
        { text: "We call it bear.", translation_ko: "우리는 그것을 곰이라고 불러요." },
        { text: "It is a nice day.", translation_ko: "좋은 날이에요." },
        { text: "I like to read books.", translation_ko: "나는 책 읽는 것을 좋아해요." },
        { text: "She has a red car.", translation_ko: "그녀는 빨간 차를 가지고 있어요." },
        { text: "The cat is sleeping.", translation_ko: "고양이가 자고 있어요." }
      ],
      business: [
        { text: "Good morning everyone.", translation_ko: "모두 좋은 아침이에요." },
        { text: "Please take a seat.", translation_ko: "자리에 앉아주세요." },
        { text: "Thank you for coming.", translation_ko: "와주셔서 감사합니다." },
        { text: "Let's start the meeting.", translation_ko: "회의를 시작합시다." },
        { text: "Have a great day.", translation_ko: "좋은 하루 보내세요." }
      ],
      exam: [
        { text: "Education is important.", translation_ko: "교육은 중요합니다." },
        { text: "Study hard every day.", translation_ko: "매일 열심히 공부하세요." },
        { text: "Knowledge is power.", translation_ko: "아는 것이 힘입니다." },
        { text: "Learning never stops.", translation_ko: "배움은 끝이 없습니다." },
        { text: "Books are our friends.", translation_ko: "책은 우리의 친구입니다." }
      ]
    },
    intermediate: {
      conversation: [
        { text: "I'm planning to visit my family next weekend.", translation_ko: "다음 주말에 가족을 방문할 계획이에요." },
        { text: "The restaurant we went to last night was amazing.", translation_ko: "어젯밤에 갔던 레스토랑은 정말 놀라웠어요." },
        { text: "I've been learning English for about two years now.", translation_ko: "이제 영어를 배운 지 약 2년이 되었어요." },
        { text: "Would you mind if I joined your conversation?", translation_ko: "대화에 참여해도 될까요?" },
        { text: "I completely agree with your opinion on this matter.", translation_ko: "이 문제에 대한 당신의 의견에 전적으로 동의합니다." }
      ],
      business: [
        { text: "I'd like to discuss the project timeline with you.", translation_ko: "프로젝트 일정에 대해 논의하고 싶습니다." },
        { text: "Our quarterly results exceeded expectations significantly.", translation_ko: "분기 실적이 예상을 크게 초과했습니다." },
        { text: "We need to implement new strategies for better efficiency.", translation_ko: "효율성 향상을 위해 새로운 전략을 실행해야 합니다." },
        { text: "The presentation went smoothly thanks to everyone's effort.", translation_ko: "모두의 노력 덕분에 프레젠테이션이 순조롭게 진행되었습니다." },
        { text: "I'm confident that we can achieve our goals together.", translation_ko: "우리가 함께 목표를 달성할 수 있다고 확신합니다." }
      ],
      exam: [
        { text: "Academic success requires consistent effort and dedication.", translation_ko: "학업 성공은 꾸준한 노력과 헌신을 필요로 합니다." },
        { text: "The research methodology was thoroughly explained in the paper.", translation_ko: "연구 방법론이 논문에 자세히 설명되어 있습니다." },
        { text: "Environmental conservation is becoming increasingly important globally.", translation_ko: "환경 보전은 전 세계적으로 점점 더 중요해지고 있습니다." },
        { text: "Technology has revolutionized the way we communicate.", translation_ko: "기술은 우리가 소통하는 방식을 혁명적으로 변화시켰습니다." },
        { text: "Critical thinking skills are essential for problem-solving.", translation_ko: "비판적 사고 능력은 문제 해결에 필수적입니다." }
      ]
    },
    advanced: {
      conversation: [
        { text: "I find it fascinating how different cultures approach hospitality.", translation_ko: "다른 문화권이 환대에 접근하는 방식이 매력적이라고 생각합니다." },
        { text: "The nuances in his speech patterns suggest he's quite sophisticated.", translation_ko: "그의 말투의 뉘앙스는 그가 꽤 세련되었음을 시사합니다." },
        { text: "I'm particularly intrigued by the philosophical implications of that statement.", translation_ko: "그 진술의 철학적 함의에 특히 흥미를 느낍니다." },
        { text: "The conversation meandered through various topics before settling on politics.", translation_ko: "대화는 정치로 정착하기 전에 다양한 주제를 거쳐갔습니다." },
        { text: "His articulate explanation clarified several misconceptions I had.", translation_ko: "그의 명료한 설명은 내가 가지고 있던 여러 오해를 해소해주었습니다." }
      ],
      business: [
        { text: "We need to leverage our competitive advantages strategically.", translation_ko: "우리는 경쟁 우위를 전략적으로 활용해야 합니다." },
        { text: "The market volatility requires us to diversify our portfolio.", translation_ko: "시장 변동성은 우리에게 포트폴리오 다각화를 요구합니다." },
        { text: "Stakeholder engagement is crucial for sustainable growth.", translation_ko: "이해관계자 참여는 지속 가능한 성장에 매우 중요합니다." },
        { text: "Our organizational restructuring will optimize operational efficiency.", translation_ko: "조직 개편은 운영 효율성을 최적화할 것입니다." },
        { text: "The comprehensive analysis reveals significant opportunities for expansion.", translation_ko: "종합적인 분석은 확장을 위한 중요한 기회를 보여줍니다." }
      ],
      exam: [
        { text: "The intricate relationship between socioeconomic factors and educational outcomes.", translation_ko: "사회경제적 요인과 교육 성과 간의 복잡한 관계." },
        { text: "Contemporary literature reflects the complexities of modern society.", translation_ko: "현대 문학은 현대 사회의 복잡성을 반영합니다." },
        { text: "Empirical evidence substantiates the hypothesis proposed in the study.", translation_ko: "경험적 증거가 연구에서 제안된 가설을 입증합니다." },
        { text: "The paradigm shift necessitates a fundamental reevaluation of our assumptions.", translation_ko: "패러다임 전환은 우리 가정의 근본적인 재평가를 필요로 합니다." },
        { text: "Interdisciplinary approaches yield more comprehensive solutions to complex problems.", translation_ko: "학제간 접근법은 복잡한 문제에 대한 더 포괄적인 해결책을 제공합니다." }
      ]
    }
  };

  const levelData = sentences[level as keyof typeof sentences] || sentences.beginner;
  const purposeData = levelData[purpose as keyof typeof levelData] || levelData.conversation;
  
  return purposeData;
}

// 문장 사용 통계 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sentenceId, accuracy } = body;

    if (!sentenceId || accuracy === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 통계 업데이트 함수 호출
    const { error } = await supabase.rpc('update_sentence_stats', {
      p_sentence_id: sentenceId,
      p_accuracy: accuracy
    });

    if (error) {
      console.error('통계 업데이트 실패:', error);
      return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('💥 통계 업데이트 API 오류:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}