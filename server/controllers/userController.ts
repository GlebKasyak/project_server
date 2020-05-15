import { RequestHandler } from "express";

import { UserService } from "../services";
import { IUserDocument } from "../interfaces/UserInterface";

class UserController {
    static login: RequestHandler = async (req, res) => {
        try {
            const { email, password } = req.body;
            const token = await UserService.login(email, password);

            res.json({ message: "Token is created", success: true, token });
        }  catch (err) {
            res.status(400).json({ message: "Error. Email or password incorrect", success: false, err });
        }
    };

    static logout: RequestHandler = async(req, res) => {
        try {
            res.json({ message: "You are logout", success: true });
        } catch (err) {
            res.status(400).json({ message: "Error. Can you try again", err });
        }
    };

    static register: RequestHandler = async (req, res) =>{
        try {
            const { email, password } = req.body;
            const user: IUserDocument = await UserService.register(email, password, { ...req.body } );

            res.status(201).json({ message: "User is created", success: true, user });
        } catch (err) {
            res.status(400).json({ message: "Error. User is not created", success: false, err });
        }
    };

    static auth: RequestHandler = async (req, res) => {
        try {
            res.json({ message: "You are authenticated", user: req.user, success: true });
        } catch (err) {
            res.status(400).json({ message: "Error. Can you try again", err });
        }
    };

    static getUsers: RequestHandler = async (req, res) => {
        try {
            const users: Array<IUserDocument> = await UserService.getUsers(JSON.parse(req.params.data));

            res.json({ message: "All users", success: true, users });
        } catch (err) {
            res.status(400).json({ message: err.message, success: false });
        }
    };

    static uploadAvatar: RequestHandler = async (req, res) =>  {
        try {
            const avatar = await UserService.uploadAvatar(req.files[req.fieldName][0], req.user.email);

            res.json({ message: "User avatar is uploaded", avatar, success: true });
        } catch (err) {
            res.status(500).json({ message: err.message, success: false });
        }
    }

    static removeUser: RequestHandler = async (req, res) => {
        try {
            const { _id, email } = req.user;
            await UserService.removeUser(_id, email);

            res.json({ message: "Account is deleted", success: true });
        } catch (err) {
            res.status(400).json({ message: err.message, success: false });
        }
    };

    static searchUserByEmail: RequestHandler = async (req, res) => {
        try {
            const user = await UserService.searchUserByEmail(req.body);

            res.json({ message: "User is founded", user, success: true });
        } catch (err) {
            res.status(400).json({ message: err.message, success: false });
        }
    };

    static setUserStatus: RequestHandler = async (req, res) => {
        try {
            const status = await UserService.setUserStatus(req.body.status, req.user._id);

            res.json({ message: "New user status", status, success: true });
        } catch (err) {
            res.status(400).json({ message: err.messsage, success: false });
        }
    };

    static changeUserInfo: RequestHandler = async (req, res) => {
        try {
            const newData = await UserService.changeUserInfo(req.user._id, req.body);

            res.json({ message: "New user info", newData, success: true });
        } catch (err) {
            res.status(400).json({ message: err.messsage, success: false });
        }
    };

    static getUserInfo: RequestHandler = async (req, res) => {
        try {
            const userInfo = await UserService.getUserInfo(req.params.userId);

            res.json({ message: "User info", userInfo, success: true });
        } catch (err) {
            res.status(400).json({ message: err.messsage, success: false });
        }
    };


}

export default UserController;