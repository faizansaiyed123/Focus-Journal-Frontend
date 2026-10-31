import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardCheck,
  Sparkles,
} from 'lucide-react';
import { createCheckin } from '../checkinAPI';
import apiClient from '../../../api/apiClient';

const moods = [
  { value: 'bad', label: 'Not great', emoji: '🌧️', note: 'A tough one' },
  { value: 'okay', label: 'Okay', emoji: '🌤️', note: 'Taking it as it comes' },
  { value: 'good', label: 'Good', emoji: '🙂', note: 'Feeling steady' },
  { value: 'great', label: 'Great', emoji: '✨', note: 'Things feel good' },
  { value: 'happy', label: 'Happy', emoji: '🌞', note: 'A bright day' },
];

function dateInTimezone(date, timezone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return part('year') + '-' + part('month') + '-' + part('day');
}

function errorMessage(error) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(' ');
  return 'Your check-in could not be saved. Please try again.';
}

export default function CreateCheckin() {
  const navigate = useNavigate();
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  );
  const [mood, setMood] = useState('good');
  const [note, setNote] = useState('');
  const [focusPercent, setFocusPercent] = useState(70);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiClient
      .get('/profile')
      .then((response) => {
        if (active && response.data?.timezone)
          setTimezone(response.data.timezone);
      })
      .catch(() => null);
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const profile = await apiClient.get('/profile');
      const userTimezone = profile.data?.timezone || timezone;
      setTimezone(userTimezone);
      await createCheckin({
        date: dateInTimezone(new Date(), userTimezone),
        mood,
        focus_percent: Number(focusPercent),
        tags: tags
          .split(',')
          .map((tag) => tag.trim().replace(/^#/, ''))
          .filter(Boolean),
        note: note.trim() || null,
      });
      navigate('/checkin', { replace: true });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <Link
        to="/checkin"
        className="back-link"
      >
        <ArrowLeft size={16} /> Back to check-ins
      </Link>
      <section className="form-page-heading">
        <span className="section-eyebrow">
          <span className="eyebrow-dot" /> A MOMENT FOR YOURSELF
        </span>
        <h1>How are you, today?</h1>
        <p>There's no score to chase here. Just notice where you are.</p>
      </section>
      <form
        className="reflection-form"
        onSubmit={handleSubmit}
      >
        <div className="reflection-form-top">
          <span className="form-icon-stamp">
            <ClipboardCheck size={21} />
          </span>
          <span className="form-date-chip">
            <CalendarDays size={14} />{' '}
            {new Intl.DateTimeFormat(undefined, {
              timeZone: timezone,
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            }).format(new Date())}
          </span>
        </div>
        <fieldset className="mood-picker">
          <legend>Choose the mood that feels closest</legend>
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
                <small>{item.note}</small>
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
            <label htmlFor="focus-percent">How focused did you feel?</label>
            <strong>{focusPercent}%</strong>
          </div>
          <input
            id="focus-percent"
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
          <label htmlFor="checkin-note">
            A note to yourself <span>optional</span>
          </label>
          <textarea
            id="checkin-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={10000}
            rows={4}
            placeholder="What’s on your mind? What went well, or what felt hard?"
          />
          <div className="field-meta">
            <span>Write as much or as little as you like.</span>
            <span>{note.length}/10,000</span>
          </div>
        </div>
        <div className="form-field-group">
          <label htmlFor="checkin-tags">
            Tags <span>optional</span>
          </label>
          <input
            id="checkin-tags"
            className="text-field"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="work, rest, family — separate with commas"
          />
          <p className="field-help">
            Tags make patterns easier to notice later.
          </p>
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
          <span>
            <Sparkles size={15} /> Showing up is enough.
          </span>
          <button
            className="button button-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving your check-in…' : 'Save today’s check-in'}{' '}
            <ArrowRight size={17} />
          </button>
        </div>
      </form>
    </div>
  );
}
