import { Router, Request, Response } from 'express';
import Lead from '../models/Lead';
import { sendContactMessage } from '../services/emailService';

const router = Router();

// Get all leads
router.get('/', async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Create a new lead from contact form
router.post('/', async (req: Request, res: Response) => {
  try {
    const newLead = new Lead(req.body);
    const savedLead = await newLead.save();
    
    // Send email notification in the background (DO NOT AWAIT)
    sendContactMessage(savedLead)
      .then(() => console.log(`✅ Email sent to admin for lead from: ${savedLead.fullName}`))
      .catch(err => console.error('❌ Email background error:', err.message));
    
    // Respond instantly to the user
    res.status(201).json(savedLead);
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

export default router;
