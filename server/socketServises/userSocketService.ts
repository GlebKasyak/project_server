import { Socket, Server } from "socket.io";
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

    socket.on("isOnline", async ({ userId, isOnline }: Data) => {
        await UserService.setOnlineStatus(userId, isOnline);

        socket.emit("isOnline", isOnline);
    });
};

const onDisconnect = (socket: Socket, io: Server) => {
    socket.on("disconnect",  () => {
        io.emit("disconnect");
        socket.disconnect(true);
    });
}


