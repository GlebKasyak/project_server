import { RequestHandler } from "express";

import { DialogService } from "../services";
import { getRelativePathFile } from "../utils/common";

class DialogController {
    static createDialog: RequestHandler = async (req, res) => {
        try {
            const dialog = await DialogService.createDialog(req.body);

            res.status(201).json({ message: "create new dialog", success: true, data: dialog });
        }  catch (err) {
            res.status(400).json({ message: err.message, success: false });
        }
    };

    static getDialogsById: RequestHandler = async (req, res) => {
        try {
            const dialogs = await DialogService.getDialogsById(JSON.parse(req.params.data));

            res.json({ message: "All dialogs", success: true, data: dialogs });
        }  catch (err) {
            res.status(400).json({ message: err.message, success: false });
        }
    };

    static deleteDialogsById: RequestHandler = async (req, res) => {
        try {
            await DialogService.deleteDialogsById(req.params.dialogId);

            res.json({ message: "Dialog is deleted", success: true });
        }  catch (err) {
            res.status(400).json({ message: err.message, success: false });
        }
    };

    static searchDialogs: RequestHandler = async (req, res) => {
        try {
            const dialogs = await DialogService.searchDialogs(req.body);

            res.json({ message: "Dialogs founded", data: dialogs, success: true });
        }  catch (err) {
            res.status(400).json({ message: err.message, success: false });
        }
    };

    static uploadFileMessage: RequestHandler = (req, res) => {
        try {
            const url = getRelativePathFile(req.files[req.fieldName][0]);

            res.json({ message: "File saved", data: url, success: true });
        }  catch (err) {
            res.status(500).json({ message: err.message, success: false });
        }
    };

}

export default DialogController;