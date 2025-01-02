"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const bunyan_1 = __importDefault(require("bunyan"));
dotenv_1.default.config({});
class Config {
    constructor() {
        this.DATABASE_URL = process.env.DATABASE_URL || "";
        this.TOKEN_SECRET = process.env.TOKEN_SECRET || "qwertyuiop";
        this.FRONTEND_URL = process.env.FRONTEND_URL || "";
        this.REDIS_PORT = Number(process.env.REDIS_PORT) || 7000;
    }
    createLogger(name) {
        return bunyan_1.default.createLogger({ name, level: "debug" });
    }
    validateConfig() {
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                throw new Error(`Configuration ${key} is undefined.`);
            }
        }
    }
}
exports.config = new Config();
//# sourceMappingURL=config.js.map