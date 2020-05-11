import { Router } from "express";

import { auth } from "../middleware";
import DialogController from "../controllers/dialogController";

const router = Router();

router.post("/", auth, DialogController.createDialog);
router.get("/", auth, DialogController.getDialogsById);
router.delete("/:dialogId", auth, DialogController.deleteDialogsById);
router.post("/search", auth, DialogController.searchDialogs);

export default router;

