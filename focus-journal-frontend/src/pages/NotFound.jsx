import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div>
        <span className="brand-mark"><Leaf size={22} /></span>
        <h1>This page wandered off.</h1>
        <p>It may have moved, or it might not exist yet. Let’s get you back to a familiar place.</p>
        <Link className="button button-primary" to="/">Back to home <ArrowLeft size={16} /></Link>
      </div>
    </main>
  );
}
