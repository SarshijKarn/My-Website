# 🚀 How I Built a Cyberpunk Portfolio with Tailwind & GSAP (From Scratch)

_By **Sarshij Karn** — [sarshijkarn.com.np](https://sarshijkarn.com.np)_

---

When I set out to build my personal portfolio, I didn't just want another "clean" template. I wanted something that screamed **Cyberpunk**, **Future-Tech**, and **Innovation**.

As an Electronics Engineer who codes, I needed a site that felt like a dashboard from a sci-fi movie but loaded instantly on a 3G mobile connection.

Here is the deep dive into how I built [sarshijkarn.com.np](https://sarshijkarn.com.np), achieving a **98/100 Accessibility Score** and perfectly utilizing **Tailwind CSS** + **GSAP**.

## 🎨 The Aesthetic: "Neon-Glass"

The core design philosophy was simple: **Dark Mode Only**.

I used a deep void background (`#0a0a0a`) acts as the canvas for neon accents.

- **Primary Neon**: `#b366ff` (Cyber Purple)
- **Secondary Neon**: `#00fafe` (Electric Cyan)

### The "Glow" Effect with Tailwind

One of my favorite tricks was stacking `drop-shadow` to create a realistic neon glow on text without using images.

```css
/* style.css */
.neon-cyan {
  color: #00fafe;
  text-shadow: 0 0 4px rgb(0 250 254 / 0.35), 0 0 8px rgb(0 250 254 / 0.1);
}
```

This simple CSS class gives that "humming electric light" vibe to my stats and headings.

## ⚡ The Tech Stack

- **HTML5**: Semantic & Accessible (Main landmarks, Aria-labels).
- **Tailwind CSS**: For rapid utility-first styling.
- **GSAP (GreenSock)**: For high-performance, timeline-based animations.
- **Vanilla JS**: No heavy frameworks (React/Vue) needed for a static portfolio.

## 🎞️ Animations with GSAP

I utilized `GSAP ScrollTrigger` to reveal elements as the user explores the page. The key was checking for device types to ensure mobile users didn't get overwhelmed.

```javascript
/* script.js snippet */
const isMobile = window.innerWidth <= 768;

gsap.from(".hero-content-left", {
  duration: 1,
  x: -50, // Slide in from left
  opacity: 0,
  ease: "power2.out",
  delay: 0.2,
});
```

This logic creates a smooth entrance for the Hero section, validating the visitor's attention immediately.

## 🦾 Accessibility (A11y) Matters

A portfolio is useless if people can't navigate it. I spent time optimizing for screen readers:

1.  **Semantic Landmarks**: Wrapping content in `<main>` tags.
2.  **Color Contrast**: I manually tweaked my Neon colors (e.g., brightening `#8a2be2` to `#b366ff`) to ensure they passed the **4.5:1** contrast ratio on dark backgrounds.
3.  **Labels**: Adding `aria-label="Sidebar Navigation"` to the sidebar so users know exactly where they are.

## 📈 The Result

The final result is a blazingly fast, highly interactive site that represents my personality as an engineer.

You can check out the live site here: **[sarshijkarn.com.np](https://sarshijkarn.com.np)**

If you are an aspiring dev, I highly recommend building your own site "from scratch" at least once. It teaches you the fundamentals that frameworks often hide!

---

_Connect with me on [GitHub](https://github.com/SarshijKarn) or [LinkedIn](https://www.linkedin.com/in/sarshij-karn-1a7766236/)!_
