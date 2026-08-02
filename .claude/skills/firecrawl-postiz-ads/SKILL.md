# firecrawl-postiz-ads

Generate a batch of hyper-realistic AI ad creatives and schedule them across 33+ social platforms via Postiz — in under 5 minutes. Uses Firecrawl to research what's trending, Higgsfield for photorealistic characters, Ideogram for text-heavy layouts, and Postiz to publish everywhere at once.

**Positioning note:** This is a *time-saver tool*, not an AI agency service. Lead with speed and output volume, never with "AI agency" framing.

---

## Trigger

Use this skill when the user wants to:
- Create a batch of ad creatives for their business
- Schedule social media posts across multiple platforms
- Research what ad templates are working in their niche
- Set up recurring automated ad creation on a schedule

---

## PHASE 0 — Schedule Decision (Always First)

Before anything else, ask:

> "Should I run this ad batch **once right now**, or set up a **recurring schedule** (daily/weekly/monthly) so new batches generate automatically?"

- **Once** → run Phases 1–7, done.
- **Scheduled** → run Phases 1–7, then Phase 8 to create the n8n automation.

---

## PHASE 1 — Postiz Setup Check

Ask: "Do you have a Postiz API key ready?"

**If yes:** Collect `POSTIZ_BASE_URL` and `POSTIZ_API_KEY`, skip to Phase 2.

**If no — walk through setup:**

### Option A: Cloud (fastest)
1. Sign up at https://postiz.com (free tier available)
2. Go to **Settings → API Keys → Create New Key**
3. Copy the key — this is your `POSTIZ_API_KEY`
4. Base URL: `https://app.postiz.com`

### Option B: Self-Hosted (Docker)
```bash
git clone https://github.com/gitroomhq/postiz-app
cd postiz-app
cp .env.example .env   # fill in your DB + storage creds
docker compose up -d
```
- Base URL: `http://localhost:5000` (or your server IP/domain)
- Get API key from Settings → API Keys after first login

### Connect Platforms in Postiz
After setup, go to **Channels** in the Postiz dashboard and connect whichever platforms you want to post to. Postiz supports 33+ channels:

| Category | Platforms |
|---|---|
| Short-form social | Instagram, TikTok, X (Twitter), Threads |
| Professional | LinkedIn (personal + pages) |
| Video | YouTube, Kick, Twitch |
| Community | Reddit, Discord, Telegram, Slack |
| Visual | Pinterest |
| Decentralized | Bluesky, Mastodon, Farcaster, Nostr |
| Blogging | WordPress, Medium |
| Other | Facebook, VK |

### Add Credential to n8n (for recurring schedule)
If Phase 0 selected "Scheduled":
1. In n8n, go to **Credentials → New Credential → HTTP Header Auth**
2. Name: `Postiz API Key`
3. Header Name: `Authorization`, Header Value: `Bearer {your_api_key}`
4. Save

---

## PHASE 2 — Business Brief

