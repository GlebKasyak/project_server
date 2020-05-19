import { Schema, model, Types, HookNextFunction } from "mongoose";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

import Dialog from "./dialogModel";
import { urls } from "./../assets/constants";
import Message from "./messageModel";
import { IUserDocument, IUserModel } from "../interfaces/UserInterface";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    secondName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        min: 4,
        trim: true
    },
    avatar: {
        type: String,
        default: urls.defaultAvatar
    },
    dialogs: [{ type: Types.ObjectId, ref: "Dialog" }],
    isOnline: {
        type: Boolean,
        default: false
    },
    status: String

}, {
    timestamps: true
});

userSchema.pre<IUserDocument>("save", async function(next: HookNextFunction): Promise<void> {
    const user = this;

    if(user.isModified("password")) { user.password = await hash(user.password, 15) }
    next();
});


userSchema.post("remove", async function(user: IUserDocument) {
    await Dialog.deleteMany({ _id: { $in: user.dialogs } });
    await Message.deleteMany({ $or: [{ author: user._id }, { partner: user._id }] });
});

userSchema.statics.findByCredentials = async (email: string, password: string): Promise<IUserDocument> => {
    const user = await User.findOne({ email }) as IUserDocument;
    if(!user) throw new Error("Incorrect data during sign in system");

    const isMatch: boolean = await compare(password, user.password);
    if(!isMatch) throw new Error("Password is incorrect, please try again");

    return user;
};

userSchema.methods.generateAuthToken = async function(): Promise<string> {
    const user = this as IUserDocument;
    return sign({ userId: user._id }, "secret");
};


const User: IUserModel = model<IUserDocument, IUserModel>("User", userSchema);
export default User;
