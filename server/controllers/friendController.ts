import { RequestHandler } from "express";

import { FriendService } from "../services";
import { ErrorHandler } from "../utils/error";

class UserController {
    static addNewFriend: RequestHandler = async (req, res, next) => {
        try {
            await FriendService.addNewFriend(req.params.userId, req.user._id);

            res.json({ message: "New friend added", success: true });
        } catch (err) {
            next(new ErrorHandler(400, err.messsage));
        }
    };

    static removeFriend: RequestHandler = async (req, res, next) => {
        try {
            await FriendService.removeFriend(req.params.userId, req.user._id);

            res.json({ message: "Friend removed", success: true });
        } catch (err) {
            next(new ErrorHandler(400, err.messsage));
        }
    };

    static getFriends: RequestHandler = async (req, res, next) => {
        try {
            const data = await FriendService.getFriends(JSON.parse(req.params.data));

            res.json({ message: "All friends", data, success: true });
        } catch (err) {
            next(new ErrorHandler(400, err.messsage));
        }
    };
}

export default UserController;