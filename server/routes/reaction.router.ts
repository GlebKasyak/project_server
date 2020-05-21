import { Router } from "express";

import { auth } from "../middleware";
import ReactionController from "../controllers/reactionController";

const router = Router();

router.post("/", auth, ReactionController.createReaction);
router.delete("/:data", ReactionController.removeReaction);

export default router;