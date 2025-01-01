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

export const payValidation = {
    body: Joi.object().keys({
        amount: Joi.number().required(),
        assetId: Joi.string().required(),
        type: Joi.string().required(),
        endDate: Joi.date().optional(),
    }).messages(messages)
}

export const createAssetValidation = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        unitPrice: Joi.number().required(),
        type: Joi.string().required(),
        rate: Joi.number().required(),
    }).messages(messages)
}

export const updateAssetValidation = {
    body: Joi.object().keys({
        name: Joi.string().optional(),
        unitPrice: Joi.number().optional(),
        type: Joi.string().optional(),
        rate: Joi.number().optional(),
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

