import { Application } from "express";

import { default as userRouter } from "./user.router";
import { default as dialogRouter } from "./dialog.router";
import { default as friendRouter } from "./friend.router";

export default (app: Application) => {
    app.use("/api/users", userRouter);
    app.use("/api/dialog", dialogRouter);
    app.use("/api/friend", friendRouter);
};
