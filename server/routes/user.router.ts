import { Router } from "express";

import { UserEndPoints } from "../assets/constants/api.constants";
import { auth, recaptcha, uploadFile } from "../middleware";
import UserController from "../controllers/userController";

const router = Router();

router.post(UserEndPoints.register, UserController.register);
router.post(UserEndPoints.login, recaptcha, UserController.login);
router.get(UserEndPoints.logout, auth, UserController.logout);

router.get(UserEndPoints.auth, auth, UserController.auth);
router.get(UserEndPoints.getUsers, auth, UserController.getUsers);
router.delete(UserEndPoints.removeUser, auth, UserController.removeUser);
router.post(UserEndPoints.uploadAvatar, auth, uploadFile, UserController.uploadAvatar);
router.post(UserEndPoints.search, auth, UserController.searchUserByEmail);
router.post(UserEndPoints.userStatus, auth, UserController.setUserStatus);
router.post(UserEndPoints.newUserData, auth, UserController.changeUserInfo);
router.get(UserEndPoints.userInfo, auth, UserController.getUserInfo);

export default router;

