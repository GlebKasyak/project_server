import { Schema, model, Types, Model } from "mongoose";

import User from "./userModel";
import Message from "./messageModel"
import { IDialogDocument } from "../interfaces/DialogInterface";

const dialogSchema = new Schema({
    author: { type: Types.ObjectId, ref: "User" },
    partner: { type: Types.ObjectId, ref: "User" },
    messages: [{ type: Types.ObjectId, ref: "Message" }],
    lastMessage: { type: Types.ObjectId, ref: "Message" }
}, {
    timestamps: true
});


dialogSchema.pre<IDialogDocument>("save", async function(next) {
    const dialog = this;

    await User.updateMany(
        { _id: { $in: [dialog.author, dialog.partner] } },
        { $push: { dialogs: dialog._id } });

    next();
});

dialogSchema.post("remove", async function(dialog: IDialogDocument) {
    await User.updateMany({}, { $pull: { dialogs: dialog._id } } );

    const messages = await Message.find({ dialog: dialog._id });
    messages.length && messages.map(message => message.remove());
});

export default model<IDialogDocument, Model<IDialogDocument>>("Dialog", dialogSchema);