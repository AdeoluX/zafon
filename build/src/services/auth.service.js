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
const otp_schema_1 = require("../models/otp.schema");
const user_schema_1 = require("../models/user.schema");
const helper_utils_1 = __importDefault(require("../utils/helper.utils"));
class AuthService {
    signIn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            const user = yield user_schema_1.UserModel.findOne({ email });
            if (!user)
                return { success: false, message: "Invalid credentials" };
            const isValid = yield user.isValidPassword(password);
            if (!isValid)
                return { success: false, message: "Invalid credentials" };
            const token = helper_utils_1.default.signToken({ email, id: user._id, status: user.status });
            return {
                success: true,
                message: "Logged in successfully.",
                token,
            };
        });
    }
    signUp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, confirmPassword, firstName, lastName, phoneNumber, middleName, } = payload;
            const userExists = yield user_schema_1.UserModel.findOne({ email });
            if (userExists)
                return { success: false, message: "Invalid credentials." };
            if (confirmPassword !== password)
                return { success: false, message: "Passwords don't match." };
            const createUser = yield user_schema_1.UserModel.create({
                email,
                password,
                confirmPassword,
                firstName,
                lastName,
                phoneNumber,
                middleName,
            });
            if (!createUser)
                return { success: false, message: "Invalid credentials" };
            const token = helper_utils_1.default.signToken({
                email,
                id: createUser._id,
                status: createUser.status,
            });
            const otp = helper_utils_1.default.generateString({ number: true });
            yield otp_schema_1.OtpModel.create({
                author_id: createUser._id,
                otp,
            });
            return {
                success: true,
                message: "Logged in successfully.",
                token,
                options: {
                    otp,
                },
            };
        });
    }
    activateProfile(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otp, authorizer } = payload;
            const user_id = authorizer.id;
            const userExists = yield user_schema_1.UserModel.findById(user_id);
            if (!userExists)
                return { success: false, message: "Invalid Otp" };
            const otpExists = yield otp_schema_1.OtpModel.findOne({
                author_id: user_id,
                otp,
            });
            if (!otpExists)
                return { success: false, message: "Invalid Otp" };
            yield user_schema_1.UserModel.findByIdAndUpdate(user_id, { status: "active" }, { new: true });
            const token = helper_utils_1.default.signToken({
                email: userExists.email,
                id: userExists._id,
                status: userExists.status,
            });
            return {
                success: true,
                message: "Account activated successfully.",
                token,
                options: {
                    otp,
                },
            };
        });
    }
    forgotPassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = payload;
            const findUser = yield user_schema_1.UserModel.findOne({
                email,
            });
            if (!findUser)
                return { success: true, message: "Otp sent." };
            const otp = helper_utils_1.default.generateString({ number: true });
            yield otp_schema_1.OtpModel.create({
                author_id: findUser._id,
                otp,
            });
            return {
                success: true,
                message: "Otp sent.",
                options: {
                    otp,
                },
            };
        });
    }
    changePassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otp, confirmPassword, password, email } = payload;
            if (confirmPassword !== password)
                return { success: false, message: "Passwords don't match." };
            const userExists = yield user_schema_1.UserModel.findOne({
                email,
            });
            if (!userExists)
                return { success: false, message: "User does not exist" };
            const findOtp = yield otp_schema_1.OtpModel.findOne({
                author_id: userExists._id,
                otp,
            });
            if (!findOtp)
                return { success: false, message: "Invalid or Expired otp" };
            yield user_schema_1.UserModel.findByIdAndUpdate(userExists._id, { password }, { new: true });
            return {
                success: true,
                message: "Password change successful",
            };
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map