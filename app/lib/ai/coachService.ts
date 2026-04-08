import { UserPreferences } from '../../types/workoutTypes';

interface CoachInput {
  preferences: UserPreferences;
  rationale: string[];
  safetyNotes: string[];
}

interface CoachOutput {
  summary: string;
  extraTips: string[];
  provider: 'gemini' | 'openai' | 'fallback';
}

export const generateCoachSummary = async (input: CoachInput): Promise<CoachOutput> => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    const gemini = await generateWithGemini(geminiKey, input);
    if (gemini) return { ...gemini, provider: 'gemini' };
  }

  if (openaiKey) {
    const openai = await generateWithOpenAI(openaiKey, input);
    if (openai) return { ...openai, provider: 'openai' };
  }

  return {
    summary: 'Adaptive plan created with safety constraints, goal-priority scoring, and recovery-aware progression.',
    extraTips: [
      'Log completion and effort after each workout to improve next-week recommendations.',
      'If soreness stays high for 48+ hours, reduce high-intensity work for one session.',
      'Progress load slowly and keep technique quality high.'
    ],
    provider: 'fallback'
  };
};

const basePrompt = (input: CoachInput) => {
  return [
    'You are a concise AI fitness coach.',
    'Output format:',
    'LINE 1: short personalized summary, max 80 words.',
    'LINE 2-4: exactly 3 concise coaching tips.',
    'No diagnosis and no claims of cure.',
    `User profile: ${JSON.stringify(input.preferences)}`,
    `Rationale: ${input.rationale.join(' | ')}`,
    `Safety notes: ${input.safetyNotes.join(' | ') || 'None'}`
  ].join('\n');
};

const parseCoachText = (raw: string): { summary: string; extraTips: string[] } | null => {
  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  const summary = lines[0];
  const extraTips = lines
    .slice(1)
    .map((line) => line.replace(/^[\-\*\d\.\)\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    summary,
    extraTips
  };
};

const generateWithGemini = async (apiKey: string, input: CoachInput) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: basePrompt(input) }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 220
          }
        })
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    return parseCoachText(text);
  } catch (error) {
    console.error('gemini-coach-error', error);
    return null;
  }
};

const generateWithOpenAI = async (apiKey: string, input: CoachInput) => {
  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: basePrompt(input),
        temperature: 0.4
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    const text = (data?.output_text || '').trim();
    if (!text) return null;
    return parseCoachText(text);
  } catch (error) {
    console.error('openai-coach-error', error);
    return null;
  }
};
