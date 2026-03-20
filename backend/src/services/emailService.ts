import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // This MUST be an "App Password" from Google Account settings
  },
  connectionTimeout: 10000, // 10 seconds max wait
  greetingTimeout: 10000,
});

export const sendBookingNotification = async (booking: any) => {
  const mailOptions = {
    from: `"Portfolio Booking" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER, // Send to yourself
    subject: `📅 New Booking: ${booking.service} with ${booking.name}`,
    html: `
      <h2>New Consultation Booking</h2>
      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Service:</strong> ${booking.service}</p>
      <p><strong>Date:</strong> ${booking.date}</p>
      <p><strong>Time:</strong> ${booking.time}</p>
      <hr />
      <p>Please follow up with the client within 24 hours.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
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
