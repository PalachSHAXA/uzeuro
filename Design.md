# UZEURO Website Design

## Overview
- **Motion Style**: Cinematic parallax with 3D depth layers and liquid morphing transitions
- **Animation Intensity**: Ultra-Dynamic
- **Technology Stack**: CSS Custom Properties, GSAP ScrollTrigger, Three.js (hero only), SVG morphing, Web Animations API

## Brand Foundation

### Colors

**Primary Colors:**
- Primary Blue: #003399
- Primary Yellow: #FFCC00
- Black: #1A1A2E
- White: #FFFFFF

**Surface Colors:**
- Surface 1: #FAFAFA (Background)
- Surface 2: #F5F5F7 (Cards)
- Surface 3: #EAEAEF (Borders)
- Surface 4: #D1D1D9 (Dividers)

**Text Colors:**
- Text Primary: #1A1A2E
- Text Secondary: #6B7280
- Text Tertiary: #9CA3AF

**Accent Colors:**
- Accent Blue: #003399
- Accent Yellow: #FFCC00
- Accent Red: #DC2626
- Accent Green: #059669

**Motion Accent Colors:**
- Glow Blue: rgba(0, 51, 153, 0.3)
- Glow Yellow: rgba(255, 204, 0, 0.4)
- Depth Shadow: rgba(26, 26, 46, 0.15)

### Typography

**Font Families:**
- Primary: "Space Grotesk", sans-serif
- Secondary: "Clash Display", sans-serif

**Font URLs:**
```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect">
<link href="https://fonts.gstatic.com" rel="preconnect" crossorigin="anonymous">

<!-- WebFont Loader -->
WebFont.load({
  google: {
    families: ["Space Grotesk:300,regular,500,600,700"]
  }
});
```

**Typography Scale:**
- H1: 72px / 80px line-height, -1.8px letter-spacing, 500 weight
- H2: 60px / 68px line-height, -1.5px letter-spacing, 500 weight
- H3: 48px / 56px line-height, -1.2px letter-spacing, 500 weight
- H4: 36px / 44px line-height, -0.9px letter-spacing, 500 weight
- H5: 28px / 36px line-height, -0.7px letter-spacing, 500 weight
- H6: 20px / 28px line-height, -0.5px letter-spacing, 500 weight
- Body: 16px / 24px line-height, 400 weight
- Small: 14px / 20px line-height, 400 weight

---

## Global Motion System

### Animation Timing Library

**Custom Easing Functions:**
```css
:root {
  --ease-expo-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-expo-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-dramatic: cubic-bezier(0.87, 0, 0.13, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-liquid: cubic-bezier(0.23, 1, 0.32, 1);
}
```

**Duration Scale:**
- Micro: 150ms (icon states, small feedback)
- Fast: 300ms (hovers, toggles)
- Medium: 500ms (entrances, transitions)
- Slow: 800ms (dramatic reveals)
- Cinematic: 1200ms (hero sequences)
- Ambient: 8000-20000ms (continuous floating)

**Stagger Patterns:**
- Cascade: 80ms between siblings
- Wave: 120ms with sine offset
- Explosion: 50ms from center outward
- Typewriter: 40ms per character

### Continuous Ambient Effects

**Floating Depth System:**
- 3 parallax depth layers (z: -50px, 0px, 50px)
- Subtle sine wave motion: `translateY(sin(time * 0.5) * 10px)`
- Rotation drift: `rotate(sin(time * 0.3) * 2deg)`
- Applied to decorative elements only

**Living Gradient Accents:**
- Hero gradient mesh slowly morphs between 4 states
- Duration: 15000ms continuous loop
- Colors shift within brand palette
- GPU-accelerated with will-change: transform

### Scroll Engine Configuration

**Parallax Layers:**
```javascript
const parallaxConfig = {
  background: { speed: 0.3, direction: 'vertical' },
  midground: { speed: 0.6, direction: 'vertical' },
  foreground: { speed: 1.0, direction: 'vertical' },
  floating: { speed: -0.2, direction: 'both' }
};
```

**Pin Points:**
- Hero section: Pinned for 100vh with content choreography
- CTA sections: Brief pin (50vh) for emphasis
- Timeline: Progressive reveal pinning

**Scroll Progress Triggers:**
- 0-20%: Element enters viewport
- 20-80%: Element in view (active state)
- 80-100%: Element exits viewport

---

## Section 1: Navigation

### Layout

