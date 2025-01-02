"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const pick_1 = __importDefault(require("../utils/pick"));
const error_handler_1 = require("../utils/error-handler");
const validateRequest = (schema) => (req, res, next) => {
    const validSchema = (0, pick_1.default)(schema, ['params', 'query', 'body']);
    const object = (0, pick_1.default)(req, Object.keys(validSchema));
    const { value, error } = check(validSchema, object);
    if (error) {
        const errorMessage = error.details
            .map((details) => details.message)
            .join(', ');
        throw new error_handler_1.BadRequestError(errorMessage);
    }
    Object.assign(req, value);
    return next();
};
exports.validateRequest = validateRequest;
const check = (schema, data) => {
    const object = (0, pick_1.default)(data, Object.keys(schema));
    return joi_1.default.compile(schema)
        .prefs({ errors: { label: 'key' } })
        .validate(object);
};
const validate = (schema, data) => {
    const { value, error } = check(schema, data);
    if (error) {
        const errorMessage = error.details
            .map((details) => details.message)
            .join(', ');
        throw new error_handler_1.BadRequestError(errorMessage);
    }
    return value;
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map