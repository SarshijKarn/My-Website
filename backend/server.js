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
const requiredEnv = ['EMAIL_USER', 'EMAIL_PASS', 'ADMIN_EMAIL', 'DISCORD_WEBHOOK_URL'];
requiredEnv.forEach(env => {
    if (!process.env[env] || process.env[env].includes('your-')) {
        console.warn(`\n⚠️  WARNING: ${env} is missing or default. Systems will FAIL.`);
        console.warn('👉  Please update the Environment Variables in Render or your local .env file.\n');
    }
});

// Trust proxies (Crucial for Render/Heroku to get real IPs)
app.set('trust proxy', 1); // Use 1 instead of true to fix rate limiter warning

// Middleware
app.use(cors({
    origin: '*', // Allow all origins (GitHub Pages, Custom Domain, etc.)
    methods: ['GET', 'POST', 'OPTIONS']
})); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw());

// Rate Limiting (10 messages per minute)
// Note: trustProxy is handled by app.set('trust proxy', 1) above, not needed here
const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1 Minute
  max: 10, 
  message: { success: false, message: 'Rate limit exceeded. Too many requests. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
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
    if (!process.env.DISCORD_WEBHOOK_URL) {
        console.warn('⚠️ DISCORD_WEBHOOK_URL not configured. Skipping Discord notification.');
        return;
    }

    try {
        console.log('📤 Sending Discord notification...');
        const response = await axios.post(process.env.DISCORD_WEBHOOK_URL, {
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
        }, {
            timeout: 10000 // 10 second timeout
        });
        console.log("✅ Discord notification sent successfully. Status:", response.status);
    } catch (error) {
        console.error("❌ Discord Error:");
        console.error("   Message:", error.message);
        console.error("   Code:", error.code || 'N/A');
        if (error.response) {
            console.error("   Response status:", error.response.status);
            console.error("   Response data:", error.response.data);
        }
        throw error; // Re-throw so caller knows it failed
    }
}

// Contact Route
app.post('/api/contact', async (req, res) => {
    console.log('📩 Incoming POST request to /api/contact'); // Debug log
    const { name, email, message } = req.body;

    // Validate input
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

    // RESPOND IMMEDIATELY - Don't wait for emails
    res.status(200).json({ success: true, message: 'Message received successfully!' });

    // Handle emails asynchronously (don't block response)
    (async () => {
        try {
            // Check if email credentials are configured
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.warn('⚠️ Email credentials not configured. Skipping email sending.');
                console.warn(`EMAIL_USER: ${process.env.EMAIL_USER ? 'SET' : 'MISSING'}`);
                console.warn(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET' : 'MISSING'}`);
                return;
            }

            console.log(`📧 Notification Protocol initialized using: ${process.env.EMAIL_USER}`);

            // ---------------------------------------------------------
            // 🚀 RESEND API INTEGRATION (Direct & Reliable)
            // ---------------------------------------------------------
            const RESEND_API_KEY = process.env.EMAIL_PASS; // Using existing variable for simplicity
            
            // Pull details from Environment Variables for security
            const SENDER_EMAIL = process.env.EMAIL_USER; 
            const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

            console.log(`📤 Sending notifications via Resend API...`);

            // 1. Admin Email Payload
            const adminEmailPayload = {
                from: `Portfolio <${SENDER_EMAIL}>`,
                to: [ADMIN_EMAIL],
                reply_to: email,
                subject: `⚡ New Message from ${name}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #00ff88;">New Contact Form Submission</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Message:</strong><br>${message}</p>
                        <hr>
                        <h3>🕵️‍♂️ Intelligence Report</h3>
                        <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${systemInfo}</pre>
                    </div>
                `
            };

            // 2. User Auto-Reply Payload
            const ticketId = `ACK-${Math.random().toString(36).toUpperCase().substring(2, 8)}`;
            const userAutoReplyPayload = {
                from: `Sarshij Karn <${SENDER_EMAIL}>`,
                to: [email],
                subject: `[Receipt Acknowledged] Transmission ${ticketId}`,
                html: `
                <div style="background-color: #050505; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #1a1a1a; border-radius: 8px;">
                    <div style="border-bottom: 2px solid #00ff88; padding-bottom: 20px; margin-bottom: 30px;">
                        <h1 style="color: #00ff88; margin: 0; font-size: 24px; letter-spacing: 2px;">SYSTEM ACKNOWLEDGMENT</h1>
                        <p style="color: #888; margin: 5px 0 0 0; font-size: 12px;">ENCRYPTED TRANSMISSION // ${ticketId}</p>
                    </div>
                    <p style="font-size: 16px;">Greetings <strong style="color: #00ff88;">${name}</strong>,</p>
                    <p>My neural network has successfully intercepted your transmission. Your message has been logged into the terminal and is currently awaiting manual decryption.</p>
                    <div style="background: #111; border-left: 3px solid #00ff88; padding: 15px; margin: 25px 0; color: #ccc; font-style: italic;">
                        "The best way to predict the future is to invent it."
                    </div>
                    <p>Expect a direct link established at <span style="color: #00ff88;">${email}</span> once the data has been analyzed.</p>
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1a1a1a; font-size: 13px; color: #555;">
                        <p style="margin: 0;">--</p>
                        <p style="margin: 5px 0; font-weight: bold; color: #888;">SARSHIJ KARN</p>
                        <p style="margin: 0;">Full-Stack Developer | AI Enthusiast | Cybersec Explorer</p>
                    </div>
                </div>
                `
            };

            // Send via Axios in parallel
            const headers = { 
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json' 
            };

            const promises = [
                // Admin Email
                axios.post('https://api.resend.com/emails', adminEmailPayload, { headers })
                    .then(r => ({ type: 'admin', success: true, id: r.data.id }))
                    .catch(e => ({ type: 'admin', success: false, error: e.response?.data?.message || e.message })),
                
                // User Auto-Reply
                axios.post('https://api.resend.com/emails', userAutoReplyPayload, { headers })
                    .then(r => ({ type: 'user', success: true, id: r.data.id }))
                    .catch(e => ({ type: 'user', success: false, error: e.response?.data?.message || e.message })),
                
                // Discord (Existing)
                sendToDiscord({ name, email, message }, systemInfo)
                    .then(() => ({ type: 'discord', success: true }))
                    .catch(e => ({ type: 'discord', success: false, error: e.message }))
            ];
            
            // Wait for all to complete
            const results = await Promise.allSettled(promises);
            
            // Log summary
            const summary = results.map((result, index) => {
                if (result.status === 'fulfilled') {
                    return result.value;
                } else {
                    const types = ['admin', 'user', 'discord'];
                    return { type: types[index] || 'unknown', success: false, error: result.reason?.message || 'Unknown error' };
                }
            });
            
            console.log('📊 Notification Summary:');
            summary.forEach(item => {
                console.log(`   ${item.type}: ${item.success ? '✅ SUCCESS' : '❌ FAILED'} ${item.error ? `(${item.error})` : ''}`);
            });
            
            console.log('✅ All notification attempts completed.');
        } catch (error) {
            console.error('❌ Background email processing error:');
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Full error:', error);
        }
    })();
});

app.listen(PORT, () => {
    console.log(`Server v2.0 running on http://localhost:${PORT}`);
});
