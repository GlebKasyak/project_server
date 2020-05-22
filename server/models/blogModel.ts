import { Schema, model, Types, Model } from "mongoose";

import ReactionModel from "./reactionModel";
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

    await ReactionModel.deleteMany({ blogId: blog._id });
    next();
});

export default model<IBlogDocument, Model<IBlogDocument>>("Blog", blogSchema);