Collect the following (prompt conversationally, don't dump a form):

| Field | Prompt | Default |
|---|---|---|
| Brand name | "What's your business called?" | — |
| Niche | "What industry or product type?" | — |
| Target audience | "Who are you selling to?" | "general consumer" |
| Tone | "Vibe: professional, playful, bold, or minimalist?" | bold |
| Platforms | "Which platforms should I post to?" | Instagram, TikTok, LinkedIn |
| Batch size | "How many images per template?" | 5 |
| Template count | "How many ad formats do you want?" | 3 |
| Brand colors | "Any specific hex colors or color palette?" | none |
| Character description | "Describe the person in the ads (or skip for generic)" | professional adult |

---

## PHASE 3 — Firecrawl Trend Research

Run 3 parallel Firecrawl searches to surface what's working in the user's niche right now.

**Tool:** Firecrawl JS SDK — `POST https://api.firecrawl.dev/v1/search`

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
const client = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const [redditResults, performanceResults, platformResults] = await Promise.all([
  client.search(`"${niche}" ad creative templates site:reddit.com`, { limit: 5 }),
  client.search(`"${niche}" best performing social media ads 2025 2026`, { limit: 5 }),
  client.search(`hyper realistic AI character ads "${primaryPlatform}" examples`, { limit: 5 }),
]);
```

**Extract and surface to user:**
- Top 3 template formats being discussed
- Visual hooks that Reddit/marketers call out as high-CTR
- Any niche-specific formats (e.g., "before/after" for fitness, "demo video" for SaaS)

Combine these with the curated templates below. Let the user know what Reddit is saying works in their niche before they pick templates.

---

## PHASE 4 — Template Selection

Present this menu. User picks 1–N templates.

### Character-Focused → Generated with Higgsfield

**1. Persona Hero Shot**
- Format: Single frame, character interacting with product or service
- Visual: Clean gradient background, subject in center frame, confident pose
- Best for: Instagram feed, LinkedIn, Pinterest
- Higgsfield prompt pattern: `"[character description] holding/using [product], studio lighting, clean [color] gradient background, commercial photography style, ultra-realistic, 8K"`

**2. Before/After Transformation**
- Format: Split-frame diptych (left = before, right = after)
- Visual: Same character, contrasting environments/expressions
- Best for: Facebook, Instagram carousel
- Higgsfield prompt pattern: `"Split composition, left side: [person looking frustrated/tired/problem state], right side: same person [confident/happy/solution state], [brand color] divider, before/after label, ultra-realistic"`

**3. UGC Authentic Look**
- Format: Looks like a real person filmed on their phone
- Visual: Slight grain, handheld feel, natural indoor/outdoor lighting
- Best for: TikTok, Instagram Reels, Facebook
- Higgsfield prompt pattern: `"[character] casually talking to camera, natural lighting, slightly blurred background, smartphone camera aesthetic, authentic feel, not polished"`

**4. Lifestyle Immersion**
- Format: Character in aspirational environment
- Visual: Environment tells the story (home office, gym, café, travel)
- Best for: Instagram, Pinterest, LinkedIn
- Higgsfield prompt pattern: `"[character] in [aspirational setting], natural ambient light, candid moment, lifestyle photography, [emotion], ultra-realistic, cinematic composition"`

### Text/Product-Focused → Generated with Ideogram

**5. Bold Headline Announcement**
- Format: Oversized display type + product visual
- Visual: High contrast, 1-2 colors, minimal elements
- Best for: Instagram Stories, Pinterest, YouTube thumbnail
- Ideogram prompt pattern: `"Bold typography ad: '[headline]', [brand color] background, white text, product image bottom right, minimal design, commercial poster style"`

**6. Testimonial Card**
- Format: Pull quote + realistic portrait avatar + brand logo
- Visual: Clean card layout, trustworthy colors
- Best for: LinkedIn, Facebook, Instagram feed
- Ideogram prompt pattern: `"Social proof card design: quote text '[testimonial]', circular avatar photo, star rating, [brand name] logo, clean white card, [accent color] highlight"`

**7. Comparison Grid**
- Format: Two-column table — "You without us" vs "You with us"
- Visual: Red X vs green checkmarks, stark contrast
- Best for: X (Twitter), LinkedIn, Facebook
- Ideogram prompt pattern: `"Comparison ad infographic: left column '[problem state items]' with red X, right column '[solution state items]' with green checkmarks, [brand color] header, clean sans-serif font"`

**8. Urgency/Scarcity Frame**
- Format: Limited-time offer callout, countdown aesthetic
- Visual: Warm colors (orange/red), badge elements, CTA button
- Best for: Facebook, Instagram Stories, email header
- Ideogram prompt pattern: `"Urgency sale ad: '[offer]', countdown timer graphic, FOMO-inducing design, orange and red gradient, bold CTA button '[action]', professional ad design"`

### Mixed → Higgsfield character + Ideogram text overlay

**9. Problem → Solution Arc (3-panel carousel)**
- Panel 1: Character frustrated with the problem (Higgsfield)
- Panel 2: Agitate — show the cost of inaction (Ideogram text card)
- Panel 3: Character relieved/happy using the solution (Higgsfield)
- Best for: Instagram carousel, LinkedIn document post

**10. Tutorial How-To**
- Format: Numbered steps, character demonstrating each
- Visual: Clean numbered badges, consistent character across frames
- Best for: Instagram carousel, Pinterest, LinkedIn
- Generate each step frame in Higgsfield with same character seed, add step numbers via Ideogram

*Also show any Reddit-sourced templates found in Phase 3.*

---

## PHASE 5 — Image Generation

For each selected template × batch size, generate in parallel where possible.

### Higgsfield (character-focused templates: 1, 2, 3, 4, panels in 9 & 10)

```
Tool: mcp__Higgsfield__generate_image

Before first generation, call:
  mcp__Higgsfield__models_explore({ action: 'recommend', goal: 'hyper-realistic human character for commercial ads' })

Then generate:
  mcp__Higgsfield__generate_image({
    prompt: "[assembled prompt from template pattern + user's character/brand details]",
    aspect_ratio: "[platform-appropriate: 1:1 for feed, 9:16 for Stories/Reels, 16:9 for YouTube]"
  })
```

Platform aspect ratios:
| Platform | Ratio | Notes |
|---|---|---|
| Instagram feed | 1:1 or 4:5 | Square or portrait |
| Instagram/TikTok Stories | 9:16 | Vertical |
| LinkedIn | 1.91:1 | Landscape |
| Pinterest | 2:3 | Vertical |
| X (Twitter) | 16:9 | Landscape |
| YouTube thumbnail | 16:9 | 1280×720px |

### Ideogram (text/product-focused templates: 5, 6, 7, 8, text panels in 9 & 10)

```
Tool: mcp__Ideogram__generate_image({
  prompt: "[assembled prompt from template pattern + headline/CTA/brand info]",
  aspect_ratio: "[ASPECT_10_16 / ASPECT_1_1 / ASPECT_16_10 — match platform]",
  model: "V_2_TURBO",    // fast, high quality for ad design
  style_type: "DESIGN"   // optimized for graphic design / typography
})
```

### Mixed templates (9 & 10)
1. Generate character frames via Higgsfield first → collect URLs
2. Import the Higgsfield image URL into Ideogram via `mcp__Ideogram__remix_image` or `mcp__Ideogram__edit_image` to add text overlay/step numbers

**Save all output image URLs** in a structured list:
```json
[
  { "template": "Persona Hero Shot", "platform": "Instagram", "url": "...", "aspect": "4:5" },
  ...
]
```

---

## PHASE 6 — Caption Writing

For each generated image, write platform-optimized copy using Claude directly:

**For each image, produce:**
1. **Caption** — platform-length-appropriate (Instagram: 150 chars hook + body; LinkedIn: 3-line opener; TikTok: punchy 1-liner + hashtags; X: under 280 chars)
2. **Hashtags** — 3–5 niche-relevant (avoid oversaturated generic ones)
3. **CTA** — one clear action ("Link in bio", "DM me 'READY'", "Comment YES", "Save this for later")
4. **Best posting time** — peak engagement windows:

| Platform | Best Times (EST) |
|---|---|
| Instagram | Tue–Fri 9–11am, 7–9pm |
| TikTok | Tue–Thu 7–9am, 7–11pm |
| LinkedIn | Tue–Thu 8–10am, 12pm |
| X (Twitter) | Mon–Wed 8–10am, 12–1pm |
| Facebook | Wed 11am–1pm, Thu–Fri 1–4pm |
| Pinterest | Sat–Sun 8–11pm |

Assemble caption + CTA into a `content` string per image per platform.

---

## PHASE 7 — Postiz Publishing

For each image+caption pair, POST to the Postiz API:

```bash
POST {POSTIZ_BASE_URL}/api/posts
Authorization: Bearer {POSTIZ_API_KEY}
Content-Type: application/json

{
  "content": "{caption}\n\n{hashtags}\n\n{CTA}",
  "image": "{image_url}",
  "platforms": ["{postiz_channel_id}"],
  "schedule": "{ISO_8601_datetime_or_null}"
}
```

**Scheduling strategy for batches:**
- Space posts 30–60 minutes apart across the day
- For multi-platform: post same image to all platforms at the same scheduled time
- For multi-template batches: spread across 3–7 days

**Get channel IDs first:**
```bash
GET {POSTIZ_BASE_URL}/api/integrations
Authorization: Bearer {POSTIZ_API_KEY}
```
Returns a list of connected channels with their IDs. Match to user's chosen platforms.

**After posting:** Return a summary table:
```
✅ Posted batch summary:
  Template          | Platform    | Scheduled At
  Persona Hero Shot | Instagram   | Jun 27 9:00am
  Bold Headline     | LinkedIn    | Jun 27 10:00am
  UGC Authentic     | TikTok      | Jun 27 7:00pm
  ...
```

---

## PHASE 8 — n8n Recurring Workflow (Scheduled Mode Only)

If user chose "Scheduled" in Phase 0, create an n8n automation that re-runs the ad generation pipeline on their chosen cadence.

**Ask:** "How often? Daily / Weekly (pick day) / Monthly (pick date)"

**Create via n8n MCP** (`mcp__e7cd2217-c19d-4195-9732-c632944140e5__create_workflow_from_code`):

The workflow has this shape:
1. **Schedule Trigger** (`n8n-nodes-base.scheduleTrigger`) — fires on chosen cadence
2. **Firecrawl Search** (`n8n-nodes-base.httpRequest`) — fresh trend research via `POST https://api.firecrawl.dev/v1/search`
3. **Anthropic Caption Writer** (`@n8n/n8n-nodes-langchain`) — write captions using stored brief
4. **Postiz Publisher** (`n8n-nodes-base.httpRequest`) — POST to `{POSTIZ_BASE_URL}/api/posts`

Store the user's business brief (brand name, niche, platforms, tone, character description) as static data in the workflow's Code node so each run uses the same brand context.

**Activate the workflow** and return the n8n workflow URL to the user.

**Note:** Image generation via Higgsfield/Ideogram MCP tools cannot be automated in n8n directly (they're session-scoped MCP tools). For fully automated recurring image batches, the skill can:
- Re-use top-performing images from previous batches (pull from Postiz analytics)
- OR trigger a new manual Claude Code session for image generation on schedule via a webhook

---

## Quick Reference: What Each Tool Does

| Tool | Purpose | When to Use |
|---|---|---|
| Firecrawl `/v1/search` | Scrape web/Reddit for trending ad formats | Phase 3 |
| `mcp__Higgsfield__generate_image` | Photorealistic human characters | Templates 1–4, panels in 9–10 |
| `mcp__Higgsfield__models_explore` | Pick best Higgsfield model for realistic humans | Before first Higgsfield call |
| `mcp__Ideogram__generate_image` | Text-in-image, graphic design layouts | Templates 5–8, text panels in 9–10 |
| `mcp__Ideogram__edit_image` | Add text overlay to a Higgsfield image | Mixed templates |
| Postiz REST API | Publish & schedule to 33+ platforms | Phase 7 |
| n8n Schedule Trigger | Automate recurring batches | Phase 8 (scheduled mode) |
| n8n HTTP Request | Call Firecrawl & Postiz in automated workflows | Phase 8 |

---

## Verified n8n Credential IDs

| Service | n8n Credential ID |
|---|---|
| Anthropic | `2EZHnqYEv2hwUK0C` |
| OpenAI | `VLJ9zxdu5gqjMdIM` |
| Google Sheets | `4pfP7mfC965Ot1F8` |
| Google Drive | `Fk7vnCHLmzpKfRWN` |
| Gmail | `PqoX2MDzjXlqDZVN` |

Postiz credential must be added by user (HTTP Header Auth, name: `Postiz API Key`).

---

## Reddit Insights: Top-Performing Ad Formats by Niche

Based on research from r/marketing, r/PPC, r/socialmedia, r/entrepreneur, r/Entrepreneur:

| Template | Why it works | Niche sweet spot |
|---|---|---|
| UGC Authentic | Highest CTR — "doesn't look like an ad" | DTC, beauty, supplements, apps |
| Before/After | Proof without explanation | Fitness, skincare, home improvement, finance |
| Testimonial Card | Trust signal with real-feeling avatar | B2B SaaS, coaching, professional services |
| Bold Headline | Scroll-stop, works without sound | E-commerce, events, product launches |
| Problem/Solution Arc | Keeps carousel swipes going | Any subscription or solution product |
| Comparison Grid | Drives consideration in competitive niches | SaaS, fintech, agencies |
| Lifestyle Immersion | Sells the identity, not the product | Fashion, wellness, travel, premium brands |
| Tutorial How-To | Adds value, builds trust, sells softly | SaaS, tools, education, food |

**Reddit-sourced hooks that consistently get mentioned:**
- "Stop doing X" — pattern interrupt
- "I replaced my entire [process] with this" — before/after framing
- "POV: you finally figured out [pain point]" — UGC narrative
- "[Number] [niche] people swear by this" — social proof
- "This took me from [X] to [Y] in [timeframe]" — transformation

---

## Marketing Positioning Reminder

When writing captions or briefing images, always frame around **time savings and simplicity**, not AI capabilities:

| Instead of... | Say... |
|---|---|
| "AI-generated content" | "Ready-to-post ads in minutes" |
| "Automated AI pipeline" | "Your social media on autopilot" |
| "AI agency services" | "Done-for-you ad batches" |
| "Machine learning models" | "Scroll-stopping visuals" |

The value prop is: **A week's worth of content in 5 minutes, across every platform you use.**
