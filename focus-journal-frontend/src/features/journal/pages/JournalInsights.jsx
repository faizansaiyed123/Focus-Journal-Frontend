import { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  Brain,
  Check,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import apiClient from '../../../api/apiClient';
import useAuthStore from '../../auth/authStore';
import { generalAiInsights } from '../journalInsightsApi';

export default function JournalInsights() {
  const token = useAuthStore((state) => state.token);
  const [profile, setProfile] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingConsent, setSavingConsent] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/profile');
      setProfile(response.data);
      if (response.data.ai_processing_consent) {
        try {
          setInsights(await generalAiInsights());
        } catch (insightError) {
          const detail = insightError?.response?.data?.detail;
          setError(
            typeof detail === 'string'
              ? detail
              : 'Insights are unavailable right now. Your journal is still here.',
          );
        }
      }
    } catch {
      setError(
        'Your privacy settings could not be loaded. Refresh and try again.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  const updateConsent = async (enabled) => {
    setSavingConsent(true);
    setError('');
    try {
      const response = await apiClient.patch('/profile/settings', {
        ai_processing_consent: enabled,
      });
      setProfile(response.data);
      setInsights(null);
      if (enabled) {
        setLoading(true);
        try {
          setInsights(await generalAiInsights());
        } catch (insightError) {
          const detail = insightError?.response?.data?.detail;
          setError(
            typeof detail === 'string'
              ? detail
              : 'AI insights are not available in this deployment yet.',
          );
        } finally {
          setLoading(false);
        }
      }
    } catch (settingsError) {
      const detail = settingsError?.response?.data?.detail;
      setError(
        typeof detail === 'string'
          ? detail
          : 'We could not save that privacy preference.',
      );
    } finally {
      setSavingConsent(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="insights-page">
        <div className="insights-header">
          <span className="section-eyebrow">REFLECT WITH CARE</span>
          <h1>Journal insights</h1>
        </div>
        <div className="insights-loading" />
      </div>
    );
  }

  return (
    <div className="insights-page">
      <header className="insights-header">
        <span className="section-eyebrow">
          <span className="eyebrow-dot" /> REFLECT WITH CARE
        </span>
        <h1>Journal insights</h1>
        <p>Take a step back and notice themes in the words you’ve saved.</p>
      </header>

      <section className="privacy-consent-card">
        <span className="privacy-consent-icon">
          <ShieldCheck size={22} />
        </span>
        <div className="privacy-consent-copy">
          <span className="section-eyebrow">YOUR PRIVACY, YOUR CALL</span>
          <h2>
            {profile?.ai_processing_consent
              ? 'AI insights are enabled.'
              : 'Your reflections stay yours.'}
          </h2>
          <p>
            AI analysis processes your journal content to create a personal
            summary. It is optional, and nothing is sent for this analysis until
            you explicitly enable it here.
          </p>
        </div>
        <div className="privacy-consent-action">
          {profile?.ai_processing_consent ? (
            <button
              className="button button-quiet consent-disable"
              type="button"
              disabled={savingConsent}
              onClick={() => updateConsent(false)}
            >
              <LockKeyhole size={15} />{' '}
              {savingConsent ? 'Saving…' : 'Turn off AI insights'}
            </button>
          ) : (
            <button
              className="button button-primary"
              type="button"
              disabled={savingConsent}
              onClick={() => updateConsent(true)}
            >
              {savingConsent ? 'Saving preference…' : 'Enable AI insights'}{' '}
              <ArrowRight size={16} />
            </button>
          )}
          <small>
            {profile?.ai_processing_consent
              ? 'You can withdraw consent any time.'
              : 'Off by default. You are in control.'}
          </small>
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
            onClick={load}
          >
            Try again
          </button>
        </div>
      )}

      {!profile?.ai_processing_consent ? (
        <section className="insights-locked-panel">
          <span className="locked-emblem">
            <LockKeyhole size={24} />
          </span>
          <h2>Insights are waiting, only if you want them.</h2>
          <p>
            Your journal remains private and usable without AI. Enable the
            optional analysis above when you’re comfortable with it.
          </p>
        </section>
      ) : loading ? (
        <div className="insights-loading" />
      ) : insights ? (
        <div className="insights-results">
          <article className="insight-result-card insight-focus-result">
            <span className="insight-result-icon">
              <Brain size={20} />
            </span>
            <span className="section-eyebrow">A GENTLE PICTURE</span>
            <h2>Focus score</h2>
            <div className="insight-score-row">
              <strong>{Math.round(Number(insights.focus_score) || 0)}%</strong>
              <div className="insight-score-track">
                <span
                  style={{
                    width:
                      Math.max(
                        0,
                        Math.min(100, Number(insights.focus_score) || 0),
                      ) + '%',
                  }}
                />
              </div>
            </div>
            <p>
              A simple summary of the focus reflected in your saved entries.
            </p>
          </article>
          <article className="insight-result-card">
            <span className="insight-result-icon insight-mood-icon">
              <Sparkles size={20} />
            </span>
            <span className="section-eyebrow">LOOKING INWARD</span>
            <h2>Mood summary</h2>
            <p>
              {insights.mood_summary ||
                'There is not enough journal history to summarize moods just yet.'}
            </p>
          </article>
          <article className="insight-result-card">
            <span className="insight-result-icon insight-keyword-icon">
              <Check size={20} />
            </span>
            <span className="section-eyebrow">WORDS THAT RECUR</span>
            <h2>Top keywords</h2>
            <div className="insight-keywords">
              {(insights.top_keywords || []).filter(Boolean).length ? (
                insights.top_keywords
                  .filter(Boolean)
                  .map((word) => <span key={word}>#{word}</span>)
              ) : (
                <p>No recurring keywords found yet.</p>
              )}
            </div>
          </article>
        </div>
      ) : (
        <section className="insights-locked-panel">
          <span className="locked-emblem">
            <Sparkles size={24} />
          </span>
          <h2>There’s nothing to summarize just yet.</h2>
          <p>Write a few journal entries and come back when you’re ready.</p>
        </section>
      )}
    </div>
  );
}
