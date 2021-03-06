import multer from "multer";
import { Request } from "express";

import { uploadFileToFolder } from "../utils/common";
import {
    File,
    FileDestinationCallback,
    FileFilterHandler,
    FileNameCallback,
    MimeType
} from "../interfaces/MulterInterface";

const storage = multer.diskStorage({
    destination: (req: Request, file: File, cb: FileDestinationCallback) => {
        switch (file.fieldname) {
            case "avatar" :
                cb(null, uploadFileToFolder(req.user.email, "images"));
                break;
            case "image message":
                cb(null, uploadFileToFolder(req.user.email, "message"));
                break;
            case "audio":
                cb(null, uploadFileToFolder(req.user.email, "audio_recordings"));
                break;
        }
    },
    filename: (req: Request, file: File, cb: FileNameCallback) => {
        const ext = MimeType[file.mimetype];
        cb(null, `${ Date.now() }_${ file.originalname }.${ ext }`);
    }
});


const fileFilter: FileFilterHandler = (req, file, cb)  => {
    req.fieldName = file.fieldname;
    if (MimeType[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error("Error! Invalid file type!"));
    }
};

export default multer({ storage, fileFilter, }).fields([
    { name: "avatar", maxCount: 1 },
    { name: "image message", maxCount: 1 },
    { name: "audio", maxCount: 1 }
]);