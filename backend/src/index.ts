import express, {type Request, type Response} from "express"
import router from "./routes/routes.js";
import cors from "cors"

const PORT = 3010;
const app = express();

app.use(cors({
    origin: "*"
}));
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Сервер запущен`);
});