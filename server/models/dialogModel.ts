import { Schema, model, Types, Model, HookNextFunction } from "mongoose";

import User from "./userModel";
import Message from "./messageModel"
import * as consts from "../assets/constants";
import { IDialogDocument } from "../interfaces/DialogInterface";

const dialogSchema = new Schema({
    author: { type: Types.ObjectId, ref: "User" },
    partner: { type: Types.ObjectId, ref: "User" },
    messages: [{ type: Types.ObjectId, ref: "Message" }],
    lastMessage: {
        message: {
            type: String,
            required: true,
            trim: true,
            default: consts.emptyDialogText
        },
        avatar: {
            type: String,
            default: consts.defaultAvatar
        },
        name: {
            type: String,
            default: consts.adminName
        }
    }
}, {
    timestamps: true
});

dialogSchema.pre<IDialogDocument>("save", async function(next: HookNextFunction) {
    const dialog = this;

    await User.updateMany(
        { _id: { $in: [dialog.author, dialog.partner] } },
        { $push: { dialogs: dialog._id } });

    next();
});

dialogSchema.post("remove", async function(dialog: IDialogDocument) {
    await User.updateMany({}, { $pull: { dialogs: dialog._id } } );
    await Message.deleteMany({ dialog: dialog._id });
});

export default model<IDialogDocument, Model<IDialogDocument>>("Dialog", dialogSchema);