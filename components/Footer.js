'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand section */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/NeuroCards.png" 
                alt="NeuroCards" 
                className="w-12 h-12 rounded-xl object-contain"
              />
              <span className="text-3xl font-black">
                <span className="text-orange-500">Neuro</span>Cards
              </span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
              Get In Touch With Us Via Email Or Social Media. Join thousands of learners 
              who are revolutionizing their study experience with AI-powered flashcards.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">📧</span>
              </Link>
              <Link href="#" className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">💼</span>
              </Link>
              <Link href="#" className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">🐦</span>
              </Link>
              <Link href="#" className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">📷</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-orange-400">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Features', 'About', 'Timeline', 'Testimonials', 'Contact'].map((link) => (
                <li key={link}>
                  <Link href={`#${link.toLowerCase()}`} className="text-gray-300 hover:text-orange-400 transition-colors duration-300">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-orange-400">Resources</h3>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Tutorials', 'Support', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-300">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} NeuroCards. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <span className="text-orange-400 font-semibold">#NeuroCards2025</span>
            <span className="text-gray-400">•</span>
            <span className="text-orange-400 font-semibold">#AILearning</span>
            <span className="text-gray-400">•</span>
            <span className="text-orange-400 font-semibold">#StudySmart</span>
          </div>
        </div>
      </div>
    </footer>
  );
}