import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

// Enhanced Hugging Face configuration with multiple models
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
const hf = HF_TOKEN ? new HfInference(HF_TOKEN) : null;

// Fallback models to try in order
const FALLBACK_MODELS = [
  'distilbert-base-cased-distilled-squad',
  'deepset/roberta-base-squad2',
  'microsoft/DialoGPT-medium',
  'google/flan-t5-base'
];

// Simple question generation using text patterns
function generateQuestionsFromText(text) {
  try {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const cards = [];
    
    for (let i = 0; i < Math.min(sentences.length, 10); i++) {
      const sentence = sentences[i].trim();
      if (sentence.length < 20) continue;
      
      // Try to identify key concepts
      const words = sentence.split(' ').filter(w => w.length > 3);
      if (words.length < 3) continue;
      
      // Generate different types of questions
      let question, answer;
      
      if (sentence.includes(' is ') || sentence.includes(' are ')) {
        // Definition-based questions
        const parts = sentence.split(/ is | are /);
        if (parts.length >= 2) {
          question = `What is ${parts[0].trim()}?`;
          answer = parts.slice(1).join(' is ').trim();
        }
      } else if (sentence.includes(' because ') || sentence.includes(' due to ')) {
        // Cause-effect questions
        const parts = sentence.split(/ because | due to /);
        if (parts.length >= 2) {
          question = `Why ${parts[0].trim().toLowerCase()}?`;
          answer = `Because ${parts[1].trim()}`;
        }
      } else if (sentence.includes(' when ') || sentence.includes(' where ')) {
        // Context questions
        question = `Explain: ${sentence.substring(0, 50)}...`;
        answer = sentence;
      } else {
        // General comprehension questions
        const keyWords = words.slice(0, 3).join(' ');
        question = `What can you tell me about ${keyWords}?`;
        answer = sentence;
      }
      
      if (question && answer && question.length > 10 && answer.length > 10) {
        cards.push({
          question: question,
          answer: answer,
          confidence: 0.7
        });
      }
    }
    
    // If we have too few cards, create some fill-in-the-blank questions
    if (cards.length < 3) {
      const importantSentences = sentences.filter(s => s.length > 30 && s.length < 150);
      for (const sentence of importantSentences.slice(0, 5)) {
        const words = sentence.split(' ');
        if (words.length > 5) {
          const keyWordIndex = Math.floor(words.length / 2);
          const keyWord = words[keyWordIndex];
          if (keyWord.length > 3) {
            const questionSentence = words.map((w, i) => i === keyWordIndex ? '____' : w).join(' ');
            cards.push({
              question: `Fill in the blank: ${questionSentence}`,
              answer: keyWord,
              confidence: 0.6
            });
          }
        }
      }
    }
    
    return cards.slice(0, 8); // Limit to 8 cards
  } catch (error) {
    console.error('Error in simple question generation:', error);
    return [];
  }
}

// Enhanced AI question generation with fallbacks
async function generateQuestionsWithAI(text) {
  if (!hf || !HF_TOKEN || HF_TOKEN.includes('your-token-here')) {
    console.log('No valid HF token, using simple generation');
    return generateQuestionsFromText(text);
  }

  // Try different approaches with different models
  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      
      if (model.includes('squad')) {
        // Use question-answering models
        const context = text.substring(0, 1000); // Limit context length
        const questions = [
          "What is the main topic?",
          "What are the key points?",
          "What is important to remember?",
          "What is the definition?",
          "How does this work?"
        ];
        
        const cards = [];
        for (const question of questions) {
          try {
            const result = await hf.questionAnswering({
              model: model,
              inputs: {
                question: question,
                context: context
              }
            });
            
            if (result.answer && result.answer.length > 5 && result.score > 0.1) {
              cards.push({
                question: question,
                answer: result.answer,
                confidence: result.score
              });
            }
          } catch (error) {
            console.log(`Question failed for ${model}:`, error.message);
            continue;
          }
        }
        
        if (cards.length > 0) {
          console.log(`Generated ${cards.length} cards with ${model}`);
          return cards;
        }
      } else {
        // Use text generation models
        const prompt = `Create study questions and answers from this text:\n\n${text.substring(0, 500)}\n\nQ1:`;
        
        const result = await hf.textGeneration({
          model: model,
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            do_sample: true
          }
        });
        
        if (result.generated_text) {
          // Parse the generated text for Q&A pairs
          const generatedText = result.generated_text.replace(prompt, '');
          const cards = parseGeneratedQA(generatedText);
          if (cards.length > 0) {
            console.log(`Generated ${cards.length} cards with ${model}`);
            return cards;
          }
        }
      }
    } catch (error) {
      console.log(`Model ${model} failed:`, error.message);
      continue;
    }
  }
  
  // If all AI methods fail, fall back to simple generation
  console.log('All AI methods failed, using simple generation');
  return generateQuestionsFromText(text);
}

