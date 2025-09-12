// Calculate priority based on score, stage, and budget
export const calculatePriority = (lead) => {
  let priority = "Low";

  // Score weight
  if (lead.score === "🔥 Hot") priority = "High";
  else if (lead.score === "⚡ Warm") priority = "Medium";

  // Stage weight (optional: treat later stages as higher priority)
  const highStages = ["Negotiation", "Closing"];
  if (highStages.includes(lead.stage) && priority !== "High") {
    priority = "High";
  }

  // Budget weight (example: high budget => higher priority)
  if (lead.budget) {
    const budgetNumber = parseInt(lead.budget.replace(/[^0-9]/g, ""));
    if (budgetNumber >= 500000) priority = "High";
    else if (budgetNumber >= 200000 && priority !== "High") priority = "Medium";
  }

  return priority;
};