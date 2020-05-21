import { Document } from "mongoose";

export interface IReactionDocument extends Document {
    author: string,
    commentId?: string,
    blogId?: string,
    reaction: boolean
}

