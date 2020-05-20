import { RequestHandler } from "express";

import { DialogService } from "../services";
import { getRelativePathFile } from "../utils/common";
import { ErrorHandler } from "../utils/error";

class DialogController {
    static createDialog: RequestHandler = async (req, res, next) => {
        try {
            const dialog = await DialogService.createDialog(req.body);

            res.status(201).json({ message: "create new dialog", success: true, data: dialog });
        }  catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static getDialogsById: RequestHandler = async (req, res, next) => {
        try {
            const dialogs = await DialogService.getDialogsById(JSON.parse(req.params.data));

            res.json({ message: "All dialogs", success: true, data: dialogs });
        }  catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static deleteDialogsById: RequestHandler = async (req, res, next) => {
        try {
            await DialogService.deleteDialogsById(req.params.dialogId);

            res.json({ message: "Dialog is deleted", success: true });
        }  catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static searchDialogs: RequestHandler = async (req, res, next) => {
        try {
            const dialogs = await DialogService.searchDialogs(req.body);

            res.json({ message: "Dialogs founded", data: dialogs, success: true });
        }  catch (err) {
            next(new ErrorHandler(400, err.message));
        }
    };

    static uploadFileMessage: RequestHandler = (req, res, next) => {
        try {
            const url = getRelativePathFile(req.files[req.fieldName][0]);

            res.json({ message: "File saved", data: url, success: true });
        }  catch (err) {
            next(new ErrorHandler(500, err.message));
        }
    };

}

export default DialogController;