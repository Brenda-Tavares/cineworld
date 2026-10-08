# CineWorld

**Movie discovery platform with natural-language search and streaming availability.**

Live site: [https://cineworld-site.vercel.app](https://cineworld-site.vercel.app)
Repository: _(link to be added)_
Author: **Brenda Tavares** (ShipClaw) - Portfolio/contact: **tavaresbrenda@proton.me**

---

## The Problem

Finding a movie is fragmented. You land on a streaming platform, browse what is already on the catalog, and only then discover the film you actually wanted is not available in your country. Search engines do not answer availability. Letterboxd-style databases tell you *what* a film is, not *where you can legally watch it right now*.

The reverse problem is just as common: you remember a film vaguely â€” "the one with the diver, set in space, maybe 2010s" â€” and cannot recall the title. Keyword search cannot help you, because you do not have the keywords.

CineWorld addresses both with a single interface: describe what you want in plain language, get the title back, and immediately see whether it streams free, by subscription, for rent, or for purchase.

## The Solution

A single-page movie catalogue that turns recall and discovery into one flow:

1. **Browse or filter** â€” popular, highest rated, upcoming, national or international, by genre, year or origin.
2. **Search by intent** â€” type a description instead of a title. The AI endpoint resolves it to a real catalogue entry.
3. **Check availability** â€” each title shows where it streams, split into free, subscription, rent and buy.

## Features

- **Natural-language AI search** â€” describe a film in your own words; Gemini extracts the intent and resolves it against the TMDB catalogue.
- **Identify mode** â€” for fuzzy recall. Returns the best matching title with a localised explanation of why it matched.
- **Streaming availability** â€” subscription, rent, purchase and free-with-ads providers, resolved per country with a Brazilian fallback.
- **Filtering and sorting** â€” popularity, rating, release date, upcoming, genre, year, and national versus international.
- **8 languages** â€” English, Portuguese, Spanish, Simplified Chinese, Traditional Chinese (Hong Kong), Japanese, Russian and Korean, all client-side with no reload.
- **No account required** â€” nothing to sign up for, nothing stored on a server you control.
- **Responsive** â€” desktop, tablet and mobile from a single layout.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | HTML5, CSS3, vanilla JavaScript | The UI is one catalogue view with filtering. A framework would add a build step and a runtime without removing meaningful complexity. |
| Backend | Node.js on Vercel Serverless Functions | The TMDB and Gemini keys must never reach the browser. Serverless means no server to maintain, and the API surface is five small endpoints. |
| HTTP client | `axios` | Consistent timeouts and error handling across the API layer. |
| Movie data | TMDB API | The reference catalogue for titles, metadata, artwork and streaming providers. |
| AI | Google Gemini API | Converts free-form descriptions into structured search intent. |
| Sanitisation | DOMPurify (cdnjs) | Catalogue text is rendered as HTML. DOMPurify strips injected markup before it reaches the DOM. |
| Icons | Font Awesome (cdnjs) | Consistent icon set without shipping an icon font. |
| Hosting | Vercel | Static frontend plus serverless functions, global CDN and per-region execution. |

### Project structure

```
front-end/
  index.html          Single page for every language
  style.css           All styling
  script.js           i18n dictionary, catalogue rendering, filters, AI search
  js/lang-selector.js Language dropdown, independent of script.js
  <locale>/           sobre, privacidade, termos per language
api/
  movies.js           Catalogue listing, filters, sorting
  movie.js            Single title detail
  genres.js           Genre list
  streaming.js        Streaming providers by country
  ai-search.js        Natural-language and identify search
  index.js            API entry point
lib/
  rate-limit.js       Shared per-IP request limiter
vercel.json           Routing and security headers
```

## Getting Started

Requires Node.js 20 or newer. Tested on Node 22; Vercel provides the runtime on deploy.

```bash
npm install
cp .env.example .env   # then fill in your keys
vercel dev
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `TMDB_API_KEY` | Yes | Catalogue data. Used by `movies`, `movie`, `genres` and `streaming`. |
| `GEMINI_API_KEY` | No | Natural-language search. Without it the rest of the site works normally. |
| `GOOGLE_SEARCH_API_KEY` | No | Optional supplementary web search for AI results. Inactive unless set. |
| `GOOGLE_SEARCH_CX` | No | Search engine ID for the above. |

Get a TMDB key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) and a Gemini key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

## Security

- **Secrets stay server-side.** All keys are read from environment variables. No key is present in the frontend bundle.
- **Rate limiting.** A shared per-IP limiter caps requests per endpoint (`lib/rate-limit.js`). Because Vercel functions are stateless and distributed, this is per-instance and approximate rather than a global limit.

### Dependency audit

`axios` is the only runtime dependency, and `npm audit` reports **0 vulnerabilities**.

There is no `@vercel/node` in `package.json`. Vercel's Node.js runtime builds `/api` functions with its own platform-provided builder, so the package was never needed here â€” it only pulled in a build-time dependency chain (`ts-morph` â†’ `fast-glob` â†’ `micromatch` â†’ `braces`) that accounted for every advisory this project had, including the critical `node-tar` one. `@vercel/speed-insights` remains a devDependency: the script served from `/_vercel/speed-insights/script.js` comes from Vercel's edge, not from `node_modules`.

`engines.node` is pinned to `20.x` so builds do not drift with Vercel's default.
- **Input validation.** Search queries are length-checked and rejected before reaching any upstream API.
- **Sanitised rendering.** API text is sanitised with DOMPurify before insertion into the DOM.
- **Content Security Policy.** `connect-src` is `'self'` only, so the browser can talk to this site's own API and nothing else. `script-src` allows only self and cdnjs. `img-src` is limited to self, TMDB images, Wikimedia and `data:`. `frame-src` and `object-src` are `none`, `base-uri` is `self`, `form-action` is `self`, and `frame-ancestors` is `none`.
- **Cross-origin requests** are restricted to the production origin.
- **Transport** is HTTPS only, with `upgrade-insecure-requests` enforced.

## Privacy

CineWorld has no accounts, no database and no advertising. It does not use Google AdSense or Google Analytics. The only data written to your device is your language choice, in `localStorage` under `cineworld_language`.

Third parties that receive data: TMDB (search terms), Gemini (your query, only when using AI search), Google Fonts (IP address and referring page), Vercel (hosting and request logs), Vercel Speed Insights (Core Web Vitals metrics and browser user agent), cdnjs (icons) and Wikimedia Commons (platform logos). Full details are in the privacy policy, available in all 8 languages.

## Credits

Catalogue data and artwork provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.





