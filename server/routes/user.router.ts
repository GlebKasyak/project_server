import { Router } from "express";

import { auth, recaptcha, uploadAvatar } from "../middleware";
import UserController from "../controllers/userController";

const router = Router();

router.post("/", UserController.register);
router.post("/login", recaptcha, UserController.login);
router.get("/logout", auth, UserController.logout);

router.get("/", auth, UserController.auth);
router.get("/all/", auth, UserController.getUsers);
router.delete("/", auth, UserController.removeUser);
router.post("/upload-avatar", auth, uploadAvatar, UserController.uploadAvatar);
router.post("/search", auth, UserController.searchUserByEmail);

export default router;

