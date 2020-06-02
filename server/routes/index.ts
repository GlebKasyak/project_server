import { Application } from "express";

import { default as userRouter } from "./user.router";
import { default as dialogRouter } from "./dialog.router";
import { default as friendRouter } from "./friend.router";
import { default as blogRouter } from "./blog.router";
import { default as reactionRouter } from "./reaction.router";
import { default as commentRouter } from "./comment.router";

export default (app: Application) => {
    app.use("/api/users", userRouter);
    app.use("/api/dialog", dialogRouter);
    app.use("/api/friend", friendRouter);
    app.use("/api/blog", blogRouter);
    app.use("/api/reaction", reactionRouter);
    app.use("/api/comment", commentRouter);
};
