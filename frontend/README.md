# Frontend — SignLang AI

React + Vite client for the Sign Language Learning & Assessment Platform.

## Scripts

```bash
npm install
cp .env.example .env
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Pages

- `/` — Home
- `/login` · `/register` — Auth
- `/dashboard` — Protected learner dashboard
- `/profile` — Learner profile get/update

API base URL is set via `VITE_API_BASE_URL` (default `http://localhost:8000/api`).
