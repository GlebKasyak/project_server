import fs, { unlink } from "fs";
import path from "path";
import rimraf from "rimraf";
import { resolve } from "path";
import { promisify } from "util";

import { File } from "../interfaces/MulterInterface";

const mkdir = promisify(fs.mkdir);

export const createFolder = async (path: string) => await mkdir(resolve(__dirname, `../${ path }`));

export const removeFolder = async (path: string) => {
    await rimraf(resolve(__dirname, `../${ path }`), () => console.log("remove directory"));
};

export const removeFile = async (path: string) => {
    await unlink(resolve(__dirname, `../${ path }`), () => console.log(`File removed by path ${ path }`));
}

export const setFolderPath = (email: string, folder: string): string => `uploads/${ email }/${ folder }/`;
export const uploadFileToFolder = (email: string, folder: string): string => path.resolve(__dirname, "../", setFolderPath(email, folder));

export const getRelativePathFile = (file: File) => file.path.substring(file.path.indexOf("uploads"));