import { Types } from "mongoose";
import { Dialog } from "../models";
import { ItemsDataType } from "../interfaces";
import { IDialogDocument, IDialogWithPartner, MessagesPortionType } from "../interfaces/DialogInterface";

type CreateDialogDataType = {
    author: string,
    partner: string,
    name: string
}

type SearchDataType = {
    userId: string,
    value: string
}

export default class DialogService {
    static createDialog = async (data: CreateDialogDataType): Promise<IDialogDocument | undefined> => {
        const existingDialog = await Dialog.findOne({ $or: [
            { author: data.author, partner: data.partner },
            { author: data.partner, partner: data.author }]
        });

        if(!existingDialog) { return await Dialog.create(data) };
    };

    static getDialogsById = async (data: ItemsDataType): Promise<Array<IDialogDocument | []>> => {
        const dialogs = await Dialog.find({ $or: [{ author: data.userId }, { partner: data.userId }] })
            .populate("partner", ["firstName", "avatar", "isOnline"])
            .populate("author", ["firstName", "avatar", "isOnline"])
            .populate({ path: "lastMessage", populate: { path: "author", select: ["-dialogs", "-updatedAt"] } })
            .select("-messages")
            .sort({ updatedAt: -1 })
            .skip(Number(data.limit) * (Number(data.page) - 1))
            .limit(Number(data.limit));

        if(!dialogs) { return [] };
        return dialogs;
    };

    static deleteDialogsById = async (dialogId: string) => {
        const dialog = await Dialog.findOneAndRemove({ _id: dialogId });

        if(!dialog) { throw new Error };
        await dialog.remove();
    };

    static getDialogWithMessages = async ({ dialogId, limit }: MessagesPortionType): Promise<IDialogDocument> => {
        const dialog = await Dialog.findById(dialogId)
            .populate({
                path: "messages",
                populate: { path: "author" },
                options: { limit, sort: { createdAt: -1 } }
            });

        if(!dialog) { throw new Error("Dialog is not found") };
        return dialog;
    };

    static getPrevMessages = async ({ dialogId, limit, lastMessageId }: MessagesPortionType): Promise<IDialogDocument> => {
        const dialog = await Dialog.findById(dialogId)
            .populate({
                path: "messages",
                populate: { path: "author" },
                match: { _id: { $lt: lastMessageId } },
                options: { limit, sort: { createdAt: -1 } }
            });

        if(!dialog) { throw new Error("Dialog is not found") };
        return dialog as IDialogDocument;
    };

    static searchDialogs = async (data: SearchDataType): Promise<Array<IDialogWithPartner>> => {
        return await Dialog.aggregate([
            { $match: {
                $or: [
                        { author: new Types.ObjectId(data.userId) },
                        { partner: new Types.ObjectId(data.userId) }
                    ]
            }},
            {
                $lookup: {
                    from: "users",
                    localField: "partner",
                    foreignField: "_id",
                    as: "partner",
                }
            },
            { $unwind: "$partner" },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                }
            },
            { $unwind: "$author" },
            { $match: { $or:
                        [
                            { "partner.firstName": { $regex: data.value, $options: "i" } },
                            { "author.firstName": { $regex: data.value, $options: "i" } }
                        ]
            } },
            {
                $lookup: {
                    from: "messages",
                    localField: "lastMessage",
                    foreignField: "_id",
                    as: "lastMessage",
                }
            },
            { $unwind: {
                    path: "$lastMessage",
                    preserveNullAndEmptyArrays: true
            }},
            {
                $lookup: {
                    from: "users",
                    localField: "lastMessage.author",
                    foreignField: "_id",
                    as: "lastMessage.author",
                }
            },
            { $unwind: {
                    path: "$lastMessage.author",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]) as Array<IDialogWithPartner>;
    };
}

