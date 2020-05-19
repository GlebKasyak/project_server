import { Socket, Server } from "socket.io";

import { socketEvents } from "../assets/constants";
import { MessagesPortionType } from "../interfaces/DialogInterface";
import { Callback } from "../interfaces";
import { IMessageDocument } from "../interfaces/MessageInterface";
import { DialogService, MessageService } from "../services";

export default (socket: Socket, io: Server) => {
    onJoin(socket);
    getPrevMessages(socket);
    onTyping(socket);
    createNewMessage(socket, io);
    deleteMessage(socket, io);
    editMessage(socket, io);
    readMessages(socket, io);
}

const onJoin = (socket: Socket) => {
    socket.on(socketEvents.join, async (data: MessagesPortionType, callback: Callback<Array<IMessageDocument>>) => {
        const dialog = await DialogService.getDialogWithMessages(data);

        callback(dialog.messages as Array<IMessageDocument>);
        socket.join(data.dialogId);
    });
};

const getPrevMessages = (socket: Socket) => {
    socket.on(socketEvents.prevMsg, async (data: MessagesPortionType, callback: Callback<Array<IMessageDocument>>) => {
        const dialog = await DialogService.getPrevMessages(data);

        callback(dialog.messages as Array<IMessageDocument>);
    });
};

const onTyping = (socket: Socket) => {
    type Data = {
        typingMessage: string,
        isTyping: boolean,
        dialogId: string
    };

    socket.on(socketEvents.typing,  (data: Data) => {
        const { typingMessage, dialogId, isTyping } = data;
        socket.broadcast.to(dialogId).emit(socketEvents.typing, { typingMessage, isTyping });
    });
};

const createNewMessage = (socket: Socket, io: Server) => {
    socket.on(socketEvents.createNewMsg, async (data: IMessageDocument) => {
        const message = await MessageService.createMessage(data);

        io.to(data.dialog).emit(socketEvents.newMsg, message);
    });
};

const deleteMessage = (socket: Socket, io: Server) => {
    type Data = {
        messageId: string,
        dialogId: string
    };

    socket.on(socketEvents.deleteMsg, async ({ messageId, dialogId }: Data) => {
        await MessageService.deleteMessage(messageId);

        io.to(dialogId).emit(socketEvents.deleteMsg, messageId);
    });
};

const editMessage = (socket: Socket, io: Server) => {
    type Data = {
        message: string,
        messageId: string,
        dialog: string
    };

    socket.on(socketEvents.editMsg, async ({ message, messageId, dialog }: Data) => {
        const msg = await MessageService.editMessage(message, messageId);

        io.to(dialog).emit(socketEvents.editMsg, msg);
    });
};

const readMessages = (socket: Socket, io: Server) => {
    type Data = {
        dialogId: string,
        unreadMessageKeys: Array<string>
    }

    socket.on(socketEvents.readMsg, async ({ dialogId, unreadMessageKeys }: Data) => {
        await MessageService.readMessages(unreadMessageKeys);
        io.to(dialogId).emit(socketEvents.readMsg, unreadMessageKeys);
    });
}