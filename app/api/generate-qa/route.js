
import { NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference';

// Initialize Hugging Face Inference client
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
const hf = HF_TOKEN ? new InferenceClient(HF_TOKEN) : null;

// Initialize Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Fallback models to try in order
const QG_MODEL = 'doc2query/msmarco-t5-base-v1'; 
const QA_MODELS = [
  'distilbert-base-cased-distilled-squad', // Free-tier QA model
  'deepset/roberta-base-squad2'
];

// Gemini-powered content moderation
async function moderateContentWithGemini(text) {
    if (!GEMINI_API_KEY) {
        console.log("No Gemini key, skipping moderation.");
        return "SAFE"; // If no key, bypass check for now.
    }

    console.log('Checking content with Gemini moderation...');
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Analyze the following text for any content policy violations (e.g., hate speech, harassment, violence, self-harm,underage content, harmful content, sexual content, etc.). Respond with only "SAFE" if no violations are found, or "UNSAFE" if violations are present.

                            Text: "${text}"

                            Classification:`
                        }]
                    }]
                })
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gemini moderation API request failed with status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        const classification = data.candidates[0]?.content?.parts[0]?.text.trim().toUpperCase();
        
        console.log(`Gemini moderation result: ${classification}`);
        return classification === "SAFE" ? "SAFE" : "UNSAFE";

    } catch (error) {
        console.error('Gemini moderation failed:', error.message);
        // Fail cautiously. If moderation API fails, we don't process the content.
        return "UNSAFE"; 
    }
}


// Rule-based question generation
function generateQuestionsFromText(text) {
  try {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const cards = [];
    for (let i = 0; i < Math.min(sentences.length, 10); i++) {
      const sentence = sentences[i].trim();
      if (sentence.length < 20) continue;

      const words = sentence.split(' ').filter(w => w.length > 3);
      if (words.length < 3) continue;

      let question, answer;

      if (sentence.includes(' is ') || sentence.includes(' are ')) {
        const parts = sentence.split(/ is | are /);
        if (parts.length >= 2) {
          question = `What is ${parts[0].trim()}?`;
          answer = parts.slice(1).join(' is ').trim();
        }
      } else if (sentence.includes(' because ') || sentence.includes(' due to ')) {
        const parts = sentence.split(/ because | due to /);
        if (parts.length >= 2) {
          question = `Why ${parts[0].trim().toLowerCase()}?`;
          answer = `Because ${parts[1].trim()}`;
        }
      } else if (sentence.includes(' when ') || sentence.includes(' where ')) {
        question = `Explain: ${sentence.substring(0, 50)}...`;
        answer = sentence;
      } else {
        const keyWords = words.slice(0, 3).join(' ');
        question = `What can you tell me about ${keyWords}?`;
        answer = sentence;
      }

      if (question && answer && question.length > 10 && answer.length > 10) {
        cards.push({ question, answer, confidence: 0.7 });
      }
    }
    return cards.slice(0, 8);
  } catch (error) {
    console.error('Error in simple question generation:', error);
    return [];
  }
}

// Gemini-powered generation
async function generateWithGemini(text) {
    if (!GEMINI_API_KEY) return null;

    console.log('Trying generation with Gemini...');
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
            {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-goog-api-key': GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Generate 8-10 high-quality question and answer pairs from the following text. Provide the output as a valid JSON array of objects, where each object has a "question" and "answer" key.

                            Text: "${text}"
                            
                            JSON Output:`
                        }]
                    }]
                })
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gemini API request failed with status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        const content = data.candidates[0]?.content?.parts[0]?.text;
        
        if (content) {
            // Clean the response to ensure it's valid JSON
            const jsonString = content.replace(/```json|```/g, '').trim();
            const cards = JSON.parse(jsonString);
            console.log(`Successfully generated ${cards.length} cards with Gemini.`);
            return cards.map(card => ({ ...card, confidence: 0.95 }));
        }
    } catch (error) {
        console.error('Gemini generation failed:', error.message);
        return null;
    }
    return null;
}


// AI-enhanced generation
async function generateQuestionsWithAI(text) {
  // Try Gemini first if the API key is available
  if (GEMINI_API_KEY) {
    const geminiResult = await generateWithGemini(text);
    if (geminiResult) {
      return geminiResult;
    }
    console.log('Gemini failed, falling back to Hugging Face.');
  }

  // Fallback to Hugging Face
  if (!hf || !HF_TOKEN || HF_TOKEN.includes('your-token-here')) {
    console.log('No valid HF token, using simple generation');
    return generateQuestionsFromText(text);
  }

  try {
    console.log(`Trying QG model: ${QG_MODEL}`);
    const qgResponse = await hf.textGeneration({
      model: QG_MODEL,
      inputs: text,
      parameters: { max_new_tokens: 200, temperature: 0.7 }
    });

    let questions = [];
    if (qgResponse.generated_text) {
      questions = qgResponse.generated_text
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 5 && q.endsWith('?'));
    }

    console.log(`Generated ${questions.length} questions from QG model`);

    if (questions.length === 0) {
      console.log('QG model did not return questions, falling back to rule-based.');
      return generateQuestionsFromText(text);
    }

    const qaPairs = [];
    for (const question of questions) {
      let answered = false;
      for (const qaModel of QA_MODELS) {
        try {
          const answerResponse = await hf.questionAnswering({
            model: qaModel,
            inputs: { question, context: text }
          });
          if (answerResponse?.answer) {
            qaPairs.push({
              question,
              answer: answerResponse.answer,
              confidence: answerResponse.score || 0.8
            });
            answered = true;
            break;
          }
        } catch (err) {
          console.error(`Answer generation failed with ${qaModel}:`, err.message);
          continue;
        }
      }
      if (!answered) {
        console.warn(`No answer found for question: ${question}`);
      }
    }

    if (qaPairs.length > 0) {
      console.log(`Generated ${qaPairs.length} Q/A pairs with AI`);
      return qaPairs;
    }
  } catch (error) {
    console.error('AI QG/QA generation failed:', error.message);
  }

  console.log('Falling back to rule-based QA');
  return generateQuestionsFromText(text);
}

export async function POST(request) {
  try {
    const { text, title } = await request.json();
    console.log('Generate QA request received:', {
      textLength: text?.length,
      title,
      hasHfToken: !!HF_TOKEN && !HF_TOKEN.includes('your-token-here'),
      hasGeminiToken: !!GEMINI_API_KEY
    });

    if (!text || typeof text !== 'string' || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Text must be at least 50 characters long' },
        { status: 400 }
      );
    }

    const cleanText = text.trim();

    // Content Moderation Step
    const moderationResult = await moderateContentWithGemini(cleanText);
    if (moderationResult !== "SAFE") {
        return NextResponse.json(
            { error: 'Content Policy violation detected. The provided text cannot be processed.' },
            { status: 400 }
        );
    }

    const cards = await generateQuestionsWithAI(cleanText);

    if (!cards || cards.length === 0) {
      return NextResponse.json(
        { error: 'Could not generate any flashcards from the provided text.' },
        { status: 400 }
      );
    }

    console.log(`Generated ${cards.length} flashcards successfully`);
    return NextResponse.json({
      success: true,
      cards,
      title: title || 'Generated Flashcards',
      message: `Successfully generated ${cards.length} flashcards`,
      method: GEMINI_API_KEY ? 'Gemini' : (hf ? 'AI-Enhanced' : 'Rule-Based')
    });

  } catch (error) {
    console.error('Generate QA error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
