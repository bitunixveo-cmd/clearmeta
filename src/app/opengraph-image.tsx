import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ClearMeta — Remove AI Image Metadata";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#0c0a09",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#a8a29e",
            marginBottom: 16,
          }}
        >
          ClearMeta
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#fafaf9",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Remove AI image metadata in seconds
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "#d6d3d1",
            maxWidth: 800,
          }}
        >
          C2PA · EXIF · XMP · SynthID detection
        </div>
      </div>
    ),
    { ...size }
  );
}
