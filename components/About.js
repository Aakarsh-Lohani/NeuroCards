'use client';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Know About
              <span className="text-orange-500"> NeuroCards Platform</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mb-8"></div>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Founded in 2024 by innovative developers, NeuroCards is a cutting-edge platform 
              dedicated to making quality learning accessible for all. With a mission to 
              empower students through AI-powered education, we&apos;ve built a vibrant community 
              of learners who benefit from our advanced flashcard generation technology.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Our platform focuses on memory enhancement, adaptive learning, and personalized 
              study experiences, bridging the gap between traditional studying and modern AI 
              capabilities. We collaborate with educational institutions to offer real-world 
              learning experiences, all while staying rooted in innovation, accessibility, 
              and academic excellence.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              At NeuroCards, every learner&apos;s success is our shared mission. Join us in shaping 
              a future where AI-powered education is a right—not a privilege—and where everyone 
              can maximize their learning potential.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Get In Touch
              </button>
              <button className="px-8 py-3 border-2 border-orange-500 text-orange-600 font-semibold rounded-full hover:bg-orange-50 transition-all duration-300">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Right content - Tech Stack */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Background decorative element */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-200 rounded-3xl transform rotate-3 opacity-20"></div>
            
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Powered by Modern Tech Stack
              </h3>
              
              <div className="space-y-6">
                {[
                  { 
                    tech: 'Next.js & React', 
                    desc: 'Fast SSR and modern UI components',
                    icon: '⚛️',
                    color: 'from-blue-400 to-cyan-400'
                  },
                  { 
                    tech: 'Node.js & Express', 
                    desc: 'Robust and scalable backend APIs',
                    icon: '🚀',
                    color: 'from-green-400 to-emerald-400'
                  },
                  { 
                    tech: 'MongoDB Atlas', 
                    desc: 'Scalable cloud database storage',
                    icon: '🍃',
                    color: 'from-emerald-400 to-teal-400'
                  },
                  { 
                    tech: 'Hugging Face AI', 
                    desc: 'Zero-cost AI flashcard generation',
                    icon: '🤖',
                    color: 'from-purple-400 to-pink-400'
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.tech}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center`}>
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.tech}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}