'use client';
import { motion } from 'framer-motion';

export default function StudyStats({ decks }) {
  // Calculate overall stats
  const totalCards = decks.reduce((sum, deck) => sum + (deck.totalCards || 0), 0);
  const totalReviews = decks.reduce((sum, deck) => sum + (deck.studyStats?.totalReviews || 0), 0);
  const totalCorrect = decks.reduce((sum, deck) => sum + (deck.studyStats?.correctAnswers || 0), 0);
  const averageAccuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

  const stats = [
    {
      title: 'Total Decks',
      value: decks.length,
      icon: '📚',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Total Cards',
      value: totalCards,
      icon: '🎯',
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Reviews Done',
      value: totalReviews,
      icon: '🔄',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100'
    },
    {
      title: 'Accuracy',
      value: `${averageAccuracy}%`,
      icon: '🎖️',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Study Progress</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="relative group"
          >
            {/* Background decorative element */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300`}></div>
            
            {/* Main card */}
            <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              {/* Icon */}
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              
              {/* Value */}
              <div className="text-3xl font-black text-gray-900 mb-2">
                {stat.value}
              </div>
              
              {/* Title */}
              <div className="text-gray-600 font-medium">
                {stat.title}
              </div>
              
              {/* Decorative bottom element */}
              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-200"
      >
        <div className="flex items-center space-x-4">
          <div className="text-3xl">🚀</div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">
              {totalReviews === 0 
                ? "Ready to start your learning journey?" 
                : `Great progress! You've completed ${totalReviews} reviews.`
              }
            </h3>
            <p className="text-gray-600">
              {totalReviews === 0
                ? "Create your first deck and start studying with AI-powered flashcards."
                : `Keep up the momentum and maintain your ${averageAccuracy}% accuracy rate!`
              }
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