**Spatial Composition:**
- Sticky positioning with morphing behavior
- Initial: Full width, transparent background
- Scrolled: Compact pill shape with backdrop blur (12px)
- Z-index: 1000 (above all content)

**Dynamic Grid:**
```css
.nav-container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: clamp(1rem, 3vw, 3rem);
  transition: all 0.5s var(--ease-expo-out);
}
```

### Content

**Logo:** UZEURO (SVG)
**Navigation Links:** About, Events, Membership, Publications, Webinars
**CTA Button:** "Join Now"

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Logo | Slide + Fade | x: -30px → 0, opacity: 0 → 1 | 600ms | 0ms | expo-out |
| Nav Links | Stagger Drop | y: -20px → 0, opacity: 0 → 1 | 400ms | 100ms each | expo-out |
| CTA Button | Scale Pop | scale: 0.8 → 1, opacity: 0 → 1 | 500ms | 400ms | elastic |

#### Scroll Morphing
| Trigger | Effect | Values | Duration |
|---------|--------|--------|----------|
| scrollY > 100 | Background | transparent → rgba(250,250,250,0.9) | 400ms |
| scrollY > 100 | Backdrop | blur(0) → blur(12px) | 400ms |
| scrollY > 100 | Padding | 24px → 12px | 400ms |
| scrollY > 100 | Shadow | none → 0 4px 30px rgba(0,0,0,0.1) | 400ms |

#### Interaction Effects

**Nav Links Hover:**
- Underline draws from left: width 0% → 100%
- Color shift: #1A1A2E → #003399
- Duration: 300ms
- Easing: expo-out

**CTA Button Hover:**
- Magnetic pull toward cursor (CSS transform on :hover)
- Scale: 1 → 1.05
- Background: subtle gradient shift
- Box-shadow expands: 0 0 0 → 0 8px 30px rgba(0, 51, 153, 0.3)

**Mobile Menu Reveal:**
- Full-screen overlay slides from right
- Links stagger in with 80ms delay
- Background blur intensifies: 0 → 20px
- Close icon rotates in: 0 → 180deg

---

## Section 2: Hero

### Layout

**Revolutionary Spatial Design:**
- Full viewport height (100vh) with overflow hidden
- Content positioned in golden ratio: 38.2% from top
- Text aligned left with diagonal invisible grid
- 3D depth layers create parallax separation

**Layer Architecture:**
```
z-index: 1  - Animated gradient mesh background
z-index: 2  - Floating geometric shapes (parallax layer)
z-index: 3  - Main content (headline, subtext, buttons)
z-index: 4  - Statistics cards (floating, staggered)
```

### Content

**Headline:** "Uzbek-European Law Association"
- Split into words for individual animation
- Each word reveals with slight rotation

**Subheadline:** "Bridging legal communities between Uzbekistan and the European Union"
- Line-by-line reveal with mask animation

**CTA Buttons:**
- Primary: "Become a Member"
- Secondary: "Explore Events"

**Statistics:**
- "150+ Members"
- "12 EU Countries"
- "25+ Events"

### Images

**Hero Background Effect:**
- Animated gradient mesh (no image, pure CSS/Canvas)
- Flowing organic shapes in brand colors
- Subtle noise texture overlay (5% opacity)

**Decorative Elements:**
- Floating geometric shapes (SVG)
- Positioned at various z-depths
- Glassmorphism effect with blur

### Motion Choreography

#### Entrance Sequence (Cinematic Reveal)
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Background | Fade + Scale | opacity: 0 → 1, scale: 1.1 → 1 | 1200ms | 0ms | expo-out |
| Gradient Mesh | Morph Start | animation begins | 15000ms | 200ms | linear loop |
| Headline Word 1 | Clip + Rotate | clipPath: inset(100% 0 0 0) → inset(0), rotateX: 15deg → 0 | 700ms | 300ms | expo-out |
| Headline Word 2 | Clip + Rotate | Same as above | 700ms | 400ms | expo-out |
| Headline Word 3 | Clip + Rotate | Same as above | 700ms | 500ms | expo-out |
| Headline Word 4 | Clip + Rotate | Same as above | 700ms | 600ms | expo-out |
| Subheadline | Mask Reveal | clipPath: inset(0 100% 0 0) → inset(0) | 800ms | 900ms | expo-out |
| CTA Primary | Scale + Fade | scale: 0.9 → 1, opacity: 0 → 1 | 500ms | 1100ms | elastic |
| CTA Secondary | Scale + Fade | scale: 0.9 → 1, opacity: 0 → 1 | 500ms | 1200ms | elastic |
| Stat Card 1 | Float Up | y: 60px → 0, opacity: 0 → 1, rotate: 5deg → 0 | 600ms | 1300ms | expo-out |
| Stat Card 2 | Float Up | Same | 600ms | 1400ms | expo-out |
| Stat Card 3 | Float Up | Same | 600ms | 1500ms | expo-out |
| Floating Shapes | Begin Ambient | Continuous floating | ∞ | 1600ms | sine wave |

