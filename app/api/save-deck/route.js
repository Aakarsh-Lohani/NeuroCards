import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'neurocards';
const COLLECTION_NAME = 'flashcards';

let cachedClient = null;

async function connectToMongoDB() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { title, cards, tags = [] } = await request.json();
    
    console.log('Save deck request received:', { title, cardsCount: cards?.length });
    
    // Validation
    if (!title || !cards || !Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json(
        { error: 'Title and cards array are required' },
        { status: 400 }
      );
    }

    // Validate card structure
    for (const card of cards) {
      if (!card.question || !card.answer) {
        return NextResponse.json(
          { error: 'Each card must have a question and answer' },
          { status: 400 }
        );
      }
    }

    // If MongoDB URI is not set, use localStorage fallback
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password')) {
      console.log('MongoDB not configured, using localStorage fallback');
      // Return success for localStorage handling on client
      return NextResponse.json({
        success: true,
        deckId: 'local_' + Date.now(),
        message: 'Deck saved to local storage (MongoDB not configured)',
        deck: {
          _id: 'local_' + Date.now(),
          title: title.trim(),
          totalCards: cards.length,
          createdAt: new Date().toISOString()
        },
        useLocalStorage: true
      });
    }

    // Connect to MongoDB
    const client = await connectToMongoDB();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Create deck document
    const deckDocument = {
      title: title.trim(),
      cards: cards.map(card => ({
        question: card.question.trim(),
        answer: card.answer.trim(),
        confidence: card.confidence || 0.8,
        reviewCount: 0,
        lastReviewed: null,
        nextReview: new Date(),
        difficulty: 1 // For spaced repetition
      })),
      tags: tags.filter(tag => tag && tag.trim()),
      createdAt: new Date(),
      updatedAt: new Date(),
      totalCards: cards.length,
      studyStats: {
        totalReviews: 0,
        correctAnswers: 0,
        averageScore: 0
      }
    };

    // Insert into MongoDB
    const result = await collection.insertOne(deckDocument);
    
    return NextResponse.json({
      success: true,
      deckId: result.insertedId,
      message: 'Deck saved successfully',
      deck: {
        _id: result.insertedId,
        title: deckDocument.title,
        totalCards: deckDocument.totalCards,
        createdAt: deckDocument.createdAt
      }
    });

  } catch (error) {
    console.error('Save deck API error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to save deck. Please try again.' },
      { status: 500 }
    );
  }
}
