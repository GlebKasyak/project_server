import { Document } from "mongoose";
import { IUserDocument } from "./UserInterface";

export interface IMessageDocument extends Document {
    message: string,
    author: string | IUserDocument,
    dialog: string,
    isChanged: boolean,
    unread: boolean,
    type: MessageTypes

    updateDialog(): Promise<void>,
}

export enum EnumTypeOfMessage {
    text = "text",
    image = "image",
    audio = "audio"
}

export type MessageTypes = EnumTypeOfMessage.text | EnumTypeOfMessage.image;

export interface IMessageWithAuthorData extends Omit<IMessageDocument, "author"> {
    author: IUserDocument
}