#### Scroll Effects
| Trigger | Element | Effect | Start | End | Values |
|---------|---------|--------|-------|-----|--------|
| 0-50vh | Background | Parallax Up | 0% | 50% | translateY: 0 → -100px |
| 0-50vh | Headline | Parallax + Fade | 0% | 50% | translateY: 0 → -50px, opacity: 1 → 0 |
| 0-60vh | Stat Cards | Scatter Exit | 0% | 60% | Individual paths outward |
| 0-40vh | Gradient Mesh | Blur Increase | 0% | 40% | filter: blur(0) → blur(20px) |

#### Continuous Animations

**Gradient Mesh Morphing:**
```css
@keyframes meshMorph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50% { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
  75% { border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%; }
}
/* Duration: 15s, easing: ease-in-out, infinite */
```

**Floating Shapes:**
- 3-5 geometric shapes (circles, rounded rectangles)
- Each with unique floating pattern
- Subtle rotation: ±5deg over 12s
- Position drift: ±20px over 10s
- Opacity pulse: 0.7 → 1 → 0.7 over 4s

**Stat Card Micro-Motion:**
- Gentle hover: translateY ±3px over 3s
- Number counter animation on reveal
- Subtle shadow pulse

### Advanced Effects

#### 3D Elements

**Floating Card Depth:**
```css
.stat-card {
  transform-style: preserve-3d;
  transform: perspective(1000px) rotateX(var(--rotateX)) rotateY(var(--rotateY));
  transition: transform 0.3s var(--ease-smooth);
}
.stat-card:hover {
  --rotateX: 5deg;
  --rotateY: -5deg;
}
```

**Gradient Mesh 3D Illusion:**
- Multiple gradient blobs at different z-positions
- Parallax creates depth perception
- Slow rotation of entire container: 0.5deg over 30s

#### Shader Effects (Hero Background Only)

**Animated Gradient Mesh Shader:**
```glsl
// Simplified concept - organic blob movement
uniform float time;
varying vec2 vUv;

void main() {
  vec2 p = vUv;
  float noise = snoise(p * 3.0 + time * 0.1);
  vec3 color1 = vec3(0.0, 0.2, 0.6); // EU Blue
  vec3 color2 = vec3(1.0, 0.8, 0.0); // Gold
  vec3 finalColor = mix(color1, color2, noise * 0.5 + 0.5);
  gl_FragColor = vec4(finalColor, 0.15);
}
```

---

## Section 3: Mission

### Layout

**Diagonal Split Composition:**
- Section divided by 15° diagonal line
- Left side: Text content on light surface
- Right side: Cards on contrasting surface
- Creates dynamic visual tension

**Card Arrangement:**
- 4 cards in staggered 2x2 grid
- Cards offset vertically (odd rows lower)
- Overlapping edges create depth

### Content

**Section Header:**
- Label: "Our Mission"
- Headline: "Fostering Legal Cooperation"
- Subtext: Brief mission statement

**Feature Cards:**
1. **Cross-Border Collaboration** — "Legal expertise exchange between EU and Uzbekistan"
2. **Professional Network** — "Connect with 150+ legal professionals"
3. **Knowledge Sharing** — "Conferences, seminars, and publications"
4. **Career Growth** — "Mentorship and professional development"

### Images

**Card Icons:**
- SVG line icons (48x48px)
- Handshake, Network, Book, Growth symbols
- Stroke width: 2px
- Color: #003399

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Section Label | Slide Right | x: -40px → 0, opacity: 0 → 1 | 500ms | 0ms | expo-out |
| Headline | Split Reveal | Each word fades up | 600ms | 100ms | expo-out |
| Subtext | Fade Up | y: 20px → 0, opacity: 0 → 1 | 500ms | 400ms | expo-out |
| Card 1 | 3D Flip In | rotateY: -90deg → 0, opacity: 0 → 1 | 700ms | 500ms | expo-out |
| Card 2 | 3D Flip In | Same | 700ms | 600ms | expo-out |
| Card 3 | 3D Flip In | Same | 700ms | 700ms | expo-out |
| Card 4 | 3D Flip In | Same | 700ms | 800ms | expo-out |
| Icons | Draw Stroke | stroke-dashoffset: 100 → 0 | 800ms | +200ms each | expo-out |

