import { useEffect, useMemo, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import {
  fetchWeeklySummary,
  fetchSentimentAnalysis,
} from '../features/journal/journalAPI';
import useAuthStore from '../features/auth/authStore';
import { format } from 'date-fns';

Chart.register(...registerables);

function SkeletonBox({ height = 'h-20', width = 'w-full', className = '' }) {
  return (
    <div
      className={
        'animate-pulse bg-gray-200 rounded-md ' +
        height +
        ' ' +
        width +
        ' ' +
        className
      }
    />
  );
}

export default function Analytics() {
  const token = useAuthStore((state) => state.token);
  const [summary, setSummary] = useState(null);
  const [sentiment, setSentiment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const weeklyData = await fetchWeeklySummary(token);
        const sentimentData = await fetchSentimentAnalysis(token);
        if (!cancelled) {
          setSummary(
            weeklyData && weeklyData.data ? weeklyData.data : weeklyData,
          );
          setSentiment(Array.isArray(sentimentData) ? sentimentData : []);
        }
      } catch {
        if (!cancelled)
          setError(
            'Some reflection data could not be loaded. Please try again shortly.',
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const sentimentCounts = useMemo(() => {
    const counts = { positive: 0, neutral: 0, negative: 0 };
    sentiment.forEach(({ sentiment_score }) => {
      if (sentiment_score > 0.2) counts.positive++;
      else if (sentiment_score < -0.2) counts.negative++;
      else counts.neutral++;
    });
    return counts;
  }, [sentiment]);

  const pieChartData = useMemo(
    () => ({
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [
        {
          label: 'Sentiment',
          data: [
            sentimentCounts.positive,
            sentimentCounts.neutral,
            sentimentCounts.negative,
          ],
          backgroundColor: ['#9bc6a0', '#e9c27d', '#df947f'],
          borderColor: '#f7f7f2',
          borderWidth: 3,
        },
      ],
    }),
    [sentimentCounts],
  );

  const pieChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom' },
        tooltip: { callbacks: { title: (context) => context[0].label } },
      },
    }),
    [],
  );

  return (
    <div className="legacy-page-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="section-eyebrow">YOUR PATTERNS, OVER TIME</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            A look back.
          </h1>
          <p className="text-gray-500 mt-2">
            Use your saved reflections to spot the things that help.
          </p>
        </div>
        <span className="analytics-period-chip">LAST 7 DAYS</span>
      </div>

      {error && (
        <div
          className="inline-notice"
          role="status"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-9">
        {loading ? (
          <>
            <SkeletonBox height="h-28" />
            <SkeletonBox height="h-28" />
            <SkeletonBox height="h-28" />
          </>
        ) : summary ? (
          <>
            <div className="surface-card p-6">
              <span className="section-eyebrow">WEEK IN REVIEW</span>
              <p className="text-lg font-semibold text-gray-800 mt-3">
                {summary.start_date &&
                !Number.isNaN(new Date(summary.start_date).getTime())
                  ? format(new Date(summary.start_date), 'MMM d, yyyy')
                  : 'Your recent days'}{' '}
                <span className="text-gray-400">→</span>{' '}
                {summary.end_date &&
                !Number.isNaN(new Date(summary.end_date).getTime())
                  ? format(new Date(summary.end_date), 'MMM d, yyyy')
                  : 'today'}
              </p>
            </div>
            <div className="surface-card p-6">
              <span className="section-eyebrow">AVERAGE FOCUS</span>
              <p className="text-4xl font-bold text-gray-800 mt-3">
                {summary.average_focus ?? 0}
                <span className="text-xl">%</span>
              </p>
            </div>
            <div className="surface-card p-6">
              <span className="section-eyebrow">RECURRING TAGS</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {Array.isArray(summary.common_tags) &&
                summary.common_tags.length ? (
                  summary.common_tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag-chip"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    Your tags will appear here as you use them.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="surface-card p-6">
            <p className="text-gray-500">
              No reflection summary is available for this period yet.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
        <section className="surface-card p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Mood at a glance
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Sentiment in your saved daily check-in notes.
          </p>
          <div className="relative h-64">
            {loading ? (
              <SkeletonBox height="h-full" />
            ) : sentiment.length ? (
              <Pie
                data={pieChartData}
                options={pieChartOptions}
              />
            ) : (
              <p className="text-gray-500 italic pt-8">
                No sentiment data is available yet.
              </p>
            )}
          </div>
        </section>
        <section className="surface-card p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Sentiment over time
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            A historical view of the check-in notes you’ve saved.
          </p>
          <div className="relative h-64">
            {loading ? (
              <SkeletonBox height="h-full" />
            ) : sentiment.length ? (
              <Line
                data={{
                  labels: sentiment.map((item) => item.date),
                  datasets: [
                    {
                      label: 'Sentiment score',
                      data: sentiment.map((item) => item.sentiment_score),
                      fill: true,
                      borderColor: '#668d70',
                      backgroundColor: 'rgba(102,141,112,0.12)',
                      tension: 0.35,
                      pointRadius: 3,
                      pointBackgroundColor: '#668d70',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { min: -1, max: 1 },
                    x: { grid: { display: false } },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            ) : (
              <p className="text-gray-500 italic pt-8">
                Add more journal entries to start seeing trends.
              </p>
            )}
          </div>
        </section>
      </div>
      <p className="text-xs text-gray-500">
        Patterns are summaries of saved entries, not diagnoses or instructions.
      </p>
    </div>
  );
}
