# 🌌 Sarshij Karn - Cyberpunk Portfolio

> A futuristic, highly secure portfolio website built with cutting-edge security and stunning cyberpunk aesthetics.

[![Security: Hardened](https://img.shields.io/badge/Security-Hardened-green.svg)](https://sarshijkarn.com.np)
[![CAPTCHA: Cloudflare Turnstile](https://img.shields.io/badge/CAPTCHA-Turnstile-orange.svg)](https://www.cloudflare.com/products/turnstile/)
[![Rate Limit: 5/hour](https://img.shields.io/badge/Rate%20Limit-5%2Fhour-blue.svg)](https://sarshijkarn.com.np)

---

## 🚀 Features

### 🎨 Design

- **Cyberpunk Neon Aesthetics** with dark mode optimization
- **Responsive Design** across all devices
- **GSAP Animations** for smooth scroll effects
- **Holographic Effects** and neural-aura visuals
- **Cyber Terminal Mode** for CLI enthusiasts

### 🛡️ Security (Enterprise-Grade)

- **Cloudflare Turnstile CAPTCHA** - Bot protection
- **Strict Rate Limiting** - 5 requests/hour per IP
- **XSS Prevention** - All inputs sanitized
- **CORS Whitelisting** - Domain-restricted API
- **Email Validation** - Blocklist for temp/fake emails
- **Math Challenge** in Terminal Mode

### ⚡ Performance

- **Vercel Serverless Backend** - Instant response
- **Static TailwindCSS Build** - No CDN bloat
- **Optimized Images** - WebP format
- **Lazy Loading** - Faster initial load
- **Service Worker** - Offline support

---

## 📁 Project Structure

```
My-Website/
├── api/
│   └── contact.js          # Serverless contact form handler (SECURED)
├── assets/
│   ├── css/
│   │   └── tailwind.css    # Static Tailwind build
│   ├── img/                # Optimized WebP images
│   └── galaxy.mp4          # Background video
├── index.html              # Main HTML (with Turnstile)
├── script.js               # Client-side logic (sanitized)
├── style.css               # Custom cyberpunk styles
├── project-icons.css       # Animated project icons
├── vercel.json             # Vercel config (strict CORS)
└── README.md               # This file
```

---

## 🔧 Setup & Deployment

### 1. Clone Repository

```bash
git clone https://github.com/SarshijKarn/portfolio.git
cd portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file or add to **Vercel Dashboard**:

```env
# Email Service (Resend.com)
EMAIL_USER=your-email@resend.dev
EMAIL_PASS=your-resend-api-key
ADMIN_EMAIL=your-admin-email@gmail.com

# Discord Webhook (Optional)
DISCORD_WEBHOOK_URL=your-discord-webhook-url

# Cloudflare Turnstile (REQUIRED for CAPTCHA)
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
```

### 4. Update Turnstile Site Key

In `index.html` (Line 1231):

```html
<div
  class="cf-turnstile"
  data-sitekey="YOUR_SITE_KEY_HERE"
  data-theme="dark"
></div>
```

### 5. Deploy to Vercel

```bash
vercel --prod
```

Or connect your GitHub repo to Vercel for auto-deployment.

---

## 🧪 Local Development

### Run Development Server

```bash
vercel dev
```

Visit: `http://localhost:3000`

### Build TailwindCSS (if modified)

```bash
npm run build:css
```

---

## 🔐 Security Features Explained

### 1. **Cloudflare Turnstile**

- **What it is**: Free, privacy-friendly CAPTCHA alternative
- **How it works**: Invisible challenge for most users; manual puzzle for bots
- **Implementation**: Client widget + server-side verification

### 2. **Rate Limiting**

- **Current**: 5 requests/hour per IP (in-memory)
- **Recommendation**: Upgrade to Vercel KV/Upstash Redis for distributed tracking

### 3. **XSS Prevention**

- **Client-side**: `escapeHtml()` sanitizes Terminal inputs
- **Server-side**: All form data escaped before email insertion

### 4. **Domain Blocklist**

Blocks submissions from:

- `test.com`, `example.com`
- `tempmail.com`, `mailinator.com`

### 5. **CORS Whitelist**

Only these origins can call the API:

- `https://sarshijkarn.com.np`
- `https://www.sarshijkarn.com.np`
- `http://localhost:3000` (dev)

---

## 📊 Security Audit Results

| Test                     | Status  |
| ------------------------ | ------- |
| Bot Protection (CAPTCHA) | ✅ PASS |
| Rate Limiting (5/hour)   | ✅ PASS |
| XSS Prevention           | ✅ PASS |
| CORS Policy              | ✅ PASS |
| Email Validation         | ✅ PASS |
| Input Sanitization       | ✅ PASS |
| Terminal Math Challenge  | ✅ PASS |

---

## 🎯 Future Enhancements

- [ ] Upgrade to Redis-based rate limiting (Vercel KV)
- [ ] Add CSP headers for script injection prevention
- [ ] Implement honeypot field for bot detection
- [ ] Add IP reputation scoring (IPQualityScore)
- [ ] Enable PostHog analytics for attack tracking
- [ ] Add admin dashboard for contact submissions

---

## 🛠️ Tech Stack

### Frontend

- **HTML5** + **CSS3** + **Vanilla JavaScript**
- **TailwindCSS** (static build)
- **GSAP** for animations
- **Font Awesome** for icons

### Backend

- **Vercel Serverless Functions** (Node.js)
- **Resend API** for email delivery
- **Discord Webhooks** for notifications
- **Cloudflare Turnstile** for bot protection

### Security

- **Cloudflare Turnstile** - CAPTCHA
- **In-Memory Rate Limiting** (5/hour)
- **HTML Sanitization** (XSS prevention)
- **CORS Whitelisting**
- **Email Blocklist**

---

## 📞 Contact

- **Website**: [sarshijkarn.com.np](https://sarshijkarn.com.np)
- **Email**: sarshijkarn333@gmail.com
- **GitHub**: [@SarshijKarn](https://github.com/SarshijKarn)
- **LinkedIn**: [Sarshij Karn](https://www.linkedin.com/in/sarshij-karn-1a7766236/)

---

## 📜 License

This project is licensed under the **ISC License**.

---

## 🙏 Credits

**Designed & Developed by [SARSHIJ KARN](https://sarshijkarn.com.np)**

Built with passion and futuristic vision in Nepal 🇳🇵

---

## 🔗 Quick Links

- [Live Website](https://sarshijkarn.com.np)
- [Security Walkthrough](./walkthrough.md)
- [Implementation Plan](./implementation_plan.md)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Cloudflare Turnstile](https://dash.cloudflare.com)

---

**Last Updated**: January 14, 2026
