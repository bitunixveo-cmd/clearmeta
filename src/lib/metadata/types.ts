export interface C2PASignal {
  present: boolean;
  issuer?: string;
  validationState?: string;
  model?: string;
  action?: string;
  softwareAgent?: string;
  digitalSourceType?: string;
}

export interface MetadataSignal {
  group: string;
  tag: string;
  value: string;
}

export interface ScanResult {
  filename: string;
  format: string;
  fileSize: number;
  mimeType: string;
  c2pa: C2PASignal;
  aiTags: MetadataSignal[];
  hasAiMetadata: boolean;
  removableByStrip: boolean;
  warnings: string[];
}

export interface CleanResult {
  id: string;
  originalFilename: string;
  cleanedFilename: string;
  originalSize: number;
  cleanedSize: number;
  removedTags: number;
  before: ScanResult;
  after: ScanResult;
  downloadUrl: string;
}

export interface BatchCleanResult {
  jobId: string;
  processed: number;
  failed: number;
  results: CleanResult[];
  zipDownloadUrl?: string;
}

export const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",
  "image/avif",
  "image/heic",
  "image/heif",
];

export const SUPPORTED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".tif",
  ".tiff",
  ".avif",
  ".heic",
  ".heif",
];

export const AI_KEYWORDS = [
  "openai",
  "dall",
  "chatgpt",
  "gpt-image",
  "midjourney",
  "stable diffusion",
  "firefly",
  "adobe",
  "gemini",
  "google",
  "claude",
  "anthropic",
  "trainedalgorithmicmedia",
  "compositewithtrainedalgorithmicmedia",
  "c2pa",
  "synthid",
  "generative",
  "ai-generated",
  "algorithmic",
];
