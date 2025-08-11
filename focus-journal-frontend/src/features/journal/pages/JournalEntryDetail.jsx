import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchJournalById } from '../journalAPI';
import useAuthStore from '../../auth/authStore';
import { motion } from 'framer-motion';

export default function JournalEntryDetail() {
  const { id } = useParams();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJournalById(id, token);
        setEntry(data);
      } catch (err) {
        setError('Failed to load journal entry. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!entry) {
    return <p className="text-center text-gray-500">Entry not found.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto py-10 px-6 bg-white rounded-xl shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{entry.title}</h1>
        <span className="text-2xl">{entry.mood || '📝'}</span>
      </div>

      <p className="text-sm text-gray-500 mb-2">
        {new Date(entry.created_at).toLocaleDateString()} • Focus: {entry.focus_percent}%
      </p>

      <div className="text-gray-800 whitespace-pre-line mb-4">
        {entry.content}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {entry.tags?.map((tag, i) => (
          <span
            key={i}
            className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        <Link to={`/journal/edit/${entry.id}`}>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            ✏️ Edit
          </button>
        </Link>
        <button
          onClick={() => {
            // TODO: add delete logic
            alert('🛑 Delete not implemented yet');
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          🗑️ Delete
        </button>
        <button
          onClick={() => {
            // TODO: add AI insights
            alert('💡 AI insights are for Pro users');
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          🧠 View AI Insights
        </button>
      </div>
    </motion.div>
  );
}
