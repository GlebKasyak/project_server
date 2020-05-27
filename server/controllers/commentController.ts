import { RequestHandler } from "express";

import { CommentService } from "../services";
import { ErrorHandler } from "../utils/error";

class SubscribeController {
    static postComment: RequestHandler = async (req, res, next) =>{
        try {
            const data = await CommentService.postComment(req.body);

            res.status(201).json({ message: "Comment created", success: true, data });
        } catch(err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static deleteComment: RequestHandler = async (req, res, next) =>{
        try {
            const data = await CommentService.deleteComment(req.params.commentId);

            res.json({ message: "Comment deleted", success: true, data });
        } catch(err) {
            next(new ErrorHandler(400, err.message));
        }
    };
}

export default SubscribeController