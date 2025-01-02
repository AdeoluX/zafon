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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const setupServer_1 = require("./setupServer");
const config_1 = require("./config");
const setupDatabase_1 = __importDefault(require("./setupDatabase"));
const redemption_queue_1 = require("./queues/redemption.queue");
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
// (async () => {
//   try {
//     await agenda.start();
//     console.log('Agenda started and ready to process jobs.');
//   } catch (error) {
//     console.error('Failed to start Agenda:', error);
//   }
// })();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redemption_queue_1.pulse.start();
        console.log('Pulse started and ready to process jobs.');
    }
    catch (error) {
        console.error('Failed to start Pulse:', error);
    }
}))();
const server = new setupServer_1.Server(app);
// seed.seedAssets()
// seed.seedAdmin()
setupDatabase_1.default.connect();
server.start();
//# sourceMappingURL=index.js.map