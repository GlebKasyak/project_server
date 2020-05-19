import { RequestHandler } from "express";

import { FriendService } from "../services";

class UserController {
    static addNewFriend: RequestHandler = async (req, res) => {
        try {
            await FriendService.addNewFriend(req.params.userId, req.user._id);

            res.json({ message: "New friend added", success: true });
        } catch (err) {
            res.status(400).json({ message: err.messsage, success: false });
        }
    };

    static removeFriend: RequestHandler = async (req, res) => {
        try {
            await FriendService.removeFriend(req.params.userId, req.user._id);

            res.json({ message: "Friend removed", success: true });
        } catch (err) {
            res.status(400).json({ message: err.messsage, success: false });
        }
    };

    static getFriends: RequestHandler = async (req, res) => {
        try {
            const data = await FriendService.getFriends(JSON.parse(req.params.data));

            res.json({ message: "All friends", data, success: true });
        } catch (err) {
            res.status(400).json({ message: err.messsage, success: false });
        }
    };

    static searchFriends: RequestHandler = async (req, res) => {
        try {
            const data = await FriendService.searchFriends(req.body);

            res.json({ message: "Friends founded", data, success: true });
        } catch (err) {
            res.status(400).json({ message: err.messsage, success: false });
        }
    };

}

export default UserController;