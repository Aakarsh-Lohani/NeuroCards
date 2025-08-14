'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand section */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Image
                src="/NeuroCards.png"
                alt="NeuroCards"
                width={48}
                height={48}
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
            
          </div>


          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-orange-400">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Features', 'About'].map((link) => (
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
              {[
                { label: 'Documentation', href: '/documentation' },
                { label: 'YouTube Demo', href: 'https://youtu.be/JjIqB9FCDt8?si=lauiervrBqS8Sqyl' },
                { label: 'Source Code', href: 'https://github.com/Aakarsh-Lohani/NeuroCards' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : '_self'}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Bottom section */}
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} NeuroCards. All rights reserved.
            </p>
            
          </div>
        </div>
      </div>

    </footer>
  );
}