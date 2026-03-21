import { Router, Request, Response } from 'express';
import Booking from '../models/Booking';
import { sendBookingNotification } from '../services/emailService';

const router = Router();

// Get all bookings
router.get('/', async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create a new booking
router.post('/', async (req: Request, res: Response) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    
    // Send email notification in the background (DO NOT AWAIT)
    sendBookingNotification(savedBooking)
      .then(() => console.log(`✅ Email sent to admin for: ${savedBooking.service}`))
      .catch(err => console.error('❌ Email background error:', err.message));
    
    // Respond instantly to the user
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

export default router;
