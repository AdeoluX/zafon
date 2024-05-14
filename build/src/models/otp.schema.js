"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModel = void 0;
const mongoose_1 = require("mongoose");
// user schema
const OtpSchema = new mongoose_1.Schema({
    otp: {
        type: String,
        required: true,
    },
    author_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
});
// create and export user model
exports.OtpModel = (0, mongoose_1.model)("Otp", OtpSchema);
//# sourceMappingURL=otp.schema.js.map