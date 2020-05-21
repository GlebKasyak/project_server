import { Types } from "mongoose";

import { Blog } from "../models";
import { IBlogDocument, GetBlogsData } from "../interfaces/BlogInterface";


export default class BlogService {
    static createDialog = async (data: IBlogDocument): Promise<IBlogDocument> => {
        const blog = await Blog.create(data);
        if(!blog) { throw new Error("Blog is not created") };

        return await blog.populate("author").execPopulate();
    };

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
                    from: "reactions",
                    localField: "_id",
                    foreignField: "blogId",
                    as: "reactions"
                }
            },
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

