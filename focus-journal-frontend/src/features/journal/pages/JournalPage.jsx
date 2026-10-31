import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  LoaderCircle,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { fetchAllJournals } from '../journalAPI';
import { searchJournals } from '../journalInsightsApi';
import useAuthStore from '../../auth/authStore';

function shortDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Saved entry'
    : date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
}
function errorText(error) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(' ');
  return 'Your journal could not be loaded. Please try again.';
}

export default function JournalPage() {
  const token = useAuthStore((state) => state.token);
  const [journals, setJournals] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [remoteResults, setRemoteResults] = useState(null);
  const [tag, setTag] = useState('');
  const [mood, setMood] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchAllJournals(token)
      .then((data) => {
        if (!cancelled) setJournals(Array.isArray(data) ? data : []);
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
  }, [token]);

  const allTags = useMemo(
    () =>
      [
        ...new Set(
          journals.flatMap((entry) => entry.tags || []).filter(Boolean),
        ),
      ].sort(),
    [journals],
  );
  const allMoods = useMemo(
    () =>
      [...new Set(journals.map((entry) => entry.mood).filter(Boolean))].sort(),
    [journals],
  );
  const visible = useMemo(() => {
    const source = activeQuery ? remoteResults || [] : journals;
    return [...source]
      .filter(
        (entry) =>
          !tag ||
          (entry.tags || []).some(
            (value) => value.toLowerCase() === tag.toLowerCase(),
          ),
      )
      .filter(
        (entry) =>
          !mood ||
          String(entry.mood || '').toLowerCase() === mood.toLowerCase(),
      )
      .sort((a, b) =>
        sort === 'newest'
          ? new Date(b.created_at) - new Date(a.created_at)
          : new Date(a.created_at) - new Date(b.created_at),
      );
  }, [journals, activeQuery, remoteResults, tag, mood, sort]);

  const submitSearch = async (event) => {
    event.preventDefault();
    const keyword = searchText.trim();
    setTag('');
    setMood('');
    setError('');
    if (!keyword) {
      setActiveQuery('');
      setRemoteResults(null);
      return;
    }
    setSearching(true);
    try {
      const results = await searchJournals(token, keyword);
      setRemoteResults(Array.isArray(results) ? results : []);
      setActiveQuery(keyword);
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setSearching(false);
    }
  };

  const clearFilters = () => {
    setSearchText('');
    setActiveQuery('');
    setRemoteResults(null);
    setTag('');
    setMood('');
    setSort('newest');
    setError('');
  };

  return (
    <div className="journal-library-page">
      <header className="secondary-page-header">
        <div>
          <span className="section-eyebrow">
            <span className="eyebrow-dot" /> YOUR THOUGHTS, KEPT CLOSE
          </span>
          <h1>Your journal</h1>
          <p>
            A growing collection of moments, ideas, and things you’ve noticed.
          </p>
        </div>
        <Link
          className="button button-primary"
          to="/journal/create"
        >
          <Plus size={17} /> New entry
        </Link>
      </header>

      <section className="journal-library-tools surface-card">
        <form
          className="journal-search-form"
          onSubmit={submitSearch}
        >
          <span className="journal-search-icon">
            <Search size={17} />
          </span>
          <input
            aria-label="Search journal entries"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search your saved words…"
            maxLength={200}
          />
          <button
            className="button button-primary button-small"
            type="submit"
            disabled={searching}
          >
            {searching ? (
              <LoaderCircle
                size={14}
                className="spin-icon"
              />
            ) : (
              <Search size={14} />
            )}{' '}
            Search
          </button>
        </form>
        <div className="journal-filter-row">
          <span className="journal-filter-label">
            <SlidersHorizontal size={14} /> REFINE YOUR VIEW
          </span>
          <label className="journal-select-wrap">
            <span>Tag</span>
            <select
              className="journal-filter-select"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
            >
              <option value="">All tags</option>
              {allTags.map((item) => (
                <option
                  value={item}
                  key={item}
                >
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown size={13} />
          </label>
          <label className="journal-select-wrap">
            <span>Mood</span>
            <select
              className="journal-filter-select"
              value={mood}
              onChange={(event) => setMood(event.target.value)}
            >
              <option value="">All moods</option>
              {allMoods.map((item) => (
                <option
                  value={item}
                  key={item}
                >
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown size={13} />
          </label>
          <label className="journal-select-wrap">
            <span>Sort</span>
            <select
              className="journal-filter-select"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ChevronDown size={13} />
          </label>
          <button
            className="journal-reset-button"
            type="button"
            onClick={clearFilters}
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </section>

      {error && (
        <div
          className="inline-notice"
          role="status"
        >
          {error}
          <button
            type="button"
            onClick={clearFilters}
          >
            Clear
          </button>
        </div>
      )}
      <div className="journal-library-heading">
        <div>
          <h2>{activeQuery ? 'Search results' : 'All entries'}</h2>
          {activeQuery && <p>Showing matches for “{activeQuery}”</p>}
        </div>
        <span>
          {visible.length} {visible.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {loading || searching ? (
        <div className="journal-grid-skeleton">
          <span />
          <span />
          <span />
        </div>
      ) : visible.length ? (
        <div className="journal-library-grid">
          {visible.map((entry, index) => (
            <Link
              className="journal-library-card"
              to={'/journal/entry/' + entry.id}
              key={entry.id}
            >
              <div className="journal-card-top">
                <span className={'journal-card-index index-' + (index % 3)}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="journal-card-date">
                  <CalendarDays size={12} /> {shortDate(entry.created_at)}
                </span>
              </div>
              <h3>{entry.title || 'An untitled moment'}</h3>
              <p>
                {(entry.content || 'A moment captured for later.')
                  .trim()
                  .replace(/\s+/g, ' ')
                  .slice(0, 175)}
                {(entry.content || '').length > 175 ? '…' : ''}
              </p>
              <div className="journal-card-meta">
                {entry.mood && <span>{entry.mood}</span>}
                {entry.focus_percent != null && (
                  <span>{entry.focus_percent}% focus</span>
                )}
              </div>
              {entry.tags?.length > 0 && (
                <div className="entry-tags">
                  {entry.tags.slice(0, 4).map((item) => (
                    <i key={item}>#{item}</i>
                  ))}
                </div>
              )}
              <span className="journal-card-open">
                Read entry <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-journal-state journal-library-empty">
          <span className="empty-journal-icon">
            {activeQuery ? <Search size={22} /> : <BookOpen size={22} />}
          </span>
          <strong>
            {activeQuery
              ? 'No matching entries yet.'
              : 'Your first page is waiting.'}
          </strong>
          <p>
            {activeQuery
              ? 'Try another keyword or clear the filters to see all your entries.'
              : 'Write a thought, save a moment, or make a little room to reflect.'}
          </p>
          <div className="empty-state-actions">
            {activeQuery && (
              <button
                className="button button-quiet"
                type="button"
                onClick={clearFilters}
              >
                Clear search
              </button>
            )}
            <Link
              className="button button-primary button-small"
              to="/journal/create"
            >
              {activeQuery ? 'Write a new entry' : 'Write your first entry'}{' '}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
      <p className="journal-library-footnote">
        <Sparkles size={13} /> Your journal is for reflection, not perfection.
      </p>
    </div>
  );
}
