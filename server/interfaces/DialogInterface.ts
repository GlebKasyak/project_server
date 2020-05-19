import { Document } from "mongoose";
import { IMessageDocument } from "./MessageInterface";
import { IUserDocument } from "./UserInterface";

export interface IDialogDocument extends Document {
    author: string,
    partner: string | IUserDocument,
    messages: Array<string | IMessageDocument>,
    lastMessage: IMessageDocument
}

export interface IDialogWithPartner extends Omit<IDialogDocument, "partner"> {
    partner: IUserDocument
}

export type MessagesPortionType = {
    dialogId: string,
    limit: number,
    lastMessageId?: string
}