import * as leadService from "../services/lead.service.js";
import * as XLSX from "xlsx";

export const createLead = async (req, res) => {
    try {
        const lead = await leadService.createLead(req.body);
        res.status(201).json(lead);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

export const getLeads = async (req, res) => {
    try {
        const lead = await leadService.getLeads();
        res.json(lead);

    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

export const getsinglelead = async (req, res) => {
    try {
        const lead = await leadService.getsingleleads(req.params.id);
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.json(lead)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })

    }
}
export const updateLead = async (req, res) => {
    try {
        const lead = await leadService.updateLead(req.params.id, req.body);
        if (!lead) {
            return res.status(404).json({
                error: "Lead Not Found"
            })
        }
        res.json(lead);

    } catch (error) {
        res.status(401).json({
            error: err.message
        })

    }
}

export const deleteLead = async (req, res) => {
    try {
        const lead = await leadService.deleteLead(req.params.id);
        if (!lead) {
            return res.status(404).json({
                error: "Lead Not Found"
            })
        }
        res.json({ message: "Lead Deleted" });

    } catch (error) {
        res.status(401).json({
            error: err.message
        })

    }
}

// Import from Excel
export const importExcel = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        const leads = data.map((row) => {
            const leadData = {
                name: row.Name,
                budget: row.Budget,
                location: row.Location,
                type: row.Type,
                score: row.Score,
                stage: row.Stage || "New Lead",
            };
            leadData.priority = calculatePriority(leadData);  // ✅ set priority
            return leadData;
        });
        await leadService.bulkInsert(leads);
        res.json({ message: "Leads imported successfully", count: leads.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Export to Excel
export const exportExcel = async (req, res) => {
    const leads = await leadService.getLeads();

    const data = leads.map((l) => ({
        Name: l.name,
        Budget: l.budget,
        Location: l.location,
        Type: l.type,
        Score: l.score,
        Stage: l.stage,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=leads.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
};


// Notes
export const addNote = async (req, res) => {
    try {
        const note = await leadService.addNote(req.params.id, req.body);
        res.json(note);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Reminders
export const addReminder = async (req, res) => {
    try {
        const reminder = await leadService.addReminder(req.params.id, req.body);
        res.json(reminder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getReminders = async (req, res) => {
    try {
        const reminders = await leadService.getReminders(req.params.id);
        res.json(reminders);

    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}


export const searchLeads = async (req, res) => {
    try {
        const {
            name, location, score, stage, priority, minBudget, maxBudget,
            page = 1, limit = 10, sortBy = "createdAt", order = "desc"
        } = req.query;
         const filters = { name, location, score, stage, priority, minBudget, maxBudget };

        if (priority) filters.priority = priority;
        if (stage) filters.stage = stage;
        if (score) filters.score = score;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { [sortBy]: order === "asc" ? 1 : -1 }
        };
        const result = await leadService.searchLeads(filters, options);
        res.json(result);
    } catch (error) {
        res.status(404).json({
            error: error.message
        })

    }
}