import { Server } from "socket.io";

import messageSocketService from "./messageSocketService";
import userSocketService from "./userSocketService";

export default (io: Server) => {
    io.on("connection", socket => {
        try {
            messageSocketService(socket, io);
            userSocketService(socket, io);
        } catch (err) { throw new Error(err) }
    });
}