"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = require("./auth.routes");
const user_routes_1 = require("./user.routes");
const webhook_routes_1 = require("./webhook.routes");
const asset_routes_1 = require("./asset.routes");
const BASE_PATH = "/api/v1";
exports.default = (app) => {
    const routes = () => {
        app.use(`${BASE_PATH}/auth`, auth_routes_1.authRoutes.routes());
        app.use(`${BASE_PATH}/user`, user_routes_1.userRoutes.routes());
        app.use(`${BASE_PATH}/webhook`, webhook_routes_1.webhookRoutes.routes());
        app.use(`${BASE_PATH}/asset`, asset_routes_1.assetRoutes.routes());
    };
    routes();
};
//# sourceMappingURL=index.js.map