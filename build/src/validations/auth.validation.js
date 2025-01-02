"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpValidation = exports.bvnVerificationValidation = exports.updateAssetValidation = exports.createAssetValidation = exports.payValidation = exports.subscribeValidation = exports.signInValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const messages = {
    'any.only': 'Status must be either "completed" or "pending".',
    'string.base': 'Field must be a string.',
    'string.empty': 'Field cannot be empty.',
    'number.base': 'Field must be a number.',
};
exports.signInValidation = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
        isAdmin: joi_1.default.boolean().required(),
    }).messages(messages)
};
exports.subscribeValidation = {
    body: joi_1.default.object().keys({
        amount: joi_1.default.number().required(),
    }).messages(messages)
};
exports.payValidation = {
    body: joi_1.default.object().keys({
        amount: joi_1.default.number().required(),
        assetId: joi_1.default.string().required(),
        type: joi_1.default.string().required(),
        endDate: joi_1.default.date().optional(),
    }).messages(messages)
};
exports.createAssetValidation = {
    body: joi_1.default.object().keys({
        name: joi_1.default.string().required(),
        unitPrice: joi_1.default.number().required(),
        type: joi_1.default.string().required(),
        rate: joi_1.default.number().required(),
    }).messages(messages)
};
exports.updateAssetValidation = {
    body: joi_1.default.object().keys({
        name: joi_1.default.string().optional(),
        unitPrice: joi_1.default.number().optional(),
        type: joi_1.default.string().optional(),
        rate: joi_1.default.number().optional(),
    }).messages(messages)
};
exports.bvnVerificationValidation = {
    body: joi_1.default.object().keys({
        bvn: joi_1.default.string().email().required(),
        dob: joi_1.default.string().required()
    }).messages(messages)
};
exports.signUpValidation = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
        confirmPassword: joi_1.default.string().required(),
        phoneNumber: joi_1.default.string().optional(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        middleName: joi_1.default.string().optional(),
        isAdmin: joi_1.default.boolean().required(),
    }).messages(messages)
};
//# sourceMappingURL=auth.validation.js.map