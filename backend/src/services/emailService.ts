import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Validate email config on module load
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

if (!GMAIL_USER || !GMAIL_PASS) {
  console.error('⚠️ WARNING: GMAIL_USER or GMAIL_PASS environment variables are missing!');
  console.error('⚠️ Email notifications will NOT work.');
  console.error('⚠️ Set these in your Render dashboard under Environment Variables.');
}

// Create transporter with timeout settings
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
  // Connection timeouts to prevent hanging
  connectionTimeout: 10000, // 10s to connect
  greetingTimeout: 10000, // 10s for greeting
  socketTimeout: 15000, // 15s for socket operations
});

const generateICS = (booking: any) => {
  try {
    const dateStr = booking.date; 
    const timeStr = booking.time; 
    
    // Attempt to parse date
    const dateObj = new Date(`${dateStr} ${timeStr}`);
    
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date/time for ICS:', dateStr, timeStr);
      return null;
    }

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const start = formatICSDate(dateObj);
    const end = formatICSDate(new Date(dateObj.getTime() + 60 * 60 * 1000)); // 1 hour

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PresCode//Portfolio//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${booking._id ? booking._id.toString() : Math.random().toString(36).substr(2, 9)}@prescode.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${start}
DTEND:${end}
SUMMARY:Consultation: ${booking.service}
DESCRIPTION:Consultation with PresCode.\\n\\nService: ${booking.service}\\nClient: ${booking.name}\\nNotes: ${booking.message || 'None'}
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

// Helper: send a single email with retry
async function sendMailWithRetry(mailOptions: any, label: string, maxRetries = 2): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ ${label} sent (attempt ${attempt})`);
      return;
    } catch (error: any) {
      console.error(`❌ ${label} failed (attempt ${attempt}/${maxRetries}):`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        throw error;
      }
    }
  }
}

export const sendBookingNotification = async (booking: any) => {
  // Guard: skip if email is not configured
  if (!GMAIL_USER || !GMAIL_PASS) {
    console.error('❌ Email not configured — skipping booking notification');
    return;
  }

  const icsContent = generateICS(booking);

  const adminMailOptions = {
    from: `"Portfolio Alerts" <${GMAIL_USER}>`,
    to: GMAIL_USER,
    subject: `📅 New Booking: ${booking.service} with ${booking.name}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #334155;">
        <h2 style="color: #0f172a;">New Consultation Booking Received</h2>
        <div style="background: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <p><strong>Client:</strong> ${booking.name}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Service:</strong> ${booking.service}</p>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Message:</strong> ${booking.message || 'N/A'}</p>
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
    from: `"PresCode Consultation" <${GMAIL_USER}>`,
    to: booking.email,
    subject: `✅ Booking Confirmed: ${booking.service}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin: 40px 0;">
          <h1 style="color: #6366f1;">Session Confirmed!</h1>
          <p style="font-size: 18px;">Hi ${booking.name}, your consultation has been booked successfully.</p>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0;">
          <h2 style="margin-top: 0; color: #1e293b;">Meeting Details</h2>
          <p><strong>Service:</strong> ${booking.service}</p>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Platform:</strong> Google Meet / Zoom</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #eff6ff; border-radius: 16px;">
          <p style="margin: 0; color: #1e40af; font-weight: bold;">Important:</p>
          <p style="margin: 10px 0 0; color: #1e3a8a; font-size: 14px;">
            A calendar invitation is attached to this email. Please add it to your calendar to receive a reminder before we start.
          </p>
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
    // Send admin notification first (with retry)
    await sendMailWithRetry(adminMailOptions, 'Admin booking notification');
    
    // Then send client confirmation (with retry)
    await sendMailWithRetry(clientMailOptions, 'Client booking confirmation');
    
    console.log('✅ All booking emails sent successfully');
  } catch (error) {
    console.error('❌ Email notification failed after retries:', error);
    // Don't rethrow — the booking is already saved, email is best-effort
  }
};

export const sendContactMessage = async (message: any) => {
  // Guard: skip if email is not configured
  if (!GMAIL_USER || !GMAIL_PASS) {
    console.error('❌ Email not configured — skipping contact notification');
    return;
  }

  const adminMailOptions = {
    from: `"Portfolio Lead" <${GMAIL_USER}>`,
    to: GMAIL_USER,
    subject: `✉️ New Message from ${message.fullName}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #334155;">
        <h2 style="color: #0f172a;">New Website Inquiry</h2>
        <div style="background: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <p><strong>Name:</strong> ${message.fullName}</p>
          <p><strong>Email:</strong> ${message.email}</p>
          <p><strong>Phone:</strong> ${message.phone || 'N/A'}</p>
          <p><strong>Interest:</strong> ${message.service || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message.message}</p>
        </div>
      </div>
    `,
  };

  const clientMailOptions = {
    from: `"PresCode Consultation" <${GMAIL_USER}>`,
    to: message.email,
    subject: `📩 Message Received: Thanks for reaching out!`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin: 40px 0;">
          <h1 style="color: #6366f1;">Message Received!</h1>
          <p style="font-size: 18px;">Hi ${message.fullName}, thanks for getting in touch.</p>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0;">
          <p>I've received your message regarding <strong>${message.service || 'a project'}</strong> and I'll review it shortly.</p>
          <p>You can expect a response from me at this email address within the next 24 hours.</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
          <p>Best regards,<br /><strong>PresCode</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await sendMailWithRetry(adminMailOptions, 'Admin contact notification');
    await sendMailWithRetry(clientMailOptions, 'Client auto-reply');
    console.log('✅ Contact emails sent successfully');
  } catch (error) {
    console.error('❌ Contact email failure after retries:', error);
    // Don't rethrow — the lead is already saved, email is best-effort
  }
};
