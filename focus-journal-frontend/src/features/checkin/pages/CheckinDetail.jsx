import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Edit3,
  Flame,
  LoaderCircle,
  Trash2,
} from 'lucide-react';
import { deleteCheckin, fetchCheckinById } from '../checkinAPI';

const moods = {
  bad: ['🌧️', 'Not great'],
  okay: ['🌤️', 'Okay'],
  good: ['🙂', 'Good'],
  great: ['✨', 'Great'],
  happy: ['🌞', 'Happy'],
};
function displayDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    String(value || '').slice(0, 10),
  );
  return match
    ? new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
      ).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date unavailable';
}
function errorText(error) {
  const detail = error?.response?.data?.detail;
  return typeof detail === 'string'
    ? detail
    : 'This check-in could not be loaded. Please try again.';
}

export default function CheckinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchCheckinById(id)
      .then((data) => {
        if (!cancelled) setEntry(data);
      })
      .catch((requestError) => {
        if (!cancelled) setError(errorText(requestError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const remove = async () => {
    if (!window.confirm('Delete this check-in? This cannot be undone.')) return;
    setDeleting(true);
    setError('');
    try {
      await deleteCheckin(id);
      navigate('/checkin', { replace: true });
    } catch {
      setError('This check-in could not be deleted. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="journal-entry-page">
        <div className="insights-loading" />
      </div>
    );
  if (!entry)
    return (
      <div className="journal-entry-page">
        <div
          className="inline-notice"
          role="alert"
        >
          {error || 'Check-in not found.'}
          <Link to="/checkin">Back to check-ins</Link>
        </div>
      </div>
    );

  const mood = moods[String(entry.mood || '').toLowerCase()] || [
    '✍️',
    entry.mood || 'Reflection',
  ];
  const date = entry.date || entry.checkin_date;

  return (
    <div className="journal-entry-page">
      <Link
        to="/checkin"
        className="back-link"
      >
        <ArrowLeft size={16} /> All check-ins
      </Link>
      <article className="journal-entry-detail-card">
        <div className="journal-entry-detail-top">
          <span className="entry-detail-icon">
            <ClipboardCheck size={22} />
          </span>
          <span className="entry-detail-date">
            <CalendarDays size={14} /> {displayDate(date)}
          </span>
        </div>
        <span className="section-eyebrow">A MOMENT, SAVED</span>
        <h1>Your daily check-in</h1>
        <p className="journal-entry-subtitle">
          A small snapshot of how that day felt.
        </p>
        <div className="checkin-detail-mood">
          <span>{mood[0]}</span>
          <div>
            <small>HOW YOU FELT</small>
            <strong>{mood[1]}</strong>
          </div>
          <span className="checkin-detail-focus">
            {entry.focus_percent ?? 0}% focus
          </span>
        </div>
        <div className="checkin-detail-focus-bar">
          <span
            style={{
              width:
                Math.max(0, Math.min(100, Number(entry.focus_percent) || 0)) +
                '%',
            }}
          />
        </div>
        <section className="journal-entry-note">
          <span className="section-eyebrow">A NOTE TO YOURSELF</span>
          <p>{entry.note?.trim() || 'No note was added to this check-in.'}</p>
        </section>
        {entry.tags?.length > 0 && (
          <section className="checkin-detail-tags">
            <span className="section-eyebrow">TAGS</span>
            <div>
              {entry.tags.map((tag) => (
                <span
                  className="tag-chip"
                  key={tag}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}
        {error && (
          <p
            className="form-error"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="journal-detail-actions">
          <Link
            className="button button-primary"
            to={'/checkins/' + id + '/edit'}
          >
            <Edit3 size={16} /> Edit check-in
          </Link>
          <button
            className="button button-quiet danger-quiet-button"
            onClick={remove}
            disabled={deleting}
          >
            {deleting ? (
              <LoaderCircle
                size={15}
                className="spin-icon"
              />
            ) : (
              <Trash2 size={15} />
            )}{' '}
            Delete entry
          </button>
        </div>
      </article>
    </div>
  );
}
