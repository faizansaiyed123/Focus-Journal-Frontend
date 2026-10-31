import { useEffect, useState } from 'react';
import { CalendarRange, LoaderCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchCheckinsBetweenDates } from '../checkinAPI';
import useAuthStore from '../../auth/authStore';

function displayDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    String(value || '').slice(0, 10),
  );
  if (!match) return 'Date unavailable';
  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  ).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CheckinBetweenDates() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token || !startDate || !endDate) {
      setCheckins([]);
      setSearched(false);
      return undefined;
    }
    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchCheckinsBetweenDates(token, startDate, endDate);
        if (!cancelled) {
          setCheckins(Array.isArray(data) ? data : []);
          setSearched(true);
        }
      } catch {
        if (!cancelled)
          setError('Those check-ins could not be retrieved. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, [token, startDate, endDate]);

  return (
    <section className="date-filter-panel surface-card">
      <div className="date-filter-heading">
        <span className="date-filter-icon">
          <CalendarRange size={19} />
        </span>
        <div>
          <h2>Revisit a time period</h2>
          <p>Choose dates to look back at saved check-ins.</p>
        </div>
      </div>
      <div className="date-filter-fields">
        <div className="form-field-group">
          <label htmlFor="startDate">FROM</label>
          <input
            id="startDate"
            className="text-field"
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>
        <div
          className="date-range-divider"
          aria-hidden="true"
        >
          —
        </div>
        <div className="form-field-group">
          <label htmlFor="endDate">TO</label>
          <input
            id="endDate"
            className="text-field"
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </div>
        <div className="date-filter-message">
          {loading ? (
            <>
              <LoaderCircle
                size={15}
                className="spin-icon"
              />{' '}
              Finding your entries…
            </>
          ) : searched ? (
            <>
              <Search size={15} /> {checkins.length}{' '}
              {checkins.length === 1 ? 'entry' : 'entries'} found
            </>
          ) : (
            <span>Select a start and end date.</span>
          )}
        </div>
      </div>
      {error && (
        <p
          className="form-error"
          role="alert"
        >
          {error}
        </p>
      )}
      {searched && !loading && !error && (
        <div className="date-filter-results">
          {checkins.length ? (
            checkins.map((item) => (
              <Link
                className="date-filter-result"
                to={'/checkins/' + item.id}
                key={item.id}
              >
                <span>
                  <strong>{displayDate(item.date || item.checkin_date)}</strong>
                  <small>{item.note?.trim() || 'No note saved'}</small>
                </span>
                <span className="date-result-mood">
                  {item.mood || 'Reflection'} · {item.focus_percent ?? 0}%
                </span>
              </Link>
            ))
          ) : (
            <p className="date-filter-empty">
              No check-ins were saved in this date range.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
