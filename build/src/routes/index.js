"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = require("./auth.routes");
const BASE_PATH = "/api/v1";
exports.default = (app) => {
    const routes = () => {
        app.use(`${BASE_PATH}/auth`, auth_routes_1.authRoutes.routes());
    };
    routes();
};
//# sourceMappingURL=index.js.map