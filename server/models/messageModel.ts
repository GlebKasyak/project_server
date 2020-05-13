import { Schema, model, Model, Types } from "mongoose";

import { IMessageDocument, EnumTypeOfMessage } from "../interfaces/MessageInterface";
import Dialog from "./dialogModel";
import User from "./userModel";
import { removeFile } from "../utils/common";

const messageSchema = new Schema({
    message: {
       type: String,
       trim: true,
   },
    author: {
        type: Types.ObjectId,
        ref: "User"
    },
    dialog: {
        type: Types.ObjectId,
        ref: "Dialog"
    },
    isChanged: {
        type: Boolean,
        default: false
    },
    unread: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        default: EnumTypeOfMessage.text
    }
}, {
    timestamps: true
});

messageSchema.methods.updateDialog = async function() {
    const { _id, dialog } = this as IMessageDocument;

    const update = {
        $push: { messages: _id },
        $set: { lastMessage: _id }
    };

    await Dialog.findOneAndUpdate({ _id: dialog }, update);
};

messageSchema.post("remove", async function(message: IMessageDocument) {
    if(message.type === EnumTypeOfMessage.image || EnumTypeOfMessage.audio) removeFile(message.message);

    await Dialog.updateMany({}, { $pull: { messages: message._id } } );
});

export default model<IMessageDocument, Model<IMessageDocument>>("Message", messageSchema);