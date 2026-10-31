import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Heart,
  Leaf,
  LoaderCircle,
  Save,
  Sparkles,
} from 'lucide-react';
import { createJournal } from '../journalAPI';

function errorText(error) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(' ');
  return 'Your journal entry could not be saved. Please try again.';
}

export default function CreateJournal() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [focusPercent, setFocusPercent] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const entry = await createJournal({
        title: title.trim(),
        content: content.trim() || null,
        mood: mood.trim() || null,
        is_favorite: isFavorite,
        focus_percent: focusPercent === '' ? null : Number(focusPercent),
        tags: tags
          .split(',')
          .map((tag) => tag.trim().replace(/^#/, ''))
          .filter(Boolean),
      });
      navigate(entry?.id ? '/journal/entry/' + entry.id : '/journal', {
        replace: true,
      });
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-page journal-form-page">
      <Link
        to="/journal"
        className="back-link"
      >
        <ArrowLeft size={16} /> Back to your journal
      </Link>
      <header className="form-page-heading">
        <span className="section-eyebrow">
          <span className="eyebrow-dot" /> MAKE SPACE FOR A THOUGHT
        </span>
        <h1>Write it out.</h1>
        <p>
          No prompts to finish, no perfect words needed. Start wherever you are.
        </p>
      </header>
      <form
        className="reflection-form journal-reflection-form"
        onSubmit={handleSubmit}
      >
        <div className="reflection-form-top">
          <span className="form-icon-stamp journal-form-stamp">
            <BookOpen size={21} />
          </span>
          <span className="section-eyebrow">A PAGE OF YOUR OWN</span>
        </div>
        <div className="form-field-group journal-title-field">
          <label htmlFor="journal-title">Give this moment a title</label>
          <input
            className="text-field"
            id="journal-title"
            maxLength={200}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="A thought worth keeping"
            required
          />
        </div>
        <div className="form-field-group">
          <label htmlFor="journal-content">
            What’s on your mind? <span>optional</span>
          </label>
          <textarea
            className="journal-writing-area"
            id="journal-content"
            rows={9}
            maxLength={50000}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Start with a sentence, a feeling, or whatever is true for you right now…"
          />
          <div className="field-meta">
            <span>Only write what you feel comfortable saving.</span>
            <span>{content.length.toLocaleString()}/50,000</span>
          </div>
        </div>
        <div className="journal-meta-grid">
          <div className="form-field-group">
            <label htmlFor="journal-mood">
              Mood or feeling <span>optional</span>
            </label>
            <input
              className="text-field"
              id="journal-mood"
              maxLength={50}
              value={mood}
              onChange={(event) => setMood(event.target.value)}
              placeholder="Calm, curious, overwhelmed…"
            />
          </div>
          <div className="form-field-group">
            <label htmlFor="journal-focus">
              Focus <span>optional</span>
            </label>
            <div className="journal-focus-input">
              <input
                className="text-field"
                id="journal-focus"
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
          <label htmlFor="journal-tags">
            Tags <span>optional</span>
          </label>
          <input
            className="text-field"
            id="journal-tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="work, family, small-wins"
          />
          <p className="field-help">
            Separate tags with commas. A leading # is fine.
          </p>
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
            <Leaf size={15} /> Your words, saved for you.
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
                <Save size={16} /> Save entry <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
