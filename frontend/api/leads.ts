import type { IncomingMessage, ServerResponse } from 'http';
import { sendContactMessage } from '../emailService.js';

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
      const data = req.body;
      if (!data || !data.email) {
        return res.status(400).json({ error: 'Missing required lead fields' });
      }

      console.log('[Vercel API /leads] Dispatching lead email for:', data.email);
      const emailResult = await sendContactMessage(data);

      return res.status(200).json({ success: true, emailResult });
    } catch (error: any) {
      console.error('[Vercel API /leads] Error:', error);
      return res.status(500).json({ error: error.message || 'Failed to dispatch lead email' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
