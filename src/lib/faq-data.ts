export const FAQ_ITEMS = [
  {
    question: "What metadata does ClearMeta remove?",
    answer:
      "ClearMeta removes C2PA Content Credentials, JUMBF blocks, EXIF camera data, XMP tags, and other embedded metadata commonly added by ChatGPT, DALL·E, Midjourney, Adobe Firefly, Stable Diffusion, and similar AI image tools. The free tool strips manifest signatures, software agent fields, issuer information, and trainedAlgorithmicMedia markers from your file. Metadata removal does not alter visible pixels unless you use the separate Deep Clean beta pipeline.",
  },
  {
    question: "Can ClearMeta remove SynthID?",
    answer:
      "Standard metadata stripping does not remove SynthID because SynthID is an invisible pixel-level watermark, not a metadata tag. ClearMeta Pro Verify detects SynthID and C2PA using OpenAI's Content Provenance API. The experimental Deep Clean beta may disrupt some SynthID signals through re-encoding and noise injection, but results are not guaranteed and quality may decrease.",
  },
  {
    question: "Is my image stored permanently?",
    answer:
      "No. Uploaded files are processed on the server and deleted automatically after one hour. If you create a shareable before/after report, that report link expires after seven days. ClearMeta does not sell your images or use them for model training.",
  },
  {
    question: "Do I need an account?",
    answer:
      "The free metadata remover at /app requires no account. Pro Verify and Deep Clean require sign-in when Clerk authentication is enabled on your deployment. You can scan, clean, and download images anonymously on the free tier.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "ClearMeta supports JPEG, PNG, WebP, TIFF, AVIF, and HEIC files up to 50MB per file on the free tool. Deep Clean accepts files up to 25MB. Batch upload and ZIP download are available on the free metadata remover.",
  },
  {
    question: "Can I process multiple images?",
    answer:
      "Yes. Upload multiple files on the app page, review before/after metadata for each image, download cleaned files individually, or download everything as a single ZIP archive.",
  },
  {
    question: "What is a shareable report?",
    answer:
      "After cleaning or verifying an image, you can generate a public link that shows a before/after metadata comparison. Shareable reports help document what was removed or detected. Reports expire automatically after seven days.",
  },
  {
    question: "Is metadata removal legal?",
    answer:
      "Laws and platform policies vary by jurisdiction and use case. You are responsible for complying with AI disclosure requirements, advertising rules, and content authenticity regulations in your region. ClearMeta provides tooling; it does not provide legal advice.",
  },
] as const;
