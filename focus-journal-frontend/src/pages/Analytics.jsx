import { useEffect, useMemo, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  fetchWeeklySummary,
  fetchSentimentAnalysis,
} from '../features/journal/journalAPI';
import DashboardLayout from '../layouts/DashboardLayout';
import useAuthStore from '../features/auth/authStore';
import { format } from 'date-fns';

Chart.register(...registerables);

// Skeleton UI for loading state
function SkeletonBox({ height = 'h-20', width = 'w-full', className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-md ${height} ${width} ${className}`}
    ></div>
  );
}

export default function Analytics() {
  const token = useAuthStore((state) => state.token);
  const [summary, setSummary] = useState(null);
  const [sentiment, setSentiment] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
console.log(summary ,sentiment,selectedDate )
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const weeklyData = await fetchWeeklySummary(token, selectedDate);
        setSummary(weeklyData);

        const sentimentData = await fetchSentimentAnalysis(token);
        setSentiment(sentimentData);
      } catch (err) {
        console.error('❌ Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, selectedDate]);

  const sentimentCounts = useMemo(() => {
    const counts = { positive: 0, neutral: 0, negative: 0 };
    sentiment.forEach(({ sentiment_score }) => {
      if (sentiment_score > 0.2) counts.positive++;
      else if (sentiment_score < -0.2) counts.negative++;
      else counts.neutral++;
    });
    return counts;
  }, [sentiment]);

  const pieChartData = useMemo(() => ({
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Sentiment',
        data: [
          sentimentCounts.positive,
          sentimentCounts.neutral,
          sentimentCounts.negative,
        ],
        backgroundColor: ['#4ade80', '#facc15', '#f87171'],
        borderColor: '#f3f4f6',
        borderWidth: 2,
      },
    ],
  }), [sentimentCounts]);

  const pieChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (ctx) => `📅 ${ctx[0].label}`,
          label: (ctx) => {
            const val = ctx.raw;
            if (val > 0.2) return `😊 Positive (${val.toFixed(2)})`;
            if (val < -0.2) return `😞 Negative (${val.toFixed(2)})`;
            return `😐 Neutral (${val.toFixed(2)})`;
          },
        },
      },
    },
  }), []);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header & Date Picker */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            📊 Analytics
          </h1>
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-md shadow-md border border-gray-300">
            <label htmlFor="date-picker" className="text-gray-600 font-medium text-sm">
              Select Week:
            </label>
            <DatePicker
              id="date-picker"
              selected={selectedDate}
              onChange={(date) => {
                if (date && date.getTime() !== selectedDate.getTime()) {
                  setSelectedDate(date);
                }
              }}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              showPopperArrow={false}
              className="text-gray-900 text-sm focus:outline-none"
              placeholderText="Choose a date"
            />
          </div>
        </div>

        {/* Summary Cards or Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {loading ? (
            <>
              <SkeletonBox height="h-24" />
              <SkeletonBox height="h-24" />
              <SkeletonBox height="h-24" />
            </>
          ) : summary && (
            <>
              {/* Week */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                  🗓️ Week
                </h3>
                <p className="text-xl font-semibold text-gray-800 select-text">
                  {summary.start_date && !isNaN(new Date(summary.start_date))
                    ? format(new Date(summary.start_date), 'MMM dd, yyyy')
                    : 'N/A'}{' '}
                  →{' '}
                  {summary.end_date && !isNaN(new Date(summary.end_date))
                    ? format(new Date(summary.end_date), 'MMM dd, yyyy')
                    : 'N/A'}
                </p>
              </div>

              {/* Avg Focus */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                  🎯 Avg Focus
                </h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {summary.average_focus ?? 0}%
                </p>
              </div>

              {/* Common Tags */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  🏷️ Common Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(summary.common_tags) && summary.common_tags.length > 0 ? (
                    summary.common_tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-800 text-sm px-4 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No tags found for this week.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sentiment Distribution */}
        <section className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto mb-12 animate-fadeIn">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            🧠 Sentiment Distribution
          </h2>
          <div className="relative h-72">
            {loading ? (
              <SkeletonBox height="h-full" />
            ) : sentiment.length > 0 ? (
              <Pie data={pieChartData} options={pieChartOptions} />
            ) : (
              <p className="text-gray-500 italic">No sentiment data available.</p>
            )}
          </div>
        </section>

        {/* Sentiment Trend */}
        <section className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto mb-20">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            📈 Sentiment Trend Over Time
          </h2>
          <div className="w-full h-72 relative">
            {loading ? (
              <SkeletonBox height="h-full" />
            ) : sentiment.length > 0 ? (
              <Line
                data={{
                  labels: sentiment.map((s) => s.date),
                  datasets: [
                    {
                      label: 'Sentiment Score',
                      data: sentiment.map((s) => s.sentiment_score),
                      fill: true,
                      borderColor: '#3b82f6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      tension: 0.3,
                      pointRadius: 4,
                      pointBackgroundColor: '#3b82f6',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      min: -1,
                      max: 1,
                      title: {
                        display: true,
                        text: 'Score',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Date',
                      },
                    },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const val = context.raw;
                          if (val > 0.2) return `😊 Positive (${val.toFixed(2)})`;
                          if (val < -0.2) return `😞 Negative (${val.toFixed(2)})`;
                          return `😐 Neutral (${val.toFixed(2)})`;
                        },
                      },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-gray-500 italic">No sentiment trend data available.</p>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
