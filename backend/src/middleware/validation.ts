import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: error.details[0].message
      });
      return;
    }
    
    next();
  };
};

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const healthRecordSchema = Joi.object({
  record_date: Joi.string().isoDate().required(),
  record_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  site: Joi.string().allow(''),
  onset: Joi.string().allow(''),
  character: Joi.string().allow(''),
  radiation: Joi.string().allow(''),
  associations: Joi.string().allow(''),
  time_course: Joi.string().allow(''),
  exacerbating_factors: Joi.string().allow(''),
  severity: Joi.number().integer().min(1).max(10),
  palliating_factors: Joi.string().allow(''),
  quality: Joi.string().allow(''),
  region: Joi.string().allow(''),
  symptoms: Joi.string().allow(''),
  medications: Joi.string().allow(''),
  diet_notes: Joi.string().allow(''),
  vital_signs: Joi.object({
    blood_pressure: Joi.string().allow(''),
    temperature: Joi.string().allow(''),
    pulse: Joi.string().allow(''),
    weight: Joi.string().allow('')
  }),
  personal_notes: Joi.string().allow('')
});