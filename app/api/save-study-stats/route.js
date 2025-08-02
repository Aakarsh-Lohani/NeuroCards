import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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
    // Check if request has a body
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    let requestData;
    try {
      requestData = await request.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { deckId, studyStats } = requestData;
    
    console.log('Study stats request:', { deckId, studyStats });
    
    // Validation
    if (!deckId || !studyStats) {
      return NextResponse.json(
        { error: 'Deck ID and study stats are required' },
        { status: 400 }
      );
    }

    const { correct, incorrect, total } = studyStats;
    if (typeof correct !== 'number' || typeof incorrect !== 'number' || typeof total !== 'number') {
      return NextResponse.json(
        { error: 'Invalid study stats format' },
        { status: 400 }
      );
    }

    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // If MongoDB URI is not set, use localStorage fallback
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password')) {
      console.log('MongoDB not configured, using localStorage fallback');
      
      // Return success for localStorage handling on client
      return NextResponse.json({
        success: true,
        message: 'Study stats will be stored locally (MongoDB not configured)',
        stats: {
          accuracy,
          correct,
          incorrect,
          total,
          lastStudied: new Date().toISOString()
        },
        useLocalStorage: true
      });
    }

    // Connect to MongoDB
    const client = await connectToMongoDB();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Check if deck exists
    const deck = await collection.findOne({ _id: new ObjectId(deckId) });
    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      );
    }

    // Update deck with study statistics
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(deckId) },
      {
        $set: {
          'studyStats.lastAccuracy': accuracy,
          'studyStats.lastCorrect': correct,
          'studyStats.lastIncorrect': incorrect,
          'studyStats.lastStudied': new Date(),
          'studyStats.updatedAt': new Date()
        },
        $inc: {
          'studyStats.totalReviews': 1,
          'studyStats.totalCorrect': correct,
          'studyStats.totalIncorrect': incorrect
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update study stats' },
        { status: 500 }
      );
    }

    // Calculate overall average accuracy
    const updatedDeck = await collection.findOne({ _id: new ObjectId(deckId) });
    const overallAccuracy = updatedDeck.studyStats.totalReviews > 0 
      ? Math.round((updatedDeck.studyStats.totalCorrect / (updatedDeck.studyStats.totalCorrect + updatedDeck.studyStats.totalIncorrect)) * 100)
      : 0;

    // Update overall accuracy
    await collection.updateOne(
      { _id: new ObjectId(deckId) },
      {
        $set: {
          'studyStats.overallAccuracy': overallAccuracy
        }
      }
    );

    console.log('Study stats updated successfully for deck:', deckId);

    return NextResponse.json({
      success: true,
      message: 'Study statistics saved successfully',
      stats: {
        sessionAccuracy: accuracy,
        correct,
        incorrect,
        total,
        overallAccuracy,
        totalReviews: updatedDeck.studyStats.totalReviews + 1
      }
    });

  } catch (error) {
    console.error('Error saving study stats:', error);
    return NextResponse.json(
      { error: 'Failed to save study statistics' },
      { status: 500 }
    );
  }
}
