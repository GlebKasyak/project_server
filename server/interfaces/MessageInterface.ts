import { Document } from "mongoose";
import { IUserDocument } from "./UserInterface";

export interface IMessageDocument extends Document {
    message: string,
    author: string | IUserDocument,
    dialog: string,
    isChanged: boolean,

    updateDialog(name: string, avatar: string): Promise<void>
}


export interface IMessageWithAuthorData extends Omit<IMessageDocument, "author"> {
    author: IUserDocument
}