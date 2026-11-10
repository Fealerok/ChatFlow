import express from "express"
import { createServer } from "http";
import {Server} from "socket.io"

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connect", (socket) => {
    console.log(socket.id);

    socket.on("disconnect", () => {
        console.log(socket.id);
    })

    socket.on("/join-chat", (chatName) => {
        console.log(`Пользователь зашел в чат ${chatName}`);
    });

    socket.on("/disconnect-chat", (chatName) => {
         console.log(`Пользователь вышел в чат ${chatName}`);
    });
})


export {
    app, 
    server
}