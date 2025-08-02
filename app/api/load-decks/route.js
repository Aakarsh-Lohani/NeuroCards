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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const deckId = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = parseInt(searchParams.get('skip')) || 0;

    console.log('Load decks request:', { deckId, limit, skip });

    // If MongoDB URI is not set, return empty for localStorage handling
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password')) {
      console.log('MongoDB not configured, returning empty for localStorage');
      return NextResponse.json({
        success: true,
        decks: [],
        pagination: {
          total: 0,
          currentPage: 1,
          totalPages: 0,
          hasMore: false
        },
        useLocalStorage: true
      });
    }

    // Connect to MongoDB
    const client = await connectToMongoDB();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // If specific deck ID is requested
    if (deckId) {
      try {
        const deck = await collection.findOne({ _id: new ObjectId(deckId) });
        
        if (!deck) {
          return NextResponse.json(
            { error: 'Deck not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          deck: deck
        });
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid deck ID format' },
          { status: 400 }
        );
      }
    }

    // Load all decks (summary view)
    const decks = await collection
      .find({}, {
        projection: {
          title: 1,
          totalCards: 1,
          createdAt: 1,
          updatedAt: 1,
          tags: 1,
          studyStats: 1,
          cards: { $slice: 1 } // Only get first card for preview
        }
      })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalDecks = await collection.countDocuments({});

    // Format the response
    const formattedDecks = decks.map(deck => ({
      _id: deck._id,
      title: deck.title,
      totalCards: deck.totalCards,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
      tags: deck.tags || [],
      studyStats: deck.studyStats || {
        totalReviews: 0,
        correctAnswers: 0,
        averageScore: 0
      },
      preview: deck.cards && deck.cards.length > 0 ? deck.cards[0].question : null
    }));

    return NextResponse.json({
      success: true,
      decks: formattedDecks,
      pagination: {
        total: totalDecks,
        currentPage: Math.floor(skip / limit) + 1,
        totalPages: Math.ceil(totalDecks / limit),
        hasMore: skip + limit < totalDecks
      }
    });

  } catch (error) {
    console.error('Load decks API error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to load decks. Please try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const deckId = searchParams.get('id');

    if (!deckId) {
      return NextResponse.json(
        { error: 'Deck ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await connectToMongoDB();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    try {
      const result = await collection.deleteOne({ _id: new ObjectId(deckId) });
      
      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Deck not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Deck deleted successfully'
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid deck ID format' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Delete deck API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete deck. Please try again.' },
      { status: 500 }
    );
  }
}
