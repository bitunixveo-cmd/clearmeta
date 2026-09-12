# Hostinger deployment guide for ClearMeta

## Prerequisites

- Hostinger Node.js hosting or VPS with Docker
- Domain pointed to Hostinger
- ExifTool installed on the server (included in Dockerfile)
- Environment variables configured

## Environment variables

Copy `.env.example` to your Hostinger environment panel:

| Variable | Required | Description |
|----------|----------|-------------|
| `EXIFTOOL_PATH` | Yes | `/usr/bin/exiftool` on Linux |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://yourdomain.com` |
| `OPENAI_API_KEY` | Pro Verify | OpenAI API key |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Pro auth | Clerk publishable key |
| `CLERK_SECRET_KEY` | Pro auth | Clerk secret key |
| `PRO_VERIFY_ACCESS_CODE` | Optional | Gate Pro Verify without billing |

## Option A: Docker on VPS (recommended)

1. Build and push the image, or clone repo on VPS:
   ```bash
   docker build -t clearmeta .
   docker run -d \
     -p 3002:3002 \
     -e NEXT_PUBLIC_SITE_URL=https://yourdomain.com \
     -e OPENAI_API_KEY=sk-... \
     -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_... \
     -e CLERK_SECRET_KEY=sk_... \
     -v clearmeta-uploads:/app/uploads \
     --name clearmeta \
     clearmeta
   ```
2. Put Nginx/Caddy in front with TLS termination.
3. Proxy to `localhost:3002`.

## Option B: Hostinger Node.js deploy

Hostinger builds from a source archive (no `node_modules` or `.next`).

1. Create archive excluding dev artifacts:
   ```bash
   zip -r clearmeta.zip . \
     -x "node_modules/*" -x ".next/*" -x "uploads/*" -x ".git/*"
   ```
2. Upload via Hostinger MCP `hosting_deployJsApplication` or hPanel.
3. Set build command: `npm run build`
4. Set start command: `npm run start`
5. Install ExifTool on the server (`apt install libimage-exiftool-perl`).
6. Set `EXIFTOOL_PATH=/usr/bin/exiftool` in environment.

## Production checklist

- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] HTTPS enabled
- [ ] Clerk production keys configured
- [ ] OpenAI API key with usage limits
- [ ] ExifTool available and `EXIFTOOL_PATH` correct
- [ ] Uploads directory writable (`uploads/`)
- [ ] Rate limits acceptable for your traffic tier
- [ ] Privacy/Terms pages reviewed for your jurisdiction

## Health check

```bash
curl https://yourdomain.com/api/health
```

## Notes

- Files auto-delete after 1 hour; no persistent storage needed for MVP
- Deep Clean is CPU-intensive — consider stricter rate limits in production
- Rotate any API keys that were exposed during development
