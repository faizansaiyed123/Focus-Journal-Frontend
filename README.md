# Focus Journal — Frontend

Focus Journal is a responsive journaling and focus application for building a consistent reflection habit. Users can record daily check-ins, write private journal entries, run focus sessions, and review patterns from their saved history.

**Live application:** https://focus-journal-frontend.vercel.app  
**Backend:** https://github.com/faizansaiyed123/Focus-Journal-Backend

## Features

- Account registration, sign-in, and supported OAuth providers
- Daily check-ins and mood tracking
- Private journal entries and saved-history review
- Focus-session lifecycle and summaries
- Profile and privacy settings
- History-based summaries and optional AI journal insights

The interface uses authenticated API responses. Empty history is represented as empty; the application does not need fabricated statistics to populate the dashboard.

## Technology

- React and Vite
- JavaScript
- Axios for backend requests
- Feature-oriented components and state management

## Local development

```bash
cd focus-journal-frontend
npm ci
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the root URL of the FastAPI backend when using a different environment. If it is not set, the application uses its configured default API URL.

## Quality checks

```bash
npm run build
npm run lint
```

## Backend integration

The frontend uses the backend's canonical routes for authentication, journal entries, check-ins, focus sessions, privacy settings, and summaries. OAuth uses a short-lived, single-use code that the frontend exchanges with the backend over HTTPS. Deploy compatible frontend and backend versions together.

## Configuration and security

- Keep local `.env` files out of Git. The tracked `.env.example` contains configuration placeholders only.
- Never place private API keys, OAuth client secrets, database credentials, or signing secrets in frontend variables. Variables prefixed with `VITE_` are included in the browser bundle and must be treated as public.
- Configure deployment environment variables in the hosting provider and use HTTPS for production OAuth flows.

See the [backend repository](https://github.com/faizansaiyed123/Focus-Journal-Backend) for API setup, database configuration, migrations, and backend security details.
