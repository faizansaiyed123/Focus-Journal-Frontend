import React, { useEffect, useState } from "react";
import useAuthStore from "../../auth/authStore";
import { fetchJournalTags } from "../journalInsightsApi";

export default function JournalTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const result = await fetchJournalTags(token);
        setTags(result.top_tags || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load tags");
      } finally {
        setLoading(false);
      }
    };
    loadTags();
  }, [token]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">🏷️ Most Used Tags</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading tags...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : tags.length === 0 ? (
        <div className="text-center text-gray-400 italic">No tags found.</div>
      ) : (
        <div className="flex flex-wrap gap-3 overflow-y-auto max-h-[400px] pr-2">
          {tags.map((tagObj, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              #{tagObj.tag} ({tagObj.count})
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
