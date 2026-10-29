import nodemailer from "nodemailer";

/**
 * SMTP mail sending. Configured through env vars (set in Hostinger → Deployments → Settings):
 *   SMTP_HOST (e.g. smtp.hostinger.com), SMTP_PORT (465 = SSL, 587 = STARTTLS),
 *   SMTP_USER, SMTP_PASS, MAIL_FROM (e.g. "RURAL-CONNECT <noreply@ruralconnect-app.eu>").
 * When they are missing, sending is skipped (never throws) so the app keeps working.
 */
export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

export type MailMessage = { to: string; subject: string; html: string; text: string };

export async function sendMail(msg: MailMessage): Promise<{ ok: boolean; error?: string }> {
  if (!mailConfigured()) return { ok: false, error: "Email is not configured." };
  try {
    await getTransporter().sendMail({
      from: process.env.MAIL_FROM || `RURAL-CONNECT <${process.env.SMTP_USER}>`,
      ...msg,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not send the email." };
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Sends messages one after another with a small pause, so a big import stays
 * well under the mail host's sending rate limits. Failures are logged, never thrown.
 */
export async function sendMailBatch(messages: MailMessage[], gapMs = 1500) {
  let sent = 0;
  const failed: { to: string; error: string }[] = [];
  for (const m of messages) {
    const r = await sendMail(m);
    if (r.ok) sent++;
    else failed.push({ to: m.to, error: r.error ?? "unknown" });
    await sleep(gapMs);
  }
  console.log(`[mail] batch done: ${sent} sent, ${failed.length} failed`);
  for (const f of failed) console.error(`[mail] failed → ${f.to}: ${f.error}`);
  return { sent, failed };
}

/** Public base URL of the app, without a trailing slash. */
export function appUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "https://ruralconnect-app.eu").replace(/\/$/, "");
}
