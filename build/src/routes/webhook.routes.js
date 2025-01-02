"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
class WebhookRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.post("/", controller_1.WebhookController.prototype.webhook);
        return this.router;
    }
}
exports.webhookRoutes = new WebhookRoutes();
//# sourceMappingURL=webhook.routes.js.map