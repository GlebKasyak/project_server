import { Schema, model, Types } from "mongoose";

import { ICommentDocument, ICommentModel } from "../interfaces/CommentInterface";
import Reaction from "./reactionModel";

const commentSchema = new Schema({
    writer: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    blogId: {
        type: Types.ObjectId,
        ref: "Blog",
        required: true
    },
    responseTo: {
        type: Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

commentSchema.pre<ICommentDocument>("remove", async function(next) {
    const comment = this;

    await Reaction.deleteMany({ commentId: comment._id });
    await Comment.deleteMany({ responseTo: comment._id });
    next();
});

commentSchema.statics.getBlogComments = async (blogId: string): Promise<Array<ICommentDocument>> => {
    return await Comment.aggregate([
        { $match: { blogId } },
        {
            $lookup: {
                from: "users",
                localField: "writer",
                foreignField: "_id",
                as: "writer"
            }
        },
        { $unwind: "$writer" },
        {
            $lookup: {
                from: "reactions",
                let: { "comment_id": "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: [ "$$comment_id", "$commentId" ] }} },
                ],
                as: "reactions"
            }
        }
    ]) as Array<ICommentDocument>;
};

const Comment = model<ICommentDocument, ICommentModel>("Comment", commentSchema);
export default Comment;