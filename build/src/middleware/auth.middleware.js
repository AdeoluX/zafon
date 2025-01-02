"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.AuthMiddleware = void 0;
const error_handler_1 = require("../utils/error-handler");
const helper_utils_1 = __importDefault(require("../utils/helper.utils"));
class AuthMiddleware {
    constructor(allowedRoles = []) {
        this.allowedRoles = allowedRoles;
        this.verifyUser = this.verifyUser.bind(this);
    }
    verifyUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Check for the Authorization header
                if (!((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization)) {
                    throw new error_handler_1.NotAuthorizedError("Token is not available. Please login again.");
                }
                // Extract Bearer Token
                const BearerToken = req.headers.authorization.split(" ")[1];
                if (!BearerToken) {
                    throw new error_handler_1.NotAuthorizedError("Token is not available. Please login again.");
                }
                // Verify the token
                const payload = helper_utils_1.default.verifyToken(BearerToken);
                if (!payload) {
                    throw new error_handler_1.NotAuthorizedError("You do not have permission to perform this action.");
                }
                // Validate roles, if specified
                if (this.allowedRoles.length > 0 && !this.allowedRoles.includes(payload.role)) {
                    throw new error_handler_1.NotAuthorizedError("You do not have permission to perform this action.");
                }
                // Attach user details to request body
                req.body = Object.assign(Object.assign({}, req.body), { authorizer: payload });
                next(); // Move to the next middleware or route handler
            }
            catch (error) {
                // Pass the error to the next middleware for centralized error handling
                next(error);
            }
        });
    }
    static withRoles(allowedRoles) {
        return new AuthMiddleware(allowedRoles);
    }
}
exports.AuthMiddleware = AuthMiddleware;
exports.authMiddleware = new AuthMiddleware();
//# sourceMappingURL=auth.middleware.js.map