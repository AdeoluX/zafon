"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFixtureValidation = exports.updateFixtureValidation = exports.createFixtureValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const messages = {
    'any.only': 'Status must be either "completed" or "pending".',
    'string.base': '{{#label}} must be a string.',
    'string.empty': '{{#label}} cannot be empty.',
    'number.base': '{{#label}} must be a number.',
};
exports.createFixtureValidation = {
    body: joi_1.default.object().keys({
        homeTeam: joi_1.default.string().required(),
        awayTeam: joi_1.default.string().required(),
        kickOffTime: joi_1.default.string().required(),
        authorizer: joi_1.default.object().optional(),
    }).messages(messages)
};
exports.updateFixtureValidation = {
    body: joi_1.default.object().keys({
        kickOffTime: joi_1.default.string().optional(),
        homeTeamGoals: joi_1.default.number().optional(),
        awayTeamGoals: joi_1.default.number().optional(),
        authorizer: joi_1.default.object().optional(),
    }).messages(messages)
};
exports.searchFixtureValidation = {
    query: joi_1.default.object().keys({
        startDate: joi_1.default.string().optional(),
        endDate: joi_1.default.string().optional(),
        search: joi_1.default.string().optional(),
        status: joi_1.default.string().valid('completed', 'pending').optional(),
        page: joi_1.default.number().optional(),
        perPage: joi_1.default.number().optional(),
        skip: joi_1.default.number().optional(),
    }).messages(messages),
};
//# sourceMappingURL=fixture.validation.js.map