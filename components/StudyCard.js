'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function StudyCard({ card, onAnswer, cardNumber, totalCards }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleAnswer = (correct) => {
    setHasAnswered(true);
    setTimeout(() => {
      onAnswer(correct);
      setIsFlipped(false);
      setHasAnswered(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      {/* Card */}
      <div className="relative h-96 mb-8" style={{perspective: '1000px'}}>
        <motion.div
          className="absolute inset-0 w-full h-full cursor-pointer"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          onClick={() => !hasAnswered && setIsFlipped(!isFlipped)}
        >
          {/* Front of card (Question) */}
          <div
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl shadow-2xl flex items-center justify-center p-8 border-2 border-blue-200"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
          >
            <div className="text-center">
              <div className="text-blue-500 text-4xl mb-6">🤔</div>
              <p className="text-2xl font-medium text-gray-800 leading-relaxed mb-6">
                {card.question}
              </p>
              <div className="text-blue-600 font-medium">
                Click to reveal answer
              </div>
            </div>
          </div>

          {/* Back of card (Answer) */}
          <div
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl shadow-2xl flex items-center justify-center p-8 border-2 border-green-200"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-6">💡</div>
              <p className="text-xl text-gray-800 leading-relaxed mb-8">
                {card.answer}
              </p>
              
              {/* Answer Buttons */}
              {!hasAnswered && (
                <div className="flex space-x-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnswer(false);
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    ❌ Incorrect
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnswer(true);
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    ✅ Correct
                  </motion.button>
                </div>
              )}

              {hasAnswered && (
                <div className="text-green-600 font-medium text-lg">
                  Moving to next card...
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Instructions */}
      {!isFlipped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-4">
            Read the question carefully, then click the card to see the answer.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Question {cardNumber} of {totalCards}</span>
            <span>•</span>
            <span>Click to flip</span>
          </div>
        </motion.div>
      )}

      {/* Skip Button */}
      {isFlipped && !hasAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={() => handleAnswer(false)}
            className="px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
          >
            Skip this card →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
