import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { sendBookingNotification, sendContactMessage, transporter } from "./emailService";

dotenv.config();

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

async function startServer() {
  await ensureBookingsFile();
  
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      emailConfigured: !!(process.env.GMAIL_USER && process.env.GMAIL_PASS),
      receivingEmail: process.env.RECEIVING_EMAIL || process.env.GMAIL_USER,
    });
  });

  // Quick endpoint to test email delivery
  app.get("/api/test-email", async (req, res) => {
    try {
      const target = (req.query.to as string) || process.env.RECEIVING_EMAIL || process.env.GMAIL_USER;
      const info = await transporter.sendMail({
        from: `"Portfolio Test" <${process.env.GMAIL_USER}>`,
        to: target,
        subject: "🧪 Test Email from Portfolio Booking System",
        text: "Congratulations! Your email system is configured properly and delivering messages successfully.",
      });
      res.json({ success: true, messageId: info.messageId, to: target });
    } catch (err: any) {
      console.error("[Test Email] Error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

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
      console.log("[Server] Received booking submission:", req.body);
      const booking = await saveBooking(req.body);
      
      // Dispatch real email notifications with calendar invite
      const emailResult = await sendBookingNotification(booking);
      console.log("[Server] Booking email dispatch complete:", emailResult);

      res.status(201).json({ ...booking, emailResult });
    } catch (error: any) {
      console.error("[Server] Failed to handle booking:", error);
      res.status(500).json({ error: error.message || "Failed to save booking" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      console.log("[Server] Received contact lead submission:", req.body);
      const emailResult = await sendContactMessage(req.body);
      console.log("[Server] Lead email dispatch complete:", emailResult);

      res.status(200).json({ success: true, emailResult });
    } catch (error: any) {
      console.error("[Server] Failed to handle lead:", error);
      res.status(500).json({ error: error.message || "Failed to process lead" });
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
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`✉️ Booking receiving email: ${process.env.RECEIVING_EMAIL || process.env.GMAIL_USER || 'Not configured'}`);
  });
}

startServer();
