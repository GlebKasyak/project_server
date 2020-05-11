import multer from "multer";
import { Request } from "express";
import path from "path";

import { setFolderPath } from "../utils/common";
import {
    File,
    FileDestinationCallback,
    FileFilterHandler,
    FileNameCallback
} from "../interfaces/MulterInterface";


const storage = multer.diskStorage({
    destination: (req: Request, file: File, cb: FileDestinationCallback) => {
        cb(null, path.resolve(__dirname, "../", setFolderPath(req.user.email, "images") ));
    },
    filename: (req: Request, file: File, cb: FileNameCallback) => {
        cb(null, `${ Date.now() }_${ file.originalname }`);
    }
});


const fileFilter: FileFilterHandler = (req, file, cb)  => {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
    } else {
        cb(new Error("Error! Invalid file type!"));
    }
};

export default multer({ storage, fileFilter, }).single("avatar");