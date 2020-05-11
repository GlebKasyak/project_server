import { RequestHandler } from "express";

import { UserService } from "../services";
import { ItemsDataType } from "../interfaces";
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
            const users: Array<IUserDocument> = await UserService.getUsers(req.query as ItemsDataType);

            res.json({ message: "All users", success: true, users });
        } catch (err) {
            res.status(400).json({ message: err.message, success: false });
        }
    };

    static uploadAvatar: RequestHandler = async (req, res) =>  {
        try {
            const avatar: string = await UserService.uploadAvatar(req.file, req.user.email);

            res.json({ message: "UserAvatar is uploaded", avatar, success: true });
        } catch (err) {
            res.status(400).json({ message: err.message });
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
}

export default UserController;