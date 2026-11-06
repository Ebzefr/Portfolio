# "Leave your brick" guestbook

A shared guestbook at the bottom of the site. Visitors drop a brick with a short message; bricks
pile up in a Matter.js physics pit. Data lives in Firebase Firestore.

## How it fits together

| Piece | Where | What it does |
| --- | --- | --- |
| Section UI | `components/guestbook/*`, `styles/guestbook.css` | Form, pit, popovers, "all messages" dialog |
| Physics | `lib/guestbook/scene.ts`, `shapes.ts` | Compound bodies per shape; saved bricks settle instantly and the same way every load |
| Data | `lib/guestbook/client.ts` | Lazy-loads Firebase, live listener on approved bricks, server-side count |
| Submissions | `guestbook-api/api/submit-brick.js` (Vercel) | Validates, rate-limits (3 per 10 min, 10 per day per IP hash), honeypot + timing trap, de-duplicates, saves as **pending** |
| Security | `firestore.rules` | Public can only read `status == "approved"`; nobody can write from a browser |
| Starters | `data/brick-seeds.json`, `scripts/seed-bricks.mjs` | 10 bricks with fixed ids (`seed-01-amina`…), `isSeed: true`. Re-running never duplicates |
| Moderation | `scripts/moderate.mjs` | List / approve / reject pending bricks with the Admin SDK |

Before Firebase is configured (no `NEXT_PUBLIC_*` values), the site shows the 10 starter bricks
from `data/brick-seeds.json` and the form is disabled.

## Run it locally (Firebase emulator)

```bash
npm run emulators          # Firestore emulator on :8080 (project demo-ebze)
npm run seed:local         # second terminal
npm run api:local          # submit endpoint on :8787, talking to the emulator
npm run dev                # uses .env.development.local
npm run moderate:local list
```

`.env.development.local` (not committed):

```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-ebze
NEXT_PUBLIC_FIRESTORE_EMULATOR=127.0.0.1:8080
NEXT_PUBLIC_BRICK_SUBMIT_URL=http://127.0.0.1:8787/api/submit-brick
```

Validation tests: `cd guestbook-api && npm test`.

## Live setup

- Firebase project: `ebze-guestbook` (Spark/free plan, Firestore in europe-west2).
  Rules and index deploy with `firebase deploy --only firestore`.
- Public web config: `.env.production` (committed; it isn't secret).
- Submit endpoint: Vercel project `ebze-guestbook-api`, London region, deployed from `guestbook-api/`.
  It signs in to Firestore with the `guestbook-writer` service account (Firestore access only).
  First-time setup, or to rotate the key: `vercel login`, then `./guestbook-api/setup-vercel.sh`.
  Redeploy code changes with `cd guestbook-api && vercel deploy --prod`.
- Starter bricks: `npm run seed` (safe to repeat).

## Moderating

Every visitor brick starts as `pending` and only appears for everyone once approved. The person who
dropped it still sees it on their own device (stored in localStorage) with a "waiting for approval" note.

```bash
npm run moderate list            # pending bricks; ⚑ marks ones with flagged words
npm run moderate approve <id...>
npm run moderate reject <id...>
npm run moderate approve-clean   # approve every pending brick that isn't flagged
npm run moderate approved        # latest approved bricks
```

The scripts use your own Google login (`gcloud auth application-default login`, done once). The
endpoint's service-account key lives only in Vercel's encrypted environment variables, never in the repo or the site.