// Parse generated Q&A text
function parseGeneratedQA(text) {
  const cards = [];
  const lines = text.split('\n');
  let currentQuestion = '';
  let currentAnswer = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^Q\d*:?\s*/i)) {
      if (currentQuestion && currentAnswer) {
        cards.push({
          question: currentQuestion,
          answer: currentAnswer,
          confidence: 0.8
        });
      }
      currentQuestion = trimmed.replace(/^Q\d*:?\s*/i, '');
      currentAnswer = '';
    } else if (trimmed.match(/^A\d*:?\s*/i)) {
      currentAnswer = trimmed.replace(/^A\d*:?\s*/i, '');
    } else if (currentAnswer && trimmed) {
      currentAnswer += ' ' + trimmed;
    } else if (currentQuestion && trimmed && !currentAnswer) {
      currentQuestion += ' ' + trimmed;
    }
  }
  
  if (currentQuestion && currentAnswer) {
    cards.push({
      question: currentQuestion,
      answer: currentAnswer,
      confidence: 0.8
    });
  }
  
  return cards.filter(card => card.question.length > 5 && card.answer.length > 5);
}

export async function POST(request) {
  try {
    const { text, title } = await request.json();
    
    console.log('Generate QA request received:', { 
      textLength: text?.length, 
      title,
      hasHfToken: !!HF_TOKEN && !HF_TOKEN.includes('your-token-here')
    });
    
    // Validation
    if (!text || typeof text !== 'string' || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Text must be at least 50 characters long' },
        { status: 400 }
      );
    }

    const cleanText = text.trim();
    
    // Generate questions using enhanced AI with fallbacks
    const cards = await generateQuestionsWithAI(cleanText);
    
    if (!cards || cards.length === 0) {
      return NextResponse.json(
        { error: 'Could not generate any flashcards from the provided text. Please try with more structured content.' },
        { status: 400 }
      );
    }

    console.log(`Generated ${cards.length} flashcards successfully`);

    return NextResponse.json({
      success: true,
      cards: cards,
      title: title || 'Generated Flashcards',
      message: `Successfully generated ${cards.length} flashcards`,
      method: HF_TOKEN && !HF_TOKEN.includes('your-token-here') ? 'AI-Enhanced' : 'Rule-Based'
    });

  } catch (error) {
    console.error('Generate QA error:', error);
    
    // Try simple generation as final fallback
    try {
      const { text, title } = await request.json();
      if (text && text.length > 50) {
        const fallbackCards = generateQuestionsFromText(text);
        if (fallbackCards.length > 0) {
          return NextResponse.json({
            success: true,
            cards: fallbackCards,
            title: title || 'Generated Flashcards',
            message: `Generated ${fallbackCards.length} flashcards using backup method`,
            method: 'Fallback'
          });
        }
      }
    } catch (fallbackError) {
      console.error('Fallback generation failed:', fallbackError);
    }
    
    return NextResponse.json(
      { error: 'Failed to generate flashcards. Please try again with different content.' },
      { status: 500 }
    );
  }
}
