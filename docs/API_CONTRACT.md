# D-CTF Backend/API Contract

GitHub Pages only serves static files, so the current app uses `localStorage` as a demo data store. A production deployment needs a separate backend API plus a database and object storage.

## Recommended Stack

- Frontend: current React/Vite app on GitHub Pages, Vercel, Netlify, or Cloudflare Pages.
- API: Node.js/NestJS, ASP.NET Core, Django, or FastAPI.
- Database: PostgreSQL.
- Cache/queue: Redis for score recalculation, rate limits, and challenge service health checks.
- File storage: S3-compatible bucket for challenge attachments.
- Auth: JWT access token plus refresh token cookie, or server sessions.

## Frontend Integration

Replace direct `localStorage` reads/writes with an API adapter:

```js
const API_URL = import.meta.env.VITE_API_URL;

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error(await response.text());
  return response.status === 204 ? null : response.json();
}
```

Then move these UI actions to API calls:

- `login()` -> `POST /auth/login`
- `loadState()` -> parallel calls to `/event`, `/challenges`, `/scoreboard`, `/me`
- `submitFlag()` -> `POST /challenges/:id/submissions`
- admin saves -> `POST/PATCH/DELETE` endpoints below

## Core Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /me`
- `PATCH /me`

### Event

- `GET /event`
- `PATCH /admin/event`
- `GET /pages`
- `POST /admin/pages`
- `PATCH /admin/pages/:id`
- `DELETE /admin/pages/:id`
- `GET /announcements`
- `POST /admin/announcements`
- `DELETE /admin/announcements/:id`

### Challenges

- `GET /challenges`
- `GET /challenges/:id`
- `POST /admin/challenges`
- `PATCH /admin/challenges/:id`
- `DELETE /admin/challenges/:id`
- `POST /admin/challenges/:id/files`
- `DELETE /admin/challenges/:id/files/:fileId`
- `POST /challenges/:id/submissions`
- `GET /admin/submissions`

### Users And Teams

- `GET /scoreboard`
- `GET /teams`
- `POST /admin/teams`
- `PATCH /admin/teams/:id`
- `DELETE /admin/teams/:id`
- `GET /admin/users`
- `POST /admin/users`
- `PATCH /admin/users/:id`
- `DELETE /admin/users/:id`

## Minimal Schema

```sql
users(id, email, password_hash, role, name, country, affiliation, bio, verified, banned, created_at)
teams(id, name, country, affiliation, website, hidden, banned, created_at)
team_members(team_id, user_id, role)
challenges(id, name, category, type, value, min_value, decay, max_attempts, visible, locked, connection, description)
challenge_tags(challenge_id, tag)
challenge_files(id, challenge_id, name, url, size)
flags(id, challenge_id, type, secret_hash_or_pattern)
hints(id, challenge_id, cost, body)
submissions(id, user_id, team_id, challenge_id, submitted_value_hash, correct, points, created_at)
announcements(id, title, body, created_at)
pages(id, slug, title, body, updated_at)
```

## Security Requirements

- Never send raw flags to the frontend.
- Store static flags as salted hashes when possible.
- Validate regex flags server-side with strict timeouts.
- Rate-limit submissions by user, team, IP, and challenge.
- Keep admin endpoints behind role-based authorization.
- Scan and store uploaded files outside the app repository.
- Log admin changes with actor, timestamp, target, and diff.

## Deployment Options

1. Keep GitHub Pages for frontend and host API on Render/Fly.io/Railway/Azure.
2. Move frontend and API to Vercel/Netlify with serverless functions.
3. Use Docker Compose for a single VPS deployment: Nginx + API + PostgreSQL + Redis + object storage.

For this project, the quickest production path is: keep the current GitHub Page, add `VITE_API_URL=https://api.your-domain.com`, and deploy the API separately.
