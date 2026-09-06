import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";


export function validate(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    console.log('validate.middleware: incoming body', req.body);
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,  
      stripUnknown: true,  
    });

    if (error) {
      console.log('validate.middleware: validation error', error.details);
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      });
      return;
    }

    req.body = value; // sanitized/validated body
    console.log('validate.middleware: validation passed, sanitized body', value);
    next();
  };
}