# Anime Viewer Plus — React Frontend

Modern, responsive UI for browsing and watching anime. Integrates with the Express backend via REST API.

## Features

- Navbar with search and theme toggle
- Sidebar with quick genre filters
- Home sections: Trending and Recent
- Grid of anime cards and details page (episodes list)
- Player page with HLS streaming (backend proxy), progress tracking, and episode list
- Comments and Likes interactions per anime/episode
- Responsive, clean design using CSS variables (light/dark)

## Getting Started

1) Install dependencies
```
npm install
```

2) Configure backend URL
- Copy `.env.example` to `.env` and set:
```
REACT_APP_BACKEND_URL=http://localhost:3001
```
- Ensure the backend is running and exposes endpoints under `/api/...`

3) Start the dev server
```
npm start
```
Open http://localhost:3000

4) Build for production
```
npm run build
```

## Project Structure (key files)

- `src/App.js` — SPA routing and layout
- `src/api/*` — Axios client and API calls
- `src/components/*` — UI components (Navbar, Sidebar, VideoPlayer, etc.)
- `src/pages/*` — Pages (Home, SearchResults, AnimeDetails, Player)
- `src/App.css` — Theme and component styles

## Notes

- HLS is handled via `hls.js`. The player uses the backend stream-proxy: `/api/anime/episode/:episodeId/stream`.
- Comments, likes, and playback tracking use `/api/interactions/*` endpoints.
