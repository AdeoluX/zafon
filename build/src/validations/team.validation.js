"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTeamValidation = exports.updateTeamValidation = exports.createTeamValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const messages = {
    'any.only': 'Status must be either "completed" or "pending".',
    'string.base': 'Field must be a string.',
    'string.empty': 'Field cannot be empty.',
    'number.base': 'Field must be a number.',
};
exports.createTeamValidation = {
    body: joi_1.default.object().keys({
        name: joi_1.default.string().required(),
        coach: joi_1.default.string().required(),
        authorizer: joi_1.default.object().optional(),
    }).messages(messages)
};
exports.updateTeamValidation = {
    body: joi_1.default.object().keys({
        name: joi_1.default.string().optional(),
        coach: joi_1.default.string().optional(),
        authorizer: joi_1.default.object().optional(),
    }).messages(messages)
};
exports.searchTeamValidation = {
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
//# sourceMappingURL=team.validation.js.map