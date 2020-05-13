import { Message } from "../models";
import { IMessageDocument, IMessageWithAuthorData } from "../interfaces/MessageInterface";

export default class MessageService {
    static createMessage = async (data: IMessageDocument): Promise<IMessageWithAuthorData> => {
        const message = await Message.create(data);
        if (!message) throw new Error("Error with create message");

        const messageWithAuthorData = await message.populate("author").execPopulate() as IMessageWithAuthorData;
        await message.updateDialog();

        return messageWithAuthorData;
    };

    static deleteMessage = async (messageId: string) => {
        try {
            const message = await Message.findOneAndRemove({ _id: messageId });
            if (!message) throw new Error("Error with delete message");

            await message.remove();
        } catch (err) {
            new Error(err.message);
        }
    };

    static editMessage = async (message: string, messageId: string) => {
        try {
            const msg = await Message.findOneAndUpdate({ _id: messageId }, { message, isChanged: true }, { new: true })
                .populate("author");

            if (!msg) throw new Error("Error with delete message");

            return msg;
        } catch (err) {
            new Error(err.message);
        }
    };

    static readMessages = async (unreadMessageKeys: Array<string>) =>
        await Message.updateMany({ _id: { $in: unreadMessageKeys } }, { unread: false } );
};


