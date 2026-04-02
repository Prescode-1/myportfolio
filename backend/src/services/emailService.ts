import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL/TLS
  pool: true,   // Use connection pooling
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // This MUST be an "App Password"
  },
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
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
ORGANIZER;CN="PresCode":mailto:${process.env.GMAIL_USER}
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

export const sendBookingNotification = async (booking: any) => {
  const icsContent = generateICS(booking);
  const adminEmail = process.env.GMAIL_USER;

  const adminMailOptions = {
    from: `"Portfolio Alerts" <${adminEmail}>`,
    to: adminEmail,
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
    from: `"PresCode Consultation" <${adminEmail}>`,
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
    // Send admin notification first
    await transporter.sendMail(adminMailOptions);
    console.log('✅ Admin notification sent');
    
    // Then send client confirmation
    await transporter.sendMail(clientMailOptions);
    console.log('✅ Client confirmation sent');
    
  } catch (error) {
    console.error('❌ Email notification failed:', error);
    throw error; // Rethrow to let the caller handle it
  }
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
