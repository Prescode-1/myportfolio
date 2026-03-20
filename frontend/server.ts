import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOOKINGS_FILE = path.join(__dirname, "bookings.json");

async function ensureBookingsFile() {
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify([]));
  }
}

async function getBookings() {
  const data = await fs.readFile(BOOKINGS_FILE, "utf-8");
  return JSON.parse(data);
}

async function saveBooking(booking: any) {
  const bookings = await getBookings();
  const newBooking = {
    ...booking,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
  return newBooking;
}

// Mock email notification service
async function sendEmailNotification(booking: any) {
  console.log("--- EMAIL NOTIFICATION ---");
  console.log(`To: homeyu324@gmail.com`);
  console.log(`Subject: New Booking: ${booking.service}`);
  console.log(`Message: ${booking.name} (${booking.email}) has booked a session for ${booking.date} at ${booking.time}.`);
  console.log(`Project Details: ${booking.message}`);
  console.log("--------------------------");
  
  // In a real app, you'd use a service like Resend or SendGrid here
  // For now, we'll just log it to the console
}

async function startServer() {
  await ensureBookingsFile();
  
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const booking = await saveBooking(req.body);
      await sendEmailNotification(booking);
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to save booking" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
