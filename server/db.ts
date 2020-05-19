import { connect, connection, connections } from"mongoose";
import config from "./config";

export default function() {
    connect(config.MONGODB_URL, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).catch((err: Error) => console.log(err));

    connection.on("open", () => {
        const info = connections[0];
        console.log(`Connected to:
         host: ${ info.host },
         port: ${ info.port },
         name: ${ info.name }`
        )
    });
};
