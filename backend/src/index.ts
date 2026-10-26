import express, {type Request, type Response} from "express"
import router from "./routes/routes.js";
import cors from "cors"
import cookieParser from "cookie-parser"

const PORT = 3010;
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json())
app.use("/", router);
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`Сервер запущен`);
});