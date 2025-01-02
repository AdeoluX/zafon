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
exports.AuthService = void 0;
const helper_utils_1 = __importDefault(require("../utils/helper.utils"));
const user_schema_1 = require("../models/user.schema");
class AuthService {
    signIn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, isAdmin } = payload;
            const user = yield user_schema_1.UserModel.findOne({ email, role: isAdmin ? 'admin' : 'member' });
            if (!user)
                return { success: false, message: "Invalid credentials" };
            const isValid = yield user.isValidPassword(password);
            if (!isValid)
                return { success: false, message: "Invalid credentials" };
            const token = helper_utils_1.default.signToken({ email, id: user._id, role: user.role });
            return {
                success: true,
                message: "Logged in successfully.",
                token,
            };
        });
    }
    signUp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, confirmPassword, firstName, lastName, phoneNumber, middleName, isAdmin } = payload;
            let user = yield user_schema_1.UserModel.findOne({ email, role: isAdmin ? 'admin' : 'member' });
            if (user)
                return { success: false, message: "Invalid credentials" };
            if (password !== confirmPassword)
                return { success: false, message: 'Passwords must match.' };
            user = yield user_schema_1.UserModel.create({
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                middleName,
                role: isAdmin ? 'admin' : 'member'
            });
            return {
                success: true,
                message: `${isAdmin ? 'Admin' : 'User'} signed up successfully.`,
            };
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map