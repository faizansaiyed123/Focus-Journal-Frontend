import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  fetchCheckinById,
  updateCheckin,
  deleteCheckin,
} from "../checkinAPI";
import useAuthStore from "../../auth/authStore";

export default function EditCheckin() {
  const { id } = useParams();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // Form state variables
  const [mood, setMood] = useState("");
  const [focusPercent, setFocusPercent] = useState(0);
  const [tags, setTags] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for capturing errors

  useEffect(() => {
    if (token && id) {
      fetchCheckinById(id, token)
        .then((data) => {
          setMood(data.mood || "");
          setFocusPercent(data.focus_percent || 0);
          setTags(data.tags || []);
          setNote(data.note || "");
        })
        .catch((err) => {
          setError("Error fetching check-in data. Please try again later.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    try {
      const payload = {
        mood,
        note,
        focus_percent: focusPercent,
        tags,
      };
      await updateCheckin(id, payload, token);
      navigate("/checkin");
    } catch (err) {
      setError("Failed to update check-in. Please try again later.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this check-in?")) {
      setError(null); // Clear any previous errors
      try {
        await deleteCheckin(id, token);
        navigate("/checkin");
      } catch (err) {
        setError("Failed to delete check-in. Please try again later.");
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Check-in</h2>

      <motion.button
        onClick={() => navigate("/checkin")}
        className="flex items-center text-gray-700 text-sm bg-white border border-gray-300 rounded px-4 py-2 mb-4 hover:bg-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="mr-2">🔙</span> Back to Check-Ins
      </motion.button>

      {/* Error Message */}
      {error && (
        <motion.p
          className="text-red-600 text-sm text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}

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
        onChange={(e) => setFocusPercent(Number(e.target.value))}
        min={0}
        max={100}
      />

      {/* Tags */}
      <label className="block mb-2 font-medium">Tags (comma-separated)</label>
      <input
        type="text"
        className="w-full border p-2 rounded mb-4"
        value={tags.join(",")}
        onChange={(e) =>
          setTags(
            e.target.value
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          )
        }
      />

      {/* Note */}
      <label className="block mb-2 font-medium">Note</label>
      <textarea
        className="w-full border p-2 rounded mb-4"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
      />

      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleUpdate}
        >
          Update Check-in
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleDelete}
        >
          Delete Check-in
        </button>
      </div>
    </div>
  );
}
