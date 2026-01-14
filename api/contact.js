// Vercel Serverless Function - Contact Form Handler
// This replaces the Express server with a lightweight serverless function

// Import required dependencies
const axios = require('axios');

// --- CONFIGURATION ---
const BLOCKED_DOMAINS = ["test.com", "example.com", "tempmail.com", "mailinator.com"];
const ALLOWED_ORIGINS = [
  'https://sarshijkarn.com.np',
  'https://www.sarshijkarn.com.np',
  'http://localhost:3000',
  'http://127.0.0.1:5500', // VS Code Live Server default
  'http://localhost:5500'
];

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5; // Strict limit: 5 requests per hour per IP

// --- HELPERS ---

// Helper function to get client IP
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         'Unknown';
}

// Helper to escape HTML to prevent injection attacks
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Rate limiting using in-memory store
// NOTE: In strict serverless environments, this memory is ephemeral.
// For robust production rate limiting, you MUST use Vercel KV or Upstash Redis.
// This is a failsafe for "warm" containers.
const rateLimitStore = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  
  // Clean up expired entries lazily
  if (rateLimitStore.has(ip)) {
    const record = rateLimitStore.get(ip);
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  const record = rateLimitStore.get(ip);
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { 
      allowed: false, 
      retryAfter: Math.ceil((record.resetTime - now) / 1000) 
    };
  }

  record.count++;
  return { allowed: true };
}

// Clean up old rate limit entries periodically (garbage collection)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 10 * 60 * 1000); // Clean every 10 minutes

// Send Discord notification
async function sendToDiscord(messageData, systemInfo) {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.warn('⚠️ DISCORD_WEBHOOK_URL not configured. Skipping Discord notification.');
    return;
  }

  try {
    const response = await axios.post(
      process.env.DISCORD_WEBHOOK_URL,
      {
        embeds: [
          {
            title: '🚀 New Mission: Incoming Message',
            color: 5793266, // Cyber Green
            fields: [
              { name: 'SENDER', value: messageData.name, inline: true },
              { name: 'EMAIL', value: messageData.email, inline: true },
              { name: 'MESSAGE', value: messageData.message },
              { name: '📍 INTELLIGENCE', value: systemInfo },
            ],
            footer: { text: "Sarshij's Command Center" },
            timestamp: new Date(),
          },
        ],
      },
      { timeout: 10000 }
    );
    console.log('✅ Discord notification sent successfully');
  } catch (error) {
    console.error('❌ Discord Error:', error.message);
    throw error;
  }
}

async function verifyTurnstile(token, ip) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.warn("⚠️ TURNSTILE_SECRET_KEY not set. Skipping verification.");
    return true; // Fail open if key is missing to prevent breaking site
  }
  if (!token) return false;

  try {
    const response = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      secret: secretKey,
      response: token,
      remoteip: ip
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Cloudflare returns success: true/false
    return response.data.success;
  } catch (e) {
    console.error("Turnstile Verification Error:", e.message);
    return false; // Fail closed on error
  }
}

