import Joi from "joi";

const messages = {
    'any.only': 'Status must be either "completed" or "pending".',
    'string.base': 'Field must be a string.', 
    'string.empty': 'Field cannot be empty.', 
    'number.base': 'Field must be a number.', 
}

export const signInValidation = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        isAdmin: Joi.boolean().required(),
    }).messages(messages)
}

export const subscribeValidation = {
    body: Joi.object().keys({
        amount: Joi.number().required(),
    }).messages(messages)
}

export const bvnVerificationValidation = {
    body: Joi.object().keys({
        bvn: Joi.string().email().required(),
        dob: Joi.string().required()
    }).messages(messages)
}

export const signUpValidation = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required(),
        phoneNumber: Joi.string().optional(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        middleName: Joi.string().optional(),
        isAdmin: Joi.boolean().required(),
    }).messages(messages)
}

