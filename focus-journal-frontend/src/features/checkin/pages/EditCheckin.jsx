import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ClipboardCheck,
  LoaderCircle,
  Save,
  Trash2,
} from 'lucide-react';
import { deleteCheckin, fetchCheckinById, updateCheckin } from '../checkinAPI';

const moods = [
  { value: 'bad', label: 'Not great', emoji: '🌧️' },
  { value: 'okay', label: 'Okay', emoji: '🌤️' },
  { value: 'good', label: 'Good', emoji: '🙂' },
  { value: 'great', label: 'Great', emoji: '✨' },
  { value: 'happy', label: 'Happy', emoji: '🌞' },
];
const localDate = (value) => String(value || '').slice(0, 10);
function errorText(error, fallback) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(' ');
  return fallback;
}

export default function EditCheckin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [mood, setMood] = useState('good');
  const [focusPercent, setFocusPercent] = useState(70);
  const [tags, setTags] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchCheckinById(id)
      .then((data) => {
        if (cancelled) return;
        setEntry(data);
        setMood(data.mood || 'good');
        setFocusPercent(Number(data.focus_percent) || 0);
        setTags((data.tags || []).join(', '));
        setNote(data.note || '');
      })
      .catch((requestError) => {
        if (!cancelled)
          setError(
            errorText(requestError, 'This check-in could not be loaded.'),
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateCheckin(id, {
        mood,
        note: note.trim() || null,
        focus_percent: Number(focusPercent),
        tags: tags
          .split(',')
          .map((tag) => tag.trim().replace(/^#/, ''))
          .filter(Boolean),
      });
      navigate('/checkins/' + id, { replace: true });
    } catch (requestError) {
      setError(errorText(requestError, 'Your changes could not be saved.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this check-in? This cannot be undone.')) return;
    setSaving(true);
    setError('');
    try {
      await deleteCheckin(id);
      navigate('/checkin', { replace: true });
    } catch (requestError) {
      setError(errorText(requestError, 'This check-in could not be deleted.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="form-page">
        <div className="insights-loading" />
      </div>
    );

  return (
    <div className="form-page">
      <Link
        to={'/checkins/' + id}
        className="back-link"
      >
        <ArrowLeft size={16} /> Back to this check-in
      </Link>
      <header className="form-page-heading">
        <span className="section-eyebrow">
          <span className="eyebrow-dot" /> YOUR REFLECTION, YOUR WAY
        </span>
        <h1>Edit your check-in</h1>
        <p>A saved moment can change as you look back on it.</p>
      </header>
      {entry && (
        <div className="form-date-chip edit-date-chip">
          <CalendarDays size={14} /> Saved on{' '}
          {new Date(
            localDate(entry.date || entry.checkin_date) + 'T12:00:00',
          ).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      )}
      <form
        className="reflection-form edit-reflection-form"
        onSubmit={handleUpdate}
      >
        <div className="reflection-form-top">
          <span className="form-icon-stamp">
            <ClipboardCheck size={21} />
          </span>
          <span className="section-eyebrow">DAILY CHECK-IN</span>
        </div>
        <fieldset className="mood-picker">
          <legend>What best describes how you felt?</legend>
          <div className="mood-option-grid">
            {moods.map((item) => (
              <button
                type="button"
                key={item.value}
                className={
                  'mood-option' +
                  (mood === item.value ? ' mood-option-selected' : '')
                }
                aria-pressed={mood === item.value}
                onClick={() => setMood(item.value)}
              >
                <span className="mood-option-emoji">{item.emoji}</span>
                <strong>{item.label}</strong>
                {mood === item.value && (
                  <span className="mood-check">
                    <Check size={12} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="focus-range-section">
          <div className="range-heading">
            <label htmlFor="edit-focus-percent">
              How focused did you feel?
            </label>
            <strong>{focusPercent}%</strong>
          </div>
          <input
            id="edit-focus-percent"
            type="range"
            min="0"
            max="100"
            step="5"
            value={focusPercent}
            onChange={(event) => setFocusPercent(Number(event.target.value))}
            style={{ '--range-progress': focusPercent + '%' }}
          />
          <div className="range-endpoints">
            <span>Scattered</span>
            <span>In the zone</span>
          </div>
        </div>
        <div className="form-field-group">
          <label htmlFor="edit-checkin-note">
            A note to yourself <span>optional</span>
          </label>
          <textarea
            id="edit-checkin-note"
            rows={4}
            maxLength={10000}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What would you like to remember?"
          />
        </div>
        <div className="form-field-group">
          <label htmlFor="edit-checkin-tags">
            Tags <span>optional</span>
          </label>
          <input
            id="edit-checkin-tags"
            className="text-field"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="work, rest, personal"
          />
        </div>
        {error && (
          <div
            className="form-error"
            role="alert"
          >
            {error}
          </div>
        )}
        <div className="reflection-form-footer">
          <button
            className="button button-quiet danger-quiet-button"
            type="button"
            onClick={handleDelete}
            disabled={saving}
          >
            <Trash2 size={15} /> Delete
          </button>
          <button
            className="button button-primary"
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <LoaderCircle
                  size={15}
                  className="spin-icon"
                />{' '}
                Saving…
              </>
            ) : (
              <>
                <Save size={16} /> Save changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
