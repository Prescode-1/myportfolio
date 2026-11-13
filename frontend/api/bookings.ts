import type { IncomingMessage, ServerResponse } from 'http';
import { sendBookingNotification } from '../emailService.js';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const booking = req.body;
      if (!booking || !booking.email) {
        return res.status(400).json({ error: 'Missing required booking fields' });
      }

      console.log('[Vercel API /bookings] Dispatching notification for:', booking.email);
      const emailResult = await sendBookingNotification(booking);

      return res.status(200).json({ success: true, emailResult });
    } catch (error: any) {
      console.error('[Vercel API /bookings] Error:', error);
      return res.status(500).json({ error: error.message || 'Failed to dispatch email' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
