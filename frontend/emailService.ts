import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure env variables are loaded from frontend/.env and/or backend/.env
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

const GMAIL_USER = process.env.GMAIL_USER || '';
const GMAIL_PASS = process.env.GMAIL_PASS || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
// The receiving email can be configured via RECEIVING_EMAIL in .env, with fallbacks
const RECEIVING_EMAIL = process.env.RECEIVING_EMAIL || GMAIL_USER;

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

export const generateICS = (booking: any) => {
  try {
    const dateStr = booking.date;
    const timeStr = booking.time;

    const dateObj = new Date(`${dateStr} ${timeStr}`);
    if (isNaN(dateObj.getTime())) {
      console.warn('[ICS] Could not parse exact date/time, generating general invitation:', dateStr, timeStr);
    }

    const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const start = formatICSDate(validDate);
    const end = formatICSDate(new Date(validDate.getTime() + 60 * 60 * 1000)); // 1 hour duration

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PresCode//Portfolio//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${booking.id || Math.random().toString(36).substr(2, 9)}@prescode.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${start}
DTEND:${end}
SUMMARY:Consultation: ${booking.service}
DESCRIPTION:Consultation Session with PresCode.\\n\\nService: ${booking.service}\\nClient: ${booking.name}\\nDate & Time: ${booking.date} at ${booking.time}\\nNotes: ${booking.message || 'None'}
LOCATION:Google Meet / Zoom
STATUS:CONFIRMED
SEQUENCE:0
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${booking.name}:mailto:${booking.email}
ORGANIZER;CN="PresCode":mailto:${GMAIL_USER}
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder: Consultation with PresCode
END:VALARM
END:VEVENT
END:VCALENDAR`;
  } catch (error) {
    console.error('ICS creation failed:', error);
    return null;
  }
};

async function sendMailWithRetry(mailOptions: any, label: string, maxRetries = 2): Promise<void> {
  if (RESEND_API_KEY) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const body: any = {
          from: mailOptions.from,
          to: mailOptions.to,
          subject: mailOptions.subject,
          html: mailOptions.html,
        };

        if (mailOptions.icalEvent) {
          body.attachments = [{
            content: Buffer.from(mailOptions.icalEvent.content).toString('base64'),
            filename: mailOptions.icalEvent.filename || 'invitation.ics',
          }];
        }

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          throw new Error(`Resend API HTTP ${res.status}: ${errText}`);
        }

        console.log(`✅ ${label} sent via Resend API (attempt ${attempt})`);
        return;
      } catch (error: any) {
        console.error(`❌ ${label} via Resend failed (attempt ${attempt}/${maxRetries}):`, error.message);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
          throw error;
        }
      }
    }
    return;
  }

  // Fallback / default: Gmail SMTP
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ ${label} sent via SMTP to: ${mailOptions.to} (attempt ${attempt})`);
      return;
    } catch (error: any) {
      console.error(`❌ ${label} via SMTP failed (attempt ${attempt}/${maxRetries}):`, error.message);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        throw error;
      }
    }
  }
}