#### Scroll Effects
| Trigger | Element | Effect | Start | End | Values |
|---------|---------|--------|-------|-----|--------|
| In View | Cards | Stagger Float | 0% | 100% | y: 20px → -20px (staggered) |
| In View | Diagonal Divider | Rotate | 0% | 100% | rotate: 15deg → 12deg |
| In View | Icons | Pulse | 50% | 100% | scale: 1 → 1.1 → 1 (once) |

#### Interaction Effects

**Card Hover (CSS-only 3D):**
```css
.mission-card {
  transform-style: preserve-3d;
  transition: transform 0.4s var(--ease-smooth);
}
.mission-card:hover {
  transform: translateY(-8px) rotateX(5deg);
  box-shadow: 0 20px 40px rgba(0, 51, 153, 0.15);
}
```

**Icon Animation on Hover:**
- Scale: 1 → 1.15
- Color shift: #003399 → #FFCC00
- Duration: 300ms

---

## Section 4: Events

### Layout

**Horizontal Scroll Gallery:**
- Pinned section during horizontal scroll
- Cards arranged in horizontal strip
- Scroll progress drives card movement
- Total scroll distance: 300vw (3 screens worth)

**Card Perspective:**
- Cards slightly rotated toward viewer
- Creates gallery wall effect
- Perspective origin at screen center

### Content

**Section Header:**
- Label: "Upcoming Events"
- Headline: "Join Our Legal Excellence Series"
- CTA: "View All Events"

**Event Cards:**
1. **Tashkent Legal Forum** — September 15, 2025 | Tashkent, Uzbekistan
2. **EU-Uzbekistan Legal Bridge** — October 22, 2025 | Brussels, Belgium
3. **Digital Law Symposium** — November 8, 2025 | Online

### Images

