import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Heart,
  Leaf,
  LoaderCircle,
  Save,
} from 'lucide-react';
import { fetchJournalById, updateJournal } from '../journalAPI';

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

export default function EditJournal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [focusPercent, setFocusPercent] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchJournalById(id)
      .then((data) => {
        if (cancelled) return;
        setTitle(data.title || '');
        setContent(data.content || '');
        setMood(data.mood || '');
        setTags((data.tags || []).join(', '));
        setFocusPercent(
          data.focus_percent == null ? '' : String(data.focus_percent),
        );
        setIsFavorite(Boolean(data.is_favorite));
      })
      .catch((requestError) => {
        if (!cancelled)
          setError(
            errorText(requestError, 'This journal entry could not be loaded.'),
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
      await updateJournal(id, {
        title: title.trim(),
        content: content.trim() || null,
        mood: mood.trim() || null,
        focus_percent: focusPercent === '' ? null : Number(focusPercent),
        is_favorite: isFavorite,
        tags: tags
          .split(',')
          .map((tag) => tag.trim().replace(/^#/, ''))
          .filter(Boolean),
      });
      navigate('/journal/entry/' + id, { replace: true });
    } catch (requestError) {
      setError(errorText(requestError, 'Your edits could not be saved.'));
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
    <div className="form-page journal-form-page">
      <Link
        to={'/journal/entry/' + id}
        className="back-link"
      >
        <ArrowLeft size={16} /> Back to your entry
      </Link>
      <header className="form-page-heading">
        <span className="section-eyebrow">
          <span className="eyebrow-dot" /> YOUR WORDS CAN GROW WITH YOU
        </span>
        <h1>Revisit this page.</h1>
        <p>Edit what you saved, or simply give it a little more context.</p>
      </header>
      <form
        className="reflection-form journal-reflection-form"
        onSubmit={handleUpdate}
      >
        <div className="reflection-form-top">
          <span className="form-icon-stamp journal-form-stamp">
            <BookOpen size={21} />
          </span>
          <span className="section-eyebrow">EDIT JOURNAL ENTRY</span>
        </div>
        <div className="form-field-group journal-title-field">
          <label htmlFor="edit-journal-title">Title</label>
          <input
            className="text-field"
            id="edit-journal-title"
            value={title}
            maxLength={200}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div className="form-field-group">
          <label htmlFor="edit-journal-content">
            Your reflection <span>optional</span>
          </label>
          <textarea
            className="journal-writing-area"
            id="edit-journal-content"
            rows={9}
            maxLength={50000}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write what feels right."
          />
          <div className="field-meta">
            <span>Your words remain yours.</span>
            <span>{content.length.toLocaleString()}/50,000</span>
          </div>
        </div>
        <div className="journal-meta-grid">
          <div className="form-field-group">
            <label htmlFor="edit-journal-mood">
              Mood or feeling <span>optional</span>
            </label>
            <input
              className="text-field"
              id="edit-journal-mood"
              maxLength={50}
              value={mood}
              onChange={(event) => setMood(event.target.value)}
              placeholder="Calm, hopeful, tired…"
            />
          </div>
          <div className="form-field-group">
            <label htmlFor="edit-journal-focus">
              Focus <span>optional</span>
            </label>
            <div className="journal-focus-input">
              <input
                className="text-field"
                id="edit-journal-focus"
                type="number"
                min="0"
                max="100"
                value={focusPercent}
                onChange={(event) => setFocusPercent(event.target.value)}
                placeholder="0–100"
              />
              <span>%</span>
            </div>
          </div>
        </div>
        <div className="form-field-group">
          <label htmlFor="edit-journal-tags">
            Tags <span>optional</span>
          </label>
          <input
            className="text-field"
            id="edit-journal-tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="work, family, small-wins"
          />
        </div>
        <label className="journal-favorite-toggle">
          <input
            type="checkbox"
            checked={isFavorite}
            onChange={(event) => setIsFavorite(event.target.checked)}
          />
          <span className="favorite-check">
            <Check size={13} />
          </span>
          <span>
            <strong>Keep this one close</strong>
            <small>Mark this entry as a favorite.</small>
          </span>
          <Heart
            size={17}
            className="favorite-heart"
          />
        </label>
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
            <Leaf size={15} /> Saved history, on your terms.
          </span>
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
                <Save size={16} /> Save changes <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
