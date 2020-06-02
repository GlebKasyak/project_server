import { Router } from "express";

import { auth } from "../middleware";
import CommentController from "../controllers/commentController";

const router = Router();

router.post("/", auth, CommentController.postComment);
router.delete("/:commentId", auth, CommentController.deleteComment);

export default router;