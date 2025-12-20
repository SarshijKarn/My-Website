# ⚡ Sarshij's Portfolio

![Banner](https://capsule-render.vercel.app/api?type=waving&color=0f172a&height=300&section=header&text=Sarshij%20Karn&fontSize=90&fontColor=00ff88&animation=fadeIn&fontAlignY=38&desc=Engineering%20|%20AI%20|%20Cybersecurity&descAlignY=55&descAlign=50)

> _"Technology is best when it brings people together."_

A high-performance, **Cyberpunk-themed** personal portfolio website featuring 3D interactive elements, neon aesthetics, and a robust custom backend for real-time communication.

---

## 🌟 Key Features

### 🎨 **Frontend Excellence**

- **🌌 Neon Glassmorphism**: Stunning dark UI with glowing effects and blurred glass cards.
- **✨ Interactive Particles**: `tsParticles` integration for a living, breathing background.
- **📱 Fully Responsive**: Optimized for every device from 4K Monitors to Mobile Phones.
- **🚄 GSAP Animations**: Smooth scroll triggers, magnetic tilt effects, and text reveals.
- **🔊 Audio Pronunciation**: Built-in name pronunciation feature.

### 🛡️ **Powerful Backend (Node.js)**

- **🚨 Discord Webhook**: Sends instant rich-embed notifications to your phone when someone contacts you.
- **🤖 AI Auto-Reply**: Immediately confirms receipt to the visitor with a cyber-themed email.
- **🕵️‍♂️ Intelligence Report**: Captures Sender IP, Location, and Device info for security.
- **🟢 Live Status**: Real-time "System Online" indicator in the website footer.
- **🧱 Rate Limiting**: Anti-spam protection limits requests per IP.

---

## 🛠️ Tech Stack

| Domain       | Technologies                                                                                                                                                                                                                                                                                                                                                                                                           |
| :----------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) ![GSAP](https://img.shields.io/badge/GSAP-GreenSock-88CE02?style=flat&logo=greensock&logoColor=white) |
| **Backend**  | ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) ![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=flat) ![Nodemailer](https://img.shields.io/badge/Nodemailer-Sent-0078D4?style=flat)                                                                                                                                                                   |
| **Tools**    | ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) ![Render](https://img.shields.io/badge/Render-Cloud-46E3B7?style=flat) ![Discord](https://img.shields.io/badge/Discord-Webhook-5865F2?style=flat)                                                                                                                                                                                  |

---

## 📂 Project Structure

```bash
My-Website/
├── 📂 assets/              # Images, icons, and static media
├── 📂 backend/             # Node.js API Server
│   ├── node_modules/       # Dependencies (IGNORED)
│   ├── .env                # Secrets: API Keys & Passwords (IGNORED)
│   ├── .env.example        # Template for secrets
│   ├── server.js           # Main Express Logic (Email + Discord + GeoIP)
│   └── package.json        # Backend Config
├── index.html              # Main Portfolio Page
├── script.js               # Frontend Logic (GSAP, Animations, Fetch)
├── style.css               # Core Styles & Tailwind Overrides
├── server-status.css       # Status Indicator Styles
└── project-icons.css       # Custom Icons
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SarshijKarn/My-Website.git
cd My-Website
```

### 2️⃣ Verify Frontend

Simply open `index.html` with **Live Server** in VS Code.

### 3️⃣ Setup Backend (Local Development)

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create your secret configuration file:

- Rename `.env.example` → `.env`
- Add your credentials:
  ```env
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASS=your-google-app-password
  DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
  PORT=3000
  ```

Start the server:

```bash
npm start
```

_You should see: `Server v2.0 running on http://localhost:3000`_

---

## ☁️ Deployment Guide

### **Frontend (GitHub Pages)**

1.  Go to GitHub Repo Settings > Pages.
2.  Source: `Deploy from a branch`.
3.  Branch: `main` / `root`.
4.  Save.

### **Backend (Render.com)**

1.  Create a **New Web Service** on Render.
2.  Connect this repo.
3.  Settings:
    - **Root Directory:** `backend`
    - **Build Command:** `npm install`
    - **Start Command:** `npm start`
4.  **Environment Variables:** Add `EMAIL_USER`, `EMAIL_PASS`, and `DISCORD_WEBHOOK_URL` from your `.env`.

---

## 👨‍💻 Credits

**Designed & Developed with ❤️ by**

# [SARSHIJ KARN](https://sarshijkarn.com.np)

_Visionary Developer | Tech Enthusiast_

---

_© 2025 Sarshij Karn. All Rights Reserved._
