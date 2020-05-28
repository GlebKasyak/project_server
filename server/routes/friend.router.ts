import { Router } from "express";

import { auth } from "../middleware";
import FriendController from "../controllers/friendController";

const router = Router();

router.get("/new-friend/:userId", auth, FriendController.addNewFriend);
router.get("/remove-friend/:userId", auth, FriendController.removeFriend);
router.get("/friends/:data", auth, FriendController.getFriends);

export default router;

