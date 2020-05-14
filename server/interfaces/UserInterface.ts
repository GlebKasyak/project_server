import { Document, Model } from "mongoose";

export interface IUserDocument extends Document {
    firstName: string,
    secondName: string,
    email: string,
    password: string,
    dialogs: string,
    avatar: string,
    isOnline: boolean,
    status: string

    generateAuthToken(): Promise<string>
}

export type ChangedUserInfoType = Pick<IUserDocument, "firstName" | "secondName">;

export interface IUserModel extends Model<IUserDocument>{
    findByCredentials(email: string, password: string): Promise<IUserDocument>
}

