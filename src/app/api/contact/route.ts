import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Force the route onto the Node.js runtime (Resend uses Node APIs).
export const runtime = 'nodejs';
// Make sure each POST is handled fresh, not cached.
export const dynamic = 'force-dynamic';

// In-memory rate limit keyed by IP. Per-instance only — not bulletproof, but
// enough to slow casual bot spam. For serious abuse, move to upstash redis.
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_MAX = 3; // 3 submissions per IP per minute
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  // --- Rate limit ---
  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 },
    );
  }

  // --- Parse body ---
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const subject = String(body.subject ?? '').trim();
  const message = String(body.message ?? '').trim();
  const honeypot = String(body.website ?? '').trim();

  // --- Honeypot: real users leave this field blank ---
  if (honeypot.length > 0) {
    // Pretend success so the bot moves on; don't actually email.
    return NextResponse.json({ ok: true });
  }

  // --- Validate ---
  if (!name || name.length < 2 || name.length > 100) {
    return NextResponse.json({ error: 'Name must be 2–100 characters.' }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: 'Valid email address required.' }, { status: 400 });
  }
  if (subject && subject.length > 200) {
    return NextResponse.json({ error: 'Subject too long (max 200).' }, { status: 400 });
  }
  if (!message || message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { error: 'Message must be 10–5000 characters.' },
      { status: 400 },
    );
  }

  // --- Send via Resend ---
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const CONTACT_DESTINATION = process.env.CONTACT_DESTINATION_EMAIL || 'contact@lovewebtools.com';
  const CONTACT_FROM = process.env.CONTACT_FROM_EMAIL || 'Love Web Tools <onboarding@resend.dev>';

  if (!RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY missing — email not sent.');
    return NextResponse.json(
      { error: 'Email service is not configured. Please email contact@lovewebtools.com directly.' },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      subject: escapeHtml(subject || '(no subject)'),
      message: escapeHtml(message).replace(/\n/g, '<br>'),
    };

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #1f2937; margin-bottom: 16px;">New contact form submission</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="padding: 8px; background: #f3f4f6; font-weight: 600;">Name</td><td style="padding: 8px;">${safe.name}</td></tr>
          <tr><td style="padding: 8px; background: #f3f4f6; font-weight: 600;">Email</td><td style="padding: 8px;"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
          <tr><td style="padding: 8px; background: #f3f4f6; font-weight: 600;">Subject</td><td style="padding: 8px;">${safe.subject}</td></tr>
        </table>
        <h3 style="color: #1f2937; margin-top: 24px; margin-bottom: 8px;">Message</h3>
        <div style="background: #f9fafb; padding: 16px; border-left: 3px solid #3b82f6; color: #374151; line-height: 1.6;">${safe.message}</div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">Sent from lovewebtools.com/contact · IP: ${escapeHtml(ip)}</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_DESTINATION,
      replyTo: email,
      subject: `[Contact] ${subject || 'New message from ' + name}`,
      html,
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send. Please try again later.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error. Please email contact@lovewebtools.com directly.' },
      { status: 500 },
    );
  }
}