export const sendBookingNotification = async (booking: any) => {
  const fromEmail = GMAIL_USER;
  const toReceivingEmails = RECEIVING_EMAIL;

  console.log(`[EmailService] Sending booking emails. Admin destination: ${toReceivingEmails}, Client: ${booking.email}`);

  const icsContent = generateICS(booking);

  const adminMailOptions = {
    from: `"Portfolio Booking System" <${fromEmail}>`,
    to: toReceivingEmails,
    subject: `📅 New Consultation Booking: ${booking.service} - ${booking.name}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">New Booking Received! 🚀</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 15px;">A client has just scheduled a consultation session.</p>
        </div>
        
        <div style="padding: 32px 24px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin-top: 0; margin-bottom: 16px; color: #0f172a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Client Details</h3>
            <p style="margin: 6px 0;"><strong>👤 Name:</strong> ${booking.name}</p>
            <p style="margin: 6px 0;"><strong>✉️ Email:</strong> <a href="mailto:${booking.email}" style="color: #4f46e5; text-decoration: none;">${booking.email}</a></p>
            <p style="margin: 6px 0;"><strong>💼 Service:</strong> <span style="background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 6px; font-weight: bold; font-size: 13px;">${booking.service}</span></p>
            <p style="margin: 6px 0;"><strong>📅 Date:</strong> ${booking.date}</p>
            <p style="margin: 6px 0;"><strong>⏰ Time:</strong> ${booking.time}</p>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
            <h3 style="margin-top: 0; margin-bottom: 8px; color: #0f172a; font-size: 15px;">Client Project Message:</h3>
            <p style="margin: 0; color: #475569; white-space: pre-wrap; background: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 14px;">${booking.message || 'No additional project details provided.'}</p>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${booking.email}?subject=Re: Your Booking for ${encodeURIComponent(booking.service)}" style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 10px; font-size: 14px;">
              Reply to ${booking.name}
            </a>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          Sent automatically from your Portfolio Consultation Booking System
        </div>
      </div>
    `,
    ...(icsContent && {
      icalEvent: {
        filename: 'invitation.ics',
        method: 'request',
        content: icsContent,
      }
    })
  };

  const clientMailOptions = {
    from: `"PresCode Consultation" <${fromEmail}>`,
    to: booking.email,
    subject: `✅ Booking Confirmed: ${booking.service}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Session Confirmed! 🎉</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 15px;">Hi ${booking.name}, your consultation is confirmed.</p>
        </div>
        
        <div style="padding: 32px 24px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin-top: 0; margin-bottom: 12px; color: #0f172a; font-size: 16px;">Meeting Overview</h3>
            <p style="margin: 6px 0;"><strong>Service:</strong> ${booking.service}</p>
            <p style="margin: 6px 0;"><strong>Date:</strong> ${booking.date}</p>
            <p style="margin: 6px 0;"><strong>Time:</strong> ${booking.time}</p>
            <p style="margin: 6px 0;"><strong>Platform:</strong> Google Meet / Zoom</p>
          </div>

          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px;">
            <p style="margin: 0; color: #1e40af; font-weight: bold; font-size: 14px;">📅 Calendar Invitation Attached:</p>
            <p style="margin: 6px 0 0 0; color: #1d4ed8; font-size: 13px;">
              A calendar invite (.ics) is attached to this email. Click it to add this session directly to Google Calendar, Apple Calendar, or Outlook.
            </p>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          Looking forward to speaking with you! — PresCode
        </div>
      </div>
    `,
    ...(icsContent && {
      icalEvent: {
        filename: 'invitation.ics',
        method: 'request',
        content: icsContent,
      }
    })
  };

  try {
    await Promise.all([
      sendMailWithRetry(adminMailOptions, 'Admin booking notification'),
      sendMailWithRetry(clientMailOptions, 'Client booking confirmation')
    ]);
    console.log('✅ All booking emails dispatched successfully');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Email notification failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendContactMessage = async (message: any) => {
  const fromEmail = GMAIL_USER;
  const toReceivingEmails = RECEIVING_EMAIL;

  console.log(`[EmailService] Sending contact lead emails. Admin: ${toReceivingEmails}, Client: ${message.email}`);

  const adminMailOptions = {
    from: `"Portfolio Contact Form" <${fromEmail}>`,
    to: toReceivingEmails,
    subject: `✉️ New Website Message from ${message.fullName || message.name}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800;">New Contact Inquiry 💬</h1>
        </div>
        <div style="padding: 24px;">
          <p><strong>Name:</strong> ${message.fullName || message.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${message.email}">${message.email}</a></p>
          <p><strong>Phone:</strong> ${message.phone || 'N/A'}</p>
          <p><strong>Service Interest:</strong> ${message.service || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 14px; white-space: pre-wrap;">${message.message}</div>
        </div>
      </div>
    `,
  };

  const clientMailOptions = {
    from: `"PresCode" <${fromEmail}>`,
    to: message.email,
    subject: `📩 Message Received: Thanks for reaching out!`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Thank You for Reaching Out!</h1>
        </div>
        <div style="padding: 24px;">
          <p>Hi ${message.fullName || message.name},</p>
          <p>I have received your message regarding <strong>${message.service || 'a project'}</strong> and will get back to you within 24 hours.</p>
          <p>Best regards,<br/><strong>PresCode</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await Promise.all([
      sendMailWithRetry(adminMailOptions, 'Admin contact notification'),
      sendMailWithRetry(clientMailOptions, 'Client contact auto-reply')
    ]);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Contact email failed:', error.message);
    return { success: false, error: error.message };
  }
};

