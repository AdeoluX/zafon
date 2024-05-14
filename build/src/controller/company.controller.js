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
exports.Company = void 0;
const api_response_1 = __importDefault(require("../utils/api-response"));
class Company {
    constructor() {
        this.createdResponse = api_response_1.default.created;
        this.response = api_response_1.default.response;
        this.ok = api_response_1.default.ok;
        this.customError = api_response_1.default.customError;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.createdResponse(res, {}, '');
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.Company = Company;
//# sourceMappingURL=company.controller.js.map