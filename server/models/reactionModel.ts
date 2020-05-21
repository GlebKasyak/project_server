import { Schema, model, Types, Model } from "mongoose";

import { IReactionDocument } from "../interfaces/ReactionInterface";

const reactionSchema = new Schema({
    author: { type: Types.ObjectId, ref: "User" },
    commentId: { type: Types.ObjectId, ref: "Comment" },
    blogId: { type: Types.ObjectId, ref: "Blog" },
    reaction: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});



export default model<IReactionDocument, Model<IReactionDocument>>("Reaction", reactionSchema);