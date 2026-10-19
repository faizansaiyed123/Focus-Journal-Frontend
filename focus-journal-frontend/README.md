# Focus Journal Frontend

A responsive React + Vite experience for Focus Journal: focus sessions, a daily check-in, private journal entries, and reflection based on saved history.

## Local development

    cd focus-journal-frontend
    npm ci
    cp .env.example .env
    npm run dev

Set \`VITE_API_URL\` to the root URL of the FastAPI backend. It defaults to the deployed Focus Journal API when the variable is not set.

## Build and quality checks

    npm run build
    npm run lint

The frontend CI workflow runs the production build on pull requests and pushes to \`main\`.

## Backend integration

The frontend uses one shared Axios client and the backend’s canonical routes for authentication, journals, check-ins, focus sessions, profile privacy, and summaries. The daily dashboard is powered by live authenticated API responses; empty history is shown as empty rather than populated with sample statistics.

OAuth retains the backend's current compatibility redirect. The callback removes the access-token query parameter from the visible URL immediately. A one-time authorization-code exchange still requires a coordinated backend change before the full application should be treated as production-ready.
