import { Document, Model } from "mongoose";

export interface ICommentDocument extends Document {
    writer: string,
    blogId: string,
    responseTo?: string,
    content: string
};

export interface ICommentModel extends Model<ICommentDocument> {
    getBlogComments: (blogId: string) => Promise<Array<ICommentDocument>>
}

