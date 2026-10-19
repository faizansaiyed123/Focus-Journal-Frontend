import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flame,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Timer,
  TrendingUp,
  X,
} from 'lucide-react';
import apiClient from '../api/apiClient';
import useAuthStore from '../features/auth/authStore';
import { fetchAllJournals, fetchJournalStats } from '../features/journal/journalAPI';
import { fetchToday, fetchStreak, fetchCheckinHistory } from '../features/checkin/checkinAPI';
import {
  fetchFocusSessionSummary,
  listFocusSessions,
  startFocusSession,
  transitionFocusSession,
} from '../features/focus/focusSessionAPI';

const localDateKey = (date, timezone = 'UTC') => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return part('year') + '-' + part('month') + '-' + part('day');
};

const shiftDateKey = (key, amount) => {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount));
  return date.getUTCFullYear() + '-' +
    String(date.getUTCMonth() + 1).padStart(2, '0') + '-' +
    String(date.getUTCDate()).padStart(2, '0');
};

const readableDate = (value) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Recently'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const durationLabel = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  if (hours > 0) return hours + 'h ' + String(minutes).padStart(2, '0') + 'm';
  return minutes + 'm';
};

const timerLabel = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainder = safeSeconds % 60;
  if (hours > 0) return [hours, minutes, remainder].map((part) => String(part).padStart(2, '0')).join(':');
  return String(minutes).padStart(2, '0') + ':' + String(remainder).padStart(2, '0');
};

const errorDetail = (error, fallback) => {
  const detail = error && error.response && error.response.data && error.response.data.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).filter(Boolean).join(' ');
  return fallback;
};

const moodEmoji = (mood) => ({
  bad: '🌧️',
  okay: '🌤️',
  good: '🙂',
  great: '✨',
  happy: '🌞',
}[String(mood || '').toLowerCase()] || '✍️');

