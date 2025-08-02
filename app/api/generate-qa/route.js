import { NextResponse } from 'next/server';

// Hugging Face API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/distilbert-base-cased-distilled-squad';
const HF_TOKEN = process.env.HUGGING_FACE_TOKEN; // Add this to your .env.local

// Helper function to chunk text into smaller segments
function chunkText(text, maxTokens = 300) {
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = [];
  
  for (const word of words) {
    if (currentChunk.join(' ').length + word.length > maxTokens * 4) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
        currentChunk = [];
      }
    }
    currentChunk.push(word);
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }
  
  return chunks;
}

// Generate questions from context using various strategies
function generateQuestions(context) {
  const questions = [];
  
  // Strategy 1: Extract key concepts and create "What is..." questions
  const sentences = context.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  sentences.forEach((sentence, index) => {
    if (index < 5) { // Limit to 5 questions per chunk
      // Create simple questions based on sentence structure
      const trimmed = sentence.trim();
      if (trimmed.length > 30) {
        // Generate different types of questions
        questions.push(`What is mentioned about ${trimmed.split(' ').slice(0, 3).join(' ')}?`);
        questions.push(`Explain the concept discussed in: "${trimmed.slice(0, 50)}..."`);
      }
    }
  });
  
  return questions.slice(0, 3); // Return max 3 questions per chunk
}

// Call Hugging Face API for Q&A
async function callHuggingFaceAPI(question, context) {
  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          question: question,
          context: context
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Hugging Face API error:', error);
    // Fallback: create simple Q&A from context
    return {
      answer: context.split(' ').slice(0, 20).join(' ') + '...',
      score: 0.5
    };
  }
}

export async function POST(request) {
  try {
    const { text, title = 'Generated Flashcards' } = await request.json();
    
    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Text is too short. Please provide at least 50 characters of content.' },
        { status: 400 }
      );
    }

    // Check if HF token is available
    if (!HF_TOKEN) {
      console.warn('Hugging Face token not found, using fallback method');
    }

    // Chunk the text
    const chunks = chunkText(text);
    const allCards = [];

    // Process each chunk
    for (const chunk of chunks) {
      const questions = generateQuestions(chunk);
      
      for (const question of questions) {
        try {
          let answer;
          
          if (HF_TOKEN) {
            // Use Hugging Face API
            const hfResult = await callHuggingFaceAPI(question, chunk);
            answer = hfResult.answer || chunk.split(' ').slice(0, 25).join(' ') + '...';
          } else {
            // Fallback: extract relevant sentences
            const sentences = chunk.split(/[.!?]+/).filter(s => s.trim().length > 10);
            answer = sentences[0]?.trim() || chunk.split(' ').slice(0, 25).join(' ') + '...';
          }

          allCards.push({
            question: question,
            answer: answer,
            confidence: 0.8
          });
        } catch (error) {
          console.error('Error processing question:', error);
          // Skip this question and continue
        }
      }
    }

    // Ensure we have at least some cards
    if (allCards.length === 0) {
      // Create basic cards as fallback
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
      sentences.slice(0, 5).forEach((sentence, index) => {
        allCards.push({
          question: `What does this statement mean: "${sentence.trim().slice(0, 50)}..."?`,
          answer: sentence.trim(),
          confidence: 0.6
        });
      });
    }

    return NextResponse.json({
      success: true,
      title: title,
      cards: allCards.slice(0, 10), // Limit to 10 cards
      totalCards: allCards.length
    });

  } catch (error) {
    console.error('Generate QA API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards. Please try again.' },
      { status: 500 }
    );
  }
}
