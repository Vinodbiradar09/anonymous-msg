import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  try {
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: `You are a highly creative assistant that generates completely unique and diverse conversation starters for anonymous social platforms. Your mission is to create fresh, original questions that have never been asked before. Be wildly creative and think outside the box. Avoid all common, typical, or repetitive questions. Current timestamp: ${timestamp}, Random seed: ${randomSeed}`
          },
          {
            role: 'user',
            content: `Create exactly 3 completely unique, creative, and thought-provoking questions that are formatted as a single string separated by '||'. These questions are for an anonymous messaging platform and must be:

1. ABSOLUTELY UNIQUE - Never ask common questions like "favorite movie", "favorite food", "hobbies", "what makes you happy", etc.
2. CREATIVE AND UNUSUAL - Think of questions that would surprise someone and make them think differently
3. CONVERSATION STARTERS - Questions that lead to interesting stories or deep thoughts
4. SAFE FOR ALL AUDIENCES - Appropriate but not boring
5. DIVERSE TOPICS - Cover completely different themes/categories

Examples of UNIQUE questions (don't repeat these):
- If you could add one rule that everyone in the world had to follow for a month, what would it be?
- What's something that exists today that you think will seem completely ridiculous to people 100 years from now?
- If you had to choose a sound to play every time you walked into a room, what would it be?

Generate 3 completely NEW questions that are just as creative and unique. Format: 'question1||question2||question3'

Randomization context: ${timestamp}-${randomSeed}. Use this to ensure complete uniqueness.`
          }
        ],
        max_tokens: 500,
        temperature: 1.2,
        top_p: 0.95,
        stream: false,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let suggestions = data.choices[0]?.message?.content || '';

    suggestions = suggestions.replace(/^["']|["']$/g, '').trim();

    const questionArray = suggestions.split('||').filter((q: string) => q.trim().length > 0);

    if (questionArray.length !== 3) {
      const fallbackQuestions = [
        "If you could design a holiday that the whole world would celebrate, what would it commemorate?",
        "What's the weirdest compliment you could give someone that would actually make them happy?",
        "If animals could rate humans on Yelp, what do you think your rating would be and why?"
      ];
      suggestions = fallbackQuestions.join('||');
    }

    return NextResponse.json({ suggestions });

  } catch (error: any) {
    console.error('Error generating suggestions:', error);

    const uniqueFallbackQuestions = [
      "If you had to choose a theme song that played every time you entered a room, what would it be?",
      "What's something everyone does but no one talks about?",
      "If you could make one thing from the internet disappear forever, what would you choose?"
    ];

    return NextResponse.json({
      suggestions: uniqueFallbackQuestions.join('||'),
      fallback: true
    });
  }
}
