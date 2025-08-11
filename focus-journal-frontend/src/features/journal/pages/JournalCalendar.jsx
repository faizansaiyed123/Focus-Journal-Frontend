import React, { useEffect, useState } from "react";
import { fetchJournalCalendar } from "../journalInsightsApi";
import useAuthStore from "../../auth/authStore";

export default function JournalCalendar() {
  const token = useAuthStore((state) => state.token);
  const [entriesByDate, setEntriesByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchJournalCalendar(token);
        setEntriesByDate(data);
      } catch (err) {
        setError("Failed to load calendar data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [token]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">🗓️ Journal Calendar</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading calendar...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : Object.keys(entriesByDate).length === 0 ? (
        <div className="text-center text-gray-400">No journal entries found.</div>
      ) : (
        <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2">
          {Object.entries(entriesByDate).map(([date, entries]) => (
            <div key={date} className="border-b border-gray-100 pb-5 last:border-none">
              {/* Date */}
              <h3 className="text-base font-semibold text-blue-700 mb-3">
                {new Date(date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>

              {/* Entries */}
              <ul className="space-y-5">
                {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    {/* Note */}
                    <p className="text-gray-800 font-medium text-[15px] leading-snug">
                      {entry.note?.slice(0, 100) || "No content available"}
                    </p>

                    {/* Mood & Focus */}
                    <div className="text-sm text-gray-600 mt-2">
                      <span className="mr-4">
                        <span className="font-medium text-purple-600">Mood:</span>{" "}
                        {entry.mood}
                      </span>
                      <span>
                        <span className="font-medium text-green-600">Focus:</span>{" "}
                        {entry.focus_percent}%
                      </span>
                    </div>

                    {/* Tags */}
                    {entry.tags?.length > 0 && (
                      <div className="text-sm text-gray-500 mt-2 flex flex-wrap gap-1">
                        <span className="font-medium text-gray-700 mr-1">Tags:</span>
                        {entry.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
