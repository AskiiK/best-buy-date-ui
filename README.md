# Best Buy Date UI

Frontend for exploring the best buy date for NSE tickers. Built with Vite + React and ships as a static bundle (the `docs` folder) plus a small serverless function that proxies news headlines.

## Getting started

```bash
npm install
npm run dev
```

The UI expects a running instance of the [`best-buy-date` API](https://best-buy-date.onrender.com) or your own compatible backend. Set the API location and the news proxy endpoint via environment variables (see below).

## Environment variables

Create a `.env` file (Vite automatically loads it) with:

```bash
VITE_API_URL=https://best-buy-date.onrender.com
VITE_NEWS_PROXY_URL=https://your-domain.vercel.app/api/ticker-news
```

- `VITE_API_URL` – REST API that powers the main query form.
- `VITE_NEWS_PROXY_URL` – Serverless endpoint that fetches RSS headlines server-side and adds the proper CORS headers. Without this value the news section is disabled.

## News proxy endpoint

This repo includes `api/ticker-news.js`, a Vercel-style serverless function. Deploy this repository to Vercel (or copy the handler into your backend) and point `VITE_NEWS_PROXY_URL` to `https://<your-domain>/api/ticker-news`. The function:

1. Accepts `ticker` (and optional `limit`).
2. Fetches the Bing News RSS feed for that ticker on the server.
3. Normalizes the items and responds with `{ items: [...] }` plus `Access-Control-Allow-Origin: *`.

Because the proxy runs on your infrastructure, GitHub Pages / Vercel / any static host can call it without tripping CORS.

## Building

```bash
npm run build
```

The production bundle is written to `docs/`, which can be published directly (e.g., GitHub Pages).
