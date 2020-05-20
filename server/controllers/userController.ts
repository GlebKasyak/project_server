import { RequestHandler } from "express";

import { UserService } from "../services";
import { IUserDocument } from "../interfaces/UserInterface";
import { ErrorHandler } from "../utils/error";

class UserController {
    static login: RequestHandler = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const token = await UserService.login(email, password);

            res.json({ message: "Token is created", success: true, data: token });
        }  catch (err) {
            next(new ErrorHandler(400, "Error. Email or password incorrect"));
        }
    };

    static logout: RequestHandler = async(req, res, next) => {
        try {
            res.json({ message: "You are logout", success: true });
        } catch (err) {
            next(new ErrorHandler(400, "Error. Can you try again"));
        }
    };

    static register: RequestHandler = async (req, res, next) =>{
        try {
            const { email, password } = req.body;
            const user: IUserDocument = await UserService.register(email, password, { ...req.body } );

            res.status(201).json({ message: "User is created", success: true, data: user });
        } catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static auth: RequestHandler = async (req, res, next) => {
        try {
            res.json({ message: "You are authenticated", data: req.user, success: true });
        } catch (err) {
            next(new ErrorHandler(400, "Error. Can you try again"));
        }
    };

    static getUsers: RequestHandler = async (req, res, next) => {
        try {
            const users: Array<IUserDocument> = await UserService.getUsers(JSON.parse(req.params.data));

            res.json({ message: "All users", success: true, data: users });
        } catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static uploadAvatar: RequestHandler = async (req, res, next) =>  {
        try {
            const avatar = await UserService.uploadAvatar(req.files[req.fieldName][0], req.user.email);

            res.json({ message: "User avatar is uploaded", data: avatar, success: true });
        } catch (err) {
            next(new ErrorHandler(500, err.message));
        }
    }

    static removeUser: RequestHandler = async (req, res, next) => {
        try {
            const { _id, email } = req.user;
            await UserService.removeUser(_id, email);

            res.json({ message: "Account is deleted", success: true });
        } catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static searchUserByEmail: RequestHandler = async (req, res, next) => {
        try {
            const user = await UserService.searchUserByEmail(req.body);

            res.json({ message: "User is founded", data: user, success: true });
        } catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static setUserStatus: RequestHandler = async (req, res, next) => {
        try {
            const status = await UserService.setUserStatus(req.body.status, req.user._id);

            res.json({ message: "New user status", data: status, success: true });
        } catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static changeUserInfo: RequestHandler = async (req, res, next) => {
        try {
            const newData = await UserService.changeUserInfo(req.user._id, req.body);

            res.json({ message: "New user info", data: newData, success: true });
        } catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static getUserInfo: RequestHandler = async (req, res, next) => {
        try {
            const userInfo = await UserService.getUserInfo(req.params.userId);

            res.json({ message: "User info", data: userInfo, success: true });
        } catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };
}

export default UserController;