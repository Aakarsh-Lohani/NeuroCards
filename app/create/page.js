'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import FlashcardPreview from '@/components/FlashcardPreview';

export default function CreatePage() {
  const [generatedCards, setGeneratedCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deckTitle, setDeckTitle] = useState('');

  const handleCardsGenerated = (cards, title) => {
    setGeneratedCards(cards);
    setDeckTitle(title);
  };

  return (
    <div className="min-h-screen bg-white">
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
              Create Your
              <span className="text-orange-500"> AI Flashcards</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your content and watch AI transform it into powerful learning tools
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: File Upload */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <FileUpload 
                onCardsGenerated={handleCardsGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </motion.div>

            {/* Right: Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <FlashcardPreview 
                cards={generatedCards}
                title={deckTitle}
                isGenerating={isGenerating}
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
