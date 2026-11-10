import 'dotenv/config'; 
import express, {type Request, type Response} from "express"
import router from "./routes/routes.js";
import cors from "cors"
import cookieParser from "cookie-parser"
import { app, server } from './socket-connection/socket.js';

const PORT = 3010;

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json())
app.use("/", router);


server.listen(PORT, () => {
    console.log(`Сервер запущен`);
});