import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import leadRoutes from "./routes/lead.routes.js";
import Lead from "./models/lead.model.js"; 
import cron from "node-cron"

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => {
  console.error("❌ MongoDB Error:", err.message);
  process.exit(1);
});
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

app.use("/api/leads", leadRoutes);
// Cron: check reminders every hour
cron.schedule("0 * * * *", async () => {
  const now = new Date();
  const leads = await Lead.find({ "reminders.date": { $lte: now }, "reminders.notified": false });

  leads.forEach(async (lead) => {
    lead.reminders.forEach((reminder) => {
      if (!reminder.notified && reminder.date <= now) {
        console.log(`⏰ Reminder for ${lead.name}: ${reminder.message}`);
        reminder.notified = true;
      }
    });
    await lead.save();
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
