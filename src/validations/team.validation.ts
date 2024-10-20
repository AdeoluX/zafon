import Joi from "joi";

const messages = {
    'any.only': 'Status must be either "completed" or "pending".',
    'string.base': 'Field must be a string.', 
    'string.empty': 'Field cannot be empty.', 
    'number.base': 'Field must be a number.', 
}

export const createTeamValidation = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        coach: Joi.string().required(),
        authorizer: Joi.object().optional(),
    }).messages(messages)
}

export const updateTeamValidation = {
    body: Joi.object().keys({
        name: Joi.string().optional(),
        coach: Joi.string().optional(),
        authorizer: Joi.object().optional(),
    }).messages(messages)
}

export const searchTeamValidation = {
    query: Joi.object().keys({
        startDate: Joi.string().optional(),
        endDate: Joi.string().optional(),
        search: Joi.string().optional(),
        status: Joi.string().valid('completed', 'pending').optional(),
        page: Joi.number().optional(),
        perPage: Joi.number().optional(),
        skip: Joi.number().optional(),
    }).messages(messages),
}


