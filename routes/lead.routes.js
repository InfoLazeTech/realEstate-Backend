import express from "express";
import multer from "multer";
import * as leadController from "../controller/lead.controller.js";
import { validateLead } from "../validation/lead.validation.js";
import { leadSchema } from "../validation/lead.validation.js";

const router = express.Router();
const upload = multer();

router.get("/", leadController.getLeads);
router.get("/search", leadController.searchLeads);
router.get("/:id", leadController.getsinglelead)
router.post("/", validateLead(leadSchema), leadController.createLead);
router.put("/:id", validateLead(leadSchema), leadController.updateLead);
router.delete("/:id", leadController.deleteLead);
router.post("/note/:id", leadController.addNote);
// Notes
router.put("/note/:leadId/:noteId", leadController.editNote);
router.delete("/note/:leadId/:noteId", leadController.deleteNote);
router.post("/reminder/:id", leadController.addReminder);
router.get("/reminder/:id", leadController.getReminders);
// Reminders
router.put("/reminder/:leadId/:reminderId", leadController.editReminder);
router.delete("/reminder/:leadId/:reminderId", leadController.deleteReminder);
router.post("/import", upload.single("file"), leadController.importExcel);
router.get("/export", leadController.exportExcel);




export default router;
