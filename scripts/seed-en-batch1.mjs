/**
 * seed-en-batch1.mjs — articles 0–9
 * Upserts English translations into Supabase (slug + locale='en')
 */
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://tixgzezefjjsyuzgdhcd.supabase.co',
  (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
)

const articles = [
  // ── 0 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'monitor-panel-guide-ips-va-oled',
    locale: 'en',
    title: 'Monitor Panel Guide: IPS, VA, or OLED — Which Should You Choose?',
    summary:
      'Most people buy monitors based on size and price alone, then end up with color shifts, motion blur, or muddy blacks. The root cause is almost always the same: wrong panel type.',
    tags: ['tech-electronics', 'computers-peripherals', 'monitors', 'display-panels'],
    published_at: '2026-01-01',
    draft: false,
    authors: ['default'],
    layout: 'PostLayout',
    content: `# Monitor Panel Guide: IPS, VA, or OLED — Which Should You Choose?

Most people buy monitors based on size and price alone, then end up with color shifts, motion blur during gaming, or muddy blacks. The root cause is almost always the same: **wrong panel type**.

---

## What Is a Panel and Why Does It Matter?

Every monitor has a core component called the LCD panel. It determines four things: color accuracy, contrast ratio, response speed, and viewing angles. Two monitors with identical specs but different panels can feel like completely different product tiers.

Today's mainstream panels fall into four types: **TN, IPS, VA, and OLED**. TN is essentially obsolete for everyday use (only relevant for extreme competitive gaming), so most buyers need to choose among IPS, VA, and OLED.

---

## IPS: The Safe All-Rounder

**How it works**: Liquid crystals are arranged horizontally and rotate in-plane when voltage is applied, controlling light transmission.

**Core strengths**:
- Near-180° viewing angles — colors stay accurate when viewed from the side
- Accurate color reproduction; factory color deviation (ΔE) is typically below 2
- 1–4ms GTG response time — no ghosting in most games

**Real drawbacks**:
- "IPS glow" is endemic — corners show slight light bleed, most visible in dark scenes
- Static contrast is typically only 800:1–1,200:1; blacks aren't truly black
- Mid-to-high price — more expensive than VA at the same size

**Best for**: Designers, photo/video editors, general users who want a daily driver that also handles gaming.

> Upgraded variants include Nano-IPS and Fast-IPS. Nano-IPS offers wider color gamut (98%+ DCI-P3) for color-critical work; Fast-IPS pushes response time below 1ms for competitive play.

---

## VA: Best-in-Class Blacks — With Trade-offs

**How it works**: Liquid crystals are arranged vertically; they need more deflection to pass light, giving them naturally strong light-blocking ability.

**Core strengths**:
- Static contrast of 3,000:1–6,000:1 — 3–5× higher than IPS
- Deep, pure blacks with rich shadow detail in dark scenes
- Most curved monitors use VA panels, enhancing immersion

**Real drawbacks**:
- Slow response time causes obvious ghosting in fast-paced FPS games (CS2, Valorant)
- Slightly narrower effective viewing angle — off-axis colors shift mildly
- "VA black crush": shadow detail can disappear in dark scenes

**Best for**: Binge-watchers, single-player RPG/open-world gamers, home theater enthusiasts.

> "Movie lover who games occasionally" → VA is fine. Daily FPS competitive player → VA will frustrate you.

---

## OLED: Physically Superior — But Two Hard Limits

**How it works**: Every pixel emits its own light. To display black, pixels simply turn off — so black is truly black.

**Core strengths**:
- Theoretically infinite contrast (pixel-level light control)
- Sub-0.1ms response time — essentially zero motion blur
- Extremely vivid colors with stunning HDR performance

**Two hard limits you must know**:

1. **Burn-in risk**: Prolonged display of static images (taskbars, game HUDs) degrades organic materials and leaves permanent ghost images. Normal usage patterns carry low risk, but avoid leaving static content on screen for hours.

2. **PWM dimming at low brightness**: Many OLED monitors use high-frequency PWM dimming at lower brightness settings, which can cause eye fatigue over time. Sensitive users should check the dimming frequency — look for 2,160Hz+ high-frequency PWM or DC dimming support.

**Best for**: Well-budgeted users who prioritize peak visual quality and are mindful of screen care.

---

## Core Parameter Comparison

| Parameter | TN | IPS | VA | OLED |
|---|---|---|---|---|
| Static contrast | 800:1 | 1,000:1 | 3,000–6,000:1 | Infinite (pixel-level) |
| Viewing angles | 170°/160° | 178°/178° | 178°/178° | 180° |
| GTG response | 0.5–1ms | 1–4ms | 3–10ms | <0.1ms |
| sRGB coverage | 90–100% | 99–100% | 95–100% | 100%+ |
| Burn-in risk | None | None | None | Yes |
| IPS glow | None | Mild | None | None |
| Relative price | Low | Mid | Low–mid | High |

---

## How to Choose: Three Scenarios

**Scenario A: Design, photo editing, video editing**
→ IPS or Nano-IPS; prioritize color gamut (DCI-P3 ≥ 95%) and factory color accuracy (ΔE < 2)

**Scenario B: Streaming and single-player games, occasional online gaming**
→ VA; focus on contrast ratio (higher is better) and color gamut

**Scenario C: Competitive gaming (FPS/MOBA), want maximum smoothness**
→ Budget-limited: Fast-IPS; larger budget: OLED (check dimming method); avoid VA

---

## Three Things to Check Before Buying

1. **Actual panel batch**: The same monitor SKU may ship with different panels (sometimes even mixing IPS and VA). Search the model + "panel lottery" before ordering.
2. **GTG vs. MPRT**: When a spec sheet says "1ms response," check which standard. GTG measures actual pixel transition delay; MPRT is a visual motion blur metric — they're not comparable.
3. **Dimming method**: Eye-strain-sensitive users must check. DC dimming > high-frequency PWM (≥ 2,160Hz) > low-frequency PWM.

---

*Data sourced from independent testing labs. No brand affiliation implied.*`,
  },

  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'laptop-performance-tdp-guide',
    locale: 'en',
    title: "Why Checking CPU Model Isn't Enough When Buying a Laptop",
    summary:
      'Two laptops with the same i7 or R7 label can deliver wildly different real-world performance. The same CPU can perform 50% worse in one laptop versus another — here is why.',
    tags: ['tech-electronics', 'computers-peripherals', 'laptops', 'performance'],
    published_at: '2026-01-02',
    draft: false,
    authors: ['default'],
    layout: 'PostLayout',
    content: `# Why Checking CPU Model Isn't Enough When Buying a Laptop

Two laptops both labeled i7 or R7 can benchmark wildly differently. The same CPU can deliver 50% less performance in one laptop than another. This isn't a scam — it's because most buyers misunderstand the core logic of laptop performance: **the same CPU in different laptops can perform 50% apart**.

---

## Why? TDP and Power Limits

How much a CPU can compute per second depends on how fast it can run. Higher frequency = more heat. Laptop chassis are compact with limited cooling capacity, so manufacturers set a "power wall" — the CPU throttles down if it exceeds this value to prevent overheating.

That power wall is the true ceiling of your laptop's real-world performance.

**The same CPU with different power limits performs very differently:**

On Intel platforms:
- **PL1 (sustained power limit)**: The CPU's ceiling during extended sustained workloads — typically equals the rated TDP
- **PL2 (boost power limit)**: The peak power allowed during burst loads — typically far higher than PL1, sustained for tens of seconds

Thin-and-light laptops typically set PL1 at 15W–28W; gaming laptops may allow 45W–100W+. Even with the same CPU model, if PL1 differs by 2×, sustained performance differs by nearly 2×.

---

## Thermal Module: Power Limits Mean Nothing Without Cooling

The power wall is the first bottleneck; cooling is the second. If a machine allows 45W but the thermal system can only handle 30W, the excess heat has nowhere to go and the CPU throttles automatically (called "thermal throttling").

**Key dimensions of cooling capability:**

| Thermal element | Significance |
|---|---|
| Number and diameter of heat pipes | More and thicker pipes = better heat conductance |
| Heatsink fin area | Larger fin area = better heat exchange at equal airflow |
| Fan size | Larger diameter = lower RPM = quieter; higher RPM at same diameter = more airflow |
| Vent placement | Bottom intake + side/rear exhaust is optimal; bottom exhaust causes airflow short-circuit |

**Real-world differences you'll notice:**
- CPU temperature stuck near 95°C during stress tests → cooling is insufficient; CPU throttles continuously
- Performance drops significantly after 10 minutes of full load → classic thermal bottleneck
- Thin-and-light runs noticeably faster when plugged in → power policy switch (AC mode allows higher PL2)

---

## Screen Brightness (nits): The Outdoor Usability Threshold

Laptop screen brightness is measured in nits and directly determines readability in bright environments.

**Practical tiers:**
- **< 300 nits**: Usable indoors; severe glare near windows
- **300–400 nits**: Mainstream thin-and-light level; fine indoors, not recommended outdoors
- **400–600 nits**: Comfortable; usable in cafes, indirect sunlight
- **> 600 nits**: High-end; manageable even under direct outdoor sunlight
- **HDR Peak 1000 nits+**: Peak brightness for HDR content windows — different concept from everyday brightness

⚠️ Distinguish "peak brightness" from "full-screen brightness": "1000 nits" often refers to a small HDR highlight window; sustained full-screen brightness may be only 400 nits. Look for "full-screen brightness" or "SDR brightness" in specs.

---

## Three Practical Buying Tips

### 1. Look for power limit numbers, not just CPU model
Search your target laptop model + "stress test" or "sustained performance" on review sites. Find how many watts the CPU stabilizes at under extended full load — that is the real sustained performance figure.

### 2. Don't expect gaming performance from thin-and-light laptops
A thin-and-light with 15W power release — even with a top-tier CPU — delivers roughly the same performance as a mid-range CPU at 45W. Match the machine to your use case rather than chasing the highest spec tier.

### 3. Weight vs. performance trade-off

| Category | Typical weight | CPU power limit | Best for |
|---|---|---|---|
| Ultralight | ≤ 1kg | 15W–25W | Documents, video calls, mobile work |
| Light productivity | 1.2–1.6kg | 28W–45W | Office work + light creative + occasional gaming |
| All-rounder | 1.8–2.2kg | 45W–65W | Video editing, 3D modeling, moderate gaming |
| Gaming laptop | 2.5kg+ | 65W–100W+ | High-quality gaming, heavy creative work |

---

## The Biggest Traps

**"The same RTX 4060 is the same RTX 4060"** — It's not. Laptop GPUs are also power-constrained. The same RTX 4060 at 90W vs 115W can differ by 20–30% in performance. When buying a gaming laptop, check the GPU's wattage (usually listed in product specs or reviews).

**"Flagship CPU = best performance"** — Under the same thermal and power budget, a CPU one tier higher often delivers marginally better performance than the tier below. The price difference may be better spent on improved cooling design or more RAM.

---

*Parameter ranges sourced from mainstream laptop review data. Specific products may vary.*`,
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'mechanical-keyboard-switch-guide',
    locale: 'en',
    title: 'Mechanical Keyboard Switches: Which One Should You Pick?',
    summary:
      'Buying a mechanical keyboard and not knowing which switch to choose — or picking one that feels wrong — is extremely common. The problem isn\'t whether a switch is "good." It\'s whether it matches your use case.',
    tags: ['tech-electronics', 'computers-peripherals', 'mechanical-keyboards'],
    published_at: '2026-01-03',
    draft: false,
    authors: ['default'],
    layout: 'PostLayout',
    content: `# Mechanical Keyboard Switches: Which One Should You Pick?

Buying a mechanical keyboard and not knowing which switch to choose — or picking one that feels terrible — is extremely common. The issue isn't whether a switch is "good." It's whether it **matches your use case**. This article breaks down the core logic so you can decide without memorizing specs.

---

## Switch Categories: Two Dimensions

Mechanical keyboard switches differ on two core dimensions: **whether they have a tactile bump** and **whether they make a click sound**.

These two dimensions produce the three main switch families:

| Type | Tactile bump | Sound | Typical switches |
|---|---|---|---|
| Linear | None | Quiet (only bottom-out sound) | Red, Yellow, Silver |
| Tactile (silent) | Yes | Quiet | Brown, Creamy/Milky |
| Tactile (clicky) | Yes | Loud click | Blue |

---

## Linear Switches: Smooth All the Way Down

**Feel**: Resistance increases smoothly and evenly from press to bottom-out — no "click" point, like pressing a spring.

**Why gamers love them**:
- Short actuation travel (Silver switches actuate at just 1.2mm), faster response
- No tactile bump disrupts repeated keypresses — helps improve APM (actions per minute)
- Quiet bottom-out sound, won't register on microphones

**Key parameter differences:**

| Switch | Actuation force | Actuation point | Total travel | Character |
|---|---|---|---|---|
| Red | ~45g | 2.0mm | 4.0mm | Most popular; balanced light feel |
| Black | ~60g | 2.0mm | 4.0mm | Heavier; reduces accidental keypresses |
| Silver | ~45g | 1.2mm | 3.4mm | Fastest actuation; maximum response speed |
| Yellow | ~35g | 2.0mm | 4.0mm | Lightest; less finger fatigue for long sessions |

**Right for you if**: FPS/RTS gaming, rapid repeated input, office users who need quiet keyboards.

---

## Tactile Switches: Typing With Rhythm

Tactile switches have a distinct resistance bump somewhere in the travel — you feel resistance, then push past it, producing a "thock" sensation or click sound.

**Why typists prefer them**:
- The tactile point gives clear "actuated" feedback without bottoming out every keystroke
- The rhythm helps prevent missed keypresses during long typing sessions
- No need to bottom out after actuation — reduces finger fatigue

**Brown vs. Blue:**

| Comparison | Brown (silent tactile) | Blue (clicky tactile) |
|---|---|---|
| Bump strength | Subtle — tactile, not audible | Strong — loud, crisp click |
| Noise level | Low — office-friendly | High — clearly audible to neighbors |
| Keypress feedback | Gentle | Very pronounced |
| Best for | Office, quiet environment typing | Personal space; enjoy the sound |

---

## Keycap Material: PBT vs. ABS

Beyond the switch, keycap material significantly affects the typing experience.

**ABS keycaps (Acrylonitrile Butadiene Styrene)**:
- High molding precision, sharp legends
- Smooth texture
- After 6–12 months, frequently-pressed keys develop a "shine" — surface wears to a greasy-looking gloss
- Lower cost; default on most entry-level boards

**PBT keycaps (Polybutylene Terephthalate)**:
- Harder material, crisper typing sound
- Slightly textured surface — resists shine
- More durable; appearance stays consistent over years
- Higher cost; standard on mid- to high-end boards

**How to tell them apart**: Rub the keycap side with a finger — PBT feels slightly rough; ABS is smoother. PBT also transmits less light through the legends.

---

## Gasket Mount: Why Typing Sound Is Better

Traditional keyboards have the switch plate screwed directly to the case. Vibrations from keystrokes transfer straight into the case, producing a hollow or clacky sound.

Gasket mount adds elastic material (usually silicone or polycarbonate) between the plate and the case, allowing slight flex when typing. The result:

- Typing sound becomes "thocky" and springy — enthusiasts call this the "jello" sound
- Softer feel, less impact force on fingers during extended typing sessions
- More tunable — foam dampeners and case filling mods have more effect

Gasket mount doesn't automatically mean a good feel — it just opens up more tuning potential. The actual experience still depends on overall design and materials.

---

## Switch Decision Tree

\`\`\`
What is your primary use case?
│
├── Mainly gaming (FPS/MOBA) → Linear (Red/Yellow/Silver)
│     ├── Need fastest response → Silver (short actuation travel)
│     ├── Standard needs → Red (most versatile)
│     └── Heavy-handed / frequent mis-presses → Black (higher actuation force)
│
├── Mainly typing (writing, coding) → Tactile
│     ├── No noise allowed (office) → Brown or Milky/Creamy
│     └── Enjoy the sound (personal space) → Blue
│
└── Gaming + typing combined → Brown (the compromise)
\`\`\`

---

## One Final Reminder: Try Before You Buy

Written descriptions of switch feel are no substitute for touching them yourself. Physical keyboard demo stations are increasingly common — spend 30 seconds trying a few switches and you'll immediately know what you like. If buying online without certainty, choose a retailer with a return policy. Don't settle for an uncomfortable switch just to save a few dollars.

---

*Parameter data sourced from manufacturer technical specifications. Actual feel varies with installation quality and keycap choice.*`,
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'tv-buying-guide-miniled-oled',
    locale: 'en',
    title: 'Mini-LED vs OLED TV: Which Display Technology Actually Wins?',
    summary:
      'Traditional LCD, Mini-LED, and OLED coexist in today\'s TV market — and every brand claims they\'re the best. This guide cuts through the marketing and explains which technology suits your living room.',
    tags: ['tech-electronics', 'home-entertainment', 'tvs', 'display-panels'],
    published_at: '2026-01-04',
    draft: false,
    authors: ['default'],
    layout: 'PostLayout',
    content: `# Mini-LED vs OLED TV: Which Display Technology Actually Wins?

The TV market has changed dramatically. Traditional LCD, Mini-LED, and OLED all coexist, with sub-categories within each. Every brand claims to be the best — but where do the actual picture quality differences lie? This guide starts from first principles and helps you decide which technology suits your living room.

---

## The Foundation: What Actually Makes Picture Quality Good?

Picture quality comes down to two things: **how bright the bright parts can get, and how dark the dark parts can get** — and the ratio between them (contrast). A display that can simultaneously and accurately reproduce both highlights and shadows delivers genuinely good picture quality.

This leads to the core concept: **backlight control capability**.

---

## LCD Tier: Backlight Technology Determines Quality

Standard LED/LCD TVs combine an LCD panel with an LED backlight array. LCD itself doesn't emit light — the backlight shines through it to create the image.

**The fundamental problem**: When a single backlight zone contains both bright and dark content, the backlight has to find a compromise brightness. Dark areas end up "milky gray" — that's why traditional LCD TVs struggle with dark scenes.

The solution is "local dimming": divide the backlight into independently controlled zones — bright zones high, dark zones dimmed or off.

**Impact of zone count:**

| Zone count | Precision | Effect |
|---|---|---|
| Tens of zones | Coarse; obvious "halo" | Limited dark scene improvement |
| Hundreds of zones | Moderate; flagship LCD standard | Adequate for most viewing |
| Thousands of zones (Mini-LED) | Fine; approaching OLED | Highlights and shadows clearly separated |
| Per-pixel control (OLED) | Pixel-level; theoretical maximum | True black |

---

## Mini-LED: LCD's Best-in-Class Solution

Mini-LED is not a fundamentally new display technology — it's **LCD with smaller, denser LED backlights**.

Traditional LED backlights use LEDs ~1mm in diameter. Mini-LED uses LEDs of 0.1–0.2mm, allowing thousands to tens of thousands to fit in the same area, enabling far more precise local dimming zones.

**Real advantages of Mini-LED**:
- Zone counts can reach 2,000–5,000+, dramatically improving dimming precision
- Peak brightness typically 1,000–3,000 nits; flagship models can exceed 5,000 nits
- No burn-in risk
- Lifespan comparable to traditional LCD

**Real limitations of Mini-LED**:
- No matter how many zones, "blooming" still exists — bright objects have a faint glow around them
- Slower response time than OLED (typically 4–10ms vs. OLED's sub-0.1ms)
- Low-zone "fake Mini-LED" (under 100 zones) offers minimal improvement — it's a marketing label

**Key specs to check**:
- Local dimming zone count (more is better; under 1,000 zones has limited real benefit)
- Number of HDMI 2.1 ports (required for 4K 120Hz devices)
- Peak brightness (determines HDR highlight performance)

---

## OLED: Every Pixel Lights Itself

OLED needs no backlight. Each pixel emits its own light. To display black, that pixel simply turns off.

**Real advantages**:
- Infinite contrast (true black, not deep gray)
- Sub-0.1ms response time; no motion blur in fast content
- Near-180° viewing angles; picture quality holds from extreme off-axis positions
- Excellent color uniformity

**Two risks you must know**:

1. **Burn-in**: Organic light-emitting materials degrade from prolonged static images, leaving permanent ghost images. Modern OLED TVs have dramatically improved longevity; normal viewing habits pose minimal short-term risk. But extended display of fixed logos (channel watermarks, game HUDs) does carry some risk. Built-in protections (pixel shifting, screen savers) help — just use your TV sensibly.

2. **Brightness ceiling**: Organic materials degrade faster at extreme brightness, so OLED's sustained full-screen brightness is typically lower than flagship Mini-LED. In brightly lit living rooms, OLED highlights may actually look less spectacular than a high-end Mini-LED.

**OLED types explained**:
- **W-OLED**: Traditional white OLED + color filters — most widely available
- **QD-OLED**: OLED backlight + quantum dot color conversion — more vivid colors, higher brightness
- **MLA (Micro Lens Array)**: Optical efficiency enhancement structure — boosts brightness; common in recent flagships

---

## Core Parameter Comparison

| Parameter | Standard LED | Mini-LED | OLED |
|---|---|---|---|
| Contrast | 1,000–5,000:1 | 100,000:1+ (zone-dependent) | Infinite (pixel-level) |
| Peak brightness | 400–600 nits | 1,000–5,000 nits | 800–3,000 nits |
| Response time | 8–15ms | 4–8ms | <0.1ms |
| Burn-in risk | None | None | Yes (low risk with normal use) |
| Black level | Gray | Dark gray (high zone count approaches black) | True black |
| Halo / blooming | Severe | Mild (fewer with more zones) | None |

---

## Three Scenario Recommendations

**Scenario 1: Bright living room, heavy daytime use**
→ Mini-LED, high zone count (≥2,000 zones). High brightness is essential; Mini-LED's peak brightness advantage is decisive. Blooming is also less noticeable in bright environments.

**Scenario 2: Dark room, movies and home theater**
→ OLED (prioritize QD-OLED or MLA models). Black level and contrast advantages are most dramatic in dark rooms. Peak viewing experience.

**Scenario 3: Primarily gaming (PS5/Xbox)**
→ OLED preferred (low latency, high response); if displaying static HUDs for extended periods, configure burn-in prevention settings (screen saver, pixel shift enabled).

---

## 3 Parameters to Confirm Before Buying

1. **Number of HDMI 2.1 ports**: 4K 120Hz devices require HDMI 2.1. Aim for at least 2; some TVs have only 1 HDMI 2.1, which won't cover Xbox + PS5 + AV receiver.

2. **Local dimming zone count (Mini-LED mandatory)**: Manufacturers often say "Mini-LED" without disclosing zone counts. Fewer than 500 zones provides very limited benefit.

3. **Peak brightness vs. full-screen brightness**: "1,000 nits" — confirm what window size this applies to. A 10% window peak vs. full-screen brightness can differ by over 3×.

---

*Technical parameters based on independent lab test data. No brand affiliation implied.*`,
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'robot-vacuum-navigation-guide',
    locale: 'en',
    title: 'Robot Vacuum Navigation Explained: LDS, dToF, and Visual — What Actually Matters',
    summary:
      'A robot vacuum\'s ability to clean your home depends first on navigation. Navigation determines route planning; obstacle avoidance determines whether it can actually see hazards. Get these two right before buying.',
    tags: ['tech-electronics', 'smart-home', 'robot-vacuums', 'navigation'],
    published_at: '2026-01-05',
    draft: false,
    authors: ['default'],
    layout: 'PostLayout',
    content: `# Robot Vacuum Navigation Explained: LDS, dToF, and Visual — What Actually Matters

A robot vacuum's ability to clean your home depends first on navigation. Navigation determines how it plans routes; obstacle avoidance determines whether it can see hazards during cleaning. Understand these two systems before buying — otherwise you might end up with a "lost robot" that wanders, stalls, and bumps into everything.

---

## Navigation Technology: Three Approaches

### LDS Laser Navigation (mainstream favorite)

LDS (Laser Distance Sensor) is the dominant navigation approach. A spinning laser turret on top fires thousands of laser pulses per second, measuring reflection times to calculate distances and build a real-time room map.

**How it works**:
- High mapping precision; mature path planning algorithms
- Insensitive to light conditions (works in complete darkness)
- Stable maps; consistent route coverage across multiple cleaning sessions

**Real limitations**:
- The spinning laser head can get stuck under low furniture
- Only scans the horizontal plane; limited at identifying floor-level objects (cables, socks)

### dToF Navigation (advanced laser variant)

dToF (Direct Time-of-Flight) uses solid-state laser (no spinning parts) with higher measurement precision.

**Advantages**:
- No rotating mechanical components — theoretically more durable
- Longer detection range; more precise maps

**Reality check**: Multi-path interference (laser reflections in enclosed rooms creating measurement errors) means dToF's real-world home advantage isn't as dramatic as theory suggests. Many reviewers find it comparable to high-end LDS in practice.

### Visual Navigation (camera-based)

Uses cameras to capture room images, then applies algorithms for localization and mapping (similar to visual SLAM — Simultaneous Localization and Mapping).

**Advantages**:
- Can identify object types (distinguishes chair legs from charging cables)
- No mechanical spinning parts
- Combined with AI recognition, stronger obstacle avoidance capability

**Real limitations**:
- Unstable performance in strong backlighting, low light, or glare
- Heavily algorithm-dependent — large performance gaps between models
- Map continuity slightly worse than laser navigation

**2025 trend**: Some newer models combine laser navigation + AI visual obstacle avoidance — laser handles precise mapping, cameras handle ground-level object identification. This dual approach currently offers the best overall capability.

---

## Obstacle Avoidance: Whether It Can "See" Hazards

Navigation handles route planning; obstacle avoidance handles detecting clutter during cleaning. These are separate systems.

### Structured Light Obstacle Avoidance

Projects infrared structured light onto objects and calculates distance and shape from the deformation pattern.

- High precision; detects objects as small as 2–3cm
- Some sensitivity to direct bright sunlight
- Typical detection range 30–50cm

### Stereo Vision Obstacle Avoidance

Uses two cameras to mimic human binocular vision; calculates object distances from parallax.

- Strong object type recognition (can distinguish cables from chargers)
- Depends on fill lighting in dark conditions
- Wider detection range; can anticipate obstacles further ahead

### 3D Structured Light / ToF Depth Camera

Advanced depth-sensing approach; higher recognition accuracy for complex obstacles (stuffed animals, irregular shapes).

---

## Suction Power (Pa): Is Higher Always Better?

Suction power is advertised in Pa (Pascals), but this number has significant caveats.

**Common problems**:
- Pa ratings are peak values; the robot actually operates at lower settings most of the time to manage noise and battery life
- Different measurement methods produce incomparable numbers
- Carpet and hard floors have vastly different suction requirements (carpet needs >5,000 Pa to extract embedded dirt)

**More important factors**:
- **Roller brush design** (tangle-resistant is more practical than raw suction numbers)
- **Edge brush effectiveness** (cleaning along walls and corners)
- **Path planning coverage rate** (how well the map-based route covers the floor)

---

## Auto-Empty Base Station: Real Convenience Upgrade

High-end models come with an auto-empty base station. After cleaning, the robot docks and the station vacuums the dustbin contents into a sealed bag.

**Key specs**:
- Dust bag capacity (larger = less frequent bag changes; typically 2–4L)
- Sealed vs. unsealed bags (unsealed releases dust when you remove the bag)
- Auto-refill and mop washing (a dirty mop spreads more dirt than it removes)

---

## Three Home Scenarios — What to Buy

**Scenario A: Open floor plan, clean floors, limited budget**
→ Standard LDS laser navigation is sufficient; 3,000–5,000 Pa; no visual obstacle avoidance needed. Best value.

**Scenario B: Pets, children, lots of floor clutter**
→ Laser navigation + AI visual obstacle avoidance (3D structured light or stereo vision); auto-empty base station; avoid models with no obstacle avoidance.

**Scenario C: Carpet, needs deep cleaning**
→ Suction ≥ 8,000 Pa; auto carpet detection with boost mode; check roller brush design for carpet compatibility.

---

## Pre-Purchase Checklist

✅ Will the spinning laser head clear your lowest furniture? (Measure clearance height)
✅ What does obstacle avoidance recognize? (Can it identify black cables?)
✅ Does mapping support multiple floors? (Essential for two-story homes)
✅ Mop lifting system: Retractable mop (doesn't wet hard floors when not in use) > fixed mop
✅ Consumable costs: Factor in annual dust bag and cleaning solution expenses

---

*Parameter data sourced from public review media test reports. No brand affiliation implied.*`,
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'refrigerator-buying-guide-cooling-system',
    locale: 'en',
    title: 'Refrigerator Buying Guide: Fan-Cooling, Dual Circulation, and Compressor Type Explained',
    summary:
      'A refrigerator is a decade-long purchase. Buy the wrong one and you\'ll deal with frost buildup, wilted produce, or surprise electricity bills. Most of these problems can be predicted from specs before you buy.',
    tags: ['home-appliances', 'kitchen-appliances', 'refrigerators'],
    published_at: '2026-01-05',
    draft: false,
    authors: ['default'],
    layout: 'PostLayout',
    content: `# Refrigerator Buying Guide: Fan-Cooling, Dual Circulation, and Compressor Type Explained

A refrigerator is something you use for a decade. Buy the wrong one and you'll deal with frost buildup, wilted produce, or electricity bills that are higher than expected. Most of these problems can be predicted from specs before you buy.

---

## Cooling Method: Fan-Cooled vs. Direct-Cool

This is the first thing to clarify when buying a refrigerator.

### Direct-Cool Refrigerators

The evaporator is mounted directly on the freezer compartment walls; cold air spreads through natural convection.

**Advantages**:
- Simple mechanics; lower failure rate
- Higher internal humidity; fruits and vegetables stay fresher longer
- Quieter; lower electricity use
- Lower price at the same size

**Disadvantages**:
- The freezer compartment builds up thick frost over time; requires manual defrosting roughly every 6 months
- Uneven temperature distribution — too cold near the evaporator, not cold enough farther away
- Usually smaller capacity (large direct-cool models have largely left the market)

### Fan-Cooled (Frost-Free) Refrigerators

The evaporator is hidden; built-in fans circulate cold air throughout the compartments.

**Advantages**:
- Automatic defrost — frost melts and drains automatically; no manual cleaning required
- Even temperature distribution; more consistent food preservation
- Supports precise multi-zone temperature control

**Disadvantages**:
- Circulating air removes moisture from food; fruits and vegetables can dry out faster (use sealed containers or wrap)
- Fan noise (well-controlled in modern models; typically 35–40 dB)
- Slightly higher price

**Bottom line**: For refrigerators 300L and above, fan-cooled is the mainstream choice. Choosing direct-cool typically means smaller capacity, lower price, or a specific requirement (e.g., wine storage that benefits from higher humidity).

---

## Circulation System: The Key to Odor Cross-Contamination

This is a spec many buyers overlook.

### Single-Circulation System

Freezer and refrigerator compartments share one cooling circuit; cold air from the same evaporator is distributed to both zones.

**The problem**: Air circulates between the freezer and refrigerator; food odors transfer between compartments (ice cream can end up tasting like green onion).

### Dual-Circulation System (the spec to prioritize)

Freezer and refrigerator compartments each have an independent evaporator and fan system — physically isolated from each other.

**True dual-circulation vs. fake dual-circulation**:
- **Dual-refrigeration circuits**: Two completely separate cooling systems, physically isolated, no odor transfer, independent temperature and humidity control for each zone ✅
- **Dual-airflow paths**: Air is delivered separately to each zone, but the evaporator is still shared — minimal improvement on odor transfer ⚠️

When buying, confirm whether it's a "dual refrigeration system" or just "dual airflow." Ask directly or check the technical spec sheet.

### Triple-Circulation System

Some high-end models have three independent circuits (freezer + refrigerator + variable-temperature zone). Three zones with fully independent temperature control — ideal for precise categorized food storage.

---

## Compressor: Inverter vs. Fixed-Speed

The compressor is the refrigerator's core component; it directly affects noise and electricity consumption.

**Fixed-speed compressor**:
- Only two states: full-power on or off
- Cycles between full-speed and stop; frequent start-up current spikes cause noise fluctuations
- Now found only in low-end or small-capacity products

**Inverter compressor**:
- Adjusts speed continuously (25%–100%); runs slowly during stable temperature, ramps up when rapid cooling is needed
- Lower, more consistent noise (very quiet at low speeds)
- Energy savings: a Tier 1 efficiency inverter refrigerator uses 30–50% less power than non-inverter
- Longer lifespan (fewer mechanical stress cycles from frequent starts)

**Bottom line**: Most mainstream home refrigerators today use inverter compressors. The main question is whether it achieves Tier 1 energy efficiency (the top national efficiency rating).

---

## Refrigerant Type: R32 vs. R410a

**R410a**: Traditional refrigerant; Global Warming Potential (GWP) of 2,088. Being phased out, but still found in existing inventory products.

**R32**: Next-generation refrigerant; GWP of 675. More environmentally friendly and more thermally efficient, meaning lower energy consumption. Some products use R290 (propane), with GWP near 3, but requires special safety design due to flammability.

---

## Practical Buying Checklist

**Core specs to check:**

| Spec | Recommended standard |
|---|---|
| Cooling method | Fan-cooled (for two-door and larger) |
| Circulation system | Dual-refrigeration circuits (not just dual-airflow) |
| Compressor | Inverter; Tier 1 energy efficiency |
| Capacity | 2-person household: 300–400L; 3-person: 400–500L+ |
| Freezer temperature | -30°C quick-freeze capability is a plus |
| Antibacterial/deodorizing | Activated charcoal or antibacterial materials are a plus |

**Three easily overlooked details:**

1. **Net internal volume vs. labeled volume**: The volume on the box includes the ice column, door shelves, and insulation thickness. Actual usable space is typically 5–10% less.

2. **Door swing direction**: Measure your kitchen layout before buying and confirm the door doesn't block a walkway. French multi-door and side-by-side models require adequate kitchen width.

3. **Annual energy consumption**: The energy label shows annual kWh consumption. Multiply that by your local electricity rate to get annual electricity cost — more useful than comparing "energy efficiency tier" labels directly.

---

*Data referenced from national standards and industry review reports. Specific models subject to manufacturer published specifications.*`,
  },

  // ── 6 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'water-purifier-guide-ro-ultrafiltration',
    locale: 'en',
    title: 'RO vs. Ultrafiltration Water Purifiers: How to Choose the Right One',
    summary:
      'The biggest misconception in water purifier shopping is "more expensive = better." The right match for your local water quality matters far more. Here\'s how to understand the two mainstream technologies and the specs that actually matter.',
    tags: ['home-appliances', 'kitchen-appliances', 'water-purifiers'],
    published_at: '2026-01-06',
    draft: false,
    authors: ['default'],
    layout: 'PostLayout',
    content: `# RO vs. Ultrafiltration Water Purifiers: How to Choose the Right One

The biggest misconception in water purifier shopping is "more expensive = better." The right match for your local water quality matters far more. This article explains the core differences between the two mainstream purification technologies and the specs that actually matter.

---

## First: Understand Your Local Water Quality

Water purifiers aren't a "higher-end is always better" purchase — matching your water quality is the correct approach.

**Simple self-test:**
- Buy a TDS meter (available online for $5–10) and test your tap water
- **TDS < 150**: Excellent water quality; ultrafiltration is sufficient
- **TDS 150–500**: Moderate; RO is a reasonable upgrade
- **TDS > 500**, old apartment building, industrial area nearby, or heavy scale buildup → RO reverse osmosis recommended

---

## Two Core Technologies

### Ultrafiltration (UF)

**How it works**: Filters through a UF membrane with pore size of approximately 0.01–0.1 microns, removing bacteria, viruses, suspended particles, and large organic molecules.

**Removes**: Bacteria, viruses, rust particles, sediment
**Does NOT remove**: Heavy metal ions, dissolved inorganic salts, pesticide residues, small-molecule organic compounds

**Characteristics**:
- No electricity required (no booster pump)
- Zero wastewater
- High flow rate (instant output; no storage tank wait)
- Retains mineral content (minerals pass through UF membranes)
- Lower cost; less frequent filter replacement expense

**Best for**: Households with good municipal water quality, low TDS, and no heavy metal contamination risk.

---

### RO Reverse Osmosis

**How it works**: Uses a reverse osmosis membrane with pore size of approximately 0.0001 microns (angstrom scale). Water molecules are forced through under high pressure; virtually all dissolved substances are rejected.

**Removes**: Bacteria, viruses, heavy metals, pesticide residues, nitrates, fluoride, arsenic, virtually all inorganic salts

**Characteristics**:
- Requires electricity (booster pump)
- Produces wastewater (some input water is discharged as concentrated brine)
- Slower output (requires a storage tank, or high-flux tankless models)
- Removes all minerals (water is purer)
- Higher cost; RO membrane requires periodic replacement

**Best for**: Hard-water areas (heavy scale), old pipes, high purity requirements (infant formula, specialty coffee), households with heavy metal contamination concerns.

---

## Key Parameter Breakdown

### Flow Rate (GPD)

GPD = Gallons Per Day — how many gallons of purified water the system produces daily.

**Conversion**: 1 gallon ≈ 3.78 liters

- **400G**: ~1.5L/min — adequate for everyday drinking (2–3 person household)
- **600G**: ~2.3L/min — better flow, recommended for tankless models
- **800G+**: High flow; for households of 3+ or high consumption

⚠️ Rated GPD is measured at 25°C. Winter cold water temperatures can reduce output by 30–50%. Cold-climate households should choose higher GPD ratings.

### Wastewater Ratio

An RO system produces wastewater alongside purified water. Wastewater ratio = wastewater : purified water.

- **1:1**: Produces 1L purified, wastes 1L (water-efficient)
- **2:1**: Twice as much wastewater as purified water (traditional models)

More eco-friendly models achieve ≤1:1; zero-wastewater designs recycle brine internally.

### Filter Replacement Costs (The Most Overlooked Factor)

Many buyers focus on the machine price and ignore ongoing filter costs.

**Typical replacement schedule:**
- PP sediment (pre-filter): 3–6 months
- Activated carbon: 6–12 months
- RO membrane: 2–3 years
- Post-carbon: 12 months

Annual filter costs range from a few dollars to several hundred — calculate this before buying.

**The biggest trap**: Proprietary filters that only work with one brand's machines. These can cost twice as much as universal-fit filters. Long-term running costs far exceed those of universal-filter models.

---

## Three Scenario Recommendations

**Scenario A: Southern city, good water quality, limited budget**
→ Ultrafiltration + pre-filter (to catch rust from pipes). Annual cost is minimal; clean and sufficient.

**Scenario B: Northern region or hard-water area, heavy scale buildup**
→ RO reverse osmosis; prioritize GPD ≥ 400, wastewater ratio ≤ 1:1.

**Scenario C: Infants, high purity requirements**
→ RO reverse osmosis; confirm no scale inhibitors added; NSF 42/58 certified (international safety standard).

---

## Myth-Busting Summary

| Claim | Reality |
|---|---|
| "Never replace filters" | Impossible. Saturated filters release absorbed contaminants back into the water — never replacing is actually dangerous. |
| "Purified water has no nutrients" | Human mineral needs come primarily from food, not water. Healthy adults can drink RO water without nutritional impact. |
| "Lower TDS = cleaner water" | TDS only measures total dissolved solids without distinguishing harmful from harmless. Pure water TDS ≈ 0, but TDS cannot detect organic contaminants like pesticides. |
| "Tankless = instant high flow" | Tankless designs require high GPD to deliver water on demand. For tankless models, choose GPD ≥ 600. |

---

*Data referenced from NSF International standards and national water purifier industry standards.*`,
  },

  // ── 7 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'sunscreen-guide-physical-chemical',
    locale: 'en',
    title: 'Sunscreen Guide: Physical, Chemical, and Hybrid — How to Actually Choose',
    summary:
      'Most people have used sunscreen for years without understanding why it works, what SPF and PA mean, or why two products labeled SPF50+ feel completely different on skin. Here\'s the underlying logic.',
    tags: ['beauty-health', 'skincare', 'sun-protection'],
    published_at: '2026-01-07',
    draft: false,
    authors: ['default'],
    layout: 'PostLayout',
    content: `# Sunscreen Guide: Physical, Chemical, and Hybrid — How to Actually Choose

Sunscreen is a summer staple, yet most people who've used it for years still don't understand why it works, what SPF and PA actually represent, or why two products both labeled "SPF50+" feel completely different on skin. Here's the underlying logic.

---

## Two Types of UV Damage

Sunscreen protects against ultraviolet (UV) radiation, which comes in two varieties that damage skin in different ways:

**UVB (Medium wavelength, 280–315nm)**:
- High energy; primarily responsible for sunburn (redness, peeling)
- Most is absorbed by the atmosphere, but intensity is high around midday in summer
- SPF measures protection against UVB

**UVA (Long wavelength, 315–400nm)**:
- Lower energy but deeper penetration (passes through glass and clouds)
- Doesn't cause immediate sunburn, but sustained exposure breaks down collagen, causing wrinkles, sagging, and pigmentation (photoaging)
- PA rating measures protection against UVA

**Key insight**: You need protection from both sunburn (UVB) and photoaging (UVA). Checking only SPF is insufficient.

---

## Two Protection Mechanisms

### Physical (Mineral) Sunscreen

**Active ingredients**: Titanium dioxide (TiO₂), zinc oxide (ZnO)

**How it works**: These mineral powders form a "reflective shield" on the skin surface. They work through reflection and scattering — bouncing UV away before it reaches the skin.

**Advantages**:
- Effective immediately upon application — no waiting time
- Stable ingredients; doesn't break down in sunlight
- Gentle on skin; suitable for sensitive skin, pregnancy, and infants
- Not absorbed into the skin (stays on the surface)

**Disadvantages**:
- Larger particle size; heavier texture; can leave a white cast (more visible on darker skin tones)
- Nano-particle formulation reduces white cast but slightly increases skin penetration
- Can pill up when layered with other products; pay attention to application order

### Chemical Sunscreen

**Common ingredients**: Avobenzone, Bemotrizinol, Octocrylene, and others

**How it works**: These ingredients are absorbed into the skin. At the cellular level, they "capture" UV energy and convert it into heat, dissipating it before UV can cause further damage.

**Advantages**:
- Lightweight, comfortable texture; no white cast
- Easy to formulate at high SPF ratings
- Suitable for daily commuting and mostly indoor use

**Disadvantages**:
- Requires 15–30 minutes after application to become fully effective (time for absorption)
- Some ingredients break down under UV exposure (photostability issues); requires UV stabilizers or frequent reapplication
- Some ingredients may cause mild irritation for sensitive skin
- Some ingredients are under study for potential endocrine disruption (risk debate ongoing; typical usage amounts are generally considered safe)

### Hybrid (Physical + Chemical) Sunscreen

Combines both types — benefiting from the stability of mineral filters and the lightweight feel of chemical filters, with broad-spectrum coverage (both UVA and UVB). Most modern sunscreens use hybrid formulations.

---

## Reading SPF and PA

### SPF (Sun Protection Factor)

Measures protection against UVB as a time multiplier.

- SPF15: Extends skin's UV tolerance by ~15×
- SPF30: Blocks ~97% of UVB
- SPF50: Blocks ~98% of UVB
- SPF50+: Blocks 98%+ of UVB

**Practical logic**: SPF30 is sufficient for daily commuting between indoor and outdoor settings. For extended outdoor activity, choose SPF50+.

⚠️ Higher SPF doesn't mean longer protection time: You can't skip reapplication just because you have SPF100. Sunscreen wears off through sweating and friction. Reapply every 2 hours during outdoor activity — this is non-negotiable.

### PA (UVA Protection Grade — Japanese system)

More "+" signs = stronger UVA protection:
- PA+: Light protection
- PA++: Moderate protection
- PA+++: High protection
- PA++++: Maximum protection

**Practical advice**: PA+++ is sufficient for daily commuting; PA++++ for high-UV environments (high altitude, beach).

---

## Matching Sunscreen to Scenario

| Use scenario | Recommended approach |
|---|---|
| Daily commuting, mostly indoors | Chemical; SPF30 PA+++; lightweight texture |
| Outdoor activity, sports | Hybrid; SPF50+ PA++++; water-resistant formula |
| Sensitive skin, compromised barrier | Mineral; ingredients limited to TiO₂ or ZnO only |
| Infants, pregnancy | Mineral; avoid benzophenone-type chemical filters |
| High-altitude travel | SPF50+ PA++++; water-resistant, reapply morning and afternoon |

---

## Application Mistakes to Avoid

**Amount is critical**: Lab-tested SPF ratings are calculated at 2mg/cm². Face + neck typically requires approximately 1–2g of sunscreen (roughly the size of a coin). Most people apply only 1/3 to 1/2 of what's needed — actual protection is proportionally lower.

**Application order**: Apply after your skincare routine (moisturizer/face cream) and before cosmetics (foundation/cushion).

**Reapplication over makeup**: Use sunscreen spray or SPF-infused powder instead of applying sunscreen lotion directly over makeup.

---

*Ingredient information referenced from FDA and EU Cosmetics Regulation public documents. Sunscreen ingredient safety referenced from dermatology research reviews.*`,
  },

  // ── 8 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'mattress-guide-spring-comfort-layer',
    locale: 'en',
    title: 'Mattress Buying Guide: The Specs That Determine Whether You Sleep Well',
    summary:
      'A mattress lasts ten years. A good one supports your spine and improves sleep quality. A bad one can cause back pain and disturb your partner. Marketing jargon won\'t help — structural specs will.',
    tags: ['home-renovation', 'furniture', 'mattresses'],
    published_at: '2026-01-09',
    draft: false,
    authors: ['default'],
    layout: 'PostLayout',
    content: `# Mattress Buying Guide: The Specs That Determine Whether You Sleep Well

A mattress is something you use for ten years. A good one supports your spine and improves sleep quality. A bad one can cause back pain, disturb your sleeping partner, and leave you waking up tired. But marketing terms like "ergonomic support" and "golden comfort" are meaningless. The structural specs are what help you make a real decision.

---

## Two Layers: Support Core + Comfort Layer

The mattress experience is determined by two components: **the spring (support core)** determines overall firmness and shock absorption, while the **comfort layer** determines the immediate feel against your body.

---

## Spring Types: Pocketed Coils vs. Bonnell (Open Coil)

### Bonnell (Open Coil) Springs

Traditional spring design where all coils are connected by metal wire into a single unified network.

**Characteristics**:
- Firm, even support with good bounce
- Good breathability (air circulates between coils)
- Simple construction; lower price
- **"One moves, all move"**: When you turn over or get up, vibrations travel through the entire spring network, easily disturbing a sleeping partner
- Coils may deform and lose support over extended use

**Best for**: Single sleepers, limited budget, those who prefer a firm feel.

### Pocketed Coil Springs

Each coil is individually encased in a non-woven fabric pocket. Coils are not connected to each other and compress independently.

**Characteristics**:
- **Zero motion transfer**: Each coil moves independently; turning on one side doesn't transfer vibration to the other side — ideal for couples or partners with different sleep sensitivities
- More precise body contouring (each contact point responds independently)
- Silent (coils don't rub against each other)
- Higher coil density = more precise support

**Key spec: Coil count**
- **Under 1,000 coils**: Entry-level; coils are thicker and less conforming
- **1,000–2,000 coils**: Mainstream quality range
- **Over 2,000 coils**: High density; precise support; for those who prioritize sleep quality

There's also an upgraded version called **micro-coils or mini pocketed coils**, with smaller and thinner springs (~2cm diameter), reaching thousands per square meter for exceptional body contouring. Typically found in premium mattresses.

---

## Comfort Layer Materials

### Natural Latex

**Source**: Extracted and processed from rubber tree sap.

**Characteristics**:
- Good elasticity with "responsive bounce" — compresses and springs back quickly
- Naturally antibacterial and anti-mite (latex proteins naturally inhibit dust mites)
- Good breathability; doesn't trap heat
- Heavier than foam

**Identifying genuine natural latex**:
- Authentic natural latex content is typically ≥90% (some products specify 95%+)
- Look for rubber association certification (SGS or Oeko-Tex 100)
- Synthetic latex (SBR) is cheaper with similar feel but worse durability — it crumbles over time
- Natural latex has a faint natural rubber scent; synthetic latex has a more chemical odor

### Memory Foam (Slow-Recovery Foam)

**Characteristics**:
- Slowly conforms to body shape under pressure; excellent "cradling" sensation
- Outstanding pressure relief at shoulder and hip contact points
- **Not for everyone**: If you prefer a bouncy feel, memory foam can feel like you're "stuck in quicksand"
- Temperature-sensitive: firms up in cold; softens in heat
- Poor breathability; prone to heat retention (especially with high-density memory foam)

### High-Density Foam

**Density unit: D (kg/m³)**
- **D < 25**: Low density; compresses easily, poor durability
- **D 30–40**: Mainstream quality; balanced support
- **D > 45**: High density; strong support; compresses slowly under sustained weight

Higher foam density in the comfort layer means longer mattress lifespan and less "body impression" forming over time.

---

## Firmness: The Core for Spinal Health

Mattresses aren't better softer or better firmer — the key is **keeping your spine in its natural alignment**.

**Problem with too-soft mattresses**: Lower back hangs unsupported, causing compensatory muscle tension over time
**Problem with too-firm mattresses**: Shoulders and hips bear excessive pressure, affecting circulation

**General guidelines:**
- Body weight ≤ 60kg: Soft to medium
- Body weight 60–80kg: Medium
- Body weight ≥ 80kg: Medium-firm
- Primary sleep position: side sleeping → slightly softer to allow shoulder and hip to sink slightly, keeping spine straight
- Primary sleep position: back sleeping → medium or slightly firm for adequate lower back support

---

## Environmental Safety: What Certifications to Check

A mattress is pressed against your body for 8 hours a day. Formaldehyde and VOC off-gassing matter.

**Recommended certifications**:
- **Oeko-Tex Standard 100**: Tests for harmful substances including formaldehyde, heavy metals, pesticide residues
- **CertiPUR-US**: Safety certification for foam materials; US standard
- **Natural Latex SGS Certification**: Confirms natural latex content percentage

---

## One Measurement Before Buying

**Mattress height + bed frame height** determines knee bend angle when getting up. A common problem: overly thick mattresses make the sleeping surface too high — difficult for elderly users or shorter individuals to get up comfortably.

Recommended total height: **45–55cm from mattress base to floor** (thighs roughly parallel to the floor when sitting on the edge; getting up requires minimal effort).

---

*Parameter recommendations compiled from domestic and international independent mattress reviews and sleep science research literature.*`,
  },

  // ── 9 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'cat-food-ingredients-nutrition-guide',
    locale: 'en',
    title: "Cat Food Ingredient Label Guide: How to Read Specs Without Being Misled",
    summary:
      'The cat food market is messier than human food. "All-natural," "fresh meat formula," "premium ingredients" — these labels carry zero regulatory weight. What actually determines cat food quality is hidden in the ingredient list and guaranteed analysis panel.',
    tags: ['pets', 'cat-supplies', 'cat-food', 'nutrition'],
    published_at: '2026-01-10',
    draft: false,
    authors: ['default'],
    layout: 'PostLayout',
    content: `# Cat Food Ingredient Label Guide: How to Read Specs Without Being Misled

The cat food market is messier than human food. "All-natural," "fresh meat formula," "premium ingredients" — these labels carry zero regulatory weight. What actually determines cat food quality is hidden in the ingredient list and guaranteed analysis panel. Here's how to read the numbers that matter.

---

## Why Cat Food Labels Matter So Much

Dogs are omnivores; cats are **obligate carnivores**. Cats have dramatically higher protein requirements than dogs, and their bodies lack certain enzymes to synthesize essential nutrients from plant sources (they cannot internally synthesize taurine or arachidonic acid, for example). If cat food uses poor protein sources or insufficient amounts, long-term consequences affect muscle mass, heart health, and urinary tract function.

---

## How Ingredient Lists Work

Ingredients are listed **by weight, from highest to lowest**. What appears first makes up the most by weight.

**Critical nuance**: This weight is **pre-processing weight**, which includes water content.

For example: "Fresh chicken" listed first sounds impressive, but fresh meat is ~75% water. After processing, the actual dry weight may be less than "chicken meal" listed further down the list. This is a common marketing technique.

---

## Crude Protein: The Core Nutrient Cats Need Most

**Recommended level**: Dry food crude protein ≥ 32%; better products target ≥ 36%

**Crude protein ≠ quality protein**: Crude protein measures total nitrogen-containing organic compounds. Feather meal and leather hydrolysate also contain nitrogen, but cats cannot utilize these. To assess protein quality, look at the protein **source**.

**Protein source quality ranking (high to low)**:
1. **Fresh or frozen meat** (chicken breast, salmon, etc.): High quality; rich in amino acids
2. **Dehydrated or freeze-dried meat** (dehydrated chicken, freeze-dried salmon): Water removed but nutrition preserved; high quality
3. **Meat meal** (chicken meal, fish meal): Concentrated protein from rendering; digestibility depends on source materials
4. **By-product meal** (poultry by-product meal): Organ meats; reasonable nutrition but opaque sourcing — evaluate cautiously
5. **Plant protein** (pea protein, soybean protein): Low digestibility for cats; used to inflate crude protein numbers rather than provide nutrition

---

## Crude Fat: Energy Source — Not the Enemy

Cats have significant fat requirements. Fat is an important energy source and carrier for fat-soluble vitamins.

**Recommended level**: 15–22%

- Below 10%: Insufficient energy; cats may seem lethargic
- Above 25%: Elevated; overweight cats and those with pancreatic issues should be cautious

---

## Crude Ash: Lower Is Better

Ash is the inorganic residue remaining after burning food — it includes minerals but also non-nutritive materials. High ash typically indicates more bone, feathers, and cartilage (non-nutritive filler) in the source materials.

**Recommended**: Ash < 8%; ideal range 4–7%

High-ash cat food fed long-term can increase metabolic burden on the urinary system (particularly phosphorus load on the kidneys).

---

## Calcium-to-Phosphorus Ratio: Key to Urinary Health

Cat kidneys and urinary systems are sensitive to mineral metabolism. Improper Ca:P ratios are associated with urinary problems (urinary stones, kidney disease).

**Recommended Ca:P ratio**: 1:1 to 2:1; ideal close to 1.2:1

- High phosphorus (Ca:P < 1:1): Increases kidney phosphorus filtration burden
- High calcium: Interferes with absorption of other minerals

---

## Is "Grain-Free" Marketing or Necessity?

**Conclusion**: For healthy cats, "grain-free" isn't essential — but understanding the logic is useful.

Cats utilize carbohydrates far less efficiently than humans. Cat foods heavy in grains (corn, wheat, rice) essentially substitute carbohydrates for protein to reduce costs — this causes blood sugar spikes in cats and may increase diabetes risk long-term.

But "grain-free" doesn't mean low-carbohydrate. Many grain-free formulas substitute peas and sweet potatoes; carbohydrate content remains high.

**The real metric isn't "grain-free or not" — it's actual carbohydrate percentage** (some products show this, or calculate: carbs% = 100% − protein% − fat% − ash% − moisture%).

---

## Three-Step Quick Assessment

1. **Check protein sources**: The first three ingredients should be substantive meat sources (not by-products or plant protein)
2. **Verify guaranteed analysis**: Crude protein ≥ 32%, crude ash < 8%
3. **Confirm Ca:P ratio**: Between 1:1 and 2:1

A cat food that passes all three checks is at minimum a decent product. Factor in price and choose accordingly.

---

*Data referenced from AAFCO (Association of American Feed Control Officials) cat nutritional standards and veterinary nutrition literature.*`,
  },
]

async function main() {
  console.log(`\n🌍 Seeding ${articles.length} EN articles (batch 1: 0–9)\n`)

  let ok = 0
  let fail = 0

  for (const article of articles) {
    process.stdout.write(`  upsert: ${article.slug} ... `)
    const { error } = await sb
      .from('pitfallfree_guides')
      .upsert({ ...article, updated_at: new Date().toISOString() }, { onConflict: 'slug,locale' })
    if (error) {
      console.log('❌', error.message)
      fail++
    } else {
      console.log('✅')
      ok++
    }
  }

  console.log(`\n✅ Success: ${ok}  ❌ Failed: ${fail}\n`)
}

main().catch((e) => { console.error(e.message); process.exit(1) })