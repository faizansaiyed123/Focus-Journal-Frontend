import { useEffect, useState } from 'react';
import { fetchAllJournals } from '../journalAPI';
import { Link } from 'react-router-dom';
import useAuthStore from '../../auth/authStore';
import { motion } from 'framer-motion';
import { FaSearch, FaTags, FaSmile, FaSort } from 'react-icons/fa';

export default function JournalPage() {
  const [journals, setJournals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [mood, setMood] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  const allTags = [...new Set(journals.flatMap((j) => j.tags || []))].filter(Boolean);

  useEffect(() => {
    const loadJournals = async () => {
      setLoading(true);
      try {
        const data = await fetchAllJournals(token);
        setJournals(data);
        setFiltered(data); // Initialize filtered state with all journals
      } catch (err) {
        console.error('❌ Failed to fetch journals:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) loadJournals();
  }, [token]);

  useEffect(() => {
    let result = [...journals];

    // Apply search filter
    if (search.trim()) {
      result = result.filter((entry) =>
        `${entry.title} ${entry.content}`.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply tag filter
    if (tag.trim()) {
      result = result.filter((entry) => entry.tags?.includes(tag));
    }

    // Apply mood filter
    if (mood.trim()) {
      result = result.filter((entry) => (entry.mood || '').toLowerCase().includes(mood.toLowerCase()));
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFiltered(result);
  }, [search, tag, mood, sort, journals]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      {/* Header and Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">📓 Journal</h1>

        <div className="flex gap-3">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition border border-gray-300"
          >
            <span>🔙</span> Back
          </button>

          {/* New Entry Button */}
          <Link to="/journal/create">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              ➕ New Entry
            </button>
          </Link>
        </div>
      </div>

      {/* Animated Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search title or notes..."
            className="pl-10 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-400 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tag Filter */}
        <div className="relative">
          <FaTags className="absolute top-3 left-3 text-gray-400" />
          <input
            list="tag-suggestions"
            type="text"
            placeholder="Filter by tag"
            className="pl-10 p-2 w-full border rounded-md focus:ring-2 focus:ring-purple-400 transition"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <datalist id="tag-suggestions">
            {allTags.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>

        {/* Mood Filter */}
        <div className="relative">
          <FaSmile className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by mood"
            className="pl-10 p-2 w-full border rounded-md focus:ring-2 focus:ring-pink-300 transition"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <FaSort className="absolute top-3 left-3 text-gray-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="pl-10 p-2 w-full border rounded-md focus:ring-2 focus:ring-yellow-400 transition"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </motion.div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No entries found.</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((entry) => (
            <motion.div
              key={entry.id}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.02 }}
            >
              <Link to={`/journal/entry/${entry.id}`}>
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold">{entry.title}</h2>
                    <span className="text-xl">{entry.mood || '📝'}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 text-sm line-clamp-3">{entry.content}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
