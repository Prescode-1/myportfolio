import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // This MUST be an "App Password" from Google Account settings
  },
  connectionTimeout: 10000, // 10 seconds max wait
  greetingTimeout: 10000,
});

const generateICS = (booking: any) => {
  try {
    // Parse date like "March 23, 2026" and time like "10:00 AM"
    const dateStr = booking.date; // e.g., "March 23, 2026"
    const timeStr = booking.time; // e.g., "10:00 AM"
    
    const dateObj = new Date(`${dateStr} ${timeStr}`);
    
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date/time for ICS generation:', dateStr, timeStr);
      return null;
    }

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const start = formatICSDate(dateObj);
    const end = formatICSDate(new Date(dateObj.getTime() + 60 * 60 * 1000)); // 1 hour duration

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PresCode//Portfolio//EN
METHOD:REQUEST
BEGIN:VEVENT
UID:${booking._id || Math.random().toString(36).substr(2, 9)}
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${start}
DTEND:${end}
SUMMARY:Consultation: ${booking.service}
DESCRIPTION:Consultation with PresCode.\n\nService: ${booking.service}\nClient: ${booking.name}\nNotes: ${booking.message || 'None'}
LOCATION:Google Meet / Zoom
STATUS:CONFIRMED
SEQUENCE:0
ATTENDEE;CN="${booking.name}";RSVP=TRUE:mailto:${booking.email}
ORGANIZER;CN="PresCode":mailto:${process.env.GMAIL_USER}
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder: Consultation with PresCode
END:VALARM
END:VEVENT
END:VCALENDAR`;
  } catch (error) {
    console.error('ICS generation error:', error);
    return null;
  }
};

export const sendBookingNotification = async (booking: any) => {
  const icsContent = generateICS(booking);

  const adminMailOptions = {
    from: `"Portfolio Booking" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `📅 New Booking: ${booking.service} with ${booking.name}`,
    html: `
      <div style="font-family: inherit; line-height: 1.6; color: #334155;">
        <h2 style="color: #0f172a;">New Consultation Booking</h2>
        <div style="background: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <p><strong>Client Name:</strong> ${booking.name}</p>
          <p><strong>Client Email:</strong> ${booking.email}</p>
          <p><strong>Service Type:</strong> ${booking.service}</p>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Message/Notes:</strong> ${booking.message || 'N/A'}</p>
        </div>
        <p style="margin-top: 20px;">Please follow up with the client within 24 hours.</p>
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
    from: `"PresCode Consultation" <${process.env.GMAIL_USER}>`,
    to: booking.email,
    subject: `✅ Booking Confirmed: ${booking.service}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366f1; margin-bottom: 10px;">Booking Confirmed!</h1>
          <p style="font-size: 18px; color: #64748b;">Hi ${booking.name}, your session is scheduled.</p>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <h2 style="margin-top: 0; font-size: 20px; color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">Session Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 120px;">Service</td>
              <td style="padding: 10px 0; color: #1e293b; font-weight: 700;">${booking.service}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Date</td>
              <td style="padding: 10px 0; color: #1e293b; font-weight: 700;">${booking.date}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Time</td>
              <td style="padding: 10px 0; color: #1e293b; font-weight: 700;">${booking.time}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Platform</td>
              <td style="padding: 10px 0; color: #1e293b; font-weight: 700;">Google Meet / Zoom</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #eff6ff; border-radius: 16px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1e40af; font-weight: 600;">What's next?</p>
          <p style="margin: 10px 0 0; color: #1e3a8a; font-size: 14px;">
            I have attached a calendar invitation to this email. Please add it to your calendar to receive a reminder 15 minutes before we start.
          </p>
        </div>
        
        <p style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 40px;">
          If you need to reschedule, please reply to this email at least 24 hours in advance.
        </p>
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

  // Run both in parallel
  return Promise.all([
    transporter.sendMail(adminMailOptions),
    transporter.sendMail(clientMailOptions)
  ]);
};

export const sendContactMessage = async (message: any) => {
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER, // Send to yourself
    subject: `✉️ New Message from ${message.fullName}`,
    html: `
      <h2>New Inquiry from Website</h2>
      <p><strong>Name:</strong> ${message.fullName}</p>
      <p><strong>Email:</strong> ${message.email}</p>
      <p><strong>Phone:</strong> ${message.phone || 'N/A'}</p>
      <p><strong>Interest:</strong> ${message.service || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.message}</p>
      <hr />
      <p>Reply directly to: ${message.email}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
