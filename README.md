# ClearMeta — AI Metadata Remover

A SaaS-style web app that strips C2PA Content Credentials, JUMBF manifests, EXIF, and XMP AI tags from generated images.

## Features

- **Landing page** with features, pricing, and how-it-works sections
- **Metadata scanner** — detects C2PA, JUMBF, XMP, and EXIF AI tags
- **One-click cleaner** — removes all AI provenance metadata via ExifTool
- **Batch processing** — upload, scan, and clean multiple images
- **Before/after comparison** — see exactly what was removed
- **Privacy-first** — files auto-deleted after 1 hour

## Requirements

- Node.js 18+
- [ExifTool](https://exiftool.org/) (installed via `brew install exiftool`)

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Supported formats

JPEG, PNG, WebP, TIFF, AVIF, HEIC

## How it works

1. Upload an image
2. Scan detects C2PA/JUMBF blocks and AI-related EXIF/XMP tags
3. Clean strips metadata using ExifTool (`-all= -jumbf:all=`)
4. Download the cleaned file

## Note on invisible watermarks

This tool removes **metadata** (C2PA, EXIF, XMP). Invisible pixel watermarks like Google SynthID are embedded in the image data itself and require separate advanced processing.

## Tech stack

- Next.js 15 (App Router)
- Tailwind CSS 4
- ExifTool (metadata engine)
- Sharp (fallback re-encoding)
