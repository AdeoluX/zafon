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
exports.Server = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const routes_1 = __importDefault(require("./routes"));
const error_handler_1 = require("./utils/error-handler");
// import { RedisStore, redisClient } from "./config/redis";
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
class Server {
    constructor(app) {
        this.app = app;
    }
    start() {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        // this.redisSessionMiddleware(this.app); // <-- Add Redis session middleware
        this.routesMiddleware(this.app);
        this.apiMonitoring(this.app);
        this.startServer(this.app);
        this.globalErrorHandler(this.app);
    }
    redisSessionMiddleware(app) {
    }
    standardMiddleware(app) {
        // app.use(compression({}))
        app.use((0, express_1.json)({ limit: "50mb" }));
        app.use((0, express_1.urlencoded)({ extended: true, limit: "50mb" }));
        app.disable("x-powered-by");
    }
    routesMiddleware(app) {
        app.use((0, express_1.json)({ limit: "50mb" }));
        app.use((0, express_1.urlencoded)({ extended: true, limit: "50mb" }));
        app.disable("x-powered-by");
        (0, routes_1.default)(app);
    }
    apiMonitoring(app) {
        // You can add your API monitoring logic here
    }
    securityMiddleware(app) {
        app.use((0, helmet_1.default)());
        app.use((0, cors_1.default)({
            origin: "*",
            optionsSuccessStatus: 200,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        }));
        if (process.env.NODE_ENV !== 'test') {
            const limiter = (0, express_rate_limit_1.default)({
                windowMs: 15 * 60 * 1000,
                max: 100,
                message: "Too many requests from this IP, please try again later.",
            });
            app.use(limiter);
            app.set('trust proxy', 1);
        }
    }
    globalErrorHandler(app) {
        app.all("*", (req, res) => {
            res
                .status(http_status_codes_1.default.NOT_FOUND)
                .json({ message: `${req.originalUrl} not found` });
        });
        app.use((error, _req, res, next) => {
            var _a;
            if (error instanceof error_handler_1.CustomError) {
                return res.status(error.statusCode).json(error.serializeErrors());
            }
            res.status(http_status_codes_1.default.BAD_REQUEST).send({
                status: "BAD_REQUEST",
                message: (_a = error.message) !== null && _a !== void 0 ? _a : "Something went wrong.",
                statusCode: http_status_codes_1.default.BAD_REQUEST,
            });
        });
    }
    startServer(app) {
        app.listen(process.env.PORT, () => __awaiter(this, void 0, void 0, function* () { return console.log(`Listening on port ${process.env.PORT}`); }));
    }
}
exports.Server = Server;
//# sourceMappingURL=setupServer.js.map