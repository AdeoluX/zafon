"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = void 0;
const mongoose_1 = require("mongoose");
const jobSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    data: { type: mongoose_1.Schema.Types.Mixed, required: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    error: { type: String },
}, { timestamps: true });
exports.JobModel = (0, mongoose_1.model)('Job', jobSchema);
//# sourceMappingURL=job.schema.js.map