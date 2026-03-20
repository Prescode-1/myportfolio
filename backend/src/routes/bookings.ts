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
    
    // Send actual email notification via Nodemailer
    try {
      await sendBookingNotification(savedBooking);
      console.log(`Email notification sent to pukwedeh@gmail.com for: ${savedBooking.service}`);
    } catch (err) {
      console.error('Email failed to send. Check GMAIL_PASS app password:', err);
    }
    
    console.log("--------------------------");
    
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

export default router;
