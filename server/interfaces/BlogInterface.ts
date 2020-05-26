import { Document } from "mongoose";

export interface IBlogDocument extends Document {
    author: string,
    title: string,
    description: string
}

export type GetBlogsData = {
    userId: string,
    limit: number,
    currentPage: number
}
