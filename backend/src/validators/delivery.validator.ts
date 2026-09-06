import Joi from "joi";

// Schema for POST /api/deliveries
// Only recipientName and address are accepted - status/confirmedAt
// are never taken from the client.
export const createDeliverySchema = Joi.object({
  recipientName: Joi.string().trim().min(3).required().messages({
    "string.empty": "recipientName is required",
    "string.min": "recipientName must be at least 3 characters",
    "any.required": "recipientName is required",
  }),
  address: Joi.string().trim().min(5).required().messages({
    "string.empty": "address is required",
    "string.min": "address must be at least 5 characters",
    "any.required": "address is required",
  }),
});

// Schema for PUT /api/deliveries/:id
// Same shape as create - status can NOT be changed through this endpoint.
export const updateDeliverySchema = Joi.object({
  recipientName: Joi.string().trim().min(3).required().messages({
    "string.empty": "recipientName is required",
    "string.min": "recipientName must be at least 3 characters",
    "any.required": "recipientName is required",
  }),
  address: Joi.string().trim().min(5).required().messages({
    "string.empty": "address is required",
    "string.min": "address must be at least 5 characters",
    "any.required": "address is required",
  }),
});