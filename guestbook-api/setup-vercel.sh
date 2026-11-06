#!/usr/bin/env bash
# One-time setup for the guestbook submit endpoint on Vercel.
#   1. links this folder to the Vercel project ebze-guestbook-api (signs in first if needed)
#   2. creates a service account that can only use Firestore (roles/datastore.user)
#   3. stores a fresh key + a random rate-limit salt as Vercel environment variables,
#      then deletes any older keys of that service account
#   4. deploys guestbook-api to Vercel
# The key never touches the repo: it lives in a temp file that is deleted at the end.
# Safe to re-run (e.g. to rotate the key).
set -euo pipefail

PROJECT=ebze-guestbook
SA_NAME=guestbook-writer
SA="$SA_NAME@$PROJECT.iam.gserviceaccount.com"
VERCEL="${VERCEL:-npx --yes vercel@latest}"
cd "$(dirname "$0")"

echo "→ Vercel"
$VERCEL whoami >/dev/null 2>&1 || $VERCEL login
$VERCEL link --yes --project ebze-guestbook-api

echo "→ Service account"
gcloud services enable iam.googleapis.com --project "$PROJECT"
gcloud iam service-accounts describe "$SA" --project "$PROJECT" >/dev/null 2>&1 ||
  gcloud iam service-accounts create "$SA_NAME" --display-name "Guestbook submit endpoint (Vercel)" --project "$PROJECT"
gcloud projects add-iam-policy-binding "$PROJECT" --member "serviceAccount:$SA" --role roles/datastore.user --condition=None >/dev/null

KEY=$(mktemp)
trap 'rm -f "$KEY"' EXIT
gcloud iam service-accounts keys create "$KEY" --iam-account "$SA" --project "$PROJECT"
NEW_KEY_ID=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["private_key_id"])' "$KEY")

echo "→ Environment variables"
for var in FIREBASE_SERVICE_ACCOUNT RATE_SALT; do $VERCEL env rm "$var" production --yes >/dev/null 2>&1 || true; done
base64 < "$KEY" | tr -d '\n' | $VERCEL env add FIREBASE_SERVICE_ACCOUNT production
openssl rand -hex 24 | tr -d '\n' | $VERCEL env add RATE_SALT production

echo "→ Removing old keys"
for id in $(gcloud iam service-accounts keys list --iam-account "$SA" --managed-by=user --format="value(name.basename())"); do
  [ "$id" = "$NEW_KEY_ID" ] || gcloud iam service-accounts keys delete "$id" --iam-account "$SA" --quiet
done

echo "→ Deploy"
$VERCEL deploy --prod --yes

echo "✓ Done. The key file has been deleted; the only copy is in Vercel's encrypted env vars."
