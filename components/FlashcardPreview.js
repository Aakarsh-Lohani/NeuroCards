'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlashcardPreview({ cards, title, isGenerating }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [savedDeckId, setSavedDeckId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleSaveDeck = async () => {
    if (!cards || cards.length === 0) {
      alert('No cards to save');
      return;
    }

    try {
      setIsSaving(true);
      
      const deckData = {
        title: title || 'Untitled Deck',
        cards: cards,
        tags: []
      };
      
      const response = await fetch('/api/save-deck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deckData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save deck');
      }

      if (data.success) {
        // If using localStorage fallback
        if (data.useLocalStorage) {
          const deckWithId = {
            ...deckData,
            _id: data.deckId,
            totalCards: cards.length,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            studyStats: {
              totalReviews: 0,
              correctAnswers: 0,
              averageScore: 0
            }
          };
          
          // Save to localStorage
          const existingDecks = JSON.parse(localStorage.getItem('neuroCards_decks') || '[]');
          existingDecks.push(deckWithId);
          localStorage.setItem('neuroCards_decks', JSON.stringify(existingDecks));
          
          console.log('Deck saved to localStorage:', deckWithId);
        }
        
        setSavedDeckId(data.deckId);
        alert(data.message || 'Deck saved successfully!');
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Error saving deck:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">AI is working its magic! ✨</h3>
          <p className="text-gray-600 mb-4">
            Analyzing your content and generating intelligent flashcards...
          </p>
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-sm text-orange-600">
              This may take 10-30 seconds depending on content length
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center">
          <div className="text-6xl mb-6">🤖</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Generate</h3>
          <p className="text-gray-600">
            Upload your content or enter text to see AI-generated flashcards here.
          </p>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
            <p className="text-blue-100">
              Card {currentCardIndex + 1} of {cards.length}
            </p>
          </div>
          <div className="text-3xl">🎯</div>
        </div>
      </div>

      <div className="p-8">
        {/* Flashcard */}
        <div className="mb-8">
          <div className="relative h-80" style={{perspective: '1000px'}}>
            <motion.div
              className="absolute inset-0 w-full h-full cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front of card (Question) */}
              <div
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl shadow-lg flex items-center justify-center p-6 border-2 border-orange-200"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)'
                }}
              >
                <div className="text-center">
                  <div className="text-orange-500 text-3xl mb-4">❓</div>
                  <p className="text-xl font-medium text-gray-800 leading-relaxed">
                    {currentCard.question}
                  </p>
                  <div className="mt-6 text-sm text-orange-600">
                    Click to reveal answer
                  </div>
                </div>
              </div>

              {/* Back of card (Answer) */}
              <div
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-lg flex items-center justify-center p-6 border-2 border-green-200"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="text-center">
                  <div className="text-green-500 text-3xl mb-4">✅</div>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {currentCard.answer}
                  </p>
                  <div className="mt-6 text-sm text-green-600">
                    Click to see question
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              currentCardIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl'
            }`}
          >
            <span>←</span>
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCardIndex(index);
                  setIsFlipped(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentCardIndex
                    ? 'bg-orange-500 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNextCard}
            disabled={currentCardIndex === cards.length - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              currentCardIndex === cards.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl'
            }`}
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveDeck}
            disabled={isSaving || savedDeckId}
            className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 ${
              isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : savedDeckId
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSaving ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Saving Deck...</span>
              </div>
            ) : savedDeckId ? (
              <div className="flex items-center justify-center space-x-2">
                <span>✅</span>
                <span>Deck Saved Successfully!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>💾</span>
                <span>Save This Deck</span>
              </div>
            )}
          </motion.button>

          {savedDeckId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <a
                href="/dashboard"
                className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors duration-300"
              >
                View in Dashboard
              </a>
            </motion.div>
          )}
        </div>

        {/* Card Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Confidence: {Math.round((currentCard.confidence || 0.8) * 100)}%</span>
            <span>AI Generated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
