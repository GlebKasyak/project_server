import { Request } from "express";

export interface FileFilterCallback {
    (error: Error): void;
    (error: null, acceptFile: boolean): void;
}

export interface FileNameCallback {
    (error: Error | null, filename: string): void
}

export interface FileDestinationCallback {
    (error: Error | null, destination: string): void
}


export interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}

export interface FileFilterHandler {
    (req: Request, file: File, callback: FileFilterCallback): void;
}

export const MimeType: { [key: string]: string } = {
    "image/png": "png",
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "audio/ogg": "ogg",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
} as const;