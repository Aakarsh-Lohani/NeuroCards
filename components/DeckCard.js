'use client';
import { motion } from 'framer-motion';

export default function DeckCard({ deck, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStudy = () => {
    // Navigate to study mode (to be implemented)
    window.location.href = `/study/${deck._id}`;
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${deck.title}"?`)) {
      onDelete(deck._id);
    }
  };

  return (
    <div className="relative group">
      {/* Background decorative element */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
      
      {/* Main card */}
      <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 overflow-hidden text-ellipsis group-hover:text-orange-600 transition-colors duration-300" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
              {deck.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <span>📚</span>
                <span>{deck.totalCards} cards</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>📅</span>
                <span>{formatDate(deck.createdAt)}</span>
              </span>
            </div>
          </div>
          
          {/* Actions dropdown */}
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Preview */}
        {deck.preview && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 overflow-hidden text-ellipsis" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
              <span className="font-medium text-gray-800">Preview:</span> {deck.preview}
            </p>
          </div>
        )}

        {/* Tags */}
        {deck.tags && deck.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {deck.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {deck.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{deck.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {deck.studyStats?.totalReviews || 0}
            </div>
            <div className="text-xs text-green-500">Reviews</div>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {deck.studyStats?.overallAccuracy || deck.studyStats?.lastAccuracy || 0}%
            </div>
            <div className="text-xs text-blue-500">Accuracy</div>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {deck.studyStats?.totalCorrect || 0}
            </div>
            <div className="text-xs text-purple-500">Correct</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStudy}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>🧠</span>
              <span>Study Now</span>
            </div>
          </motion.button>

          <div className="flex space-x-2">
            
            <button
              onClick={handleDelete}
              className="flex-1 py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition-colors duration-300"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Decorative bottom element */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </div>
    </div>
  );
}
