"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
// user schema
const PostSchema = new mongoose_1.Schema({
    image: Array,
    content: {
        type: String,
        required: true,
    },
    author_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [
        {
            liker_id: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
});
// create and export user model
exports.PostModel = (0, mongoose_1.model)("Post", PostSchema);
//# sourceMappingURL=post.schema.js.map