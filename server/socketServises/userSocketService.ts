import { Socket, Server } from "socket.io";

import { Callback } from "../interfaces";
import { socketEvents } from "../assets/constants";
import { UserService } from "./../services";

export default (socket: Socket, io: Server) => {
    onConnect(socket);
    onDisconnect(socket, io);
}

const onConnect = (socket: Socket) => {
    type Data = {
        userId: string,
        isOnline: boolean
    }

    socket.on(socketEvents.isOnline, async ({ userId, isOnline }: Data) => {
        await UserService.setOnlineStatus(userId, isOnline);

        socket.emit(socketEvents.isOnline, isOnline);
    });
};

const onDisconnect = (socket: Socket, io: Server) => {
    socket.on(socketEvents.disconnect,  () => {
        io.emit(socketEvents.disconnect);
        socket.disconnect(true);
    });
}


