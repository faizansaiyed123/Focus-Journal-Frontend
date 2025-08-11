import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJournalById, updateJournal } from '../journalAPI';
import useAuthStore from '../../auth/authStore';
import { motion } from 'framer-motion';

export default function EditJournal() {
  const { id } = useParams();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [focusPercent, setFocusPercent] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEntry = async () => {
      try {
        const data = await fetchJournalById(id, token);
        setTitle(data.title);
        setContent(data.content);
        setMood(data.mood || '');
        setTags((data.tags || []).join(', '));
        setFocusPercent(data.focus_percent || 0);
        setIsFavorite(data.is_favorite || false);
      } catch (err) {
        setError('Failed to load the journal entry. Please try again later.');
      }
    };
    loadEntry();
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updated = {
      title,
      content,
      mood,
      focus_percent: Number(focusPercent),
      is_favorite: isFavorite,
      tags: tags.split(',').map((tag) => tag.trim()),
    };

    try {
      await updateJournal(id, updated, token);
      navigate(`/journal/entry/${id}`);
    } catch (err) {
      setError('Failed to update the journal entry. Please try again later.');
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        ✏️ Edit Journal Entry
      </h2>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            placeholder="Reflective title..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded-md resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Mood + Focus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
            <input
              type="text"
              placeholder="😊 happy, tired..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Focus (%)</label>
            <input
              type="number"
              placeholder="0–100"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              value={focusPercent}
              onChange={(e) => setFocusPercent(e.target.value)}
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            placeholder="#work, #morning, #focus"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
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
            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm text-gray-700">Mark as favorite</label>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-all duration-300"
        >
          ✅ Update Entry
        </button>
      </form>
    </motion.div>
  );
}
