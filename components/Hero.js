'use client';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 bg-gradient-to-br from-orange-50 via-white to-pink-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-yellow-400 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-4">
            <span className="text-orange-500">Neuro</span>Cards
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto rounded-full"></div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed"
        >
          A new era of <span className="font-semibold text-orange-600">AI-powered learning</span> and memory enhancement.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg text-gray-600 max-w-3xl mx-auto mb-12"
        >
          Activate Your Memory Muscle – instantly turn your notes, PDFs, images, and videos into AI-powered flashcards and adaptive quizzes.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="/create"
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </a>
          <a
            href="/dashboard"
            className="px-8 py-4 border-2 border-orange-500 text-orange-600 font-semibold rounded-full hover:bg-orange-50 transition-all duration-300"
          >
            View Dashboard
          </a>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-sm text-gray-500"
        >
          India's most innovative flashcard platform with 10,000+ active learners
        </motion.div>
      </div>
    </section>
  );
}