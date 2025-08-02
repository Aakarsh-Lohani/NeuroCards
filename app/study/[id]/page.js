'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StudyCard from '@/components/StudyCard';

export default function StudyPage() {
  const params = useParams();
  const deckId = params.id;
  
  const [deck, setDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyComplete, setStudyComplete] = useState(false);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });

  useEffect(() => {
    if (deckId) {
      loadDeck();
    }
  }, [deckId]);

  const loadDeck = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/load-decks?id=${deckId}`);
      const data = await response.json();
      
      if (data.success) {
        setDeck(data.deck);
        setStudyStats(prev => ({ ...prev, total: data.deck.cards.length }));
      } else {
        setError(data.error || 'Failed to load deck');
      }
    } catch (error) {
      console.error('Error loading deck:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (correct) => {
    setStudyStats(prev => ({
      ...prev,
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: correct ? prev.incorrect : prev.incorrect + 1
    }));

    // Move to next card or complete study
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setStudyComplete(true);
    }
  };

  const restartStudy = () => {
    setCurrentCardIndex(0);
    setStudyComplete(false);
    setStudyStats({
      correct: 0,
      incorrect: 0,
      total: deck.cards.length
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your study session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-6">😔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (studyComplete) {
    const accuracy = Math.round((studyStats.correct / studyStats.total) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navbar />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="text-8xl mb-8">🎉</div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                Study Session Complete!
              </h1>
              
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Results</h2>
                
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="p-6 bg-green-50 rounded-2xl">
                    <div className="text-3xl font-black text-green-600 mb-2">
                      {studyStats.correct}
                    </div>
                    <div className="text-green-600 font-medium">Correct</div>
                  </div>
                  <div className="p-6 bg-red-50 rounded-2xl">
                    <div className="text-3xl font-black text-red-600 mb-2">
                      {studyStats.incorrect}
                    </div>
                    <div className="text-red-600 font-medium">Incorrect</div>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-2xl">
                    <div className="text-3xl font-black text-blue-600 mb-2">
                      {accuracy}%
                    </div>
                    <div className="text-blue-600 font-medium">Accuracy</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={restartStudy}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Study Again
                  </button>
                  <div className="flex space-x-4">
                    <a
                      href="/dashboard"
                      className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-300"
                    >
                      Back to Dashboard
                    </a>
                    <a
                      href="/create"
                      className="flex-1 py-3 bg-blue-100 text-blue-700 font-semibold rounded-xl hover:bg-blue-200 transition-colors duration-300"
                    >
                      Create New Deck
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Studying: <span className="text-orange-500">{deck.title}</span>
            </h1>
            <div className="flex items-center justify-center space-x-8 text-gray-600">
              <span>Card {currentCardIndex + 1} of {deck.cards.length}</span>
              <span>•</span>
              <span>Correct: {studyStats.correct}</span>
              <span>•</span>
              <span>Incorrect: {studyStats.incorrect}</span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentCardIndex) / deck.cards.length) * 100}%` }}
            ></div>
          </div>

          {/* Study Card */}
          <StudyCard
            card={deck.cards[currentCardIndex]}
            onAnswer={handleAnswer}
            cardNumber={currentCardIndex + 1}
            totalCards={deck.cards.length}
          />
        </div>
      </main>
    </div>
  );
}
