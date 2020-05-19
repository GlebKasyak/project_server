import express, { json, Application } from "express";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import socketIo from "socket.io";
import dotenvExtended from "dotenv-extended";


import { socketService } from "./socketServises";

import connectToDb from "./db";
import config from "./config";
import rootRouter from "./routes";


dotenvExtended.load();
connectToDb();

const app: Application = express();
app.use(json());
app.use(cors());

rootRouter(app);

const server = createServer(app);
const io = socketIo(server);
socketService(io);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if(config.IS_PRODUCTION) {
    app.use(express.static(path.join(__dirname, "client", "build")));

    app.get("*", (req: express.Request, res: express.Response) => {
        res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"))
    })
}

server.listen(config.PORT, () => {
    console.log(`Server up on ${ config.PORT }`)
});