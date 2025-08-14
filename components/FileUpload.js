'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function FileUpload({ onCardsGenerated, isGenerating, setIsGenerating }) {
  const [textInput, setTextInput] = useState('');
  const [title, setTitle] = useState('');
  const [uploadType, setUploadType] = useState('text');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      alert('Please enter some text to generate flashcards');
      return;
    }

    await generateFlashcards(textInput, title || 'Text-based Flashcards');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    setTitle(fileName);

    let fileType = '';
    if (file.type === 'application/pdf') {
      fileType = 'pdf';
    } else if (file.type === 'text/plain') {
      fileType = 'text';
    } else {
      alert('Unsupported file type. Please use PDF or TXT files.');
      return;
    }

    try {
      setIsGenerating(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);
      
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to process ${fileType.toUpperCase()} file`);
      }
      
      if (data.success && data.text) {
        await generateFlashcards(data.text, fileName);
      } else {
        throw new Error(`No text extracted from ${fileType.toUpperCase()} file`);
      }
    } catch (error) {
      console.error(`${fileType.toUpperCase()} processing error:`, error);
      alert(`${fileType.toUpperCase()} Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleYoutubeSubmit = async () => {
    if (!youtubeUrl.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    try {
      setIsGenerating(true);
      
      const response = await fetch('/api/process-youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: youtubeUrl.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process YouTube video');
      }

      if (data.success && data.flashcards && data.flashcards.cards) {
        const videoTitle = title || data.flashcards.title || 'YouTube Video Flashcards';
        onCardsGenerated(data.flashcards.cards, videoTitle);
      } else {
        throw new Error(data.error || 'Could not extract flashcards from video.');
      }

    } catch (error) {
      console.error('YouTube processing error:', error);
      alert(`YouTube Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFlashcards = async (text, deckTitle) => {
    try {
      setIsGenerating(true);
      
      const response = await fetch('/api/generate-qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          title: deckTitle
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate flashcards');
      }

      if (data.success && data.cards) {
        onCardsGenerated(data.cards, data.title);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Upload Your Content</h2>
        <p className="text-orange-100">Choose how you&apos;d like to create your flashcards</p>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <div className="flex space-x-4 mb-6">
            {[
              { id: 'text', label: 'Text Input', icon: '📝' },
              { id: 'file', label: 'File Upload', icon: '📄' },
              { id: 'url', label: 'Video URL', icon: '🎥' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setUploadType(type.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  uploadType === type.id
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deck Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your flashcard deck"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
          />
        </div>

        {uploadType === 'text' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Content
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your notes, study material, or any text you'd like to convert into flashcards..."
              rows="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none text-gray-900 placeholder-gray-500"
            />
            <div className="mt-2 text-sm text-gray-500">
              Minimum 50 characters required. Longer content works better.
            </div>
          </div>
        )}

        {uploadType === 'file' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors duration-300">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept=".txt,.pdf"
                className="hidden"
              />
              <div className="text-4xl mb-4">📎</div>
              <p className="text-gray-600 mb-4">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500 mb-4">
                ✅ <strong>Text files</strong> (.txt) - Direct text extraction<br/>
                ✅ <strong>PDF documents</strong> (.pdf) - AI-powered text parsing<br/>
                <span className="text-orange-600">💡 For best PDF results, use text-based PDFs (not scanned images)</span>
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
              >
                Choose File
              </button>
            </div>
          </div>
        )}

        {uploadType === 'url' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Paste YouTube or video URL here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
            />
            <div className="mt-2 text-sm text-gray-500">
              Supports YouTube videos with captions. The AI will extract transcript automatically.
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={
            uploadType === 'url' ? handleYoutubeSubmit :
            uploadType === 'file' ? () => fileInputRef.current?.click() :
            handleTextSubmit
          }
          disabled={isGenerating || 
            (uploadType === 'text' && !textInput.trim()) || 
            (uploadType === 'url' && !youtubeUrl.trim())}
          className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 ${
            isGenerating || 
            (uploadType === 'text' && !textInput.trim()) || 
            (uploadType === 'url' && !youtubeUrl.trim())
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>
                {uploadType === 'url' ? 'Processing Video...' : 
                 uploadType === 'file' ? 'Processing File...' : 
                 'Generating Flashcards...'}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span>🤖</span>
              <span>
                {uploadType === 'url' ? 'Process YouTube Video' : 
                 uploadType === 'file' ? 'Process File' : 
                 'Generate AI Flashcards'}
              </span>
            </div>
          )}
        </motion.button>

        <div className="mt-4 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-start space-x-3">
            <span className="text-blue-500 text-xl">💡</span>
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Pro Tip</h4>
              <p className="text-sm text-blue-600">
                ✨ <strong>Now supports multiple formats:</strong> Upload PDFs, 
                or process YouTube videos with captions. For best results, provide well-structured content 
                with clear concepts and educational material.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}