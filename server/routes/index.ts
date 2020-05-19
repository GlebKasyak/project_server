import { Application } from "express";

import { default as userRouter } from "./user.router";
import { default as dialogRouter } from "./dialog.router";

export default (app: Application) => {
    app.use("/api/users", userRouter);
    app.use("/api/dialog", dialogRouter);
};
