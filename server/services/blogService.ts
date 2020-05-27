import { Types } from "mongoose";

import { Blog } from "../models";
import { IBlogDocument, GetBlogsData } from "../interfaces/BlogInterface";


export default class BlogService {
    static createBlog = async (data: IBlogDocument): Promise<IBlogDocument> => {
        const newBlog = await Blog.create(data);
        if(!newBlog) { throw new Error("Blog is not created") };

        const blog = await Blog.aggregate([
            { $match: { _id: newBlog._id } },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },
            {
                $lookup: {
                    from: "reactions",
                    localField: "_id",
                    foreignField: "blogId",
                    as: "reactions"
                }
            }
        ]);

        if(!blog) { throw new Error("Blog not found") };
        return blog[0];
    };

    static deleteBlog = async (blogId: string) => {
        const remoteBlog = await Blog.findOneAndRemove({ _id: blogId });

        if(!remoteBlog) { throw new Error };
        await remoteBlog.remove();
    }

    static getBlogs = async (data: GetBlogsData): Promise<Array<IBlogDocument>> => {
        const blogs = await Blog.aggregate([
            { $match: { author: new Types.ObjectId(data.userId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },
            {
                $lookup: {
                    from: "comments",
                    let: { "userId": "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: [ "$$userId", "$blogId" ] }} },
                        {
                            $lookup: {
                                from: "users",
                                localField: "writer",
                                foreignField: "_id",
                                as: "writer"
                            },
                        },
                        {
                            $lookup: {
                                from: "reactions",
                                let: { "comment_id": "$_id" },
                                pipeline: [
                                    { $match: { $expr: { $eq: [ "$$comment_id", "$commentId" ] }} },
                                ],
                                as: "reactions"
                            }
                        },
                        { $unwind: "$writer" },
                    ],
                    as: "comments"
                }
            },
            {
                $lookup: {
                    from: "reactions",
                    localField: "_id",
                    foreignField: "blogId",
                    as: "reactions"
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    blogs: [{ $skip: data.limit * (data.currentPage - 1) }, { $limit: data.limit }],
                    totalCount: [{ $count: "count" }],
                }
            },
            { $project: { blogs: "$blogs", totalCount: "$totalCount.count" } },
        ]);

        if(!blogs) { throw new Error("Blogs not found") };

        return blogs[0];
    };
}

