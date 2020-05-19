import { Router } from "express";

import { FriendEndPoints } from "../assets/constants/api.constants";
import { auth } from "../middleware";
import FriendController from "../controllers/friendController";

const router = Router();

router.get(FriendEndPoints.addNewFriend, auth, FriendController.addNewFriend);
router.get(FriendEndPoints.removeFriend, auth, FriendController.removeFriend);
router.get(FriendEndPoints.getFriends, auth, FriendController.getFriends);
router.post(FriendEndPoints.search, auth, FriendController.searchFriends);

export default router;

