import { Router } from "express";

import { auth, uploadFile } from "../middleware";
import DialogController from "../controllers/dialogController";

const router = Router();

router.post("/", auth, DialogController.createDialog);
router.get("/:data", auth, DialogController.getDialogsById);
router.delete("/:dialogId", auth, DialogController.deleteDialogsById);
router.post("/search", auth, DialogController.searchDialogs);
router.post("/file", auth, uploadFile, DialogController.uploadFileMessage);

export default router;

