"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
// user schema
const CommentSchema = new mongoose_1.Schema({
    content: {
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
exports.CommentModel = (0, mongoose_1.model)("Comment", CommentSchema);
//# sourceMappingURL=comment.schema.js.map