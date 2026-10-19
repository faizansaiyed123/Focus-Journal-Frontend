import { Link, Navigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ClipboardCheck,
  Clock3,
  Focus,
  Leaf,
  Sparkles,
  Target,
} from 'lucide-react';
import useAuthStore from '../features/auth/authStore';

const previewDays = [
  { label: 'M', filled: true },
  { label: 'T', filled: true },
  { label: 'W', filled: true },
  { label: 'T', filled: false },
  { label: 'F', filled: true },
  { label: 'S', filled: true },
  { label: 'S', filled: false },
];

export default function Home() {
  const token = useAuthStore((state) => state.token);

  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="landing-page">
      <div className="landing-grain" aria-hidden="true" />
      <header className="landing-header">
        <Link className="brand-lockup" to="/" aria-label="Focus Journal home">
          <span className="brand-mark"><Leaf size={20} strokeWidth={2.3} /></span>
          <span className="brand-name">focus<span>journal</span></span>
        </Link>
        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#your-space">Your space</a>
        </nav>
        <div className="landing-header-actions">
          <Link className="header-signin" to="/login">Log in</Link>
          <Link className="button button-dark button-small" to="/register">
            Get started <ArrowUpRight size={16} />
          </Link>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="your-space">
          <div className="landing-copy">
            <div className="landing-kicker"><span className="kicker-dot" /> A little more present. A lot more you.</div>
            <h1>Make room for<br />what <em>matters.</em></h1>
            <p className="landing-lede">
              A calmer way to focus, check in with yourself, and make sense of your days.
              Just a few thoughtful minutes at a time.
            </p>
            <div className="landing-cta-row">
              <Link className="button button-primary" to="/register">
                Start your journal <ArrowRight size={18} />
              </Link>
              <Link className="button button-quiet" to="/login">I already have an account</Link>
            </div>
            <div className="landing-reassurance">
              <span className="reassurance-icon"><Check size={14} /></span>
              Your thoughts, your pace. A private space that belongs to you.
            </div>
          </div>

          <div className="landing-visual" aria-label="Preview of the Focus Journal dashboard">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="floating-note note-top"><span className="note-spark"><Sparkles size={15} /></span><span><strong>One thing at a time</strong><small>Progress over pressure</small></span></div>
            <div className="preview-window">
              <div className="preview-window-top">
                <div className="preview-dots"><i /><i /><i /></div>
                <span>YOUR DAILY SPACE</span>
                <span className="preview-status"><span /> private</span>
              </div>
              <div className="preview-body">
                <p className="preview-date">MONDAY · A FRESH START</p>
                <h2>A day, with intention.</h2>
                <p className="preview-subtitle">Small steps make a meaningful rhythm.</p>
                <div className="preview-focus-card">
                  <div className="preview-focus-icon"><Focus size={18} /></div>
                  <div className="preview-focus-copy"><span>FOCUS SESSION</span><strong>Deep work, gently.</strong><small>One clear priority</small></div>
                  <div className="preview-play"><span /></div>
                </div>
                <div className="preview-metrics">
                  <div><span className="metric-label">YOUR RHYTHM</span><strong>5 <small>days</small></strong><div className="preview-day-row">{previewDays.map((day, index) => <span key={index} className={day.filled ? 'preview-day filled' : 'preview-day'}>{day.label}</span>)}</div></div>
                  <div className="preview-mood"><span className="metric-label">DAILY CHECK-IN</span><span className="mood-face">☺</span><strong>How are you?</strong><small>Take a moment</small></div>
                </div>
                <div className="preview-journal"><span className="preview-journal-icon"><BookOpen size={17} /></span><span><small>A NOTE TO YOURSELF</small><strong>What felt good today?</strong></span><ArrowUpRight size={16} /></div>
              </div>
            </div>
            <div className="floating-note note-bottom"><span className="note-leaf"><Leaf size={16} /></span><span><strong>Keep it simple</strong><small>Reflect. Reset. Repeat.</small></span></div>
          </div>
        </section>

        <section className="landing-principles" id="how-it-works">
          <div className="principles-heading">
            <span className="section-eyebrow">A rhythm that feels like yours</span>
            <h2>Less tracking. More <em>understanding.</em></h2>
            <p>Everything you need to show up for yourself, without turning life into another to-do list.</p>
          </div>
          <div className="principles-grid">
            <article className="principle-card">
              <span className="principle-number">01</span>
              <div className="principle-icon soft-green"><Clock3 size={21} /></div>
              <h3>Find your focus</h3>
              <p>Make space for one meaningful task. Work in a session, pause when you need to, and celebrate finishing.</p>
            </article>
            <article className="principle-card">
              <span className="principle-number">02</span>
              <div className="principle-icon soft-peach"><ClipboardCheck size={21} /></div>
              <h3>Check in, honestly</h3>
              <p>Name your mood, notice your focus, and leave a small note. No perfect days required.</p>
            </article>
            <article className="principle-card">
              <span className="principle-number">03</span>
              <div className="principle-icon soft-lilac"><Target size={21} /></div>
              <h3>Notice your patterns</h3>
              <p>Come back to your journal and saved history to see what helps you feel more grounded.</p>
            </article>
          </div>
        </section>

        <section className="landing-endcap">
          <div className="endcap-leaf"><Leaf size={25} /></div>
          <div><span className="section-eyebrow">Start exactly where you are</span><h2>Your next chapter starts with a single line.</h2></div>
          <Link className="button button-light" to="/register">Make a little space <ArrowRight size={17} /></Link>
        </section>
      </main>

      <footer className="landing-footer">
        <Link className="brand-lockup footer-brand" to="/"><span className="brand-mark"><Leaf size={17} /></span><span className="brand-name">focus<span>journal</span></span></Link>
        <span>A quieter place to make sense of your days.</span>
        <span className="footer-private"><span /> Built for your own reflection</span>
      </footer>
    </div>
  );
}
