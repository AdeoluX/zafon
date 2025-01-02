"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
class Utils {
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static fakeTranfer(success) {
        if (success) {
            return true;
        }
        else {
            return false;
        }
    }
}
Utils.signToken = (object) => {
    const token = jsonwebtoken_1.default.sign(object, config_1.config.TOKEN_SECRET);
    return token;
};
Utils.verifyToken = (token) => {
    const result = jsonwebtoken_1.default.verify(token, config_1.config.TOKEN_SECRET);
    return result;
};
Utils.generateString = ({ alpha = false, number = false }) => {
    let characters = "", length = 11;
    let alphaChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", numberChars = "0123456789";
    if (alpha) {
        characters = characters + alphaChars;
    }
    if (number) {
        characters = characters + numberChars;
    }
    if (number && !alpha) {
        length = 6;
    }
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
};
Utils.paginateOptions = (query) => {
    const page = Number(query.page) || 1;
    const perPage = Number(query.perPage) || 10;
    const skip = (page - 1) * perPage;
    return { page, perPage, skip };
};
exports.default = Utils;
//# sourceMappingURL=helper.utils.js.map