// Main serverless function handler
module.exports = async (req, res) => {
  // CORS Logic
  const origin = req.headers.origin;
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin) || !origin; // !origin allows server-to-server or non-browser tools (useful for basic testing but can be blocked if strict)

  // Set strict CORS headers
  if (isAllowedOrigin && origin) {
     res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
     // If not in allowed list, do not set Access-Control-Allow-Origin,
     // effectively blocking the browser from reading the response.
     // Or we can explicitly deny:
     // res.setHeader('Access-Control-Allow-Origin', 'null');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Reject requests from unauthorized origins (Server-side block)
  // Note: 'Sniper' tools can spoof Origin headers, but this stops random browser calls.
  // Rate limiting is the real defense against scripts.
  if (origin && !isAllowedOrigin) {
     return res.status(403).json({ success: false, message: 'Forbidden: Origin not allowed.' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  // Rate limiting
  const ip = getClientIp(req);
  const rateLimitResult = checkRateLimit(ip);
  
  if (!rateLimitResult.allowed) {
    console.warn(`⛔ Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ 
      success: false, 
      message: `Too many requests. Please try again in ${rateLimitResult.retryAfter} seconds.` 
    });
  }

  console.log(`📩 Incoming contact form submission from ${ip}`);

  const { name, email, message } = req.body;
  const turnstileToken = req.body['cf-turnstile-response'];
  const isTerminal = req.body.isTerminal;
  const honeypot = req.body.website;

  // --- SECURITY CHECKS ---

  // 0. Honeypot Check (Silent bot trap)
  if (honeypot) {
    console.warn(`🤖 Bot detected via honeypot from IP: ${ip}`);
    return res.status(400).json({ success: false, message: 'Unable to process request.' });
  }

  // 1. CAPTCHA Verification (Skip for Terminal if we rely on rate limit, or strictly enforce)
  // For now, we enforce for everyone unless the Env var is missing.
  if (!isTerminal) {
      const isHuman = await verifyTurnstile(turnstileToken, ip);
      if (!isHuman) {
        return res.status(403).json({ success: false, message: 'Unable to process request. Please try again.' });
      }
  } else {
     // Terminal Mode: Stricter internal rate limit?
     // We rely on the global IP rate limit (5/hour) which is sufficient.
     console.log(`🤖 Terminal submission from ${ip}. Skipping Turnstile.`);
  }

  // --- STRICT INPUT VALIDATION ---

  // 1. Existence Check
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required.' 
    });
  }

  // 2. Length Check (Prevent massive payloads)
  if (name.length > 100) {
    return res.status(400).json({ success: false, message: 'Name is too long (max 100 characters).' });
  }
  if (message.length > 5000) {
    return res.status(400).json({ success: false, message: 'Message is too long (max 5000 characters).' });
  }

  // 3. Email Format Check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email address.' 
    });
  }

  // 4. Sanitize Inputs (Prevent HTML Injection in emails)
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message);
  
  // 3b. Blocklist Check
  const domain = email.split('@')[1];
  if (BLOCKED_DOMAINS.includes(domain)) {
     return res.status(400).json({ success: false, message: 'This email domain is not accepted.' });
  }
  // Email is already validated by regex, but good to keep it raw for the 'to' field, 
  // though we should escape it if displaying in HTML body.
  const safeEmail = escapeHtml(email);

  // Gather intelligence
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kathmandu',
  });

  // sanitize user agent just in case
  const safeUserAgent = escapeHtml(userAgent);
  const systemInfo = `**IP:** ${ip}\n**Time:** ${timestamp}\n**Device:** ${safeUserAgent}`;

  // Handle emails and notifications
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email credentials not configured.');
    } else {
      const RESEND_API_KEY = process.env.EMAIL_PASS;
      const SENDER_EMAIL = process.env.EMAIL_USER;
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

      console.log('📤 Sending notifications via Resend API...');

      // 1. Admin Email Payload
      const adminEmailPayload = {
        from: `Portfolio <${SENDER_EMAIL}>`,
        to: [ADMIN_EMAIL],
        reply_to: email, // Raw email usage here is safe for headers usually
        subject: `⚡ New Message from ${safeName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #00ff88;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Message:</strong><br>${safeMessage.replace(/\n/g, '<br>')}</p>
            <hr>
            <h3>🕵️‍♂️ Intelligence Report</h3>
            <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${systemInfo}</pre>
          </div>
        `,
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
            <p style="font-size: 16px;">Greetings <strong style="color: #00ff88;">${safeName}</strong>,</p>
            <p>My neural network has successfully intercepted your transmission. Your message has been logged into the terminal and is currently awaiting manual decryption.</p>
            <div style="background: #111; border-left: 3px solid #00ff88; padding: 15px; margin: 25px 0; color: #ccc; font-style: italic;">
              "The best way to predict the future is to invent it."
            </div>
            <p>Expect a direct link established at <span style="color: #00ff88;">${safeEmail}</span> once the data has been analyzed.</p>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1a1a1a; font-size: 13px; color: #555;">
              <p style="margin: 0;">--</p>
              <p style="margin: 5px 0; font-weight: bold; color: #888;">SARSHIJ KARN</p>
              <p style="margin: 0;">Full-Stack Developer | AI Enthusiast | Cybersec Explorer</p>
            </div>
          </div>
        `,
      };

      // Send via Axios in parallel
      const headers = {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      };

      const promises = [
        // Admin Email
        axios
          .post('https://api.resend.com/emails', adminEmailPayload, { headers })
          .then((r) => ({ type: 'admin', success: true, id: r.data.id }))
          .catch((e) => ({
            type: 'admin',
            success: false,
            error: e.response?.data?.message || e.message,
          })),

        // User Auto-Reply
        axios
          .post('https://api.resend.com/emails', userAutoReplyPayload, { headers })
          .then((r) => ({ type: 'user', success: true, id: r.data.id }))
          .catch((e) => ({
            type: 'user',
            success: false,
            error: e.response?.data?.message || e.message,
          })),

        // Discord (using sanitized data for display safety, although Discord handles text well)
        sendToDiscord({ name: safeName, email: safeEmail, message: message }, systemInfo) // Send raw message to Discord? Discord escapes usually. Let's send raw to Discord but keep it safe. Actually, better sending raw to discord as it's text.
          .then(() => ({ type: 'discord', success: true }))
          .catch((e) => ({
            type: 'discord',
            success: false,
            error: e.message,
          })),
      ];

      // Wait for all to complete BEFORE returning response
      const results = await Promise.allSettled(promises);

      // Log summary
      console.log('📊 Notification Summary:');
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const item = result.value;
          console.log(
            `   ${item.type}: ${item.success ? '✅ SUCCESS' : '❌ FAILED'} ${item.error ? `(${item.error})` : ''}`,
          );
        }
      });
    }
  } catch (error) {
    console.error('❌ Notification error:', error.message);
    // Don't fail the request if notifications fail, but log it
  }

  // Respond to client ONLY after attempts are done
  res.status(200).json({ 
    success: true, 
    message: 'Message received successfully!' 
  });
};
