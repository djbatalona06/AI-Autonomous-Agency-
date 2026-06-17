import crypto from "node:crypto";
import { ENV } from "./env";

const PALETTE = ["#B666D2", "#B9A3D9", "#ECDAF2", "#2D1B3D", "#F5F1F8"];

/**
 * Generate an image from a prompt.
 *   OPENAI_API_KEY set → real image via OpenAI Images API
 *   otherwise          → deterministic, on-brand brutalist SVG (data URI),
 *                        so the studio is fully functional with zero setup.
 */
export async function generateImage(opts: { prompt: string }): Promise<{ url: string }> {
  if (ENV.openaiApiKey) {
    try {
      const res = await fetch(`${ENV.openaiBaseUrl}/images/generations`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${ENV.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: opts.prompt,
          size: "1024x1024",
          n: 1,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { data?: Array<{ url?: string; b64_json?: string }> };
        const first = data.data?.[0];
        if (first?.url) return { url: first.url };
        if (first?.b64_json) return { url: `data:image/png;base64,${first.b64_json}` };
      } else {
        console.warn("[ImageGen] OpenAI failed, using placeholder:", res.status);
      }
    } catch (error) {
      console.warn("[ImageGen] OpenAI error, using placeholder:", error);
    }
  }
  return { url: placeholderSvg(opts.prompt) };
}

/** Deterministic abstract brutalist artwork derived from the prompt. */
function placeholderSvg(prompt: string): string {
  const hash = crypto.createHash("sha256").update(prompt).digest();
  const at = (i: number) => hash[i % hash.length];
  const pick = (i: number) => PALETTE[at(i) % PALETTE.length];

  const shapes: string[] = [];
  for (let i = 0; i < 5; i++) {
    const x = (at(i * 3) / 255) * 640;
    const y = (at(i * 3 + 1) / 255) * 480;
    const s = 80 + (at(i * 3 + 2) / 255) * 260;
    const fill = pick(i + 1);
    if (at(i) % 3 === 0) {
      shapes.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(s / 2).toFixed(0)}" fill="${fill}" />`);
    } else if (at(i) % 3 === 1) {
      shapes.push(`<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${s.toFixed(0)}" height="${s.toFixed(0)}" fill="${fill}" />`);
    } else {
      const x2 = x + s;
      const y2 = y + s;
      const midX = x + s / 2;
      shapes.push(`<polygon points="${x.toFixed(0)},${y2.toFixed(0)} ${midX.toFixed(0)},${y.toFixed(0)} ${x2.toFixed(0)},${y2.toFixed(0)}" fill="${fill}" />`);
    }
  }

  const label = prompt.length > 48 ? `${prompt.slice(0, 48)}…` : prompt;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
  <rect width="640" height="640" fill="#ECDAF2"/>
  <g>${shapes.join("")}</g>
  <rect x="16" y="16" width="608" height="608" fill="none" stroke="#2D1B3D" stroke-width="6"/>
  <rect x="0" y="560" width="640" height="80" fill="#2D1B3D"/>
  <text x="24" y="610" font-family="Inter, sans-serif" font-size="22" font-weight="700" fill="#F5F1F8">${escapeXml(label)}</text>
  <text x="600" y="52" text-anchor="end" font-family="Inter, sans-serif" font-size="20" font-weight="900" fill="#2D1B3D">YAWN</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] as string,
  );
}
