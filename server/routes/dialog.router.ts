import { Router } from "express";

import { DialogEndPoints } from "../assets/constants/api.constants";
import { auth, uploadFile } from "../middleware";
import DialogController from "../controllers/dialogController";

const router = Router();

router.post(DialogEndPoints.create, auth, DialogController.createDialog);
router.get(DialogEndPoints.getDialogs, auth, DialogController.getDialogsById);
router.delete(DialogEndPoints.delete, auth, DialogController.deleteDialogsById);
router.post(DialogEndPoints.search, auth, DialogController.searchDialogs);
router.post(DialogEndPoints.uploadFile, auth, uploadFile, DialogController.uploadFileMessage);

export default router;

