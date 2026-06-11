# Cloudflare Worker Contact API

This Worker gives the static COSKY.AI site a stable form API for mobile browsers and WeChat.

## Why

The previous static-site flow submitted directly from the browser to Google Apps Script. That can work in desktop browsers, but WeChat's in-app browser is unreliable for cross-origin `no-cors`, `sendBeacon`, and `keepalive` requests. The Worker becomes the browser-facing API and forwards valid submissions to the existing Google Apps Script endpoint.

## Files

- Worker source: `integrations/cloudflare-worker/contact-worker.js`
- Wrangler example config: `integrations/cloudflare-worker/wrangler.example.toml`
- Current Apps Script relay target: `integrations/google-apps-script/contact-form.gs`

## Deploy

1. Create or log in to a Cloudflare account.
2. Install Wrangler locally if needed:

```bash
npm install -g wrangler
```

3. Copy the example config:

```bash
copy integrations\cloudflare-worker\wrangler.example.toml integrations\cloudflare-worker\wrangler.toml
```

4. From `integrations/cloudflare-worker`, set the existing Apps Script URL as a secret:

```bash
wrangler secret put CONTACT_FORM_UPSTREAM_URL
```

Paste the current `/exec` URL when prompted.

5. Deploy:

```bash
wrangler deploy
```

6. Use the Worker URL as `reservation.endpoint` in `data/site.yaml`.

For a first test, using the `workers.dev` URL is enough. After `coskyai.com` is on Cloudflare DNS, bind `api.coskyai.com/contact` and set:

```yaml
reservation:
  endpoint: "https://api.coskyai.com/contact"
```

## Expected response

Success:

```json
{"ok":true,"queued":true}
```

Validation failure:

```json
{"ok":false,"error":"message_required"}
```

Upstream failure:

```json
{"ok":false,"error":"upstream_failed"}
```

## Notes

- The Worker validates `email` and `message` before forwarding.
- The Worker returns JSON quickly after accepting a valid submission, so the frontend does not wait on Google Apps Script email delivery.
- Google Apps Script still writes the sheet row and sends the notification email.
