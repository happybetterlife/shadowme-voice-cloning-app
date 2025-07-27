import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text = '' } = body;
    
    // Simulate more realistic voice analysis scores
    const words = text.split(' ').filter(word => word.length > 0);
    const wordAnalysis = words.map((word, index) => {
      // More realistic scoring based on word difficulty
      let baseScore = 80;
      
      // Adjust based on word length (longer words are harder)
      if (word.length > 6) baseScore -= 5;
      else if (word.length < 3) baseScore += 5;
      
      // Add some variation but keep it more consistent
      const variation = Math.floor(Math.random() * 15) - 7; // -7 to +7
      const finalScore = Math.max(70, Math.min(95, baseScore + variation));
      
      return {
        word,
        accuracy: finalScore,
        start_time: index * 0.5,
        end_time: (index + 1) * 0.5,
      };
    });

    const overallAccuracy = wordAnalysis.length > 0 
      ? Math.round(wordAnalysis.reduce((sum: number, w: any) => sum + w.accuracy, 0) / wordAnalysis.length)
      : 85;

    return NextResponse.json({
      success: true,
      overall_accuracy: overallAccuracy,
      word_analysis: wordAnalysis,
      fluency: Math.round(overallAccuracy * 0.9),
      pronunciation: Math.round(overallAccuracy * 0.95),
      confidence: 88,
      suggestions: overallAccuracy > 80 
        ? ["Great pronunciation! Keep practicing!", "Focus on the rhythm and intonation."]
        : ["Try speaking more slowly and clearly", "Practice individual words first"]
    });

  } catch (error) {
    console.error('Voice analysis error:', error);
    return NextResponse.json({ error: 'Voice analysis failed' }, { status: 500 });
  }
}