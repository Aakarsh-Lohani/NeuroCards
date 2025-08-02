'use client';
import { motion } from 'framer-motion';

const features = [
  { 
    title: 'Auto Flashcards', 
    desc: 'Auto-generate flashcards from any content using advanced AI algorithms.',
    icon: '🎯',
    color: 'from-orange-400 to-red-400'
  },
  { 
    title: 'AI Quizzes', 
    desc: 'Adaptive quizzes powered by AI insights that learn from your progress.',
    icon: '🧠',
    color: 'from-pink-400 to-purple-400'
  },
  { 
    title: 'Cloud Sync', 
    desc: 'Securely store your decks on MongoDB Atlas with real-time synchronization.',
    icon: '☁️',
    color: 'from-blue-400 to-indigo-400'
  },
  { 
    title: 'Smart Analytics', 
    desc: 'Track your learning progress with detailed analytics and insights.',
    icon: '📊',
    color: 'from-green-400 to-teal-400'
  },
  { 
    title: 'Multi-Format Support', 
    desc: 'Support for PDFs, images, videos, and text-based content.',
    icon: '📚',
    color: 'from-yellow-400 to-orange-400'
  },
  { 
    title: 'Spaced Repetition', 
    desc: 'Optimize memory retention with scientifically-proven spaced repetition.',
    icon: '⏰',
    color: 'from-purple-400 to-pink-400'
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Why You Should
            <span className="text-orange-500"> Choose NeuroCards</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A new era of AI-powered learning and memory enhancement with cutting-edge features.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group"
            >
              {/* Background decorative element */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
              
              {/* Main card */}
              <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
                
                {/* Decorative bottom element */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistics section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { number: '10K+', label: 'Active Users' },
            { number: '50K+', label: 'Flashcards Created' },
            { number: '95%', label: 'Success Rate' },
            { number: '24/7', label: 'AI Support' },
          ].map((stat, index) => (
            <div key={stat.label} className="p-6">
              <div className="text-3xl md:text-4xl font-black text-orange-500 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}