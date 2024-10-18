import Joi from "joi";

const messages = {
    'any.only': 'Status must be either "completed" or "pending".',
    'string.base': '{{#label}} must be a string.', 
    'string.empty': '{{#label}} cannot be empty.', 
    'number.base': '{{#label}} must be a number.', 
}

export const createFixtureValidation = {
    body: Joi.object().keys({
        homeTeam: Joi.string().required(),
        awayTeam: Joi.string().required(),
        kickOffTime: Joi.string().required(),
        authorizer: Joi.object().optional(),
    }).messages(messages)
}

export const updateFixtureValidation = {
    body: Joi.object().keys({
        kickOffTime: Joi.string().optional(),
        homeTeamGoals: Joi.number().optional(),
        awayTeamGoals: Joi.number().optional(),
        authorizer: Joi.object().optional(),
    }).messages(messages)
}

export const searchFixtureValidation = {
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

