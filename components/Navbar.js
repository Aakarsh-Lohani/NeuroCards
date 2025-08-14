'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react'
import Image from 'next/image';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/NeuroCards.png"
            alt="NeuroCards"
            width={40}
            height={40}
            className="w-10 h-10 rounded-lg object-contain"
          />
          <span className="text-2xl font-black text-gray-900">
            <span className="text-orange-500">Neuro</span>Cards
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200">
            Features
          </Link>
          <Link href="#about" className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200">
            About
          </Link>
          <Link href="/dashboard" className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200">
            Dashboard
          </Link>
          <Link href="/documentation" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium">Documentation</Link>
          <a href="https://github.com/Aakarsh-Lohani/NeuroCards" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium">Github</a>
          <Link
            href="/create"
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="text-gray-700 hover:text-orange-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar



