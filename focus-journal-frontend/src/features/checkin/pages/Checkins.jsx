import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Flame,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
  deleteCheckin,
  fetchCheckins,
  fetchCheckinStats,
  fetchStreak,
  fetchToday,
} from '../checkinAPI';
import useAuthStore from '../../auth/authStore';
import CheckinBetweenDates from './CheckinBetweenDates';

const localDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
};
const displayDate = (value) => {
  const key = String(value || '').slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return 'Recently';
  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  ).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
const moodStyle = {
  bad: ['🌧️', 'mood-cloud'],
  okay: ['🌤️', 'mood-sun'],
  good: ['🙂', 'mood-good'],
  great: ['✨', 'mood-great'],
  happy: ['🌞', 'mood-happy'],
};

function getError(error, fallback) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(' ');
  return fallback;
}

export default function Checkins() {
  const token = useAuthStore((state) => state.token);
  const [today, setToday] = useState(null);
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const results = await Promise.allSettled([
      fetchToday(token),
      fetchCheckinStats(token),
      fetchStreak(token),
      fetchCheckins(token),
    ]);
    const value = (index, fallback) =>
      results[index].status === 'fulfilled' ? results[index].value : fallback;
    setToday(value(0, null));
    setStats(value(1, null));
    setStreak(value(2, null));
    setCheckins(Array.isArray(value(3, [])) ? value(3, []) : []);
    if (results.every((result) => result.status === 'rejected')) {
      setError(
        'Your check-ins could not be loaded. Please check your connection and try again.',
      );
    } else if (results.some((result) => result.status === 'rejected')) {
      setError('Some check-in statistics could not be refreshed.');
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  const todayKey = localDateKey(new Date());
  const todayEntry = checkins.find(
    (item) =>
      String(item.date || item.checkin_date || '').slice(0, 10) === todayKey,
  );
  const checkedToday = Boolean(
    today?.checked || today?.data?.checked_in || todayEntry,
  );
  const ordered = [...checkins].sort((a, b) =>
    String(b.date || b.checkin_date || '').localeCompare(
      String(a.date || a.checkin_date || ''),
    ),
  );

  const removeCheckin = async (id) => {
    if (!window.confirm('Delete this check-in? This cannot be undone.')) return;
    setDeletingId(id);
    setError('');
    try {
      await deleteCheckin(id, token);
      setCheckins((current) => current.filter((item) => item.id !== id));
      await Promise.allSettled([
        fetchCheckinStats(token),
        fetchStreak(token),
      ]).then((results) => {
        if (results[0].status === 'fulfilled') setStats(results[0].value);
        if (results[1].status === 'fulfilled') setStreak(results[1].value);
      });
    } catch (requestError) {
      setError(getError(requestError, 'That check-in could not be deleted.'));
    } finally {
      setDeletingId('');
    }
  };

  const total = stats?.total_checkins ?? checkins.length;
  const average = Math.round(Number(stats?.average_focus) || 0);

  return (
    <DashboardLayout>
      <div className="checkins-page">
        <header className="secondary-page-header">
          <div>
            <span className="section-eyebrow">
              <span className="eyebrow-dot" /> NOTICE HOW YOU’RE DOING
            </span>
            <h1>Your daily check-ins</h1>
            <p>A little honesty with yourself can go a long way.</p>
          </div>
          <div className="secondary-header-actions">
            <button
              className="secondary-refresh-button"
              type="button"
              onClick={load}
              disabled={loading}
            >
              <RefreshCw size={15} /> Refresh
            </button>
            {checkedToday ? (
              <Link
                className="button button-quiet"
                to={todayEntry?.id ? '/checkins/' + todayEntry.id : '/checkin'}
              >
                <CheckCircle2 size={16} /> Checked in today
              </Link>
            ) : (
              <Link
                className="button button-primary"
                to="/checkins/new"
              >
                <Plus size={17} /> Today's check-in
              </Link>
            )}
          </div>
        </header>

        {error && (
          <div
            className="inline-notice"
            role="status"
          >
            {error}
            <button
              type="button"
              onClick={load}
            >
              Try again
            </button>
          </div>
        )}

        <section
          className="checkin-stat-grid"
          aria-label="Check-in summary"
        >
          <article className="checkin-stat-card">
            <span className="checkin-stat-icon checkin-icon-green">
              <ClipboardCheck size={19} />
            </span>
            <span>
              <small>TOTAL CHECK-INS</small>
              <strong>{total}</strong>
              <em>Moments you've saved</em>
            </span>
          </article>
          <article className="checkin-stat-card">
            <span className="checkin-stat-icon checkin-icon-peach">
              <Flame size={19} />
            </span>
            <span>
              <small>CURRENT STREAK</small>
              <strong>
                {streak?.current_streak ?? 0}
                <small> days</small>
              </strong>
              <em>One day at a time</em>
            </span>
          </article>
          <article className="checkin-stat-card">
            <span className="checkin-stat-icon checkin-icon-lilac">
              <CheckCircle2 size={19} />
            </span>
            <span>
              <small>AVERAGE FOCUS</small>
              <strong>{average}%</strong>
              <em>Across your check-ins</em>
            </span>
          </article>
        </section>

        <CheckinBetweenDates />

        <section className="checkin-history-panel surface-card">
          <div className="surface-card-heading">
            <div>
              <span className="section-eyebrow">A LOOK BACK</span>
              <h2>Your saved check-ins</h2>
              <p>Every entry is a snapshot, not a scorecard.</p>
            </div>
            <span className="history-count">
              {ordered.length} {ordered.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          {loading ? (
            <div className="history-loading">
              <span />
              <span />
              <span />
            </div>
          ) : ordered.length ? (
            <div className="checkin-history-list">
              {ordered.map((item) => {
                const mood = String(item.mood || '').toLowerCase();
                const [emoji, moodClass] = moodStyle[mood] || [
                  '✍️',
                  'mood-sun',
                ];
                const date = item.date || item.checkin_date;
                return (
                  <article
                    className="checkin-history-row"
                    key={item.id}
                  >
                    <span className={'history-mood-avatar ' + moodClass}>
                      {emoji}
                    </span>
                    <div className="checkin-history-main">
                      <span className="history-date">
                        <CalendarDays size={13} /> {displayDate(date)}
                      </span>
                      <strong>
                        {mood
                          ? mood.charAt(0).toUpperCase() + mood.slice(1)
                          : 'Daily reflection'}
                      </strong>
                      <p>
                        {item.note?.trim() ||
                          'A quiet moment to check in with yourself.'}
                      </p>
                      {item.tags?.length > 0 && (
                        <div className="entry-tags">
                          {item.tags.slice(0, 4).map((tag) => (
                            <i key={tag}>#{tag}</i>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="history-focus">
                      <span>FOCUS</span>
                      <strong>{item.focus_percent ?? 0}%</strong>
                      <span className="history-focus-track">
                        <span
                          style={{
                            width:
                              Math.max(
                                0,
                                Math.min(100, Number(item.focus_percent) || 0),
                              ) + '%',
                          }}
                        />
                      </span>
                    </div>
                    <div className="history-row-actions">
                      <Link
                        to={'/checkins/' + item.id}
                        aria-label="View check-in"
                        title="View details"
                      >
                        <ChevronRight size={17} />
                      </Link>
                      <button
                        type="button"
                        aria-label="Delete check-in"
                        title="Delete check-in"
                        disabled={deletingId === item.id}
                        onClick={() => removeCheckin(item.id)}
                      >
                        {deletingId === item.id ? (
                          <RefreshCw
                            size={15}
                            className="spin-icon"
                          />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-journal-state">
              <span className="empty-journal-icon">
                <ClipboardCheck size={22} />
              </span>
              <strong>Your first check-in can start today.</strong>
              <p>
                Choose a mood, note your focus, and save a moment just as it is.
              </p>
              <Link
                className="button button-primary button-small"
                to="/checkins/new"
              >
                Create a check-in <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
