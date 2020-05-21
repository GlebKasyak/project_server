import { Schema, model, Types, Model } from "mongoose";

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



export default model<IBlogDocument, Model<IBlogDocument>>("Blog", blogSchema);