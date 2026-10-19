import { useEffect, useState } from 'react';
import { CheckCircle2, Globe2, LoaderCircle, Monitor, RotateCcw, Save } from 'lucide-react';
import apiClient from '../api/apiClient';

function getErrorMessage(error) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).filter(Boolean).join(' ');
  return 'Your settings could not be saved. Please check your connection and try again.';
}

export default function Settings() {
  const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const [timezone, setTimezone] = useState(deviceTimezone);
  const [savedTimezone, setSavedTimezone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    apiClient.get('/profile')
      .then((response) => {
        if (!active) return;
        const storedTimezone = response.data?.timezone || 'UTC';
        setTimezone(storedTimezone);
        setSavedTimezone(storedTimezone);
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const save = async (event) => {
    event.preventDefault();
    const nextTimezone = timezone.trim();
    if (!nextTimezone) {
      setError('Enter a valid IANA time zone, for example Asia/Kolkata.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await apiClient.patch('/profile/settings', { timezone: nextTimezone });
      const confirmedTimezone = response.data?.timezone || nextTimezone;
      setTimezone(confirmedTimezone);
      setSavedTimezone(confirmedTimezone);
      setSuccess('Your time zone has been saved.');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const useDeviceTimezone = () => {
    setTimezone(deviceTimezone);
    setSuccess('');
    setError('');
  };

  return (
    <div className="settings-page">
      <header className="settings-page-heading">
        <span className="section-eyebrow"><span className="eyebrow-dot" /> MAKE YOUR SPACE YOURS</span>
        <h1>Your settings</h1>
        <p>Small preferences help your journal fit your day, your place, and your routine.</p>
      </header>

      <section className="surface-card settings-card">
        <div className="settings-card-heading">
          <span className="settings-card-icon"><Globe2 size={21} /></span>
          <div><span className="section-eyebrow">LOCAL TIME</span><h2>Your time zone</h2><p>Used to decide the date of a check-in and calculate your daily streaks and summaries.</p></div>
        </div>

        {loading ? <div className="settings-loading"><LoaderCircle size={17} className="spin-icon" /> Loading your preferences…</div> : (
          <form onSubmit={save} className="settings-form">
            <div className="form-field-group">
              <label htmlFor="profile-timezone">IANA time zone</label>
              <input id="profile-timezone" className="text-field" value={timezone} onChange={(event) => { setTimezone(event.target.value); setError(''); setSuccess(''); }} placeholder="e.g. Asia/Kolkata" autoComplete="off" spellCheck="false" required />
              <p className="field-help">Use the region/city format shown by your operating system, such as Europe/London or America/New_York.</p>
            </div>

            <div className="settings-detected-timezone"><Monitor size={16} /><span><small>THIS DEVICE DETECTS</small><strong>{deviceTimezone}</strong></span><button className="button button-quiet" type="button" onClick={useDeviceTimezone}><RotateCcw size={14} /> Use device time zone</button></div>
            {savedTimezone && <p className="settings-saved-note">Currently saved: <strong>{savedTimezone}</strong></p>}
            {error && <div className="form-error" role="alert">{error}</div>}
            {success && <p className="settings-success" role="status"><CheckCircle2 size={15} /> {success}</p>}
            <div className="settings-form-footer"><span>Changing this affects future date-based summaries.</span><button className="button button-primary" type="submit" disabled={saving}>{saving ? <><LoaderCircle size={15} className="spin-icon" /> Saving…</> : <><Save size={15} /> Save preference</>}</button></div>
          </form>
        )}
      </section>

      <section className="settings-privacy-note"><span className="settings-privacy-icon"><CheckCircle2 size={17} /></span><div><strong>AI analysis stays optional.</strong><p>Journal insights are disabled until you explicitly enable them on the Journal Insights page. You can turn consent off again at any time.</p></div></section>
    </div>
  );
}