export default function Dashboard() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [journals, setJournals] = useState([]);
  const [journalStats, setJournalStats] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [streak, setStreak] = useState(null);
  const [checkinHistory, setCheckinHistory] = useState([]);
  const [focusSummary, setFocusSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [sessionTitle, setSessionTitle] = useState('Focused work');
  const [plannedMinutes, setPlannedMinutes] = useState('25');
  const [focusSession, setFocusSession] = useState(null);
  const [sessionError, setSessionError] = useState('');
  const [sessionBusy, setSessionBusy] = useState('');
  const [sessionAnchor, setSessionAnchor] = useState(Date.now());
  const [clock, setClock] = useState(Date.now());

  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    setPageError('');
    const results = await Promise.allSettled([
      apiClient.get('/auth/me').then((response) => response.data),
      fetchAllJournals(token),
      fetchJournalStats(token),
      fetchToday(token),
      fetchStreak(token),
      fetchCheckinHistory(7),
      listFocusSessions(10, 0),
      fetchFocusSessionSummary(),
    ]);

    if (results[0].status === 'rejected' && results[0].reason && results[0].reason.response?.status === 401) {
      logout();
      navigate('/login');
      return;
    }

    const valueAt = (index, fallback) => results[index].status === 'fulfilled' ? results[index].value : fallback;
    const user = valueAt(0, null);
    const entries = valueAt(1, []);
    const stats = valueAt(2, null);
    const today = valueAt(3, null);
    const streakData = valueAt(4, null);
    const history = valueAt(5, []);
    const sessionPage = valueAt(6, { items: [] });
    const summary = valueAt(7, null);

    setProfile(user);
    setJournals(Array.isArray(entries) ? entries : []);
    setJournalStats(stats);
    setTodayData(today);
    setStreak(streakData);
    setCheckinHistory(Array.isArray(history) ? history : []);
    setFocusSummary(summary);

    const active = (sessionPage.items || []).find((session) => ['running', 'paused'].includes(session.status));
    setFocusSession(active || null);
    setSessionAnchor(Date.now());
    setClock(Date.now());

    const anyFailure = results.some((result) => result.status === 'rejected');
    if (results[0].status === 'rejected') {
      setPageError('Your profile could not be loaded. Check your connection and refresh.');
    } else if (anyFailure) {
      setPageError('Some history could not be refreshed. Your saved journal and remaining data are still available.');
    }
    setLoading(false);
  }, [token, logout, navigate]);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    refreshDashboard();
  }, [token, navigate, refreshDashboard]);

  useEffect(() => {
    if (!focusSession || focusSession.status !== 'running') return undefined;
    const interval = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [focusSession && focusSession.status]);

  const userTimezone = profile?.timezone || 'UTC';
  const todayKey = localDateKey(new Date(), userTimezone);
  const fullName = profile && (profile.full_name || profile.name)
    ? (profile.full_name || profile.name).split(' ')[0]
    : (profile && profile.email ? profile.email.split('@')[0] : 'there');
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: userTimezone, hour: '2-digit', hourCycle: 'h23' }).format(new Date()));
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const todayCheckin = checkinHistory.find((item) => String(item.date || item.checkin_date || '').slice(0, 10) === todayKey);
  const checkedIn = Boolean((todayData && (todayData.checked || (todayData.data && todayData.data.checked_in))) || todayCheckin);
  const recentJournals = [...journals].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const key = shiftDateKey(todayKey, index - 6);
    const entry = checkinHistory.find((item) => String(item.date || item.checkin_date || '').slice(0, 10) === key);
    const stableDate = new Date(key + 'T12:00:00Z');
    return {
      key,
      label: stableDate.toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' }).slice(0, 1),
      day: Number(key.slice(-2)),
      complete: Boolean(entry),
      today: key === todayKey,
    };
  });

  const elapsedSeconds = Math.max(
    0,
    (Number(focusSession && focusSession.elapsed_seconds) || 0) +
      (focusSession && focusSession.status === 'running' ? Math.floor((clock - sessionAnchor) / 1000) : 0)
  );
  const plannedSeconds = Number(focusSession && focusSession.planned_duration_seconds) || 0;
  const timerProgress = plannedSeconds ? Math.min(100, Math.round((elapsedSeconds / plannedSeconds) * 100)) : 0;

  const handleSessionAction = async (action) => {
    setSessionError('');
    setSessionBusy(action);
    try {
      if (action === 'start') {
        const title = sessionTitle.trim() || 'Focused work';
        const created = await startFocusSession({
          title,
          planned_duration_minutes: plannedMinutes ? Number(plannedMinutes) : null,
        });
        setFocusSession(created);
        setSessionAnchor(Date.now());
        setClock(Date.now());
        setSessionTitle('');
      } else if (focusSession) {
        const updated = await transitionFocusSession(focusSession.id, action);
        if (action === 'complete' || action === 'abandon') {
          setFocusSession(null);
          setSessionAnchor(Date.now());
          const refreshed = await fetchFocusSessionSummary().catch(() => null);
          if (refreshed) setFocusSummary(refreshed);
        } else {
          setFocusSession(updated);
          setSessionAnchor(Date.now());
          setClock(Date.now());
        }
      }
    } catch (error) {
      setSessionError(errorDetail(error, 'The focus session could not be updated. Please try again.'));
    } finally {
      setSessionBusy('');
    }
  };

  if (loading && !profile) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-welcome-skeleton"><div /><div /><div /></div>
        <div className="dashboard-skeleton-grid"><div /><div /><div /><div /></div>
        <div className="dashboard-skeleton-wide" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <span className="section-eyebrow"><span className="eyebrow-dot" /> YOUR PERSONAL SPACE</span>
          <h1>{greeting}, {fullName}.</h1>
          <p>Take a breath. You don't have to do it all — just the next right thing.</p>
        </div>
        <div className="welcome-date">
          <CalendarCheck size={18} />
          <span>{new Intl.DateTimeFormat(undefined, { timeZone: userTimezone, weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())}</span>
        </div>
      </section>

      {pageError && <div className="inline-notice" role="status">{pageError}<button type="button" onClick={refreshDashboard}><RotateCcw size={14} /> Refresh</button></div>}

      <section className="dashboard-primary-grid">
        <article className="focus-panel">
          <div className="focus-panel-glow" />
          <div className="focus-panel-head">
            <div><span className="focus-kicker"><span /> SPACE TO FOCUS</span><h2>A little progress<br />goes a long way.</h2></div>
            <div className="focus-spark"><Sparkles size={19} /></div>
          </div>

          {focusSession ? (
            <div className="focus-active-session">
              <div className="timer-ring" style={{ '--progress': timerProgress + '%' }}>
                <div className="timer-ring-inner">
                  <Timer size={20} />
                  <strong>{timerLabel(elapsedSeconds)}</strong>
                  <span>{focusSession.status === 'paused' ? 'ON PAUSE' : 'IN FOCUS'}</span>
                </div>
              </div>
              <div className="active-session-meta">
                <span className="active-session-label">CURRENT SESSION</span>
                <h3>{focusSession.title}</h3>
                <p>{plannedSeconds ? (Math.max(0, plannedSeconds - elapsedSeconds) > 0 ? durationLabel(plannedSeconds - elapsedSeconds) + ' left in your plan' : 'Your planned time is up — finish whenever you’re ready.') : 'Move at your own pace. No timer pressure.'}</p>
                <div className="focus-controls">
                  {focusSession.status === 'running' ? (
                    <button className="focus-control-button control-pause" type="button" onClick={() => handleSessionAction('pause')} disabled={Boolean(sessionBusy)}><Pause size={16} /> Pause</button>
                  ) : (
                    <button className="focus-control-button control-resume" type="button" onClick={() => handleSessionAction('resume')} disabled={Boolean(sessionBusy)}><Play size={16} /> Resume</button>
                  )}
                  <button className="focus-control-button control-complete" type="button" onClick={() => handleSessionAction('complete')} disabled={Boolean(sessionBusy)}><Check size={16} /> Finish</button>
                  <button className="focus-control-icon" type="button" aria-label="Abandon focus session" title="End session without completing" onClick={() => handleSessionAction('abandon')} disabled={Boolean(sessionBusy)}><X size={17} /></button>
                </div>
              </div>
            </div>
          ) : (
            <form className="focus-start-form" onSubmit={(event) => { event.preventDefault(); handleSessionAction('start'); }}>
              <label className="visually-hidden" htmlFor="focus-title">What would you like to focus on?</label>
              <input id="focus-title" value={sessionTitle} maxLength={200} onChange={(event) => setSessionTitle(event.target.value)} placeholder="What would you like to focus on?" />
              <div className="focus-start-bottom">
                <label className="duration-select-label" htmlFor="focus-duration"><Clock3 size={15} /><span>Time to set aside</span></label>
                <select id="focus-duration" value={plannedMinutes} onChange={(event) => setPlannedMinutes(event.target.value)}>
                  <option value="25">25 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="">No timer</option>
                </select>
              </div>
              <button className="button button-focus-start" type="submit" disabled={Boolean(sessionBusy)}><Play size={17} fill="currentColor" /> {sessionBusy === 'start' ? 'Starting session…' : 'Start focusing'} <ArrowUpRight size={17} /></button>
            </form>
          )}
          {sessionError && <p className="focus-error" role="alert">{sessionError}</p>}
          <div className="focus-panel-foot"><span><span className="focus-foot-dot" /> One thing at a time</span><span>{focusSession && focusSession.status === 'paused' ? 'Your timer is paused' : 'Your pace, your rules'}</span></div>
        </article>

        <article className={'checkin-panel' + (checkedIn ? ' checkin-complete' : '')}>
          <div className="checkin-panel-top"><span className="section-eyebrow">DAILY CHECK-IN</span><span className="checkin-emblem">{checkedIn ? <CheckCircle2 size={21} /> : <CalendarCheck size={21} />}</span></div>
          <div className="checkin-illustration" aria-hidden="true"><div className="sun-disc" /><div className="hill hill-back" /><div className="hill hill-front" /><div className="hill-flower flower-one" /><div className="hill-flower flower-two" /></div>
          <h2>{checkedIn ? 'You showed up.' : 'How are you,\nreally?'}</h2>
          <p>{checkedIn ? 'You made time to check in today. That matters.' : 'A small pause to name your mood and notice where your energy is.'}</p>
          {checkedIn && todayCheckin ? (
            <div className="today-mood-chip"><span>{moodEmoji(todayCheckin.mood)}</span><span>Feeling {todayCheckin.mood}</span><span className="mood-chip-focus">{todayCheckin.focus_percent ?? 0}% focus</span></div>
          ) : null}
          <Link className="button button-checkin" to={checkedIn ? '/checkin' : '/checkins/new'}>{checkedIn ? 'View your check-in' : 'Check in with yourself'} <ArrowRight size={17} /></Link>
          <span className="checkin-reassurance"><Check size={13} /> No right or wrong answers</span>
        </article>
      </section>

      <section className="dashboard-stats-grid" aria-label="Your journal at a glance">
        <article className="stat-tile">
          <div className="stat-tile-icon icon-green"><BookOpen size={18} /></div>
          <div className="stat-tile-copy"><span>Journal entries</span><strong>{journalStats?.total_entries ?? journals.length}</strong><small>Words worth keeping</small></div>
          <ArrowUpRight className="stat-tile-arrow" size={17} />
        </article>
        <article className="stat-tile">
          <div className="stat-tile-icon icon-peach"><Flame size={18} /></div>
          <div className="stat-tile-copy"><span>Current streak</span><strong>{streak?.current_streak ?? 0}<small> days</small></strong><small>Built one day at a time</small></div>
          <ArrowUpRight className="stat-tile-arrow" size={17} />
        </article>
        <article className="stat-tile">
          <div className="stat-tile-icon icon-lilac"><TrendingUp size={18} /></div>
          <div className="stat-tile-copy"><span>Average journal focus</span><strong>{Math.round(Number(journalStats?.average_focus) || 0)}<small>%</small></strong><small>Across saved entries</small></div>
          <ArrowUpRight className="stat-tile-arrow" size={17} />
        </article>
        <article className="stat-tile">
          <div className="stat-tile-icon icon-blue"><Timer size={18} /></div>
          <div className="stat-tile-copy"><span>Focused this week</span><strong>{durationLabel(focusSummary?.total_focus_seconds)}</strong><small>{focusSummary?.completed_sessions ?? 0} completed sessions</small></div>
          <ArrowUpRight className="stat-tile-arrow" size={17} />
        </article>
      </section>

      <section className="dashboard-lower-grid">
        <article className="surface-card rhythm-card">
          <div className="surface-card-heading">
            <div><span className="section-eyebrow">A GENTLE RHYTHM</span><h2>Your check-in rhythm</h2><p>Consistency is about returning, not perfection.</p></div>
            <div className="rhythm-streak"><Flame size={17} /><strong>{streak?.current_streak ?? 0}</strong><span>day streak</span></div>
          </div>
          <div className="week-rhythm">
            {lastSevenDays.map((day) => (
              <div className="rhythm-day" key={day.key}>
                <span className="rhythm-weekday">{day.label}</span>
                <span className={'rhythm-dot' + (day.complete ? ' is-complete' : '') + (day.today ? ' is-today' : '')}>{day.complete ? <Check size={14} /> : <span />}</span>
                <span className={'rhythm-date' + (day.today ? ' today-date' : '')}>{day.day}</span>
              </div>
            ))}
          </div>
          <div className="rhythm-card-foot"><span>{checkinHistory.length} recent check-ins in your history</span><Link to="/checkin">See check-ins <ChevronRight size={15} /></Link></div>
        </article>

        <article className="surface-card quick-actions-card">
          <div className="surface-card-heading"><div><span className="section-eyebrow">KEEP IT MOVING</span><h2>Make a little space</h2></div><span className="quick-actions-spark"><Sparkles size={18} /></span></div>
          <Link className="quick-action-row" to="/journal/create"><span className="quick-action-icon quick-journal"><BookOpen size={18} /></span><span><strong>Write a journal entry</strong><small>Get a thought out of your head</small></span><Plus size={17} /></Link>
          <Link className="quick-action-row" to={checkedIn ? '/checkin' : '/checkins/new'}><span className="quick-action-icon quick-checkin"><CalendarCheck size={18} /></span><span><strong>{checkedIn ? 'Revisit your check-in' : 'Take a daily check-in'}</strong><small>{checkedIn ? 'See what you recorded today' : 'Notice how today is going'}</small></span><Plus size={17} /></Link>
          <Link className="quick-action-row" to="/journal"><span className="quick-action-icon quick-history"><BookOpen size={18} /></span><span><strong>Read past entries</strong><small>Look back with fresh eyes</small></span><Plus size={17} /></Link>
        </article>
      </section>

      <section className="surface-card recent-entries-card">
        <div className="surface-card-heading recent-heading">
          <div><span className="section-eyebrow">YOUR THOUGHTS, SAVED</span><h2>Recently in your journal</h2><p>A few pages from your story so far.</p></div>
          <Link className="text-link" to="/journal">View all entries <ArrowRight size={16} /></Link>
        </div>
        {recentJournals.length ? (
          <div className="recent-entry-list">
            {recentJournals.map((entry, index) => (
              <Link className="recent-entry-row" to={'/journal/entry/' + entry.id} key={entry.id}>
                <span className={'entry-index entry-index-' + (index + 1)}>{String(index + 1).padStart(2, '0')}</span>
                <span className="entry-main"><strong>{entry.title || 'Untitled entry'}</strong><span>{(entry.content || 'A moment captured for later.').trim().replace(/\s+/g, ' ').slice(0, 110)}</span><span className="entry-tags">{(entry.tags || []).slice(0, 3).map((tag) => <i key={tag}>#{tag}</i>)}</span></span>
                <span className="entry-date">{readableDate(entry.created_at)}</span>
                <ChevronRight className="entry-chevron" size={18} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-journal-state">
            <span className="empty-journal-icon"><BookOpen size={23} /></span>
            <strong>Your story starts here.</strong>
            <p>Save a thought, a moment, or a small win. You can come back to it whenever you need.</p>
            <Link className="button button-primary button-small" to="/journal/create">Write your first entry <ArrowRight size={15} /></Link>
          </div>
        )}
      </section>

      <footer className="dashboard-footer"><span>Made for real life, not perfect streaks.</span><span><span className="footer-heart">♥</span> Take it one day at a time</span></footer>
    </div>
  );
}
