import { Schema, model, Model, Types } from "mongoose";

import { IMessageDocument } from "../interfaces/MessageInterface";
import * as consts from "../assets/constants";
import Dialog from "./dialogModel";
import User from "./userModel";

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
    }
}, {
    timestamps: true
});

messageSchema.methods.updateDialog = async function(name: string, avatar: string) {
    const message = this as IMessageDocument;

    const update = {
        $push: { messages: message._id },
        $set: { lastMessage: { message: message.message, name, avatar } }
    };
    await Dialog.updateMany({ _id: message.dialog }, update);
}

messageSchema.post("remove", async function(message: IMessageDocument) {
    await Dialog.updateMany({}, { $pull: { messages: message._id } } );

    const lastMessage = {
        message: consts.emptyDialogText,
        avatar: consts.defaultAvatar,
        name: consts.adminName
    }

    await Dialog.findOneAndUpdate({ _id: message.dialog, messages: [] }, { lastMessage });
});


export default model<IMessageDocument, Model<IMessageDocument>>("Message", messageSchema);