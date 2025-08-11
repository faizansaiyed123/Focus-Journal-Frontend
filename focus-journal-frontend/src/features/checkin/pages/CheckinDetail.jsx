import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchCheckinById,
  updateCheckin,
  deleteCheckin
} from  '../checkinAPI';
import useAuthStore from '../../auth/authStore';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { motion } from 'framer-motion';

export default function CheckinDetail() {
  const { id } = useParams();

  const token = useAuthStore((state) => state.token);

  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [focusPercent, setFocusPercent] = useState(0);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || id === "undefined") {
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchCheckinById(id, token);

        setMood(data.mood || "");
        setNote(data.note || "");
        setFocusPercent(data.focus_percent || 0);
        setTags(data.tags || []);

        setCheckinData({
          id: data.id,
          mood: data.mood,
          focus_percent: data.focus_percent,
          tags: data.tags,
          note: data.note,
        });
      } catch (error) {
        // Handle error if needed
      }
    };

    fetchData();
  }, [id, token]);

  const handleUpdate = async () => {
    try {
      const payload = {
        mood,
        note,
        focus_percent: focusPercent,
        tags,
      };

      await updateCheckin(id, payload, token);

      // Re-fetch latest check-in data
      const updatedData = await fetchCheckinById(id, token);
      setMood(updatedData.mood || "");
      setNote(updatedData.note || "");
      setFocusPercent(updatedData.focus_percent || 0);
      setTags(updatedData.tags || []);
      navigate("/checkin");
    } catch (error) {
      // Handle error if needed
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Check-in</h2>
      <motion.button
        onClick={() => navigate('/checkin')}
        className="flex items-center text-gray-700 text-sm bg-white border border-gray-300 rounded px-4 py-2 mb-4 hover:bg-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="mr-2">🔙</span> Back to Check-Ins
      </motion.button>

      {/* Mood */}
      <label className="block mb-2 font-medium">Mood</label>
      <select
        className="w-full border p-2 rounded mb-4"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      >
        <option value="">Select mood</option>
        <option value="bad">Bad</option>
        <option value="okay">Okay</option>
        <option value="good">Good</option>
        <option value="great">Great</option>
      </select>

      {/* Focus Percent */}
      <label className="block mb-2 font-medium">Focus Percent</label>
      <input
        type="number"
        className="w-full border p-2 rounded mb-4"
        value={focusPercent}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          if (!isNaN(value)) {
            setFocusPercent(value);
          } else {
            setFocusPercent(0);
          }
        }}
        min={0}
        max={100}
      />

      {/* Tags */}
      <label className="block mb-2 font-medium">Tags (comma-separated)</label>
      <input
        type="text"
        className="w-full border p-2 rounded mb-4"
        value={tags.join(",")}
        onChange={(e) => {
          const tagList = e.target.value
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
          setTags(tagList);
        }}
        placeholder="e.g. focus, work, personal"
      />

      {/* Note */}
      <label className="block mb-2 font-medium">Note</label>
      <textarea
        className="w-full border p-2 rounded mb-4"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleUpdate}
      >
        Update Check-in
      </button>
    </div>
  );
}
