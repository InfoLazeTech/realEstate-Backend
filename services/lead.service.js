import Lead from "../models/lead.model.js";
import { calculatePriority } from "../utils/calculatepriority.js";

export const createLead = async (data) => {
  // Calculate priority before saving
  const leadData = { ...data };
  leadData.priority = calculatePriority(leadData);
  return await Lead.create(leadData);
};

export const getLeads = async () => {
  return await Lead.find();
};

export const getsingleleads = async (id) => {
  return await Lead.findById(id);
}
// export const updateLead = async (id, data) => {
//   return await Lead.findByIdAndUpdate(id, data, { new: true });
// };

export const updateLead = async (id, data) => {
  const lead = await Lead.findById(id);
  if (!lead) throw new Error("Lead not found");

  Object.assign(lead, data);
  lead.priority = calculatePriority(lead); // recalculate priority
  return await lead.save();
};

export const deleteLead = async (id) => {
  return await Lead.findByIdAndDelete(id);
};

export const bulkInsert = async (leads) => {
  return await Lead.insertMany(leads);

}


export const addNote = async (id, note) => {
  const lead = await Lead.findById(id);
  if (!lead) throw new Error("Lead not found");
  lead.notes.push(note);
  return await lead.save();
};

export const addReminder = async (id, reminder) => {
  const lead = await Lead.findById(id);
  if (!lead) throw new Error("Lead not found");
  lead.reminders.push(reminder);
  return await lead.save();
};

export const getReminders = async (id) => {
  const lead = await Lead.findById(id);
  if (!lead) throw new Error("Lead not found");
  return lead.reminders;
};


export const searchLeads = async (filters,options) => {
  const { page, limit, sort } = options;
  const query = {};
  if (filters.name) {
    query.name = { $regex: filters.name, $options: "i" };
  }

  if(filters.location){
    query.location={ $regex: filters.location, $options:"i"};
  }
  if(filters.score){
    query.score={ $regex : filters.score};
  }
   if (filters.stage) {
    query.stage = filters.stage;
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }
  if(filters.minBudget || filters.maxBudget){
    query.budget={};
    if(filters.minBudget){
      query.budget.$gte = parseInt(filters.minBudget);
    }
      if (filters.maxBudget) {
      query.budget.$lte = parseInt(filters.maxBudget);
    }
  }
 const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    leads,
  };

}