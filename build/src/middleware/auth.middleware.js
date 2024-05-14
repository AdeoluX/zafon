"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.AuthMiddleware = void 0;
const error_handler_1 = require("../utils/error-handler");
const helper_utils_1 = __importDefault(require("../utils/helper.utils"));
// interface Request extends Request {
//   currentUser: Object;
// }
class AuthMiddleware {
    verifyUser(req, res, next) {
        var _a, _b, _c;
        if (!((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization)) {
            throw new error_handler_1.NotAuthorizedError("Token is not available. Please login again.");
        }
        try {
            const BearerToken = (_b = req.headers) === null || _b === void 0 ? void 0 : _b.authorization.split(" ")[1];
            if ((_c = req.headers) === null || _c === void 0 ? void 0 : _c.authorization) {
                const payload = helper_utils_1.default.verifyToken(BearerToken);
                req.body = Object.assign(Object.assign({}, req.body), { authorizer: payload });
            }
        }
        catch (error) {
            throw new error_handler_1.NotAuthorizedError("Token is invalid. Please login again.");
        }
        next();
    }
}
exports.AuthMiddleware = AuthMiddleware;
exports.authMiddleware = new AuthMiddleware();
//# sourceMappingURL=auth.middleware.js.map