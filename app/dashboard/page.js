'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import DeckCard from '@/components/DeckCard';
import StudyStats from '@/components/StudyStats';

export default function DashboardPage() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/load-decks');
      const data = await response.json();
      
      if (data.success) {
        // If using localStorage fallback
        if (data.useLocalStorage) {
          console.log('Loading decks from localStorage');
          const localDecks = JSON.parse(localStorage.getItem('neuroCards_decks') || '[]');
          setDecks(localDecks);
        } else {
          setDecks(data.decks);
        }
      } else {
        setError(data.error || 'Failed to load decks');
      }
    } catch (error) {
      console.error('Error loading decks:', error);
      // Fallback to localStorage if API fails
      try {
        const localDecks = JSON.parse(localStorage.getItem('neuroCards_decks') || '[]');
        setDecks(localDecks);
        console.log('Loaded decks from localStorage fallback:', localDecks);
      } catch (localError) {
        setError('Failed to connect to server and localStorage unavailable');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeck = async (deckId) => {
    try {
      // Check if it's a localStorage deck
      if (deckId.startsWith('local_')) {
        const existingDecks = JSON.parse(localStorage.getItem('neuroCards_decks') || '[]');
        const updatedDecks = existingDecks.filter(deck => deck._id !== deckId);
        localStorage.setItem('neuroCards_decks', JSON.stringify(updatedDecks));
        setDecks(decks.filter(deck => deck._id !== deckId));
        return;
      }
      
      const response = await fetch(`/api/load-decks?id=${deckId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDecks(decks.filter(deck => deck._id !== deckId));
      } else {
        alert(data.error || 'Failed to delete deck');
      }
    } catch (error) {
      console.error('Error deleting deck:', error);
      alert('Failed to delete deck');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your decks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Your Learning
              <span className="text-orange-500"> Dashboard</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your progress and manage your flashcard collections
            </p>
          </motion.div>

          {/* Study Stats */}
          <StudyStats decks={decks} />

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center space-x-3">
                <span className="text-red-500 text-2xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-red-800">Error Loading Decks</h3>
                  <p className="text-red-600">{error}</p>
                  <button 
                    onClick={loadDecks}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Decks Grid */}
          {!error && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Flashcard Decks ({decks.length})
                </h2>
                <a
                  href="/create"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  + Create New Deck
                </a>
              </div>

              {decks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-6">📚</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Decks Yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Start your learning journey by creating your first AI-powered flashcard deck.
                  </p>
                  <a
                    href="/create"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Create Your First Deck
                  </a>
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {decks.map((deck, index) => (
                    <motion.div
                      key={deck._id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <DeckCard 
                        deck={deck} 
                        onDelete={handleDeleteDeck}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
