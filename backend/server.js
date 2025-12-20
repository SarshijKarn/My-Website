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
app.set('trust proxy', 1); // Use 1 instead of true to fix rate limiter warning

// Middleware
app.use(cors({
    origin: '*', // Allow all origins (GitHub Pages, Custom Domain, etc.)
    methods: ['GET', 'POST', 'OPTIONS']
})); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw());

// Rate Limiting (10 messages per minute) - Fixed trust proxy issue
const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1 Minute
  max: 10, 
  message: { success: false, message: 'Rate limit exceeded. Too many requests. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true, // Explicitly set trust proxy for rate limiter
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

            console.log(`📧 Attempting to send emails using: ${process.env.EMAIL_USER}`);

            // Create Transporter with better Gmail configuration
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // Verify transporter connection with timeout
            try {
                console.log('🔍 Verifying email transporter connection...');
                await Promise.race([
                    transporter.verify(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Transporter verification timeout after 10s')), 10000))
                ]);
                console.log('✅ Email transporter verified successfully');
            } catch (verifyError) {
                console.error('❌ Email transporter verification FAILED:');
                console.error('   Message:', verifyError.message);
                console.error('   Code:', verifyError.code || 'N/A');
                console.error('   This usually means EMAIL_PASS is incorrect or Gmail app password is not set up.');
                console.error('   Full error:', verifyError);
                // Continue anyway - sometimes verify fails but sending works
                console.log('⚠️ Continuing with email sending despite verification failure...');
            }

            // 1. Send Email to Sarshij (Archive) - Use EMAIL_USER as sender
            const adminMailOptions = {
                from: `"Contact Form" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_USER,
                replyTo: email, // This allows replying to the sender
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
                to: email,
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

            // Send emails with timeout and better error handling
            const emailTimeout = 20000; // 20 seconds per email
            
            console.log('📤 Starting to send emails and Discord notification...');
            
            // Send all notifications in parallel with proper error handling
            const promises = [];
            
            // 1. Admin email
            promises.push(
                Promise.race([
                    transporter.sendMail(adminMailOptions),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Admin email timeout after 20s')), emailTimeout))
                ])
                .then(result => {
                    console.log('✅ Admin email sent successfully! Message ID:', result.messageId);
                    return { type: 'admin', success: true };
                })
                .catch(err => {
                    console.error('❌ Admin Email FAILED:');
                    console.error('   Message:', err.message);
                    console.error('   Code:', err.code || 'N/A');
                    if (err.response) {
                        console.error('   Response:', err.response);
                    }
                    return { type: 'admin', success: false, error: err.message };
                })
            );
            
            // 2. User auto-reply
            promises.push(
                Promise.race([
                    transporter.sendMail(userAutoReplyOptions),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('User email timeout after 20s')), emailTimeout))
                ])
                .then(result => {
                    console.log('✅ User auto-reply sent successfully! Message ID:', result.messageId);
                    return { type: 'user', success: true };
                })
                .catch(err => {
                    console.error('❌ User Auto-Reply FAILED:');
                    console.error('   Message:', err.message);
                    console.error('   Code:', err.code || 'N/A');
                    if (err.response) {
                        console.error('   Response:', err.response);
                    }
                    return { type: 'user', success: false, error: err.message };
                })
            );
            
            // 3. Discord notification
            promises.push(
                sendToDiscord({ name, email, message }, systemInfo)
                .then(() => {
                    console.log('✅ Discord notification sent successfully!');
                    return { type: 'discord', success: true };
                })
                .catch(err => {
                    console.error('❌ Discord notification FAILED:');
                    console.error('   Message:', err.message);
                    return { type: 'discord', success: false, error: err.message };
                })
            );
            
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
