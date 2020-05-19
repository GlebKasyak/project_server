import { Router } from "express";

import { auth, recaptcha, uploadFile } from "../middleware";
import UserController from "../controllers/userController";

const router = Router();

router.post("/", UserController.register);
router.post("/login", recaptcha, UserController.login);
router.get("/logout", auth, UserController.logout);

router.get("/", auth, UserController.auth);
router.get("/all/:data", auth, UserController.getUsers);
router.delete("/", auth, UserController.removeUser);
router.post("/upload-avatar", auth, uploadFile, UserController.uploadAvatar);
router.post("/search", auth, UserController.searchUserByEmail);
router.post("/user-status", auth, UserController.setUserStatus);
router.post("/new-user-data", auth, UserController.changeUserInfo);
router.get("/user-info/:userId", auth, UserController.getUserInfo);

export default router;

