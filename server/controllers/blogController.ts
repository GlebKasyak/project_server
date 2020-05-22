import { RequestHandler } from "express";

import { BlogService } from "../services";
import { ErrorHandler } from "../utils/error";

class DialogController {
    static createBlog: RequestHandler = async (req, res, next) => {
        try {
            const data = await BlogService.createBlog(req.body);

            res.status(201).json({ message: "create new blog", success: true, data });
        } catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static deleteBlog: RequestHandler = async (req, res, next) => {
        try {
            await BlogService.deleteBlog(req.params.blogId);

            res.json({ message: "Blog deleted", success: true });
        } catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static getBlogs: RequestHandler = async (req, res, next) => {
        try {
            const data = await BlogService.getBlogs(JSON.parse(req.params.data));

            res.json({ message: "All blogs", success: true, data });
        } catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

}

export default DialogController;