import { Application } from "express";

import { MainEndPoints } from "../assets/constants/api.constants";
import { default as userRouter } from "./user.router";
import { default as dialogRouter } from "./dialog.router";
import { default as friendRouter } from "./friend.router";

export default (app: Application) => {
    app.use(MainEndPoints.users, userRouter);
    app.use(MainEndPoints.dialog, dialogRouter);
    app.use(MainEndPoints.friend, friendRouter);
};
