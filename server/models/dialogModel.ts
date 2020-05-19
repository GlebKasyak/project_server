import { Schema, model, Types, Model } from "mongoose";

import User from "./userModel";
import Message from "./messageModel"
import { EnumTypeOfMessage } from "../interfaces/MessageInterface";
import { IDialogDocument } from "../interfaces/DialogInterface";
import { removeFile } from "../utils/common";

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

    const array = await Message.find(
        { dialog: dialog._id, type: { $ne: EnumTypeOfMessage.text } },
        { message: 1, _id: 0 });

    await array.map(doc => removeFile(doc.message));
    await Message.deleteMany({ dialog: dialog._id });
});

export default model<IDialogDocument, Model<IDialogDocument>>("Dialog", dialogSchema);