**Event Card 1 - Tashkent Legal Forum:**
- **Resolution:** 800x600 pixels
- **Aspect Ratio:** 4:3
- **Transparent Background:** No
- **Visual Style:** Professional conference photography, modern business style
- **Subject:** Large conference hall with rows of seating, presentation screen displaying blue slide with yellow stars (EU flag colors), wooden podium with microphones on right side
- **Color Palette:** Deep blue (#003399), bright yellow (#FFCC00), neutral grays
- **Generation Prompt:** "Professional conference hall interior, wide-angle view, rows of modern seating facing presentation screen, screen displaying deep blue background with circle of yellow stars, wooden podium with microphones, soft diffused lighting, neutral gray walls, corporate event photography, high resolution, 4:3 aspect ratio"

**Event Card 2 - EU-Uzbekistan Legal Bridge:**
- **Resolution:** 800x600 pixels
- **Aspect Ratio:** 4:3
- **Transparent Background:** No
- **Visual Style:** Documentary photography, professional business setting
- **Subject:** Two people (man and woman) in formal business attire shaking hands across table in modern conference room, large windows with urban skyline visible
- **Color Palette:** Cool blues, grays, neutral tones, subtle warm accents
- **Generation Prompt:** "Business handshake scene, man and woman in formal attire shaking hands across conference table, modern meeting room with large windows showing city skyline, natural daylight, professional atmosphere, cool color palette, documentary style photography, 4:3 aspect ratio"

**Event Card 3 - Digital Law Symposium:**
- **Resolution:** 800x600 pixels
- **Aspect Ratio:** 4:3
- **Transparent Background:** No
- **Visual Style:** Contemporary lifestyle photography, professional workspace
- **Subject:** Young woman with dark hair in light blue blazer sitting at desk with laptop and notebook, engaged in video call, modern home office with bookshelf and plants in background
- **Color Palette:** Soft blues, whites, natural wood tones, green from plants
- **Generation Prompt:** "Professional woman in light blue blazer working on laptop, video call on screen, modern home office setting, bookshelf and plants in background, natural window light, soft color palette, contemporary lifestyle photography, 4:3 aspect ratio"

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Section Header | Fade + Slide | y: 40px → 0, opacity: 0 → 1 | 600ms | 0ms | expo-out |
| "View All" Button | Scale Pop | scale: 0.9 → 1, opacity: 0 → 1 | 400ms | 300ms | elastic |
| Card 1 | Slide from Right | x: 100px → 0, rotateY: 10deg → 0 | 700ms | 400ms | expo-out |
| Card 2 | Slide from Right | Same | 700ms | 550ms | expo-out |
| Card 3 | Slide from Right | Same | 700ms | 700ms | expo-out |

#### Scroll Effects (Horizontal Gallery)
| Trigger | Element | Effect | Start | End | Values |
|---------|---------|--------|-------|-----|--------|
| Pin Start | Container | Pin Section | 0% | 100% | position: fixed |
| Scroll Progress | Cards | Horizontal Move | 0% | 100% | translateX: 0 → -200vw |
| Scroll Progress | Card Images | Parallax | 0% | 100% | translateX offset per card |
| Scroll Progress | Date Badges | Counter Rotate | 0% | 100% | Compensate for card rotation |

#### Interaction Effects

**Card Hover:**
```css
.event-card {
  transition: all 0.4s var(--ease-expo-out);
}
.event-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 30px 60px rgba(0, 51, 153, 0.2);
}
.event-card:hover .event-image {
  transform: scale(1.1);
}
```

**Date Badge Animation:**
- On card hover: badge scales to 1.1
- Background pulses: #003399 → #FFCC00 → #003399
- Duration: 600ms

**Image Reveal:**
- Gradient overlay slides away on hover
- Reveals more vibrant image
- Duration: 500ms

---

## Section 5: CTA (Call to Action)

### Layout

**Immersive Split Design:**
- Left 55%: Content area with angled edge (15° slope)
- Right 45%: Visual element with counter-angle
- Creates dynamic diagonal split
- Content floats above gradient background

**Depth Layers:**
- Background: Animated gradient (blue to darker blue)
- Midground: Abstract 3D shape (parallax)
- Foreground: Content + decorative elements

### Content

**Headline:** "Join UZEURO Today"
**Subheadline:** "Free membership until December 2026"
**Benefits List:**
- ✓ Access to exclusive events
- ✓ Network with 150+ legal professionals
- ✓ Monthly webinar series
- ✓ Professional development resources

**CTA Button:** "Apply for Membership"

### Images

**Decorative 3D Shape:**
- Abstract geometric form (CSS/SVG)
- Positioned on right side
- Glassmorphism effect
- Subtle rotation animation

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Background | Gradient Shift | Start color animation | 10000ms | 0ms | linear loop |
| 3D Shape | Float In | x: 100px → 0, rotate: 20deg → 0, opacity: 0 → 1 | 800ms | 200ms | expo-out |
| Headline | Word Reveal | Staggered word fade up | 600ms | 300ms | expo-out |
| Subheadline | Fade In | opacity: 0 → 1 | 400ms | 600ms | smooth |
| Benefit 1 | Slide + Check | x: -30px → 0, checkmark draws | 500ms | 700ms | expo-out |
| Benefit 2 | Slide + Check | Same | 500ms | 800ms | expo-out |
| Benefit 3 | Slide + Check | Same | 500ms | 900ms | expo-out |
| Benefit 4 | Slide + Check | Same | 500ms | 1000ms | expo-out |
| CTA Button | Scale Pop | scale: 0.9 → 1.05 → 1 | 600ms | 1100ms | elastic |

#### Scroll Effects
| Trigger | Element | Effect | Start | End | Values |
|---------|---------|--------|-------|-----|--------|
| In View | 3D Shape | Rotate | 0% | 100% | rotate: 0 → 15deg |
| In View | Content | Parallax | 0% | 100% | y: 30px → -30px |
| In View | Background | Gradient Shift | 0% | 100% | hue-rotate: 0 → 10deg |

#### Continuous Animations

**Gradient Background:**
```css
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
/* background-size: 200% 200%, duration: 10s */
```

**3D Shape Float:**
- translateY: ±15px over 6s
- rotateZ: ±3deg over 8s
- opacity: 0.9 → 1 → 0.9 over 4s

**Checkmark Pulse:**
- Subtle scale pulse: 1 → 1.1 → 1
- Duration: 2s, staggered starts

---

## Section 6: Partners

### Layout

**Infinite Marquee with Depth:**
- Double-row marquee moving in opposite directions
- Row 1: Left to right (slower)
- Row 2: Right to left (faster)
- Creates dynamic visual interest

**Visual Treatment:**
- Logos grayscale by default
- Color reveal on hover
- Subtle glow effect on active logo

### Content

**Section Header:**
- Label: "Our Partners"
- Headline: "Building Bridges Together"

**Partner Logos:** (Text-based for this implementation)
- European Law Academy (ERA)
- Tashkent State University of Law
- EU Delegation to Uzbekistan
- International law firms

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Section Header | Fade Up | y: 30px → 0, opacity: 0 → 1 | 500ms | 0ms | expo-out |
| Marquee Row 1 | Slide In | x: -100% → 0 | 800ms | 300ms | expo-out |
| Marquee Row 2 | Slide In | x: 100% → 0 | 800ms | 400ms | expo-out |

#### Continuous Animations

**Marquee Movement:**
```css
@keyframes marqueeLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes marqueeRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
/* Row 1: 40s linear, Row 2: 30s linear */
```

**Logo Hover Effect:**
```css
.partner-logo {
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.4s var(--ease-smooth);
}
.partner-logo:hover {
  filter: grayscale(0%);
  opacity: 1;
  transform: scale(1.1);
}
```

---

## Section 7: Webinars

### Layout

**Overlapping Card Stack:**
- Featured webinar as large hero card
- Secondary cards overlap slightly
- Creates magazine-style layout

**Track Toggle Interface:**
- Animated switch between Academic/Professional tracks
- Sliding indicator pill

### Content

**Section Header:**
- Label: "Webinars"
- Headline: "Learn from the Best"
- Subheadline: "Expert-led sessions on EU-Uzbekistan legal topics"

**Track Toggle:** Academic Track | Professional Track

**Featured Webinar:**
- Title: "GDPR Compliance for Uzbek Businesses"
- Speaker: Dr. Sarah Mitchell
- Date: September 28, 2025
- Duration: 90 minutes

**Secondary Webinars:**
1. "International Arbitration Best Practices"
2. "EU Digital Services Act Explained"

### Images

**Webinar Thumbnail:**
- **Resolution:** 1200x800 pixels
- **Aspect Ratio:** 3:2
- **Transparent Background:** No
- **Visual Style:** Professional corporate photography, modern business setting
- **Subject:** Young woman with long dark hair in light blue blazer, white blouse, and glasses sitting at modern desk with laptop and notebook, engaged in video call, modern home office with white bookshelf and green plants in background
- **Color Palette:** Soft blues, whites, natural wood tones, green accents from plants
- **Generation Prompt:** "Professional woman in light blue blazer and glasses working on laptop, video call visible on screen, modern minimalist home office, white bookshelf with books and decor, green houseplants, natural window lighting, soft color palette, professional photography, 3:2 aspect ratio"

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Section Header | Fade Up | y: 40px → 0, opacity: 0 → 1 | 600ms | 0ms | expo-out |
| Track Toggle | Scale In | scale: 0.9 → 1, opacity: 0 → 1 | 400ms | 200ms | elastic |
| Featured Card | Slide Up + Scale | y: 60px → 0, scale: 0.95 → 1 | 700ms | 300ms | expo-out |
| Secondary Card 1 | Slide from Left | x: -60px → 0, opacity: 0 → 1 | 600ms | 500ms | expo-out |
| Secondary Card 2 | Slide from Right | x: 60px → 0, opacity: 0 → 1 | 600ms | 600ms | expo-out |

#### Interaction Effects

**Track Toggle Animation:**
```css
.track-indicator {
  transition: transform 0.4s var(--ease-elastic);
}
/* Slides to active position */
```

**Card Hover:**
```css
.webinar-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 51, 153, 0.2);
}
.webinar-card:hover .play-button {
  transform: scale(1.2);
  background: #FFCC00;
}
```

**Play Button Pulse:**
- Continuous subtle pulse when visible
- Scale: 1 → 1.05 → 1 over 2s
- On hover: pulse intensifies

---

## Section 8: Testimonials

### Layout

**3D Carousel:**
- Cards arranged in circular 3D space
- Active card faces forward
- Side cards rotate away with perspective
- Touch/drag to rotate

**Quote Treatment:**
- Large decorative quotation marks
- Animated draw-in on reveal

### Content

**Section Header:**
- Label: "Testimonials"
- Headline: "What Our Members Say"

**Testimonials:**
1. **Dilshod Kadyrov** — Partner at Kadyrov & Associates
   "UZEURO has been instrumental in expanding our international practice. The networking opportunities are unmatched."

2. **Anna Schmidt** — Legal Advisor, EU Delegation
   "The association bridges gaps I didn't even know existed. Truly transformative for EU-Uzbek legal cooperation."

3. **Prof. Michael Chen** — Tashkent State University of Law
   "My students have gained invaluable insights through UZEURO's webinar series."

### Images

**Avatar Style:**
- Professional headshots
- Circular crop (80px diameter)
- Subtle ring border

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Section Header | Fade Up | y: 30px → 0, opacity: 0 → 1 | 500ms | 0ms | expo-out |
| Quote Marks | Draw In | stroke-dashoffset: 100 → 0 | 800ms | 300ms | expo-out |
| Active Card | 3D Rotate In | rotateY: 45deg → 0, opacity: 0 → 1 | 700ms | 400ms | expo-out |
| Side Cards | Fade In | opacity: 0 → 0.6 | 500ms | 600ms | smooth |
| Navigation Dots | Scale In | scale: 0 → 1 (staggered) | 300ms | 800ms | elastic |

#### Carousel Rotation

**3D Card Transition:**
```css
.testimonial-card {
  transform-style: preserve-3d;
  transition: transform 0.6s var(--ease-expo-out);
}
.card-prev { transform: translateX(-150px) rotateY(35deg) scale(0.85); opacity: 0.5; }
.card-active { transform: translateX(0) rotateY(0) scale(1); opacity: 1; }
.card-next { transform: translateX(150px) rotateY(-35deg) scale(0.85); opacity: 0.5; }
```

**Auto-Rotation:**
- 5 second interval
- Smooth 600ms transition
- Pauses on hover

#### Interaction Effects

**Card Hover:**
- Subtle lift: translateY: -5px
- Shadow expansion
- Quote marks scale: 1 → 1.1

**Navigation Arrows:**
- Scale on hover: 1 → 1.2
- Color shift: #6B7280 → #003399
- Magnetic cursor effect

---

## Section 9: Contact

### Layout

**Asymmetric Split:**
- Left 40%: Contact information
- Right 60%: Contact form
- Overlapping elements create depth
- Form fields have floating label animation

### Content

**Section Header:**
- Label: "Contact"
- Headline: "Get in Touch"
- Subtext: "Have questions? We'd love to hear from you."

**Contact Information:**
- Email: info@uzeuro.uz
- Phone: +998 71 123 4567
- Address: Tashkent, Uzbekistan
- Social: LinkedIn, Twitter, Facebook

**Contact Form:**
- Name (text)
- Email (email, required)
- Subject (select)
- Message (textarea, required)
- Submit Button

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Section Header | Fade Up | y: 30px → 0, opacity: 0 → 1 | 500ms | 0ms | expo-out |
| Contact Info | Stagger Slide | x: -30px → 0, opacity: 0 → 1 | 400ms | 100ms each | expo-out |
| Social Icons | Pop In | scale: 0 → 1 | 300ms | 600ms | elastic |
| Form Container | Slide In | x: 50px → 0, opacity: 0 → 1 | 600ms | 300ms | expo-out |
| Form Fields | Stagger Fade | y: 20px → 0, opacity: 0 → 1 | 400ms | 80ms each | expo-out |
| Submit Button | Scale Pop | scale: 0.9 → 1 | 400ms | 1000ms | elastic |

#### Interaction Effects

**Form Field Focus:**
```css
.form-field {
  position: relative;
  border-bottom: 2px solid #D1D1D9;
  transition: border-color 0.3s var(--ease-smooth);
}
.form-field:focus-within {
  border-color: #003399;
}
.form-field label {
  position: absolute;
  transition: all 0.3s var(--ease-smooth);
}
.form-field:focus-within label,
.form-field.has-value label {
  transform: translateY(-25px) scale(0.85);
  color: #003399;
}
```

**Submit Button States:**
- Default: #003399 background
- Hover: Scale 1.02, shadow expands
- Loading: Spinner replaces text
- Success: Checkmark animation, green flash

**Social Icon Hover:**
- Scale: 1 → 1.2
- Color: #6B7280 → brand color
- Rotation: 0 → 10deg

---

## Section 10: Footer

### Layout

**Layered Depth Footer:**
- Background: Dark with subtle pattern
- Content in 4-column grid
- Subtle parallax on background pattern
- Reveal animation on scroll

### Content

**Column 1 - Brand:**
- Logo: UZEURO
- Description: "Bridging legal communities between Uzbekistan and the European Union."
- Social Icons: LinkedIn, Twitter, Facebook

**Column 2 - Navigation:**
- About
- Events
- Membership
- Publications
- Webinars
- Contact

**Column 3 - Legal:**
- Privacy Policy
- Terms & Conditions
- Cookie Policy

**Column 4 - Contact:**
- Email: info@uzeuro.uz
- Address: Tashkent, Uzbekistan
- EU Office: Brussels, Belgium

**Bottom Bar:**
- Copyright: "© 2025 UZEURO. All rights reserved."

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Background Pattern | Fade In | opacity: 0 → 0.1 | 1000ms | 0ms | smooth |
| Logo | Scale + Fade | scale: 0.9 → 1, opacity: 0 → 1 | 500ms | 200ms | expo-out |
| Column 1 Content | Stagger Up | y: 20px → 0, opacity: 0 → 1 | 400ms | 100ms each | expo-out |
| Column 2 Links | Stagger Up | Same | 400ms | 80ms each | expo-out |
| Column 3 Links | Stagger Up | Same | 400ms | 80ms each | expo-out |
| Column 4 Content | Stagger Up | Same | 400ms | 100ms each | expo-out |
| Bottom Bar | Fade In | opacity: 0 → 1 | 400ms | 800ms | smooth |

#### Interaction Effects

**Link Hover:**
```css
.footer-link {
  position: relative;
  transition: color 0.3s var(--ease-smooth);
}
.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #FFCC00;
  transition: width 0.3s var(--ease-expo-out);
}
.footer-link:hover::after {
  width: 100%;
}
.footer-link:hover {
  color: #FFCC00;
}
```

**Social Icon Hover:**
- Scale: 1 → 1.15
- Background: transparent → rgba(255,204,0,0.2)
- Rotation: 0 → 5deg

---

## Technical Implementation Notes

### Required Libraries

**Core Animation:**
- GSAP 3.x with ScrollTrigger (for complex scroll sequences)
- CSS Scroll-Timeline (progressive enhancement)
- Intersection Observer API (native, for triggering)

**3D Effects:**
- CSS 3D Transforms (primary)
- Three.js (hero shader only, lazy-loaded)

**Utilities:**
- Lenis (smooth scrolling, optional)
- SplitType (text splitting for animations)

### Performance Optimization

**GPU Acceleration:**
```css
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

**Intersection Observer Pattern:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
```

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Critical Performance Rules:**
- ❌ Never animate `width`, `height`, `top`, `left`
- ❌ Never use blur filters during scroll
- ❌ Never call setState in mousemove (React)
- ✅ Use `transform` and `opacity` only
- ✅ Use CSS `:hover` instead of mousemove tracking
- ✅ Throttle scroll handlers to RAF
- ✅ Use `contain: layout style paint` for isolation

### Browser Support

**Feature Detection:**
```javascript
if (CSS.supports('animation-timeline', 'scroll()')) {
  // Use native scroll-driven animations
} else {
  // Fallback to GSAP ScrollTrigger
}
```

**Progressive Enhancement:**
- Base experience works without JS
- Animations enhance but don't block content
- Fallbacks for older browsers

### Responsive Breakpoints

- Desktop: > 991px (full experience)
- Tablet: 768px - 991px (simplified animations)
- Mobile: < 767px (essential animations only)

**Mobile Optimizations:**
- Reduce parallax intensity by 50%
- Disable 3D carousel (use simple slider)
- Remove shader effects
- Reduce stagger counts
- Increase touch targets

---

## Animation Value Reference

### Movement Magnitudes
| Effect Type | Range | Notes |
|-------------|-------|-------|
| Entrance slides | 30-80px | Subtle but noticeable |
| Scale effects | 0.95x - 1.05x | Refined, not jarring |
| Rotations | 5° - 15° | Sophisticated range |
| Parallax depth | 20px - 100px | Multi-layered |
| Hover lifts | 5-12px | Tangible feedback |

### Timing Reference
| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Micro-interaction | 150-200ms | smooth |
| Hover state | 300ms | expo-out |
| Element entrance | 500-700ms | expo-out |
| Section reveal | 800-1000ms | expo-out |
| Continuous ambient | 8000-20000ms | linear/sine |

### Stagger Patterns
| Pattern | Delay | Use Case |
|---------|-------|----------|
| Fast cascade | 50ms | Many small elements |
| Standard | 80-100ms | Cards, list items |
| Dramatic | 150-200ms | Hero elements |
| Wave | Variable (sine) | Organic feel |
