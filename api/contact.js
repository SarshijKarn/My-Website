// Vercel Serverless Function - Contact Form Handler
// This replaces the Express server with a lightweight serverless function

// Import required dependencies
const axios = require('axios');

// Helper function to get client IP
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         'Unknown';
}

// Rate limiting using in-memory store (simple approach)
// For production, consider using Vercel KV or Upstash Redis
const rateLimitStore = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  const record = rateLimitStore.get(ip);
  
  if (now > record.resetTime) {
    // Reset the window
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }

  record.count++;
  return { allowed: true };
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

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

// Main serverless function handler
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  console.log('📩 Incoming contact form submission');

  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required.' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email address.' 
    });
  }

  // Rate limiting
  const ip = getClientIp(req);
  const rateLimitResult = checkRateLimit(ip);
  
  if (!rateLimitResult.allowed) {
    return res.status(429).json({ 
      success: false, 
      message: `Rate limit exceeded. Please try again in ${rateLimitResult.retryAfter} seconds.` 
    });
  }

  // Gather intelligence
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kathmandu',
  });

  const systemInfo = `**IP:** ${ip}\n**Time:** ${timestamp}\n**Device:** ${userAgent}`;

  // Respond immediately
  res.status(200).json({ 
    success: true, 
    message: 'Message received successfully!' 
  });

  // Handle emails asynchronously (don't block response)
  (async () => {
    try {
      // Check if email credentials are configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ Email credentials not configured.');
        return;
      }

      const RESEND_API_KEY = process.env.EMAIL_PASS;
      const SENDER_EMAIL = process.env.EMAIL_USER;
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

      console.log('📤 Sending notifications via Resend API...');

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

        // Discord
        sendToDiscord({ name, email, message }, systemInfo)
          .then(() => ({ type: 'discord', success: true }))
          .catch((e) => ({
            type: 'discord',
            success: false,
            error: e.message,
          })),
      ];

      // Wait for all to complete
      const results = await Promise.allSettled(promises);

      // Log summary
      const summary = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          const types = ['admin', 'user', 'discord'];
          return {
            type: types[index] || 'unknown',
            success: false,
            error: result.reason?.message || 'Unknown error',
          };
        }
      });

      console.log('📊 Notification Summary:');
      summary.forEach((item) => {
        console.log(
          `   ${item.type}: ${item.success ? '✅ SUCCESS' : '❌ FAILED'} ${item.error ? `(${item.error})` : ''}`,
        );
      });

      console.log('✅ All notification attempts completed.');
    } catch (error) {
      console.error('❌ Background email processing error:', error.message);
    }
  })();
};
