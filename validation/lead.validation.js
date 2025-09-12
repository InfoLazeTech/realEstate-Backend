import Joi from "joi";

export const leadSchema = Joi.object({
  name: Joi.string().required(),
  budget: Joi.string().optional(),
  location: Joi.string().optional(),
  type: Joi.string().valid("Buyer", "Seller", "Renter", "Investor").default("Buyer"),
  score: Joi.string().valid("Hot","Warm","Cold").default("Warm"),
  stage: Joi.string().optional(),
});
export const validateLead = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
