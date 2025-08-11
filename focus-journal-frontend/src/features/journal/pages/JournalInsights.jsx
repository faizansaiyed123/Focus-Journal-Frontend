import { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import useAuthStore from '../../auth/authStore';
import { ClipLoader } from 'react-spinners';
import { generalAiInsights } from '../journalInsightsApi';

export default function JournalInsights() {
  const token = useAuthStore((state) => state.token);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await generalAiInsights(token);
        setInsights(res);
      } catch (err) {
        // Set a user-friendly error message
        const errorMessage = err?.response?.data?.message || 'There is no data so there are no insights from AI..';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchInsights();
  }, [token]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">🧠 Journal Insights</h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <ClipLoader color="#3b82f6" size={50} />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Focus Score */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">🎯 Focus Score</h2>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-4 transition-all duration-500"
                  style={{ width: `${insights?.focus_score || 0}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{insights?.focus_score || 0}% focused</p>
            </div>

            {/* Mood Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">📝 Mood Summary</h2>
              <p className="text-gray-700 dark:text-gray-300">{insights?.mood_summary || 'No mood data available.'}</p>
            </div>

            {/* Top Keywords */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">🏷️ Top Keywords</h2>
              {insights?.top_keywords?.filter(Boolean).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {insights.top_keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm px-3 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-sm">No keywords found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
