import mongoose from "mongoose";
const reminderSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    message: { type: String, default: "Follow up with lead" },
    notified: { type: Boolean, default: false }, // To check if reminder is already triggered
});


const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    budget: { type: String },
    location: { type: String },
    type: { type: String, enum: ["Buyer", "Seller", "Renter", "Investor"], default: "Buyer" },
    score: { type: String, enum: ["Hot", "Warm", "Cold"], default: "Warm" },
    stage: { type: String, default: "New Lead" },
    reminders: [reminderSchema],
    notes: [
        {
            text: String,
            createdAt: { type: Date, default: Date.now },
            author: String
        }
    ],
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Low" },
    createdAt: { type: Date, default: Date.now },

});

export default mongoose.model("Lead", leadSchema);
