# Final Deployment Checklist

## Status Summary

- Core app features: ready for deployment verification.
- Realtime websocket stack: ready locally with Reverb, Echo, and presence sync.
- Navigation shell: ready.
- Production secrets and host values: still need real deployment values.

## Pass Before Deploy

- [x] Laravel app builds successfully with `npm run build`.
- [x] Relevant feature tests pass for auth, classrooms, sessions, chat, hand queue, Reverb presence, and browser flows.
- [x] Reverb runtime starts locally with the correct host and hostname binding.
- [x] Authenticated shell renders with sidebar and topbar navigation.
- [x] Public guest navigation renders correctly.
- [x] Presence channel auth works for authenticated users.
- [x] `WEBRTC_JOIN` upserts participant state and updates the live event feed.

## Deployment Tasks

- [ ] Replace placeholder `.env.example` values with real production values in the deployment environment.
- [ ] Set `APP_ENV=production` and `APP_DEBUG=false` in the deployed `.env`.
- [ ] Set a real `APP_URL` for the deployed domain.
- [ ] Set real `REVERB_APP_KEY`, `REVERB_APP_SECRET`, and `REVERB_APP_ID` values.
- [ ] Set the production Reverb host and websocket scheme for the deployed origin.
- [ ] Set `SANCTUM_STATEFUL_DOMAINS` to the real production domains.
- [ ] Set `SESSION_DOMAIN` to the correct production cookie domain.
- [ ] Confirm `SESSION_SECURE_COOKIE=true` behind HTTPS.
- [ ] Confirm `QUEUE_CONNECTION=database` or switch to Redis if the deployment uses a worker pool.
- [ ] Confirm `CACHE_STORE` matches the production cache backend.
- [ ] Run database migrations on the production database.
- [ ] Run `php artisan storage:link` if public file URLs are used.
- [ ] Clear and warm configuration and route caches after the final `.env` is in place.
- [ ] Start and supervise the Reverb service in production.
- [ ] Start and supervise queue workers in production.
- [ ] Verify the production browser can authenticate and open classrooms over HTTPS.
- [ ] Verify a live session can start, presence connects, and participant updates appear in the browser.

## Deployment Verification Steps

1. Open the public browser page and confirm classroom listing works.
2. Open the authenticated teacher page and confirm the sidebar/topbar render.
3. Start a live session and confirm the session payload includes the websocket URL.
4. Join from a learner account and confirm the teacher sees `1 participant currently present`.
5. Send a chat message and confirm the live event feed updates.
6. End the session and confirm both teacher and learner pages reflect the ended state.

## Residual Risks

- Production hostnames and TLS settings are not yet real in the repository.
- The deployment environment still needs real secrets and cookie domains.
- Queue supervision and Reverb service supervision must be configured by the host.
