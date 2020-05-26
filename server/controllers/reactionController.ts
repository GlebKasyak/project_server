import { RequestHandler } from "express";

import { ReactionService } from "../services";
import { ErrorHandler } from "../utils/error";

class ReactionController {
    static createReaction: RequestHandler = async (req, res, next) => {
        try {
            const data = await ReactionService.createReaction(req.body);

            res.status(201).json({ message: "Reaction added", success: true, data });
        } catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static removeReaction: RequestHandler = async (req, res, next) => {
        try {
            const data = await ReactionService.removeReaction(JSON.parse(req.params.data));

            res.json({ message: "Reaction deleted", success: true, data });
        } catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };
}

export default ReactionController;