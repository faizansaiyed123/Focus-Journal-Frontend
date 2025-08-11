import { useState, useEffect } from "react";
import apiClient from "../../../api/apiClient";

const BASE_URL = import.meta.env.VITE_API_URL;

// Render a nice summary metric box
function MetricCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  );
}

// Render daily log table
function DaysTable({ days }) {
  if (!Array.isArray(days) || days.length === 0) return null;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-200 rounded-lg bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Mood</th>
            <th className="px-4 py-2 text-left">Focus %</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-2">{day.date}</td>
              <td className="px-4 py-2 capitalize">{day.mood}</td>
              <td className="px-4 py-2">{day.focus_percent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Render tags nicely as pills, with fallback
function TagsList({ tags }) {
  if (!Array.isArray(tags)) return null;
  if (tags.length === 0) {
    return <p className="text-gray-500 italic">No tags available</p>;
  }

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800">Top Tags</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full border border-blue-300"
          >
            {tag.tag || tag.name || "Unknown"} — {tag.count ?? tag.usage ?? 0}
          </span>
        ))}
      </div>
    </>
  );
}

// Render compare range data in table form
function CompareTable({ title, data }) {
  if (!data) return null;

  const days = data.days || [];
  const avgFocus = data.average_focus;
  const commonMood = data.most_common_mood;

  return (
    <div className="bg-white rounded-lg shadow border p-4">
      <h4 className="font-bold mb-4 text-blue-700 text-center">{title}</h4>
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {avgFocus !== undefined && (
          <MetricCard label="Average Focus" value={`${avgFocus}%`} />
        )}
        {commonMood && (
          <MetricCard label="Most Common Mood" value={commonMood} />
        )}
      </div>
      {/* Days Table */}
      {days.length > 0 ? (
        <DaysTable days={days} />
      ) : (
        <p className="text-gray-500 text-center">No daily data available</p>
      )}
    </div>
  );
}

// Main rendering for summaries (weekly, monthly, tags)
function renderSummary(summary) {
  if (!summary) return <p className="text-gray-500 text-center">No data available</p>;

  const data = summary.data || {};
  const days = data.days || [];
  const avgFocus = data.average_focus ?? summary.average_focus;
  const commonMood = data.most_common_mood ?? summary.most_common_mood;
  const tags = data.tags || data.top_tags || summary.tags || [];
  const moodDist = data.mood_distribution || {};
  const focusTrend = data.focus_trend || [];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {avgFocus !== undefined && (
          <MetricCard label="Average Focus" value={`${avgFocus}%`} />
        )}
        {commonMood && (
          <MetricCard label="Most Common Mood" value={commonMood} />
        )}
      </div>

      {/* Days Table */}
      {days.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-gray-800">Daily Entries</h3>
          <DaysTable days={days} />
        </>
      )}

      {/* Mood Distribution */}
      {Object.keys(moodDist).length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-gray-800">Mood Distribution</h3>
          <ul className="list-disc list-inside bg-white p-4 rounded-lg border border-gray-200">
            {Object.entries(moodDist).map(([mood, count]) => (
              <li key={mood} className="capitalize text-gray-700">
                {mood}: {count}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Focus Trend Table */}
      {focusTrend.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">Focus Trend (Weekly)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Week</th>
                  <th className="px-4 py-2 text-left">Average Focus</th>
                </tr>
              </thead>
              <tbody>
                {focusTrend.map(({ week, average_focus }, idx) => (
                  <tr
                    key={week}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2">{week}</td>
                    <td className="px-4 py-2">{average_focus}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Tags */}
      <TagsList tags={tags} />
    </div>
  );
}


export default function SummaryDashboard({ token }) {
  const [activeTab, setActiveTab] = useState("weekly");
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [tagSummary, setTagSummary] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compareDates, setCompareDates] = useState({
    start1: "",
    end1: "",
    start2: "",
    end2: "",
  });

  // API calls
  const fetchWeeklySummary = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`${BASE_URL}/weekly-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklySummary(res.data);
    } catch {
      setError("Failed to load weekly summary");
    }
    setLoading(false);
  };

  const fetchMonthlySummary = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`${BASE_URL}/monthly-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonthlySummary(res.data);
    } catch {
      setError("Failed to load monthly summary");
    }
    setLoading(false);
  };

  const fetchTagSummary = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`${BASE_URL}/tag-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Tag summary response:", res.data); // Debug log
      setTagSummary(res.data);
    } catch {
      setError("Failed to load tag summary");
    }
    setLoading(false);
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post(
        `${BASE_URL}/journal/compare`,
        {
          start_range_1: compareDates.start1,
          end_range_1: compareDates.end1,
          start_range_2: compareDates.start2,
          end_range_2: compareDates.end2,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCompareResult(res.data);
    } catch {
      setError("Failed to compare journal entries");
    }
    setLoading(false);
  };

  // Fetch data on tab change
  useEffect(() => {
    if (!token) return;
    setError(null);
    if (activeTab === "weekly") fetchWeeklySummary();
    if (activeTab === "monthly") fetchMonthlySummary();
    if (activeTab === "tags") fetchTagSummary();
  }, [activeTab, token]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { id: "weekly", label: "📅 This Week" },
          { id: "monthly", label: "🗓️ This Month" },
          { id: "tags", label: "🏷️ Top Tags" },
          { id: "compare", label: "⚖️ Compare" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`p-4 rounded-xl text-lg font-medium shadow transition-all duration-200 ${
              activeTab === id
                ? "bg-blue-600 text-white scale-105"
                : "bg-white text-gray-700 hover:bg-blue-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-gray-50 rounded-xl shadow-lg p-6 min-h-[200px]">
        {loading && <p className="text-center text-blue-500">Loading...</p>}
        {error && <p className="text-red-500 text-center font-medium mb-4">{error}</p>}

        {activeTab === "weekly" && renderSummary(weeklySummary)}
        {activeTab === "monthly" && renderSummary(monthlySummary)}
        {activeTab === "tags" && renderSummary(tagSummary)}

        {activeTab === "compare" && (
          <form onSubmit={handleCompare} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {["start1", "end1", "start2", "end2"].map((field, i) => (
                <div key={field}>
                  <label className="block font-semibold text-sm mb-2">
                    {[
                      "Start Date (Range 1)",
                      "End Date (Range 1)",
                      "Start Date (Range 2)",
                      "End Date (Range 2)",
                    ][i]}
                  </label>
                  <input
                    type="date"
                    value={compareDates[field]}
                    onChange={(e) =>
                      setCompareDates({ ...compareDates, [field]: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition disabled:bg-blue-300"
            >
              Compare
            </button>

            {compareResult && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <CompareTable title="📊 Range 1" data={compareResult.data.range_1} />
                <CompareTable title="📊 Range 2" data={compareResult.data.range_2} />
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
