const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const geoip = require('geoip-lite');
const requestIp = require('request-ip');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔍 CONFIGURATION CHECK
if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your-email')) {
    console.warn('\n⚠️  WARNING: EMAIL_USER is missing or default. Email features will FAIL.');
    console.warn('👉  Please edit the .env file in the backend folder.\n');
}
if (!process.env.DISCORD_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL.includes('your-discord-webhook')) {
    console.warn('\n⚠️  WARNING: DISCORD_WEBHOOK_URL is missing or default. Discord notifications will FAIL.\n');
}

// Trust proxies (Crucial for Render/Heroku to get real IPs)
app.set('trust proxy', true);

// Middleware
app.use(cors({
    origin: '*', // Allow all origins (GitHub Pages, Custom Domain, etc.)
    methods: ['GET', 'POST', 'OPTIONS']
})); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw());

// Rate Limiting (Stricter for spam protection)
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000,  // 3 Minutes
  max: 5, 
  message: { success: false, message: 'Rate limit exceeded. Too many requests.' }
});

app.use('/api/contact', limiter);

// 👋 DEFAULT ROUTE (So you don't see "Cannot GET /")
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: monospace; text-align: center; margin-top: 50px; background: #000; color: #0f0; padding: 20px;">
            <h1>⚡ SYSTEM ONLINE ⚡</h1>
            <p>Backend Server is running successfully.</p>
            <p>Status: <span style="color: #00ff88;">OPERATIONAL</span></p>
        </div>
    `);
});

// ⚡ WAKE UP ROUTE (Call this on page load to mitigate cold starts)
app.get('/api/wake-up', (req, res) => {
  res.status(200).json({ status: 'online', message: 'Server is awake and ready.' });
});

const axios = require('axios'); // For Discord Webhook

// Helper: Send to Discord
async function sendToDiscord(messageData, systemInfo) {
    if (!process.env.DISCORD_WEBHOOK_URL) return;

    try {
        await axios.post(process.env.DISCORD_WEBHOOK_URL, {
            embeds: [{
                title: "🚀 New Mission: Incoming Message",
                color: 5793266, // Cyber Green
                fields: [
                    { name: "SENDER", value: messageData.name, inline: true },
                    { name: "EMAIL", value: messageData.email, inline: true },
                    { name: "MESSAGE", value: messageData.message },
                    { name: "📍 INTELLIGENCE", value: systemInfo }
                ],
                footer: { text: "Sarshij's Command Center" },
                timestamp: new Date()
            }]
        });
        console.log("Discord notification sent.");
    } catch (error) {
        console.error("Discord Error:", error.message);
    }
}

// Contact Route
app.post('/api/contact', async (req, res) => {
    console.log('📩 Incoming POST request to /api/contact'); // Debug log
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // --- 🕵️‍♂️ INTELLIGENCE GATHERING ---
    const ip = req.clientIp || req.ip;
    const geo = geoip.lookup(ip);
    const userAgent = req.headers['user-agent'];
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });

    const locationInfo = geo
        ? `${geo.city || 'Unknown City'}, ${geo.region || ''}, ${geo.country || 'Unknown Country'}`
        : 'Localhost / Unknown';

    const systemInfo = `**IP:** ${ip}\n**Loc:** ${locationInfo}\n**Time:** ${timestamp}\n**Device:** ${userAgent}`;

    // Create Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 1. Send Email to Sarshij (Archive)
    const adminMailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `⚡ New Message from ${name}`,
        html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message}</p>
      <hr>
      <h3>🕵️‍♂️ Intelligence Report</h3>
      <pre>${systemInfo}</pre>
    `
    };

    // 2. Send Auto-Reply to User (Confirmation)
    const userAutoReplyOptions = {
        from: `"Sarshij Karn" <${process.env.EMAIL_USER}>`,
        to: email, // Send to the visitor
        subject: `[SYSTEM] Receipt Acknowledged: Ticket #${Date.now().toString().slice(-4)}`,
        html: `
      <div style="background: #000; color: #0f0; font-family: 'Courier New', monospace; padding: 20px;">
        <h2 style="border-bottom: 2px solid #0f0;">📡 TRANSMISSION RECEIVED</h2>
        <p>Greetings ${name},</p>
        <p>My server has successfully intercepted your message. I am currently decoding the data and will establish a neural link (reply) with you shortly.</p>
        <br>
        <p><i>"Technology is best when it brings people together."</i></p>
        <br>
        <p>-- <br>Sarshij Karn<br>Format: Engineering | AI | Cybersec</p>
      </div>
    `
    };

    try {
        // Run all in parallel but handle errors individually
        const results = await Promise.allSettled([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userAutoReplyOptions),
            sendToDiscord({ name, email, message }, systemInfo)
        ]);

        // Log individual failures
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                const services = ['Admin Email', 'User Auto-Reply', 'Discord'];
                console.error(`❌ ${services[index]} failed:`, result.reason.message);
            }
        });

        console.log('✅ Request processed (some services might have failed but response is 200).');
        res.status(200).json({ success: true, message: 'Message received successfully!' });
    } catch (error) {
        console.error('❌ Transmission error:', error);
        res.status(500).json({ success: false, message: 'Transmission failed.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server v2.0 running on http://localhost:${PORT}`);
});
