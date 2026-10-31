import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Heart,
  Leaf,
  LoaderCircle,
  Pencil,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { deleteJournal, fetchJournalById } from '../journalAPI';

function prettyDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Saved journal entry'
    : date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
}
function errorText(error) {
  const detail = error?.response?.data?.detail;
  return typeof detail === 'string'
    ? detail
    : 'This entry could not be loaded. Please try again.';
}

export default function JournalEntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchJournalById(id)
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
    if (!window.confirm('Delete this journal entry? This cannot be undone.'))
      return;
    setDeleting(true);
    setError('');
    try {
      await deleteJournal(id);
      navigate('/journal', { replace: true });
    } catch {
      setError('This journal entry could not be deleted. Please try again.');
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
          {error || 'Journal entry not found.'}
          <Link to="/journal">Back to your journal</Link>
        </div>
      </div>
    );

  return (
    <div className="journal-entry-page">
      <Link
        to="/journal"
        className="back-link"
      >
        <ArrowLeft size={16} /> All journal entries
      </Link>
      <article className="journal-entry-detail-card">
        <div className="journal-entry-detail-top">
          <span className="entry-detail-icon">
            <BookOpen size={22} />
          </span>
          <span className="entry-detail-date">
            <CalendarDays size={14} /> {prettyDate(entry.created_at)}
          </span>
        </div>
        <span className="section-eyebrow">A PAGE FROM YOUR STORY</span>
        <h1>{entry.title || 'An untitled moment'}</h1>
        <div className="journal-detail-meta">
          <span>{entry.mood || 'A reflection'}</span>
          {entry.focus_percent != null && (
            <span>{entry.focus_percent}% focus</span>
          )}
          {entry.is_favorite && (
            <span>
              <Heart
                size={13}
                fill="currentColor"
              />{' '}
              Favorite
            </span>
          )}
        </div>
        <div className="journal-entry-content">
          {entry.content?.trim() ||
            'You saved this moment without a written note.'}
        </div>
        {entry.tags?.length > 0 && (
          <div className="journal-entry-tags">
            {entry.tags.map((tag) => (
              <span
                className="tag-chip"
                key={tag}
              >
                #{tag}
              </span>
            ))}
          </div>
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
            to={'/journal/edit/' + id}
          >
            <Pencil size={15} /> Edit entry
          </Link>
          <Link
            className="button button-quiet"
            to="/journal/insights"
          >
            <Sparkles size={15} /> Journal insights
          </Link>
          <button
            className="button button-quiet danger-quiet-button"
            type="button"
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
            Delete
          </button>
        </div>
      </article>
      <p className="journal-entry-private-note">
        <Leaf size={14} /> A moment is not the whole story. Keep writing.
      </p>
    </div>
  );
}
