import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';
import pick from '../utils/pick';
import { BadRequestError } from "../utils/error-handler";

const validateRequest = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = check(validSchema, object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ');
    throw new BadRequestError(errorMessage);
  }
  Object.assign(req, value);
  return next();
};

const check = (schema: Schema, data: any) => {
  const object = pick(data, Object.keys(schema));
  return Joi.compile(schema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);
};

const validate = (schema: Schema, data: any) => {
  const { value, error } = check(schema, data);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ');
      throw new BadRequestError(errorMessage);
  }

  return value;
};

export { validateRequest, validate };
