"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const setupServer_1 = require("./setupServer");
const config_1 = require("./config");
const setupDatabase_1 = __importDefault(require("./setupDatabase"));
class Application {
    loadConfig() {
        config_1.config.validateConfig();
    }
}
/*=============================================
=           initialize():              =
=============================================*/
const app = (0, express_1.default)();
exports.app = app;
const application = new Application();
application.loadConfig();
// databaseConnection();
// application.handleExit();
const server = new setupServer_1.Server(app);
setupDatabase_1.default.connect();
server.start();
//# sourceMappingURL=index.js.map