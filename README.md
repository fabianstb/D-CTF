# D-CTF

D-CTF is a static, GitHub Pages friendly CTF platform prototype inspired by common CTF platform workflows: challenges, flags, hints, scoreboards, users, teams, admin controls, event settings, and analytics.

Because GitHub Pages is static hosting, this version uses browser `localStorage` as a demo data layer. It is ready to be replaced with a real API later.

## Demo Accounts

- Admin: `admin@dctf.local` / `admin`
- Competitor: `neo@dctf.local` / `player`

## Scripts

```bash
npm install
npm run dev
npm run build
npm run deploy
```

## GitHub Pages

The app is configured with Vite base path `/D-CTF/` for publishing at:

https://fabianstb.github.io/D-CTF/
