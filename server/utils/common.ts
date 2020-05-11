import fs from "fs";
import rimraf from "rimraf";
import { resolve } from "path";
import { promisify } from "util";

const mkdir = promisify(fs.mkdir);

export const createFolder = async (path: string) => await mkdir(resolve(__dirname, "../", path));

export const removeFolder = async (path: string) => {
    await rimraf(resolve(__dirname, `../${ path }`), () => console.log("remove directory"));
};

export const setFolderPath = (email: string, folder: string): string => `uploads/${ email }/${ folder }/`;