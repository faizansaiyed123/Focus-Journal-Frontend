import { useState } from 'react';
import { createJournal } from '../journalAPI';
import useAuthStore from '../../auth/authStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

export default function CreateJournal() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [focusPercent, setFocusPercent] = useState(0);
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);

  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const entry = {
      title,
      content,
      mood,
      is_favorite: isFavorite,
      focus_percent: Number(focusPercent),
      tags: tags.split(',').map((tag) => tag.trim()),
    };

    try {
      await createJournal(entry, token);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create journal entry. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* 🔙 Back Button */}
        <div className="mb-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-700 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition shadow-sm"
          >
            <FaArrowLeft className="text-gray-500" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* 💬 Journal Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            📝 New Journal Entry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="Today’s reflections..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                placeholder="What’s on your mind?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* Mood + Focus */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                <input
                  type="text"
                  placeholder="😊, focused, tired"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Focus (%)</label>
                <input
                  type="number"
                  placeholder="0–100"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
                  value={focusPercent}
                  onChange={(e) => setFocusPercent(e.target.value)}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                placeholder="#deepwork, #morning"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
            </div>

            {/* Favorite */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={() => setIsFavorite(!isFavorite)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
              />
              <label className="text-sm text-gray-700">Mark as favorite</label>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-150"
            >
              Create Entry
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
