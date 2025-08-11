import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckin } from '../checkinAPI';
import useAuthStore from '../../auth/authStore';
import { motion } from 'framer-motion';

export default function CreateCheckin() {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [focusPercent, setFocusPercent] = useState(0);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for capturing errors

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors

    const checkinData = {
      date: today,
      mood: mood.toLowerCase(),
      focus_percent: focusPercent,
      tags: tags.split(',').map((tag) => tag.trim().toLowerCase()),
      note,
    };

    try {
      await createCheckin(checkinData, token);
      navigate('/checkin');
    } catch (err) {
      setError('Only one check-in per day is allowed.'); // Show a generic error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto p-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 shadow-xl rounded-xl mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <motion.button
        onClick={() => navigate('/checkin')}
        className="flex items-center text-gray-700 text-sm bg-white border border-gray-300 rounded px-4 py-2 mb-4 hover:bg-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="mr-2">🔙</span> Back to Check-Ins
      </motion.button>

      <motion.h2
        className="text-3xl font-bold text-gray-700 mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        📝 Create Check-In
      </motion.h2>
      
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Mood Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700">Mood</label>
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 focus:ring-2 focus:ring-blue-400 transition"
            placeholder="e.g., Happy, Stressed"
            required
          />
        </motion.div>

        {/* Focus Percent Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700">Focus Percent</label>
          <input
            type="number"
            value={focusPercent}
            onChange={(e) => setFocusPercent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 focus:ring-2 focus:ring-blue-400 transition"
            placeholder="e.g., 80"
            min="0"
            max="100"
            required
          />
        </motion.div>

        {/* Tags Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 focus:ring-2 focus:ring-blue-400 transition"
            placeholder="e.g., #productive, #tired"
          />
        </motion.div>

        {/* Note Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <label className="block text-sm font-medium text-gray-700">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Optional notes..."
          />
        </motion.div>

        {/* Error Message Display */}
        {error && (
          <motion.p
            className="text-red-600 text-sm text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          >
            {error}
          </motion.p>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          {loading ? (
            <span className="flex justify-center items-center">
              <div className="w-5 h-5 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mr-3" />
              Saving...
            </span>
          ) : (
            'Submit Check-In'
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
