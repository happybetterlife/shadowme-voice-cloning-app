#!/usr/bin/env python3
"""
SpeechOcean762 데이터셋을 다운로드하고 ShadowME 앱에서 사용할 수 있는 형태로 변환하는 스크립트
"""

import json
import os
from datasets import load_dataset
import pandas as pd
from typing import List, Dict, Any

def download_speechocean_data():
    """Hugging Face에서 speechocean762 데이터셋 다운로드"""
    print("📥 Downloading speechocean762 dataset...")
    
    try:
        # Hugging Face에서 데이터셋 로드
        dataset = load_dataset("mispeech/speechocean762", split="test")
        print(f"✅ Dataset loaded successfully! Total samples: {len(dataset)}")
        return dataset
    except Exception as e:
        print(f"❌ Failed to download dataset: {e}")
        return None

def categorize_sentences_by_difficulty(dataset) -> Dict[str, List[Dict]]:
    """문장을 난이도별로 분류"""
    sentences = {
        "beginner": [],
        "intermediate": [],
        "advanced": []
    }
    
    for item in dataset:
        text = item.get("text", "").strip()
        if not text:
            continue
            
        # 문장 길이와 복잡도로 난이도 분류
        word_count = len(text.split())
        
        # 발음 평가 점수 활용 (있다면)
        accuracy = item.get("accuracy", 0.7)  # 기본값 0.7
        fluency = item.get("fluency", 0.7)
        
        sentence_data = {
            "id": len(sentences["beginner"]) + len(sentences["intermediate"]) + len(sentences["advanced"]) + 1,
            "text": text,
            "level": "",
            "purpose": "conversation",
            "target_accuracy": accuracy,
            "target_fluency": fluency,
            "word_count": word_count,
            "source": "speechocean762"
        }
        
        # 난이도 분류 로직
        if word_count <= 8 and accuracy >= 0.8:
            sentence_data["level"] = "beginner"
            sentences["beginner"].append(sentence_data)
        elif word_count <= 15 and accuracy >= 0.6:
            sentence_data["level"] = "intermediate"
            sentences["intermediate"].append(sentence_data)
        else:
            sentence_data["level"] = "advanced"
            sentences["advanced"].append(sentence_data)
    
    return sentences

def create_practice_sentences_file(sentences: Dict[str, List[Dict]]):
    """연습용 문장 파일 생성"""
    
    # 각 레벨에서 상위 문장들만 선별 (너무 많으면 앱이 무거워짐)
    selected_sentences = {
        "beginner": {
            "conversation": sentences["beginner"][:20],  # 상위 20개
            "business": []  # 비즈니스 문장은 별도로 추가 가능
        },
        "intermediate": {
            "conversation": sentences["intermediate"][:15],
            "business": []
        },
        "advanced": {
            "conversation": sentences["advanced"][:10],
            "business": []
        }
    }
    
    # TypeScript 파일로 생성
    ts_content = f"""// Generated from speechocean762 dataset
// Total sentences: {sum(len(v) for level in sentences.values() for v in level.values())}

export interface PracticeSentence {{
  id: string;
  text: string;
  level: string;
  purpose: string;
  targetWords?: string[];
  targetAccuracy?: number;
  targetFluency?: number;
  source?: string;
}}

export const speechOceanSentences: Record<string, Record<string, PracticeSentence[]>> = {json.dumps(selected_sentences, indent=2)};

// 발음 평가 기준점 (speechocean762 데이터 기반)
export const pronunciationBenchmarks = {{
  excellent: 0.9,   // 90% 이상
  good: 0.8,        // 80-89%
  fair: 0.7,        // 70-79%
  needsPractice: 0.6 // 60-69%
}};
"""
    
    output_file = "../data/speechocean-sentences.ts"
    os.makedirs("../data", exist_ok=True)
    
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(ts_content)
    
    print(f"✅ Practice sentences saved to: {output_file}")
    return output_file

def create_supabase_migration(sentences: Dict[str, List[Dict]]):
    """Supabase용 SQL 마이그레이션 파일 생성"""
    
    sql_content = """-- SpeechOcean762 데이터셋 기반 연습 문장 테이블
CREATE TABLE IF NOT EXISTS practice_sentences (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    purpose TEXT NOT NULL CHECK (purpose IN ('conversation', 'business', 'exam')),
    word_count INTEGER,
    target_accuracy DECIMAL(3,2),
    target_fluency DECIMAL(3,2),
    source TEXT DEFAULT 'speechocean762',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 데이터 삽입
"""
    
    for level, level_sentences in sentences.items():
        for sentence in level_sentences[:10]:  # 각 레벨당 10개씩만
            text = sentence["text"].replace("'", "''")  # SQL 이스케이프
            sql_content += f"""INSERT INTO practice_sentences (text, level, purpose, word_count, target_accuracy, target_fluency, source) 
VALUES ('{text}', '{level}', 'conversation', {sentence['word_count']}, {sentence.get('target_accuracy', 0.75)}, {sentence.get('target_fluency', 0.75)}, 'speechocean762');
"""
    
    migration_file = "../supabase/migrations/001_add_speechocean_sentences.sql"
    os.makedirs("../supabase/migrations", exist_ok=True)
    
    with open(migration_file, "w", encoding="utf-8") as f:
        f.write(sql_content)
    
    print(f"✅ Supabase migration saved to: {migration_file}")
    return migration_file

def main():
    """메인 실행 함수"""
    print("🚀 Starting SpeechOcean762 data processing for ShadowME...")
    
    # 1. 데이터셋 다운로드
    dataset = download_speechocean_data()
    if not dataset:
        return
    
    # 2. 난이도별 분류
    print("📊 Categorizing sentences by difficulty...")
    sentences = categorize_sentences_by_difficulty(dataset)
    
    print(f"📈 Statistics:")
    for level, level_sentences in sentences.items():
        print(f"  - {level.capitalize()}: {len(level_sentences)} sentences")
    
    # 3. TypeScript 파일 생성 (로컬 사용)
    print("📝 Creating TypeScript data file...")
    create_practice_sentences_file(sentences)
    
    # 4. Supabase 마이그레이션 파일 생성
    print("🗄️ Creating Supabase migration...")
    create_supabase_migration(sentences)
    
    print("🎉 Data processing completed successfully!")
    print("\n📋 Next steps:")
    print("1. Install required packages: pip install datasets pandas")
    print("2. Run this script: python download_speechocean_data.py")
    print("3. Import the generated TypeScript file in your app")
    print("4. Or apply the Supabase migration for database storage")

if __name__ == "__main__":
    main()