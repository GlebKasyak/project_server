import { Schema, model, Types, Model } from "mongoose";

import Reaction from "./reactionModel";
import Comment from "./commentModel";
import { IBlogDocument } from "../interfaces/BlogInterface";

const blogSchema = new Schema({
    author: { type: Types.ObjectId, ref: "User" },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

blogSchema.pre<IBlogDocument>("remove", async function(next) {
    const blog = this;

    await Reaction.deleteMany({ blogId: blog._id });

    const comments = await Comment.find({ blogId: blog._id });
    comments.map(comment => comment.remove());

    next();
});

export default model<IBlogDocument, Model<IBlogDocument>>("Blog", blogSchema);